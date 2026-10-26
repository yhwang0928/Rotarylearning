# Rotarylearning

扶輪知識小學堂的互動網站原型。以溫暖、療癒的立體校園呈現扶輪知識，訪客可以點選校長室、教學大樓、圖書室與服務廣場開始探索。

校園內的總監、助理總監與社友會在不同建築之間移動；公園人物會散步、閱讀、照顧花園與記錄校園。場景動畫支援暫停及系統減少動態設定。

## 正式網站

<https://rotarylearning.pages.dev>

## 本機預覽

```bash
python3 -m http.server 4173 --directory dist
```

開啟 `http://localhost:4173`。

## Cloudflare Pages

專案名稱：`rotarylearning`

```bash
npx wrangler pages deploy dist --project-name rotarylearning
```

## 內容來源

網站目前為互動原型。正式教材連結指向扶輪知識 Google Drive 原始資料與 Rotary International 官方網站。
