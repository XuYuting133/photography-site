import { useState } from 'react';
import { useSiteConfig } from '../data/SiteContext';

export default function ContactForm() {
  const { siteConfig } = useSiteConfig();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch(siteConfig.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm text-gray-500 mb-2 tracking-wide">姓名</label>
        <input
          id="name" type="text" name="name" required
          value={formData.name} onChange={handleChange}
          className="form-input w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-300"
          placeholder="你的名字"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-gray-500 mb-2 tracking-wide">邮箱</label>
        <input
          id="email" type="email" name="email" required
          value={formData.email} onChange={handleChange}
          className="form-input w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-300"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-gray-500 mb-2 tracking-wide">留言</label>
        <textarea
          id="message" name="message" required rows={5}
          value={formData.message} onChange={handleChange}
          className="form-input w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 text-sm text-gray-900 transition-colors placeholder:text-gray-300 resize-none"
          placeholder="期待与你的交流..."
        />
      </div>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className={`w-full py-3 text-sm tracking-widest uppercase rounded-sm transition-all duration-300 ${
          status === 'submitting'
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-accent'
        }`}
      >
        {status === 'submitting' ? '发送中...' : '发送留言'}
      </button>
      {status === 'success' && (
        <p className="text-center text-sm text-green-600">感谢你的留言！我会尽快回复。</p>
      )}
      {status === 'error' && (
        <p className="text-center text-sm text-red-500">
          发送失败，请稍后重试。你也可以直接发送邮件至 {siteConfig.email}
        </p>
      )}
    </form>
  );
}
