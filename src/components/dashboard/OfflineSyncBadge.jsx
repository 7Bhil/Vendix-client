import { Cloud, CloudOff } from "lucide-react";

export default function OfflineSyncBadge({ isOnline = true }) {
  if (isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800"
      >
        <Cloud size={16} aria-hidden="true" />
        <span>Données synchronisées</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-900"
    >
      <CloudOff size={16} aria-hidden="true" />
      <span>Mode hors-ligne</span>
    </div>
  );
}
