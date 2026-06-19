import type { Employee } from "@/types/employee";
import type { Customer } from "@/types/customer";
import type { Contract } from "@/types/contract";
import type { Service } from "@/types/service";
import type { Equipment } from "@/types/equipment";
import type { UserRole } from "@/types/auth";
import type { ServiceNiche } from "@/lib/service-types";
import { confirmByToken, createConfirmation } from "@/mock/confirmations";

export const COMPANY_ID = "company-1";
export const COMPANY_NAME = "Ciclus Manutenção e Serviços";

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysFromNow(days: number): string {
  const date = startOfDay(new Date());
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export function diffInDays(targetIso: string, baseIso: string = new Date().toISOString()): number {
  const target = startOfDay(new Date(targetIso)).getTime();
  const base = startOfDay(new Date(baseIso)).getTime();
  return Math.round((target - base) / 86_400_000);
}

export interface MockAuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export const AUTH_USERS: MockAuthUser[] = [
  { id: "emp-1", email: "owner@ciclus.com", password: "123456", name: "Ana Souza", role: "OWNER" },
  { id: "emp-2", email: "admin@ciclus.com", password: "123456", name: "Carlos Lima", role: "ADMIN" },
  {
    id: "emp-3",
    email: "tecnico@ciclus.com",
    password: "123456",
    name: "Pedro Santos",
    role: "TECHNICIAN",
  },
];

interface MockCompany {
  niche: ServiceNiche | null;
}

interface MockDb {
  employees: Employee[];
  customers: Customer[];
  contracts: Contract[];
  equipment: Equipment[];
  services: Service[];
  company: MockCompany;
  idCounter: number;
}

declare global {
  var __ciclusMockDb: MockDb | undefined;
}

function buildSeed(): MockDb {
  const employees: Employee[] = [
  {
    id: "emp-1",
    companyId: COMPANY_ID,
    name: "Ana Souza",
    email: "owner@ciclus.com",
    phone: "11988887777",
    servicesThisMonth: 0,
    status: "ACTIVE",
    isActive: true,
    createdAt: daysFromNow(-400),
    updatedAt: daysFromNow(-400),
  },
  {
    id: "emp-2",
    companyId: COMPANY_ID,
    name: "Carlos Lima",
    email: "admin@ciclus.com",
    phone: "11977776666",
    servicesThisMonth: 0,
    status: "ACTIVE",
    isActive: true,
    createdAt: daysFromNow(-380),
    updatedAt: daysFromNow(-380),
  },
  {
    id: "emp-3",
    companyId: COMPANY_ID,
    name: "Pedro Santos",
    email: "tecnico@ciclus.com",
    phone: "11966665555",
    servicesThisMonth: 0,
    status: "ACTIVE",
    isActive: true,
    createdAt: daysFromNow(-300),
    updatedAt: daysFromNow(-300),
  },
  {
    id: "emp-4",
    companyId: COMPANY_ID,
    name: "Juliana Alves",
    email: "juliana.alves@ciclus.com",
    phone: "11955554444",
    servicesThisMonth: 0,
    status: "ACTIVE",
    isActive: true,
    createdAt: daysFromNow(-260),
    updatedAt: daysFromNow(-260),
  },
  {
    id: "emp-5",
    companyId: COMPANY_ID,
    name: "Roberto Dias",
    email: "roberto.dias@ciclus.com",
    phone: "11944443333",
    servicesThisMonth: 0,
    status: "INACTIVE",
    isActive: false,
    createdAt: daysFromNow(-500),
    updatedAt: daysFromNow(-500),
  },
];

  const customers: Customer[] = [
  {
    id: "cust-1",
    companyId: COMPANY_ID,
    legalName: "Condomínio Edifício Aurora",
    tradeName: null,
    documentType: "CNPJ",
    document: "12345678000190",
    email: "sindico@edificioaurora.com.br",
    phone: "1132345566",
    address: {
      zipCode: "01310100",
      street: "Avenida Paulista",
      number: "1500",
      complement: "Bloco A",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
    },
    status: "ACTIVE",
    contractsCount: 0,
    createdAt: daysFromNow(-200),
    updatedAt: daysFromNow(-10),
  },
  {
    id: "cust-2",
    companyId: COMPANY_ID,
    legalName: "Supermercado Boa Vista Ltda",
    tradeName: "Boa Vista Supermercados",
    documentType: "CNPJ",
    document: "98765432000110",
    email: "manutencao@boavista.com.br",
    phone: "1933451122",
    address: {
      zipCode: "13010001",
      street: "Rua Barão de Jaguara",
      number: "780",
      complement: "",
      neighborhood: "Centro",
      city: "Campinas",
      state: "SP",
    },
    status: "ACTIVE",
    contractsCount: 0,
    createdAt: daysFromNow(-180),
    updatedAt: daysFromNow(-5),
  },
  {
    id: "cust-3",
    companyId: COMPANY_ID,
    legalName: "Clínica Vida Plena Ltda",
    tradeName: "Clínica Vida Plena",
    documentType: "CNPJ",
    document: "11222333000144",
    email: "contato@vidaplena.com.br",
    phone: "1130405060",
    address: {
      zipCode: "04538133",
      street: "Avenida Brigadeiro Faria Lima",
      number: "2200",
      complement: "Conjunto 12",
      neighborhood: "Itaim Bibi",
      city: "São Paulo",
      state: "SP",
    },
    status: "ACTIVE",
    contractsCount: 0,
    createdAt: daysFromNow(-150),
    updatedAt: daysFromNow(-2),
  },
  {
    id: "cust-4",
    companyId: COMPANY_ID,
    legalName: "Restaurante Sabor Caseiro Ltda",
    tradeName: "Sabor Caseiro",
    documentType: "CNPJ",
    document: "22333444000155",
    email: "gerencia@saborcaseiro.com.br",
    phone: "1136172839",
    address: {
      zipCode: "06010000",
      street: "Rua Antônio Belém",
      number: "320",
      complement: "",
      neighborhood: "Centro",
      city: "Osasco",
      state: "SP",
    },
    status: "ACTIVE",
    contractsCount: 0,
    createdAt: daysFromNow(-120),
    updatedAt: daysFromNow(-30),
  },
  {
    id: "cust-5",
    companyId: COMPANY_ID,
    legalName: "João Pedro Ferreira",
    tradeName: null,
    documentType: "CPF",
    document: "52998224725",
    email: "joaopedro@gmail.com",
    phone: "1199887766",
    address: {
      zipCode: "07010000",
      street: "Rua das Acácias",
      number: "45",
      complement: "Casa 2",
      neighborhood: "Jardim Flórida",
      city: "Guarulhos",
      state: "SP",
    },
    status: "ACTIVE",
    contractsCount: 0,
    createdAt: daysFromNow(-90),
    updatedAt: daysFromNow(-1),
  },
  {
    id: "cust-6",
    companyId: COMPANY_ID,
    legalName: "Indústria Metalcorte S.A.",
    tradeName: "Metalcorte",
    documentType: "CNPJ",
    document: "33444555000166",
    email: "facilities@metalcorte.com.br",
    phone: "1532112233",
    address: {
      zipCode: "18010000",
      street: "Rodovia Raposo Tavares",
      number: "km 98",
      complement: "Galpão 3",
      neighborhood: "Distrito Industrial",
      city: "Sorocaba",
      state: "SP",
    },
    status: "INACTIVE",
    contractsCount: 0,
    createdAt: daysFromNow(-600),
    updatedAt: daysFromNow(-90),
  },
];

  const contracts: Contract[] = [
  {
    id: "ctr-1",
    companyId: COMPANY_ID,
    customerId: "cust-1",
    customerName: "Condomínio Edifício Aurora",
    frequency: "MONTHLY",
    startDate: daysFromNow(-180),
    endDate: daysFromNow(185),
    nextVisitDate: daysFromNow(2),
    value: 1200,
    responsibleEmployeeId: "emp-3",
    responsibleEmployeeName: "Pedro Santos",
    notes: "Manutenção preventiva mensal dos splits das áreas comuns.",
    status: "ACTIVE",
    createdAt: daysFromNow(-180),
    updatedAt: daysFromNow(-10),
  },
  {
    id: "ctr-2",
    companyId: COMPANY_ID,
    customerId: "cust-2",
    customerName: "Supermercado Boa Vista Ltda",
    frequency: "QUARTERLY",
    startDate: daysFromNow(-150),
    endDate: daysFromNow(580),
    nextVisitDate: daysFromNow(10),
    value: 800,
    responsibleEmployeeId: "emp-4",
    responsibleEmployeeName: "Juliana Alves",
    notes: "Dedetização trimestral em todo o estoque e área de vendas.",
    status: "ACTIVE",
    createdAt: daysFromNow(-150),
    updatedAt: daysFromNow(-20),
  },
  {
    id: "ctr-3",
    companyId: COMPANY_ID,
    customerId: "cust-3",
    customerName: "Clínica Vida Plena Ltda",
    frequency: "MONTHLY",
    startDate: daysFromNow(-120),
    endDate: daysFromNow(245),
    nextVisitDate: daysFromNow(1),
    value: 2500,
    responsibleEmployeeId: "emp-3",
    responsibleEmployeeName: "Pedro Santos",
    notes: "Limpeza técnica de consultórios e recepção.",
    status: "ACTIVE",
    createdAt: daysFromNow(-120),
    updatedAt: daysFromNow(-3),
  },
  {
    id: "ctr-4",
    companyId: COMPANY_ID,
    customerId: "cust-4",
    customerName: "Restaurante Sabor Caseiro Ltda",
    frequency: "SEMIANNUAL",
    startDate: daysFromNow(-365),
    endDate: daysFromNow(365),
    nextVisitDate: daysFromNow(-30),
    value: 3000,
    responsibleEmployeeId: "emp-4",
    responsibleEmployeeName: "Juliana Alves",
    notes: "Manutenção predial semestral da cozinha industrial.",
    status: "EXPIRED",
    createdAt: daysFromNow(-365),
    updatedAt: daysFromNow(-30),
  },
  {
    id: "ctr-5",
    companyId: COMPANY_ID,
    customerId: "cust-5",
    customerName: "João Pedro Ferreira",
    frequency: "YEARLY",
    startDate: daysFromNow(-90),
    endDate: daysFromNow(275),
    nextVisitDate: daysFromNow(25),
    value: 600,
    responsibleEmployeeId: "emp-3",
    responsibleEmployeeName: "Pedro Santos",
    notes: null,
    status: "ACTIVE",
    createdAt: daysFromNow(-90),
    updatedAt: daysFromNow(-1),
  },
  {
    id: "ctr-6",
    companyId: COMPANY_ID,
    customerId: "cust-6",
    customerName: "Indústria Metalcorte S.A.",
    frequency: "MONTHLY",
    startDate: daysFromNow(-300),
    endDate: daysFromNow(65),
    nextVisitDate: null,
    value: 950,
    responsibleEmployeeId: null,
    responsibleEmployeeName: null,
    notes: "Contrato cancelado após encerramento das atividades na planta.",
    status: "CANCELLED",
    createdAt: daysFromNow(-300),
    updatedAt: daysFromNow(-90),
  },
];

  const equipment: Equipment[] = [
  {
    id: "equip-1",
    companyId: COMPANY_ID,
    customerId: "cust-1",
    type: "AC_SPLIT",
    brand: "LG",
    model: "Dual Inverter Voice",
    capacity: "12.000 BTUs",
    serialNumber: "LG-998211",
    location: "Hall de entrada",
    installationDate: daysFromNow(-400),
    notes: null,
    status: "ACTIVE",
    createdAt: daysFromNow(-400),
    updatedAt: daysFromNow(-400),
  },
  {
    id: "equip-2",
    companyId: COMPANY_ID,
    customerId: "cust-1",
    type: "AC_SPLIT",
    brand: "Samsung",
    model: "WindFree",
    capacity: "18.000 BTUs",
    serialNumber: null,
    location: "Salão de festas",
    installationDate: daysFromNow(-200),
    notes: null,
    status: "ACTIVE",
    createdAt: daysFromNow(-200),
    updatedAt: daysFromNow(-200),
  },
  {
    id: "equip-3",
    companyId: COMPANY_ID,
    customerId: "cust-1",
    type: "AC_CASSETTE",
    brand: "Daikin",
    model: "Sky Air",
    capacity: "24.000 BTUs",
    serialNumber: null,
    location: "Sala de reuniões 2º andar",
    installationDate: daysFromNow(-600),
    notes: "Equipamento desativado após reforma da sala.",
    status: "INACTIVE",
    createdAt: daysFromNow(-600),
    updatedAt: daysFromNow(-60),
  },
  {
    id: "equip-4",
    companyId: COMPANY_ID,
    customerId: "cust-4",
    type: "EXHAUST_FAN",
    brand: "Ventokit",
    model: "VT-500",
    capacity: null,
    serialNumber: null,
    location: "Cozinha industrial",
    installationDate: daysFromNow(-500),
    notes: "Necessita troca de correia a cada 6 meses.",
    status: "ACTIVE",
    createdAt: daysFromNow(-500),
    updatedAt: daysFromNow(-10),
  },
  {
    id: "equip-5",
    companyId: COMPANY_ID,
    customerId: "cust-5",
    type: "AC_SPLIT",
    brand: "Electrolux",
    model: "Ecoturbo",
    capacity: "9.000 BTUs",
    serialNumber: null,
    location: "Quarto",
    installationDate: daysFromNow(-300),
    notes: null,
    status: "ACTIVE",
    createdAt: daysFromNow(-300),
    updatedAt: daysFromNow(-300),
  },
];

  const services: Service[] = [
  {
    id: "srv-1",
    companyId: COMPANY_ID,
    contractId: "ctr-1",
    customerId: "cust-1",
    customerName: "Condomínio Edifício Aurora",
    customerAddress: "Avenida Paulista, 1500 - Bela Vista, São Paulo/SP",
    serviceType: "PREVENTIVE_MAINTENANCE",
    scheduledDate: daysFromNow(0),
    employeeId: "emp-3",
    employeeName: "Pedro Santos",
    status: "SCHEDULED",
    equipment: "Split 12.000 BTUs - Hall de entrada",
    equipmentIds: ["equip-1"],
    execution: null,
    reportPdfUrl: null,
    createdAt: daysFromNow(-10),
    updatedAt: daysFromNow(-10),
  },
  {
    id: "srv-2",
    companyId: COMPANY_ID,
    contractId: "ctr-3",
    customerId: "cust-3",
    customerName: "Clínica Vida Plena Ltda",
    customerAddress: "Avenida Brigadeiro Faria Lima, 2200 - Itaim Bibi, São Paulo/SP",
    serviceType: "CLEANING",
    scheduledDate: daysFromNow(1),
    employeeId: "emp-3",
    employeeName: "Pedro Santos",
    status: "SCHEDULED",
    equipment: "Recepção e 4 consultórios",
    equipmentIds: [],
    execution: null,
    reportPdfUrl: null,
    createdAt: daysFromNow(-3),
    updatedAt: daysFromNow(-3),
  },
  {
    id: "srv-3",
    companyId: COMPANY_ID,
    contractId: "ctr-2",
    customerId: "cust-2",
    customerName: "Supermercado Boa Vista Ltda",
    customerAddress: "Rua Barão de Jaguara, 780 - Centro, Campinas/SP",
    serviceType: "COCKROACH_CONTROL",
    scheduledDate: daysFromNow(2),
    employeeId: "emp-4",
    employeeName: "Juliana Alves",
    status: "SCHEDULED",
    equipment: null,
    equipmentIds: [],
    execution: null,
    reportPdfUrl: null,
    createdAt: daysFromNow(-20),
    updatedAt: daysFromNow(-20),
  },
  {
    id: "srv-4",
    companyId: COMPANY_ID,
    contractId: "ctr-1",
    customerId: "cust-1",
    customerName: "Condomínio Edifício Aurora",
    customerAddress: "Avenida Paulista, 1500 - Bela Vista, São Paulo/SP",
    serviceType: "PREVENTIVE_MAINTENANCE",
    scheduledDate: daysFromNow(4),
    employeeId: "emp-3",
    employeeName: "Pedro Santos",
    status: "SCHEDULED",
    equipment: "Split 18.000 BTUs - Salão de festas",
    equipmentIds: ["equip-2"],
    execution: null,
    reportPdfUrl: null,
    createdAt: daysFromNow(-10),
    updatedAt: daysFromNow(-10),
  },
  {
    id: "srv-5",
    companyId: COMPANY_ID,
    contractId: "ctr-5",
    customerId: "cust-5",
    customerName: "João Pedro Ferreira",
    customerAddress: "Rua das Acácias, 45 - Jardim Flórida, Guarulhos/SP",
    serviceType: "PREVENTIVE_MAINTENANCE",
    scheduledDate: daysFromNow(-3),
    employeeId: "emp-3",
    employeeName: "Pedro Santos",
    status: "COMPLETED",
    equipment: "Split 9.000 BTUs - Quarto",
    equipmentIds: ["equip-5"],
    execution: {
      notes: "Limpeza de filtros, verificação de gás e teste de funcionamento realizados com sucesso.",
      photoUrls: [
        "https://picsum.photos/seed/ciclus-os-5-a/480/480",
        "https://picsum.photos/seed/ciclus-os-5-b/480/480",
      ],
      completedAt: daysFromNow(-3),
    },
    reportPdfUrl: "/api/services/srv-5/report",
    confirmationStatus: "PENDING",
    confirmationToken: null,
    confirmationLink: null,
    confirmationExpiresAt: null,
    confirmedAt: null,
    createdAt: daysFromNow(-90),
    updatedAt: daysFromNow(-3),
  },
  {
    id: "srv-6",
    companyId: COMPANY_ID,
    contractId: "ctr-4",
    customerId: "cust-4",
    customerName: "Restaurante Sabor Caseiro Ltda",
    customerAddress: "Rua Antônio Belém, 320 - Centro, Osasco/SP",
    serviceType: "ELECTRICAL",
    scheduledDate: daysFromNow(-10),
    employeeId: "emp-4",
    employeeName: "Juliana Alves",
    status: "COMPLETED",
    equipment: "Exaustores da cozinha industrial",
    equipmentIds: ["equip-4"],
    execution: {
      notes: "Troca de correias dos exaustores e limpeza geral do sistema de ventilação.",
      photoUrls: ["https://picsum.photos/seed/ciclus-os-6-a/480/480"],
      completedAt: daysFromNow(-10),
    },
    reportPdfUrl: "/api/services/srv-6/report",
    confirmationStatus: "CONFIRMED",
    confirmationToken: null,
    confirmationLink: null,
    confirmationExpiresAt: null,
    confirmedAt: daysFromNow(-10),
    createdAt: daysFromNow(-30),
    updatedAt: daysFromNow(-10),
  },
  {
    id: "srv-7",
    companyId: COMPANY_ID,
    contractId: "ctr-6",
    customerId: "cust-6",
    customerName: "Indústria Metalcorte S.A.",
    customerAddress: "Rodovia Raposo Tavares, km 98 - Distrito Industrial, Sorocaba/SP",
    serviceType: "INSPECTION",
    scheduledDate: daysFromNow(-20),
    employeeId: null,
    employeeName: null,
    status: "CANCELLED",
    equipment: null,
    equipmentIds: [],
    execution: null,
    reportPdfUrl: null,
    createdAt: daysFromNow(-25),
    updatedAt: daysFromNow(-20),
  },
  {
    id: "srv-8",
    companyId: COMPANY_ID,
    contractId: "ctr-2",
    customerId: "cust-2",
    customerName: "Supermercado Boa Vista Ltda",
    customerAddress: "Rua Barão de Jaguara, 780 - Centro, Campinas/SP",
    serviceType: "COCKROACH_CONTROL",
    scheduledDate: daysFromNow(1),
    employeeId: "emp-4",
    employeeName: "Juliana Alves",
    status: "IN_PROGRESS",
    equipment: null,
    equipmentIds: [],
    execution: null,
    reportPdfUrl: null,
    createdAt: daysFromNow(-1),
    updatedAt: daysFromNow(0),
  },
];

  function seedConfirmation(serviceId: string, options: { confirmed: boolean }) {
    const service = services.find((item) => item.id === serviceId);
    if (!service) return;
    const record = createConfirmation(serviceId);
    if (options.confirmed) {
      confirmByToken(record.token);
    }
    service.confirmationToken = record.token;
    service.confirmationLink = `/confirmar/${record.token}`;
    service.confirmationExpiresAt = record.expiresAt;
    service.confirmedAt = record.confirmedAt;
    service.confirmationStatus = record.confirmedAt ? "CONFIRMED" : "PENDING";
  }

  seedConfirmation("srv-5", { confirmed: false });
  seedConfirmation("srv-6", { confirmed: true });

  return {
    employees,
    customers,
    contracts,
    equipment,
    services,
    company: { niche: null },
    idCounter: 100,
  };
}

const db = globalThis.__ciclusMockDb ?? (globalThis.__ciclusMockDb = buildSeed());

export const employees = db.employees;
export const customers = db.customers;
export const contracts = db.contracts;
export const equipment = db.equipment;
export const services = db.services;
export const company = db.company;

export function generateId(prefix: string): string {
  db.idCounter += 1;
  return `${prefix}-${db.idCounter}`;
}
