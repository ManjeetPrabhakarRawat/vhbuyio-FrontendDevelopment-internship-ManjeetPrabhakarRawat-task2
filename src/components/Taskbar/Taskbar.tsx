import {
  Search,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Power,
  Folder,
  Lock,
  MoonStar,
  RotateCcw,
  PowerOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../../stores/settingsStore";
import { useWindows } from "../../stores/windowStore";
import { APP_ICONS } from "../../constants/apps";
import {
  getConnectedNetworkName,
  subscribeToNetworkChanges,
  type NetworkState,
} from "../../utils/network";

export default function Taskbar({
  toggleStart,
  openSearch,
}: {
  toggleStart: () => void;
  openSearch: () => void;
}) {
  const windows = useWindows((s) => s.windows);
  const active = useWindows((s) => s.active);
  const focus = useWindows((s) => s.focus);
  const minimize = useWindows((s) => s.minimize);
  const openOrFocus = useWindows((s) => s.openOrFocus);
  const settings = useSettings();
  const taskbarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date());
  const [trayOpen, setTrayOpen] = useState<
    "volume" | "network" | "power" | null
  >(null);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [network, setNetwork] = useState<NetworkState>({
    name: null,
    connected: false,
    internet: false,
    error: true,
  });
  const [powerState, setPowerState] = useState<
    "normal" | "locked" | "sleeping" | "shuttingDown" | "off"
  >("normal");

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let mounted = true;
    const updateNetwork = async () => {
      const next = await getConnectedNetworkName();
      if (mounted) setNetwork(next);
    };
    const unsubscribe = subscribeToNetworkChanges(() => void updateNetwork());
    const poll = window.setInterval(() => void updateNetwork(), 10000);
    void updateNetwork();
    return () => {
      mounted = false;
      unsubscribe();
      window.clearInterval(poll);
    };
  }, []);

  useEffect(() => {
    if (trayOpen !== "network") return;
    void getConnectedNetworkName().then(setNetwork);
  }, [trayOpen]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTrayOpen(null);
      }
    };

    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    if (!trayOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !taskbarRef.current?.contains(target) &&
        !popupRef.current?.contains(target)
      ) {
        setTrayOpen(null);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [trayOpen]);

  const openApp = (app: string, title: string) => {
    const existing = windows.find((w) => w.app === app);
    if (existing) {
      if (existing.minimized) {
        focus(existing.id);
      } else {
        focus(existing.id);
      }
      return;
    }
    openOrFocus(app, title);
  };

  const handlePowerAction = (
    action: "lock" | "sleep" | "restart" | "shutdown",
  ) => {
    setTrayOpen(null);

    if (action === "lock") {
      setPowerState("locked");
      return;
    }

    if (action === "sleep") {
      setPowerState("sleeping");
      return;
    }

    if (action === "restart") {
      useWindows.getState().reset();
      window.location.reload();
      return;
    }

    if (action === "shutdown") {
      setPowerState("shuttingDown");
      window.setTimeout(() => setPowerState("off"), 1200);
    }
  };

  const renderPopup = () => {
    if (!trayOpen) return null;

    if (trayOpen === "volume") {
      return (
        <div className="task-popup volume-popup">
          <div className="popup-header">
            <strong>Volume</strong>
            <button type="button" onClick={() => setMuted((v) => !v)}>
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVolume(next);
              setMuted(next === 0);
            }}
          />
          <small>{muted ? "Muted" : `${volume}%`}</small>
        </div>
      );
    }

    if (trayOpen === "network") {
      return (
        <div className="task-popup network-popup">
          <div className="popup-header">
            <strong>Network</strong>
          </div>
          <div className="network-status">
            <Wifi size={16} />{" "}
            {network.error
              ? "Unable to detect"
              : network.connected
                ? network.name
                : "Not connected"}
          </div>
          <div className="network-status">
            Status:{" "}
            {network.error
              ? "Unknown"
              : !network.connected
                ? "Disconnected"
                : network.internet
                  ? "Connected"
                  : "No Internet"}
          </div>
        </div>
      );
    }

    return (
      <div className="task-popup power-popup">
        <button type="button" onClick={() => handlePowerAction("lock")}>
          <Lock size={14} /> Lock
        </button>
        <button type="button" onClick={() => handlePowerAction("sleep")}>
          <MoonStar size={14} /> Sleep
        </button>
        <button type="button" onClick={() => handlePowerAction("restart")}>
          <RotateCcw size={14} /> Restart BrowserOS
        </button>
        <button type="button" onClick={() => handlePowerAction("shutdown")}>
          <PowerOff size={14} /> Shut Down BrowserOS
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        ref={taskbarRef}
        className={`taskbar ${settings.taskbar} ${settings.transparency ? "transparent" : ""}`}
      >
        <button className="startbtn" onClick={toggleStart} aria-label="Start">
          <span className="windows-logo" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        </button>
        <button className="searchbtn" onClick={openSearch} aria-label="Search">
          <Search className="taskbar-system-icon search-icon" size={18} />
        </button>
        <div className="task-apps">
          {windows.map((w) => {
            const activeNow = active === w.id && !w.minimized;
            const Icon = APP_ICONS[w.app as keyof typeof APP_ICONS] ?? Folder;

            return (
              <button
                key={w.id}
                type="button"
                className={activeNow ? "active" : ""}
                title={w.title}
                aria-label={w.title}
                onClick={() => {
                  if (activeNow) {
                    minimize(w.id);
                    return;
                  }
                  if (w.minimized) {
                    focus(w.id);
                    return;
                  }
                  focus(w.id);
                }}
              >
                <Icon className="taskbar-app-icon" data-app={w.app} size={16} />
              </button>
            );
          })}
        </div>
        <div className="tray">
          <button
            type="button"
            className="tray-btn"
            aria-label="Volume"
            onClick={() =>
              setTrayOpen((v) => (v === "volume" ? null : "volume"))
            }
          >
            {muted || volume === 0 ? (
              <VolumeX className="taskbar-system-icon volume-icon" size={16} />
            ) : (
              <Volume2 className="taskbar-system-icon volume-icon" size={16} />
            )}
          </button>
          <button
            type="button"
            className="tray-btn"
            aria-label="Network"
            onClick={() =>
              setTrayOpen((v) => (v === "network" ? null : "network"))
            }
          >
            {network.connected ? (
              <Wifi className="taskbar-system-icon network-icon" size={16} />
            ) : (
              <WifiOff className="taskbar-system-icon network-icon" size={16} />
            )}
          </button>
          <button
            type="button"
            className="tray-btn power-btn"
            aria-label="Power"
            onClick={() => setTrayOpen((v) => (v === "power" ? null : "power"))}
          >
            <Power className="taskbar-system-icon power-icon" size={16} />
          </button>
          <span>
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
      <div ref={popupRef}>{renderPopup()}</div>
      {powerState === "locked" && (
        <div className="power-screen">
          <div className="power-card">
            <h2>BrowserOS Locked</h2>
            <button type="button" onClick={() => setPowerState("normal")}>
              Unlock
            </button>
          </div>
        </div>
      )}
      {powerState === "sleeping" && (
        <div className="power-screen">
          <div className="power-card">
            <h2>Sleeping</h2>
            <button type="button" onClick={() => setPowerState("normal")}>
              Wake up
            </button>
          </div>
        </div>
      )}
      {powerState === "shuttingDown" && (
        <div className="power-screen">
          <div className="power-card">
            <h2>BrowserOS is shutting down...</h2>
          </div>
        </div>
      )}
      {powerState === "off" && (
        <div className="power-screen">
          <div className="power-card">
            <h2>BrowserOS is powered off</h2>
            <button
              type="button"
              onClick={() => {
                useWindows.getState().reset();
                setPowerState("normal");
              }}
            >
              Start BrowserOS
            </button>
          </div>
        </div>
      )}
    </>
  );
}
