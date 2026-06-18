export interface ConfirmationRecord {
  token: string;
  serviceId: string;
  expiresAt: string;
  confirmedAt: string | null;
  createdAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __ciclusConfirmations: ConfirmationRecord[] | undefined;
}

export const confirmations: ConfirmationRecord[] =
  globalThis.__ciclusConfirmations ?? (globalThis.__ciclusConfirmations = []);

const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;

export function createConfirmation(serviceId: string): ConfirmationRecord {
  const now = new Date();

  for (const record of confirmations) {
    if (record.serviceId === serviceId && !record.confirmedAt) {
      record.expiresAt = now.toISOString();
    }
  }

  const record: ConfirmationRecord = {
    token: crypto.randomUUID(),
    serviceId,
    expiresAt: new Date(now.getTime() + CONFIRMATION_TTL_MS).toISOString(),
    confirmedAt: null,
    createdAt: now.toISOString(),
  };

  confirmations.push(record);
  return record;
}

export function findConfirmation(token: string): ConfirmationRecord | undefined {
  return confirmations.find((record) => record.token === token);
}

export function isConfirmationExpired(record: ConfirmationRecord): boolean {
  return new Date(record.expiresAt).getTime() < Date.now();
}

export function confirmByToken(token: string): ConfirmationRecord | undefined {
  const record = findConfirmation(token);
  if (!record) return undefined;
  if (!record.confirmedAt) {
    record.confirmedAt = new Date().toISOString();
  }
  return record;
}

export function findActiveConfirmationByService(serviceId: string): ConfirmationRecord | undefined {
  return [...confirmations]
    .reverse()
    .find((record) => record.serviceId === serviceId);
}
