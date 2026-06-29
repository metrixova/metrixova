import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
      className="py-20 bg-white border border-gray-200 rounded-[38px] shadow-[0_40px_120px_rgba(15,23,42,0.08)] relative overflow-hidden"
      id="capabilities">
      
      <div className="max-w-7xl mx-auto px-6">
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
          {capabilities.map((cap, idx) =>
          <motion.div
            key={idx}
            initial={{
              opacity: 0,
              y: 20
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
            transition={{
              duration: 1,
              delay: idx * 0.18,
              ease: 'easeOut'
            }}
            className="group relative bg-gray-50 p-8 rounded-xl border border-gray-200 hover:-translate-y-1 transition-all duration-300">
            
              {/* Hover Top Border Glow */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-metrix-crimson-bright opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-metrix-crimson-bright/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="mb-6 w-16 h-16 rounded-3xl bg-white border border-gray-300 flex items-center justify-center group-hover:border-metrix-crimson-bright/50 transition-colors overflow-hidden">
                <img src={cap.image} alt={cap.title} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg font-bold text-[#0B090A] mb-3">
                {cap.title}
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {cap.desc}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}