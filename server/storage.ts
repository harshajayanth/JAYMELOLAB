import type {
  Testimonial,
  ContactSubmission,
  Project,
  InsertContactSubmission,
} from "@shared/schema";

import testimonials from "common/data/testimonials.json";
import projects from "common/data/projects.json";

export interface IStorage {
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  getProjects(): Promise<Project[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class JsonStorage implements IStorage {
  private contactSubmissions: Map<number, ContactSubmission> = new Map();
  private currentSubmissionId = 1;

  async getTestimonials(): Promise<Testimonial[]> {
    return testimonials as Testimonial[];
  }

  async getProjects(): Promise<Project[]> {
  return projects.map(p => ({
    ...p,
    createdAt: p.createdAt ? new Date(p.createdAt) : null
  })) as Project[];
}


  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return testimonials.filter(t => t.featured) as Testimonial[];
  }

  async createContactSubmission(
    insertSubmission: InsertContactSubmission
  ): Promise<ContactSubmission> {
    const id = this.currentSubmissionId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }
}

export const storage = new JsonStorage();
