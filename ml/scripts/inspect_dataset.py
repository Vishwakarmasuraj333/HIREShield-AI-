"""
Dataset inspection script for EMSCAD (fake_job_postings.csv).
Analyzes schema, column names, missing values, class distributions, and sample data.
"""
import os
import sys
import pandas as pd

DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "fake_job_postings.csv"))

def inspect():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        sys.exit(1)

    print("=" * 60)
    print("EMSCAD DATASET INSPECTION REPORT")
    print("=" * 60)
    
    df = pd.read_csv(DATA_PATH)
    print(f"Total Rows:    {len(df):,}")
    print(f"Total Columns: {len(df.columns)}")
    print("\nColumns and Data Types:")
    for col, dtype in df.dtypes.items():
        missing = df[col].isnull().sum()
        pct = (missing / len(df)) * 100
        print(f"  - {col:<22} | {str(dtype):<10} | Missing: {missing:>6,} ({pct:>5.1f}%)")

    print("\nTarget Variable ('fraudulent') Distribution:")
    counts = df["fraudulent"].value_counts()
    percentages = df["fraudulent"].value_counts(normalize=True) * 100
    for val in [0, 1]:
        label = "0 (Legitimate)" if val == 0 else "1 (Fraudulent)"
        c = counts.get(val, 0)
        p = percentages.get(val, 0.0)
        print(f"  Class {label:<18}: {c:>6,} records ({p:>5.2f}%)")

    imbalance_ratio = counts.get(0, 1) / max(counts.get(1, 1), 1)
    print(f"\nClass Imbalance Ratio: {imbalance_ratio:.2f}:1 (Legitimate : Fraudulent)")

    print("\nSample Fraudulent Titles:")
    fraud_titles = df[df["fraudulent"] == 1]["title"].dropna().head(5)
    for i, t in enumerate(fraud_titles, 1):
        print(f"  {i}. {t}")

    print("=" * 60)

if __name__ == "__main__":
    inspect()
