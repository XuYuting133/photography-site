import { useEffect, useCallback } from 'react';

export default function Lightbox({ work, works, onClose, onNavigate }) {
  const currentIndex = works.findIndex((w) => w.id === work.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < works.length - 1;

  // 键盘事件
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onNavigate(works[currentIndex - 1]);
          break;
        case 'ArrowRight':
          if (hasNext) onNavigate(works[currentIndex + 1]);
          break;
        default:
          break;
      }
    },
    [onClose, onNavigate, hasPrev, hasNext, works, currentIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="lightbox-overlay fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 关闭按钮 */}
      <button
        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="关闭"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* 上一张 */}
      {hasPrev && (
        <button
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(works[currentIndex - 1]);
          }}
          aria-label="上一张"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* 下一张 */}
      {hasNext && (
        <button
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(works[currentIndex + 1]);
          }}
          aria-label="下一张"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* 图片 */}
      <div
        className="lightbox-image max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={work.imageUrl}
          alt={work.title}
          className="max-w-full max-h-[80vh] object-contain rounded-sm"
        />
        {/* 图片信息 */}
        <div className="mt-4 text-center">
          <h3 className="text-white text-sm font-medium">{work.title}</h3>
          <p className="text-white/50 text-xs mt-1">
            {[work.location, work.date].filter(Boolean).join(' · ')}
          </p>
          {work.description && (
            <p className="text-white/40 text-xs mt-1 max-w-md">{work.description}</p>
          )}
        </div>
      </div>

      {/* 计数器 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs">
        {currentIndex + 1} / {works.length}
      </div>
    </div>
  );
}
