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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projects.map((project) => (
              <ProjectCard key={project.name} project={project} />
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
