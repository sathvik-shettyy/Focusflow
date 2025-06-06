import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const zones = pgTable("zones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  youtubeUrl: text("youtube_url").notNull(),
  activeUsers: integer("active_users").notNull().default(0),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  avatar: text("avatar"),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  zoneId: integer("zone_id").notNull(),
  checkedInAt: timestamp("checked_in_at").notNull().defaultNow(),
  checkedOutAt: timestamp("checked_out_at"),
  duration: text("duration").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertZoneSchema = createInsertSchema(zones).omit({
  id: true,
  activeUsers: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  checkedInAt: true,
  checkedOutAt: true,
  isActive: true,
});

export type Zone = typeof zones.$inferSelect;
export type InsertZone = z.infer<typeof insertZoneSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
