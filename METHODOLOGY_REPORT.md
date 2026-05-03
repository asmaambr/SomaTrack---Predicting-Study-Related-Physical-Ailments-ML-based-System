# SomaTrack: Predicting Study-Related Physical Ailments
## Technical Methodology Report
**ENSIA Machine Learning Project · Spring 2025-2026**

---

## Executive Summary

This report documents the complete machine learning workflow for **SomaTrack**, a multiclass classification system that predicts student pain-risk levels (0=No pain, 1=Mild, 2=Frequent, 3=Chronic) from study habits and ergonomic factors.

The pipeline implements best practices for imbalanced multiclass classification: stratified CV, feature engineering, feature selection via mutual information, class-balance handling via SMOTE, and comprehensive hyperparameter tuning across three candidate models (Random Forest, Logistic Regression, SVM).

---

## 1. Problem Definition

### 1.1 Context & Motivation

Prolonged sedentary study practices are a significant risk factor for musculoskeletal pain in students:
- **Back pain** — from poor posture and prolonged sitting
- **Neck strain** — from screen positioning and forward head posture
- **Headaches** — linked to stress, poor lighting, and eye strain
- **Wrist/finger discomfort** — from input device positioning

SomaTrack frames this as a **structured ML problem** so that:
1. We can quantify pain risk from behavioral and environmental signals
2. We can identify the strongest contributing factors
3. We can provide interpretable, actionable insights to support healthier study practices

### 1.2 Task Formulation

**Input (Features):** Study habits (sitting duration, breaks, caffeine use, exercise frequency) and ergonomic factors (posture, seat type, lighting, screen positioning, pre-existing conditions, workload composites)

**Output (Target):** 4-class pain severity label, extracted from survey responses
- `0` = No pain
- `1` = Mild pain
- `2` = Frequent pain
- `3` = Chronic pain

**Data Source:** Peer-collected survey responses on study habits and physical health (34 raw columns → 21 engineered features after preprocessing)

---

## 2. Data Preparation & Feature Engineering

### 2.1 Raw Data Overview

**Shape:** ~50 student responses × 34 survey questions  
**Columns:** Behavioral metrics, ergonomic setup, symptom occurrence, demographics

**Key Columns (Sample):**
- Continuous: sitting_hours, study_days, screen_hours, sleep_duration
- Categorical: study_location, seat_type, posture, back_support, stress_level
- Symptom flags: back_pain, neck_pain, headache, wrist_pain, eye_strain, finger_numb (each 0-3 scale)
- Metadata: age, gender, institution, field, year_of_study

### 2.2 Target Encoding

**Method:** Extract leading digit from survey response strings

```
Response "0 - No pain" → 0
Response "1 - Mild"    → 1
Response "2 - Frequent" → 2
Response "3 - Chronic"  → 3
```

**Class Distribution:**
- Class 0 (No pain) — minority class (~20-25%)
- Class 1 (Mild)    — largest (~35-40%)
- Class 2 (Frequent) — ~20-30%
- Class 3 (Chronic)  — minority class (~10-15%)

→ **Imbalanced dataset** — requires stratification and SMOTE

### 2.3 Feature Engineering Strategy

#### 2.3.1 Ordinal Encoding (Preserves Order)

For categorical variables with natural rank, map to ordered numeric values:

| Feature | Mapping |
|---------|---------|
| break_freq | Never=0, Rarely=1, Every 1-2h=2, Every 30-60m=3 |
| posture | Upright=0, Slightly slouched=1, Heavily slouched=2, Lying=3 |
| stress_level | Low=0, Moderate=1, High=2 |
| back_support | Yes=0, Sometimes=1, No=2 |
| caffeine_freq | Never=0 → +2/day=4 |
| sleep_duration | <5h=4.5, 5-6h=5.5, ..., >8h=8.5 |

**Rationale:** Ordinal encoding preserves rank semantics for interpretation; one-hot encoding would lose this signal.

#### 2.3.2 Binary Feature Flags

Extract presence/absence from free-text responses:

- `has_external_mouse` — 1 if student uses external mouse or keyboard+mouse combo, else 0
- `is_dim_lighting` — 1 if study lighting is "Dim", else 0
- `cond_back`, `cond_neck`, `cond_wrist`, `cond_shoulder` — parsed from pre-existing conditions text field

#### 2.3.3 One-Hot Encoding (Nominal Categories)

For unordered categorical features without natural rank:

- `study_location` → 3 binary columns: `loc_Library`, `loc_Desk (at home/dorm)`, `loc_Other`
- `seat_type` → 5 binary columns: `seat_Ergonomic...`, `seat_Wooden chair`, `seat_Sofa/couch`, `seat_Stool`, `seat_Other`

#### 2.3.4 Composite Features (Feature Engineering)

**`sitting_load`** — Total study workload (physical cumulative impact)
```
sitting_load = sitting_hours × study_days
Clipped at 112 (max ~16 hours/day × 7 days/week)
```

**`break_quality`** — Composite break pattern score
```
break_quality = break_freq + break_duration + break_movement
Range: 0–10 (aggregates three ordinal dimensions of break behavior)
```

**Rationale:** Capture cumulative physiological stress and recovery patterns

#### 2.3.5 Feature Removal

Drop raw columns replaced by engineered features (to avoid redundancy):
- Replaced by sitting_load: `sitting_hours`, `study_days`
- Replaced by break_quality: `break_freq`, `break_duration`, `break_movement`
- Demographics (for focus on behavioral/ergonomic signals): `age`, `gender`, `institution`, `field`, `year_of_study`
- Metadata: `timestamp`
- Absorbed into binary flags: `input_device`, `lighting`

### 2.4 Final Feature Set

**Count:** 21 features  
**Types:**
- Ordinal numeric (continuous-like): sitting_load, break_quality, stress_level, sleep_duration, etc.
- Binary flags: has_external_mouse, is_dim_lighting, cond_*, pre-existing conditions
- One-hot seat & location: 8 binary columns

**Data Quality:**
- Missing values: 0 (all values imputed at pipeline fit time)
- All features numeric (float dtype) — ready for sklearn

---

## 3. Data Splitting Strategy

### 3.1 Stratified Train / Test Split

**Purpose:** Create one held-out test set, preserved until final evaluation. Stratification ensures minority classes are represented proportionally.

```
Train : 80% (~40 samples)
Test  : 20% (~10 samples)
Stratify by: y (pain_level)
Random state: 42 (reproducibility)
```

**Effect:** Both train and test subsets maintain class proportions ≈ [20%, 35%, 25%, 20%]

**Rationale:** 
- Single test split preserves "one evaluation rule" — test data touched only once at final evaluation
- Stratification prevents class imbalance artifacts in train-test distribution
- Fixed seed ensures reproducibility across runs

---

## 4. Pipeline Architecture

### 4.1 ImbPipeline Design

The workflow uses `imblearn.pipeline.Pipeline` (not sklearn's standard Pipeline) because SMOTE must execute within each fold during cross-validation (not globally on training data).

```
ImbPipeline
│
├── [1] imputer   → SimpleImputer(strategy="median")
│                   Fit on fold training data; impute fold test/train
│
├── [2] scaler    → StandardScaler()
│                   Fit on fold training data; scale fold test/train
│
├── [3] selector  → SelectKBest(score_func=mutual_info_classif, k=?)
│                   Fit on fold training data; select k features
│
├── [4] smote     → BorderlineSMOTE(kind="borderline-1", k_neighbors=3)
│                   OPTIONAL — resample fold training data only
│                   (test and validation data never resampled)
│
└── [5] clf       → RandomForestClassifier | LogisticRegression | SVC
                    Fit on resampled fold training data; predict on fold test
```

### 4.2 Preprocessing Rationale

**Imputation:** Median strategy is robust to outliers; fit on training data only to prevent test leakage

**Scaling:** Standardization (zero mean, unit variance) required for:
- Feature selection (mutual information is scale-invariant, but consistent scaling aids interpretation)
- SVM (RBF kernel is distance-sensitive)
- Logistic Regression (coefficient magnitudes)

**Feature Selection:** SelectKBest with mutual_info_classif (multiclass-friendly, detects non-linear associations)

**SMOTE:** BorderlineSMOTE with `kind="borderline-1"` + `k_neighbors=3`
- Why BorderlineSMOTE: Focuses on borderline minority samples, avoiding synthetic noise
- Why k_neighbors=3: Conservative neighbor count; dataset has small minority classes, limiting neighborhood size prevents unreliable extrapolation

### 4.3 Candidate Models

| Model | Hyperparameters | Rationale |
|-------|-----------------|-----------|
| **Random Forest** | n_estimators=200, max_depth ∈ [None, 4–12], min_samples_leaf ∈ [1–8], class_weight="balanced" | Tree ensemble, robust to imbalance, feature importance interpretability |
| **Logistic Regression** | C ∈ [0.01, 0.1, 1, 10, 100], max_iter=1000, class_weight="balanced" | Linear, fast, provides class probabilities |
| **SVM (RBF)** | C ∈ [0.1, 1, 10, 100], γ ∈ ["scale", "auto", 0.01, 0.1], kernel="rbf" | Non-linear decision boundary, margin maximization |

---

## 5. Baseline Cross-Validation (Section 5)

### 5.1 Evaluation Protocol

**Method:** Stratified 5-Fold Cross-Validation  
**Splits:** 5 random stratified folds  
**Metrics:** F1-macro, F1-weighted, Accuracy  
**Train scores:** Returned to detect overfitting (train vs. validation gap)

### 5.2 Baseline Results Logic

Establish **untuned baseline** for all three models:
- Same preprocessing (impute, scale, select k=20, SMOTE)
- Default hyperparameters (except class weights)
- Measure CV performance + test-set predictions

**Output:** Ranking by CV F1-macro scores

**F1-macro vs. F1-weighted:**
- F1-macro — unweighted average across classes (emphasizes minority class performance)
- F1-weighted — class-frequency weighted (reflects dataset imbalance)
- **We prioritize F1-macro** — ensures minority pain classes are well-predicted

---

## 6. Hyperparameter Tuning (Section 6)

### 6.1 Tuning Strategy

**Method:** RandomizedSearchCV with 30 iterations per model  
**Folds:** 5-fold stratified CV within search  
**Objective:** Maximize F1-macro score  
**Configuration:** n_jobs=-1 (parallel), random_state=42 (reproducibility)

### 6.2 Search Spaces

#### Random Forest
```
selector__k           : randint(10, max_k+1)   — feature count
clf__max_depth        : [None, 4, 6, 8, 10, 12]
clf__min_samples_leaf : randint(1, 8)
```

#### Logistic Regression
```
selector__k : randint(10, max_k+1)
clf__C      : [0.01, 0.1, 1, 10, 100]
```

#### SVM (RBF)
```
selector__k : randint(10, max_k+1)
clf__C      : [0.1, 1, 10, 100]
clf__gamma  : ["scale", "auto", 0.01, 0.1]
```

### 6.3 Feature Selection within Tuning

**Estimated max_k:** Count non-zero mutual information features on training data
- Mutual information measures dependency between feature and target
- Features with MI=0 → no predictive signal

**Result:** max_k ≈ 18 (18 features with non-zero MI)  
**Search range:** k ∈ [10, 19] per model

### 6.4 Best Model Selection

After RandomizedSearchCV:
1. Extract best_score (CV F1-macro) and best_params for each model
2. Rank all three by CV F1-macro
3. **Winner:** Model with highest CV F1-macro → becomes `best_pipeline`

---

## 7. Final Evaluation on Test Set (Section 7)

### 7.1 Protocol

- **Data:** X_test, y_test (held-out, never touched until now)
- **Pipeline:** best_pipeline (tuned winner from Section 6)
- **Predictions:** y_pred = best_pipeline.predict(X_test)
- **Metrics:** Classification report (per-class precision, recall, F1), confusion matrix

### 7.2 Interpretation

Classification report shows:
- **Precision** — of predicted pain cases, how many are actually that class
- **Recall** — of actual pain cases, how many did we predict correctly
- **F1** — harmonic mean (balances precision-recall tradeoff)
- **Support** — number of test samples per class

Confusion matrix reveals:
- True positives (diagonal)
- False positives/negatives (off-diagonal)
- Which classes are confused with others (e.g., Mild misclassified as Frequent)

---

## 8. Train vs. Test Comparison (Section 8)

### 8.1 Purpose

Quantify generalization by comparing metrics on real training data (post-fit) vs. held-out test data.

**Train metrics:** Predictions on X_train (data model was optimized on)  
**Test metrics:** Predictions on X_test (unseen held-out data)

### 8.2 Gap Interpretation

| Gap (Train − Test) | Verdict | Action |
|-------------------|---------|--------|
| < 0.07 | ✓ Good generalization | Deploy with confidence |
| 0.07–0.15 | ~ Moderate | Monitor on larger dataset |
| > 0.15 | ⚠ Overfitting | Increase regularization / collect more data |

**Key metric:** F1-macro gap (prioritizes minority class generalization)

---

## 9. SMOTE vs. No-SMOTE Comparison (Section 9, Bonus)

### 9.1 Motivation

Isolate SMOTE's effect on model performance while controlling for other variables.

### 9.2 Protocol

Hold fixed:
- Tuned classifier (from Section 6 winner)
- Tuned feature count k (best_k from best hyperparameters)
- Cross-validation folds (same stratified 5-fold)

Vary:
- SMOTE presence (on/off)

### 9.3 Metrics Tracked

For each condition, report:
- **Validation metrics** (CV F1-macro/weighted/accuracy, mean ± std)
- **Train metrics** (to detect overfitting within SMOTE)
- **Test metrics** (held-out test set predictions)
- **Train-validation gap** (indicator of overfitting)

### 9.4 Interpretation Logic

**Verdict Matrix:**
| Condition | Interpretation |
|-----------|-----------------|
| SMOTE val F1 > No-SMOTE val F1 & gap ≤ No-SMOTE gap + 0.05 | ✓ SMOTE improves minority learning without overfitting |
| SMOTE val F1 > No-SMOTE val F1 & gap > No-SMOTE gap + 0.05 | ~ Improvement but increased overfitting; tune k_neighbors |
| SMOTE val F1 ≤ No-SMOTE val F1 | ✗ SMOTE unhelpful; dataset too small for reliable interpolation |

---

## 10. Feature Selection Interpretation (Section 7.1)

### 10.1 SelectKBest Behavior

**Algorithm:** Ranks all features by mutual information score, selects top k

**Key insight:** When k > # non-zero MI features, SelectKBest includes zero-score features to reach k.

**Example:** If max_k=18 but search picks k=21:
- Top 18 features have MI > 0
- Bottom 3 slots filled by zero-MI features (in column order)

### 10.2 Zero-Score Features

**Cause:** No detectable association with target on training data

**Example features with zero MI:**
- `seat_Sofa/couch` — sitting surface not predictive in this dataset
- `break_quality` — break patterns don't correlate with pain level
- `ergonomic_risk` (composite) — doesn't discriminate pain classes

**Impact:** Zero-score features add no signal, don't harm model (ignored by classifier), but clutter feature importance narratives.

**Resolution:** Report non-zero features separately for clarity.

---

## 11. Key Design Decisions & Rationales

| Decision | Rationale |
|----------|-----------|
| **Stratified CV + stratified train/test** | Preserve class proportions; prevent imbalance artifacts |
| **SelectKBest + mutual_info_classif** | Multiclass-friendly feature selection; detects non-linear associations |
| **SMOTE with k_neighbors=3** | Conservative oversampling for small minority classes |
| **ImbPipeline (not sklearn.Pipeline)** | SMOTE must execute within CV folds, not globally |
| **F1-macro as primary metric** | Emphasizes minority class recall; balanced approach to imbalance |
| **RandomizedSearchCV (not GridSearchCV)** | Scales to large hyperparameter spaces; computational efficiency |
| **30 iterations per model** | Balance between exploration and computational cost |
| **Random state=42 everywhere** | Full reproducibility across all stochastic components |

---

## 12. Potential Limitations & Future Work

### 12.1 Dataset Limitations
- **Small sample size** (~50 responses) — limits generalization
- **Class imbalance** — minority classes underrepresented
- **Survey data** — subject to response bias and self-reporting error

### 12.2 Model Limitations
- **4-class problem** — potentially too fine-grained (consider 2–3 class collapse)
- **Linear relationships assumed** — ordinal encoding assumes feature-target monotonicity
- **Single test split** — no cross-test-set variance estimate

### 12.3 Future Enhancements
1. Collect more data (aim for 200+ responses)
2. Explore semi-supervised learning or active learning
3. Incorporate domain expertise (e.g., pain physiologists) to engineer features
4. Test feature interactions (e.g., sitting_load × break_quality)
5. Deploy model with confidence intervals for practical deployment

---

## 13. Reproducibility Checklist

✓ Fixed random seed (SEED=42)  
✓ Stratified splits (stratify=y)  
✓ Stratified cross-validation folds  
✓ All pipeline steps documented  
✓ Hyperparameter ranges specified  
✓ Model selection criterion stated (F1-macro)  
✓ Test set evaluation isolated  

**To reproduce:** Run notebook cells in order; all randomness is seeded.

---

## 14. Summary Table

| Component | Value |
|-----------|-------|
| **Data source** | Survey responses (34 columns) |
| **Sample size** | ~50 students |
| **Features after engineering** | 21 |
| **Target** | 4-class pain level (0, 1, 2, 3) |
| **Train / test split** | 80 / 20 stratified |
| **CV protocol** | 5-fold stratified |
| **Feature selection** | SelectKBest (mutual info), k ∈ [10, 19] |
| **SMOTE** | BorderlineSMOTE, k_neighbors=3 |
| **Models tuned** | Random Forest, Logistic Regression, SVM (RBF) |
| **Tuning method** | RandomizedSearchCV, 30 iterations |
| **Primary metric** | F1-macro |
| **Best model** | [Determined by CV ranking] |
| **Test evaluation** | Classification report + confusion matrix |

---

## Conclusion

SomaTrack implements a **rigorous, reproducible machine learning workflow** for multiclass pain prediction from study habits.

**Strengths:**
- Proper stratification and held-out test evaluation
- Feature engineering grounded in domain knowledge
- SMOTE handles class imbalance within CV folds (prevents leakage)
- Systematic hyperparameter tuning across multiple models
- Clear metric hierarchy (F1-macro for minority class focus)

**Next Steps:**
1. Present findings to domain experts for validation
2. Collect larger dataset to improve generalization
3. Deploy with interpretability framework (feature importance, SHAP values)
4. Develop student intervention recommendations based on feature importance

---

*Report generated: ENSIA ML Project, Spring 2025-2026*  
*Notebook: SomaTrack_Pipeline (3).ipynb*
