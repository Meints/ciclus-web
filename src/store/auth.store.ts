import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  setInitialized: (value: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (value) => set({ isInitialized: value }),
  clear: () => set({ user: null, isInitialized: true }),
}));
