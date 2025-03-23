import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface UserSchema {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  NID: string;
  role: "admin" | "manager" | "super_admin";
  active: boolean;
  avatar: string;
}

interface AuthState {
  user: UserSchema | null;
  login: (user: UserSchema) => void;
  update: (user: UserSchema) => void;
  logout: () => void;
}

const userStore: StateCreator<AuthState> = (set) => ({
  user: null,
  login: (userData: UserSchema) => set(() => ({ user: userData })),
  update: (updatedData: UserSchema) =>
    set((state) => ({ user: { ...state.user, ...updatedData } })),
  logout: () => set(() => ({ user: null })),
});

const useAuth = create(
  devtools(
    persist(userStore, {
      name: "auth",
    })
  )
);

export { useAuth };
