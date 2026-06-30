import { decodeImage } from './decode.js';
import { sample } from './sample.js';
import { posterize } from './posterize.js';
import { cellsToString, cellsToHtml } from './map.js';

/**
 * converts an image to unicode block art.
 *
 * @param {string | Blob | File} source
 * @param {{
 *   width?: number,
 *   height?: number,
 *   method?: 'nearest' | 'area',
 *   mode?: 'luminance' | 'color',
 *   alphaMode?: 'char' | 'css',
 *   posterize?: number,
 *   bg?: { r: number, g: number, b: number },
 *   invert?: boolean,
 * }} options
 * @returns {Promise<{ result: string, stats: { plainChars: number, rawChars: number, spans?: number, cells?: number } }>}
 */
export async function imageToBlockArt(source, {
    width = 80,
    height = 40,
    method = 'area',
    mode = 'luminance',
    alphaMode = 'char',
    posterize: posterizeLevels = 0,
    halfBlocks = false,
    bg = { r: 0, g: 0, b: 0 },
    invert = false,
} = {}) {
    const { data, width: srcWidth, height: srcHeight } = await decodeImage(source);
    const sampleHeight = halfBlocks ? height * 2 : height;
    let cells = sample(data, srcWidth, srcHeight, width, sampleHeight, method);
    cells = posterize(cells, posterizeLevels);

    if (mode === 'color') {
        const { html, spanCount, cellCount } = cellsToHtml(cells, width, alphaMode, halfBlocks);
        return {
            result: html,
            stats: {
                plainChars: cellCount + height,
                rawChars: html.length,
                spans: spanCount,
                cells: cellCount,
            },
        };
    }

    const result = cellsToString(cells, width, bg, invert);
    return {
        result,
        stats: { plainChars: result.length, rawChars: result.length },
    };
}
