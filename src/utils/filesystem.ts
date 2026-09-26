import type { FileNode } from "../types";
const now = Date.now();
export const ROOT = "root";
export const DESKTOP = "desktop";
export function defaults(): FileNode[] {
  return [
    {
      id: ROOT,
      type: "folder",
      name: "My Computer",
      parentId: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "docs",
      type: "folder",
      name: "Documents",
      parentId: ROOT,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DESKTOP,
      type: "folder",
      name: "Desktop",
      parentId: ROOT,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "notes",
      type: "file",
      name: "notes.txt",
      parentId: "docs",
      content: "Hello from BrowserOS!\n\nThis is your virtual document.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "ideas",
      type: "file",
      name: "ideas.txt",
      parentId: "docs",
      content: "Ideas:\n- Build something useful\n- Learn React deeply",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "downloads",
      type: "folder",
      name: "Downloads",
      parentId: ROOT,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "example",
      type: "file",
      name: "example.txt",
      parentId: "downloads",
      content: "Example download file.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "projects",
      type: "folder",
      name: "Projects",
      parentId: ROOT,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "appjs",
      type: "file",
      name: "app.js",
      parentId: "projects",
      content: 'console.log("Hello BrowserOS");',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "readme",
      type: "file",
      name: "README.md",
      parentId: "projects",
      content: "# BrowserOS\nA simulated desktop environment.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "pictures",
      type: "folder",
      name: "Pictures",
      parentId: ROOT,
      createdAt: now,
      updatedAt: now,
    },
  ];
}
export function isValidName(name: string) {
  return name.trim().length > 0 && !/[\\/:*?"<>|]/.test(name);
}
export function children(files: FileNode[], p: string) {
  return files.filter((f) => f.parentId === p && f.deletedAt === undefined);
}
export function path(files: FileNode[], id: string) {
  const out: string[] = [];
  let cur = files.find((f) => f.id === id);
  while (cur) {
    out.unshift(cur.name);
    cur = files.find((f) => f.id === cur?.parentId);
  }
  return out;
}
export function descendants(files: FileNode[], id: string) {
  const out = files.filter((f) => f.id === id);
  for (const c of children(files, id)) out.push(...descendants(files, c.id));
  return out;
}
