import crypto from 'crypto-es';
import * as jsZip from 'jszip';

// get random integer between min and max
export const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

// get color of a given pixel in a canvas
export const getCanvasPixelColor = (
  canvasEl: HTMLCanvasElement,
  point: { x: number; y: number }
): { r: number; g: number; b: number; a: number } => {
  const ctx = canvasEl.getContext('2d');
  const pixelData = ctx.getImageData(point.x, point.y, 1, 1).data;
  const [r, g, b, a] = pixelData;

  return { r, g, b, a };
};

// set color of a given pixel in a canvas
export const setCanvasPixelColor = (
  canvasEl: HTMLCanvasElement,
  point: { x: number; y: number },
  color: string
): void => {
  const ctx = canvasEl.getContext('2d');
  const lastColor = ctx.fillStyle;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = lastColor;
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
export const randomizeCanvasPixelColor = (canvasEl: HTMLCanvasElement): HTMLCanvasElement => {
  // we need to get 4 random pixels from the "frame" of the canvas.  The frame is upto 20 pixels deep
  const fourRandomPixel = getRandomPoints(canvasEl, 20);

  // get the color of the four random pixels
  const fourPixels = fourRandomPixel.map(({ x, y }) => getCanvasPixelColor(canvasEl, { x, y }));
  if (fourPixels?.length !== 4) {
    throw new Error('Expected 4 colors');
  }

  fourPixels.map((color, index) => {
    const { r, g, b } = color;
    const point = fourRandomPixel[index];
    setCanvasPixelColor(canvasEl, point, `rgb(${r}, ${g}, ${b} )`);
  });
  return canvasEl;
};

// convert base64 to a blob
export const base64ToBlob = (base64Image: string): Blob => {
  // Split into two parts
  const parts = base64Image.split(';base64,');

  // Hold the content type
  const imageType = parts[0].split(':')[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
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
  mime = 'image/png',
  quality = 1.0
) => {
  // get current time
  const time = new Date().toISOString();
  // get base64 of the canvas with random colors on 4 pixels
  const randomizedCanvas = randomizeCanvasPixelColor(cloneCanvas(canvasEl));
  // get hashed version of the base64 randomized image
  const randomizedBase64 = canvasToBase64(randomizedCanvas, mime, quality);
  const randomizedBase64Hashed = crypto.MD5(randomizedBase64).toString();

  // create blob of images
  const originalCanvasBlob = await canvasToBlob(canvasEl);
  const randomizedCanvasBlob = await canvasToBlob(randomizedCanvas);

  const zip = new jsZip();

  zip.file(`AvidCaster-Annotator-Image-${time}.png`, originalCanvasBlob);
  zip.file(`AvidCaster-Annotator-Image-Signature-${time}.txt`, randomizedBase64Hashed);
  zip.file(`AvidCaster-Annotator-Image-Signed-${time}.png`, randomizedCanvasBlob);
  zip.file(
    `AvidCaster-Annotator-Readme-${time}.txt`,
    `This is a zip file created by AvidCaster Annotator, avidcaster.net\n
    AvidCaster-Annotator-Readme-${time}.txt contains the instructions for using the image.\n
    AvidCaster-Annotator-Image-${time}.png contains the original image.\n
    AvidCaster-Annotator-Image-Signature-${time}.txt contains the signature of the original image.\n
    AvidCaster-Annotator-Image-Signed-${time}.png contains the image with the signature applied.\n
    `
  );

  return zip;
};

export const downloadPng = async (
  windowObj: Window,
  canvasEl: HTMLCanvasElement,
  mime = 'image/png',
  quality = 1.0
) => {
  const zip = await canvasToZip(canvasEl, mime, quality);

  zip
    .generateAsync({
      type: 'base64',
    })
    .then(function (content) {
      windowObj.location.assign('data:application/zip;base64,' + content);
    });
};
