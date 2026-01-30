# TypeWords-TW 專案筆記

## Debug 進度 (2026-01-29)

### 已解決 ✅

**問題 1：500 Maximum call stack size exceeded**
- **原因**：`node_modules` 損壞或版本不一致
- **解決方法**：
  ```bash
  rm -rf node_modules .nuxt pnpm-lock.yaml
  pnpm install
  ```
- **結果**：主頁和 `/words` 頁面正常載入

---

**問題 2：字典單字列表不顯示**
- **現象**：點擊字典後，顯示「2607條」但單字列表為空（共0條）
- **根本原因**：JSON 檔案中 `trans` 格式不匹配
  - 檔案格式：`"trans": ["取消， 撤銷"]`（字串陣列）
  - 代碼期望：`"trans": [{"pos": "", "cn": "取消， 撤銷"}]`（物件陣列）
- **解決方法**：
  1. 建立轉換腳本 `scripts/convert-dicts.py`
  2. 執行腳本轉換 248 個字典檔案的 `trans` 格式
- **結果**：字典單字列表正常顯示

---

## 專案修改

- `app/config/env.ts`：`RESOURCE_URL` 改為 `/`（使用本地資源）
- `public/list/*.json`：翻譯成繁體中文
- `public/dicts/en/word/*.json`：
  - 轉換 `trans` 格式為物件陣列
  - 內容為繁體中文
- `scripts/convert-dicts.py`：字典格式轉換腳本

## 啟動指令

```bash
cd C:\Users\xray\Downloads\my-project\P2\typewords-tw
pnpm dev
```

伺服器運行於：http://localhost:5567/ 或 http://localhost:3001/（如果端口被佔用）
