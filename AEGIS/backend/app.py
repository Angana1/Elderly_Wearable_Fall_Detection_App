"""
AEGIS — Flask server.

Routes:
    POST /predict     — Fall detection (predictor.py)
    POST /chat        — Ask AEGIS LLM (chat.py)
    GET  /health      — Server health
    GET  /chat/health — LLM provider reachability

You should NOT need to edit this file. To plug in a different model, edit
predictor.py (fall) or chat.py (LLM).
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from predictor import parse_sensor_file, run_model
import chat as chat_mod

app = Flask(__name__)
CORS(app)  # development-only: allow the dashboard (different origin) to call us


# ----------------------------------------------------------------------
# Fall detection
# ----------------------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded (expected form field 'file')."}), 400

    f = request.files["file"]
    try:
        text = f.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return jsonify({"error": f"Could not read file: {e}"}), 400

    rows = parse_sensor_file(text)
    fall, confidence = run_model(rows)

    return jsonify({
        "fall_detected": int(fall),
        "confidence":    float(confidence),  # frontend accepts 0..1 OR 0..100
        "samples":       len(rows),
        "file":          f.filename,
    })


# ----------------------------------------------------------------------
# Ask AEGIS — LLM chat
# ----------------------------------------------------------------------
@app.route("/chat", methods=["POST"])
def chat_route():
    body = request.get_json(silent=True) or {}
    messages = body.get("messages")
    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "Body must include a non-empty 'messages' list."}), 400

    system = body.get("system")
    model = body.get("model")
    temperature = body.get("temperature", 0.4)

    try:
        result = chat_mod.chat(
            messages=messages,
            system=system,
            model=model,
            temperature=temperature,
        )
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 502

    return jsonify(result)


@app.route("/chat/health", methods=["GET"])
def chat_health():
    return jsonify(chat_mod.health())


# ----------------------------------------------------------------------
# Server health
# ----------------------------------------------------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    # The dashboard looks for the backend at http://localhost:5000 by default.
    app.run(host="0.0.0.0", port=5000, debug=True)
