import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth.store";

const mockUser = {
  id: "user-1", name: "João Silva", email: "joao@test.com",
  role: "OWNER" as const, companyId: "co-1", companyName: "Test Co",
  plan: "STARTER" as const, niche: "AIR_CONDITIONING" as const,
};

beforeEach(() => {
  useAuthStore.setState({ user: null, isInitialized: false });
});

describe("useAuthStore", () => {
  it("estado inicial com user null e não inicializado", () => {
    const { user, isInitialized } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(isInitialized).toBe(false);
  });

  it("setUser atualiza o usuário", () => {
    useAuthStore.getState().setUser(mockUser as any);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it("setInitialized marca como inicializado", () => {
    useAuthStore.getState().setInitialized(true);
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });

  it("clear remove o usuário e marca como inicializado", () => {
    useAuthStore.setState({ user: mockUser as any, isInitialized: false });
    useAuthStore.getState().clear();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });

  it("setUser com null limpa o usuário", () => {
    useAuthStore.setState({ user: mockUser as any });
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
