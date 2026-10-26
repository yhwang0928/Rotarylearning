const walker = document.querySelector("#governorWalker");
const sprite = walker?.querySelector(".walker-sprite");

if (walker && sprite) {
  const points = {
    gate: [50, 88],
    bridgeTop: [50, 70],
    circleSouth: [50, 62],
    circleSouthWest: [43, 60],
    circleWest: [38, 53],
    circleNorthWest: [39, 40],
    circleNorth: [50, 37],
    circleNorthEast: [61, 40],
    circleEast: [65, 52],
    circleSouthEast: [61, 59],
    principalJunction: [33, 39],
    principal: [24, 33],
    classroom: [50, 34],
    libraryJunction: [67, 39],
    library: [74, 35],
    auditoriumJunction: [68, 58],
    auditorium: [75, 65]
  };

  const route = [
    "principal", "principalJunction", "circleNorthWest", "circleNorth", "classroom",
    "circleNorth", "circleNorthEast", "libraryJunction", "library", "libraryJunction",
    "circleNorthEast", "circleEast", "auditoriumJunction", "auditorium",
    "auditoriumJunction", "circleSouthEast", "circleSouth", "bridgeTop", "gate",
    "bridgeTop", "circleSouth", "circleSouthWest", "circleWest", "circleNorthWest",
    "principalJunction"
  ];

  const roomStops = new Set(["principal", "classroom", "library", "auditorium", "gate"]);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    segment: 0,
    progress: 0,
    wait: 1.1,
    walkClock: 0,
    paused: reducedMotion.matches,
    lastTime: performance.now()
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const mix = (a, b, amount) => a + (b - a) * amount;

  function setSpriteFrame(frame, row) {
    sprite.style.setProperty("--sprite-x", `${frame * (100 / 3)}%`);
    sprite.style.setProperty("--sprite-y", `${row * (100 / 3)}%`);
  }

  function directionRow(from, to) {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    if (Math.abs(dx) > Math.abs(dy) * 0.7) return dx < 0 ? 1 : 3;
    return dy > 0 ? 0 : 2;
  }

  function render(time) {
    const dt = Math.min((time - state.lastTime) / 1000, 0.05);
    state.lastTime = time;

    const fromName = route[state.segment];
    const toIndex = (state.segment + 1) % route.length;
    const toName = route[toIndex];
    const from = points[fromName];
    const to = points[toName];
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const distance = Math.hypot(dx, dy);
    const moving = !state.paused && state.wait <= 0;

    if (!state.paused && state.wait > 0) {
      state.wait -= dt;
    } else if (moving) {
      state.progress += (dt * 4.15) / Math.max(distance, 0.01);
      state.walkClock += dt;
      if (state.progress >= 1) {
        state.progress = 0;
        state.segment = toIndex;
        if (roomStops.has(toName)) state.wait = 1.75;
      }
    }

    const currentFrom = points[route[state.segment]];
    const currentTo = points[route[(state.segment + 1) % route.length]];
    const x = mix(currentFrom[0], currentTo[0], state.progress);
    const y = mix(currentFrom[1], currentTo[1], state.progress);
    const row = directionRow(currentFrom, currentTo);
    const frame = state.wait > 0 || state.paused ? 1 : Math.floor(state.walkClock * 8) % 4;
    const step = state.wait > 0 || state.paused ? 0 : Math.sin(state.walkClock * Math.PI * 4);
    const depth = clamp(0.78 + y * 0.0054, 0.86, 1.18);

    walker.style.left = `${x}%`;
    walker.style.top = `${y}%`;
    walker.style.zIndex = String(100 + Math.round(y * 10));
    walker.style.setProperty("--depth", depth.toFixed(3));
    walker.style.setProperty("--walk-bob", `${state.paused ? 0 : -Math.abs(step) * 1.8}px`);
    walker.style.setProperty("--shadow-scale", `${1 - Math.abs(step) * 0.08}`);
    walker.style.setProperty("--shadow-opacity", `${0.68 - Math.abs(step) * 0.12}`);
    setSpriteFrame(frame, row);

    requestAnimationFrame(render);
  }

  window.addEventListener("rotary-motion", (event) => {
    state.paused = Boolean(event.detail?.paused) || reducedMotion.matches;
  });
  reducedMotion.addEventListener("change", () => {
    state.paused = reducedMotion.matches || document.body.classList.contains("motion-paused");
  });

  setSpriteFrame(1, 0);
  requestAnimationFrame(render);
}
