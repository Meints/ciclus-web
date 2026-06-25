"use client";

import { getReportConfig } from "@/lib/report-config";
import { nicheHasEquipment } from "@/lib/equipment-types";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import { formatDate, formatDateTime } from "@/lib/utils";
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
  photoUrls?: string[];
  confirmedName?: string | null;
  confirmedDocument?: string | null;
  confirmedDocumentType?: string | null;
  confirmedAt?: string | null;
}

export function ServiceReportPreview({
  service,
  companyName,
  companyNiche,
  executionNotes,
  equipmentNotes,
  durationMinutes,
  photoUrls = [],
  confirmedName,
  confirmedDocument,
  confirmedDocumentType,
  confirmedAt,
}: ServiceReportPreviewProps) {
  const config = useMemo(() => getReportConfig(companyNiche), [companyNiche]);
  const showEquipment = nicheHasEquipment(companyNiche) && (service.equipmentDetails ?? []).length > 0;

  return (
    <div className="mx-auto max-w-[210mm] bg-white text-sm print:shadow-none" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-5">
        <div>
          <div className="text-xl font-bold text-gray-900 tracking-tight">{companyName}</div>
          <div className="mt-1 text-xs text-gray-500">CNPJ: — · contato@empresa.com.br</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Ordem de Serviço</div>
          <div className="text-2xl font-bold text-gray-900">#{service.id.slice(0, 7).toUpperCase()}</div>
          <div className="mt-1 text-xs text-gray-500">Emitido em {formatDate(new Date().toISOString())}</div>
        </div>
      </div>

      {/* Document type badge */}
      <div className="mb-5 inline-block rounded bg-gray-900 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
        {config.title}
      </div>

      {/* Service + Customer grid */}
      <div className="mb-5 grid grid-cols-2 gap-4">
        <Section title="Dados do Serviço">
          <InfoRow label="Tipo" value={service.serviceType || "—"} />
          <InfoRow label="Data agendada" value={formatDate(service.scheduledDate)} />
          <InfoRow label="Data de execução" value={formatDate(new Date().toISOString())} />
          <InfoRow
            label="Duração"
            value={
              durationMinutes
                ? durationMinutes >= 60
                  ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}min`
                  : `${durationMinutes} min`
                : "—"
            }
          />
          <InfoRow label="Técnico responsável" value={service.employeeName || "—"} />
        </Section>

        <Section title="Dados do Cliente">
          <InfoRow label="Nome" value={service.customerName} />
          {service.customerAddress && (
            <InfoRow label="Endereço" value={service.customerAddress} />
          )}
        </Section>
      </div>

      {/* Equipment */}
      {showEquipment && (
        <div className="mb-5">
          <Section title={config.equipmentLabel}>
            {config.showEquipmentTable ? (
              <div className="mt-1 divide-y divide-gray-100 rounded border border-gray-200 text-xs">
                {(service.equipmentDetails ?? []).map((eq, i) => (
                  <div key={eq.id} className={`flex gap-4 px-3 py-2 ${i % 2 === 1 ? "bg-gray-50" : ""}`}>
                    <div className="flex-1 font-medium">{EQUIPMENT_TYPE_LABELS[eq.type] || eq.type}</div>
                    <div className="flex-1 text-gray-600">{[eq.brand, eq.model].filter(Boolean).join(" / ") || "—"}</div>
                    <div className="flex-1 text-gray-600">{eq.location || "—"}</div>
                    {equipmentNotes[eq.id] && (
                      <div className="flex-1 italic text-gray-500">{equipmentNotes[eq.id]}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                {(service.equipmentDetails ?? [])
                  .map((eq) => eq.location || EQUIPMENT_TYPE_LABELS[eq.type] || eq.type)
                  .join(", ")}
              </p>
            )}
          </Section>
        </div>
      )}

      {/* Technician notes */}
      {executionNotes && (
        <div className="mb-5">
          <Section title="Observações do Técnico">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{executionNotes}</p>
          </Section>
        </div>
      )}

      {/* Photo grid */}
      {photoUrls.length > 0 && (
        <div className="mb-5">
          <Section title={`Registro Fotográfico (${photoUrls.length})`}>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {photoUrls.map((url, i) => (
                <div key={url} className="aspect-square overflow-hidden rounded border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* Signature block */}
      <div className="mb-5">
        <div className="rounded border border-gray-300 p-4">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Assinatura Digital do Cliente
          </div>

          {confirmedAt ? (
            <>
              <div className="mb-4 flex h-16 items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50">
                <span className="text-xs italic text-gray-400">Assinatura registrada digitalmente</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                <InfoRow label="Nome" value={confirmedName || "—"} />
                {confirmedDocument && (
                  <InfoRow
                    label={confirmedDocumentType === "CNPJ" ? "CNPJ" : "CPF"}
                    value={confirmedDocument}
                  />
                )}
                <InfoRow label="Confirmado em" value={formatDateTime(confirmedAt)} />
              </div>
              <p className="mt-3 text-[10px] leading-relaxed text-gray-400">
                Assinatura coletada eletronicamente. O IP de origem, data/hora e demais metadados foram
                registrados com validade jurídica conforme MP 2.200-2/2001 e Lei 14.063/2020.
              </p>
            </>
          ) : (
            <div className="flex h-20 flex-col items-center justify-center gap-1">
              <span className="text-xs font-medium text-amber-600">Aguardando assinatura do cliente</span>
              <span className="text-[10px] text-gray-400">
                O cliente receberá um link para assinar digitalmente após o envio
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Regulatory footer */}
      {config.regulatoryFooter && (
        <div className="mb-4 rounded bg-gray-50 p-3 text-[10px] leading-relaxed text-gray-500">
          {config.regulatoryFooter}
        </div>
      )}

      {/* Ciclus footer */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-[10px] text-gray-400">
        <span>Gerado pela plataforma Ciclus</span>
        <span>ciclus.com.br · {formatDate(new Date().toISOString())}</span>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 border-b border-gray-200 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1 text-sm leading-relaxed">
      <span className="min-w-[120px] text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
