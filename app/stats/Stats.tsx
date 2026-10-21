"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicStatsResponse } from "../../lib/api-client";
import { getPublicStats } from "../../lib/api-client";
import { publicApiClient } from "../../lib/publicApiClient";
import Step from "../../components/Stats/step";

const MAX_HISTORY_POINTS = 300;

const seriesConfig = [
  { key: "connected", label: "Connected render nodes", color: "#60a5fa" },
  { key: "rendering", label: "Running render nodes", color: "#34d399" },
  { key: "jobs", label: "Jobs", color: "#fbbf24" },
  { key: "sps", label: "SPS", color: "#f472b6" },
] as const;

type HistoryPoint = {
  timestamp: number;
  connected: number | null;
  rendering: number | null;
  jobs: number | null;
  sps: number | null;
};

const defaultStats: PublicStatsResponse = {
  nodes: {
    connected: 0,
    rendering: 0,
  },
  jobs: {
    queued: 0,
    running: 0,
  },
  totalSamplesPerSeconds: 0,
};

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const getJobsValue = (stats: PublicStatsResponse): number | null => {
  const queued = stats.jobs?.queued;
  const running = stats.jobs?.running;

  if (queued == null && running == null) {
    return null;
  }

  return (queued ?? 0) + (running ?? 0);
};

const buildHistoryPoint = (stats: PublicStatsResponse): HistoryPoint | null => {
  const connected = stats.nodes?.connected ?? null;
  const rendering = stats.nodes?.rendering ?? null;
  const jobs = getJobsValue(stats);
  const sps = stats.totalSamplesPerSeconds ?? null;

  if (
    connected == null &&
    rendering == null &&
    jobs == null &&
    sps == null
  ) {
    return null;
  }

  return {
    timestamp: Date.now(),
    connected: typeof connected === "number" ? connected : null,
    rendering: typeof rendering === "number" ? rendering : null,
    jobs: typeof jobs === "number" ? jobs : null,
    sps: typeof sps === "number" ? sps : null,
  };
};

type StatsProps = {
  initialStats?: PublicStatsResponse;
};

export default function Stats({ initialStats = defaultStats }: StatsProps) {
  const [stats, setStats] = useState<PublicStatsResponse>(initialStats);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipX, setTooltipX] = useState<number | null>(null);
  const lastSampleTimeRef = useRef<number | null>(null);

  const appendHistoryPoint = (nextPoint: HistoryPoint) => {
    if (lastSampleTimeRef.current != null && nextPoint.timestamp <= lastSampleTimeRef.current) {
      return;
    }

    lastSampleTimeRef.current = nextPoint.timestamp;
    setHistory((current) => {
      if (current.length > 0 && current[current.length - 1].timestamp >= nextPoint.timestamp) {
        return current;
      }

      const next = [...current, nextPoint];
      return next.length > MAX_HISTORY_POINTS
        ? next.slice(next.length - MAX_HISTORY_POINTS)
        : next;
    });
  };

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

          const nextPoint = buildHistoryPoint(data);
          if (nextPoint) {
            appendHistoryPoint(nextPoint);
          }
        }
      } catch (err) {
        console.error("Fehler beim Laden der Stats:", err);
      }
    }

    const seedFromInitial = buildHistoryPoint(initialStats);
    if (seedFromInitial) {
      appendHistoryPoint(seedFromInitial);
    }

    loadStats();
    const interval = setInterval(loadStats, 30_000);
    return () => {
      stale = true;
      clearInterval(interval);
    };
  }, [initialStats]);

  const chartSeries = useMemo(() => {
    if (history.length === 0) {
      return [] as Array<{
        key: (typeof seriesConfig)[number]["key"];
        label: string;
        color: string;
        points: Array<{ x: number; y: number }>;
      }>;
    }

    const width = 640;
    const height = 260;
    const padding = { top: 16, right: 16, bottom: 26, left: 30 };

    return seriesConfig.map((series) => {
      const values = history
        .map((point) => point[series.key])
        .filter((value): value is number => value != null && value >= 0);

      if (values.length === 0) {
        return {
          ...series,
          points: [] as Array<{ x: number; y: number }>,
        };
      }

      const positiveValues = values.filter((value) => value > 0);
      const minValue = positiveValues.length > 0 ? Math.min(...positiveValues) : 1;
      const maxValue = positiveValues.length > 0 ? Math.max(...positiveValues) : 1;
      const lowerBound = 1;
      const effectiveMin = Math.min(lowerBound, minValue || 1);
      const effectiveMax = Math.max(25, maxValue || 25);

      const points = history.map((point, index) => {
        const rawValue = point[series.key];
        if (rawValue == null) {
          return null;
        }

        const x =
          padding.left +
          (history.length <= 1 ? 0 : (index / (history.length - 1)) * (width - padding.left - padding.right));

        const safeValue = Math.max(rawValue, 0);
        const normalizedValue =
          safeValue <= 0
            ? 0
            : ((Math.log10(safeValue + 1) - Math.log10(effectiveMin + 1)) /
                (Math.log10(effectiveMax + 1) - Math.log10(effectiveMin + 1) || 1));

        const y =
          height -
          padding.bottom -
          normalizedValue * (height - padding.top - padding.bottom);

        return { x, y };
      });

      return {
        ...series,
        points: points.filter((point): point is { x: number; y: number } => point != null),
      };
    });
  }, [history]);

  const pathMarkup = useMemo(() => {
    return chartSeries.map((series) => {
      const d = series.points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");

      return { ...series, d };
    });
  }, [chartSeries]);

  const hoveredPoint = hoverIndex != null ? history[hoverIndex] : null;
  const hoverMarkerX =
    hoveredPoint && hoverIndex != null && chartSeries.length > 0
      ? chartSeries[0].points[hoverIndex]?.x ?? null
      : null;

  const formatTimestamp = (value: number) =>
    new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-10 rounded-xl bg-base-200 p-6 shadow">
        <h1 className="text-xl font-semibold mb-3">Service overview</h1>
        <p className="text-sm text-gray-600 leading-6">
          These statistics show the current activity on ChunkyCloud and refresh
          every 30 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Step
          Title="Connected render nodes"
          value={stats.nodes?.connected ?? 0}
        />
        <Step Title="Rendering nodes" value={stats.nodes?.rendering ?? 0} />
        <Step
          Title="Total samples / second"
          value={(stats.totalSamplesPerSeconds ?? 0).toLocaleString()}
        />
        <Step Title="Queued jobs" value={stats.jobs?.queued ?? 0} />
        <Step Title="Running jobs" value={stats.jobs?.running ?? 0} />
      </div>

      <div className="mb-8 rounded-xl bg-base-200 p-4 sm:p-6 shadow">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Live render activity</h2>
            <p className="text-xs text-gray-500">
              Updated from the public stats API.
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-600 bg-base-100/40 text-sm text-gray-400">
            Waiting for the first stats samples…
          </div>
        ) : (
          <>
            <div className="relative overflow-visible rounded-xl border border-base-300/80 bg-base-100/50 p-2">
              <svg
                viewBox="0 0 640 260"
                preserveAspectRatio="none"
                className="h-64 w-full"
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  const relativeX = Math.min(
                    Math.max(event.clientX - rect.left, 0),
                    rect.width,
                  );
                  const ratio = rect.width === 0 ? 0 : relativeX / rect.width;

                  const nextIndex = Math.min(
                    history.length - 1,
                    Math.max(0, Math.round(ratio * (history.length - 1))),
                  );

                  setHoverIndex(nextIndex);
                  setTooltipX(Math.min(Math.max(relativeX, 0), rect.width));
                }}
                onMouseLeave={() => {
                  setHoverIndex(null);
                  setTooltipX(null);
                }}
              >
                <g>
                  {[0, 1, 2, 3, 4].map((step) => {
                    const y = 16 + (step * (260 - 42)) / 4;
                    return (
                      <line
                        key={step}
                        x1={30}
                        x2={624}
                        y1={y}
                        y2={y}
                        stroke="rgba(148,163,184,0.18)"
                        strokeDasharray="4 6"
                      />
                    );
                  })}
                </g>

                {pathMarkup.map((series) =>
                  series.points.length === 1 ? (
                    <circle
                      key={series.key}
                      cx={series.points[0].x}
                      cy={series.points[0].y}
                      r={3.5}
                      fill={series.color}
                    />
                  ) : (
                    <path
                      key={series.key}
                      d={series.d}
                      fill="none"
                      stroke={series.color}
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ),
                )}

                {hoverMarkerX != null && (
                  <line
                    x1={hoverMarkerX}
                    x2={hoverMarkerX}
                    y1={16}
                    y2={234}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="4 6"
                  />
                )}
              </svg>

              {hoveredPoint && hoverIndex != null && tooltipX != null && (
                <div
                  className="pointer-events-none absolute top-3 z-10 -translate-x-1/2 rounded-lg border border-base-300/80 bg-slate-950/95 px-3 py-2 text-[11px] shadow-lg"
                  style={{
                    left: `${tooltipX}px`,
                  }}
                >
                  <div className="font-medium text-white">{formatTimestamp(hoveredPoint.timestamp)}</div>
                  <div className="mt-1 space-y-0.5 text-slate-200">
                    {seriesConfig.map((series) => {
                      const value = hoveredPoint[series.key];
                      return value == null ? null : (
                        <div key={series.key} className="flex items-center gap-2">
                          <span
                            className="inline-block h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: series.color }}
                          />
                          <span>{series.label}:</span>
                          <span className="font-medium text-white">
                            {formatNumber(Number(value))}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {seriesConfig.map((series) => (
                <div key={series.key} className="flex items-center gap-2 text-xs text-gray-300">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  <span>{series.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
              <span>Value</span>
              <span>
                {history.length > 1
                  ? `${formatTimestamp(history[0].timestamp)} → ${formatTimestamp(history[history.length - 1].timestamp)}`
                  : formatTimestamp(history[0].timestamp)}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="prose max-w-none bg-base-200 p-6 rounded-xl shadow">
        <h2>How ChunkyCloud works</h2>
        <p>
          Each scene submitted for rendering becomes a{" "}
          <strong>render job</strong>. Each job is split into{" "}
          <strong>tasks</strong>, which are distributed across{" "}
          <strong>render nodes</strong>. The number of tasks depends on the
          image resolution and the target number of samples per pixel.
        </p>
        <p>
          Once all tasks of a job are complete, a worker node merges the results
          into a final image and, if enabled for the job, a render dump. A
          single worker node currently handles this process.
        </p>
        <p>
          When a job is cancelled, it is removed from the queue. Render nodes
          stop processing its tasks shortly afterwards.
        </p>
      </div>
    </div>
  );
}
