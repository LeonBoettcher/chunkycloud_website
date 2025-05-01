const express = require("express");
const path = require("path");
const app = express();
const port = 3213;

// Sample data (this would usually come from a database or other source)
const stats = {
  tasks: {
    preparePending: 120,
    prepareRunning: 50,
    pending: 200,
    running: 150,
    mergePending: 10,
    mergeRunning: 5,
  },
  today: {
    jobsCreated: 20,
    jobsFinished: 15,
    dumpsMerged: 12,
  },
  renderNodes: [
    { name: "Node1", status: "working", threads: 8 },
    { name: "Node2", status: "idle", threads: 4 },
  ],
  prepareNodes: [
    { name: "PrepareNode1", status: "working" },
    { name: "PrepareNode2", status: "idle" },
  ],
};

const jobs = {
  "123": {
    id: "123",
    spp: 150,
    targetSpp: 1000,
    sceneDescription: { width: 1920, height: 1080, rayDepth: 5 },
    created: "2025-04-20T10:00:00Z",
    finishedAt: "2025-04-21T14:30:00Z",
    cancelled: false,
    renderTime: 3600,
  },
  "124": {
    id: "124",
    spp: 200,
    targetSpp: 2000,
    sceneDescription: { width: 2560, height: 1440, rayDepth: 7 },
    created: "2025-04-22T09:15:00Z",
    finishedAt: null,
    cancelled: false,
    renderTime: 1800,
  },
};

// Middleware to handle JSON requests
app.use(express.json());

// Serve static files (optional)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint to get stats
app.get("/api/stats", (req, res) => {
  res.json(stats);
});

// API endpoint to get details of a specific job by ID
app.get("/api/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  const job = jobs[jobId];

  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// API endpoint to fetch a job's latest image (mockup example)
app.get("/api/jobs/:id/latest.png", (req, res) => {
  const jobId = req.params.id;
  const job = jobs[jobId];

  if (job) {
    res.sendFile(path.join(__dirname, "public", "placeholder.png"));
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// API endpoint to download the job dump (mockup example)
app.get("/api/jobs/:id/latest.dump", (req, res) => {
  const jobId = req.params.id;
  const job = jobs[jobId];

  if (job) {
    res.download(path.join(__dirname, "public", "placeholder.dump"));
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});