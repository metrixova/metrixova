import React from 'react';
import {
  Activity,
  Linkedin,
  Facebook,
  Youtube,
  Mail,
  MapPin,
  Phone,
  X,
} from
'lucide-react';
import { Link } from 'react-router-dom';
const logo = new URL('../assets/logo.svg', import.meta.url).href;
// Custom Pinterest icon
function PinterestIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.25a9.75 9.75 0 0 0-3.54 18.66c-.05-.43-.1-1.09.02-1.56l1.2-5.13s-.3-.61-.3-1.52c0-1.42.82-2.48 1.85-2.48.87 0 1.29.65 1.29 1.43 0 .87-.55 2.17-.84 3.37-.24 1.01.51 1.83 1.52 1.83 1.82 0 3.21-1.92 3.21-4.68 0-2.45-1.76-4.16-4.27-4.16-2.9 0-4.6 2.17-4.6 4.41 0 .87.33 1.8.75 2.31.08.1.09.19.06.29l-.28 1.14c-.04.18-.15.22-.34.13-1.26-.59-1.93-2.43-1.93-3.9 0-3.18 2.31-6.1 6.67-6.1 3.5 0 6.23 2.5 6.23 5.84 0 3.48-2.2 6.28-5.25 6.28-1.03 0-2-.53-2.33-1.16l-.63 2.4c-.23.89-.84 2.01-1.25 2.69A9.75 9.75 0 1 0 12 2.25Z" />
    </svg>
  );
}

const socials = [
{
  Icon: X,
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
      { label: 'Observability Engine', to: { pathname: '/', hash: '#problem' } },
      { label: 'Predictive Analytics', to: { pathname: '/', hash: '#usecases' } },
      { label: 'Integrations', to: { pathname: '/', hash: '#capabilities' } },
      { label: 'Request Access', to: '/access' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: { pathname: '/', hash: '#contact' } },
      { label: 'Terms & Conditions', href: '#/terms' },
      { label: 'Privacy Policy', href: '#/privacy' }
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
              <Link to="/" className="inline-block">
                <img src={logo} alt="Metrixova" className="w-28 h-auto" />
              </Link>
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
                      {'href' in link ? (
                        <a
                          href={link.href}
                          className="text-sm text-metrix-muted hover:text-metrix-white transition-colors">
                          {link.label}
                        </a>
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