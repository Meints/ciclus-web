import { api } from "@/lib/api";
import type { PaginatedResponse, PaginationParams } from "@/types/api";
import type {
  CreateEmployeePayload,
  Employee,
  UpdateEmployeePayload,
} from "@/types/employee";

export const employeeService = {
  async list(params: PaginationParams): Promise<PaginatedResponse<Employee>> {
    const { data } = await api.get<PaginatedResponse<Employee>>("/employees", {
      params,
    });
    return data;
  },

  async getById(id: string): Promise<Employee> {
    const { data } = await api.get<Employee>(`/employees/${id}`);
    return data;
  },

  async create(payload: CreateEmployeePayload): Promise<Employee> {
    const { data } = await api.post<Employee>("/employees", payload);
    return data;
  },

  async update(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
    const { data } = await api.put<Employee>(`/employees/${id}`, payload);
    return data;
  },
};
