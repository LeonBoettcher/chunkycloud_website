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
  { email: "leonmonkeygamer@gmail.com", apiToken: "abc123" },
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
 
// Serve static files (for image/dump mockups)
app.use(express.static(path.join(__dirname, "public")));

// GET job stats
app.get("/api/stats", (req, res) => {
  res.json(stats);
});

// GET job details
app.get("/api/jobs/:id", (req, res) => {
  const job = jobs[req.params.id];
  if (job) {
    res.json(job);
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// GET image mock
app.get("/api/jobs/:id/latest.png", (req, res) => {
  const job = jobs[req.params.id];
  if (job) {
    res.sendFile(path.join(__dirname, "public", "placeholder.png"));
  } else {
    res.status(404).json({ error: "Job not found" });
  }
});

// GET dump mock
app.get("/api/jobs/:id/latest.dump", (req, res) => {
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

app.get("/api/apitoken", (req, res) => {
  const email = req.query.email;
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Missing or invalid email" });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json({ email: user.email, apiToken: user.apiToken });
});


app.listen(port, () => {
  console.log(`Mockup API running at http://localhost:${port}`);
});
