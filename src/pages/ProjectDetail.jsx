import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteConfig } from '../data/SiteContext';
import Lightbox from '../components/Lightbox';

export default function ProjectDetail() {
  const { projectName } = useParams();
  const { projects } = useSiteConfig();

  const project = projects?.find((p) => p.name === projectName);
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
    <div className="page-enter h-screen overflow-hidden relative bg-white">
      {/* 固定顶栏 */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/projects"
            className="text-xs text-gray-400 hover:text-accent tracking-wide uppercase transition-colors"
          >
            ← 项目列表
          </Link>
          <div className="text-right">
            <h1 className="text-sm font-serif text-gray-900 font-semibold">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-xs text-gray-400 mt-0.5 hidden md:block">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 滚动区域 */}
      <div
        className="h-full overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {allWorks.map((work, idx) => (
          <div
            key={work.imageUrl}
            className="h-screen flex flex-col items-center justify-center px-6"
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* 图片 */}
            <div
              className="flex-1 flex items-center justify-center w-full max-w-5xl cursor-pointer group pt-14"
              onClick={() => setSelectedWork(work)}
            >
              <img
                src={work.thumbnailUrl || work.imageUrl}
                alt={work.title}
                className="max-w-full max-h-[75vh] object-contain transition-opacity duration-300 group-hover:opacity-90"
              />
            </div>

            {/* 文字信息 */}
            <div className="w-full max-w-5xl pb-8 text-center flex-shrink-0">
              <h2 className="text-sm font-medium text-gray-900">
                {work.title}
              </h2>
              <div className="mt-1 flex items-center justify-center gap-2">
                {work.location && (
                  <span className="text-xs text-gray-400">{work.location}</span>
                )}
                {work.date && (
                  <span className="text-xs text-gray-300">{work.date}</span>
                )}
              </div>
              {work.description && (
                <p className="mt-1 text-xs text-gray-400">{work.description}</p>
              )}
            </div>

            {/* 页码 */}
            <div className="absolute bottom-6 right-6 text-xs text-gray-300">
              {idx + 1} / {allWorks.length}
            </div>
          </div>
        ))}
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
