export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export type SortOrder = "asc" | "desc";

export interface SortParams {
  sortBy?: string;
  sortOrder?: SortOrder;
}
