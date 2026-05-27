"""
AEGIS — chat backend (open-source LLM bridge).

Default provider: Ollama (https://ollama.com) — a local LLM runtime.
Why Ollama: one-command setup, runs Llama / Mistral / Qwen / Phi locally,
no API keys, no GPU required, and exposes a simple HTTP API on
http://localhost:11434.

Install once:
    macOS / Windows / Linux: download from https://ollama.com
    Then pull a small model that fits on most laptops:
        ollama pull llama3.2          # ~2 GB, fast on Mac/PC
        ollama pull qwen2.5:3b        # ~2 GB, good with structured replies
        ollama pull phi3:mini         # ~2.3 GB, MIT-licensed

Once `ollama serve` is running (Ollama starts it automatically on install),
this module talks to it and exposes a stable function `chat(messages, ...)`
that backend/app.py wires to the dashboard.

To swap providers (e.g. use llama-cpp-python or transformers) you only
edit the `chat()` function below — the API the frontend sees is unchanged.
"""

import os
import json
import urllib.request
import urllib.error


# ----------------------------------------------------------------------
# CONFIG
# ----------------------------------------------------------------------
OLLAMA_URL = os.environ.get("AEGIS_OLLAMA_URL", "http://localhost:11434/api/chat")
DEFAULT_MODEL = os.environ.get("AEGIS_OLLAMA_MODEL", "llama3.2")

# Used when the dashboard doesn't pass a system prompt. The user can override
# this live from the Ask AEGIS UI.
DEFAULT_SYSTEM_PROMPT = (
    "You are AEGIS, a calm assistant inside a caregiver dashboard for an "
    "older adult named Margaret Wilson. You can summarize bracelet activity, "
    "alerts, and device status. Be concise, plain-spoken, and warm. "
    "You are NOT a medical device and you do NOT give medical advice. "
    "If asked about symptoms, recommend contacting Margaret's doctor or "
    "local emergency services. If asked about location, guide the user to "
    "the Location Tab. The wearable has acceleration and rotation "
    "information, and is used to keep the user updated about possible falls, "
    "periods of inactivity, number of steps, etc. It also detects heart rate "
    "(HRV) along with movement. The detection of any heart rate signals that "
    "the user is currently wearing the bracelet. The user may ask questions "
    "about general mobility, inactivity, fall risk, etc. Make up realistic, "
    "practical scenarios and answer gently and concisely."
)


# ----------------------------------------------------------------------
# PROVIDER — Ollama
# ----------------------------------------------------------------------
def chat(messages, system=None, model=None, temperature=0.4):
    """Send a chat request to the local LLM and return the assistant text.

    messages:  list of {"role": "user"|"assistant", "content": str}
    system:    optional system prompt; falls back to DEFAULT_SYSTEM_PROMPT
    model:     ollama model tag (e.g. "llama3.2"); falls back to DEFAULT_MODEL
    """
    model = model or DEFAULT_MODEL
    sys_prompt = (system or DEFAULT_SYSTEM_PROMPT).strip()

    full_messages = [{"role": "system", "content": sys_prompt}, *messages]

    payload = {
        "model": model,
        "messages": full_messages,
        "stream": False,
        "options": {"temperature": float(temperature)},
    }

    req = urllib.request.Request(
        OLLAMA_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.URLError as e:
        raise RuntimeError(
            f"Could not reach Ollama at {OLLAMA_URL}. "
            "Is `ollama serve` running, and did you `ollama pull "
            f"{model}` first? Original error: {e}"
        )

    # Ollama returns {"message": {"role": "assistant", "content": "..."}, ...}
    msg = data.get("message", {})
    text = msg.get("content", "").strip()
    if not text:
        raise RuntimeError(f"Ollama returned an empty reply. Full payload: {data}")

    return {
        "text": text,
        "model": data.get("model", model),
        "provider": "ollama",
    }


def health():
    """Quick reachability check for the LLM provider."""
    try:
        # Ollama exposes a tags endpoint listing installed models
        tags_url = OLLAMA_URL.replace("/api/chat", "/api/tags")
        with urllib.request.urlopen(tags_url, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        models = [m.get("name") for m in data.get("models", [])]
        return {"ok": True, "provider": "ollama", "models": models, "default": DEFAULT_MODEL}
    except Exception as e:
        return {"ok": False, "provider": "ollama", "error": str(e), "url": OLLAMA_URL}
