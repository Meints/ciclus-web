export type ChecklistFieldType = "text" | "number" | "select" | "checkbox";

export interface ChecklistField {
  key: string;
  label: string;
  type: ChecklistFieldType;
  options?: string[];
}

export const CHECKLIST_FIELDS: Record<string, ChecklistField[]> = {
  PEST_CONTROL: [
    { key: "product", label: "Produto utilizado", type: "text" },
    { key: "concentration", label: "Concentração", type: "text" },
    { key: "appliedAreas", label: "Áreas tratadas", type: "text" },
    { key: "warrantyDays", label: "Garantia (dias)", type: "number" },
    {
      key: "applicationMethod",
      label: "Método de aplicação",
      type: "select",
      options: ["Pulverização", "Iscamento", "Termonebulização", "Gel", "Fumigação"],
    },
    { key: "targetPest", label: "Praga alvo", type: "text" },
  ],
  AIR_CONDITIONING: [
    { key: "filterCleaned", label: "Filtro limpo", type: "checkbox" },
    { key: "drainCleaned", label: "Dreno limpo", type: "checkbox" },
    { key: "refrigerantChecked", label: "Gás verificado", type: "checkbox" },
    { key: "temperatureBefore", label: "Temperatura antes (°C)", type: "number" },
    { key: "temperatureAfter", label: "Temperatura após (°C)", type: "number" },
  ],
  WATER_TANK: [
    { key: "volumeLiters", label: "Volume (litros)", type: "number" },
    { key: "productUsed", label: "Produto utilizado", type: "text" },
    { key: "chlorineLevel", label: "Nível de cloro (ppm)", type: "number" },
    { key: "washPerformed", label: "Lavagem realizada", type: "checkbox" },
    {
      key: "tankCondition",
      label: "Condição da caixa",
      type: "select",
      options: ["Boa", "Regular", "Ruim", "Necessita substituição"],
    },
  ],
  ELEVATOR: [
    { key: "cabinCleaned", label: "Cabine limpa", type: "checkbox" },
    { key: "doorsAdjusted", label: "Portas ajustadas", type: "checkbox" },
    { key: "safetyTestDone", label: "Teste de segurança realizado", type: "checkbox" },
    { key: "oilLevelOk", label: "Nível de óleo OK", type: "checkbox" },
    { key: "observations", label: "Observações técnicas", type: "text" },
  ],
  BUILDING_MAINTENANCE: [
    { key: "areasInspected", label: "Áreas inspecionadas", type: "text" },
    { key: "issuesFound", label: "Problemas encontrados", type: "text" },
    { key: "materialsUsed", label: "Materiais utilizados", type: "text" },
  ],
  GENERAL: [
    { key: "observations", label: "Observações", type: "text" },
    { key: "materialsUsed", label: "Materiais utilizados", type: "text" },
  ],
};

const GENERAL_FIELDS: ChecklistField[] = CHECKLIST_FIELDS.GENERAL ?? [];

export function getChecklistFields(niche: string | null | undefined): ChecklistField[] {
  if (!niche) return GENERAL_FIELDS;
  return CHECKLIST_FIELDS[niche] ?? GENERAL_FIELDS;
}
