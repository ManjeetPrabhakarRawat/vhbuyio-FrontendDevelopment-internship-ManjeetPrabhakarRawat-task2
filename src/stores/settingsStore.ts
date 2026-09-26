import { create } from "zustand";
import type { Theme, Wallpaper, TaskbarPosition } from "../types";
type S = {
  theme: Theme;
  wallpaper: Wallpaper;
  customWallpaper: string | null;
  taskbar: TaskbarPosition;
  transparency: boolean;
  set: (
    p: Partial<Pick<S, "theme" | "wallpaper" | "taskbar" | "transparency">>,
  ) => void;
  setCustomWallpaper: (dataUrl: string) => void;
  reset: () => void;
};
const key = "browser-os-settings";
const customWallpaperKey = "browseros-custom-wallpaper";
const defaults = {
  theme: "dark" as Theme,
  wallpaper: "default" as Wallpaper,
  customWallpaper: null,
  taskbar: "bottom" as TaskbarPosition,
  transparency: true,
};
const read = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "{}") as Partial<typeof defaults>;
    const customWallpaper = localStorage.getItem(customWallpaperKey);
    const validCustomWallpaper = customWallpaper?.startsWith("data:image/")
      ? customWallpaper
      : null;
    const wallpaper = saved.wallpaper === "custom" && validCustomWallpaper
      ? "custom"
      : saved.wallpaper === "custom"
        ? "default"
        : saved.wallpaper;
    return {
      ...defaults,
      ...saved,
      wallpaper: wallpaper || defaults.wallpaper,
      customWallpaper: validCustomWallpaper,
    };
  } catch {
    return defaults;
  }
};
export const useSettings = create<S>((set, get) => ({
  ...read(),
  set: (p) =>
    set((s) => {
      const next = { ...s, ...p };
      localStorage.setItem(
        key,
        JSON.stringify({
          theme: next.theme,
          wallpaper: next.wallpaper,
          taskbar: next.taskbar,
          transparency: next.transparency,
        }),
      );
      return next;
    }),
  setCustomWallpaper: (dataUrl) => {
    if (!dataUrl.startsWith("data:image/")) return;
    localStorage.setItem(customWallpaperKey, dataUrl);
    set((s) => ({ ...s, customWallpaper: dataUrl, wallpaper: "custom" }));
    localStorage.setItem(
      key,
      JSON.stringify({
        theme: get().theme,
        wallpaper: "custom",
        taskbar: get().taskbar,
        transparency: get().transparency,
      }),
    );
  },
  reset: () => {
    localStorage.setItem(key, JSON.stringify(defaults));
    localStorage.removeItem(customWallpaperKey);
    set(defaults);
  },
}));
