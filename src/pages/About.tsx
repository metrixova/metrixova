import React from 'react';
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    title: 'Signal clarity',
    body: 'Transform noisy telemetry into focused, actionable intelligence that helps teams respond faster with less alert fatigue.',
    icon: Activity,
  },
  {
    title: 'Secure by design',
    body: 'Support enterprise-grade deployments with strong guardrails, controlled access, and observability built for modern infrastructure.',
    icon: ShieldCheck,
  },
  {
    title: 'Real-time acceleration',
    body: 'Surface anomalies, correlate changes, and shorten incident resolution with live, AI-assisted operational insights.',
    icon: Zap,
  },
];

export function AboutPage() {
  return (
    <main className="min-h-screen bg-metrix-bg text-metrix-white">
      <section className="px-6 pt-32 pb-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-mono uppercase tracking-[0.35em] text-metrix-crimson-bright">
              About Metrixova
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Intelligent observability for teams that need clarity under pressure.
            </h1>
            <p className="mt-6 text-lg leading-8 text-metrix-muted">
              Metrixova helps engineering teams see what matters, reduce noise, and act with confidence across modern cloud, hybrid, and distributed systems.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/access"
                className="inline-flex items-center gap-2 rounded-full bg-metrix-crimson-bright px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-metrix-crimson"
              >
                Explore the platform
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-metrix-muted transition-colors hover:border-metrix-crimson-bright hover:text-white"
              >
                Back to home
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm">
            <p className="text-sm font-mono uppercase tracking-[0.35em] text-metrix-muted">
              Why teams choose us
            </p>
            <div className="mt-6 space-y-4">
              {pillars.map(({ title, body, icon: Icon }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-metrix-bg/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-metrix-crimson-bright/15 p-2 text-metrix-crimson-bright">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{title}</h2>
                      <p className="mt-1 text-sm leading-7 text-metrix-muted">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.2)] backdrop-blur-sm md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-mono uppercase tracking-[0.35em] text-metrix-crimson-bright">
                Built for modern operations
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                We turn complex telemetry into confident decisions.
              </h2>
              <p className="mt-4 text-lg leading-8 text-metrix-muted">
                From incident response to daily reliability work, Metrixova gives teams the context they need without drowning them in noise.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Faster triage', 'Correlate signals across services and surface the most meaningful anomalies first.'],
                ['Clear ownership', 'Bring context, history, and next steps into one shared workflow.'],
                ['Reliable scaling', 'Support growing infrastructures without multiplying tool sprawl.'],
                ['Security-minded', 'Protect observability workflows with enterprise-ready controls.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-metrix-bg/70 p-4">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-metrix-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-metrix-crimson-bright/10 via-white/[0.03] to-transparent p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { value: '24/7', label: 'Live monitoring coverage' },
              { value: '3x', label: 'Faster incident understanding' },
              { value: '100%', label: 'Focus on actionable insight' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-metrix-bg/70 p-6 text-center">
                <div className="text-3xl font-semibold text-white">{item.value}</div>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-metrix-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
