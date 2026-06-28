/**
 * samples a decoded image down to (outWidth x outHeight) cells
 * returns a flat array of { r, g, b } objects in row-major order
 *
 * @param {Uint8ClampedArray} data - raw RGBA pixel data from getImageData()
 * @param {number} srcWidth
 * @param {number} srcHeight
 * @param {number} outWidth
 * @param {number} outHeight
 * @param {'nearest' | 'area'} method
 * @returns {{ r: number, g: number, b: number }[]}
 */
export function sample(data, srcWidth, srcHeight, outWidth, outHeight, method = 'area') {
  return method === 'nearest'
    ? sampleNearest(data, srcWidth, srcHeight, outWidth, outHeight)
    : sampleArea(data, srcWidth, srcHeight, outWidth, outHeight);
}

function getPixel(data, srcWidth, x, y) {
  const i = (y * srcWidth + x) * 4;
  return { r: data[i], g: data[i + 1], b: data[i + 2], a: data[i + 3] };
}

function sampleNearest(data, srcWidth, srcHeight, outWidth, outHeight) {
  const cells = [];
  for (let cy = 0; cy < outHeight; cy++) {
    for (let cx = 0; cx < outWidth; cx++) {
      const x = Math.floor((cx + 0.5) * srcWidth / outWidth);
      const y = Math.floor((cy + 0.5) * srcHeight / outHeight);
      cells.push(getPixel(data, srcWidth, x, y));
    }
  }
  return cells;
}

function sampleArea(data, srcWidth, srcHeight, outWidth, outHeight) {
  const cells = [];
  for (let cy = 0; cy < outHeight; cy++) {
    for (let cx = 0; cx < outWidth; cx++) {
      const x0 = Math.floor(cx * srcWidth / outWidth);
      const x1 = Math.floor((cx + 1) * srcWidth / outWidth);
      const y0 = Math.floor(cy * srcHeight / outHeight);
      const y1 = Math.floor((cy + 1) * srcHeight / outHeight);

      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const px = getPixel(data, srcWidth, x, y);
          r += px.r;
          g += px.g;
          b += px.b;
          a += px.a;
          count++;
        }
      }

      if (count === 0) {
        cells.push(getPixel(data, srcWidth, x0, y0));
      } else {
        cells.push({ r: r / count, g: g / count, b: b / count, a: a / count });
      }
    }
  }
  return cells;
}
