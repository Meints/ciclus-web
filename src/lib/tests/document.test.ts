import { describe, it, expect } from "vitest";
import { isValidCPF, isValidCNPJ, isValidDocument, maskCPF, maskCNPJ, maskPhone, maskZipCode } from "../document";

const VALID_CPF = "52998224725";
const VALID_CNPJ = "11222333000181";

describe("isValidCPF", () => {
  it("valida CPF legítimo", () => {
    expect(isValidCPF(VALID_CPF)).toBe(true);
  });

  it("rejeita CPF com todos dígitos iguais", () => {
    expect(isValidCPF("11111111111")).toBe(false);
  });

  it("rejeita CPF com tamanho errado", () => {
    expect(isValidCPF("123456789")).toBe(false);
  });

  it("valida CPF formatado com pontos e traço", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
  });
});

describe("isValidCNPJ", () => {
  it("valida CNPJ legítimo", () => {
    expect(isValidCNPJ(VALID_CNPJ)).toBe(true);
  });

  it("rejeita CNPJ com todos dígitos iguais", () => {
    expect(isValidCNPJ("11111111111111")).toBe(false);
  });

  it("rejeita CNPJ com tamanho errado", () => {
    expect(isValidCNPJ("12345678")).toBe(false);
  });
});

describe("isValidDocument", () => {
  it("valida CPF de 11 dígitos", () => {
    expect(isValidDocument(VALID_CPF)).toBe(true);
  });

  it("valida CNPJ de 14 dígitos", () => {
    expect(isValidDocument(VALID_CNPJ)).toBe(true);
  });

  it("rejeita documento de tamanho inválido", () => {
    expect(isValidDocument("12345")).toBe(false);
  });
});

describe("maskCPF", () => {
  it("formata CPF com pontos e traço", () => {
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
  });

  it("formata parcialmente se incompleto", () => {
    expect(maskCPF("52998")).toBe("529.98");
  });
});

describe("maskCNPJ", () => {
  it("formata CNPJ completo", () => {
    expect(maskCNPJ("11222333000181")).toBe("11.222.333/0001-81");
  });
});

describe("maskPhone", () => {
  it("formata celular com 11 dígitos", () => {
    expect(maskPhone("11999999999")).toBe("(11) 99999-9999");
  });

  it("formata fixo com 10 dígitos", () => {
    expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
  });
});

describe("maskZipCode", () => {
  it("formata CEP com hífen", () => {
    expect(maskZipCode("01310100")).toBe("01310-100");
  });
});
