// AEGIS demo data — Margaret Wilson scenarios
// Single source of truth for the three scenarios

const DEMO_PERSON = {
  name: 'Margaret Wilson',
  firstName: 'Margaret',
  age: 78,
  living: 'Semi-independently at home',
  deviceId: 'AGS-R80226',
  firmware: '1.4.2',
};

const CAREGIVERS = [
  { id: 'anna',  name: 'Anna Wilson',   relation: 'Daughter', role: 'Primary caregiver', access: 'Full access',  phone: '+1 (415) 555 0142', initials: 'AW', color: 'var(--aegis-clay)' },
  { id: 'james', name: 'James Wilson',  relation: 'Son',      role: 'Secondary caregiver', access: 'Alerts only',  phone: '+1 (415) 555 0118', initials: 'JW', color: 'var(--aegis-deep-green)' },
  { id: 'patel', name: 'Dr. R. Patel',  relation: 'Care coordinator', role: '', access: 'Summary only', phone: '+1 (415) 555 0190', initials: 'RP', color: 'var(--aegis-location-bluegray)' },
];

const SCENARIOS = {
  normal: {
    key: 'normal',
    label: 'Normal day',
    sub: 'Margaret is moving within her usual pattern.',
    tone: 'safe',
    color: 'var(--aegis-safe-green)',
    title: 'All clear',
    message: 'Margaret is moving within her usual pattern.',
    actionNote: 'No action needed.',
    detail: {
      'Last movement':   '8 minutes ago',
      'Bracelet':        'Worn',
      'Activity today':  '3,420 steps',
      'Battery':         '78%',
    },
    heartRate: '72 bpm',
    battery: 78,
    steps: 3420,
    location: 'hidden',
  },
  low: {
    key: 'low',
    label: 'Low activity',
    sub: 'Activity is lower than usual today.',
    tone: 'low',
    color: 'var(--aegis-warning-amber)',
    title: 'Low activity',
    message: "Activity is lower than Margaret's usual daytime pattern. No fall-like impact detected.",
    actionNote: 'Suggested action: check in if inactivity continues.',
    detail: {
      'Last movement':   '3h 45m ago',
      'Activity today':  '1,120 steps',
      'Pattern':         '38% below usual',
      'Fall-like impact':'Not detected',
    },
    heartRate: '68 bpm',
    battery: 64,
    steps: 1120,
    location: 'hidden',
  },
  fall: {
    key: 'fall',
    label: 'Possible fall',
    sub: 'A fall-like pattern was detected at 14:32.',
    tone: 'alert',
    color: 'var(--aegis-clay)',
    title: 'Possible fall detected',
    message: 'AEGIS detected a fall-like movement pattern followed by no movement.',
    actionNote: 'Waiting for caregiver confirmation.',
    detail: {
      'Event time':    '14:32',
      'Last movement': 'Small movement 2 min ago',
      'Bracelet':      'Worn',
      'Status':        'Awaiting confirmation',
    },
    heartRate: '96 bpm',
    battery: 71,
    steps: 2840,
    location: 'event',
  },
};

const FALL_EXPLANATION = [
  { icon: 'activity',        label: 'Sudden acceleration spike detected' },
  { icon: 'rotate-3d',       label: 'Abrupt orientation change detected' },
  { icon: 'pause',           label: 'No movement for 90 seconds after event' },
  { icon: 'watch',           label: 'Bracelet still worn' },
  { icon: 'heart-pulse',     label: 'Heart-rate signal available' },
  { icon: 'map-pin',         label: 'Location unchanged after event' },
];

const FALL_TECHNICAL = [
  { sensor: 'Accelerometer', reading: 'Peak |a| 4.8 g · Δ 380 ms', note: 'Above impact-like threshold' },
  { sensor: 'Gyroscope',     reading: 'Δθ 112° in 220 ms',         note: 'Abrupt orientation change' },
  { sensor: 'Inactivity',    reading: '90 s post-event',           note: 'No further motion above noise floor' },
  { sensor: 'PPG / heart',   reading: '96 bpm, signal valid',      note: 'Bracelet confirmed worn' },
  { sensor: 'GPS',           reading: 'Stationary, last fix 1 m',   note: 'Location unchanged — contextual only' },
];

// Past alert history (Alerts page)
const ALERT_HISTORY = [
  {
    id: 'a1',
    type: 'fall',
    title: 'Possible fall',
    summary: 'Sudden impact during gardening. Marked as false alarm.',
    timeLabel: 'Sunday · 09:42',
    status: 'False alarm',
    statusTone: 'neutral',
    resolution: 'Resolved by Anna Wilson · "Margaret was gardening, slipped onto knees, no injury."',
    icon: 'activity',
    iconTone: 'gray',
  },
  {
    id: 'a2',
    type: 'low',
    title: 'Low daytime activity',
    summary: "Activity dropped below Margaret's usual pattern for over 3 hours.",
    timeLabel: 'Today · 11:10',
    status: 'Checked',
    statusTone: 'green',
    resolution: 'Resolved by Anna Wilson · "Called Margaret — she was reading."',
    icon: 'moon',
    iconTone: 'amber',
  },
  {
    id: 'a3',
    type: 'device',
    title: 'Bracelet not worn',
    summary: 'Bracelet removed for shower. Reconnected within an hour.',
    timeLabel: 'Saturday · 22:30',
    status: 'Resolved',
    statusTone: 'green',
    resolution: 'Auto-resolved when bracelet was put back on at 23:11.',
    icon: 'battery-low',
    iconTone: 'gray',
  },
];

// Daily activity bars (steps over 7 days)
const ACTIVITY_WEEK = [
  { day: 'Mon', steps: 3120 },
  { day: 'Tue', steps: 3540 },
  { day: 'Wed', steps: 2880 },
  { day: 'Thu', steps: 3680 },
  { day: 'Fri', steps: 1450 },
  { day: 'Sat', steps: 4020 },
  { day: 'Sun', steps: null }, // today, varies by scenario
];

const WEEKLY_AVERAGE = 3115;

// Prompt chips and pre-canned answers for Ask AEGIS
const ASK_PROMPTS = [
  'When was the last movement detected?',
  'Were there any possible fall alerts today?',
  'Was activity lower than usual this week?',
  'Did Margaret wear the bracelet today?',
  'Were there any device issues?',
  'Summarize Margaret\u2019s last 24 hours.',
  'Is location available for the current alert?',
];

const ASK_ANSWERS = (scenario) => ({
  'When was the last movement detected?': {
    normal: "Margaret's last movement was detected 8 minutes ago in the kitchen. Her bracelet is worn and connected.",
    low:    "Margaret's last movement was detected 3 hours 45 minutes ago. The bracelet is worn and connected; no fall-like impact has been detected.",
    fall:   "A small movement was detected 2 minutes ago. The most recent activity before that was the fall-like event at 14:32.",
  },
  'Were there any possible fall alerts today?': {
    normal: 'No possible fall alerts today. Margaret has been within her usual pattern.',
    low:    'No possible fall alerts today. There is one open low-activity alert from 11:10.',
    fall:   'Yes — one possible fall alert is currently active. It was detected at 14:32 and is awaiting your confirmation.',
  },
  'Was activity lower than usual this week?': {
    normal: "Activity this week is within Margaret's usual range. Friday was the quietest day at 1,450 steps.",
    low:    "Today is 38% below Margaret's usual daytime pattern. Friday was also lower than typical at 1,450 steps.",
    fall:   "Activity until 14:32 was within Margaret's usual range. Post-event movement is reduced, as expected after a possible fall.",
  },
  'Did Margaret wear the bracelet today?': {
    normal: 'Yes — the bracelet has been worn continuously since 07:14. PPG signal is steady and the device is connected.',
    low:    'Yes — the bracelet has been worn since 07:31. PPG signal is steady.',
    fall:   'Yes — the bracelet is worn and was confirmed worn throughout the fall-like event at 14:32.',
  },
  'Were there any device issues?': {
    normal: 'No device issues today. Battery is at 78% and connection is steady.',
    low:    'No device issues today. Battery is at 64%.',
    fall:   'No device issues. Battery is at 71% and the bracelet is connected.',
  },
  'Summarize Margaret\u2019s last 24 hours.': {
    normal: '3,420 steps, 8h 12m overnight rest, no alerts. Bracelet worn continuously. Margaret is steady today.',
    low:    '1,120 steps so far today — 38% below her usual daytime pattern. No fall-like impact. One open low-activity alert from 11:10.',
    fall:   "Active possible-fall alert at 14:32, waiting on your confirmation. Steps today: 2,840 before the event. Bracelet is worn; heart-rate signal is available.",
  },
  'Is location available for the current alert?': {
    normal: 'Location sharing is set to "during alerts only", so location is hidden right now.',
    low:    'Location sharing is set to "during alerts only". No safety event is active, so location is hidden.',
    fall:   "Yes — location is available because a safety event is active. Last known safe area: Home. Tap 'View location' on the alert to reveal more detail.",
  },
});

const ASK_DEFAULT_GREETING = {
  normal: "I can summarize Margaret's bracelet activity, alerts, and device status. Margaret is steady right now — anything you'd like to check?",
  low:    "I can summarize Margaret's bracelet activity, alerts, and device status. A low-activity alert is currently open.",
  fall:   "A possible fall alert is active. I can summarize the event and Margaret's recent activity — what would you like to know?",
};

Object.assign(window, {
  DEMO_PERSON, CAREGIVERS, SCENARIOS, FALL_EXPLANATION, FALL_TECHNICAL,
  ALERT_HISTORY, ACTIVITY_WEEK, WEEKLY_AVERAGE,
  ASK_PROMPTS, ASK_ANSWERS, ASK_DEFAULT_GREETING,
});
