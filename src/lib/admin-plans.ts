import type { BadgeProps } from "@/components/ui/badge";

export const PLAN_OPTIONS = ["FREE", "STARTER", "PRO", "BUSINESS"] as const;

export function planBadgeVariant(plan: string): BadgeProps["variant"] {
  switch (plan) {
    case "STARTER":
      return "warning";
    case "PRO":
      return "success";
    case "BUSINESS":
      return "default";
    case "FREE":
    default:
      return "secondary";
  }
}

export interface PlanInfo {
  key: string;
  name: string;
  customers: string;
  contracts: string;
  technicians: string;
  services: string;
}

export const PLAN_DETAILS: PlanInfo[] = [
  { key: "FREE", name: "Free", customers: "10", contracts: "10", technicians: "3", services: "30" },
  {
    key: "STARTER",
    name: "Starter",
    customers: "100",
    contracts: "100",
    technicians: "20",
    services: "200",
  },
  {
    key: "PRO",
    name: "Pro",
    customers: "500",
    contracts: "500",
    technicians: "50",
    services: "1.000",
  },
  {
    key: "BUSINESS",
    name: "Business",
    customers: "Ilimitado",
    contracts: "Ilimitado",
    technicians: "Ilimitado",
    services: "Ilimitado",
  },
];
