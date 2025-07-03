// import type {
//   ContactSubmission,
//   InsertContactSubmission,
// } from "@shared/schema";

// export interface IStorage {
//   createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
// }

// export class JsonStorage implements IStorage {
//   private contactSubmissions: Map<number, ContactSubmission> = new Map();
//   private currentSubmissionId = 1;

//   async createContactSubmission(
//     insertSubmission: InsertContactSubmission
//   ): Promise<ContactSubmission> {
//     const id = this.currentSubmissionId++;
//     const submission: ContactSubmission = {
//       ...insertSubmission,
//       id,
//       createdAt: new Date(),
//     };
//     this.contactSubmissions.set(id, submission);
//     return submission;
//   }
// }

// export const storage = new JsonStorage();
