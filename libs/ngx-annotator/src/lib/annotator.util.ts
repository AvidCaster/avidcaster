import crypto from 'crypto-es';
import * as jsZip from 'jszip';

import { AnnotatorColors } from './annotator.default';

// get random integer between min and max
export const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// given rgb color, return hex color
export const rgbToHex = (r: number, g: number, b: number): string => {
  if (r > 255 || g > 255 || b > 255) throw 'Invalid color component';
  return ((r << 16) | (g << 8) | b).toString(16);
};

// given hex color, return rgb color
export const hexToRgb = (hexColor: string): number[] => {
  return hexColor
    .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1)
    .match(/.{2}/g)
    .map((x) => parseInt(x, 16));
};

// given rgb and alpha return string rgba
export const rgba = (r: number, g: number, b: number, a: number): string => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// given hex color and alpha return string rgba
export const hexToRgba = (hexColor: string, alpha: number): string => {
  const rgb = hexToRgb(hexColor);
  return rgba(rgb[0], rgb[1], rgb[2], alpha);
};

// get a unique random color from list of colors
export const getRandomColor = (lastColor?: string): string => {
  let color = AnnotatorColors[randomInteger(0, AnnotatorColors.length - 1)];
  if (color === lastColor) {
    color = AnnotatorColors[randomInteger(0, AnnotatorColors.length - 1)];
  }
  return color;
};

// clone a canvas
export const cloneCanvas = (canvasEl: HTMLCanvasElement): HTMLCanvasElement => {
  const newCanvas = document.createElement('canvas');
  const context = newCanvas.getContext('2d');
  if (context) {
    newCanvas.width = canvasEl.width;
    newCanvas.height = canvasEl.height;
    context.drawImage(canvasEl, 0, 0);
  }
  return newCanvas;
};

// // get color of a given pixel in a canvas
// export const getCanvasPixelColor = (
//   canvasEl: HTMLCanvasElement,
//   point: { x: number; y: number }
// ): { r: number; g: number; b: number; a: number } => {
//   const ctx = canvasEl.getContext('2d');
//   const pixelData = ctx.getImageData(point.x, point.y, 1, 1).data;
//   const [r, g, b, a] = pixelData;

//   return { r, g, b, a };
// };

// set color of a given pixel in a canvas (ctx)
export const setCanvasPixelColor = (
  ctx: CanvasRenderingContext2D,
  point: { x: number; y: number },
  color: string
): void => {
  const lastStrokeStyle = ctx.strokeStyle;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = lastStrokeStyle;
};

//  get 4 random points within a given frame of a canvas
export const getRandomPoints = (
  canvasEl: HTMLCanvasElement,
  frameDepth = 20
): { x: number; y: number }[] => {
  const { width, height } = canvasEl;

  // we need to get 4 random pixels from the "frame" of the canvas.  The frame is upto 10 pixels deep
  const randomPoints: { x: number; y: number }[] = [
    {
      // top frame rectangle (`width` pixels wide, `frameDepth` pixels tall)
      x: randomInteger(1, width - 1),
      y: randomInteger(1, Math.min(frameDepth, height) - 1),
    },
    {
      // bottom frame rectangle (`width` pixels wide, `frameDepth` pixels tall)
      x: randomInteger(1, width - 1),
      y: randomInteger(height - frameDepth, height - 1),
    },
    {
      // left frame rectangle (`frameDepth` pixels wide, `height` pixels tall)
      x: randomInteger(1, Math.min(frameDepth, width) - 1),
      y: randomInteger(1, height - 1),
    },
    {
      // right frame rectangle (`frameDepth` pixels wide, `height` pixels tall)
      x: randomInteger(width - frameDepth, width - 1),
      y: randomInteger(1, height - 1),
    },
  ];

  return randomPoints;
};

// randomize color of 4 pixels in a canvas
export const randomizeCanvasPixelColor = (
  canvasEl: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): HTMLCanvasElement => {
  // we need to get 4 random pixels from the "frame" of the canvas.  The frame is upto 20 pixels deep
  const fourRandomPixel = getRandomPoints(canvasEl, 20);

  // set the color of 4 random pixels to a random color
  let randomColor: string;
  fourRandomPixel.map((point) => {
    randomColor = getRandomColor(randomColor);
    setCanvasPixelColor(ctx, point, randomColor);
  });

  return canvasEl;
};

// canvas to blob
export const canvasToBlob = (
  canvasEl: HTMLCanvasElement,
  mime = 'image/png',
  quality = 1.0
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvasEl.toBlob(
      (blob: Blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Error converting canvas to blob'));
        }
      },
      mime,
      quality
    );
  });
};

export const canvasToBase64 = (canvasEl: HTMLCanvasElement, mime = 'image/png', quality = 1.0) => {
  const base64 = canvasEl.toDataURL(mime, quality);
  return base64;
};

export const canvasToZip = async (
  canvasEl: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  mime = 'image/png',
  quality = 1.0
) => {
  // create a zip file
  const zip = new jsZip();

  // get current time
  const time = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-').replace(/T/g, '-');

  // create blob of images and add to zip file
  const originalCanvasBlob = await canvasToBlob(canvasEl, mime, quality);
  zip.file(`AvidCaster-Annotator-Image-${time}.png`, originalCanvasBlob);

  // randomize the canvas by adding for random colors to 4 random pixels
  // convert to base64 and hash it (one way hash)
  const randomizedCanvas = randomizeCanvasPixelColor(canvasEl, ctx);
  const randomizedBase64 = canvasToBase64(randomizedCanvas, mime, quality);
  const randomizedBase64Hashed = crypto.MD5(randomizedBase64).toString();

  // create blob of the randomize canvas and add to zip file
  const randomizedCanvasBlob = await canvasToBlob(randomizedCanvas);
  zip.file(`AvidCaster-Annotator-Image-Signature-${time}.txt`, randomizedBase64Hashed);
  zip.file(`AvidCaster-Annotator-Image-Signed-${time}.png`, randomizedCanvasBlob);

  // add a readme file to the zip file
  zip.file(
    `Readme.txt`,
    `This is a zip file created by AvidCaster Annotator, @ https://avidcaster.net\n
    - Readme.txt - Instructions.\n
    - AvidCaster-Annotator-Image-${time}.png - Original hand-drawn image.\n
    - AvidCaster-Annotator-Image-Signed-${time}.png - Randomized version of the original hand-drawn image.\n
    - AvidCaster-Annotator-Image-Signature-${time}.txt - Signature of the randomized version.\n
    ================\n
    Instructions:\n
    1. To register the image as an NFT, use the original image.\n
    2. Keep the randomized image and its signature in a safe place and use as a proof of prior art.\n
    `
  );

  return zip;
};

export const downloadPng = async (
  windowObj: Window,
  canvasEl: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  mime = 'image/png',
  quality = 1.0
) => {
  const originalCanvas = cloneCanvas(canvasEl);
  const zip = await canvasToZip(canvasEl, ctx, mime, quality);
  zip
    .generateAsync({
      type: 'base64',
    })
    .then(function (content) {
      windowObj.location.assign('data:application/zip;base64,' + content);
    });

  // reset canvas
  canvasEl.width = originalCanvas.width;
  canvasEl.height = originalCanvas.height;
  ctx.drawImage(originalCanvas, 0, 0);
};
