import { useState } from "react";

// ─── Design System — Faux Glass (works without backdrop-filter) ─────
const C = {
  bg: "#f0eef5",
  // Glass cards: translucent white with purple tint baked in
  glass: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(245,243,252,0.82) 100%)",
  glassGlow: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(237,233,254,0.85) 100%)",
  glassSolid: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,246,254,0.92) 100%)",
  // Borders
  border: "rgba(255,255,255,0.7)",
  borderOuter: "rgba(0,0,0,0.06)",
  borderGlow: "rgba(139,92,246,0.25)",
  borderSubtle: "rgba(0,0,0,0.04)",
  // Accent
  accent: "#7c3aed",
  accentLight: "#a78bfa",
  accentMuted: "rgba(139,92,246,0.08)",
  // Semantic
  green: "#059669",
  greenBg: "rgba(5,150,105,0.06)",
  greenBorder: "rgba(5,150,105,0.15)",
  warning: "#92400e",
  warningBg: "rgba(146,64,14,0.05)",
  warningBorder: "rgba(146,64,14,0.1)",
  red: "#dc2626",
  redBg: "rgba(220,38,38,0.05)",
  // Text
  text: "#1a1a2e",
  textMuted: "#52525b",
  textDim: "#a1a1aa",
  white: "#ffffff",
};

const FONT = {
  display: "'Playfair Display', Georgia, serif",
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  body: "'DM Sans', -apple-system, sans-serif",
};

// Glass card style — fakes the look with gradient + double border + inset glow
const glassStyle = (extra = {}) => ({
  background: C.glass,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  boxShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(0,0,0,0.03) inset, 0 4px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)`,
  ...extra,
});

const glassGlowStyle = (extra = {}) => ({
  background: C.glassGlow,
  border: `1px solid ${C.borderGlow}`,
  borderRadius: 14,
  boxShadow: `0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 20px rgba(139,92,246,0.08), 0 1px 3px rgba(0,0,0,0.03)`,
  ...extra,
});

const TABS = [
  { id: "roi", label: "PROSPECT ROI", icon: "📊" },
  { id: "landscape", label: "POSITIONING & MOATS", icon: "🏰" },
  { id: "plan", label: "MY FIRST 30 DAYS", icon: "🚀" },
];

const fmt = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

// ─── Shared ─────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, glow = false }) {
  return <div style={{ ...(glow ? glassGlowStyle() : glassStyle()), padding: "20px 22px", ...style }}>{children}</div>;
}

function Slider({ value, onChange, min, max, step }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: "relative", padding: "6px 0" }}>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 4, borderRadius: 2, outline: "none", WebkitAppearance: "none", cursor: "pointer",
          background: `linear-gradient(to right, ${C.accent} 0%, ${C.accent} ${pct}%, rgba(0,0,0,0.08) ${pct}%, rgba(0,0,0,0.08) 100%)`,
        }} />
      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${C.white};border:2.5px solid ${C.accent};box-shadow:0 1px 6px rgba(124,58,237,0.25);cursor:pointer; }
        input[type=range]::-moz-range-thumb { width:18px;height:18px;border-radius:50%;background:${C.white};border:2.5px solid ${C.accent};box-shadow:0 1px 6px rgba(124,58,237,0.25);cursor:pointer; }
      `}</style>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2.5, color: C.textDim, fontFamily: FONT.mono, fontWeight: 500, marginBottom: 14 }}>{children}</div>;
}

function Chevron({ open }) {
  return <span style={{ fontSize: 11, color: C.textDim, transition: "transform 0.25s ease", transform: open ? "rotate(180deg)" : "rotate(0)", display: "inline-block" }}>▾</span>;
}

// ─── ROI Tab ────────────────────────────────────────────────────────
function ROITab() {
  const [portfolio, setPortfolio] = useState(150000);
  const [callsPerLoan, setCallsPerLoan] = useState(2.5);
  const [costPerCall, setCostPerCall] = useState(12);
  const [delinquencyRate, setDelinquencyRate] = useState(4);

  const totalCalls = portfolio * callsPerLoan;
  const currentCost = totalCalls * costPerCall;
  const kastleCost = totalCalls * costPerCall * 0.30;
  const savings = currentCost - kastleCost;
  const delinquentLoans = portfolio * (delinquencyRate / 100);
  const collectionCalls = delinquentLoans * 8;
  const collectionSavings = collectionCalls * costPerCall * 0.70;
  const totalSavings = savings + collectionSavings;

  const inputs = [
    { label: "Portfolio size (loans)", value: portfolio, set: setPortfolio, min: 10000, max: 2000000, step: 10000, format: (v) => v.toLocaleString() },
    { label: "Servicing calls / loan / year", value: callsPerLoan, set: setCallsPerLoan, min: 0.5, max: 6, step: 0.5, format: (v) => v.toFixed(1) },
    { label: "Current cost per call", value: costPerCall, set: setCostPerCall, min: 4, max: 25, step: 1, format: (v) => `$${v}` },
    { label: "Delinquency rate", value: delinquencyRate, set: setDelinquencyRate, min: 1, max: 12, step: 0.5, format: (v) => `${v}%` },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 6px 0" }}>
        What could Kastle save a lender?
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 22px 0", lineHeight: 1.55, fontFamily: FONT.body }}>
        Adjust inputs to model a prospect's contact center economics. Based on MBA 2024 servicing cost data and Kastle's published 70% cost-reduction claim.
      </p>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: C.warningBg, borderRadius: 10, border: `1px solid ${C.warningBorder}`, marginBottom: 22 }}>
        <span style={{ fontSize: 13, marginTop: 1 }}>⚠️</span>
        <span style={{ fontSize: 12.5, color: C.warning, lineHeight: 1.55, fontFamily: FONT.body }}>
          These numbers are illustrative estimates built from MBA industry benchmarks and Kastle's published metrics. You'll know your actual numbers better — this is a thinking tool, not a forecast.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 26 }}>
        {inputs.map((inp) => (
          <div key={inp.label} style={{ ...glassStyle(), padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, color: C.textMuted, fontFamily: FONT.body, fontWeight: 500 }}>{inp.label}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.accent, fontFamily: FONT.mono }}>{inp.format(inp.value)}</span>
            </div>
            <Slider value={inp.value} onChange={inp.set} min={inp.min} max={inp.max} step={inp.step} />
          </div>
        ))}
      </div>

      <GlassCard glow>
        <SectionLabel>Estimated Annual Impact</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Current spend", value: fmt(currentCost), color: C.text },
            { label: "With Kastle", value: fmt(kastleCost), color: C.accent },
            { label: "Total savings", value: fmt(totalSavings), color: C.green },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4, fontFamily: FONT.body }}>{m.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: m.color, fontFamily: FONT.display }}>{m.value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.body }}>Servicing: {fmt(savings)}</span>
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.body }}>Collections: {fmt(collectionSavings)}</span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(savings / totalSavings) * 100}%`, background: C.accent, borderRadius: "3px 0 0 3px" }} />
            <div style={{ width: `${(collectionSavings / totalSavings) * 100}%`, background: C.accentLight, borderRadius: "0 3px 3px 0" }} />
          </div>
        </div>
      </GlassCard>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 14 }}>
        {[
          { label: "Calls automated / year", value: (totalCalls + collectionCalls).toLocaleString() },
          { label: "Handle time saved", value: "~40% per call" },
          { label: "Est. payback period", value: totalSavings > 200000 ? "<30 days" : "<60 days" },
        ].map((s) => (
          <div key={s.label} style={{ ...glassStyle(), padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.text, fontFamily: FONT.mono }}>{s.value}</div>
            <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 4, fontFamily: FONT.body }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Landscape Tab ──────────────────────────────────────────────────
function LandscapeTab() {
  const [activeSection, setActiveSection] = useState("funnel");
  const [expandedStage, setExpandedStage] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);

  const sections = [
    { id: "funnel", label: "BUYER JOURNEY" },
    { id: "position", label: "POSITIONING" },
    { id: "moats", label: "DEFENSIBILITY" },
  ];

  const funnelStages = [
    { stage: "Awareness", question: "When does a lender start thinking about AI voice?", width: "100%",
      kastle: "LendingTree Innovation Challenge winner. a16z fintech newsletter. Digital Mortgage 2024. National Mortgage News. YC brand.",
      alternatives: [{ name: "Marr Labs", note: "Visible in origination, not servicing" }, { name: "Insellerate", note: "Known as CRM — AI is an add-on discovery" }, { name: "Dialpad / Observe.AI", note: "Generic contact center world, not mortgage" }, { name: "Legacy IVR / BPO", note: "Not searched for, but deeply embedded" }],
      insight: "When a servicing VP searches 'AI voice agent mortgage collections,' Kastle shows up. Competitors are either known for origination or generic contact centers." },
    { stage: "Consideration", question: "What alternatives does Kastle compete against?", width: "82%",
      kastle: "Purpose-built for mortgage servicing. Compliance engine covers FDCPA, TILA, TCPA, UDAAP, RESPA. SOC 2 Type II certified.",
      alternatives: [{ name: "Marr Labs", note: "Origination-focused, weaker servicing story" }, { name: "Insellerate", note: "Broader CRM play, AI not the core product" }, { name: "Build in-house", note: "Expensive, slow, high compliance risk" }, { name: "Do nothing", note: "Status quo bias — 'our BPO works fine'" }],
      insight: "The comparison set is shaped by Kastle's vertical focus. 'Purpose-built for mortgage' puts the fight against BPOs and in-house teams (where Kastle wins easily) rather than against generic AI platforms (where differentiation is harder)." },
    { stage: "Conversion", question: "What tips the deal in Kastle's favor?", width: "60%",
      kastle: "70% lower cost per call. 40% lower handle time. 90%+ CSAT. FDIC-insured banks and IMBs as customers. 7-day go-live. No rip-and-replace.",
      alternatives: [{ name: "Marr Labs", note: "Per-minute overage adds uncertainty at scale" }, { name: "Insellerate", note: "Platform lock-in sell, weak for servicing-only" }, { name: "Build in-house", note: "7 days (Kastle) vs. 6-12 months" }],
      insight: "Enterprise buyers need proof, not promises. FDIC-insured bank logos + 7-day go-live directly attacks the two biggest objections: 'does this actually work?' and 'how long will implementation take?'" },
    { stage: "Retention", question: "How does a customer become locked in?", width: "45%",
      kastle: "Deep LMS/payment processor integration. Multi-agent expansion (servicing → collections → compliance → loss mitigation). 100% QA coverage. 3-year roadmap co-building.",
      alternatives: [{ name: "Any competitor", note: "Switching = re-integrate, re-train, re-certify compliance" }],
      insight: "Each additional agent type deepens integration and raises switching costs. Competitors become unwilling to poach — the ROI of winning an existing Kastle customer doesn't justify the effort." },
  ];

  const positioningAlts = [
    { name: "Marr Labs", comparedTo: "Kastle in origination, manual speed-to-lead", weakness: "Narrow focus on origination — less depth in servicing, collections, compliance workflows" },
    { name: "Insellerate", comparedTo: "Encompass, Velocify, other mortgage CRMs", weakness: "AI is an add-on, not the core product. Jack of all trades risk" },
    { name: "Dialpad / Observe.AI", comparedTo: "Five9, NICE, Genesys, other CCaaS", weakness: "Zero mortgage-specific compliance. Every deployment needs months of custom work" },
    { name: "Legacy IVR + BPO", comparedTo: "Nothing — this IS the status quo", weakness: "No AI comprehension, no scalability during spikes, rising labor costs" },
  ];

  const moats = [
    { power: "Counter-positioning", stage: "Early (now)", icon: "⚔️", mechanism: "unwilling",
      description: "Kastle's mortgage-native approach means generic platforms can't easily respond without cannibalizing their horizontal business.",
      detail: "Dialpad serves thousands of customers across dozens of industries. Rebuilding around FDCPA/TCPA compliance would alienate non-mortgage customers. They could — but the ROI is unattractive.",
      example: "Think Netflix vs. Blockbuster: Blockbuster was unwilling to cannibalize physical rentals to compete on streaming. Dialpad is unwilling to cannibalize breadth to compete on mortgage depth." },
    { power: "Cornered resource", stage: "Early (now)", icon: "🏰", mechanism: "unable",
      description: "Kastle's compliance training data and mortgage-specific conversation models are a proprietary resource competitors don't have.",
      detail: "Every call builds a richer dataset of mortgage servicing conversations and compliance edge cases. A new entrant would need millions of calls to build comparable training data.",
      example: "Kastle's compliance model improves with every call processed, and competitors can't replicate that institutional knowledge without the same lender partnerships." },
    { power: "Switching costs", stage: "Growth (building now)", icon: "🔒", mechanism: "unwilling",
      description: "Deep integration with LMS, payment processors, and contact center systems makes migration expensive and risky.",
      detail: "Switching means: re-integrating with LMS, re-training AI on SOPs, re-certifying compliance for every workflow, and risking audit gaps during transition.",
      example: "Salesforce's moat in enterprise CRM — poaching existing customers requires overcoming massive integration switching costs." },
    { power: "Economies of scale", stage: "Growth (future)", icon: "📈", mechanism: "unable",
      description: "As Kastle scales, per-customer cost of compliance infrastructure, model training, and integration maintenance drops.",
      detail: "Compliance rules are shared across customers. Each new lender benefits from improvements made for others. A smaller competitor absorbs the same fixed cost across fewer accounts.",
      example: "Like AWS — shared infrastructure cost makes per-unit costs nearly impossible for a new entrant to match." },
  ];

  const funnelColors = ["#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"];

  return (
    <div>
      <h2 style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 6px 0" }}>
        Competitive positioning & defensibility
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 22px 0", lineHeight: 1.55, fontFamily: FONT.body }}>
        How a mortgage lender evaluates alternatives — and why Kastle's positioning compounds into lasting advantage.
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 22, justifyContent: "center" }}>
        {sections.map((s) => (
          <button key={s.id} onClick={() => { setActiveSection(s.id); setExpandedStage(null); }} style={{
            padding: "9px 18px", fontSize: 10.5, fontFamily: FONT.mono, letterSpacing: 1.2, fontWeight: 600, cursor: "pointer", borderRadius: 8,
            border: activeSection === s.id ? `1px solid ${C.borderGlow}` : `1px solid ${C.borderOuter}`,
            background: activeSection === s.id ? C.glassGlow : C.white, color: activeSection === s.id ? C.accent : C.textDim,
            boxShadow: activeSection === s.id ? "0 2px 10px rgba(139,92,246,0.1)" : "0 1px 3px rgba(0,0,0,0.03)", transition: "all 0.2s ease",
          }}>{s.label}</button>
        ))}
      </div>

      {activeSection === "funnel" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          {funnelStages.map((f, i) => {
            const isOpen = expandedStage === f.stage;
            const clr = funnelColors[i];
            return (
              <div key={f.stage} style={{ width: "100%", cursor: "pointer" }} onClick={() => setExpandedStage(isOpen ? null : f.stage)}>
                <div style={{
                  width: f.width, margin: "0 auto", padding: "14px 18px",
                  background: isOpen ? C.accentMuted : `${clr}06`,
                  border: `1px solid ${isOpen ? C.borderGlow : `${clr}15`}`,
                  borderRadius: i === 0 ? "12px 12px 4px 4px" : i === 3 ? "4px 4px 12px 12px" : 4,
                  marginBottom: i < 3 ? 2 : 0, transition: "all 0.2s ease",
                  boxShadow: isOpen ? "0 2px 12px rgba(139,92,246,0.08)" : "none",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: clr, fontFamily: FONT.body }}>{f.stage}</span>
                      <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 10, fontFamily: FONT.body }}>{f.question}</span>
                    </div>
                    <Chevron open={isOpen} />
                  </div>
                </div>
                {isOpen && (
                  <div style={{ width: f.width, margin: "0 auto", ...glassStyle({ borderRadius: 10 }), padding: 18, marginBottom: 8, marginTop: 4 }}>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: FONT.body }}>Kastle</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.6, fontFamily: FONT.body, paddingLeft: 14 }}>{f.kastle}</div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.textDim, fontFamily: FONT.mono, marginBottom: 8 }}>Alternatives at this stage</div>
                      {f.alternatives.map((alt) => (
                        <div key={alt.name} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: `1px solid ${C.borderSubtle}`, fontSize: 12, fontFamily: FONT.body }}>
                          <span style={{ fontWeight: 600, color: C.text, minWidth: 105, flexShrink: 0 }}>{alt.name}</span>
                          <span style={{ color: C.textMuted, lineHeight: 1.5 }}>{alt.note}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "10px 12px", background: C.accentMuted, borderRadius: 8, fontSize: 12, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.body, borderLeft: `3px solid ${C.accent}` }}>
                      💡 {f.insight}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeSection === "position" && (
        <div>
          <GlassCard glow>
            <SectionLabel>How Kastle actually positions</SectionLabel>
            <div style={{ fontSize: 14.5, color: C.text, lineHeight: 1.65, fontFamily: FONT.body, marginBottom: 16 }}>
              Kastle leads with <span style={{ fontWeight: 600, color: C.accent }}>"purpose-built AI agents for mortgage lending and servicing"</span> — vertical-specific AI, not generic contact center tech. Compliance is a key differentiator within that frame: built-in regulatory coverage (FDCPA, TILA, TCPA, UDAAP, RESPA), automatic QA scoring, and SOC 2 Type II certification.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "14px 16px", background: C.accentMuted, borderRadius: 10, border: `1px solid ${C.borderGlow}` }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.accent, fontFamily: FONT.mono, fontWeight: 600, marginBottom: 6 }}>What this positioning does well</div>
                <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, fontFamily: FONT.body }}>"Purpose-built for mortgage" immediately separates Kastle from horizontal AI platforms (Dialpad, Observe.AI). Buyers compare against BPOs and in-house teams — where Kastle wins on cost, speed, and audit-readiness.</div>
              </div>
              <div style={{ padding: "14px 16px", background: "rgba(0,0,0,0.02)", borderRadius: 10, border: `1px solid ${C.borderOuter}` }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.textDim, fontFamily: FONT.mono, fontWeight: 600, marginBottom: 6 }}>Where it could get crowded</div>
                <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.55, fontFamily: FONT.body }}>As more AI voice startups enter mortgage, "purpose-built AI agent" becomes a shared claim. Kastle's compliance depth could become the sharpest wedge — the thing competitors can't credibly match.</div>
              </div>
            </div>
          </GlassCard>
          <GlassCard style={{ marginTop: 14 }}>
            <SectionLabel>Each player's comparison set</SectionLabel>
            <div style={{ display: "grid", gap: 8 }}>
              {positioningAlts.map((alt) => {
                const isSel = selectedComp === alt.name;
                return (
                  <div key={alt.name} onClick={() => setSelectedComp(isSel ? null : alt.name)} style={{
                    padding: "13px 16px", background: isSel ? C.accentMuted : C.white, borderRadius: 10,
                    border: `1px solid ${isSel ? C.borderGlow : C.borderOuter}`, cursor: "pointer", transition: "all 0.2s ease",
                    boxShadow: isSel ? "0 2px 10px rgba(139,92,246,0.08)" : "0 1px 2px rgba(0,0,0,0.03)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: FONT.body }}>{alt.name}</span>
                      <span style={{ fontSize: 10.5, color: C.textDim, fontFamily: FONT.body, fontStyle: "italic" }}>vs. {alt.comparedTo}</span>
                    </div>
                    {isSel && (
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.borderSubtle}`, fontSize: 12.5, color: C.warning, lineHeight: 1.5, fontFamily: FONT.body }}>
                        Vulnerability: {alt.weakness}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {activeSection === "moats" && (
        <div>
          <div style={{ padding: "12px 16px", background: C.accentMuted, borderRadius: 10, marginBottom: 18, fontSize: 12.5, color: C.accent, lineHeight: 1.55, fontFamily: FONT.body, border: `1px solid ${C.borderGlow}` }}>
            <span style={{ fontWeight: 600 }}>Key distinction:</span> Some moats make competitors <em>unwilling</em> to respond (they could, but the ROI is unattractive). Others make them <em>unable</em> (they can't, even if they wanted to). Kastle is building both.
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {moats.map((m) => {
              const isOpen = expandedStage === m.power;
              const isUnwilling = m.mechanism === "unwilling";
              return (
                <div key={m.power} onClick={() => setExpandedStage(isOpen ? null : m.power)} style={{
                  ...glassStyle(), padding: "16px 18px", cursor: "pointer", transition: "all 0.2s ease",
                  ...(isOpen ? { border: `1px solid ${C.borderGlow}`, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" } : {}),
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <div>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text, fontFamily: FONT.body }}>{m.power}</span>
                        <span style={{ fontSize: 10.5, color: C.textDim, marginLeft: 8, fontFamily: FONT.mono }}>{m.stage}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 9.5, padding: "3px 10px", borderRadius: 6, fontWeight: 600, fontFamily: FONT.mono,
                        background: isUnwilling ? "rgba(245,158,11,0.08)" : C.redBg,
                        color: isUnwilling ? "#b45309" : C.red,
                        border: `1px solid ${isUnwilling ? "rgba(245,158,11,0.15)" : "rgba(220,38,38,0.12)"}`,
                      }}>{isUnwilling ? "UNWILLING" : "UNABLE"}</span>
                      <Chevron open={isOpen} />
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textMuted, marginTop: 6, lineHeight: 1.5, fontFamily: FONT.body }}>{m.description}</div>
                  {isOpen && (
                    <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                      <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.02)", borderRadius: 8, fontSize: 12.5, color: C.text, lineHeight: 1.6, fontFamily: FONT.body, border: `1px solid ${C.borderSubtle}` }}>
                        <span style={{ fontWeight: 600 }}>How it works:</span> {m.detail}
                      </div>
                      <div style={{ padding: "12px 14px", background: C.accentMuted, borderRadius: 8, fontSize: 12.5, color: C.accent, lineHeight: 1.6, fontFamily: FONT.body, borderLeft: `3px solid ${C.accent}` }}>
                        <span style={{ fontWeight: 600 }}>Analogy:</span> {m.example}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <GlassCard style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, fontFamily: FONT.body, marginBottom: 6 }}>Moat compounding over time</div>
            <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.65, fontFamily: FONT.body }}>
              Right now, Kastle's strongest defenses are counter-positioning and cornered resource — classic early-stage moats. As they scale, switching costs and economies of scale layer on top. The key insight: each new customer and each new agent type deepens all four moats simultaneously. A compliance model trained on 10M mortgage calls is exponentially harder to replicate than one trained on 100K.
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

// ─── 30-Day Plan Tab ────────────────────────────────────────────────
function PlanTab() {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const weeks = [
    { week: "Week 1", title: "Map the machine",
      outcome: "Deliver a documented sales-to-onboarding handoff map that identifies the 2-3 biggest friction points costing Kastle deal velocity or time-to-live.",
      why: "Before building anything, I need to understand the full lifecycle from first demo to first AI call. An early-stage team means this knowledge lives in people's heads — documenting it creates leverage.",
      actions: [
        { what: "Shadow 5+ sales calls & 3+ onboarding sessions", result: "Raw notes on where prospects hesitate and customers get stuck" },
        { what: "Interview every team member (yes, all 8)", result: "Map of who owns what, where handoffs break" },
        { what: "Audit current sales collateral & onboarding flow", result: "Gap analysis: what prospects ask for that we don't have" },
        { what: "Listen to 20+ recorded AI agent calls", result: "First-hand understanding of what the product sounds like" },
      ],
      deliverable: "Written handoff map + friction log. Not a deck — a working doc the team can react to.",
      metric: "# of friction points identified → prioritized by revenue impact" },
    { week: "Week 2", title: "Arm the sales team",
      outcome: "Validate the ROI story with 2-3 existing customers, build competitive battlecards, and put tools in sales' hands.",
      why: "Enterprise mortgage lenders are conservative buyers. A prospect-facing calculator and competitive battlecards turn every sales call into a data-driven conversation instead of a pitch.",
      actions: [
        { what: "Pressure-test ROI assumptions with 2-3 existing customers", result: "Confirm whether 70% cost reduction claims hold in practice" },
        { what: "Build competitive battlecard for top 3 alternatives", result: "One-pager for 'we're also looking at Marr Labs' moments" },
        { what: "Create prospect-facing savings calculator with real data", result: "VPs plug in their own numbers mid-demo" },
        { what: "Deploy in at least 1 live prospect call", result: "Real feedback: does it move the conversation forward?" },
      ],
      deliverable: "Validated ROI calculator + battlecard, actively used in pipeline.",
      metric: "Prospect engagement time · Pipeline progression where tools used vs. not" },
    { week: "Week 3", title: "Compress time-to-live",
      outcome: "Ship an onboarding accelerator that cuts the gap between signed contract and first AI call processed.",
      why: "Kastle claims '7-day setup.' Every day between contract and first-call-live is a day the customer isn't seeing ROI.",
      actions: [
        { what: "Map onboarding journey step-by-step with timestamps", result: "Identify longest steps and highest variance" },
        { what: "Build self-serve onboarding checklist / status tracker", result: "Reduces 'what's happening?' support calls" },
        { what: "Create pre-configured templates for 3 common setups", result: "Start 80% done, customize the last 20%" },
        { what: "Automate 1-2 manual onboarding steps", result: "Remove human bottlenecks from repeatable setup" },
      ],
      deliverable: "Onboarding tracker shipped to 1 new customer. Templates ready for next deal.",
      metric: "Days from contract → first live call (before vs. after)" },
    { week: "Week 4", title: "Close the loop",
      outcome: "Connect sales promises to onboarding delivery to customer outcomes — prove ROI and generate case studies.",
      why: "Without closing the loop — 'did the customer see the savings we promised?' — you can't build the proof that accelerates future sales.",
      actions: [
        { what: "Build lightweight customer health dashboard", result: "Per-customer: calls handled, savings realized, CSAT" },
        { what: "Set up automated 14/30-day check-in triggers", result: "Proactive outreach before problems become churn" },
        { what: "Create success story template for case studies", result: "Turn every happy customer into a sales asset" },
        { what: "Present 30-day retrospective to founders", result: "What shipped, what moved, what to build next" },
      ],
      deliverable: "Health tracker live. 1 case study draft. Retrospective with next-30-day proposal.",
      metric: "Customer savings vs. projected · NPS/CSAT at 30 days" },
  ];
  const weekColors = ["#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9"];

  return (
    <div>
      <h2 style={{ fontFamily: FONT.display, fontSize: 24, fontWeight: 600, color: C.text, margin: "0 0 6px 0" }}>What I'd ship in 30 days</h2>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 22px 0", lineHeight: 1.55, fontFamily: FONT.body }}>Not a learning plan — a shipping plan. Each week has a concrete deliverable that moves a metric.</p>

      <GlassCard style={{ marginBottom: 20, padding: "14px 18px" }}>
        <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.body }}>
          <span style={{ fontWeight: 600, color: C.text }}>The throughline:</span> Map the sales-to-onboarding system (W1) → arm sales with validated tools (W2) → compress time-to-live (W3) → prove ROI so every customer becomes the next case study (W4).
        </div>
      </GlassCard>

      <div style={{ display: "grid", gap: 12 }}>
        {weeks.map((w, i) => {
          const isOpen = expandedWeek === w.week;
          const wColor = weekColors[i];
          return (
            <div key={w.week} style={{ ...glassStyle(), padding: 0, overflow: "hidden", transition: "all 0.2s ease", ...(isOpen ? { border: `1px solid ${C.borderGlow}`, boxShadow: "0 2px 12px rgba(139,92,246,0.08)" } : {}) }}>
              <div onClick={() => setExpandedWeek(isOpen ? null : w.week)} style={{ padding: "16px 20px", cursor: "pointer", borderLeft: `4px solid ${wColor}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: wColor, fontFamily: FONT.mono, fontWeight: 700 }}>{w.week}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FONT.body }}>{w.title}</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55, fontFamily: FONT.body }}>
                      <span style={{ fontWeight: 600, color: C.text }}>Outcome:</span> {w.outcome}
                    </div>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: "0 20px 20px 24px" }}>
                  <div style={{ padding: "10px 14px", background: C.accentMuted, borderRadius: 8, fontSize: 12.5, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.body, marginBottom: 14, borderLeft: `3px solid ${wColor}` }}>
                    <span style={{ fontWeight: 600, color: C.text }}>Why this matters:</span> {w.why}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.textDim, fontFamily: FONT.mono, marginBottom: 8, fontWeight: 600 }}>What I'd do</div>
                    {w.actions.map((a, j) => (
                      <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "10px 0", borderBottom: j < w.actions.length - 1 ? `1px solid ${C.borderSubtle}` : "none" }}>
                        <div style={{ fontSize: 12.5, color: C.text, fontFamily: FONT.body, lineHeight: 1.5 }}>{a.what}</div>
                        <div style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.body, lineHeight: 1.5, fontStyle: "italic" }}>→ {a.result}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{ padding: "12px 14px", background: "rgba(0,0,0,0.02)", borderRadius: 8, border: `1px solid ${C.borderSubtle}` }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: wColor, fontFamily: FONT.mono, fontWeight: 600, marginBottom: 4 }}>Shipped deliverable</div>
                      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, fontFamily: FONT.body }}>{w.deliverable}</div>
                    </div>
                    <div style={{ padding: "12px 14px", background: C.greenBg, borderRadius: 8, border: `1px solid ${C.greenBorder}` }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.green, fontFamily: FONT.mono, fontWeight: 600, marginBottom: 4 }}>How I'd measure success</div>
                      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, fontFamily: FONT.body }}>{w.metric}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, padding: "14px 16px", background: C.warningBg, borderRadius: 10, border: `1px solid ${C.warningBorder}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.warning, fontFamily: FONT.body, marginBottom: 4 }}>A note on honesty</div>
        <div style={{ fontSize: 12.5, color: C.warning, lineHeight: 1.6, fontFamily: FONT.body }}>
          This plan is built from outside research — your website, MBA industry data, competitor analysis, and YC public info. The real Week 1 would likely reshape Weeks 2–4 significantly based on what I learn from the team. That's the point: I'm showing how I'd approach the problem, not pretending I already know the answer. The willingness to revise the plan based on new information is the skill, not the plan itself.
        </div>
      </div>
    </div>
  );
}

// ─── Main Shell ─────────────────────────────────────────────────────
export default function KastleGrowthEngine() {
  const [tab, setTab] = useState("roi");
  const [showAuthor, setShowAuthor] = useState(false);

  return (
    <div style={{
      minHeight: "100vh", fontFamily: FONT.body, padding: "0 0 48px 0", color: C.text,
      background: `linear-gradient(135deg, #f0eef5 0%, #e8e4f0 25%, #f2eff8 50%, #ede9f5 75%, #f0eef5 100%)`,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "28px 36px", borderBottom: `1px solid ${C.borderOuter}`,
        background: C.glassSolid,
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 3, color: C.textDim, fontFamily: FONT.mono, marginBottom: 8 }}>GROWTH ANALYSIS</div>
          <h1 style={{ fontFamily: FONT.display, fontSize: 30, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.2 }}>Kastle — Growth Engine</h1>
          <p style={{ fontSize: 14, color: C.textMuted, margin: "8px 0 0 0", maxWidth: 600, lineHeight: 1.55 }}>An interactive look at Kastle's market opportunity, unit economics for prospects, and competitive positioning in mortgage AI.</p>
        </div>
        <div onClick={() => setShowAuthor(!showAuthor)} style={{ padding: "10px 16px", ...glassStyle({ borderRadius: 10 }), cursor: "pointer", position: "relative" }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text, fontFamily: FONT.body }}>Sidharth Sundaram</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono }}>sundar84@purdue.edu</div>
          {showAuthor && (
            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, ...glassStyle({ borderRadius: 12, background: C.glassSolid }), padding: "16px 18px", width: 290, boxShadow: "0 8px 32px rgba(0,0,0,0.1)", zIndex: 20 }}>
              <div style={{ fontSize: 12.5, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.body, marginBottom: 12 }}>
                PM with 4 years in EdTech growth. MS Engineering Management @ Purdue. Built this with Claude to show how I think about growth problems — the frameworks are mine, the implementation had AI assist.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <a href="https://www.linkedin.com/in/sidharthsundaram/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, fontFamily: FONT.mono, textDecoration: "none" }}>🔗 LinkedIn</a>
                <a href="https://sidharthsundaram.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: C.accent, fontFamily: FONT.mono, textDecoration: "none" }}>🌐 sidharthsundaram.com</a>
                <a href="mailto:sundar84@purdue.edu" style={{ fontSize: 12, color: C.accent, fontFamily: FONT.mono, textDecoration: "none" }}>✉️ sundar84@purdue.edu</a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, padding: "0 36px", borderBottom: `1px solid ${C.borderOuter}`, background: C.glassSolid }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "15px 22px", fontSize: 11, fontFamily: FONT.mono, letterSpacing: 1.5, fontWeight: 500, cursor: "pointer",
            background: "none", border: "none", color: tab === t.id ? C.accent : C.textDim,
            borderBottom: tab === t.id ? `2px solid ${C.accent}` : `2px solid transparent`, transition: "all 0.2s ease",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 36px" }}>
        {tab === "roi" && <ROITab />}
        {tab === "landscape" && <LandscapeTab />}
        {tab === "plan" && <PlanTab />}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "24px 36px 0" }}>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono, letterSpacing: 1.2 }}>
          SOURCES: MBA SERVICING OPERATIONS STUDY 2024 · KASTLE.AI · YC · TRACXN · NATIONAL MORTGAGE NEWS
        </div>
      </div>
    </div>
  );
}
