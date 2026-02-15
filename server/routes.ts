
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post(api.leads.create.path, async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);

      // Attempt to push to GoHighLevel webhook if URL is configured
      if (process.env.GHL_WEBHOOK_URL) {
        try {
          // Flatten lead data for GHL if needed, or send as is
          // The user specified a specific structure:
          // Format answers as a newline-separated string
          let formattedAnswers = "";
          if (lead.answers && typeof lead.answers === 'object') {
            formattedAnswers = Object.entries(lead.answers)
              .map(([question, answer]) => `${question}\nAnswer: ${answer}`)
              .join("\n\n");
          }

          const ghlPayload = {
            first_name: lead.firstName,
            email: lead.email,
            primary_archetype: lead.primaryArchetype,
            primary_score: lead.primaryScore,
            secondary_archetype: lead.secondaryArchetype,
            secondary_score: lead.secondaryScore,
            tag: `quiz_primary_${lead.primaryArchetype.toLowerCase()}`,
            answers: formattedAnswers
          };

          const response = await fetch(process.env.GHL_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghlPayload)
          });

          if (!response.ok) {
            console.error(`GHL Webhook failed: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Error pushing to GHL:", error);
        }
      } else {
        console.log("GHL_WEBHOOK_URL not set, skipping webhook push.");
      }

      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid lead data", errors: error.errors });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return httpServer;
}
