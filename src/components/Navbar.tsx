import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';

const logoSvg = new URL('../assets/logo.svg', import.meta.url).href;

export function Navbar({ onOpenModal, theme, onToggleTheme, currentUser, onRequireAuth }: { onOpenModal: () => void; theme: 'dark' | 'light'; onToggleTheme: () => void; currentUser: User | null; onRequireAuth: () => void; }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);
  const navLinks = [
    { label: 'Problem', hash: '#problem' },
    { label: 'Capabilities', hash: '#capabilities' },
    { label: 'Use Cases', hash: '#usecases' },
    { label: 'Pricing', hash: '#pricing' },
    { label: 'Contact', hash: '#contact' }
  ];
  const isLanding = location.pathname === '/';
  const currentHash = location.hash;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${isScrolled ? 'bg-metrix-surface/90 backdrop-blur-md border-b border-metrix-crimson-dark/30' : 'bg-transparent'}`}>
      
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img src={logoSvg} alt="Metrixova logo" className="w-28 h-28 object-contain" />
        </Link>

        <nav className="hidden md:flex flex-1 justify-center">
          <div className="inline-flex items-center gap-6 rounded-full bg-white/10 px-5 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/10 backdrop-blur-sm">
            {navLinks.map(({ label, hash }) => {
              const to = isLanding ? hash : { pathname: '/', hash };
              const isActive = isLanding ? currentHash === hash : currentHash === hash && location.pathname === '/';
              return (
                <Link
                  key={label}
                  to={to}
                  className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-metrix-muted hover:text-metrix-white'}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/access"
            className="flex items-center gap-2 border border-metrix-crimson-dark hover:border-metrix-crimson-bright bg-metrix-surface/60 hover:bg-metrix-surface text-metrix-white px-4 py-2.5 rounded text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-metrix-crimson-bright" />
            <span className="hidden sm:inline">Metrixova</span>
          </Link>
        </div>
      </div>
    </motion.header>);

}