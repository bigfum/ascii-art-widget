const CHARS = [' ', '░', '▒', '▓', '█'];

function blendAgainstBg(r, g, b, a, bg) {
  const t = a / 255;
  return {
    r: t * r + (1 - t) * bg.r,
    g: t * g + (1 - t) * bg.g,
    b: t * b + (1 - t) * bg.b,
  };
}

export function cellToChar({ r, g, b, a = 255 }, bg = { r: 255, g: 255, b: 255 }) {
  const px = blendAgainstBg(r, g, b, a, bg);
  const luma = 0.299 * px.r + 0.587 * px.g + 0.114 * px.b;
  return CHARS[Math.round(luma / 255 * (CHARS.length - 1))];
}

export function cellsToString(cells, width, bg = { r: 255, g: 255, b: 255 }) {
  let out = '';
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % width === 0) out += '\n';
    out += cellToChar(cells[i], bg);
  }
  return out;
}
