import { useState, useEffect } from "react";
import { C, categories, loadingMessages } from "./constants.js";
import { Blob } from "./components.jsx";

export default function LoadingPage() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots,   setDots]   = useState("");

  useEffect(() => {
    const mi = setInterval(() => setMsgIdx(i => (i + 1) % loadingMessages.length), 1700);
    const di = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 420);
    return () => { clearInterval(mi); clearInterval(di); };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      fontFamily: "'Nunito', sans-serif",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <Blob style={{ width: 420, height: 420, background: C.yellow, top: -100, left: -100 }} />
      <Blob style={{ width: 360, height: 360, background: C.green,  bottom: -80, right: -80 }} />
      <Blob style={{ width: 260, height: 260, background: C.blue,   top: "30%", right: "4%" }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 32px" }}>
        {/* Dual ring spinner */}
        <div style={{ position: "relative", width: 130, height: 130, margin: "0 auto 44px" }}>
          <div style={{
            width: 130, height: 130, borderRadius: "50%",
            border: `7px solid ${C.green}25`,
            borderTop: `7px solid ${C.green}`,
            animation: "spinFwd 1.1s linear infinite",
            position: "absolute",
          }} />
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            border: `5px solid ${C.blue}25`,
            borderTop: `5px solid ${C.blue}`,
            animation: "spinBck 0.85s linear infinite",
            position: "absolute", top: 17, left: 17,
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", fontSize: 36,
          }}>🧠</div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 900, color: C.text, marginBottom: 14 }}>
          Analyzing your profile{dots}
        </h2>
        <div style={{ fontSize: 17, color: C.muted, fontWeight: 600, minHeight: 30, transition: "all 0.3s" }}>
          {loadingMessages[msgIdx]}
        </div>

        {/* Category progress dots */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 44 }}>
          {categories.map((c, i) => (
            <div key={c.id} style={{
              width: 13, height: 13, borderRadius: "50%",
              background: c.color,
              opacity: (msgIdx % categories.length) >= i ? 1 : 0.25,
              transition: "opacity 0.3s",
            }} />
          ))}
        </div>

        <p style={{ marginTop: 18, fontSize: 13, color: C.muted }}>This usually takes under 5 seconds</p>
      </div>

      <style>{`
        @keyframes spinFwd { to { transform: rotate(360deg);  } }
        @keyframes spinBck { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}
