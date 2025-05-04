"use client";

const stats = [
  { label: "Queue", value: 120 },
  { label: "Generating octree", value: 50 },
  { label: "Queue", value: 200 },
  { label: "Rendering", value: 150 },
  { label: "Merging", value: 15 },
];

const dailyStats = [
  { label: "Jobs created today", value: 20 },
  { label: "Jobs finished today", value: 15 },
  { label: "Dumps merged today", value: 12 },
];

export default function ChunkyCloudStats() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ChunkyCloud statistics</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="text-center p-4 bg-base-200 rounded-xl shadow"
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daily stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {dailyStats.map((s, i) => (
          <div
            key={i}
            className="text-center p-4 bg-base-200 rounded-xl shadow"
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Node status */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Render nodes{" "}
          <span className="text-sm text-gray-500">(1 of 2 nodes working)</span>
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">🖥️ Node1</h2>
              <p>8 threads</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md opacity-60">
            <div className="card-body">
              <h2 className="card-title">🖥️ Node2</h2>
              <p>4 threads</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Region processing nodes{" "}
          <span className="text-sm text-gray-500">(1 of 2 nodes working)</span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title">🧩 PrepareNode1</h2>
            </div>
          </div>
          <div className="card bg-base-100 shadow-md opacity-60">
            <div className="card-body">
              <h2 className="card-title">🧩 PrepareNode2</h2>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="prose max-w-none bg-base-200 p-6 rounded-xl shadow">
        <h2>How ChunkyCloud works</h2>
        <p>
          A scene that is to be rendered is called a <strong>render job</strong>
          . Render jobs get split up into one or many <strong>tasks</strong>{" "}
          that are rendered on the <strong>render nodes</strong>. The number of
          tasks a job is split into depends on its resolution and samples per
          pixel.
        </p>
        <p>
          Instead of starting with an octree and an emittergrid, scenes can also
          be created from region files. ChunkyMap can use this so it doesn't
          need to construct the octree on a Minecraft server. New jobs that are
          created from region files are put in the{" "}
          <strong>region processing queue</strong> first and added to the{" "}
          <strong>render queue</strong> after a{" "}
          <strong>region processing node</strong> has created the scene files.
        </p>
        <p>
          When a task is done, it needs to be merged with the part of the job
          that is already done. This is done by a single{" "}
          <strong>dump processor</strong> that also has a queue of dumps waiting
          to be merged.
        </p>
        <p>
          If a job gets cancelled, it is not removed from the queues. The nodes
          will check if it is cancelled and just skip them in that case.
        </p>
      </div>
    </div>
  );
}
