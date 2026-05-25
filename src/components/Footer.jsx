import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error('Please provide an email address to subscribe.');
      return;
    }
    toast.success('Thanks for subscribing!');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-extrabold tracking-tight">
              Sri Thanam<span className="text-accent">Papers</span>
            </Link>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              Your premium destination for stationery, craft items, and office supplies. Elevate every workspace.
            </p>
            <div className="flex gap-4 mt-6">
              {[{ Icon: FiInstagram, label: 'Instagram' }, { Icon: FiTwitter, label: 'Twitter' }, { Icon: FiFacebook, label: 'Facebook' }].map(({ Icon, label }, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toast.info(`${label} page coming soon`)}
                  aria-label={`Visit our ${label}`}
                  className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-5 text-lg">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {[['Home', '/'], ['Shop All', '/products'], ['Wishlist', '/wishlist'], ['Cart', '/cart'], ['My Account', '/profile']].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="hover:text-accent transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold mb-5 text-lg">Customer Service</h4>
            <ul className="space-y-3 text-sm text-white/60">
              {['Contact Us', 'Shipping Policy', 'Returns & Exchanges', 'FAQs', 'Track Order'].map(item => (
                <li key={item}>
                  <button type="button" onClick={() => toast.info(`${item} — coming soon`)} className="hover:text-accent transition-colors text-left">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="font-bold mb-5 text-lg">Get In Touch</h4>
            <div className="space-y-3 text-sm text-white/60 mb-6">
              <div className="flex items-center gap-2"><FiMail className="w-4 h-4 text-accent flex-shrink-0" /><span>hello@srithanampapers.com</span></div>
              <div className="flex items-center gap-2"><FiPhone className="w-4 h-4 text-accent flex-shrink-0" /><span>+91 98765 43210</span></div>
              <div className="flex items-center gap-2"><FiMapPin className="w-4 h-4 text-accent flex-shrink-0" /><span>Chennai, Tamil Nadu, India</span></div>
            </div>
            <p className="text-sm text-white/60 mb-3">Subscribe for exclusive offers:</p>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="px-3 py-2 w-full rounded-l-lg focus:outline-none text-gray-900 text-sm"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="bg-accent hover:bg-yellow-500 transition-colors px-3 py-2 rounded-r-lg font-bold text-sm flex-shrink-0"
              >
                Go
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} Sri Thanam Papers. All rights reserved.</p>
          <div className="flex gap-6">
            <button type="button" onClick={() => toast.info('Privacy Policy — coming soon')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button type="button" onClick={() => toast.info('Terms of Service — coming soon')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
