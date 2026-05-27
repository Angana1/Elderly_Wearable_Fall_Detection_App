# AEGIS backend

A minimal Flask server that bridges the AEGIS dashboard to your fall-detection model.

```
backend/
├── app.py             ← Flask server (DO NOT EDIT — already wired to the dashboard)
├── predictor.py       ← *** YOU EDIT THIS *** — load your model here, return (fall, confidence)
├── requirements.txt   ← Python deps
└── models/            ← (create this) drop your pretrained model files here
```

## Where to add your own .py file

**Recommended:** put your existing code as a sibling of `predictor.py` (e.g. `backend/my_model.py`) and `import` it from `predictor.py`. Then in `predictor.py`:

1. Load the model **once** at the top of the file
2. Implement `parse_sensor_file(text)` to turn the uploaded `.txt` into your model's input shape
3. Implement `run_model(rows)` to return `(fall_detected: 0|1, confidence: 0.0..1.0)`

Pretrained model files go in `backend/models/`. Reference them with relative paths in `predictor.py`.

You should not need to touch `app.py` — it just receives the upload, calls into `predictor.py`, and returns JSON in the shape the frontend expects.

## Set up a virtual environment

From the **project root**:

### macOS / Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Windows (PowerShell)

```powershell
cd backend
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

### Windows (cmd.exe)

```cmd
cd backend
py -3 -m venv .venv
.venv\Scripts\activate.bat
pip install --upgrade pip
pip install -r requirements.txt
```

After this, `python` and `pip` inside that shell point at the venv. To leave it later, run `deactivate`.

> Add `backend/.venv/` to your `.gitignore` — it's per-machine, not committed.

## Add your model's dependencies

Edit `backend/requirements.txt` and uncomment / add the libraries your model needs (numpy, scikit-learn, torch, etc.). Then re-run `pip install -r requirements.txt`.

## Ask AEGIS — local LLM (Ollama)

The dashboard's **Ask AEGIS** tab is now wired to a local LLM via [Ollama](https://ollama.com). One-time setup:

1. **Install Ollama** — download from https://ollama.com (macOS / Windows / Linux installer). It starts a local server at `http://localhost:11434`.
2. **Pull a small model** that fits on a laptop:

   ```bash
   ollama pull llama3.2        # ~2 GB, fast
   # or
   ollama pull qwen2.5:3b      # good with structured replies
   # or
   ollama pull phi3:mini       # MIT-licensed, ~2.3 GB
   ```

3. Make sure your Flask backend is running (`python app.py`). It exposes `/chat` and `/chat/health` which talk to Ollama for you.

In the dashboard's **Ask AEGIS** tab you'll see:

- A green **LLM connected** pill (top right of the tab) when the backend can reach Ollama
- An **Edit** button on the System prompt card — set any persona you like; it's persisted in localStorage
- A **Local model** dropdown listing whatever models you've pulled — switch live without restarting
- Falls back to the original canned answers if the backend is offline, so the demo always works

Override the LLM endpoint / default model with environment variables before launching `app.py`:

```bash
export AEGIS_OLLAMA_URL="http://localhost:11434/api/chat"
export AEGIS_OLLAMA_MODEL="qwen2.5:3b"
python app.py
```

To swap providers (llama-cpp-python, transformers, OpenAI-compatible servers like vLLM, etc.), edit just `backend/chat.py` — the `chat()` and `health()` functions are the only contract the frontend depends on.

## Run the server

With the venv active:

```bash
python app.py
```

You should see:

```
 * Running on http://127.0.0.1:5000
 * Running on http://<your-LAN-ip>:5000
```

The dashboard expects `http://localhost:5000/predict` by default.

## Verify it's running

```bash
curl http://localhost:5000/health
# → {"ok": true}
```

## Use it from the dashboard

1. Open `index.html`
2. Click **Upload sensor data** in the top bar
3. Pick a `.txt` (or `.csv`) file
4. The result pill appears immediately; if a fall is detected, the dashboard switches to **Possible fall** mode with the confidence percentage rendered under the alert

## API contract (FYI — already implemented in `app.py`)

`POST /predict` — `multipart/form-data` with field `file`

Response JSON:

```json
{
  "fall_detected": 1,
  "confidence":    0.87,
  "samples":       1280,
  "file":          "session_2026_05_24.txt"
}
```

The frontend also accepts `prediction`/`probability`/`score`/`percent` as aliases, and a `0..100` confidence range, so you have flexibility on the exact keys you return.

## Pointing the dashboard at a different host

By default the frontend hits `http://localhost:5000/predict`. Override either way:

```
index.html?backend=http://192.168.1.40:5000/predict
```

or inline:

```html
<script>window.AEGIS_BACKEND_URL = "http://192.168.1.40:5000/predict";</script>
```

## CORS

`app.py` already enables `flask-cors` with permissive defaults — fine for local development. In production, restrict allowed origins explicitly:

```python
from flask_cors import CORS
CORS(app, resources={r"/predict": {"origins": ["https://your-dashboard-host"]}})
```
