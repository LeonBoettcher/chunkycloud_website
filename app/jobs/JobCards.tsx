import React from "react";
import Link from "next/link";
import { Job } from "../../lib/types";

const JobCards = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  let jobs: [string, Job][] = [];
  let errorMsg = "";

  try {
    const res = await fetch(`${baseUrl}/api/jobs`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Backend returned status ${res.status}`);
    }

    const data = await res.json();
    jobs = Object.entries(data);
  } catch (error) {
    errorMsg = error instanceof Error ? error.message : String(error);
  }

  // Helper: Glow-Farbe pro Status
  const getGlowColor = (status: string | null | undefined): string => {
    if (!status) return "rgba(59,130,246,0.12)"; // default blue
    const s = String(status).toLowerCase();
    if (s.includes("queue")) return "rgba(250,204,21,0.14)"; // yellow
    if (s.includes("render") || s.includes("running"))
      return "rgba(16,185,129,0.14)"; // green
    if (s.includes("error") || s.includes("failed") || s.includes("cancel"))
      return "rgba(239,68,68,0.16)"; // red
    if (s.includes("octree") || s.includes("generating"))
      return "rgba(168,85,247,0.14)"; // purple
    return "rgba(59,130,246,0.12)"; // default blue
  };

  if (errorMsg) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <h3 className="font-bold">Failed to load jobs</h3>
          <p className="text-sm">{errorMsg}</p>
          <p className="text-xs mt-1">Backend URL: {baseUrl}</p>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="alert alert-info shadow-lg">
        <div>
          <h3 className="font-bold">No jobs found</h3>
          <p className="text-sm">No job data available</p>
        </div>
      </div>
    );
  }

  function getStatusTag(id: string, job: Job) {
    if (!job.status)
      return <div className="badge badge-outline badge-info">Unknown</div>;
    if (job.status.toLowerCase().includes("queue"))
      return <div className="badge badge-outline badge-warning">Queued</div>;
    if (
      job.status.toLowerCase().includes("render") ||
      job.status.toLowerCase().includes("running")
    )
      return (
        <div className="badge badge-outline badge-success">{job.status}</div>
      );
    if (
      job.status.toLowerCase().includes("error") ||
      job.status.toLowerCase().includes("failed")
    )
      return (
        <div className="badge badge-outline badge-error">{job.status}</div>
      );
    if (job.status.toLowerCase().includes("cancel"))
      return <div className="badge badge-neutral badge-outline"></div>;
    if (
      job.status.toLowerCase().includes("octree") ||
      job.status.toLowerCase().includes("generating")
    )
      return (
        <div className="badge badge-outline badge-primary">{job.status}</div>
      );
  }

  return (
    <>
      {/* Inline CSS für Job-Card Glow-Effekt */}
      <style>{`
        .job-card {
          transition: box-shadow 200ms ease;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
          border-radius: 0.5rem;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .job-card:hover {
          box-shadow: 0 0 30px var(--job-card-glow, rgba(59,130,246,0.12));
        }
        .job-card .card-body img {
          display: block;
          max-width: 100%;
          height: auto;
        }
      `}</style>

      {jobs.map(([id, job]: [string, Job]) => (
        <Link key={id} href={`/jobs/${id}`} className="block mb-4">
          <div
            className="card flex w-full bg-gray-800 text-white shadow-lg job-card cursor-pointer"
            style={
              {
                ["--job-card-glow" as any]: getGlowColor(job.status),
              } as React.CSSProperties
            }
          >
            <div className="card-body p-4 space-y-3">
              <h2 className="card-title text-lg">{id}</h2>
              <div className="aspect-video overflow-hidden rounded-md">
                <img
                  src="/images/blueprint.png"
                  alt="Job Thumbnail"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>SPP:</span>
                  <span>
                    {job.spp} / {job.targetSpp}
                  </span>
                </div>

                <progress
                  className="progress progress-primary w-full"
                  value={job.spp}
                  max={job.targetSpp}
                ></progress>
              </div>

              <div>{getStatusTag(id, job)}</div>

              <div className="text=[8px] text-gray-500 space-y-1">
                <p>
                  Created:{" "}
                  {job.created ? new Date(job.created).toLocaleString() : "n/a"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default JobCards;

