import type { UserRole } from "./auth";

export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  servicesThisMonth: number;
  status: EmployeeStatus;
  createdAt: string;
}

export interface CreateEmployeePayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}

export type UpdateEmployeePayload = Partial<
  Omit<CreateEmployeePayload, "password">
> & {
  status?: EmployeeStatus;
};
