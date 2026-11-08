/**
 * Utilitaires pour la compression d'images via Canvas côté navigateur.
 * Réduit les photos de reçus (max 1024px, qualité JPEG 0.7) avant envoi/stockage
 * afin d'éviter la saturation de mémoire (localStorage ou payload HTTP).
 */

export const compressImageFile = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      return reject(new Error('Fichier image invalide.'));
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Erreur de lecture du fichier image.'));
    };

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Impossible de charger l’image pour la compression.'));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcul des dimensions proportionnelles limitées à maxWidth / maxHeight
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context non disponible.'));
        }

        // Fond blanc pour éviter la transparence JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          reject(err);
        }
      };

      img.src = readerEvent.target?.result;
    };

    reader.readAsDataURL(file);
  });
};
