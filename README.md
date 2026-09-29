# 🖥️ BrowserOS

> A browser-based simulated desktop operating system built with **React, TypeScript, Vite, Zustand, and Lucide React**.

---

## 🌐 Live Demo

### [🚀 Open BrowserOS](https://vhbuyio-frontenddevelopment-internship.onrender.com/)

---

## ✨ Features

- 🖥️ Desktop, Start Menu & Taskbar
- 🪟 Draggable, resizable & manageable windows
- 📁 Virtual File Explorer
- 🗑️ Recycle Bin with restore & permanent delete
- 💻 Simulated Terminal
- 📝 Text Editor with save, undo & redo
- 🧮 Calculator
- ⚙️ Settings & theme customization
- 🖼️ Custom wallpapers & wallpaper cropping
- 🔍 Application search
- 🔔 Notifications
- 💾 Persistent browser storage
- ⌨️ Keyboard shortcuts
- 📱 Responsive interface

---

## 🛠️ Tech Stack

Technology | Purpose:

React | UI & component architecture
TypeScript | Type safety
Vite | Development & production build
Zustand | State management
Lucide React | Icons
IndexedDB | Virtual filesystem persistence
localStorage | Settings persistence
CSS | UI & responsive styling

---

## 🏗️ Project Architecture

```text
                         ┌─────────────────────┐
                         │      BrowserOS       │
                         └──────────┬──────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
        ┌─────────────┐      ┌─────────────┐     ┌─────────────┐
        │ Components  │      │    Apps     │     │   Stores    │
        └──────┬──────┘      └──────┬──────┘     └──────┬──────┘
               │                    │                    │
        ┌──────┼──────┐      ┌──────┼──────┐      ┌─────┼─────┐
        ▼      ▼      ▼      ▼      ▼      ▼      ▼     ▼     ▼
     Desktop Taskbar Window  Files Terminal Settings Window Files
                             Explorer
               │                    │                    │
               └────────────────────┼────────────────────┘
                                    ▼
                           ┌─────────────────┐
                           │ Browser Storage │
                           ├─────────────────┤
                           │   IndexedDB     │
                           │  localStorage   │
                           └─────────────────┘


📂 Project Structure:

Browser-Based-OS/
│
├── public/
│   └── browseros.svg
│
├── src/
│   ├── apps/
│   │   ├── Calculator/
│   │   ├── FileExplorer/
│   │   ├── RecycleBin/
│   │   ├── Settings/
│   │   ├── Terminal/
│   │   ├── TextEditor/
│   │   └── Wallpaper/
│   │
│   ├── assets/
│   │   └── natureWallpapers.ts
│   │
│   ├── components/
│   │   ├── ContextMenu/
│   │   ├── CreateItemDialog/
│   │   ├── Desktop/
│   │   ├── Notifications/
│   │   ├── PropertiesDialog/
│   │   ├── StartMenu/
│   │   ├── Taskbar/
│   │   ├── WallpaperPicker/
│   │   └── Window/
│   │
│   ├── constants/
│   │   └── apps.ts
│   │
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts
│   │
│   ├── stores/
│   │   ├── filesystemStore.ts
│   │   ├── notificationStore.ts
│   │   ├── settingsStore.ts
│   │   └── windowStore.ts
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── filesystem.ts
│   │   ├── idb.ts
│   │   └── network.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
├── .gitignore
└── README.md


🔄 Data Flow:

Virtual Filesystem:

User Action
     ↓
React Component
     ↓
Zustand Store
     ↓
Virtual Filesystem
     ↓
IndexedDB
     ↓
Persistent Browser Data


Settings:

User Changes Setting
        ↓
Settings Store
        ↓
localStorage
        ↓
BrowserOS UI


Window Management:

Application
     ↓
Window Store
     ↓
Open / Focus / Minimize / Maximize / Close
     ↓
Shared Window Component


💾 Storage:

BrowserOS uses browser storage instead of the real computer filesystem.

┌───────────────────────┐
│    Browser Storage    │
├───────────────────────┤
│                       │
│ IndexedDB             │
│ ├─ Files              │
│ ├─ Folders            │
│ └─ Recycle Bin        │
│                       │
│ localStorage          │
│ ├─ Theme              │
│ ├─ Wallpaper          │
│ └─ Settings           │
│                       │
└───────────────────────┘

⌨️ Keyboard Shortcuts:

Shortcut	Action

Ctrl + S	Save document
Ctrl + Z	Undo
Ctrl + Y	Redo
Alt + Tab	Switch windows
Windows / Meta	Open Start Menu
Escape	Close Start Menu

⚙️ Installation:

git clone https://github.com/ManjeetPrabhakarRawat/vhbuyio-FrontendDevelopment-internship-ManjeetPrabhakarRawat-task2.git

cd vhbuyio-FrontendDevelopment-internship-ManjeetPrabhakarRawat-task2

npm install

Run Development Server:
npm run dev

Production Build:
npm run build

Preview Production Build:
npm run preview


🚀 Deployment:

BrowserOS is deployed as a Render Static Site.

GitHub
   ↓
Render
   ↓
npm install
   ↓
npm run build
   ↓
dist/
   ↓
🌐 Live BrowserOS

🚀 Live Demo

⚠️ Limitations:

BrowserOS is a browser simulation, not a real operating system.

Does not access the real filesystem
Terminal commands operate only on the virtual filesystem
Does not execute real OS commands
Windows-specific network detection requires a Windows Node/Vite environment
Browser security restrictions apply to certain system-level features


👨‍💻 Developer:

Manjeet Prabhakar Rawat
B.Tech Computer Science & Engineering

🔗 Links
🌐 Live Demo
💻 GitHub Repository

