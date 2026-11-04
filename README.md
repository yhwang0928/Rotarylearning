# Rotarylearning

扶輪知識小學堂的互動網站原型。以溫暖、療癒的立體校園呈現扶輪知識，訪客可以點選校長室、教學大樓、圖書室、服務廣場與校園禮堂開始探索。手機版可左右滑動完整校園，場景動畫支援暫停及系統減少動態設定。

## 正式網站

<https://rotarylearning.pages.dev>

## 本機預覽

```bash
python3 -m http.server 4173 --directory dist
```

開啟 `http://localhost:4173`。

## 遊戲島 POC（免登入）

開啟 `http://localhost:4173/poc/` 可測試六種人物選擇、3D 校園道路移動、五區短課程、答題點數與本機學習護照。詳細範圍及限制見 [POC 試玩說明](./docs/POC_GAME_ISLAND.md)。

```bash
npm ci
npm test
```

人物與點數只保存在同一瀏覽器；本版尚未加入 LINE、雲端同步或正式後端判分。

## Cloudflare Pages

專案名稱：`rotarylearning`

```bash
npx wrangler pages deploy dist --project-name rotarylearning
```

## 內容來源

網站目前為互動原型。正式教材連結指向扶輪知識 Google Drive 原始資料與 Rotary International 官方網站。

## 協作開發

多人開發前，請先閱讀 [協作開發工作包](./docs/WORK_PACKAGES.md)。文件定義模組邊界、檔案所有權、依賴順序、驗收條件與 Pull Request 規則。

換電腦或交接開發時，請先閱讀 [HANDOFF.md](./HANDOFF.md)；「Puma 政策島式動態設計」的確認方向、桌機與手機情境圖收錄於 [動態設計規格](./docs/DYNAMIC_DESIGN_DIRECTION.md)。
