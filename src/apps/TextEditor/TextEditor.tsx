import { useEffect, useState } from "react";
import { Save, FilePlus, Undo2, Redo2, FolderOpen } from "lucide-react";
import { useFS } from "../../stores/filesystemStore";
import { useWindows } from "../../stores/windowStore";
import { useNotifications } from "../../stores/notificationStore";
export default function TextEditor({ windowId }: { windowId?: string }) {
  const files = useFS((s) => s.files),
    write = useFS((s) => s.write),
    addFile = useFS((s) => s.addFile);
  const w = useWindows((s) => s.windows.find((x) => x.id === windowId));
  const active = useWindows((s) => s.active);
  const updateWindow = useWindows((s) => s.update);
  const open = useWindows((s) => s.openOrFocus);
  const notify = useNotifications((s) => s.push);
  const fileId = typeof w?.data?.fileId === "string" ? w.data.fileId : null;
  const file = files.find((f) => f.id === fileId && f.type === "file");
  const [text, setText] = useState(file?.content || "");
  const [name, setName] = useState(file?.name || "Untitled.txt");
  const [saved, setSaved] = useState(true);
  const [history, setHistory] = useState<string[]>([file?.content || ""]);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setText(file?.content || "");
    setName(file?.name || "Untitled.txt");
    setSaved(true);
    setHistory([file?.content || ""]);
    setIdx(0);
  }, [file?.id]);
  const update = (v: string) => {
    setText(v);
    setSaved(false);
    const h = history.slice(0, idx + 1);
    h.push(v);
    setHistory(h.slice(-50));
    setIdx(Math.min(h.length - 1, 49));
  };
  const save = () => {
    if (file) {
      write(file.id, text);
      setSaved(true);
      notify("File saved", name);
      return;
    }
    if (!windowId) return;
    const id = addFile(name, "root", text);
    if (id) {
      updateWindow(windowId, { data: { fileId: id } });
      setSaved(true);
      notify("File saved", name);
    } else {
      notify("Unable to save file", "A file with that name already exists.");
    }
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (active !== windowId) return;
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
      if (e.ctrlKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (idx > 0) {
          const i = idx - 1;
          setIdx(i);
          setText(history[i]);
          setSaved(false);
        }
      }
      if (e.ctrlKey && e.key.toLowerCase() === "y") {
        e.preventDefault();
        if (idx < history.length - 1) {
          const i = idx + 1;
          setIdx(i);
          setText(history[i]);
          setSaved(false);
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [active, idx, history, text, file, windowId]);
  const newDoc = () => {
    const n = prompt("File name?", "untitled.txt");
    if (n) {
      if (!windowId) return;
      const id = addFile(n, "root", "");
      if (id) {
        updateWindow(windowId, { data: { fileId: id } });
        setName(n);
        setText("");
        setSaved(true);
        notify("New file created", n);
      } else {
        notify(
          "Unable to create file",
          "A file with that name already exists.",
        );
      }
    }
  };
  return (
    <div className="editor">
      <div className="editorbar">
        <button onClick={save} disabled={saved}>
          <Save size={15} /> Save
        </button>
        <button onClick={newDoc}>
          <FilePlus size={15} /> New
        </button>
        <button onClick={() => open("file-explorer", "File Explorer")}>
          <FolderOpen size={15} /> Open
        </button>
        <button
          onClick={() => {
            if (idx > 0) {
              const i = idx - 1;
              setIdx(i);
              setText(history[i]);
              setSaved(false);
            }
          }}
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={() => {
            if (idx < history.length - 1) {
              const i = idx + 1;
              setIdx(i);
              setText(history[i]);
              setSaved(false);
            }
          }}
        >
          <Redo2 size={15} />
        </button>
        <span>
          {name} · {saved ? "Saved" : "Unsaved changes"}
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => update(e.target.value)}
        spellCheck={false}
        aria-label="Text editor"
      />
    </div>
  );
}
