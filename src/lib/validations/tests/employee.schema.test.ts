import { describe, it, expect } from "vitest";
import { employeeSchema } from "../employee";

describe("employeeSchema", () => {
  it("valida nome válido", () => {
    const result = employeeSchema.safeParse({ name: "João Técnico" });
    expect(result.success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    const result = employeeSchema.safeParse({ name: "Jo" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/mínimo 3/);
  });

  it("aceita e-mail vazio (opcional)", () => {
    const result = employeeSchema.safeParse({ name: "João", email: "" });
    expect(result.success).toBe(true);
  });

  it("rejeita e-mail com formato inválido", () => {
    const result = employeeSchema.safeParse({ name: "João", email: "nao-email" });
    expect(result.success).toBe(false);
  });

  it("aceita sem e-mail (campo opcional)", () => {
    const result = employeeSchema.safeParse({ name: "João Técnico" });
    expect(result.success).toBe(true);
  });
});
