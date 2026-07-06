"use client";

import { Suspense, useState } from "react";
import JobCards from "./JobCards";
import { Squares2X2Icon } from "@heroicons/react/20/solid";
import LoadingCards from "./LoadingCards";
import type { JobStatus } from "../../lib/api-client";

const statusOptions: JobStatus[] = [
  "draft",
  "queued",
  "running",
  "completed",
  "aborted",
];

//TODO [ISSUE] Fix Page infinitly reloading. Only Happens when F5 /jobs or reloading /jobs

export default function JobsPage() {
  const [selectedStatuses, setSelectedStatuses] =
    useState<JobStatus[]>(statusOptions);

  const toggleStatus = (status: JobStatus) => {
    setSelectedStatuses((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status],
    );
  };

  const resetStatuses = () => {
    setSelectedStatuses(statusOptions);
  };

  return (
    <div className="bg-base-200 text-white min-h-screen">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-700 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">Jobs</h1>
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map((status) => {
              const isActive = selectedStatuses.includes(status);

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => toggleStatus(status)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium capitalize transition-all ${
                    isActive
                      ? "border-gray-400 bg-gray-600/20 text-gray-100 shadow-[0_0_0_1px_rgba(34,211,238,0.2)]"
                      : "border-gray-600 bg-gray-800/70 text-gray-300 hover:border-gray-500 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
          <button type="button" className="text-gray-400 hover:text-white">
            <Squares2X2Icon className="h-5 w-5" />
          </button>
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9 gap-4">
            <Suspense fallback={<LoadingCards />}>
              <JobCards statuses={selectedStatuses} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
