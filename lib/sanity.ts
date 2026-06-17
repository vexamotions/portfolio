import { createClient } from "@sanity/client";
import type { Project } from "@/types/types";
import type { ProjectCategoryMeta } from "@/lib/projects-data";

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p11i81o5",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const CATEGORY_QUERY = `*[_type=="category"]|order(order asc){
  "slug": slug.current, title, description, cover
}`;

const PROJECT_QUERY = `*[_type=="project"]|order(order asc){
  "id": order, title, description, thumbnail, video, youtubeId,
  "category": category->slug.current
}`;

export async function getCategories(): Promise<ProjectCategoryMeta[]> {
  return sanity.fetch(CATEGORY_QUERY);
}

export async function getProjects(): Promise<Project[]> {
  return sanity.fetch(PROJECT_QUERY);
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  return sanity.fetch(
    `*[_type=="project" && category->slug.current==$category]|order(order asc){
      "id": order, title, description, thumbnail, video, youtubeId,
      "category": category->slug.current
    }`,
    { category },
  );
}

export async function findProject(
  category: string,
  slug: string,
): Promise<Project | null> {
  const all = await getProjectsByCategory(category);
  const { slugify } = await import("@/lib/projects-data");
  return all.find((p) => slugify(p.title) === slug) ?? null;
}
