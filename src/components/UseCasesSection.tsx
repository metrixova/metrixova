import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Shield,
  Cloud,
  Building2,
  Globe,
  Cpu,
  ServerCog } from
'lucide-react';

const personaImages = [
  new URL('../assets/19.svg', import.meta.url).href,
  new URL('../assets/20.svg', import.meta.url).href,
  new URL('../assets/21.svg', import.meta.url).href,
  new URL('../assets/22.svg', import.meta.url).href,
  new URL('../assets/23.svg', import.meta.url).href,
  new URL('../assets/24.svg', import.meta.url).href,
  new URL('../assets/25.svg', import.meta.url).href
];
const personas = [
  {
    id: 'devops',
    icon: Terminal,
    image: personaImages[0],
    label: 'DevOps Teams',
    desc: 'Faster incident response, reduced alert fatigue. Automatically correlate deployments with metric anomalies.'
  },
  {
    id: 'sre',
    icon: Shield,
    image: personaImages[1],
    label: 'SREs',
    desc: 'Proactive reliability engineering, SLO tracking. Forecast error budget burn rates before they breach.'
  },
  {
    id: 'cloud',
    icon: Cloud,
    image: personaImages[2],
    label: 'Cloud Operations',
    desc: 'Infrastructure cost and performance optimization. Identify underutilized resources and latency bottlenecks.'
  },
  {
    id: 'enterprise',
    icon: Building2,
    image: personaImages[3],
    label: 'Enterprise IT',
    desc: 'Centralized observability for complex hybrid environments. Single pane of glass across legacy and cloud-native.'
  },
  {
    id: 'saas',
    icon: Globe,
    image: personaImages[4],
    label: 'SaaS Companies',
    desc: 'Product reliability and uptime intelligence. Ensure customer-facing APIs maintain 99.99% availability.'
  },
  {
    id: 'platform',
    icon: Cpu,
    image: personaImages[5],
    label: 'Platform Engineering',
    desc: 'Unified observability layer across internal platforms. Provide developers with self-serve telemetry insights.'
  },
  {
    id: 'msp',
    icon: ServerCog,
    image: personaImages[6],
    label: 'Managed Service Providers',
    desc: 'Multi-tenant observability at scale. Monitor thousands of client environments from a single command center.'
  }
];

export function UseCasesSection() {
  const [activeTab, setActiveTab] = useState(personas[0].id);
  const activePersona = personas.find((p) => p.id === activeTab)!;
  return (
    <section id="usecases" className="py-20 bg-metrix-bg border-t border-metrix-surface">
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
          className="mb-12">
          
          <h2 className="text-sm font-display text-metrix-muted uppercase tracking-[0.2em] mb-4">
            Built For
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Tabs */}
          <div className="lg:w-1/3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 hide-scrollbar">
            {personas.map((persona) => {
              const isActive = activeTab === persona.id;
              return (
                <button
                  key={persona.id}
                  onClick={() => setActiveTab(persona.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left whitespace-nowrap lg:whitespace-normal transition-all ${isActive ? 'bg-metrix-surface border border-metrix-crimson-dark/50 text-metrix-white' : 'text-metrix-muted hover:text-metrix-light hover:bg-metrix-surface/50 border border-transparent'}`}>
                  
                  <persona.icon
                    className={`w-5 h-5 ${isActive ? 'text-metrix-crimson-bright' : 'text-metrix-muted'}`} />
                  
                  <span className="text-sm font-medium">{persona.label}</span>
                </button>);

            })}
          </div>

          {/* Content Area */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                exit={{
                  opacity: 0,
                  x: -20
                }}
                transition={{
                  duration: 0.3
                }}
                className="bg-metrix-surface rounded-xl border border-metrix-surface p-8 h-full flex flex-col">
                
                <div className="mb-8">
                  <h3 className="text-2xl font-display text-metrix-white mb-3">
                    {activePersona.label}
                  </h3>
                  <p className="text-metrix-light leading-relaxed">
                    {activePersona.desc}
                  </p>
                </div>

                {/* Section Image */}
                <div className="flex-1 rounded-lg overflow-hidden">
                  <img
                    src={activePersona.image}
                    alt={`${activePersona.label} illustration`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>);

}