// TopBar — kicker label + demo switcher + sensor-upload control (right)

const TopBar = ({
  kicker = 'Caregiver dashboard',
  scenario, onChangeScenario,
  onLogout,
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => (
  <div className="topbar">
    <div className="row" style={{ gap: 10 }}>
      <div className="topbar__title">{kicker}</div>
      {uploadStatus && uploadStatus !== 'idle' && (
        <UploadStatusChip status={uploadStatus} fileName={uploadFileName} error={uploadError} onClear={onClearUpload} />
      )}
    </div>
    <div className="topbar__right">
      {onUploadFile && <UploadButton onUpload={onUploadFile} status={uploadStatus} />}
      <DemoSwitcher scenario={scenario} onChange={onChangeScenario} />
      {onLogout && (
        <button
          className="btn btn--secondary btn--sm"
          onClick={onLogout}
          title="Sign out (returns to welcome)"
        >
          <Icon name="log-out" size={14} />
        </button>
      )}
    </div>
  </div>
);

const UploadButton = ({ onUpload, status }) => {
  const inputRef = React.useRef(null);
  const busy = status === 'analyzing';
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,text/plain,.csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) onUpload(f);
          e.target.value = '';
        }}
      />
      <button
        className="demo-switcher__btn"
        onClick={() => inputRef.current && inputRef.current.click()}
        disabled={busy}
        title="Upload sensor data (.txt) — runs through your fall-detection model"
        style={busy ? { opacity: 0.7, cursor: 'wait' } : null}
      >
        <Icon name={busy ? 'loader-2' : 'upload'} size={14} color="var(--aegis-muted-plum)" style={busy ? { animation: 'spin 1s linear infinite' } : null} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--aegis-ink-dark)' }}>
          {busy ? 'Analyzing…' : 'Upload sensor data'}
        </span>
      </button>
    </>
  );
};

const UploadStatusChip = ({ status, fileName, error, onClear }) => {
  const tone =
    status === 'fall' ? 'red' :
    status === 'no-fall' ? 'green' :
    status === 'error' ? 'amber' :
    'neutral';
  const icon =
    status === 'fall' ? 'alert-triangle' :
    status === 'no-fall' ? 'check-circle-2' :
    status === 'error' ? 'alert-circle' :
    'file-text';
  const label =
    status === 'fall' ? 'Fall detected' :
    status === 'no-fall' ? 'No fall in file' :
    status === 'error' ? (error || 'Upload failed') :
    fileName || '';
  return (
    <span className="row" style={{ gap: 8 }}>
      <Pill tone={tone} icon={icon}>
        <span style={{ fontSize: 11, letterSpacing: 0.3 }}>{label}</span>
        {fileName && status !== 'error' && status !== 'analyzing' && (
          <span style={{ opacity: 0.7, marginLeft: 4, fontWeight: 400 }}>· {fileName}</span>
        )}
      </Pill>
      {onClear && status !== 'analyzing' && (
        <button
          onClick={onClear}
          title="Clear upload result"
          style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            color: 'var(--aegis-muted-plum)', padding: 2, display: 'inline-flex',
          }}
        >
          <Icon name="x" size={12} />
        </button>
      )}
    </span>
  );
};

Object.assign(window, { TopBar });
