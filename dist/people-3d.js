import * as THREE from "./vendor/three.module.min.js";

const canvas = document.querySelector("#peopleCanvas");
const stage = document.querySelector(".map-stage");
const labelLayer = document.querySelector("#peopleLabels");

if (!canvas || !stage || !labelLayer) throw new Error("3D people stage is missing");

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-50, 50, 28.125, -28.125, 0.1, 200);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

scene.add(new THREE.HemisphereLight(0xfff6df, 0x55728d, 2.5));
const keyLight = new THREE.DirectionalLight(0xfff2d2, 3.4);
keyLight.position.set(-20, 35, 45);
scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0x8fc9ff, 1.25);
fillLight.position.set(28, 8, 35);
scene.add(fillLight);

const points = {
  gate: [50, 88], bridgeTop: [50, 70], circleSouth: [50, 62], circleSouthWest: [43, 60],
  circleWest: [38, 53], circleNorthWest: [39, 40], circleNorth: [50, 37], circleNorthEast: [61, 40],
  circleEast: [65, 52], circleSouthEast: [61, 59], principalJunction: [33, 39], principal: [24, 33],
  classroom: [50, 34], libraryJunction: [67, 39], library: [74, 35], auditoriumJunction: [68, 58],
  auditorium: [75, 65], parkEntry: [33, 52], garden: [29, 47], parkBench: [20, 54],
  parkTree: [25, 60], parkPath: [32, 62],
};

const profiles = [
  {
    id: "governor", label: "總監", skin: 0xe7ad82, hair: 0xd9d5cf, shirt: 0x174991, pants: 0x203d64, accent: 0xf8b832,
    route: ["principal", "principalJunction", "circleNorthWest", "circleNorth", "classroom", "circleNorth", "circleNorthEast", "circleEast", "auditoriumJunction", "auditorium", "auditoriumJunction", "circleSouthEast", "circleSouth", "circleSouthWest", "circleWest", "circleNorthWest", "principalJunction"],
    stops: ["principal", "classroom", "auditorium"], messages: ["早安！", "來看看課程", "社友們好"], speed: 3.0, style: "governor",
  },
  {
    id: "assistant", label: "助理總監", skin: 0xf0b58d, hair: 0x3a251f, shirt: 0xf07f67, pants: 0x324c72, accent: 0xfff2d0,
    route: ["library", "libraryJunction", "circleNorthEast", "circleNorth", "classroom", "circleNorth", "circleNorthWest", "principalJunction", "principal", "principalJunction", "circleNorthWest", "circleNorth", "circleNorthEast", "libraryJunction"],
    stops: ["library", "classroom", "principal"], messages: ["找份資料", "一起學習", "等等見！"], speed: 3.15, style: "assistant",
  },
  {
    id: "member", label: "社友", skin: 0xd69a71, hair: 0x433028, shirt: 0x65bea7, pants: 0x334f70, accent: 0xfff6db,
    route: ["gate", "bridgeTop", "circleSouth", "circleSouthEast", "circleEast", "circleNorthEast", "libraryJunction", "library", "libraryJunction", "circleNorthEast", "circleNorth", "classroom", "circleNorth", "circleNorthWest", "circleWest", "circleSouthWest", "circleSouth", "bridgeTop"],
    stops: ["gate", "library", "classroom"], messages: ["來學新知", "去圖書室", "服務出發"], speed: 3.4, style: "member",
  },
  {
    id: "reader", label: "閱讀中", skin: 0xedb38a, hair: 0x463027, shirt: 0x9676cf, pants: 0xf4ead5, accent: 0x5b3a69,
    route: ["parkBench", "garden", "parkEntry", "circleWest", "circleSouthWest", "parkPath", "parkTree"],
    stops: ["parkBench", "garden"], messages: ["閱讀中 📖", "找到好書", "筆記一下"], speed: 2.65, style: "reader",
  },
  {
    id: "gardener", label: "照顧花園", skin: 0xe3a979, hair: 0xd3cec4, shirt: 0x8cab79, pants: 0x8f806b, accent: 0xe9a735,
    route: ["parkTree", "parkPath", "circleSouthWest", "circleWest", "parkEntry", "garden", "parkBench"],
    stops: ["parkTree", "garden", "parkBench"], messages: ["幫花澆水", "花開了！", "整理花園"], speed: 2.55, style: "gardener",
  },
  {
    id: "photographer", label: "記錄校園", skin: 0xa96c4d, hair: 0x241a18, shirt: 0xe96f5f, pants: 0x355984, accent: 0xfff3d2,
    route: ["garden", "parkEntry", "circleWest", "circleSouthWest", "circleSouth", "circleSouthEast", "circleEast", "circleNorthEast", "circleNorth", "circleNorthWest", "circleWest", "parkEntry"],
    stops: ["garden", "circleEast"], messages: ["拍張照片 📷", "風景真好", "笑一個！"], speed: 3.05, style: "photographer",
  },
];

const materialCache = new Map();
const material = (color, roughness = 0.72) => {
  const key = `${color}-${roughness}`;
  if (!materialCache.has(key)) materialCache.set(key, new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 }));
  return materialCache.get(key);
};

const rounded = new THREE.CapsuleGeometry(0.5, 0.7, 5, 12);
const sphere = new THREE.SphereGeometry(0.5, 20, 14);
const smallSphere = new THREE.SphereGeometry(0.5, 12, 8);
const box = new THREE.BoxGeometry(1, 1, 1);
const cylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 14);
const torus = new THREE.TorusGeometry(0.5, 0.1, 8, 18);
const smile = new THREE.TorusGeometry(0.5, 0.1, 8, 18, Math.PI);
const shadowGeometry = new THREE.CircleGeometry(0.5, 28);

function part(geometry, color, position, scale, parent, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material(color));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

function createLimb(color, side, y, parent) {
  const pivot = new THREE.Group();
  pivot.position.set(side, y, 0);
  parent.add(pivot);
  const limb = part(rounded, color, [0, -0.22, 0], [0.17, 0.42, 0.17], pivot);
  return { pivot, limb };
}

function createPerson(profile, index) {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);
  scene.add(root);

  const shadow = new THREE.Mesh(shadowGeometry, new THREE.MeshBasicMaterial({ color: 0x183249, transparent: true, opacity: 0.2, depthWrite: false }));
  shadow.scale.set(0.65, 0.19, 1);
  shadow.position.set(0, 0.02, -0.8);
  root.add(shadow);

  const legL = createLimb(profile.pants, -0.16, 0.62, body).pivot;
  const legR = createLimb(profile.pants, 0.16, 0.62, body).pivot;
  part(box, 0x5b3a2a, [0, -0.42, 0.08], [0.38, 0.18, 0.58], legL);
  part(box, 0x5b3a2a, [0, -0.42, 0.08], [0.38, 0.18, 0.58], legR);

  part(rounded, profile.shirt, [0, 1.05, 0], [0.56, 0.62, 0.46], body);
  if (profile.style === "governor") {
    part(box, profile.accent, [0, 1.12, 0.49], [0.1, 0.42, 0.04], body);
    part(smallSphere, profile.accent, [0.28, 1.24, 0.46], [0.07, 0.07, 0.035], body);
  }
  if (profile.style === "gardener") part(box, profile.accent, [0, 1.03, 0.48], [0.48, 0.5, 0.04], body);

  const armL = createLimb(profile.shirt, -0.44, 1.3, body).pivot;
  const armR = createLimb(profile.shirt, 0.44, 1.3, body).pivot;
  part(smallSphere, profile.skin, [0, -0.47, 0], [0.17, 0.17, 0.17], armL);
  part(smallSphere, profile.skin, [0, -0.47, 0], [0.17, 0.17, 0.17], armR);

  const head = new THREE.Group();
  head.position.set(0, 1.93, 0);
  body.add(head);
  part(sphere, profile.skin, [0, 0, 0], [0.55, 0.58, 0.52], head);
  part(sphere, profile.hair, [0, 0.18, -0.08], [0.58, 0.46, 0.53], head);
  part(sphere, profile.skin, [0, -0.08, 0.08], [0.5, 0.45, 0.49], head);
  for (const x of [-0.19, 0.19]) {
    part(smallSphere, 0xffffff, [x, 0.03, 0.48], [0.12, 0.14, 0.07], head);
    part(smallSphere, 0x162a3a, [x, 0.03, 0.535], [0.052, 0.065, 0.03], head);
  }
  part(smallSphere, profile.skin, [0, -0.08, 0.52], [0.07, 0.08, 0.06], head);
  part(smile, 0xa94f51, [0, -0.2, 0.49], [0.12, 0.07, 0.08], head, [0, 0, Math.PI]);
  part(smallSphere, 0xf09a94, [-0.28, -0.12, 0.46], [0.08, 0.045, 0.025], head);
  part(smallSphere, 0xf09a94, [0.28, -0.12, 0.46], [0.08, 0.045, 0.025], head);

  if (profile.style === "assistant") part(sphere, profile.hair, [0, 0.05, -0.25], [0.68, 0.5, 0.25], head);
  if (profile.style === "member") part(box, 0xd8bf9b, [0.48, 0.98, 0], [0.18, 0.55, 0.36], body, [0, 0, -0.18]);
  if (profile.style === "reader") {
    const book = part(box, 0x65417a, [0, 1.12, 0.62], [0.62, 0.42, 0.08], body, [-0.18, 0, 0]);
    book.rotation.z = 0.06;
  }
  if (profile.style === "gardener") {
    part(cylinder, 0x3ba7a6, [-0.48, 0.72, 0.1], [0.28, 0.34, 0.28], body);
    part(torus, 0x3ba7a6, [-0.48, 1.0, 0.1], [0.28, 0.28, 0.2], body, [Math.PI / 2, 0, 0]);
    part(cylinder, 0xe0bd72, [0, 2.45, 0], [0.66, 0.08, 0.66], body);
  }
  if (profile.style === "photographer") {
    part(box, 0x2c333b, [0, 1.04, 0.64], [0.38, 0.25, 0.2], body);
    part(cylinder, 0x18202a, [0, 1.04, 0.78], [0.14, 0.12, 0.14], body, [Math.PI / 2, 0, 0]);
  }

  const label = document.createElement("div");
  label.className = "three-person-label";
  label.innerHTML = `<strong>${profile.label}</strong><span></span>`;
  labelLayer.appendChild(label);

  return {
    profile, root, body, head, armL, armR, legL, legR, shadow, label,
    segment: index % profile.route.length, progress: (index * 0.17) % 1, wait: index * 0.28,
    phase: index * 1.13, yaw: 0, messageIndex: 0,
  };
}

const people = profiles.map(createPerson);
const clock = new THREE.Clock();
let paused = reducedMotion.matches;
let elapsed = 0;

function mapToWorld(name) {
  const [x, y] = points[name];
  return new THREE.Vector3(x - 50, (50 - y) * 0.5625, (y - 50) * 0.12);
}

function shortestAngle(from, to) {
  let delta = (to - from + Math.PI) % (Math.PI * 2) - Math.PI;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta;
}

function updateLabel(person) {
  const p = person.root.position.clone();
  p.y += 3.15 * person.root.scale.y;
  p.project(camera);
  person.label.style.left = `${(p.x * 0.5 + 0.5) * 100}%`;
  person.label.style.top = `${(-p.y * 0.5 + 0.5) * 100}%`;
  person.label.style.zIndex = String(100 + Math.round(person.root.position.z * 10));
}

function arrive(person, name) {
  if (!person.profile.stops.includes(name)) return;
  person.wait = 1.8 + ((person.segment + person.phase) % 2.4);
  person.messageIndex = (person.messageIndex + 1) % person.profile.messages.length;
  person.label.querySelector("span").textContent = person.profile.messages[person.messageIndex];
  person.label.classList.add("is-visible");
}

function animatePerson(person, dt, time) {
  const route = person.profile.route;
  const fromName = route[person.segment % route.length];
  const nextIndex = (person.segment + 1) % route.length;
  const toName = route[nextIndex];
  const from = mapToWorld(fromName);
  const to = mapToWorld(toName);
  const distance = from.distanceTo(to);
  let moving = !paused && person.wait <= 0;

  if (!paused && person.wait > 0) {
    person.wait -= dt;
    if (person.wait <= 0) person.label.classList.remove("is-visible");
  } else if (moving) {
    person.progress += (dt * person.profile.speed) / Math.max(distance, 0.01);
    while (person.progress >= 1) {
      person.progress -= 1;
      person.segment = nextIndex;
      arrive(person, toName);
      if (person.wait > 0) break;
    }
  }

  const currentFrom = mapToWorld(route[person.segment % route.length]);
  const currentTo = mapToWorld(route[(person.segment + 1) % route.length]);
  person.root.position.lerpVectors(currentFrom, currentTo, person.progress);
  const mapY = 50 - person.root.position.y / 0.5625;
  const perspectiveScale = 1.95 + mapY * 0.0065;
  person.root.scale.setScalar(perspectiveScale);

  const dx = currentTo.x - currentFrom.x;
  const dy = currentTo.y - currentFrom.y;
  let targetYaw;
  if (Math.abs(dx) > Math.abs(dy) * 0.7) targetYaw = dx > 0 ? Math.PI / 2 : -Math.PI / 2;
  else targetYaw = dy > 0 ? 0 : Math.PI;
  person.yaw = shortestAngle(person.yaw, targetYaw);
  person.yaw += (targetYaw - person.yaw) * Math.min(1, dt * 7);
  person.body.rotation.y = person.yaw;

  moving = moving && person.wait <= 0;
  const stride = Math.sin(time * 9.5 + person.phase * 7) * (moving ? 0.62 : 0.05);
  person.legL.rotation.x = stride;
  person.legR.rotation.x = -stride;
  person.armL.rotation.x = -stride * 0.78;
  person.armR.rotation.x = stride * 0.78;
  person.body.position.y = moving ? Math.abs(Math.sin(time * 9.5 + person.phase * 7)) * 0.075 : Math.sin(time * 2 + person.phase) * 0.025;
  person.head.rotation.z = Math.sin(time * 2.1 + person.phase) * 0.035;
  if (!moving && person.profile.style === "assistant") person.armL.rotation.z = 1.7 + Math.sin(time * 4.5) * 0.25;
  else person.armL.rotation.z = 0;
  if (!moving && person.profile.style === "photographer") {
    person.armL.rotation.x = -1.0;
    person.armR.rotation.x = -1.0;
  }
  person.shadow.scale.x = 0.62 + Math.abs(stride) * 0.08;
  person.shadow.material.opacity = moving ? 0.18 : 0.22;
  updateLabel(person);
}

function resize() {
  const { width, height } = stage.getBoundingClientRect();
  renderer.setSize(Math.max(1, width), Math.max(1, height), false);
}

function frame() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!paused) elapsed += dt;
  for (const person of people) animatePerson(person, dt, elapsed);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

window.addEventListener("resize", resize, { passive: true });
window.addEventListener("rotary-motion", (event) => { paused = Boolean(event.detail?.paused) || reducedMotion.matches; });
reducedMotion.addEventListener("change", () => { paused = reducedMotion.matches || document.body.classList.contains("motion-paused"); });
resize();
frame();
