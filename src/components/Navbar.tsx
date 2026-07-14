import React, { useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { User } from 'firebase/auth';

const logoSvg = new URL('../assets/logo.svg', import.meta.url).href;

export function Navbar({ onOpenModal, theme, onToggleTheme, currentUser, onRequireAuth }: { onOpenModal: () => void; theme: 'dark' | 'light'; onToggleTheme: () => void; currentUser: User | null; onRequireAuth: () => void; }) {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('problem');
  const location = useLocation();
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
  const activeHash = activeSection || currentHash.replace('#', '') || 'problem';

  const updateActiveSectionFromScroll = () => {
    if (!isLanding) return;

    const sectionIds = navLinks.map(({ hash }) => hash.replace('#', ''));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    const activeSectionFromScroll = [...sections].reverse().find((section) => section.offsetTop <= scrollPosition)?.id;

    if (activeSectionFromScroll) {
      setActiveSection(activeSectionFromScroll);
    }
  };

  const handleSectionNavigation = (hash: string) => {
    const targetId = hash.replace('#', '');
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    // Calculate an exact scroll offset that accounts for the sticky header
    const navbarEl = document.querySelector('header');
    const navbarHeight = navbarEl ? Math.ceil((navbarEl as HTMLElement).getBoundingClientRect().height) : 88;
    const extraGap = hash === '#capabilities' ? 40 : 8;
    const top = window.scrollY + target.getBoundingClientRect().top - navbarHeight - extraGap;
    window.scrollTo({ top, behavior: 'smooth' });

    if (window.history && typeof window.history.pushState === 'function') {
      window.history.pushState(null, '', `${window.location.pathname}${hash}`);
    } else {
      window.location.hash = hash;
    }

    setActiveSection(targetId);
  };

  useEffect(() => {
    if (!isLanding) {
      setActiveSection('');
      return;
    }

    const sectionIds = navLinks.map(({ hash }) => hash.replace('#', ''));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    if (currentHash) {
      setActiveSection(currentHash.replace('#', ''));
    } else {
      updateActiveSectionFromScroll();
    }

    window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true });
    window.addEventListener('resize', updateActiveSectionFromScroll);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.2, 0.4, 0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateActiveSectionFromScroll);
      window.removeEventListener('resize', updateActiveSectionFromScroll);
    };
  }, [currentHash, isLanding, updateActiveSectionFromScroll]);

  return (
    <motion.header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-metrix-surface/90 backdrop-blur-md border-b border-metrix-crimson-dark/30 shadow-[0_10px_30px_rgba(0,0,0,0.18)]' : 'bg-transparent border-b border-transparent'}`}>
      
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <img src={logoSvg} alt="Metrixova logo" className="h-12 sm:h-14 md:h-16 object-contain" />
        </Link>

        <nav className="hidden md:flex flex-1 justify-center">
          <div className="inline-flex items-center gap-6 rounded-full bg-white/10 px-5 py-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-white/10 backdrop-blur-sm">
            {navLinks.map(({ label, hash }) => {
              const to = isLanding ? hash : { pathname: '/', hash };
              const isActive = hash.replace('#', '') === activeHash;
              return (
                <Link
                  key={label}
                  to={to}
                  onClick={(event) => {
                    if (isLanding) {
                      event.preventDefault();
                      handleSectionNavigation(hash);
                      window.history.pushState(null, '', `${window.location.pathname}${hash}`);
                    }
                  }}
                  className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-metrix-muted hover:text-metrix-white'}`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/15 bg-metrix-surface/60 px-3 py-2 text-sm text-metrix-white">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-metrix-crimson-dark to-metrix-crimson-bright text-xs font-semibold text-white">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={currentUser.displayName || currentUser.email || 'User'} className="h-full w-full object-cover" />
                ) : (
                  (currentUser.displayName?.trim() || currentUser.email?.split('@')[0] || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <span className="max-w-[110px] truncate">{currentUser.displayName?.trim() || currentUser.email?.split('@')[0] || 'Account'}</span>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-metrix-surface/60 text-metrix-white p-2 transition-colors hover:border-metrix-crimson-bright hover:bg-metrix-surface md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/access"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-metrix-crimson-dark hover:border-metrix-crimson-bright bg-metrix-surface/60 hover:bg-metrix-surface text-metrix-white px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-metrix-crimson-bright" />
            <span>Metrixova OS</span>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-metrix-surface/95 border-t border-white/10">
          <div className="flex flex-col gap-2 px-6 py-4">
            {navLinks.map(({ label, hash }) => {
              const to = isLanding ? hash : { pathname: '/', hash };
              const isActive = hash.replace('#', '') === activeHash;
              return (
                <Link
                  key={label}
                  to={to}
                  onClick={(event) => {
                    setMenuOpen(false);
                    if (isLanding) {
                      event.preventDefault();
                      handleSectionNavigation(hash);
                      window.history.pushState(null, '', `${window.location.pathname}${hash}`);
                    }
                    setActiveSection(hash.replace('#', ''));
                  }}
                  className={`rounded-xl border px-3 py-2 text-base font-medium transition-colors ${isActive ? 'border-metrix-crimson-bright/40 bg-metrix-crimson-bright/10 text-white' : 'border-transparent text-metrix-white hover:border-metrix-crimson-bright/20 hover:text-metrix-crimson-bright'}`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              to="/access"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl border border-metrix-crimson-bright/40 bg-metrix-crimson-bright/90 px-3 py-2.5 text-base font-semibold text-white shadow-lg shadow-metrix-crimson-bright/20 transition-colors hover:bg-metrix-crimson-bright"
            >
              MatriX
            </Link>
          </div>
        </div>
      )}
    </motion.header>);

}