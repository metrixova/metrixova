import React from 'react';
import { motion } from 'framer-motion';
export function CredibilitySection() {
  const technologies = [
  'Advanced Compute',
  'OpenTelemetry',
  'Prometheus',
  'Kubernetes',
  'Cloud-native',
  'eBPF'];

  return (
    <section className="py-20 bg-metrix-bg border-t border-metrix-surface">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
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
          className="text-sm font-display text-metrix-muted uppercase tracking-[0.2em] mb-12">
          
          Built on Enterprise-Grade Intelligent Infrastructure
        </motion.h2>

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
          transition={{
            duration: 0.8
          }}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-12 mb-12">
          
          {technologies.map((tech, idx) =>
          <div
            key={idx}
            className="text-lg md:text-xl font-mono font-bold text-metrix-surface border border-metrix-surface px-4 py-2 rounded bg-metrix-bg shadow-inner flex items-center justify-center relative overflow-hidden group">
            
              <span className="relative z-10 text-metrix-light group-hover:text-metrix-white transition-colors">
                {tech}
              </span>
              <div className="absolute inset-0 bg-metrix-surface/50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
          )}
        </motion.div>

        <motion.p
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
            delay: 0.2
          }}
          className="text-metrix-muted leading-relaxed max-w-3xl mx-auto">
          
 Powered by high-performance compute for real-time telemetry inference. Metrixova delivers scalable observability intelligence and enterprise deployment flexibility, ensuring your reliability engineering teams have the intelligence they need without compromising on performance or security. 
        </motion.p>
      </div>
    </section>);

}