
import { readFileSync } from "fs";
import { createClient } from "@sanity/client";
import {
  PROJECT_CATEGORIES,
  ALL_PROJECTS,
  projectSlug,
} from "../lib/projects-data";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN!;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function main() {
  const tx = client.transaction();

  PROJECT_CATEGORIES.forEach((c, i) => {
    tx.createOrReplace({
      _id: `category.${c.slug}`,
      _type: "category",
      title: c.title,
      slug: { _type: "slug", current: c.slug },
      description: c.description,
      cover: c.cover,
      order: i,
    });
  });

  ALL_PROJECTS.forEach((p) => {
    tx.createOrReplace({
      _id: `project.${p.id}`,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: projectSlug(p) },
      description: p.description,
      thumbnail: p.thumbnail,
      video: p.video ?? null,
      youtubeId: p.youtubeId ?? null,
      category: { _type: "reference", _ref: `category.${p.category}` },
      order: p.id,
    });
  });

  const res = await tx.commit();
  console.log(
    `✓ Migrated ${PROJECT_CATEGORIES.length} categories + ${ALL_PROJECTS.length} projects ` +
      `(${res.results.length} documents) to ${projectId}/${dataset}`,
  );
}

main().catch((e) => {
  console.error("Migration failed:", e.message || e);
  process.exit(1);
});
