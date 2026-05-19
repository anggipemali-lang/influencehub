import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "influencehub-super-secret-key-2024";

// --- AI Initialization ---
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
const AI_MODELS = {
  FLASH: "gemini-3-flash-preview",
  PRO: "gemini-3.1-pro-preview",
};

// --- In-Memory Database ---
// In a real app, use a real database. For this demo, we'll use in-memory storage.
const db = {
  users: [] as any[],
  campaigns: [
    {
      id: "c1",
      title: "Summer Fitness Challenge",
      description: "We are looking for fitness enthusiasts to promote our new organic protein shake. High engagement is preferred.",
      brandId: "brand123",
      brandName: "Vitality Nutrition",
      budget: 2500,
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "c2",
      title: "Gaming Laptop Launch",
      description: "Review our latest ultra-thin gaming laptop. Must have experience with AAA titles.",
      brandId: "brand456",
      brandName: "X-Gear Systems",
      budget: 5000,
      status: "active",
      createdAt: new Date().toISOString()
    }
  ] as any[],
  applications: [] as any[],
  offers: [] as any[],
  notifications: [] as any[]
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- Authentication Middleware ---
  const authMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };

  // --- Auth API ---

  // Register
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, role, displayName } = req.body;

    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      uid: Math.random().toString(36).substring(7),
      email,
      password: hashedPassword,
      role: email.toLowerCase() === 'anggipemali@gmail.com' ? 'admin' : role,
      displayName,
      createdAt: new Date().toISOString()
    };

    db.users.push(user);
    
    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ user: userWithoutPassword, token });
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '7d' });
    
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: userWithoutPassword, token });
  });

  // User Profile
  app.get("/api/auth/me", authMiddleware, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out" });
  });

  // --- Campaigns API ---
  app.get("/api/campaigns", (req, res) => {
    const activeCampaigns = db.campaigns.filter(c => c.status === 'active');
    res.json(activeCampaigns);
  });

  app.get("/api/campaigns/brand/:brandId", authMiddleware, (req, res) => {
    const campaigns = db.campaigns.filter(c => c.brandId === req.params.brandId);
    res.json(campaigns);
  });

  app.post("/api/campaigns", authMiddleware, (req: any, res) => {
    if (req.user.role !== 'brand' && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Forbidden" });
    }
    const campaign = {
      ...req.body,
      id: Math.random().toString(36).substring(7),
      brandId: req.user.uid,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    db.campaigns.push(campaign);
    res.status(201).json(campaign);
  });

  // --- Applications API ---
  app.post("/api/campaigns/:id/apply", authMiddleware, (req: any, res) => {
    const application = {
      ...req.body,
      id: Math.random().toString(36).substring(7),
      campaignId: req.params.id,
      influencerId: req.user.uid,
      status: 'pending',
      appliedAt: new Date().toISOString()
    };
    db.applications.push(application);
    res.status(201).json(application);
  });

  app.get("/api/campaigns/:id/applications", authMiddleware, (req, res) => {
    const applications = db.applications.filter(a => a.campaignId === req.params.id);
    res.json(applications);
  });

  app.patch("/api/applications/:id", authMiddleware, (req, res) => {
    const appIndex = db.applications.findIndex(a => a.id === req.params.id);
    if (appIndex !== -1) {
      db.applications[appIndex] = { ...db.applications[appIndex], ...req.body, reviewedAt: new Date().toISOString() };
      res.json(db.applications[appIndex]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // --- Offers API ---
  app.post("/api/offers", authMiddleware, (req: any, res) => {
    const offer = {
      ...req.body,
      id: Math.random().toString(36).substring(7),
      brandId: req.user.uid,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    db.offers.push(offer);
    res.status(201).json(offer);
  });

  app.get("/api/offers/influencer/:id", authMiddleware, (req, res) => {
    const offers = db.offers.filter(o => o.influencerId === req.params.id);
    res.json(offers);
  });

  app.get("/api/offers/brand/:id", authMiddleware, (req, res) => {
    const offers = db.offers.filter(o => o.brandId === req.params.id);
    res.json(offers);
  });

  app.patch("/api/offers/:id", authMiddleware, (req: any, res) => {
    const offerIndex = db.offers.findIndex(o => o.id === req.params.id);
    if (offerIndex !== -1) {
      db.offers[offerIndex] = { ...db.offers[offerIndex], ...req.body, respondedAt: new Date().toISOString() };
      res.json(db.offers[offerIndex]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // --- AI API ---
  app.post("/api/ai/recommend", authMiddleware, async (req: any, res) => {
    const { brandDescription, budget, influencers } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "AI Service not configured" });
    }

    try {
      const prompt = `
        As an expert Influencer Marketing Strategist, analyze the following brand and campaign details:
        Brand/Campaign Description: "${brandDescription}"
        Budget: $${budget}
        
        Available Influencers:
        ${JSON.stringify(influencers.map((i: any) => ({ 
          name: i.displayName, 
          niche: i.niche, 
          followers: i.followersCount,
          engagement: i.engagementRate,
          pricing: i.pricing
        })))}
        
        Recommend the top 3 influencers. Provide Relevance and Match Score (%).
      `;

      const response = await ai.models.generateContent({
        model: AI_MODELS.FLASH,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                relevance: { type: Type.STRING },
                matchScore: { type: Type.NUMBER }
              },
              required: ["name", "relevance", "matchScore"]
            }
          }
        }
      });
      
      const text = response.text || "[]";
      res.json({ result: JSON.parse(text) });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Failed to generate recommendation" });
    }
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

