"""
Script to safely acquire and verify the Employment Scam Aegean Dataset (EMSCAD).
Source: University of the Aegean / Public ML Benchmark Repository
Target File: ml/data/fake_job_postings.csv
"""
import os
import sys
import urllib.request
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
DEST_FILE = os.path.join(DATA_DIR, "fake_job_postings.csv")

PRIMARY_URL = "https://raw.githubusercontent.com/rohankokkula/Fraudulent-Job-Post-Prediction/master/fake_job_postings.csv"
FALLBACK_URL = "https://raw.githubusercontent.com/kavinmugil2006/fraud-job-detector/main/fake_job_postings.csv"

def download_file(url: str, dest_path: str) -> bool:
    logging.info("Downloading dataset from: %s", url)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) HireShieldAI/1.0"}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=60) as response, open(dest_path, "wb") as out_file:
            total_size = int(response.headers.get("Content-Length", 0))
            downloaded = 0
            block_size = 1024 * 64
            
            while True:
                chunk = response.read(block_size)
                if not chunk:
                    break
                out_file.write(chunk)
                downloaded += len(chunk)
                if total_size > 0 and downloaded % (1024 * 1024 * 5) < block_size:
                    logging.info("Progress: %.1f MB / %.1f MB (%.1f%%)",
                                 downloaded / (1024*1024), total_size / (1024*1024), (downloaded / total_size) * 100)
            
            logging.info("Download completed. Total bytes: %d", downloaded)
            return True
    except Exception as exc:
        logging.error("Failed to download from %s: %s", url, exc)
        if os.path.exists(dest_path):
            os.remove(dest_path)
        return False

def verify_dataset(file_path: str) -> bool:
    if not os.path.exists(file_path):
        return False
    size_mb = os.path.getsize(file_path) / (1024 * 1024)
    logging.info("Verified file '%s' exists (Size: %.2f MB)", file_path, size_mb)
    return size_mb > 10.0  # Real EMSCAD is ~45-50 MB

def main():
    if verify_dataset(DEST_FILE):
        logging.info("Dataset is already present and verified. Skipping download.")
        return 0

    success = download_file(PRIMARY_URL, DEST_FILE)
    if not success:
        logging.info("Attempting fallback URL...")
        success = download_file(FALLBACK_URL, DEST_FILE)

    if success and verify_dataset(DEST_FILE):
        logging.info("Dataset successfully acquired and ready for preprocessing.")
        return 0
    else:
        logging.error("Failed to acquire genuine EMSCAD dataset.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
