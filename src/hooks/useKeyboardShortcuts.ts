import { useEffect } from "react";
export function useKeyboardShortcuts(
  onStart: () => void,
  onClose: () => void,
) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (
        e.key === "Meta" &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        e.preventDefault();
        onStart();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onStart, onClose]);
}
