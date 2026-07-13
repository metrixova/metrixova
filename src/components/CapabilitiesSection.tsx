import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const capabilityImages = [
  new URL('../assets/12.svg', import.meta.url).href,
  new URL('../assets/13.svg', import.meta.url).href,
  new URL('../assets/14.svg', import.meta.url).href,
  new URL('../assets/15.svg', import.meta.url).href,
  new URL('../assets/16.svg', import.meta.url).href,
  new URL('../assets/17.svg', import.meta.url).href
];

const capabilities = [
  {
    image: capabilityImages[0],
    title: 'Unified Observability Engine',
    desc: 'Single-pane-of-glass across all environments. Metrics, logs, traces normalized in one layer.'
  },
  {
    image: capabilityImages[1],
    title: 'Metrics Intelligence Engine',
    desc: 'Automated anomaly detection and cross-system metric correlation powered by machine learning.'
  },
  {
    image: capabilityImages[2],
    title: 'Predictive Observability',
    desc: 'Forecast system degradation before failure. Identify early warning signals before alerts trigger.'
  },
  {
    image: capabilityImages[3],
    title: 'Root Cause Correlation Engine',
    desc: 'Link incidents across distributed services. Reduce MTTD with automated incident explanation.'
  },
  {
    image: capabilityImages[4],
    title: 'Telemetry Correlation Framework',
    desc: 'Correlate observability signals across heterogeneous environments in real time.'
  },
  {
    image: capabilityImages[5],
    title: 'Enterprise Monitoring Integration',
    desc: 'Connect any cloud, container, logging, or APM system into one unified intelligence platform.'
  }
];

// Lightweight ambient particles — same pattern as ProblemSection, plain motion dots
// instead of a per-section canvas/engine instance.
function AmbientParticles({ count = 16 }: { count?: number }) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    duration: Math.random() * 8 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-metrix-crimson-bright"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: 0.2 }}
          animate={{ y: [0, -30, 0], opacity: [0.08, 0.35, 0.08] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Mouse-tilt glass card — 3D perspective tracking on hover, glassmorphism base.
function CapabilityCard({
  cap,
  idx,
}: {
  cap: (typeof capabilities)[number];
  idx: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative h-full rounded-xl border border-metrix-crimson-dark/25 bg-white/5 backdrop-blur-md p-8
                   shadow-[0_0_40px_-20px_rgba(229,56,59,0.5)] hover:border-metrix-crimson-bright/40
                   hover:shadow-[0_0_50px_-14px_rgba(229,56,59,0.55)] transition-shadow duration-300"
      >
        {/* Hover top border glow */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-metrix-crimson-bright opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-metrix-crimson-bright/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Inner radial glow on hover, follows the glass theme from ProblemSection */}
        <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_left,rgba(229,56,59,0.12),transparent_60%)]" />

        <div
          style={{ transform: 'translateZ(30px)' }}
          className="mb-6 w-16 h-16 rounded-3xl bg-metrix-surface border border-metrix-crimson-dark flex items-center justify-center group-hover:border-metrix-crimson-bright/50 transition-colors overflow-hidden"
        >
          <img src={cap.image} alt={cap.title} className="w-full h-full object-cover" />
        </div>

        <h3 style={{ transform: 'translateZ(20px)' }} className="text-lg font-bold text-metrix-white mb-3">
          {cap.title}
        </h3>
        <p style={{ transform: 'translateZ(10px)' }} className="text-sm text-metrix-muted leading-relaxed">
          {cap.desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function CapabilitiesSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.65, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [200, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ scale, opacity, y }}
      className="py-12 md:py-16 lg:py-20 bg-metrix-surface border border-metrix-surface rounded-[38px] shadow-[0_40px_120px_rgba(0,0,0,0.25)] relative overflow-hidden scroll-mt-24"
      id="capabilities">

      {/* ambient depth blobs, matches ProblemSection's language */}
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-metrix-crimson-bright/10 blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-0 h-64 w-64 rounded-full bg-metrix-crimson-dark/10 blur-3xl pointer-events-none" />
      <AmbientParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          whileInView={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.9,
            ease: 'easeOut'
          }}
          viewport={{
            once: true
          }}
          className="mb-16">

          <h2 className="text-sm font-display text-metrix-crimson-bright uppercase tracking-[0.2em] mb-4">
            Core Capabilities
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <CapabilityCard key={idx} cap={cap} idx={idx} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}