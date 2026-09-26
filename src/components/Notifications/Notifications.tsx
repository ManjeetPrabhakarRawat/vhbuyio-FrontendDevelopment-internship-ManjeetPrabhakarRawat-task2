import { X, Bell } from "lucide-react";
import { useNotifications } from "../../stores/notificationStore";
export default function Notifications() {
  const items = useNotifications((s) => s.items);
  const remove = useNotifications((s) => s.remove);
  return (
    <div className="notifications" aria-live="polite">
      {items.map((n) => (
        <div className="toast" key={n.id}>
          <Bell size={18} />
          <div>
            <b>{n.title}</b>
            <p>{n.message}</p>
          </div>
          <button onClick={() => remove(n.id)} aria-label="Dismiss">
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
