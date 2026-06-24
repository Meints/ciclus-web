"use client";

import { getReportConfig, type ReportConfig } from "@/lib/report-config";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import { Tooltip } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import type { Service } from "@/types/service";
import type { Equipment } from "@/types/equipment";
import { useMemo } from "react";

interface ServiceReportPreviewProps {
  service: Service;
  companyName: string;
  companyNiche: string | null;
  executionNotes: string;
  equipmentNotes: Record<string, string>;
  durationMinutes?: number;
}

export function ServiceReportPreview({
  service,
  companyName,
  companyNiche,
  executionNotes,
  equipmentNotes,
  durationMinutes,
}: ServiceReportPreviewProps) {
  const config = useMemo(() => getReportConfig(companyNiche), [companyNiche]);

  return (
    <div className="mx-auto max-w-[210mm] rounded-lg border bg-white p-8 text-sm shadow-sm">
      <style>{`
        .preview-line { border: none; border-top: 1px solid #d0d0d0; margin: 12px 0; }
      `}</style>

      {/* Header */}
      <div className="text-xl font-bold tracking-tight">{companyName}</div>

      <div className="mt-4 text-center">
        <h2 className="text-base font-bold">{config.title}</h2>
        <p className="text-sm text-muted-foreground">
          OS Nº {service.id.slice(0, 7)}
        </p>
      </div>

      <hr className="preview-line" />

      {/* Service Data */}
      <SectionTitle title="Dados do Serviço" />
      <DataRow label="Tipo" value={service.serviceType || "—"} />
      <DataRow
        label="Data agendada"
        value={formatDate(service.scheduledDate)}
      />
      <DataRow
        label="Data de execução"
        value={formatDate(new Date().toISOString())}
      />
      <DataRow
        label="Duração"
        value={durationMinutes ? `${durationMinutes} min` : "—"}
      />
      <DataRow
        label="Técnico"
        value={service.employeeName || "—"}
      />

      <hr className="preview-line" />

      {/* Customer Data */}
      <SectionTitle title="Dados do Cliente" />
      <DataRow label="Nome" value={service.customerName} />
      {service.customerAddress && (
        <DataRow
          label="Endereço"
          value={service.customerAddress}
          href={`https://www.google.com/maps/search/${encodeURIComponent(service.customerAddress)}`}
        />
      )}

      <hr className="preview-line" />

      {/* Equipment */}
      <EquipmentSection
        config={config}
        equipment={service.equipmentDetails ?? []}
        equipmentNotes={equipmentNotes}
      />

      {/* Technician Notes */}
      {executionNotes && (
        <>
          <hr className="preview-line" />
          <SectionTitle title="Observações do Técnico" />
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {executionNotes}
          </p>
        </>
      )}

      <hr className="preview-line" />

      {/* Confirmation Status */}
      <SectionTitle title="Status de Confirmação" />
      <p className="text-sm italic text-amber-600">
        Aguardando confirmação do cliente
      </p>

      {/* Regulatory Footer */}
      {config.regulatoryFooter && (
        <>
          <hr className="preview-line" />
          <p className="text-xs leading-relaxed text-gray-500">
            {config.regulatoryFooter}
          </p>
        </>
      )}

      {/* Footer */}
      <hr className="preview-line" />
      <p className="text-center text-xs text-gray-400">
        Gerado pelo Ciclus em {formatDate(new Date().toISOString())}
      </p>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <p className="mb-1 mt-0 text-sm font-bold text-gray-800">{title}</p>
  );
}

function DataRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="text-sm leading-relaxed">
      <span className="font-medium">{label}: </span>
      {href ? (
        <Tooltip content="Abrir no Google Maps">
          <a href={href} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
            {value}
          </a>
        </Tooltip>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}

function EquipmentSection({
  config,
  equipment,
  equipmentNotes,
}: {
  config: ReportConfig;
  equipment: Equipment[];
  equipmentNotes: Record<string, string>;
}) {
  if (equipment.length === 0) return null;

  if (config.showEquipmentTable) {
    return (
      <>
        <hr className="preview-line" />
        <SectionTitle title={config.equipmentLabel} />
        {equipment.map((eq) => (
          <div key={eq.id} className="mb-2 text-sm">
            <p>
              <span className="font-medium">Tipo: </span>
              {EQUIPMENT_TYPE_LABELS[eq.type] || eq.type}
            </p>
            <p>
              <span className="font-medium">Marca/Modelo: </span>
              {[eq.brand, eq.model].filter(Boolean).join(" / ") || "—"}
            </p>
            <p>
              <span className="font-medium">Localização: </span>
              {eq.location || "—"}
            </p>
            {equipmentNotes[eq.id] && (
              <p>
                <span className="font-medium">Observações: </span>
                {equipmentNotes[eq.id]}
              </p>
            )}
          </div>
        ))}
      </>
    );
  }

  const locations = equipment
    .map((eq) => eq.location || EQUIPMENT_TYPE_LABELS[eq.type] || eq.type)
    .join(", ");

  return (
    <>
      <hr className="preview-line" />
      <SectionTitle title={config.equipmentLabel} />
      <p className="text-sm leading-relaxed">{locations}</p>
    </>
  );
}
