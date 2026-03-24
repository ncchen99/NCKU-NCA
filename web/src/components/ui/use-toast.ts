import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
}

interface ToastStore {
  toasts: Toast[];
  toast: (message: string, type?: Toast["type"]) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  toast: (message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message: string, type: Toast["type"] = "info") => {
  useToastStore.getState().toast(message, type);
};
