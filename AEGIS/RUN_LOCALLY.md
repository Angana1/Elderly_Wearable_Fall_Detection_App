# Running AEGIS locally

You'll have **two things running side by side**:

1. **Flask backend** on `http://localhost:5000` — receives the uploaded `.txt`, runs your model, returns the result
2. **Static web server** on `http://localhost:8000` — serves the dashboard files

Both speak to each other over `localhost`, so the frontend's "Upload sensor data" button works end-to-end.

---

## 1. Get the project

Download the project repository locally. 

The folder should look like:

```
aegis/
├── index.html
├── styles/
├── src/
├── backend/
│   ├── app.py
│   ├── predictor.py
│   ├── requirements.txt
│   └── ...
└── ...
```

---

## 2. Start the backend (Terminal 1)

```bash
cd AEGIS/backend
/opt/homebrew/bin/python3.11 -m venv .venv      # or wherever your Python 3.11 lives
source .venv/bin/activate            # Windows PowerShell: .\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
curl -fsSL https://ollama.com/install.sh | sh     
ollama pull llama3.2
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

Sanity-check in any browser: `http://localhost:5000/health` → `{"ok": true}`.

On first run, the model will download from Google Drive into `backend/model/cnn_mlp.keras` — that may take a few seconds.

**Leave this terminal open.**

---

## 3. Start the static server for the dashboard (Terminal 2)

Open a **second terminal**, go to the project root (the folder containing `index.html`), and run:

```bash
cd AEGIS
python3 -m http.server 8000
```

You should see:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

---

## 4. Open the dashboard

In your browser:

```
http://localhost:8000/index.html
```

Click **"Open demo"** on the welcome screen, then **"Upload sensor data"** in the top-right, and pick a `.txt` file. The frontend will POST it to `http://localhost:5000/predict`, your model will run, and the UI will switch to **Possible fall** with the confidence percentage if `fall_detected == 1`.

---

## 5. Generate a plot of the sensor data

In a separate terminal under AEGIS/backend, enter:

```bash
source .venv/bin/activate
python generate_plot.py samples/F06_SE06.npy
```
The samples are in the format {Fall type (Fxx) or Acitivity type (Dxx)}_{Subject Number (SE = Elderly Subject, SA = Adult Subject)}.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Cannot reach backend` pill in dashboard | Backend not running, or you're still viewing the chat preview iframe | Confirm Terminal 1 is alive; open `http://localhost:8000/index.html` directly |
| `CORS policy: No 'Access-Control-Allow-Origin'` in console | `flask-cors` not installed in the active venv | `pip install -r requirements.txt` again |
| `Address already in use` on port 5000 / 8000 | Another process is using it | Kill it, or change the port: `python app.py` reads no env, but you can edit the last line of `app.py`; static server: `python3 -m http.server 8001` |
| Model fails to load on first run | Google Drive link is private | Set sharing to "Anyone with the link — Viewer" |
| Want to put the backend on a different port / host | — | Open `index.html?backend=http://localhost:5050/predict` |

---

## Stopping

In each terminal, press **Ctrl+C**. The venv stays — next time, just:

```bash
# Terminal 1
cd aegis/backend && source .venv/bin/activate && python app.py
# Terminal 2
cd aegis && python3 -m http.server 8000
```
