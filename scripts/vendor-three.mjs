import { mkdir, copyFile } from "node:fs/promises";
const target = new URL("../dist/poc/vendor/", import.meta.url);
await mkdir(target, { recursive: true });
for (const [source, output] of [
  ["build/three.module.js", "three.module.js"],
  ["build/three.core.js", "three.core.js"],
  ["examples/jsm/controls/OrbitControls.js", "OrbitControls.js"],
  ["LICENSE", "THREE-LICENSE.txt"],
]) {
  await copyFile(
    new URL(`../node_modules/three/${source}`, import.meta.url),
    new URL(output, target),
  );
}
