import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../auth.store";
import type { AuthUser } from "@/types/auth";

const mockUser: AuthUser = {
  id: "user-1", name: "João Silva", email: "joao@test.com",
  role: "OWNER", companyId: "co-1", companyName: "Test Co",
  niche: "AIR_CONDITIONING",
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
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it("setInitialized marca como inicializado", () => {
    useAuthStore.getState().setInitialized(true);
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });

  it("clear remove o usuário e marca como inicializado", () => {
    useAuthStore.setState({ user: mockUser, isInitialized: false });
    useAuthStore.getState().clear();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isInitialized).toBe(true);
  });

  it("setUser com null limpa o usuário", () => {
    useAuthStore.setState({ user: mockUser });
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
