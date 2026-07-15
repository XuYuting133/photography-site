import { Link } from 'react-router-dom';
import { useSiteConfig } from '../data/SiteContext';
import Gallery from '../components/Gallery';

export default function Home() {
  const { works, siteConfig } = useSiteConfig();
  const featuredWorks = works.filter((w) => w.featured);

  return (
    <div className="page-enter">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={featuredWorks[0]?.imageUrl || works[0]?.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30" />
        <div className="relative z-10 text-center px-6 max-w-2xl">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold text-gray-900 tracking-wide leading-tight">
            {siteConfig.nameEn}
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-600 font-light tracking-wider leading-relaxed">
            {siteConfig.tagline}
          </p>
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link
              to="/works"
              className="px-8 py-3 bg-gray-900 text-white text-sm tracking-widest uppercase rounded-sm hover:bg-accent transition-colors duration-300"
            >
              浏览作品
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 border border-gray-300 text-gray-700 text-sm tracking-widest uppercase rounded-sm hover:border-gray-900 hover:text-gray-900 transition-colors duration-300"
            >
              关于我
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-400">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 font-semibold">精选作品</h2>
          <p className="mt-3 text-sm text-gray-400 tracking-wide">Selected Works</p>
        </div>
        <Gallery works={featuredWorks} />
        <div className="mt-12 text-center">
          <Link to="/works" className="inline-block text-sm text-gray-400 hover:text-accent tracking-widest uppercase transition-colors">
            查看全部作品 →
          </Link>
        </div>
      </section>
    </div>
  );
}
