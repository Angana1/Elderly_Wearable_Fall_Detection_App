# AEGIS backend integration

The dashboard's **Upload sensor data** button POSTs the selected `.txt` to your
fall-detection model.

Everything you need is in `backend/`:

```
backend/
├── app.py             — Flask server (don't edit)
├── predictor.py       — ★ edit this to load YOUR model
├── requirements.txt   — Python deps
├── models/            — put your pretrained model files here
└── README.md          — full setup + venv instructions
```

### Quick start

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate          # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Then open `index.html`, click **Upload sensor data**, and pick a `.txt` file.

See [`backend/README.md`](backend/README.md) for the full guide — virtual env
setup on macOS / Linux / Windows, where to drop your own `.py` model code, how
to point the dashboard at a non-default host, etc.

### Where to put your own model code

Edit `backend/predictor.py` — it has two functions you implement:

- `parse_sensor_file(text)` — turn the uploaded `.txt` into your model's input
- `run_model(rows)` — return `(fall_detected: 0|1, confidence: 0.0..1.0)`

You can keep your existing code as a sibling file (e.g. `backend/my_model.py`)
and `import` it from `predictor.py`. Pretrained model files go in `backend/models/`.
