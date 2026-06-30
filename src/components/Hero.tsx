import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero-web.svg';

export function Hero({ onOpenModal }: { onOpenModal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    type Node = { x: number; y: number; vx: number; vy: number };
    type Streak = { x: number; y: number; len: number; speed: number; opacity: number };

    let nodes: Node[] = [];
    let streaks: Streak[] = [];

    const seed = () => {
      const count = Math.min(90, Math.floor((width * height) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
      streaks = Array.from({ length: 36 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        len: Math.random() * 240 + 100,
        speed: Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.5 + 0.25,
      }));
    };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      seed();
    };

    window.addEventListener('resize', resize);
    resize();

    const CONNECT_DIST = 130;
    const draw = () => {
      ctx.fillStyle = 'rgba(11, 9, 10, 0.10)';
      ctx.fillRect(0, 0, width, height);

      streaks.forEach((s) => {
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y);
        grad.addColorStop(0, 'rgba(164, 22, 26, 0)');
        grad.addColorStop(0.5, `rgba(229, 56, 59, ${s.opacity})`);
        grad.addColorStop(1, 'rgba(164, 22, 26, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y);
        ctx.stroke();
        s.x += s.speed;
        if (s.x - s.len > width) {
          s.x = -s.len;
          s.y = Math.random() * height;
        }
      });

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.4;
            ctx.strokeStyle = `rgba(186, 24, 27, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(229, 56, 59, 0.9)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [prefersReducedMotion]);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-metrix-bg">
      {/* Background */}
      {prefersReducedMotion ? (
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      )}

      <div className="absolute inset-0 bg-metrix-bg/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,#0B090A_100%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-24 flex flex-col md:flex-row items-center md:items-start gap-8">

        {/* Left: illustration */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-full md:w-1/2 flex justify-center md:justify-start"
        >
          <img src={heroImg} alt="Web illustration" className="w-[160px] sm:w-[240px] md:w-[300px] drop-shadow-2xl rounded" />
        </motion.div>

        {/* Right: headline + CTAs */}
        <div className="w-full md:w-1/2 text-center md:text-right">
          <div className="md:pr-16 lg:pr-24">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl font-hero text-[#D3D3D3] tracking-tight leading-tight"
            >
              Observability,
              <br />
              Powered by Intelligence .
            </motion.h1>
            {/* Live pill */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center justify-center gap-2 text-xs font-mono text-metrix-muted uppercase tracking-widest mt-8 mb-14 border border-metrix-crimson-dark/40 bg-metrix-bg/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-metrix-crimson-alert animate-pulse" />
              LIVE · 2.4M events/s ingested
            </motion.div>
          </div>
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-16 md:justify-end"
          >
            <Link
              to="/Product"
              className="w-full sm:w-auto px-10 py-4 bg-metrix-crimson-bright hover:bg-metrix-crimson text-metrix-white rounded font-medium transition-colors text-lg text-center"
            >
              Explore the Product
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-10 py-4 bg-transparent border border-metrix-white/30 hover:border-metrix-white text-metrix-white rounded font-medium transition-colors text-lg text-center"
            >
              Open the Workspace
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-metrix-muted w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Visible transition divider */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.4 }}
        className="absolute inset-x-0 -bottom-1 overflow-hidden pointer-events-none"
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