import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all zones
  app.get("/api/zones", async (req, res) => {
    try {
      const zones = await storage.getZones();
      res.json(zones);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch zones" });
    }
  });

  // Get zone presence data
  app.get("/api/presence", async (req, res) => {
    try {
      const presence = await storage.getZonePresence();
      res.json(presence);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch presence data" });
    }
  });

  // Check in user
  app.post("/api/checkin", async (req, res) => {
    try {
      const checkInSchema = z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email().optional(),
        zoneId: z.number().min(1, "Zone is required"),
        duration: z.string().min(1, "Duration is required"),
      });

      const { name, email, zoneId, duration } = checkInSchema.parse(req.body);

      // Check if zone exists
      const zone = await storage.getZone(zoneId);
      if (!zone) {
        return res.status(404).json({ message: "Zone not found" });
      }

      // Get or create user
      let user = await storage.getUserByName(name);
      if (!user) {
        user = await storage.createUser({ name, email, avatar: null });
      }

      // Check out any existing sessions for this user
      await storage.checkOutUserSessions(user.id);

      // Create new session
      const session = await storage.createSession({
        userId: user.id,
        zoneId,
        duration,
      });

      res.json({ session, user, zone });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to check in" });
    }
  });

  // Check out user
  app.post("/api/checkout", async (req, res) => {
    try {
      const checkOutSchema = z.object({
        userId: z.number().min(1, "User ID is required"),
      });

      const { userId } = checkOutSchema.parse(req.body);

      await storage.checkOutUserSessions(userId);

      res.json({ message: "Checked out successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to check out" });
    }
  });

  // Get active sessions
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getActiveSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
