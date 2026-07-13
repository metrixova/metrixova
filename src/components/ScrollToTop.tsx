import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  const navbarEl = document.querySelector('header');
  const navbarHeight = navbarEl ? Math.ceil((navbarEl as HTMLElement).getBoundingClientRect().height) : 88;
  const extraGap = hash === '#capabilities' ? 40 : 8;
  const top = window.scrollY + target.getBoundingClientRect().top - navbarHeight - extraGap;
  window.scrollTo({ top, behavior: 'smooth' });
}

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Determine the fragment from multiple possible sources so anchors work
    let fragment = '';
    if (hash) fragment = hash;
    else if (window.location.hash) fragment = window.location.hash;
    else {
      const href = window.location.href;
      const i = href.lastIndexOf('#');
      if (i >= 0) fragment = href.slice(i);
    }

    // If this looks like a HashRouter route (e.g. '#/access') and we are not
    // on the landing page, treat it as a route change and scroll to top.
    if (fragment && fragment.startsWith('#/') && pathname !== '/') {
      fragment = '';
    }

    if (fragment) {
      // normalize '#/usecases' -> '#usecases'
      const normalized = fragment.startsWith('#/') ? `#${fragment.slice(2)}` : fragment;

      let attempts = 0;
      const maxAttempts = 30;
      const interval = 150;
      const timer = setInterval(() => {
        attempts += 1;
        const target = document.querySelector(normalized) as HTMLElement | null;
        if (target) {
          // account for fixed header offset
          scrollToHash(normalized);
          try {
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
          } catch {}
          clearInterval(timer);
        } else if (attempts >= maxAttempts) {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}