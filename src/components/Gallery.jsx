export default function Gallery({ works, onImageClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {works.map((work) => (
        <div
          key={work.id}
          className="group cursor-pointer overflow-hidden rounded-sm frame-border"
          onClick={() => onImageClick(work)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={work.thumbnailUrl || work.imageUrl}
              alt={work.title}
              className="gallery-image w-full h-full object-cover"
              loading="lazy"
            />
            {/* Hover 遮罩 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-end">
              <div className="p-4 w-full translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white text-sm font-medium drop-shadow-md">
                  {work.title}
                </h3>
                {work.location && (
                  <p className="text-white/80 text-xs mt-0.5 drop-shadow-md">
                    {work.location}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
