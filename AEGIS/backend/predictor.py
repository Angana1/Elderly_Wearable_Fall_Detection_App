"""
AEGIS — fall-detection predictor.

**This is the file you edit / replace** to plug in your own model.

Keep these two function signatures the same and the dashboard will keep
working without any other changes:

    parse_sensor_file(text: str) -> list of rows (your model's expected shape)
    run_model(rows) -> (fall_detected: int 0|1, confidence: float in 0..1)

The model file (cnn_mlp.keras) is too large to commit, so it's downloaded
on first run from Google Drive and cached on disk. Override the source by
setting environment variables before launching app.py:

    AEGIS_MODEL_URL    full URL or `id=<gdrive-file-id>` (default: see below)
    AEGIS_MODEL_PATH   where to cache locally (default: model/cnn_mlp.keras)
"""

import json
import os
from pathlib import Path

# ----------------------------------------------------------------------
# 1. LOAD YOUR MODEL ONCE (at import time)
# ----------------------------------------------------------------------
from tensorflow import keras
from sklearn.preprocessing import StandardScaler
import numpy as np


# --- Model source (override via env vars if you like) ---
# Paste the Google Drive *file id* (the long token between /d/ and /view).
# Make the file "Anyone with the link — Viewer" so gdown can fetch it.
GDRIVE_FILE_ID = os.environ.get(
    "AEGIS_MODEL_GDRIVE_ID",
    "1T3sOvNnY4Oiu8ueAlsOf7iB9vGx0-e3c",  # <-- replace with your file id
)
MODEL_PATH = Path(os.environ.get("AEGIS_MODEL_PATH", "model/cnn_mlp.keras"))

SCALER_GDRIVE_ID = os.environ.get(
    "AEGIS_SCALER_GDRIVE_ID",
    "1gK0nkGewFUxt2DrX1SkFxV2HJZMfC6sL",  # <-- replace with your scaler.json file id
)
SCALER_PATH = Path(os.environ.get("AEGIS_SCALER_PATH", "model/scaler.json"))


def _ensure_file(path: Path, file_id: str, label: str) -> Path:
    """Download a file from Google Drive on first run, then cache it."""
    if path.exists() and path.stat().st_size > 0:
        return path

    if not file_id or file_id.startswith("PASTE_"):
        raise RuntimeError(
            f"{label} not found at {path} and no Google Drive file id configured. "
            f"Set the corresponding GDRIVE id in predictor.py (or env var) "
            f"to the Google Drive file id of your {label}. "
            "The file must be shared as 'Anyone with the link — Viewer'."
        )

    try:
        import gdown
    except ImportError as e:
        raise RuntimeError(
            "Downloading from Google Drive requires the `gdown` package. "
            "Install it with: pip install gdown"
        ) from e

    path.parent.mkdir(parents=True, exist_ok=True)
    print(f"[AEGIS] Downloading {label} from Google Drive (id={file_id}) → {path}")
    url = f"https://drive.google.com/uc?id={file_id}"
    gdown.download(url, str(path), quiet=False)

    if not path.exists() or path.stat().st_size == 0:
        raise RuntimeError(
            f"Download finished but {path} is missing or empty. "
            "Check that the Google Drive link is set to 'Anyone with the link'."
        )
    print(f"[AEGIS] {label} cached at {path} ({path.stat().st_size / 1e6:.1f} MB)")
    return path


_model_file = _ensure_file(MODEL_PATH, GDRIVE_FILE_ID, "model")
loaded_model = keras.models.load_model(_model_file)

_scaler_file = _ensure_file(SCALER_PATH, SCALER_GDRIVE_ID, "scaler")
with open(_scaler_file) as f:
    _p = json.load(f)

scaler = StandardScaler()
scaler.mean_           = np.array(_p["mean"],  dtype=np.float64)
scaler.scale_          = np.array(_p["scale"], dtype=np.float64)
scaler.var_            = np.array(_p["var"],   dtype=np.float64)
scaler.n_features_in_  = _p["n_features_in"]
scaler.n_samples_seen_ = _p["n_samples_seen"]

MODEL = loaded_model


# ----------------------------------------------------------------------
# 2. PARSE THE UPLOADED FILE
# ----------------------------------------------------------------------
def preprocess_window(frame, scaler):
    """
    Convert a raw 2-second (400, 9) frame into the (200, 9) input the
    CNN+MLP model expects.

    Steps mirror data_processor.windowing3d + normalizer:
      1. First-difference: curr (t) - prev (t-1)
      2. StandardScaler.transform (fit during training)
    """
    frame = np.asarray(frame, dtype=np.float32)
    assert frame.shape == (400, 9), f"expected (400, 9), got {frame.shape}"

    prev = frame[:200]
    curr = frame[200:]
    diff = curr - prev

    scaled = scaler.transform(diff.reshape(-1, 9)).reshape(200, 9)
    return scaled.astype(np.float32)


def parse_sensor_file(text: str):
    """Parse a (400, 9) txt file and return the (200, 9) preprocessed array."""
    rows = []

    for line in text.splitlines():
        line = line.strip()

        if not line or line.startswith("#"):
            continue

        parts = [p for p in line.replace(",", " ").split() if p]

        try:
            rows.append([float(p) for p in parts])
        except ValueError:
            continue

    frame = np.array(rows, dtype=np.float32)
    assert frame.shape == (400, 9), f"expected (400, 9) input, got {frame.shape}"

    return preprocess_window(frame, scaler)


# ----------------------------------------------------------------------
# 3. RUN INFERENCE
# ----------------------------------------------------------------------
def run_model(rows):
    """Return (fall_detected, confidence).

    - fall_detected: int, 0 or 1
    - confidence:    float in 0.0..1.0  (the dashboard will format as %)
    """

    sample = np.asarray(rows, dtype=np.float32)
    assert sample.shape == (200, 9), f"expected (200, 9), got {sample.shape}"

    threshold = 0.5

    prob = float(loaded_model.predict(np.expand_dims(sample, axis=0))[0][0])
    label = int(prob >= threshold)
    return label, prob * 100
