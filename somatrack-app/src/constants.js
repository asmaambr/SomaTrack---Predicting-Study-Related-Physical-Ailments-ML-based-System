// ─── Palette ─────────────────────────────────────────────────────────────────
export const C = {
  butter:  "#FFF3B0",
  yellow:  "#FFD60A",
  green:   "#52B788",
  greenDk: "#2D6A4F",
  blue:    "#4CC9F0",
  blueDk:  "#1B4F72",
  peach:   "#FFB347",
  pink:    "#FF6B9D",
  bg:      "#FAFDF7",
  card:    "#FFFFFF",
  text:    "#1A2E1A",
  muted:   "#6B8F71",
};

// ─── Form Categories ──────────────────────────────────────────────────────────
export const categories = [
  {
    id: "study",
    label: "Study Habits",
    emoji: "📚",
    color: C.yellow,
    bg: "#FFFDE7",
    questions: [
      { key: "daily_studying_hours",    label: "Daily studying hours",         type: "number", unit: "hrs",  min: 0, max: 16,  placeholder: "e.g. 6" },
      { key: "study_days_per_week",     label: "Study days per week",          type: "number", unit: "days", min: 1, max: 7,   placeholder: "e.g. 5" },
      { key: "max_continuous_sitting",  label: "Max continuous sitting time",  type: "number", unit: "min",  min: 10,max: 300, placeholder: "e.g. 90" },
    ],
  },
  {
    id: "breaks",
    label: "Breaks & Hydration",
    emoji: "☕",
    color: C.green,
    bg: "#E8F5E9",
    questions: [
      { key: "takes_breaks",    label: "Do you take breaks?",   type: "select", options: ["Yes","No"] },
      { key: "break_duration",  label: "Break duration",        type: "number", unit: "min", min: 0, max: 60,   placeholder: "e.g. 10" },
      { key: "water_intake",    label: "Daily water intake",    type: "number", unit: "L",   min: 0, max: 5,    placeholder: "e.g. 2" },
      { key: "caffeine_intake", label: "Daily caffeine intake", type: "number", unit: "mg",  min: 0, max: 1000, placeholder: "e.g. 200" },
    ],
  },
  {
    id: "environment",
    label: "Study Environment",
    emoji: "🪑",
    color: C.blue,
    bg: "#E3F2FD",
    questions: [
      { key: "screen_time_hours", label: "Daily screen time",       type: "number", unit: "hrs", min: 0, max: 20, placeholder: "e.g. 8" },
      { key: "study_location",    label: "Where do you study?",     type: "select", options: ["Home","Library","Cafe","Dormitory","Classroom"] },
      { key: "seat_type",         label: "Seat type",               type: "select", options: ["Ergonomic Chair","Regular Chair","Sofa/Couch","Floor","Bed","Standing Desk"] },
      { key: "input_method",      label: "Primary input method",    type: "select", options: ["Laptop Keyboard","External Keyboard","Tablet/Stylus","Phone"] },
    ],
  },
  {
    id: "posture",
    label: "Posture & Setup",
    emoji: "🧍",
    color: C.peach,
    bg: "#FFF3E0",
    questions: [
      { key: "posture",             label: "Your typical posture",    type: "select", options: ["Upright","Slightly Slouched","Severely Slouched","Reclined"] },
      { key: "screen_eye_level",    label: "Screen at eye level?",    type: "select", options: ["Yes","No"] },
      { key: "lighting_conditions", label: "Lighting conditions",     type: "select", options: ["Natural Light","Artificial Light","Dim","Mixed"] },
      { key: "backpack_weight",     label: "Daily backpack weight",   type: "number", unit: "kg", min: 0, max: 20, placeholder: "e.g. 5" },
    ],
  },
  {
    id: "health",
    label: "Health & Lifestyle",
    emoji: "❤️",
    color: C.pink,
    bg: "#FCE4EC",
    questions: [
      { key: "preexisting_condition", label: "Any preexisting condition?", type: "select", options: ["None","Back Pain","Neck Pain","Wrist Issues","Eye Problems","Other"] },
      { key: "exercise_frequency",    label: "Exercise frequency",         type: "select", options: ["Never","1-2x/week","3-4x/week","5+x/week","Daily"] },
      { key: "sleep_duration",        label: "Average sleep duration",     type: "number", unit: "hrs", min: 2, max: 12, placeholder: "e.g. 7" },
    ],
  },
];

// ─── Loading Messages ─────────────────────────────────────────────────────────
export const loadingMessages = [
  "🔍 Scanning your study habits...",
  "🧠 Analyzing posture patterns...",
  "💧 Checking hydration impact...",
  "📊 Running pain risk models...",
  "🩺 Reviewing environmental factors...",
  "✨ Calculating your personalized results...",
];
