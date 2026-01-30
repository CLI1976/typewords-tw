// 郵箱驗證
import {EMAIL_CONFIG, PASSWORD_CONFIG, PHONE_CONFIG} from "@/config/auth.ts";

export const validateEmail = (email: string): boolean => {
  return EMAIL_CONFIG.emailRegex.test(email)
}
// 手機號驗證（中國大陸）
export const validatePhone = (phone: string): boolean => {
  return PHONE_CONFIG.phoneRegex.test(phone)
}

export const codeRules = [
  {required: true, message: '請輸入驗證碼', trigger: 'blur'},
  {min: PHONE_CONFIG.codeLength, message: `請輸入 ${PHONE_CONFIG.codeLength} 位驗證碼`, trigger: 'blur'},
]
export const accountRules = [
  {required: true, message: '請輸入手機號/電子郵件地址', trigger: 'blur'},
  {
    validator: (rule: any, value: any) => {
      if (!validatePhone(value) && !validateEmail(value)) {
        throw new Error('請輸入有效的手機號或電子郵件地址')
      }
    }, trigger: 'blur'
  },
]
export const emailRules = [
  {required: true, message: '請輸入電子郵件地址', trigger: 'blur'},
  {
    validator: (rule: any, value: any) => {
      if (!validateEmail(value)) {
        throw new Error('請輸入有效的電子郵件地址')
      }
    }, trigger: 'blur'
  },
]
export const phoneRules = [
  {required: true, message: '請輸入手機號', trigger: 'blur'},
  {
    validator: (rule: any, value: any) => {
      if (!validatePhone(value)) {
        throw new Error('請輸入有效的手機號')
      }
    }, trigger: 'blur'
  },
]
export const passwordRules = [
  {required: true, message: '請輸入密碼', trigger: 'blur'},
  {
    min: PASSWORD_CONFIG.minLength,
    max: PASSWORD_CONFIG.maxLength,
    message: `密碼長度為 ${PASSWORD_CONFIG.minLength}-${PASSWORD_CONFIG.maxLength} 位`,
    trigger: 'blur'
  },
]
