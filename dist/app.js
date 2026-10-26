const rooms = {
  principal: {
    eyebrow: "RI HEADQUARTERS",
    title: "校長室",
    emoji: "🏫",
    description: "從國際扶輪官方資源開始，了解全球組織、會員工具與正式學習平台。外部連結會另開分頁。",
    cards: [
      ["🌍", "Rotary International", "國際扶輪官方網站", "https://www.rotary.org/"],
      ["🪪", "My Rotary", "會員專屬工具與資訊", "https://my.rotary.org/"],
      ["🎓", "Learning Center", "依角色與主題選擇正式課程", "https://my-cms.rotary.org/en/knowledge-and-resources/resources-and-reference?embed=true"],
      ["🎨", "Brand Center", "標誌、範本與品牌使用規範", "https://brandcenter.rotary.org/"]
    ],
    cta: ["前往 RI 官方網站", "https://www.rotary.org/"],
    note: "校長室只整理入口，不取代 RI 官方說明；涉及政策與制度時，請以最新官方文件為準。"
  },
  classroom: {
    eyebrow: "LEARNING BUILDING",
    title: "教學大樓",
    emoji: "✏️",
    description: "每堂課約 5–8 分鐘，先看情境、再讀知識卡，最後用三題小測驗完成學習。",
    cards: [
      ["🌱", "扶輪新生班", "扶輪是什麼、核心價值與四大考驗", "#"],
      ["🧭", "組織與角色班", "RI、地區、分區與扶輪社", "#"],
      ["📋", "社務治理班", "章程、細則、會議與社務運作", "#"],
      ["💛", "基金與獎助金班", "扶輪基金、地區及全球獎助金", "#"],
      ["📣", "公共形象班", "品牌規範、內容與社群溝通", "#"],
      ["🤝", "服務行動班", "七大焦點領域與服務專案設計", "#"]
    ],
    cta: ["從新生班開始", "#"],
    note: "這是第一版互動原型；正式課程將逐步把現有扶輪教材拆成可閱讀、可測驗的微課程。"
  },
  library: {
    eyebrow: "KNOWLEDGE LIBRARY",
    title: "圖書室",
    emoji: "📚",
    description: "搜尋 RI 正式文件、地區說明與實務範本。每份資料都標示版本、日期與來源層級。",
    cards: [
      ["📘", "2025 程序手冊", "RI 正式文件・2025", "https://drive.google.com/file/d/1OBFLmjbisk4C2WGRHKdJyrDNuey6L3F9/view"],
      ["📗", "扶輪政策彙編", "RI 正式文件・2026.01", "https://drive.google.com/file/d/1wUc_5U_KNqBlPKUdzrxg2S1rsZEfB9Fj/view"],
      ["📙", "扶輪基金會政策彙編", "RI 正式文件・2025.10", "https://drive.google.com/file/d/1tp5-hTStF7bw_sKljCqJ8iHzigV0NzTI/view"],
      ["🔤", "扶輪用語與詞彙", "英中對照・2021", "https://drive.google.com/file/d/1IkO9y2ty085KSpTzXcCxarYGgFCego6z/view"],
      ["🌟", "Rotary Basics 扶輪基礎", "社員參考指南", "https://drive.google.com/file/d/1AvrD9RX0UMWF1fR5O3pzA-eB9io9TYxG/view"]
    ],
    cta: ["開啟完整資料庫", "https://drive.google.com/drive/folders/1abNbaX0GzDIYm7FeJG7cs2wa8IHU3dOW"],
    note: "圖書室會區分 RI 正式文件、地區說明、實務範本與案例分享，避免把地方慣例誤認成正式政策。"
  },
  plaza: {
    eyebrow: "SERVICE PLAZA",
    title: "服務廣場",
    emoji: "🌏",
    description: "把知識帶到行動現場。從七大焦點領域出發，探索需求、合作方式與服務案例。",
    cards: [
      ["🕊️", "和平建設", "和平建設與衝突預防", "#"],
      ["🩺", "疾病防治", "疾病預防與治療", "#"],
      ["💧", "水與衛生", "潔淨用水、環境與個人衛生", "#"],
      ["📖", "教育識字", "基礎教育與識字", "#"],
      ["🌿", "環境保護", "支持永續環境行動", "#"]
    ],
    cta: ["探索服務案例", "https://taipeipeace-service-map.pages.dev/"],
    note: "案例分類是學習導覽，不代表獎助金已正式核准；申請時仍需查閱最新規範。"
  },
  auditorium: {
    eyebrow: "CAMPUS HALL",
    title: "校園禮堂",
    emoji: "🎤",
    description: "聚集年度活動、地區訓練、講座與國際年會資訊，讓學習和社友交流接在一起。",
    cards: [
      ["📅", "年度活動", "地區講習、研討會與重要日期", "#"],
      ["▶️", "講座重播", "依主題整理的影音與簡報", "#"],
      ["🌐", "國際扶輪年會", "認識國際年會與最新資訊", "https://convention.rotary.org/zh-tw"]
    ],
    cta: ["查看國際年會", "https://convention.rotary.org/zh-tw"],
    note: "活動內容將在資料來源與主辦單位確認後上架。"
  }
};

const knowledgeItems = Object.values(rooms).flatMap((room) =>
  room.cards.map(([icon, title, meta, url]) => ({ icon, title, meta, url, room: room.title }))
);

const campusPoints = {
  principal: { x: 18, y: 35 },
  classroom: { x: 48, y: 34 },
  library: { x: 76, y: 37 },
  plaza: { x: 52, y: 59 },
  auditorium: { x: 78, y: 65 },
  gate: { x: 47, y: 80 },
  garden: { x: 34, y: 51 },
  parkBench: { x: 20, y: 58 },
  parkTree: { x: 27, y: 50 },
  parkPath: { x: 31, y: 62 }
};

const actorProfiles = [
  { id: "governor", label: "總監", route: ["principal", "plaza", "classroom", "auditorium"], shirt: "#1853a0", accent: "#f8c64a", hair: "#d8d5ce", skin: "#efbb8d", pants: "#203d64", messages: ["早安！", "去上課囉", "到處看看"] },
  { id: "assistant", label: "助理總監", route: ["library", "plaza", "classroom", "principal"], shirt: "#f28b64", accent: "#fff4d2", hair: "#38241f", skin: "#f1bd91", pants: "#375377", messages: ["找份資料", "一起學習", "等等見！"] },
  { id: "member", label: "社友", route: ["gate", "classroom", "library", "plaza", "auditorium"], shirt: "#60bba5", accent: "#fff8d9", hair: "#53352c", skin: "#d99b71", pants: "#284865", messages: ["來學新知", "去圖書室", "服務出發"] },
  { id: "reader", label: "閱讀中", job: "reader", route: ["parkBench", "parkTree", "garden"], shirt: "#8569c7", accent: "#fff", hair: "#52342b", skin: "#f0b98b", pants: "#344767", messages: ["閱讀中 📖", "找到好書", "筆記一下"] },
  { id: "gardener", label: "照顧花園", job: "gardener", route: ["parkTree", "parkPath", "parkBench"], shirt: "#e9a735", accent: "#fff9dc", hair: "#c9c4b9", skin: "#e6ad7e", pants: "#3d654f", messages: ["幫花澆水", "花開了！", "整理花園"] },
  { id: "photographer", label: "記錄校園", job: "photographer", route: ["garden", "parkPath", "plaza"], shirt: "#df6d83", accent: "#fff4da", hair: "#2f2424", skin: "#bf7d59", pants: "#314f6f", messages: ["拍張照片 📷", "風景真好", "笑一個！"] }
];

const actorAnimations = new Map();
const actorTimers = new Set();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let motionPaused = false;

function actorMarkup(profile) {
  return `<div class="campus-actor is-resting" data-actor="${profile.id}" data-job="${profile.job || "traveler"}" style="--shirt:${profile.shirt};--accent:${profile.accent};--hair:${profile.hair};--skin:${profile.skin};--pants:${profile.pants}">
    <span class="actor-shadow"></span>
    <span class="actor-badge">${profile.label}</span>
    <span class="actor-bubble"></span>
    <span class="actor-figure">
      <span class="actor-hair"></span><span class="actor-head"></span><span class="actor-body"></span>
      <span class="actor-arm left"></span><span class="actor-arm right"></span>
      <span class="actor-leg left"></span><span class="actor-leg right"></span>
    </span>
  </div>`;
}

function scheduleActor(callback, delay) {
  const timer = window.setTimeout(() => {
    actorTimers.delete(timer);
    callback();
  }, delay);
  actorTimers.add(timer);
}

function restActor(actor, profile, nextStep) {
  const message = profile.messages[Math.floor(Math.random() * profile.messages.length)];
  actor.querySelector(".actor-bubble").textContent = message;
  actor.classList.remove("is-walking");
  actor.classList.add("is-resting", "is-acting");
  scheduleActor(() => {
    actor.classList.remove("is-acting");
    scheduleActor(nextStep, 900 + Math.random() * 1800);
  }, 2200 + Math.random() * 2600);
}

function moveActor(actor, profile, routeIndex) {
  const fromName = profile.route[routeIndex % profile.route.length];
  const nextIndex = (routeIndex + 1) % profile.route.length;
  const toName = profile.route[nextIndex];
  const from = campusPoints[fromName];
  const to = campusPoints[toName];
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  const duration = Math.max(6500, Math.min(15000, distance * 310));
  actor.classList.toggle("faces-left", to.x < from.x);
  actor.classList.remove("is-resting", "is-acting");
  actor.classList.add("is-walking");
  actor.style.zIndex = String(Math.round(to.y));
  const animation = actor.animate(
    [{ left: `${from.x}%`, top: `${from.y}%` }, { left: `${to.x}%`, top: `${to.y}%` }],
    { duration, easing: "linear", fill: "forwards" }
  );
  actorAnimations.set(actor, animation);
  if (motionPaused) animation.pause();
  animation.onfinish = () => {
    actor.style.left = `${to.x}%`;
    actor.style.top = `${to.y}%`;
    animation.cancel();
    actorAnimations.delete(actor);
    restActor(actor, profile, () => moveActor(actor, profile, nextIndex));
  };
}

function initCampusActors() {
  const container = document.querySelector("#campusActors");
  container.innerHTML = actorProfiles.map(actorMarkup).join("");
  actorProfiles.forEach((profile, index) => {
    const actor = container.querySelector(`[data-actor="${profile.id}"]`);
    const point = campusPoints[profile.route[0]];
    actor.style.left = `${point.x}%`;
    actor.style.top = `${point.y}%`;
    actor.style.zIndex = String(Math.round(point.y));
    actor.querySelector(".actor-bubble").textContent = profile.messages[0];
    if (reducedMotion.matches) {
      actor.classList.add("is-acting");
      return;
    }
    scheduleActor(() => moveActor(actor, profile, 0), 1000 + index * 900);
  });
}

const drawer = document.querySelector("#drawer");
const drawerContent = document.querySelector("#drawerContent");
const drawerClose = document.querySelector("#drawerClose");
const backdrop = document.querySelector("#backdrop");
const welcomeCard = document.querySelector("#welcomeCard");
const searchDialog = document.querySelector("#searchDialog");
const searchInput = document.querySelector("#knowledgeSearch");
const searchResults = document.querySelector("#searchResults");
let lastFocused = null;

function cardMarkup([icon, title, meta, url]) {
  const external = url && url !== "#";
  return `<a class="room-card" href="${url}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>
    <span class="room-card-icon" aria-hidden="true">${icon}</span>
    <div><strong>${title}</strong><small>${meta}</small></div>
    <span class="room-card-arrow" aria-hidden="true">→</span>
  </a>`;
}

function openRoom(roomKey, trigger) {
  const room = rooms[roomKey];
  if (!room) return;
  lastFocused = trigger || document.activeElement;
  drawerContent.innerHTML = `
    <header class="room-hero">
      <span class="room-emoji" aria-hidden="true">${room.emoji}</span>
      <p class="eyebrow">${room.eyebrow}</p>
      <h2 id="drawerTitle">${room.title}</h2>
      <p>${room.description}</p>
    </header>
    <p class="room-intro">${room.description}</p>
    <div class="card-list">${room.cards.map(cardMarkup).join("")}</div>
    <a class="room-cta" href="${room.cta[1]}" ${room.cta[1] !== "#" ? 'target="_blank" rel="noreferrer"' : ""}>${room.cta[0]} <span aria-hidden="true">→</span></a>
    <p class="room-note">${room.note}</p>
  `;
  backdrop.hidden = false;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  drawerClose.focus();
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
    `${item.title} ${item.meta} ${item.room}`.toLowerCase().includes(normalized)
  );
  searchResults.innerHTML = matches.length
    ? matches.slice(0, 12).map((item) => cardMarkup([item.icon, item.title, `${item.room}・${item.meta}`, item.url])).join("")
    : '<p class="search-empty">找不到符合的資料，試試「基金」、「政策」或「新生」。</p>';
}

document.querySelectorAll("[data-room]").forEach((button) => {
  button.addEventListener("click", () => {
    hideWelcome();
    openRoom(button.dataset.room, button);
  });
});

drawerClose.addEventListener("click", closeRoom);
backdrop.addEventListener("click", closeRoom);
document.querySelector("#welcomeClose").addEventListener("click", hideWelcome);
document.querySelector("#startExplore").addEventListener("click", hideWelcome);
document.querySelector("#openGuide").addEventListener("click", (event) => openRoom("classroom", event.currentTarget));
document.querySelector("#guideButton").addEventListener("click", (event) => openRoom("classroom", event.currentTarget));

document.querySelector("#motionButton").addEventListener("click", (event) => {
  const paused = document.body.classList.toggle("motion-paused");
  motionPaused = paused;
  actorAnimations.forEach((animation) => paused ? animation.pause() : animation.play());
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
initCampusActors();
