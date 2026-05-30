// ─── Local ML API ─────────────────────────────────────────────────────────────
function buildApiCandidates() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? "").trim().replace(/\/$/, "");
  const isLocalHost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  const candidates = [];

  if (configured) {
    candidates.push(configured);
  }

  // In local dev, prefer the Vite proxy first, then direct FastAPI localhost.
  if (isLocalHost) {
    candidates.push("");
    candidates.push("http://127.0.0.1:8000");
  }

  if (!configured && !isLocalHost) {
    candidates.push("http://127.0.0.1:8000");
  }

  return [...new Set(candidates)];
}

async function tryPredict(baseUrl, formData) {
  const endpoint = `${baseUrl}/api/predict`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model server request failed at ${endpoint} (${response.status}): ${errorText}`);
  }

  return response.json();
}

export async function getPrediction(formData) {
  const candidates = buildApiCandidates();
  const errors = [];

  for (const baseUrl of candidates) {
    try {
      return await tryPredict(baseUrl, formData);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(errors.join(" | "));
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
  overall_risk_score: 60,
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
