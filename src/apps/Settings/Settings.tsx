import {
  Image,
  Info,
  Maximize,
  PanelBottom,
  Palette,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import type { TaskbarPosition, Theme, Wallpaper } from "../../types";
import { useFS } from "../../stores/filesystemStore";
import { useNotifications } from "../../stores/notificationStore";
import { useSettings } from "../../stores/settingsStore";
import WallpaperPicker from "../../components/WallpaperPicker/WallpaperPicker";
import { natureWallpaperById, natureWallpapers } from "../../assets/natureWallpapers";

const themes: Theme[] = ["light", "dark", "purple", "blue", "midnight"];
const wallpapers: Wallpaper[] = ["default", "gradient", "aurora"];

export default function Settings(_props: { windowId?: string }) {
  const settings = useSettings();
  const [pickerOpen, setPickerOpen] = useState(false);
  const fsReset = useFS((state) => state.reset);
  const notify = useNotifications((state) => state.push);
  const selectedNature = natureWallpaperById[settings.wallpaper as keyof typeof natureWallpaperById];

  const update = (patch: {
    theme?: Theme;
    wallpaper?: Wallpaper;
    taskbar?: TaskbarPosition;
    transparency?: boolean;
  }) => {
    settings.set(patch);
    notify("Setting changed", "Your BrowserOS settings were updated.");
  };

  return (
    <div className="settings">
      <header className="settings-header">
        <h2>Settings</h2>
        <p>Manage your BrowserOS experience</p>
      </header>

      <section className="settings-card">
        <div className="settings-card-heading">
          <Palette />
          <div>
            <h3>Appearance</h3>
            <p>Choose how BrowserOS looks and feels.</p>
          </div>
        </div>
        <div className="settings-group">
          <div className="settings-label">
            <strong>Theme</strong>
            <span>Set the color theme for your workspace.</span>
          </div>
          <div className="choices settings-choice-row">
            {themes.map((theme) => (
              <button
                key={theme}
                className={settings.theme === theme ? "chosen" : ""}
                onClick={() => update({ theme })}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-group">
          <div className="settings-label">
            <strong>Wallpaper</strong>
            <span>Set the background shown on your desktop.</span>
          </div>
          <div
            className={`settings-wallpaper-preview-large ${settings.wallpaper === "custom" ? "custom" : ""}`}
            data-wallpaper={settings.wallpaper}
            style={selectedNature ? { backgroundImage: `url("${selectedNature.image}")` } : undefined}
          >
            {settings.wallpaper === "custom" && settings.customWallpaper && (
              <img src={settings.customWallpaper} alt="Current custom wallpaper" />
            )}
          </div>
          <div className="settings-subheading">Presets</div>
          <div className="choices settings-choice-row">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper}
                className={settings.wallpaper === wallpaper ? "chosen" : ""}
                onClick={() => update({ wallpaper })}
              >
                {wallpaper}
              </button>
            ))}
          </div>
          <div className="settings-subheading">Nature</div>
          <div className="nature-wallpaper-grid">
            {natureWallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                type="button"
                className={settings.wallpaper === wallpaper.id ? "chosen" : ""}
                style={{ backgroundImage: `url("${wallpaper.image}")` }}
                onClick={() => update({ wallpaper: wallpaper.id })}
                aria-label={`Use ${wallpaper.name} wallpaper`}
              >
                <span>{wallpaper.name}</span>
              </button>
            ))}
          </div>
          <div className="settings-custom-row">
            <div className="settings-label">
              <strong>{settings.wallpaper === "custom" ? "Custom wallpaper" : "Custom"}</strong>
              <span>{settings.wallpaper === "custom" ? "Your selected image is active." : "Use an image from this computer."}</span>
            </div>
            <button className="wallpaper-upload" onClick={() => setPickerOpen(true)}>
              {settings.wallpaper === "custom" ? "Change" : "Choose from computer"}
            </button>
          </div>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <PanelBottom />
          <div>
            <h3>Taskbar</h3>
            <p>Set the position and appearance of the taskbar.</p>
          </div>
        </div>
        <div className="settings-group settings-inline-group">
          <div className="settings-label">
            <strong>Position</strong>
            <span>Choose where the taskbar sits.</span>
          </div>
          <div className="choices settings-choice-row">
            {(["bottom", "top"] as const).map((position) => (
              <button
                key={position}
                className={settings.taskbar === position ? "chosen" : ""}
                onClick={() => update({ taskbar: position })}
              >
                {position}
              </button>
            ))}
          </div>
        </div>
        <div className="settings-group settings-inline-group">
          <div className="settings-label">
            <strong>Transparency</strong>
            <span>Let the desktop show through the taskbar.</span>
          </div>
          <div className="choices settings-choice-row">
            <button
              className={settings.transparency ? "chosen" : ""}
              onClick={() => update({ transparency: true })}
            >
              On
            </button>
            <button
              className={!settings.transparency ? "chosen" : ""}
              onClick={() => update({ transparency: false })}
            >
              Off
            </button>
          </div>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card-heading">
          <Info />
          <div>
            <h3>System</h3>
            <p>BrowserOS information and system actions.</p>
          </div>
        </div>
        <div className="settings-system-info">
          <strong>BrowserOS</strong>
          <span>A simulated desktop environment running entirely in your browser.</span>
        </div>
        <div className="settings-actions">
          <button onClick={() => document.documentElement.requestFullscreen?.()}>
            <Maximize size={15} /> Fullscreen
          </button>
          <button
            className="danger"
            onClick={async () => {
              if (confirm("Reset BrowserOS? Virtual files and settings will be restored to defaults.")) {
                await fsReset();
                settings.reset();
                notify("System reset", "BrowserOS has been restored to defaults.");
              }
            }}
          >
            <RotateCcw size={15} /> Reset BrowserOS
          </button>
        </div>
      </section>

      {pickerOpen && <WallpaperPicker close={() => setPickerOpen(false)} />}
    </div>
  );
}
