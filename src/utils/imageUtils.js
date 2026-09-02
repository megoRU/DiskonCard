export const imageUrlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    if (!url) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available.'));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      } catch (e) {
        console.error('Error converting image to base64:', e);
        reject(new Error('Error converting image to base64.'));
      }
    };
    img.onerror = (error) => {
      console.error('Error loading image for base64 conversion:', error);
      reject(new Error('Could not load image to convert to base64. URL: ' + url));
    };
    img.src = url;
  });
};
