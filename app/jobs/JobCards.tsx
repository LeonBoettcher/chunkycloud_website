"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "../../app/auth/components/SessionProvider";
import { getCurrentUserJobs } from "../../lib/api-client";
import type { UserJob } from "../../lib/api-client";

import LoadingCards from "./LoadingCards";
import getStatusTag from "../../components/Job/getStatusTag";

const JobCards = () => {
  const { client } = useSession();

  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const result = await getCurrentUserJobs({
          client,
          query: {
            status: ["draft", "queued", "running", "completed", "aborted"],
            sort: "createdAt",
            order: "desc",
            page: 1,
            limit: 100,
          },
        });

        const statusCode = result?.error?.statusCode;

        if (statusCode == 400) {
          setErrorMsg("Error Code 400: " + result?.error?.message);
        }

        console.log("Fetched jobs:", result);

        // Normalize result.data into an array of UserJob
        let allJobs: UserJob[] = [];
        const rdata: unknown = result.data;

        if (Array.isArray(rdata)) {
          // shape: [{ data: UserJob[] }, ...]
          allJobs = (rdata as any).flatMap((page: any) => page.data ?? []);
        } else if (
          rdata &&
          typeof rdata === "object" &&
          Array.isArray((rdata as any).data)
        ) {
          // shape: { data: UserJob[], extra: { ... } }
          allJobs = (rdata as any).data;
        } else {
          allJobs = [];
        }

        setJobs(allJobs);

        console.log("Fetched jobs:", result);
      } catch (err) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

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

  if (loading) {
    return <LoadingCards />;
  }

  if (errorMsg) {
    return (
      <div className="alert alert-error">
        <span>{errorMsg}</span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="alert alert-info">
        <span>No jobs found.</span>
      </div>
    );
  }

  return (
    <>
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
      `}</style>

      {jobs.map((job) => (
        <Link key={job.id} href={`/jobs/${job.id}`} className="block mb-4">
          <div
            className="card flex w-full bg-gray-800 text-white shadow-lg job-card cursor-pointer"
            style={
              {
                ["--job-card-glow" as any]: getGlowColor(job.status),
              } as React.CSSProperties
            }
          >
            <div className="card-body p-4 space-y-3">
              <h2 className="card-title text-lg">ID: {job.id}</h2>
              <div className="aspect-video overflow-hidden rounded-md">
                <img
                  src="/images/blueprint.png"
                  alt="Job Thumbnail"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Target SPP:</span>
                  <span>{job.spp}</span>
                </div>

                <progress
                  className="progress progress-primary w-full"
                  value={job.progress}
                  max={100}
                ></progress>
              </div>

              <div>{getStatusTag(job)}</div>

              <div className="text=[8px] text-gray-500 space-y-1">
                <p>
                  Started:{" "}
                  {job.startedAt
                    ? new Date(job.startedAt).toLocaleString()
                    : "n/a"}
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
