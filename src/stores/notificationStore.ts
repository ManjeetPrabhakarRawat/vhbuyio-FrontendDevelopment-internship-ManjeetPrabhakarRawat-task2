import { create } from "zustand";
type N = { id: string; title: string; message: string };
type S = {
  items: N[];
  push: (title: string, message: string) => void;
  remove: (id: string) => void;
};
export const useNotifications = create<S>((set) => ({
  items: [],
  push: (title, message) => {
    const id = crypto.randomUUID();
    set((s) => ({ items: [...s.items, { id, title, message }] }));
    setTimeout(
      () => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
      3500,
    );
  },
  remove: (id) => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
}));
