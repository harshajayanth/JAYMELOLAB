import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { sendEmail,replyEmail } from "./utils/sendEmail";

export async function registerRoutes(app: Express): Promise<Server> {

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projectuuuu" });
    }
  });


  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials",error });
    }
  });

  // Get featured testimonials
  app.get("/api/testimonials/featured", async (req, res) => {
    try {
      const testimonials = await storage.getFeaturedTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured testimonials",error });
    }
  });

  // Submit contact form
app.post("/api/contact", async (req, res) => {
  try {
    const validatedData = insertContactSubmissionSchema.parse(req.body);
    const submission = await storage.createContactSubmission(validatedData);

    const subject = `JAYMELOLAB | New Contact from ${validatedData.name}`;
    const htmlToYou = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>📬 New Contact Form Submission - JAYMELOLAB</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Email:</strong> ${validatedData.email}</p>
        <p><strong>Service Type:</strong> ${validatedData.serviceType}</p>
        <p><strong>Message:</strong><br/>${validatedData.message.replace(/\n/g, "<br/>")}</p>
      </div>
    `;

    // 1️⃣ Send notification to YOU
    await sendEmail(subject, htmlToYou);

    // 2️⃣ Auto-reply to the customer
    const replySubject = `👋 Hey! Thanks for reaching out to JAYMELOLAB!`;
const replyHtml = `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <p>Hi ${validatedData.name},</p>

    <p>Thank you for contacting <strong>JAYMELO SOUNDLAB</strong>! We're thrilled to hear from you and look forward to learning more about your project.</p>

    <p>To ensure a smooth and successful collaboration, please follow the steps below:</p>

    <ol style="padding-left: 20px;">
      <li>
        <strong>Step 1:</strong> Schedule a brief consultation with <strong>Harsha Jayanth</strong> to discuss the project's scope, creative process, timeline, and financial details.<br/>
        📞 <strong>Phone:</strong> <a href="tel:+919491364620">+91 94913 64620</a>
      </li>

      <li style="margin-top: 10px;">
        <strong>Step 2:</strong> After the consultation, please fill out this form with additional details about your <strong>${validatedData.serviceType}</strong> needs:<br/>
        📝 <a href="https://clover-party-2eb.notion.site/201035a21fe780d1aabaec458247d650?pvs=105" target="_blank" style="color: #3b82f6;">Click here to complete the service form</a>
      </li>
    </ol>

    <p>If you have any questions before our call, feel free to reply to this email.</p>

    <p>Looking forward to connecting!</p>

    <p>Warm regards,<br/>
    <strong>Harsha Jayanth</strong><br/>
    Founder, JAYMELO SOUNDLAB</p>
  </div>
`;


    await replyEmail(replySubject, replyHtml, validatedData.email);

    res.json({
      message: "Contact form submitted and auto-reply sent",
      id: submission.id,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Invalid form data",
        errors: error.errors,
      });
    }

    console.error("❌ Failed to submit contact form:", error);
    res.status(500).json({ message: "Failed to submit contact form" });
  }
});



  const httpServer = createServer(app);
  return httpServer;
}
