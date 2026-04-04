import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import Link from 'next/link';
import Image from 'next/image';
import { MorphingBlob } from '@/components/MorphingBlob';
import { PROJECT_CATEGORIES } from '@/lib/projects-data';

const AllProjects: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <MorphingBlob />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-300/70">Projects Library</p>
            <h1 className="text-4xl font-bold md:text-6xl">Choose a creative lane</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 md:text-lg">
              Explore our work by category. Click any card to open all projects in that section.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {PROJECT_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/projects/${category.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={category.cover}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold">{category.title}</h2>
                  <p className="mt-2 text-sm text-white/70">{category.description}</p>
                  <span className="mt-5 inline-flex items-center text-sm font-medium text-cyan-300 transition group-hover:text-cyan-200">
                    View projects →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProjects;
