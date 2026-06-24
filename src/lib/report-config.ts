export interface ReportConfig {
  title: string;
  equipmentLabel: string;
  showEquipmentTable: boolean;
  regulatoryFooter?: string;
}

export const REPORT_CONFIG_BY_NICHE: Record<string, ReportConfig> = {
  AIR_CONDITIONING: {
    title: "Relatório de Manutenção — PMOC",
    equipmentLabel: "Equipamentos Atendidos",
    showEquipmentTable: true,
    regulatoryFooter:
      "Documento elaborado em conformidade com a Portaria GM/MS nº 3.523/1998, que institui o Plano de Manutenção, Operação e Controle (PMOC) de sistemas de climatização.",
  },
  PEST_CONTROL: {
    title: "Certificado de Dedetização",
    equipmentLabel: "Áreas Tratadas",
    showEquipmentTable: false,
    regulatoryFooter:
      "Produtos utilizados registrados na ANVISA conforme legislação vigente. Procedimento realizado conforme RDC nº 52/2009.",
  },
  WATER_TANK: {
    title: "Certificado de Limpeza de Caixa d'Água",
    equipmentLabel: "Reservatórios Atendidos",
    showEquipmentTable: true,
    regulatoryFooter:
      "Procedimento realizado conforme Portaria de Consolidação nº 5/2017 (Anexo XX), que dispõe sobre o controle de qualidade da água para consumo humano.",
  },
  BUILDING_MAINTENANCE: {
    title: "Relatório de Manutenção Predial",
    equipmentLabel: "Itens Atendidos",
    showEquipmentTable: true,
  },
  ELEVATOR: {
    title: "Relatório de Manutenção de Elevadores",
    equipmentLabel: "Equipamentos Atendidos",
    showEquipmentTable: true,
    regulatoryFooter:
      "Manutenção realizada em conformidade com a NBR 16083 (inspeção predial) e normas técnicas vigentes para equipamentos de transporte vertical.",
  },
  GENERAL: {
    title: "Ordem de Serviço",
    equipmentLabel: "Itens Atendidos",
    showEquipmentTable: true,
  },
};

export function getReportConfig(niche?: string | null): ReportConfig {
  if (!niche) return REPORT_CONFIG_BY_NICHE.GENERAL!;
  return REPORT_CONFIG_BY_NICHE[niche] ?? REPORT_CONFIG_BY_NICHE.GENERAL!;
}
