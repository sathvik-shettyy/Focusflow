import { zones, users, sessions, type Zone, type User, type Session, type InsertZone, type InsertUser, type InsertSession } from "@shared/schema";

export interface IStorage {
  // Zones
  getZones(): Promise<Zone[]>;
  getZone(id: number): Promise<Zone | undefined>;
  createZone(zone: InsertZone): Promise<Zone>;
  updateZoneActiveUsers(id: number, count: number): Promise<void>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByName(name: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Sessions
  getActiveSessions(): Promise<Session[]>;
  getActiveSessionsByZone(zoneId: number): Promise<Session[]>;
  createSession(session: InsertSession): Promise<Session>;
  checkOutSession(sessionId: number): Promise<void>;
  checkOutUserSessions(userId: number): Promise<void>;
  
  // Presence
  getZonePresence(): Promise<{ zoneId: number; users: User[]; count: number }[]>;
}

export class MemStorage implements IStorage {
  private zones: Map<number, Zone>;
  private users: Map<number, User>;
  private sessions: Map<number, Session>;
  private currentZoneId: number;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.zones = new Map();
    this.users = new Map();
    this.sessions = new Map();
    this.currentZoneId = 1;
    this.currentUserId = 1;
    this.currentSessionId = 1;

    // Initialize default zones
    this.initializeDefaultZones();
  }

  private async initializeDefaultZones() {
    const defaultZones = [
      {
        name: "Coffee Shop",
        description: "Perfect for creative work with gentle coffee shop chatter and espresso machine sounds.",
        icon: "coffee",
        color: "amber",
        youtubeUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&loop=1&controls=1&modestbranding=1",
      },
      {
        name: "Silent Library",
        description: "Minimal ambient sounds with occasional page turns and quiet keyboard typing.",
        icon: "book",
        color: "blue",
        youtubeUrl: "https://www.youtube.com/embed/6p0DAz_30qQ?autoplay=0&loop=1&controls=1&modestbranding=1",
      },
      {
        name: "Forest Retreat",
        description: "Gentle forest sounds with birds chirping and rustling leaves for natural focus.",
        icon: "leaf",
        color: "green",
        youtubeUrl: "https://www.youtube.com/embed/eKFTSSKCzWA?autoplay=0&loop=1&controls=1&modestbranding=1",
      },
      {
        name: "Rainy Day",
        description: "Soothing rain sounds perfect for deep concentration and creative flow.",
        icon: "cloud-rain",
        color: "slate",
        youtubeUrl: "https://www.youtube.com/embed/mPZkdNFkNps?autoplay=0&loop=1&controls=1&modestbranding=1",
      },
      {
        name: "Lo-Fi Beats",
        description: "Relaxing lo-fi hip hop beats perfect for coding and creative tasks.",
        icon: "music",
        color: "purple",
        youtubeUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&loop=1&controls=1&modestbranding=1",
      },
      {
        name: "White Noise",
        description: "Consistent white noise to mask distractions and enhance concentration.",
        icon: "wave-square",
        color: "gray",
        youtubeUrl: "https://www.youtube.com/embed/nMfPqeZjc2c?autoplay=0&loop=1&controls=1&modestbranding=1",
      },
    ];

    for (const zone of defaultZones) {
      await this.createZone(zone);
    }
  }

  async getZones(): Promise<Zone[]> {
    return Array.from(this.zones.values());
  }

  async getZone(id: number): Promise<Zone | undefined> {
    return this.zones.get(id);
  }

  async createZone(insertZone: InsertZone): Promise<Zone> {
    const id = this.currentZoneId++;
    const zone: Zone = { ...insertZone, id, activeUsers: 0 };
    this.zones.set(id, zone);
    return zone;
  }

  async updateZoneActiveUsers(id: number, count: number): Promise<void> {
    const zone = this.zones.get(id);
    if (zone) {
      zone.activeUsers = count;
      this.zones.set(id, zone);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByName(name: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.name === name);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      avatar: insertUser.avatar || null
    };
    this.users.set(id, user);
    return user;
  }

  async getActiveSessions(): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.isActive);
  }

  async getActiveSessionsByZone(zoneId: number): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      session => session.zoneId === zoneId && session.isActive
    );
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = {
      ...insertSession,
      id,
      checkedInAt: new Date(),
      checkedOutAt: null,
      isActive: true,
    };
    this.sessions.set(id, session);
    
    // Update zone active user count
    await this.updateZoneActiveUsersCount(insertSession.zoneId);
    
    return session;
  }

  async checkOutSession(sessionId: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session && session.isActive) {
      session.isActive = false;
      session.checkedOutAt = new Date();
      this.sessions.set(sessionId, session);
      
      // Update zone active user count
      await this.updateZoneActiveUsersCount(session.zoneId);
    }
  }

  async checkOutUserSessions(userId: number): Promise<void> {
    const userSessions = Array.from(this.sessions.values()).filter(
      session => session.userId === userId && session.isActive
    );
    
    for (const session of userSessions) {
      await this.checkOutSession(session.id);
    }
  }

  private async updateZoneActiveUsersCount(zoneId: number): Promise<void> {
    const activeSessions = await this.getActiveSessionsByZone(zoneId);
    await this.updateZoneActiveUsers(zoneId, activeSessions.length);
  }

  async getZonePresence(): Promise<{ zoneId: number; users: User[]; count: number }[]> {
    const zones = await this.getZones();
    const presence = [];

    for (const zone of zones) {
      const activeSessions = await this.getActiveSessionsByZone(zone.id);
      const users = [];
      
      for (const session of activeSessions) {
        const user = await this.getUser(session.userId);
        if (user) {
          users.push(user);
        }
      }

      presence.push({
        zoneId: zone.id,
        users,
        count: users.length,
      });
    }

    return presence;
  }
}

export const storage = new MemStorage();
