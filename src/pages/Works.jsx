import { useState, useCallback } from 'react';
import { useSiteConfig } from '../data/SiteContext';
import Gallery from '../components/Gallery';
import Lightbox from '../components/Lightbox';

export default function Works() {
  const { works } = useSiteConfig();
  const [selectedWork, setSelectedWork] = useState(null);

  const openLightbox = (work) => setSelectedWork(work);
  const closeLightbox = useCallback(() => setSelectedWork(null), []);
  const navigateTo = useCallback((work) => setSelectedWork(work), []);

  return (
    <div className="page-enter pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900 font-semibold">全部作品</h1>
          <p className="mt-3 text-sm text-gray-400 tracking-wide">Portfolio</p>
        </div>
        {works.length > 0 ? (
          <Gallery works={works} onImageClick={openLightbox} />
        ) : (
          <p className="text-center text-gray-400 text-sm py-20">作品正在整理中，敬请期待...</p>
        )}
      </div>
      {selectedWork && (
        <Lightbox work={selectedWork} works={works} onClose={closeLightbox} onNavigate={navigateTo} />
      )}
    </div>
  );
}
