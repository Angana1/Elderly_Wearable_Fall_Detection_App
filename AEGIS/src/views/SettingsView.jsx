// Settings — tabbed view with 5 sections

const SettingsView = ({
  scenario, onScenarioChange, onLogout, initialTab = 'alerts',
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => {
  const [tab, setTab] = React.useState(initialTab);
  React.useEffect(() => { setTab(initialTab); }, [initialTab]);

  // Local state for all settings
  const [s, setS] = React.useState({
    notifyOther: true,
    escalation: true,
    notifyAfter: 5,
    emergencyAfter: 10,
    lowActivityHours: 4,
    notWorn: true,
    lowBattery: true,
    connectionLost: true,
    chargingReminder: false,
    nightMode: true,
    locationMode: 'alerts',
    dailySummary: true,
    falseAlarmFeedback: true,
  });
  const set = (k, v) => setS(x => ({ ...x, [k]: v }));

  const tabs = [
    { k: 'alerts',   label: 'Alerts & thresholds' },
    { k: 'night',    label: 'Night mode & rest' },
    { k: 'location', label: 'Location sharing' },
    { k: 'family',   label: 'Family & caregivers' },
    { k: 'consent',  label: 'Privacy & consent' },
  ];

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
        <h1>Settings</h1>
        <div className="sub">
          Control alerts, rest windows, location sharing, caregivers, and privacy.
          Changes affect everyone who sees Margaret's data.
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t.k} className={`tab ${tab === t.k ? 'is-active' : ''}`} onClick={() => setTab(t.k)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'alerts'   && <AlertsTab s={s} set={set} />}
      {tab === 'night'    && <NightTab s={s} set={set} />}
      {tab === 'location' && <LocationTab s={s} set={set} />}
      {tab === 'family'   && <FamilyTab />}
      {tab === 'consent'  && <ConsentTab s={s} set={set} />}

      <div style={{ height: 40 }} />
    </div>
  );
};

const AlertsTab = ({ s, set }) => (
  <div className="stack-16">
    <Card>
      <SectionTitle>Fall detection</SectionTitle>
      <SettingRow
        title="Fall alerts"
        desc="Cannot be disabled — fall detection is the core promise of AEGIS."
      >
        <Pill tone="green" dot>Always on</Pill>
      </SettingRow>
      <SettingRow
        title="Notify other caregivers"
        desc="If you do not resolve an active alert, AEGIS notifies the next caregiver."
      >
        <Toggle on={s.notifyOther} onChange={v => set('notifyOther', v)} />
      </SettingRow>
      <SettingRow
        title="Alert escalation"
        desc="Step-up notifications when no caregiver responds."
      >
        <Toggle on={s.escalation} onChange={v => set('escalation', v)} />
      </SettingRow>
      <SettingRow
        title="Notify next caregiver after"
        desc="Time AEGIS waits before reaching out to the secondary caregiver."
      >
        <NumberPicker value={s.notifyAfter} setValue={v => set('notifyAfter', v)} unit="min" min={1} max={30} />
      </SettingRow>
      <SettingRow
        title="Emergency recommendation after"
        desc="AEGIS does not automatically call emergency services. It recommends contacting local emergency services if no caregiver responds."
      >
        <NumberPicker value={s.emergencyAfter} setValue={v => set('emergencyAfter', v)} unit="min" min={5} max={60} />
      </SettingRow>
    </Card>

    <Card>
      <SectionTitle>Activity thresholds</SectionTitle>
      <SettingRow
        title="Low activity threshold"
        desc="Lower values may produce more alerts. AEGIS uses Margaret's own usual pattern as the baseline."
      >
        <div style={{ minWidth: 240, textAlign: 'right' }}>
          <input
            type="range" min={2} max={8} step={1}
            value={s.lowActivityHours}
            onChange={e => set('lowActivityHours', +e.target.value)}
            style={{ width: 200, accentColor: 'var(--aegis-clay)' }}
          />
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--aegis-ink-dark)', marginTop: 2 }}>
            {s.lowActivityHours} daytime hours
          </div>
        </div>
      </SettingRow>
    </Card>

    <Card>
      <SectionTitle>Device notifications</SectionTitle>
      <SettingRow title="Bracelet not worn" desc="Notify when no PPG signal is detected.">
        <Toggle on={s.notWorn} onChange={v => set('notWorn', v)} />
      </SettingRow>
      <SettingRow title="Low battery" desc="Notify when battery falls below 20%.">
        <Toggle on={s.lowBattery} onChange={v => set('lowBattery', v)} />
      </SettingRow>
      <SettingRow title="Connection lost" desc="Notify if the bracelet stays offline for over 30 minutes.">
        <Toggle on={s.connectionLost} onChange={v => set('connectionLost', v)} />
      </SettingRow>
      <SettingRow title="Charging reminder" desc="A gentle nudge when the bracelet hasn't been charged recently.">
        <Toggle on={s.chargingReminder} onChange={v => set('chargingReminder', v)} />
      </SettingRow>
    </Card>
  </div>
);

const NightTab = ({ s, set }) => (
  <Card>
    <SectionTitle>Night mode &amp; rest window</SectionTitle>
    <SettingRow title="Automatic night mode" desc="AEGIS quiets inactivity alerts during Margaret's rest window.">
      <Toggle on={s.nightMode} onChange={v => set('nightMode', v)} />
    </SettingRow>
    <SettingRow
      title="Sleep / rest window"
      desc="Inactivity alerts pause during this window. Fall detection stays on at all hours."
    >
      <div className="row" style={{ gap: 6 }}>
        <span style={{
          padding: '6px 10px', borderRadius: 8,
          background: 'var(--aegis-surface-raised)',
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
        }}>22:00</span>
        <span style={{ color: 'var(--aegis-muted-plum)' }}>—</span>
        <span style={{
          padding: '6px 10px', borderRadius: 8,
          background: 'var(--aegis-surface-raised)',
          fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
        }}>07:00</span>
      </div>
    </SettingRow>
    <div className="note" style={{ marginTop: 16 }}>
      No movement during scheduled rest is treated as normal unless a fall-like impact is detected.
    </div>
  </Card>
);

const LocationTab = ({ s, set }) => (
  <Card>
    <SectionTitle>Location sharing</SectionTitle>
    <SettingRow
      title="Location sharing mode"
      desc="Where Margaret is — and how much you can see — is controlled here. The default keeps location hidden during normal use."
    >
      <Segmented
        value={s.locationMode}
        onChange={v => set('locationMode', v)}
        options={[
          { value: 'off',    label: 'Off' },
          { value: 'alerts', label: 'During alerts only' },
          { value: 'always', label: 'Always on' },
        ]}
      />
    </SettingRow>
    <div className="note" style={{ marginTop: 12 }}>
      Location remains hidden during normal use and is revealed only during a safety event.
      Authorized caregivers can see only the general safe area unless an active alert is open.
    </div>
  </Card>
);

const FamilyTab = () => (
  <Card>
    <SectionTitle>Family &amp; caregivers</SectionTitle>
    <p style={{ color: 'var(--aegis-muted-plum)', fontSize: 14, margin: '0 0 16px' }}>
      People who can see Margaret's bracelet activity. Access levels control how much each person sees.
    </p>
    <div className="stack-12">
      {CAREGIVERS.map(c => (
        <div key={c.id} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: 14, borderRadius: 12,
          background: 'var(--aegis-surface-raised)',
        }}>
          <Avatar initials={c.initials} color={c.color} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: 'var(--aegis-ink-dark)' }}>{c.name}</div>
            <div style={{ fontSize: 13, color: 'var(--aegis-muted-plum)' }}>
              {c.relation}{c.role && ` · ${c.role}`} · {c.phone}
            </div>
          </div>
          <Pill tone={c.access === 'Full access' ? 'green' : c.access === 'Alerts only' ? 'amber' : 'neutral'}>
            {c.access}
          </Pill>
          <button className="btn btn--secondary btn--sm">Change</button>
          <button className="btn btn--secondary btn--sm">Revoke</button>
        </div>
      ))}
    </div>
    <div style={{ marginTop: 18 }}>
      <Button variant="clay" icon="user-plus">Invite family member or caregiver</Button>
    </div>
  </Card>
);

const ConsentTab = ({ s, set }) => (
  <div className="stack-16">
    <Card>
      <SectionTitle>Privacy &amp; consent</SectionTitle>
      <SettingRow
        title="Daily movement summary"
        desc="Share a small daily summary of steps and rest with caregivers."
      >
        <Toggle on={s.dailySummary} onChange={v => set('dailySummary', v)} />
      </SettingRow>
      <SettingRow
        title="False-alarm feedback"
        desc="When you mark an alert as a false alarm, the labelled event may be used to refine thresholds in future versions. Prototype only — no model is trained today."
      >
        <Toggle on={s.falseAlarmFeedback} onChange={v => set('falseAlarmFeedback', v)} />
      </SettingRow>
    </Card>

    <Card>
      <SectionTitle>Data &amp; account</SectionTitle>
      <SettingRow title="Review consent" desc="Re-open both consent agreements from onboarding.">
        <Button variant="secondary" icon="file-text" size="sm">Review</Button>
      </SettingRow>
      <SettingRow title="Export data" desc="Download Margaret's activity history and alerts.">
        <Button variant="secondary" icon="download" size="sm">Export</Button>
      </SettingRow>
      <SettingRow title="Delete all data" desc="Remove all of Margaret's bracelet history from AEGIS. This cannot be undone.">
        <Button variant="secondary" icon="trash-2" size="sm" style={{ color: 'var(--aegis-alert-red)' }}>Delete</Button>
      </SettingRow>
    </Card>

    <div className="note">
      AEGIS is a safety and wellness monitoring aid. It is not a medical device and does not diagnose conditions.
      Margaret may pause or revoke sharing at any time.
    </div>
  </div>
);

const SectionTitle = ({ children }) => (
  <div style={{
    fontFamily: 'var(--font-serif)', fontWeight: 500,
    fontSize: 22, letterSpacing: '-0.2px',
    color: 'var(--aegis-ink-dark)',
    marginBottom: 8,
  }}>
    {children}
  </div>
);

const NumberPicker = ({ value, setValue, unit, min = 1, max = 60 }) => (
  <div className="row" style={{
    background: 'var(--aegis-surface-raised)',
    borderRadius: 10, padding: 4,
  }}>
    <button
      className="btn btn--sm"
      style={{ background: 'transparent', color: 'var(--aegis-ink-dark)', padding: '0 10px' }}
      onClick={() => setValue(Math.max(min, value - 1))}
    >−</button>
    <span style={{ fontWeight: 600, minWidth: 64, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
      {value} {unit}
    </span>
    <button
      className="btn btn--sm"
      style={{ background: 'transparent', color: 'var(--aegis-ink-dark)', padding: '0 10px' }}
      onClick={() => setValue(Math.min(max, value + 1))}
    >+</button>
  </div>
);

Object.assign(window, { SettingsView });
