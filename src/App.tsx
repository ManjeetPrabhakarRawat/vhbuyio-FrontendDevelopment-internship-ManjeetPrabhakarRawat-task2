import { useCallback, useEffect, useState } from "react";
import { useSettings } from "./stores/settingsStore";
import { useFS } from "./stores/filesystemStore";
import { useWindows } from "./stores/windowStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import Desktop from "./components/Desktop/Desktop";
import Taskbar from "./components/Taskbar/Taskbar";
import StartMenu from "./components/StartMenu/StartMenu";
import Window from "./components/Window/Window";
import Notifications from "./components/Notifications/Notifications";
import FileExplorer from "./apps/FileExplorer/FileExplorer";
import TerminalApp from "./apps/Terminal/Terminal";
import TextEditor from "./apps/TextEditor/TextEditor";
import Settings from "./apps/Settings/Settings";
import CalculatorApp from "./apps/Calculator/Calculator";
import RecycleBin from "./apps/RecycleBin/RecycleBin";
import WallpaperApp from "./apps/Wallpaper/Wallpaper";
import {
  natureWallpaperById,
  type NatureWallpaperId,
} from "./assets/natureWallpapers";

const apps = {
  "file-explorer": FileExplorer,
  "text-editor": TextEditor,
  terminal: TerminalApp,
  settings: Settings,
  calculator: CalculatorApp,
  "recycle-bin": RecycleBin,
  wallpaper: WallpaperApp,
} as const;

export default function App() {
  const settings = useSettings();
  const init = useFS((s) => s.init);
  const ready = useFS((s) => s.ready);
  const windows = useWindows((s) => s.windows);
  const focus = useWindows((s) => s.focus);
  const open = useWindows((s) => s.openOrFocus);
  const [start, setStart] = useState(false);
  const [search, setSearch] = useState(false);
  const toggleStart = useCallback(() => {
    setStart((value) => !value);
    setSearch(false);
  }, []);
  const openSearch = useCallback(() => {
    setSearch((value) => !value);
    setStart(false);
  }, []);
  const closeStart = useCallback(() => setStart(false), []);
  const closeSearch = useCallback(() => setSearch(false), []);
  const openWallpaperPicker = useCallback(() => {
    open("wallpaper", "Wallpaper");
  }, [open]);

  useKeyboardShortcuts(toggleStart, closeStart);

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.wallpaper = settings.wallpaper;
    if (settings.customWallpaper) {
      document.documentElement.style.setProperty(
        "--custom-wallpaper",
        `url("${settings.customWallpaper}")`,
      );
    } else {
      document.documentElement.style.removeProperty("--custom-wallpaper");
    }
    const natureWallpaper =
      natureWallpaperById[settings.wallpaper as NatureWallpaperId];
    if (natureWallpaper) {
      document.documentElement.style.setProperty(
        "--nature-wallpaper",
        `url("${natureWallpaper.image}")`,
      );
    } else {
      document.documentElement.style.removeProperty("--nature-wallpaper");
    }
  }, [settings.theme, settings.wallpaper, settings.customWallpaper]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Tab") {
        e.preventDefault();
        const open = windows
          .filter((w) => !w.minimized)
          .sort((a, b) => a.zIndex - b.zIndex);

        if (open.length) {
          const active = useWindows.getState().active;
          const i = open.findIndex((w) => w.id === active);
          focus(open[(i + 1) % open.length].id);
        }
      }
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [windows, focus]);

  if (!ready) return <div className="loading">Starting BrowserOS…</div>;

  return (
    <div className="os">
      <Desktop
        openStart={() => setStart(true)}
        openWallpaperPicker={openWallpaperPicker}
      />
      {windows.map((w) => {
        const C = apps[w.app as keyof typeof apps];
        return C ? (
          <Window id={w.id} key={w.id}>
            <C windowId={w.id} />
          </Window>
        ) : null;
      })}
      <Taskbar toggleStart={toggleStart} openSearch={openSearch} />
      {start && (
        <>
          <div className="start-backdrop" onClick={closeStart} />
          <StartMenu close={closeStart} />
        </>
      )}
      {search && (
        <>
          <div className="start-backdrop" onClick={closeSearch} />
          <StartMenu close={closeSearch} mode="search" />
        </>
      )}
      <Notifications />
    </div>
  );
}
