const CHARS = [' ', '░', '▒', '▓', '█'];

export function cellToChar({ r, g, b }) {
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  return CHARS[Math.round(luma / 255 * (CHARS.length - 1))];
}

export function cellsToString(cells, width) {
  let out = '';
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % width === 0) out += '\n';
    out += cellToChar(cells[i]);
  }
  return out;
}
