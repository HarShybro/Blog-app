import { create } from "zustand";

export const useUser = create((set) => ({
  user: {},
  setUser: (value) => set({ user: value }),
}));
