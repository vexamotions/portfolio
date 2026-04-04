import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import { MorphingBlob } from '@/components/MorphingBlob';
import { ProjectCard } from '@/components/ProjectCard';
import {
  ALL_PROJECTS,
  PROJECT_CATEGORIES,
  type ProjectCategorySlug,
} from '@/lib/projects-data';
import Link from 'next/link';

interface CategoryProjectsViewProps {
  category: ProjectCategorySlug;
}

export default function CategoryProjectsView({ category }: CategoryProjectsViewProps) {
  const categoryMeta = PROJECT_CATEGORIES.find((item) => item.slug === category);
  const projects = ALL_PROJECTS.filter((project) => project.category === category);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <MorphingBlob />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
          <Link href="/projects" className="mb-6 inline-flex text-sm text-cyan-300 hover:text-cyan-200">
            ← Back to all categories
          </Link>

          <div className="mb-10 max-w-3xl">
            <h1 className="text-4xl font-bold md:text-6xl">{categoryMeta?.title}</h1>
            <p className="mt-3 text-white/70">{categoryMeta?.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
