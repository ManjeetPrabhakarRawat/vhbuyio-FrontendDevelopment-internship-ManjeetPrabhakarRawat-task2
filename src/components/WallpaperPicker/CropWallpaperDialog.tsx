import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, X } from "lucide-react";

const OUTPUT_WIDTH = 1920;
const OUTPUT_HEIGHT = 1080;

type Point = { x: number; y: number };

type Props = {
  source: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

export default function CropWallpaperDialog({ source, onCancel, onApply }: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ pointer: Point; position: Point } | null>(null);

  const baseScale = naturalSize.width && naturalSize.height && frameSize.width && frameSize.height
    ? Math.max(frameSize.width / naturalSize.width, frameSize.height / naturalSize.height)
    : 1;
  const imageWidth = naturalSize.width * baseScale * zoom;
  const imageHeight = naturalSize.height * baseScale * zoom;

  const clampPosition = (next: Point): Point => ({
    x: Math.min(0, Math.max(frameSize.width - imageWidth, next.x)),
    y: Math.min(0, Math.max(frameSize.height - imageHeight, next.y)),
  });

  const clampForZoom = (next: Point, nextZoom: number): Point => {
    const nextWidth = naturalSize.width * baseScale * nextZoom;
    const nextHeight = naturalSize.height * baseScale * nextZoom;
    return {
      x: Math.min(0, Math.max(frameSize.width - nextWidth, next.x)),
      y: Math.min(0, Math.max(frameSize.height - nextHeight, next.y)),
    };
  };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const bounds = frame.getBoundingClientRect();
      setFrameSize({ width: bounds.width, height: bounds.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!naturalSize.width || !frameSize.width) return;
    const centered = {
      x: (frameSize.width - imageWidth) / 2,
      y: (frameSize.height - imageHeight) / 2,
    };
    setPosition(clampPosition(centered));
  }, [naturalSize, frameSize]);

  const reset = () => {
    setZoom(1);
    setPosition({
      x: (frameSize.width - naturalSize.width * baseScale) / 2,
      y: (frameSize.height - naturalSize.height * baseScale) / 2,
    });
  };

  const updateZoom = (nextZoom: number) => {
    const next = Math.min(3, Math.max(1, nextZoom));
    const ratio = next / zoom;
    const center = { x: frameSize.width / 2, y: frameSize.height / 2 };
    setZoom(next);
    setPosition(clampForZoom({
      x: center.x - (center.x - position.x) * ratio,
      y: center.y - (center.y - position.y) * ratio,
    }, next));
  };

  const apply = () => {
    const image = imageRef.current;
    if (!image || !naturalSize.width || !frameSize.width) return;
    const scale = baseScale * zoom;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) return;

    const sourceX = Math.max(0, -position.x / scale);
    const sourceY = Math.max(0, -position.y / scale);
    const sourceWidth = frameSize.width / scale;
    const sourceHeight = frameSize.height / scale;
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      OUTPUT_WIDTH,
      OUTPUT_HEIGHT,
    );
    onApply(canvas.toDataURL("image/jpeg", 0.88));
  };

  return (
    <div className="dialog-backdrop crop-backdrop" role="presentation">
      <div className="crop-dialog" role="dialog" aria-modal="true" aria-labelledby="crop-wallpaper-title">
        <div className="popup-header">
          <h2 id="crop-wallpaper-title">Crop Wallpaper</h2>
          <button type="button" onClick={onCancel} aria-label="Close crop editor">
            <X size={17} />
          </button>
        </div>
        <p className="crop-description">Position the image inside the desktop frame.</p>
        <div
          ref={frameRef}
          className="crop-frame"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragStart({
              pointer: { x: event.clientX, y: event.clientY },
              position,
            });
          }}
          onPointerMove={(event) => {
            if (!dragStart) return;
            setPosition(clampPosition({
              x: dragStart.position.x + event.clientX - dragStart.pointer.x,
              y: dragStart.position.y + event.clientY - dragStart.pointer.y,
            }));
          }}
          onPointerUp={() => setDragStart(null)}
          onPointerCancel={() => setDragStart(null)}
          onWheel={(event) => {
            event.preventDefault();
            updateZoom(zoom + (event.deltaY < 0 ? 0.1 : -0.1));
          }}
        >
          <img
            ref={imageRef}
            src={source}
            alt="Wallpaper crop preview"
            draggable={false}
            onLoad={(event) => setNaturalSize({
              width: event.currentTarget.naturalWidth,
              height: event.currentTarget.naturalHeight,
            })}
            style={{
              width: imageWidth,
              height: imageHeight,
              left: position.x,
              top: position.y,
            }}
          />
          <div className="crop-frame-line" aria-hidden="true" />
        </div>
        <div className="crop-controls">
          <button type="button" onClick={() => updateZoom(zoom - 0.1)} aria-label="Zoom out">
            <Minus size={15} />
          </button>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            aria-label="Zoom"
            onChange={(event) => updateZoom(Number(event.target.value))}
          />
          <button type="button" onClick={() => updateZoom(zoom + 0.1)} aria-label="Zoom in">
            <Plus size={15} />
          </button>
          <span>{Math.round(zoom * 100)}%</span>
        </div>
        <div className="crop-actions">
          <button type="button" onClick={reset}>
            <RotateCcw size={15} /> Reset
          </button>
          <div>
            <button type="button" onClick={onCancel}>Cancel</button>
            <button
              type="button"
              className="dialog-primary"
              onClick={apply}
              disabled={!naturalSize.width}
            >
              Apply Wallpaper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
