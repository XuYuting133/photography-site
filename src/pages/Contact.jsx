import { useSiteConfig } from '../data/SiteContext';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  const { siteConfig } = useSiteConfig();

  return (
    <div className="page-enter pt-28 pb-24">
      <div className={siteConfig.formEmbedUrl ? 'max-w-2xl mx-auto px-6' : 'max-w-xl mx-auto px-6'}>
        <div className="text-center mb-12">
          <h1 className="font-serif text-2xl md:text-3xl text-gray-900 font-semibold">联系我</h1>
          <p className="mt-3 text-sm text-gray-400 tracking-wide leading-relaxed">
            如有合作意向、作品授权或其他问题，欢迎随时联系。
          </p>
        </div>

        {siteConfig.formEmbedUrl ? (
          <div className="rounded-sm overflow-hidden frame-border">
            <iframe
              src={siteConfig.formEmbedUrl}
              width="100%"
              height="700"
              frameBorder="0"
              title="联系表单"
              className="bg-white"
            />
          </div>
        ) : (
          <ContactForm />
        )}

        <div className="mt-16 pt-10 border-t border-gray-100">
          <h2 className="font-serif text-lg text-gray-900 font-semibold text-center mb-6">其他方式</h2>
          <div className="flex flex-col items-center gap-3">
            {siteConfig.email && (
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-gray-500 hover:text-accent transition-colors tracking-wide">
                {siteConfig.email}
              </a>
            )}
            {siteConfig.instagram && (
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-accent transition-colors tracking-wide">
                Instagram
              </a>
            )}
            {siteConfig.xiaohongshu && (
              <span className="text-sm text-gray-400 tracking-wide">小红书: {siteConfig.xiaohongshu}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
