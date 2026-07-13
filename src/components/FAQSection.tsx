import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Metrixova?",
    answer: "Metrixova is an AI-powered observability platform that unifies metrics, logs, traces, and events into a single system for real-time monitoring, anomaly detection, and predictive incident correlation."
  },
  {
    question: "What data sources does Metrixova integrate with?",
    answer: "Cloud infrastructure, APM tools, Kubernetes/container environments, logging systems, business APIs, and common DevOps toolchains - all normalized into one telemetry layer."
  },
  {
    question: "How does the predictive analytics feature work?",
    answer: "Metrixova's models analyze historical and real-time telemetry patterns to forecast system degradation and surface early warning signals before they trigger a full incident."
  },
  {
    question: "How is Metrixova different from traditional monitoring tools?",
    answer: "Rather than just reporting metrics, Metrixova correlates signals across services, explains likely root causes automatically, and predicts failures - reducing both alert fatigue and mean time to diagnosis."
  },
  {
    question: "What retention and support options are available?",
    answer: "Retention ranges from 14 days (Starter) to 30 days (Growth) up to 1 year (Enterprise), with support levels from standard to a dedicated success manager on Enterprise plans."
  },
  {
    question: "Is there an API for custom integrations?",
    answer: "Yes. API access for telemetry data is included on the Enterprise plan, with a full developer documentation portal coming soon."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-metrix-bg border-t border-metrix-surface" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-display text-metrix-muted uppercase tracking-[0.2em] mb-4">
            Questions & Answers
          </h2>
          <h3 className="text-3xl md:text-4xl font-display text-metrix-white">
            Frequently Asked Questions
          </h3>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="border border-metrix-crimson-dark/30 rounded-lg overflow-hidden hover:border-metrix-crimson-bright/50 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full bg-metrix-surface hover:bg-metrix-surface/80 px-6 py-4 flex items-center justify-between transition-colors"
              >
                <span className="text-left font-semibold text-metrix-white">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-metrix-crimson-bright" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-metrix-bg border-t border-metrix-crimson-dark/20"
                  >
                    <p className="px-6 py-4 text-metrix-light leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
