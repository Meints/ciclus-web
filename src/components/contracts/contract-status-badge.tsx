import { StatusBadge } from "@/components/shared/status-badge";
import { CONTRACT_STATUS_LABELS, CONTRACT_STATUS_VARIANTS } from "@/lib/labels";
import type { ContractStatus } from "@/types/contract";

export function ContractStatusBadge({ status }: { status: ContractStatus }) {
  return (
    <StatusBadge label={CONTRACT_STATUS_LABELS[status]} variant={CONTRACT_STATUS_VARIANTS[status]} />
  );
}
