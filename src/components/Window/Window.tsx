import {
  useEffect,
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useWindows } from "../../stores/windowStore";
import { useSettings } from "../../stores/settingsStore";
import WindowTitleBar from "./WindowTitleBar";

type Props = { id: string; children: ReactNode };
export default function Window({ id, children }: Props) {
  const w = useWindows((s) => s.windows.find((x) => x.id === id));
  const isActive = useWindows((s) => s.active === id);
  const focus = useWindows((s) => s.focus);
  const update = useWindows((s) => s.update);
  const pos = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    px: number;
    py: number;
    mode: "drag" | "resize";
  } | null>(null);
  const settings = useSettings();
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = pos.current;
      if (!p || !w || w.maximized) return;
      if (p.mode === "drag")
        update(id, {
          x: Math.max(0, p.x + e.clientX - p.px),
          y: Math.max(
            settings.taskbar === "top" ? 58 : 0,
            p.y + e.clientY - p.py,
          ),
        });
      else
        update(id, {
          width: Math.max(320, p.w + e.clientX - p.px),
          height: Math.max(220, p.h + e.clientY - p.py),
        });
    };
    const up = () => {
      pos.current = null;
      document.body.style.userSelect = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [id, w, update, settings.taskbar]);
  if (!w || w.minimized) return null;
  const startDrag = (e: ReactPointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    focus(id);
    pos.current = {
      x: w.x,
      y: w.y,
      w: w.width,
      h: w.height,
      px: e.clientX,
      py: e.clientY,
      mode: "drag",
    };
    document.body.style.userSelect = "none";
  };
  const startResize = (e: ReactPointerEvent) => {
    e.stopPropagation();
    focus(id);
    pos.current = {
      x: w.x,
      y: w.y,
      w: w.width,
      h: w.height,
      px: e.clientX,
      py: e.clientY,
      mode: "resize",
    };
    document.body.style.userSelect = "none";
  };
  const style = w.maximized
    ? {
        zIndex: w.zIndex,
        top: settings.taskbar === "top" ? 58 : 0,
        bottom: settings.taskbar === "top" ? 0 : 58,
      }
    : {
        left: w.x,
        top: w.y,
        width: w.width,
        height: w.height,
        zIndex: w.zIndex,
      };
  return (
    <section
      className={`window ${w.maximized ? "maximized" : ""} ${isActive ? "active" : "inactive"}`}
      style={style}
      onPointerDown={(event) => {
        event.stopPropagation();
        focus(id);
      }}
      aria-label={w.title}
    >
      <WindowTitleBar
        windowId={id}
        title={w.title}
        maximized={w.maximized}
        onPointerDown={startDrag}
      />
      <div className="window-body">{children}</div>
      {!w.maximized && (
        <div className="resize se" onPointerDown={startResize} />
      )}
    </section>
  );
}
