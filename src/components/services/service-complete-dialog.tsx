"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CameraIcon, Loader2Icon, TrashIcon, UploadIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ConfirmationLinkPanel } from "@/components/services/confirmation-link-panel";
import { completeServiceSchema, type CompleteServiceFormValues } from "@/lib/validations/service";
import { useCompleteService, useUploadServicePhoto } from "@/hooks/use-services";
import { EQUIPMENT_TYPE_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { CompleteServicePayload, Service } from "@/types/service";
import type { Equipment } from "@/types/equipment";

interface ServiceCompleteDialogProps {
  serviceId: string;
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
  equipment = [],
  customerPhone,
  open,
  onOpenChange,
  onCompleted,
}: ServiceCompleteDialogProps) {
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [equipmentNotes, setEquipmentNotes] = useState<Record<string, string>>({});
  const [completedService, setCompletedService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completeService = useCompleteService(serviceId);
  const uploadPhoto = useUploadServicePhoto(serviceId);

  const form = useForm<CompleteServiceFormValues>({
    resolver: zodResolver(completeServiceSchema),
    defaultValues: { executionNotes: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ executionNotes: "" });
      setPhotos([]);
      setEquipmentNotes({});
      setCompletedService(null);
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
    const payload: CompleteServicePayload = {
      executionNotes: values.executionNotes,
      equipmentNotes: Object.entries(equipmentNotes)
        .filter(([, note]) => note.trim().length > 0)
        .map(([equipmentId, note]) => ({ equipmentId, note })),
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                          className="text-base sm:text-sm"
                          {...field}
                        />
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

                {equipment.length > 0 && (
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
