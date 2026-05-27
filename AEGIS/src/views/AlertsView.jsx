// Alerts page — current + historical alerts

const AlertsView = ({
  scenario, alertState, onScenarioChange, onLogout,
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => {
  const [filter, setFilter] = React.useState('all');

  // Build the live alert from current scenario state
  const currentAlert = React.useMemo(() => {
    if (scenario === 'fall') {
      const base = {
        id: 'live-fall',
        type: 'fall',
        title: 'Possible fall',
        summary: 'AEGIS detected a fall-like movement pattern followed by no movement.',
        timeLabel: 'Today · 14:32',
        icon: 'activity',
        iconTone: 'red',
        active: true,
      };
      if (alertState === 'active') {
        return { ...base, status: 'Awaiting confirmation', statusTone: 'red' };
      }
      if (alertState === 'resolved-ok') {
        return { ...base, active: false, status: 'Checked',     statusTone: 'green',
          resolution: 'Resolved by Anna Wilson at 14:39 · everything is okay.' };
      }
      if (alertState === 'resolved-false') {
        return { ...base, active: false, status: 'False alarm', statusTone: 'neutral',
          resolution: 'Saved as a labelled false alarm. Prototype only — no model is trained.' };
      }
    }
    if (scenario === 'low') {
      return {
        id: 'live-low',
        type: 'low',
        title: 'Low daytime activity',
        summary: "Activity is 38% below Margaret's usual daytime pattern. No fall-like impact detected.",
        timeLabel: 'Today · ongoing',
        status: 'Open · check in suggested',
        statusTone: 'amber',
        icon: 'moon',
        iconTone: 'amber',
        active: true,
      };
    }
    return null;
  }, [scenario, alertState]);

  const allAlerts = [currentAlert, ...ALERT_HISTORY].filter(Boolean);

  const filtered = allAlerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'fall') return a.type === 'fall';
    if (filter === 'low')  return a.type === 'low';
    if (filter === 'device') return a.type === 'device';
    if (filter === 'false') return a.status === 'False alarm';
    return true;
  });

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
        <h1>Alerts &amp; history</h1>
        <div className="sub">
          Current and past safety events for Margaret.
          Older entries help you spot patterns over time.
        </div>
        <div style={{ fontSize: 12, color: 'var(--aegis-muted-plum)', fontStyle: 'italic', marginTop: 6 }}>
          Prototype — values are illustrative.
        </div>
      </div>

      {/* Filters */}
      <div className="row-wrap" style={{ marginBottom: 20 }}>
        {[
          { k: 'all',    label: 'All' },
          { k: 'fall',   label: 'Possible falls' },
          { k: 'low',    label: 'Low activity' },
          { k: 'device', label: 'Device issues' },
          { k: 'false',  label: 'False alarms' },
        ].map(f => (
          <button
            key={f.k}
            className={`chip ${filter === f.k ? 'is-active' : ''}`}
            onClick={() => setFilter(f.k)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="stack-12">
        {filtered.map(a => <AlertCard key={a.id} alert={a} />)}
        {filtered.length === 0 && (
          <Card style={{ textAlign: 'center', color: 'var(--aegis-muted-plum)', padding: '40px 20px' }}>
            No alerts in this category.
          </Card>
        )}
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

const AlertCard = ({ alert }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="alert-row" style={alert.active ? { borderColor: 'var(--aegis-clay-soft)' } : {}}>
      <div className={`alert-row__icon alert-row__icon--${alert.iconTone}`}>
        <Icon name={alert.icon} size={20} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <div className="alert-row__title">{alert.title}</div>
          <Pill tone={alert.statusTone} dot>{alert.status}</Pill>
          {alert.active && <Pill tone="clay-soft">Active</Pill>}
        </div>
        <div className="alert-row__meta">{alert.timeLabel}</div>
        <div className="alert-row__summary">{alert.summary}</div>
        {alert.resolution && <div className="alert-row__resolution">{alert.resolution}</div>}

        {alert.type === 'fall' && (
          <div style={{ marginTop: 12 }}>
            <Button variant="text" icon={open ? 'chevron-up' : 'chevron-down'} onClick={() => setOpen(!open)}>
              {open ? 'Hide explanation' : 'Explain possible fall detection'}
            </Button>
            {open && (
              <div style={{
                marginTop: 12,
                background: 'var(--aegis-surface-raised)',
                borderRadius: 10,
                padding: 16,
              }}>
                <div className="stack-8">
                  {FALL_EXPLANATION.map((it, i) => (
                    <div key={i} className="row" style={{ gap: 10, fontSize: 14, color: 'var(--aegis-ink-soft)' }}>
                      <Icon name={it.icon} size={14} color="var(--aegis-clay)" />
                      <span>{it.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="row" style={{ alignSelf: 'center', flexShrink: 0 }}>
        {alert.active && alert.type === 'fall' && (
          <Button variant="clay" size="sm" icon="phone-call">Open</Button>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { AlertsView });
