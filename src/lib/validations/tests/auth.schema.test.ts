import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, changePasswordSchema, forgotPasswordSchema } from "../auth";

describe("loginSchema", () => {
  it("valida entrada correta", () => {
    const result = loginSchema.safeParse({ email: "user@test.com", password: "senha123" });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({ email: "nao-e-email", password: "senha123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("E-mail inválido");
  });

  it("rejeita senha com menos de 6 chars", () => {
    const result = loginSchema.safeParse({ email: "user@test.com", password: "123" });
    expect(result.success).toBe(false);
  });

  it("rejeita campos vazios", () => {
    const result = loginSchema.safeParse({ email: "", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("valida entrada correta", () => {
    const result = registerSchema.safeParse({
      name: "João Silva", email: "joao@empresa.com",
      password: "senha123", companyName: "Empresa XYZ",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    const result = registerSchema.safeParse({
      name: "J", email: "j@e.com", password: "senha123", companyName: "Empresa",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/mínimo 2/i);
  });

  it("rejeita nome da empresa muito curto", () => {
    const result = registerSchema.safeParse({
      name: "João", email: "j@e.com", password: "senha123", companyName: "E",
    });
    expect(result.success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("valida quando senhas coincidem", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "senhaAtual", newPassword: "novaSenha1", confirmPassword: "novaSenha1",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita quando senhas não coincidem", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "senhaAtual", newPassword: "novaSenha1", confirmPassword: "outraSenha",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("As senhas não coincidem");
  });

  it("rejeita nova senha com menos de 6 chars", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "senhaAtual", newPassword: "123", confirmPassword: "123",
    });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("valida e-mail correto", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@test.com" });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail inválido", () => {
    const result = forgotPasswordSchema.safeParse({ email: "invalido" });
    expect(result.success).toBe(false);
  });
});
