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

export function cellsToHtml(cells, width, alphaMode = 'char') {
  let html = '';
  let spanCount = 0;
  let i = 0;

  while (i < cells.length) {
    if (i > 0 && i % width === 0) html += '\n';

    const { r, g, b, a = 255 } = cells[i];
    const ri = Math.round(r), gi = Math.round(g), bi = Math.round(b);
    const ai = Math.round((a / 255) * 100) / 100;
    const char = alphaMode === 'css' ? '█' : alphaToChar(a);

    let j = i + 1;
    while (j < cells.length && j % width !== 0) {
      const c = cells[j];
      const ca = c.a ?? 255;
      const cchar = alphaMode === 'css' ? '█' : alphaToChar(ca);
      if (cchar !== char) break;
      if (Math.round(c.r) !== ri || Math.round(c.g) !== gi || Math.round(c.b) !== bi) break;
      if (alphaMode === 'css' && Math.round((ca / 255) * 100) / 100 !== ai) break;
      j++;
    }

    const color = alphaMode === 'css'
      ? `rgba(${ri},${gi},${bi},${ai})`
      : `rgb(${ri},${gi},${bi})`;

    if (char === ' ') {
      html += ' '.repeat(j - i);
    } else {
      spanCount++;
      html += `<span style="color:${color}">${char.repeat(j - i)}</span>`;
    }

    i = j;
  }

  return { html, spanCount, cellCount: cells.length };
}
