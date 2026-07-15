import { useSiteConfig } from '../data/SiteContext';

export default function Footer() {
  const { siteConfig } = useSiteConfig();

  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-400 tracking-wide">
          {siteConfig.copyright}
        </p>
        <div className="flex items-center gap-5">
          {siteConfig.instagram && (
            <a
              href={siteConfig.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-accent transition-colors tracking-wide uppercase"
            >
              Instagram
            </a>
          )}
          {siteConfig.xiaohongshu && (
            <span className="text-xs text-gray-400 tracking-wide">
              小红书: {siteConfig.xiaohongshu}
            </span>
          )}
          {siteConfig.email && (
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-xs text-gray-400 hover:text-accent transition-colors tracking-wide uppercase"
            >
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
