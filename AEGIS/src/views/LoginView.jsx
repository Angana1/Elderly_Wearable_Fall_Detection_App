// Login / Welcome view

const LoginView = ({ onSignIn, onCreate, onDemo }) => (
  <div className="preapp">
    <div className="welcome-card">
      <LogoMark size={56} />
      <div className="welcome-card__title">AEGIS</div>
      <div className="welcome-card__tag">Quiet protection for independent aging.</div>
      <p className="welcome-card__body">
        Thank you for helping someone live safely and independently.
        AEGIS keeps essential safety signals close — possible falls,
        unusual inactivity, and device issues — without asking the
        older adult to manage an app.
      </p>
      <div className="welcome-card__actions">
        <Button variant="clay" size="lg" block onClick={onSignIn} icon="log-in">Sign in</Button>
        <Button variant="ghost" size="lg" block onClick={onCreate} icon="user-plus">Create account</Button>
        <Button variant="text" onClick={onDemo} style={{ alignSelf: 'center', marginTop: 6 }}>
          Open demo
          <Icon name="arrow-right" size={16} style={{ marginLeft: 6 }} />
        </Button>
      </div>
      <div className="welcome-card__footer">
        AEGIS is a safety and wellness aid, not a medical device.
      </div>
    </div>
  </div>
);

Object.assign(window, { LoginView });
