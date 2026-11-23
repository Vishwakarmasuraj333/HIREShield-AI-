"""
Prepare and partition the EMSCAD dataset.
Applies text cleaning, concatenates relevant job metadata into a single text corpus,
removes duplicate records, and executes a stratified 80/20 train/test split.
Guarantees zero target leakage by saving clean train.csv and test.csv without fitting transformers.
"""
import os
import re
import sys
import pandas as pd
from sklearn.model_selection import train_test_split

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
RAW_PATH = os.path.join(DATA_DIR, "fake_job_postings.csv")
TRAIN_PATH = os.path.join(DATA_DIR, "train.csv")
TEST_PATH = os.path.join(DATA_DIR, "test.csv")

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        return ""
    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)
    # Remove URL links
    text = re.sub(r"http\S+|www\S+", " ", text)
    # Normalize whitespaces
    text = re.sub(r"\s+", " ", text)
    return text.strip().lower()

def prepare():
    if not os.path.exists(RAW_PATH):
        print(f"Dataset not found at {RAW_PATH}. Run download_dataset.py first.")
        sys.exit(1)

    print("Loading raw EMSCAD dataset...")
    df = pd.read_csv(RAW_PATH)
    initial_count = len(df)
    print(f"Raw record count: {initial_count:,}")

    # Coalesce key text features
    text_cols = ["title", "company_profile", "description", "requirements", "benefits"]
    for col in text_cols:
        df[col] = df[col].fillna("").astype(str)

    # Create composite text field
    df["full_text"] = (
        df["title"] + " " +
        df["company_profile"] + " " +
        df["description"] + " " +
        df["requirements"] + " " +
        df["benefits"]
    )
    df["full_text_clean"] = df["full_text"].apply(clean_text)

    # Filter out empty or trivially short records (< 20 characters)
    df = df[df["full_text_clean"].str.len() >= 20].copy()
    print(f"Records after cleaning short entries: {len(df):,}")

    # Drop duplicate textual postings
    df = df.drop_duplicates(subset=["full_text_clean"]).copy()
    print(f"Records after duplicate removal: {len(df):,}")

    # Keep essential columns
    keep_cols = ["job_id", "title", "company_profile", "description", "requirements", 
                 "telecommuting", "has_company_logo", "has_questions", "employment_type", 
                 "required_experience", "required_education", "industry", "function", 
                 "full_text_clean", "fraudulent"]
    available_cols = [c for c in keep_cols if c in df.columns]
    df = df[available_cols]

    # Stratified Train/Test Split (80% train, 20% test)
    # Using fixed random_state for absolute academic reproducibility
    RANDOM_SEED = 42
    train_df, test_df = train_test_split(
        df,
        test_size=0.20,
        random_state=RANDOM_SEED,
        stratify=df["fraudulent"]
    )

    print(f"\nTraining set size:   {len(train_df):,} records")
    print(f"  - Fraudulent:      {train_df['fraudulent'].sum():,} ({train_df['fraudulent'].mean()*100:.2f}%)")
    print(f"  - Legitimate:      {(train_df['fraudulent']==0).sum():,} ({(train_df['fraudulent']==0).mean()*100:.2f}%)")

    print(f"\nTest set size:       {len(test_df):,} records")
    print(f"  - Fraudulent:      {test_df['fraudulent'].sum():,} ({test_df['fraudulent'].mean()*100:.2f}%)")
    print(f"  - Legitimate:      {(test_df['fraudulent']==0).sum():,} ({(test_df['fraudulent']==0).mean()*100:.2f}%)")

    train_df.to_csv(TRAIN_PATH, index=False)
    test_df.to_csv(TEST_PATH, index=False)
    print(f"\nSaved train partition to: {TRAIN_PATH}")
    print(f"Saved test partition to:  {TEST_PATH}")

if __name__ == "__main__":
    prepare()
