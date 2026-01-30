<script setup lang="ts">
import { computed, ref } from 'vue'
import BasePage from '@/components/BasePage.vue'
import BaseButton from '@/components/BaseButton.vue'
import ResourceCard from '@/components/ResourceCard.vue'
import { APP_NAME, Origin } from '~/config/env.ts'

let route = useRoute()
let title = APP_NAME + ' 英語學習資源分享'
useSeoMeta({
  title: title,
  description: title,
  ogTitle: title,
  ogDescription: title,
  ogUrl: Origin + route.fullPath,
  twitterTitle: title,
  twitterDescription: title,
})

// 型別定義
interface Resource {
  name: string
  description?: string
  difficulty?: string
  link: string
  author?: string
  features?: string
  suitable?: string
}

interface Subcategory {
  name: string
  description?: string
  resources: Resource[]
}

interface Category {
  id: string
  name: string
  icon?: string
  description?: string
  resources?: Resource[]
  subcategories?: Subcategory[]
}

// 資源分類
const categories = ref<Category[]>([
  {
    id: 'new-concept',
    name: '新概念英語',
    description: '經典英語教材，適合系統學習',
    resources: [
      {
        name: '新概念資源合集',
        description: '',
        difficulty: '包含後面所有的內容',
        link: 'https://pan.quark.cn/s/6b12da160020',
      },
      {
        name: '新概念英語第一冊',
        description: '適合英語初學者',
        difficulty: '入門',
        link: 'https://pan.quark.cn/s/0d2ece46983f',
      },
      {
        name: '新概念英語第二冊',
        description: '基礎英語學習，鞏固語法和詞彙',
        difficulty: '基礎',
        link: 'https://pan.quark.cn/s/df29bb396728',
      },
      {
        name: '新概念英語第三冊',
        description: '提高英語水平，增強閱讀能力',
        difficulty: '進階',
        link: 'https://pan.quark.cn/s/ec39dc7cbe5b',
      },
      {
        name: '新概念英語第四冊',
        description: '高階英語學習，提升綜合能力',
        difficulty: '高階',
        link: 'https://pan.quark.cn/s/207a2cc8a320',
      },
      {
        name: '新概念英青少年版',
        description: '兒童讀物',
        difficulty: '7歲至14歲',
        link: 'https://pan.quark.cn/s/4628b00b39c0',
      },
      {
        name: '新概念英語1-4 教材高畫質 PDF',
        description: '僅 1-4 冊的教材高畫質掃描版 PDF',
        difficulty: '',
        link: 'https://pan.quark.cn/s/f1e7739ed806',
      },
      {
        name: '新概念講解影片',
        description: '多家機構/個人的講解影片',
        difficulty: '',
        link: 'https://pan.quark.cn/s/07e25ee6de9f',
      },
    ],
  },
  {
    id: 'exam',
    name: '電視/電影',
    description: '一些不錯的美/英劇，可練聽力和口語',
    resources: [
      {
        name: '電視/電影資源合集',
        difficulty: '包含後面所有的內容',
        link: 'https://pan.quark.cn/s/84ecb30b700b', //159
        // link: 'https://pan.quark.cn/s/e9b62b79c48c',
      },
      {
        name: '老友記',
        description: '',
        difficulty: '喜劇/愛情',
        link: 'https://pan.quark.cn/s/c17770edfa15',
      },
      {
        name: '生活大爆炸',
        description: '',
        difficulty: '喜劇/愛情',
        link: 'https://pan.quark.cn/s/3e66da8ce1c4',
      },
      {
        name: '是大臣/是首相',
        description: '',
        difficulty: '喜劇/諷刺',
        link: 'https://pan.quark.cn/s/2c62ce3e220d',
      },
      {
        name: '破產姐妹',
        description: '',
        difficulty: '喜劇',
        link: 'https://pan.quark.cn/s/018600971998',
      },
      {
        name: '絕望主婦',
        description: '',
        difficulty: '懸疑',
        link: 'https://pan.quark.cn/s/1c67ae200c2e',
      },
      {
        name: '紙牌屋',
        description: '',
        difficulty: '紙牌屋',
        link: 'https://pan.quark.cn/s/5ba146c46180',
      },
    ],
  },
  {
    id: 'grammar',
    name: '語法學習',
    description: '',
    subcategories: [
      {
        name: '經典教材',
        description: '',
        resources: [
          {
            name: '英語語法新思維',
            author: '張滿勝',
            features: '從思維角度講解語法，注重理解而非死記硬背，分為初級、中級、高階三冊，循序漸進',
            suitable: '希望系統建立語法體系的學習者',
            difficulty: '',
            link: 'https://pan.quark.cn/s/d06abef6c737',
          },
          {
            name: '薄冰英語語法',
            author: '薄冰',
            features: '老牌經典,體系完整,分類非常細,查語法點方便',
            suitable: '中學生或基礎較弱的學習者',
            difficulty: '',
            link: 'https://pan.quark.cn/s/30777ceba5b9',
          },
          // {
          //   name: '實用英語語法',
          //   author: '張道真',
          //   features: '國內經典語法教材，內容詳實全面，例句豐富，適合作為工具書查閱',
          //   suitable: '需要權威參考書的學生或教師',
          //   difficulty: '',
          //   link: 'https://pan.baidu.com/s/xxx',
          // },
          {
            name: '旋元估文法',
            author: '旋元估',
            features: '以通俗易懂的語言解析複雜語法，強調“理解邏輯”，適合突破語法難點',
            suitable: '對傳統語法教學感到枯燥，想輕鬆掌握核心邏輯的學習者',
            difficulty: '繁體中文版',
            link: 'https://pan.quark.cn/s/0d0de559794e',
          },
        ],
      },
      {
        name: '進階提升',
        description: '',
        resources: [
          {
            name: '劍橋英語語法(English Grammar in Use)',
            author: '劍橋大學出版',
            features: '分為初級、中級、高階三冊，經典暢銷語法自學書，解釋簡明且有大量練習',
            suitable: '需要結合國際考試的學習者',
            description: '',
            difficulty: '中文版',
            link: 'https://pan.quark.cn/s/d4a6ef53c04d',
          },
          {
            name: 'Oxford English Grammar(牛津英語語法)',
            author: 'Sidney Greenbaum & Gerald Nelson',
            features: '分為基礎、提升、高階三冊，英式語法權威，解釋清晰、例句地道，適合備考雅思/託福',
            suitable: '想全面系統梳理語法體系的人',
            difficulty: '英文版',
            link: 'https://pan.quark.cn/s/ca505875e68c',
          },
          {
            name: '實用英語用法(Practical English Usage)',
            author: 'Michael Swan',
            features: '解釋非常細緻，尤其適合糾正常見錯誤和困惑',
            suitable: '中高階學習者，適合作為語法問題的工具書',
            difficulty: '中文版/英文版',
            link: 'https://pan.quark.cn/s/05006e705a77',
          },
        ],
      },
    ],
  },
  {
    id: 'listening',
    name: '聽力訓練',
    description: '提升英語聽力水平',
    resources: [
      {
        name: 'VOA慢速英語合集',
        description: '新聞類聽力材料，語速適中，內容豐富',
        difficulty: '初級',
        link: 'https://pan.quark.cn/s/681794bffc6e',
      },
      // {
      //   name: 'BBC Learning English',
      //   description: 'BBC官方英語學習資源，涵蓋多方面內容',
      //   difficulty: '中高階',
      //   link: 'https://pan.baidu.com/s/xxx',
      // },
      {
        name: 'TED-ED 科普動畫',
        description: 'TED-Ed 是一個專為初高中生所設計的在3到5分鐘長的科普動畫課程',
        difficulty: '初級',
        link: 'https://pan.quark.cn/s/d3d83038afb9',
      },
      {
        name: '哈弗演講',
        description: '高質量演講，鍛鍊聽力同時開拓視野',
        difficulty: '中高階',
        link: 'https://pan.quark.cn/s/62e8d536a34f',
      },
    ],
  },
])

// 當前選中的分類
const selectedCategory = ref('all')

// 篩選後的資源
const filteredResources = computed(() => {
  if (selectedCategory.value === 'all') {
    return categories.value
  }
  return categories.value.filter(cat => cat.id === selectedCategory.value)
})

// 跳轉到網盤連結
const openLink = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <BasePage>
    <div class="flex flex-col items-center justify-center px-4 py-8">
      <!-- 頁面標題 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ $t('resource_sharing') }}</h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          以下是整理的一些英語學習資源，希望對大家有所幫助！
        </p>
      </div>

      <!-- 分類篩選 -->
      <div class="card-white flex flex-wrap justify-center gap-2 mb-8 p-4">
        <BaseButton :type="selectedCategory === 'all' ? 'primary' : 'info'" @click="selectedCategory = 'all'">
          {{ $t('all_resources') }}
        </BaseButton>
        <BaseButton
          v-for="category in categories"
          :key="category.id"
          :type="selectedCategory === category.id ? 'primary' : 'info'"
          @click="selectedCategory = category.id"
        >
          {{ category.name }}
        </BaseButton>
      </div>

      <!-- 資源列表 -->
      <div class="w-full">
        <div v-for="category in filteredResources" :key="category.id" class="mb-12">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold mb-2">{{ category.icon }} {{ category.name }}</h2>
            <p v-if="category.description" class="text-gray-600 dark:text-gray-300">
              {{ category.description }}
            </p>
          </div>

          <!-- 如果有子分類，顯示子分類 -->
          <template v-if="category.subcategories">
            <div v-for="subcategory in category.subcategories" :key="subcategory.name" class="mb-10">
              <div class="text-center mb-4">
                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                  {{ subcategory.name }}
                </h3>
                <p v-if="subcategory.description" class="text-gray-600 dark:text-gray-300">
                  {{ subcategory.description }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <ResourceCard
                  v-for="resource in subcategory.resources"
                  :key="resource.name"
                  :resource="resource"
                  @openLink="openLink"
                />
              </div>
            </div>
          </template>

          <!-- 如果沒有子分類，直接顯示資源 -->
          <template v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <ResourceCard
                v-for="resource in category.resources"
                :key="resource.name"
                :resource="resource"
                @openLink="openLink"
              />
            </div>
          </template>
        </div>
      </div>

      <!-- 頁面底部 -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div class="card-white">
          <div class="text-xl font-bold mb-4">溫馨提示</div>
          <ul class="space-y-2 text-gray-600 dark:text-gray-300">
            <li>所有資源均來自網際網路收集，僅供學習交流使用</li>
            <li>
              如果連結失效，請及時<a :href="`https://v.wjx.cn/vm/ev0W7fv.aspx#`" target="_blank">告知</a>，我會盡快更新
            </li>
          </ul>
        </div>
      </div>
    </div>
  </BasePage>
</template>
