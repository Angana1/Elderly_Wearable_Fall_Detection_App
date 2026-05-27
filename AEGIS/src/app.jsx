// AEGIS root app — handles auth flow + main routing + global scenario state

const { useState, useEffect } = React;

const App = () => {
  // Stage: pre-app screens or main app
  const [stage, setStage] = useState('login'); // 'login' | 'onboarding' | 'pair' | 'app'
  const [view, setView] = useState('home');
  const [settingsTab, setSettingsTab] = useState('alerts');
  const [showMore, setShowMore] = useState(false);

  // Scenario + alert state
  const [scenario, setScenario] = useState('normal'); // 'normal' | 'low' | 'fall'
  const [alertState, setAlertState] = useState('active'); // 'active' | 'resolved-ok' | 'resolved-false'

  // Backend upload state
  // status:  'idle' | 'analyzing' | 'fall' | 'no-fall' | 'error'
  const [upload, setUpload] = useState({ status: 'idle', fileName: null, error: null, confidence: null, source: null });

  // Endpoint — override via window.AEGIS_BACKEND_URL or query string ?backend=
  const backendUrl = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('backend') || window.AEGIS_BACKEND_URL || 'http://localhost:5000/predict';
  }, []);

  const handleUploadFile = async (file) => {
    setUpload({ status: 'analyzing', fileName: file.name, error: null, confidence: null, source: null });
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(backendUrl, { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();

      // Accept several shapes — pick the most likely keys
      const fall = data.fall_detected ?? data.fall ?? data.prediction ?? data.label;
      let conf = data.confidence ?? data.probability ?? data.prob ?? data.score ?? data.percent;
      if (typeof conf === 'number' && conf <= 1) conf = conf * 100;
      const confPct = typeof conf === 'number' ? Math.round(conf * 10) / 10 : null;
      const isFall = fall === 1 || fall === true || fall === '1' || fall === 'fall';

      if (isFall) {
        setUpload({ status: 'fall', fileName: file.name, error: null, confidence: confPct, source: 'sensor file' });
        setScenario('fall');
        setAlertState('active');
        setView('home');
      } else {
        // No fall — keep the dashboard in Normal Day mode
        setUpload({ status: 'no-fall', fileName: file.name, error: null, confidence: confPct, source: 'sensor file' });
        setScenario('normal');
        setAlertState('active');
      }
    } catch (e) {
      setUpload({
        status: 'error',
        fileName: file.name,
        error: e.message.includes('Failed to fetch')
          ? 'Cannot reach backend — start the server and enable CORS.'
          : e.message,
        confidence: null,
        source: null,
      });
    }
  };

  const clearUpload = () => setUpload({ status: 'idle', fileName: null, error: null, confidence: null, source: null });

  // Reset alert state to 'active' whenever scenario flips to 'fall'
  useEffect(() => {
    if (scenario === 'fall') setAlertState('active');
  }, [scenario]);

  // Re-create Lucide icons on every meaningful state change
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  // Compute alert count for nav badge
  const alertCount =
    (scenario === 'fall' && alertState === 'active' ? 1 : 0) +
    (scenario === 'low' ? 1 : 0);

  const goTo = (v, sub) => {
    setView(v);
    if (v === 'settings' && sub) setSettingsTab(sub);
    setShowMore(false);
  };

  // ----- pre-app screens -----
  if (stage === 'login') {
    return (
      <LoginView
        onSignIn={() => setStage('app')}
        onCreate={() => setStage('onboarding')}
        onDemo={() => setStage('app')}
      />
    );
  }
  if (stage === 'onboarding') {
    return (
      <OnboardingView
        onBack={() => setStage('login')}
        onComplete={() => setStage('pair')}
      />
    );
  }
  if (stage === 'pair') {
    return (
      <PairView
        onBack={() => setStage('onboarding')}
        onContinue={() => setStage('app')}
      />
    );
  }

  // ----- main app -----
  const commonProps = {
    scenario,
    alertState,
    onScenarioChange: setScenario,
    onLogout: () => { setStage('login'); setView('home'); setScenario('normal'); setAlertState('active'); clearUpload(); },
    onNavigate: goTo,
    // Upload props forwarded to every view's TopBar
    uploadStatus: upload.status,
    uploadFileName: upload.fileName,
    uploadError: upload.error,
    uploadConfidence: upload.confidence,
    onUploadFile: handleUploadFile,
    onClearUpload: clearUpload,
  };

  return (
    <div className="app">
      <Sidebar
        active={view}
        onNavigate={goTo}
        alertCount={alertCount}
      />
      <main className="main">
        <div className="main__inner">
          {view === 'home' && (
            <HomeView
              {...commonProps}
              onResolveOk={() => { setAlertState('resolved-ok'); }}
              onMarkFalseAlarm={() => { setAlertState('resolved-false'); }}
            />
          )}
          {view === 'alerts'   && <AlertsView   {...commonProps} />}
          {view === 'activity' && <ActivityView {...commonProps} />}
          {view === 'location' && <LocationView {...commonProps} />}
          {view === 'ask'      && <AskView      {...commonProps} />}
          {view === 'device'   && <DeviceView   {...commonProps} />}
          {view === 'settings' && <SettingsView {...commonProps} initialTab={settingsTab} />}
        </div>
      </main>

      <BottomNav
        active={view}
        onNavigate={goTo}
        alertCount={alertCount}
        onOpenMore={() => setShowMore(true)}
      />

      {showMore && <MoreSheet onClose={() => setShowMore(false)} onNavigate={goTo} />}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
