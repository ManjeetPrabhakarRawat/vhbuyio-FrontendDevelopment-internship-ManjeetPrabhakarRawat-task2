import {
  Folder,
  FileText,
  Terminal as TerminalIcon,
  Settings,
  Calculator,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

export const APP_ICONS = {
  "file-explorer": Folder,
  "text-editor": FileText,
  terminal: TerminalIcon,
  settings: Settings,
  calculator: Calculator,
  "recycle-bin": Trash2,
  wallpaper: ImageIcon,
} as const;
