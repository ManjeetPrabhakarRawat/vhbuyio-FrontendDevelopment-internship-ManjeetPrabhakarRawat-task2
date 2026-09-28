import { FileText, Folder, RotateCcw, Trash2 } from "lucide-react";
import { useFS } from "../../stores/filesystemStore";
import { useNotifications } from "../../stores/notificationStore";
import { path } from "../../utils/filesystem";

export default function RecycleBin() {
  const files = useFS((state) => state.files);
  const restore = useFS((state) => state.restore);
  const deletePermanently = useFS((state) => state.deletePermanently);
  const emptyRecycleBin = useFS((state) => state.emptyRecycleBin);
  const notify = useNotifications((state) => state.push);
  const items = files.filter(
    (file) =>
      file.deletedAt !== undefined &&
      !files.some(
        (parent) =>
          parent.id === file.parentId && parent.deletedAt !== undefined,
      ),
  );

  return (
    <div className="recycle-bin">
      <header className="recycle-bin-header">
        <div>
          <h2>Recycle Bin</h2>
          <p>
            {items.length ? `${items.length} item(s)` : "Recycle Bin is empty."}
          </p>
        </div>
        <button
          type="button"
          disabled={!items.length}
          onClick={() => {
            emptyRecycleBin();
            notify(
              "Recycle Bin emptied",
              "Deleted items were permanently removed.",
            );
          }}
        >
          <Trash2 size={15} /> Empty Recycle Bin
        </button>
      </header>
      {items.length > 0 && (
        <div className="recycle-bin-list">
          {items.map((item) => {
            const restored = () => {
              if (restore(item.id)) {
                notify("Item restored", `${item.name} was restored.`);
              } else {
                notify(
                  "Unable to restore item",
                  "An item with the same name already exists in its original folder.",
                );
              }
            };
            return (
              <div className="recycle-bin-item" key={item.id}>
                <div className="recycle-bin-item-name">
                  {item.type === "folder" ? (
                    <Folder size={21} />
                  ) : (
                    <FileText size={21} />
                  )}
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      Original location: /
                      {path(files, item.id).slice(1, -1).join("/") || ""}
                    </small>
                  </div>
                </div>
                <div className="recycle-bin-item-actions">
                  <button type="button" onClick={restored}>
                    <RotateCcw size={14} /> Restore
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      if (!confirm(`Permanently delete ${item.name}?`)) return;
                      deletePermanently(item.id);
                      notify(
                        "Item deleted",
                        `${item.name} was permanently deleted.`,
                      );
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
