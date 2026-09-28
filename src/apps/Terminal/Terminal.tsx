import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useFS } from "../../stores/filesystemStore";
import { children, path, ROOT } from "../../utils/filesystem";

type TerminalEntry = {
  command: string;
  output: string[];
  path: string;
};

const tokenize = (value: string) => {
  const out: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;

  for (const char of value) {
    if (quote) {
      if (char === quote) quote = null;
      else current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        out.push(current);
        current = "";
      }
      continue;
    }
    current += char;
  }

  if (current) out.push(current);
  return out;
};

export default function TerminalApp(_props: { windowId?: string }) {
  const files = useFS((state) => state.files);
  const addFolder = useFS((state) => state.addFolder);
  const addFile = useFS((state) => state.addFile);
  const remove = useFS((state) => state.remove);
  const [cwd, setCwd] = useState(ROOT);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const currentPath = (id: string) => {
    const segments = path(files, id).slice(1);
    return ["C:\\BrowserOS", ...segments].join("\\");
  };

  const promptPath = currentPath(cwd);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useLayoutEffect(() => {
    const output = outputRef.current;
    if (!output) return;
    const atBottom =
      output.scrollHeight - output.scrollTop - output.clientHeight < 24;
    if (shouldAutoScrollRef.current || atBottom)
      output.scrollTop = output.scrollHeight;
  }, [entries, cwd]);

  useEffect(() => {
    const output = outputRef.current;
    if (!output) return;
    const onScroll = () => {
      shouldAutoScrollRef.current =
        output.scrollHeight - output.scrollTop - output.clientHeight < 24;
    };
    output.addEventListener("scroll", onScroll);
    return () => output.removeEventListener("scroll", onScroll);
  }, []);

  const resolve = (name: string) => {
    if (!name || name === "/") return ROOT;
    const parts = name.split(/[\\/]/).filter(Boolean);
    let current = name.startsWith("/") || name.startsWith("\\") ? ROOT : cwd;

    for (const part of parts) {
      if (part === ".") continue;
      if (part === "..") {
        current = files.find((file) => file.id === current)?.parentId || ROOT;
        continue;
      }
      const found = children(files, current).find(
        (file) => file.name.toLowerCase() === part.toLowerCase(),
      );
      if (!found) return null;
      current = found.id;
    }
    return current;
  };

  const execute = (raw: string) => {
    const command = raw.trim();
    if (!command) return;

    const parts = tokenize(command);
    const cmd = parts[0]?.toLowerCase() ?? "";
    const args = parts.slice(1);
    const entryPath = promptPath;
    let output: string[] = [];
    let clearScreen = false;

    shouldAutoScrollRef.current = true;

    switch (cmd) {
      case "help":
        output = [
          "Available commands: help, dir, ls, cd, pwd, mkdir, touch, cat, type, echo, rm, del, clear, cls, date, time",
        ];
        break;
      case "pwd": {
        const segments = path(files, cwd).slice(1);
        output = [segments.length ? `/${segments.join("/")}` : "/"];
        break;
      }
      case "dir":
      case "ls": {
        const items = children(files, cwd);
        output = items.length ? items.map((file) => file.name) : ["(empty)"];
        break;
      }
      case "cd": {
        const target = args[0] ?? "/";
        const id = resolve(target);
        const node = id ? files.find((file) => file.id === id) : null;
        if (!id || !node || node.type !== "folder") {
          output = [`cd: no such file or directory: ${target}`];
        } else {
          setCwd(id);
        }
        break;
      }
      case "mkdir":
        if (!args[0]) output = ["mkdir: missing operand"];
        else if (!addFolder(args.join(" "), cwd))
          output = ["mkdir: unable to create directory"];
        break;
      case "touch":
        if (!args[0]) output = ["touch: missing file name"];
        else if (!addFile(args.join(" "), cwd, ""))
          output = ["touch: unable to create file"];
        break;
      case "cat":
      case "type": {
        const target = args[0] ?? "";
        const id = resolve(target);
        const file = id ? files.find((item) => item.id === id) : null;
        if (!file || file.type !== "file")
          output = [`${cmd}: no such file: ${target}`];
        else output = (file.content || "").split("\n");
        break;
      }
      case "echo":
        output = [args.join(" ")];
        break;
      case "rm":
      case "del": {
        const target = args[0] ?? "";
        const id = resolve(target);
        if (!id || id === ROOT || !target)
          output = [`${cmd}: cannot remove: ${target}`];
        else remove(id);
        break;
      }
      case "date":
        output = [new Date().toDateString()];
        break;
      case "time":
        output = [new Date().toLocaleTimeString()];
        break;
      case "clear":
      case "cls":
        clearScreen = true;
        break;
      default:
        output = [`${cmd}: command not found`];
    }

    setCommandHistory((previous) => [...previous, command]);
    setHistoryIndex(-1);
    setInput("");
    if (clearScreen) setEntries([]);
    else
      setEntries((previous) => [
        ...previous,
        { command, output, path: entryPath },
      ]);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const moveHistory = (direction: "up" | "down") => {
    if (!commandHistory.length) return;
    if (direction === "up") {
      const next =
        historyIndex < 0
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(commandHistory[next] ?? "");
      return;
    }

    const next =
      historyIndex < 0 || historyIndex >= commandHistory.length - 1
        ? -1
        : historyIndex + 1;
    setHistoryIndex(next);
    setInput(next < 0 ? "" : (commandHistory[next] ?? ""));
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      <div ref={outputRef} className="terminal-output">
        <div className="terminal-document">
          <pre>BrowserOS Terminal</pre>
          <pre>{'Type "help" for available commands.'}</pre>
          {entries.map((entry, index) => (
            <div
              className="terminal-entry"
              key={`${entry.path}-${entry.command}-${index}`}
            >
              <div className="terminal-command">
                <span>{entry.path}&gt; </span>
                <span>{entry.command}</span>
              </div>
              {entry.output.map((line, lineIndex) => (
                <pre key={`${lineIndex}-${line}`}>{line}</pre>
              ))}
            </div>
          ))}
          <form
            className="terminal-command terminal-current"
            onSubmit={(event) => {
              event.preventDefault();
              execute(input);
            }}
          >
            <span>{promptPath}&gt; </span>
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveHistory("up");
                } else if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveHistory("down");
                }
              }}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
