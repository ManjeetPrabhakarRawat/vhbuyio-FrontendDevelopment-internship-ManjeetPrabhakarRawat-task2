import { useEffect, useRef } from "react";
import {
  FolderPlus,
  FilePlus,
  RefreshCw,
  Settings,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";

const iconMap: Record<string, any> = {
  "New Folder": FolderPlus,
  "New Text File": FilePlus,
  Refresh: RefreshCw,
  Settings,
  Delete: Trash2,
  Rename: Pencil,
  Open: ExternalLink,
  "Change Wallpaper": Settings,
  Properties: Settings,
};

export default function ContextMenu({
  x,
  y,
  items,
  close,
}: {
  x: number;
  y: number;
  items: [string, () => void][];
  close: () => void;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return (
    <div
      ref={menuRef}
      className="context"
      style={{
        left: Math.min(x, innerWidth - 200),
        top: Math.min(y, innerHeight - 220),
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {items.map(([label, fn]) => {
        const I = iconMap[label] || ExternalLink;
        return (
          <button
            key={label}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fn();
              close();
            }}
          >
            <I size={15} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
