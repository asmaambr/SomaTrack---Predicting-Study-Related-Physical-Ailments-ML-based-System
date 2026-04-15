# SomaTrack Predicting-Study-Related-Physical-Ailments-ML-based-System

## Overview

SomaTrack is a machine learning system designed to predict the risk level of study-related physical discomfort based on behavioral and environmental patterns.

It models the relationship between daily study habits and the likelihood of experiencing issues such as back pain, neck strain, and headaches.

The system is built as a multiclass classification model that estimates risk levels from user-provided inputs.

 

## Problem Definition

Prolonged study sessions, sedentary behavior, and suboptimal ergonomic conditions can contribute to physical discomfort over time.

SomaTrack addresses this by learning patterns that correlate study behaviors with reported physical strain levels, enabling predictive assessment of risk.

 

## Input Features

The model uses structured inputs describing study habits and environment.

### Numerical Inputs
- Daily sitting duration (hours)
- Continuous study duration without breaks
- Daily screen time (hours)
- Water intake (liters)

### Categorical Inputs
- Primary study environment (desk, bed, library, café)
- Seating type (ergonomic chair, stool, plastic chair, bed)
- Input device usage (mouse/keyboard vs trackpad)

 

## Output

The system predicts a **risk level of physical discomfort**:

- 0 → No Risk
- 1 → Low Risk
- 2 → Moderate Risk
- 3 → High Risk

 

## Methodology

SomaTrack follows a standard supervised learning pipeline:

- Data preprocessing and feature encoding
- Exploratory data analysis
- Feature selection and engineering
- Training of multiple classification models
- Model evaluation using classification metrics
- Selection of the best-performing model

 

## Model Output Use Case

Given a set of study habits, the system outputs a predicted risk level.

Example:

**Input:**
- Study duration: 6 hours/day  
- Study location: Bed  
- Device: Trackpad only  

**Output:**
- Predicted Risk: High (Level 3)

 

## Evaluation Strategy

Model performance is assessed using:

- Precision
- Recall
- F1-score (per class)
- Macro-averaged F1-score
- Cross-validation for robustness

 

## Technologies

- Python
- NumPy
- Pandas
- Scikit-learn
- Matplotlib
- Seaborn

 

## Notes

SomaTrack is a data-driven predictive system. Its outputs are probabilistic estimates based on observed behavioral patterns and should not be interpreted as medical diagnosis.

 
