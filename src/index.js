import { decodeImage } from './decode.js';
import { sample } from './sample.js';
import { cellsToString } from './map.js';

/**
 * converts an image to a Unicode block art string.
 *
 * @param {string | Blob | File} source
 * @param {{ width?: number, height?: number, method?: 'nearest' | 'area' }} options
 * @returns {Promise<string>}
 */
export async function imageToBlockArt(source, { width = 80, height = 40, method = 'area' } = {}) {
    const { data, width: srcWidth, height: srcHeight } = await decodeImage(source);
    const cells = sample(data, srcWidth, srcHeight, width, height, method);
    return cellsToString(cells, width);
}
