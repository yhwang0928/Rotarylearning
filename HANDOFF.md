# Rotarylearning 開發交接

最後更新：2026-11-05

## 最新補充：長輩易讀版（2026-11-05）

- POC 主要內文與主要按鈕放大為 18px，加入可記住偏好的特大字 20px 模式；次要文字與對比同步改善。
- 手機選角與護照印章重排為兩欄，課程可捲動閱讀，各彈窗保留固定的字級／關閉工具列。
- 文案改用更直接的中文，縮短題目，增加明確選取標記；既有本機點數與進度保留。
- 詳細尺寸、截圖與驗證範圍見 [POC 試玩說明](./docs/POC_GAME_ISLAND.md)。

## 最新補充：遊戲島免登入 POC（2026-11-04）

- 使用者確認第一版採每位社友各自探索，先不加入 LINE 綁定。
- POC 預覽：<https://poc-game-island.rotarylearning.pages.dev/poc/>；程式分支：`codex/game-island-poc`。
- 已新增獨立 `/poc/`：六種人物、3D 校園與走路、五區短課程／測驗、點數、護照與本機存檔。
- 詳細範圍、執行方式、驗證與限制見 [POC 試玩說明](./docs/POC_GAME_ISLAND.md)。
- 下方「尚未導入 Three.js」描述針對原本首頁；POC 已使用真正 Three.js 場景，原首頁保留。
- POC 不含雲端同步或正式後端判分，前端點數不可用於正式兌獎。下一步先收集社友試玩意見。

## 專案連結

- GitHub：<https://github.com/yhwang0928/Rotarylearning>
- 正式網站：<https://rotarylearning.pages.dev/>
- 協作工作包：[docs/WORK_PACKAGES.md](./docs/WORK_PACKAGES.md)
- 動態設計規格：[docs/DYNAMIC_DESIGN_DIRECTION.md](./docs/DYNAMIC_DESIGN_DIRECTION.md)

## 本次完成（2026-11-04）

- **手機版校園操作**：完成手機畫面中的橫向地圖滑動與導覽改善，避免校園只能被限制置中。
- **協作開發規劃**：建立 WP-00 至 WP-07 工作包，定義模組邊界、依賴、驗收與 Pull Request 規則。
- **動態設計方向**：確認採用「Puma 政策島的空間互動方式＋目前扶輪知識島的可愛美術風格」。
- **設計情境圖**：加入桌機版與手機版情境圖，作為下一階段 3D 開發與驗收基準。

## 已確認的設計決策

當需求提到「比照 Puma 政策島的動態設計」，意思是：

- 參考 3D 場景探索、鏡頭旋轉、建築選取、知識關聯、時間軸及資訊面板等互動架構。
- 保留目前扶輪知識島的藍金屋頂、海島花園、可愛人物、療癒立體校園與扶輪品牌色。
- 不複製 Puma 的品牌、建築造型或視覺素材。
- 桌機採左右資訊面板與中央 3D 校園；手機採全螢幕地圖與可上拉的底部課程抽屜。

## 目前技術狀態

- 網站是無框架靜態原型，主要檔案為 `dist/index.html`、`dist/styles.css`、`dist/app.js`。
- 校園目前以單張 PNG 加上 HTML 熱點呈現，尚未導入真正的 WebGL／Three.js 3D 場景。
- 五個學區已有基本內容：校長室、教學大樓、圖書室、服務廣場、校園禮堂。
- Cloudflare Pages 專案名稱為 `rotarylearning`。

## 下一步待辦

1. 優先執行 WP-00，拆分目前單一 `app.js` 與 `styles.css`，建立共同資料與互動契約。
2. 建立 Three.js 校園場景、透視鏡頭、受限 OrbitControls、Raycaster 建築選取及 CSS2D 標籤。
3. 將建築、道路、植栽與角色逐步轉為可獨立控制的 GLB／glTF 資產。
4. 完成手機全螢幕拖曳、雙指縮放、底部課程抽屜與 44px 以上觸控目標。
5. 加入扶輪年度時間軸、知識關聯線、學習手冊與閱讀進度。
6. 保留靜態校園備援、鍵盤導覽、減少動態模式與低效能裝置降級方案。

## 已知注意事項

- 情境圖是設計方向，不是可直接投入網站的最終 3D 場景素材。
- 正式開發前應確認扶輪 Logo、教材連結與引用內容的版本及使用規範。
- 多人協作時先由 WP-00 建立模組結構，避免多人同時修改 `dist/app.js` 或 `dist/styles.css`。

## 另一台電腦快速開始

```bash
git clone https://github.com/yhwang0928/Rotarylearning.git
cd Rotarylearning
python3 -m http.server 4173 --directory dist
```

開啟 <http://localhost:4173>。
