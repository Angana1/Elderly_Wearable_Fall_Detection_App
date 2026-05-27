// Sidebar (desktop) + BottomNav (mobile)

const NAV = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'alerts',   label: 'Alerts',   icon: 'bell' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
  { id: 'location', label: 'Location', icon: 'map-pin' },
  { id: 'ask',      label: 'Ask AEGIS', icon: 'sparkles' },
  { id: 'device',   label: 'Device',   icon: 'watch' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = ({ active, onNavigate, scenario, alertCount }) => (
  <aside className="sidebar">
    <div className="sidebar__brand">
      <LogoMark size={32} />
      <span className="sidebar__brand-name">AEGIS</span>
    </div>

    <div className="sidebar__group-label">Monitoring</div>
    {NAV.map(item => (
      <button
        key={item.id}
        className={`nav-item ${active === item.id ? 'is-active' : ''}`}
        onClick={() => onNavigate(item.id)}
      >
        <Icon name={item.icon} size={18} style={{ color: 'currentColor' }} />
        <span>{item.label}</span>
        {item.id === 'alerts' && alertCount > 0 && (
          <span className="nav-item__badge">{alertCount}</span>
        )}
      </button>
    ))}

    <div className="sidebar__footer">
      <Avatar initials="AW" size={36} />
      <div className="sidebar__footer-meta">
        <div className="sidebar__footer-name">Anna Wilson</div>
        <div className="sidebar__footer-sub">Primary caregiver</div>
      </div>
    </div>
  </aside>
);

// Mobile bottom nav — 4 main + More overlay
const MOBILE_NAV = [
  { id: 'home',     label: 'Home',     icon: 'home' },
  { id: 'alerts',   label: 'Alerts',   icon: 'bell' },
  { id: 'activity', label: 'Activity', icon: 'activity' },
  { id: 'location', label: 'Location', icon: 'map-pin' },
  { id: 'more',     label: 'More',     icon: 'menu' },
];

const BottomNav = ({ active, onNavigate, alertCount, onOpenMore }) => (
  <nav className="bottom-nav">
    <div className="bottom-nav__inner">
      {MOBILE_NAV.map(item => {
        const isActive = item.id === 'more'
          ? ['ask', 'device', 'settings'].includes(active) || active === 'more'
          : active === item.id;
        return (
          <button
            key={item.id}
            className={`bottom-nav__item ${isActive ? 'is-active' : ''}`}
            onClick={() => item.id === 'more' ? onOpenMore() : onNavigate(item.id)}
          >
            {item.id === 'alerts' && alertCount > 0 && (
              <span className="bottom-nav__badge">{alertCount}</span>
            )}
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

// More overlay sheet (mobile)
const MoreSheet = ({ onClose, onNavigate }) => (
  <div
    style={{
      position: 'fixed', inset: 0, zIndex: 40,
      background: 'rgba(25,25,34,0.32)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
    }}
    onClick={onClose}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: 'var(--aegis-surface-card)',
        borderRadius: '24px 24px 0 0',
        width: '100%',
        padding: 20,
        paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 32px rgba(25,25,34,0.18)',
      }}
    >
      <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--aegis-divider)', margin: '0 auto 16px' }} />
      <div style={{ display: 'grid', gap: 4 }}>
        {[
          { id: 'ask',      label: 'Ask AEGIS', icon: 'sparkles' },
          { id: 'device',   label: 'Device',    icon: 'watch' },
          { id: 'settings', label: 'Settings',  icon: 'settings' },
          { id: 'settings-consent', label: 'Privacy / Consent', icon: 'shield-check' },
        ].map(item => (
          <button
            key={item.id}
            className="nav-item"
            onClick={() => {
              if (item.id === 'settings-consent') onNavigate('settings', 'consent');
              else onNavigate(item.id);
              onClose();
            }}
          >
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
            <Icon name="chevron-right" size={16} style={{ marginLeft: 'auto', color: 'var(--aegis-muted-plum)' }} />
          </button>
        ))}
      </div>
    </div>
  </div>
);

Object.assign(window, { Sidebar, BottomNav, MoreSheet });
