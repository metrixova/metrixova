import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

function CountUp({
  end,
  suffix = '',
  duration = 2
}: {end: number; suffix?: string; duration?: number;}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-50px'
  });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(progress === 1 ? end : end * easeProgress);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView, prefersReducedMotion]);

  const formattedCount = Number.isInteger(end) ? Math.floor(count).toString() : count.toFixed(1);
  return (
    <span ref={ref}>
      {formattedCount}
      {suffix}
    </span>
  );
}

// Lightweight ambient particles — plain motion dots, no canvas/engine per-section (keeps perf sane
// when several sections each want this treatment).
function AmbientParticles({ count = 14 }: { count?: number }) {
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
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: 0.25,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Reveal wrapper — blur/scale/y entrance, reused per card so scroll-in feels cinematic
// rather than a flat fade.
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ProblemSection() {
  return (
    <motion.section
      id="problem"
      initial={{ opacity: 0, y: 80, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
      className="relative overflow-hidden py-12 md:py-16 lg:py-20 bg-metrix-bg border-t border-metrix-surface"
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-metrix-bg/95 z-20"
        initial={{ y: 0 }}
        whileInView={{ y: '-100%' }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
      />

      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-metrix-crimson-bright/10 blur-3xl" />
      <div className="absolute right-10 bottom-0 h-64 w-64 rounded-full bg-metrix-crimson-dark/10 blur-3xl" />
      <AmbientParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <Reveal className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-metrix-muted">Observability Challenges</p>
            <h2 className="text-4xl md:text-5xl font-display text-white">
              Telemetry overload is breaking{' '}
              <span className="text-metrix-crimson-bright [text-shadow:0_0_20px_rgba(229,56,59,0.4)]">
                incident response.
              </span>
            </h2>
            <p className="max-w-3xl text-lg text-metrix-muted leading-relaxed">
              Teams struggle to keep up with cloud signals. Without intelligence, alerts are noisy, root cause discovery is slow, and business impact is delayed.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: 10, suffix: 'B+', display: '10B+', label: 'Events missed daily due to manual monitoring' },
              { value: 67, suffix: '%', display: '67%', label: 'Critical incidents detected too late' },
              { value: 4.2, suffix: 'h', display: '4.2h', label: 'Mean time to diagnosis without AI' },
              { value: 300, suffix: '%', display: '300%', label: 'Faster investigation with adaptive correlation' }
            ].map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                  className="group relative h-full rounded-[28px] border border-metrix-crimson-dark/25 bg-white/5 backdrop-blur-md p-7
                             shadow-[0_0_40px_-18px_rgba(229,56,59,0.5)] hover:border-metrix-crimson-dark/50
                             hover:shadow-[0_0_50px_-12px_rgba(229,56,59,0.6)] transition-shadow duration-300"
                >
                  {/* inner glow on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top_left,rgba(229,56,59,0.12),transparent_60%)]" />

                  <div className="inline-flex rounded-full bg-metrix-crimson-bright px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(229,56,59,0.8)]">
                    Insight
                  </div>
                  <div className="mt-6 text-5xl font-semibold text-white tracking-tight">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-3 text-sm text-metrix-muted leading-relaxed">{stat.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}