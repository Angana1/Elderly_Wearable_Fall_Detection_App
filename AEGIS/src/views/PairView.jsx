// Pair Bracelet view — QR / code / demo bracelet → success

const PairView = ({ onContinue, onBack }) => {
  const [stage, setStage] = React.useState('scan'); // 'scan' | 'manual' | 'pairing' | 'success'
  const [code, setCode] = React.useState('');

  const startPair = (mode) => {
    setStage('pairing');
    setTimeout(() => setStage('success'), 1600);
  };

  return (
    <div className="preapp" style={{ alignItems: 'flex-start', paddingTop: 48 }}>
      <div className="onboarding-shell">
        <div className="kicker" style={{ marginBottom: 8 }}>Pair Margaret's bracelet</div>
        {stage === 'scan' && <ScanStage onScan={() => startPair('qr')} onManual={() => setStage('manual')} onDemo={() => startPair('demo')} />}
        {stage === 'manual' && (
          <ManualStage
            code={code} setCode={setCode}
            onSubmit={() => startPair('manual')}
            onBack={() => setStage('scan')}
          />
        )}
        {stage === 'pairing' && <PairingStage />}
        {stage === 'success' && <SuccessStage onContinue={onContinue} />}
        {stage === 'scan' && (
          <div style={{ marginTop: 24 }}>
            <Button variant="text" icon="arrow-left" onClick={onBack}>Back</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const ScanStage = ({ onScan, onManual, onDemo }) => (
  <>
    <h1 style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500,
      fontSize: 32, letterSpacing: '-0.4px', margin: '6px 0 8px',
    }}>Connect the bracelet</h1>
    <p style={{ color: 'var(--aegis-muted-plum)', fontSize: 15, margin: '0 0 28px' }}>
      Scan the QR code inside the bracelet box or on the charging card.
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32, alignItems: 'center' }}>
      <div className="qr-card" style={{ position: 'relative' }}>
        <div className="qr-grid" />
        <span className="qr-corner" style={{ position: 'absolute', bottom: 20, left: 20 }} />
      </div>
      <div className="stack-12">
        <Button variant="clay" size="lg" icon="scan-line" onClick={onScan}>Scan QR</Button>
        <Button variant="ghost" size="lg" icon="keyboard" onClick={onManual}>Enter pairing code manually</Button>
        <Button variant="text" icon="zap" onClick={onDemo}>Use demo bracelet</Button>
      </div>
    </div>

    <div className="note" style={{ marginTop: 28 }}>
      The bracelet uses a one-time pairing code so only your account can connect to it.
      Margaret never needs to install an app.
    </div>
  </>
);

const ManualStage = ({ code, setCode, onSubmit, onBack }) => (
  <>
    <h1 style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500,
      fontSize: 32, letterSpacing: '-0.4px', margin: '6px 0 8px',
    }}>Enter pairing code</h1>
    <p style={{ color: 'var(--aegis-muted-plum)', fontSize: 15, margin: '0 0 24px' }}>
      The 8-character code is printed on the inside of the bracelet box.
    </p>
    <Field label="Pairing code">
      <input
        className="input"
        placeholder="AGS-XXXX-XXXX"
        value={code}
        onChange={e => setCode(e.target.value.toUpperCase())}
        style={{ letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}
      />
    </Field>
    <div className="row" style={{ marginTop: 20, gap: 10 }}>
      <Button variant="clay" onClick={onSubmit} disabled={code.length < 4}>Pair bracelet</Button>
      <Button variant="text" icon="arrow-left" onClick={onBack}>Back to scan</Button>
    </div>
  </>
);

const PairingStage = () => (
  <div style={{ textAlign: 'center', padding: '40px 0' }}>
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'var(--aegis-clay-soft)',
      margin: '0 auto 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'pulseRing 1.4s ease-out infinite',
    }}>
      <Icon name="bluetooth" size={32} color="var(--aegis-clay-active)" />
    </div>
    <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 28, margin: 0 }}>
      Pairing bracelet…
    </h2>
    <p style={{ color: 'var(--aegis-muted-plum)', marginTop: 8 }}>
      Hold the bracelet near your phone or computer.
    </p>
  </div>
);

const SuccessStage = ({ onContinue }) => (
  <div style={{ textAlign: 'center', padding: '32px 0 8px' }}>
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'var(--aegis-green-soft)',
      margin: '0 auto 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon name="check" size={36} color="var(--aegis-deep-green)" />
    </div>
    <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 30, margin: 0 }}>
      AEGIS Bracelet connected to Margaret Wilson.
    </h2>
    <p style={{ color: 'var(--aegis-muted-plum)', marginTop: 12, maxWidth: 460, marginInline: 'auto' }}>
      Device <span style={{ fontFamily: 'var(--font-mono)' }}>AGS-R80226</span> · Firmware 1.4.2 · Battery 78%
    </p>
    <div style={{ marginTop: 28 }}>
      <Button variant="clay" size="lg" onClick={onContinue} iconRight="arrow-right">
        Go to dashboard
      </Button>
    </div>
  </div>
);

Object.assign(window, { PairView });
