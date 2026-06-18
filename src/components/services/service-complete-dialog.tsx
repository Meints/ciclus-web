"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2Icon, TrashIcon, UploadIcon } from "lucide-react";
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
import type { Service } from "@/types/service";
import type { Equipment } from "@/types/equipment";

interface ServiceCompleteDialogProps {
  serviceId: string;
  equipment?: Equipment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted?: () => void;
}

export function ServiceCompleteDialog({
  serviceId,
  equipment = [],
  open,
  onOpenChange,
  onCompleted,
}: ServiceCompleteDialogProps) {
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [equipmentNotes, setEquipmentNotes] = useState<Record<string, string>>({});
  const [completedService, setCompletedService] = useState<Service | null>(null);

  const completeService = useCompleteService(serviceId);
  const uploadPhoto = useUploadServicePhoto(serviceId);

  const form = useForm<CompleteServiceFormValues>({
    resolver: zodResolver(completeServiceSchema),
    defaultValues: { notes: "", photoUrls: [] },
  });

  useEffect(() => {
    if (!open) {
      form.reset({ notes: "", photoUrls: [] });
      setPhotos([]);
      setEquipmentNotes({});
      setCompletedService(null);
    }
  }, [open, form]);

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      try {
        const result = await uploadPhoto.mutateAsync(file);
        setPhotos((prev) => {
          const next = [...prev, { url: result.url, name: file.name }];
          form.setValue(
            "photoUrls",
            next.map((photo) => photo.url),
            { shouldValidate: true }
          );
          return next;
        });
      } catch {
        // erro já notificado via toast no hook de upload
      }
    }
    event.target.value = "";
  }

  function handleRemovePhoto(url: string) {
    setPhotos((prev) => {
      const next = prev.filter((photo) => photo.url !== url);
      form.setValue(
        "photoUrls",
        next.map((photo) => photo.url),
        { shouldValidate: true }
      );
      return next;
    });
  }

  function onSubmit(values: CompleteServiceFormValues) {
    const payload: CompleteServiceFormValues = {
      ...values,
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
      <DialogContent className="max-w-lg">
        {completedService?.confirmationLink ? (
          <>
            <DialogHeader>
              <DialogTitle>Execução registrada</DialogTitle>
            </DialogHeader>
            <ConfirmationLinkPanel
              confirmationLink={completedService.confirmationLink}
              expiresAt={completedService.confirmationExpiresAt ?? null}
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
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descreva o que foi executado..." rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photoUrls"
                  render={() => (
                    <FormItem>
                      <FormLabel>Fotos da execução</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-2">
                          <label
                            className={cn(
                              "flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-accent/40",
                              uploadPhoto.isPending && "pointer-events-none opacity-50"
                            )}
                          >
                            <UploadIcon className="h-4 w-4" />
                            {uploadPhoto.isPending ? "Enviando..." : "Selecionar fotos"}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={handlePhotoChange}
                              disabled={uploadPhoto.isPending}
                            />
                          </label>

                          {photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {photos.map((photo) => (
                                <div
                                  key={photo.url}
                                  className="group relative aspect-square overflow-hidden rounded-md border"
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={photo.url}
                                    alt={photo.name}
                                    className="h-full w-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(photo.url)}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                  >
                                    <TrashIcon className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <DialogFooter>
                  <Button type="submit" disabled={completeService.isPending}>
                    {completeService.isPending && <Loader2Icon className="animate-spin" />}
                    Concluir OS
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
