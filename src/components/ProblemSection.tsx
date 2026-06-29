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

export function ProblemSection() {
  return (
    <motion.section
      id="problem"
      initial={{ opacity: 0, y: 80, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: 'easeOut' }}
      className="relative overflow-hidden py-20 bg-metrix-bg border-t border-metrix-surface"
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
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-metrix-muted">Observability Challenges</p>
            <h2 className="text-4xl md:text-5xl font-display text-white">Telemetry overload is breaking incident response.</h2>
            <p className="max-w-3xl text-lg text-metrix-muted leading-relaxed">
              Teams struggle to keep up with cloud signals. Without intelligence, alerts are noisy, root cause discovery is slow, and business impact is delayed.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: '10B+', label: 'Events missed daily due to manual monitoring' },
              { value: '67%', label: 'Critical incidents detected too late' },
              { value: '4.2h', label: 'Mean time to diagnosis without AI' },
              { value: '300%', label: 'Faster investigation with adaptive correlation' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="rounded-[28px] border border-metrix-surface bg-metrix-surface/90 p-7 shadow-2xl shadow-metrix-crimson-dark/20"
              >
                <div className="inline-flex rounded-full bg-metrix-crimson-bright px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-metrix-crimson-dark/20">
                  Insight
                </div>
                <div className="mt-6 text-5xl font-semibold text-white tracking-tight">{stat.value}</div>
                <p className="mt-3 text-sm text-metrix-muted leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
