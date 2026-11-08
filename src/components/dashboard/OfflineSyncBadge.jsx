import { Cloud, CloudOff } from "lucide-react";

export default function OfflineSyncBadge({ isOnline = true }) {
  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-2xs"
    >
      <CloudOff size={13} aria-hidden="true" />
      <span>Hors-ligne</span>
    </div>
  );
}
