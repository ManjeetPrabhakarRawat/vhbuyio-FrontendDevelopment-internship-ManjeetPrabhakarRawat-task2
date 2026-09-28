import {
  Search,
  Folder,
  Terminal,
  FileText,
  Settings,
  Calculator,
  Power,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFS } from "../../stores/filesystemStore";
import { useWindows } from "../../stores/windowStore";
import { APP_ICONS } from "../../constants/apps";

const apps = [
  ["file-explorer", "File Explorer", Folder],
  ["terminal", "Terminal", Terminal],
  ["text-editor", "Text Editor", FileText],
  ["settings", "Settings", Settings],
  ["calculator", "Calculator", Calculator],
  ["recycle-bin", "Recycle Bin", Trash2],
] as const;

export default function StartMenu({
  close,
  mode = "start",
}: {
  close: () => void;
  mode?: "start" | "search";
}) {
  const searchOnly = mode === "search";
  const [q, setQ] = useState("");
  const open = useWindows((s) => s.openOrFocus);
  const files = useFS((s) => s.files);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const appResults = useMemo(
    () =>
      q.trim()
        ? apps.filter(([_, title]) =>
            title.toLowerCase().includes(q.toLowerCase()),
          )
        : [],
    [q],
  );

  const fileResults = useMemo(
    () =>
      q.trim()
        ? files
            .filter((f) => f.name.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 8)
        : [],
    [files, q],
  );

  return (
    <div
      className={`startmenu ${searchOnly ? "searchmenu" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="start-search">
        <Search size={17} />
        <input
          autoFocus
          placeholder="Search apps and files"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {q.trim() && (appResults.length > 0 || fileResults.length > 0) && (
        <div className="search-results">
          {appResults.map(([app, title, Icon]) => (
            <button
              key={app}
              onClick={() => {
                open(app, title);
                close();
              }}
            >
              {(() => {
                const AppIcon =
                  APP_ICONS[app as keyof typeof APP_ICONS] ?? Icon;
                return <AppIcon size={17} />;
              })()}
              <span>{title}</span>
            </button>
          ))}
          {fileResults.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                if (f.type === "file") {
                  open("text-editor", "Text Editor", { fileId: f.id });
                } else {
                  open("file-explorer", "File Explorer", { directoryId: f.id });
                }
                close();
              }}
            >
              {f.type === "file" ? (
                <FileText size={17} />
              ) : (
                <Folder size={17} />
              )}
              <span>{f.name}</span>
            </button>
          ))}
        </div>
      )}
      {!searchOnly && (
        <>
          <h4>Applications</h4>
          <div className="app-grid">
            {apps
              .filter(([_, title]) =>
                title.toLowerCase().includes(q.toLowerCase()),
              )
              .map(([app, title, Icon]) => (
                <button
                  key={app}
                  onClick={() => {
                    open(app, title);
                    close();
                  }}
                >
                  {(() => {
                    const AppIcon =
                      APP_ICONS[app as keyof typeof APP_ICONS] ?? Icon;
                    return <AppIcon />;
                  })()}
                  <span>{title}</span>
                </button>
              ))}
          </div>
          <div className="start-footer">
            <span>BrowserOS</span>
            <button onClick={() => window.location.reload()}>
              <Power size={17} /> Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
