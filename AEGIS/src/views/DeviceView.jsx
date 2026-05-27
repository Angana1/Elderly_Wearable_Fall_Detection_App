// Device / Bracelet — device info, sensor explanation, product family

const DeviceView = ({
  scenario, onScenarioChange, onLogout,
  uploadStatus, uploadFileName, uploadError, onUploadFile, onClearUpload,
}) => {
  const s = SCENARIOS[scenario];
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
        <h1>The bracelet</h1>
        <div className="sub">
          A single discreet device. Small sensors working together to support safety alerts, not a diagnosis.
        </div>
      </div>

      {/* Device hero */}
      <Card tone="dark" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0 }}>
          <div className="bracelet-art" style={{ borderRadius: 0 }} />
          <div style={{ padding: 32 }}>
            <div className="kicker" style={{ color: 'var(--aegis-on-dark-muted)' }}>AEGIS Bracelet</div>
            <h2 style={{
              fontFamily: 'var(--font-serif)', fontWeight: 500,
              fontSize: 32, color: 'var(--aegis-on-dark)', margin: '8px 0 4px',
            }}>Connected to Margaret Wilson</h2>
            <div style={{ color: 'var(--aegis-on-dark-muted)', fontSize: 14 }}>
              Device <span style={{ fontFamily: 'var(--font-mono)' }}>AGS-R80226</span> · Firmware 1.4.2
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20,
              marginTop: 24, paddingTop: 24,
              borderTop: '1px solid rgba(255,248,239,0.08)',
            }}>
              <DarkLine label="Battery"          value={`${s.battery}%`} />
              <DarkLine label="Charging estimate" value="≈ 2 days remaining" />
              <DarkLine label="Connection"       value="Connected" />
              <DarkLine label="Last sync"        value="< 1 min ago" />
              <DarkLine label="Bracelet status"  value="Worn" />
              <DarkLine label="PPG signal"       value="Available" />
              <DarkLine label="Bluetooth"        value="Paired" />
              <DarkLine label="Cloud sync"       value="Active" />
            </div>
          </div>
        </div>
      </Card>

      {/* Sensor explanation */}
      <SectionHead
        title="How the sensors work together"
        sub="No single signal triggers a possible fall. AEGIS looks for a combination across movement, orientation, inactivity, wear status, and location context."
      />
      <div className="grid-3">
        <SensorCard icon="activity" name="Accelerometer"     desc="Detects sudden impact and movement intensity." />
        <SensorCard icon="rotate-3d" name="Gyroscope"        desc="Detects orientation and rotation changes during a fall-like event." />
        <SensorCard icon="heart-pulse" name="PPG / heart rate" desc="Helps confirm the bracelet is worn and provides contextual heart-rate signal." />
        <SensorCard icon="map-pin" name="GPS"                desc="Provides location context when enabled — never used as a fall trigger on its own." />
        <SensorCard icon="bluetooth" name="Bluetooth & cloud" desc="Keeps the bracelet connected so events reach you in real time." />
        <SensorCard icon="battery-charging" name="Battery & charging" desc="Reports battery and charge state so the device stays reliable." />
      </div>

      <div className="note" style={{ marginTop: 18 }}>
        If no heart-rate signal is detected, AEGIS marks the bracelet as possibly not worn
        rather than triggering a medical alert.
      </div>

      {/* Product family */}
      <SectionHead
        title="The AEGIS family"
        sub="The bracelet is the only prototype demonstrated in this dashboard."
      />
      <div className="grid-3">
        <FamilyCard
          icon="watch"
          name="Bracelet"
          status="In this prototype"
          desc="Full prototype functionality — possible fall detection, activity, rest pattern, and device status."
          active
        />
        <FamilyCard
          icon="gem"
          name="Necklace"
          status="Future concept"
          desc="Pendant with a simpler set of safety signals for people who prefer not to wear a wrist device."
        />
        <FamilyCard
          icon="sparkle"
          name="Earrings"
          status="Future concept"
          desc="Discreet exploration of near-invisible passive monitoring."
        />
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
};

const DarkLine = ({ label, value }) => (
  <div>
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
      color: 'var(--aegis-on-dark-muted)',
    }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4, color: 'var(--aegis-on-dark)' }}>{value}</div>
  </div>
);

const SensorCard = ({ icon, name, desc }) => (
  <Card>
    <div className="row" style={{ gap: 12 }}>
      <span style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'var(--aegis-clay-soft)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={18} color="var(--aegis-clay-active)" />
      </span>
      <div style={{ fontWeight: 600, fontSize: 16 }}>{name}</div>
    </div>
    <div style={{ marginTop: 12, fontSize: 14, color: 'var(--aegis-ink-soft)', lineHeight: 1.55 }}>
      {desc}
    </div>
  </Card>
);

const FamilyCard = ({ icon, name, status, desc, active }) => (
  <Card
    style={active ? {
      background: 'var(--aegis-clay-soft)',
      borderColor: 'transparent',
    } : { borderStyle: 'dashed' }}
  >
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span style={{
        width: 44, height: 44, borderRadius: 12,
        background: active ? 'rgba(255,255,255,0.7)' : 'var(--aegis-surface-raised)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={20} color={active ? 'var(--aegis-clay-active)' : 'var(--aegis-muted-plum)'} />
      </span>
      <Pill tone={active ? 'clay-soft' : 'neutral'}>
        <span style={{ color: active ? 'var(--aegis-clay-active)' : undefined }}>{status}</span>
      </Pill>
    </div>
    <div style={{
      fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: 22,
      letterSpacing: '-0.2px', marginTop: 16,
      color: active ? 'var(--aegis-clay-active)' : 'var(--aegis-ink-dark)',
    }}>
      {name}
    </div>
    <div style={{
      fontSize: 14, color: active ? 'var(--aegis-clay-active)' : 'var(--aegis-ink-soft)',
      marginTop: 8, lineHeight: 1.55,
      opacity: active ? 0.9 : 1,
    }}>{desc}</div>
  </Card>
);

Object.assign(window, { DeviceView });
