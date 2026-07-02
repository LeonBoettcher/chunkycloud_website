"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "../../app/auth/components/SessionProvider";
import { getCurrentUserJobs } from "../../lib/api-client";
import type { UserJob } from "../../lib/api-client";

const JobCards = () => {
  const { client } = useSession();

  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      if (!client) {
        console.log("Not logged in");
        setLoading(false);
        return;
      }

      try {
        const fetchedJobs = await getCurrentUserJobs({
          client,
          query: {
            status: ["draft", "queued", "running", "completed", "aborted"],
            sort: "createdAt",
            order: "desc",
            page: 1,
            limit: 10,
          },
        });

        const allJobs =
          fetchedJobs.data?.flatMap((page) => page.data ?? []) ?? [];

        setJobs(allJobs);

        console.log("Fetched jobs:", fetchedJobs);
      } catch (err) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [client]);

  const getStatusTag = (job: UserJob) => {
    if (!job.status)
      return <div className="badge badge-outline badge-info">Unknown</div>;

    const status = job.status.toLowerCase();

    if (status.includes("queue"))
      return <div className="badge badge-outline badge-warning">Queued</div>;

    if (status.includes("render") || status.includes("running"))
      return (
        <div className="badge badge-outline badge-success">{job.status}</div>
      );

    if (status.includes("error") || status.includes("failed"))
      return (
        <div className="badge badge-outline badge-error">{job.status}</div>
      );

    if (status.includes("cancel"))
      return <div className="badge badge-neutral badge-outline">Cancelled</div>;

    return (
      <div className="badge badge-outline badge-primary">{job.status}</div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
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
        <Link key={job.id} href={`/jobs/${job.id}`} className="block">
          <div className="card-body">
            <h2 className="card-title">{job.id}</h2>

            <img
              src="/images/blueprint.png"
              alt="Job Thumbnail"
              className="rounded-md"
            />

            <div>
              <div className="flex justify-between text-sm">
                <span>SPP</span>
                <span>{job.spp}</span>
              </div>
            </div>

            {getStatusTag(job)}

            <p className="text-xs text-gray-400">
              Created:{" "}
              {job.createdAt ? new Date(job.createdAt).toLocaleString() : "n/a"}
            </p>
          </div>
        </Link>
      ))}
    </>
  );
};

export default JobCards;
