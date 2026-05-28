import { C } from "./constants.js";
import { Blob } from "./components.jsx";



// ─── Feature card SVG logos ───────────────────────────────────────────────────
function LogoSmart() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill={C.greenDk}/>
      {/* Brain outline */}
      <path d="M24 12 C18 12 14 16 14 21 C14 24 15 26 17 28 C17 30 16 32 18 33 C20 34 22 33 24 32 C26 33 28 34 30 33 C32 32 31 30 31 28 C33 26 34 24 34 21 C34 16 30 12 24 12Z" fill="none" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
      {/* Brain center line */}
      <line x1="24" y1="13" x2="24" y2="32" stroke="white" strokeWidth="1.5" opacity="0.5"/>
      {/* Brain folds */}
      <path d="M18 20 C20 18 22 20 20 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M30 20 C28 18 26 20 28 22" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M17 26 C19 25 20 27 18 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M31 26 C29 25 28 27 30 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.8"/>
      {/* Spark */}
      <circle cx="34" cy="14" r="4" fill={C.yellow}/>
      <path d="M33 14 L34 12 L35 14 L37 14 L35.5 15.5 L36 17.5 L34 16.5 L32 17.5 L32.5 15.5 L31 14 Z" fill="white" transform="scale(0.7) translate(14.5, 5)"/>
    </svg>
  );
}

function LogoAI() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill={C.blueDk}/>
      {/* Circuit/DNA-like */}
      <circle cx="24" cy="16" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="16" cy="28" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="32" cy="28" r="4" stroke="white" strokeWidth="1.8" fill="none"/>
      <circle cx="24" cy="36" r="3" fill={C.yellow}/>
      <line x1="24" y1="20" x2="17" y2="25" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <line x1="24" y1="20" x2="31" y2="25" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <line x1="19" y1="31" x2="24" y2="34" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <line x1="29" y1="31" x2="24" y2="34" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="24" cy="16" r="2" fill={C.blue}/>
      <circle cx="16" cy="28" r="2" fill={C.blue}/>
      <circle cx="32" cy="28" r="2" fill={C.blue}/>
    </svg>
  );
}

function LogoTips() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill={C.green}/>
      {/* Lightbulb */}
      <path d="M24 10 C19 10 15 14 15 19 C15 23 17 25 19 27 L19 32 L29 32 L29 27 C31 25 33 23 33 19 C33 14 29 10 24 10Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <line x1="20" y1="35" x2="28" y2="35" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <line x1="21" y1="38" x2="27" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      {/* Glow lines */}
      <line x1="24" y1="6" x2="24" y2="8" stroke={C.yellow} strokeWidth="2" strokeLinecap="round"/>
      <line x1="12" y1="10" x2="13.5" y2="11.5" stroke={C.yellow} strokeWidth="2" strokeLinecap="round"/>
      <line x1="36" y1="10" x2="34.5" y2="11.5" stroke={C.yellow} strokeWidth="2" strokeLinecap="round"/>
      {/* Center shine */}
      <circle cx="24" cy="20" r="3" fill="white" opacity="0.35"/>
    </svg>
  );
}

function LogoInstant() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill={C.peach}/>
      {/* Lightning bolt / clock hybrid */}
      <circle cx="24" cy="24" r="11" stroke="white" strokeWidth="2" fill="none"/>
      <line x1="24" y1="15" x2="24" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="24" y1="24" x2="29" y2="27" stroke={C.yellow} strokeWidth="2.5" strokeLinecap="round"/>
      {/* Tick marks */}
      <line x1="24" y1="13" x2="24" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="35" y1="24" x2="33" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="13" y1="24" x2="15" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <line x1="24" y1="35" x2="24" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      {/* Speed lines */}
      <line x1="8" y1="20" x2="13" y2="20" stroke={C.yellow} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="6" y1="24" x2="11" y2="24" stroke={C.yellow} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
      <line x1="8" y1="28" x2="13" y2="28" stroke={C.yellow} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );
}

// ─── HomePage ─────────────────────────────────────────────────────────────────
export default function HomePage({ onStart, onNavigate }) {
  const features = [
    { Logo: LogoSmart, title: "Smart Analysis",   desc: "Evaluates 18 key factors of your study lifestyle to detect hidden risks." },
    { Logo: LogoAI,    title: "AI-Powered",        desc: "Advanced model trained on ergonomics and musculoskeletal health research." },
    { Logo: LogoTips,  title: "Actionable Tips",   desc: "Get personalised recommendations to study comfortably and pain-free." },
    { Logo: LogoInstant, title: "Instant Results", desc: "Know your full risk profile in under 2 minutes — no sign-up needed." },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito', sans-serif", overflow: "hidden", position: "relative" }}>
      <Blob style={{ width: 600, height: 600, background: C.yellow, top: -180, left: -120 }} />
      <Blob style={{ width: 450, height: 450, background: C.green, bottom: -80, right: -100 }} />
      <Blob style={{ width: 300, height: 300, background: C.blue, top: "38%", right: "8%" }} />

      {/* Hero section */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center", position: "relative", zIndex: 10 }}>
        {/* Left: copy */}
        <div>
          <div style={{ display: "inline-block", background: `${C.yellow}cc`, border: `2px solid ${C.yellow}`, borderRadius: 30, padding: "6px 18px", fontSize: 13, fontWeight: 700, color: C.greenDk, marginBottom: 24 }}>
            🎓 Built for students, by health experts
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 900, color: C.text, lineHeight: 1.1, margin: "0 0 24px", letterSpacing: -2 }}>
            Is your study<br/>routine
            <span style={{ background: `linear-gradient(90deg, ${C.greenDk}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {" "}hurting you?
            </span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 480, margin: "0 0 36px", lineHeight: 1.75, fontWeight: 500 }}>
            SomaTrack detects your personal risk for back pain, neck strain, eye strain and more — before they become chronic conditions.
          </p>

          <button onClick={onStart} style={{
            background: `linear-gradient(135deg, ${C.green}, ${C.blueDk})`,
            color: "#fff", border: "none", borderRadius: 50, padding: "18px 44px",
            fontSize: 18, fontWeight: 800, cursor: "pointer", fontFamily: "'Nunito', sans-serif",
            boxShadow: `0 8px 30px ${C.green}55`,
            display: "inline-flex", alignItems: "center", gap: 10,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 14px 40px ${C.green}77`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 30px ${C.green}55`; }}
          >
            🩺 Let's test your pain risk
          </button>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: C.muted }}>⚡ Takes ~2 min</span>
            <span style={{ fontSize: 13, color: C.muted }}>🔒 Free & Private</span>
            <span style={{ fontSize: 13, color: C.muted }}>✅ No sign-up</span>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
            {[["73%","of students report pain"],["18","risk factors analyzed"],["6","conditions screened"]].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontSize: 30, fontWeight: 900, color: C.greenDk }}>{n}</div>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <img
  src="/student.png"
  alt="student"
  style={{
    width: 400,           // fixed width in px         // fixed height in px
    objectFit: "cover",   // crop nicely without stretching
    borderRadius: 24,     // rounded corners
    display: "block",     // removes weird bottom gap
  }}
/>
      </div>

      {/* Feature cards */}
      <div style={{ maxWidth: 1100, margin: "48px auto 0", padding: "0 40px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, position: "relative", zIndex: 10 }}>
        {features.map(({ Logo, title, desc }) => (
          <div key={title} style={{ background: C.card, borderRadius: 22, padding: "28px 22px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1.5px solid #E8F5E9", transition: "transform 0.18s, box-shadow 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ marginBottom: 16 }}><Logo /></div>
            <div style={{ fontWeight: 800, fontSize: 16, color: C.text, marginBottom: 8 }}>{title}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Pomodoro CTA banner */}
      <div style={{ maxWidth: 1100, margin: "0 auto 80px", padding: "0 40px", position: "relative", zIndex: 10 }}>
        <div style={{ background: `linear-gradient(135deg, ${C.butter}, ${C.green}33)`, border: `2px solid ${C.yellow}`, borderRadius: 24, padding: "28px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20, color: C.text, marginBottom: 6 }}>🍅 Try the Pomodoro Timer</div>
            <div style={{ fontSize: 14, color: C.muted }}>Add tasks, focus in sprints, and track your study sessions.</div>
          </div>
          <button onClick={() => onNavigate("pomodoro")} style={{ background: C.greenDk, color: "#fff", border: "none", borderRadius: 26, padding: "12px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "'Nunito', sans-serif" }}>
            Open Pomodoro →
          </button>
        </div>
      </div>
    </div>
  );
}
