// Location — shows location info, not settings (settings live in Settings page)

const LocationView = ({
  scenario, alertState, onScenarioChange, onLogout, onNavigate,
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => {
  const [revealed, setRevealed] = React.useState(false);
  const activeAlert = scenario === 'fall' && alertState === 'active';

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
        <h1>Location</h1>
        <div className="sub">
          Margaret's location stays private. It is revealed only when a safety event is active,
          and only to authorized caregivers.
        </div>
      </div>

      {/* Status strip */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <Card>
          <div className="metric-label">Current sharing mode</div>
          <div style={{ marginTop: 8 }}>
            <Pill tone="neutral" dot>During alerts only</Pill>
          </div>
          <div className="metric-sub" style={{ marginTop: 10 }}>
            Change in <a style={{ color: 'var(--aegis-deep-green)', cursor: 'pointer' }} onClick={() => onNavigate('settings')}>Settings · Location sharing</a>
          </div>
        </Card>
        <Card>
          <div className="metric-label">Last known safe area</div>
          <div className="metric-num" style={{ fontSize: 22 }}>Home</div>
          <div className="metric-sub">General area only — no room-level detail.</div>
        </Card>
        <Card>
          <div className="metric-label">Last verified</div>
          <div className="metric-num" style={{ fontSize: 22 }}>
            {scenario === 'fall' ? '2 min ago' : '4 min ago'}
          </div>
          <div className="metric-sub">From bracelet GPS &amp; home network</div>
        </Card>
      </div>

      {/* Main panel — conditional on alert */}
      {activeAlert ? (
        <Card tone="dark" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 28 }}>
            <div className="row" style={{ gap: 10 }}>
              <span className="pulse-dot" style={{ background: 'var(--aegis-clay)' }} />
              <span style={{
                fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                color: 'var(--aegis-on-dark-muted)',
              }}>Active possible fall · 14:32</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 30,
              margin: '12px 0 8px', color: 'var(--aegis-on-dark)',
            }}>
              Location available for this safety event.
            </h2>
            <p style={{ color: 'var(--aegis-on-dark-muted)', maxWidth: 520, margin: 0 }}>
              Because a safety event is active, you can reveal Margaret's location.
              It will be hidden again once the alert is resolved.
            </p>
            {!revealed ? (
              <div style={{ marginTop: 18 }}>
                <Button variant="action" icon="map-pin" onClick={() => setRevealed(true)}>
                  View location for active alert
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: 18 }}>
                <Button variant="on-dark" icon="eye-off" onClick={() => setRevealed(false)}>
                  Hide location
                </Button>
              </div>
            )}
          </div>

          {revealed && (
            <div style={{ padding: '0 28px 28px' }}>
              <div className="map-surface" />
              <div className="row" style={{ marginTop: 16, gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(255,248,239,0.10)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="map-pin" size={18} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--aegis-on-dark)', fontWeight: 600 }}>
                    Event location: Home
                  </div>
                  <div style={{ color: 'var(--aegis-on-dark-muted)', fontSize: 13, marginTop: 2 }}>
                    Room estimate: bathroom · location unchanged since event
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <div className="row" style={{ gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'var(--aegis-surface-raised)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="lock" size={20} color="var(--aegis-muted-plum)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--aegis-ink-dark)' }}>
                Location is hidden outside safety events.
              </div>
              <div style={{ color: 'var(--aegis-muted-plum)', fontSize: 14, marginTop: 4, lineHeight: 1.55 }}>
                Margaret's bracelet only shares location when a safety event is active.
                You'll see her general safe area, and may reveal more detail by tapping.
              </div>
            </div>
          </div>
        </Card>
      )}

      <SectionHead title="Recent location events" sub="Only times location was revealed appear here." />
      <div className="stack-12">
        <RecentLocationRow
          time="Sunday · 09:42"
          summary="Location revealed during possible-fall alert."
          area="Home · garden"
          status="Marked as false alarm by Anna"
        />
        <RecentLocationRow
          time="May 8 · 17:22"
          summary="Location revealed during low-activity check."
          area="Home"
          status="Resolved by Anna"
        />
      </div>

      <div className="note" style={{ marginTop: 18 }}>
        Location is shared only with authorized family members / caregivers and
        according to Margaret's selected sharing preference.
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

const RecentLocationRow = ({ time, summary, area, status }) => (
  <div className="alert-row">
    <div className="alert-row__icon alert-row__icon--gray">
      <Icon name="map-pin" size={20} />
    </div>
    <div>
      <div className="alert-row__title">{area}</div>
      <div className="alert-row__meta">{time}</div>
      <div className="alert-row__summary">{summary}</div>
      <div className="alert-row__resolution">{status}</div>
    </div>
    <div />
  </div>
);

Object.assign(window, { LocationView });
