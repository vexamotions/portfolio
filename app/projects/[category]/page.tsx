import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { ProjectCard } from "@/components/ProjectCard";
import {
  ALL_PROJECTS,
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_TITLE_MAP,
  type ProjectCategorySlug,
} from "@/lib/projects-data";
import Link from "next/link";

export async function generateStaticParams() {
  return PROJECT_CATEGORIES.map((item) => ({
    category: item.slug,
  }));
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryProjectsPage({ params }: CategoryPageProps) {
  const category = params.category as ProjectCategorySlug;
  const isValidCategory = category in PROJECT_CATEGORY_TITLE_MAP;

  const categoryMeta = PROJECT_CATEGORIES.find(
    (item) => item.slug === category,
  );

  const projects = ALL_PROJECTS.filter(
    (project) => project.category === category,
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="mb-6 inline-flex text-sm text-cyan-300 hover:text-cyan-200"
          >
            ← Back to all categories
          </Link>

          {!isValidCategory ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h1 className="text-3xl font-bold">Category not found</h1>
              <p className="mt-3 text-white/70">
                Please choose one of the available categories from the projects
                page.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10 max-w-3xl">
                <h1 className="text-4xl font-bold md:text-6xl">
                  {categoryMeta?.title}
                </h1>
                <p className="mt-3 text-white/70">
                  {categoryMeta?.description}
                </p>
              </div>

              {projects.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/70">
                    Coming soon
                  </p>
                  <p className="mt-3 text-lg text-white/70">
                    Projects for this category are being added. Check back shortly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
