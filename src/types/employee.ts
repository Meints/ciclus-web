export type EmployeeStatus = "ACTIVE" | "INACTIVE";

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: EmployeeStatus;
  isActive: boolean;
  servicesThisMonth?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeePayload {
  name: string;
  email?: string;
  phone?: string;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;
