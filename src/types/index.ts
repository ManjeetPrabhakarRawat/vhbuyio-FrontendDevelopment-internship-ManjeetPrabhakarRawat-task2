export type FileNode = {
  id: string;
  type: "folder" | "file";
  name: string;
  parentId: string | null;
  content?: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
};
export type Win = {
  id: string;
  app: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  data?: Record<string, unknown>;
};
export type Theme = "light" | "dark" | "purple" | "blue" | "midnight";
export type Wallpaper =
  | "default"
  | "gradient"
  | "aurora"
  | "custom"
  | "nature-forest"
  | "nature-mountains"
  | "nature-sunset"
  | "nature-ocean"
  | "nature-night-sky"
  | "nature-tropical"
  | "nature-desert"
  | "nature-spring"
  | "nature-winter"
  | "nature-rainy";
export type TaskbarPosition = "bottom" | "top";
