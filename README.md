# BrowserOS

A browser-only simulated desktop operating system built with React, TypeScript, Vite, Zustand and Lucide React.

## Features
- Desktop, wallpaper, shortcuts, Start Menu and taskbar
- Draggable, resizable, focusable, minimizable and maximizable windows
- Virtual filesystem persisted in IndexedDB
- File Explorer with folders/files, create, rename, delete, navigation and context menus
- Text editor with save, undo/redo and Ctrl+S
- Simulated terminal: `help`, `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cat`, `clear`, `echo`, `rm`, `date`
- Settings: themes, wallpapers, taskbar position/transparency, fullscreen and reset
- Calculator without `eval`
- Notifications, search and keyboard shortcuts
- Responsive layout for smaller screens

## Setup
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

The Windows network status endpoint is served by the Vite Node host at
`/api/network` during development and preview. Deploy the preview/server on
the Windows machine whose Wi-Fi status should be reported; a static-only host
cannot execute `netsh` and will return a disconnected fallback.

## Persistence
Settings use localStorage. Virtual files are stored in IndexedDB. The browser's real filesystem and OS shell are never accessed.

## Shortcuts
- Ctrl+S: save active editor
- Ctrl+Z / Ctrl+Y: undo / redo in editor
- Alt+Tab: cycle open windows
- Meta/Windows key: toggle Start Menu
- Escape: close Start Menu

## Architecture
`src/components` contains desktop shell UI; `src/apps` contains simulated applications; `src/stores` contains Zustand state; `src/utils` contains filesystem/IndexedDB helpers.

## Limitations
This is a browser simulation, not a real operating system. Terminal commands only operate on the virtual filesystem. Browser security rules also limit fullscreen and keyboard behavior.
