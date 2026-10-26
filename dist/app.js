const DRIVE_ROOT = "https://drive.google.com/drive/folders/1abNbaX0GzDIYm7FeJG7cs2wa8IHU3dOW";
const ROTARY_BASICS = "https://drive.google.com/file/d/1AvrD9RX0UMWF1fR5O3pzA-eB9io9TYxG/view";
const PROCEDURE_2025 = "https://drive.google.com/file/d/1OBFLmjbisk4C2WGRHKdJyrDNuey6L3F9/view";
const POLICY_ZH_2026 = "https://drive.google.com/file/d/1wUc_5U_KNqBlPKUdzrxg2S1rsZEfB9Fj/view";
const FOUNDATION_POLICY_ZH = "https://drive.google.com/file/d/1tp5-hTStF7bw_sKljCqJ8iHzigV0NzTI/view";
const GLOSSARY = "https://drive.google.com/file/d/1IkO9y2ty085KSpTzXcCxarYGgFCego6z/view";
const OUR_WORK = "https://www.rotary.org/en/our-work";

const rooms = {
  principal: {
    eyebrow: "RI HEADQUARTERS",
    title: "校長室",
    emoji: "🏫",
    description: "從國際扶輪的官方入口開始，找到組織資訊、會員工具、正式課程與品牌資源。",
    cards: [
      ["🌍", "Rotary International", "RI 官方網站・全球資訊", "https://www.rotary.org/"],
      ["🪪", "My Rotary", "會員帳號・社務工具・個人檔案", "https://my.rotary.org/"],
      ["🎓", "Learning Center", "依角色與主題選擇 RI 正式課程", "https://my-cms.rotary.org/en/knowledge-and-resources/resources-and-reference?embed=true"],
      ["🎨", "Brand Center", "官方標誌・範本・People of Action 素材", "https://brandcenter.rotary.org/"],
      ["🧑‍💼", "社及地區支援", "尋找 Club and District Support 代表", "https://my.rotary.org/en/contact/representatives"]
    ],
    cta: ["前往 RI 官方網站", "https://www.rotary.org/"],
    note: "校長室提供官方入口；制度、獎助金與品牌規範仍應以 RI 當下公布的英文文件為準。"
  },
  classroom: {
    eyebrow: "LEARNING BUILDING",
    title: "教學大樓",
    emoji: "✏️",
    description: "六堂 5–8 分鐘微課程，從扶輪入門一路學到社務、基金、品牌與服務專案。",
    cards: [
      ["🌱", "扶輪新生班", "核心價值、五大服務與四大考驗", null, "class-basics"],
      ["🧭", "組織與角色班", "社員、扶輪社、地區、地帶與 RI", null, "class-structure"],
      ["📋", "社務治理班", "章程、細則、會議與政策層級", null, "class-governance"],
      ["💛", "基金與獎助金班", "扶輪基金、DDF、地區及全球獎助金", null, "class-foundation"],
      ["📣", "公共形象班", "品牌規範、故事與社群內容檢查", null, "class-public-image"],
      ["🤝", "服務行動班", "需求評估、七大焦點與永續專案", null, "class-service"]
    ],
    cta: ["從新生班開始", null, "class-basics"],
    note: "課程是快速導讀，不取代 RI 正式訓練；每堂課末都附上可回查的原始資料。"
  },
  library: {
    eyebrow: "KNOWLEDGE LIBRARY",
    title: "圖書室",
    emoji: "📚",
    description: "依來源層級閱讀治理文件、政策、用語與入門教材，並確認版本與譯本性質。",
    cards: [
      ["📘", "2025 程序手冊", "RI 正式文件・中文版・2025", PROCEDURE_2025],
      ["📗", "扶輪政策彙編", "中文參考版・2026.01", POLICY_ZH_2026],
      ["🇬🇧", "Rotary Code of Policies", "英文版・2026.01", "https://drive.google.com/file/d/1cvbjSvW_CwgO2znn7ptpZkvJ9gl-s91J/view"],
      ["📙", "基金會政策彙編", "非官方中譯參考・2025.10", FOUNDATION_POLICY_ZH],
      ["🇬🇧", "TRF Code of Policies", "英文版・2025.10", "https://drive.google.com/file/d/1BWRP7mW0KurbDUq8_8DszPMlkV10CI-z/view"],
      ["🔤", "扶輪用語與詞彙", "英中對照・2021", GLOSSARY],
      ["🌟", "Rotary Basics 扶輪基礎", "社員參考指南・中文", ROTARY_BASICS],
      ["💡", "週週扶輪知識", "地區整理教材・完整版", "https://drive.google.com/file/d/1-UrRVkIjJNJJaYrdMA9eNP9vHxzux_So/view"]
    ],
    cta: ["開啟完整資料庫", DRIVE_ROOT],
    note: "標示為『非官方中譯』或『地區整理』的內容適合輔助理解；遇到治理與政策爭議時，以最新英文正式文件為準。"
  },
  plaza: {
    eyebrow: "SERVICE PLAZA",
    title: "服務廣場",
    emoji: "🌏",
    description: "從七大焦點領域理解社區需求，將好意轉成有目標、能衡量、可持續的服務專案。",
    cards: [
      ["🕊️", "和平建設", "和平建設與衝突預防", null, "service-peace"],
      ["🩺", "疾病防治", "疾病預防與治療", null, "service-disease"],
      ["💧", "水與衛生", "潔淨用水、衛生設施與衛生習慣", null, "service-water"],
      ["👶", "母嬰健康", "改善母親與兒童健康", null, "service-maternal"],
      ["📖", "教育識字", "基礎教育與識字", null, "service-education"],
      ["🌾", "社區經濟", "社區經濟發展", null, "service-economy"],
      ["🌿", "環境保護", "保育、永續與環境韌性", null, "service-environment"]
    ],
    cta: ["探索服務案例", "https://taipeipeace-service-map.pages.dev/"],
    note: "焦點領域是專案設計的方向；是否符合獎助金資格，仍須依最新申請條件與地區認證程序確認。"
  },
  auditorium: {
    eyebrow: "CAMPUS HALL",
    title: "校園禮堂",
    emoji: "🎤",
    description: "把課堂知識接到年度訓練、社員交流、講座資源與國際扶輪活動。",
    cards: [
      ["👋", "新社員入門", "30 天認識扶輪學習路線", null, "event-onboarding"],
      ["🧑‍🏫", "社幹部訓練", "社長、秘書、財務與委員會交接", null, "event-officers"],
      ["🗓️", "年度學習路線", "依扶輪年度安排訓練與交流", null, "event-calendar"],
      ["▶️", "講座與教材庫", "開啟地區既有文件與簡報", DRIVE_ROOT],
      ["🌐", "國際扶輪年會", "官方年會資訊與報名", "https://convention.rotary.org/zh-tw"]
    ],
    cta: ["查看國際扶輪年會", "https://convention.rotary.org/zh-tw"],
    note: "禮堂先提供不受日期影響的學習路線；各地區實際活動日期與資格，請以當年度正式通知為準。"
  }
};

const lessons = {
  "class-basics": {
    room: "classroom", emoji: "🌱", eyebrow: "5 MIN LESSON", title: "扶輪新生班", duration: "約 6 分鐘",
    intro: "扶輪是由社員組成的國際服務網絡。社員透過扶輪社建立友誼、運用專業能力，並與社區夥伴一起採取行動。",
    points: [
      "核心價值：聯誼、正直、多元、服務與領導力。",
      "五大服務：社務、職業、社區、國際與青少年服務。",
      "四大考驗：是否一切屬於真實、是否各方得到公平、能否促進親善友誼、能否兼顧彼此利益。",
      "扶輪是非政治、非宗教的組織；健全的社文化應尊重並支持多元。"
    ],
    practice: "挑一項最近的社務決定，用四大考驗逐題檢視，記下需要調整的地方。",
    check: "你能用一句話說明『加入扶輪後，可以和誰一起解決什麼問題』嗎？",
    sources: [["Rotary Basics 扶輪基礎", ROTARY_BASICS], ["Rotary International", "https://www.rotary.org/"]]
  },
  "class-structure": {
    room: "classroom", emoji: "🧭", eyebrow: "5 MIN LESSON", title: "組織與角色班", duration: "約 7 分鐘",
    intro: "扶輪的力量從扶輪社開始，再由地區、地帶與國際扶輪串聯支援；扶輪基金會則由保管委員會治理。",
    points: [
      "社員組成扶輪社；各社具有自主性，同時是國際扶輪的會員社。",
      "多個扶輪社組成地區，地區總監與助理總監支持、強化各社並促進交流。",
      "多個地區組成地帶；RI 理事會治理國際扶輪，扶輪基金會保管委員會治理基金會。",
      "社長帶領扶輪社，秘書維護紀錄與行政，財務管理收支，各委員會推動社員、基金、服務與公共形象工作。"
    ],
    practice: "畫出你所在扶輪社到地區、地帶、RI 的關係圖，並標上遇到問題時的第一位聯絡人。",
    check: "助理總監的工作是取代社長，還是支援扶輪社與地區之間的連結？",
    sources: [["Rotary Basics 扶輪基礎", ROTARY_BASICS], ["扶輪用語與詞彙", GLOSSARY]]
  },
  "class-governance": {
    room: "classroom", emoji: "📋", eyebrow: "8 MIN LESSON", title: "社務治理班", duration: "約 8 分鐘",
    intro: "良好社務不是只靠慣例，而是把章程、細則、決議與紀錄放在正確層級中使用。",
    points: [
      "2025 程序手冊收錄 RI 章程、RI 細則、模範扶輪社章程、建議扶輪社細則及基金會細則。",
      "扶輪社章程與社細則用途不同；細則應與上位治理文件一致，並經合法程序修訂。",
      "理事會及保管委員會的政策會持續更新，查詢政策時要確認日期與語言版本。",
      "會議通知、出席、表決、財務與交接都應留下可追溯紀錄。"
    ],
    practice: "檢查社內現行章程與細則的版本日期，列出下一次理事會需要確認的三件事。",
    check: "當地方慣例與最新治理文件不一致時，應優先依哪一層級處理？",
    sources: [["2025 程序手冊", PROCEDURE_2025], ["扶輪政策彙編中文參考版", POLICY_ZH_2026]]
  },
  "class-foundation": {
    room: "classroom", emoji: "💛", eyebrow: "7 MIN LESSON", title: "基金與獎助金班", duration: "約 7 分鐘",
    intro: "扶輪基金會接受捐獻並分配資金，支持經核准的人道與教育活動；專案設計、認證與資金管理同樣重要。",
    points: [
      "年度基金、永久基金與指定捐獻有不同用途；捐款運用與表彰應依官方規定。",
      "地區獎助金回應較即時、範圍較彈性的需求；全球獎助金著重焦點領域、可持續性與長期成果。",
      "SHARE 制度與地區指定用途基金（DDF）讓地區參與資金運用。",
      "申請單位要完成資格認證、利益衝突管理、報告與財務紀錄。"
    ],
    practice: "以一個服務構想為例，分別寫下需求證據、受益者、合作夥伴、預算與一年後如何維持成果。",
    check: "專案規模大就一定適合全球獎助金嗎？還需要哪些條件？",
    sources: [["扶輪基金會政策彙編（非官方中譯）", FOUNDATION_POLICY_ZH], ["Rotary Grants", "https://www.rotary.org/en/our-programs/grants"]]
  },
  "class-public-image": {
    room: "classroom", emoji: "📣", eyebrow: "6 MIN LESSON", title: "公共形象班", duration: "約 6 分鐘",
    intro: "公共形象不只是貼文好看，而是讓社區清楚知道：扶輪和誰合作、採取了什麼行動、帶來哪些改變。",
    points: [
      "標誌、色彩與版型應從 Brand Center 取得，不自行重畫或改變比例。",
      "對外內容以人物、需求、行動與成果為主軸，避免只有活動合照與職稱。",
      "同一專案應保留照片授權、正確名稱、合作夥伴與成果數據。",
      "發布前檢查：品牌正確、資訊可證明、個資有同意、行動呼籲清楚。"
    ],
    practice: "把一篇只有大合照的貼文，改寫成『社區需求—扶輪行動—具體成果—下一步』四段。",
    check: "如果找不到正確標誌檔，應自行描圖，還是回 Brand Center 下載？",
    sources: [["Rotary Brand Center", "https://brandcenter.rotary.org/"], ["扶輪視覺標示準則", "https://drive.google.com/file/d/1VlXuekNbmWGrR3wpL_aFT8jwuQegmztf/view"]]
  },
  "class-service": {
    room: "classroom", emoji: "🤝", eyebrow: "8 MIN LESSON", title: "服務行動班", duration: "約 8 分鐘",
    intro: "好的服務專案從需求出發，而不是先決定要捐什麼。七大焦點領域能幫助團隊聚焦，但仍要與社區共同設計。",
    points: [
      "先蒐集需求證據並訪談受影響者，再定義問題與服務對象。",
      "設定可衡量成果：改變什麼、影響多少人、何時檢查。",
      "盤點社員專業、在地夥伴、風險、預算與可能的獎助金。",
      "把維護、培訓、移交與成效追蹤寫進專案，避免一次性捐贈後無人承接。"
    ],
    practice: "選一個社區問題，完成一頁式專案草案：需求、目標、夥伴、行動、指標、永續方式。",
    check: "你的專案成果是『完成幾場活動』，還是『受益者真正發生什麼改變』？",
    sources: [["Rotary Our Work", OUR_WORK], ["Rotary Basics 扶輪基礎", ROTARY_BASICS]]
  },
  "service-peace": {
    room: "plaza", emoji: "🕊️", eyebrow: "AREA OF FOCUS", title: "和平建設與衝突預防", duration: "焦點領域 1/7",
    intro: "處理衝突背後的貧窮、歧視、資源不均與教育落差，並提升社區對話、調解與和平教育能力。",
    points: ["和平教育與非暴力溝通", "社區調解、青年領導與跨群體對話", "支持扶輪和平研究員與和平中心", "把衝突敏感度納入所有服務專案"],
    practice: "先找出利害關係人與衝突成因，再設計一場由中立者引導的傾聽與共同解題活動。",
    check: "專案是在處理表面爭議，還是回應造成衝突的根本原因？",
    sources: [["RI：Promoting Peace", "https://www.rotary.org/en/our-work/promoting-peace"], ["台北和平服務地圖", "https://taipeipeace-service-map.pages.dev/"]]
  },
  "service-disease": {
    room: "plaza", emoji: "🩺", eyebrow: "AREA OF FOCUS", title: "疾病預防與治療", duration: "焦點領域 2/7",
    intro: "與醫療體系及社區合作，改善預防、篩檢、治療與健康資訊的可近性，並延續扶輪根除小兒麻痺的經驗。",
    points: ["疫苗、篩檢與健康教育", "訓練社區與第一線醫療人員", "改善偏鄉或弱勢族群就醫可近性", "以資料追蹤介入前後的健康成果"],
    practice: "和在地醫療單位先確認疾病負擔與服務缺口，再決定篩檢、轉介或衛教方式。",
    check: "一次義診結束後，異常個案是否有後續轉介與追蹤？",
    sources: [["RI：Fighting Disease", "https://www.rotary.org/en/our-work/fighting-disease"], ["Rotary Our Work", OUR_WORK]]
  },
  "service-water": {
    room: "plaza", emoji: "💧", eyebrow: "AREA OF FOCUS", title: "水、衛生設施與個人衛生", duration: "焦點領域 3/7",
    intro: "安全用水不只是一口井，還包含水質、衛生設施、衛生習慣、營運維護與社區治理。",
    points: ["安全且可負擔的飲用水", "學校與醫療場所的衛生設施", "洗手、經期衛生與行為改變", "建立維修、收費、水質監測與在地管理機制"],
    practice: "把設備建置費、三年維修費、管理責任與水質檢測頻率一起列入專案預算。",
    check: "設施故障後，社區知道誰負責、用什麼資金修復嗎？",
    sources: [["Rotary Our Work", OUR_WORK], ["Rotary Basics 扶輪基礎", ROTARY_BASICS]]
  },
  "service-maternal": {
    room: "plaza", emoji: "👶", eyebrow: "AREA OF FOCUS", title: "母親與兒童健康", duration: "焦點領域 4/7",
    intro: "改善孕產婦、新生兒與兒童取得營養、衛生、產前產後照護與基礎醫療服務的機會。",
    points: ["產前檢查、安全生產與產後照護", "新生兒與兒童營養及預防保健", "培訓助產與社區健康人員", "改善轉診、交通與醫療資訊可近性"],
    practice: "與婦幼健康單位共同畫出孕產婦從社區到醫療院所的服務旅程，找出中斷點。",
    check: "專案是否同時考慮母親、嬰幼兒與照顧者的持續支持？",
    sources: [["Rotary Our Work", OUR_WORK], ["Rotary Basics 扶輪基礎", ROTARY_BASICS]]
  },
  "service-education": {
    room: "plaza", emoji: "📖", eyebrow: "AREA OF FOCUS", title: "基礎教育與識字", duration: "焦點領域 5/7",
    intro: "提升社區提供基礎教育與識字的能力，重視教師培訓、基礎能力、教育平等與終身學習。",
    points: ["兒童閱讀與基礎能力", "教師培訓與教學資源", "成人識字與數位能力", "降低性別、地理與經濟造成的教育落差"],
    practice: "先用閱讀或學習評量建立基準值，再決定教材、教師支持與追蹤時間。",
    check: "捐書之後，誰會教、如何用、學生能力是否真的提升？",
    sources: [["RI：Supporting Education", "https://www.rotary.org/our-work/supporting-education"], ["Rotary Our Work", OUR_WORK]]
  },
  "service-economy": {
    room: "plaza", emoji: "🌾", eyebrow: "AREA OF FOCUS", title: "社區經濟發展", duration: "焦點領域 6/7",
    intro: "運用社員的商業與專業經驗，協助青年、婦女與弱勢群體取得技能、資源、市場與更穩定的生計。",
    points: ["職能與創業能力培訓", "金融知識、儲蓄與負責任的微型金融", "生產者與市場、供應鏈的連結", "以收入、就業與營運存續衡量成果"],
    practice: "除了培訓人數，也追蹤三至十二個月後的就業、營收或家庭收入改變。",
    check: "受益者真正缺少的是技能、資金、市場，還是制度與照顧支持？",
    sources: [["Rotary Our Work", OUR_WORK], ["Rotary Basics 扶輪基礎", ROTARY_BASICS]]
  },
  "service-environment": {
    room: "plaza", emoji: "🌿", eyebrow: "AREA OF FOCUS", title: "環境保護", duration: "焦點領域 7/7",
    intro: "保護與復育自然資源、提升生態永續，並協助社區面對氣候與環境公共衛生風險。",
    points: ["土地、海岸、海洋與淡水生態保護", "永續農漁業與自然資源管理", "減少排放、廢棄物與不可持續消費", "提升受氣候變遷影響社區的韌性"],
    practice: "為淨灘或植樹加入來源減量、存活率、維護責任與長期監測，讓活動變成專案。",
    check: "成果只計算參與人數，還是也追蹤垃圾減量、樹木存活或水質改善？",
    sources: [["RI：Protecting the Environment", "https://www.rotary.org/our-work/protecting-the-environment"], ["Rotary Our Work", OUR_WORK]]
  },
  "event-onboarding": {
    room: "auditorium", emoji: "👋", eyebrow: "LEARNING PATH", title: "新社員 30 天入門", duration: "4 週學習路線",
    intro: "用四週建立基本認識與人際連結，避免一次塞滿名詞，卻不知道如何參與。",
    points: ["第 1 週：認識社友、社史、例會方式與近期服務。", "第 2 週：閱讀扶輪基礎，理解核心價值、四大考驗與五大服務。", "第 3 週：選一場委員會或服務活動實際參與。", "第 4 週：和導師回顧經驗，選定一項想投入的社務或服務。"],
    practice: "由一位社友擔任 30 天導師，安排三次短對談與一次共同參與。",
    check: "新社員是否知道下一個可以採取的具體行動，而不只知道扶輪名詞？",
    sources: [["Rotary Basics 扶輪基礎", ROTARY_BASICS], ["強化你的社員", "https://drive.google.com/file/d/11hBQg6HNzzm9GHUP4iJXRLTJPMb1h-uY/view"]]
  },
  "event-officers": {
    room: "auditorium", emoji: "🧑‍🏫", eyebrow: "LEARNING PATH", title: "社幹部訓練與交接", duration: "上任前準備",
    intro: "幹部訓練的目標是把責任、資料與年度目標交接清楚，而不只是參加一場講習。",
    points: ["社長：年度方向、理事會、委員會協作與社員參與。", "秘書：社員資料、會議通知、紀錄與 RI／地區行政。", "財務：預算、收支、對帳、報告與內部控制。", "委員會：明確目標、負責人、里程碑、成果指標與接班資料。"],
    practice: "每個職務建立一頁交接表：固定工作、帳號權限、年度期限、檔案位置與聯絡人。",
    check: "若明天換人，下一任是否能在同一週找到資料並繼續工作？",
    sources: [["2025 程序手冊", PROCEDURE_2025], ["領導你的扶輪社資料夾", "https://drive.google.com/drive/folders/1sASTJEDWg_WMJFHKYGHSdZ_IlhPnfCBO"]]
  },
  "event-calendar": {
    room: "auditorium", emoji: "🗓️", eyebrow: "LEARNING PATH", title: "年度學習與交流路線", duration: "依地區公告排程",
    intro: "把學習安排在正確的年度節點，社員才有機會把訓練內容帶回社內實作。",
    points: ["上任前：社長當選人訓練、地區訓練講習與幹部交接。", "年度初：確認社員、基金、公共形象與服務目標。", "年度中：主題研討、地區交流、專案檢核與社員發展。", "年度末：地區年會、成果分享、紀錄整理與下一任交接。"],
    practice: "把地區公告日期放進社行事曆，並為每場訓練指定參加者與返社分享方式。",
    check: "每場外部訓練後，是否有人負責把重點轉成社內的下一個行動？",
    sources: [["國際扶輪年會", "https://convention.rotary.org/zh-tw"], ["完整扶輪資料庫", DRIVE_ROOT]]
  }
};

const knowledgeItems = Object.values(rooms).flatMap((room) =>
  room.cards.map(([icon, title, meta, url, lessonKey]) => ({
    icon, title, meta, url, lessonKey, room: room.title,
    keywords: lessonKey && lessons[lessonKey]
      ? `${lessons[lessonKey].intro} ${lessons[lessonKey].points.join(" ")}`
      : ""
  }))
);

const drawer = document.querySelector("#drawer");
const drawerContent = document.querySelector("#drawerContent");
const drawerClose = document.querySelector("#drawerClose");
const backdrop = document.querySelector("#backdrop");
const welcomeCard = document.querySelector("#welcomeCard");
const searchDialog = document.querySelector("#searchDialog");
const searchInput = document.querySelector("#knowledgeSearch");
const searchResults = document.querySelector("#searchResults");
let lastFocused = null;

function cardMarkup([icon, title, meta, url, lessonKey]) {
  const contents = `
    <span class="room-card-icon" aria-hidden="true">${icon}</span>
    <div><strong>${title}</strong><small>${meta}</small></div>
    <span class="room-card-arrow" aria-hidden="true">→</span>`;
  if (lessonKey) {
    return `<button class="room-card room-card-button" type="button" data-lesson="${lessonKey}" aria-label="開啟${title}">${contents}</button>`;
  }
  return `<a class="room-card" href="${url}" target="_blank" rel="noreferrer">${contents}</a>`;
}

function ctaMarkup([label, url, lessonKey]) {
  if (lessonKey) return `<button class="room-cta" type="button" data-lesson="${lessonKey}">${label} <span aria-hidden="true">→</span></button>`;
  return `<a class="room-cta" href="${url}" target="_blank" rel="noreferrer">${label} <span aria-hidden="true">→</span></a>`;
}

function showDrawer() {
  backdrop.hidden = false;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  drawer.scrollTop = 0;
}

function openRoom(roomKey, trigger) {
  const room = rooms[roomKey];
  if (!room) return;
  if (!drawer.classList.contains("is-open")) lastFocused = trigger || document.activeElement;
  drawerContent.innerHTML = `
    <header class="room-hero">
      <span class="room-emoji" aria-hidden="true">${room.emoji}</span>
      <p class="eyebrow">${room.eyebrow}</p>
      <h2 id="drawerTitle">${room.title}</h2>
      <p>${room.description}</p>
    </header>
    <p class="room-intro">${room.description}</p>
    <div class="card-list">${room.cards.map(cardMarkup).join("")}</div>
    ${ctaMarkup(room.cta)}
    <p class="room-note">${room.note}</p>`;
  showDrawer();
  drawerClose.focus();
}

function openLesson(lessonKey, trigger) {
  const lesson = lessons[lessonKey];
  if (!lesson) return;
  if (!drawer.classList.contains("is-open")) lastFocused = trigger || document.activeElement;
  drawerContent.innerHTML = `
    <header class="room-hero lesson-hero">
      <button class="lesson-back" type="button" data-back-room="${lesson.room}">← 返回${rooms[lesson.room].title}</button>
      <span class="room-emoji" aria-hidden="true">${lesson.emoji}</span>
      <p class="eyebrow">${lesson.eyebrow}</p>
      <h2 id="drawerTitle">${lesson.title}</h2>
      <span class="lesson-duration">${lesson.duration}</span>
    </header>
    <p class="lesson-lead">${lesson.intro}</p>
    <section class="lesson-section">
      <h3>這堂課的重點</h3>
      <ul class="lesson-points">${lesson.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    </section>
    <section class="lesson-section lesson-practice">
      <p class="lesson-kicker">帶回社內做</p>
      <h3>${lesson.practice}</h3>
    </section>
    <section class="lesson-section lesson-check">
      <p class="lesson-kicker">想一想</p>
      <h3>${lesson.check}</h3>
    </section>
    <section class="lesson-section">
      <h3>資料來源</h3>
      <div class="lesson-sources">${lesson.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label}<span aria-hidden="true">↗</span></a>`).join("")}</div>
    </section>`;
  showDrawer();
  drawerContent.querySelector(".lesson-back").focus();
}

function closeRoom() {
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  window.setTimeout(() => { backdrop.hidden = true; }, 300);
  if (lastFocused) lastFocused.focus();
}

function hideWelcome() {
  welcomeCard.classList.add("is-hidden");
}

function renderSearch(query = "") {
  const normalized = query.trim().toLowerCase();
  const matches = knowledgeItems.filter((item) =>
    `${item.title} ${item.meta} ${item.room} ${item.keywords}`.toLowerCase().includes(normalized)
  );
  searchResults.innerHTML = matches.length
    ? matches.slice(0, 16).map((item) => cardMarkup([item.icon, item.title, `${item.room}・${item.meta}`, item.url, item.lessonKey])).join("")
    : '<p class="search-empty">找不到符合的資料，試試「基金」、「政策」、「和平」或「新生」。</p>';
}

document.querySelectorAll("[data-room]").forEach((button) => {
  button.addEventListener("click", () => {
    hideWelcome();
    openRoom(button.dataset.room, button);
  });
});

document.addEventListener("click", (event) => {
  const lessonTrigger = event.target.closest("[data-lesson]");
  if (lessonTrigger) {
    const openedFromSearch = searchDialog.open;
    if (openedFromSearch) {
      searchDialog.close();
      lastFocused = document.querySelector("#searchButton");
    }
    hideWelcome();
    openLesson(lessonTrigger.dataset.lesson, lessonTrigger);
    return;
  }
  const backTrigger = event.target.closest("[data-back-room]");
  if (backTrigger) openRoom(backTrigger.dataset.backRoom, backTrigger);
});

drawerClose.addEventListener("click", closeRoom);
backdrop.addEventListener("click", closeRoom);
document.querySelector("#welcomeClose").addEventListener("click", hideWelcome);
document.querySelector("#startExplore").addEventListener("click", hideWelcome);
document.querySelector("#openGuide").addEventListener("click", (event) => openRoom("classroom", event.currentTarget));
document.querySelector("#guideButton").addEventListener("click", (event) => openRoom("classroom", event.currentTarget));

document.querySelector("#motionButton").addEventListener("click", (event) => {
  const paused = document.body.classList.toggle("motion-paused");
  event.currentTarget.setAttribute("aria-pressed", String(paused));
  event.currentTarget.setAttribute("aria-label", paused ? "播放場景動畫" : "暫停場景動畫");
  event.currentTarget.querySelector("span:first-child").textContent = paused ? "▶" : "Ⅱ";
  event.currentTarget.querySelector(".action-text").textContent = paused ? "播放" : "暫停";
});

document.querySelector("#searchButton").addEventListener("click", () => {
  renderSearch();
  searchDialog.showModal();
  window.setTimeout(() => searchInput.focus(), 0);
});
searchInput.addEventListener("input", () => renderSearch(searchInput.value));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer.classList.contains("is-open")) closeRoom();
});

renderSearch();
