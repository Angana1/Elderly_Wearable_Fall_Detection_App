// Demo scenario switcher — small dropdown for prototype use

const DemoSwitcher = ({ scenario, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const current = SCENARIOS[scenario];

  const options = [
    { key: 'normal', name: 'Normal day',    sub: "Margaret's usual pattern.",        color: 'var(--aegis-safe-green)' },
    { key: 'low',    name: 'Low activity',  sub: 'Lower than her usual daytime.',    color: 'var(--aegis-warning-amber)' },
    { key: 'fall',   name: 'Possible fall', sub: 'Fall-like pattern at 14:32.',      color: 'var(--aegis-clay)' },
  ];

  return (
    <div className="demo-switcher" ref={ref}>
      <button className="demo-switcher__btn" onClick={() => setOpen(!open)}>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
          color: 'var(--aegis-muted-plum)',
        }}>Prototype demo</span>
        <span style={{ width: 1, height: 14, background: 'var(--aegis-divider)' }} />
        <span className="dot" style={{ background: current.color }} />
        <span>{current.label}</span>
        <Icon name="chevron-down" size={14} color="var(--aegis-muted-plum)" />
      </button>
      {open && (
        <div className="demo-switcher__panel">
          <div className="demo-switcher__title">Select simulated scenario</div>
          {options.map(o => (
            <button
              key={o.key}
              className={`demo-switcher__opt ${scenario === o.key ? 'is-active' : ''}`}
              onClick={() => { onChange(o.key); setOpen(false); }}
            >
              <span className="dot" style={{ background: o.color }} />
              <div style={{ flex: 1 }}>
                <div className="demo-switcher__opt-name">{o.name}</div>
                <div className="demo-switcher__opt-sub">{o.sub}</div>
              </div>
              {scenario === o.key && <Icon name="check" size={16} color="var(--aegis-deep-green)" style={{ marginTop: 5 }} />}
            </button>
          ))}
          <div style={{
            fontSize: 11, color: 'var(--aegis-muted-soft)',
            padding: '10px 10px 4px', lineHeight: 1.5,
          }}>
            Demo data only. AEGIS is a safety aid, not a medical device.
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { DemoSwitcher });
