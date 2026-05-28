import { useState, useEffect, useRef } from "react";
import { C } from "./constants.js";
import { Blob } from "./components.jsx";

const MODES = {
  focus:       { label: "Focus",        duration: 25 * 60, color: C.green,   emoji: "🎯" },
  short_break: { label: "Short Break",  duration:  5 * 60, color: C.blue,    emoji: "☕" },
  long_break:  { label: "Long Break",   duration: 15 * 60, color: C.peach,   emoji: "🛌" },
};

function pad(n) { return String(n).padStart(2, "0"); }

function formatTime(secs) {
  return `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`;
}

// ─── Circular timer SVG ───────────────────────────────────────────────────────
function CircleTimer({ secs, total, color }) {
  const r = 110;
  const circ = 2 * Math.PI * r;
  const pct  = secs / total;
  return (
    <svg width="280" height="280" viewBox="0 0 280 280">
      {/* Track */}
      <circle cx="140" cy="140" r={r} fill="none" stroke={`${color}22`} strokeWidth="14"/>
      {/* Progress */}
      <circle cx="140" cy="140" r={r} fill="none"
        stroke={color} strokeWidth="14"
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 140 140)"
        style={{ transition: "stroke-dasharray 0.5s linear" }}
      />
      {/* Time text */}
      <text x="140" y="148" textAnchor="middle" fontFamily="Nunito" fontWeight="900" fontSize="44" fill={C.text}>
        {formatTime(secs)}
      </text>
    </svg>
  );
}

// ─── PomodoroPage ─────────────────────────────────────────────────────────────
export default function PomodoroPage() {
  const [mode,     setMode]     = useState("focus");
  const [secs,     setSecs]     = useState(MODES.focus.duration);
  const [running,  setRunning]  = useState(false);
  const [sessions, setSessions] = useState(0);
  const [tasks,    setTasks]    = useState([
    { id: 1, text: "Read Chapter 3 — Anatomy",   done: false, pomodoros: 0 },
    { id: 2, text: "Solve past exam questions",   done: false, pomodoros: 0 },
  ]);
  const [newTask,  setNewTask]  = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const [flash,    setFlash]    = useState(false);

  const intervalRef = useRef(null);

  const m = MODES[mode];

  // Switch mode → reset timer
  const switchMode = (newMode) => {
    setMode(newMode);
    setSecs(MODES[newMode].duration);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  // Tick
  useEffect(() => {
    clearInterval(intervalRef.current);
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecs(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setFlash(true);
          setTimeout(() => setFlash(false), 2000);
          if (mode === "focus") {
            setSessions(n => n + 1);
            // Award active task a pomodoro
            if (activeTask !== null) {
              setTasks(ts => ts.map(t => t.id === activeTask ? { ...t, pomodoros: t.pomodoros + 1 } : t));
            }
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode, activeTask]);

  const toggle = () => setRunning(r => !r);
  const reset  = () => { setSecs(m.duration); setRunning(false); clearInterval(intervalRef.current); };

  const addTask = () => {
    const text = newTask.trim();
    if (!text) return;
    setTasks(ts => [...ts, { id: Date.now(), text, done: false, pomodoros: 0 }]);
    setNewTask("");
  };

  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => { setTasks(ts => ts.filter(t => t.id !== id)); if (activeTask === id) setActiveTask(null); };

  const pending  = tasks.filter(t => !t.done);
  const done     = tasks.filter(t => t.done);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden" }}>
      <Blob style={{ width: 400, height: 400, background: m.color, top: -120, right: -80 }} />
      <Blob style={{ width: 320, height: 320, background: C.yellow, bottom: -60, left: -60 }} />

      {/* Flash overlay on completion */}
      {flash && (
        <div style={{
          position: "fixed", inset: 0, background: `${m.color}44`,
          zIndex: 200, pointerEvents: "none",
          animation: "flashIn 0.4s ease",
        }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 80 }}>
            {mode === "focus" ? "🎉" : "⚡"}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start", position: "relative", zIndex: 10 }}>

        {/* ── LEFT: Timer ── */}
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 26, color: C.text, margin: "0 0 22px" }}>🍅 Pomodoro Timer</h2>

          {/* Mode tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {Object.entries(MODES).map(([key, val]) => (
              <button key={key} onClick={() => switchMode(key)} style={{
                flex: 1, padding: "10px 0", borderRadius: 20, fontWeight: 800, fontSize: 13,
                cursor: "pointer", fontFamily: "'Nunito', sans-serif", border: "none",
                background: mode === key ? val.color : "#F0F0F0",
                color: mode === key ? (val.color === C.yellow ? C.text : "#fff") : C.muted,
                transition: "all 0.18s",
              }}>{val.emoji} {val.label}</button>
            ))}
          </div>

          {/* Timer ring */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <CircleTimer secs={secs} total={m.duration} color={m.color} />
          </div>

          {/* Active task label */}
          <div style={{ textAlign: "center", marginBottom: 22, fontSize: 14, fontWeight: 700, color: C.muted, minHeight: 22 }}>
            {activeTask !== null
              ? `Working on: "${tasks.find(t => t.id === activeTask)?.text ?? ""}"`
              : "No task selected — pick one from the list →"}
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={reset} style={{
              padding: "12px 24px", borderRadius: 28, fontWeight: 800, fontSize: 15,
              cursor: "pointer", background: C.card, color: C.text,
              border: `2px solid #E0E0E0`, fontFamily: "'Nunito', sans-serif",
            }}>↺ Reset</button>
            <button onClick={toggle} style={{
              padding: "14px 44px", borderRadius: 30, fontWeight: 900, fontSize: 17,
              cursor: "pointer", border: "none",
              background: running
                ? `linear-gradient(135deg, ${C.peach}, ${C.pink})`
                : `linear-gradient(135deg, ${m.color}, ${C.greenDk})`,
              color: "#fff", fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 6px 24px ${m.color}55`,
              transition: "all 0.18s",
            }}>
              {running ? "⏸ Pause" : secs === m.duration ? "▶ Start" : "▶ Resume"}
            </button>
          </div>

          {/* Sessions counter */}
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
            {[...Array(Math.min(sessions % 4 || 4, 4))].map((_, i) => (
              <div key={i} style={{
                width: 18, height: 18, borderRadius: "50%",
                background: i < (sessions % 4 || (sessions > 0 ? 4 : 0)) ? C.green : "#E0E0E0",
              }} />
            ))}
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: C.muted }}>
              {sessions} session{sessions !== 1 ? "s" : ""} today
            </span>
          </div>
        </div>

        {/* ── RIGHT: Tasks ── */}
        <div>
          <h2 style={{ fontWeight: 900, fontSize: 26, color: C.text, margin: "0 0 22px" }}>📋 Task List</h2>

          {/* Add task input */}
          <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
            <input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Add a task and press Enter…"
              style={{
                flex: 1, padding: "12px 16px", borderRadius: 14, fontSize: 14, fontWeight: 600,
                border: "2px solid #E0E0E0", outline: "none",
                fontFamily: "'Nunito', sans-serif", color: C.text,
              }}
            />
            <button onClick={addTask} style={{
              padding: "12px 20px", borderRadius: 14, fontWeight: 800, fontSize: 14,
              cursor: "pointer", border: "none",
              background: C.greenDk, color: "#fff",
              fontFamily: "'Nunito', sans-serif",
            }}>+ Add</button>
          </div>

          {/* Pending tasks */}
          {pending.length === 0 && done.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted, fontSize: 15 }}>
              No tasks yet! Add one above to get started 🌱
            </div>
          )}

          {pending.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>To Do ({pending.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pending.map(t => (
                  <div key={t.id} onClick={() => setActiveTask(activeTask === t.id ? null : t.id)} style={{
                    background: activeTask === t.id ? `${C.green}18` : C.card,
                    border: `2px solid ${activeTask === t.id ? C.green : "#E8F5E9"}`,
                    borderRadius: 16, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", transition: "all 0.18s",
                  }}>
                    {/* Checkbox */}
                    <div onClick={e => { e.stopPropagation(); toggleTask(t.id); }} style={{
                      width: 22, height: 22, borderRadius: 8, border: `2px solid ${C.green}`,
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: "transparent", cursor: "pointer",
                    }} />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: C.text }}>{t.text}</span>
                    {/* Pomodoro count */}
                    {t.pomodoros > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, background: `${C.green}22`, padding: "2px 8px", borderRadius: 10 }}>
                        🍅×{t.pomodoros}
                      </span>
                    )}
                    {/* Active badge */}
                    {activeTask === t.id && (
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.greenDk, background: `${C.green}33`, padding: "3px 9px", borderRadius: 10 }}>
                        ACTIVE
                      </span>
                    )}
                    {/* Delete */}
                    <button onClick={e => { e.stopPropagation(); deleteTask(t.id); }} style={{
                      background: "none", border: "none", cursor: "pointer", color: "#CCC",
                      fontSize: 16, padding: 0, lineHeight: 1,
                    }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Done tasks */}
          {done.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
                Completed ({done.length}) ✅
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {done.map(t => (
                  <div key={t.id} style={{
                    background: "#F8FFF8", border: "2px solid #E8F5E9",
                    borderRadius: 16, padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: 12, opacity: 0.7,
                  }}>
                    <div onClick={() => toggleTask(t.id)} style={{
                      width: 22, height: 22, borderRadius: 8, border: `2px solid ${C.green}`,
                      background: C.green, flexShrink: 0, display: "flex",
                      alignItems: "center", justifyContent: "center", cursor: "pointer",
                    }}>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</span>
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.muted, textDecoration: "line-through" }}>{t.text}</span>
                    {t.pomodoros > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>🍅×{t.pomodoros}</span>
                    )}
                    <button onClick={() => deleteTask(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#CCC", fontSize: 16, padding: 0 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div style={{ marginTop: 28, background: `${C.butter}bb`, border: `2px solid ${C.yellow}`, borderRadius: 18, padding: "18px 20px" }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: C.greenDk, marginBottom: 8 }}>🌿 Healthy Study Tip</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.65 }}>
              After every 4 pomodoros take a long break of 15–20 minutes. Stand up, stretch, and hydrate before returning to your tasks.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes flashIn { from { opacity: 0; } 50% { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </div>
  );
}
