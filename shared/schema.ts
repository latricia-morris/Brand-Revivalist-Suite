
import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll store leads locally as a backup, even though we push to GHL
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  email: text("email").notNull(),
  primaryArchetype: text("primary_archetype").notNull(),
  primaryScore: integer("primary_score").notNull(),
  secondaryArchetype: text("secondary_archetype").notNull(),
  secondaryScore: integer("secondary_score").notNull(),
  answers: jsonb("answers").notNull(), // Store full Q&A structure
  createdAt: timestamp("created_at").defaultNow(),
  syncedToGhl: timestamp("synced_to_ghl"), // null if not synced
});

export const insertLeadSchema = createInsertSchema(leads).omit({ 
  id: true, 
  createdAt: true, 
  syncedToGhl: true 
});

// Explicit types for the quiz logic
export type Archetype = 
  | "Ruler" | "Hero" | "Magician" | "Outlaw" | "Explorer" | "Creator" 
  | "Lover" | "Caregiver" | "Everyman" | "Jester" | "Sage" | "Innocent";

export interface Answer {
  text: string;
  scores: Partial<Record<Archetype, number>>;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
