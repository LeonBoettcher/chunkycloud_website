"use client";

import { useEffect, useState } from "react";
import Step from "../../components/Stats/step";

export default function Stats({ initialStats }) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    let stale = false;

    async function loadStats() {
      try {
        const res = await fetch("http://localhost:3213/api/stats");
        if (res.ok) {
          const json = await res.json();
          if (!stale) setStats(json);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Stats:", err);
      }
    }

    const interval = setInterval(loadStats, 30000);
    return () => {
      stale = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ChunkyCloud statistics</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <Step Title="Queue" value={stats.tasks.preparePending} />
        <Step
          Title={
            <>
              Generating octree
              {/*<div
                className="tooltip tooltip-right"
                data-tip="Explaining octree -> Platzhalter sollte rechts neben Text und viel Kleiner"
              >
                <button className="btn rounded">?</button>
              </div>*/}
            </>
          }
          value={stats.tasks.prepareRunning}
        />
        <Step Title="Queue" value={stats.tasks.pending} />
        <Step Title="Rendering" value={stats.tasks.running} />
        <Step
          Title="Merging"
          value={stats.tasks.mergePending + stats.tasks.mergeRunning}
        />
      </div>

      {/* Daily stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {Object.entries(stats.today).map(([label, value], i) => (
          <div
            key={i}
            className="text-center p-4 bg-base-200 rounded-xl shadow"
          >
            <p className="text-2xl font-bold">{value as number}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Node status */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Render nodes{" "}
          <span className="text-sm text-gray-500">(1 of 2 nodes working)</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">🖥️ Node1</h2>
              <p>8 threads</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md opacity-60">
            <div className="card-body">
              <h2 className="card-title">🖥️ Node2</h2>
              <p>4 threads</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Region processing nodes{" "}
          <span className="text-sm text-gray-500">(1 of 2 nodes working)</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">🧩 PrepareNode1</h2>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md opacity-60">
            <div className="card-body">
              <h2 className="card-title">🧩 PrepareNode2</h2>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="prose max-w-none bg-base-200 p-6 rounded-xl shadow">
        <h2>How ChunkyCloud works</h2>
        <p>
          A scene that is to be rendered is called a <strong>render job</strong>
          . Render jobs get split up into one or many <strong>tasks</strong>{" "}
          that are rendered on the <strong>render nodes</strong>. The number of
          tasks a job is split into depends on its resolution and samples per
          pixel.
        </p>
        <p>
          Instead of starting with an octree and an emittergrid, scenes can also
          be created from region files. ChunkyMap can use this so it doesn't
          need to construct the octree on a Minecraft server. New jobs that are
          created from region files are put in the{" "}
          <strong>region processing queue</strong> first and added to the{" "}
          <strong>render queue</strong> after a{" "}
          <strong>region processing node</strong> has created the scene files.
        </p>
        <p>
          When a task is done, it needs to be merged with the part of the job
          that is already done. This is done by a single{" "}
          <strong>dump processor</strong> that also has a queue of dumps waiting
          to be merged.
        </p>
        <p>
          If a job gets cancelled, it is not removed from the queues. The nodes
          will check if it is cancelled and just skip them in that case.
        </p>
      </div>
    </div>
  );
}
