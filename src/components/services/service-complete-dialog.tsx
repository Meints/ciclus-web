"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CameraIcon,
  ClockIcon,
  EyeIcon,
  FileTextIcon,
  ListChecksIcon,
  Loader2Icon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getChecklistFields } from "@/lib/checklist-types";
import { ConfirmationLinkPanel } from "@/components/services/confirmation-link-panel";
import { ServiceReportPreview } from "@/components/services/service-report-preview";
import { completeServiceSchema, type CompleteServiceFormValues } from "@/lib/validations/service";
import { useCompleteService, useUploadServicePhoto } from "@/hooks/use-services";
import { useAuthStore } from "@/store/auth.store";
import { nicheHasEquipment } from "@/lib/equipment-types";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { CompleteServicePayload, Service } from "@/types/service";
import type { Equipment } from "@/types/equipment";

interface ServiceCompleteDialogProps {
  serviceId: string;
  service?: Service;
  equipment?: Equipment[];
  customerPhone?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted?: () => void;
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" }));
        },
        "image/webp",
        quality,
      );
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

export function ServiceCompleteDialog({
  serviceId,
  service,
  equipment = [],
  customerPhone,
  open,
  onOpenChange,
  onCompleted,
}: ServiceCompleteDialogProps) {
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [equipmentNotes, setEquipmentNotes] = useState<Record<string, string>>({});
  const [checklistValues, setChecklistValues] = useState<Record<string, unknown>>({});
  const [completedService, setCompletedService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);
  const showEquipment = nicheHasEquipment(user?.niche) && equipment.length > 0;
  const checklistFields = getChecklistFields(user?.niche);

  const completeService = useCompleteService(serviceId);
  const uploadPhoto = useUploadServicePhoto(serviceId);

  const form = useForm<CompleteServiceFormValues>({
    resolver: zodResolver(completeServiceSchema),
    defaultValues: { executionNotes: "" },
  });

  const watchedNotes = form.watch("executionNotes");
  const watchedDuration = form.watch("durationMinutes");

  useEffect(() => {
    if (!open) {
      form.reset({ executionNotes: "", durationMinutes: undefined });
      setPhotos([]);
      setEquipmentNotes({});
      setChecklistValues({});
      setCompletedService(null);
      setActiveTab("form");
    }
  }, [open, form]);

  const handlePhotoChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);

    try {
      const results = await Promise.allSettled(
        fileArray.map(async (file) => {
          const compressed = await compressImage(file);
          return uploadPhoto.mutateAsync(compressed);
        }),
      );

      const newPhotos: { url: string; name: string }[] = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i]!;
        if (result.status === "fulfilled") {
          const fileName = fileArray[i]?.name ?? "photo";
          newPhotos.push({ url: result.value.url, name: fileName });
        }
      }

      setPhotos((prev) => [...prev, ...newPhotos]);
    } finally {
      setUploading(false);
    }

    event.target.value = "";
  }, [form, uploadPhoto]);

  function handleRemovePhoto(url: string) {
    setPhotos((prev) => prev.filter((photo) => photo.url !== url));
  }

  function handleCameraCapture() {
    if (fileInputRef.current) {
      fileInputRef.current.accept = "image/*";
      fileInputRef.current.capture = "environment";
      fileInputRef.current.click();
    }
  }

  function onSubmit(values: CompleteServiceFormValues) {
    const checklistData = Object.fromEntries(
      Object.entries(checklistValues).filter(([, value]) => {
        if (value === undefined || value === null) return false;
        if (typeof value === "string") return value.trim().length > 0;
        return true;
      }),
    );

    const payload: CompleteServicePayload = {
      executionNotes: values.executionNotes,
      durationMinutes: values.durationMinutes ?? undefined,
      equipmentNotes: Object.entries(equipmentNotes)
        .filter(([, note]) => note.trim().length > 0)
        .map(([equipmentId, note]) => ({ equipmentId, note })),
      ...(Object.keys(checklistData).length > 0 ? { checklistData } : {}),
    };
    completeService.mutate(payload, {
      onSuccess: (data) => {
        setCompletedService(data);
        onCompleted?.();
      },
    });
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {completedService?.confirmationLink ? (
          <>
            <DialogHeader>
              <DialogTitle>Execução registrada</DialogTitle>
            </DialogHeader>
            <ConfirmationLinkPanel
              confirmationLink={completedService.confirmationLink}
              expiresAt={completedService.confirmationExpiresAt ?? null}
              customerPhone={customerPhone ?? completedService.customerPhone}
            />
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Concluir
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Registrar execução</DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="form" className="flex-1 gap-2">
                  <FileTextIcon className="h-4 w-4" />
                  Formulário
                </TabsTrigger>
                <TabsTrigger value="checklist" className="flex-1 gap-2">
                  <ListChecksIcon className="h-4 w-4" />
                  Checklist
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1 gap-2">
                  <EyeIcon className="h-4 w-4" />
                  Pré-visualizar laudo
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form" className="mt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="executionNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva o que foi executado..."
                              rows={4}
                              maxLength={2000}
                              className="text-base sm:text-sm"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground text-right">
                            {field.value?.length ?? 0}/2000
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationMinutes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração (minutos)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <ClockIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                type="number"
                                min={1}
                                placeholder="Ex: 120"
                                className="pl-9 text-base sm:text-sm"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium">Fotos da execução</p>
                      <div className="flex gap-2">
                        <label
                          className={cn(
                            "flex h-20 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-accent/40 transition-colors",
                            uploading && "pointer-events-none opacity-50",
                          )}
                        >
                          <UploadIcon className="h-4 w-4" />
                          {uploading ? "Comprimindo..." : "Galeria"}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handlePhotoChange}
                            disabled={uploading}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleCameraCapture}
                          disabled={uploading}
                          className={cn(
                            "flex h-20 flex-1 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-accent/40 transition-colors",
                            uploading && "pointer-events-none opacity-50",
                          )}
                        >
                          <CameraIcon className="h-4 w-4" />
                          Câmera
                        </button>
                      </div>

                      {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {photos.map((photo) => (
                            <div
                              key={photo.url}
                              className="group relative aspect-square overflow-hidden rounded-md border"
                            >
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photo.url)}
                                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 tap-target"
                              >
                                <TrashIcon className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {showEquipment && (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">Observação por equipamento</p>
                        {equipment.map((item) => (
                          <div key={item.id} className="flex flex-col gap-1">
                            <p className="text-xs text-muted-foreground">
                              {EQUIPMENT_TYPE_LABELS[item.type]} · {item.location}
                            </p>
                            <Textarea
                              rows={2}
                              placeholder="Observação sobre este equipamento (opcional)"
                              className="text-base sm:text-sm"
                              value={equipmentNotes[item.id] ?? ""}
                              onChange={(event) =>
                                setEquipmentNotes((prev) => ({
                                  ...prev,
                                  [item.id]: event.target.value,
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                      <Button
                        type="submit"
                        disabled={completeService.isPending}
                        className="h-12 w-full text-base sm:h-10 sm:w-auto"
                      >
                        {completeService.isPending && <Loader2Icon className="animate-spin" />}
                        {completeService.isPending ? "Registrando..." : "Concluir OS"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="checklist" className="mt-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">
                    Preencha o checklist técnico do serviço (opcional). Os dados serão
                    salvos no registro da execução.
                  </p>
                  {checklistFields.map((field) => {
                    const value = checklistValues[field.key];
                    if (field.type === "checkbox") {
                      return (
                        <div key={field.key} className="flex items-center gap-2">
                          <Checkbox
                            id={`checklist-${field.key}`}
                            checked={Boolean(value)}
                            onCheckedChange={(checked) =>
                              setChecklistValues((prev) => ({
                                ...prev,
                                [field.key]: checked === true,
                              }))
                            }
                          />
                          <Label htmlFor={`checklist-${field.key}`} className="cursor-pointer">
                            {field.label}
                          </Label>
                        </div>
                      );
                    }
                    if (field.type === "select") {
                      return (
                        <div key={field.key} className="flex flex-col gap-1.5">
                          <Label>{field.label}</Label>
                          <Select
                            value={(value as string) ?? ""}
                            onValueChange={(val) =>
                              setChecklistValues((prev) => ({ ...prev, [field.key]: val }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {(field.options ?? []).map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }
                    return (
                      <div key={field.key} className="flex flex-col gap-1.5">
                        <Label htmlFor={`checklist-${field.key}`}>{field.label}</Label>
                        <Input
                          id={`checklist-${field.key}`}
                          type={field.type === "number" ? "number" : "text"}
                          className="text-base sm:text-sm"
                          value={(value as string | number) ?? ""}
                          onChange={(event) =>
                            setChecklistValues((prev) => ({
                              ...prev,
                              [field.key]:
                                field.type === "number"
                                  ? event.target.value === ""
                                    ? undefined
                                    : Number(event.target.value)
                                  : event.target.value,
                            }))
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="max-h-[60vh] overflow-y-auto rounded-lg border p-4">
                  <ServiceReportPreview
                    companyName={user?.companyName ?? "—"}
                    companyNiche={user?.niche ?? null}
                    service={
                      service ?? {
                        id: serviceId,
                        companyId: user?.companyId ?? "",
                        contractId: "",
                        customerId: "",
                        customerName: "—",
                        customerAddress: "",
                        customerPhone: null,
                        serviceType: "",
                        scheduledDate: new Date().toISOString(),
                        employeeId: null,
                        employeeName: null,
                        status: "COMPLETED",
                        equipmentIds: [],
                        equipmentDetails: equipment,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      }
                    }
                    executionNotes={watchedNotes ?? ""}
                    durationMinutes={watchedDuration ?? undefined}
                    equipmentNotes={equipmentNotes}
                    photoUrls={photos.map((p) => p.url)}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Esta é uma prévia aproximada do laudo. O PDF definitivo será gerado após o envio.
                </p>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
