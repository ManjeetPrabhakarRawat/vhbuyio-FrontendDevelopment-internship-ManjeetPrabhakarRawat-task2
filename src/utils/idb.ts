import type { FileNode } from "../types";
const DB = "browser-os",
  STORE = "files",
  VERSION = 1;
let writeQueue = Promise.resolve();
function open() {
  return new Promise<IDBDatabase>((res, rej) => {
    const r = indexedDB.open(DB, VERSION);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: "id" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
export async function loadFiles() {
  const db = await open();
  return new Promise<FileNode[]>((res, rej) => {
    const r = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function saveFilesNow(files: FileNode[]) {
  const db = await open();
  return new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, "readwrite"),
      s = tx.objectStore(STORE);
    s.clear();
    files.forEach((f) => s.put(f));
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
}
export function saveFiles(files: FileNode[]) {
  const snapshot = files.map((file) => ({ ...file }));
  writeQueue = writeQueue.then(() => saveFilesNow(snapshot));
  return writeQueue;
}
async function clearFilesNow() {
  const db = await open();
  return new Promise<void>((res, rej) => {
    const r = db.transaction(STORE, "readwrite").objectStore(STORE).clear();
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
}
export function clearFiles() {
  writeQueue = writeQueue.then(() => clearFilesNow());
  return writeQueue;
}
