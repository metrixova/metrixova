import React, { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const sectionImages = [
  new URL('../assets/6.svg', import.meta.url).href,
  new URL('../assets/7.svg', import.meta.url).href,
  new URL('../assets/8.svg', import.meta.url).href,
  new URL('../assets/9.svg', import.meta.url).href,
  new URL('../assets/10.svg', import.meta.url).href,
  new URL('../assets/11.svg', import.meta.url).href
];

const nodes = [
  {
    id: 'sources',
    image: sectionImages[0],
    title: 'Data Sources',
    desc: 'Cloud infra, APM, Kubernetes, Logs, Business APIs, DevOps toolchains'
  },
  {
    id: 'ingest',
    image: sectionImages[1],
    title: 'Telemetry Ingestion Layer',
    desc: 'Metrics · Logs · Traces · Events'
  },
  {
    id: 'ai',
    image: sectionImages[2],
    title: 'Intelligent Correlation Engine',
    desc: 'Cross-service dependency mapping'
  },
  {
    id: 'detect',
    image: sectionImages[3],
    title: 'Anomaly Detection',
    desc: 'Real-time pattern deviation scoring'
  },
  {
    id: 'predict',
    image: sectionImages[4],
    title: 'Predictive Analytics',
    desc: 'System degradation forecasting'
  },
  {
    id: 'dash',
    image: sectionImages[5],
    title: 'Observability Dashboard',
    desc: 'Single-pane-of-glass observability'
  }
];

export function ArchitectureSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end center', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.65]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <motion.section
      ref={ref}
      style={{ scale, opacity, y }}
      className="py-20 bg-metrix-bg border-t border-metrix-surface overflow-hidden relative">
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
          viewport={{
            once: true
          }}
          className="text-center mb-16">
          
          <h2 className="text-sm font-display text-metrix-muted uppercase tracking-[0.2em] mb-4">
            How Metrixova Works
          </h2>
        </motion.div>

        <div className="relative">
          {/* Desktop Horizontal Pipeline */}
          <div className="hidden lg:flex items-start justify-between relative z-10">
            {nodes.map((node, idx) =>
            <Fragment key={node.id}>
                <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.1
                }}
                className="flex flex-col items-center w-48 relative group">
                
                  <div className="w-16 h-16 rounded-3xl bg-metrix-surface border border-metrix-crimson-dark flex items-center justify-center mb-4 group-hover:border-metrix-crimson-bright transition-colors relative z-20 overflow-hidden">
                    <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-sm font-bold text-metrix-white mb-2 text-center">
                    {node.title}
                  </h3>
                  <p className="text-xs text-metrix-muted text-center leading-relaxed">
                    {node.desc}
                  </p>
                </motion.div>

                {/* Connecting Lines (Desktop) */}
                {idx < nodes.length - 1 &&
              <div className="flex-1 h-16 flex items-center relative -mx-4 z-0">
                    <div className="w-full h-[2px] bg-metrix-surface relative overflow-hidden">
                      <motion.div
                    className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-metrix-crimson-bright to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'linear',
                      delay: idx * 0.2
                    }} />
                  
                    </div>
                  </div>
              }
              </Fragment>
            )}
          </div>

          {/* Mobile/Tablet Vertical Pipeline */}
          <div className="flex lg:hidden flex-col items-center relative z-10 space-y-8">
            {nodes.map((node, idx) =>
            <Fragment key={node.id}>
                <motion.div
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
                className="flex flex-col items-center w-full max-w-sm bg-metrix-surface p-6 rounded-xl border border-metrix-surface">
                
                  <div className="w-14 h-14 rounded-3xl bg-metrix-bg border border-metrix-crimson-dark flex items-center justify-center mb-4 overflow-hidden">
                    <img src={node.image} alt={node.title} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-base font-bold text-metrix-white mb-2 text-center">
                    {node.title}
                  </h3>
                  <p className="text-sm text-metrix-muted text-center">
                    {node.desc}
                  </p>
                </motion.div>

                {/* Connecting Lines (Mobile) */}
                {idx < nodes.length - 1 &&
              <div className="h-8 w-[2px] bg-metrix-surface relative overflow-hidden">
                    <motion.div
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-metrix-crimson-bright to-transparent"
                  animate={{
                    y: ['-100%', '200%']
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: 'linear'
                  }} />
                
                  </div>
              }
              </Fragment>
            )}
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0
          }}
          whileInView={{
            opacity: 1
          }}
          viewport={{
            once: true
          }}
          className="mt-16 text-center">
          
          <span className="text-xs font-mono text-metrix-crimson-bright bg-metrix-crimson-dark/10 px-3 py-1 rounded border border-metrix-crimson-dark/30">
            Powered by Advanced Compute Architecture.
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}