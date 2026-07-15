import { createContext, useContext, useState, useEffect } from 'react';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((err) => console.error('加载 config.json 失败:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-400">加载失败，请刷新页面重试</p>
      </div>
    );
  }

  return <SiteContext.Provider value={config}>{children}</SiteContext.Provider>;
}

export function useSiteConfig() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSiteConfig 必须在 SiteProvider 内使用');
  return ctx;
}
