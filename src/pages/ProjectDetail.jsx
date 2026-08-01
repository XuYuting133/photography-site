import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteConfig } from '../data/SiteContext';
import Lightbox from '../components/Lightbox';

export default function ProjectDetail() {
  const { projectName } = useParams();
  const { projects } = useSiteConfig();

  const project = projects?.find(
    (p) => p.name === projectName
  );

  const [selectedWork, setSelectedWork] = useState(null);

  if (!project) {
    return (
      <div className="page-enter pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">项目不存在</p>
          <Link to="/projects" className="mt-4 inline-block text-sm text-accent hover:underline">
            ← 返回项目列表
          </Link>
        </div>
      </div>
    );
  }

  const allWorks = project.works || [];

  return (
    <div className="page-enter pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* 返回链接 */}
        <Link
          to="/projects"
          className="inline-block text-sm text-gray-400 hover:text-accent tracking-wide uppercase transition-colors mb-8"
        >
          ← 项目列表
        </Link>

        {/* 项目标题 */}
        <div className="mb-12">
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900 font-semibold">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-3 text-sm text-gray-500 leading-relaxed max-w-xl">
              {project.description}
            </p>
          )}
        </div>

        {/* 纵向作品列表 */}
        {allWorks.length > 0 ? (
          <div className="flex flex-col gap-16">
            {allWorks.map((work) => (
              <div
                key={work.imageUrl}
                className="cursor-pointer group"
                onClick={() => setSelectedWork(work)}
              >
                <div className="relative overflow-hidden rounded-sm frame-border">
                  <img
                    src={work.thumbnailUrl || work.imageUrl}
                    alt={work.title}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                </div>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {work.title}
                  </h3>
                  {work.location && (
                    <span className="text-xs text-gray-400">
                      {work.location}
                    </span>
                  )}
                  {work.date && (
                    <span className="text-xs text-gray-300">
                      {work.date}
                    </span>
                  )}
                </div>
                {work.description && (
                  <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                    {work.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-20">
            暂无作品
          </p>
        )}
      </div>

      {/* Lightbox */}
      {selectedWork && (
        <Lightbox
          work={selectedWork}
          works={allWorks}
          onClose={() => setSelectedWork(null)}
          onNavigate={setSelectedWork}
        />
      )}
    </div>
  );
}
