import { describe, it, expect } from "vitest";
import { maskDocumentPrivacy, maskEmailPrivacy } from "../privacy-mask";

describe("maskDocumentPrivacy", () => {
  it("mascara CPF exibindo apenas primeiros 3 e últimos 2 dígitos", () => {
    const result = maskDocumentPrivacy("52998224725", "CPF");
    expect(result).toBe("529.***.***-25");
  });

  it("retorna placeholder se CPF tem tamanho inválido", () => {
    const result = maskDocumentPrivacy("123", "CPF");
    expect(result).toBe("***.***.***-**");
  });

  it("mascara CNPJ expondo dígitos do meio (pos 3-8)", () => {
    // "11222333000181" → slice(3,6)="223", slice(6,9)="330"
    const result = maskDocumentPrivacy("11222333000181", "CNPJ");
    expect(result).toBe("**.***.223/330-**");
  });

  it("retorna placeholder se CNPJ tem tamanho inválido", () => {
    const result = maskDocumentPrivacy("123", "CNPJ");
    expect(result).toBe("**.***.***/***-**");
  });
});

describe("maskEmailPrivacy", () => {
  it("exibe apenas 2 primeiros chars do local", () => {
    const result = maskEmailPrivacy("joao@empresa.com");
    expect(result).toBe("jo***@empresa.com");
  });

  it("retorna email original se formato inválido", () => {
    const result = maskEmailPrivacy("nao-e-email");
    expect(result).toBe("nao-e-email");
  });

  it("funciona com local de 1 char", () => {
    const result = maskEmailPrivacy("a@test.com");
    expect(result).toBe("a***@test.com");
  });
});
