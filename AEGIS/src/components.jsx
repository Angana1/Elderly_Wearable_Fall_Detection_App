// Shared primitives — Icon, Button, Card, Pill, Toggle, Avatar, Field, SectionHead
// Each Babel script file is its own scope — we export to window at the bottom.

// Icon — uses a React-owned <span> wrapper so React doesn't fight Lucide
// when Lucide swaps the inner SVG out of place.
const Icon = ({ name, size = 20, color, style }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const ic = window.lucide && window.lucide.icons;
    if (!ic) return;
    // Lucide exports icon names in PascalCase keys
    const pascal = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    const def = ic[pascal] || ic[name];
    if (def && def.toSvg) {
      node.innerHTML = def.toSvg({ 'stroke-width': 1.75, width: size, height: size });
    } else if (window.lucide && window.lucide.createIcons) {
      // Fallback — create a child <i> and let lucide replace it (still inside our span)
      node.innerHTML = `<i data-lucide="${name}"></i>`;
      window.lucide.createIcons({ icons: window.lucide.icons });
    }
  }, [name, size]);
  return (
    <span
      ref={ref}
      style={{
        width: size, height: size, color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, ...style,
      }}
    />
  );
};

const Card = ({ tone = 'default', className = '', style, children, ...rest }) => {
  const cls = ['card', tone !== 'default' && `card--${tone}`, className].filter(Boolean).join(' ');
  return <div className={cls} style={style} {...rest}>{children}</div>;
};

const Button = ({ variant = 'clay', icon, iconRight, size, block, children, onClick, style, type = 'button', disabled }) => {
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block'].filter(Boolean).join(' ');
  return (
    <button type={type} className={cls} onClick={onClick} style={style} disabled={disabled}>
      {icon && <Icon name={icon} size={16} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={16} />}
    </button>
  );
};

const Pill = ({ tone = 'neutral', dot = false, icon, children }) => (
  <span className={`pill pill--${tone}`}>
    {dot && <span className="dot" />}
    {icon && <Icon name={icon} size={12} />}
    {children}
  </span>
);

const Toggle = ({ on, onChange }) => (
  <div
    className={`toggle ${on ? 'is-on' : ''}`}
    onClick={() => onChange && onChange(!on)}
    role="switch"
    aria-checked={on}
  />
);

const Avatar = ({ initials, color = 'var(--aegis-clay)', size = 40 }) => (
  <div
    className="avatar"
    style={{
      width: size, height: size,
      background: color, color: '#fff',
      fontSize: Math.round(size * 0.42),
    }}
  >
    {initials}
  </div>
);

const Field = ({ label, hint, children }) => (
  <div className="field">
    {label && <label className="field__label">{label}</label>}
    {children}
    {hint && <div className="field__hint">{hint}</div>}
  </div>
);

const SectionHead = ({ title, sub, action }) => (
  <div className="section-head">
    <div>
      <h2>{title}</h2>
      {sub && <div className="sub" style={{ marginTop: 4 }}>{sub}</div>}
    </div>
    {action}
  </div>
);

// Disclosure (expandable panel) — controlled or uncontrolled
const Disclosure = ({ title, defaultOpen = false, children, icon }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={`disclosure ${open ? 'is-open' : ''}`}>
      <button className="disclosure__head" onClick={() => setOpen(!open)}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
          {icon && <Icon name={icon} size={18} color="var(--aegis-muted-plum)" />}
          {title}
        </span>
        <Icon name="chevron-down" size={18} style={{ flexShrink: 0 }} className="disclosure__icon" />
      </button>
      {open && <div className="disclosure__body">{children}</div>}
    </div>
  );
};

// Setting row — title + description + control
const SettingRow = ({ title, desc, children }) => (
  <div className="setting-row">
    <div className="setting-row__main">
      <div className="setting-row__title">{title}</div>
      {desc && <div className="setting-row__desc">{desc}</div>}
    </div>
    {children}
  </div>
);

// Segmented control
const Segmented = ({ options, value, onChange }) => (
  <div className="segmented">
    {options.map(o => (
      <button
        key={o.value}
        className={`segmented__opt ${value === o.value ? 'is-active' : ''}`}
        onClick={() => onChange(o.value)}
        type="button"
      >
        {o.label}
      </button>
    ))}
  </div>
);

Object.assign(window, {
  Icon, Card, Button, Pill, Toggle, Avatar, Field, SectionHead,
  Disclosure, SettingRow, Segmented,
});
