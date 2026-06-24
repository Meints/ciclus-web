import { onlyDigits } from "./utils";

export function maskDocumentPrivacy(value: string, type: "CPF" | "CNPJ"): string {
  const digits = onlyDigits(value);
  if (type === "CPF") {
    if (digits.length !== 11) return "***.***.***-**";
    return `${digits.slice(0, 3)}.***.***-${digits.slice(-2)}`;
  }
  if (digits.length !== 14) return "**.***.***/***-**";
  return `**.***.${digits.slice(3, 6)}/${digits.slice(6, 9)}-**`;
}

export function maskEmailPrivacy(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}***@${domain}`;
}
