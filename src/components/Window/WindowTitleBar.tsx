import { Maximize2, Minimize2, Square, X } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useWindows } from "../../stores/windowStore";

type Props = {
  windowId: string;
  title: string;
  maximized: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
};

export default function WindowTitleBar({
  windowId,
  title,
  maximized,
  onPointerDown,
}: Props) {
  const minimizeWindow = useWindows((state) => state.minimize);
  const toggleMaximize = useWindows((state) => state.toggleMax);
  const closeWindow = useWindows((state) => state.closeWindow);

  return (
    <header className="titlebar" onPointerDown={onPointerDown}>
      <span>{title}</span>
      <div className="window-actions">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            minimizeWindow(windowId);
          }}
          aria-label="Minimize"
        >
          <Minimize2 size={15} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleMaximize(windowId);
          }}
          aria-label={maximized ? "Restore" : "Maximize"}
        >
          {maximized ? <Square size={14} /> : <Maximize2 size={14} />}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            closeWindow(windowId);
          }}
          aria-label="Close"
        >
          <X size={15} />
        </button>
      </div>
    </header>
  );
}
