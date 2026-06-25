"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CheckCircle2Icon, Loader2Icon, RecycleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    forgotPassword.mutate(values.email, {
      onSuccess: () => setSubmitted(true),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <RecycleIcon className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold">Ciclus</h1>
        <p className="text-sm text-muted-foreground">
          Recupere o acesso à sua conta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Esqueci minha senha</CardTitle>
          <CardDescription>
            Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100 text-success-600">
                <CheckCircle2Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">
                E-mail enviado! Verifique sua caixa de entrada.
              </p>
              <p className="text-xs text-muted-foreground">
                Se não encontrar, verifique também a pasta de spam.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="voce@suaempresa.com.br"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={forgotPassword.isPending} className="mt-2">
                  {forgotPassword.isPending && <Loader2Icon className="animate-spin" />}
                  Enviar link de recuperação
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Lembrou a senha?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
