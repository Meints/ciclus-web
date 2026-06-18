export const SERVICE_TYPES_BY_NICHE = {
  AIR_CONDITIONING: [
    { value: "PREVENTIVE_MAINTENANCE", label: "Manutenção preventiva" },
    { value: "CORRECTIVE_MAINTENANCE", label: "Manutenção corretiva" },
    { value: "INSTALLATION", label: "Instalação" },
    { value: "UNINSTALLATION", label: "Desinstalação" },
    { value: "GAS_RECHARGE", label: "Recarga de gás" },
    { value: "CLEANING", label: "Higienização" },
    { value: "PMOC", label: "PMOC — Plano de Manutenção, Operação e Controle" },
    { value: "INSPECTION", label: "Vistoria técnica" },
  ],
  PEST_CONTROL: [
    { value: "COCKROACH_CONTROL", label: "Dedetização — baratas" },
    { value: "RODENT_CONTROL", label: "Desratização — ratos e roedores" },
    { value: "TERMITE_CONTROL", label: "Descupinização — cupins" },
    { value: "BED_BUG_CONTROL", label: "Dedetização — percevejos" },
    { value: "MOSQUITO_CONTROL", label: "Dedetização — mosquitos e dengue" },
    { value: "GENERAL_DISINFECTION", label: "Desinfecção geral" },
    { value: "SANITIZATION", label: "Sanitização de ambientes" },
    { value: "INSPECTION", label: "Vistoria e diagnóstico" },
  ],
  WATER_TANK: [
    { value: "CLEANING", label: "Limpeza e higienização de caixa d'água" },
    { value: "INSPECTION", label: "Vistoria e coleta de amostra" },
    { value: "DISINFECTION", label: "Desinfecção" },
    { value: "REPAIR", label: "Reparo estrutural" },
  ],
  BUILDING_MAINTENANCE: [
    { value: "ELECTRICAL", label: "Manutenção elétrica" },
    { value: "HYDRAULIC", label: "Manutenção hidráulica" },
    { value: "PAINTING", label: "Pintura" },
    { value: "CLEANING", label: "Limpeza geral" },
    { value: "GARDEN", label: "Jardinagem" },
    { value: "INSPECTION", label: "Vistoria predial" },
  ],
  ELEVATOR: [
    { value: "PREVENTIVE_MAINTENANCE", label: "Manutenção preventiva" },
    { value: "CORRECTIVE_MAINTENANCE", label: "Manutenção corretiva" },
    { value: "INSPECTION", label: "Inspeção técnica" },
    { value: "MODERNIZATION", label: "Modernização" },
  ],
  GENERAL: [
    { value: "SERVICE", label: "Serviço geral" },
    { value: "INSPECTION", label: "Vistoria" },
    { value: "MAINTENANCE", label: "Manutenção" },
    { value: "INSTALLATION", label: "Instalação" },
  ],
} as const;

export type ServiceNiche = keyof typeof SERVICE_TYPES_BY_NICHE;

export function getServiceTypes(niche: ServiceNiche) {
  return SERVICE_TYPES_BY_NICHE[niche] ?? SERVICE_TYPES_BY_NICHE.GENERAL;
}

export const NICHE_LABELS: Record<ServiceNiche, string> = {
  AIR_CONDITIONING: "Climatização / Ar-condicionado",
  PEST_CONTROL: "Dedetização e Controle de Pragas",
  WATER_TANK: "Limpeza de Caixa d'Água",
  BUILDING_MAINTENANCE: "Manutenção Predial",
  ELEVATOR: "Elevadores",
  GENERAL: "Outro",
};

export function getServiceTypeLabel(value: string): string {
  for (const niche of Object.keys(SERVICE_TYPES_BY_NICHE) as ServiceNiche[]) {
    const match = SERVICE_TYPES_BY_NICHE[niche].find((item) => item.value === value);
    if (match) return match.label;
  }
  return value;
}
