import React, { useEffect, useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import globeVideo from '../assets/globe.mp4';

export function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Parallax: globe drifts slower than page scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const globeY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const globeRotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] md:h-screen w-full overflow-hidden bg-black flex items-center lg:items-start pt-0"
    >
      {/* Content row — text + globe as flex siblings, so the globe aligns to the headline instead of the full section height */}
        <motion.div
        style={{ opacity: prefersReducedMotion ? 1 : contentOpacity }}
        className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-8 md:px-12 flex flex-col-reverse lg:flex-row items-center justify-center gap-6 md:gap-8 lg:-mt-8"
      >
        <div className="max-w-xl shrink-0 w-full md:w-auto md:ml-[5%] text-center md:text-left">
          {/* badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-xs font-mono text-metrix-muted uppercase tracking-widest border border-metrix-crimson-dark/40 bg-metrix-bg/60 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-metrix-crimson-alert animate-pulse" />
            LIVE · 2.4M events/s ingested
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="font-hero text-[#D3D3D3] tracking-tight leading-tight"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.75rem)' }}
          >
            Observability,
            <br />
            Powered by{' '}
            <span className="text-metrix-crimson-bright [text-shadow:0_0_20px_rgba(229,56,59,0.5)]">
              Intelligence.
            </span>
          </motion.h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto justify-center md:justify-start"
          >
            <Link
              to="/access"
              className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 bg-metrix-crimson-bright hover:bg-metrix-crimson text-metrix-white rounded font-semibold transition-colors text-base sm:text-lg text-center"
            >
              Metrixova OS
            </Link>
            <Link
              to={{ pathname: '/', hash: '#pricing' }}
              className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 bg-transparent border border-metrix-white/30 hover:border-metrix-white text-metrix-white rounded font-semibold transition-colors text-base sm:text-lg text-center"
            >
              View Pricing
            </Link>
          </motion.div>
        </div>

        {/* Globe — pulled in from the edge toward the middle, still right of the text, not full page-center */}
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : globeY,
            rotate: prefersReducedMotion ? 0 : globeRotate,
          }}
          className="relative block shrink-0 w-full md:w-[48vw] h-auto max-w-[760px] max-h-[75vh] md:max-h-[80vh] pointer-events-none md:-ml-[8%]"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
            style={{ filter: 'sepia(1) saturate(1) hue-rotate(-40deg) brightness(0.85)' }}
          >
            <source src={globeVideo} type="video/mp4" />
          </video>
        </motion.div>
      </motion.div>

      {/* fade globe into bg on the left/text zone only — sits below content (z-0), never covers the globe */}
      <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-black via-black/80 to-transparent z-0" />

      {/* transition divider, kept from original */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
        className="absolute inset-x-0 -bottom-1 overflow-hidden pointer-events-none z-[2]"
        aria-hidden="true"
      >
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C300,100 900,0 1200,80 L1200,120 L0,120 Z" fill="#0B090A" opacity="0.9" />
          <path d="M0,20 C300,120 900,20 1200,100 L1200,120 L0,120 Z" fill="#111316" opacity="0.75" />
        </svg>
      </motion.div>
    </section>
  );
}