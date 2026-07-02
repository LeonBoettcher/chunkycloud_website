"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "../../../app/auth/components/SessionProvider";
import { getCurrentUserJob } from "../../../lib/api-client";
import type { UserJob } from "../../../lib/api-client";

const JobPage = ({ params }: { params: { id: number } }) => {
  const JobId = 1;
  const { client } = useSession();

  const [job, setJob] = useState<UserJob | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      console.log("CLIENT STATE:", client);
      try {
        const fetchedJob = await getCurrentUserJob({
          client,
          path: {
            id: JobId,
          },
        });

        const data = fetchedJob.data?.[0];

        setJob(data);

        console.log("Fetched job:", fetchedJob);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Job Details</h1>
      {job && (
        <div>
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
            <strong>Updated At:</strong>
            {job.finishedAt}
          </p>
          <p>
            {job.height} X {job.width}
          </p>
          <p>
            <strong>Progress:</strong> {job.progress}%
          </p>
          <p>
            <strong>Dump:</strong> {job.createDump ? "Yes" : "No"}
          </p>
          {/* Add more job details as needed */}
        </div>
      )}
    </div>
  );
};

export default JobPage;
