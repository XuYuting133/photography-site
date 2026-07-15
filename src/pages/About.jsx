import { useSiteConfig } from '../data/SiteContext';

export default function About() {
  const { siteConfig } = useSiteConfig();

  return (
    <div className="page-enter pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center md:items-start">
          <div className="w-40 h-40 md:w-56 md:h-56 flex-shrink-0 rounded-full overflow-hidden frame-border">
            <img src={siteConfig.avatarUrl} alt={siteConfig.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-2xl md:text-3xl text-gray-900 font-semibold">{siteConfig.name}</h1>
            <p className="mt-2 text-sm text-gray-400 tracking-wide uppercase">Photographer</p>
            <div className="mt-6 space-y-4">
              {siteConfig.bio.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-sm text-gray-600 leading-relaxed tracking-wide">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        {siteConfig.experiences && siteConfig.experiences.length > 0 && (
          <div className="mt-20 md:mt-24">
            <h2 className="font-serif text-xl text-gray-900 font-semibold text-center mb-10">经历</h2>
            <div className="max-w-md mx-auto">
              {siteConfig.experiences.map((exp, idx) => (
                <div key={idx} className="flex gap-6 py-3 border-b border-gray-100 last:border-b-0">
                  <span className="text-xs text-accent font-medium w-12 flex-shrink-0 pt-0.5">{exp.year}</span>
                  <span className="text-sm text-gray-600">{exp.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
