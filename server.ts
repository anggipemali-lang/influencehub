import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Authentication Middleware Concept ---
  // This middleware would normally verify a Firebase ID token sent in the Authorization header.
  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    }
    // Conceptual verification:
    // const token = authHeader.split(' ')[1];
    // const decodedToken = await admin.auth().verifyIdToken(token);
    // req.user = decodedToken;
    
    // For this design demo, we'll mock a user if a header is present
    req.user = { uid: "mock-user-id", role: req.headers['x-mock-role'] || "influencer" };
    next();
  };

  // --- Campaigns API ---

  // 1. Get all campaigns
  app.get("/api/campaigns", (req, res) => {
    // Logic: Fetch from Firestore 'campaigns' collection
    res.json([
      { id: "c1", title: "Summer Vibes 2024", brandId: "b1", status: "active", budget: 5000 },
      { id: "c2", title: "Tech Unboxing", brandId: "b2", status: "draft", budget: 2000 }
    ]);
  });

  // 2. Create a campaign (Brand only)
  app.post("/api/campaigns", authMiddleware, (req: any, res) => {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ error: "Forbidden: Only brands can create campaigns" });
    }
    const { title, description, budget } = req.body;
    // Logic: Save to Firestore
    res.status(201).json({ id: "new-id", title, budget, status: "active", createdAt: new Date() });
  });

  // 3. Update campaign
  app.patch("/api/campaigns/:id", authMiddleware, (req: any, res) => {
    const { id } = req.params;
    // Logic: Check ownership then update
    res.json({ id, ...req.body, updatedAt: new Date() });
  });

  // 4. Delete campaign
  app.delete("/api/campaigns/:id", authMiddleware, (req, res) => {
    // Logic: Delete from Firestore
    res.status(204).send();
  });

  // --- Influencer Application System ---

  // 1. Submit application (Influencer only)
  app.post("/api/campaigns/:id/apply", authMiddleware, (req: any, res) => {
    if (req.user.role !== 'influencer') {
      return res.status(403).json({ error: "Forbidden: Only influencers can apply" });
    }
    const { id } = req.params; // campaignId
    const { message } = req.body;
    // Logic: Create document in 'applications' collection
    res.status(201).json({ 
      id: "a1", 
      campaignId: id, 
      influencerId: req.user.uid, 
      status: "pending", 
      appliedAt: new Date() 
    });
  });

  // 2. Get applications for a campaign (Brand only)
  app.get("/api/campaigns/:id/applications", authMiddleware, (req, res) => {
    const { id } = req.params;
    // Logic: Fetch applications where campaignId == id
    res.json([
      { id: "a1", influencerId: "i1", status: "pending", message: "Love your brand!" },
      { id: "a2", influencerId: "i2", status: "approved", message: "Let's collab!" }
    ]);
  });

  // --- Approval/Rejection System ---

  app.post("/api/applications/:id/review", authMiddleware, (req: any, res) => {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Logic: Update application status in Firestore
    res.json({ id, status, reviewedAt: new Date() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
