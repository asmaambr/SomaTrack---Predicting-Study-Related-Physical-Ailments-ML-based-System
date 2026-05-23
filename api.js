// ─── Claude API ───────────────────────────────────────────────────────────────
export async function getPrediction(formData) {
  const prompt = `You are a musculoskeletal health AI for students. Given these study habits, return ONLY valid JSON (no markdown, no explanation, no backticks):

Student data:
${JSON.stringify(formData, null, 2)}

Return this exact JSON structure with realistic values based on the data:
{
  "back_pain": true/false,
  "neck_strain": true/false,
  "tension_headaches": true/false,
  "wrist_pain": true/false,
  "eye_strain": true/false,
  "finger_numbness": true/false,
  "pain_level": <integer 1-10>,
  "back_pain_pct": <integer 0-100>,
  "neck_strain_pct": <integer 0-100>,
  "tension_headaches_pct": <integer 0-100>,
  "summary": "<2-3 sentence friendly summary>",
  "top_tips": ["tip1", "tip2", "tip3"]
}

Base predictions on actual ergonomic and health risk factors. Be accurate.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const text = data.content.map(b => b.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
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
  summary: "Based on your study habits, you show signs of moderate ergonomic risk. Your extended sitting and screen time are key factors to address. Small daily changes can make a huge difference.",
  top_tips: [
    "Take a 5-minute break every 45 minutes of studying",
    "Raise your screen to eye level to reduce neck strain",
    "Stay hydrated — aim for at least 2L of water daily",
  ],
};
