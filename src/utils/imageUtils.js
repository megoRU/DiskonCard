export const imageUrlToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle potential CORS issues if images were from external sources, good practice.
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const dataURL = canvas.toDataURL('image/png'); // Or appropriate mime type
        resolve(dataURL);
      } catch (e) {
        // Log the error and reject if toDataURL fails (e.g., tainted canvas)
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
