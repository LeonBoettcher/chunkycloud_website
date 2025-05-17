const express = require("express");
const path = require("path");
const app = express();
const port = 3213;

app.use(express.json());



// Mock route for /api/resourcepacks
app.get("/api/resourcepacks", (req, res) => {
  res.json([
    { name: "default", displayName: "Vanilla 1.16.4" },
    { name: "realistico", displayName: "Realistico HD" },
    { name: "faithful", displayName: "Faithful 32x" }
  ]);
});

const users = [
  { email: "leonmonkeygamer@gmail.com", apiToken: "TEstAPIOKEY" },
  { email: "test@demo.com", apiToken: "abc123" },
];

// Example: Hardcoded valid token for demo purposes
const validTokens = ["testtoken1", "testtoken2"];

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

// In-memory job storage
const jobs = {
  "123": {
    id: "123",
    spp: 150,
    targetSpp: 1000,
    sceneDescription: { width: 1920, height: 1080, rayDepth: 5 },
    created: "2025-04-20T10:00:00Z",
    finishedAt: "2025-04-21T14:30:00Z",
    status: "rendering",
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
    status: "Generating Octree",
    cancelled: false,
    renderTime: 1800,
  },
  "125": {
    id: "125",
    spp: 300,
    targetSpp: 1500,
    sceneDescription: { width: 3840, height: 2160, rayDepth: 10 },
    created: "2025-04-23T11:45:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 7200,
  },
  "126": {
    id: "126",
    spp: 400,
    targetSpp: 2500,
    sceneDescription: { width: 1280, height: 720, rayDepth: 3 },
    created: "2025-04-24T08:30:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 2400,
  },
  "127": {
    id: "127",
    spp: 500,
    targetSpp: 3000,
    sceneDescription: { width: 1600, height: 900, rayDepth: 4 },
    created: "2025-04-25T13:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 5400,
  },
  "128": {
    id: "128",
    spp: 600,
    targetSpp: 3500,
    sceneDescription: { width: 2560, height: 1440, rayDepth: 6 },
    created: "2025-04-26T15:30:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 3000,
  },
  "129": {
    id: "129",
    spp: 700,
    targetSpp: 4000,
    sceneDescription: { width: 1920, height: 1080, rayDepth: 5 },
    created: "2025-04-27T10:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 3600,
  },
  "130": {
    id: "130",
    spp: 800,
    targetSpp: 4500,
    sceneDescription: { width: 3840, height: 2160, rayDepth: 8 },
    created: "2025-04-28T12:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 7200,
  },
  "131": {
    id: "131",
    spp: 900,
    targetSpp: 5000,
    sceneDescription: { width: 1280, height: 720, rayDepth: 2 },
    created: "2025-04-29T14:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 2400,
  },
  "132": {
    id: "132",
    spp: 1000,
    targetSpp: 5500,
    sceneDescription: { width: 1600, height: 900, rayDepth: 3 },
    created: "2025-04-30T16:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 5400,
  },
  "133": {
    id: "133",
    spp: 1100,
    targetSpp: 6000,
    sceneDescription: { width: 2560, height: 1440, rayDepth: 4 },
    created: "2025-05-01T18:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 3000,
  },
  "134": {
    id: "134",
    spp: 1200,
    targetSpp: 6500,
    sceneDescription: { width: 1920, height: 1080, rayDepth: 5 },
    created: "2025-05-02T20:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 3600,
  },
  "135": {
    id: "135",
    spp: 1300,
    targetSpp: 7000,
    sceneDescription: { width: 3840, height: 2160, rayDepth: 6 },
    created: "2025-05-03T22:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 7200,
  },
  "136": {
    id: "136",
    spp: 1400,
    targetSpp: 7500,
    sceneDescription: { width: 1280, height: 720, rayDepth: 7 },
    created: "2025-05-04T09:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 2400,
  },
  "137": {
    id: "137",
    spp: 1500,
    targetSpp: 8000,
    sceneDescription: { width: 1600, height: 900, rayDepth: 8 },
    created: "2025-05-05T11:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 5400,
  },
  "138": {
    id: "138",
    spp: 1600,
    targetSpp: 8500,
    sceneDescription: { width: 2560, height: 1440, rayDepth: 9 },
    created: "2025-05-06T13:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 3000,
  },
  "139": {
    id: "139",
    spp: 1700,
    targetSpp: 9000,
    sceneDescription: { width: 1920, height: 1080, rayDepth: 10 },
    created: "2025-05-07T15:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 3600,
  },
  "140": {
    id: "140",
    spp: 1800,
    targetSpp: 9500,
    sceneDescription: { width: 3840, height: 2160, rayDepth: 11 },
    created: "2025-05-08T17:00:00Z",
    finishedAt: null,
    status: "rendering",
    cancelled: false,
    renderTime: 7200,
  },
  
};
 
// Serve static files (for image/dump mockups)
app.use(express.static(path.join(__dirname, "public")));

// GET job stats
app.get("/api/stats", (req, res) => {
  res.json(stats);
});

// GET job details
app.get("/api/jobs", (req, res) => {
  res.json(jobs);
});

// GET job details
app.get("/api/job/:id", (req, res) => {
  const job = jobs[req.params.id];
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// GET image mock
app.get("/api/job/:id/latest.png", (req, res) => {
  const job = jobs[req.params.id];
  if (job) {
    res.sendFile(path.join(__dirname, "public", "placeholder.png"));
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// GET dump mock
app.get("/api/job/:id/latest.dump", (req, res) => {
  const job = jobs[req.params.id];
  if (job) {
    res.download(path.join(__dirname, "public", "placeholder.dump"));
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});



app.post("/api/coins", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: "Token missing" });
  }

  if (validTokens.includes(token)) {
    // Token is valid – simulate login
    return res.status(200).json({ success: true, coins : 10 });
  } else {
    // Invalid token
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
});

app.post("/api/apitoken", (req, res) => {
  const email = req.body.email;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Missing or invalid email" });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ email: user.email, apiToken: user.apiToken });
});


app.listen(port, "0.0.0.0", () => {
  console.log(`Mockup API running at http://0.0.0.0:${port}`);
});