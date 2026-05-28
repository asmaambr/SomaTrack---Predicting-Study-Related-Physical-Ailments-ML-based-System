from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pathlib import Path

# Lazy-loaded model objects and load status
model = None
pipeline = None
model_loaded = False
model_load_error: str | None = None


def load_model_once() -> None:
    """Attempt to load model and pipeline from common filenames. Sets globals.

    This is intentionally lazy to avoid importing compiled ML libs at module
    import time (which caused NumPy binary errors during startup).
    """
    global model, pipeline, model_loaded, model_load_error
    if model_loaded:
        return

    base = Path(__file__).resolve().parent
    candidates = [
        base / "model.pkl",
        base / "pipeline.pkl",
        base / "logistic_regression_pipeline.joblib",
        base / "model.joblib",
        base / "logistic_regression_pipeline.pkl",
        Path("model.pkl"),
        Path("pipeline.pkl"),
        Path("logistic_regression_pipeline.joblib"),
    ]

    last_err = None
    for p in candidates:
        try:
            if not p.exists():
                continue
            loaded = joblib.load(str(p))
            # Heuristic: if the loaded object looks like a pipeline (has 'predict' and 'named_steps'), treat it as the full model
            if hasattr(loaded, "predict") and (hasattr(loaded, "named_steps") or hasattr(loaded, "steps")):
                model = loaded
                pipeline = None
                model_load_error = None
                model_loaded = True
                return
            # If the file is explicitly named pipeline, set pipeline
            if p.name.lower().startswith("pipeline") or p.name.lower().startswith("logistic") and hasattr(loaded, "transform"):
                pipeline = loaded
                model_load_error = None
                # continue to try to find a model file as well
            else:
                # otherwise treat as model
                model = loaded
                model_load_error = None
            model_loaded = True
        except Exception as e:
            last_err = e
            continue

    if not model_loaded:
        model_load_error = str(last_err) if last_err is not None else "model files not found"

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# (model/pipeline/load logic moved into lazy loader `load_model_once`)

# Model metadata aligned with the serialized logistic-regression artifact
MODEL_INFO = {
    "name": "Logistic Regression",
    "description": "Serialized logistic-regression pipeline trained on the ergonomic risk dataset.",
    "why_this_model": [
        "Handles tabular data well",
        "Provides interpretable results for healthcare decisions",
        "Good performance on ergonomic health datasets",
        "Fast inference time for real-time predictions",
        "Probabilistic output enables confidence scoring",
    ],
    "source": "backend/logistic_regression_pipeline.joblib",
}

@app.get("/")
def home():
    return {"status": "ok"}

@app.get("/model-info")
def get_model_info():
    """Return information about the ML model"""
    return MODEL_INFO

@app.post("/predict")
def predict(data: dict):
    # Ensure model/pipeline are loaded (lazy)
    load_model_once()
    from fastapi import HTTPException

    if model is None and pipeline is None:
        detail = "Model or pipeline not available on server"
        if model_load_error:
            detail += f": {model_load_error}"
        raise HTTPException(status_code=503, detail=detail)

    df = pd.DataFrame([data])
    # If we have a pipeline, let it transform features first
    try:
        if pipeline is not None:
            X = pipeline.transform(df)
            pred = model.predict(X)[0]
        else:
            # If only a single pipeline/model object was saved (has predict directly), call it on df
            pred = model.predict(df)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {e}")
    # try to get probabilities, if not available provide fallback
    try:
        pred_proba = model.predict_proba(X)[0]
    except Exception:
        pred_proba = None

    response = {
        "risk_level": int(pred),
    }

    if pred_proba is not None:
        # if binary, map to low/high else include array
        if len(pred_proba) >= 2:
            response["probabilities"] = {"low": float(pred_proba[0]), "high": float(pred_proba[1])}
            response["confidence"] = float(max(pred_proba))
        else:
            response["probabilities"] = {"classes": list(map(float, pred_proba))}

    return response