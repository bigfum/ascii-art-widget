const CHARS = [' ', '░', '▒', '▓', '█'];

function blendAgainstBg(r, g, b, a, bg) {
  const t = a / 255;
  return {
    r: t * r + (1 - t) * bg.r,
    g: t * g + (1 - t) * bg.g,
    b: t * b + (1 - t) * bg.b,
  };
}

function alphaToChar(a) {
  return CHARS[Math.round(a / 255 * (CHARS.length - 1))];
}

export function cellToChar({ r, g, b, a = 255 }, bg = { r: 0, g: 0, b: 0 }) {
  const px = blendAgainstBg(r, g, b, a, bg);
  const luma = 0.299 * px.r + 0.587 * px.g + 0.114 * px.b;
  return CHARS[Math.round(luma / 255 * (CHARS.length - 1))];
}

export function cellsToString(cells, width, bg = { r: 0, g: 0, b: 0 }) {
  let out = '';
  for (let i = 0; i < cells.length; i++) {
    if (i > 0 && i % width === 0) out += '\n';
    out += cellToChar(cells[i], bg);
  }
  return out;
}

function colorKey(c, alphaMode) {
  const r = Math.round(c.r), g = Math.round(c.g), b = Math.round(c.b);
  const a = Math.round(((c.a ?? 255) / 255) * 100) / 100;
  return alphaMode === 'css' ? `${r},${g},${b},${a}` : `${r},${g},${b}`;
}

function colorStyle(c, alphaMode) {
  const r = Math.round(c.r), g = Math.round(c.g), b = Math.round(c.b);
  const a = Math.round(((c.a ?? 255) / 255) * 100) / 100;
  return alphaMode === 'css' ? `rgba(${r},${g},${b},${a})` : `rgb(${r},${g},${b})`;
}

export function cellsToHtml(cells, width, alphaMode = 'char', halfBlocks = false) {
  return halfBlocks
    ? cellsToHtmlHalf(cells, width, alphaMode)
    : cellsToHtmlFull(cells, width, alphaMode);
}

function cellsToHtmlFull(cells, width, alphaMode) {
  let html = '';
  let spanCount = 0;
  let i = 0;

  while (i < cells.length) {
    if (i > 0 && i % width === 0) html += '\n';

    const cell = cells[i];
    const char = alphaMode === 'css' ? '█' : alphaToChar(cell.a ?? 255);
    const key = colorKey(cell, alphaMode);

    let j = i + 1;
    while (j < cells.length && j % width !== 0) {
      const c = cells[j];
      const cchar = alphaMode === 'css' ? '█' : alphaToChar(c.a ?? 255);
      if (cchar !== char || colorKey(c, alphaMode) !== key) break;
      j++;
    }

    if (char === ' ') {
      html += ' '.repeat(j - i);
    } else {
      spanCount++;
      html += `<span style="color:${colorStyle(cell, alphaMode)}">${char.repeat(j - i)}</span>`;
    }

    i = j;
  }

  return { html, spanCount, cellCount: cells.length };
}

function cellsToHtmlHalf(cells, width, alphaMode) {
  const height = Math.ceil(cells.length / width);
  let html = '';
  let spanCount = 0;

  for (let row = 0; row < height; row += 2) {
    if (row > 0) html += '\n';
    let col = 0;

    while (col < width) {
      const top = cells[row * width + col];
      const bot = row + 1 < height ? cells[(row + 1) * width + col] : top;
      const fgKey = colorKey(top, alphaMode);
      const bgKey = colorKey(bot, alphaMode);

      let j = col + 1;
      while (j < width) {
        const t = cells[row * width + j];
        const b = row + 1 < height ? cells[(row + 1) * width + j] : t;
        if (colorKey(t, alphaMode) !== fgKey) break;
        if (colorKey(b, alphaMode) !== bgKey) break;
        j++;
      }

      spanCount++;
      html += `<span style="color:${colorStyle(top, alphaMode)};background-color:${colorStyle(bot, alphaMode)}">${'▀'.repeat(j - col)}</span>`;
      col = j;
    }
  }

  return { html, spanCount, cellCount: cells.length };
}
