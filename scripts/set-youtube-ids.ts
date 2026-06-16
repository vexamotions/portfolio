
import { readFileSync } from "fs";
import { createClient } from "@sanity/client";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const YOUTUBE_IDS: Record<number, string> = {

};

async function main() {
  const entries = Object.entries(YOUTUBE_IDS).filter(([, v]) => v);
  if (!entries.length) {
    console.log("No YouTube IDs filled in yet — edit YOUTUBE_IDS and re-run.");
    return;
  }
  const tx = client.transaction();
  for (const [id, youtubeId] of entries) {
    tx.patch(`project.${id}`, (p) => p.set({ youtubeId }));
  }
  await tx.commit();
  console.log(`✓ Set youtubeId on ${entries.length} projects`);
}

main().catch((e) => {
  console.error("Failed:", e.message || e);
  process.exit(1);
});
