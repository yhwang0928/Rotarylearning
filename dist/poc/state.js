import { AVATARS, ZONES, REWARD, ISLAND_BONUS, STORAGE_KEY } from "./data.js";

export function cleanName(value) {
  return Array.from(
    String(value ?? "")
      .trim()
      .replace(/[\u0000-\u001f\u007f-\u009f]/g, ""),
  )
    .slice(0, 12)
    .join("");
}

export function createPlayer(name, avatar, now = new Date().toISOString()) {
  const nickname = cleanName(name);
  if (!nickname) throw new Error("請先輸入你的暱稱。");
  if (!AVATARS.some((item) => item.id === avatar))
    throw new Error("請選擇一位人物。");
  return {
    version: 1,
    name: nickname,
    avatar,
    createdAt: now,
    completed: {},
    visited: [],
    lastZone: null,
  };
}

export function validatePlayer(value) {
  if (
    !value ||
    value.version !== 1 ||
    !cleanName(value.name) ||
    !AVATARS.some((item) => item.id === value.avatar)
  )
    return null;
  const player = createPlayer(
    value.name,
    value.avatar,
    typeof value.createdAt === "string" ? value.createdAt : undefined,
  );
  for (const zone of ZONES) {
    if (
      typeof value.completed?.[zone.id] === "string" &&
      Number.isFinite(Date.parse(value.completed[zone.id]))
    )
      player.completed[zone.id] = value.completed[zone.id];
  }
  player.visited = ZONES.filter(
    (zone) => Array.isArray(value.visited) && value.visited.includes(zone.id),
  ).map((zone) => zone.id);
  player.lastZone = ZONES.some((zone) => zone.id === value.lastZone)
    ? value.lastZone
    : null;
  return player;
}

export function summary(player) {
  const count = ZONES.filter((zone) => player?.completed?.[zone.id]).length;
  return {
    count,
    total: ZONES.length,
    score: count * REWARD + (count === ZONES.length ? ISLAND_BONUS : 0),
    badge:
      count === ZONES.length ? "全島探索家" : count ? "知識學員" : "探索新生",
  };
}

export function answerQuestion(
  player,
  zoneId,
  answer,
  now = new Date().toISOString(),
) {
  const zone = ZONES.find((item) => item.id === zoneId);
  if (
    !zone ||
    !Number.isInteger(answer) ||
    answer < 0 ||
    answer >= zone.options.length
  )
    throw new Error("請選擇一個有效的答案。");
  if (answer !== zone.answer) return { correct: false, awarded: 0, player };
  const next = validatePlayer(player);
  if (!next) throw new Error("請先建立人物。");
  const before = summary(next).score;
  if (!next.completed[zoneId]) next.completed[zoneId] = now;
  return { correct: true, awarded: summary(next).score - before, player: next };
}

export function loadPlayer(storage) {
  try {
    return validatePlayer(JSON.parse(storage.getItem(STORAGE_KEY) ?? "null"));
  } catch {
    return null;
  }
}

export function savePlayer(storage, player) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(player));
    return true;
  } catch {
    return false;
  }
}
