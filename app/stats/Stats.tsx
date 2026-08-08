"use client";

import { useEffect, useState } from "react";
import type { PublicStatsResponse } from "../../lib/api-client";
import { getPublicStats } from "../../lib/api-client";
import { publicApiClient } from "../../lib/publicApiClient";
import Step from "../../components/Stats/step";

const defaultStats: PublicStatsResponse = {
  nodes: {
    connected: 0,
    rendering: 0,
  },
  jobs: {
    queued: 0,
    running: 0,
  },
};

type StatsProps = {
  initialStats?: PublicStatsResponse;
};

export default function Stats({ initialStats = defaultStats }: StatsProps) {
  const [stats, setStats] = useState<PublicStatsResponse>(initialStats);

  useEffect(() => {
    let stale = false;

    async function loadStats() {
      try {
        const { data } = await getPublicStats({
          client: publicApiClient,
          throwOnError: false,
        });
        if (!stale && data) {
          setStats(data);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Step
          Title="Connected render nodes"
          value={stats.nodes?.connected ?? 0}
        />
        <Step Title="Rendering nodes" value={stats.nodes?.rendering ?? 0} />
        <Step Title="Queued jobs" value={stats.jobs?.queued ?? 0} />
        <Step Title="Running jobs" value={stats.jobs?.running ?? 0} />
      </div>

      <div className="mb-10 rounded-xl bg-base-200 p-6 shadow">
        <h2 className="text-xl font-semibold mb-3">Service overview</h2>
        <p className="text-sm text-gray-600 leading-6">
          The live stats below are fetched from the public API endpoint and
          refreshed every 30 seconds.
        </p>
      </div>

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
