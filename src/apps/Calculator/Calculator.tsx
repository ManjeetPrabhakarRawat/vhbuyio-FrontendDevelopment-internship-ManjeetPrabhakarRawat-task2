import { useState } from "react";
function calculate(s: string) {
  const raw = s.trim();
  if (!raw) throw new Error("Invalid expression");
  const tokens: string[] = [];
  const allowed = /[0-9.()+\-*/\s]/;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (!allowed.test(ch)) throw new Error("Invalid expression");
    if (/\s/.test(ch)) continue;
    if (/[0-9.]/.test(ch)) {
      let num = ch;
      while (i + 1 < raw.length && /[0-9.]/.test(raw[i + 1])) {
        i++;
        num += raw[i];
      }
      if ((num.match(/\./g) ?? []).length > 1)
        throw new Error("Invalid expression");
      tokens.push(num);
      continue;
    }
    const prev = tokens[tokens.length - 1];
    const isUnary =
      ch === "+" || ch === "-"
        ? !prev || prev === "(" || ["+", "-", "*", "/"].includes(prev)
        : false;
    if (isUnary) {
      tokens.push(ch === "+" ? "u+" : "u-");
      continue;
    }
    tokens.push(ch);
  }
  const output: string[] = [];
  const ops: string[] = [];
  const precedence: Record<string, number> = {
    "u+": 4,
    "u-": 4,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
  };
  const apply = (op: string) => {
    if (op === "u+" || op === "u-") {
      const value = Number(output.pop());
      if (Number.isNaN(value)) throw new Error("Invalid expression");
      output.push(String(op === "u-" ? -value : value));
      return;
    }
    const b = Number(output.pop());
    const a = Number(output.pop());
    if (op === "/" && b === 0) throw new Error("Cannot divide by zero");
    if (Number.isNaN(a) || Number.isNaN(b))
      throw new Error("Invalid expression");
    const value =
      op === "+" ? a + b : op === "-" ? a - b : op === "*" ? a * b : a / b;
    output.push(String(value));
  };
  for (const token of tokens) {
    if (/^\d+(?:\.\d+)?$|^\.\d+$/.test(token)) {
      output.push(token);
      continue;
    }
    if (token === "(") ops.push(token);
    else if (token === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        const op = ops.pop()!;
        apply(op);
      }
      if (ops.pop() !== "(") throw new Error("Invalid expression");
    } else if (token === "u+" || token === "u-") {
      while (
        ops.length &&
        ops[ops.length - 1] !== "(" &&
        precedence[ops[ops.length - 1]] >= precedence[token]
      ) {
        const op = ops.pop()!;
        apply(op);
      }
      ops.push(token);
    } else {
      while (
        ops.length &&
        ops[ops.length - 1] !== "(" &&
        precedence[ops[ops.length - 1]] >= precedence[token]
      ) {
        const op = ops.pop()!;
        apply(op);
      }
      ops.push(token);
    }
  }
  while (ops.length) {
    const op = ops.pop()!;
    if (op === "(") throw new Error("Invalid expression");
    apply(op);
  }
  const result = Number(output[0]);
  if (!Number.isFinite(result)) throw new Error("Invalid expression");
  return String(result);
}
export default function Calculator(_props: { windowId?: string }) {
  const [v, setV] = useState("");
  const keys = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "(",
    ")",
    "C",
    "⌫",
    "=",
    "+",
  ];
  return (
    <div className="calc">
      <div className="display">{v || "0"}</div>
      <div className="keys">
        {keys.map((k) => (
          <button
            key={k}
            className={["/", "*", "-", "+", "="].includes(k) ? "op" : ""}
            onClick={() => {
              if (k === "C") setV("");
              else if (k === "⌫") setV((x) => x.slice(0, -1));
              else if (k === "=") {
                try {
                  setV(calculate(v));
                } catch (e) {
                  setV("Error");
                }
              } else setV((x) => x + k);
            }}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
