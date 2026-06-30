import React from 'react';
import {
  Activity,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone } from
'lucide-react';
import { Link } from 'react-router-dom';
// Custom Pinterest icon (not in lucide-react)
function PinterestIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      
      <line x1="12" y1="22" x2="12" y2="12" />
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4c0 1.63 1.05 3.16 2.5 3.76" />
      <circle cx="12" cy="12" r="10" />
    </svg>);

}
const socials = [
{
  Icon: Twitter,
  label: 'X (Twitter)',
  href: 'https://x.com/Metrixova'
},
{
  Icon: Linkedin,
  label: 'LinkedIn',
  href: 'https://www.linkedin.com/company/metrixova/'
},
{
  Icon: Facebook,
  label: 'Facebook',
  href: 'https://www.facebook.com/Metrixova/'
},
{
  Icon: Youtube,
  label: 'YouTube',
  href: 'https://www.youtube.com/@Metrixova'
},
{
  Icon: PinterestIcon,
  label: 'Pinterest',
  href: 'https://www.pinterest.com/Metrixova/'
}];

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Observability Engine', to: '/' },
      { label: 'AI Metrics Intelligence', to: '/' },
      { label: 'Predictive Analytics', to: '/' },
      { label: 'Integrations', to: '/' },
      { label: 'Developer API', to: '/' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/' },
      { label: 'Contact', to: '/#contact' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Privacy Policy', to: '/privacy' }
    ]
  }
];

export function FooterSection({ onOpenModal }: {onOpenModal: () => void;}) {
  return (
    <footer className="bg-metrix-bg border-t border-metrix-surface pt-32 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-metrix-surface pb-14 mb-14">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="text-metrix-crimson-bright w-6 h-6" />
              <span className="font-display text-2xl tracking-tight text-metrix-white">
                METRIXOVA
              </span>
            </div>
            <p className="text-sm text-metrix-muted leading-relaxed max-w-md">
              Intelligent observability for modern infrastructure. Detect anomalies faster, reduce incident noise, and keep systems reliable. 
            </p>
            <button
              onClick={onOpenModal}
              className="inline-flex items-center justify-center px-7 py-3 bg-metrix-crimson-bright hover:bg-metrix-crimson text-metrix-white rounded-full font-medium transition-colors text-sm">
              Request Early Access
            </button>
          </div>

          <div className="grid grid-cols-2 gap-10">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-mono text-metrix-light uppercase tracking-widest mb-5">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {col.title === 'Product' ? (
                        <span className="text-sm text-metrix-muted opacity-60 cursor-not-allowed select-none">
                          {link.label}
                        </span>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-sm text-metrix-muted hover:text-metrix-white transition-colors">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-mono text-metrix-light uppercase tracking-widest mb-5">
                Contact
              </h3>
              <div className="space-y-4 text-sm text-metrix-muted">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-metrix-crimson-bright" />
                  <a href="mailto:hello@metrixova.com" className="hover:text-metrix-white transition-colors">
                    help@metrixova.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-metrix-crimson-bright" />
                  <span>2049 Century Park E, Los Angeles, CA 90067, USA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-metrix-crimson-bright" />
                  <span>+1 (310) 661-5248</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono text-metrix-light uppercase tracking-widest mb-5">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {socials.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full border border-metrix-surface flex items-center justify-center text-metrix-muted hover:text-metrix-white hover:border-metrix-crimson-bright hover:bg-metrix-surface transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-metrix-muted/70">
          <div>© 2026 Metrixova. All rights reserved.</div>
        </div>
      </div>
    </footer>);

}