<script setup lang="tsx">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { APP_NAME } from '@/config/env.ts'
import { useUserStore } from '@/stores/user.ts'
import { loginApi, LoginParams, registerApi, resetPasswordApi } from '@/apis/user.ts'
import { accountRules, codeRules, passwordRules, phoneRules } from '@/utils/validation.ts'
import Toast from '@/components/base/toast/Toast.ts'
import FormItem from '@/components/base/form/FormItem.vue'
import Form from '@/components/base/form/Form.vue'
import Notice from '@/components/user/Notice.vue'
import { FormInstance } from '@/components/base/form/types.ts'
import { PASSWORD_CONFIG, PHONE_CONFIG } from '@/config/auth.ts'
import Code from '@/components/user/Code.vue'
import { jump2Feedback, sleep, useNav } from '@/utils'
import Header from '@/components/Header.vue'
import PopConfirm from '@/components/PopConfirm.vue'
import { useExport } from '@/hooks/export.ts'
import { getProgress, uploadImportData } from '@/apis'
import { CodeType, ImportStatus } from '@/types/enum.ts'

// 狀態管理
const userStore = useUserStore()
const route = useRoute()
const router = useNav()

// 頁面狀態
let currentMode = $ref<'login' | 'register' | 'forgot'>('login')
let loginType = $ref<'code' | 'password'>('code') // 預設驗證碼登入
let loading = $ref(false)
let showWechatQR = $ref(true)
let wechatQRUrl = $ref('https://open.weixin.qq.com/connect/qrcode/041GmMJM2wfM0w3D')
// 微信二維碼狀態：idle-正常/等待掃碼，scanned-已掃碼待確認，expired-已過期，cancelled-已取消
let qrStatus = $ref<'idle' | 'scanned' | 'expired' | 'cancelled'>('idle')
let qrExpireTimer: ReturnType<typeof setTimeout> | null = null
let qrCheckInterval: ReturnType<typeof setInterval> | null = null
let waitForImportConfirmation = $ref(true)

const QR_EXPIRE_TIME = 5 * 60 * 1000 // 5分鐘過期

let phoneLoginForm = $ref({ phone: '', code: '' })
let phoneLoginFormRef = $ref<FormInstance>()
let phoneLoginFormRules = {
  phone: phoneRules,
  code: codeRules,
}

let loginForm2 = $ref({ account: '', password: '' })
let loginForm2Ref = $ref<FormInstance>()
let loginForm2Rules = {
  account: accountRules,
  password: passwordRules,
}

const registerForm = $ref({
  account: '',
  password: '',
  confirmPassword: '',
  code: '',
})
let registerFormRef = $ref<FormInstance>()
// 登入檔單規則和引用
let registerFormRules = {
  account: accountRules,
  code: codeRules,
  password: passwordRules,
  confirmPassword: [
    { required: true, message: '請再次輸入密碼', trigger: 'blur' },
    {
      validator: (rule: any, value: any) => {
        if (value !== registerForm.password) {
          throw new Error('兩次密碼輸入不一致')
        }
      },
      trigger: 'blur',
    },
  ],
}

const forgotForm = $ref({
  account: '',
  code: '',
  newPassword: '',
  confirmPassword: '',
})
let forgotFormRef = $ref<FormInstance>()
// 忘記密碼錶單規則和引用
let forgotFormRules = {
  account: accountRules,
  code: codeRules,
  newPassword: passwordRules,
  confirmPassword: [
    { required: true, message: '請再次輸入新密碼', trigger: 'blur' },
    {
      validator: (rule: any, value: any) => {
        if (value !== forgotForm.newPassword) {
          throw new Error('兩次密碼輸入不一致')
        }
      },
      trigger: 'blur',
    },
  ],
}

const currentFormRef = $computed<FormInstance>(() => {
  if (currentMode === 'login') {
    if (loginType == 'code') return phoneLoginFormRef
    else return loginForm2Ref
  } else if (currentMode === 'register') return registerFormRef
  else return forgotFormRef
})

function loginSuccess(token: string) {
  // userStore.setToken(token)
  waitForImportConfirmation = true
}

// 統一登入處理
async function handleLogin() {
  currentFormRef.validate(async valid => {
    if (!valid) return
    try {
      loading = true
      let data = {}
      //手機號登入
      if (loginType === 'code') {
        data = { ...phoneLoginForm, type: 'code' }
      } else {
        //密碼登入
        data = { ...loginForm2, type: 'pwd' }
      }
      let res = await loginApi(data as LoginParams)
      if (res.success) {
        loginSuccess(res.data.token)
      } else {
        Toast.error(res.msg || '登入失敗')
        if (res.code === 499) {
          loginType = 'code'
        }
      }
    } catch (error) {
      Toast.error('登入失敗，請重試')
    } finally {
      loading = false
    }
  })
}

// 註冊
async function handleRegister() {
  registerFormRef.validate(async valid => {
    if (!valid) return
    try {
      loading = true
      let res = await registerApi(registerForm)
      if (res.success) {
        Toast.success('註冊成功')
        await sleep(1500)
        loginSuccess(res.data.token)
      } else {
        Toast.error(res.msg || '註冊失敗')
      }
    } catch (error) {
      Toast.error('註冊失敗，請重試')
    } finally {
      loading = false
    }
  })
}

// 忘記密碼
async function handleForgotPassword() {
  forgotFormRef.validate(async valid => {
    if (!valid) return
    try {
      loading = true
      const res = await resetPasswordApi(forgotForm)
      if (res.success) {
        Toast.success('密碼重置成功，請重新登入')
        switchMode('login')
      } else {
        Toast.error(res.msg || '重置失敗')
      }
    } catch (error) {
      Toast.error(error || '重置密碼失敗，請重試')
    } finally {
      loading = false
    }
  })
}

// 清除二維碼相關定時器
function clearQRTimers() {
  if (qrExpireTimer) {
    clearTimeout(qrExpireTimer)
    qrExpireTimer = null
  }
  if (qrCheckInterval) {
    clearInterval(qrCheckInterval)
    qrCheckInterval = null
  }
}

// 重新整理二維碼
async function refreshQRCode() {
  clearQRTimers()
  qrStatus = 'idle'
  await handleWechatLogin()
}

// 微信登入 - 顯示二維碼
async function handleWechatLogin() {
  try {
    showWechatQR = true
    qrStatus = 'idle'

    // 這裡應該呼叫後端獲取二維碼
    // const response = await getWechatQR()
    // wechatQRUrl = response.qrUrl

    // 暫時使用佔位二維碼
    wechatQRUrl =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSI+55So5o6l566h55CG6L295Lit6K+B77yBPC90ZXh0Pgo8L3N2Zz4K'

    // 模擬輪詢檢查掃碼狀態
    qrCheckInterval = setInterval(async () => {
      // 這裡應該輪詢後端檢查掃碼狀態
      // const result = await checkWechatLoginStatus()
      // if (result.scanned) qrStatus = 'scanned'
      // if (result.success) {
      //   clearQRTimers()
      //   showWechatQR = false
      //   qrStatus = 'idle'
      //   // 登入成功處理
      // }
    }, 2000)

    // 設定二維碼過期
    qrExpireTimer = setTimeout(() => {
      qrStatus = 'expired'
      clearInterval(qrCheckInterval!)
      qrCheckInterval = null
      Toast.info('二維碼已過期，請點選重新整理')
    }, QR_EXPIRE_TIME)
  } catch (error) {
    console.error('Wechat login error:', error)
    Toast.error('微信登入失敗')
  }
}

// 切換模式
function switchMode(mode: 'login' | 'register' | 'forgot') {
  currentMode = mode
  // 切換到註冊或忘記密碼模式時，隱藏微信掃碼
  if (mode === 'register' || mode === 'forgot') {
    if (showWechatQR) {
      clearQRTimers()
      showWechatQR = false
      qrStatus = 'idle'
    }
  }
}

// 使用者主動取消登入（示例：可在需要的地方呼叫）
function cancelWechatLogin() {
  qrStatus = 'cancelled'
  qrStatus = 'cancelled'
  qrStatus = 'cancelled'
}

// 初始化頁面
onMounted(() => {
  // console.log('route.query', route.query)
  if (route.query?.register) {
    currentMode = 'register'
  }
})

// 元件解除安裝時清理定時器
onBeforeUnmount(() => {
  clearQRTimers()
  clearInterval(timer)
})

enum ImportStep {
  CONFIRMATION, //等待確認
  PROCESSING, //處理中
  SUCCESS, //成功
  FAIL, //失敗
}

const { exportData } = useExport()
let importStep = $ref<ImportStep>(ImportStep.CONFIRMATION)
let isImporting = $ref(false)
let reason = $ref('')
let timer = $ref(-1)
let requestCount = $ref(0)

async function startSync() {
  importStep = ImportStep.PROCESSING
  return
  if (importStep === ImportStep.PROCESSING) return
  try {
    importStep = ImportStep.PROCESSING
    reason = '匯出資料中'
    let res = await exportData('')
    reason = '上傳資料中'
    let formData = new FormData()
    formData.append('file', res, 'example.zip')
    let result = await uploadImportData(formData, progressEvent => {
      let percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      reason = `上傳進度(${percent}%)`
    })
    if (result.success) {
      reason = `上傳完成; 正在解析中`
      clearInterval(timer)
      timer = setInterval(async () => {
        let r = await getProgress()
        if (r.success) {
          if (r.data.status === ImportStatus.Success) {
            reason = '同步完成'
            clearInterval(timer)
            importStep = ImportStep.SUCCESS
          } else if (r.data.status === ImportStatus.Fail) {
            throw new Error('同步失敗，請聯絡管理員')
          } else {
            reason = r.data.reason
            if (requestCount > 15) {
              throw new Error('同步失敗，請聯絡管理員')
            }
            if (reason === '解析檔案中') {
              requestCount++
            }
          }
        } else {
          throw new Error('無同步記錄')
        }
      }, 2000)
    } else {
      throw new Error(`同步失敗，${result.msg ? '原因: ' + result.msg : ''}，請聯絡管理員`)
    }
  } catch (error) {
    Toast.error(error.message || '同步失敗')
    reason = error.message || '同步失敗'
    clearInterval(timer)
    importStep = ImportStep.FAIL
  }
}

function logout() {
  waitForImportConfirmation = false
}

function forgetData() {}

function goHome() {}
</script>

<template>
  <div class="center min-h-screen">
    <div class="card-white p-2" v-if="!waitForImportConfirmation">
      <!-- 登入區域容器 - 彈框形式 -->
      <div class="flex gap-2">
        <!-- 左側登入區域 -->
        <div class="flex-1 w-80 p-3">
          <!-- 登入選項 -->
          <div v-if="currentMode === 'login'">
            <div class="mb-6 text-center text-2xl font-bold">{{ APP_NAME }}</div>

            <!-- Tab切換 -->
            <div class="center gap-8 mb-6">
              <div
                class="center cp transition-colors"
                :class="loginType === 'code' ? 'link font-medium' : 'text-gray-600'"
                @click="loginType = 'code'"
              >
                <div>
                  <span>{{ $t('code_login') }}</span>
                  <div v-opacity="loginType === 'code'" class="mt-1 h-0.5 bg-blue-600"></div>
                </div>
              </div>
              <div
                class="center cp transition-colors"
                :class="loginType === 'password' ? 'link font-medium' : 'text-gray-600'"
                @click="loginType = 'password'"
              >
                <div>
                  <span>{{ $t('password_login') }}</span>
                  <div v-opacity="loginType === 'password'" class="mt-1 h-0.5 bg-blue-600"></div>
                </div>
              </div>
            </div>

            <!-- 驗證碼登入表單 -->
            <Form
              v-if="loginType === 'code'"
              ref="phoneLoginFormRef"
              :rules="phoneLoginFormRules"
              :model="phoneLoginForm"
            >
              <FormItem prop="phone">
                <BaseInput
                  v-model="phoneLoginForm.phone"
                  type="tel"
                  name="username"
                  autocomplete="tel"
                  size="large"
                  :placeholder="$t('phone_placeholder')"
                />
              </FormItem>
              <FormItem prop="code">
                <div class="flex gap-2">
                  <BaseInput
                    v-model="phoneLoginForm.code"
                    type="code"
                    size="large"
                    :max-length="PHONE_CONFIG.codeLength"
                    :placeholder="$t('code_placeholder')"
                  />
                  <Code
                    :validate-field="() => phoneLoginFormRef.validateField('phone')"
                    :type="CodeType.Login"
                    :val="phoneLoginForm.phone"
                  />
                </div>
              </FormItem>
            </Form>

            <!-- 密碼登入表單 -->
            <Form v-else ref="loginForm2Ref" :rules="loginForm2Rules" :model="loginForm2">
              <FormItem prop="account">
                <BaseInput
                  v-model="loginForm2.account"
                  type="email"
                  name="username"
                  autocomplete="email"
                  size="large"
                  :placeholder="$t('account_placeholder')"
                />
              </FormItem>
              <FormItem prop="password">
                <div class="flex gap-2">
                  <BaseInput
                    v-model="loginForm2.password"
                    type="password"
                    name="password"
                    autocomplete="current-password"
                    size="large"
                    :placeholder="$t('password_placeholder')"
                  />
                </div>
              </FormItem>
            </Form>

            <Notice>
              <span v-if="loginType === 'code'">，{{ $t('auto_register_notice') }}</span>
            </Notice>

            <BaseButton class="w-full" size="large" :loading="loading" @click="handleLogin"> {{ $t('login') }} </BaseButton>

            <!-- 底部操作連結 - 只在密碼登入時顯示 -->
            <div class="mt-4 flex justify-between text-sm" v-opacity="loginType !== 'code'">
              <div class="link cp" @click="switchMode('forgot')">{{ $t('forgot_password') }}</div>
              <div class="link cp" @click="switchMode('register')">{{ $t('register_account') }}</div>
            </div>
          </div>

          <!-- 註冊模式 -->
          <div v-else-if="currentMode === 'register'">
            <Header @click="switchMode('login')" :title="$t('register_new_account')" />

            <Form ref="registerFormRef" :rules="registerFormRules" :model="registerForm">
              <FormItem prop="account">
                <BaseInput
                  v-model="registerForm.account"
                  type="tel"
                  name="username"
                  autocomplete="username"
                  size="large"
                  :placeholder="$t('account_placeholder')"
                />
              </FormItem>
              <FormItem prop="code">
                <div class="flex gap-2">
                  <BaseInput
                    v-model="registerForm.code"
                    type="code"
                    size="large"
                    :placeholder="$t('code_placeholder')"
                    :max-length="PHONE_CONFIG.codeLength"
                  />
                  <Code
                    :validate-field="() => registerFormRef.validateField('account')"
                    :type="CodeType.Register"
                    :val="registerForm.account"
                  />
                </div>
              </FormItem>
              <FormItem prop="password">
                <BaseInput
                  v-model="registerForm.password"
                  type="password"
                  name="password"
                  autocomplete="current-password"
                  size="large"
                  :placeholder="`請設定密碼（${PASSWORD_CONFIG.minLength}-${PASSWORD_CONFIG.maxLength} 位）`"
                />
              </FormItem>
              <FormItem prop="confirmPassword">
                <BaseInput
                  v-model="registerForm.confirmPassword"
                  type="password"
                  name="password"
                  autocomplete="new-password"
                  size="large"
                  :placeholder="$t('confirm_password_placeholder')"
                />
              </FormItem>
            </Form>

            <Notice />

            <BaseButton class="w-full" size="large" :loading="loading" @click="handleRegister"> {{ $t('register') }} </BaseButton>
          </div>

          <!-- 忘記密碼模式 -->
          <div v-else-if="currentMode === 'forgot'">
            <Header @click="switchMode('login')" :title="$t('reset_password')" />

            <Form ref="forgotFormRef" :rules="forgotFormRules" :model="forgotForm">
              <FormItem prop="account">
                <BaseInput
                  v-model="forgotForm.account"
                  type="tel"
                  name="username"
                  autocomplete="username"
                  size="large"
                  :placeholder="$t('account_placeholder')"
                />
              </FormItem>
              <FormItem prop="code">
                <div class="flex gap-2">
                  <BaseInput
                    v-model="forgotForm.code"
                    type="code"
                    size="large"
                    :placeholder="$t('code_placeholder')"
                    :max-length="PHONE_CONFIG.codeLength"
                  />
                  <Code
                    :validate-field="() => forgotFormRef.validateField('account')"
                    :type="CodeType.ResetPwd"
                    :val="forgotForm.account"
                  />
                </div>
              </FormItem>
              <FormItem prop="newPassword">
                <BaseInput
                  v-model="forgotForm.newPassword"
                  type="password"
                  name="password"
                  autocomplete="new-password"
                  size="large"
                  :placeholder="`請輸入新密碼（${PASSWORD_CONFIG.minLength}-${PASSWORD_CONFIG.maxLength} 位）`"
                />
              </FormItem>
              <FormItem prop="confirmPassword">
                <BaseInput
                  v-model="forgotForm.confirmPassword"
                  type="password"
                  name="password"
                  autocomplete="new-password"
                  size="large"
                  :placeholder="$t('confirm_new_password')"
                />
              </FormItem>
            </Form>

            <BaseButton class="w-full mt-2" size="large" :loading="loading" @click="handleForgotPassword">
              {{ $t('reset_password') }}
            </BaseButton>
          </div>
        </div>

        <!-- 右側微信二維碼 - 只在登入模式時顯示 -->
        <div v-if="currentMode === 'login'" class="center flex-col bg-gray-100 rounded-xl px-12">
          <div class="relative w-40 h-40 bg-white rounded-xl overflow-hidden shadow-xl">
            <NuxtImg
              v-if="showWechatQR"
              :src="wechatQRUrl"
              alt="微信登入二維碼"
              class="w-full h-full"
              :class="{ 'opacity-30': qrStatus === 'expired' }"
            />
            <!-- 掃描成功蒙層 -->
            <div
              v-if="qrStatus === 'scanned'"
              class="absolute left-0 top-0 w-full h-full center flex-col gap-space bg-white"
            >
              <IconFluentCheckmarkCircle20Filled class="color-green text-4xl" />
              <div class="text-base text-gray-700 font-medium">{{ $t('scan_success') }}</div>
              <div class="text-xs text-gray-600">{{ $t('tap_allow_in_wechat') }}</div>
            </div>
            <!-- 取消登入蒙層 -->
            <div
              v-if="qrStatus === 'cancelled'"
              class="absolute left-0 top-0 w-full h-full center flex-col gap-space bg-white"
            >
              <IconFluentErrorCircle20Regular class="color-red text-4xl" />
              <div class="text-base text-gray-700 font-medium">{{ $t('login_cancelled') }}</div>
              <div class="text-xs text-gray-600">
                你可<span class="color-link" @click="refreshQRCode">{{ $t('login_again') }}</span>，或關閉視窗
              </div>
            </div>
            <!-- 過期蒙層 -->
            <div
              v-if="qrStatus === 'expired'"
              class="absolute top-0 left-0 right-0 bottom-0 bg-opacity-95 center backdrop-blur-sm"
            >
              <IconFluentArrowClockwise20Regular @click="refreshQRCode" class="cp text-4xl" />
            </div>
          </div>
          <p class="mt-4 center gap-space">
            <IconIxWechatLogo class="text-xl color-green" />
            <span class="text-sm text-gray-600">{{ $t('wechat_scan_login') }}</span>
          </p>
        </div>
      </div>
    </div>

    <div v-else class="card-white p-6 w-100">
      <Header @click="logout" :title="$t('sync_data')"></Header>
      <div class="flex flex-col justify-between h-60">
        <template v-if="importStep === ImportStep.CONFIRMATION">
          <div>
            <h2>{{ $t('local_data_detected') }}</h2>
            <h3>{{ $t('sync_to_account_question') }}</h3>
          </div>
          <div class="flex gap-space justify-end">
            <template v-if="importStep === ImportStep.CONFIRMATION">
              <PopConfirm
                :title="[
                  { text: '您的使用者資料將以壓縮包自動下載到您的電腦中，以便您隨時恢復', type: 'normal' },
                  { text: '隨後網站的使用者資料將被刪除', type: 'redBold' },
                  { text: '是否確認繼續？', type: 'normal' },
                ]"
                @confirm="forgetData"
              >
                <BaseButton type="info">{{ $t('no_sync') }}</BaseButton>
              </PopConfirm>
            </template>
            <BaseButton @click="startSync">{{ $t('sync') }}</BaseButton>
          </div>
        </template>
        <template v-if="importStep === ImportStep.PROCESSING">
          <div>
            <div class="title text-align-center">{{ $t('syncing') }}</div>
            <ol class="pl-4">
              <li>您的使用者資料已自動下載到您的電腦中，以便隨時恢復</li>
              <li>隨後將開始資料同步</li>
              <li>如果您的資料量很大，這將是一個耗時操作</li>
              <li class="color-red-5 font-bold">請耐心等待，請勿關閉此頁面</li>
            </ol>
            <div class="flex items-center justify-between gap-2 mt-10">
              <span>當前進度: {{ reason }}</span>
              <IconEosIconsLoading class="text-xl" />
            </div>
          </div>
        </template>
        <template v-if="importStep === ImportStep.FAIL">
          <div>
            <div class="title text-align-center">{{ $t('sync_failed') }}</div>
            <div class="mt-10">
              <span>{{ reason }}</span>
            </div>
          </div>
          <div class="flex justify-end">
            <BaseButton type="info" @click="jump2Feedback">{{ $t('feedback') }}</BaseButton>
            <BaseButton @click="goHome">{{ $t('enter_website') }}</BaseButton>
          </div>
        </template>
        <template v-if="importStep === ImportStep.SUCCESS">
          <div>
            <div class="title text-align-center">{{ $t('sync_success') }}</div>
            <div class="mt-10">
              <span>稍後將自動進入網站...</span>
            </div>
          </div>
          <div class="flex justify-end">
            <BaseButton @click="goHome">{{ $t('enter_website') }}</BaseButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

