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
  <img
    src="/logo.png"
    alt="SomaTrack logo"
    style={{
      width: 38,
      height: 38,
      borderRadius: 10,
      objectFit: "cover",
    }}
  />
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
