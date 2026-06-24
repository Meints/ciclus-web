import { api } from "@/lib/api";
import type { Employee, CreateEmployeePayload, UpdateEmployeePayload } from "@/types/employee";
import type { PaginatedResponse } from "@/types/api";

interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

interface TimeSlot {
  start: string;
  end: string;
}

export const employeeService = {
  async list(params: ListParams = {}): Promise<PaginatedResponse<Employee>> {
    const { data } = await api.get<PaginatedResponse<Employee>>("/employees", { params });
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

  async toggle(id: string): Promise<Employee> {
    const { data } = await api.patch<Employee>(`/employees/${id}/toggle`);
    return data;
  },

  async getAvailability(id: string, date: string): Promise<TimeSlot[]> {
    const { data } = await api.get<TimeSlot[]>(`/employees/${id}/availability`, { params: { date } });
    return data;
  },
};
