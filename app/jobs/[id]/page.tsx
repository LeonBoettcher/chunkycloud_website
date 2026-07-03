"use client";

import React, { use, useEffect, useState } from "react";
import { useSession } from "../../../app/auth/components/SessionProvider";
import { getCurrentUserJob } from "../../../lib/api-client";
import type { UserJob } from "../../../lib/api-client";

interface PageProps {
  params: Promise<{
    id: number;
  }>;
}

const JobPage = ({ params }: PageProps) => {
  const { id } = use(params);
  const { client } = useSession();

  const [job, setJob] = useState<UserJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const fetchedJob = await getCurrentUserJob({
          client,
          path: { id },
        });

        if (fetchedJob.error) {
          console.error(
            `Error ${fetchedJob.error.statusCode}: ${fetchedJob.error.message}`,
          );
          return;
        }

        // fetchedJob.data can be either an array (from 200: Array<UserJob>)
        // or a single object depending on the client generic. Normalize it
        // to a single `UserJob | null` before updating state.
        const maybeData = fetchedJob.data as unknown as UserJob[] | UserJob | undefined;
        let jobItem: UserJob | null = null;
        if (Array.isArray(maybeData)) {
          jobItem = maybeData[0] ?? null;
        } else {
          jobItem = (maybeData as UserJob) ?? null;
        }

        setJob(jobItem);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Job Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Job Details</h1>
        <p>Job not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Job Details</h1>

      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {job.id}
        </p>

        <p>
          <strong>SPP:</strong> {job.spp}
        </p>

        <p>
          <strong>Status:</strong> {job.status}
        </p>

        <p>
          <strong>Created At:</strong> {job.createdAt}
        </p>

        <p>
          <strong>Finished At:</strong> {job.finishedAt ?? "Not finished yet"}
        </p>

        <p>
          <strong>Dimensions:</strong> {job.width} × {job.height}
        </p>

        <p>
          <strong>Progress:</strong> {job.progress}%
        </p>

        <p>
          <strong>Create Dump:</strong> {job.createDump ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

export default JobPage;
