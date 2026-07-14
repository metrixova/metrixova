import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, BrainCircuit, Radar, ShieldCheck, Sparkles, Workflow, type LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

type Pillar = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const pillars: Pillar[] = [
  {
    title: 'Resolve faster',
    description: 'Teams move from noisy alerts to a clear operational story that highlights impact and next steps.',
    icon: Radar,
  },
  {
    title: 'Stay aligned',
    description: 'Engineering, support, and leadership all see the same context without chasing scattered dashboards.',
    icon: Workflow,
  },
  {
    title: 'Reduce fatigue',
    description: 'Metrixova OS filters the signal, highlights the meaningful changes, and keeps attention focused on what matters.',
    icon: ShieldCheck,
  },
];

const experienceSteps = [
  {
    title: 'See the signal',
    description: 'Telemetry flows in continuously, with key shifts surfaced in a way that feels immediate and understandable.',
  },
  {
    title: 'Understand the impact',
    description: 'Services, dependencies, and customer-facing effects are connected into one shared view for faster decisions.',
  },
  {
    title: 'Move with confidence',
    description: 'The platform turns raw events into practical guidance so teams can act without second-guessing.',
  },
];

const proofPoints = [
  'Real-time anomaly detection',
  'Cross-service dependency mapping',
  'Incident summaries in plain language',
  'Designed for modern operations teams',
];

const nvidiaHighlights = [
  {
    title: 'High-scale telemetry',
    description: 'Built to ingest and interpret massive streams of operational data without losing context.',
  },
  {
    title: 'Intelligent analysis',
    description: 'Supports anomaly detection and dependency-aware reasoning that helps teams see what changed.',
  },
  {
    title: 'Readable incident guidance',
    description: 'Turns complex event patterns into clear explanations that make handoffs and response easier.',
  },
];

export function AccessPage({ onOpenModal }: { onOpenModal: () => void }) {
  const navigate = useNavigate();

  const handleOpenWorkspace = () => {
    if (auth.currentUser) {
      navigate('/dashboard');
    } else {
      window.open(`${window.location.origin}/#/login?redirect=/dashboard`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookDemo = () => {
    // Navigate home and pass a flag via router state so the home page
    // can scroll to #contact once it has actually mounted.
    navigate('/', { state: { scrollTo: 'contact' } });

    // Fallback in case the home page doesn't consume location.state
    // (e.g. it's already mounted and won't re-run its effect).
    let attempts = 0;
    const tryScroll = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const navbarEl = document.querySelector('header');
        const navbarHeight = navbarEl ? Math.ceil((navbarEl as HTMLElement).getBoundingClientRect().height) : 88;
        const top = window.scrollY + contactSection.getBoundingClientRect().top - navbarHeight - 8;
        window.scrollTo({ top, behavior: 'smooth' });
        return;
      }
      attempts += 1;
      if (attempts < 10) {
        window.setTimeout(tryScroll, 150);
      } else {
        onOpenModal();
      }
    };
    window.setTimeout(tryScroll, 150);
  };

  return (
    <main className="min-h-screen bg-metrix-bg text-metrix-white">
      <section className="mx-auto mb-6 max-w-7xl px-6 pt-6 lg:px-8">
        <div className="mb-4 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-metrix-surface/80 p-4 shadow-xl md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">Metrixova OS access</p>
            <p className="mt-2 text-lg font-semibold text-white">Continue to the Metrixova OS workspace</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-metrix-white transition-colors hover:border-metrix-crimson-bright/40 hover:bg-white/10"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => {
                if (auth.currentUser) {
                  navigate('/dashboard');
                } else {
                  window.open(`${window.location.origin}/#/login?redirect=/dashboard`, '_blank', 'noopener,noreferrer');
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-metrix-crimson-bright px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-metrix-crimson"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(229,56,59,0.2),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_25%)]" />
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 md:pt-12 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-metrix-crimson-dark/50 bg-metrix-surface/70 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.3em] text-metrix-muted">
                <Sparkles className="h-3.5 w-3.5 text-metrix-crimson-bright" />
                New • Metrixova OS
              </p>
              <h1 className="mt-6 text-4xl font-display leading-tight text-white sm:text-5xl lg:text-6xl">
                Turn every alert into a clear next move.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-metrix-muted">
                Metrixova OS helps teams move from scattered signals to shared understanding, so incidents feel measurable, actionable, and calm.
              </p>

              <div className="relative z-20 mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleOpenWorkspace}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-metrix-crimson-bright px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-metrix-crimson"
                >
                  Open Workspace
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleBookDemo}
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-metrix-white transition-colors hover:border-metrix-crimson-bright/40 hover:bg-white/10"
                >
                  Book a Demo
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['2.4M events/s', 'Dependency mapping', 'Narrated incidents'].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-metrix-muted">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, delay: 0.15, ease: 'easeOut' }}
            >
              <div className="rounded-[2rem] border border-metrix-crimson-dark/40 bg-metrix-surface/80 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.3)] backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-metrix-crimson-dark/40 bg-metrix-bg/70 p-3">
                    <BarChart3 className="h-6 w-6 text-metrix-crimson-bright" />
                  </div>
                  <div>
                    <p className="text-sm font-mono uppercase tracking-[0.25em] text-metrix-muted">Live operations center</p>
                    <p className="text-lg font-semibold text-white">Healthy, aware, and responsive</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-metrix-bg/70 p-5">
                  <div className="flex items-center justify-between text-sm text-metrix-muted">
                    <span>System health</span>
                    <span className="font-semibold text-white">99.2%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-white/10">
                    <div className="h-2 w-[85%] rounded-full bg-metrix-crimson-bright" />
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-metrix-muted">
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <span>Critical incidents</span>
                      <span className="text-white">2 active</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                      <span>Response confidence</span>
                      <span className="text-white">High</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {proofPoints.map((point) => (
                    <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-metrix-muted">
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-metrix-crimson-dark/40 bg-metrix-bg/70 p-3">
                  <Icon className="h-5 w-5 text-metrix-crimson-bright" />
                </div>
                <h2 className="text-xl font-semibold text-white">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-7 text-metrix-muted">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/6 to-transparent p-8 md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">How it feels in practice</p>
            <h2 className="mt-3 text-3xl font-display text-white sm:text-4xl">
              Every incident becomes a useful story.
            </h2>
            <p className="mt-4 text-lg leading-8 text-metrix-muted">
              Metrixova OS brings the right context to the right people at the right time, so teams can move from alert to action without losing momentum.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {experienceSteps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-metrix-bg/60 p-5">
                <p className="text-sm font-mono uppercase tracking-[0.25em] text-metrix-muted">0{index + 1}</p>
                <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-7 text-metrix-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-metrix-crimson-dark/40 bg-metrix-bg/70 p-3">
              <BrainCircuit className="h-6 w-6 text-metrix-crimson-bright" />
            </div>
            <div>
              <p className="text-sm font-mono uppercase tracking-[0.25em] text-metrix-muted">NVIDIA AI foundation</p>
              <h2 className="text-2xl font-semibold text-white">A platform shaped for demanding observability workloads.</h2>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-metrix-muted">
            Metrixova OS is built around NVIDIA AI SDKs that support the core needs of modern monitoring teams: high-volume telemetry intake, real-time analysis, and clear incident explanation.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {nvidiaHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-metrix-bg/60 p-5">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-metrix-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">Built for modern operations</p>
            <h2 className="mt-3 text-3xl font-display text-white">
              Designed to reduce noise and accelerate decisions.
            </h2>
            <p className="mt-4 text-lg leading-8 text-metrix-muted">
              From engineering to support and leadership, Metrixova OS keeps the whole team aligned around the same evidence.
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-metrix-bg/60 px-4 py-3 text-sm text-metrix-muted">
                Clear narratives for incidents instead of wall-to-wall dashboards.
              </div>
              <div className="rounded-2xl border border-white/10 bg-metrix-bg/60 px-4 py-3 text-sm text-metrix-muted">
                A calmer way to coordinate across services, teams, and priorities.
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-metrix-surface/70 p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-metrix-crimson-dark/40 bg-metrix-bg/70 p-3">
                <Workflow className="h-6 w-6 text-metrix-crimson-bright" />
              </div>
              <div>
                <p className="text-sm font-mono uppercase tracking-[0.25em] text-metrix-muted">Operating rhythm</p>
                <h3 className="text-xl font-semibold text-white">Less firefighting, more momentum</h3>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-metrix-bg/60 p-4">
                <p className="text-sm font-semibold text-white">Shared context</p>
                <p className="mt-2 text-sm leading-7 text-metrix-muted">Everyone sees the same story from the first signal to the final resolution.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-metrix-bg/60 p-4">
                <p className="text-sm font-semibold text-white">Faster triage</p>
                <p className="mt-2 text-sm leading-7 text-metrix-muted">The next best action surfaces quickly when the signal is clear and the impact is visible.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-metrix-crimson-dark/40 bg-gradient-to-r from-metrix-crimson/20 to-white/5 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">Ready to experience it?</p>
            <h2 className="mt-3 text-3xl font-display text-white sm:text-4xl">See how Metrixova OS helps your team stay ahead.</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              if (auth.currentUser) {
                navigate('/dashboard');
              } else {
                window.open(`${window.location.origin}/#/login?redirect=/dashboard`, '_blank', 'noopener,noreferrer');
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-metrix-crimson-bright px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-metrix-crimson"
          >
            Open the product
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}