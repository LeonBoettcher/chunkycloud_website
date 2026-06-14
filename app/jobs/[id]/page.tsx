async function getJob(id: string): Promise<any | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  try {
    const res = await fetch(`${baseUrl}/api/job/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    return null;
  }
}

function getStatusTag(id: string, job: any) {
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
    return <div className="badge badge-outline badge-error">{job.status}</div>;
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

const JobPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return (
      <div className="alert alert-error shadow-lg">
        <div>
          <h3 className="font-bold">Job not found</h3>
          <p className="text-sm">Could not load job details</p>
        </div>
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
              <div className="divider"></div>
              <span className="font-mono">{getStatusTag(job.id, job)}</span>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">SPP Progress:</span>
                  <span className="font-mono">
                    {job.spp} / {job.targetSpp}
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={job.spp}
                  max={job.targetSpp}
                ></progress>
              </div>

              <div className="divider"></div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Render Time:</span>
                  <span className="font-mono">{job.renderTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Created:</span>
                  <span className="font-mono text-sm">
                    {new Date(job.created).toLocaleString()}
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
                    <span>Resolution:</span>
                    <span className="font-mono">
                      {job.sceneDescription.width}x{job.sceneDescription.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ray Depth:</span>
                    <span className="font-mono">
                      {job.sceneDescription.rayDepth}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divider"></div>
              <div className="space-y-2">
                <button className="btn btn-sm btn-outline btn-error w-fit">
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="basis-2/3">
          <div className="aspect-video overflow-hidden rounded-md bg-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Render Preview</p>
              <p className="text-sm">Image will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
