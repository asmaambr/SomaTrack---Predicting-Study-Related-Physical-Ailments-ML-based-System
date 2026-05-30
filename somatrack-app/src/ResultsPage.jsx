import { C } from "./constants.js";
import { Blob } from "./components.jsx";

// ─── Animated percentage bar ──────────────────────────────────────────────────
function PainBar({ label, icon, pct, color, desc }) {
  return (
    <div style={{ background: C.card, borderRadius: 18, padding: "20px 22px", border: `2px solid ${color}22`, boxShadow: "0 3px 14px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <span style={{ fontWeight: 800, fontSize: 16, color: C.text }}>{label}</span>
        </div>
        <span style={{ fontWeight: 900, fontSize: 22, color }}>{pct}%</span>
      </div>
      <div style={{ height: 10, background: `${color}22`, borderRadius: 8 }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 8, transition: "width 1.2s cubic-bezier(.22,1,.36,1)",
        }} />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: C.muted, fontWeight: 600 }}>{desc}</div>
    </div>
  );
}

// ─── ResultsPage ──────────────────────────────────────────────────────────────
export default function ResultsPage({ results, error, onRestart, onRetry }) {
  if (!results) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 640, width: "100%", background: C.card, borderRadius: 28, padding: 32, border: "2px solid #F3D2D2", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.1, color: "#C0392B", marginBottom: 10 }}>
            Local model unavailable
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text, margin: "0 0 12px" }}>
            Could not load a live prediction
          </h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: C.muted, fontSize: 15 }}>
            {error || "The app could not reach the local FastAPI server. Start the backend, then try again."}
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <button onClick={onRetry} style={{ padding: "12px 20px", borderRadius: 28, border: "none", background: `linear-gradient(135deg, ${C.green}, ${C.blueDk})`, color: "#fff", fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
              Try again
            </button>
            <button onClick={onRestart} style={{ padding: "12px 20px", borderRadius: 28, border: "2px solid #E0E0E0", background: C.card, color: C.text, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // overall risk should come from the final model (percentage 0-100)
  const overallPct = Number.isFinite(Number(results.overall_risk_score))
    ? Number(results.overall_risk_score)
    : Number.isFinite(Number(results.pain_level))
      ? Number(results.pain_level) * 10
      : 0;
  const pl = Math.round(overallPct / 10);
  const plColor = overallPct <= 30 ? C.green : overallPct <= 60 ? C.peach : "#E74C3C";
  const plLabel = overallPct <= 30 ? "Low Risk" : overallPct <= 60 ? "Moderate Risk" : "High Risk";
  const plEmoji = overallPct <= 30 ? "🟢" : overallPct <= 60 ? "🟡" : "🔴";

  const backPct = results.back_pain_pct ?? 0;
  const neckPct = results.neck_strain_pct ?? 0;
  const headPct = results.tension_headaches_pct ?? 0;
  const eyePct = results.eye_strain_pct ?? 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito', sans-serif", paddingBottom: 80, position: "relative", overflow: "hidden" }}>
      <Blob style={{ width: 500, height: 250, background: C.butter, top: 0, left: "-8%" }} />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px 0", position: "relative", zIndex: 10 }}>

        {/* Overall pain score card */}
        <div style={{
          background: `linear-gradient(135deg, ${C.greenDk}, ${C.blueDk})`,
          borderRadius: 28, padding: "36px 40px", color: "#fff",
          marginBottom: 24, boxShadow: `0 12px 40px ${C.greenDk}44`,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.65, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>
                Overall Pain Risk Score
              </div>
              <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>
                {overallPct}%
                <span style={{ fontSize: 20, opacity: 0.5, marginLeft: 8 }}>overall risk</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{plEmoji}</span>
                <span style={{ fontWeight: 800, fontSize: 20 }}>{plLabel}</span>
              </div>
            </div>

            {/* Circular gauge */}
            <div style={{ position: "relative", width: 110, height: 110 }}>
              <svg viewBox="0 0 110 110" width="110" height="110">
                <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10"/>
                <circle cx="55" cy="55" r="46" fill="none"
                  stroke={plColor} strokeWidth="10"
                  strokeDasharray={`${(overallPct / 100) * 289} 289`}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                />
                <text x="55" y="62" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="Nunito">{overallPct}%</text>
              </svg>
            </div>
          </div>

          {/* Pain bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{ height: 8, background: "rgba(255,255,255,0.18)", borderRadius: 10 }}>
              <div style={{
                height: "100%", width: `${pl * 10}%`,
                background: `linear-gradient(90deg, ${C.green}, ${plColor})`,
                borderRadius: 10, transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {results.summary && (
          <div style={{ background: `${C.butter}cc`, border: `2px solid ${C.yellow}`, borderRadius: 20, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: C.greenDk, marginBottom: 8 }}>💬 What this means for you</div>
            <p style={{ color: C.text, lineHeight: 1.75, margin: 0, fontSize: 15 }}>{results.summary}</p>
          </div>
        )}

        {/* Main pains */}
        <h3 style={{ fontWeight: 900, fontSize: 20, color: C.text, margin: "0 0 16px" }}>
          Primary Pain Indicators
        </h3>
        <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: C.muted }}>
         
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          <PainBar
            label="Back Pain"
            icon="🦴"
            pct={backPct}
            color="#E74C3C"
            desc={backPct > 70 ? "Model confidence is high for this outcome." : backPct > 40 ? "Model confidence is moderate." : "Model confidence is low."}
          />
          <PainBar
            label="Neck Strain"
            icon="🫁"
            pct={neckPct}
            color="#E67E22"
            desc={neckPct > 70 ? "Model confidence is high for this outcome." : neckPct > 40 ? "Model confidence is moderate." : "Model confidence is low."}
          />
          <PainBar
            label="Tension Headaches"
            icon="🧠"
            pct={headPct}
            color="#9B59B6"
            desc={headPct > 70 ? "Model confidence is high for this outcome." : headPct > 40 ? "Model confidence is moderate." : "Model confidence is low."}
          />
          <PainBar
            label="Eye Strain"
            icon="👁️"
            pct={eyePct}
            color="#2D9CDB"
            desc={eyePct > 70 ? "Model confidence is high for this outcome." : eyePct > 40 ? "Model confidence is moderate." : "Model confidence is low."}
          />
        </div>

        {/* Tips */}
        {results.top_tips?.length > 0 && (
          <div style={{ background: C.card, borderRadius: 24, padding: "28px 28px", border: "2px solid #E8F5E9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: 28 }}>
            <h3 style={{ fontWeight: 900, fontSize: 20, color: C.text, margin: "0 0 20px" }}>💡 Top Recommendations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {results.top_tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: [C.yellow, C.green, C.blue][i % 3],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 14,
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 15, color: C.text, lineHeight: 1.65, fontWeight: 600, paddingTop: 5 }}>{tip}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onRestart} style={{
            padding: "14px 40px", borderRadius: 30, fontWeight: 800, fontSize: 15,
            background: `linear-gradient(135deg, ${C.green}, ${C.blueDk})`, color: "#fff",
            border: "none", cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            boxShadow: `0 6px 24px ${C.green}44`,
          }}>🔄 Take Test Again</button>
        </div>
      </div>
    </div>
  );
}
