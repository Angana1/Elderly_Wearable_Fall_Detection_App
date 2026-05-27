// Home Dashboard — single current-state view, switches by scenario

const HomeView = ({
  scenario, alertState, onScenarioChange, onLogout,
  onNavigate, onResolveOk, onMarkFalseAlarm,
  uploadStatus, uploadFileName, uploadError, uploadConfidence, onUploadFile, onClearUpload,
}) => {
  const s = SCENARIOS[scenario];

  return (
    <div>
      <TopBar
        kicker={`Demo mode: ${s.label}`}
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
            <h1>Good afternoon, Anna.</h1>
            <div className="sub">
              Here's how Margaret is doing right now.
              AEGIS is watching quietly and will speak up only when something needs you.
            </div>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <Pill icon="watch" tone="neutral" dot>
              <span style={{ fontWeight: 500 }}>Bracelet · {s.detail['Bracelet'] === 'Worn' || scenario === 'low' || scenario === 'fall' ? 'Worn' : 'Worn'}</span>
            </Pill>
            <Pill icon="battery" tone="neutral">{s.battery}%</Pill>
          </div>
        </div>
      </div>

      {/* Resolved banner only after action */}
      {scenario === 'fall' && alertState === 'resolved-ok' && (
        <ResolvedBanner kind="ok" />
      )}
      {scenario === 'fall' && alertState === 'resolved-false' && (
        <ResolvedBanner kind="false" />
      )}

      {/* Hero status — single current state */}
      {scenario === 'normal' && <NormalHero />}
      {scenario === 'low'    && <LowHero onAskAegis={() => onNavigate('ask')} />}
      {scenario === 'fall' && alertState === 'active' && (
        <FallHero
          onResolveOk={onResolveOk}
          onMarkFalseAlarm={onMarkFalseAlarm}
          onNavigate={onNavigate}
          confidence={uploadConfidence}
          fromUpload={uploadStatus === 'fall'}
        />
      )}
      {scenario === 'fall' && alertState !== 'active' && <PostResolveHero alertState={alertState} />}

      {/* Heart-rate contextual card — small, never headline */}
      <SectionHead
        title="Bracelet at a glance"
        sub="Small contextual signals — not used alone for safety decisions."
      />
      <div className="grid-3">
        <MiniMetric label="Heart rate" value={s.heartRate} sub="Signal available" icon="heart-pulse" tone="neutral" />
        <MiniMetric label="Activity today" value={s.steps.toLocaleString()} sub="steps" icon="footprints" tone="neutral" />
        <MiniMetric label="Connection" value="Connected" sub="Last sync · just now" icon="wifi" tone="neutral" />
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

/* ---------- HEROES ---------- */

const NormalHero = () => (
  <div className="status-hero status-hero--safe">
    <div className="status-hero__eyebrow">
      <span className="dot" />
      All clear
    </div>
    <div className="status-hero__title">Margaret is steady today.</div>
    <div className="status-hero__message">
      She is moving within her usual pattern. No action needed —
      AEGIS will quietly continue watching.
    </div>
    <div className="status-hero__detail-row">
      <Detail label="Last movement" value="8 minutes ago" />
      <Detail label="Bracelet"      value="Worn" />
      <Detail label="Activity today" value="3,420 steps" />
      <Detail label="Battery"       value="78%" />
    </div>
    <div style={{
      marginTop: 18, fontSize: 13, opacity: 0.7,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <Icon name="lock" size={12} />
      Location is hidden during normal use.
    </div>
  </div>
);

const LowHero = ({ onAskAegis }) => (
  <div className="status-hero status-hero--low">
    <div className="status-hero__eyebrow">
      <Icon name="moon" size={14} />
      Low activity
    </div>
    <div className="status-hero__title">Activity is lower than usual.</div>
    <div className="status-hero__message">
      Activity is lower than Margaret's usual daytime pattern.
      No fall-like impact has been detected — just a quieter day.
      A gentle check-in may be worthwhile if this continues.
    </div>
    <div className="status-hero__detail-row">
      <Detail label="Last movement" value="3h 45m ago" />
      <Detail label="Activity today" value="1,120 steps" />
      <Detail label="Pattern" value="38% below usual" />
      <Detail label="Fall-like impact" value="Not detected" />
    </div>
    <div className="row" style={{ marginTop: 22, gap: 10, flexWrap: 'wrap' }}>
      <Button variant="action" icon="phone-call">Call Margaret</Button>
      <Button variant="secondary" icon="message-circle">Send a check-in</Button>
      <Button variant="text" icon="sparkles" onClick={onAskAegis}>Ask AEGIS what changed</Button>
    </div>
    <div style={{
      marginTop: 18, fontSize: 13, color: '#6e5418', opacity: 0.85,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <Icon name="info" size={12} />
      Night and rest mode prevents sleep from becoming a false inactivity alert.
    </div>
  </div>
);

const FallHero = ({ onResolveOk, onMarkFalseAlarm, onNavigate, confidence, fromUpload }) => {
  const [locOpen, setLocOpen] = React.useState(false);
  const [explainOpen, setExplainOpen] = React.useState(false);
  const [techOpen, setTechOpen] = React.useState(false);

  return (
    <div className="status-hero status-hero--alert">
      <div className="row" style={{ gap: 10 }}>
        <span className="pulse-dot" />
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          Possible fall detected{fromUpload ? ' · from uploaded sensor file' : ' · 14:32'}
        </span>
      </div>
      <div className="status-hero__title">Margaret may have fallen.</div>
      <div className="status-hero__message">
        AEGIS detected a fall-like movement pattern followed by no movement.
        Waiting for your confirmation before alerting anyone else.
      </div>

      {/* Confidence readout from backend */}
      {typeof confidence === 'number' && (
        <ConfidenceMeter value={confidence} />
      )}

      <div className="status-hero__detail-row">
        <Detail onDark label="Event time" value={fromUpload ? 'Just now' : '14:32'} />
        <Detail onDark label="Source" value={fromUpload ? 'Uploaded sensor file' : 'Bracelet (live)'} />
        <Detail onDark label="Bracelet" value="Worn" />
        <Detail onDark label="Status" value="Awaiting confirmation" />
      </div>

      {/* Action grid */}
      <div className="action-grid" style={{ marginTop: 22 }}>
        <button className="action-btn action-btn--primary">
          <Icon name="phone-call" size={16} />
          Call Margaret
        </button>
        <button className="action-btn">
          <Icon name="user-plus" size={16} />
          Notify James
        </button>
        <button className="action-btn" onClick={() => setLocOpen(true)}>
          <Icon name="map-pin" size={16} />
          {locOpen ? 'Hide location' : 'View location'}
        </button>
        <button className="action-btn" onClick={() => setExplainOpen(!explainOpen)}>
          <Icon name="info" size={16} />
          Explain possible fall detection
        </button>
        <button className="action-btn" onClick={onMarkFalseAlarm}>
          <Icon name="x" size={16} />
          Mark as false alarm
        </button>
        <button className="action-btn action-btn--check" onClick={onResolveOk}>
          <Icon name="check" size={16} />
          I checked, everything is okay
        </button>
      </div>

      {/* Location reveal */}
      {locOpen && (
        <div style={{
          marginTop: 18,
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 12,
          padding: 16,
        }}>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.85 }}>
                Event location
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 24, marginTop: 4 }}>
                Home
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                Room estimate: bathroom
              </div>
            </div>
            <Button variant="on-clay" icon="external-link" onClick={() => onNavigate('location')}>
              Open in Location
            </Button>
          </div>
        </div>
      )}

      {/* Explanation panel */}
      {explainOpen && (
        <div style={{
          marginTop: 18,
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 12,
          padding: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.85 }}>
            What AEGIS noticed
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4, fontStyle: 'italic' }}>
            Prototype — values are illustrative.
          </div>
          <div className="stack-12" style={{ marginTop: 14 }}>
            {FALL_EXPLANATION.map((it, i) => (
              <div key={i} className="row" style={{ gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'rgba(255,255,255,0.16)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name={it.icon} size={14} color="#fff" />
                </span>
                <span style={{ fontSize: 14 }}>{it.label}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 16, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.16)',
          }}>
            <Button variant="on-clay-ghost" icon={techOpen ? 'chevron-up' : 'chevron-down'} onClick={() => setTechOpen(!techOpen)}>
              {techOpen ? 'Hide technical details' : 'Show technical details'}
            </Button>
            {techOpen && (
              <div style={{ marginTop: 14 }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: 0,
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}>
                  {FALL_TECHNICAL.map((row, i) => (
                    <React.Fragment key={i}>
                      <div style={{ padding: '10px 14px', fontSize: 12, fontWeight: 600, borderTop: i ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>{row.sensor}</div>
                      <div style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, borderTop: i ? '1px solid rgba(255,255,255,0.12)' : 'none', opacity: 0.95 }}>{row.reading}</div>
                      <div style={{ padding: '10px 14px', fontSize: 12, opacity: 0.85, borderTop: i ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>{row.note}</div>
                    </React.Fragment>
                  ))}
                </div>
                <div style={{ fontSize: 12, opacity: 0.7, marginTop: 10, fontStyle: 'italic' }}>
                  Prototype — values are illustrative.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PostResolveHero = ({ alertState }) => (
  <div className="status-hero status-hero--safe">
    <div className="status-hero__eyebrow">
      <Icon name="check-circle-2" size={14} />
      {alertState === 'resolved-ok' ? 'Alert resolved' : 'False alarm recorded'}
    </div>
    <div className="status-hero__title">
      {alertState === 'resolved-ok' ? 'Margaret is okay.' : 'False alarm noted.'}
    </div>
    <div className="status-hero__message">
      {alertState === 'resolved-ok'
        ? 'Anna checked on Margaret at 14:39. No further action needed.'
        : 'This event was saved as a labelled false alarm. Prototype note — no model is trained in this demo.'}
    </div>
    <div className="row" style={{ marginTop: 22, gap: 10 }}>
      <Button variant="action" icon="bell">View in Alerts history</Button>
    </div>
  </div>
);

const ResolvedBanner = ({ kind }) => (
  <div className="resolved-banner">
    <span style={{
      width: 32, height: 32, borderRadius: 999,
      background: 'rgba(47,122,100,0.18)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name={kind === 'ok' ? 'check' : 'check'} size={16} color="var(--aegis-deep-green)" />
    </span>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600 }}>
        {kind === 'ok' ? 'Alert resolved' : 'False alarm recorded'}
      </div>
      <div style={{ fontSize: 13, opacity: 0.85 }}>
        {kind === 'ok'
          ? 'Anna checked on Margaret at 14:39 · no further action needed.'
          : 'Saved to alerts history. Will help refine thresholds in future versions.'}
      </div>
    </div>
  </div>
);

const Detail = ({ label, value, onDark }) => (
  <div>
    <div className="status-hero__detail-label">{label}</div>
    <div className="status-hero__detail-value">{value}</div>
  </div>
);

// Confidence meter — used only on the FallHero when a backend result is present
const ConfidenceMeter = ({ value }) => {
  const pct = Math.max(0, Math.min(100, value));
  const tier = pct >= 75 ? 'High' : pct >= 50 ? 'Moderate' : 'Low';
  return (
    <div style={{
      marginTop: 22,
      padding: '16px 20px',
      borderRadius: 14,
      background: 'rgba(255,255,255,0.13)',
      border: '1px solid rgba(255,255,255,0.20)',
    }}>
      <div className="spread" style={{ alignItems: 'baseline' }}>
        <div>
          <div style={{
            fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            Model confidence · {tier}
          </div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 2 }}>
            From your fall-detection model on the uploaded sensor file
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: '-0.5px',
        }}>
          {pct.toFixed(1)}%
        </div>
      </div>
      <div style={{
        marginTop: 12,
        height: 8,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.18)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: '#fff',
          borderRadius: 4,
          transition: 'width 600ms var(--ease)',
        }} />
      </div>
    </div>
  );
};

const MiniMetric = ({ label, value, sub, icon, tone }) => (
  <Card>
    <div className="row" style={{ gap: 10 }}>
      <span style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--aegis-surface-raised)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color="var(--aegis-clay)" />
      </span>
      <div className="metric-label">{label}</div>
    </div>
    <div className="metric-num">{value}</div>
    <div className="metric-sub">{sub}</div>
  </Card>
);

Object.assign(window, { HomeView });
