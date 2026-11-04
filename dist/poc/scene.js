import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { AVATARS, ZONES } from "./data.js?v=20261105-readable";
import { NODES, EDGES, findRoute } from "./routes.js";

const C = {
  cream: 0xf4e9cc,
  trim: 0xfff6df,
  blue: 0x3b68a0,
  gold: 0xd4ad5b,
  grass: 0xa1bb78,
  stone: 0xe6cfac,
  dark: 0x364b52,
  wood: 0xa77b50,
};
const materials = new Map();
function material(color, extra = {}) {
  const key = JSON.stringify([color, extra]);
  if (!materials.has(key))
    materials.set(
      key,
      new THREE.MeshStandardMaterial({ color, roughness: 0.86, ...extra }),
    );
  return materials.get(key);
}
function mesh(geometry, color, parent, x = 0, y = 0, z = 0, extra) {
  const object = new THREE.Mesh(geometry, material(color, extra));
  object.position.set(x, y, z);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}
function box(parent, w, h, d, color, x = 0, y = 0, z = 0) {
  return mesh(new THREE.BoxGeometry(w, h, d), color, parent, x, y, z);
}
function ball(parent, r, color, x = 0, y = 0, z = 0, scale) {
  const object = mesh(
    new THREE.SphereGeometry(r, 16, 12),
    color,
    parent,
    x,
    y,
    z,
  );
  if (scale) object.scale.set(...scale);
  return object;
}
function cylinder(
  parent,
  rt,
  rb,
  h,
  color,
  x = 0,
  y = 0,
  z = 0,
  segments = 24,
) {
  return mesh(
    new THREE.CylinderGeometry(rt, rb, h, segments),
    color,
    parent,
    x,
    y,
    z,
  );
}
function ring(parent, r, thickness, color, x, y, z, horizontal = false) {
  const object = mesh(
    new THREE.TorusGeometry(r, thickness, 6, 48),
    color,
    parent,
    x,
    y,
    z,
  );
  if (horizontal) object.rotation.x = -Math.PI / 2;
  return object;
}
function group(parent, x = 0, y = 0, z = 0) {
  const object = new THREE.Group();
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}

export function createAvatar(config) {
  const root = new THREE.Group(),
    rig = group(root);
  const torso = mesh(
    new THREE.CapsuleGeometry(0.215, 0.29, 4, 12),
    config.coat,
    rig,
    0,
    0.95,
    0,
  );
  torso.scale.z = 0.78;
  box(rig, 0.12, 0.3, 0.025, 0xfff4df, 0, 1.03, 0.175);
  const tie = mesh(
    new THREE.ConeGeometry(0.047, 0.18, 3),
    config.accent,
    rig,
    0,
    1.01,
    0.207,
  );
  tie.rotation.z = Math.PI;
  cylinder(rig, 0.075, 0.08, 0.12, config.skin, 0, 1.24, 0, 12);
  const head = group(rig, 0, 1.51, 0.015);
  ball(head, 0.335, config.skin, 0, 0, 0, [1, 1.06, 0.89]);
  ball(head, 0.075, config.skin, -0.325, -0.01, 0, [0.65, 1, 0.65]);
  ball(head, 0.075, config.skin, 0.325, -0.01, 0, [0.65, 1, 0.65]);
  const hairCap = mesh(
    new THREE.SphereGeometry(0.348, 16, 12, 0, Math.PI * 2, 0, 1.3),
    config.hair,
    head,
    0,
    0.025,
    -0.025,
  );
  hairCap.scale.z = 0.92;
  ball(head, 0.2, config.hair, -0.15, 0.16, 0.18, [1.05, 0.55, 0.6]);
  ball(head, 0.15, config.hair, 0.115, 0.21, 0.16, [1.1, 0.55, 0.65]);
  if (config.bob) {
    ball(head, 0.2, config.hair, -0.27, -0.055, -0.06, [0.65, 1.3, 0.9]);
    ball(head, 0.2, config.hair, 0.27, -0.055, -0.06, [0.65, 1.3, 0.9]);
  }
  for (const side of [-1, 1]) {
    ball(head, 0.026, 0x2b302d, side * 0.115, 0.015, 0.288, [1, 1.2, 0.65]);
    ball(head, 0.027, 0xe49c88, side * 0.19, -0.08, 0.254, [1.45, 0.6, 0.32]);
    const brow = box(
      head,
      0.064,
      0.012,
      0.012,
      config.hair,
      side * 0.114,
      0.085,
      0.282,
    );
    brow.rotation.z = side * 0.08;
    if (config.glasses)
      ring(head, 0.074, 0.011, 0x514d43, side * 0.116, 0.016, 0.306);
  }
  if (config.glasses) box(head, 0.085, 0.013, 0.015, 0x514d43, 0, 0.02, 0.309);
  ball(head, 0.038, config.skin, 0, -0.04, 0.303, [0.8, 0.8, 1]);
  const smile = mesh(
    new THREE.TorusGeometry(0.056, 0.008, 4, 18, Math.PI * 0.8),
    0x9e6251,
    head,
    0,
    -0.095,
    0.287,
  );
  smile.rotation.z = Math.PI * 1.1;
  const arms = [],
    legs = [];
  for (const side of [-1, 1]) {
    const arm = group(rig, side * 0.265, 1.11, 0);
    arms.push(arm);
    const sleeve = mesh(
      new THREE.CapsuleGeometry(0.075, 0.24, 3, 8),
      config.coat,
      arm,
      0,
      -0.16,
      0,
    );
    sleeve.rotation.z = -side * 0.08;
    ball(arm, 0.079, config.skin, side * 0.015, -0.36, 0.015);
    const leg = group(rig, side * 0.125, 0.66, 0);
    legs.push(leg);
    mesh(
      new THREE.CapsuleGeometry(0.081, 0.32, 3, 8),
      config.pants,
      leg,
      0,
      -0.23,
      0,
    );
    ball(leg, 0.11, 0x4b443d, 0, -0.475, 0.045, [0.85, 0.62, 1.4]);
  }
  ball(rig, 0.034, config.accent, -0.122, 1.09, 0.167, [1, 1, 0.35]);
  root.userData = {
    rig,
    arms,
    legs,
    config,
    phase: Math.random() * 6,
    moving: false,
    activity: "idle",
  };
  return root;
}

function animateAvatar(root, t, moving, activity = "idle") {
  const { rig, arms, legs, phase } = root.userData;
  const wave = moving ? Math.sin(t * 9 + phase) : 0;
  arms[0].rotation.x = THREE.MathUtils.lerp(
    arms[0].rotation.x,
    wave * 0.6,
    0.25,
  );
  arms[1].rotation.x = THREE.MathUtils.lerp(
    arms[1].rotation.x,
    -wave * 0.6,
    0.25,
  );
  legs[0].rotation.x = -wave * 0.45;
  legs[1].rotation.x = wave * 0.45;
  rig.position.y = moving
    ? Math.abs(Math.sin(t * 9 + phase)) * 0.055
    : Math.sin(t * 1.7 + phase) * 0.015;
  arms[0].rotation.z = activity === "water" ? -0.55 : 0.07;
  arms[1].rotation.z = activity === "read" ? -0.35 : -0.07;
  if (activity === "read") {
    arms[0].rotation.x = -0.8;
    arms[1].rotation.x = -0.8;
  }
  if (activity === "wave") {
    arms[1].rotation.z = -2.15 + Math.sin(t * 4) * 0.15;
  }
}

export function createAvatarStudio(container) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(320, 400, false);
  renderer.setPixelRatio(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff7de, 0xb0c0ae, 2.7));
  const light = new THREE.DirectionalLight(0xffefda, 3);
  light.position.set(-3, 5, 6);
  scene.add(light);
  const camera = new THREE.OrthographicCamera(-0.9, 0.9, 1.13, -1.13, 0.1, 30);
  camera.position.set(3, 2.4, 7);
  camera.lookAt(0, 1, 0);
  let avatar;
  const portraits = {};
  for (const config of AVATARS) {
    const model = createAvatar(config);
    scene.add(model);
    renderer.render(scene, camera);
    portraits[config.id] = renderer.domElement.toDataURL("image/png");
    scene.remove(model);
    model.traverse((o) => o.geometry?.dispose());
  }
  container.append(renderer.domElement);
  function select(config) {
    if (avatar) {
      scene.remove(avatar);
      avatar.traverse((o) => o.geometry?.dispose());
    }
    avatar = createAvatar(config);
    scene.add(avatar);
    renderer.render(scene, camera);
  }
  select(AVATARS[0]);
  return { portraits, select };
}

function windowFrame(parent, x, y, z, w = 0.55, h = 0.8) {
  box(parent, w + 0.12, h + 0.12, 0.12, C.trim, x, y, z);
  box(parent, w, h, 0.13, 0x90b9bd, x, y, z + 0.02);
  box(parent, 0.05, h, 0.14, C.gold, x, y, z + 0.09);
  box(parent, w, 0.045, 0.14, C.gold, x, y, z + 0.09);
}
function roof(parent, w, d, y, h) {
  const shape = new THREE.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(0, h);
  shape.lineTo(w / 2, 0);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: false,
  });
  return mesh(geo, C.blue, parent, 0, y, -d / 2);
}
function basicHouse(parent, width = 3.4, depth = 2.7, height = 2.4) {
  box(parent, width + 0.3, 0.22, depth + 0.3, C.stone, 0, 0.12, 0);
  box(parent, width, height, depth, C.cream, 0, height / 2 + 0.2, 0);
  box(parent, width + 0.15, 0.15, depth + 0.15, C.trim, 0, height + 0.24, 0);
  roof(parent, width + 0.5, depth + 0.4, height + 0.33, 1.05);
  box(parent, 0.85, 1.4, 0.12, C.wood, 0, 0.9, depth / 2 + 0.1);
  box(parent, 0.05, 1.4, 0.14, C.gold, 0, 0.9, depth / 2 + 0.12);
  ball(parent, 0.036, C.gold, 0.12, 0.9, depth / 2 + 0.2);
  for (const x of [-width * 0.32, width * 0.32])
    windowFrame(parent, x, 1.4, depth / 2 + 0.08);
  for (const x of [-width / 2 + 0.12, width / 2 - 0.12])
    box(
      parent,
      0.17,
      height,
      0.18,
      C.trim,
      x,
      height / 2 + 0.2,
      depth / 2 + 0.04,
    );
  return parent;
}
function makePrincipal(world) {
  const g = group(world, -7, 0.2, -4);
  basicHouse(g);
  for (const x of [-0.73, 0.73]) {
    cylinder(g, 0.08, 0.09, 1.9, C.trim, x, 1.16, 1.67);
    box(g, 0.25, 0.13, 0.3, C.trim, x, 2.1, 1.67);
  }
  box(g, 1.95, 0.13, 0.85, C.trim, 0, 2.25, 1.6);
  roof(g, 2.05, 0.85, 2.33, 0.65).position.z = 1.15;
  for (const x of [-1.17, 1.17]) box(g, 0.32, 0.65, 0.4, C.trim, x, 3.32, -0.6);
}
function makeClassroom(world) {
  const g = group(world, 0, 0.2, -5);
  basicHouse(g, 3.9, 2.6, 2.3);
  box(g, 1.1, 1.5, 1.08, C.cream, 0, 3.3, 0.5);
  roof(g, 1.4, 1.35, 4.07, 0.8).position.z = -0.15;
  const clock = cylinder(g, 0.41, 0.41, 0.065, C.trim, 0, 3.62, 1.079, 32);
  clock.rotation.x = Math.PI / 2;
  ring(g, 0.415, 0.025, C.gold, 0, 3.62, 1.125);
  box(g, 0.045, 0.27, 0.035, C.dark, 0, 3.72, 1.145);
  const hand = box(g, 0.22, 0.038, 0.035, C.dark, 0.075, 3.62, 1.145);
  hand.rotation.z = -0.25;
}
function makeLibrary(world) {
  const g = group(world, 7, 0.2, -4);
  cylinder(g, 1.9, 1.95, 0.23, C.stone, 0, 0.12, 0);
  cylinder(g, 1.68, 1.8, 1.9, C.cream, 0, 1.17, 0, 24);
  const dome = mesh(
    new THREE.SphereGeometry(1.79, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    0x9ccbd2,
    g,
    0,
    2.13,
    0,
    {
      transparent: true,
      opacity: 0.69,
      roughness: 0.38,
      side: THREE.DoubleSide,
    },
  );
  dome.receiveShadow = false;
  for (let i = 0; i < 8; i++) {
    const arch = mesh(
      new THREE.TorusGeometry(1.8, 0.032, 5, 36, Math.PI),
      C.gold,
      g,
      0,
      2.13,
      0,
    );
    arch.rotation.y = (i * Math.PI) / 8;
  }
  ring(g, 1.79, 0.045, C.gold, 0, 2.13, 0, true);
  ring(g, 1.3, 0.025, C.gold, 0, 3.37, 0, true);
  ball(g, 0.09, C.gold, 0, 3.99, 0);
  box(g, 1.05, 1.6, 0.2, C.wood, 0, 1.01, 1.72);
  box(g, 0.8, 1.3, 0.15, 0x465c58, 0, 0.98, 1.84);
  box(g, 0.12, 1.65, 0.3, C.trim, -0.58, 1.03, 1.72);
  box(g, 0.12, 1.65, 0.3, C.trim, 0.58, 1.03, 1.72);
  box(g, 1.3, 0.15, 0.4, C.trim, 0, 1.86, 1.72);
  for (const x of [-1.15, 1.15]) windowFrame(g, x, 1.2, 1.2, 0.5, 0.85);
  for (let i = 0; i < 5; i++)
    box(
      g,
      0.09,
      0.5,
      0.12,
      [0xd9a657, 0xa56054, 0x6d8b78][i % 3],
      -0.27 + i * 0.12,
      0.9,
      1.94,
    );
}
function makeAuditorium(world) {
  const g = group(world, 7, 0.2, 4);
  box(g, 3.9, 0.24, 3.15, C.stone, 0, 0.12, 0);
  box(g, 3.55, 2.1, 0.15, C.cream, 0, 1.24, -1.3);
  for (const x of [-1.7, 1.7]) {
    box(g, 0.24, 1.8, 2.8, C.cream, x, 1.1, 0);
    cylinder(g, 0.15, 0.17, 1.8, C.trim, x, 1.12, 1.38);
  }
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-2, 0);
  roofShape.quadraticCurveTo(0, 2, 2, 0);
  roofShape.lineTo(2, 0.3);
  roofShape.quadraticCurveTo(0, 2.3, -2, 0.3);
  roofShape.closePath();
  mesh(
    new THREE.ExtrudeGeometry(roofShape, { depth: 3.2, bevelEnabled: false }),
    C.blue,
    g,
    0,
    2,
    -1.6,
  );
  for (let row = 0; row < 3; row++)
    for (let col = 0; col < 5; col++) {
      box(
        g,
        0.37,
        0.28,
        0.35,
        0xb46951,
        (col - 2) * 0.53,
        0.36 + row * 0.08,
        0.8 - row * 0.65,
      );
      ball(
        g,
        0.22,
        0xb46951,
        (col - 2) * 0.53,
        0.68 + row * 0.08,
        0.57 - row * 0.65,
        [0.85, 1, 0.35],
      );
    }
  box(g, 1.8, 0.6, 0.055, 0x789ba2, 0, 1.5, -1.18);
}
function bench(world, x, z, rotation = 0) {
  const g = group(world, x, 0.2, z);
  g.rotation.y = rotation;
  box(g, 1.35, 0.13, 0.48, C.wood, 0, 0.48, 0);
  box(g, 1.35, 0.47, 0.09, C.wood, 0, 0.76, -0.21);
  for (const sx of [-0.5, 0.5]) {
    box(g, 0.1, 0.45, 0.37, C.dark, sx, 0.24, 0);
    box(g, 0.08, 0.3, 0.08, C.dark, sx, 0.65, 0.2);
  }
  return g;
}
function makePark(world) {
  const g = group(world, -8, 0.2, 3.6);
  box(g, 2.3, 0.15, 2.3, C.stone, 0, 0.08, 0);
  for (const x of [-0.85, 0.85])
    for (const z of [-0.85, 0.85])
      cylinder(g, 0.07, 0.09, 1.9, C.trim, x, 1.05, z);
  roof(g, 2.7, 2.7, 2.05, 0.83);
  bench(world, -7.6, 5.4);
  bench(world, -5.6, 2.1);
}
function tree(world, x, z, size = 1) {
  const g = group(world, x, 0.2, z);
  g.scale.setScalar(size);
  cylinder(g, 0.12, 0.2, 1.6, C.wood, 0, 0.8, 0, 8);
  ball(g, 0.86, 0x79a265, 0, 2.05, 0, [1, 1.22, 1]);
  ball(g, 0.67, 0x8db36b, -0.45, 1.8, 0.14);
  ball(g, 0.63, 0x86ac67, 0.43, 1.9, 0.06);
}
function flowerbed(world, x, z) {
  for (let i = 0; i < 5; i++) {
    const dx = Math.sin(i * 2.4) * 0.35,
      dz = Math.cos(i * 2.4) * 0.33;
    ball(world, 0.23, 0x6e9a60, x + dx, 0.37, z + dz, [1, 0.8, 1]);
    ball(
      world,
      0.095,
      i % 2 ? 0xe5bc68 : 0xe0a8a3,
      x + dx,
      0.56,
      z + dz,
      [1, 0.5, 1],
    );
  }
}
function lamp(world, x, z) {
  cylinder(world, 0.06, 0.08, 1.2, C.dark, x, 0.83, z, 8);
  box(world, 0.29, 0.33, 0.29, 0xffe3a1, x, 1.55, z);
  mesh(new THREE.ConeGeometry(0.24, 0.2, 4), C.dark, world, x, 1.81, z);
}
function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}
function road(world, a, b, width = 1.25) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (len < 0.01) return;
  const strip = box(
    world,
    width,
    0.035,
    len,
    C.stone,
    (a[0] + b[0]) / 2,
    0.21,
    (a[1] + b[1]) / 2,
  );
  strip.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]);
  for (const p of [a, b])
    cylinder(world, width / 2, width / 2, 0.035, C.stone, p[0], 0.21, p[1], 20);
}
function makeFountain(world) {
  const g = group(world, 0, 0.2, 0);
  cylinder(g, 2.1, 2.15, 0.22, C.trim, 0, 0.11, 0, 40);
  cylinder(g, 1.89, 1.89, 0.17, 0x76b7c3, 0, 0.23, 0, 40);
  ring(g, 2, 0.08, C.stone, 0, 0.27, 0, true);
  cylinder(g, 0.62, 0.81, 0.24, C.gold, 0, 0.44, 0);
  cylinder(g, 0.2, 0.32, 0.9, C.gold, 0, 0.94, 0);
  const globe = group(g, 0, 1.91, 0);
  ball(globe, 0.77, C.blue);
  const patches = [
    [-0.25, 0.48, 0.51, 0.28],
    [0.31, 0.3, 0.61, 0.3],
    [0.35, -0.22, 0.63, 0.21],
    [-0.36, -0.25, 0.58, 0.2],
    [-0.15, -0.48, -0.53, 0.24],
  ];
  for (const [x, y, z, r] of patches)
    ball(globe, r, C.gold, x, y, z, [1, 0.85, 0.2]);
  ring(g, 0.94, 0.035, C.gold, 0, 1.91, 0).rotation.y = 0.2;
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const jet = cylinder(
      g,
      0.025,
      0.06,
      0.46,
      0xb6e2db,
      Math.cos(a) * 1.35,
      0.52,
      Math.sin(a) * 1.35,
      8,
    );
    jet.castShadow = false;
  }
  return globe;
}

export function createIsland({
  canvas,
  labels,
  onDestination,
  onArrival,
  onUserCamera,
}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  renderer.setClearColor(0xb5d7d2);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xb5d7d2, 50, 105);
  scene.add(new THREE.HemisphereLight(0xfff7dd, 0x6b8e91, 2.5));
  const sun = new THREE.DirectionalLight(0xffefd4, 3);
  sun.position.set(-12, 23, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1536, 1536);
  sun.shadow.camera.left = -17;
  sun.shadow.camera.right = 17;
  sun.shadow.camera.top = 17;
  sun.shadow.camera.bottom = -17;
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.0002;
  scene.add(sun);
  const camera = new THREE.OrthographicCamera(-18, 18, 11, -11, 0.1, 150);
  camera.position.set(20, 25, 33);
  camera.lookAt(0, 0, 0);
  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = 1.15;
  controls.minZoom = 0.6;
  controls.maxZoom = 2.8;
  controls.enablePan = true;
  controls.screenSpacePanning = false;
  controls.touches.ONE = THREE.TOUCH.PAN;
  controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  let follow = false,
    paused = false,
    player = null,
    selected = null,
    cameraGoal = null,
    active = true;
  let reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  controls.addEventListener("start", () => {
    follow = false;
    cameraGoal = null;
    onUserCamera?.();
  });
  const water = mesh(
    new THREE.PlaneGeometry(220, 220),
    0xb5d7d2,
    scene,
    0,
    -0.48,
    0,
    { roughness: 0.64 },
  );
  water.rotation.x = -Math.PI / 2;
  water.receiveShadow = true;
  const land = mesh(
    new THREE.ExtrudeGeometry(roundedShape(23, 17, 3), {
      depth: 0.62,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.2,
      bevelThickness: 0.15,
    }),
    0xc8bca0,
    scene,
    0,
    -0.65,
    0,
  );
  land.rotation.x = -Math.PI / 2;
  const grass = mesh(
    new THREE.ShapeGeometry(roundedShape(22.8, 16.8, 3)),
    C.grass,
    scene,
    0,
    0.17,
    0,
  );
  grass.rotation.x = -Math.PI / 2;
  road(scene, [0, 8], [0, 11], 1.5);
  for (const [a, b] of EDGES) road(scene, NODES[a], NODES[b]);
  for (const x of [-1, 1]) {
    box(scene, 0.16, 0.2, 2.4, C.trim, x, 0.42, 9.3);
    for (const z of [8.2, 10.3])
      cylinder(scene, 0.09, 0.11, 0.9, C.trim, x, 0.65, z, 12);
  }
  makePrincipal(scene);
  makeClassroom(scene);
  makeLibrary(scene);
  makeAuditorium(scene);
  makePark(scene);
  const globe = makeFountain(scene);
  [
    [-10, -4, 1],
    [-4, -6.5, 1.1],
    [4, -6.5, 1],
    [10, -3.5, 1],
    [-10, 1, 0.9],
    [-10, 6, 0.85],
    [10, 6.5, 0.85],
    [3, 7, 0.8],
  ].forEach((p) => tree(scene, ...p));
  [
    [-8.9, -1.8],
    [-5, -5.7],
    [2.8, -4.8],
    [8.9, -1.7],
    [-7, 6.4],
    [-3, 1.8],
    [2.1, 1.4],
    [9.3, 2.5],
    [-2, -1.2],
  ].forEach((p) => flowerbed(scene, ...p));
  lamp(scene, -1.4, 6.8);
  lamp(scene, 1.4, 6.8);
  const routeGroup = group(scene),
    highlight = ring(scene, 0.52, 0.035, C.gold, 0, 0.25, 0, true);
  highlight.visible = false;
  const labelsMap = new Map(),
    vector = new THREE.Vector3(),
    raycaster = new THREE.Raycaster(),
    targets = [];
  for (const zone of ZONES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "zone-label";
    button.dataset.zone = zone.id;
    const symbol = document.createElement("span");
    symbol.className = "zone-symbol";
    symbol.textContent = zone.symbol;
    button.append(symbol, document.createTextNode(zone.name));
    button.setAttribute("aria-label", `前往${zone.name}`);
    button.addEventListener("click", () => onDestination(zone.id));
    labels.append(button);
    labelsMap.set(zone.id, button);
    const target = mesh(
      new THREE.BoxGeometry(zone.id === "plaza" ? 3.3 : 4, 4.8, 3.6),
      0xffffff,
      scene,
      zone.position[0],
      2,
      zone.position[1],
      { transparent: true, opacity: 0, depthWrite: false },
    );
    target.castShadow = false;
    target.userData.zone = zone.id;
    targets.push(target);
  }
  const walkers = [];
  function spawn(config, node, cycle, activity = "idle") {
    const object = createAvatar(config);
    object.position.set(NODES[node][0], 0.24, NODES[node][1]);
    scene.add(object);
    const walker = {
      object,
      node,
      path: [],
      target: null,
      cycle,
      cycleIndex: 0,
      wait: Math.random() * 5 + 3,
      activity,
    };
    walkers.push(walker);
    return walker;
  }
  const npc1 = spawn(AVATARS[5], "principal", [
    "principal",
    "north",
    "classroom",
  ]);
  const npc2 = spawn(AVATARS[1], "auditorium", [
    "auditorium",
    "south",
    "library",
  ]);
  spawn(AVATARS[2], "plaza", [], "water");
  const reader = spawn(AVATARS[3], "sw", [], "read");
  reader.object.position.set(-5.6, 0.25, 2.4);
  reader.object.rotation.y = 0.1;
  const book = box(reader.object, 0.36, 0.25, 0.055, 0x476f8e, 0, 1, 0.34);
  book.rotation.x = -0.6;
  const gardener = walkers[2];
  const can = cylinder(
    gardener.object,
    0.11,
    0.12,
    0.22,
    0xdab35c,
    -0.36,
    0.65,
    0.12,
    12,
  );
  can.rotation.z = -0.35;
  const nozzle = box(
    gardener.object,
    0.25,
    0.05,
    0.055,
    0xdab35c,
    -0.52,
    0.69,
    0.12,
  );
  nozzle.rotation.z = -0.3;
  const playerLabel = document.querySelector("#player-label");
  function disposeRoutes() {
    while (routeGroup.children.length) {
      const child = routeGroup.children[0];
      routeGroup.remove(child);
      child.geometry?.dispose();
    }
  }
  function drawRoute(points) {
    disposeRoutes();
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i],
        b = points[i + 1],
        len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      for (let s = 0.1; s < len; s += 0.48) {
        const t = s / len;
        const dash = box(
          routeGroup,
          0.07,
          0.024,
          Math.min(0.24, len - s),
          C.gold,
          THREE.MathUtils.lerp(a[0], b[0], t),
          0.26,
          THREE.MathUtils.lerp(a[1], b[1], t),
        );
        dash.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]);
        dash.castShadow = false;
      }
    }
  }
  function queuePath(walker, destination) {
    const start = walker.target ?? walker.node;
    const remaining = findRoute(start, destination).slice(1);
    walker.path = walker.target ? [walker.target, ...remaining] : remaining;
    walker.target = walker.path.shift() ?? null;
  }
  function setPlayer(config, spawnAt = "entry") {
    if (player) {
      scene.remove(player.object);
      const idx = walkers.indexOf(player);
      if (idx >= 0) walkers.splice(idx, 1);
      player.object.traverse((o) => o.geometry?.dispose());
    }
    player = spawn(config, NODES[spawnAt] ? spawnAt : "entry", []);
    player.object.rotation.y = Math.PI;
    player.wait = Infinity;
    disposeRoutes();
    selected = null;
    highlight.visible = false;
    playerLabel.hidden = false;
  }
  function goTo(id, { instant = false } = {}) {
    if (!player || !NODES[id]) return;
    selected = id;
    labelsMap.forEach((el, key) =>
      el.classList.toggle("is-selected", key === id),
    );
    const point = NODES[id];
    highlight.position.set(point[0], 0.26, point[1]);
    highlight.visible = true;
    queuePath(player, id);
    drawRoute([
      [player.object.position.x, player.object.position.z],
      ...(player.target
        ? [player.target, ...player.path].map((n) => NODES[n])
        : []),
    ]);
    follow = true;
    if (instant || reduced || !player.target) {
      player.object.position.set(point[0], 0.24, point[1]);
      player.node = id;
      player.target = null;
      player.path = [];
      disposeRoutes();
      player.activity = "wave";
      onArrival(id);
    }
  }
  function enterNow() {
    if (selected) goTo(selected, { instant: true });
  }
  function overview() {
    follow = false;
    controls.target.set(0, 0, 0);
    camera.position.set(20, 25, 33);
    camera.zoom = 1;
    controls.update();
    cameraGoal = null;
  }
  function setFollow(value = true) {
    follow = value;
    cameraGoal = null;
    return follow;
  }
  function setPaused(value) {
    paused = value;
    return paused;
  }
  function setCompleted(completed) {
    labelsMap.forEach((button, id) =>
      button.classList.toggle("is-completed", !!completed[id]),
    );
  }
  function updateWalker(w, dt, t) {
    if (w.target) {
      const p = NODES[w.target],
        dx = p[0] - w.object.position.x,
        dz = p[1] - w.object.position.z,
        distance = Math.hypot(dx, dz);
      const step = Math.min(distance, dt * (w === player ? 2.2 : 1.1));
      if (distance > 0.001) {
        w.object.position.x += (dx / distance) * step;
        w.object.position.z += (dz / distance) * step;
        const angle = Math.atan2(dx, dz),
          difference = Math.atan2(
            Math.sin(angle - w.object.rotation.y),
            Math.cos(angle - w.object.rotation.y),
          );
        w.object.rotation.y += difference * Math.min(dt * 12, 1);
      }
      if (distance < 0.06) {
        w.node = w.target;
        w.object.position.set(p[0], 0.24, p[1]);
        w.target = w.path.shift() ?? null;
        if (!w.target) {
          if (w === player) {
            disposeRoutes();
            w.activity = "wave";
            onArrival(selected);
          } else w.wait = 5 + Math.random() * 6;
        }
      }
    } else if (w.cycle.length && !reduced) {
      w.wait -= dt;
      if (w.wait <= 0) {
        w.cycleIndex = (w.cycleIndex + 1) % w.cycle.length;
        queuePath(w, w.cycle[w.cycleIndex]);
      }
    }
    animateAvatar(w.object, t, !!w.target, w.target ? "idle" : w.activity);
  }
  let width = 0,
    height = 0;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    const aspect = width / Math.max(height, 1),
      half = width < 720 ? 15.8 : 10.6;
    camera.left = -half * aspect;
    camera.right = half * aspect;
    camera.top = half;
    camera.bottom = -half;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  let down = null;
  const pointers = new Set();
  canvas.addEventListener("pointerdown", (event) => {
    pointers.add(event.pointerId);
    down =
      pointers.size === 1
        ? { x: event.clientX, y: event.clientY, id: event.pointerId }
        : null;
  });
  canvas.addEventListener("pointerup", (event) => {
    pointers.delete(event.pointerId);
    if (
      !down ||
      down.id !== event.pointerId ||
      Math.hypot(down.x - event.clientX, down.y - event.clientY) > 7
    ) {
      down = null;
      return;
    }
    down = null;
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      camera,
    );
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (hit) onDestination(hit.object.userData.zone);
  });
  canvas.addEventListener("pointercancel", (event) => {
    pointers.delete(event.pointerId);
    down = null;
  });
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    document.querySelector("#scene-fallback").hidden = false;
  });
  let last = performance.now(),
    time = 0;
  function project(position, element, offset = 0) {
    vector.set(...position).project(camera);
    element.style.left = `${(vector.x * 0.5 + 0.5) * width}px`;
    element.style.top = `${(-vector.y * 0.5 + 0.5) * height + offset}px`;
    const visible =
      vector.z < 1 &&
      vector.z > -1 &&
      vector.x > -1.3 &&
      vector.x < 1.3 &&
      vector.y > -1.2 &&
      vector.y < 1.2;
    element.style.visibility = visible ? "visible" : "hidden";
  }
  function frame(now) {
    if (!active) return;
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!paused && !document.hidden) {
      time += dt;
      walkers.forEach((w) => updateWalker(w, dt, time));
      globe.rotation.y = time * 0.04;
    }
    if (follow && player) {
      const wanted = new THREE.Vector3(
        player.object.position.x,
        0,
        player.object.position.z - 1.5,
      );
      const delta = wanted
        .clone()
        .sub(controls.target)
        .multiplyScalar(Math.min(dt * 2.4, 1));
      camera.position.add(delta);
      controls.target.add(delta);
      const targetZoom = width < 720 ? 1.08 : 1.15;
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, dt * 2);
      camera.updateProjectionMatrix();
    }
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -9, 9);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -6, 8);
    controls.update();
    renderer.render(scene, camera);
    ZONES.forEach((zone) => project(zone.label, labelsMap.get(zone.id)));
    if (player)
      project(
        [
          player.object.position.x,
          player.object.position.y + 2.05,
          player.object.position.z,
        ],
        playerLabel,
        -4,
      );
  }
  requestAnimationFrame(frame);
  return {
    setPlayer,
    goTo,
    enterNow,
    overview,
    setFollow,
    setPaused,
    setCompleted,
    get playerPosition() {
      return player
        ? [player.object.position.x, player.object.position.z]
        : null;
    },
    destroy() {
      active = false;
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((o) => o.geometry?.dispose());
    },
  };
}
