<script setup lang="ts">
let logList = [
  {
    date: '2026/01/19',
    content: '文章練習介面新增自動滾動; 修復練習介面，開啟設定彈窗事件衝突',
  },
  {
    date: '2026/01/16',
    content: '用 Nuxt 重構',
  },
  {
    date: '2026/01/06',
    content: '最佳化書籍詳情頁面',
  },
  {
    date: '2025/12/30',
    content: '移除“繼續默寫”選項',
  },
  {
    date: '2025/12/29',
    content: '單詞練習介面，底部工具欄新增音訊設定按鈕',
  },
  {
    date: '2025/12/27',
    content: '最佳化進度條展示，現可展示當前階段、所有階段',
  },
  {
    date: '2025/12/23',
    content: '新增複習、自測、默寫、聽寫模式',
  },
  {
    date: '2025/12/20',
    content: '新增資源分享頁面',
  },
  {
    date: '2025/12/17',
    content: '新增幫助頁面',
  },
  {
    date: '2025/12/16',
    content: '修復彈框內邊距太小；單詞、文章、通用設定在設定頁面、練習介面均可進行設定',
  },
  {
    date: '2025/12/15',
    content: '修復在黑暗模式下，翻譯顏色不正確；支援中文符號輸入',
  },
  {
    date: '2025/12/11',
    content: '修復音標顯示錯誤問題，最佳化反饋頁面',
  },
  {
    date: '2025/12/10',
    content: '新增選項：複習比(單詞練習時，複習詞與新詞的比例)',
  },
  {
    date: '2025/12/5',
    content: '解決練習介面無法複製、全選的問題',
  },
  {
    date: '2025/12/3',
    content: '單詞、文章設定修改為彈框，更方便',
  },
  {
    date: '2025/12/3',
    content: '錄入新概念（三、四）部分音訊，最佳化文章相關功能',
  },
  {
    date: '2025/12/2',
    content: '完成新概念（一）音訊，最佳化文章管理頁面',
  },
  {
    date: '2025/11/30',
    content: '文章裡的單詞可點選播放',
  },
  {
    date: '2025/11/29',
    content: '修改 Slider 元件顯示bug，新增 IE 瀏覽器檢測提示',
  },
  {
    date: '2025/11/28',
    content: '新增引導框、 新增詞典測試模式（由大佬hebeihang 開發）',
  },
  {
    date: '2025/11/25',
    content: '文章練習新增人名忽略功能（新概念一已全部適配），上傳了新概念（一）1-18 音訊',
  },
  {
    date: '2025/11/23',
    content: '最佳化練習完成結算介面，新增分享功能',
  },
  {
    date: '2025/11/22',
    content: '適配移動端',
  },
  {
    date: '2025/11/16',
    content: '自測單詞時，不認識單詞可以直接輸入，自動標識為錯誤單詞，無需按2',
  },
  {
    date: '2025/11/15',
    content: '練習單詞時，底部工具欄新增“跳到下一階段”按鈕',
  },
  {
    date: '2025/11/14',
    content:
      '新增文章練習時可跳過空格：如果在單詞的最後一位上，不按空格直接輸入下一個字母的話，自動跳下一個單詞，按空格也自動跳下一個單詞',
  },
  {
    date: '2025/11/13',
    content: '新增文章練習時“輸入時忽略符號/數字”選項',
  },
  {
    date: '2025/11/6',
    content: '新增隨機複習功能',
  },
  {
    date: '2025/10/30',
    content: '整合PWA基礎配置，支援使用者以類App形式開啟專案',
  },
  {
    date: '2025/10/26',
    content: '進一步完善單詞練習，解決複習數量太多的問題',
  },
  {
    date: '2025/10/8',
    content: '文章支援自動播放下一篇',
  },
  {
    date: '2025/9/14',
    content: '完善文章編輯、匯入、匯出等功能',
  },
  {
    date: '2025/8/10',
    content: '2.0版本釋出，全新UI，全新邏輯，新增短語、例句、近義詞等功能',
  },
  {
    date: '2025/7/19',
    content: '1.0版本釋出',
  },
]
</script>

<template>
  <div>
    <div class="log-item" v-for="item in logList" :key="item.date">
      <div class="mb-2">
        <div>
          <div>日期：{{ item.date }}</div>
          <div>內容：{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.log-item {
  border-bottom: 1px solid var(--color-input-border);
  margin-bottom: 1rem;
}
</style>
