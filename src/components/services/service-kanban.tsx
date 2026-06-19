"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import {
  ClockIcon,
  PlayCircleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  UserIcon,
  CalendarIcon,
  FileSignatureIcon,
  Loader2Icon,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { ServiceCompleteDialog } from "@/components/services/service-complete-dialog";
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_VARIANTS } from "@/lib/labels";
import { getServiceTypeLabel } from "@/lib/service-types";
import { formatDateShort } from "@/lib/utils";
import { useCancelService, useCompleteService, useRevertService, useReopenService, useStartService } from "@/hooks/use-service-transitions";
import type { Service } from "@/types/service";

interface ServiceKanbanProps {
  services: Service[];
  isLoading: boolean;
}

const COLUMNS = [
  { id: "SCHEDULED", label: "Agendado", icon: ClockIcon, color: "border-l-brand-400", terminal: false },
  { id: "IN_PROGRESS", label: "Em andamento", icon: PlayCircleIcon, color: "border-l-warning-500", terminal: false },
  { id: "AWAITING_SIGNATURE", label: "Aguardando assinatura", icon: FileSignatureIcon, color: "border-l-info-500", terminal: false },
  { id: "COMPLETED", label: "Concluído", icon: CheckCircle2Icon, color: "border-l-success-500", terminal: true },
  { id: "CANCELLED", label: "Cancelado", icon: XCircleIcon, color: "border-l-red-500", terminal: true },
] as const;

type ColumnId = (typeof COLUMNS)[number]["id"];

function getColumnId(service: Service): ColumnId {
  if (service.status === "COMPLETED" && service.confirmedAt) return "COMPLETED";
  if (service.status === "COMPLETED" && !service.confirmedAt) return "AWAITING_SIGNATURE";
  return service.status as ColumnId;
}

// ── Droppable Column ───────────────────────────────────────────

function Column({
  column,
  children,
}: {
  column: (typeof COLUMNS)[number];
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const Icon = column.icon;

  return (
    <div
      ref={setNodeRef}
      className={`flex min-w-[260px] flex-1 flex-col gap-3 rounded-lg border-2 p-3 transition-colors ${
        isOver && !column.terminal ? "border-brand-400 bg-brand-50" : "border-transparent"
      }`}
    >
      <div className={`flex items-center gap-2 border-l-4 ${column.color} pl-3`}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{column.label}</span>
      </div>
      <div className="flex min-h-[200px] flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

// ── Card Content (shared between draggable Card and DragOverlay) ─

function CardContent({ service }: { service: Service }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium leading-tight">{service.customerName}</p>
        <StatusBadge
          label={SERVICE_STATUS_LABELS[service.status]}
          variant={SERVICE_STATUS_VARIANTS[service.status]}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {getServiceTypeLabel(service.serviceType)}
      </p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {formatDateShort(service.scheduledDate)}
        </span>
        <span className="flex items-center gap-1">
          <UserIcon className="h-3 w-3" />
          {service.employeeName ?? "—"}
        </span>
      </div>
      {service.equipmentDetails && service.equipmentDetails.length > 0 && (
        <p className="truncate text-xs text-muted-foreground">
          {service.equipmentDetails.length} equipamento(s)
        </p>
      )}
    </>
  );
}

// ── Draggable Card ─────────────────────────────────────────────

function Card({ service, disabled }: { service: Service; disabled: boolean }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: service.id,
    data: { service, columnId: getColumnId(service) },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col gap-2 rounded-lg border bg-card p-3 text-left text-sm shadow-sm transition-all ${
        isDragging ? "opacity-30" : disabled ? "opacity-80" : "hover:shadow-md cursor-grab active:cursor-grabbing"
      }`}
      onClick={() => !isDragging && router.push(`/servicos/${service.id}`)}
    >
      <CardContent service={service} />
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function ServiceKanban({ services, isLoading }: ServiceKanbanProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [completeServiceId, setCompleteServiceId] = useState<string | null>(null);

  const activeService = activeId ? services.find((s) => s.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const startService = useStartService();
  const revertService = useRevertService();
  const reopenService = useReopenService();
  const cancelService = useCancelService();
  const completeService = useCompleteService(completeServiceId ?? "");

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex min-w-[260px] flex-1 flex-col gap-3">
            <div className="h-8 w-32 animate-pulse rounded bg-muted" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const columnServices = COLUMNS.map((col) => ({
    column: col,
    services: services.filter((s) => getColumnId(s) === col.id),
  }));

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over || !active) return;

    const service = active.data.current?.service as Service | undefined;
    const fromColumn = active.data.current?.columnId as ColumnId | undefined;
    const toColumn = over.id as ColumnId;

    if (!service || !fromColumn || fromColumn === toColumn) return;
    if (toColumn === "COMPLETED" || toColumn === "CANCELLED") {
      const col = COLUMNS.find((c) => c.id === toColumn);
      if (col?.terminal) return;
    }

    const serviceId = service.id;

    if (toColumn === "CANCELLED") {
      cancelService.mutate(serviceId);
      return;
    }

    if (fromColumn === "SCHEDULED" && toColumn === "IN_PROGRESS") {
      startService.mutate(serviceId);
      return;
    }

    if (fromColumn === "IN_PROGRESS" && toColumn === "SCHEDULED") {
      revertService.mutate(serviceId);
      return;
    }

    if (fromColumn === "IN_PROGRESS" && toColumn === "AWAITING_SIGNATURE") {
      setCompleteServiceId(serviceId);
      return;
    }

    if (fromColumn === "AWAITING_SIGNATURE" && toColumn === "IN_PROGRESS") {
      reopenService.mutate(serviceId);
      return;
    }
  }

  const completingService = completeServiceId
    ? services.find((s) => s.id === completeServiceId)
    : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columnServices.map(({ column, services: colServices }) => (
            <Column key={column.id} column={column}>
              {colServices.length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  Nenhum serviço
                </p>
              ) : (
                colServices.map((service) => (
                  <Card key={service.id} service={service} disabled={column.terminal} />
                ))
              )}
            </Column>
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeService ? (
            <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 text-left text-sm shadow-xl will-change-transform">
              <CardContent service={activeService} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {completingService && (
        <ServiceCompleteDialog
          open={true}
          onOpenChange={(open) => {
            if (!open) setCompleteServiceId(null);
          }}
          serviceId={completingService.id}
          equipment={completingService.equipmentDetails}
          onCompleted={() => setCompleteServiceId(null)}
        />
      )}
    </>
  );
}
