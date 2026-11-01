import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';

export default function ProductImageUpload({ value, onChange }) {
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewUrl(value || '');
  }, [value]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreviewUrl(base64);
        onChange?.(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Photo du produit
          </h3>
          <p className="text-xs text-slate-500">
            Permet d'identifier visuellement l'article en caisse et sur la vitrine.
          </p>
        </div>
        {previewUrl && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
            Photo active
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <img
              src={previewUrl}
              alt="Aperçu du produit"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-2 text-center sm:text-left">
            <div>
              <p className="text-xs font-bold text-slate-900">
                Image chargée avec succès
              </p>
              <p className="text-[11px] text-slate-500">
                Format standard optimisé pour l'affichage catalogue.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-vendix-brand focus-visible:ring-2 focus-visible:ring-vendix-brand"
              >
                <RefreshCw size={13} />
                <span>Remplacer</span>
              </button>

              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-2xs transition hover:bg-red-50 focus-visible:ring-2 focus-visible:ring-red-500"
              >
                <Trash2 size={13} />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="mt-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center cursor-pointer transition hover:border-vendix-brand hover:bg-blue-50/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-500 shadow-2xs border border-slate-200">
            <UploadCloud size={20} className="text-vendix-brand" />
          </div>

          <p className="mt-2.5 text-xs font-bold text-slate-800">
            Cliquez pour sélectionner une photo
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            PNG, JPG ou WEBP (max. 5 Mo)
          </p>
        </div>
      )}
    </div>
  );
}
