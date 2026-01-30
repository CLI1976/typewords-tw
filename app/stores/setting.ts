import { defineStore } from 'pinia'
import { checkAndUpgradeSaveSetting, cloneDeep } from '@/utils'
import { get } from 'idb-keyval'
import { AppEnv, DefaultShortcutKeyMap, SAVE_SETTING_KEY } from '@/config/env'
import { getSetting } from '@/apis'
import { WordPracticeMode, WordPracticeType } from '@/types/enum'

export interface SettingState {
    soundType: string

    wordSound: boolean
    wordSoundVolume: number
    wordSoundSpeed: number
    wordReviewRatio: number // 單字複習比例

    articleSound: boolean
    articleAutoPlayNext: boolean
    articleSoundVolume: number
    articleSoundSpeed: number

    keyboardSound: boolean
    keyboardSoundVolume: number
    keyboardSoundFile: string

    effectSound: boolean
    effectSoundVolume: number

    repeatCount: number // 重複次數
    repeatCustomCount?: number // 自訂重複次數
    dictation: boolean // 顯示默寫
    translate: boolean // 顯示翻譯
    showNearWord: boolean // 顯示上/下一個詞
    ignoreCase: boolean // 忽略大小寫
    allowWordTip: boolean // 默寫時是否允許查看提示
    waitTimeForChangeWord: number // 切下一個詞的等待時間
    fontSize: {
        articleForeignFontSize: number
        articleTranslateFontSize: number
        wordForeignFontSize: number
        wordTranslateFontSize: number
    }
    showToolbar: boolean // 收起/展開工具列
    showPanel: boolean // 收起/展開面板
    sideExpand: boolean // 收起/展開左側側邊欄
    theme: string
    shortcutKeyMap: Record<string, string>
    first: boolean
    firstTime: number
    load: boolean
    conflictNotice: boolean // 其他腳本/外掛衝突提示
    ignoreSimpleWord: boolean // 忽略簡單字
    wordPracticeMode: WordPracticeMode // 單字練習模式
    wordPracticeType: WordPracticeType // 單字練習類型
    disableShowPracticeSettingDialog: boolean // 不預設顯示練習設定彈窗
    autoNextWord: boolean // 自動切換下一個單字
    inputWrongClear: boolean // 單字輸入錯誤，清空已輸入內容
    mobileNavCollapsed: boolean // 行動端底部導航列收縮狀態
    ignoreSymbol: boolean // 過濾符號
}

export const getDefaultSettingState = (): SettingState => ({
    soundType: 'us',

    wordSound: true,
    wordSoundVolume: 100,
    wordSoundSpeed: 1,
    wordReviewRatio: 4,

    articleSound: true,
    articleAutoPlayNext: false,
    articleSoundVolume: 100,
    articleSoundSpeed: 1,

    keyboardSound: true,
    keyboardSoundVolume: 100,
    keyboardSoundFile: '筆記本鍵盤',

    effectSound: true,
    effectSoundVolume: 100,

    repeatCount: 1,
    repeatCustomCount: null,
    dictation: false,
    translate: true,
    showNearWord: true,
    ignoreCase: true,
    allowWordTip: true,
    waitTimeForChangeWord: 300,
    fontSize: {
        articleForeignFontSize: 48,
        articleTranslateFontSize: 20,
        wordForeignFontSize: 48,
        wordTranslateFontSize: 20,
    },
    showToolbar: true,
    showPanel: true,
    sideExpand: false,
    theme: 'auto',
    shortcutKeyMap: cloneDeep(DefaultShortcutKeyMap),
    first: true,
    firstTime: Date.now(),
    load: false,
    conflictNotice: true,
    ignoreSimpleWord: false,
    wordPracticeMode: WordPracticeMode.System,
    wordPracticeType: WordPracticeType.FollowWrite,
    disableShowPracticeSettingDialog: false,
    autoNextWord: true,
    inputWrongClear: false,
    mobileNavCollapsed: false,
    ignoreSymbol: true,
})

export const useSettingStore = defineStore('setting', {
    state: (): SettingState => {
        return getDefaultSettingState()
    },
    actions: {
        setState(obj: any) {
            this.$patch(obj)
        },
        init() {
            return new Promise(async resolve => {
                let configStr = await get(SAVE_SETTING_KEY.key)
                let data = checkAndUpgradeSaveSetting(configStr)
                if (AppEnv.CAN_REQUEST) {
                    let res = await getSetting()
                    if (res.success) {
                        Object.assign(data, res.data)
                    }
                }
                this.setState({ ...data, load: true })
                resolve(true)
            })
        },
    },
})
