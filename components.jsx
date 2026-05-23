import { C } from "./constants.js";

// ─── Decorative blob ──────────────────────────────────────────────────────────
export function Blob({ style }) {
  return (
    <div style={{
      position: "absolute", borderRadius: "50%", filter: "blur(70px)",
      opacity: 0.18, pointerEvents: "none", zIndex: 0, ...style,
    }} />
  );
}

// ─── Top navigation bar ───────────────────────────────────────────────────────
export function Navbar({ activePage, onNavigate }) {
  const links = [
    { id: "home",     label: "Home" },
    { id: "form",     label: "Risk Check" },
    { id: "pomodoro", label: "Pomodoro" },
  ];

  return (
    <nav style={{
      background: C.card, borderBottom: "2px solid #E8F5E9",
      padding: "14px 40px", display: "flex", alignItems: "center",
      justifyContent: "space-between", position: "relative", zIndex: 100,
      boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* SVG logo mark */}
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="36" height="36" rx="10" fill={`url(#logoGrad)`} />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={C.green} />
              <stop offset="100%" stopColor={C.blueDk} />
            </linearGradient>
          </defs>
          {/* Spine / heartbeat icon */}
          <path d="M18 6 C18 6 13 10 13 15 C13 18 15 20 18 20 C21 20 23 18 23 15 C23 10 18 6 18 6Z" fill="white" opacity="0.9"/>
          <path d="M10 24 L14 24 L16 20 L18 28 L20 18 L22 24 L26 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <span style={{ fontWeight: 900, fontSize: 21, color: C.greenDk, letterSpacing: -0.5, fontFamily: "'Nunito', sans-serif" }}>
          SomaTrack
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: 6 }}>
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => onNavigate(l.id)}
            style={{
              padding: "8px 20px", borderRadius: 22, fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "'Nunito', sans-serif", border: "none",
              transition: "all 0.18s",
              background: activePage === l.id ? C.greenDk : "transparent",
              color: activePage === l.id ? "#fff" : C.muted,
            }}
          >{l.label}</button>
        ))}
      </div>
    </nav>
  );
}
