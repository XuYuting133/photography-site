import { useSiteConfig } from '../data/SiteContext';
import ProjectCard from '../components/ProjectCard';

export default function Projects() {
  const { projects } = useSiteConfig();

  return (
    <div className="page-enter pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900 font-semibold">
            项目
          </h1>
          <p className="mt-3 text-sm text-gray-400 tracking-wide">
            Projects
          </p>
        </div>

        {projects && projects.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8 md:gap-10">
            {projects.map((project) => (
              <div key={project.name} className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.75rem)] max-w-sm">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-20">
            项目正在整理中，敬请期待...
          </p>
        )}
      </div>
    </div>
  );
}
