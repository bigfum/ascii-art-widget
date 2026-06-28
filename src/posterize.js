export function posterize(cells, levels) {
  if (!levels || levels < 2) return cells;
  const step = 255 / (levels - 1);
  return cells.map(({ r, g, b, a = 255 }) => ({
    r: Math.round(Math.round(r / step) * step),
    g: Math.round(Math.round(g / step) * step),
    b: Math.round(Math.round(b / step) * step),
    a,
  }));
}
