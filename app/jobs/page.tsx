"use client";

import { Suspense, useEffect, useState } from "react";
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

export default function JobsPage() {
  const [selectedStatus, setSelectedStatus] =
    useState<JobStatus[]>(statusOptions);
  const [selectedSort, setSelectedSort] = useState<SortOption>("createdAt");
  const [selectedOrder, setSelectedOrder] = useState<OrderOption>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedSort, selectedOrder, pageLimit]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
    <div className="bg-base-200 text-white min-h-screen">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-700 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">Jobs</h1>

          <div className="group relative">
            <button
              type="button"
              className="btn btn-ghost btn-sm text-gray-400 hover:text-white"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>

            <div className="pointer-events-none invisible absolute right-0 top-full z-20 mt-2 w-[min(36rem,calc(100vw-2rem))] translate-y-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="card border border-base-300/80 bg-base-100/90 shadow-xl backdrop-blur">
                <div className="card-body gap-4 p-4 sm:p-6">
                  <div className="label pb-1">
                    <span className="label-text">Sort by</span>
                  </div>
                  <div className="grid gap-3 border-t border-base-300/70 pt-4 md:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.2fr_1fr_auto]">
                    <label className="form-control w-full">
                      <div className="join w-full">
                        <select
                          className="select select-bordered select-sm join-item h-10 w-full min-w-0"
                          value={selectedSort}
                          onChange={(event) =>
                            setSelectedSort(event.target.value as SortOption)
                          }
                        >
                          <option value="createdAt">Created</option>
                          <option value="startedAt">Started</option>
                          <option value="finishedAt">Finished</option>
                        </select>
                        <button
                          type="button"
                          className="btn btn-info btn-sm join-item h-10 min-w-12 px-3"
                          onClick={() =>
                            setSelectedOrder((current) =>
                              current === "asc" ? "desc" : "asc",
                            )
                          }
                          aria-label={`Sort ${selectedOrder === "asc" ? "descending" : "ascending"}`}
                          title={
                            selectedOrder === "asc" ? "Descending" : "Ascending"
                          }
                        >
                          <span className="text-base leading-none">
                            {selectedOrder === "asc" ? "↑" : "↓"}
                          </span>
                        </button>
                      </div>
                    </label>

                    <div className="flex flex-wrap items-center gap-2">
                      {statusOptions.map((status) => {
                        const isActive = selectedStatus.includes(status);

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

                    <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={resetStatuses}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9 gap-4">
            <Suspense fallback={<LoadingCards />}>
              <JobCards
                status={selectedStatus}
                sort={selectedSort}
                order={selectedOrder}
                page={currentPage}
                limit={pageLimit}
                onPaginationInfo={setTotalPages}
              />
            </Suspense>
          </div>
          {totalPages > 1 ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-xl border border-base-300/80 bg-base-100/70 px-4 py-3 text-sm text-base-content shadow-sm">
              <button
                type="button"
                className="btn btn-info btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                First
              </button>
              <button
                type="button"
                className="btn btn-info btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Prev
              </button>
              {(() => {
                const visibleButtons = 5;
                const startPage = Math.max(
                  1,
                  Math.min(
                    currentPage - Math.floor(visibleButtons / 2),
                    Math.max(1, totalPages - visibleButtons + 1),
                  ),
                );
                const endPage = Math.min(
                  totalPages,
                  startPage + visibleButtons - 1,
                );

                return (
                  <>
                    {startPage > 1 && (
                      <span className="px-2 text-base-content/60">...</span>
                    )}
                    {Array.from(
                      { length: endPage - startPage + 1 },
                      (_, index) => {
                        const page = startPage + index;
                        return (
                          <button
                            key={page}
                            type="button"
                            className={`btn btn-sm ${
                              page === currentPage
                                ? "btn-primary"
                                : "btn-info btn-outline"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        );
                      },
                    )}
                    {endPage < totalPages && (
                      <span className="px-2 text-base-content/60">...</span>
                    )}
                  </>
                );
              })()}
              <button
                type="button"
                className="btn btn-info btn-sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
              >
                Next
              </button>
              <button
                type="button"
                className="btn btn-info btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                Last
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
