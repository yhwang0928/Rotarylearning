import { mkdir, copyFile } from "node:fs/promises";
const target = new URL("../dist/poc/vendor/", import.meta.url);
await mkdir(target, { recursive: true });
for (const [source, output] of [
  ["build/three.module.js", "three.module.js"],
  ["build/three.core.js", "three.core.js"],
  ["examples/jsm/controls/OrbitControls.js", "OrbitControls.js"],
  ["examples/jsm/loaders/GLTFLoader.js", "loaders/GLTFLoader.js"],
  ["examples/jsm/utils/BufferGeometryUtils.js", "utils/BufferGeometryUtils.js"],
  ["examples/jsm/utils/SkeletonUtils.js", "utils/SkeletonUtils.js"],
  ["LICENSE", "THREE-LICENSE.txt"],
]) {
  await mkdir(new URL(".", new URL(output, target)), { recursive: true });
  await copyFile(
    new URL(`../node_modules/three/${source}`, import.meta.url),
    new URL(output, target),
  );
}
