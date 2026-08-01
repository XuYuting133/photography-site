import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const coverUrl = project.works?.[0]?.thumbnailUrl || project.works?.[0]?.imageUrl;

  return (
    <Link
      to={`/projects/${encodeURIComponent(project.name)}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm frame-border">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      </div>
      <div className="mt-4">
        <h3 className="font-serif text-lg text-gray-900 group-hover:text-accent transition-colors">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-gray-400 leading-relaxed line-clamp-2">
          {project.description}
        </p>
        <p className="mt-2 text-xs text-gray-300 tracking-wide uppercase">
          {project.works?.length || 0} 张作品
        </p>
      </div>
    </Link>
  );
}
