import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSiteConfig } from '../data/SiteContext';
import Lightbox from '../components/Lightbox';

export default function ProjectDetail() {
  const { projectName } = useParams();
  const { projects } = useSiteConfig();

  const project = projects?.find((p) => p.name === projectName);
  const [selectedWork, setSelectedWork] = useState(null);
  const workRefs = useRef([]);

  // Enable scroll-snap on <html> while this page is mounted
  useEffect(() => {
    document.documentElement.classList.add('snap-page');
    return () => document.documentElement.classList.remove('snap-page');
  }, []);

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

  const scrollToWork = (idx) => {
    workRefs.current[idx]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-enter">
      {/* Fixed back button — always visible, sits just below nav */}
      <Link
        to="/projects"
        className="fixed top-20 left-4 sm:left-6 z-50 text-xs text-gray-400 hover:text-accent tracking-wide uppercase transition-colors bg-white/80 backdrop-blur-sm px-2 py-1 rounded-sm"
      >
        ← <span className="hidden sm:inline">项目列表</span>
        <span className="sm:hidden">返回</span>
      </Link>

      {/* ===== Screen 1: Project info + thumbnail row ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6">
        <div className="text-center max-w-2xl">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-900 font-semibold">
            {project.name}
          </h1>
          {project.description && (
            <p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Thumbnail row */}
        <div className="mt-10 md:mt-14 w-full max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-5">
            {allWorks.map((work, idx) => (
              <button
                key={idx}
                onClick={() => scrollToWork(idx)}
                className="group text-left focus:outline-none"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm frame-border">
                  <img
                    src={work.thumbnailUrl || work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
                <p className="mt-2 text-xs text-gray-500 group-hover:text-accent transition-colors text-center truncate">
                  {work.title}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll-down indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-300 tracking-wider">向下滚动</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ===== Screens 2-N: Full-screen scroll-snap works ===== */}
      {allWorks.map((work, idx) => (
        <section
          key={idx}
          ref={(el) => (workRefs.current[idx] = el)}
          className="snap-section flex flex-col items-center justify-center px-4 sm:px-6 snap-start"
        >
          {/* Image area */}
          <div
            className="flex-1 flex items-center justify-center w-full max-w-5xl cursor-pointer group pt-16 sm:pt-20"
            onClick={() => setSelectedWork(work)}
          >
            <img
              src={work.thumbnailUrl || work.imageUrl}
              alt={work.title}
              className="max-w-full max-h-[70vh] landscape:max-h-[55vh] object-contain transition-opacity duration-300 group-hover:opacity-90"
            />
          </div>

          {/* Text info */}
          <div className="w-full max-w-5xl pb-6 sm:pb-8 text-center flex-shrink-0">
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

          {/* Page counter */}
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 text-xs text-gray-300">
            {idx + 1} / {allWorks.length}
          </div>
        </section>
      ))}

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
