import { StatusBadge } from "@/components/shared/status-badge";
import { CONTRACT_STATUS_LABELS, CONTRACT_STATUS_VARIANTS } from "@/lib/labels";
import type { Contract, ContractStatus } from "@/types/contract";

export function computeContractStatus(contract: Pick<Contract, "status" | "endDate">): ContractStatus {
  if (contract.status === "CANCELLED" || contract.status === "PAUSED") {
    return contract.status;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const datePart = contract.endDate.split("T")[0]!;
  const [y, m, d] = datePart.split("-").map(Number) as [number, number, number];
  const end = new Date(y, m - 1, d);
  const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (days <= 0) return "EXPIRED";
  if (days <= 30) return "ABOUT_TO_EXPIRE";
  return contract.status === "EXPIRED" ? "EXPIRED" : "ACTIVE";
}

export function ContractStatusBadge({ contract }: { contract: Pick<Contract, "status" | "endDate"> }) {
  const effectiveStatus = computeContractStatus(contract);
  return (
    <StatusBadge label={CONTRACT_STATUS_LABELS[effectiveStatus]} variant={CONTRACT_STATUS_VARIANTS[effectiveStatus]} />
  );
}
