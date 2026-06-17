import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectPlayer } from "@/app/projects/_components/project-player";
import {
  PROJECT_CATEGORY_TITLE_MAP,
  projectSlug,
  projectThumbnail,
} from "@/lib/projects-data";
import { getProjects, findProject, getProjectsByCategory } from "@/lib/sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    category: project.category,
    slug: projectSlug(project),
  }));
}

interface ProjectPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const project = await findProject(params.category, params.slug);

  if (!project) {
    notFound();
  }

  const categoryTitle =
    PROJECT_CATEGORY_TITLE_MAP[project.category] ?? "Projects";

  const related = (await getProjectsByCategory(project.category))
    .filter((p) => p.id !== project.id)
    .slice(0, 4);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">

          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-white/50">
            <Link href="/projects" className="hover:text-cyan-300">
              Projects
            </Link>
            <span>/</span>
            <Link
              href={`/projects/${project.category}`}
              className="hover:text-cyan-300"
            >
              {categoryTitle}
            </Link>
            <span>/</span>
            <span className="text-white/80">{project.title}</span>
          </div>

          <ProjectPlayer
            src={project.video}
            poster={projectThumbnail(project)}
            title={project.title}
            youtubeId={project.youtubeId}
          />

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-200/90">
                {categoryTitle}
              </span>
              <h1 className="text-3xl font-bold md:text-5xl">{project.title}</h1>
              <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">
                {project.description}
              </p>
            </div>

            <Link
              href="/projects"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/10"
            >
              ← All projects
            </Link>
          </div>

          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="mb-8 text-2xl font-semibold">
                More in {categoryTitle}
              </h2>
              <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
                {related.map((p, index) => (
                  <ProjectCard key={p.id} project={p} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
