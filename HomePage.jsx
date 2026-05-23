import { C } from "./constants.js";
import { Blob } from "./components.jsx";

// ─── SVG Student Illustration ─────────────────────────────────────────────────
function StudentIllustration() {
  return (
    <svg viewBox="0 0 340 380" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 340, filter: "drop-shadow(0 16px 40px rgba(52,183,136,0.18))" }}>
      {/* Background circle */}
      <circle cx="170" cy="200" r="160" fill={`${C.butter}`} opacity="0.7"/>
      <circle cx="170" cy="200" r="130" fill={`${C.yellow}`} opacity="0.25"/>

      {/* Desk */}
      <rect x="40" y="270" width="260" height="16" rx="8" fill={C.greenDk} opacity="0.15"/>
      <rect x="60" y="286" width="20" height="60" rx="4" fill={C.greenDk} opacity="0.12"/>
      <rect x="260" y="286" width="20" height="60" rx="4" fill={C.greenDk} opacity="0.12"/>

      {/* Laptop */}
      <rect x="90" y="215" width="160" height="100" rx="10" fill="#E8F5E9" stroke={C.green} strokeWidth="2"/>
      <rect x="95" y="220" width="150" height="85" rx="7" fill={C.greenDk} opacity="0.08"/>
      {/* Screen content lines */}
      <rect x="105" y="232" width="80" height="6" rx="3" fill={C.green} opacity="0.4"/>
      <rect x="105" y="244" width="120" height="4" rx="2" fill={C.muted} opacity="0.3"/>
      <rect x="105" y="254" width="100" height="4" rx="2" fill={C.muted} opacity="0.3"/>
      <rect x="105" y="264" width="110" height="4" rx="2" fill={C.muted} opacity="0.3"/>
      {/* Chart on screen */}
      <rect x="195" y="250" width="12" height="20" rx="2" fill={C.green} opacity="0.5"/>
      <rect x="210" y="242" width="12" height="28" rx="2" fill={C.blue} opacity="0.5"/>
      <rect x="225" y="255" width="12" height="15" rx="2" fill={C.peach} opacity="0.5"/>
      {/* Laptop base */}
      <rect x="75" y="312" width="190" height="10" rx="5" fill={C.greenDk} opacity="0.15"/>

      {/* Body / torso */}
      <rect x="140" y="175" width="60" height="80" rx="20" fill="#FDDCB5"/>

      {/* Shirt */}
      <rect x="138" y="195" width="64" height="65" rx="18" fill={C.green} opacity="0.85"/>
      {/* Shirt detail */}
      <path d="M158 200 L170 215 L182 200" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>

      {/* Arms */}
      <path d="M138 210 C118 218 108 240 112 260" stroke="#FDDCB5" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M202 210 C222 218 232 240 228 260" stroke="#FDDCB5" strokeWidth="18" strokeLinecap="round" fill="none"/>
      {/* Hands on keyboard */}
      <ellipse cx="118" cy="264" rx="14" ry="10" fill="#FDDCB5"/>
      <ellipse cx="222" cy="264" rx="14" ry="10" fill="#FDDCB5"/>

      {/* Neck */}
      <rect x="162" y="155" width="16" height="25" rx="8" fill="#FDDCB5"/>

      {/* Head */}
      <ellipse cx="170" cy="130" rx="42" ry="46" fill="#FDDCB5"/>

      {/* Hair */}
      <path d="M128 118 C128 80 212 80 212 118 C212 100 200 86 170 86 C140 86 128 100 128 118Z" fill={C.greenDk} opacity="0.85"/>
      <ellipse cx="128" cy="125" rx="8" ry="14" fill={C.greenDk} opacity="0.85"/>
      <ellipse cx="212" cy="125" rx="8" ry="14" fill={C.greenDk} opacity="0.85"/>

      {/* Eyes */}
      <ellipse cx="155" cy="128" rx="7" ry="8" fill="white"/>
      <ellipse cx="185" cy="128" rx="7" ry="8" fill="white"/>
      <circle cx="157" cy="130" r="4" fill={C.greenDk}/>
      <circle cx="187" cy="130" r="4" fill={C.greenDk}/>
      <circle cx="159" cy="128" r="1.5" fill="white"/>
      <circle cx="189" cy="128" r="1.5" fill="white"/>

      {/* Eyebrows */}
      <path d="M148 119 C151 116 158 116 162 119" stroke={C.greenDk} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M178 119 C181 116 188 116 191 119" stroke={C.greenDk} strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Smile */}
      <path d="M160 144 C164 150 176 150 180 144" stroke={C.peach} strokeWidth="2.5" strokeLinecap="round" fill="none"/>

      {/* Glasses */}
      <rect x="147" y="122" width="20" height="14" rx="7" stroke={C.blueDk} strokeWidth="2" fill="none" opacity="0.6"/>
      <rect x="173" y="122" width="20" height="14" rx="7" stroke={C.blueDk} strokeWidth="2" fill="none" opacity="0.6"/>
      <line x1="167" y1="129" x2="173" y2="129" stroke={C.blueDk} strokeWidth="2" opacity="0.6"/>
      <line x1="127" y1="126" x2="147" y2="126" stroke={C.blueDk} strokeWidth="2" opacity="0.6"/>
      <line x1="193" y1="126" x2="213" y2="126" stroke={C.blueDk} strokeWidth="2" opacity="0.6"/>

      {/* Floating decorations */}
      <circle cx="58" cy="120" r="12" fill={C.yellow} opacity="0.6"/>
      <circle cx="290" cy="150" r="8" fill={C.blue} opacity="0.5"/>
      <circle cx="72" cy="180" r="6" fill={C.green} opacity="0.4"/>
      <circle cx="298" cy="230" r="10" fill={C.peach} opacity="0.5"/>

      {/* Stars */}
      <text x="40" y="90" fontSize="18" opacity="0.5">✦</text>
      <text x="295" y="100" fontSize="14" opacity="0.4">✦</text>
      <text x="310" y="280" fontSize="12" opacity="0.4">✦</text>

      {/* Pain indicator badges */}
      <g transform="translate(285, 170)">
        <circle r="20" fill={C.peach} opacity="0.9"/>
        <text textAnchor="middle" y="6" fontSize="16">⚠️</text>
      </g>
      <g transform="translate(50, 210)">
        <circle r="18" fill={C.blue} opacity="0.85"/>
        <text textAnchor="middle" y="5" fontSize="14">🔍</text>
      </g>
    </svg>
  );
}

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

        {/* Right: illustration */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <StudentIllustration />
        </div>
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
