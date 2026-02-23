import { useState, useEffect, useRef } from "react";

// ─── Brand Colors (from Kastle's actual website) ────────────────────
const C = {
  bg: "#fafaf8",
  bgCard: "#ffffff",
  bgCardAlt: "#f5f4f0",
  bgHero: "#f8f7f4",
  border: "#e8e6e0",
  borderHover: "#d0cdc4",
  accent: "#8b5cf6",       // purple from charts/3D elements
  accentLight: "#a78bfa",
  accentMuted: "rgba(139, 92, 246, 0.08)",
  accentGlow: "rgba(139, 92, 246, 0.12)",
  green: "#10b981",        // compliance green from their UI
  greenBg: "rgba(16, 185, 129, 0.06)",
  text: "#1a1a18",         // darker olive for main text
  textMuted: "#4a4a42",    // darkened from #6b - now readable
  textDim: "#7a7a70",      // darkened from #9b - now visible
  warning: "#92400e",
  warningBg: "rgba(146, 64, 14, 0.06)",
  red: "#dc2626",
  white: "#ffffff",
};

const FONT = {
  serif: "'Playfair Display', 'Georgia', serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Courier New', monospace",
  sans: "'DM Sans', -apple-system, sans-serif",
};

// ─── Data ───────────────────────────────────────────────────────────
const TABS = [
  { id: "roi", label: "PROSPECT ROI", icon: "📊" },
  { id: "landscape", label: "POSITIONING & MOATS", icon: "🏰" },
  { id: "plan", label: "MY FIRST 30 DAYS", icon: "🚀" },
];

// ─── Utilities ──────────────────────────────────────────────────────
const fmt = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

// ─── Shared Components ──────────────────────────────────────────────

function Slider({ value, onChange, min, max, step }) {
  const pctVal = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: "relative", padding: "6px 0" }}>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", height: 4, borderRadius: 2, outline: "none",
          WebkitAppearance: "none", cursor: "pointer",
          background: `linear-gradient(to right, ${C.accent} 0%, ${C.accent} ${pctVal}%, ${C.border} ${pctVal}%, ${C.border} 100%)`,
        }}
      />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%;
          background: ${C.white}; border: 2.5px solid ${C.accent};
          box-shadow: 0 1px 4px rgba(0,0,0,0.12); cursor: pointer;
        }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: ${C.white}; border: 2.5px solid ${C.accent};
          box-shadow: 0 1px 4px rgba(0,0,0,0.12); cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function Disclaimer() {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px",
      background: C.warningBg, borderRadius: 8, border: `1px solid rgba(180,83,9,0.1)`, marginBottom: 20,
    }}>
      <span style={{ fontSize: 13, marginTop: 1 }}>⚠️</span>
      <span style={{ fontSize: 12, color: C.warning, lineHeight: 1.55, fontFamily: FONT.sans }}>
        These numbers are illustrative estimates built from MBA industry benchmarks and Kastle's published metrics. You'll know your actual numbers better — this is a thinking tool, not a forecast.
      </span>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, textTransform: "uppercase", letterSpacing: 2,
      color: C.textDim, fontFamily: FONT.mono, fontWeight: 500, marginBottom: 12,
    }}>{children}</div>
  );
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
      <h2 style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: C.text, margin: "0 0 4px 0" }}>
        What could Kastle save a lender?
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 20px 0", lineHeight: 1.55, fontFamily: FONT.sans }}>
        Adjust inputs to model a prospect's contact center economics. Based on MBA 2024 servicing cost data and Kastle's published 70% cost-reduction claim.
      </p>
      <Disclaimer />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
        {inputs.map((inp) => (
          <div key={inp.label} style={{
            background: C.white, borderRadius: 10, padding: "14px 16px",
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, color: C.textMuted, fontFamily: FONT.sans, fontWeight: 500 }}>{inp.label}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.accent, fontFamily: FONT.mono }}>{inp.format(inp.value)}</span>
            </div>
            <Slider value={inp.value} onChange={inp.set} min={inp.min} max={inp.max} step={inp.step} />
          </div>
        ))}
      </div>

      {/* Results card */}
      <div style={{
        background: C.white, borderRadius: 12, padding: "22px 24px",
        border: `1px solid ${C.border}`, marginBottom: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <SectionLabel>Estimated Annual Impact</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Current spend", value: fmt(currentCost), color: C.text },
            { label: "With Kastle", value: fmt(kastleCost), color: C.accent },
            { label: "Total savings", value: fmt(totalSavings), color: C.green },
          ].map((m) => (
            <div key={m.label}>
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 4, fontFamily: FONT.sans }}>{m.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: m.color, fontFamily: FONT.serif }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans }}>Servicing: {fmt(savings)}</span>
            <span style={{ fontSize: 11, color: C.textMuted, fontFamily: FONT.sans }}>Collections: {fmt(collectionSavings)}</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.bgCardAlt, overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(savings / totalSavings) * 100}%`, background: C.accent, borderRadius: "3px 0 0 3px" }} />
            <div style={{ width: `${(collectionSavings / totalSavings) * 100}%`, background: C.accentLight, borderRadius: "0 3px 3px 0" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Calls automated / year", value: (totalCalls + collectionCalls).toLocaleString() },
          { label: "Handle time saved", value: "~40% per call" },
          { label: "Est. payback period", value: totalSavings > 200000 ? "<30 days" : "<60 days" },
        ].map((s) => (
          <div key={s.label} style={{
            background: C.white, borderRadius: 8, padding: "12px 14px",
            border: `1px solid ${C.border}`, textAlign: "center",
          }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.text, fontFamily: FONT.mono }}>{s.value}</div>
            <div style={{ fontSize: 10.5, color: C.textDim, marginTop: 3, fontFamily: FONT.sans }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── Landscape Tab (Sinfield Funnel + Dunford Positioning + Hamilton Moats) ──
function LandscapeTab() {
  const [activeSection, setActiveSection] = useState("funnel");
  const [expandedStage, setExpandedStage] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);

  const sections = [
    { id: "funnel", label: "BUYER JOURNEY" },
    { id: "position", label: "POSITIONING" },
    { id: "moats", label: "DEFENSIBILITY" },
  ];

  // ── Sinfield's Consumption Funnel applied to Kastle's buyer ──
  const funnelStages = [
    {
      stage: "Awareness",
      question: "When/where does a lender start thinking about AI voice agents?",
      color: "#8b5cf6",
      width: "100%",
      kastle: "LendingTree Innovation Challenge winner. a16z Feb 2025 fintech newsletter. Industry conferences (Digital Mortgage 2024). National Mortgage News coverage. YC brand credibility.",
      alternatives: [
        { name: "Marr Labs", note: "Rocket Mortgage partnership gives visibility in origination circles, but less servicing presence" },
        { name: "Insellerate", note: "Strong CRM install base — existing customers see Aithena AI as an add-on, not a standalone search" },
        { name: "Dialpad / Observe.AI", note: "Known in generic contact center world, but rarely surface in mortgage-specific searches or events" },
        { name: "Legacy IVR / BPO", note: "The status quo — not actively searched for, but deeply embedded in current workflows" },
      ],
      insight: "Kastle has a first-mover awareness advantage in mortgage-specific AI voice. Most competitors are either known for origination (Marr Labs) or generic contact centers (Dialpad). When a servicing VP Googles 'AI voice agent mortgage collections,' Kastle is positioned to show up first.",
    },
    {
      stage: "Consideration",
      question: "Against what alternatives will Kastle compete?",
      color: "#a78bfa",
      width: "82%",
      kastle: "Positioned as 'purpose-built for mortgage servicing' — not a generic AI tool adapted to lending. Compliance engine (FDCPA, TILA, TCPA, UDAAP, RESPA) is the key differentiator at this stage. SOC 2 Type II certification.",
      alternatives: [
        { name: "Marr Labs", note: "Credible in voice AI but positioned around origination/lead qual — weaker story for servicing & collections" },
        { name: "Insellerate", note: "Broader CRM play — AI voice is one feature, not the whole product. Less specialized compliance depth" },
        { name: "Build in-house", note: "Large lenders may explore internal solutions — expensive, slow, and compliance risk is high" },
        { name: "Do nothing", note: "Many lenders are still evaluating. Status quo bias is real — 'our current BPO works fine'" },
      ],
      insight: "This is where positioning matters most. Per April Dunford: how you position determines what you get compared to. If Kastle positions as 'AI voice for mortgage,' they compete against Marr Labs. If they position as 'compliance-first AI workforce for servicing,' the comparison set shifts to manual BPOs and in-house teams — where Kastle wins on cost, speed, and audit-readiness.",
    },
    {
      stage: "Conversion",
      question: "What convinces a lender that Kastle is the optimal choice?",
      color: "#7c3aed",
      width: "60%",
      kastle: "70% lower cost per call (published claim). 40% lower handle time. 90%+ CSAT. $100M+ in transactions processed. 7-day integration timeline. Named customer logos (AD Mortgage, Federal Savings Bank, Angel Oak, Newrez). No rip-and-replace — sits on top of existing systems.",
      alternatives: [
        { name: "Marr Labs", note: "$1K setup + $1K/mo is transparent pricing — but 'per minute' overage model adds uncertainty at scale" },
        { name: "Insellerate", note: "Platform lock-in is the sell — 'you already use our CRM, just turn on AI.' Less compelling for servicing-only needs" },
        { name: "Build in-house", note: "Fails on time-to-value. 7 days (Kastle) vs. 6-12 months (internal build). Compliance risk compounds delay cost" },
      ],
      insight: "The conversion stage is where Kastle's 'no rip-and-replace' positioning and named enterprise logos do the heavy lifting. Enterprise buyers need proof, not promises. Social proof (LendingTree award, a16z feature, Newrez as a customer) reduces perceived risk. The 7-day go-live claim directly attacks the biggest objection: 'this will take forever to implement.'",
    },
    {
      stage: "Retention",
      question: "How does Kastle turn a customer into a locked-in advocate?",
      color: "#6d28d9",
      width: "45%",
      kastle: "Deep LMS/payment processor integration creates switching costs. Multi-agent expansion (servicing → collections → compliance → loss mitigation → loan officer assist) increases wallet share. 100% QA coverage and transparent observability build trust. 'Co-build 3-year roadmap' positioning (from their site) signals long-term partnership.",
      alternatives: [
        { name: "Any competitor", note: "Once integrated with a lender's LMS, payment processor, and contact center — switching means re-training, re-integrating, and re-certifying compliance" },
      ],
      insight: "This is where Kastle's moat compounds. Each additional agent type (collections, compliance, loss mitigation) deepens the integration and raises switching costs. Per Hamilton's 7 Powers: switching costs make competitors 'unwilling' to compete because the ROI of poaching an existing Kastle customer is unattractive — the customer would need to re-validate compliance for every workflow.",
    },
  ];

  // ── Positioning Analysis (Dunford + Sinfield Copy framework) ──
  const positioningData = {
    current: {
      tagline: "Purpose-built AI agents for mortgage lending and servicing",
      messaging: "FDIC-insured banks and IMBs trust Kastle to automate high volume phone calls from loan inquiry to payoff",
      positioning: "First & deepest AI voice platform built specifically for mortgage compliance",
      category: "AI workforce for consumer lending",
    },
    alternatives: [
      {
        name: "Marr Labs",
        impliedPosition: "AI voice agent for mortgage lead qualification and origination",
        comparedTo: "Kastle in origination, manual speed-to-lead processes",
        weakness: "Narrow focus on origination — less depth in servicing, collections, compliance workflows",
      },
      {
        name: "Insellerate",
        impliedPosition: "All-in-one mortgage CRM with AI bolt-on",
        comparedTo: "Encompass, Velocify, other mortgage CRMs",
        weakness: "AI is an add-on, not the core product. Jack of all trades risk",
      },
      {
        name: "Dialpad / Observe.AI",
        impliedPosition: "Enterprise contact center AI platform for any industry",
        comparedTo: "Five9, NICE, Genesys, other CCaaS platforms",
        weakness: "Zero mortgage-specific compliance. Every deployment needs months of custom work",
      },
      {
        name: "Legacy IVR + BPO",
        impliedPosition: "Established, proven call handling infrastructure",
        comparedTo: "Nothing — this IS the status quo",
        weakness: "No AI comprehension, no scalability during spikes, rising labor costs, poor borrower experience",
      },
    ],
    frameworkNote: "Per Dunford's positioning methodology: Kastle's positioning as 'compliance-first AI workforce' means they're compared to manual processes and BPOs — not to generic AI platforms. This is strategic because Kastle wins easily against BPOs on cost and speed, but would face tougher differentiation against other AI players on pure technology.",
  };

  // ── Moats / Defensibility (Hamilton's 7 Powers) ──
  const moats = [
    {
      power: "Counter-positioning",
      stage: "Early (now)",
      icon: "⚔️",
      description: "Kastle's mortgage-native approach means generic platforms (Dialpad, Observe.AI) can't easily respond without cannibalizing their horizontal business.",
      mechanism: "unwilling",
      detail: "Dialpad serves thousands of customers across dozens of industries. Rebuilding their platform around FDCPA/TCPA compliance logic would alienate their non-mortgage customer base and require massive re-engineering. They could — but the ROI is unattractive.",
      example: "Think Netflix vs. Blockbuster: Blockbuster was unwilling to cannibalize physical rentals to compete on streaming. Same dynamic — Dialpad is unwilling to cannibalize breadth to compete on mortgage depth.",
    },
    {
      power: "Cornered resource",
      stage: "Early (now)",
      icon: "🏰",
      description: "Kastle's compliance training data and mortgage-specific conversation models are a proprietary resource competitors don't have.",
      mechanism: "unable",
      detail: "Every call Kastle handles builds a richer dataset of mortgage servicing conversations, compliance edge cases, and borrower interaction patterns. A new entrant would need to process millions of mortgage calls to build comparable training data — and they'd need lender partnerships to access those calls in the first place.",
      example: "Like a patent on juicing technology — Kastle's compliance model improves with every call processed, and competitors can't replicate that institutional knowledge.",
    },
    {
      power: "Switching costs",
      stage: "Growth (building now)",
      icon: "🔒",
      description: "Deep integration with LMS, payment processors, and contact center systems makes migration expensive and risky.",
      mechanism: "unwilling",
      detail: "Once a lender has configured Kastle across multiple workflows (servicing, collections, compliance, loss mitigation), switching means: re-integrating with LMS, re-training AI on their specific SOPs, re-certifying compliance for every workflow, and risking audit gaps during transition.",
      example: "Salesforce's moat in enterprise CRM — Microsoft could build a competitor, but poaching existing Salesforce customers requires overcoming massive integration switching costs.",
    },
    {
      power: "Economies of scale",
      stage: "Growth (future)",
      icon: "📈",
      description: "As Kastle scales across more lenders, per-customer cost of compliance infrastructure, model training, and integration maintenance drops.",
      mechanism: "unable",
      detail: "Compliance rules (FDCPA, TILA, TCPA) are shared across customers. Each new lender benefits from compliance improvements made for other lenders. A smaller competitor would need to absorb the same fixed compliance engineering cost across fewer customers.",
      example: "Like AWS — the infrastructure cost is shared across millions of customers, making per-unit costs nearly impossible for a new entrant to match.",
    },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: C.text, margin: "0 0 4px 0" }}>
        Competitive positioning & defensibility
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 20px 0", lineHeight: 1.55, fontFamily: FONT.sans }}>
        How a mortgage lender evaluates alternatives — and why Kastle's positioning compounds into lasting advantage.
      </p>

      {/* Section switcher */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            padding: "8px 16px", fontSize: 10.5, fontFamily: FONT.mono, letterSpacing: 1,
            fontWeight: 600, cursor: "pointer", borderRadius: 6, border: "none",
            background: activeSection === s.id ? C.accent : C.bgCardAlt,
            color: activeSection === s.id ? C.white : C.textMuted,
            transition: "all 0.2s ease",
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── SECTION: Buyer Journey (Sinfield Funnel) ── */}
      {activeSection === "funnel" && (
        <div>
          <div style={{
            padding: "12px 14px", background: C.accentMuted, borderRadius: 8,
            marginBottom: 16, fontSize: 11.5, color: C.accent, lineHeight: 1.5, fontFamily: FONT.sans,
            border: `1px solid rgba(139,92,246,0.12)`,
          }}>
            <span style={{ fontWeight: 600 }}>Framework:</span> Sinfield's Consumption Funnel — map every competitor across Awareness → Consideration → Conversion → Retention to find where Kastle's positioning creates the biggest edge.
          </div>

          {/* Funnel visualization */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginBottom: 20 }}>
            {funnelStages.map((f, i) => {
              const isOpen = expandedStage === f.stage;
              return (
                <div key={f.stage} style={{ width: "100%", cursor: "pointer" }} onClick={() => setExpandedStage(isOpen ? null : f.stage)}>
                  {/* Funnel bar */}
                  <div style={{
                    width: f.width, margin: "0 auto", padding: "14px 18px",
                    background: `linear-gradient(135deg, ${f.color}12, ${f.color}08)`,
                    border: `1px solid ${f.color}25`,
                    borderRadius: i === 0 ? "10px 10px 4px 4px" : i === 3 ? "4px 4px 10px 10px" : 4,
                    marginBottom: i < 3 ? 3 : 0,
                    transition: "all 0.2s ease",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: f.color, fontFamily: FONT.sans }}>{f.stage}</span>
                        <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 10, fontFamily: FONT.sans }}>{f.question}</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.textDim, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{
                      width: f.width, margin: "0 auto", background: C.white,
                      border: `1px solid ${C.border}`, borderRadius: 8,
                      padding: 18, marginBottom: 8, marginTop: 4,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}>
                      {/* Kastle's position */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.accent }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: FONT.sans }}>Kastle</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontFamily: FONT.sans, paddingLeft: 14 }}>
                          {f.kastle}
                        </div>
                      </div>

                      {/* Alternatives */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.textDim, fontFamily: FONT.mono, marginBottom: 8 }}>
                          Alternatives at this stage
                        </div>
                        {f.alternatives.map((alt) => (
                          <div key={alt.name} style={{
                            display: "flex", gap: 8, padding: "6px 0",
                            borderBottom: `1px solid ${C.bgCardAlt}`,
                            fontSize: 11.5, fontFamily: FONT.sans,
                          }}>
                            <span style={{ fontWeight: 600, color: C.text, minWidth: 100, flexShrink: 0 }}>{alt.name}</span>
                            <span style={{ color: C.textMuted, lineHeight: 1.5 }}>{alt.note}</span>
                          </div>
                        ))}
                      </div>

                      {/* Insight */}
                      <div style={{
                        padding: "10px 12px", background: C.bgCardAlt, borderRadius: 6,
                        fontSize: 11.5, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.sans,
                        borderLeft: `3px solid ${f.color}`,
                      }}>
                        💡 {f.insight}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECTION: Positioning (Dunford + Sinfield Copy) ── */}
      {activeSection === "position" && (
        <div>
          <div style={{
            padding: "12px 14px", background: C.accentMuted, borderRadius: 8,
            marginBottom: 16, fontSize: 11.5, color: C.accent, lineHeight: 1.5, fontFamily: FONT.sans,
            border: `1px solid rgba(139,92,246,0.12)`,
          }}>
            <span style={{ fontWeight: 600 }}>Frameworks:</span> April Dunford's positioning methodology + Sinfield's Copy elements (Tagline, Messaging, Positioning). How you position determines what you get compared to — and Kastle's positioning is a deliberate strategic choice.
          </div>

          {/* Kastle's positioning statement */}
          <div style={{
            background: C.white, borderRadius: 12, padding: 20,
            border: `1px solid ${C.border}`, marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <SectionLabel>Kastle's Positioning (from their website)</SectionLabel>
            <div style={{ display: "grid", gap: 12 }}>
              {[
                { label: "Tagline", value: positioningData.current.tagline, desc: "Memorable statement linking message to source" },
                { label: "Messaging", value: positioningData.current.messaging, desc: "Targeted description of benefits communicated" },
                { label: "Positioning", value: positioningData.current.positioning, desc: "Language that places the message in competitive context" },
                { label: "Category", value: positioningData.current.category, desc: "The anchor category they're defining" },
              ].map((p) => (
                <div key={p.label} style={{
                  padding: "12px 14px", background: C.bgCardAlt, borderRadius: 8,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.accent, fontFamily: FONT.mono, fontWeight: 600 }}>{p.label}</span>
                    <span style={{ fontSize: 9.5, color: C.textDim, fontFamily: FONT.sans, fontStyle: "italic" }}>{p.desc}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.text, fontFamily: FONT.sans, fontWeight: 500, lineHeight: 1.5 }}>
                    "{p.value}"
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dunford: what you get compared to */}
          <div style={{
            background: C.white, borderRadius: 12, padding: 20,
            border: `1px solid ${C.border}`, marginBottom: 16,
          }}>
            <SectionLabel>What each player gets compared to</SectionLabel>
            <p style={{ fontSize: 11.5, color: C.textMuted, margin: "0 0 12px 0", lineHeight: 1.5, fontFamily: FONT.sans }}>
              Your product is the same, but positioning shifts the competitive landscape. Here's how each player's positioning shapes their comparison set:
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {positioningData.alternatives.map((alt) => {
                const isSel = selectedComp === alt.name;
                return (
                  <div key={alt.name}
                    onClick={() => setSelectedComp(isSel ? null : alt.name)}
                    style={{
                      padding: "12px 14px", background: isSel ? C.bgCardAlt : C.white,
                      borderRadius: 8, border: `1px solid ${C.border}`,
                      cursor: "pointer", transition: "all 0.2s ease",
                    }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.text, fontFamily: FONT.sans }}>{alt.name}</span>
                      <span style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.sans, fontStyle: "italic" }}>
                        compared to: {alt.comparedTo}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: C.textMuted, marginTop: 4, fontFamily: FONT.sans }}>
                      Position: "{alt.impliedPosition}"
                    </div>
                    {isSel && (
                      <div style={{
                        marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`,
                        fontSize: 11.5, color: C.warning, lineHeight: 1.5, fontFamily: FONT.sans,
                      }}>
                        ⚡ Vulnerability: {alt.weakness}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key insight */}
          <div style={{
            padding: "14px 16px", background: C.bgCardAlt, borderRadius: 8,
            fontSize: 11.5, color: C.textMuted, lineHeight: 1.65, fontFamily: FONT.sans,
            borderLeft: `3px solid ${C.accent}`,
          }}>
            {positioningData.frameworkNote}
          </div>
        </div>
      )}

      {/* ── SECTION: Moats / Defensibility (Hamilton's 7 Powers) ── */}
      {activeSection === "moats" && (
        <div>
          <div style={{
            padding: "12px 14px", background: C.accentMuted, borderRadius: 8,
            marginBottom: 16, fontSize: 11.5, color: C.accent, lineHeight: 1.5, fontFamily: FONT.sans,
            border: `1px solid rgba(139,92,246,0.12)`,
          }}>
            <span style={{ fontWeight: 600 }}>Framework:</span> Hamilton Helmer's 7 Powers — moats make competitors either <em>unwilling</em> (could compete but choose not to) or <em>unable</em> (can't compete even if they wanted to). Kastle is building both.
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {moats.map((m) => {
              const isOpen = expandedStage === m.power;
              const isUnwilling = m.mechanism === "unwilling";
              return (
                <div key={m.power}
                  onClick={() => setExpandedStage(isOpen ? null : m.power)}
                  style={{
                    background: C.white, borderRadius: 10, padding: "16px 18px",
                    border: `1px solid ${C.border}`, cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                      <div>
                        <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text, fontFamily: FONT.sans }}>{m.power}</span>
                        <span style={{ fontSize: 10.5, color: C.textDim, marginLeft: 8, fontFamily: FONT.mono }}>{m.stage}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 9.5, padding: "3px 8px", borderRadius: 4, fontWeight: 600, fontFamily: FONT.mono,
                        background: isUnwilling ? "rgba(245,158,11,0.1)" : "rgba(220,38,38,0.08)",
                        color: isUnwilling ? "#b45309" : "#dc2626",
                      }}>
                        {isUnwilling ? "UNWILLING" : "UNABLE"}
                      </span>
                      <span style={{ fontSize: 12, color: C.textDim, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6, lineHeight: 1.5, fontFamily: FONT.sans }}>
                    {m.description}
                  </div>

                  {isOpen && (
                    <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
                      <div style={{
                        padding: "10px 12px", background: C.bgCardAlt, borderRadius: 6,
                        fontSize: 11.5, color: C.text, lineHeight: 1.6, fontFamily: FONT.sans,
                      }}>
                        <span style={{ fontWeight: 600 }}>How it works:</span> {m.detail}
                      </div>
                      <div style={{
                        padding: "10px 12px", background: C.accentMuted, borderRadius: 6,
                        fontSize: 11.5, color: C.accent, lineHeight: 1.6, fontFamily: FONT.sans,
                        borderLeft: `3px solid ${C.accent}`,
                      }}>
                        <span style={{ fontWeight: 600 }}>Analogy:</span> {m.example}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{
            marginTop: 14, padding: "14px 16px", background: C.white,
            borderRadius: 8, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, fontFamily: FONT.sans, marginBottom: 6 }}>
              Moat compounding over time
            </div>
            <div style={{ fontSize: 11.5, color: C.textMuted, lineHeight: 1.65, fontFamily: FONT.sans }}>
              Right now, Kastle's strongest defenses are counter-positioning and cornered resource — classic early-stage moats per Helmer's framework. As they scale, switching costs and economies of scale layer on top. The key insight: each new customer and each new agent type deepens all four moats simultaneously. A compliance model trained on 10M mortgage calls is exponentially harder to replicate than one trained on 100K.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 30-Day Plan Tab ────────────────────────────────────────────────
function PlanTab() {
  const [expandedWeek, setExpandedWeek] = useState(null);

  const weeks = [
    {
      week: "Week 1",
      title: "Map the machine",
      outcome: "Deliver a documented sales-to-onboarding handoff map that identifies the 2-3 biggest friction points costing Kastle deal velocity or time-to-live.",
      why: "Before building anything, I need to understand the full lifecycle from first demo to a customer processing their first AI call. An 8-person team means this knowledge lives in people's heads — documenting it creates leverage.",
      actions: [
        { what: "Shadow 5+ sales calls & 3+ onboarding sessions", result: "Raw notes on where prospects hesitate and where new customers get stuck" },
        { what: "Interview every team member (yes, all 8)", result: "Map of who owns what, where handoffs break, what each person wishes existed" },
        { what: "Audit the current sales collateral & onboarding flow", result: "Gap analysis: what prospects ask for that we don't have, what new customers need that we don't provide" },
        { what: "Listen to 20+ recorded AI agent calls", result: "First-hand understanding of what the product actually sounds like to a borrower — this is the product I'm selling" },
      ],
      deliverable: "Written handoff map + friction log shared with Rishi & Nitish. Not a deck — a working doc the team can react to and edit.",
      metric: "# of friction points identified → prioritized by revenue impact",
    },
    {
      week: "Week 2",
      title: "Ship the sales closer",
      outcome: "Build and deploy a prospect-facing ROI calculator that sales can use in live demos — replacing back-of-napkin math with an interactive tool that builds urgency.",
      why: "Enterprise mortgage lenders are conservative buyers. They need to see their own numbers before they'll move. Right now, Kastle likely does this math manually in spreadsheets for each prospect. A polished, interactive tool compresses the 'let me think about it' phase.",
      actions: [
        { what: "Build interactive ROI calculator using real MBA servicing cost data", result: "Prospect inputs their portfolio size, cost-per-call, delinquency rate → sees projected savings instantly" },
        { what: "Validate assumptions with 2-3 existing customers", result: "Confirm the inputs and outputs match reality — avoid the 'your numbers look made up' objection" },
        { what: "Create competitive battlecard for the top 3 alternatives that come up in deals", result: "One-pager sales can reference when a prospect says 'we're also looking at Marr Labs' or 'why not just use Dialpad'" },
        { what: "Test the calculator in at least 1 live prospect call with sales", result: "Real feedback loop: does it actually move the conversation forward or just add noise?" },
      ],
      deliverable: "Deployed ROI calculator + competitive battlecard. Not prototypes — tools actively used in pipeline.",
      metric: "Prospect engagement time on ROI tool · Pipeline progression rate for deals where tool is used vs. not",
    },
    {
      week: "Week 3",
      title: "Compress time-to-live",
      outcome: "Ship an onboarding accelerator that cuts the gap between signed contract and first AI call processed — targeting a measurable reduction in the current onboarding timeline.",
      why: "Kastle claims '7-day setup to results.' Every day between contract-signed and first-call-live is a day the customer isn't seeing ROI — and a day they might get cold feet. Even shaving 1-2 days off has compounding value across every new customer.",
      actions: [
        { what: "Map the current onboarding journey step-by-step with timestamps", result: "Identify which steps take longest and which have the most variance" },
        { what: "Build a self-serve onboarding checklist / status tracker for new customers", result: "Customers can see where they are, what's needed from their side, what Kastle is working on — reduces 'what's happening?' support calls" },
        { what: "Create pre-configured templates for the 3 most common lender setups", result: "Instead of starting from scratch each time, new customers start from 80% done and customize the last 20%" },
        { what: "Automate 1-2 manual onboarding steps (e.g., compliance config, LMS field mapping)", result: "Remove human bottlenecks from the most repeatable parts of setup" },
      ],
      deliverable: "Onboarding tracker shipped to at least 1 new customer. Setup templates documented and ready for next deal.",
      metric: "Days from contract → first live call (before vs. after) · Onboarding support tickets per customer",
    },
    {
      week: "Week 4",
      title: "Close the loop",
      outcome: "Deliver a system that connects sales promises to onboarding delivery to customer outcomes — so Kastle can prove ROI, reduce churn risk, and generate case studies from every customer.",
      why: "The sales ROI calculator (Week 2) sets expectations. Onboarding (Week 3) delivers the product. But without closing the loop — 'did the customer actually see the savings we promised?' — you can't build the proof that accelerates future sales. This is the flywheel.",
      actions: [
        { what: "Build a lightweight customer health dashboard tracking key metrics post-launch", result: "Per-customer view: calls handled, cost savings realized, CSAT, compliance incidents" },
        { what: "Set up automated 14-day and 30-day check-in triggers", result: "Proactive outreach before problems become churn — flag accounts where usage or savings are below projected" },
        { what: "Create a 'success story' template that turns customer data into shareable case studies", result: "Turn every happy customer into a sales asset — 'Company X saved $2.1M in Year 1' with real data backing it up" },
        { what: "Present 30-day retrospective to founders", result: "What shipped, what moved, what I'd do differently, what to build next" },
      ],
      deliverable: "Customer health tracker live for existing accounts. At least 1 case study draft. Retrospective doc with next-30-day proposal.",
      metric: "Customer-reported savings vs. projected savings from ROI tool · NPS/CSAT at 30 days post-launch",
    },
  ];

  const flywheel = [
    { label: "ROI calculator sets expectation", icon: "📊", connects: "→" },
    { label: "Fast onboarding delivers on promise", icon: "⚡", connects: "→" },
    { label: "Health tracking proves the ROI", icon: "📈", connects: "→" },
    { label: "Proof becomes case study → next sale", icon: "🔄", connects: "→" },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 600, color: C.text, margin: "0 0 4px 0" }}>
        What I'd ship in 30 days
      </h2>
      <p style={{ fontSize: 14, color: C.textMuted, margin: "0 0 20px 0", lineHeight: 1.55, fontFamily: FONT.sans }}>
        Not a learning plan — a shipping plan. Each week has a concrete deliverable that moves a metric. By Day 30, Kastle has a connected system from sales → onboarding → proof-of-ROI.
      </p>

      {/* Flywheel visualization */}
      <div style={{
        background: C.white, borderRadius: 12, padding: "16px 20px",
        border: `1px solid ${C.border}`, marginBottom: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <SectionLabel>The flywheel I'm building</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap" }}>
          {flywheel.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{
                padding: "8px 14px", background: C.accentMuted, borderRadius: 8,
                fontSize: 12, color: C.text, fontFamily: FONT.sans, fontWeight: 500,
                border: `1px solid rgba(139,92,246,0.12)`,
                whiteSpace: "nowrap",
              }}>
                {f.icon} {f.label}
              </div>
              {i < flywheel.length - 1 && (
                <span style={{ fontSize: 16, color: C.accent, fontWeight: 600 }}>→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Week cards */}
      <div style={{ display: "grid", gap: 12 }}>
        {weeks.map((w, i) => {
          const isOpen = expandedWeek === w.week;
          const weekColors = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"];
          const wColor = weekColors[i];

          return (
            <div key={w.week} style={{
              background: C.white, borderRadius: 10,
              border: `1px solid ${C.border}`,
              overflow: "hidden", transition: "all 0.2s ease",
            }}>
              {/* Header */}
              <div
                onClick={() => setExpandedWeek(isOpen ? null : w.week)}
                style={{
                  padding: "16px 20px", cursor: "pointer",
                  borderLeft: `4px solid ${wColor}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: wColor, fontFamily: FONT.mono, fontWeight: 700 }}>
                        {w.week}
                      </span>
                      <span style={{ fontSize: 15, fontWeight: 600, color: C.text, fontFamily: FONT.sans }}>
                        {w.title}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55, fontFamily: FONT.sans }}>
                      <span style={{ fontWeight: 600, color: C.text }}>Outcome:</span> {w.outcome}
                    </div>
                  </div>
                  <span style={{ fontSize: 14, color: C.textDim, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0)", marginLeft: 12, marginTop: 4 }}>▾</span>
                </div>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ padding: "0 20px 20px 24px" }}>
                  {/* Why this matters */}
                  <div style={{
                    padding: "10px 14px", background: C.accentMuted, borderRadius: 8,
                    fontSize: 12.5, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.sans,
                    marginBottom: 14, borderLeft: `3px solid ${wColor}`,
                  }}>
                    <span style={{ fontWeight: 600, color: C.text }}>Why this matters:</span> {w.why}
                  </div>

                  {/* Actions */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.textDim, fontFamily: FONT.mono, marginBottom: 8, fontWeight: 600 }}>
                      What I'd do
                    </div>
                    {w.actions.map((a, j) => (
                      <div key={j} style={{
                        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
                        padding: "10px 0",
                        borderBottom: j < w.actions.length - 1 ? `1px solid ${C.bgCardAlt}` : "none",
                      }}>
                        <div style={{ fontSize: 12.5, color: C.text, fontFamily: FONT.sans, lineHeight: 1.5 }}>
                          {a.what}
                        </div>
                        <div style={{ fontSize: 12, color: C.textMuted, fontFamily: FONT.sans, lineHeight: 1.5, fontStyle: "italic" }}>
                          → {a.result}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deliverable + Metric */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={{
                      padding: "12px 14px", background: C.bgCardAlt, borderRadius: 8,
                    }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: wColor, fontFamily: FONT.mono, fontWeight: 600, marginBottom: 4 }}>
                        Shipped deliverable
                      </div>
                      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, fontFamily: FONT.sans }}>
                        {w.deliverable}
                      </div>
                    </div>
                    <div style={{
                      padding: "12px 14px", background: C.greenBg, borderRadius: 8,
                      border: `1px solid rgba(16,185,129,0.1)`,
                    }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: C.green, fontFamily: FONT.mono, fontWeight: 600, marginBottom: 4 }}>
                        How I'd measure success
                      </div>
                      <div style={{ fontSize: 12.5, color: C.text, lineHeight: 1.55, fontFamily: FONT.sans }}>
                        {w.metric}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Honest caveat */}
      <div style={{
        marginTop: 16, padding: "14px 16px", background: C.warningBg, borderRadius: 8,
        border: `1px solid rgba(146,64,14,0.08)`,
      }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.warning, fontFamily: FONT.sans, marginBottom: 4 }}>
          A note on honesty
        </div>
        <div style={{ fontSize: 12.5, color: C.warning, lineHeight: 1.6, fontFamily: FONT.sans }}>
          This plan is built from outside research — your website, MBA industry data, competitor analysis, and YC public info. The real Week 1 would likely reshape Weeks 2–4 significantly based on what I learn from the team. That's the point: I'm showing how I'd approach the problem, not pretending I already know the answer. The willingness to revise the plan based on new information is the skill, not the plan itself.
        </div>
      </div>
    </div>
  );
}
export default function KastleGrowthEngine() {
  const [tab, setTab] = useState("roi");
  const [showAuthor, setShowAuthor] = useState(false);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, fontFamily: FONT.sans,
      padding: "0 0 40px 0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "24px 32px", borderBottom: `1px solid ${C.border}`,
        background: C.white, display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2.5, color: C.textDim, fontFamily: FONT.mono, marginBottom: 6 }}>
            GROWTH ANALYSIS
          </div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 600, color: C.text, margin: 0, lineHeight: 1.2 }}>
            Kastle — Growth Engine
          </h1>
          <p style={{ fontSize: 13.5, color: C.textMuted, margin: "6px 0 0 0", maxWidth: 600, lineHeight: 1.5 }}>
            An interactive look at Kastle's market opportunity, unit economics for prospects, and competitive positioning in mortgage AI.
          </p>
        </div>
        <div
          onClick={() => setShowAuthor(!showAuthor)}
          style={{
            padding: "8px 14px", background: C.bgCardAlt, borderRadius: 8,
            cursor: "pointer", border: `1px solid ${C.border}`, position: "relative",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: C.text, fontFamily: FONT.sans }}>Sidharth Sundaram</div>
          <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono }}>sundar84@purdue.edu</div>
          {showAuthor && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 6,
              background: C.white, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "14px 16px", width: 280, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", zIndex: 20,
            }}>
              <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.6, fontFamily: FONT.sans, marginBottom: 10 }}>
                PM with 4 years in EdTech growth. MS Engineering Management @ Purdue. Built this with Claude to show how I think about growth problems — the frameworks are mine, the implementation had AI assist.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <a href="https://www.linkedin.com/in/sidharthsundaram/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, color: C.accent, fontFamily: FONT.mono, textDecoration: "none" }}>
                  🔗 LinkedIn
                </a>
                <a href="https://sidharthsundaram.com/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, color: C.accent, fontFamily: FONT.mono, textDecoration: "none" }}>
                  🌐 sidharthsundaram.com
                </a>
                <a href="mailto:sundar84@purdue.edu" style={{ fontSize: 11.5, color: C.accent, fontFamily: FONT.mono, textDecoration: "none" }}>
                  ✉️ sundar84@purdue.edu
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 0, padding: "0 32px",
        borderBottom: `1px solid ${C.border}`, background: C.white,
      }}>
        {TABS.map((t) => (
          <button key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "14px 20px", fontSize: 11, fontFamily: FONT.mono,
              letterSpacing: 1.5, fontWeight: 500, cursor: "pointer",
              background: "none", border: "none",
              color: tab === t.id ? C.accent : C.textDim,
              borderBottom: tab === t.id ? `2px solid ${C.accent}` : `2px solid transparent`,
              transition: "all 0.2s ease",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "28px 32px" }}>
        {tab === "roi" && <ROITab />}
        {tab === "landscape" && <LandscapeTab />}
        {tab === "plan" && <PlanTab />}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "20px 32px 0" }}>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: FONT.mono, letterSpacing: 1 }}>
          SOURCES: MBA SERVICING OPERATIONS STUDY 2024 · KASTLE.AI · YC · TRACXN · NATIONAL MORTGAGE NEWS · FRAMEWORKS: SINFIELD (CONSUMPTION FUNNEL) · DUNFORD (POSITIONING) · HELMER (7 POWERS)
        </div>
      </div>
    </div>
  );
}
