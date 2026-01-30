import { DictType, PracticeArticleWordType } from '@/types/enum'

export type Word = {
  id?: string
  custom?: boolean
  word: string
  phonetic0: string
  phonetic1: string
  trans: {
    pos: string
    cn: string
  }[]
  sentences: {
    c: string //content
    cn: string
  }[]
  phrases: {
    c: string
    cn: string
  }[]
  synos: {
    pos: string
    cn: string
    ws: string[]
  }[]
  relWords: {
    root: string
    rels: {
      pos: string
      words: {
        c: string
        cn: string
      }[]
    }[]
  }
  etymology: {
    t: string //title
    d: string //desc
  }[]
}

export type TranslateLanguageType = 'en' | 'zh-CN' | 'ja' | 'de' | 'common' | ''
export type LanguageType = 'en' | 'ja' | 'de' | 'code'

export interface ArticleWord extends Word {
  nextSpace: boolean
  symbolPosition: 'start' | 'end' | ''
  input: string
  type: PracticeArticleWordType
}

export interface Sentence {
  text: string
  translate: string
  words: ArticleWord[]
  audioPosition: number[]
}

export interface Article {
  id?: number | string
  title: string
  titleTranslate: string
  text: string
  textTranslate: string
  newWords: Word[]
  sections: Sentence[][]
  audioSrc: string
  audioFileId: string
  lrcPosition: number[][]
  nameList: string[]
  questions: {
    stem: string
    options: string[]
    correctAnswer: string[]
    explanation: string
  }[]
  quote?: {
    start: number
    text: string
    translate: string
    end: number
  }
  question?: {
    start: number
    text: string
    translate: string
    end: number
  }
}

export interface Statistics {
  startDate: number // 開始日期
  spend: number // 花費時間
  total: number // 單字數量
  new: number // 新學單字數量
  review: number // 複習單字數量
  wrong: number // 錯誤數
  title: string // 文章標題
}

export type DictResource = {
  id: string
  name: string
  description: string
  url: string
  length: number
  category: string
  tags: string[]
  translateLanguage: TranslateLanguageType
  // todo 可以考慮刪除了
  type?: DictType
  version?: number
  language: LanguageType
}

export interface Dict extends DictResource {
  lastLearnIndex: number
  perDayStudyNumber: number
  words: Word[]
  articles: Article[]
  statistics: Statistics[]
  custom: boolean // 是否是自訂詞典
  complete: boolean // 是否學習完成，學完了設為true，然後lastLearnIndex重置
  // 後端欄位
  en_name?: string
  createdBy?: string
  category_id?: number
  is_default?: boolean
  update?: boolean
  cover?: string
  sync?: boolean
  userDictId?: number
}

export interface ArticleItem {
  item: Article
  index: number
}

export interface PracticeData {
  index: number
  words: Word[]
  wrongWords: Word[]
  excludeWords: string[]
  isTypingWrongWord: boolean
}

export interface TaskWords {
  new: Word[]
  review: Word[]
  write: Word[]
  shuffle: Word[]
}
