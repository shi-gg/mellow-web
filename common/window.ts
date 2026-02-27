import { create } from "zustand";

export interface Web {
    width: number;
}

export const useWindow = create<Web>(() => ({
    width: Infinity
}));