import { create } from "zustand";
import type { FileNode } from "../types";
import { defaults, DESKTOP, ROOT, descendants, isValidName } from "../utils/filesystem";
import { loadFiles, saveFiles, clearFiles } from "../utils/idb";
const uid = () => crypto.randomUUID();
const normalizeName = (name: string) => name.trim();
const hasNameConflict = (
  files: FileNode[],
  parentId: string | null,
  name: string,
  idToIgnore?: string,
) =>
  files.some(
    (f) =>
      f.id !== idToIgnore &&
      f.parentId === parentId &&
      f.deletedAt === undefined &&
      f.name.toLowerCase() === name.toLowerCase(),
  );
const descendantsIncludingDeleted = (files: FileNode[], id: string): FileNode[] => {
  const node = files.find((file) => file.id === id);
  if (!node) return [];
  return [
    node,
    ...files
      .filter((file) => file.parentId === id)
      .flatMap((child) => descendantsIncludingDeleted(files, child.id)),
  ];
};
type FS = {
  files: FileNode[];
  ready: boolean;
  init: () => Promise<void>;
  addFolder: (name: string, parentId: string) => string | null;
  addFile: (name: string, parentId: string, content?: string) => string | null;
  rename: (id: string, name: string) => boolean;
  remove: (id: string) => void;
  restore: (id: string) => boolean;
  deletePermanently: (id: string) => void;
  emptyRecycleBin: () => void;
  write: (id: string, content: string) => void;
  reset: () => Promise<void>;
};
export const useFS = create<FS>((set, get) => ({
  files: [],
  ready: false,
  init: async () => {
    try {
      const f = await loadFiles();
      const files = f.length ? f : defaults();
      const desktop = files.find((item) => item.id === DESKTOP);
      if (!desktop) {
        files.push({
          id: DESKTOP,
          type: "folder",
          name: "Desktop",
          parentId: ROOT,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        await saveFiles(files);
      } else if (desktop.parentId !== ROOT || desktop.type !== "folder") {
        desktop.parentId = ROOT;
        desktop.type = "folder";
        await saveFiles(files);
      }
      set({ files, ready: true });
    } catch {
      set({ files: defaults(), ready: true });
    }
  },
  addFolder: (name, parentId) => {
    const normalized = normalizeName(name);
    if (!isValidName(normalized) || hasNameConflict(get().files, parentId, normalized))
      return null;
    const f = {
      id: uid(),
      type: "folder" as const,
      name: normalized,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const files = [...get().files, f];
    set({ files });
    void saveFiles(files);
    return f.id;
  },
  addFile: (name, parentId, content = "") => {
    const normalized = normalizeName(name);
    if (!isValidName(normalized) || hasNameConflict(get().files, parentId, normalized))
      return null;
    const f = {
      id: uid(),
      type: "file" as const,
      name: normalized,
      parentId,
      content,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const files = [...get().files, f];
    set({ files });
    void saveFiles(files);
    return f.id;
  },
  rename: (id, name) => {
    const normalized = normalizeName(name);
    if (!isValidName(normalized)) return false;
    const target = get().files.find((f) => f.id === id);
    if (!target) return false;
    const files = get().files.map((f) =>
      f.id === id ? { ...f, name: normalized, updatedAt: Date.now() } : f,
    );
    if (hasNameConflict(files, target.parentId, normalized, id)) return false;
    set({ files });
    void saveFiles(files);
    return true;
  },
  remove: (id) => {
    if (id === ROOT || id === DESKTOP) return;
    const ids = new Set(descendants(get().files, id).map((f) => f.id));
    const deletedAt = Date.now();
    const files = get().files.map((f) =>
      ids.has(f.id) ? { ...f, deletedAt } : f,
    );
    set({ files });
    void saveFiles(files);
  },
  restore: (id) => {
    const files = get().files;
    const ids = new Set(descendantsIncludingDeleted(files, id).map((f) => f.id));
    const restoring = files.filter((file) => ids.has(file.id));
    if (!restoring.length || restoring.some((file) => file.deletedAt === undefined))
      return false;
    const conflict = restoring.some((file) =>
      files.some(
        (other) =>
          !ids.has(other.id) &&
          other.deletedAt === undefined &&
          other.parentId === file.parentId &&
          other.name.toLowerCase() === file.name.toLowerCase(),
      ),
    );
    if (conflict) return false;
    const restored = files.map((file) => {
      if (!ids.has(file.id)) return file;
      const { deletedAt: _deletedAt, ...activeFile } = file;
      return activeFile;
    });
    set({ files: restored });
    void saveFiles(restored);
    return true;
  },
  deletePermanently: (id) => {
    const ids = new Set(descendantsIncludingDeleted(get().files, id).map((f) => f.id));
    const files = get().files.filter((f) => !ids.has(f.id));
    set({ files });
    void saveFiles(files);
  },
  emptyRecycleBin: () => {
    const files = get().files.filter((f) => f.deletedAt === undefined);
    set({ files });
    void saveFiles(files);
  },
  write: (id, content) => {
    const files = get().files.map((f) =>
      f.id === id ? { ...f, content, updatedAt: Date.now() } : f,
    );
    set({ files });
    void saveFiles(files);
  },
  reset: async () => {
    await clearFiles();
    const files = defaults();
    set({ files });
    await saveFiles(files);
  },
}));
