export type CustomerDocumentType = "CPF" | "CNPJ";
export type CustomerStatus = "ACTIVE" | "INACTIVE";

export interface CustomerAddress {
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Customer {
  id: string;
  companyId: string;
  legalName: string;
  tradeName?: string | null;
  documentType: CustomerDocumentType;
  document: string;
  email?: string | null;
  phone: string;
  address: CustomerAddress;
  status: CustomerStatus;
  contractsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPayload {
  legalName: string;
  tradeName?: string;
  documentType: CustomerDocumentType;
  document: string;
  email?: string;
  phone: string;
  address: CustomerAddress;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
}
