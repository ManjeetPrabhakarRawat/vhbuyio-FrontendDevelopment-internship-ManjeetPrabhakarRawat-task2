import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Folder,
  FileText,
  FolderPlus,
  FilePlus,
  Pencil,
  Trash2,
  Info,
  RefreshCw,
} from "lucide-react";
import { useFS } from "../../stores/filesystemStore";
import { children, path, ROOT } from "../../utils/filesystem";
import { useWindows } from "../../stores/windowStore";
import { useNotifications } from "../../stores/notificationStore";
import ContextMenu from "../../components/ContextMenu/ContextMenu";
import PropertiesDialog, {
  type PropertiesData,
} from "../../components/PropertiesDialog/PropertiesDialog";
export default function FileExplorer({ windowId }: { windowId?: string }) {
  const files = useFS((s) => s.files),
    addFolder = useFS((s) => s.addFolder),
    addFile = useFS((s) => s.addFile),
    rename = useFS((s) => s.rename),
    remove = useFS((s) => s.remove);
  const open = useWindows((s) => s.openOrFocus);
  const requestedDir = useWindows((s) => {
    const value = s.windows.find((window) => window.id === windowId)?.data
      ?.directoryId;
    return typeof value === "string" ? value : null;
  });
  const notify = useNotifications((s) => s.push);
  const [dir, setDir] = useState(ROOT),
    [history, setHistory] = useState<string[]>([ROOT]),
    [hidx, setHidx] = useState(0),
    [selected, setSelected] = useState<string | null>(null),
    [refreshNonce, setRefreshNonce] = useState(0),
    [propertiesItem, setPropertiesItem] = useState<PropertiesData | null>(null),
    [menu, setMenu] = useState<{ x: number; y: number; id?: string } | null>(
      null,
    );
  useEffect(() => {
    if (!requestedDir || !files.some((file) => file.id === requestedDir))
      return;
    setDir(requestedDir);
    setHistory([requestedDir]);
    setHidx(0);
    setSelected(null);
  }, [requestedDir]);
  useEffect(() => {
    if (files.some((file) => file.id === dir)) return;
    setDir(ROOT);
    setHistory([ROOT]);
    setHidx(0);
    setSelected(null);
  }, [files, dir]);
  const items = useMemo(() => children(files, dir), [files, dir, refreshNonce]);
  const refresh = () => {
    setRefreshNonce((value) => value + 1);
    setSelected((current) =>
      current && items.some((item) => item.id === current) ? current : null,
    );
  };
  const go = (id: string) => {
    setHistory((h) => [...h.slice(0, hidx + 1), id]);
    setHidx((i) => i + 1);
    setDir(id);
    setSelected(null);
  };
  const parent = files.find((f) => f.id === dir)?.parentId;
  const createFolder = () => {
    const n = prompt("Folder name?", "New Folder");
    if (n) {
      if (addFolder(n, dir)) notify("Folder created", n);
      else
        notify(
          "Unable to create folder",
          "That name is blank or already exists.",
        );
    }
  };
  const createFile = () => {
    const n = prompt("File name?", "New File.txt");
    if (n) {
      if (addFile(n, dir, "")) notify("File created", n);
      else
        notify(
          "Unable to create file",
          "That name is blank or already exists.",
        );
    }
  };
  const act = (f: any) => {
    if (f.type === "folder") go(f.id);
    else open("text-editor", "Text Editor", { fileId: f.id });
  };
  return (
    <div
      className="explorer"
      onContextMenu={(e) => {
        e.preventDefault();
        setMenu({ x: e.clientX, y: e.clientY });
      }}
    >
      <div className="toolbar">
        <button
          disabled={hidx === 0}
          onClick={() => {
            const i = hidx - 1;
            setHidx(i);
            setDir(history[i]);
          }}
        >
          <ArrowLeft />
        </button>
        <button
          disabled={hidx >= history.length - 1}
          onClick={() => {
            const i = hidx + 1;
            setHidx(i);
            setDir(history[i]);
          }}
        >
          <ArrowRight />
        </button>
        <button disabled={!parent} onClick={() => parent && go(parent)}>
          <ArrowUp />
        </button>
        <div className="crumb">{path(files, dir).join(" / ")}</div>
        <button onClick={refresh}>
          <RefreshCw />
        </button>
      </div>
      <div className="file-grid">
        {items.map((f) => (
          <button
            key={f.id}
            className={`file ${selected === f.id ? "selected" : ""}`}
            onClick={() => setSelected(f.id)}
            onDoubleClick={() => act(f)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelected(f.id);
              setMenu({ x: e.clientX, y: e.clientY, id: f.id });
            }}
          >
            {f.type === "folder" ? <Folder /> : <FileText />}
            <span>{f.name}</span>
          </button>
        ))}
      </div>
      <div className="explorer-actions">
        <button onClick={createFolder}>
          <FolderPlus size={15} /> New Folder
        </button>
        <button onClick={createFile}>
          <FilePlus size={15} /> New File
        </button>
        {selected && (
          <>
            <button
              onClick={() => {
                const f = files.find((x) => x.id === selected);
                if (f) {
                  const n = prompt("Rename", f.name);
                  if (n && !rename(f.id, n))
                    notify(
                      "Unable to rename item",
                      "That name is blank or already exists.",
                    );
                }
              }}
            >
              <Pencil size={15} /> Rename
            </button>
            <button
              onClick={() => {
                const f = files.find((x) => x.id === selected);
                if (f && confirm(`Delete ${f.name}?`)) {
                  remove(f.id);
                  notify("Deleted", f.name);
                  setSelected(null);
                }
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
            <button
              onClick={() => {
                const f = files.find((x) => x.id === selected);
                if (f)
                  alert(
                    `${f.type === "folder" ? "Folder" : "File"}\nName: ${f.name}\nPath: /${path(files, f.id).slice(1).join("/")}`,
                  );
              }}
            >
              <Info size={15} /> Info
            </button>
          </>
        )}
      </div>
      {menu && (
        <ContextMenu
          x={menu.x}
          y={menu.y}
          close={() => setMenu(null)}
          items={
            menu.id
              ? [
                  [
                    "Open",
                    () => {
                      const f = files.find((x) => x.id === menu.id);
                      if (f) act(f);
                    },
                  ],
                  [
                    "Properties",
                    () => {
                      const f = files.find((x) => x.id === menu.id);
                      if (f) {
                        setPropertiesItem({
                          name: f.name,
                          type: f.type === "folder" ? "Folder" : "File",
                          location: `/${path(files, f.id).slice(1, -1).join("/") || ""}`,
                        });
                      }
                    },
                  ],
                  [
                    "Rename",
                    () => {
                      const f = files.find((x) => x.id === menu.id);
                      if (f) {
                        const n = prompt("Rename", f.name);
                        if (n && !rename(f.id, n))
                          notify(
                            "Unable to rename item",
                            "That name is blank or already exists.",
                          );
                      }
                    },
                  ],
                  [
                    "Delete",
                    () => {
                      const f = files.find((x) => x.id === menu.id);
                      if (f && confirm(`Delete ${f.name}?`)) remove(f.id);
                    },
                  ],
                ]
              : [
                  ["New Folder", createFolder],
                  ["New Text File", createFile],
                  ["Refresh", refresh],
                ]
          }
        />
      )}
      {propertiesItem && (
        <PropertiesDialog
          item={propertiesItem}
          close={() => setPropertiesItem(null)}
        />
      )}
    </div>
  );
}
