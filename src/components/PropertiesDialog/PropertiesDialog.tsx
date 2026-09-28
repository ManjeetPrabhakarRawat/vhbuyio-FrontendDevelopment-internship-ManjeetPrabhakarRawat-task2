import type { LucideIcon } from "lucide-react";
import { FileText, X } from "lucide-react";

export type PropertiesData = {
  name: string;
  type: string;
  location: string;
  icon?: LucideIcon;
};

type Props = {
  item: PropertiesData;
  close: () => void;
};

export default function PropertiesDialog({ item, close }: Props) {
  const Icon = item.icon ?? FileText;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        className="properties-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="properties-title"
      >
        <div className="popup-header">
          <h2 id="properties-title">
            <Icon size={18} /> Properties
          </h2>
          <button type="button" onClick={close} aria-label="Close properties">
            <X size={17} />
          </button>
        </div>
        <dl className="properties-list">
          <div>
            <dt>Name</dt>
            <dd>{item.name}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{item.type}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{item.location || "/"}</dd>
          </div>
        </dl>
        <div className="dialog-actions">
          <button type="button" className="dialog-primary" onClick={close}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
