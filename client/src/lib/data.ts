export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
  rating: number;
  featured: boolean;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  audioUrl: string | null;
  tags: string[] | null;
  featured: boolean | null;
  createdAt: Date | null;
}

// Fetch testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const res = await fetch("/data/testimonials.json");
  if (!res.ok) throw new Error("Failed to load testimonials");
  return res.json();
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  return testimonials.filter((t) => t.featured);
}

// Fetch projects
export async function getProjects(): Promise<Project[]> {
  const res = await fetch("/data/projects.json");
  if (!res.ok) throw new Error("Failed to load projects");
  return res.json();
}
