import { create } from "zustand";
import type { Win } from "../types";

let z = 10;

const base = (
  app: string,
  title: string,
  data?: Record<string, unknown>,
): Win => {
  const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
  const isSettings = app === "settings";
  const width = isSettings
    ? Math.min(900, Math.max(700, viewportWidth - 80))
    : 720;
  const height = isSettings
    ? Math.min(640, Math.max(500, viewportHeight - 140))
    : 480;

  return {
    id: crypto.randomUUID(),
    app,
    title,
    x: isSettings
      ? Math.max(24, Math.round((viewportWidth - width) / 2))
      : 90 + (z % 5) * 28,
    y: isSettings
      ? Math.max(24, Math.round((viewportHeight - height) / 2))
      : 55 + (z % 4) * 24,
    width,
    height,
    minimized: false,
    maximized: false,
    zIndex: ++z,
    data,
  };
};

type W = {
  windows: Win[];
  active: string | null;
  open: (app: string, title: string, data?: Record<string, unknown>) => string;
  openOrFocus: (
    app: string,
    title: string,
    data?: Record<string, unknown>,
  ) => string;
  closeWindow: (id: string) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
  update: (id: string, p: Partial<Win>) => void;
  reset: () => void;
};

export const useWindows = create<W>((set, get) => ({
  windows: [],
  active: null,
  open: (app, title, data) => {
    const w = base(app, title, data);
    set((s) => ({ windows: [...s.windows, w], active: w.id }));
    return w.id;
  },
  openOrFocus: (app, title, data) => {
    const existing = get().windows.find((w) => w.app === app);
    if (existing) {
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === existing.id
            ? {
                ...w,
                minimized: false,
                zIndex: ++z,
                data: data === undefined ? w.data : data,
              }
            : w,
        ),
        active: existing.id,
      }));
      return existing.id;
    }

    const w = base(app, title, data);
    set((s) => ({ windows: [...s.windows, w], active: w.id }));
    return w.id;
  },
  closeWindow: (id) =>
    set((s) => {
      const windows = s.windows.filter((w) => w.id !== id);
      return {
        windows,
        active:
          windows
            .filter((w) => !w.minimized)
            .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null,
      };
    }),
  close: (id) => get().closeWindow(id),
  focus: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: false, zIndex: ++z } : w,
      ),
      active: id,
    })),
  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w,
      ),
      active: s.active === id ? null : s.active,
    })),
  toggleMax: (id) =>
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w,
      ),
      active: id,
    })),
  update: (id, p) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, ...p } : w)),
    })),
  reset: () => set({ windows: [], active: null }),
}));
