import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useSiteConfig } from '../data/SiteContext';
import Footer from './Footer';

export default function Layout() {
  const { siteConfig } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: '首页' },
    { to: '/works', label: '作品' },
    { to: '/about', label: '关于' },
    { to: '/contact', label: '联系' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-serif font-semibold tracking-wide text-gray-900 hover:text-accent transition-colors"
          >
            {siteConfig.nameEn}
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wider uppercase transition-colors hover:text-accent ${
                  location.pathname === link.to
                    ? 'text-accent'
                    : 'text-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
          >
            <span
              className={`block w-5 h-px bg-gray-900 transition-all ${
                menuOpen ? 'rotate-45 translate-y-[5px]' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-gray-900 transition-all ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-px bg-gray-900 transition-all ${
                menuOpen ? '-rotate-45 -translate-y-[5px]' : ''
              }`}
            />
          </button>
        </nav>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? 'max-h-64' : 'max-h-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-sm px-6 pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm tracking-wider uppercase py-2 transition-colors hover:text-accent ${
                  location.pathname === link.to
                    ? 'text-accent'
                    : 'text-gray-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
