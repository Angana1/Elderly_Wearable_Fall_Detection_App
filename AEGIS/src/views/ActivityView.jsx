// Activity & Trends — daily movement chart, rest pattern

const ActivityView = ({
  scenario, onScenarioChange, onLogout,
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => {
  const s = SCENARIOS[scenario];
  const todaySteps = s.steps;

  // Add today's steps as the last bar
  const bars = ACTIVITY_WEEK.map((d, i) => {
    if (i === ACTIVITY_WEEK.length - 1) return { ...d, steps: todaySteps, isToday: true };
    return d;
  });
  const max = Math.max(...bars.map(b => b.steps || 0), 4500);

  const patternText = scenario === 'normal'
    ? "Margaret is moving within her usual range today."
    : scenario === 'low'
      ? "Today is 38% below Margaret's usual daytime pattern. No fall-like impact detected."
      : "Today's activity dropped after a fall-like event at 14:32. Pre-event movement was within usual range.";

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
        <h1>Activity &amp; trends</h1>
        <div className="sub">
          AEGIS compares Margaret with her own usual pattern — not with other people.
        </div>
        <div style={{ fontSize: 12, color: 'var(--aegis-muted-plum)', fontStyle: 'italic', marginTop: 6 }}>
          Prototype — values are illustrative.
        </div>
      </div>

      {/* Headline numbers */}
      <div className="grid-3">
        <Card>
          <div className="metric-label">Today's movement</div>
          <div className="metric-num">{todaySteps.toLocaleString()}</div>
          <div className="metric-sub">steps so far</div>
        </Card>
        <Card>
          <div className="metric-label">Weekly average</div>
          <div className="metric-num">{WEEKLY_AVERAGE.toLocaleString()}</div>
          <div className="metric-sub">steps per day · last 7 days</div>
        </Card>
        <Card>
          <div className="metric-label">Pattern</div>
          <div className="metric-num" style={{
            color: scenario === 'low' ? 'var(--aegis-warning-amber)'
                  : scenario === 'fall' ? 'var(--aegis-clay)'
                  : 'var(--aegis-safe-green)',
            fontSize: 22,
          }}>
            {scenario === 'low' ? '38% below' : scenario === 'fall' ? 'Post-event' : 'Within usual'}
          </div>
          <div className="metric-sub">vs. Margaret's usual range</div>
        </Card>
      </div>

      {/* Chart */}
      <SectionHead title="7-day movement" sub={patternText} />
      <Card>
        <div className="bar-chart">
          {bars.map(b => {
            const h = b.steps ? Math.max(8, (b.steps / max) * 180) : 8;
            const isLow = b.steps && b.steps < 2000;
            return (
              <div key={b.day} className="bar-chart__col">
                <span style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                  <span
                    className={`bar-chart__bar ${b.isToday ? 'bar-chart__bar--today' : ''} ${isLow ? 'bar-chart__bar--low' : ''}`}
                    style={{ height: h }}
                    title={`${b.day}: ${b.steps ? b.steps.toLocaleString() + ' steps' : '—'}`}
                  />
                </span>
                <span className="bar-chart__value">{b.steps ? b.steps.toLocaleString() : '—'}</span>
                <span className="bar-chart__label">
                  {b.day}{b.isToday ? ' · today' : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className="row" style={{ marginTop: 18, gap: 18, fontSize: 13, color: 'var(--aegis-muted-plum)' }}>
          <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--aegis-clay-soft)' }} /> Past days</span>
          <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--aegis-clay)' }} /> Today</span>
          <span className="row" style={{ gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--aegis-warning-amber)' }} /> Low activity day</span>
        </div>
      </Card>

      <SectionHead title="Daytime inactivity" />
      <div className="grid-2">
        <Card>
          <div className="metric-label">Longest inactive period today</div>
          <div className="metric-num">
            {scenario === 'normal' ? '34 min' : scenario === 'low' ? '3h 45m' : '1h 12m'}
          </div>
          <div className="metric-sub">
            {scenario === 'normal' ? 'Mid-morning rest in armchair' : scenario === 'low' ? 'Continuous from 10:25' : 'Around midday, before event'}
          </div>
        </Card>
        <Card>
          <div className="metric-label">Low-activity days this month</div>
          <div className="metric-num">3</div>
          <div className="metric-sub">Friday, May 8 · Tuesday, May 12 · Sunday, May 17</div>
        </Card>
      </div>

      {/* Rest pattern */}
      <SectionHead title="Rest pattern" sub="Overnight movement within Margaret's scheduled rest window." />
      <Card tone="dark">
        <div className="grid-3">
          <DarkMetric label="Sleep / rest window" value="22:00 – 07:00" />
          <DarkMetric label="Overnight rest"      value="Normal" tone="green" />
          <DarkMetric label="Unusual overnight movement" value="None" tone="green" />
        </div>
        <div style={{
          marginTop: 20, paddingTop: 18,
          borderTop: '1px solid rgba(255,248,239,0.08)',
          color: 'var(--aegis-on-dark-muted)',
          fontSize: 14, lineHeight: 1.6,
        }}>
          AEGIS does not measure clinical sleep. It only summarizes overnight movement during
          Margaret's scheduled rest window. Night inactivity is not treated as an alert
          unless a fall-like impact is detected.
        </div>
      </Card>

      <div style={{ height: 40 }} />
    </div>
  );
};

const DarkMetric = ({ label, value, tone }) => (
  <div>
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
      color: 'var(--aegis-on-dark-muted)',
    }}>{label}</div>
    <div style={{
      fontSize: 22, fontWeight: 600, marginTop: 6,
      color: tone === 'green' ? '#9ec9b3' : 'var(--aegis-on-dark)',
      fontFamily: 'var(--font-sans)',
    }}>{value}</div>
  </div>
);

Object.assign(window, { ActivityView });
