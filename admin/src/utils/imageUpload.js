import { storage } from '../firebaseAdmin';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Compresses an image file client-side to keep size small and performant.
 * @param {File} file - The uploaded image file.
 * @param {number} maxDimension - Max width or height in px.
 * @param {number} quality - JPEG compression quality (0 to 1).
 * @returns {Promise<{blob: Blob, dataUrl: string, width: number, height: number, size: number}>}
 */
export async function compressImage(file, maxDimension = 1200, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Please provide a valid image file.'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({
              blob: blob || file,
              dataUrl,
              width,
              height,
              size: blob?.size || file.size,
            });
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(new Error('Failed to decode image: ' + err));
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image to Firebase Storage with automatic fallback to compressed Data URL.
 * @param {File} file - The image file to process.
 * @param {string} path - Storage folder name (default: 'article_banners').
 * @returns {Promise<{url: string, type: 'cloud' | 'embedded', size: number}>}
 */
export async function processAndUploadImage(file, path = 'article_banners') {
  const { blob, dataUrl, size } = await compressImage(file);

  try {
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${path}/${Date.now()}_${cleanName}`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString()
      }
    });

    const downloadUrl = await getDownloadURL(storageRef);
    return { url: downloadUrl, type: 'cloud', size };
  } catch (err) {
    console.warn('Firebase Storage upload failed or restricted, falling back to embedded compressed image:', err);
    // Seamless fallback: compressed base64 data URL
    return { url: dataUrl, type: 'embedded', size };
  }
}
