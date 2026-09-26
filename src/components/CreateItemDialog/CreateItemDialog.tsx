import { useEffect, useRef, useState } from "react";
import { isValidName } from "../../utils/filesystem";

type Props = {
  type: "folder" | "file";
  open: boolean;
  onCancel: () => void;
  onCreate: (name: string) => string | void;
};

export default function CreateItemDialog({ type, open, onCancel, onCreate }: Props) {
  const [name, setName] = useState(type === "folder" ? "New Folder" : "New Text File.txt");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setName(type === "folder" ? "New Folder" : "New Text File.txt");
    setError("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, type]);

  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(`${type === "folder" ? "Folder" : "File"} name cannot be empty.`);
      return;
    }
    if (!isValidName(trimmed)) {
      setError("Names cannot contain / \\ : * ? \" < > or |.");
      return;
    }
    const result = onCreate(trimmed);
    if (result) setError(result);
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onCancel();
    }}>
      <form
        className="create-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-dialog-title"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
      >
        <h2 id="create-dialog-title">
          Create New {type === "folder" ? "Folder" : "Text File"}
        </h2>
        <label htmlFor="create-item-name">
          {type === "folder" ? "Folder" : "File"} name
        </label>
        <input
          ref={inputRef}
          id="create-item-name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "create-item-error" : undefined}
        />
        {error && <p id="create-item-error" className="dialog-error">{error}</p>}
        <div className="dialog-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" className="dialog-primary">Create</button>
        </div>
      </form>
    </div>
  );
}
