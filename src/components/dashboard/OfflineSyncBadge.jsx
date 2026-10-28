
import { Cloud, CloudOff } from "lucide-react";

export default function OfflineSyncBadge({ isOnline = true }) {
  if (isOnline) {
    return (
      <div
        role="status"
        className="inline-flex min-h-12 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800"
      >
        <Cloud size={18} aria-hidden="true" />
        <span>Données synchronisées</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900"
    >
      <CloudOff size={18} aria-hidden="true" />
      <span>Mode hors-ligne</span>
    </div>
  );
}
