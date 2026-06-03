import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiSend, FiTwitter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const quickLinks = [
  ['Home', '/'],
  ['Shop All', '/products'],
  ['Wishlist', '/wishlist'],
  ['Cart', '/cart'],
  ['My Account', '/profile'],
];

const serviceLinks = ['Contact Us', 'Shipping Policy', 'Returns & Exchanges', 'FAQs', 'Track Order'];

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please provide an email address to subscribe.');
      return;
    }
    toast.success('Thanks for subscribing!');
    setNewsletterEmail('');
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_1.15fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sm font-black text-primary">
                ST
              </span>
              <span>
                <span className="block text-xl font-black leading-6">Sri Thanam</span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-accent">Papers</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Premium stationery, paper goods, craft essentials, and office supplies curated for focused work and creative study.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: FiInstagram, label: 'Instagram' },
                { Icon: FiTwitter, label: 'Twitter' },
                { Icon: FiFacebook, label: 'Facebook' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toast.info(`${label} page coming soon`)}
                  aria-label={`Visit our ${label}`}
                  className="focus-ring flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-accent/40 hover:bg-accent hover:text-slate-950"
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.18em] text-white">Quick Links</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {quickLinks.map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-accent">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.18em] text-white">Service</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => toast.info(`${item} - coming soon`)}
                    className="text-left transition hover:text-accent"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.18em] text-white">Get In Touch</h4>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="flex gap-3">
                <FiMail className="mt-1 flex-shrink-0 text-accent" />
                <span>srithanampapers@gmail.com</span>
              </div>
              <div className="flex gap-3">
                <FiPhone className="mt-1 flex-shrink-0 text-accent" />
                <span>+91 8610340098</span>
              </div>
              <div className="flex gap-3">
                <FiMapPin className="mt-1 flex-shrink-0 text-accent" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Your email"
                  aria-label="Email address"
                  className="focus-ring min-w-0 flex-1 rounded-xl border border-transparent bg-white px-3 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="focus-ring inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-slate-950 transition hover:bg-amber-300"
                >
                  <FiSend />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Sri Thanam Papers. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <button type="button" onClick={() => toast.info('Privacy Policy - coming soon')} className="transition hover:text-white">
              Privacy Policy
            </button>
            <button type="button" onClick={() => toast.info('Terms of Service - coming soon')} className="transition hover:text-white">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
