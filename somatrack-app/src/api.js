// ─── Local ML API ─────────────────────────────────────────────────────────────
export async function getPrediction(formData) {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model server request failed (${response.status}): ${errorText}`);
  }

  return await response.json();
}

// ─── Fallback mock results ────────────────────────────────────────────────────
export const mockResults = {
  back_pain: true,
  neck_strain: true,
  tension_headaches: false,
  wrist_pain: false,
  eye_strain: true,
  finger_numbness: false,
  pain_level: 6,
  back_pain_pct: 72,
  neck_strain_pct: 58,
  tension_headaches_pct: 30,
  eye_strain_pct: 64,
  summary: "Based on your study habits, you show signs of moderate ergonomic risk. Your extended sitting and screen time are key factors to address. Small daily changes can make a huge difference.",
  top_tips: [
    "Take a 5-minute break every 45 minutes of studying",
    "Raise your screen to eye level to reduce neck strain",
    "Stay hydrated — aim for at least 2L of water daily",
  ],
};
