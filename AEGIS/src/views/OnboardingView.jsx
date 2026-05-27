// Onboarding view — 3 steps: monitored person, consent, privacy choices

const OnboardingView = ({ onComplete, onBack }) => {
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState({
    olderName: 'Margaret Wilson',
    age: '78',
    living: 'Semi-independently at home',
    relation: 'Daughter',
    primaryCaregiver: 'Anna Wilson',
    contact1: 'James Wilson · +1 (415) 555 0118',
    contact2: 'Dr. R. Patel · +1 (415) 555 0190',
  });
  const [consent, setConsent] = React.useState({ older: false, caregiver: false });
  const [privacy, setPrivacy] = React.useState({
    locationDuringAlerts: true,
    dailyMovement: true,
    deviceStatus: true,
    falseAlarmFeedback: true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="preapp" style={{ alignItems: 'flex-start', paddingTop: 48 }}>
      <div className="onboarding-shell">
        <div className="steps">
          <span className="steps__label">Step {step} of 3</span>
          <div className={`steps__bar ${step >= 1 ? 'is-active' : ''}`} />
          <div className={`steps__bar ${step >= 2 ? 'is-active' : ''}`} />
          <div className={`steps__bar ${step >= 3 ? 'is-active' : ''}`} />
        </div>

        {step === 1 && <StepOne form={form} set={set} />}
        {step === 2 && <StepTwo consent={consent} setConsent={setConsent} />}
        {step === 3 && <StepThree privacy={privacy} setPrivacy={setPrivacy} />}

        <div className="row" style={{ justifyContent: 'space-between', marginTop: 32 }}>
          <Button
            variant="text"
            onClick={() => step === 1 ? onBack() : setStep(step - 1)}
            icon="arrow-left"
          >
            {step === 1 ? 'Back to welcome' : 'Back'}
          </Button>
          {step < 3 ? (
            <Button
              variant="clay"
              onClick={() => setStep(step + 1)}
              iconRight="arrow-right"
              disabled={step === 2 && (!consent.older || !consent.caregiver)}
            >
              Continue
            </Button>
          ) : (
            <Button variant="clay" onClick={onComplete} iconRight="arrow-right">
              Continue to pairing
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const StepOne = ({ form, set }) => (
  <>
    <h1 style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500,
      fontSize: 32, letterSpacing: '-0.4px', margin: '0 0 8px',
    }}>Who are you watching over?</h1>
    <p style={{ color: 'var(--aegis-muted-plum)', fontSize: 15, margin: '0 0 28px' }}>
      AEGIS keeps a small, gentle window into how someone is doing.
      A few details so we can introduce you properly.
    </p>

    <div className="stack-16">
      <div className="grid-2">
        <Field label="Older adult's name">
          <input className="input" value={form.olderName} onChange={e => set('olderName', e.target.value)} />
        </Field>
        <Field label="Age">
          <input className="input" value={form.age} onChange={e => set('age', e.target.value)} />
        </Field>
      </div>
      <Field label="Living situation">
        <input className="input" value={form.living} onChange={e => set('living', e.target.value)} />
      </Field>
      <div className="grid-2">
        <Field label="Your relationship">
          <input className="input" value={form.relation} onChange={e => set('relation', e.target.value)} />
        </Field>
        <Field label="Primary caregiver">
          <input className="input" value={form.primaryCaregiver} onChange={e => set('primaryCaregiver', e.target.value)} />
        </Field>
      </div>
      <Field label="Emergency contact 1" hint="A second person AEGIS will notify if you don't respond.">
        <input className="input" value={form.contact1} onChange={e => set('contact1', e.target.value)} />
      </Field>
      <Field label="Emergency contact 2 (optional)">
        <input className="input" value={form.contact2} onChange={e => set('contact2', e.target.value)} />
      </Field>
    </div>
  </>
);

const StepTwo = ({ consent, setConsent }) => (
  <>
    <h1 style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500,
      fontSize: 32, letterSpacing: '-0.4px', margin: '0 0 8px',
    }}>Consent &amp; understanding</h1>
    <p style={{ color: 'var(--aegis-muted-plum)', fontSize: 15, margin: '0 0 24px' }}>
      Two short agreements — one from the older adult, one from you.
      You can change either at any time in Settings.
    </p>

    <div className="stack-16">
      {/* A. Older adult consent */}
      <Card>
        <div className="kicker" style={{ marginBottom: 8 }}>A · Older adult consent</div>
        <div style={{ fontSize: 16, color: 'var(--aegis-ink-dark)', lineHeight: 1.55 }}>
          "I agree that my AEGIS bracelet may share safety-related movement,
          device status, and optional location information with selected
          family members / caregivers."
        </div>

        <div style={{ marginTop: 16 }}>
          <Disclosure title="What will and won't be shared" icon="info">
            <div className="stack-12">
              <div>
                <div style={{ fontWeight: 600, color: 'var(--aegis-ink-dark)', marginBottom: 6 }}>What will be shared</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Safety alerts</li>
                  <li>Bracelet worn / not worn status</li>
                  <li>Battery and connection status</li>
                  <li>Daily movement summaries if enabled</li>
                  <li>Location only according to selected privacy settings</li>
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--aegis-ink-dark)', marginBottom: 6 }}>What will not be shared</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Continuous raw sensor streams</li>
                  <li>Public location</li>
                  <li>Medical diagnosis</li>
                  <li>Data for advertising</li>
                </ul>
              </div>
            </div>
          </Disclosure>
        </div>

        <label className="row" style={{ marginTop: 16, cursor: 'pointer' }}>
          <Toggle on={consent.older} onChange={v => setConsent(c => ({ ...c, older: v }))} />
          <span style={{ fontSize: 14, color: 'var(--aegis-ink-dark)' }}>Margaret agrees to the terms above.</span>
        </label>
      </Card>

      {/* B. Caregiver acknowledgement */}
      <Card>
        <div className="kicker" style={{ marginBottom: 8 }}>B · Caregiver acknowledgement</div>
        <div style={{ fontSize: 16, color: 'var(--aegis-ink-dark)', lineHeight: 1.55 }}>
          "I understand that AEGIS is a safety aid, not a medical
          diagnosis system, and that alerts may require human confirmation."
        </div>

        <div style={{ marginTop: 16 }}>
          <Disclosure title="What you should know before using AEGIS" icon="shield-check">
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>AEGIS detects possible safety events, not confirmed medical emergencies.</li>
              <li>Fall alerts may be false positives and require human confirmation.</li>
              <li>If you do not respond, alerts may be escalated to another trusted caregiver.</li>
              <li>Emergency services should be contacted directly when there is immediate concern.</li>
            </ul>
          </Disclosure>
        </div>

        <label className="row" style={{ marginTop: 16, cursor: 'pointer' }}>
          <Toggle on={consent.caregiver} onChange={v => setConsent(c => ({ ...c, caregiver: v }))} />
          <span style={{ fontSize: 14, color: 'var(--aegis-ink-dark)' }}>I acknowledge and accept.</span>
        </label>
      </Card>
    </div>
  </>
);

const StepThree = ({ privacy, setPrivacy }) => (
  <>
    <h1 style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500,
      fontSize: 32, letterSpacing: '-0.4px', margin: '0 0 8px',
    }}>Initial privacy choices</h1>
    <p style={{ color: 'var(--aegis-muted-plum)', fontSize: 15, margin: '0 0 24px' }}>
      You and Margaret can change these any time in Settings.
    </p>

    <Card>
      <SettingRow
        title="Share location only during alerts"
        desc="Location stays hidden during normal use; revealed only when a safety event is active."
      >
        <Toggle on={privacy.locationDuringAlerts} onChange={v => setPrivacy(p => ({ ...p, locationDuringAlerts: v }))} />
      </SettingRow>
      <SettingRow
        title="Allow daily movement summary"
        desc="A small overview of steps, rest, and activity patterns."
      >
        <Toggle on={privacy.dailyMovement} onChange={v => setPrivacy(p => ({ ...p, dailyMovement: v }))} />
      </SettingRow>
      <SettingRow
        title="Allow device status notifications"
        desc="Battery, connection, and bracelet worn/not worn updates."
      >
        <Toggle on={privacy.deviceStatus} onChange={v => setPrivacy(p => ({ ...p, deviceStatus: v }))} />
      </SettingRow>
      <SettingRow
        title="Allow false-alarm feedback"
        desc="When you mark an alert as a false alarm, the labelled event may be used to refine thresholds in future versions. Prototype only — no model is trained today."
      >
        <Toggle on={privacy.falseAlarmFeedback} onChange={v => setPrivacy(p => ({ ...p, falseAlarmFeedback: v }))} />
      </SettingRow>
    </Card>
  </>
);

Object.assign(window, { OnboardingView });
