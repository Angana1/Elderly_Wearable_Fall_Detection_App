// Ask AEGIS — chat-style query interface, wired to the local LLM backend.

const DEFAULT_SYSTEM_PROMPT =
  "You are AEGIS, a calm assistant inside a caregiver dashboard for an " +
  "older adult named Margaret Wilson. You can summarize bracelet activity, " +
  "alerts, and device status. Be concise, plain-spoken, and warm. " +
  "You are NOT a medical device and you do NOT give medical advice. " +
  "If asked about symptoms, recommend contacting Margaret's doctor or " +
  "local emergency services. If asked about location, guide the user to " +
  "the Location Tab. The wearable has acceleration and rotation " +
  "information, and is used to keep the user updated about possible falls, " +
  "periods of inactivity, number of steps, etc. It also detects heart rate " +
  "(HRV) along with movement. The detection of any heart rate signals that " +
  "the user is currently wearing the bracelet. The user may ask questions " +
  "about general mobility, inactivity, fall risk, etc. Make up realistic, " +
  "practical scenarios and answer gently and concisely.";

const STORAGE_KEY = 'aegis-ask-system-prompt';

// Resolve backend base URL (same logic as fall upload)
const getBackendBase = () => {
  const params = new URLSearchParams(window.location.search);
  const fromQs = params.get('backend');
  if (fromQs) return fromQs.replace(/\/predict$/, '');
  if (window.AEGIS_BACKEND_URL) return window.AEGIS_BACKEND_URL.replace(/\/predict$/, '');
  return 'http://localhost:5000';
};

const AskView = ({
  scenario, onScenarioChange, onLogout,
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => {
  const [messages, setMessages] = React.useState([
    { who: 'ai', text: ASK_DEFAULT_GREETING[scenario] },
  ]);
  const [input, setInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [llmStatus, setLlmStatus] = React.useState({ checked: false, ok: false, model: null, models: [], error: null });
  const [systemPrompt, setSystemPrompt] = React.useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_SYSTEM_PROMPT; }
    catch (_) { return DEFAULT_SYSTEM_PROMPT; }
  });
  const [model, setModel] = React.useState(null);
  const [showPromptEditor, setShowPromptEditor] = React.useState(false);
  const scrollRef = React.useRef(null);

  // Persist the system prompt
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, systemPrompt); } catch (_) {}
  }, [systemPrompt]);

  // Reset greeting when scenario changes
  React.useEffect(() => {
    setMessages([{ who: 'ai', text: ASK_DEFAULT_GREETING[scenario] }]);
  }, [scenario]);

  // Check backend health on mount
  React.useEffect(() => {
    let alive = true;
    fetch(`${getBackendBase()}/chat/health`)
      .then(r => r.json())
      .then(data => {
        if (!alive) return;
        setLlmStatus({
          checked: true,
          ok: !!data.ok,
          model: data.default || null,
          models: data.models || [],
          error: data.error || null,
        });
        if (data.default && !model) setModel(data.default);
      })
      .catch(err => alive && setLlmStatus({
        checked: true, ok: false, model: null, models: [],
        error: 'Backend unreachable. Falling back to demo answers.',
      }));
    return () => { alive = false; };
  }, []);

  // Auto-scroll
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  const buildContext = () => {
    const s = SCENARIOS[scenario];
    return (
      `Current scenario in the dashboard: ${s.label} — ${s.message}. ` +
      `Details: ${Object.entries(s.detail).map(([k, v]) => `${k} ${v}`).join('; ')}. ` +
      `Battery ${s.battery}%, heart rate ${s.heartRate}, steps today ${s.steps}.`
    );
  };

  const ask = async (q) => {
    const question = q.trim();
    if (!question || busy) return;

    const userMsg = { who: 'user', text: question };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');

    // If backend is reachable, call it. Otherwise fall back to canned.
    if (llmStatus.ok) {
      setBusy(true);
      try {
        const apiMessages = [
          { role: 'system', content: `${systemPrompt}\n\nLive dashboard context: ${buildContext()}` },
          ...history.filter(m => m.who === 'user' || m.who === 'ai').map(m => ({
            role: m.who === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        ];
        // Strip the leading system message — chat.py adds its own from the `system` field
        const userAssistant = apiMessages.filter(m => m.role !== 'system');

        const res = await fetch(`${getBackendBase()}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: userAssistant,
            system: `${systemPrompt}\n\nLive dashboard context: ${buildContext()}`,
            model: model || undefined,
            temperature: 0.4,
          }),
        });
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error || `Server responded ${res.status}`);
        }
        const data = await res.json();
        setMessages(m => [...m, { who: 'ai', text: data.text, model: data.model }]);
      } catch (e) {
        setMessages(m => [...m, {
          who: 'ai',
          text: `(LLM error — falling back to canned reply) ${cannedReply(question, scenario)}`,
          error: e.message,
        }]);
      } finally {
        setBusy(false);
      }
    } else {
      // Backend offline — use canned answers
      setMessages(m => [...m, { who: 'ai', text: cannedReply(question, scenario) }]);
    }
  };

  return (
    <div>
      <TopBar
        kicker={`Demo mode: ${SCENARIOS[scenario].label}`}
        scenario={scenario}
        onChangeScenario={onScenarioChange}
        onLogout={onLogout}
        uploadStatus={uploadStatus}
        uploadFileName={uploadFileName}
        uploadError={uploadError}
        onUploadFile={onUploadFile}
        onClearUpload={onClearUpload}
      />

      <div className="page-head">
        <div className="page-head__row">
          <div>
            <h1>Ask AEGIS</h1>
            <div className="sub">
              A focused assistant for Margaret's bracelet activity, alerts, and device status.
              AEGIS does not provide medical advice.
            </div>
          </div>
          <LlmStatusPill status={llmStatus} model={model} />
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'flex-start' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', minHeight: 460 }}>
          <div ref={scrollRef} style={{
            flex: 1,
            overflowY: 'auto',
            maxHeight: 480,
            paddingRight: 8,
            marginBottom: 16,
          }}>
            {messages.map((m, i) => (
              <div key={i} className={`ask-msg ${m.who === 'user' ? 'ask-msg--user' : ''}`}>
                <div className={`ask-msg__avatar ask-msg__avatar--${m.who}`}>
                  {m.who === 'user' ? 'AW' : <Icon name="sparkles" size={16} color="#fff" />}
                </div>
                <div className="ask-msg__bubble">
                  {m.text}
                  {m.model && (
                    <div style={{
                      marginTop: 8, fontSize: 11, color: 'var(--aegis-muted-plum)',
                      fontFamily: 'var(--font-mono)', letterSpacing: 0.3,
                    }}>
                      via {m.model}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="ask-msg">
                <div className="ask-msg__avatar ask-msg__avatar--ai">
                  <Icon name="sparkles" size={16} color="#fff" />
                </div>
                <div className="ask-msg__bubble" style={{ color: 'var(--aegis-muted-plum)' }}>
                  <span className="row" style={{ gap: 8 }}>
                    <Icon name="loader-2" size={14} style={{ animation: 'spin 1s linear infinite' }} />
                    Thinking…
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Prompt chips */}
          <div className="row-wrap" style={{ marginBottom: 12 }}>
            {ASK_PROMPTS.slice(0, 4).map(p => (
              <button key={p} className="chip" onClick={() => ask(p)} disabled={busy}>{p}</button>
            ))}
          </div>

          <div className="ask-input">
            <Icon name="message-circle" size={18} color="var(--aegis-muted-plum)" style={{ alignSelf: 'center', marginLeft: 6 }} />
            <input
              placeholder={busy ? 'Waiting for reply…' : "Ask about Margaret's activity, alerts, or device…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ask(input)}
              disabled={busy}
            />
            <Button variant="clay" icon="arrow-up" onClick={() => ask(input)} disabled={busy || !input.trim()} />
          </div>
        </Card>

        <div className="stack-16">
          {/* System prompt editor */}
          <Card>
            <div className="spread" style={{ marginBottom: 8 }}>
              <div className="kicker">System prompt</div>
              <button
                onClick={() => setShowPromptEditor(!showPromptEditor)}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: 'var(--aegis-deep-green)', fontSize: 12, fontWeight: 600,
                }}
              >
                {showPromptEditor ? 'Hide' : 'Edit'}
              </button>
            </div>
            {!showPromptEditor ? (
              <div style={{
                fontSize: 13, color: 'var(--aegis-muted-plum)',
                lineHeight: 1.55,
                maxHeight: 72, overflow: 'hidden',
                textOverflow: 'ellipsis', display: '-webkit-box',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
              }}>
                {systemPrompt}
              </div>
            ) : (
              <>
                <textarea
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid var(--aegis-divider)',
                    background: 'var(--aegis-surface-card)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    color: 'var(--aegis-ink-dark)',
                    resize: 'vertical',
                    outline: 'none',
                    lineHeight: 1.5,
                  }}
                />
                <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
                  <Button
                    variant="text" icon="rotate-ccw"
                    onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                  >
                    Reset to default
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowPromptEditor(false)}>Done</Button>
                </div>
              </>
            )}
          </Card>

          {/* Model picker (if backend reports installed models) */}
          {llmStatus.ok && llmStatus.models.length > 0 && (
            <Card>
              <div className="kicker" style={{ marginBottom: 8 }}>Local model</div>
              <select
                className="select"
                value={model || ''}
                onChange={e => setModel(e.target.value)}
                style={{ width: '100%' }}
              >
                {llmStatus.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <div style={{ fontSize: 12, color: 'var(--aegis-muted-plum)', marginTop: 8 }}>
                Pull more with <code style={{ fontFamily: 'var(--font-mono)' }}>ollama pull &lt;name&gt;</code>
              </div>
            </Card>
          )}

          {/* Suggested prompts */}
          <Card>
            <div className="kicker" style={{ marginBottom: 12 }}>Try asking</div>
            <div className="stack-8">
              {ASK_PROMPTS.map(p => (
                <button
                  key={p}
                  onClick={() => ask(p)}
                  disabled={busy}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'transparent',
                    border: '1px solid var(--aegis-divider)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 13,
                    color: 'var(--aegis-ink-soft)',
                    cursor: busy ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'background 200ms',
                    opacity: busy ? 0.6 : 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--aegis-surface-raised)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {p}
                </button>
              ))}
            </div>
          </Card>

          <Card tone="warm">
            <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <Icon name="shield-alert" size={18} color="var(--aegis-clay)" style={{ marginTop: 2 }} />
              <div style={{ fontSize: 13, color: 'var(--aegis-ink-soft)', lineHeight: 1.55 }}>
                AEGIS summarizes bracelet activity and alerts. It does not provide medical advice.
                For health concerns, contact Margaret's doctor or local emergency services.
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

// ---- Helpers ------------------------------------------------------------

const cannedReply = (q, scenario) => {
  const answers = ASK_ANSWERS(scenario);
  const known = Object.keys(answers).find(k => k.toLowerCase() === q.trim().toLowerCase());
  return known
    ? answers[known][scenario]
    : "I can answer questions about Margaret's bracelet activity, alerts, and device status. Try one of the suggestions below.";
};

const LlmStatusPill = ({ status, model }) => {
  if (!status.checked) {
    return (
      <Pill tone="neutral">
        <Icon name="loader-2" size={12} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Checking LLM…</span>
      </Pill>
    );
  }
  if (status.ok) {
    return (
      <Pill tone="green" dot>
        <span>LLM connected · {model || status.model || 'default'}</span>
      </Pill>
    );
  }
  return (
    <Pill tone="amber" icon="alert-circle">
      <span>LLM offline — demo answers</span>
    </Pill>
  );
};

Object.assign(window, { AskView });
