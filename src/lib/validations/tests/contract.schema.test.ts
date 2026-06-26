import { describe, it, expect } from "vitest";
import { contractSchema } from "../contract";

const validContract = {
  customerId: "cust-1",
  frequency: "MONTHLY" as const,
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  value: 300,
};

describe("contractSchema", () => {
  it("valida contrato completo", () => {
    const result = contractSchema.safeParse(validContract);
    expect(result.success).toBe(true);
  });

  it("rejeita sem customerId", () => {
    const result = contractSchema.safeParse({ ...validContract, customerId: "" });
    expect(result.success).toBe(false);
  });

  it("rejeita frequência inválida", () => {
    const result = contractSchema.safeParse({ ...validContract, frequency: "DAILY" });
    expect(result.success).toBe(false);
  });

  it("rejeita valor zerado", () => {
    const result = contractSchema.safeParse({ ...validContract, value: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/maior que zero/);
  });

  it("rejeita valor negativo", () => {
    const result = contractSchema.safeParse({ ...validContract, value: -100 });
    expect(result.success).toBe(false);
  });

  it("aceita notas opcionais", () => {
    const result = contractSchema.safeParse({ ...validContract, notes: "Observações aqui" });
    expect(result.success).toBe(true);
  });
});
