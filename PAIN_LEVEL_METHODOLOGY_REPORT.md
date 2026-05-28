# SomaTrack: Predicting Study-Related Physical Ailments — Methodology Report

**ENSIA Machine Learning Project · Spring 2025-2026**

---

## Executive summary

SomaTrack is a reproducible ML pipeline that predicts student pain-severity levels (0=No pain, 1=Mild, 2=Frequent, 3=Chronic) from survey responses about study habits and ergonomic/environmental factors. The pipeline implements careful preprocessing, feature engineering, fold-aware oversampling (SMOTE), SelectKBest feature selection, and randomized hyperparameter search across multiple classifiers. The primary evaluation metric is F1-macro to emphasize minority-class performance.

This report documents the dataset, preprocessing, modeling choices, experiments (including a SMOTE ablation), artifacts produced, main findings, limitations, and reproduction steps. The authoritative implementation is the notebook `SomaTrack_Pain_Level_Pipeline.ipynb` in this repository.

---

## Data

- Source: Peer-collected survey responses (two CSV exports included in `data/`).
- Approximate size: ~50 responses × 34 raw columns (after cleaning, the working dataset has 21 engineered features).
- Targets:
  - Primary: 4-class pain severity label (0..3).
  - Additional: per-symptom labels for `PAIN_COLS = ["back_pain","neck_pain","headache","wrist_pain","eye_strain","finger_numb"]` used to train symptom-specific models.

Class balance is imbalanced across the four pain levels; stratification and resampling strategies are used accordingly.

---

## Feature engineering & preprocessing

- Ordinal encodings for naturally ordered categories (e.g., `break_freq`, `posture`, `stress_level`).
- One-hot encoding for nominal categories (e.g., `study_location`, `seat_type`).
- Derived composite features:
  - `sitting_load = sitting_hours * study_days` (clipped to realistic max)
  - `break_quality` — aggregated break frequency/duration/movement score
- Binary flags extracted from text fields (e.g., `has_external_mouse`, `is_dim_lighting`).
- Redundant raw columns removed after engineering (demographics and replaced raw fields).
- Missing values are handled inside the pipeline using `SimpleImputer(strategy="median")`.

All features passed to models are numeric; scaling is applied using `StandardScaler` inside the pipeline.

---

## Pipeline architecture

The notebook implements an `imblearn.pipeline.Pipeline` so that resampling (SMOTE) occurs only on training folds during cross-validation (prevents leakage). The canonical pipeline steps are:

1. `SimpleImputer(strategy='median')`
2. `StandardScaler()`
3. `SelectKBest(score_func=mutual_info_classif, k=...)`
4. Optional `BorderlineSMOTE(kind='borderline-1', k_neighbors=3)` (when enabled)
5. Classifier (tuned RandomForest / LogisticRegression / SVC)

Key choices and rationale:
- `SelectKBest(mutual_info_classif)` detects non-linear associations and is multiclass-capable.
- `BorderlineSMOTE` was chosen to synthesize minority samples near decision boundaries, with `k_neighbors=3` as a conservative neighbor count for a small dataset.
- `imblearn.pipeline.Pipeline` ensures SMOTE is applied inside CV folds, not before splitting.

Random seed `SEED = 42` is fixed throughout to ensure reproducibility.

---

## Models & hyperparameter search

- Candidate estimators: Random Forest, Logistic Regression, SVM (RBF).
- Hyperparameter search: `RandomizedSearchCV(n_iter=30, scoring='f1_macro', cv=StratifiedKFold(5), n_jobs=-1, random_state=42)`.
- `selector__k` (number of features to keep) is searched jointly with classifier hyperparameters.
- The selection criterion for the final model is cross-validated `f1_macro`.

The notebook extracts the best pipeline (named `somaTrack_final_model.joblib`) after tuning and uses it for final test evaluation.

---

## Experiments performed

1. Full pipeline tuning and final test evaluation (train/test split is stratified 80/20).
2. SMOTE ablation: compare tuned pipeline with and without `BorderlineSMOTE` while keeping other components identical (same `selector__k`, classifier, and CV folds).
   - Observed (notebook run):
     - With SMOTE: Validation F1-macro ≈ 0.323, Train F1-macro ≈ 0.754, Train−Val gap ≈ 0.431
     - Without SMOTE: Validation F1-macro ≈ 0.325, Train F1-macro ≈ 0.826, Train−Val gap ≈ 0.501
   - Interpretation: SMOTE produced a small change in validation F1 but reduced the train-validation generalization gap, indicating slightly better regularization for minority classes at the cost of similar validation performance on this small dataset.
3. Symptom-specific models: using the tuned pipeline structure, separate models were trained per symptom in `PAIN_COLS` by rebuilding symptom labels from the raw responses and excluding symptom columns from the feature set to avoid leakage. These models were saved as `pain_type_models.joblib`.

---

## Key findings & interpretation

- Primary metric: `F1-macro` — prioritizes balanced performance across classes.
- The tuned pipeline achieves modest validation/test F1-macro given the small sample size; results should be considered exploratory.
- SMOTE did not improve validation F1-macro substantially but reduced the train-vs-val gap, suggesting it may help reduce overfitting to majority classes on this dataset.
- Per-symptom models can be trained effectively by rebuilding labels from raw input and reusing the tuned preprocessing and classifier pipeline; this avoids leakage from symptom columns.

Practical recommendation: prefer the tuned pipeline without trusting small absolute F1 differences; collect more data before drawing strong deployment conclusions. For an interpretability-first delivery, produce SHAP or permutation importance analyses limited to the stable top features reported by `SelectKBest`.

---

## Artifacts

All artifacts created by the notebook are stored in `output/`:

- `somaTrack_final_model.joblib` — final tuned pipeline for 4-class pain-level prediction
- `pain_type_models.joblib` — dictionary of per-symptom fitted pipelines
- `cleaned_data.csv` — cleaned and engineered dataset used for experiments
- `selected_features_scores.csv` — exported SelectKBest feature scores

The notebook also contains figures and classification reports saved inline (and can be exported to HTML via `nbconvert`).

---

## How to reproduce

1. (Recommended) Create and activate a virtual environment and install dependencies.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

If `requirements.txt` is not present, install the minimal set:

```bash
pip install numpy pandas scikit-learn imbalanced-learn joblib matplotlib seaborn jupyterlab
```

2. Open the notebook and run cells in order:

```bash
jupyter lab
# open SomaTrack_Pain_Level_Pipeline.ipynb and run all cells
```

3. To run headless and export to HTML (will execute cells):

```bash
jupyter nbconvert --to html --execute "SomaTrack_Pain_Level_Pipeline.ipynb" --output SomaTrack_Pain_Level_Pipeline.html
```

Notes:
- The notebook uses `SEED = 42` for reproducibility; results may still vary due to low sample size and stochastic model components.
- Ensure `data/` contains the original CSV exports referenced by the notebook.

---

## Limitations & suggested next steps

Limitations:
- Small dataset size (~50 responses) and class imbalance limit statistical power and generalization.
- Survey self-reporting introduces noise and potential bias.
- Single test split provides a single held-out estimate; consider repeated CV or nested CV for more robust error bars.

Suggested next steps:
1. Collect more labeled responses (target 200+ samples) to stabilize minority-class estimates.
2. Produce confidence intervals via paired bootstrap or repeated CV to compare SMOTE vs no-SMOTE robustly.
3. Add model interpretability (SHAP) and a small appendix with per-class confusion matrices and error analyses.
4. Create a `requirements.txt` capturing package versions used for final runs and add an automated export script to bundle `output/` and the executed notebook into a ZIP for submission.

---

*Report generated from `SomaTrack_Pain_Level_Pipeline.ipynb` (May 2026)*
