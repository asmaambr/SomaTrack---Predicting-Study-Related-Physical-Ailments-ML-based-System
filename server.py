from __future__ import annotations

import warnings
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

warnings.filterwarnings("ignore")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT_DIR = Path(__file__).resolve().parent
MODELS_DIR = ROOT_DIR / "models"

FINAL_MODEL_PATH = MODELS_DIR / "somaTrack_final_model.joblib"
TARGET_MODEL_PATHS = {
    "back": MODELS_DIR / "4target_back_logistic_regression.joblib",
    "neck": MODELS_DIR / "4target_neck_logistic_regression.joblib",
    "headache": MODELS_DIR / "4target_headache_random_forest.joblib",
    "eyestrain": MODELS_DIR / "4target_eyestrain_logistic_regression.joblib",
}

FINAL_MODEL = joblib.load(FINAL_MODEL_PATH)
TARGET_MODELS = {name: joblib.load(path) for name, path in TARGET_MODEL_PATHS.items()}

FEATURE_COLUMNS = list(FINAL_MODEL.named_steps["imputer"].feature_names_in_)
TARGET_FEATURE_COLUMNS = list(TARGET_MODELS["back"].named_steps["preprocess"].feature_names_in_)


def normalize_text(value: Any) -> str:
    return str(value if value is not None else "").strip().lower().replace("’", "'").replace("–", "-").replace("—", "-")


def to_float(value: Any, default: float = 0.0) -> float:
    try:
        if value in (None, ""):
            return default
        return float(str(value).replace(",", "."))
    except Exception:
        return default


def one_hot(prefix: str, selected: str, columns: list[str]) -> dict[str, int]:
    row = {column: 0 for column in columns if column.startswith(prefix)}
    if selected in row:
        row[selected] = 1
    return row


def map_location(value: Any) -> dict[str, int]:
    text = normalize_text(value)
    if text in {"home", "dormitory"}:
        selected = "loc_Desk (at home/dorm)"
    elif text == "library":
        selected = "loc_Library"
    elif text == "classroom":
        selected = "loc_Classroom"
    elif text == "cafe":
        selected = "loc_Other"
    else:
        selected = "loc_Other"
    return one_hot("loc_", selected, FEATURE_COLUMNS)


def map_seat(value: Any) -> dict[str, int]:
    text = normalize_text(value)
    if text == "ergonomic chair":
        selected = "seat_Ergonomic / office chair (with back support)"
    elif text == "regular chair":
        selected = "seat_Plastic chair (standard)"
    elif text == "sofa/couch":
        selected = "seat_Sofa / couch"
    elif text in {"floor", "bed"}:
        selected = "seat_Bed / floor (no chair)"
    elif text == "standing desk":
        selected = "seat_Other"
    else:
        selected = "seat_Other"
    return one_hot("seat_", selected, FEATURE_COLUMNS)


def map_back_support(value: Any) -> int:
    text = normalize_text(value)
    if text == "ergonomic chair":
        return 0
    if text == "regular chair":
        return 1
    if text in {"sofa/couch", "floor", "bed"}:
        return 2
    return 0


def map_input_method(value: Any) -> int:
    text = normalize_text(value)
    return 1 if text == "external keyboard" else 0


def map_posture(value: Any) -> int:
    text = normalize_text(value)
    if text == "upright":
        return 0
    if text == "slightly slouched":
        return 1
    if text == "severely slouched":
        return 2
    if text == "reclined":
        return 3
    return 1


def map_screen_eye_level(value: Any) -> int:
    return 0 if normalize_text(value) == "yes" else 2


def map_exercise_frequency(value: Any) -> int:
    text = normalize_text(value)
    if text == "never":
        return 0
    if text == "1-2x/week":
        return 1
    if text == "3-4x/week":
        return 2
    return 3


def map_sleep_duration(value: Any) -> float:
    hours = to_float(value, default=7.0)
    if hours < 5:
        return 4.5
    if hours < 6:
        return 5.5
    if hours < 7:
        return 6.5
    if hours < 8:
        return 7.5
    return 8.5


def map_backpack_weight(value: Any) -> int:
    weight = to_float(value, default=0.0)
    if weight <= 0:
        return 0
    if weight < 3:
        return 1
    if weight < 5:
        return 2
    if weight < 8:
        return 3
    return 4


def map_caffeine_frequency(value: Any) -> float:
    mg = to_float(value, default=0.0)
    if mg <= 0:
        return 0.0
    if mg < 100:
        return 1.0
    if mg < 200:
        return 2.0
    if mg < 350:
        return 3.0
    return 4.0


def map_stress_level(form: dict[str, Any]) -> int:
    score = 0
    daily_hours = to_float(form.get("daily_studying_hours"))
    sitting = to_float(form.get("max_continuous_sitting"))
    sleep = to_float(form.get("sleep_duration"))
    caffeine = to_float(form.get("caffeine_intake"))
    exercise = normalize_text(form.get("exercise_frequency"))

    if daily_hours >= 6:
        score += 1
    if sitting >= 90:
        score += 1
    if sleep < 6.5:
        score += 1
    if caffeine >= 200:
        score += 1
    if exercise in {"never", "1-2x/week"}:
        score += 1

    if score <= 1:
        return 0
    if score <= 3:
        return 1
    return 2


def map_break_quality(form: dict[str, Any]) -> float:
    takes_breaks = normalize_text(form.get("takes_breaks")) == "yes"
    duration = to_float(form.get("break_duration"), default=0.0)

    break_freq = 0
    if takes_breaks:
        if duration < 5:
            break_freq = 1
        elif duration < 15:
            break_freq = 2
        else:
            break_freq = 3

    if not takes_breaks:
        duration_score = 0
        movement_score = 0
    elif duration < 5:
        duration_score = 1
        movement_score = 1
    elif duration < 10:
        duration_score = 2
        movement_score = 2
    elif duration < 30:
        duration_score = 3
        movement_score = 3
    else:
        duration_score = 4
        movement_score = 3

    return float(break_freq + duration_score + movement_score)


def map_condition_flags(value: Any) -> dict[str, int]:
    text = normalize_text(value)
    return {
        "cond_back": int("back" in text),
        "cond_neck": int("neck" in text),
        "cond_wrist": int("wrist" in text),
        "cond_shoulder": int("shoulder" in text),
    }


def map_break_frequency_label(form: dict[str, Any]) -> str:
    takes_breaks = normalize_text(form.get("takes_breaks")) == "yes"
    daily_hours = to_float(form.get("daily_studying_hours"), default=0.0)
    duration = to_float(form.get("break_duration"), default=0.0)

    if not takes_breaks:
        return "Never"
    if duration >= 20 or daily_hours <= 3:
        return "Every 30-60 minutes"
    if duration >= 10:
        return "Every 1-2 hours"
    return "Rarely"


def map_break_duration_label(value: Any) -> str:
    duration = to_float(value, default=0.0)
    if duration <= 0:
        return "I don't take breaks"
    if duration < 5:
        return "Less than 5 minutes"
    if duration < 10:
        return "5 - 10 minutes"
    if duration < 30:
        return "10 - 30 minutes"
    return "More than 30 minutes"


def map_break_movement_label(form: dict[str, Any]) -> str:
    takes_breaks = normalize_text(form.get("takes_breaks")) == "yes"
    duration = to_float(form.get("break_duration"), default=0.0)

    if not takes_breaks:
        return "I don't take breaks"
    if duration < 5:
        return "Sometimes"
    if duration < 15:
        return "Yes, I walk or move around or just lie down on a bed or sofa"
    return "Yes, I walk or move around or just lie down on a bed or sofa"


def map_water_label(value: Any) -> str:
    liters = to_float(value, default=0.0)
    if liters < 1:
        return "Less than 1L"
    if liters < 1.5:
        return "1-1.5L"
    if liters < 2:
        return "1.5-2L"
    return "More than 2L"


def map_caffeine_label(value: Any) -> str:
    mg = to_float(value, default=0.0)
    if mg <= 0:
        return "Never"
    if mg < 100:
        return "1–2 times per week"
    if mg < 200:
        return "3–5 times per week"
    if mg < 350:
        return "1 drink per day"
    return "+2 drinks per day"


def map_stress_label(form: dict[str, Any]) -> str:
    stress = map_stress_level(form)
    return {0: "Low", 1: "Moderate", 2: "High"}[stress]


def map_location_label(value: Any) -> str:
    text = normalize_text(value)
    if text in {"home", "dormitory"}:
        return "Desk (at home/dorm)"
    if text == "library":
        return "Library"
    if text == "classroom":
        return "Classroom"
    return "Other"


def map_seat_label(value: Any) -> str:
    text = normalize_text(value)
    if text == "ergonomic chair":
        return "Ergonomic / office chair (with back support)"
    if text == "regular chair":
        return "Plastic chair (standard)"
    if text == "sofa/couch":
        return "Sofa / couch"
    if text in {"floor", "bed"}:
        return "Bed / floor (no chair)"
    if text == "standing desk":
        return "Other"
    return "Other"


def map_input_method_label(value: Any) -> str:
    text = normalize_text(value)
    if text == "external keyboard":
        return "External keyboard only"
    if text == "tablet/stylus":
        return "Laptop trackpad only"
    if text == "phone":
        return "Laptop trackpad only"
    return "Laptop trackpad only"


def map_posture_label(value: Any) -> str:
    text = normalize_text(value)
    if text == "upright":
        return "Upright / straight back"
    if text == "slightly slouched":
        return "Slightly slouched"
    if text == "severely slouched":
        return "Heavily slouched / hunched"
    if text == "reclined":
        return "Lying down"
    return "Slightly slouched"


def map_lean_back_label(value: Any) -> str:
    text = normalize_text(value)
    if text == "upright":
        return "No"
    if text == "reclined":
        return "Yes"
    if text == "slightly slouched":
        return "Sometimes"
    return "Sometimes"


def map_eye_level_label(value: Any) -> str:
    return "Yes, always" if normalize_text(value) == "yes" else "No, I look down at it most of the time"


def map_condition_label(value: Any) -> str:
    text = normalize_text(value)
    if "back" in text and "neck" in text and "wrist" in text:
        return "Yes – Neck related, Yes – Back related, Yes – Wrist/Hand related"
    if "neck" in text and "back" in text:
        return "Yes – Neck related, Yes – Back related"
    if "neck" in text and "wrist" in text:
        return "Yes – Neck related, Yes – Wrist/Hand related"
    if "back" in text and "wrist" in text:
        return "Yes – Back related, Yes – Wrist/Hand related"
    if "neck" in text:
        return "Yes – Neck related"
    if "back" in text:
        return "Yes – Back related"
    if "wrist" in text:
        return "Yes – Wrist/Hand related"
    return "No"


def map_lighting_label(value: Any) -> str:
    text = normalize_text(value)
    if text == "natural light":
        return "Natural daylight"
    if text == "artificial light":
        return "Bright artificial lighting"
    if text == "dim":
        return "Dim lighting"
    return "Mixed (natural + artificial)"


def map_exercise_label(value: Any) -> str:
    text = normalize_text(value)
    if text == "never":
        return "No"
    if text == "1-2x/week":
        return "1 – 2 times"
    if text == "3-4x/week":
        return "3 – 4 times"
    return "+5 times"


def map_sleep_label(value: Any) -> str:
    hours = to_float(value, default=7.0)
    if hours < 5:
        return "Less than 5h"
    if hours < 6:
        return "5 – 6h"
    if hours < 7:
        return "6 – 7h"
    if hours < 8:
        return "7 – 8h"
    return "More than 8h"


def map_discomfort_label(form: dict[str, Any]) -> str:
    score = map_stress_level(form)
    sitting = to_float(form.get("max_continuous_sitting"), default=0.0)
    sleep = to_float(form.get("sleep_duration"), default=7.0)

    discomfort = score
    if sitting >= 90:
        discomfort += 1
    if sleep < 6.5:
        discomfort += 1

    if discomfort <= 1:
        return "0 — No pain at all"
    if discomfort == 2:
        return "1 — Mild / occasional discomfort"
    if discomfort == 3:
        return "2 — Frequent discomfort (affects my focus)"
    return "3 — Chronic pain (affects my daily life)"


def map_gender_label() -> str:
    return "Female"


def map_institution_label() -> str:
    return "Public University"


def map_field_label() -> str:
    return "Computer Science & Artificial Intelligence"


def map_year_label() -> str:
    return "3rd year"


def build_target_feature_row(form: dict[str, Any]) -> pd.DataFrame:
    row: dict[str, Any] = {column: np.nan for column in TARGET_FEATURE_COLUMNS}

    daily_hours = to_float(form.get("daily_studying_hours"), default=0.0)
    study_days = to_float(form.get("study_days_per_week"), default=0.0)
    max_continuous_sitting = to_float(form.get("max_continuous_sitting"), default=0.0)

    row.update({
        "Q1. On average, how many hours per day do you spend studying while sitting?": daily_hours,
        "Q2. How many days do you study per week?": study_days,
        "Q3. What is the longest continuous sitting time without a break ?": max_continuous_sitting,
        "Q4. Do you take breaks while studying?": map_break_frequency_label(form),
        "Q5. How long does your break usually last ?": map_break_duration_label(form.get("break_duration")),
        "Q6. During study breaks, do you usually leave your desk?": map_break_movement_label(form),
        "Q7. How many liters of water do you drink on a typical study day?": map_water_label(form.get("water_intake")),
        "Q8. How often do you consume caffeinated or energy drinks during study periods?": map_caffeine_label(form.get("caffeine_intake")),
        "Q9. What is your average daily screen time (phone + laptop/tablet combined) in hours ?": to_float(form.get("screen_time_hours"), default=0.0),
        "Q10. How would you rate your stress level during study periods?": map_stress_label(form),
        "Q11. Where do you primarily study?": map_location_label(form.get("study_location")),
        "Q12. What type of seat do you most often use while studying?": map_seat_label(form.get("seat_type")),
        "Q13. When working on a laptop, what input method do you primarily use?": map_input_method_label(form.get("input_method")),
        "Q14. How would you describe your posture during most study sessions?": map_posture_label(form.get("posture")),
        "Q15. Do you usually lean on your back while studying?": map_lean_back_label(form.get("posture")),
        "Q16. Is your screen at eye level when you study?": map_eye_level_label(form.get("screen_eye_level")),
        "Q17. Do you have any pre-existing medical condition or past injury affecting your back, neck, shoulders, or wrists?": map_condition_label(form.get("preexisting_condition")),
        "Q18. On average, how heavy is your backpack on a typical study day?": map_backpack_weight(form.get("backpack_weight")),
        "Q19. How would you describe your usual study lighting conditions?": map_lighting_label(form.get("lighting_conditions")),
        "Q20. Do you practice physical exercise weekly?": map_exercise_label(form.get("exercise_frequency")),
        "Q21. What's your average sleep duration per night ?": map_sleep_label(form.get("sleep_duration")),
        "Q28.  Overall, what best describes your general physical discomfort level related to studying?": map_discomfort_label(form),
        "Q29. Age": 21,
        "Q30. Gender ": map_gender_label(),
        "Q31. What type of institution do you attend ?": map_institution_label(),
        "Q32. What's your main field of study ?": map_field_label(),
        "Q33. What is your current year of study?": map_year_label(),
    })

    feature_df = pd.DataFrame([row], columns=TARGET_FEATURE_COLUMNS)

    feature_df["Q1. On average, how many hours per day do you spend studying while sitting?"] = pd.to_numeric(feature_df["Q1. On average, how many hours per day do you spend studying while sitting?"], errors="coerce")
    feature_df["Q2. How many days do you study per week?"] = pd.to_numeric(feature_df["Q2. How many days do you study per week?"], errors="coerce")
    feature_df["Q3. What is the longest continuous sitting time without a break ?"] = pd.to_numeric(feature_df["Q3. What is the longest continuous sitting time without a break ?"], errors="coerce")
    feature_df["Q9. What is your average daily screen time (phone + laptop/tablet combined) in hours ?"] = pd.to_numeric(feature_df["Q9. What is your average daily screen time (phone + laptop/tablet combined) in hours ?"], errors="coerce")
    feature_df["Q18. On average, how heavy is your backpack on a typical study day?"] = pd.to_numeric(feature_df["Q18. On average, how heavy is your backpack on a typical study day?"], errors="coerce")
    feature_df["Q29. Age"] = pd.to_numeric(feature_df["Q29. Age"], errors="coerce")

    break_freq = feature_df["Q4. Do you take breaks while studying?"].astype(str).str.strip().map({"Never": 0, "Rarely": 1, "Every 1-2 hours": 2, "Every 30-60 minutes": 3}).fillna(0)
    sleep_score = feature_df["Q21. What's your average sleep duration per night ?"].astype(str).str.strip().map({"Less than 5h": 0, "5 – 6h": 1, "6 – 7h": 2, "7 – 8h": 3, "More than 8h": 4}).fillna(0)
    stress_score = feature_df["Q10. How would you rate your stress level during study periods?"].astype(str).str.strip().map({"Low": 0, "Moderate": 1, "High": 2}).fillna(0)
    posture_score = feature_df["Q14. How would you describe your posture during most study sessions?"].astype(str).str.strip().map({"Upright / straight back": 0, "Slightly slouched": 1, "Heavily slouched / hunched": 2, "Lying down": 3}).fillna(0)
    eye_score = feature_df["Q16. Is your screen at eye level when you study?"].astype(str).str.strip().map({"Yes, always": 0, "Sometimes": 1, "No, I look down at it most of the time": 2}).fillna(0)
    exercise_score = feature_df["Q20. Do you practice physical exercise weekly?"].astype(str).str.strip().map({"No": 0, "1 – 2 times": 1, "3 – 4 times": 2, "+5 times": 3}).fillna(0)
    water_score = feature_df["Q7. How many liters of water do you drink on a typical study day?"].astype(str).str.strip().map({"Less than 1L": 0, "1-1.5L": 1, "1.5-2L": 2, "More than 2L": 3}).fillna(0)
    caffeine_score = feature_df["Q8. How often do you consume caffeinated or energy drinks during study periods?"].astype(str).str.strip().map({"Never": 0, "1 drink per day": 1, "1–2 times per week": 2, "3–5 times per week": 3, "+2 drinks per day": 4}).fillna(0)
    backpack_score = feature_df["Q18. On average, how heavy is your backpack on a typical study day?"].astype(float).fillna(0)
    lighting_score = feature_df["Q19. How would you describe your usual study lighting conditions?"].astype(str).str.strip().map({"Natural daylight": 2, "Bright artificial lighting": 2, "Mixed (natural + artificial)": 1, "Dim lighting": 0}).fillna(0)
    study_bed = feature_df["Q11. Where do you primarily study?"].astype(str).str.contains("Bed|Desk (at home/dorm)", case=False, na=False, regex=True).astype(int)

    feature_df["study_intensity"] = daily_hours * study_days
    feature_df["continuous_sitting_burden"] = daily_hours * max_continuous_sitting
    feature_df["screen_exposure_load"] = daily_hours * feature_df["Q9. What is your average daily screen time (phone + laptop/tablet combined) in hours ?"]
    feature_df["sedentary_risk"] = feature_df["Q3. What is the longest continuous sitting time without a break ?"].fillna(feature_df["Q3. What is the longest continuous sitting time without a break ?"].median()) + (3 - break_freq) + (3 - exercise_score)
    feature_df["ergonomic_risk"] = (3 - posture_score) + (2 - eye_score) + feature_df["Q12. What type of seat do you most often use while studying?"].astype(str).str.contains("Bed / floor|Stool|Wooden chair|Plastic chair|Sofa", case=False, na=False).astype(int)
    feature_df["recovery_score"] = break_freq + sleep_score + exercise_score
    feature_df["lifestyle_burden"] = stress_score + (4 - sleep_score) + (3 - exercise_score)
    feature_df["hydration_caffeine_risk"] = (3 - water_score) + caffeine_score
    feature_df["posture_ergonomics_mismatch"] = (3 - posture_score) + (2 - eye_score)
    feature_df["backpack_load_risk"] = backpack_score
    feature_df["environment_support_score"] = lighting_score + study_bed
    feature_df["overall_risk_score"] = (
        0.20 * feature_df["sedentary_risk"]
        + 0.20 * feature_df["ergonomic_risk"]
        + 0.15 * feature_df["lifestyle_burden"]
        + 0.10 * feature_df["hydration_caffeine_risk"]
        + 0.10 * feature_df["posture_ergonomics_mismatch"]
        + 0.10 * feature_df["backpack_load_risk"]
        + 0.10 * (3 - feature_df["environment_support_score"])
        + 0.05 * feature_df["Q1. On average, how many hours per day do you spend studying while sitting?"].fillna(0)
        + 0.05 * feature_df["Q9. What is your average daily screen time (phone + laptop/tablet combined) in hours ?"].fillna(0)
    )

    return feature_df


def build_target_features(form: dict[str, Any]) -> pd.DataFrame:
    return build_target_feature_row(form)


def ordinal_percentage(probs: np.ndarray, classes: np.ndarray) -> int:
    classes = np.asarray(classes, dtype=float)
    if classes.size == 0:
        return 0
    max_class = float(np.max(classes)) or 1.0
    expected_class = float(np.dot(probs, classes))
    return int(np.clip(round((expected_class / max_class) * 100), 0, 100))


def estimate_wrist_pain(form: dict[str, Any], feature_row: dict[Any, Any]) -> bool:
    text = normalize_text(form.get("input_method"))
    condition = normalize_text(form.get("preexisting_condition"))
    seat = normalize_text(form.get("seat_type"))
    return (
        "wrist" in condition
        or text in {"tablet/stylus", "phone"}
        or seat in {"bed", "floor", "sofa/couch"}
        or feature_row["max_continuous_sitting"] >= 120
    )


def estimate_finger_numbness(form: dict[str, Any], feature_row: dict[Any, Any]) -> bool:
    condition = normalize_text(form.get("preexisting_condition"))
    seat = normalize_text(form.get("seat_type"))
    return (
        "wrist" in condition
        or feature_row["max_continuous_sitting"] >= 150
        or feature_row["backpack_weight"] >= 3
        or seat in {"bed", "floor"}
    )


def build_feature_row(form: dict[str, Any]) -> pd.DataFrame:
    location = map_location(form.get("study_location"))
    seat = map_seat(form.get("seat_type"))
    posture = map_posture(form.get("posture"))
    screen_eye_level = map_screen_eye_level(form.get("screen_eye_level"))
    back_support = map_back_support(form.get("seat_type"))
    exercise_freq = map_exercise_frequency(form.get("exercise_frequency"))
    sleep_duration = map_sleep_duration(form.get("sleep_duration"))
    backpack_weight = map_backpack_weight(form.get("backpack_weight"))
    caffeine_freq = map_caffeine_frequency(form.get("caffeine_intake"))
    stress_level = map_stress_level(form)
    break_quality = map_break_quality(form)

    daily_hours = to_float(form.get("daily_studying_hours"), default=0.0)
    study_days = to_float(form.get("study_days_per_week"), default=0.0)
    max_continuous_sitting = to_float(form.get("max_continuous_sitting"), default=0.0)
    water_intake = to_float(form.get("water_intake"), default=0.0)
    screen_hours = to_float(form.get("screen_time_hours"), default=0.0)

    row: dict[str, Any] = {column: 0 for column in FEATURE_COLUMNS}
    row.update({
        "max_continuous_sitting": max_continuous_sitting,
        "water_intake": water_intake,
        "caffeine_freq": caffeine_freq,
        "screen_hours": screen_hours,
        "stress_level": stress_level,
        "posture": posture,
        "back_support": back_support,
        "screen_eye_level": screen_eye_level,
        "backpack_weight": backpack_weight,
        "exercise_freq": exercise_freq,
        "sleep_duration": sleep_duration,
        "has_external_mouse": map_input_method(form.get("input_method")),
        "is_dim_lighting": int(normalize_text(form.get("lighting_conditions")) == "dim"),
        "sitting_load": daily_hours * study_days,
        "break_quality": break_quality,
    })

    row.update(map_condition_flags(form.get("preexisting_condition")))
    row.update(location)
    row.update(seat)

    return pd.DataFrame([row], columns=FEATURE_COLUMNS)


def predict_payload(form: dict[str, Any]) -> dict[str, Any]:
    target_features = build_target_features(form)
    final_features = build_feature_row(form)

    final_probs = FINAL_MODEL.predict_proba(final_features)[0]
    pain_classes = np.asarray(FINAL_MODEL.named_steps["clf"].classes_)
    predicted_pain_class = int(pain_classes[int(np.argmax(final_probs))])
    max_pain_class = float(np.max(pain_classes)) or 1.0
    pain_level = int(np.clip(round((predicted_pain_class / max_pain_class) * 10), 0, 10))
    final_severity_pct = ordinal_percentage(final_probs, pain_classes)

    symptom_specs = {
        "back": (TARGET_MODELS["back"], "back_pain", "back_pain_pct"),
        "neck": (TARGET_MODELS["neck"], "neck_strain", "neck_strain_pct"),
        "headache": (TARGET_MODELS["headache"], "tension_headaches", "tension_headaches_pct"),
        "eyestrain": (TARGET_MODELS["eyestrain"], None, "eye_strain_pct"),
    }

    symptom_data: dict[str, dict[str, Any]] = {}
    for name, (model, bool_key, pct_key) in symptom_specs.items():
        probs = model.predict_proba(target_features)[0]
        predicted_class = int(model.classes_[int(np.argmax(probs))])
        confidence_pct = int(np.clip(round(float(np.max(probs) * 100)), 0, 100))
        symptom_data[name] = {
            "pct": confidence_pct,
            "severity_pct": ordinal_percentage(probs, model.classes_),
            "confidence_pct": confidence_pct,
            "flag": predicted_class >= 2,
            "bool_key": bool_key,
            "pct_key": pct_key,
        }

    back_pct = symptom_data["back"]["severity_pct"]
    neck_pct = symptom_data["neck"]["severity_pct"]
    head_pct = symptom_data["headache"]["severity_pct"]
    eye_pct = symptom_data["eyestrain"]["severity_pct"]

    top_symptoms = sorted(
        [
            ("back pain", back_pct),
            ("neck strain", neck_pct),
            ("tension headaches", head_pct),
            ("eye strain", eye_pct),
        ],
        key=lambda item: item[1],
        reverse=True,
    )

    risk_label = "low" if pain_level <= 3 else "moderate" if pain_level <= 6 else "high"

    summary = (
        f"Your overall pain risk looks {risk_label}, with {top_symptoms[0][0]} and {top_symptoms[1][0]} standing out most. "
        "The biggest improvements should come from shortening uninterrupted study time, keeping your screen at eye level, "
        "and using more frequent movement breaks."
    )

    tips: list[str] = []
    daily_hours = to_float(form.get("daily_studying_hours"), default=0.0)
    screen_eye_level = normalize_text(form.get("screen_eye_level"))
    posture = normalize_text(form.get("posture"))
    sleep_duration = to_float(form.get("sleep_duration"), default=7.0)
    water_intake = to_float(form.get("water_intake"), default=0.0)
    caffeine = to_float(form.get("caffeine_intake"), default=0.0)
    seat_type = normalize_text(form.get("seat_type"))

    if daily_hours >= 5 or to_float(form.get("max_continuous_sitting"), default=0.0) >= 90:
        tips.append("Take a 5-minute movement break every 45-60 minutes to break up sitting time.")
    if screen_eye_level == "no" or neck_pct >= 50:
        tips.append("Raise your screen to eye level to reduce neck strain and keep your head neutral.")
    if posture != "upright" or back_pct >= 50:
        tips.append("Use a supportive seat and sit upright with your shoulders relaxed and feet flat.")
    if sleep_duration < 7:
        tips.append("Protect your sleep schedule because low sleep makes pain and fatigue harder to manage.")
    if water_intake < 1.5 or caffeine >= 200:
        tips.append("Increase hydration and trim late caffeine so headaches and tension do not build up.")
    if seat_type in {"bed", "floor", "sofa/couch"}:
        tips.append("If possible, move your study setup off the bed or floor and onto a more stable work surface.")

    if not tips:
        tips = [
            "Keep alternating focus time with short movement breaks.",
            "Check your screen height and posture before each study block.",
            "Stay hydrated and avoid long sessions without a reset.",
        ]

    top_tips = tips[:3]

    return {
        "back_pain": symptom_data["back"]["flag"],
        "neck_strain": symptom_data["neck"]["flag"],
        "tension_headaches": symptom_data["headache"]["flag"],
        "wrist_pain": estimate_wrist_pain(form, final_features.iloc[0].to_dict()),
        "eye_strain": symptom_data["eyestrain"]["flag"],
        "finger_numbness": estimate_finger_numbness(form, final_features.iloc[0].to_dict()),
        "pain_level": pain_level,
        "overall_risk_score": final_severity_pct,
        "back_pain_pct": back_pct,
        "neck_strain_pct": neck_pct,
        "tension_headaches_pct": head_pct,
        "eye_strain_pct": eye_pct,
        "back_pain_severity_pct": symptom_data["back"]["severity_pct"],
        "neck_strain_severity_pct": symptom_data["neck"]["severity_pct"],
        "tension_headaches_severity_pct": symptom_data["headache"]["severity_pct"],
        "eye_strain_severity_pct": symptom_data["eyestrain"]["severity_pct"],
        "back_pain_confidence_pct": symptom_data["back"]["confidence_pct"],
        "neck_strain_confidence_pct": symptom_data["neck"]["confidence_pct"],
        "tension_headaches_confidence_pct": symptom_data["headache"]["confidence_pct"],
        "eye_strain_confidence_pct": symptom_data["eyestrain"]["confidence_pct"],
        "summary": summary,
        "top_tips": top_tips,
    }


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/health")
async def api_health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/predict")
async def api_predict(request: Request) -> dict[str, Any]:
    payload = await request.json()
    if not isinstance(payload, dict):
        payload = {}
    return predict_payload(payload)
