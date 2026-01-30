// https://nuxt.com/docs/api/configuration/nuxt-config
//@ts-ignore
import { resolve } from 'pathe'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { execSync } from 'child_process'
import { defineNuxtConfig } from 'nuxt/config'

let latestCommitHash = ''
try {
  latestCommitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch (e) {
  latestCommitHash = 'unknown'
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    // keepalive: true,
    head: {
      title: 'Type Words 官網 - 詞文記 | 單字跟打 · 文章跟打', // default fallback title
      htmlAttrs: {
        lang: 'zh-TW',
      },
      meta: [
        { charset: 'UTF-8' },
        //百度站長HTML標籤驗證
        { name: 'baidu-site-verification', content: 'codeva-NoSMtV313P' },
        //搜尋引擎描述
        {
          name: 'description',
          content:
            'Type Words 官方網站 - 線上英語練習平台，支援單字、文章跟打練習，提升英語學習效率。Practice English, one strike, one step forward',
        },
        //關鍵字（可選，搜尋引擎基本不用，但能補充資訊）
        {
          name: 'keywords',
          content:
            'Type Words, Typing Word, Type Words 官網, 官方網站, 英語打字練習, 單字跟打, 文章跟打, 鍵盤練習, 英語學習, 文章學習, 打字練習軟體, 單字記憶工具, 英語學習軟體, 背單字神器, 英語肌肉記憶, 鍵盤工作者, 免費英語學習, 音標發音, 默寫練習, 線上學英語, CET-4, CET-6, TOEFL, IELTS, GRE, GMAT, SAT, 考研英語, 專四專八, 程式設計師英語, JavaScript API, Node.js API, Java API, Linux命令, 程式詞彙, 技術英語, VSCode插件, 開源專案, GitHub趨勢榜, 英語打字訓練, WPM統計, 準確率分析, 商務英語, BEC, 雅思聽力, 日語學習, 多語言學習, 英語口說練習, 單字拼寫訓練',
        },
        { name: 'author', content: 'zyronon' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },

        //Open Graph（用於社群媒體分享，Facebook/Line 等）
        { property: 'og:title', content: 'Type Words 官網 - 英語打字練習平台' },
        {
          property: 'og:description',
          content:
            'Type Words 官方網站 - 線上英語練習平台，支援單字、文章跟打練習，提升英語學習效率。Practice English, one strike, one step forward',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://typewords.cc/' },
        { property: 'og:image', content: 'https://typewords.cc/favicon.ico' },

        // Twitter Card（用於 Twitter 分享）
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Type Words 官網 - 英語打字練習平台' },
        {
          name: 'twitter:description',
          content:
            'Type Words 官方網站 - 線上英語練習平台，支援單字、文章跟打練習，提升英語學習效率。Practice English, one strike, one step forward',
        },
        { name: 'twitter:image', content: 'https://typewords.cc/favicon.ico' },

        //設定瀏覽器網址列顏色（在 Android Chrome 特別明顯
        { name: 'theme-color', content: '#818CF8' },
        // 阻止 iOS 自動把數字識別為電話號碼
        // HandheldFriendly 和 MobileOptimized 是舊手機瀏覽器的優化提示（現在作用不大）。
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'HandheldFriendly', content: 'True' },
        { name: 'MobileOptimized', content: '320' },
        // referrer 控制請求來源資訊
        { name: 'referrer', content: 'origin-when-cross-origin' },
        // color-scheme 告訴瀏覽器支援亮/暗模式
        { name: 'color-scheme', content: 'light dark' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://typewords.cc/' },
        // 蘋果裝置（iOS Safari）在使用者添加到主畫面時顯示的圖示
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.json' },
      ],
    },
  },
  routeRules: {
    '/words': { ssr: false },
    '/articles': { ssr: false },
    '/setting': { ssr: false },
    '/book/nce1': { prerender: true },
    '/book/nce2': { prerender: true },
    '/book/nce3': { prerender: true },
    '/book/nce4': { prerender: true },
  },
  vite: {
    plugins: [
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
          }),
        ],
      }),
      Icons({
        autoInstall: true,
      }),
    ],
  },
  // 模組
  modules: ['@pinia/nuxt', '@unocss/nuxt', 'unplugin-icons/nuxt', '@vue-macros/nuxt', '@nuxtjs/i18n', '@nuxt/image'],
  // i18n 設定
  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'zh', language: 'zh-CN', file: 'zh.json', name: '中文' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' },
      { code: 'fr', language: 'fr-FR', file: 'fr.json', name: 'Français' },
      { code: 'pt', language: 'pt-BR', file: 'pt.json', name: 'Português' },
      { code: 'de', language: 'de-DE', file: 'de.json', name: 'Deutsch' },
      { code: 'ru', language: 'ru-RU', file: 'ru.json', name: 'Русский' },
      { code: 'uk', language: 'uk-UA', file: 'uk.json', name: 'Українська' },
      { code: 'ja', language: 'ja-JP', file: 'ja.json', name: '日本語' },
      { code: 'ko', language: 'ko-KR', file: 'ko.json', name: '한국어' },
      { code: 'th', language: 'th-TH', file: 'th.json', name: 'ไทย' },
      { code: 'vi', language: 'vi-VN', file: 'vi.json', name: 'Tiếng Việt' },
      { code: 'id', language: 'id-ID', file: 'id.json', name: 'Bahasa Indonesia' },
      { code: 'tw', language: 'zh-TW', file: 'tw.json', name: '繁體中文' },
    ],
    defaultLocale: 'zh',
    // langDir:'app/i18n/',
    strategy: 'no_prefix',
  },
  // CSS
  css: ['~/assets/css/main.scss'],
  // 别名配置
  alias: {
    '@': resolve(__dirname, 'app'),
  },
  // 自动导入配置
  imports: {
    dirs: ['app/composables/**', 'app/utils/**'],
  },
  // 组件自动导入目录
  components: [
    { path: 'components', pathPrefix: false },
    { path: 'app/components', pathPrefix: false },
  ],
  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost/',
      origin: process.env.ORIGIN || 'https://typewords.cc',
      host: process.env.HOST || 'typewords.cc',
      latestCommitHash: latestCommitHash + (process.env.NODE_ENV === 'production' ? '' : ' (dev)'),
    },
  },
  // 构建配置
  build: {
    transpile: ['vue-virtual-scroller'],
  },
  // SSR 配置
  ssr: true, // 默认启用 SSR
  // 实验性功能
  experimental: {
    payloadExtraction: false, // 禁用 payload 提取，减少构建体积
  },
  // TypeScript 配置
  typescript: {
    strict: false,
    typeCheck: false, // 构建时不进行类型检查，加快构建速度
    tsConfig: {
      compilerOptions: {
        types: ['vue-macros/macros-global'],
        allowImportingTsExtensions: true,
      },
    },
  },
  devServer: {
    port: 5567,
  },
})
