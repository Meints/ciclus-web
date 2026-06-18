import { NextResponse } from "next/server";
import { findService, withEquipmentDetails } from "@/mock/helpers";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDate, formatDateTime } from "@/lib/utils";

interface Params {
  params: Promise<{ id: string }>;
}

function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildMockPdf(lines: string[]): Buffer {
  const header = "%PDF-1.4\n";

  const contentLines = lines
    .map((line, index) => {
      const fontSize = index === 0 ? 16 : 11;
      const y = 780 - index * 22;
      return `BT /F1 ${fontSize} Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");
  const stream = `${contentLines}\n`;

  const objects: string[] = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  let body = "";
  const offsets: number[] = [0];
  let position = Buffer.byteLength(header, "latin1");
  for (const object of objects) {
    offsets.push(position);
    body += object;
    position += Buffer.byteLength(object, "latin1");
  }

  const xrefStart = position;
  let xref = "xref\n0 6\n0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    const offset = offsets[i] ?? 0;
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(header + body + xref + trailer, "latin1");
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const found = findService(id);

  if (!found || !found.execution) {
    return NextResponse.json({ statusCode: 404, error: "Not Found", message: "Laudo não encontrado." }, { status: 404 });
  }

  const service = withEquipmentDetails(found);

  const lines = [
    "Laudo de Serviço - Ciclus (documento de demonstração)",
    `Cliente: ${service.customerName}`,
    `Endereço: ${service.customerAddress}`,
    `Tipo de serviço: ${getServiceTypeLabel(service.serviceType)}`,
    `Técnico responsável: ${service.employeeName ?? "Não atribuído"}`,
    `Data agendada: ${formatDate(service.scheduledDate)}`,
    `Concluído em: ${formatDateTime(service.execution!.completedAt)}`,
    "",
    "Observações:",
    service.execution!.notes,
    "",
    "Equipamentos atendidos:",
    ...(service.equipmentDetails && service.equipmentDetails.length > 0
      ? service.equipmentDetails.map((item) => {
          const note = service.execution?.equipmentNotes?.find(
            (entry) => entry.equipmentId === item.id
          );
          return `- ${EQUIPMENT_TYPE_LABELS[item.type]} ${item.brand} ${item.model} (${item.location})${
            item.serialNumber ? ` · S/N ${item.serialNumber}` : ""
          }${note?.note ? ` · Obs.: ${note.note}` : ""}`;
        })
      : ["Nenhum equipamento informado."]),
  ];

  const pdf = new Uint8Array(buildMockPdf(lines));

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="laudo-${service.id}.pdf"`,
    },
  });
}
