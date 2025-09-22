import * as exifr from 'exifr';

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = 'anonymous';
    img.src = src;
  });
}

function getRotationFromExif(orientation) {
  switch (orientation) {
    case 3:
      return 180;
    case 6:
      return 90;
    case 8:
      return -90;
    default:
      return 0;
  }
}

export async function normalizeImage(file, options = {}) {
  const { maxDimension = 2000, minDimension = 300 } = options;
  let orientation = 1;
  try {
    const tags = await exifr.parse(file, { tiff: true, ifd0: true });
    if (tags && tags.Orientation) orientation = tags.Orientation;
  } catch (_) {
    // ignore EXIF errors
  }

  const dataUrl = await readFileAsDataURL(file);
  const image = await loadImage(dataUrl);

  const rotation = getRotationFromExif(orientation);
  const rotated = rotation === 90 || rotation === -90;

  const originalWidth = image.width;
  const originalHeight = image.height;
  const widthAfterRotation = rotated ? originalHeight : originalWidth;
  const heightAfterRotation = rotated ? originalWidth : originalHeight;

  // Downscale if larger than maxDimension
  const scale = Math.min(1, maxDimension / Math.max(widthAfterRotation, heightAfterRotation));
  const targetWidth = Math.round(widthAfterRotation * scale);
  const targetHeight = Math.round(heightAfterRotation * scale);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.save();
  // Apply rotation and draw
  if (rotation === 90) {
    ctx.translate(targetWidth, 0);
    ctx.rotate(Math.PI / 2);
  } else if (rotation === -90) {
    ctx.translate(0, targetHeight);
    ctx.rotate(-Math.PI / 2);
  } else if (rotation === 180) {
    ctx.translate(targetWidth, targetHeight);
    ctx.rotate(Math.PI);
  }

  // Compute draw size for original into rotated canvas with scaling
  const drawWidth = rotated ? targetHeight : targetWidth;
  const drawHeight = rotated ? targetWidth : targetHeight;
  ctx.drawImage(image, 0, 0, drawWidth, drawHeight);
  ctx.restore();

  const normalizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);

  const tooSmall = Math.min(targetWidth, targetHeight) < minDimension;

  return {
    dataUrl: normalizedDataUrl,
    width: targetWidth,
    height: targetHeight,
    tooSmall
  };
}


