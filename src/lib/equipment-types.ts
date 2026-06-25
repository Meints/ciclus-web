import type { ServiceNiche } from "./service-types";

export const NICHES_WITH_EQUIPMENT: ServiceNiche[] = [
  "AIR_CONDITIONING",
  "WATER_TANK",
  "BUILDING_MAINTENANCE",
  "ELEVATOR",
  "GENERAL",
];

export function nicheHasEquipment(niche?: string | null): boolean {
  return NICHES_WITH_EQUIPMENT.includes(niche as ServiceNiche);
}

export const EQUIPMENT_TYPES_BY_NICHE: Record<ServiceNiche, { value: string; label: string }[]> = {
  AIR_CONDITIONING: [
    { value: "AC_SPLIT", label: "Ar-condicionado Split" },
    { value: "AC_CASSETTE", label: "Ar-condicionado Cassete" },
    { value: "AC_WINDOW", label: "Ar-condicionado Janela" },
    { value: "CHILLER", label: "Chiller" },
    { value: "FAN_COIL", label: "Fan Coil" },
    { value: "VRF_VRV", label: "VRF/VRV" },
    { value: "EXHAUST_FAN", label: "Exaustor" },
    { value: "AIR_CURTAIN", label: "Cortina de Ar" },
    { value: "OTHER", label: "Outro" },
  ],
  PEST_CONTROL: [
    { value: "BAIT_STATION", label: "Estação de isca" },
    { value: "GLUE_TRAP", label: "Armadilha adesiva" },
    { value: "ELECTRIC_INSECT_KILLER", label: "Armadilha luminosa (UV)" },
    { value: "FUMIGATION_POINT", label: "Ponto de fumigação" },
    { value: "PHEROMONE_TRAP", label: "Armadilha de feromônio" },
    { value: "RODENT_BOX", label: "Caixa de contenção para roedores" },
    { value: "MOSQUITO_TRAP", label: "Armadilha para mosquitos" },
    { value: "MONITORING_STATION", label: "Estação de monitoramento" },
    { value: "OTHER", label: "Outro" },
  ],
  WATER_TANK: [
    { value: "WATER_TANK", label: "Caixa d'água" },
    { value: "CISTERN", label: "Cisterna" },
    { value: "ELEVATED_RESERVOIR", label: "Reservatório elevado" },
    { value: "UNDERGROUND_RESERVOIR", label: "Reservatório subterrâneo" },
    { value: "WATER_PUMP", label: "Bomba de recalque" },
    { value: "HYDRO_PNEUMATIC_SYSTEM", label: "Sistema hidropneumático" },
    { value: "FILTRATION_SYSTEM", label: "Sistema de filtragem" },
    { value: "CHLORINATION_SYSTEM", label: "Sistema de cloração" },
    { value: "OTHER", label: "Outro" },
  ],
  BUILDING_MAINTENANCE: [
    { value: "ELECTRICAL_PANEL", label: "Quadro elétrico" },
    { value: "HYDRAULIC_PUMP", label: "Bomba hidráulica" },
    { value: "GENERATOR", label: "Gerador" },
    { value: "FIRE_SYSTEM", label: "Sistema de combate a incêndio" },
    { value: "WATER_HEATER", label: "Boiler/aquecedor" },
    { value: "AIR_HANDLING_UNIT", label: "Unidade de tratamento de ar" },
    { value: "GATE_MOTOR", label: "Motor de portão" },
    { value: "SECURITY_SYSTEM", label: "Sistema de CFTV/segurança" },
    { value: "OTHER", label: "Outro" },
  ],
  ELEVATOR: [
    { value: "ELEVATOR_PASSENGER", label: "Elevador de passageiros" },
    { value: "ELEVATOR_FREIGHT", label: "Elevador de carga" },
    { value: "ESCALATOR", label: "Escada rolante" },
    { value: "MOVING_WALKWAY", label: "Esteira rolante" },
    { value: "PLATFORM_LIFT", label: "Plataforma elevatória" },
    { value: "DUMBWAITER", label: "Monta-cargas" },
    { value: "MACHINE_ROOM", label: "Casa de máquinas" },
    { value: "CONTROL_PANEL", label: "Quadro de comando" },
    { value: "OTHER", label: "Outro" },
  ],
  GENERAL: [
    { value: "MACHINE", label: "Máquina" },
    { value: "ELECTRONIC_DEVICE", label: "Equipamento eletrônico" },
    { value: "FURNITURE", label: "Mobiliário" },
    { value: "VEHICLE", label: "Veículo" },
    { value: "TOOL", label: "Ferramenta" },
    { value: "STRUCTURE", label: "Estrutura/instalação" },
    { value: "OTHER", label: "Outro" },
  ],
};

export function getEquipmentTypes(niche: ServiceNiche) {
  return EQUIPMENT_TYPES_BY_NICHE[niche] ?? EQUIPMENT_TYPES_BY_NICHE.GENERAL;
}
