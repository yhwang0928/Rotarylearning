export const NODES = {
  entry: [0, 8],
  south: [0, 5],
  sw: [-4, 3.4],
  west: [-4, 0],
  nw: [-4, -2.8],
  north: [0, -2.8],
  ne: [4, -2.8],
  east: [4, 0],
  se: [4, 3.4],
  principal: [-7, -1.65],
  classroom: [0, -2.8],
  library: [7, -1.5],
  plaza: [-6, 3.4],
  auditorium: [7, 6.1],
};
export const EDGES = [
  ["entry", "south"],
  ["south", "sw"],
  ["sw", "west"],
  ["west", "nw"],
  ["nw", "north"],
  ["north", "ne"],
  ["ne", "east"],
  ["east", "se"],
  ["se", "south"],
  ["nw", "principal"],
  ["north", "classroom"],
  ["ne", "library"],
  ["sw", "plaza"],
  ["se", "auditorium"],
];

export function nearestNode(position) {
  return Object.keys(NODES).reduce(
    (best, id) =>
      Math.hypot(NODES[id][0] - position[0], NODES[id][1] - position[1]) <
      Math.hypot(NODES[best][0] - position[0], NODES[best][1] - position[1])
        ? id
        : best,
    "entry",
  );
}

export function findRoute(start, end) {
  if (!NODES[start] || !NODES[end]) return [];
  const dist = Object.fromEntries(
    Object.keys(NODES).map((id) => [id, Infinity]),
  );
  const previous = {},
    pending = new Set(Object.keys(NODES));
  dist[start] = 0;
  while (pending.size) {
    const current = [...pending].reduce((a, b) => (dist[a] < dist[b] ? a : b));
    pending.delete(current);
    if (current === end) break;
    for (const [a, b] of EDGES) {
      const next = a === current ? b : b === current ? a : null;
      if (!next || !pending.has(next)) continue;
      const d =
        dist[current] +
        Math.hypot(
          NODES[current][0] - NODES[next][0],
          NODES[current][1] - NODES[next][1],
        );
      if (d < dist[next]) {
        dist[next] = d;
        previous[next] = current;
      }
    }
  }
  const path = [end];
  while (path[0] !== start) {
    if (!previous[path[0]]) return [];
    path.unshift(previous[path[0]]);
  }
  return path;
}
