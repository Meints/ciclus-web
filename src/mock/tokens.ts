interface FakeTokenPayload {
  sub: string;
  role: string;
  companyId: string;
  exp: number;
}

function base64UrlEncode(value: object): string {
  const json = JSON.stringify(value);
  return Buffer.from(json)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
}

export function createFakeToken(payload: Omit<FakeTokenPayload, "exp">): string {
  const header = base64UrlEncode({ alg: "none", typ: "JWT" });
  const body = base64UrlEncode({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  });
  return `${header}.${body}.mock-signature`;
}

export function decodeFakeToken(token: string): FakeTokenPayload | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    return JSON.parse(base64UrlDecode(segment)) as FakeTokenPayload;
  } catch {
    return null;
  }
}
