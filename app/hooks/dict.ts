import type { Article, Dict, TaskWords, Word } from '@/types/types.ts'
import { useBaseStore } from '@/stores/base.ts'
import { useSettingStore } from '@/stores/setting.ts'
import { getDefaultDict, getDefaultWord } from '@/types/func.ts'
import { _getDictDataByUrl, cloneDeep, getRandomN, resourceWrap, shuffle, sleep, splitIntoN } from '@/utils'
import { onMounted, ref, watch } from 'vue'
import { AppEnv, DICT_LIST, DictId } from '@/config/env.ts'
import { detail } from '@/apis'
import { useRuntimeStore } from '@/stores/runtime.ts'
import { useRoute, useRouter } from 'vue-router'
import { DictType } from '@/types/enum.ts'

export function useWordOptions() {
  const store = useBaseStore()

  function isWordCollect(val: Word) {
    return !!store.collectWord.words.find(v => v.word.toLowerCase() === val.word.toLowerCase())
  }

  function toggleWordCollect(val: Word) {
    let rIndex = store.collectWord.words.findIndex(v => v.word.toLowerCase() === val.word.toLowerCase())
    if (rIndex > -1) {
      store.collectWord.words.splice(rIndex, 1)
    } else {
      store.collectWord.words.push(val)
    }
    store.collectWord.length = store.collectWord.words.length
  }

  function isWordSimple(val: Word) {
    return !!store.knownWords.includes(val.word.toLowerCase())
  }

  function toggleWordSimple(val: Word) {
    let rIndex = store.knownWords.findIndex(v => v === val.word.toLowerCase())
    if (rIndex > -1) {
      store.known.words.splice(rIndex, 1)
    } else {
      store.known.words.push(val)
    }
    store.known.length = store.known.words.length
  }

  function delWrongWord(val: Word) {
    let rIndex = store.wrong.words.findIndex(v => v.word.toLowerCase() === val.word.toLowerCase())
    if (rIndex > -1) {
      store.wrong.words.splice(rIndex, 1)
    }
    store.wrong.length = store.wrong.words.length
  }

  function delSimpleWord(val: Word) {
    let rIndex = store.known.words.findIndex(v => v.word.toLowerCase() === val.word.toLowerCase())
    if (rIndex > -1) {
      store.known.words.splice(rIndex, 1)
    }
    store.known.length = store.known.words.length
  }

  return {
    isWordCollect,
    toggleWordCollect,
    isWordSimple,
    toggleWordSimple,
    delWrongWord,
    delSimpleWord,
  }
}

export function useArticleOptions() {
  const store = useBaseStore()

  function isArticleCollect(val: Article) {
    return !!store.collectArticle?.articles?.find(v => v.id === val.id)
  }

  // todo 這裡先收藏，再修改。收藏裡面的未同步。單字也是一樣的
  function toggleArticleCollect(val: Article) {
    let rIndex = store.collectArticle.articles.findIndex(v => v.id === val.id)
    if (rIndex > -1) {
      store.collectArticle.articles.splice(rIndex, 1)
    } else {
      store.collectArticle.articles.push(val)
    }
    store.collectArticle.length = store.collectArticle.articles.length
  }

  return {
    isArticleCollect,
    toggleArticleCollect,
  }
}

export function getCurrentStudyWord(): TaskWords {
  const store = useBaseStore()
  let data = { new: [], review: [], write: [], shuffle: [] }
  let dict = store.sdict
  let isTest = false
  let words = dict.words.slice()
  if (isTest) {
    words = Array.from({ length: 10 }).map((v, i) => {
      return getDefaultWord({ word: String(i) })
    })
  }
  if (words?.length) {
    const settingStore = useSettingStore()
    // 忽略時是否加上自訂的簡單字
    let ignoreList = [store.allIgnoreWords, store.knownWords][settingStore.ignoreSimpleWord ? 0 : 1]
    const perDay = dict.perDayStudyNumber
    let start = dict.lastLearnIndex
    let complete = dict.complete
    let isEnd = start >= dict.length - 1
    if (isTest) {
      start = 1
      complete = true
    }
    // 如果已完成，並且記錄在最後，那麼直接隨機取複習字
    if (complete && isEnd) {
      // 複習比最小是1
      let ratio = settingStore.wordReviewRatio || 1
      let ignoreList = [store.allIgnoreWords, store.knownWords][settingStore.ignoreSimpleWord ? 0 : 1]
      // 先將可用詞表全部隨機，再按需過濾忽略列表，只取到目標數量為止
      let shuffled = shuffle(cloneDeep(dict.words))
      let count = 0
      data.write = []
      for (let item of shuffled) {
        if (!ignoreList.includes(item.word.toLowerCase())) {
          data.write.push(item)
          count++
          if (count >= perDay * ratio) {
            break
          }
        }
      }
      return data
    }

    let end = start
    let list = dict.words.slice(start)
    // 從start往後取perDay個單字，作為目前練習單字
    for (let item of list) {
      if (!ignoreList.includes(item.word.toLowerCase())) {
        if (data.new.length < perDay) {
          data.new.push(item)
        } else break
      }
      end++
    }

    // 如果複習比大於等於1，或者已完成，那麼就取複習字
    if (settingStore.wordReviewRatio >= 1 || complete) {
      // 從start往前取perDay個單字，作為目前複習單字，取到0為止
      list = dict.words.slice(0, start).reverse()
      // 但如果已完成，則滾動取值
      if (complete) list = list.concat(dict.words.slice(end).reverse())
      for (let item of list) {
        if (!ignoreList.includes(item.word.toLowerCase())) {
          if (data.review.length < perDay) {
            data.review.push(item)
          } else break
        }
        start--
      }
    }

    // //如果是自由模式，那么统统设置到new字段里面去
    // if (settingStore.wordPracticeMode === WordPracticeMode.Free) {
    //   data.new = data.new.length ? data.new : data.review
    //   data.review = []
    //   return data
    // }

    // 上上次更早的單字
    // 預設只取start之前的單字
    if (settingStore.wordReviewRatio >= 2) {
      let candidateWords = dict.words.slice(0, start).reverse()
      // 但如果已完成，則滾動取值
      if (complete) candidateWords = candidateWords.concat(dict.words.slice(end).reverse())
      candidateWords = candidateWords.filter(w => !ignoreList.includes(w.word.toLowerCase()))
      // console.log(candidateWords.map(v => v.word))
      // 最終要取得的單字數量
      const totalNeed = perDay * (settingStore.wordReviewRatio - 1)
      if (candidateWords.length <= totalNeed) {
        data.write = candidateWords
      } else {
        // write陣列放的是上上次之前的單字，總的數量為perDayStudyNumber * 3，取單字的規則為：從後往前取6個perDayStudyNumber的，越靠前的取的單字越多。
        let days = 6
        // 分6组，每组最多 perDay 个
        const groups: Word[][] = splitIntoN(candidateWords.slice(0, days * perDay), 6)
        // console.log('groups', groups)

        // 分配數量，靠前組多，靠後組少，例如分配比例 [6,5,4,3,2,1]
        const ratio = Array.from({ length: days }, (_, i) => i + 1).reverse()
        const ratioSum = ratio.reduce((a, b) => a + b, 0)
        const realRatio = ratio.map(r => Math.round((r / ratioSum) * totalNeed))
        // console.log(ratio, ratioSum, realRatio, realRatio.reduce((a, b) => a + b, 0))

        // 按比例從每組隨機取單字
        let writeWords: Word[] = []
        groups.map((v, i) => {
          writeWords = writeWords.concat(getRandomN(v, realRatio[i]))
        })
        // console.log('writeWords', writeWords)
        data.write = writeWords
      }
    }

    // 如果已完成，那麼合併寫詞和複習詞
    if (complete) {
      // data.new = []
      // data.review = data.review.concat(data.write)
      // data.write = []
    }
  }
  // console.log('data-new', data.new.map(v => v.word))
  // console.log('data-review', data.review.map(v => v.word))
  // console.log('data-write', data.write.map(v => v.word))
  return data
}

export function useGetDict() {
  const store = useBaseStore()
  const runtimeStore = useRuntimeStore()
  let waiting = $ref(false)
  let fetching = $ref(false)
  const route = useRoute()
  const router = useRouter()

  watch(
    [() => store.load, () => waiting],
    ([a, b]) => {
      if (a && b) {
        loadDict()
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    // console.log('onMounted')
    if (route.query?.isAdd) {
      runtimeStore.editDict = getDefaultDict()
    } else {
      if (!runtimeStore.editDict?.id) {
        let dictId = route.params?.id
        if (!dictId) {
          return router.push('/articles')
        }
        waiting = true
      } else {
        loadDict(runtimeStore.editDict)
      }
    }
  })

  async function loadDict(dict?: Dict) {
    if (!dict) {
      dict = getDefaultDict()
      let dictId = route.params.id
      // 先在自己的詞典列表裡面找，如果沒有再在資源列表裡面找
      dict = store.article.bookList.find(v => v.id === dictId)
      let r = await fetch(resourceWrap(DICT_LIST.ARTICLE.ALL))
      let dict_list = await r.json()
      if (!dict) dict = dict_list.flat().find(v => v.id === dictId) as Dict
    }
    if (dict && dict.id) {
      if (
        !dict?.articles?.length &&
        !dict?.custom &&
        ![DictId.articleCollect].includes(dict.en_name || dict.id) &&
        !dict?.is_default
      ) {
        fetching = true
        let r = await _getDictDataByUrl(dict, DictType.article)
        runtimeStore.editDict = r
      }
      if (store.article.bookList.find(book => book.id === runtimeStore.editDict.id)) {
        if (AppEnv.CAN_REQUEST) {
          let res = await detail({ id: runtimeStore.editDict.id })
          if (res.success) {
            runtimeStore.editDict.statistics = res.data.statistics
            if (res.data.articles.length) {
              runtimeStore.editDict.articles = res.data.articles
            }
          }
        }
      }
    } else {
      router.push('/articles')
    }

    waiting = false
    fetching = false
  }

  const loading = computed(() => waiting || fetching)

  return { loading }
}
