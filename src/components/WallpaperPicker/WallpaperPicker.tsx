import { useRef, useState } from "react";
import { Image, Upload, X } from "lucide-react";
import { useSettings } from "../../stores/settingsStore";
import type { Wallpaper } from "../../types";
import {
  natureWallpaperById,
  natureWallpapers,
} from "../../assets/natureWallpapers";
import CropWallpaperDialog from "./CropWallpaperDialog";

const builtInWallpapers: Wallpaper[] = ["default", "gradient", "aurora"];

type Props = {
  close?: () => void;
  embedded?: boolean;
};

export default function WallpaperPicker({ close, embedded = false }: Props) {
  const settings = useSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const selectedNature =
    natureWallpaperById[settings.wallpaper as keyof typeof natureWallpaperById];

  const chooseFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPendingImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const content = (
    <div
      className={`wallpaper-picker ${embedded ? "wallpaper-window-content" : ""}`}
      role="dialog"
      aria-modal={!embedded}
      aria-labelledby="wallpaper-picker-title"
    >
      <div className="popup-header">
        <h2 id="wallpaper-picker-title">
          <Image size={18} /> Wallpaper
        </h2>
        {!embedded && close && (
          <button
            type="button"
            onClick={close}
            aria-label="Close wallpaper picker"
          >
            <X size={17} />
          </button>
        )}
      </div>
      <div
        className={`wallpaper-preview ${settings.wallpaper === "custom" ? "custom" : ""}`}
        data-wallpaper={settings.wallpaper}
        style={
          selectedNature
            ? { backgroundImage: `url("${selectedNature.image}")` }
            : undefined
        }
      >
        {settings.wallpaper === "custom" && settings.customWallpaper && (
          <img src={settings.customWallpaper} alt="Current custom wallpaper" />
        )}
      </div>
      <div className="wallpaper-choices">
        {builtInWallpapers.map((wallpaper) => (
          <button
            key={wallpaper}
            type="button"
            className={settings.wallpaper === wallpaper ? "chosen" : ""}
            onClick={() => settings.set({ wallpaper })}
          >
            {wallpaper}
          </button>
        ))}
      </div>
      <div className="wallpaper-picker-label">Nature</div>
      <div className="nature-wallpaper-grid picker-nature-grid">
        {natureWallpapers.map((wallpaper) => (
          <button
            key={wallpaper.id}
            type="button"
            className={settings.wallpaper === wallpaper.id ? "chosen" : ""}
            style={{ backgroundImage: `url("${wallpaper.image}")` }}
            onClick={() => settings.set({ wallpaper: wallpaper.id })}
          >
            <span>{wallpaper.name}</span>
          </button>
        ))}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          chooseFile(event.target.files?.[0]);
          event.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        className="wallpaper-upload"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={15} /> Choose from computer
      </button>
    </div>
  );

  return (
    <>
      {embedded ? (
        content
      ) : (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close?.();
          }}
        >
          {content}
        </div>
      )}
      {pendingImage && (
        <CropWallpaperDialog
          source={pendingImage}
          onCancel={() => setPendingImage(null)}
          onApply={(dataUrl) => {
            settings.setCustomWallpaper(dataUrl);
            setPendingImage(null);
            close?.();
          }}
        />
      )}
    </>
  );
}
