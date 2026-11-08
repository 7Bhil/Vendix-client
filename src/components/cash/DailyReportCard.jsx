import { useState } from "react";
import { Banknote, Check, Copy, Printer, Share2, Smartphone } from "lucide-react";

const formatPrice = (amount) =>
  `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;

export default function DailyReportCard({
  date,
  salesCount,
  totalSales,
  totalCollected,
  cashReceived,
  momoReceived,
  otherReceived,
  balanceDue,
  countedCash,
  cashDifference,
  openingAmount = 0,
  cashExpenses = 0,
  theoreticalCash = null,
}) {
  const [shareMessage, setShareMessage] = useState("");

  const shareText = [
    `Rapport journalier Vendix — ${date}`,
    `${salesCount} vente(s) — ventes : ${formatPrice(totalSales)}`,
    `Encaissements : ${formatPrice(totalCollected)}`,
    `Fond initial : ${formatPrice(openingAmount)} | Dépenses espèces : ${formatPrice(cashExpenses)}`,
    `Espèces encaissées : ${formatPrice(cashReceived)} | Mobile Money : ${formatPrice(momoReceived)}`,
    `Autres règlements : ${formatPrice(otherReceived)}`,
    `Solde théorique caisse : ${formatPrice(theoreticalCash !== null ? theoreticalCash : (openingAmount + cashReceived - cashExpenses))}`,
    `Reste à recouvrer : ${formatPrice(balanceDue)}`,
    ...(countedCash === null
      ? []
      : [
          `Espèces comptées : ${formatPrice(countedCash)}`,
          `Écart de caisse : ${cashDifference > 0 ? "+" : ""}${formatPrice(cashDifference)}`,
        ]),
  ].join("\n");

  const handleShare = async () => {
    setShareMessage("");

    if (navigator.share) {
      try {
        await navigator.share({ title: "Rapport journalier Vendix", text: shareText });
      } catch (error) {
        if (error.name !== "AbortError") {
          setShareMessage("Le partage a échoué. Réessayez ou utilisez l’impression.");
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setShareMessage("Rapport copié dans le presse-papiers.");
    } catch {
      setShareMessage("Le partage n’est pas disponible dans ce navigateur.");
    }
  };

  const paymentTotal = cashReceived + momoReceived + otherReceived;
  const cashWidth = paymentTotal > 0 ? (cashReceived / paymentTotal) * 100 : 0;
  const momoWidth = paymentTotal > 0 ? (momoReceived / paymentTotal) * 100 : 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-vendix-brand">
            Synthèse journalière
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-slate-900">{date}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {salesCount} vente(s) · {formatPrice(totalCollected)} encaissés sur {formatPrice(totalSales)} de ventes
          </p>
        </div>

        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand"
          >
            <Printer size={16} aria-hidden="true" />
            Imprimer
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-vendix-brand px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vendix-brand focus-visible:ring-offset-2"
          >
            {shareMessage.startsWith("Rapport copié") ? (
              <Check size={16} aria-hidden="true" />
            ) : navigator.share ? (
              <Share2 size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            Partager
          </button>
        </div>
      </div>

      {shareMessage && (
        <p className="mt-3 text-sm text-slate-600" role="status">
          {shareMessage}
        </p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-500">Total des ventes</p>
          <p className="mt-1 font-extrabold text-slate-900">{formatPrice(totalSales)}</p>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-xs font-semibold text-blue-700">Total encaissé</p>
          <p className="mt-1 font-extrabold text-blue-900">{formatPrice(totalCollected)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <p className="text-xs font-semibold text-amber-700">Reste à recouvrer</p>
          <p className="mt-1 font-extrabold text-amber-900">{formatPrice(balanceDue)}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-semibold text-emerald-700">Moyenne par vente</p>
          <p className="mt-1 font-extrabold text-emerald-900">
            {formatPrice(salesCount > 0 ? Math.round(totalSales / salesCount) : 0)}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">Flux de caisse théorique</h3>
          <span className="text-xs font-semibold text-slate-500">
            Formule : Fond initial + Espèces encaissées - Dépenses en espèces
          </span>
        </div>
        <div className="mt-3 grid gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:grid-cols-4">
          <div>
            <span className="text-xs text-slate-500">Fond initial</span>
            <p className="font-bold text-slate-800">{formatPrice(openingAmount)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">+ Ventes espèces</span>
            <p className="font-bold text-emerald-700">+{formatPrice(cashReceived)}</p>
          </div>
          <div>
            <span className="text-xs text-slate-500">- Dépenses espèces</span>
            <p className="font-bold text-red-600">-{formatPrice(cashExpenses)}</p>
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-700">= Solde théorique</span>
            <p className="text-base font-extrabold text-blue-900">
              {formatPrice(theoreticalCash !== null ? theoreticalCash : (openingAmount + cashReceived - cashExpenses))}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">Répartition des encaissements</h3>
          <span className="text-xs font-semibold text-slate-500">{formatPrice(paymentTotal)}</span>
        </div>
        <div
          className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100"
          role="img"
          aria-label={`Espèces ${formatPrice(cashReceived)}, Mobile Money ${formatPrice(momoReceived)}, autres règlements ${formatPrice(otherReceived)}`}
        >
          <span className="bg-emerald-500" style={{ width: `${cashWidth}%` }} />
          <span className="bg-orange-400" style={{ width: `${momoWidth}%` }} />
          <span
            className="bg-slate-400"
            style={{ width: `${Math.max(0, 100 - cashWidth - momoWidth)}%` }}
          />
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Banknote size={16} className="text-emerald-600" aria-hidden="true" />
            Espèces <strong className="ml-auto text-slate-900">{formatPrice(cashReceived)}</strong>
          </p>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Smartphone size={16} className="text-orange-600" aria-hidden="true" />
            Mobile Money <strong className="ml-auto text-slate-900">{formatPrice(momoReceived)}</strong>
          </p>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" aria-hidden="true" />
            Autres <strong className="ml-auto text-slate-900">{formatPrice(otherReceived)}</strong>
          </p>
        </div>
      </div>

      {countedCash !== null && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
          <span className="text-slate-600">Espèces comptées : <strong className="text-slate-900">{formatPrice(countedCash)}</strong></span>
          <span className="font-bold text-slate-800">
            Écart : {cashDifference > 0 ? "+" : ""}{formatPrice(cashDifference)}
          </span>
        </div>
      )}
    </section>
  );
}
