import { offset } from '@floating-ui/dom'
import { ShortcutKey, WordPracticeMode, WordPracticeStage } from '@/types/enum'

export const GITHUB = 'https://github.com/zyronon/TypeWords'
export const Host = 'typewords.cc'
export const EMAIL = 'zyronon@163.com'
export const Origin = `https://${Host}`
export const APP_NAME = 'Type Words'

const common = {
  word_dict_list_version: 1,
}
const map = {
  DEV: {
    API: 'http://localhost/',
    // Use local dicts folder
    RESOURCE_URL: '/',
  },
}

export const ENV = Object.assign(map['DEV'], common)

export let AppEnv = {
  // TOKEN: localStorage.getItem('token') ?? '',
  TOKEN: '',
  IS_OFFICIAL: false,
  IS_LOGIN: false,
  CAN_REQUEST: false,
}

if (import.meta.client) {
  AppEnv.TOKEN = localStorage.getItem('token') ?? ''
}

AppEnv.IS_LOGIN = !!AppEnv.TOKEN
AppEnv.CAN_REQUEST = AppEnv.IS_LOGIN && AppEnv.IS_OFFICIAL
// AppEnv.IS_OFFICIAL = true
// AppEnv.CAN_REQUEST = true
// console.log('AppEnv.CAN_REQUEST',AppEnv.CAN_REQUEST)

export const RESOURCE_PATH = ENV.API + 'static'

export const DICT_LIST = {
  WORD: {
    ALL: `/list/word.json`,
    RECOMMENDED: `/list/recommend_word.json`,
  },
  ARTICLE: {
    ALL: `/list/article.json`,
    RECOMMENDED: `/list/recommend_article.json`,
  },
}

export const SoundFileOptions = [
  { value: '機械鍵盤', label: '機械鍵盤' },
  { value: '機械鍵盤1', label: '機械鍵盤1' },
  { value: '機械鍵盤2', label: '機械鍵盤2' },
  { value: '老式機械鍵盤', label: '老式機械鍵盤' },
  { value: '筆記本鍵盤', label: '筆記本鍵盤' },
]
export const APP_VERSION = {
  key: 'type-words-app-version',
  version: 2,
}
export const SAVE_DICT_KEY = {
  key: 'typing-word-dict',
  version: 4,
}
export const SAVE_SETTING_KEY = {
  key: 'typing-word-setting',
  version: 17,
}
export const EXPORT_DATA_KEY = {
  key: 'typing-word-export',
  version: 4,
}
export const LOCAL_FILE_KEY = 'typing-word-files'

export const TourConfig = {
  useModalOverlay: true,
  defaultStepOptions: {
    canClickTarget: false,
    classes: 'shadow-md bg-purple-dark',
    cancelIcon: { enabled: true },
    modalOverlayOpeningPadding: 10,
    modalOverlayOpeningRadius: 6,
    floatingUIOptions: {
      middleware: [offset({ mainAxis: 30 })],
    },
  },
  total: 7,
}

export const IS_DEV = import.meta.env.MODE === 'development'
export const LIB_JS_URL = {
  SHEPHERD: `${ENV.RESOURCE_URL}libs/Shepherd.14.5.1.mjs.js`,
  SNAPDOM: `${ENV.RESOURCE_URL}libs/snapdom.min.js`,
  JSZIP: `${ENV.RESOURCE_URL}libs/jszip.min.js`,
  XLSX: `${ENV.RESOURCE_URL}libs/xlsx.full.min.js`,
}
export const PronunciationApi = 'https://dict.youdao.com/dictvoice?audio='
export const DefaultShortcutKeyMap = {
  [ShortcutKey.EditArticle]: 'Ctrl+E',
  [ShortcutKey.ShowWord]: 'Escape',
  [ShortcutKey.Previous]: 'Alt+⬅',
  [ShortcutKey.Next]: 'Tab',
  [ShortcutKey.ToggleSimple]: '`',
  [ShortcutKey.ToggleCollect]: 'Enter',
  [ShortcutKey.PreviousChapter]: 'Ctrl+⬅',
  [ShortcutKey.NextChapter]: 'Ctrl+➡',
  [ShortcutKey.RepeatChapter]: 'Ctrl+Enter',
  [ShortcutKey.DictationChapter]: 'Alt+Enter',
  [ShortcutKey.PlayWordPronunciation]: 'Ctrl+P',
  [ShortcutKey.ToggleShowTranslate]: 'Ctrl+Z',
  [ShortcutKey.ToggleDictation]: 'Ctrl+I',
  [ShortcutKey.ToggleTheme]: 'Ctrl+Q',
  [ShortcutKey.ToggleConciseMode]: 'Ctrl+M',
  [ShortcutKey.TogglePanel]: 'Ctrl+L',
  [ShortcutKey.RandomWrite]: 'Ctrl+R',
  [ShortcutKey.KnowWord]: '1',
  [ShortcutKey.UnknownWord]: '2',
}
export const SlideType = {
  HORIZONTAL: 0,
  VERTICAL: 1,
}
export const WordPracticeModeStageMap: Record<WordPracticeMode, WordPracticeStage[]> = {
  [WordPracticeMode.Free]: [WordPracticeStage.FollowWriteNewWord, WordPracticeStage.Complete],
  [WordPracticeMode.IdentifyOnly]: [
    WordPracticeStage.IdentifyNewWord,
    WordPracticeStage.IdentifyReview,
    WordPracticeStage.IdentifyReviewAll,
    WordPracticeStage.Complete,
  ],
  [WordPracticeMode.DictationOnly]: [
    WordPracticeStage.DictationNewWord,
    WordPracticeStage.DictationReview,
    WordPracticeStage.DictationReviewAll,
    WordPracticeStage.Complete,
  ],
  [WordPracticeMode.ListenOnly]: [
    WordPracticeStage.ListenNewWord,
    WordPracticeStage.ListenReview,
    WordPracticeStage.ListenReviewAll,
    WordPracticeStage.Complete,
  ],
  [WordPracticeMode.System]: [
    WordPracticeStage.FollowWriteNewWord,
    WordPracticeStage.ListenNewWord,
    WordPracticeStage.DictationNewWord,
    WordPracticeStage.IdentifyReview,
    WordPracticeStage.ListenReview,
    WordPracticeStage.DictationReview,
    WordPracticeStage.IdentifyReviewAll,
    WordPracticeStage.ListenReviewAll,
    WordPracticeStage.DictationReviewAll,
    WordPracticeStage.Complete,
  ],
  [WordPracticeMode.Shuffle]: [WordPracticeStage.Shuffle, WordPracticeStage.Complete],
  [WordPracticeMode.Review]: [
    WordPracticeStage.IdentifyReview,
    WordPracticeStage.ListenReview,
    WordPracticeStage.DictationReview,
    WordPracticeStage.IdentifyReviewAll,
    WordPracticeStage.ListenReviewAll,
    WordPracticeStage.DictationReviewAll,
    WordPracticeStage.Complete,
  ],
}
export const WordPracticeStageNameMap: Record<WordPracticeStage, string> = {
  [WordPracticeStage.FollowWriteNewWord]: '跟寫新詞',
  [WordPracticeStage.IdentifyNewWord]: '自測新詞',
  [WordPracticeStage.ListenNewWord]: '聽寫新詞',
  [WordPracticeStage.DictationNewWord]: '默寫新詞',
  [WordPracticeStage.FollowWriteReview]: '跟寫上次學習',
  [WordPracticeStage.IdentifyReview]: '自測上次學習',
  [WordPracticeStage.ListenReview]: '聽寫上次學習',
  [WordPracticeStage.DictationReview]: '默寫上次學習',
  [WordPracticeStage.FollowWriteReviewAll]: '跟寫之前學習',
  [WordPracticeStage.IdentifyReviewAll]: '自測之前學習',
  [WordPracticeStage.ListenReviewAll]: '聽寫之前學習',
  [WordPracticeStage.DictationReviewAll]: '默寫之前學習',
  [WordPracticeStage.Complete]: '完成學習',
  [WordPracticeStage.Shuffle]: '隨機複習',
}
export const WordPracticeModeNameMap: Record<WordPracticeMode, string> = {
  [WordPracticeMode.System]: '學習',
  [WordPracticeMode.Free]: '自由練習',
  [WordPracticeMode.IdentifyOnly]: '自測',
  [WordPracticeMode.DictationOnly]: '默寫',
  [WordPracticeMode.ListenOnly]: '聽寫',
  [WordPracticeMode.Shuffle]: '隨機複習',
  [WordPracticeMode.Review]: '複習',
}
export class DictId {
  static wordCollect = 'wordCollect'
  static wordWrong = 'wordWrong'
  static wordKnown = 'wordKnown'
  static articleCollect = 'articleCollect'
}
