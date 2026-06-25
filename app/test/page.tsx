"use client";

import { useRef } from "react";
import LogPanel, { LogPanelRef } from "../../components/LogPanel";

export default function Page() {
  const logRef = useRef<LogPanelRef>(null);

  const addTestLog = () => {
    logRef.current?.addLog("Verbindung hergestellt", "info");
  };

  return (
    <>
      <div className="flex gap-2 p-10">
        <button onClick={() => logRef.current?.show()} className="btn">
          Anzeigen
        </button>

        <button onClick={() => logRef.current?.hide()} className="btn">
          Verstecken
        </button>

        <button onClick={addTestLog} className="btn">
          Log hinzufügen
        </button>

        <button onClick={() => logRef.current?.clear()} className="btn">
          Leeren
        </button>
      </div>

      <LogPanel ref={logRef} />
    </>
  );
}
