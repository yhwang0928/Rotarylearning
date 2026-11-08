import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AVATARS, ZONES, STORAGE_KEY } from "../dist/poc/data.js";
import { GUEST_CHARACTERS } from "../dist/poc/guest-characters.js";
import {
  cleanName,
  createPlayer,
  answerQuestion,
  summary,
  validatePlayer,
  loadPlayer,
  savePlayer,
} from "../dist/poc/state.js";
import { NODES, EDGES, findRoute } from "../dist/poc/routes.js";

test("a player keeps character and name after a save/load round trip", () => {
  const entries = new Map(),
    storage = {
      getItem: (key) => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, value),
    };
  let player = createPlayer(" 社友小安 ", "lilac");
  player = answerQuestion(player, ZONES[0].id, ZONES[0].answer).player;
  assert.equal(savePlayer(storage, player), true);
  const restored = loadPlayer(storage);
  assert.equal(restored.name, "社友小安");
  assert.equal(restored.avatar, "lilac");
  assert.equal(summary(restored).score, 10);
  assert.ok(entries.has(STORAGE_KEY));
});
test("names are required, accept Unicode and are limited by characters rather than bytes", () => {
  assert.throws(() => createPlayer("   ", "blue"));
  assert.throws(() => createPlayer("社友", "unknown"));
  assert.equal(Array.from(cleanName("🌱".repeat(20))).length, 12);
  assert.equal(cleanName("\u0000社友\u0007"), "社友");
});
test("wrong answers and repeated correct submissions do not award extra points", () => {
  const player = createPlayer("測試社員", "blue"),
    zone = ZONES[0];
  const wrong = answerQuestion(player, zone.id, (zone.answer + 1) % 3);
  assert.equal(wrong.correct, false);
  assert.equal(summary(wrong.player).score, 0);
  const first = answerQuestion(player, zone.id, zone.answer);
  assert.equal(first.awarded, 10);
  const retry = answerQuestion(first.player, zone.id, zone.answer);
  assert.equal(retry.awarded, 0);
  assert.equal(summary(retry.player).score, 10);
});
test("completing all five zones gives one bonus and preserves score when changing appearance", () => {
  let player = createPlayer("探索家", "green");
  for (const zone of ZONES)
    player = answerQuestion(player, zone.id, zone.answer).player;
  assert.deepEqual(summary(player), {
    count: 5,
    total: 5,
    score: 70,
    badge: "全島探索家",
  });
  for (const zone of ZONES)
    assert.equal(answerQuestion(player, zone.id, zone.answer).awarded, 0);
  player.avatar = AVATARS[5].id;
  player.name = "新名字";
  assert.equal(summary(validatePlayer(player)).score, 70);
});
test("corrupt saves, unknown awards and unsupported storage fail safely", () => {
  assert.equal(loadPlayer({ getItem: () => "{broken json" }), null);
  assert.equal(
    loadPlayer({
      getItem: () => {
        throw new Error("denied");
      },
    }),
    null,
  );
  assert.equal(
    savePlayer(
      {
        setItem: () => {
          throw new Error("quota");
        },
      },
      createPlayer("小安", "blue"),
    ),
    false,
  );
  assert.equal(validatePlayer({ version: 1, name: "", avatar: "blue" }), null);
  const clean = validatePlayer({
    ...createPlayer("小安", "blue"),
    score: 9999,
    completed: { fake: "2026-01-01", library: "not a date" },
    visited: ["fake"],
  });
  assert.equal(summary(clean).score, 0);
  assert.deepEqual(clean.visited, []);
});
test("all destinations can be reached using only explicit road edges", () => {
  for (const a of Object.keys(NODES))
    for (const b of Object.keys(NODES)) {
      const route = findRoute(a, b);
      assert.equal(route[0], a);
      assert.equal(route.at(-1), b);
      for (let i = 1; i < route.length; i++)
        assert.ok(
          EDGES.some(
            ([x, y]) =>
              (x === route[i - 1] && y === route[i]) ||
              (y === route[i - 1] && x === route[i]),
          ),
        );
    }
});
test("guest character assets are deployable GLB files with their requested clips", () => {
  assert.equal(GUEST_CHARACTERS.length, 3);
  for (const guest of GUEST_CHARACTERS) {
    assert.ok(guest.speed > 0);
    assert.ok(guest.pause[0] > 0 && guest.pause[1] > guest.pause[0]);
    assert.ok(guest.patrol.length >= 2);
    assert.deepEqual(guest.patrol[0], [guest.position[0], guest.position[2]]);
    const file = readFileSync(
      new URL(`../dist/poc/${guest.model.replace("./", "")}`, import.meta.url),
    );
    assert.equal(file.subarray(0, 4).toString(), "glTF");
    const jsonLength = file.readUInt32LE(12);
    const document = JSON.parse(file.subarray(20, 20 + jsonLength).toString());
    for (const requiredClip of ["idle", "walk"])
      assert.ok(document.animations.some((clip) => clip.name === requiredClip));
  }
});
