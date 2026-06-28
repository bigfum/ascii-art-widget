# ascii-art-widget

converts images to Unicode block art.

## planned API

```js
import { imageToBlockArt } from 'ascii-art-widget';

const art = await imageToBlockArt(imageSource, {
  width: 80,
  height: 40,
  charset: 'block'
});

console.log(art);
```

## how it works

1. decode the input image into raw RGBA pixel data
2. downsample the pixel grid to the target dimensions
3. map each sample to the best-fit Unicode block character
4. return the result as a plain string (or optionally as HTML)

## status

early development.
