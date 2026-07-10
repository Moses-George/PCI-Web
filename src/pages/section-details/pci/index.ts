// ── Helpers & Theme ───────────────────────────────────────────────────────────

export const RATING_COLOR: Record<string, string> = {
  Good: "text-emerald-600",
  Satisfactory: "text-sky-600",
  Fair: "text-amber-500",
  Poor: "text-orange-500",
  "Very Poor": "text-rose-500",
  Serious: "text-rose-700",
  Failed: "text-red-900",
};

export const RATING_BG_GRADIENT: Record<string, string> = {
  Good: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100",
  Satisfactory: "bg-gradient-to-br from-sky-50 to-sky-100/50 border-sky-100",
  Fair: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100",
  Poor: "bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-100",
  "Very Poor": "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100",
  Serious: "bg-gradient-to-br from-rose-100 to-rose-200/50 border-rose-200",
  Failed: "bg-gradient-to-br from-red-100 to-red-200/50 border-red-200",
};

export const RATING_BADGE: Record<string, string> = {
  Good: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  Satisfactory: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  Fair: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  Poor: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
  "Very Poor": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  Serious: "bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-600/30",
  Failed: "bg-red-100 text-red-900 ring-1 ring-inset ring-red-600/30",
};

export function pciTextGradient(pci: number) {
  if (pci >= 85) return "bg-gradient-to-br from-emerald-500 to-emerald-700";
  if (pci >= 70) return "bg-gradient-to-br from-sky-500 to-sky-700";
  if (pci >= 55) return "bg-gradient-to-br from-amber-400 to-amber-600";
  if (pci >= 40) return "bg-gradient-to-br from-orange-500 to-orange-700";
  return "bg-gradient-to-br from-rose-500 to-rose-700";
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}