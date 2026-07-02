import { Suspense } from "react";
import JobCards from "./JobCards";
import { Squares2X2Icon } from "@heroicons/react/20/solid";

//TODO [ISSUE] Fix Page infinitly reloading. Only Happens when F5 /jobs or reloading /jobs

export default function JobsPage() {
  return (
    <div className="bg-base-200 text-white min-h-screen">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-700 pt-24 pb-6">
          <h1 className="text-4xl font-bold tracking-tight">Jobs</h1>

          <button type="button" className="text-gray-400 hover:text-white">
            <Squares2X2Icon className="h-5 w-5" />
          </button>
        </div>

        <section className="pt-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-9 gap-4">
            <JobCards />
          </div>
        </section>
      </div>
    </div>
  );
}
