import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const tiers = [
  {
    name: 'Starter',
    desc: 'Infrastructure monitoring for small teams.',
    monthlyPrice: 39,
    annualPrice: 374,
    monthlyLink: 'https://buy.stripe.com/test_7sYfZh6gfdjncHI0FEeUU00',
    annualLink: 'https://buy.stripe.com/test_3cI5kDcED5QV5fg5ZYeUU01',
    features: [
    'Core metrics ingestion',
    'Basic anomaly detection',
    '14-day data retention',
    'Standard support'],

    cta: 'Checkout',
    popular: false
  },
  {
    name: 'Growth',
    desc: 'Full observability stack with AI correlation.',
    monthlyPrice: 89,
    annualPrice: 854,
    monthlyLink: 'https://buy.stripe.com/test_aFa28r9sr0wB8rs3RQeUU02',
    annualLink: 'https://buy.stripe.com/test_9B65kDfQPa7b0Z0ageeUU03',
    features: [
    'Everything in Starter',
    'Intelligent correlation engine ',
    'Predictive analytics',
    '30-day data retention',
    'Usage-based scaling'],

    cta: 'Checkout',
    popular: true
  },
  {
    name: 'Enterprise',
    desc: 'Custom deployment and dedicated support.',
    priceLabel: 'Custom',
    features: [
    'Everything in Growth',
    'API access for telemetry',
    'Enterprise licensing',
    '1-year data retention',
    'Dedicated success manager'],

    cta: 'Contact Sales',
    popular: false
  }];

  return (
    <section
      className="py-20 bg-metrix-bg border-t border-metrix-surface"
      id="pricing">
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-display text-metrix-muted uppercase tracking-[0.2em] mb-8">
            Pricing
          </h2>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${!isAnnual ? 'text-metrix-white' : 'text-metrix-muted'}`}>
              
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 bg-metrix-surface rounded-full p-1 relative border border-metrix-crimson-dark/30 transition-colors focus:outline-none focus:ring-2 focus:ring-metrix-crimson-bright"
              aria-label="Toggle billing period">
              
              <motion.div
                className="w-5 h-5 bg-metrix-crimson-bright rounded-full"
                animate={{
                  x: isAnnual ? 26 : 0
                }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }} />
              
            </button>
            <span
              className={`text-sm font-medium ${isAnnual ? 'text-metrix-white' : 'text-metrix-muted'}`}>
              
              Annual{' '}
              <span className="text-metrix-crimson-bright text-xs ml-1">
                (Save 20%)
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) =>
          <motion.div
            key={tier.name}
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
              duration: 0.4,
              delay: idx * 0.1
            }}
            className={`relative bg-metrix-surface rounded-xl p-8 border flex flex-col ${tier.popular ? 'border-metrix-crimson-bright shadow-[0_0_30px_rgba(186,24,27,0.1)]' : 'border-metrix-surface'}`}>
            
              {tier.popular &&
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-metrix-crimson-bright text-metrix-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </div>
            }

              <h3 className="text-xl font-display text-metrix-white mb-2">
                {tier.name}
              </h3>
              <p className="text-sm text-metrix-muted mb-6 h-10">{tier.desc}</p>

              <div className="mb-8">
                {tier.priceLabel ?
              <div className="text-4xl font-display text-metrix-white">
                    {tier.priceLabel}
                  </div> :

              <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display text-metrix-white">
                      ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                    </span>
                    <span className="text-metrix-muted">/mo</span>
                  </div>
              }
              </div>

              {tier.monthlyLink || tier.annualLink ? (
                <a
                  href={isAnnual ? tier.annualLink : tier.monthlyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded font-medium transition-colors mb-8 inline-flex items-center justify-center ${tier.popular ? 'bg-metrix-crimson-bright hover:bg-metrix-crimson text-metrix-white' : 'bg-metrix-bg border border-metrix-crimson-dark hover:border-metrix-crimson-bright text-metrix-white'}`}>
                  {tier.cta}
                </a>
              ) : (
                <button
                  className={`w-full py-3 rounded font-medium transition-colors mb-8 ${tier.popular ? 'bg-metrix-crimson-bright hover:bg-metrix-crimson text-metrix-white' : 'bg-metrix-bg border border-metrix-crimson-dark hover:border-metrix-crimson-bright text-metrix-white'}`}>
                  {tier.cta}
                </button>
              )}

              <div className="space-y-4 flex-1">
                {tier.features.map((feature, fIdx) =>
              <div key={fIdx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-metrix-crimson-bright shrink-0" />
                    <span className="text-sm text-metrix-light">{feature}</span>
                  </div>
              )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

}