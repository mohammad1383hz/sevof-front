import { t, formatDateTime as fmtDateTime, formatRelative as fmtRelative } from "../i18n";
export function formatDateTime(value?: string | null): string {
  return fmtDateTime(value);
}

export function formatRelative(value?: string | null): string {
  return fmtRelative(value);
}

export function getArticleStatusBadge(status: string): { text: string; cls: string } {
  switch (status) {
    case "completed":
      return { text: t("dashboard.articleStatus.completed"), cls: "bg-emerald-100 text-emerald-700" };
    case "failed":
      return { text: t("dashboard.articleStatus.failed"), cls: "bg-rose-100 text-rose-700" };
    case "pending":
      return { text: t("dashboard.articleStatus.pending"), cls: "bg-slate-100 text-slate-600" };
    case "creating_brief":
    case "generating_outline":
    case "generating_sections":
    case "reviewing":
      return { text: t("dashboard.articleStatus.generating"), cls: "bg-blue-100 text-blue-700" };
    default:
      return { text: status, cls: "bg-slate-100 text-slate-600" };
  }
}

export function getIdeaStatusBadge(status: string): { text: string; cls: string } {
  switch (status) {
    case "approved":
      return { text: t("dashboard.ideaStatus.approved"), cls: "bg-emerald-100 text-emerald-700" };
    case "rejected":
      return { text: t("dashboard.ideaStatus.rejected"), cls: "bg-rose-100 text-rose-700" };
    case "used":
      return { text: t("dashboard.ideaStatus.used"), cls: "bg-slate-200 text-slate-600" };
    default:
      return { text: t("dashboard.ideaStatus.recommended"), cls: "bg-amber-100 text-amber-700" };
  }
}