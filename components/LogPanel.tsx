"use client";

import { forwardRef, useImperativeHandle, useState } from "react";

interface LogEntry {
  id: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}

export interface LogPanelRef {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  addLog: (
    message: string,
    type?: "info" | "success" | "warning" | "error",
  ) => string;
  removeLog: (id: string) => void;
  clear: () => void;
}

const LogPanel = forwardRef<LogPanelRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
    toggle: () => setVisible((v) => !v),

    addLog: (message, type = "info") => {
      const id = crypto.randomUUID();

      setLogs((prev) => [
        ...prev,
        {
          id,
          message,
          type,
        },
      ]);

      return id;
    },

    removeLog: (id) => {
      setLogs((prev) => prev.filter((log) => log.id !== id));
    },

    clear: () => {
      setLogs([]);
    },
  }));

  if (!visible) return null;

  return (
    <div
      className="
        fixed
        bottom-4
        right-4
        w-[450px]
        max-h-[350px]
        overflow-y-auto
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950/95
        backdrop-blur
        shadow-2xl
        font-mono
        text-sm
        z-50
      "
    >
      {/* HEADER */}
      <div className="border-b border-zinc-800 p-3 text-zinc-400 flex items-center justify-between">
        <span>Log</span>

        <button
          onClick={() => setVisible(false)}
          className="text-zinc-500 hover:text-red-400 transition"
        >
          ✕
        </button>
      </div>

      {/* LOG CONTENT */}
      <div className="p-3 space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`
              animate-fadeIn
              flex
              items-center
              justify-between
              rounded-lg
              px-3
              py-2
              ${
                log.type === "success"
                  ? "text-green-400"
                  : log.type === "warning"
                    ? "text-yellow-400"
                    : log.type === "error"
                      ? "text-red-400"
                      : "text-blue-400"
              }
            `}
          >
            <span>
              [{new Date().toLocaleTimeString()}] {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

LogPanel.displayName = "LogPanel";

export default LogPanel;
