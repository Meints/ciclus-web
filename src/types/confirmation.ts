export type ConfirmationViewStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "NOT_FOUND";

export interface ConfirmationSummary {
  status: ConfirmationViewStatus;
  serviceId: string | null;
  companyName: string | null;
  serviceTypeLabel: string | null;
  customerName: string | null;
  technicianName: string | null;
  completedAt: string | null;
  confirmedAt: string | null;
}
