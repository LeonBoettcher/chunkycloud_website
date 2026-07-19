"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../../app/auth/components/SessionProvider";
import {
  abortJob,
  getCurrentUserJob,
  getJobTiles,
} from "../../../lib/api-client";
import type { UserJob, TileResponse } from "../../../lib/api-client";

import getStatusTag from "../../../components/Job/getStatusTag";

interface PageProps {
  params: Promise<{
    id: number;
  }>;
}

const JobPage = ({ params }: PageProps) => {
  const { id } = use(params);
  const { client } = useSession();
  const router = useRouter();

  const [job, setJob] = useState<UserJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const [tilesavailable, setTilesAvailable] = useState(false);
  const [tiles, setTiles] = useState<TileResponse[]>([]);
  const canvasWidth = Math.max(...tiles.map((t) => t.x + t.width), 0);
  const canvasHeight = Math.max(...tiles.map((t) => t.y + t.height), 0);

  const fetchJob = async () => {
    try {
      const fetchedJob = await getCurrentUserJob({
        client,
        path: { id },
      });

      // fetchedJob.data can be either an array (from 200: Array<UserJob>)
      // or a single object depending on the client generic. Normalize it
      // to a single `UserJob | null` before updating state.
      const maybeData = fetchedJob.data as unknown as
        | UserJob[]
        | UserJob
        | undefined;
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

  const fetchTile = async () => {
    try {
      const result = await getJobTiles({
        client,
        path: { id },
      });

      if (result.data) {
        setTiles(result.data);
        setTilesAvailable(true);
      }
    } catch (err) {
      console.error("Failed to fetch tiles:", err);
    }
  };

  useEffect(() => {
    void fetchJob();
    void fetchTile();
  }, [client, id]);

  const handleAbort = async () => {
    if (!job || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      const result = await abortJob({
        client,
        path: { id: job.id },
        throwOnError: false,
      });

      if (result.error) {
        const errorMessage =
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error &&
          typeof (result.error as { message?: unknown }).message === "string"
            ? (result.error as { message: string }).message
            : "Unable to abort the job.";
        setActionError(errorMessage);
        return;
      }

      await fetchJob();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to abort the job.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!job || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setActionError(null);

    try {
      const result = await client.delete({
        security: [{ key: "access-token", scheme: "bearer", type: "http" }],
        url: "/users/me/jobs/{id}",
        path: { id: job.id },
        throwOnError: false,
      });

      if (result.error) {
        const errorMessage =
          typeof result.error === "object" &&
          result.error !== null &&
          "message" in result.error &&
          typeof (result.error as { message?: unknown }).message === "string"
            ? (result.error as { message: string }).message
            : "Unable to delete the job.";
        setActionError(errorMessage);
        return;
      }

      router.push("/jobs");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to delete the job.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAbort = job?.status === "queued" || job?.status === "running";

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
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-row gap-6">
        <div className="basis-1/3">
          <div className="card bg-gray-800 text-white shadow-lg">
            <div className="card-body space-y-4">
              <h2 className="card-title text-2xl">ID: {job.id}</h2>
              <span className="font-mono">{getStatusTag(job)}</span>

              <div className="divider"></div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Progress:</span>
                  <span className="font-mono">
                    {(job.progress * 100).toFixed(2)}%
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={job.progress}
                  max={1}
                ></progress>
              </div>

              <div className="divider"></div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Render Time:</span>
                  <span className="font-mono">{job.startedAt}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Created:</span>
                  <span className="font-mono text-sm">
                    {job.startedAt
                      ? new Date(job.startedAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
                {job.finishedAt && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Finished:</span>
                    <span className="font-mono text-sm">
                      {new Date(job.finishedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="divider"></div>

              <div className="space-y-3">
                <h3 className="font-semibold">Scene Description</h3>
                <div className="bg-gray-700 p-3 rounded space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>SPP Goal:</span>
                    <span className="font-mono">{job.spp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span className="font-mono">
                      {job.width}x{job.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ray Depth:</span>
                    <span className="font-mono">CURRENTLY NOT IMPLEMENTED</span>
                  </div>
                </div>
              </div>

              <div className="divider"></div>
              <div className="space-y-2 flex flex-row items-start mb-4 gap-2 flex-wrap">
                {canAbort ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline btn-warning w-fit"
                    onClick={handleAbort}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Working..." : "Abort Job"}
                  </button>
                ) : (
                  <div
                    className="tooltip"
                    data-tip="Only queued or running jobs can be aborted."
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-disabled btn-outline btn-warning w-fit"
                      disabled
                    >
                      Abort Job
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-error w-fit"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Working..." : "Delete Job"}
                </button>
              </div>
              {actionError && (
                <p className="text-sm text-error">{actionError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="basis-2/3">
          <div className="aspect-video overflow-hidden rounded-md bg-gray-900 flex items-center justify-center">
            {tilesavailable == false && (
              <div className="text-center text-gray-500">
                <p className="text-lg">Render Preview</p>
                <p className="text-sm">
                  Waiting for Preview Tiles from Render Nodes
                </p>
              </div>
            )}
            {tilesavailable && (
              <div className="basis-2/3">
                <div className="aspect-video rounded-md bg-gray-900 overflow-hidden">
                  <div className="relative w-full h-full">
                    {tiles.map((tile) => (
                      <div
                        key={`${tile.x}-${tile.y}`}
                        className="absolute"
                        style={{
                          left: `${(tile.x / canvasWidth) * 100}%`,
                          top: `${(tile.y / canvasHeight) * 100}%`,
                          width: `${(tile.width / canvasWidth) * 100}%`,
                          height: `${(tile.height / canvasHeight) * 100}%`,
                        }}
                      >
                        <img
                          src={tile.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />

                        {tile.progress < 1 && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <p className="text-white font-bold text-lg">
                              {(tile.progress * 100).toFixed(0)}%
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
