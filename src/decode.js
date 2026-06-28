/**
 * decodes an image source into raw RGBA pixel data.
 * @param {string | Blob | File} source
 * @returns {Promise<{ data: Uint8ClampedArray, width: number, height: number }>}
 */
export async function decodeImage(source) {
  const blob = source instanceof Blob
    ? source
    : await fetch(source).then(r => r.blob());

  const bitmap = await createImageBitmap(blob);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data, width, height };
}
