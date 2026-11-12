
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Eye,
  MessageCircle,
  Package,
  Image as ImageIcon,
  Store,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import shopData from '../../mocks/modules/public-shop.json';
import { publicShopService } from '../../api/services.js';

// Formater les prix en FCFA
const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0) + ' FCFA';
};

export default function PublicProductDetailPage() {
  const { slug, id } = useParams();

  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(shopData.shop);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const [selectedPackaging, setSelectedPackaging] = useState('detail');
  const [imageError, setImageError] = useState(false);

  // Chargement des informations du produit
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);

      // Données de secours provenant du mock
      const mockProduct = shopData.publicProducts.find(
        (item) => item.id === id
      );

      if (isMounted) {
        setShop(shopData.shop);
        setProduct(mockProduct || null);
        setSelectedPhoto(
          mockProduct?.photos?.[0] || mockProduct?.photoUrl || ''
        );
        setLoading(false);
      }

      // Tentative de récupération depuis l'API
      try {
        const response = await publicShopService.getProductDetail(slug, id);

        const result = response?.product || response?.data?.product || response?.data || response;

        const apiProduct = result?.id ? result : null;

        if (isMounted && apiProduct) {
          setProduct(apiProduct);
          setSelectedPhoto(
            apiProduct.photos?.[0] || apiProduct.photoUrl || ''
          );

          if (result.shop) {
            setShop(result.shop);
          }
        }
      } catch (error) {
        // Le mock reste disponible si l'API n'est pas encore prête.
        console.warn('Impossible de charger le produit depuis l’API :', error);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [slug, id]);

  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-slate-500">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  // Produit introuvable
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md text-center bg-white p-8 rounded-2xl shadow-sm">
          <AlertCircle size={42} className="text-amber-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900 mt-4">
            Produit introuvable
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Cet article n'existe pas ou n'est plus disponible.
          </p>
          <Link
            to={`/boutique/${slug}`}
            className="inline-flex items-center gap-2 mt-6 text-green-700 font-semibold"
          >
            <ArrowLeft size={18} />
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  // Préparer la galerie
  const photos =
    product.photos?.length > 0
      ? product.photos
      : product.photoUrl
        ? [product.photoUrl]
        : [];

  // Déterminer le prix selon le conditionnement
  const packagingOptions = [
    { key: 'detail', label: 'Détail' },
    { key: 'halfWholesale', label: 'Demi-gros' },
    { key: 'wholesale', label: 'Gros' },
  ];

  const selectedPrice =
    product.packaging?.[selectedPackaging]?.price ?? product.publicPrice;

  // Construire le lien WhatsApp
  const phone = (shop.whatsapp || '').replace(/\D/g, '');

  const message = `Bonjour ${shop.name}, je souhaite commander l'article "${product.name}" au prix de ${selectedPrice} FCFA. Est-il disponible ?`;

  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      {/* En-tête */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            to={`/boutique/${slug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-700"
          >
            <ArrowLeft size={17} />
            Retour à la boutique
          </Link>

          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-2 mt-4 text-xs sm:text-sm text-slate-500">
            <Link
              to={`/boutique/${slug}`}
              className="hover:text-green-700"
            >
              {shop.name}
            </Link>
            <ChevronRight size={15} />
            <span className="text-slate-900 font-medium">
              {product.name}
            </span>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Galerie photos */}
          <section>
            <div className="relative bg-white rounded-3xl overflow-hidden border border-slate-100 aspect-square flex items-center justify-center">
              {!imageError && selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="text-center text-slate-300">
                  <ImageIcon size={70} className="mx-auto" />
                  <p className="text-sm mt-3">Image non disponible</p>
                </div>
              )}

              {product.available && (
                <span className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  Disponible
                </span>
              )}

              {!product.available && (
                <span className="absolute top-4 left-4 bg-red-100 text-red-700 text-xs font-semibold px-3 py-2 rounded-full">
                  Indisponible
                </span>
              )}
            </div>

            {photos.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setImageError(false);
                    }}
                    className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 ${
                      selectedPhoto === photo
                        ? 'border-green-600'
                        : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Informations produit */}
          <section className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wide">
              <Package size={15} />
              {product.category || 'Produit'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
              {product.name}
            </h1>

            {/* Compteur de vues conditionnel */}
            {shop.showViewsToPublic && (
              <div className="flex items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 rounded-full px-3 py-1.5 text-xs">
                  <Eye size={14} />
                  Vu {product.viewsCount || 0} fois
                </span>
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs text-slate-400 font-medium uppercase">
                Prix de vente
              </p>
              <p className="text-3xl font-extrabold text-green-700 mt-1">
                {formatFCFA(selectedPrice)}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Unité : {product.baseUnit || 'Unité'}
              </p>
            </div>

            {/* Choix du conditionnement */}
            {product.packaging && (
              <div className="mt-7">
                <h2 className="text-sm font-bold text-slate-800 mb-3">
                  Choisir le conditionnement
                </h2>

                <div className="grid grid-cols-3 gap-2">
                  {packagingOptions.map((option) => {
                    const packaging = product.packaging[option.key];

                    if (!packaging) return null;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSelectedPackaging(option.key)}
                        className={`rounded-xl border p-3 text-center transition ${
                          selectedPackaging === option.key
                            ? 'border-green-600 bg-green-50 text-green-800'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-green-300'
                        }`}
                      >
                        <span className="block text-xs font-semibold">
                          {packaging.label || option.label}
                        </span>
                        <span className="block text-xs mt-1 font-bold">
                          {formatFCFA(packaging.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mt-7">
              <h2 className="text-sm font-bold text-slate-800 mb-2">
                Description
              </h2>
              <p className="text-sm text-slate-600 leading-7 whitespace-pre-line">
                {product.description || 'Aucune description disponible pour ce produit.'}
              </p>
            </div>

            {/* Boutique */}
            <div className="mt-7 bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
              {shop.logoUrl ? (
                <img
                  src={shop.logoUrl}
                  alt={shop.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-green-50 text-green-700 rounded-xl flex items-center justify-center">
                  <Store size={22} />
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400">Vendu par</p>
                <p className="font-bold text-sm text-slate-900">
                  {shop.name}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bouton WhatsApp fixe en bas */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-slate-100 p-4 z-40">
        <div className="max-w-6xl mx-auto">
          {product.available && phone ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 active:scale-[0.99] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 transition"
            >
              <MessageCircle size={22} />
              Commander sur WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-3 bg-slate-300 text-white font-bold py-4 rounded-2xl cursor-not-allowed"
            >
              {product.available ? 'WhatsApp indisponible' : 'Produit indisponible'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
