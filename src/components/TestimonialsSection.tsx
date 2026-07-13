import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonialImages = [
  // Rajiv - use a real person photo
  'https://randomuser.me/api/portraits/men/32.jpg',
  new URL('../assets/20.svg', import.meta.url).href,
  new URL('../assets/21.svg', import.meta.url).href,
  // Priya - use a real person photo
  'https://randomuser.me/api/portraits/women/44.jpg',
  new URL('../assets/23.svg', import.meta.url).href,
];

const testimonials = [
  {
    quote: "Metrixova cut our mean time to diagnosis from hours to minutes. The correlation engine caught a cascading failure across three microservices before our on-call even got paged.",
    author: "Rajiv Menon",
    title: "Director of Platform Engineering",
    company: "Corestack Cloud",
    image: testimonialImages[0],
  },
  {
    quote: "We were drowning in alert noise. Metrixova's anomaly scoring cut false positives by more than half in the first month, and our SREs finally trust what they're paged for.",
    author: "Sarah Whitfield",
    title: "VP of Site Reliability",
    company: "Nimbus Systems",
    image: testimonialImages[1],
  },
  {
    quote: "The predictive observability layer flagged a memory leak two days before it would've taken down our checkout service. That single catch paid for the platform for the year.",
    author: "Daniel Osei",
    title: "Head of DevOps",
    company: "Ledgerly",
    image: testimonialImages[2],
  },
  {
    quote: "Single-pane-of-glass isn't just marketing language here, we actually retired four separate monitoring tools after onboarding Metrixova.",
    author: "Priya Raghunathan",
    title: "Cloud Operations Lead",
    company: "Vantage Health Tech",
    image: testimonialImages[3],
  },

];

// Duplicate testimonials for infinite loop
const duplicatedTestimonials = [...testimonials, ...testimonials];

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <motion.div
    className="bg-metrix-surface rounded-2xl border border-metrix-crimson-dark/30 p-8 flex flex-col h-full hover:border-metrix-crimson-bright/50 transition-colors flex-shrink-0 w-80"
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    {/* Stars */}
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-metrix-crimson-bright text-metrix-crimson-bright"
        />
      ))}
    </div>

    {/* Quote */}
    <p className="text-metrix-light leading-relaxed mb-6 flex-grow">
      "{testimonial.quote}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-4 pt-6 border-t border-metrix-crimson-dark/20">
      <div className="w-14 h-14 rounded-full overflow-hidden border border-metrix-crimson-dark/40 bg-metrix-bg flex-shrink-0">
        <img
          src={testimonial.image}
          alt={testimonial.author}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="font-semibold text-metrix-white text-sm">
          {testimonial.author}
        </p>
        <p className="text-xs text-metrix-muted">
          {testimonial.title}
        </p>
        <p className="text-xs text-metrix-crimson-bright font-medium">
          {testimonial.company}
        </p>
      </div>
    </div>
  </motion.div>
);

export function TestimonialsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-metrix-bg border-t border-metrix-surface" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-display text-metrix-muted uppercase tracking-[0.2em] mb-4">
            Customer Stories
          </h2>
          <h3 className="text-3xl md:text-4xl font-display text-metrix-white max-w-3xl mx-auto">
            Trusted by engineering teams at leading companies
          </h3>
        </motion.div>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={prefersReducedMotion ? {} : { x: [0, -1728] }}
            transition={prefersReducedMotion ? {} : {
              repeat: Infinity,
              duration: 80,
              ease: 'linear',
            }}
          >
            {duplicatedTestimonials.map((testimonial, idx) => (
              <TestimonialCard key={idx} testimonial={testimonial} />
            ))}
          </motion.div>
        </div>

        {/* Fade gradient overlay */}
        <div className="pointer-events-none mt-8 h-20 bg-gradient-to-t from-metrix-bg to-transparent" />
      </div>
    </section>
  );
}
