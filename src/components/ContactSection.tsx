import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

const contactGif = new URL('../assets/contact.gif', import.meta.url).href;
const RECAPTCHA_SITE_KEY = '6LdVQj0tAAAAAIH0KPGSkG5bRrVB2s4Ral2kRLIy';

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;

    const renderRecaptcha = () => {
      const grecaptcha = (window as any).grecaptcha;
      const container = document.getElementById('recaptcha');
      if (!grecaptcha || !container || typeof grecaptcha.render !== 'function') return;
      try {
        const id = grecaptcha.render('recaptcha', { sitekey: RECAPTCHA_SITE_KEY, theme: 'light' });
        if (mounted) {
          setRecaptchaWidgetId(id);
          setRecaptchaLoaded(true);
        }
      } catch (e) {
        // ignore render errors
      }
    };

    if ((window as any).grecaptcha && (window as any).grecaptcha.render) {
      renderRecaptcha();
      return;
    }

    // expose onload callback for the grecaptcha API and poll as a fallback
    (window as any).__grecaptchaOnLoad = renderRecaptcha;

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=__grecaptchaOnLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if ((window as any).grecaptcha && (window as any).grecaptcha.render) {
        renderRecaptcha();
        clearInterval(timer);
      } else if (attempts > 12) {
        clearInterval(timer);
      }
    }, 300);

    return () => {
      mounted = false;
      if (script.parentNode) script.parentNode.removeChild(script);
      clearInterval(timer);
      try {
        delete (window as any).__grecaptchaOnLoad;
      } catch {}
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append('_subject', 'New message from Metrixova website');

      try {
      if ((window as any).grecaptcha && recaptchaLoaded) {
        const grecaptcha = (window as any).grecaptcha;
        let token = '';
        if (recaptchaWidgetId !== null && typeof grecaptcha.getResponse === 'function') {
          token = grecaptcha.getResponse(recaptchaWidgetId);
        }
        if (!token) {
          setStatus('error');
          return;
        }
        formData.append('g-recaptcha-response', token);
      }

      const response = await fetch('https://formspree.io/f/xnjkperv', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-metrix-bg" id="contact">
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm font-display text-metrix-crimson-bright uppercase tracking-[0.2em] mb-4">
            Get in Touch
          </h2>
          <h3 className="text-3xl md:text-4xl font-display text-metrix-white">
            Connect with our Engineering Team
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-10 lg:grid-cols-2 items-center"
        >
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[420px] rounded-[28px] bg-metrix-surface">
              <motion.img
                src={contactGif}
                alt="Contact illustration"
                className="w-full h-auto object-contain"
                animate={{ y: [0, -0.08, 0], scale: [1, 1.00001, 1] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <div className="bg-metrix-surface p-8 rounded-3xl border border-metrix-surface shadow-sm text-metrix-white">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-metrix-crimson-dark/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-metrix-crimson-bright w-8 h-8" />
                </div>
                <h4 className="text-2xl font-display text-metrix-white mb-2">Message Sent</h4>
                <p className="text-metrix-muted">Our team will get back to you shortly.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-6 py-2 bg-metrix-crimson-bright text-white rounded hover:bg-metrix-crimson transition-colors text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : status === 'error' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-metrix-crimson-dark/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-metrix-crimson-bright text-3xl">!</span>
                </div>
                <h4 className="text-2xl font-display text-metrix-white mb-2">Submission Failed</h4>
                <p className="text-metrix-muted">Please try again or email us directly at support@metrixova.com.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 px-6 py-2 bg-metrix-crimson-bright text-white rounded hover:bg-metrix-crimson transition-colors text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" action="https://formspree.io/f/xnjkperv" method="POST">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 rounded px-4 py-3 text-metrix-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright transition-all"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 rounded px-4 py-3 text-metrix-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright transition-all"
                      placeholder="Your Last Name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                    Work Email
                  </label>
                  <input
                    id="contactEmail"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 rounded px-4 py-3 text-metrix-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 rounded px-4 py-3 text-metrix-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright transition-all resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                <div id="recaptcha" className="flex justify-center my-4" style={{ minHeight: 72 }} />

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full mt-2 bg-metrix-crimson-bright hover:bg-metrix-crimson text-white py-3 px-4 rounded font-medium transition-colors flex items-center justify-center disabled:opacity-70"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}