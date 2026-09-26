import {
  Calculator,
  FileText,
  Folder,
  Monitor,
  Settings,
  Terminal as TerminalIcon,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FileNode } from "../../types";
import { useFS } from "../../stores/filesystemStore";
import { useNotifications } from "../../stores/notificationStore";
import { useWindows } from "../../stores/windowStore";
import { APP_ICONS } from "../../constants/apps";
import { children, DESKTOP, path, ROOT } from "../../utils/filesystem";
import ContextMenu from "../ContextMenu/ContextMenu";
import CreateItemDialog from "../CreateItemDialog/CreateItemDialog";
import PropertiesDialog, { type PropertiesData } from "../PropertiesDialog/PropertiesDialog";

type DialogType = "folder" | "file";

const desktopApps = [
  ["file-explorer", "File Explorer", Folder],
  ["text-editor", "Text Editor", FileText],
  ["terminal", "Terminal", TerminalIcon],
  ["settings", "Settings", Settings],
  ["calculator", "Calculator", Calculator],
  ["recycle-bin", "Recycle Bin", Trash2],
] as const;

const withTxtExtension = (name: string) =>
  name.toLowerCase().endsWith(".txt") ? name : `${name}.txt`;

export default function Desktop({
  openStart: _openStart,
  openWallpaperPicker,
}: {
  openStart: () => void;
  openWallpaperPicker: () => void;
}) {
  const open = useWindows((s) => s.openOrFocus);
  const files = useFS((s) => s.files);
  const addFolder = useFS((s) => s.addFolder);
  const addFile = useFS((s) => s.addFile);
  const notify = useNotifications((s) => s.push);
  const [selected, setSelected] = useState<string | null>(null);
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    kind: "desktop" | "app" | "item";
    appId?: string;
    title?: string;
    itemId?: string;
  } | null>(null);
  const [dialog, setDialog] = useState<DialogType | null>(null);
  const [propertiesItem, setPropertiesItem] = useState<PropertiesData | null>(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  const desktopItems = useMemo(() => children(files, DESKTOP), [files]);

  const closeMenu = () => setMenu(null);
  const openItem = (item: FileNode) => {
    setShowHint(false);
    if (item.type === "folder") {
      open("file-explorer", "File Explorer", { directoryId: item.id });
    } else {
      open("text-editor", "Text Editor", { fileId: item.id });
    }
  };

  const createItem = (type: DialogType, name: string) => {
    const finalName = type === "file" ? withTxtExtension(name) : name;
    const conflict = desktopItems.some(
      (item) => item.name.toLowerCase() === finalName.toLowerCase(),
    );
    if (conflict) {
      return `${type === "folder" ? "A folder" : "A file"} named '${finalName}' already exists.`;
    }

    const id = type === "folder"
      ? addFolder(finalName, DESKTOP)
      : addFile(finalName, DESKTOP, "");
    if (!id) return `Unable to create ${type}.`;

    setDialog(null);
    setSelected(id);
    notify(`${type === "folder" ? "Folder" : "File"} created`, finalName);
  };

  const contextItems: [string, () => void][] = menu?.kind === "item"
    ? [
        ["Open", () => {
          const item = files.find((entry) => entry.id === menu.itemId);
          if (item) openItem(item);
          closeMenu();
        }],
        ["Properties", () => {
          const item = files.find((entry) => entry.id === menu.itemId);
          if (item) {
            setPropertiesItem({
              name: item.name,
              type: item.type === "folder" ? "Folder" : "File",
              location: `/${path(files, item.id).slice(1, -1).join("/") || ""}`,
            });
          }
          closeMenu();
        }],
      ]
    : menu?.kind === "app"
      ? [
          ["Open", () => {
            if (menu.appId && menu.title) open(menu.appId, menu.title);
            closeMenu();
          }],
          ["Properties", () => {
            if (menu.title) {
              setPropertiesItem({
                name: menu.title,
                type: "Application",
                location: "/Desktop",
              });
            }
            closeMenu();
          }],
        ]
    : [
        ["New Folder", () => {
          closeMenu();
          setDialog("folder");
        }],
        ["New Text File", () => {
          closeMenu();
          setDialog("file");
        }],
        ["Refresh", () => {
          closeMenu();
          setSelected(null);
        }],
        ["Settings", () => {
          closeMenu();
          open("settings", "Settings");
        }],
        ["Change Wallpaper", () => {
          closeMenu();
          openWallpaperPicker();
        }],
      ];

  return (
    <div
      className="desktop"
      onContextMenu={(event) => {
        event.preventDefault();
        setSelected(null);
        setMenu({ x: event.clientX, y: event.clientY, kind: "desktop" });
      }}
      onClick={() => {
        closeMenu();
        setSelected(null);
      }}
    >
      <div className="desktop-icons">
        {desktopApps.map(([app, title, Icon]) => {
          const AppIcon = APP_ICONS[app as keyof typeof APP_ICONS] ?? Icon;
          return (
            <button
              key={app}
              type="button"
              className={selected === app ? "selected" : ""}
              onClick={(event) => {
                event.stopPropagation();
                setSelected(app);
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
                setShowHint(false);
                open(app, title, app === "file-explorer" ? { directoryId: ROOT } : undefined);
              }}
              onContextMenu={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setSelected(app);
                setMenu({
                  x: event.clientX,
                  y: event.clientY,
                  kind: "app",
                  appId: app,
                  title,
                });
              }}
              title={title}
            >
              <AppIcon className="desktop-icon-svg" data-app={app} aria-hidden="true" />
              <span>{title}</span>
            </button>
          );
        })}
        {desktopItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={selected === item.id ? "selected" : ""}
            onClick={(event) => {
              event.stopPropagation();
              setSelected(item.id);
            }}
            onDoubleClick={(event) => {
              event.stopPropagation();
              openItem(item);
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setSelected(item.id);
              setMenu({
                x: event.clientX,
                y: event.clientY,
                kind: "item",
                itemId: item.id,
              });
            }}
            title={item.name}
          >
            {item.type === "folder" ? (
              <Folder className="desktop-icon-svg" data-file-type="folder" aria-hidden="true" />
            ) : (
              <FileText className="desktop-icon-svg" data-file-type="file" aria-hidden="true" />
            )}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
      {menu && (
        <ContextMenu x={menu.x} y={menu.y} close={closeMenu} items={contextItems} />
      )}
      <CreateItemDialog
        type={dialog ?? "folder"}
        open={dialog !== null}
        onCancel={() => setDialog(null)}
        onCreate={(name) => createItem(dialog ?? "folder", name)}
      />
      {propertiesItem && (
        <PropertiesDialog
          item={propertiesItem}
          close={() => setPropertiesItem(null)}
        />
      )}
      {showHint && (
        <div className="desktop-hint">
          <Monitor size={16} /> Double-click an icon to launch an app
        </div>
      )}
    </div>
  );
}
