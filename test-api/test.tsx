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

type SortOption = "createdAt" | "startedAt" | "finishedAt";
type OrderOption = "asc" | "desc";

//TODO [ISSUE] Fix Page infinitly reloading. Only Happens when F5 /jobs or reloading /jobs

export default function JobsPage() {
  const [selectedStatus, setSelectedStatus] =
    useState<JobStatus[]>(statusOptions);
  const [selectedSort, setSelectedSort] = useState<SortOption>("createdAt");
  const [selectedOrder, setSelectedOrder] = useState<OrderOption>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(12);

  const toggleStatus = (status: JobStatus) => {
    setSelectedStatus((current) =>
      current.includes(status)
        ? current.filter((value) => value !== status)
        : [...current, status],
    );
  };

  const resetStatuses = () => {
    setSelectedStatus(statusOptions);
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-base-300/80 pt-24 pb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Dashboard</p>
            <h1 className="text-4xl font-bold tracking-tight">Jobs</h1>
          </div>

          <button type="button" className="btn btn-ghost btn-sm btn-circle">
            <Squares2X2Icon className="h-5 w-5" />
          </button>
        </div>

        <div className="card mt-6 border border-base-300/80 bg-base-100/70 shadow-sm">
          <div className="card-body gap-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-base-content/70">
                  Status
                </h2>
                <p className="text-sm text-base-content/60">
                  Filter jobs by their current lifecycle stage.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetStatuses}
              >
                Reset
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {statusOptions.map((status) => {
                const isActive = selectedStatus.includes(status);

                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => toggleStatus(status)}
                    className={`btn btn-sm rounded-full capitalize ${
                      isActive
                        ? "btn-primary"
                        : "btn-outline"
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 border-t border-base-300/70 pt-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text">Sort by</span>
                </div>
                <select
                  className="select select-bordered select-sm"
                  value={selectedSort}
                  onChange={(event) =>
                    setSelectedSort(event.target.value as SortOption)
                  }
                >
                  <option value="createdAt">Created</option>
                  <option value="startedAt">Started</option>
                  <option value="finishedAt">Finished</option>
                </select>
              </label>

              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text">Order</span>
                </div>
                <select
                  className="select select-bordered select-sm"
                  value={selectedOrder}
                  onChange={(event) =>
                    setSelectedOrder(event.target.value as OrderOption)
                  }
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </label>

              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text">Page</span>
                </div>
                <input
                  type="number"
                  min="1"
                  className="input input-bordered input-sm"
                  value={currentPage}
                  onChange={(event) =>
                    setCurrentPage(Math.max(1, Number(event.target.value) || 1))
                  }
                />
              </label>

              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text">Limit</span>
                </div>
                <select
                  className="select select-bordered select-sm"
                  value={pageLimit}
                  onChange={(event) => setPageLimit(Number(event.target.value))}
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <section className="pb-24 pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9">
            <Suspense fallback={<LoadingCards />}>
              <JobCards
                status={selectedStatus}
                sort={selectedSort}
                order={selectedOrder}
                page={currentPage}
                limit={pageLimit}
              />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
