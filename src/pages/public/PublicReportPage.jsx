
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Store,
  User,
  Phone,
  FileText,
  Upload,
  X,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

import shopData from '../../mocks/modules/public-shop.json';
import { publicShopService } from '../../api/services.js';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_FILES = 5;

export default function PublicReportPage() {
  const { slug } = useParams();

  const initialShop = slug
    ? shopData.shop.slug === slug
      ? shopData.shop
      : null
    : null;

  const [shopIdentifier, setShopIdentifier] = useState(
    initialShop?.name || ''
  );

  const [reportType, setReportType] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    setError('');

    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`Vous pouvez ajouter au maximum ${MAX_FILES} fichiers.`);
      event.target.value = '';
      return;
    }

    const validFiles = [];

    for (const file of selectedFiles) {
      const isValidType =
        file.type.startsWith('image/') ||
        file.type === 'application/pdf';

      if (!isValidType) {
        setError('Seules les images et les fichiers PDF sont acceptés.');
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`Le fichier "${file.name}" dépasse la limite de 5 Mo.`);
        continue;
      }

      validFiles.push(file);
    }

    setFiles((previous) => [...previous, ...validFiles]);
    event.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!shopIdentifier.trim()) {
      setError('Veuillez identifier la boutique concernée.');
      return;
    }

    if (!reportType) {
      setError('Veuillez sélectionner un motif de signalement.');
      return;
    }

    if (description.trim().length < 15) {
      setError('Veuillez décrire les faits avec au moins 15 caractères.');
      return;
    }

    const formData = new FormData();

    formData.append('shop_identifier', shopIdentifier.trim());
    formData.append('report_type', reportType);
    formData.append('reporter_name', reporterName.trim());
    formData.append('reporter_phone', reporterPhone.trim());
    formData.append('description', description.trim());

    files.forEach((file) => {
      formData.append('evidence[]', file);
    });

    try {
      setLoading(true);

      await publicShopService.submitReport(formData);

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Erreur lors du signalement :', err);

      setError(
        err.response?.data?.message ||
        'Impossible d’envoyer votre signalement. Vérifiez votre connexion et réessayez.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-5">
            Signalement envoyé !
          </h1>

          <p className="text-sm text-slate-500 leading-7 mt-3">
            Votre signalement a bien été transmis à l'équipe Vendix.
            Notre équipe de modération va examiner les informations
            communiquées.
          </p>

          <p className="text-xs text-slate-400 mt-3">
            Merci de contribuer à rendre Vendix plus sûr.
          </p>

          <Link
            to={slug ? `/boutique/${slug}` : '/'}
            className="inline-flex items-center justify-center gap-2 mt-7 bg-vendix-brand text-white font-bold px-6 py-3 rounded-xl hover:bg-vendix-brand-dark transition"
          >
            <ArrowLeft size={17} />
            Retour
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* En-tête */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <Link
            to={slug ? `/boutique/${slug}` : '/'}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-vendix-brand"
          >
            <ArrowLeft size={17} />
            Retour
          </Link>

          <div className="flex items-center gap-3 mt-5">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle size={25} />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Signaler un problème
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Aidez-nous à protéger les utilisateurs de Vendix.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-6">
          <ShieldCheck className="text-amber-700 shrink-0" size={22} />

          <p className="text-xs sm:text-sm text-amber-900 leading-6">
            Les informations communiquées seront transmises à notre
            équipe de modération pour vérification. Veuillez fournir
            des informations exactes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8 space-y-7"
        >
          {/* Identification de la boutique */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Store size={19} className="text-vendix-brand" />
              <h2 className="font-bold text-slate-900">
                Boutique concernée
              </h2>
            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nom, numéro WhatsApp ou identifiant de la boutique *
            </label>

            <input
              type="text"
              value={shopIdentifier}
              onChange={(event) => setShopIdentifier(event.target.value)}
              placeholder="Ex : Boutique Le Progrès ou +22997000001"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            />

            {initialShop && (
              <p className="text-xs text-emerald-600 mt-2">
                Boutique préidentifiée depuis sa page publique.
              </p>
            )}
          </section>

          <div className="border-t border-slate-100" />

          {/* Motif */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={19} className="text-vendix-brand" />
              <h2 className="font-bold text-slate-900">
                Motif du signalement
              </h2>
            </div>

            <div className="space-y-3">
              {shopData.reportTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition ${
                    reportType === type.value
                      ? 'border-vendix-brand bg-blue-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={reportType === type.value}
                    onChange={(event) => setReportType(event.target.value)}
                    className="w-4 h-4 accent-blue-700"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {type.label}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Coordonnées */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <User size={19} className="text-vendix-brand" />
              <h2 className="font-bold text-slate-900">
                Vos coordonnées
              </h2>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Ces informations sont facultatives. Vous pouvez rester anonyme.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Votre nom
                </label>

                <input
                  type="text"
                  value={reporterName}
                  onChange={(event) => setReporterName(event.target.value)}
                  placeholder="Votre nom (facultatif)"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone size={15} />
                  Votre numéro de téléphone
                </label>

                <input
                  type="tel"
                  value={reporterPhone}
                  onChange={(event) => setReporterPhone(event.target.value)}
                  placeholder="+229 XX XX XX XX"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-slate-100" />

          {/* Description */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText size={19} className="text-vendix-brand" />
              <h2 className="font-bold text-slate-900">
                Description des faits
              </h2>
            </div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Expliquez le problème rencontré *
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Décrivez précisément ce qui s'est passé : date, montant payé, produit concerné, problème rencontré..."
              rows={5}
              minLength={15}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none resize-y focus:border-vendix-brand focus:ring-2 focus:ring-blue-100"
            />

            <p className="text-xs text-slate-400 text-right mt-1">
              {description.length} caractères
            </p>
          </section>

          <div className="border-t border-slate-100" />

          {/* Justificatifs */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Upload size={19} className="text-vendix-brand" />
              <h2 className="font-bold text-slate-900">
                Pièces justificatives
              </h2>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Ajoutez des captures de conversation, preuves de paiement
              ou photos utiles à l'examen de votre signalement.
            </p>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-7 cursor-pointer hover:border-vendix-brand hover:bg-blue-50/30 transition">
              <ImageIcon size={30} className="text-slate-400" />

              <span className="text-sm font-semibold text-slate-700 mt-3">
                Ajouter des fichiers
              </span>

              <span className="text-xs text-slate-400 mt-1 text-center">
                Images ou PDF · 5 Mo maximum par fichier · 5 fichiers maximum
              </span>

              <input
                type="file"
                accept="image/*,.pdf,application/pdf"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} Mo
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      aria-label="Supprimer le fichier"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Erreur */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-vendix-brand hover:bg-vendix-brand-dark disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <AlertTriangle size={19} />
                Envoyer mon signalement
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400">
            Vos informations sont transmises à l'équipe de modération Vendix.
          </p>
        </form>
      </main>
    </div>
  );
}
