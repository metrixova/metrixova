import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSection } from '../components/ProblemSection';
import { ArchitectureSection } from '../components/ArchitectureSection';
import { CapabilitiesSection } from '../components/CapabilitiesSection';
import { UseCasesSection } from '../components/UseCasesSection';
import { PricingSection } from '../components/PricingSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { CredibilitySection } from '../components/CredibilitySection';
import { FAQSection } from '../components/FAQSection';
import { ContactSection } from '../components/ContactSection';
export function Landing({ onOpenModal }: {onOpenModal: () => void;}) {
  return (
    <main>
      <Hero onOpenModal={onOpenModal} />
      <div className="relative section-background overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(186,24,27,0.18),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_16%)] opacity-80 pointer-events-none" />
        <div className="relative">
          <ProblemSection />
          <ArchitectureSection />
          <CapabilitiesSection />
          <UseCasesSection />
          <PricingSection />
          <TestimonialsSection />
          <CredibilitySection />
          <FAQSection />
          <ContactSection />
        </div>
      </div>
    </main>);

}