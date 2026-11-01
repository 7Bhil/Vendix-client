import { useState } from 'react';
export default function ProductImageUpload() {
    const [image, setImage] = useState(null);
    const handleImageChange = (event) => {
  const selectedImage = event.target.files[0];

  if (selectedImage) {
    setImage(selectedImage);
  }
};
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
  <h3 className="font-semibold text-vendix-ink">
    Image du produit
  </h3>

  <p className="mt-1 text-sm text-slate-500">
    Ajoutez une photo pour identifier facilement votre produit.
  </p>

  {image ? (
  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-center">

    {/* Image à gauche */}
    <div className="w-full overflow-hidden rounded-xl bg-slate-50">
  <img
    src={URL.createObjectURL(image)}
    alt="Aperçu du produit"
    className="block h-[300px] w-full object-contain"
  />
</div>

    {/* Texte et actions à droite */}
    <div className="flex flex-col items-start gap-4">
      <div>
        <p className="text-base font-semibold text-vendix-ink">
          Image sélectionnée
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Votre photo de produit est prête.
        </p>
      </div>

      <label className="cursor-pointer rounded-xl bg-vendix-brand px-5 py-3 text-sm font-medium text-white hover:opacity-90">
        Changer l'image
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

     <button
  type="button"
  onClick={() => setImage(null)}
  className="rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
>
  Supprimer l'image
</button>
    </div>
  </div>
) : (
    <div className="mt-4 rounded-xl border-2 border-dashed border-slate-300 p-8 text-center">
      <p className="text-sm text-slate-500">
        Aucune image sélectionnée
      </p>

      <label className="mt-3 inline-block cursor-pointer rounded-xl bg-vendix-brand px-5 py-3 text-sm font-medium text-white hover:opacity-90">
        Parcourir les images
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      <p className="mt-3 text-xs text-slate-400">
        JPG, PNG ou WEBP
      </p>
    </div>
  )}
</div>

  );
}