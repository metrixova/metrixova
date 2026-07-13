import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const logoSvg = new URL('../assets/logo.svg', import.meta.url).href;

/* =========================================================================
   METRIXOVA AI Observability Command Center
   Single-file React/TSX dashboard. Drop into any React + Vite/TS project.
   Frontend only. All data is mocked, and all forms are local state (no API calls).
   Theme tokens live in <style> below. Change `--brand` etc. to re-skin.
   ========================================================================= */

type SectionId =
  | "command" | "metrics" | "anomaly" | "predictive" | "rootcause"
  | "infra" | "incidents" | "integrations" | "reports" | "api" | "account";

/* ---------------------------- utils --------------------------------- */

function genSeries(n: number, base: number, vol: number): number[] {
  const arr = [base];
  for (let i = 1; i < n; i++) arr.push(Math.max(4, arr[i - 1] + (Math.random() - 0.48) * vol));
  return arr;
}

function sparkPath(points: number[], w = 100, h = 28, pad = 2): string {
  const max = Math.max(...points);
  const step = w / (points.length - 1);
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - pad - (p / max) * (h - pad * 2)).toFixed(1)}`)
    .join(" ");
}

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ---------------------------- icon set -------------------------------- */

const ICONS: Record<string, string> = {
  grid: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  chart: '<path d="M3 3v18h18"/><path d="M7 15l4-6 3 3 5-8"/>',
  anomaly: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
  root: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 6h7.5M8 6l8 12M6 8.5V18"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  bell: '<path d="M17 7a5 5 0 0 0-10 0c0 5-3 6-3 6h16s-3-1-3-6"/><path d="M10.5 20a1.5 1.5 0 0 0 3 0"/>',
  grid2: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
  api: '<path d="m18 16 4-4-4-4M6 8l-4 4 4 4"/><path d="m14.5 4-5 16"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  down: '<path d="M12 5v14M5 12l7 7 7-7"/>',
  check: '<path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ingest: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  pulse2: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/><circle cx="12" cy="12" r="3"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  download: '<path d="M12 15V3M7 10l5 5 5-5"/><path d="M3 17v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m10.5 12.5 8-8M16 9l3 3M13 6l3 3"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  map: '<path d="M9 18 3 21V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/>',
  filter: '<path d="M4 4h16l-6 8v6l-4 2v-8L4 4Z"/>',
  moon: '<path d="M20.8 14.5A9 9 0 1 1 9.5 3.2a7 7 0 0 0 11.3 11.3Z"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
};

function Ic({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] || "" }} />
  );
}

/* ---------------------------- app context (nav / toasts / theme) -------- */

type AppCtxType = {
  navigate: (s: SectionId) => void;
  toast: (text: string) => void;
  theme: "dark" | "light";
};
const AppCtx = React.createContext<AppCtxType>({ navigate: () => {}, toast: () => {}, theme: "dark" });
function useApp() { return React.useContext(AppCtx); }

let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const push = (text: string) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  };
  return { toasts, push };
}
function ToastStack({ toasts }: { toasts: { id: number; text: string }[] }) {
  return (
    <div className="mtx-toaststack">
      {toasts.map((t) => <div className="mtx-toast" key={t.id}><Ic name="check" size={14} />{t.text}</div>)}
    </div>
  );
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---------------------------- atoms ------------------------------------ */

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`mtx-card ${className}`} style={style}>{children}</div>;
}

function SectionHead({ eyebrow, title, sub, actions }: { eyebrow?: string; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mtx-pagehead">
      <div>
        {eyebrow && <div className="mtx-eyebrow"><span className="mtx-dot" />{eyebrow}</div>}
        <h1 className="mtx-title">{title}</h1>
        {sub && <p className="mtx-sub">{sub}</p>}
      </div>
      {actions && <div className="mtx-actions">{actions}</div>}
    </div>
  );
}

function CardHead({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="mtx-cardhead">
      <div>
        <div className="mtx-cardtitle">{title}</div>
        {desc && <div className="mtx-carddesc">{desc}</div>}
      </div>
      {right}
    </div>
  );
}

function Delta({ dir, children }: { dir: "up" | "down" | "flat"; children: React.ReactNode }) {
  return (
    <span className={`mtx-delta mtx-${dir}`}>
      {dir !== "flat" && <Ic name={dir} size={10} />}
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: "healthy" | "watch" | "critical" }) {
  const label = status[0].toUpperCase() + status.slice(1);
  return <span className={`mtx-status mtx-${status}`}><span className="mtx-sdot" />{label}</span>;
}

function Gauge({ pct, color, label, value }: { pct: number; color: string; label: string; value: string }) {
  const dash = 148 - (pct / 100) * 148;
  return (
    <div className="mtx-gauge">
      <svg width="110" height="70" viewBox="0 0 110 65">
        <path d="M8 60 A47 47 0 0 1 102 60" fill="none" stroke="var(--surface-2)" strokeWidth="9" strokeLinecap="round" />
        <path d="M8 60 A47 47 0 0 1 102 60" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray="148" strokeDashoffset={dash} />
      </svg>
      <div className="mtx-gaugeval">{value}</div>
      <div className="mtx-gaugelabel">{label}</div>
    </div>
  );
}

function Spark({ seed, color = "var(--brand)" }: { seed: number; color?: string }) {
  const pts = useMemo(() => genSeries(14, 20 + seed, 8), [seed]);
  return (
    <svg className="mtx-spark" viewBox="0 0 100 28">
      <path d={sparkPath(pts)} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" className={`mtx-toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)} aria-pressed={checked}>
      <span className="mtx-toggle-knob" />
    </button>
  );
}

/* ================================================================
   SECTION: Command Center
   ================================================================ */

function PulseChart() {
  const [metric, setMetric] = useState<"latency" | "throughput" | "errors">("latency");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(id);
  }, []);

  const { d, f, band, gridY } = useMemo(() => {
    const W = 760, H = 260, PAD = 28;
    const past = genSeries(22, 60, 22);
    const maxObs = Math.max(...past);
    const future = genSeries(8, past[past.length - 1], 18);
    const maxV = Math.max(maxObs, ...future) * 1.15;
    const innerW = W - PAD * 2, innerH = H - PAD * 1.6;
    const stepPast = (innerW * 0.72) / (past.length - 1);
    const stepFuture = (innerW * 0.28) / (future.length - 1);

    let d = "";
    past.forEach((p, i) => {
      const x = PAD + i * stepPast, y = PAD * 0.4 + innerH - (p / maxV) * innerH;
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1) + " ";
    });
    const lastX = PAD + (past.length - 1) * stepPast;
    const lastY = PAD * 0.4 + innerH - (past[past.length - 1] / maxV) * innerH;
    let f = "M " + lastX.toFixed(1) + " " + lastY.toFixed(1) + " ";
    let band = "M " + lastX.toFixed(1) + " " + (lastY - 14).toFixed(1) + " ";
    future.forEach((p, i) => {
      const x = lastX + (i + 1) * stepFuture, y = PAD * 0.4 + innerH - (p / maxV) * innerH;
      f += "L " + x.toFixed(1) + " " + y.toFixed(1) + " ";
      band += "L " + x.toFixed(1) + " " + (y - 14 - i * 1.6).toFixed(1) + " ";
    });
    for (let i = future.length - 1; i >= 0; i--) {
      const x = lastX + (i + 1) * stepFuture, y = PAD * 0.4 + innerH - (future[i] / maxV) * innerH;
      band += "L " + x.toFixed(1) + " " + (y + 14 + i * 1.6).toFixed(1) + " ";
    }
    band += "L " + lastX.toFixed(1) + " " + (lastY + 14).toFixed(1) + " Z";
    const closeD = d + `L ${lastX.toFixed(1)} ${(PAD * 0.4 + innerH).toFixed(1)} L ${PAD} ${(PAD * 0.4 + innerH).toFixed(1)} Z`;
    return { d, f, band, gridY: [0.25, 0.5, 0.75].map((g) => PAD * 0.4 + innerH * g), lastX, lastY, closeD };
  }, [metric, tick]);

  return (
    <Card className="mtx-pad">
      <CardHead
        title="Telemetry Pulse"
        desc="Live signal blended with Metrixova's forecast band"
        right={
          <div className="mtx-tabset">
            {(["latency", "throughput", "errors"] as const).map((m) => (
              <span key={m} className={`mtx-tab ${metric === m ? "active" : ""}`} onClick={() => setMetric(m)}>
                {m === "latency" ? "Latency" : m === "throughput" ? "Throughput" : "Error rate"}
              </span>
            ))}
          </div>
        }
      />
      <svg viewBox="0 0 760 260" style={{ width: "100%", height: 260, overflow: "visible" }}>
        <defs>
          <linearGradient id="mtxFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridY.map((y, i) => <line key={i} x1={28} y1={y} x2={732} y2={y} stroke="var(--border-soft)" strokeWidth={1} />)}
        <path d={d + "L 546.6 250.4 L 28 250.4 Z"} fill="url(#mtxFill)" />
        <path d={band} fill="var(--predict)" opacity={0.14} />
        <path d={d} fill="none" stroke="var(--brand)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
        <path d={f} fill="none" stroke="var(--predict)" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="6 5" />
      </svg>
      <div className="mtx-legend">
        <div className="mtx-legenditem"><span className="mtx-swatch" style={{ background: "var(--brand)" }} />Observed signal</div>
        <div className="mtx-legenditem"><span className="mtx-swatch dashed" />AI forecast</div>
        <div className="mtx-legenditem"><span className="mtx-swatch" style={{ background: "var(--predict-dim)", border: "1px solid var(--predict)" }} />Confidence band</div>
      </div>
    </Card>
  );
}

const INSIGHTS = [
  { t: "Latency drift predicted", time: "2m ago", body: "checkout-api p99 trending toward SLA breach in ~40min. Root cause traced to a connection-pool saturation pattern.", kind: "predict" },
  { t: "Anomaly auto-resolved", time: "11m ago", body: "Elevated error rate on payments-gateway self-corrected after upstream retry backoff kicked in.", kind: "good" },
  { t: "New dependency mapped", time: "29m ago", body: "Correlation engine linked auth-service slowdowns to a noisy-neighbor effect on the shared Redis cluster.", kind: "signal" },
  { t: "Capacity forecast updated", time: "1h ago", body: "Ingest volume expected to cross provisioned capacity by Thursday 03:00 UTC.", kind: "warn" },
  { t: "Incident correlation", time: "2h ago", body: "3 alerts across 2 services grouped into a single root incident, reducing noise by 71%.", kind: "signal" },
  { t: "Reliability improved", time: "3h ago", body: "Mean time to diagnosis down 38% this week following anomaly-detection tuning.", kind: "good" },
] as const;

const KIND_STYLE: Record<string, { bg: string; fg: string; icon: string }> = {
  predict: { bg: "var(--predict-dim)", fg: "var(--predict)", icon: "bolt" },
  good: { bg: "var(--good-dim)", fg: "var(--good)", icon: "check" },
  signal: { bg: "var(--brand-dim)", fg: "var(--brand)", icon: "root" },
  warn: { bg: "var(--warn-dim)", fg: "var(--warn)", icon: "anomaly" },
};

function InsightsFeed() {
  return (
    <Card className="mtx-pad">
      <CardHead title="Live AI Insights" desc="Co-intelligence commentary, updated continuously" />
      <div className="mtx-feed">
        {INSIGHTS.map((i, idx) => {
          const k = KIND_STYLE[i.kind];
          return (
            <div className="mtx-feeditem" key={idx}>
              <div className="mtx-feedic" style={{ background: k.bg, color: k.fg }}><Ic name={k.icon} size={14} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mtx-feedtitle"><span>{i.t}</span><span className="mtx-feedtime mono">{i.time}</span></div>
                <div className="mtx-feedbody">{i.body}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function Pipeline() {
  const steps = [
    { icon: "ingest", label: "Metrics, logs & traces ingestion" },
    { icon: "root", label: "Correlation engine" },
    { icon: "anomaly", label: "Anomaly detection" },
    { icon: "bolt", label: "Predictive analytics" },
    { icon: "pulse2", label: "Incident intelligence" },
  ];
  return (
    <Card className="mtx-pad">
      <CardHead title="Observability AI Pipeline" desc="How raw telemetry becomes an explained, predicted signal" />
      <div className="mtx-pipeline">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="mtx-pipestep">
              <div className="mtx-pipeic"><Ic name={s.icon} size={19} /></div>
              <div className="mtx-pipelabel">{s.label}</div>
            </div>
            {i < steps.length - 1 && <div className="mtx-pipeconnector" />}
          </React.Fragment>
        ))}
      </div>
      <span className="mtx-nvidia"><Ic name="layers" size={12} />Powered by NVIDIA SDK</span>
    </Card>
  );
}

function InfraGauges() {
  return (
    <Card className="mtx-pad">
      <CardHead title="Infrastructure Health" desc="Resource utilization, live" />
      <div className="mtx-gaugegrid">
        <Gauge pct={63} color="var(--brand)" value="63%" label="CPU utilization" />
        <Gauge pct={51} color="var(--predict)" value="51%" label="Memory" />
        <Gauge pct={85} color="var(--warn)" value="85%" label="Network I/O" />
        <Gauge pct={34} color="var(--good)" value="34%" label="Storage" />
      </div>
    </Card>
  );
}

const SERVICES = [
  { name: "checkout-api", region: "ap-south-1", status: "watch", lat: "412ms", err: "1.8%", score: 64 },
  { name: "payments-gateway", region: "ap-south-1", status: "healthy", lat: "118ms", err: "0.2%", score: 12 },
  { name: "auth-service", region: "us-east-1", status: "critical", lat: "980ms", err: "6.4%", score: 91 },
  { name: "inventory-sync", region: "eu-west-1", status: "healthy", lat: "96ms", err: "0.1%", score: 8 },
  { name: "notification-worker", region: "ap-south-1", status: "healthy", lat: "54ms", err: "0.0%", score: 4 },
  { name: "search-indexer", region: "us-east-1", status: "watch", lat: "305ms", err: "1.1%", score: 47 },
] as const;

function ServiceTable() {
  const { navigate } = useApp();
  return (
    <Card className="mtx-pad" style={{ marginBottom: 16 }}>
      <CardHead title="Service Fleet" desc="P99 latency, error rate & live anomaly score per service"
        right={<button className="mtx-btn mtx-btnsm" onClick={() => navigate("infra")}>View all <Ic name="chevron" size={13} /></button>} />
      <div className="mtx-tablewrap">
        <table className="mtx-table">
          <thead><tr><th>Service</th><th>Status</th><th>Trend</th><th>P99 latency</th><th>Error rate</th><th>Anomaly score</th></tr></thead>
          <tbody>
            {SERVICES.map((s, idx) => {
              const scoreColor = s.score > 70 ? "var(--crit)" : s.score > 35 ? "var(--warn)" : "var(--good)";
              return (
                <tr className="mtx-row" key={s.name}>
                  <td><div className="mtx-svcname">{s.name}</div><div className="mtx-svcsub mono">{s.region}</div></td>
                  <td><StatusPill status={s.status as any} /></td>
                  <td><Spark seed={idx * 3} /></td>
                  <td className="mono">{s.lat}</td>
                  <td className="mono">{s.err}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="mtx-scorebar"><div style={{ width: `${s.score}%`, background: scoreColor }} /></div>
                      <span className="mono" style={{ fontSize: 11 }}>{s.score}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Heatmap() {
  const cells = useMemo(() => Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => Math.random())), []);
  return (
    <Card className="mtx-pad">
      <CardHead title="Anomaly Heatmap" desc="Detected deviations by hour, last 7 days" />
      <div className="mtx-heatdaylabels">{["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
      <div className="mtx-heatrowwrap">
        <div className="mtx-heathours">{["00", "04", "08", "12", "16", "20"].map((h) => <span key={h}>{h}</span>)}</div>
        <div className="mtx-heatmap">
          {cells.map((col, d) => (
            <div className="mtx-heatcol" key={d}>
              {col.map((v, h) => {
                let bg = "var(--surface-2)";
                if (v > 0.93) bg = "var(--crit)"; else if (v > 0.8) bg = "var(--warn)"; else if (v > 0.6) bg = "var(--brand-dim)";
                return <div className="mtx-heatcell" style={{ background: bg }} key={h} title={`Day ${d + 1}, ${h}:00`} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

const INCIDENTS_MINI = [
  { sev: "crit", title: "auth-service error spike", meta: ["INC-4821", "12m open", "2 services"], tag: "Critical" },
  { sev: "warn", title: "checkout-api latency degradation", meta: ["INC-4819", "38m open", "1 service"], tag: "Watching" },
  { sev: "warn", title: "search-indexer queue backlog", meta: ["INC-4814", "1h 6m open", "1 service"], tag: "Watching" },
] as const;

function IncidentsMini() {
  return (
    <Card className="mtx-pad">
      <CardHead title="Active Incidents" desc="Auto-correlated across services" />
      <div>
        {INCIDENTS_MINI.map((i, idx) => {
          const color = i.sev === "crit" ? "var(--crit)" : "var(--warn)";
          const bg = i.sev === "crit" ? "var(--crit-dim)" : "var(--warn-dim)";
          return (
            <div className="mtx-incident" key={idx}>
              <div className="mtx-incsev" style={{ background: color }} />
              <div style={{ flex: 1 }}>
                <div className="mtx-inctitle"><span>{i.title}</span><span className="mtx-inctag" style={{ background: bg, color }}>{i.tag}</span></div>
                <div className="mtx-incmeta mono">{i.meta.map((m, j) => <span key={j}>{m}</span>)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function KpiStrip() {
  const items = [
    { label: "Signals / sec", val: "184,204", icon: "chart", bg: "var(--brand-dim)", fg: "var(--brand)", delta: <Delta dir="up">+12.4%</Delta> },
    { label: "Active anomalies", val: "6", icon: "anomaly", bg: "var(--warn-dim)", fg: "var(--warn)", delta: <Delta dir="down">−2 vs. yday</Delta> },
    { label: "Predicted incidents 24h", val: "2", icon: "bolt", bg: "var(--predict-dim)", fg: "var(--predict)", delta: <Delta dir="flat">62% confidence</Delta> },
    { label: "AI confidence score", val: "94.2%", icon: "check", bg: "var(--good-dim)", fg: "var(--good)", delta: <Delta dir="up">+0.6%</Delta> },
    { label: "Mean time to diagnosis", val: "4m 12s", icon: "clock", bg: "var(--brand-dim)", fg: "var(--brand)", delta: <Delta dir="up">−38% w/ AI</Delta> },
    { label: "Reliability index", val: "4.8x", icon: "shield", bg: "var(--good-dim)", fg: "var(--good)", delta: <Delta dir="up">Best in class</Delta> },
  ];
  return (
    <div className="mtx-kpigrid">
      {items.map((it, i) => (
        <Card className="mtx-kpi" key={i}>
          <div className="mtx-kpitop">
            <span className="mtx-kpilabel">{it.label}</span>
            <div className="mtx-kpiicon" style={{ background: it.bg, color: it.fg }}><Ic name={it.icon} size={15} /></div>
          </div>
          <div className="mtx-kpival mono">{it.val}</div>
          {it.delta}
        </Card>
      ))}
    </div>
  );
}

function CommandCenter() {
  const { navigate, toast } = useApp();
  return (
    <>
      <SectionHead
        eyebrow="Live: all systems reporting"
        title="Command Center"
        sub="Real-time telemetry across every service, correlated and explained by Metrixova's AI observability engine."
        actions={<>
          <button className="mtx-btn" onClick={() => {
            const rows = SERVICES.map((s) => `${s.name},${s.region},${s.status},${s.lat},${s.err},${s.score}`).join("\n");
            downloadTextFile("metrixova-command-center-report.csv", "service,region,status,p99_latency,error_rate,anomaly_score\n" + rows);
            toast("Report exported.");
          }}><Ic name="download" size={15} />Export report</button>
          <button className="mtx-btn mtx-btnprimary" onClick={() => { navigate("integrations"); toast("Choose a source to connect."); }}><Ic name="plus" size={15} />Connect source</button>
        </>}
      />
      <KpiStrip />
      <div className="mtx-gridmain"><PulseChart /><InsightsFeed /></div>
      <div className="mtx-gridmain"><Pipeline /><InfraGauges /></div>
      <ServiceTable />
      <div className="mtx-gridbottom"><Heatmap /><IncidentsMini /></div>
    </>
  );
}

/* ================================================================
   SECTION: Metrics Explorer
   ================================================================ */

function MetricsExplorer() {
  const { toast } = useApp();
  const [service, setService] = useState("All services");
  const [range, setRange] = useState("24h");
  const [tag, setTag] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [env, setEnv] = useState("production");
  const [tier, setTier] = useState("all tiers");
  const [runCount, setRunCount] = useState(0);
  const chart = useMemo(() => genSeries(40, 50, 14), [service, range, runCount]);
  const chart2 = useMemo(() => genSeries(40, 30, 10), [service, range, runCount]);
  return (
    <>
      <SectionHead eyebrow="Explore" title="Metrics Explorer" sub="Query, compare and break down any metric across your fleet." />
      <Card className="mtx-pad" style={{ marginBottom: 16 }}>
        <div className="mtx-filterbar">
          <select className="mtx-select" value={service} onChange={(e) => setService(e.target.value)}>
            {["All services", "checkout-api", "payments-gateway", "auth-service", "inventory-sync"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="mtx-select" value={range} onChange={(e) => setRange(e.target.value)}>
            {["1h", "6h", "24h", "7d", "30d"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <input className="mtx-select" style={{ flex: 1, minWidth: 160 }} placeholder="Filter by tag: env:production" value={tag} onChange={(e) => setTag(e.target.value)} />
          <button className="mtx-btn mtx-btnsm" onClick={() => setShowMore((s) => !s)}><Ic name="filter" size={13} />{showMore ? "Fewer filters" : "More filters"}</button>
        </div>
        {showMore && (
          <div className="mtx-filterbar" style={{ marginTop: 10 }}>
            <select className="mtx-select" value={env} onChange={(e) => setEnv(e.target.value)}>
              {["production", "staging", "development"].map((e) => <option key={e}>{e}</option>)}
            </select>
            <select className="mtx-select" value={tier} onChange={(e) => setTier(e.target.value)}>
              {["all tiers", "tier-1", "tier-2", "tier-3"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <button className="mtx-btn mtx-btnsm mtx-btnprimary" onClick={() => { setRunCount((c) => c + 1); toast(`Filtered to ${env} · ${tier}.`); }}>Apply</button>
          </div>
        )}
      </Card>
      <div className="mtx-gridmain">
        <Card className="mtx-pad">
          <CardHead title="p99 Latency" desc={`${service} · last ${range}`} />
          <MiniLineChart data={chart} color="var(--brand)" />
        </Card>
        <Card className="mtx-pad">
          <CardHead title="Request volume" desc={`${service} · last ${range}`} />
          <MiniLineChart data={chart2} color="var(--predict)" />
        </Card>
      </div>
      <div className="mtx-gridmain">
        <Card className="mtx-pad">
          <CardHead title="Saved queries" desc="Reusable metric expressions" />
          <div className="mtx-listrows">
            {["avg(latency) by service", "sum(errors) / sum(requests)", "p95(db_query_time)", "rate(cache_miss_total)"].map((q) => (
              <div className="mtx-listrow" key={q}>
                <span className="mono">{q}</span>
                <button className="mtx-btn mtx-btnsm" onClick={() => { setRunCount((c) => c + 1); toast(`Query executed: ${q}`); }}>Run</button>
              </div>
            ))}
          </div>
        </Card>
        <Card className="mtx-pad">
          <CardHead title="Top movers" desc="Largest change vs. previous period" />
          <div className="mtx-listrows">
            {[
              { n: "auth-service p99", d: "+184%", bad: true },
              { n: "cdn-edge cache hit rate", d: "+6.2%", bad: false },
              { n: "checkout-api error rate", d: "+42%", bad: true },
              { n: "search-indexer throughput", d: "-18%", bad: true },
            ].map((m) => (
              <div className="mtx-listrow" key={m.n}>
                <span>{m.n}</span>
                <Delta dir={m.bad ? "down" : "up"}>{m.d}</Delta>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const W = 660, H = 200;
  const step = W / (data.length - 1);
  const d = data.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(H - (p / max) * H * 0.85).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 200 }}>
      {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1={0} y1={H * g} x2={W} y2={H * g} stroke="var(--border-soft)" strokeWidth={1} />)}
      <path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ================================================================
   SECTION: Anomaly Detection
   ================================================================ */

const ANOMALIES = [
  { svc: "auth-service", metric: "error_rate", dev: "+412%", sev: "critical", detected: "12m ago", status: "Open" },
  { svc: "checkout-api", metric: "p99_latency", dev: "+164%", sev: "watch", detected: "38m ago", status: "Investigating" },
  { svc: "search-indexer", metric: "queue_depth", dev: "+88%", sev: "watch", detected: "1h 6m ago", status: "Investigating" },
  { svc: "payments-gateway", metric: "cpu_utilization", dev: "+31%", sev: "healthy", detected: "3h ago", status: "Resolved" },
  { svc: "inventory-sync", metric: "db_connections", dev: "+22%", sev: "healthy", detected: "5h ago", status: "Resolved" },
  { svc: "notification-worker", metric: "retry_rate", dev: "+140%", sev: "watch", detected: "6h ago", status: "Resolved" },
] as const;

function AnomalyDetection() {
  const [sensitivity, setSensitivity] = useState(72);
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const rows = ANOMALIES.filter((a) => filter === "all" || (filter === "open" ? a.status !== "Resolved" : a.status === "Resolved"));
  return (
    <>
      <SectionHead eyebrow="Detection" title="Anomaly Detection" sub="Statistical + AI models watching every metric stream for deviation." />
      <div className="mtx-gridmain" style={{ gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 16 }}>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">Detectors active</div><div className="mtx-kpival mono">312</div><Delta dir="up">+4 this week</Delta></Card>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">Open anomalies</div><div className="mtx-kpival mono">6</div><Delta dir="down">−2 vs. yday</Delta></Card>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">False-positive rate</div><div className="mtx-kpival mono">3.1%</div><Delta dir="up">−1.2%</Delta></Card>
      </div>
      <Card className="mtx-pad" style={{ marginBottom: 16 }}>
        <CardHead title="Detection sensitivity" desc="Higher sensitivity surfaces smaller deviations sooner, at the cost of more noise." />
        <div className="mtx-sliderrow">
          <input type="range" min={0} max={100} value={sensitivity} onChange={(e) => setSensitivity(Number(e.target.value))} className="mtx-slider" />
          <span className="mono mtx-sliderval">{sensitivity}%</span>
        </div>
      </Card>
      <Card className="mtx-pad">
        <CardHead title="Detected anomalies" desc="AI-scored deviations across the fleet"
          right={
            <div className="mtx-tabset">
              {(["all", "open", "resolved"] as const).map((f) => (
                <span key={f} className={`mtx-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</span>
              ))}
            </div>
          } />
        <div className="mtx-tablewrap">
          <table className="mtx-table">
            <thead><tr><th>Service</th><th>Metric</th><th>Deviation</th><th>Severity</th><th>Detected</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((a, i) => (
                <tr className="mtx-row" key={i}>
                  <td className="mtx-svcname">{a.svc}</td>
                  <td className="mono">{a.metric}</td>
                  <td><Delta dir="down">{a.dev}</Delta></td>
                  <td><StatusPill status={a.sev as any} /></td>
                  <td className="mono">{a.detected}</td>
                  <td>{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Predictive Insights
   ================================================================ */

function PredictiveInsights() {
  return (
    <>
      <SectionHead eyebrow="Forecast" title="Predictive Insights" sub="Where your systems are headed, before they get there." />
      <div className="mtx-gridmain">
        <Card className="mtx-pad">
          <CardHead title="Capacity forecast" desc="Projected ingest volume vs. provisioned capacity" />
          <ForecastChart />
          <div className="mtx-legend">
            <div className="mtx-legenditem"><span className="mtx-swatch" style={{ background: "var(--brand)" }} />Actual</div>
            <div className="mtx-legenditem"><span className="mtx-swatch dashed" />Forecast</div>
            <div className="mtx-legenditem"><span className="mtx-swatch" style={{ background: "var(--crit)" }} />Capacity ceiling</div>
          </div>
        </Card>
        <Card className="mtx-pad">
          <CardHead title="Risk timeline" desc="Next 72 hours" />
          <div className="mtx-listrows">
            {[
              { t: "Thu 03:00 UTC", d: "Ingest volume crosses provisioned capacity", risk: "critical" },
              { t: "Thu 14:00 UTC", d: "auth-service p99 likely to breach 800ms SLA", risk: "watch" },
              { t: "Fri 09:00 UTC", d: "Scheduled batch job may amplify checkout-api load", risk: "watch" },
              { t: "Sat 00:00 UTC", d: "Low-traffic window, safe for maintenance", risk: "healthy" },
            ].map((r, i) => (
              <div className="mtx-listrow" key={i}>
                <div><div style={{ fontWeight: 600, fontSize: 12.5 }}>{r.d}</div><div className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>{r.t}</div></div>
                <StatusPill status={r.risk as any} />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="mtx-pad">
        <CardHead title="Model confidence by service" desc="How much Metrixova trusts its own forecast" />
        <div className="mtx-listrows">
          {SERVICES.map((s, i) => {
            const conf = [88, 96, 61, 94, 99, 74][i];
            return (
              <div className="mtx-listrow" key={s.name}>
                <span className="mtx-svcname">{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                  <div className="mtx-scorebar" style={{ width: 120 }}><div style={{ width: `${conf}%`, background: "var(--predict)" }} /></div>
                  <span className="mono" style={{ fontSize: 11 }}>{conf}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function ForecastChart() {
  const { d1, d2, ceiling } = useMemo(() => {
    const actual = genSeries(24, 40, 12);
    const forecast = genSeries(12, actual[actual.length - 1], 10);
    const W = 660, max = 100;
    const stepA = (W * 0.65) / (actual.length - 1);
    const stepF = (W * 0.35) / (forecast.length - 1);
    let d1 = actual.map((p, i) => `${i === 0 ? "M" : "L"} ${(i * stepA).toFixed(1)} ${(200 - (p / max) * 180).toFixed(1)}`).join(" ");
    const lastX = (actual.length - 1) * stepA, lastY = 200 - (actual[actual.length - 1] / max) * 180;
    let d2 = `M ${lastX.toFixed(1)} ${lastY.toFixed(1)} `;
    forecast.forEach((p, i) => { const x = lastX + (i + 1) * stepF, y = 200 - (p / max) * 180; d2 += `L ${x.toFixed(1)} ${y.toFixed(1)} `; });
    return { d1, d2, ceiling: 200 - (78 / max) * 180 };
  }, []);
  return (
    <svg viewBox="0 0 660 200" style={{ width: "100%", height: 200 }}>
      <line x1={0} y1={ceiling} x2={660} y2={ceiling} stroke="var(--crit)" strokeWidth={1.5} strokeDasharray="3 4" />
      <path d={d1} fill="none" stroke="var(--brand)" strokeWidth={2.2} strokeLinecap="round" />
      <path d={d2} fill="none" stroke="var(--predict)" strokeWidth={2.2} strokeDasharray="6 5" strokeLinecap="round" />
    </svg>
  );
}

/* ================================================================
   SECTION: Root Cause Engine
   ================================================================ */

function RootCauseEngine() {
  const nodes = [
    { id: "lb", label: "Load Balancer", x: 60, y: 100, status: "healthy" },
    { id: "auth", label: "auth-service", x: 220, y: 40, status: "critical" },
    { id: "checkout", label: "checkout-api", x: 220, y: 160, status: "watch" },
    { id: "redis", label: "Redis Cluster", x: 400, y: 100, status: "watch" },
    { id: "db", label: "Postgres", x: 570, y: 40, status: "healthy" },
    { id: "queue", label: "Job Queue", x: 570, y: 160, status: "healthy" },
  ] as const;
  const edges = [["lb", "auth"], ["lb", "checkout"], ["auth", "redis"], ["checkout", "redis"], ["redis", "db"], ["redis", "queue"]];
  const colorOf = (s: string) => s === "critical" ? "var(--crit)" : s === "watch" ? "var(--warn)" : "var(--good)";
  const find = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <>
      <SectionHead eyebrow="Diagnose" title="Root Cause Engine" sub="Auto-correlated dependency graph tracing an incident back to its source." />
      <Card className="mtx-pad" style={{ marginBottom: 16 }}>
        <CardHead title="Service dependency graph" desc="auth-service error spike, INC-4821" />
        <svg viewBox="0 0 640 210" style={{ width: "100%", height: 260 }}>
          {edges.map(([a, b], i) => { const A = find(a), B = find(b); return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--border)" strokeWidth={1.5} />; })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={26} fill="var(--surface-2)" stroke={colorOf(n.status)} strokeWidth={2} />
              <circle cx={n.x} cy={n.y} r={4} fill={colorOf(n.status)} />
              <text x={n.x} y={n.y + 42} textAnchor="middle" fontSize={11} fill="var(--text-dim)" fontFamily="Inter, sans-serif">{n.label}</text>
            </g>
          ))}
        </svg>
      </Card>
      <Card className="mtx-pad">
        <CardHead title="Correlated signals" desc="Ranked by contribution to root cause" />
        <div className="mtx-listrows">
          {[
            { s: "auth-service → connection pool exhaustion", c: 96 },
            { s: "Redis cluster → elevated command latency", c: 74 },
            { s: "checkout-api → downstream timeout retries", c: 58 },
            { s: "Load balancer → healthy, ruled out", c: 6 },
          ].map((r, i) => (
            <div className="mtx-listrow" key={i}>
              <span>{r.s}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="mtx-scorebar" style={{ width: 120 }}><div style={{ width: `${r.c}%`, background: r.c > 70 ? "var(--crit)" : r.c > 30 ? "var(--warn)" : "var(--good)" }} /></div>
                <span className="mono" style={{ fontSize: 11 }}>{r.c}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Infrastructure
   ================================================================ */

const NODES = [
  { name: "ip-10-0-1-14", role: "api", region: "ap-south-1a", cpu: 71, mem: 58, status: "watch" },
  { name: "ip-10-0-1-22", role: "api", region: "ap-south-1b", cpu: 44, mem: 39, status: "healthy" },
  { name: "ip-10-0-2-08", role: "worker", region: "ap-south-1a", cpu: 88, mem: 92, status: "critical" },
  { name: "ip-10-0-2-11", role: "worker", region: "ap-south-1b", cpu: 33, mem: 41, status: "healthy" },
  { name: "ip-10-0-3-04", role: "db-replica", region: "us-east-1a", cpu: 27, mem: 63, status: "healthy" },
  { name: "ip-10-0-3-09", role: "cache", region: "us-east-1b", cpu: 52, mem: 77, status: "watch" },
] as const;

function Infrastructure() {
  return (
    <>
      <SectionHead eyebrow="Infrastructure" title="Infrastructure" sub="Every node, container and cluster feeding the observability engine." />
      <div className="mtx-gridmain" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 16 }}>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">Nodes online</div><div className="mtx-kpival mono">142 / 146</div><Delta dir="flat">97.2% healthy</Delta></Card>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">Clusters</div><div className="mtx-kpival mono">9</div><Delta dir="up">3 regions</Delta></Card>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">Avg CPU</div><div className="mtx-kpival mono">58%</div><Delta dir="up">+6% today</Delta></Card>
        <Card className="mtx-kpi"><div className="mtx-kpilabel">Avg memory</div><div className="mtx-kpival mono">61%</div><Delta dir="flat">stable</Delta></Card>
      </div>
      <Card className="mtx-pad">
        <CardHead title="Node fleet" desc="Compute resources across regions" />
        <div className="mtx-tablewrap">
          <table className="mtx-table">
            <thead><tr><th>Node</th><th>Role</th><th>Region</th><th>CPU</th><th>Memory</th><th>Status</th></tr></thead>
            <tbody>
              {NODES.map((n) => (
                <tr className="mtx-row" key={n.name}>
                  <td className="mono">{n.name}</td>
                  <td>{n.role}</td>
                  <td className="mono">{n.region}</td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="mtx-scorebar"><div style={{ width: `${n.cpu}%`, background: n.cpu > 80 ? "var(--crit)" : n.cpu > 60 ? "var(--warn)" : "var(--good)" }} /></div><span className="mono" style={{ fontSize: 11 }}>{n.cpu}%</span></div></td>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div className="mtx-scorebar"><div style={{ width: `${n.mem}%`, background: n.mem > 80 ? "var(--crit)" : n.mem > 60 ? "var(--warn)" : "var(--good)" }} /></div><span className="mono" style={{ fontSize: 11 }}>{n.mem}%</span></div></td>
                  <td><StatusPill status={n.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Incidents
   ================================================================ */

const INCIDENTS_FULL = [
  { id: "INC-4821", title: "auth-service error spike", sev: "critical", status: "Open", opened: "12m ago", services: 2, owner: "R. Berugoda" },
  { id: "INC-4819", title: "checkout-api latency degradation", sev: "watch", status: "Investigating", opened: "38m ago", services: 1, owner: "Unassigned" },
  { id: "INC-4814", title: "search-indexer queue backlog", sev: "watch", status: "Investigating", opened: "1h 6m ago", services: 1, owner: "S. Fernando" },
  { id: "INC-4801", title: "payments-gateway retry storm", sev: "healthy", status: "Resolved", opened: "Yesterday", services: 1, owner: "R. Berugoda" },
  { id: "INC-4788", title: "inventory-sync DB connection leak", sev: "healthy", status: "Resolved", opened: "2 days ago", services: 1, owner: "M. Perera" },
] as const;

function Incidents() {
  const { toast } = useApp();
  type IncidentRow = { id: string; title: string; sev: "critical" | "watch" | "healthy"; status: string; opened: string; services: number; owner: string };
  const [list, setList] = useState<IncidentRow[]>(() => INCIDENTS_FULL.map((i) => ({ ...i })));
  const [filter, setFilter] = useState<"all" | "open" | "resolved">("all");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [sev, setSev] = useState<"critical" | "watch" | "healthy">("watch");
  const rows = list.filter((i) => filter === "all" || (filter === "open" ? i.status !== "Resolved" : i.status === "Resolved"));

  function createIncident(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast("Give the incident a title first."); return; }
    const id = `INC-${4822 + list.length}`;
    setList((l) => [{ id, title: title.trim(), sev, status: sev === "healthy" ? "Resolved" : "Open", opened: "Just now", services: 1, owner: "Randula Berugoda" }, ...l]);
    setTitle(""); setSev("watch"); setShowForm(false);
    toast(`${id} created.`);
  }

  return (
    <>
      <SectionHead eyebrow="Incidents" title="Incidents" sub="Every incident, auto-correlated and tracked to resolution."
        actions={<button className="mtx-btn mtx-btnprimary" onClick={() => setShowForm((s) => !s)}><Ic name={showForm ? "x" : "plus"} size={15} />{showForm ? "Cancel" : "New incident"}</button>} />
      {showForm && (
        <Card className="mtx-pad" style={{ marginBottom: 16 }}>
          <form onSubmit={createIncident} className="mtx-filterbar" style={{ alignItems: "center" }}>
            <input className="mtx-select" style={{ flex: 1, minWidth: 200 }} placeholder="Incident title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
            <select className="mtx-select" value={sev} onChange={(e) => setSev(e.target.value as any)}>
              <option value="critical">Critical</option>
              <option value="watch">Watching</option>
              <option value="healthy">Resolved</option>
            </select>
            <button className="mtx-btn mtx-btnprimary" type="submit">Create</button>
          </form>
        </Card>
      )}
      <Card className="mtx-pad">
        <CardHead title="All incidents" desc="Sorted by most recent"
          right={<div className="mtx-tabset">{(["all", "open", "resolved"] as const).map((f) => <span key={f} className={`mtx-tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</span>)}</div>} />
        <div className="mtx-tablewrap">
          <table className="mtx-table">
            <thead><tr><th>ID</th><th>Title</th><th>Severity</th><th>Status</th><th>Opened</th><th>Services</th><th>Owner</th></tr></thead>
            <tbody>
              {rows.map((i) => (
                <tr className="mtx-row" key={i.id}>
                  <td className="mono">{i.id}</td>
                  <td className="mtx-svcname">{i.title}</td>
                  <td><StatusPill status={i.sev as any} /></td>
                  <td>{i.status}</td>
                  <td className="mono">{i.opened}</td>
                  <td>{i.services}</td>
                  <td>{i.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Integrations
   ================================================================ */

const INTEGRATIONS = [
  { name: "AWS CloudWatch", cat: "Cloud", icon: "server" },
  { name: "Kubernetes", cat: "Orchestration", icon: "grid2" },
  { name: "Prometheus", cat: "Metrics", icon: "chart" },
  { name: "Datadog", cat: "Metrics", icon: "anomaly" },
  { name: "Slack", cat: "Alerting", icon: "bell" },
  { name: "PagerDuty", cat: "Alerting", icon: "bolt" },
  { name: "Grafana", cat: "Visualization", icon: "layers" },
  { name: "Splunk", cat: "Logs", icon: "doc" },
  { name: "GitHub Actions", cat: "CI/CD", icon: "root" },
];

function Integrations() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ "AWS CloudWatch": true, Kubernetes: true, Slack: true });
  return (
    <>
      <SectionHead eyebrow="Connect" title="Integrations" sub="Bring every telemetry source into one observability layer." />
      <div className="mtx-intgrid">
        {INTEGRATIONS.map((it) => {
          const on = !!connected[it.name];
          return (
            <Card className="mtx-pad mtx-intcard" key={it.name}>
              <div className="mtx-inticon"><Ic name={it.icon} size={18} /></div>
              <div style={{ flex: 1 }}>
                <div className="mtx-svcname">{it.name}</div>
                <div className="mtx-svcsub">{it.cat}</div>
              </div>
              <button className={`mtx-btn mtx-btnsm ${on ? "" : "mtx-btnprimary"}`} onClick={() => setConnected((c) => ({ ...c, [it.name]: !on }))}>
                {on ? "Connected" : "Connect"}
              </button>
            </Card>
          );
        })}
      </div>
    </>
  );
}

/* ================================================================
   SECTION: Reports
   ================================================================ */

const FREQ_OPTIONS = ["Daily · 09:00", "Weekly · Mondays 08:00", "Bi-weekly", "Monthly · 1st"];

function Reports() {
  const { toast } = useApp();
  const [reports, setReports] = useState([
    { name: "Weekly Reliability Summary", freq: "Weekly · Mondays 08:00", last: "Jul 8, 2026" },
    { name: "Monthly SLA Compliance", freq: "Monthly · 1st", last: "Jul 1, 2026" },
    { name: "Anomaly Digest", freq: "Daily · 09:00", last: "Today" },
    { name: "Capacity Planning Report", freq: "Bi-weekly", last: "Jun 28, 2026" },
  ]);
  const [editing, setEditing] = useState<string | null>(null);

  function scheduleReport() {
    const name = `Custom Report ${reports.length + 1}`;
    setReports((r) => [...r, { name, freq: "Weekly · Mondays 08:00", last: "Not yet sent" }]);
    toast(`${name} scheduled.`);
  }
  function download(r: { name: string; freq: string; last: string }) {
    downloadTextFile(`${r.name.replace(/\s+/g, "-").toLowerCase()}.txt`,
      `Metrixova report: ${r.name}\nSchedule: ${r.freq}\nLast sent: ${r.last}\n\nThis is a generated placeholder export.`);
    toast(`${r.name} downloaded.`);
  }
  return (
    <>
      <SectionHead eyebrow="Reports" title="Reports" sub="Scheduled and on-demand summaries for stakeholders."
        actions={<button className="mtx-btn mtx-btnprimary" onClick={scheduleReport}><Ic name="plus" size={15} />Schedule report</button>} />
      <Card className="mtx-pad">
        <CardHead title="Scheduled reports" desc="Auto-generated and delivered" />
        <div className="mtx-listrows">
          {reports.map((r) => (
            <div key={r.name}>
              <div className="mtx-listrow">
                <div><div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>{r.freq} · last sent {r.last}</div></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="mtx-btn mtx-btnsm" onClick={() => download(r)}><Ic name="download" size={13} />Download</button>
                  <button className="mtx-btn mtx-btnsm" onClick={() => setEditing(editing === r.name ? null : r.name)}>{editing === r.name ? "Close" : "Edit"}</button>
                </div>
              </div>
              {editing === r.name && (
                <div className="mtx-filterbar" style={{ paddingBottom: 12 }}>
                  <select className="mtx-select" value={r.freq} onChange={(e) => {
                    const freq = e.target.value;
                    setReports((rs) => rs.map((x) => (x.name === r.name ? { ...x, freq } : x)));
                  }}>
                    {FREQ_OPTIONS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  <button className="mtx-btn mtx-btnsm mtx-btnprimary" onClick={() => { setEditing(null); toast(`${r.name} updated.`); }}>Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Developer API
   ================================================================ */

function randomKey() {
  const chars = "abcdef0123456789";
  let s = "mtx_live_sk_";
  for (let i = 0; i < 32; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function DeveloperAPI() {
  const { toast } = useApp();
  const [revealed, setRevealed] = useState(false);
  const [key, setKey] = useState("mtx_live_sk_8f2a1c9d7e4b6019a2f3c8b7d1e5a904");
  const masked = key.slice(0, 12) + "•".repeat(18) + key.slice(-4);
  return (
    <>
      <SectionHead eyebrow="Build" title="Developer API" sub="Pull telemetry and predictions into your own tools." />
      <div className="mtx-gridmain">
        <Card className="mtx-pad">
          <CardHead title="API key" desc="Use this key to authenticate requests" />
          <div className="mtx-listrow" style={{ borderTop: "none", paddingTop: 0 }}>
            <span className="mono" style={{ fontSize: 12.5 }}>{revealed ? key : masked}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="mtx-btn mtx-btnsm" onClick={() => setRevealed((r) => !r)}><Ic name="eye" size={13} />{revealed ? "Hide" : "Reveal"}</button>
              <button className="mtx-btn mtx-btnsm" onClick={() => {
                if (navigator.clipboard) navigator.clipboard.writeText(key).catch(() => {});
                toast("API key copied.");
              }}><Ic name="copy" size={13} />Copy</button>
              <button className="mtx-btn mtx-btnsm" onClick={() => { setKey(randomKey()); setRevealed(false); toast("API key rotated. Update your integrations."); }}>Rotate</button>
            </div>
          </div>
        </Card>
        <Card className="mtx-pad">
          <CardHead title="Docs" desc="Reference & guides" />
          <div className="mtx-listrows">
            {["Quickstart", "Metrics ingestion API", "Query language reference", "Webhooks"].map((d) => (
              <div className="mtx-listrow" key={d} onClick={() => toast(`${d}: docs coming soon.`)} style={{ cursor: "pointer" }}><span>{d}</span><Ic name="chevron" size={13} /></div>
            ))}
          </div>
          <span className="mtx-nvidia" style={{ background: "var(--brand-dim)", color: "var(--brand)", borderColor: "transparent" }}>Full docs coming soon</span>
        </Card>
      </div>
      <Card className="mtx-pad">
        <CardHead title="Example request" desc="Fetch the last hour of latency for a service" />
        <pre className="mtx-code mono">{`curl https://api.metrixova.com/v1/metrics/query \\
  -H "Authorization: Bearer ${masked}" \\
  -d '{"metric":"latency_p99","service":"checkout-api","range":"1h"}'`}</pre>
      </Card>
    </>
  );
}

/* ================================================================
   SECTION: Account / Settings  (frontend only)
   ================================================================ */

function AccountSettings() {
  const { toast } = useApp();
  const [name, setName] = useState("Randula Berugoda");
  const [email] = useState("randulaxp@gmail.com");
  const [role, setRole] = useState("Admin · Platform Engineering");
  const [savedMsg, setSavedMsg] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(true);
  const [notifDigest, setNotifDigest] = useState(false);

  const [sessions, setSessions] = useState([
    { id: 1, label: "Chrome · Colombo, LK", you: true },
    { id: 2, label: "Safari · Colombo, LK", you: false },
  ]);
  const [deactivated, setDeactivated] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPhoto(reader.result as string); toast("Photo updated."); };
    reader.readAsDataURL(file);
  }
  function signOutSession(id: number) {
    setSessions((s) => s.filter((x) => x.id !== id));
    toast("Signed out of that device.");
  }
  function deactivateAccount() {
    if (window.confirm("Deactivate your account? This can't be undone here.")) {
      setDeactivated(true);
      toast("Account deactivated.");
    }
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavedMsg("Profile updated.");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!curPw || !newPw || !confirmPw) { setPwMsg({ type: "error", text: "Fill in all password fields." }); return; }
    if (newPw.length < 8) { setPwMsg({ type: "error", text: "New password must be at least 8 characters." }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: "error", text: "New password and confirmation don't match." }); return; }
    setPwMsg({ type: "success", text: "Password changed successfully." });
    setCurPw(""); setNewPw(""); setConfirmPw("");
    setTimeout(() => setPwMsg(null), 3000);
  }

  return (
    <>
      <SectionHead eyebrow="Account" title="Settings" sub="Manage your profile, security and notification preferences." />

      <div className="mtx-gridmain">
        <Card className="mtx-pad">
          <CardHead title="Profile" desc="Your identity across Metrixova" />
          <form onSubmit={saveProfile}>
            <div className="mtx-formrow">
              <div className="avatar" style={{ width: 56, height: 56, fontSize: 18, backgroundImage: photo ? `url(${photo})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                {!photo && name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />
              <button type="button" className="mtx-btn mtx-btnsm" onClick={() => fileInputRef.current?.click()}><Ic name="image" size={13} />Change photo</button>
            </div>
            <label className="mtx-label">Full name</label>
            <input className="mtx-input" value={name} onChange={(e) => setName(e.target.value)} />
            <label className="mtx-label">Email address</label>
            <input className="mtx-input" value={email} disabled />
            <label className="mtx-label">Role</label>
            <input className="mtx-input" value={role} onChange={(e) => setRole(e.target.value)} />
            <div className="mtx-formfoot">
              {savedMsg && <span className="mtx-msg mtx-msgsuccess">{savedMsg}</span>}
              <button className="mtx-btn mtx-btnprimary" type="submit">Save changes</button>
            </div>
          </form>
        </Card>

        <Card className="mtx-pad">
          <CardHead title="Change password" desc="Choose a strong password you don't use elsewhere" />
          <form onSubmit={changePassword}>
            <label className="mtx-label">Current password</label>
            <input className="mtx-input" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} placeholder="••••••••" />
            <label className="mtx-label">New password</label>
            <input className="mtx-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="At least 8 characters" />
            <label className="mtx-label">Confirm new password</label>
            <input className="mtx-input" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" />
            <div className="mtx-formfoot">
              {pwMsg && <span className={`mtx-msg ${pwMsg.type === "error" ? "mtx-msgerror" : "mtx-msgsuccess"}`}>{pwMsg.text}</span>}
              <button className="mtx-btn mtx-btnprimary" type="submit">Update password</button>
            </div>
          </form>
        </Card>
      </div>

      <div className="mtx-gridmain">
        <Card className="mtx-pad">
          <CardHead title="Notifications" desc="Choose how Metrixova reaches you" />
          <div className="mtx-listrow" style={{ borderTop: "none", paddingTop: 4 }}><span>Email alerts for critical incidents</span><Toggle checked={notifEmail} onChange={setNotifEmail} /></div>
          <div className="mtx-listrow"><span>Slack notifications</span><Toggle checked={notifSlack} onChange={setNotifSlack} /></div>
          <div className="mtx-listrow"><span>Weekly digest email</span><Toggle checked={notifDigest} onChange={setNotifDigest} /></div>
        </Card>

        <Card className="mtx-pad">
          <CardHead title="Sessions" desc="Where you're signed in" />
          <div className="mtx-listrows">
            {sessions.map((s) => (
              <div className="mtx-listrow" key={s.id}>
                <span>{s.label}{s.you && <span style={{ color: "var(--good)", fontWeight: 600 }}> · This device</span>}</span>
                {s.you ? <span className="mono" style={{ fontSize: 11 }}>Active now</span> :
                  <button className="mtx-btn mtx-btnsm" onClick={() => signOutSession(s.id)}><Ic name="logout" size={13} />Sign out</button>}
              </div>
            ))}
            {sessions.length === 1 && <div style={{ fontSize: 12, color: "var(--text-faint)", paddingTop: 10 }}>No other active sessions.</div>}
          </div>
        </Card>
      </div>

      <Card className="mtx-pad" style={{ borderColor: "var(--crit-dim)" }}>
        <CardHead title="Danger zone" desc="These actions are permanent" />
        <div className="mtx-listrow" style={{ borderTop: "none", paddingTop: 4 }}>
          <span>Deactivate account{deactivated && <span style={{ color: "var(--crit)", fontWeight: 600 }}> · Deactivated</span>}</span>
          <button className="mtx-btn" disabled={deactivated} style={{ color: "var(--crit)", borderColor: "var(--crit-dim)", opacity: deactivated ? 0.5 : 1 }} onClick={deactivateAccount}>
            <Ic name="trash" size={13} />{deactivated ? "Deactivated" : "Deactivate"}
          </button>
        </div>
      </Card>
    </>
  );
}

/* ================================================================
   Sidebar + Topbar
   ================================================================ */

const NAV: { group: string; items: { id: SectionId; label: string; icon: string; badge?: string; badgeColor?: string; live?: boolean }[] }[] = [
  { group: "Monitor", items: [
    { id: "command", label: "Command Center", icon: "grid", live: true },
    { id: "metrics", label: "Metrics Explorer", icon: "chart" },
    { id: "anomaly", label: "Anomaly Detection", icon: "anomaly", badge: "6" },
    { id: "predictive", label: "Predictive Insights", icon: "bolt" },
  ]},
  { group: "Operations", items: [
    { id: "rootcause", label: "Root Cause Engine", icon: "root" },
    { id: "infra", label: "Infrastructure", icon: "server" },
    { id: "incidents", label: "Incidents", icon: "bell", badge: "3", badgeColor: "crit" },
    { id: "integrations", label: "Integrations", icon: "grid2" },
  ]},
  { group: "Account", items: [
    { id: "reports", label: "Reports", icon: "doc" },
    { id: "api", label: "Developer API", icon: "api" },
    { id: "account", label: "Settings", icon: "gear" },
  ]},
];

function Sidebar({ active, onNavigate, open, onClose }: { active: SectionId; onNavigate: (s: SectionId) => void; open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore errors and still navigate
    }
    navigate('/access', { replace: true });
  }

  return (
    <>
      <div className={`mtx-overlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`mtx-sidebar ${open ? "open" : ""}`}>
        <div className="mtx-brand">
          <div className="mtx-brandmark">
            <img src={logoSvg} alt="Logo" className="mtx-brandlogo" />
          </div>
        </div>
        <nav className="mtx-navscroll">
          {NAV.map((g) => (
            <div className="mtx-navgroup" key={g.group}>
              <div className="mtx-navlabel">{g.group}</div>
              {g.items.map((it) => (
                <a key={it.id} className={`mtx-navitem ${active === it.id ? "active" : ""}`} onClick={() => onNavigate(it.id)}>
                  <Ic name={it.icon} size={17} />
                  {it.label}
                  {it.live && <span className="mtx-livedot" />}
                  {it.badge && <span className="mtx-badge" style={it.badgeColor === "crit" ? { background: "var(--crit-dim)", color: "var(--crit)" } : undefined}>{it.badge}</span>}
                </a>
              ))}
            </div>
          ))}
        </nav>
        <div className="mtx-sidebarfoot">
          <div className="avatar">RB</div>
          <div><div className="mtx-footname">Randula Berugoda</div><div className="mtx-footrole">Admin · Platform Eng.</div></div>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <button type="button" className="mtx-btn mtx-btnsm" onClick={handleSignOut}><Ic name="logout" size={13} />Sign out</button>
        </div>
      </aside>
    </>
  );
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Critical anomaly on auth-service", body: "Error rate up 412%, INC-4821 opened.", time: "12m ago", read: false, kind: "crit" as const },
  { id: 2, title: "Latency drift predicted", body: "checkout-api p99 trending toward SLA breach.", time: "2m ago", read: false, kind: "predict" as const },
  { id: 3, title: "Capacity forecast updated", body: "Ingest volume nearing provisioned capacity.", time: "1h ago", read: false, kind: "warn" as const },
  { id: 4, title: "Weekly Reliability Summary sent", body: "Delivered to your inbox.", time: "3h ago", read: false, kind: "good" as const },
];

function Topbar({ onBurger, section, theme, onToggleTheme }: { onBurger: () => void; section: SectionId; theme: "dark" | "light"; onToggleTheme: () => void }) {
  const { toast, navigate } = useApp();
  const now = useLiveClock();
  const [latency, setLatency] = useState(142);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: SectionId; label: string }[]>([]);

  const sectionItems = NAV.flatMap((g) => g.items);

  useEffect(() => {
    const id = setInterval(() => setLatency(118 + Math.round(Math.random() * 55)), 2600);
    return () => clearInterval(id);
  }, []);

  const label = sectionItems.find((i) => i.id === section)?.label || "Command Center";

  const handleSearchChange = (value: string) => {
    setQuery(value);
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      setSearchResults([]);
      return;
    }

    const matches = sectionItems
      .filter((item) => item.label.toLowerCase().includes(normalized) || item.id.toLowerCase().includes(normalized))
      .slice(0, 6);

    setSearchResults(matches);
  };

  const activateSearchResult = (result: { id: SectionId; label: string }) => {
    navigate(result.id);
    setQuery("");
    setSearchResults([]);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchResults.length > 0) {
        activateSearchResult(searchResults[0]);
      }
    } else if (event.key === "Escape") {
      setQuery("");
      setSearchResults([]);
    }
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="mtx-topbar">
      <button className="mtx-burger" onClick={onBurger} aria-label="Toggle menu"><Ic name="menu" size={20} /></button>
      <div className="mtx-search" style={{ position: 'relative' }}>
        <Ic name="search" size={15} />
        <input
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder={`Search ${label.toLowerCase()}…`}
        />
        <span className="mtx-kbd">⌘K</span>
        {searchResults.length > 0 && (
          <div className="mtx-searchpanel">
            {searchResults.map((result) => (
              <button
                key={result.id}
                type="button"
                className="mtx-searchitem"
                onClick={() => activateSearchResult(result)}
              >
                {result.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mtx-topbarright">
        <div className="mtx-pill"><span className="mtx-pulsedot" /><span className="mono">{latency}ms</span></div>
        <div className="mtx-liveclock">
          <span className="mono mtx-clocktime">{now.toISOString().substr(11, 8)}</span>
          <span className="mtx-clockdate">UTC · {now.toISOString().substr(0, 10)}</span>
        </div>

        <div className="mtx-notifwrap" ref={notifRef}>
          <button className="mtx-iconbtn" aria-label="Notifications" onClick={() => setNotifOpen((o) => !o)}>
            <Ic name="bell" size={16} />
            {unread > 0 && <span className="mtx-notifcount">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="mtx-notifpanel">
              <div className="mtx-notifhead">
                <span>Notifications</span>
                {unread > 0 && <button className="mtx-notifmarkall" onClick={() => setNotifs((n) => n.map((x) => ({ ...x, read: true })))}>Mark all read</button>}
              </div>
              <div className="mtx-notiflist">
                {notifs.length === 0 && <div className="mtx-notifempty">You're all caught up.</div>}
                {notifs.map((n) => {
                  const k = KIND_STYLE[n.kind] || KIND_STYLE.signal;
                  return (
                    <div key={n.id} className={`mtx-notifitem ${n.read ? "read" : ""}`} onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>
                      <div className="mtx-feedic" style={{ background: k.bg, color: k.fg, width: 26, height: 26 }}><Ic name={k.icon} size={12} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="mtx-feedtitle"><span>{n.title}</span><span className="mtx-feedtime mono">{n.time}</span></div>
                        <div className="mtx-feedbody">{n.body}</div>
                      </div>
                      {!n.read && <span className="mtx-notifdot" />}
                    </div>
                  );
                })}
              </div>
              {notifs.length > 0 && (
                <button className="mtx-notifclearall" onClick={() => { setNotifs([]); toast("Notifications cleared."); }}>Clear all</button>
              )}
            </div>
          )}
        </div>

        <button className="mtx-iconbtn" aria-label="Toggle theme" onClick={onToggleTheme}>
          <Ic name={theme === "dark" ? "sun" : "moon"} size={16} />
        </button>
        <div className="mtx-userchip">
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 11.5 }}>RB</div>
          <div><div className="mtx-username">Randula Berugoda</div><div className="mtx-usermail">randulaxp@gmail.com</div></div>
        </div>
      </div>
    </header>
  );
}

/* ================================================================
   Root component
   ================================================================ */

export function Dashboard() {
  const [section, setSection] = useState<SectionId>("command");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const { toasts, push } = useToasts();

  const navigate = (s: SectionId) => { setSection(s); setMobileOpen(false); };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [section]);
  const ctxValue = useMemo(() => ({ navigate, toast: push, theme }), [theme]);

  const sectionMap: Record<SectionId, React.ReactNode> = {
    command: <CommandCenter />,
    metrics: <MetricsExplorer />,
    anomaly: <AnomalyDetection />,
    predictive: <PredictiveInsights />,
    rootcause: <RootCauseEngine />,
    infra: <Infrastructure />,
    incidents: <Incidents />,
    integrations: <Integrations />,
    reports: <Reports />,
    api: <DeveloperAPI />,
    account: <AccountSettings />,
  };

  return (
    <AppCtx.Provider value={ctxValue}>
      <div className="mtx-app" data-theme={theme}>
        <style>{CSS}</style>
        <Sidebar active={section} onNavigate={navigate} open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="mtx-main">
          <Topbar onBurger={() => setMobileOpen(true)} section={section} theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
          <main className="mtx-content">
            {sectionMap[section]}
            <div className="mtx-footernote">
              <span>Metrixova Command Center · v2.4.0 · Region: ap-south-1</span>
              <span><a href="#" onClick={(e) => { e.preventDefault(); navigate("api"); }}>Developer API</a> · <a href="#" onClick={(e) => { e.preventDefault(); push("Docs coming soon."); }}>Docs (coming soon)</a> · <a href="#" onClick={(e) => { e.preventDefault(); push("All systems operational."); }}>Status page</a></span>
            </div>
          </main>
        </div>
        <ToastStack toasts={toasts} />
      </div>
    </AppCtx.Provider>
  );
}

export default Dashboard;

/* ================================================================
   Styles: red brand theme. Change tokens to re-skin.
   ================================================================ */

const CSS = `
:root{
  --bg:#0a0708; --bg-1:#0d0a0b; --surface:#120d0e; --surface-2:#170f10; --surface-hover:#1c1213;
  --border:#2a1618; --border-soft:#1e1112;
  --text:#f3e9e9; --text-dim:#a68d8e; --text-faint:#6e5657;

  --brand:#bb181b; --brand-dim:#bb181b22; --brand-glow:#bb181b55;
  --predict:#8b7cff; --predict-dim:#8b7cff22;
  --warn:#f5a623; --warn-dim:#f5a62322;
  --crit:#ff3b3f; --crit-dim:#ff3b3f22;
  --good:#3ddc97; --good-dim:#3ddc9722;

  --radius:14px; --sidebar-w:250px;
  --font-display:'Space Grotesk',sans-serif; --font-body:'Inter',sans-serif; --font-mono:'JetBrains Mono',monospace;
}
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

.mtx-app,.mtx-app *{box-sizing:border-box;}
.mtx-app{
  font-family:var(--font-body); color:var(--text); min-height:100vh; -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(ellipse 1200px 600px at 15% -10%, #1a0d0e 0%, transparent 60%),
    radial-gradient(ellipse 900px 500px at 100% 0%, #150a12 0%, transparent 55%),
    var(--bg);
  display:flex;
}
.mtx-app a{color:inherit;text-decoration:none;cursor:pointer;}
.mtx-app button{font-family:inherit;cursor:pointer;}
.mono{font-family:var(--font-mono);}

/* sidebar */
.mtx-sidebar{ width:var(--sidebar-w); flex-shrink:0; background:var(--bg-1); border-right:1px solid var(--border-soft); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; z-index:60; transition:transform .25s ease; }
.mtx-brand{ display:flex; align-items:center; gap:10px; padding:18px 16px 14px; }
.mtx-brandmark{ width:100%; max-width:150px; padding: 10px; border-radius:12px; flex-shrink:0; background:linear-gradient(140deg,var(--brand),#6e0d0f); display:grid; place-items:center; color:#fff; box-shadow:0 0 22px var(--brand-glow); }
.mtx-brandlogo{ width:100%; max-width:130px; height:auto; object-fit:contain; display:block; }
.mtx-brandname{ font-family:var(--font-display); font-weight:700; font-size:17px; }
.mtx-brandsub{ font-size:10.5px; color:var(--text-faint); text-transform:uppercase; letter-spacing:1.2px; margin-top:1px; }
.mtx-navscroll{ flex:1; overflow-y:auto; padding:6px 12px 12px; }
.mtx-navgroup{ margin-top:18px; }
.mtx-navgroup:first-child{ margin-top:4px; }
.mtx-navlabel{ font-size:10.5px; font-weight:600; color:var(--text-faint); text-transform:uppercase; letter-spacing:1.4px; padding:0 10px 8px; }
.mtx-navitem{ display:flex; align-items:center; gap:11px; padding:9px 10px; border-radius:9px; font-size:13.5px; font-weight:500; color:var(--text-dim); position:relative; transition:background .15s,color .15s; }
.mtx-navitem:hover{ background:var(--surface-hover); color:var(--text); }
.mtx-navitem.active{ background:linear-gradient(90deg, var(--brand-dim), transparent); color:var(--text); }
.mtx-navitem.active::before{ content:''; position:absolute; left:-12px; top:8px; bottom:8px; width:3px; background:var(--brand); border-radius:3px; }
.mtx-badge{ margin-left:auto; font-size:10px; font-weight:600; background:var(--predict-dim); color:var(--predict); padding:1px 7px; border-radius:20px; }
.mtx-livedot{ margin-left:auto; width:6px; height:6px; border-radius:50%; background:var(--good); box-shadow:0 0 8px var(--good); }
.mtx-sidebarfoot{ border-top:1px solid var(--border-soft); padding:14px 16px; display:flex; align-items:center; gap:10px; }
.avatar{ width:34px; height:34px; border-radius:50%; flex-shrink:0; background:linear-gradient(140deg,var(--brand),#6e0d0f); display:grid; place-items:center; font-family:var(--font-display); font-weight:700; font-size:13px; color:#fff; }
.mtx-footname{ font-size:13px; font-weight:600; }
.mtx-footrole{ font-size:11px; color:var(--text-faint); }
.mtx-overlay{ display:none; position:fixed; inset:0; background:#000a; z-index:55; }

/* topbar */
.mtx-main{ flex:1; min-width:0; display:flex; flex-direction:column; }
.mtx-topbar{ position:sticky; top:0; z-index:50; display:flex; align-items:center; gap:14px; padding:14px 28px; background:rgba(10,7,8,.82); backdrop-filter:blur(14px); border-bottom:1px solid var(--border-soft); }
.mtx-burger{ display:none; background:none; border:none; color:var(--text-dim); padding:6px; }
.mtx-search{ flex:1; max-width:420px; display:flex; align-items:center; gap:9px; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:9px 12px; color:var(--text-faint); }
.mtx-search input{ background:none; border:none; outline:none; color:var(--text); font-size:13px; width:100%; font-family:inherit; }
.mtx-search input::placeholder{ color:var(--text-faint); }
.mtx-searchpanel{ position:absolute; top:calc(100% + 8px); left:0; right:0; z-index:90; background:var(--surface); border:1px solid var(--border); border-radius:12px; box-shadow:0 20px 50px #000a; overflow:hidden; }
.mtx-searchitem{ width:100%; text-align:left; padding:10px 14px; font-size:13px; color:var(--text); background:transparent; border:none; cursor:pointer; transition:background .15s; }
.mtx-searchitem:hover{ background:var(--surface-hover); }
.mtx-kbd{ font-family:var(--font-mono); font-size:10.5px; color:var(--text-faint); background:var(--surface-2); border:1px solid var(--border); padding:2px 6px; border-radius:5px; }
.mtx-topbarright{ margin-left:auto; display:flex; align-items:center; gap:18px; }
.mtx-liveclock{ display:flex; flex-direction:column; align-items:flex-end; line-height:1.25; }
.mtx-clocktime{ font-size:12.5px; color:var(--text); }
.mtx-clockdate{ font-size:10.5px; color:var(--text-faint); }
.mtx-pill{ display:flex; align-items:center; gap:6px; font-size:11.5px; color:var(--text-dim); background:var(--surface); border:1px solid var(--border); padding:6px 11px; border-radius:20px; }
.mtx-pulsedot{ width:7px; height:7px; border-radius:50%; background:var(--good); position:relative; flex-shrink:0; }
.mtx-pulsedot::after{ content:''; position:absolute; inset:-4px; border-radius:50%; border:1px solid var(--good); animation:mtxPulse 2s ease-out infinite; }
@keyframes mtxPulse{ 0%{ transform:scale(.6); opacity:.9; } 100%{ transform:scale(1.9); opacity:0; } }
.mtx-iconbtn{ position:relative; width:36px; height:36px; border-radius:10px; display:grid; place-items:center; background:var(--surface); border:1px solid var(--border); color:var(--text-dim); }
.mtx-iconbtn:hover{ background:var(--surface-hover); color:var(--text); }
.mtx-notifcount{ position:absolute; top:-5px; right:-5px; background:var(--crit); color:#fff; font-size:9.5px; font-weight:700; border-radius:20px; padding:1px 5px; border:2px solid var(--bg-1); }
.mtx-userchip{ display:flex; align-items:center; gap:10px; padding-left:16px; border-left:1px solid var(--border-soft); }
.mtx-username{ font-size:12.5px; font-weight:600; }
.mtx-usermail{ font-size:10.5px; color:var(--text-faint); }

/* content */
.mtx-content{ padding:26px 28px 60px; max-width:1600px; width:100%; margin:0 auto; }
.mtx-pagehead{ display:flex; align-items:flex-end; justify-content:space-between; gap:20px; flex-wrap:wrap; margin-bottom:22px; }
.mtx-eyebrow{ display:flex; align-items:center; gap:8px; font-size:11.5px; font-weight:600; color:var(--brand); text-transform:uppercase; letter-spacing:1.4px; margin-bottom:8px; }
.mtx-dot{ width:5px; height:5px; border-radius:50%; background:var(--brand); }
.mtx-title{ font-family:var(--font-display); font-size:28px; font-weight:700; letter-spacing:-.3px; }
.mtx-sub{ color:var(--text-dim); font-size:13.5px; margin-top:6px; max-width:540px; }
.mtx-actions{ display:flex; gap:10px; }
.mtx-btn{ display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:600; padding:10px 16px; border-radius:10px; border:1px solid var(--border); background:var(--surface); color:var(--text); transition:background .15s; white-space:nowrap; }
.mtx-btn:hover{ background:var(--surface-hover); }
.mtx-btnsm{ padding:7px 12px; font-size:12px; }
.mtx-btnprimary{ background:linear-gradient(135deg,var(--brand),#8f1214); border-color:transparent; color:#fff; }
.mtx-btnprimary:hover{ filter:brightness(1.12); }

.mtx-kpigrid{ display:grid; grid-template-columns:repeat(6,1fr); gap:14px; margin-bottom:22px; }
.mtx-card{ background:var(--surface); border:1px solid var(--border-soft); border-radius:var(--radius); }
.mtx-kpi{ padding:17px 18px; transition:border-color .2s,transform .2s; }
.mtx-kpi:hover{ border-color:var(--border); transform:translateY(-2px); }
.mtx-kpitop{ display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
.mtx-kpiicon{ width:30px; height:30px; border-radius:8px; display:grid; place-items:center; }
.mtx-kpilabel{ font-size:11px; color:var(--text-faint); font-weight:500; }
.mtx-kpival{ font-size:23px; font-weight:600; letter-spacing:-.5px; margin-bottom:8px; }
.mtx-delta{ display:inline-flex; align-items:center; gap:4px; font-size:11px; font-weight:600; padding:2px 7px; border-radius:20px; }
.mtx-up{ color:var(--good); background:var(--good-dim); }
.mtx-down{ color:var(--crit); background:var(--crit-dim); }
.mtx-flat{ color:var(--warn); background:var(--warn-dim); }

.mtx-gridmain{ display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-bottom:16px; align-items:start; }
.mtx-gridbottom{ display:grid; grid-template-columns:1.15fr 1fr; gap:16px; }
.mtx-pad{ padding:20px 22px; }
.mtx-cardhead{ display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:16px; }
.mtx-cardtitle{ font-family:var(--font-display); font-size:15.5px; font-weight:600; }
.mtx-carddesc{ font-size:12px; color:var(--text-faint); margin-top:3px; }
.mtx-tabset{ display:flex; gap:4px; background:var(--surface-2); border:1px solid var(--border); border-radius:9px; padding:3px; }
.mtx-tab{ font-size:11.5px; font-weight:600; color:var(--text-faint); padding:6px 12px; border-radius:7px; }
.mtx-tab.active{ background:var(--brand-dim); color:var(--brand); }
.mtx-legend{ display:flex; gap:16px; margin-top:12px; flex-wrap:wrap; }
.mtx-legenditem{ display:flex; align-items:center; gap:7px; font-size:11.5px; color:var(--text-dim); }
.mtx-swatch{ width:14px; height:3px; border-radius:2px; display:inline-block; }
.mtx-swatch.dashed{ background:repeating-linear-gradient(90deg,var(--predict) 0 4px,transparent 4px 7px); }

.mtx-feed{ display:flex; flex-direction:column; gap:2px; max-height:404px; overflow-y:auto; padding-right:4px; }
.mtx-feeditem{ display:flex; gap:11px; padding:12px 4px; border-bottom:1px solid var(--border-soft); }
.mtx-feeditem:last-child{ border-bottom:none; }
.mtx-feedic{ width:28px; height:28px; border-radius:8px; flex-shrink:0; display:grid; place-items:center; margin-top:1px; }
.mtx-feedtitle{ font-size:12.5px; font-weight:600; display:flex; justify-content:space-between; gap:8px; }
.mtx-feedtime{ font-size:10px; color:var(--text-faint); font-weight:500; flex-shrink:0; }
.mtx-feedbody{ font-size:12px; color:var(--text-dim); margin-top:3px; line-height:1.5; }

.mtx-pipeline{ display:flex; align-items:center; gap:0; overflow-x:auto; padding:10px 2px 4px; }
.mtx-pipestep{ display:flex; flex-direction:column; align-items:center; gap:8px; min-width:98px; flex-shrink:0; }
.mtx-pipeic{ width:44px; height:44px; border-radius:12px; display:grid; place-items:center; background:var(--surface-2); border:1px solid var(--border); color:var(--brand); }
.mtx-pipelabel{ font-size:11px; text-align:center; color:var(--text-dim); font-weight:500; line-height:1.3; }
.mtx-pipeconnector{ flex:1; height:2px; min-width:20px; background:linear-gradient(90deg,var(--border),var(--brand-dim),var(--border)); position:relative; top:-22px; }
.mtx-nvidia{ display:inline-flex; align-items:center; gap:6px; margin-top:14px; font-size:10.5px; color:var(--good); background:var(--good-dim); border:1px solid #3ddc9733; padding:5px 11px; border-radius:20px; font-weight:600; letter-spacing:.3px; }

.mtx-gaugegrid{ display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.mtx-gauge{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:8px 0; }
.mtx-gaugeval{ font-family:var(--font-mono); font-size:15px; font-weight:600; margin-top:-52px; }
.mtx-gaugelabel{ font-size:11px; color:var(--text-faint); text-align:center; }

.mtx-tablewrap{ overflow-x:auto; margin:0 -22px; padding:0 22px; }
.mtx-table{ width:100%; border-collapse:collapse; font-size:12.5px; min-width:640px; }
.mtx-table th{ text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:.8px; color:var(--text-faint); font-weight:600; padding:0 12px 10px; }
.mtx-table td{ padding:12px 12px; border-top:1px solid var(--border-soft); vertical-align:middle; }
.mtx-row:hover td{ background:var(--surface-hover); }
.mtx-svcname{ font-weight:600; font-size:13px; }
.mtx-svcsub{ font-size:11px; color:var(--text-faint); }
.mtx-status{ display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; padding:4px 10px; border-radius:20px; }
.mtx-sdot{ width:6px; height:6px; border-radius:50%; }
.mtx-status.mtx-healthy{ background:var(--good-dim); color:var(--good); }
.mtx-status.mtx-healthy .mtx-sdot{ background:var(--good); }
.mtx-status.mtx-watch{ background:var(--warn-dim); color:var(--warn); }
.mtx-status.mtx-watch .mtx-sdot{ background:var(--warn); }
.mtx-status.mtx-critical{ background:var(--crit-dim); color:var(--crit); }
.mtx-status.mtx-critical .mtx-sdot{ background:var(--crit); }
.mtx-spark{ width:100px; height:28px; }
.mtx-scorebar{ width:70px; height:5px; border-radius:5px; background:var(--surface-2); overflow:hidden; }
.mtx-scorebar>div{ height:100%; border-radius:5px; }

.mtx-heatdaylabels{ display:flex; gap:4px; margin-bottom:6px; margin-left:26px; }
.mtx-heatdaylabels span{ width:15px; font-size:9.5px; color:var(--text-faint); text-align:center; }
.mtx-heatrowwrap{ display:flex; gap:6px; overflow-x:auto; }
.mtx-heathours{ display:flex; flex-direction:column; gap:4px; width:20px; }
.mtx-heathours span{ height:15px; font-size:9px; color:var(--text-faint); line-height:15px; }
.mtx-heatmap{ display:flex; gap:4px; }
.mtx-heatcol{ display:flex; flex-direction:column; gap:4px; }
.mtx-heatcell{ width:15px; height:15px; border-radius:4px; }

.mtx-incident{ display:flex; gap:12px; padding:13px 0; border-bottom:1px solid var(--border-soft); }
.mtx-incident:last-child{ border-bottom:none; }
.mtx-incsev{ width:4px; border-radius:4px; flex-shrink:0; }
.mtx-inctitle{ font-size:13px; font-weight:600; display:flex; justify-content:space-between; gap:10px; }
.mtx-incmeta{ font-size:11px; color:var(--text-faint); margin-top:4px; display:flex; gap:10px; flex-wrap:wrap; }
.mtx-inctag{ font-size:10px; font-weight:600; padding:2px 8px; border-radius:20px; }

.mtx-filterbar{ display:flex; gap:10px; flex-wrap:wrap; }
.mtx-select{ background:var(--surface-2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:9px 12px; font-size:12.5px; font-family:inherit; outline:none; }
.mtx-listrows{ display:flex; flex-direction:column; }
.mtx-listrow{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; border-top:1px solid var(--border-soft); font-size:12.5px; }
.mtx-listrows .mtx-listrow:first-child{ border-top:none; }
.mtx-sliderrow{ display:flex; align-items:center; gap:14px; }
.mtx-slider{ flex:1; accent-color:var(--brand); }
.mtx-sliderval{ font-size:13px; width:44px; text-align:right; }

.mtx-intgrid{ display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.mtx-intcard{ display:flex; align-items:center; gap:12px; }
.mtx-inticon{ width:38px; height:38px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); color:var(--brand); display:grid; place-items:center; flex-shrink:0; }

.mtx-code{ background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:16px 18px; font-size:12px; overflow-x:auto; color:var(--text-dim); line-height:1.6; }

.mtx-formrow{ display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.mtx-label{ display:block; font-size:11.5px; font-weight:600; color:var(--text-faint); margin:14px 0 6px; text-transform:uppercase; letter-spacing:.6px; }
.mtx-label:first-of-type{ margin-top:0; }
.mtx-input{ width:100%; background:var(--surface-2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:10px 13px; font-size:13px; font-family:inherit; outline:none; transition:border-color .15s; }
.mtx-input:focus{ border-color:var(--brand); }
.mtx-input:disabled{ color:var(--text-faint); cursor:not-allowed; }
.mtx-formfoot{ display:flex; align-items:center; justify-content:flex-end; gap:14px; margin-top:18px; }
.mtx-msg{ font-size:12px; font-weight:600; }
.mtx-msgsuccess{ color:var(--good); }
.mtx-msgerror{ color:var(--crit); }

.mtx-toggle{ width:42px; height:24px; border-radius:20px; background:var(--surface-2); border:1px solid var(--border); position:relative; padding:0; transition:background .15s; flex-shrink:0; }
.mtx-toggle.on{ background:var(--brand); border-color:var(--brand); }
.mtx-toggle-knob{ position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform .15s; }
.mtx-toggle.on .mtx-toggle-knob{ transform:translateX(18px); }

.mtx-footernote{ margin-top:30px; padding-top:20px; border-top:1px solid var(--border-soft); display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; font-size:11.5px; color:var(--text-faint); }
.mtx-footernote a:hover{ color:var(--brand); }

@media (max-width:1180px){
  .mtx-kpigrid{ grid-template-columns:repeat(3,1fr); }
  .mtx-gridmain{ grid-template-columns:1fr; }
  .mtx-gridbottom{ grid-template-columns:1fr; }
  .mtx-intgrid{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width:860px){
  .mtx-sidebar{ position:fixed; left:0; top:0; transform:translateX(-100%); box-shadow:0 0 40px #000c; }
  .mtx-sidebar.open{ transform:translateX(0); }
  .mtx-overlay.show{ display:block; }
  .mtx-burger{ display:grid; place-items:center; }
  .mtx-search{ display:none; }
  .mtx-searchpanel{ display:none; }
  .mtx-kbd{ display:none; }
  .mtx-content{ padding:20px 16px 50px; }
  .mtx-topbar{ padding:12px 16px; }
  .mtx-userchip .mtx-username,.mtx-userchip .mtx-usermail{ display:none; }
  .mtx-liveclock{ display:none; }
}
@media (max-width:640px){
  .mtx-kpigrid{ grid-template-columns:repeat(2,1fr); }
  .mtx-title{ font-size:23px; }
  .mtx-actions{ width:100%; }
  .mtx-actions .mtx-btn{ flex:1; justify-content:center; }
  .mtx-intgrid{ grid-template-columns:1fr; }
}
@media (max-width:420px){
  .mtx-kpigrid{ grid-template-columns:1fr 1fr; }
  .mtx-pad{ padding:16px; }
}
/* light theme override */
.mtx-app[data-theme="light"]{
  --bg:#faf5f4; --bg-1:#ffffff; --surface:#ffffff; --surface-2:#f5eeed; --surface-hover:#f0e6e4;
  --border:#e7d7d5; --border-soft:#eee0de;
  --text:#221415; --text-dim:#6b5251; --text-faint:#a08683;
  --good-dim:#3ddc9720; --warn-dim:#f5a62320; --crit-dim:#ff3b3f18; --predict-dim:#8b7cff18; --brand-dim:#bb181b14;
}
.mtx-app[data-theme="light"]{
  background:
    radial-gradient(ellipse 1200px 600px at 15% -10%, #fbe8e6 0%, transparent 60%),
    radial-gradient(ellipse 900px 500px at 100% 0%, #f3e9fb 0%, transparent 55%),
    var(--bg);
}
.mtx-app[data-theme="light"] .mtx-topbar{ background:rgba(250,245,244,.82); }
.mtx-app[data-theme="light"] .avatar{ color:#fff; }

/* notifications dropdown */
.mtx-notifwrap{ position:relative; }
.mtx-notifpanel{
  position:absolute; top:calc(100% + 10px); right:0; width:340px; max-width:88vw;
  background:var(--surface); border:1px solid var(--border); border-radius:14px;
  box-shadow:0 20px 50px #000a; z-index:80; overflow:hidden;
}
.mtx-notifhead{ display:flex; align-items:center; justify-content:space-between; padding:13px 16px; border-bottom:1px solid var(--border-soft); font-size:13px; font-weight:600; }
.mtx-notifmarkall{ background:none; border:none; color:var(--brand); font-size:11.5px; font-weight:600; }
.mtx-notiflist{ max-height:320px; overflow-y:auto; }
.mtx-notifitem{ display:flex; gap:10px; padding:12px 16px; border-bottom:1px solid var(--border-soft); cursor:pointer; position:relative; transition:background .15s; }
.mtx-notifitem:hover{ background:var(--surface-hover); }
.mtx-notifitem:last-child{ border-bottom:none; }
.mtx-notifitem.read{ opacity:.55; }
.mtx-notifdot{ position:absolute; top:14px; right:14px; width:7px; height:7px; border-radius:50%; background:var(--brand); }
.mtx-notifempty{ padding:24px 16px; text-align:center; font-size:12.5px; color:var(--text-faint); }
.mtx-notifclearall{ width:100%; padding:11px; background:none; border:none; border-top:1px solid var(--border-soft); font-size:12px; font-weight:600; color:var(--text-dim); }
.mtx-notifclearall:hover{ background:var(--surface-hover); color:var(--text); }

/* toasts */
.mtx-toaststack{ position:fixed; bottom:20px; right:20px; display:flex; flex-direction:column; gap:8px; z-index:100; }
.mtx-toast{
  display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border);
  color:var(--text); font-size:12.5px; font-weight:500; padding:11px 16px; border-radius:10px;
  box-shadow:0 10px 30px #0008; animation:mtxToastIn .2s ease;
}
.mtx-toast svg{ color:var(--good); flex-shrink:0; }
@keyframes mtxToastIn{ from{ transform:translateY(8px); opacity:0; } to{ transform:translateY(0); opacity:1; } }

@media (max-width:640px){ .mtx-notifpanel{ position:fixed; top:64px; right:10px; left:10px; width:auto; } }

@media (prefers-reduced-motion: reduce){ .mtx-app *{ animation:none!important; transition:none!important; } }
`;