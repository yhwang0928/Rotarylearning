import {
  AVATARS,
  ZONES,
  REWARD,
  ISLAND_BONUS,
  STORAGE_KEY,
} from "./data.js?v=20261105-readable";
import {
  cleanName,
  createPlayer,
  loadPlayer,
  savePlayer,
  summary,
  answerQuestion,
} from "./state.js?v=20261105-readable";

const $ = (selector) => document.querySelector(selector);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
let storage;
function questionMarkup(text) {
  return text
    .split("，")
    .map(
      (part, index, parts) =>
        `<span class="question-phrase">${escape(part)}${index < parts.length - 1 ? "，" : ""}</span>`,
    )
    .join("");
}
try {
  storage = window.localStorage;
} catch {
  storage = {
    getItem: () => null,
    setItem: () => {
      throw new Error("Storage unavailable");
    },
  };
}
let player = loadPlayer(storage),
  selectedAvatar = player?.avatar ?? AVATARS[0].id,
  island = null,
  studio = null;
const TYPE_SIZE_KEY = "rotarylearning.poc.type-size.v1";
function applyTypeSize(value) {
  const large = value === "large";
  document.documentElement.dataset.typeSize = large ? "large" : "standard";
  document.querySelectorAll("[data-type-size-toggle]").forEach((button) => {
    button.textContent = large ? "特大字：開" : "特大字：關";
    button.setAttribute("aria-pressed", String(large));
    button.setAttribute(
      "aria-label",
      large ? "切換為一般大字" : "切換為特大字",
    );
  });
}
try {
  applyTypeSize(storage.getItem(TYPE_SIZE_KEY));
} catch {
  applyTypeSize("standard");
}
document.querySelectorAll("[data-type-size-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const value =
      document.documentElement.dataset.typeSize === "large"
        ? "standard"
        : "large";
    applyTypeSize(value);
    try {
      storage.setItem(TYPE_SIZE_KEY, value);
    } catch {
      /* The selected size still works for this visit. */
    }
  });
});
let currentZone = null,
  chosenAnswer = null,
  editing = false,
  paused = false,
  toastTimeout;
const syncModalPause = () =>
  island?.setPaused(paused || !!document.querySelector("dialog[open]"));
const modalObserver = new MutationObserver(syncModalPause);
document.querySelectorAll("dialog").forEach((dialog) =>
  modalObserver.observe(dialog, {
    attributes: true,
    attributeFilter: ["open"],
  }),
);

function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(
    () => $("#toast").classList.remove("is-visible"),
    4200,
  );
}
function persist() {
  const existing = loadPlayer(storage);
  if (existing && player && existing.createdAt === player.createdAt) {
    player.completed = { ...existing.completed, ...player.completed };
    player.visited = [...new Set([...existing.visited, ...player.visited])];
  }
  if (!savePlayer(storage, player)) {
    $("#storage-note").textContent = "暫時無法存檔，離開後會失去進度";
    toast("瀏覽器無法儲存紀錄。請允許本機儲存後再試。");
  }
  refresh();
}
window.addEventListener("storage", (event) => {
  if (event.key === TYPE_SIZE_KEY) {
    applyTypeSize(event.newValue);
    return;
  }
  if (event.key !== STORAGE_KEY) return;
  const updated = loadPlayer(storage);
  if (!updated || !player || updated.createdAt !== player.createdAt) return;
  player = updated;
  refresh();
});
function refresh() {
  const info = summary(player);
  $("#score").textContent = info.score;
  $("#player-name").textContent = player?.name ?? "";
  island?.setCompleted(player?.completed ?? {});
  renderPlaces();
}
function openDialog(id) {
  const dialog = $(`#${id}`);
  if (!dialog.open) dialog.showModal();
}
function portrait(avatar, extra = "") {
  return studio?.portraits[avatar]
    ? `<img src="${studio.portraits[avatar]}" alt="" ${extra}>`
    : '<span class="portrait-placeholder" aria-hidden="true">☺</span>';
}
function renderAvatars() {
  $("#avatar-grid").innerHTML = AVATARS.map(
    (avatar) =>
      `<button class="avatar-option" type="button" role="radio" aria-checked="${avatar.id === selectedAvatar}" data-avatar="${avatar.id}" aria-label="${avatar.name}，${avatar.style}">${portrait(avatar.id)}<strong>${avatar.name}</strong><span class="avatar-selection">${avatar.id === selectedAvatar ? "✓ 已選擇" : "點選人物"}</span></button>`,
  ).join("");
  studio?.select(AVATARS.find((item) => item.id === selectedAvatar));
}
function showOnboarding(edit = false) {
  editing = edit;
  selectedAvatar = player?.avatar ?? AVATARS[0].id;
  $("#nickname").value = player?.name ?? "";
  $("#onboard-error").textContent = "";
  $("#onboard-title").textContent = edit ? "更換人物與暱稱" : "選擇你的人物";
  $("#start-button").innerHTML = edit
    ? '儲存人物 <span aria-hidden="true">→</span>'
    : '開始我的探索 <span aria-hidden="true">→</span>';
  $("#cancel-edit").hidden = !edit;
  renderAvatars();
  openDialog("onboarding");
}
$("#avatar-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-avatar]");
  if (!button) return;
  selectedAvatar = button.dataset.avatar;
  renderAvatars();
  $("#avatar-grid").querySelector(`[data-avatar="${selectedAvatar}"]`)?.focus();
});
$("#avatar-grid").addEventListener("keydown", (event) => {
  if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key))
    return;
  event.preventDefault();
  const offset = { ArrowRight: 1, ArrowLeft: -1, ArrowUp: -3, ArrowDown: 3 }[
    event.key
  ];
  selectedAvatar =
    AVATARS[
      (AVATARS.findIndex((a) => a.id === selectedAvatar) +
        offset +
        AVATARS.length) %
        AVATARS.length
    ].id;
  renderAvatars();
  $("#avatar-grid").querySelector(`[data-avatar="${selectedAvatar}"]`)?.focus();
});
$("#player-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = cleanName($("#nickname").value);
  if (!name) {
    $("#onboard-error").textContent = "請先輸入你的暱稱。";
    $("#nickname").focus();
    return;
  }
  if (editing) {
    player = { ...player, name, avatar: selectedAvatar };
  } else player = createPlayer(name, selectedAvatar);
  persist();
  island?.setPlayer(
    AVATARS.find((a) => a.id === player.avatar),
    player.lastZone ?? "entry",
  );
  $("#journey-bar").hidden = true;
  $("#onboarding").close();
  $("#player-label").hidden = !island;
  toast(
    editing
      ? "人物已更新，點數與學習紀錄都保留了。"
      : `${player.name}，歡迎登島！點建築，開始第一個小挑戰。`,
  );
  if (editing) renderPassport();
  $("#places-button").focus();
});
$("#onboarding").addEventListener("cancel", (event) => {
  if (!player) event.preventDefault();
});
$("#cancel-edit").addEventListener("click", () => $("#onboarding").close());

function renderPlaces() {
  $("#places-list").innerHTML = ZONES.map(
    (zone) =>
      `<button class="place-option" type="button" data-destination="${zone.id}"><span aria-hidden="true">${zone.symbol}</span><span><strong>${zone.name}</strong><small>${zone.topic} · ${player?.completed[zone.id] ? "已完成，可複習" : `首次通過 +${REWARD} 點`}</small></span><span>${player?.completed[zone.id] ? "✓" : "→"}</span></button>`,
  ).join("");
}
function destination(id) {
  if (!player) {
    showOnboarding();
    return;
  }
  const zone = ZONES.find((z) => z.id === id);
  if (!zone) return;
  $("#places-dialog").close();
  $("#lesson-dialog").close();
  currentZone = zone;
  $("#journey-bar").hidden = false;
  $("#journey-text").textContent = `正在前往${zone.name}`;
  $("#enter-now").innerHTML = '直接進入 <span aria-hidden="true">→</span>';
  if (island) {
    island.goTo(id);
    $("#follow-button").setAttribute("aria-pressed", "true");
  } else arrive(id);
}
function arrive(id) {
  const zone = ZONES.find((z) => z.id === id);
  if (!zone || !player) return;
  currentZone = zone;
  if (!player.visited.includes(id)) player.visited.push(id);
  player.lastZone = id;
  persist();
  $("#journey-bar").hidden = false;
  $("#journey-text").textContent = `已抵達${zone.name}`;
  $("#enter-now").innerHTML = '開始學習 <span aria-hidden="true">→</span>';
  renderLesson();
  openDialog("lesson-dialog");
}
function renderLesson() {
  const z = currentZone;
  if (!z) return;
  $("#lesson-content").innerHTML =
    `<p class="lesson-eyebrow"><span aria-hidden="true">${z.symbol}</span> ${z.name} · 約 2 分鐘</p><h2 id="lesson-title" class="lesson-title">${z.title}</h2><p class="lesson-intro">${z.intro}</p><ol class="lesson-points">${z.points.map((p) => `<li>${p}</li>`).join("")}</ol><a class="source-link" href="${z.source[1]}" target="_blank" rel="noopener noreferrer">查看原始資料：${z.source[0]} ↗</a><button class="primary-button" type="button" data-start-quiz>開始答題 <span aria-hidden="true">→</span></button><div class="lesson-footer"><span>答對一題，即可完成這一區</span><span>${player.completed[z.id] ? "已領過點數，可再次複習" : `首次通過可獲得 ${REWARD} 點`}</span></div>`;
}
function renderQuiz() {
  chosenAnswer = null;
  const z = currentZone;
  $("#lesson-content").innerHTML =
    `<p class="lesson-eyebrow">${z.name} · 小測驗</p><h2 id="lesson-title">知識小挑戰</h2><p class="quiz-prompt">${questionMarkup(z.question)}</p><div class="answer-options" role="group" aria-label="答案選項">${z.options.map((option, index) => `<button class="answer-option" type="button" aria-pressed="false" data-answer="${index}"><span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span>${option}</button>`).join("")}</div><div id="quiz-feedback" aria-live="polite"></div><button class="primary-button" type="button" data-submit-answer disabled>選好後，確認答案 <span aria-hidden="true">→</span></button><button class="quiet-button" type="button" data-read-again>回看課程內容</button>`;
  $("#lesson-dialog").scrollTop = 0;
  $("#lesson-title").setAttribute("tabindex", "-1");
  $("#lesson-title").focus();
}
function submitAnswer() {
  if (chosenAnswer === null || !currentZone || !player) return;
  const result = answerQuestion(player, currentZone.id, chosenAnswer);
  if (!result.correct) {
    $("#quiz-feedback").innerHTML =
      '<div class="quiz-feedback is-wrong"><strong>再想想，你可以的。</strong>先回看課程重點，或選擇另一個答案再試一次。</div>';
    $("[data-submit-answer]").disabled = true;
    return;
  }
  player = result.player;
  persist();
  const info = summary(player);
  $("#lesson-content").innerHTML =
    `<div class="result-wrap"><p class="eyebrow">完成這一區的小挑戰</p><div class="reward-art"><span aria-hidden="true">✦</span>${result.awarded ? `+${result.awarded}` : "✓"}</div><h2 id="lesson-title">${result.awarded ? "答對了，挑戰完成！" : "複習完成！"}</h2><p>${escape(currentZone.explanation)}</p><span class="result-badge">${result.awarded ? `點數已存入學習護照，目前共 ${info.score} 點。` : "這一課已領過點數，複習不重複加點。"}</span>${info.count === ZONES.length ? '<div class="quiz-feedback"><strong>獲得「全島探索家」徽章</strong>五個學區都完成了！全島完成獎勵 20 點，已計入累積點數。</div>' : ""}<button class="primary-button" type="button" data-continue>回到校園，繼續探索 <span aria-hidden="true">→</span></button><button class="quiet-button" type="button" data-passport>查看我的學習護照</button></div>`;
  $("#lesson-dialog").scrollTop = 0;
}
$("#lesson-content").addEventListener("click", (event) => {
  if (event.target.closest("[data-start-quiz]")) renderQuiz();
  if (event.target.closest("[data-read-again]")) renderLesson();
  const answer = event.target.closest("[data-answer]");
  if (answer) {
    chosenAnswer = Number(answer.dataset.answer);
    document.querySelectorAll("[data-answer]").forEach((button) => {
      const selected = button === answer;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    $("[data-submit-answer]").disabled = false;
    $("#quiz-feedback").innerHTML = "";
  }
  if (event.target.closest("[data-submit-answer]")) submitAnswer();
  if (event.target.closest("[data-continue]")) {
    $("#lesson-dialog").close();
    $("#journey-bar").hidden = true;
    $("#places-button").focus();
  }
  if (event.target.closest("[data-passport]")) {
    $("#lesson-dialog").close();
    showPassport();
  }
});
function renderPassport() {
  if (!player) return;
  const info = summary(player);
  $("#passport-content").innerHTML =
    `<div class="passport-head">${portrait(player.avatar)}<div><h2 id="passport-title">我的學習護照</h2><p class="passport-owner">${escape(player.name)}</p><p>${info.badge} · 本機存檔</p></div></div><div class="passport-stats"><div><strong>${info.score}<small> 點</small></strong><span>累積點數</span></div><div><strong>${info.count}<small> / ${info.total} 區</small></strong><span>完成學區</span></div></div><div class="passport-progress" role="progressbar" aria-label="學區完成進度" aria-valuenow="${info.count}" aria-valuemin="0" aria-valuemax="${info.total}"><span style="width:${(info.count / info.total) * 100}%"></span></div><p class="passport-section-title">你的學區印章</p><div class="stamp-list">${ZONES.map((z) => `<div class="stamp ${player.completed[z.id] ? "earned" : ""}"><span aria-hidden="true">${z.symbol}</span>${z.name}<small>${player.completed[z.id] ? "✓ 已完成" : "尚未完成"}</small></div>`).join("")}</div><div class="passport-note"><strong>${info.count === info.total ? "已獲得「全島探索家」徽章" : `再完成 ${info.total - info.count} 區，就能成為全島探索家`}</strong>每區首次答對獲得 ${REWARD} 點；全島首次完成，再獲得 ${ISLAND_BONUS} 點。重複答題不會再加點。<br>試玩紀錄只保存在這個瀏覽器，不代表正式社員認證或學分。</div><div class="passport-actions"><button class="secondary-button" type="button" id="edit-player">更換人物與暱稱</button><button class="secondary-button" type="button" id="download-save">匯出測試紀錄</button></div>`;
}
function showPassport() {
  if (!player) {
    showOnboarding();
    return;
  }
  renderPassport();
  openDialog("passport-dialog");
}
$("#passport-content").addEventListener("click", (event) => {
  if (event.target.closest("#edit-player")) {
    $("#passport-dialog").close();
    showOnboarding(true);
  }
  if (event.target.closest("#download-save")) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(player, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rotarylearning-poc-save.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    toast("存檔已匯出，可保留作為測試紀錄。");
  }
});
$("#places-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-destination]");
  if (button) destination(button.dataset.destination);
});
$("#places-button").addEventListener("click", () => {
  if (!player) showOnboarding();
  else {
    renderPlaces();
    openDialog("places-dialog");
  }
});
$("#passport-button").addEventListener("click", showPassport);
$("#overview-button").addEventListener("click", () => {
  island?.overview();
  $("#follow-button").setAttribute("aria-pressed", "false");
});
$("#follow-button").addEventListener("click", () => {
  const next = $("#follow-button").getAttribute("aria-pressed") !== "true";
  island?.setFollow(next);
  $("#follow-button").setAttribute("aria-pressed", String(next));
});
$("#pause-button").addEventListener("click", () => {
  paused = !paused;
  syncModalPause();
  $("#pause-button").setAttribute("aria-pressed", String(paused));
  $("#pause-button").innerHTML = paused
    ? '<span aria-hidden="true">▶</span><span>繼續</span>'
    : '<span aria-hidden="true">Ⅱ</span><span>暫停</span>';
});
$("#enter-now").addEventListener("click", () => {
  if (!currentZone) return;
  if (island) island.enterNow();
  else arrive(currentZone.id);
});
document.querySelectorAll("[data-close]").forEach((button) =>
  button.addEventListener("click", () => {
    $(`#${button.dataset.close}`).close();
  }),
);
for (const dialog of document.querySelectorAll("dialog:not(#onboarding)"))
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
const touchHint = matchMedia("(max-width: 720px), (pointer: coarse)");
function updateMapHint() {
  $("#map-hint").textContent = touchHint.matches
    ? "拖曳地圖 · 雙指縮放"
    : "拖曳旋轉 · 滾輪縮放 · 右鍵平移";
}
touchHint.addEventListener("change", updateMapHint);
updateMapHint();

async function boot() {
  if (!player) showOnboarding();
  try {
    const module = await import("./scene.js?v=20261105-readable");
    try {
      studio = module.createAvatarStudio($("#avatar-preview"));
      renderAvatars();
    } catch (error) {
      console.warn("Avatar preview unavailable:", error.message);
    }
    island = module.createIsland({
      canvas: $("#scene"),
      labels: $("#labels"),
      onDestination: destination,
      onArrival: arrive,
      onUserCamera: () =>
        $("#follow-button").setAttribute("aria-pressed", "false"),
    });
    syncModalPause();
    if (player) {
      island.setPlayer(
        AVATARS.find((a) => a.id === player.avatar),
        player.lastZone ?? "entry",
      );
      toast(`歡迎回來，${player.name}。你的學習紀錄都在這裡。`);
    }
  } catch (error) {
    console.error("3D scene unavailable:", error);
    $("#scene-fallback").hidden = false;
    $("#scene").hidden = true;
    $("#player-label").hidden = true;
    toast("3D 暫時無法開啟，仍可按「選擇學區」完成挑戰。");
  } finally {
    $("#scene-loading").hidden = true;
    refresh();
  }
}
boot();
