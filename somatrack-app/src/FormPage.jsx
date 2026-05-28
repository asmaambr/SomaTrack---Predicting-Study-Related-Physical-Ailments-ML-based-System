import { useState } from "react";
import { C, categories } from "./constants.js";

export default function FormPage({ onResults }) {
  const [step, setStep]   = useState(0);
  const [form, setForm]   = useState({});
  const [errors, setErrors] = useState({});
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const cat = categories[step];

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    cat.questions.forEach(q => {
      const v = form[q.key];
      if (v === undefined || v === null || v === "") errs[q.key] = true;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    setDirection(1);
    setStep(s => Math.min(s + 1, categories.length - 1));
  };

  const prev = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 0));
  };

  const submit = () => {
    if (validate()) onResults(form);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Nunito', sans-serif", paddingBottom: 80 }}>
      {/* Progress bar */}
      <div style={{ height: 5, background: "#E8F5E9" }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / categories.length) * 100}%`,
          background: `linear-gradient(90deg, ${C.green}, ${C.blue})`,
          transition: "width 0.4s ease",
          borderRadius: "0 4px 4px 0",
        }} />
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "22px 16px 0", flexWrap: "wrap" }}>
        {categories.map((c, i) => (
          <div key={c.id} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700,
            background: i === step ? c.color : i < step ? `${C.green}33` : "#F0F0F0",
            color:      i === step ? C.text    : i < step ? C.greenDk      : "#AAA",
            border:     `2px solid ${i === step ? c.color : "transparent"}`,
            transition: "all 0.25s",
            cursor: "default",
          }}>{c.emoji} {c.label}</div>
        ))}
      </div>

      {/* Step counter */}
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, fontWeight: 700, color: C.muted }}>
        Step {step + 1} of {categories.length}
      </div>

      {/* Card */}
      <div style={{ maxWidth: 640, margin: "20px auto 0", padding: "0 20px" }}>
        <div style={{
          background: cat.bg, borderRadius: 28, padding: "36px 36px 28px",
          border: `2px solid ${cat.color}55`,
          boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.greenDk, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
            {cat.emoji} {cat.label}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: "0 0 28px", lineHeight: 1.3 }}>
            {
              cat.id === "study"       ? "Tell us about your daily schedule" :
              cat.id === "breaks"      ? "How do you take care of yourself?" :
              cat.id === "environment" ? "Describe your study space"         :
              cat.id === "posture"     ? "Your posture & screen setup"       :
                                         "Your health background"
            }
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {cat.questions.map(q => (
              <div key={q.key}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 9 }}>
                  {q.label}
                  {errors[q.key] && (
                    <span style={{ color: "#e74c3c", fontWeight: 600, marginLeft: 8, fontSize: 12 }}>← Required</span>
                  )}
                </label>

                {q.type === "select" ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {q.options.map(opt => (
                      <button key={opt} onClick={() => set(q.key, opt)} style={{
                        padding: "9px 18px", borderRadius: 22, fontSize: 13, fontWeight: 700,
                        background: form[q.key] === opt ? cat.color : C.card,
                        color:      form[q.key] === opt ? (cat.color === C.yellow ? C.text : "#fff") : C.muted,
                        border:     `2px solid ${form[q.key] === opt ? cat.color : "#DDD"}`,
                        cursor: "pointer", fontFamily: "'Nunito', sans-serif", transition: "all 0.15s",
                      }}>{opt}</button>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      type="number" min={q.min} max={q.max} placeholder={q.placeholder}
                      value={form[q.key] ?? ""}
                      onChange={e => set(q.key, e.target.value)}
                      style={{
                        flex: 1, padding: "12px 16px", borderRadius: 14, fontSize: 15, fontWeight: 600,
                        border: `2px solid ${errors[q.key] ? "#e74c3c" : "#DDD"}`,
                        outline: "none", fontFamily: "'Nunito', sans-serif",
                        background: C.card, color: C.text,
                      }}
                    />
                    {q.unit && <span style={{ fontWeight: 700, color: C.muted, minWidth: 32 }}>{q.unit}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          <button onClick={prev} disabled={step === 0} style={{
            padding: "12px 28px", borderRadius: 30, fontWeight: 800, fontSize: 15,
            cursor: step === 0 ? "not-allowed" : "pointer",
            background: step === 0 ? "#F0F0F0" : C.card,
            color:      step === 0 ? "#CCC"    : C.text,
            border: `2px solid ${step === 0 ? "#E0E0E0" : "#C8E6C9"}`,
            fontFamily: "'Nunito', sans-serif", transition: "all 0.15s",
          }}>← Back</button>

          {step < categories.length - 1 ? (
            <button onClick={next} style={{
              padding: "12px 36px", borderRadius: 30, fontWeight: 800, fontSize: 15,
              cursor: "pointer",
              background: `linear-gradient(135deg, ${C.green}, ${C.blueDk})`,
              color: "#fff", border: "none",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 4px 16px ${C.green}44`,
            }}>Next →</button>
          ) : (
            <button onClick={submit} style={{
              padding: "14px 40px", borderRadius: 30, fontWeight: 800, fontSize: 16,
              cursor: "pointer",
              background: `linear-gradient(135deg, ${C.peach}, ${C.pink})`,
              color: "#fff", border: "none",
              fontFamily: "'Nunito', sans-serif",
              boxShadow: `0 4px 20px ${C.peach}55`,
              display: "flex", alignItems: "center", gap: 8,
            }}>🔍 See My Results</button>
          )}
        </div>
      </div>
    </div>
  );
}
