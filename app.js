import { mountBhooShanketLogo, setupBhooShanketFavicon } from './logo.js';

const AUTH_KEY = 'bhooshanket_session';
const THEME_KEY = 'bhooshanket_theme';
const ASSISTANT_STATE_KEY = 'bhooshanket_assistant_state';
const VIEWS = ['dashboard', 'map', 'prediction', 'analytics', 'weather', 'sensors', 'alerts', 'communication', 'authority', 'rescue', 'citizen', 'route', 'zones', 'precautions', 'contacts', 'energy', 'settings'];
const ENERGY_MODES = ['ACTIVE MONITORING', 'ENERGY SAVING', 'NIGHT MONITORING', 'AUTOMATIC ALERT PRIORITY'];
const INCIDENT_FLOW = ['NEW', 'ACKNOWLEDGED', 'TEAM ASSIGNED', 'DISPATCHED', 'ON SCENE', 'RESOLVED'];

const appState = {
  authenticated: false,
  activeView: 'dashboard',
  lang: 'en',
  theme: localStorage.getItem(THEME_KEY) || 'dark',
  systemMode: 'ACTIVE MONITORING',
  selectedLocationId: 2,
  mapZoom: 1.0,
  activeCorridor: 'safest',
  reroutingActive: false,
  reroutingStage: 0,
  phaseIndex: 0,
  demoRiskOverride: null,
  liveDemoRunning: false,
  selectedPeriod: '24H',
  weatherMetric: 'rainfall',
  weatherTimeRange: '24H',
  historyMetrics: ['rainfall'],
  precautionTab: null,
  mapRiskFilter: 'all',
  chartInstances: [],
  displayedRisk: 0,
  citizenStatus: '',
  citizenWarning: '',
  selectedSensorId: null,
  selectedRoute: { from: '', to: 'Umiam Safe Point' },
  commLog: [],
  demoTimer: null,
  routeStatus: 'READY',
  routeRisk: 'LOW',
  lastAlertStatus: 'READY',
  aiModel: {
    rainfallIntensity: 82,
    rainfall24: 132,
    rainfall72: 322,
    soilMoisture: 78,
    slopeMovement: 66,
    slopeAngle: 39,
    temperature: 22,
    humidity: 88,
    weatherCondition: 'heavyRain'
  },
  communication: {
    location: 'Shillong Monitoring Zone',
    riskLevel: 'HIGH',
    targetGroup: 'Villagers',
    channel: 'SMS',
    message: ''
  },
  emergencyRequests: [
    {
      name: 'Aisha S.',
      type: 'Medical',
      location: 'Shillong Monitoring Zone',
      status: 'Under Review'
    }
  ],
  annotations: [],
  telemetrySource: 'LOCAL SIMULATION',
  telemetryLastSync: null,
  commandEvents: [
    { time: '05:42', type: 'SYSTEM', title: 'Regional monitoring initialized', detail: '247 sensor endpoints synchronized across the North East network.', tone: 'blue' },
    { time: '05:48', type: 'SENSOR', title: 'Rainfall threshold crossed', detail: 'Shillong rain sensor RS-104 moved into elevated observation.', tone: 'yellow' },
    { time: '05:52', type: 'AUTHORITY', title: 'Response desk on standby', detail: 'District control room briefing is ready for escalation.', tone: 'green' }
  ]
};

const locationCatalog = [
  { id: 1, state: 'Assam', district: 'Cachar', name: 'Silchar Monitoring Zone', risk: 42, rainfall: 40, humidity: 71, temperature: 28, soilMoisture: 61, slopeMovement: 42, slopeAngle: 32, weather: 'Moderate Rain', sensorStatus: 'online', mapX: 23, mapY: 52, safeZones: ['Silchar Shelter', 'Khagrapur Assembly'] },
  { id: 2, state: 'Meghalaya', district: 'East Khasi Hills', name: 'Shillong Monitoring Zone', risk: 78, rainfall: 82, humidity: 88, temperature: 22, soilMoisture: 78, slopeMovement: 66, slopeAngle: 39, weather: 'Heavy Rain', sensorStatus: 'warning', mapX: 48, mapY: 32, safeZones: ['Shillong Shelter', 'Umiam Safe Point'] },
  { id: 3, state: 'Arunachal Pradesh', district: 'West Kameng', name: 'Dirang Monitoring Zone', risk: 55, rainfall: 57, humidity: 73, temperature: 18, soilMoisture: 64, slopeMovement: 49, slopeAngle: 34, weather: 'Storm Rain', sensorStatus: 'online', mapX: 70, mapY: 40, safeZones: ['Dirang Safe Hub', 'Bhalukpong Shelter'] },
  { id: 4, state: 'Nagaland', district: 'Kohima', name: 'Kohima Monitoring Zone', risk: 69, rainfall: 73, humidity: 82, temperature: 20, soilMoisture: 71, slopeMovement: 58, slopeAngle: 38, weather: 'Intense Rain', sensorStatus: 'warning', mapX: 66, mapY: 58, safeZones: ['Kohima Safety Point', 'Jakhama Relief Zone'] },
  { id: 5, state: 'Sikkim', district: 'Gangtok', name: 'Gangtok Monitoring Zone', risk: 91, rainfall: 96, humidity: 92, temperature: 15, soilMoisture: 85, slopeMovement: 81, slopeAngle: 45, weather: 'Heavy Rainfall', sensorStatus: 'warning', mapX: 81, mapY: 30, safeZones: ['Gangtok Shelter', 'Tadong Safe Zone'] },
  { id: 6, state: 'Manipur', district: 'Imphal East', name: 'Imphal Monitoring Zone', risk: 44, rainfall: 49, humidity: 75, temperature: 24, soilMoisture: 58, slopeMovement: 46, slopeAngle: 30, weather: 'Moderate Rain', sensorStatus: 'online', mapX: 65, mapY: 66, safeZones: ['Imphal Assembly', 'Kwakeithel Shelter'] },
  { id: 7, state: 'Mizoram', district: 'Aizawl', name: 'Aizawl Monitoring Zone', risk: 62, rainfall: 67, humidity: 79, temperature: 21, soilMoisture: 69, slopeMovement: 55, slopeAngle: 33, weather: 'Storm Watch', sensorStatus: 'warning', mapX: 52, mapY: 72, safeZones: ['Aizawl Safe Center', 'Durtlang Shelter'] },
  { id: 8, state: 'Tripura', district: 'West Tripura', name: 'Agartala Monitoring Zone', risk: 39, rainfall: 34, humidity: 72, temperature: 27, soilMoisture: 50, slopeMovement: 39, slopeAngle: 29, weather: 'Light Rain', sensorStatus: 'online', mapX: 42, mapY: 82, safeZones: ['Agartala Shelter', 'Kunjaban Safe Zone'] }
];

const sensorCatalog = [
  { name: 'Rain Sensor', unit: 'mm/hr', id: 'RS-104', location: 'Shillong Monitoring Zone', status: 'warning', strength: '92%', battery: '78%', reading: 82, lastUpdated: '2 min ago' },
  { name: 'Soil Moisture Sensor', unit: '%', id: 'SM-205', location: 'Shillong Monitoring Zone', status: 'online', strength: '95%', battery: '82%', reading: 78, lastUpdated: '1 min ago' },
  { name: 'Slope Movement Sensor', unit: 'mm', id: 'SL-331', location: 'Shillong Monitoring Zone', status: 'warning', strength: '88%', battery: '63%', reading: 66, lastUpdated: '4 min ago' },
  { name: 'Temperature Sensor', unit: '°C', id: 'TMP-912', location: 'Shillong Monitoring Zone', status: 'online', strength: '96%', battery: '79%', reading: 22, lastUpdated: '30 sec ago' },
  { name: 'Humidity Sensor', unit: '%', id: 'HM-687', location: 'Shillong Monitoring Zone', status: 'online', strength: '90%', battery: '74%', reading: 88, lastUpdated: '45 sec ago' },
  { name: 'Rain Sensor', unit: 'mm/hr', id: 'RS-318', location: 'Gangtok Monitoring Zone', status: 'warning', strength: '83%', battery: '71%', reading: 96, lastUpdated: '2 min ago' },
  { name: 'Soil Moisture Sensor', unit: '%', id: 'SM-411', location: 'Gangtok Monitoring Zone', status: 'online', strength: '89%', battery: '77%', reading: 85, lastUpdated: '1 min ago' },
  { name: 'Slope Movement Sensor', unit: 'mm', id: 'SL-441', location: 'Gangtok Monitoring Zone', status: 'online', strength: '87%', battery: '68%', reading: 81, lastUpdated: '3 min ago' }
];

const alertBank = [
  {
    id: 'AL-2047',
    location: 'Shillong Monitoring Zone',
    district: 'East Khasi Hills',
    riskLevel: 'HIGH',
    probability: '78%',
    time: '05:48 IST',
    factors: ['Intense rainfall', 'Soil saturation', 'Slope movement'],
    action: 'Activate monitoring and dispatch warning',
    status: 'Active'
  },
  {
    id: 'AL-2049',
    location: 'Gangtok Monitoring Zone',
    district: 'Gangtok',
    riskLevel: 'CRITICAL',
    probability: '91%',
    time: '05:52 IST',
    factors: ['Slope instability', 'Extreme rainfall', 'Road disruption risk'],
    action: 'Deploy emergency teams and trigger evacuation prep',
    status: 'Escalated'
  },
  {
    id: 'AL-2051',
    location: 'Kohima Monitoring Zone',
    district: 'Kohima',
    riskLevel: 'MEDIUM',
    probability: '61%',
    time: '06:03 IST',
    factors: ['Moisture rise', 'Weather shift'],
    action: 'Increase patrol and validate sensors',
    status: 'Under Review'
  }
];

const incidentTableData = [
  { id: 'INC-2041', location: 'Shillong Monitoring Zone', risk: 'HIGH', status: 'ACKNOWLEDGED', authority: 'District Control Room', team: 'Alpha Rescue Team', priority: 'High', lastUpdated: 'Now', eta: '14 min' },
  { id: 'INC-2042', location: 'Gangtok Monitoring Zone', risk: 'CRITICAL', status: 'DISPATCHED', authority: 'State Ops', team: 'Himalaya Response Unit', priority: 'Critical', lastUpdated: '2 min ago', eta: '9 min' },
  { id: 'INC-2043', location: 'Kohima Monitoring Zone', risk: 'MEDIUM', status: 'NEW', authority: 'District Authority', team: 'Unassigned', priority: 'Medium', lastUpdated: '10 min ago', eta: '21 min' }
];

const rescueTeams = [
  { team: 'Alpha Rescue Team', location: 'Shillong Monitoring Zone', priority: 'High', progress: 72, eta: '14 min', status: 'IN PROGRESS', tasks: ['Inspect affected slope area', 'Assist citizen evacuation', 'Verify sensor condition'] },
  { team: 'Himalaya Response Unit', location: 'Gangtok Monitoring Zone', priority: 'Critical', progress: 58, eta: '9 min', status: 'ASSIGNED', tasks: ['Secure high-risk route', 'Support road clearance', 'Prepare shelter transfer'] },
  { team: 'North Valley Crew', location: 'Kohima Monitoring Zone', priority: 'Medium', progress: 34, eta: '21 min', status: 'ASSIGNED', tasks: ['Assess drainage', 'Coordinate community alerts'] }
];

const safeZoneData = [
  { name: 'Shillong Shelter', distance: '1.8 km', capacity: '220', availability: '75%', risk: 'LOW' },
  { name: 'Umiam Safe Point', distance: '3.4 km', capacity: '140', availability: '91%', risk: 'LOW' },
  { name: 'Mawphlang Assembly', distance: '5.6 km', capacity: '90', availability: '58%', risk: 'MEDIUM' }
];

const emergencyContacts = [
  { name: 'Shillong Police', number: '112', region: 'Meghalaya', status: 'Available', category: 'Police' },
  { name: 'Ambulance Network', number: '108', region: 'North East', status: 'Available', category: 'Ambulance' },
  { name: 'Fire & Rescue', number: '101', region: 'Meghalaya', status: 'On Duty', category: 'Fire and Rescue' },
  { name: 'State Disaster Response', number: '9436-XXXX', region: 'North East', status: 'Ready', category: 'Disaster Response Team' }
];

const energyModes = ENERGY_MODES.map((label, index) => ({
  label,
  detail: index === 0 ? 'Full sensor cadence and live map refresh.' : index === 1 ? 'Reduced polling. Emergency readiness remains active.' : index === 2 ? 'Low-light operations with prioritized critical alerts.' : 'Critical and high alerts surface first. Emergency readiness remains active.',
  active: label === 'ACTIVE MONITORING'
}));

const metricTemplates = [
  { label: 'ACTIVE ALERTS', value: 14, icon: '⚑', color: '#ff4d5f', trend: '+2.4%', goto: 'alerts' },
  { label: 'CRITICAL ZONES', value: 6, icon: '◇', color: '#ff9c45', trend: '+1.1%', goto: 'map' },
  { label: 'SENSORS ONLINE', value: 247, icon: '▣', color: '#42c4ff', trend: '+24', goto: 'sensors' },
  { label: 'RAINFALL', value: 82, icon: '▣', color: '#5ea1ff', trend: 'mm/hr', goto: 'weather', unit: ' mm/hr' },
  { label: 'SOIL MOISTURE', value: 78, icon: '◍', color: '#32d597', trend: '%', goto: 'sensors', unit: '%' },
  { label: 'SLOPE MOVEMENT', value: 66, icon: '△', color: '#f5c75b', trend: 'mm', goto: 'prediction', unit: ' mm' }
];

const riskThresholds = {
  LOW: { min: 0, max: 30 },
  MEDIUM: { min: 31, max: 60 },
  HIGH: { min: 61, max: 80 },
  CRITICAL: { min: 81, max: 100 }
};

const phaseDefinitions = [
  { label: 'Phase 01 — Normal Conditions', risk: 18, rainfall: 26, humidity: 60, soil: 40, slope: 24, weather: 'Partly Cloudy', rainfall24: 32, rainfall72: 78 },
  { label: 'Phase 02 — Warning Signs', risk: 45, rainfall: 52, humidity: 73, soil: 58, slope: 39, weather: 'Showers', rainfall24: 84, rainfall72: 160 },
  { label: 'Phase 03 — High Risk', risk: 74, rainfall: 81, humidity: 88, soil: 74, slope: 58, weather: 'Heavy Rain', rainfall24: 132, rainfall72: 322 },
  { label: 'Phase 04 — Critical Event', risk: 94, rainfall: 94, humidity: 95, soil: 90, slope: 82, weather: 'Cloudburst', rainfall24: 210, rainfall72: 438 }
];

function getEndRiskLabel(value) {
  if (value < 30) return 'LOW';
  if (value < 60) return 'MEDIUM';
  if (value < 80) return 'HIGH';
  return 'CRITICAL';
}

function getRiskColor(value) {
  if (value < 30) return 'var(--green)';
  if (value < 60) return 'var(--yellow)';
  if (value < 80) return 'var(--orange)';
  return 'var(--red)';
}

function getSelectedLocation() {
  return locationCatalog.find(location => location.id === appState.selectedLocationId) || locationCatalog[1];
}

function getAuthConfig() {
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  return {
    email: String(env.VITE_BHOOSHANKET_LOGIN_EMAIL || '').trim().toLowerCase(),
    passcode: String(env.VITE_BHOOSHANKET_LOGIN_PASSCODE || '')
  };
}

function hasAuthSession() {
  return sessionStorage.getItem(AUTH_KEY) === '1' || localStorage.getItem(AUTH_KEY) === '1';
}

function persistAuth(remember) {
  sessionStorage.setItem(AUTH_KEY, '1');
  if (remember) localStorage.setItem(AUTH_KEY, '1');
  else localStorage.removeItem(AUTH_KEY);
}

function clearAuth() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
}

function applyTheme(theme) {
  appState.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = appState.theme;
  localStorage.setItem(THEME_KEY, appState.theme);
  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.textContent = appState.theme === 'light' ? '☀ LIGHT' : '🌙 DARK';
}

function nowStamp() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function showToast(message, tone = 'info') {
  const stack = document.getElementById('toastStack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = `toast ${tone}`;
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

function logCommand(type, title, detail, tone = 'blue') {
  appState.commandEvents.unshift({ time: nowStamp(), type, title, detail, tone });
}

function aiConfidence() {
  const selected = getSelectedLocation();
  return Math.min(98, Math.round(78 + (selected.sensorStatus === 'warning' ? 8 : 12) + appState.phaseIndex * 2));
}

function getFactorContributions() {
  const model = appState.aiModel;
  const raw = [
    { label: 'Rainfall', value: (model.rainfallIntensity / 100) * 35 },
    { label: 'Soil Moisture', value: (model.soilMoisture / 100) * 25 },
    { label: 'Slope Movement', value: (model.slopeMovement / 100) * 20 },
    { label: 'Slope Angle', value: (model.slopeAngle / 60) * 10 },
    { label: 'Weather Condition', value: model.weatherCondition === 'clear' ? 4 : 10 }
  ];
  const total = raw.reduce((sum, item) => sum + item.value, 0) || 1;
  return raw.map(item => ({ ...item, pct: Math.max(4, Math.round((item.value / total) * 100)) }));
}

function explanationCopy(level) {
  const selected = getSelectedLocation();
  if (level === 'CRITICAL') return `Extreme rainfall near ${selected.name}, high soil saturation, and significant slope movement have driven a critical landslide probability.`;
  if (level === 'HIGH') return `Heavy rainfall combined with increasing soil saturation and slope movement has significantly increased landslide probability.`;
  if (level === 'MEDIUM') return `Rising rainfall and soil moisture are elevating slope sensitivity. Continued monitoring is required.`;
  return `Environmental conditions remain largely stable. Routine observation is sufficient.`;
}

function recommendedAction(risk) {
  if (risk >= 80) return 'Prepare evacuation and keep high-risk corridors closed.';
  if (risk >= 60) return 'Escalate warning advisory and ready response teams.';
  if (risk >= 31) return 'Increase patrol cadence and validate sensor health.';
  return 'Continue routine observation.';
}

function syncAiModelFromLocation(location = getSelectedLocation()) {
  const phase = phaseDefinitions[appState.phaseIndex];
  appState.aiModel = {
    rainfallIntensity: location.rainfall,
    rainfall24: phase.rainfall24,
    rainfall72: phase.rainfall72,
    soilMoisture: location.soilMoisture,
    slopeMovement: location.slopeMovement,
    slopeAngle: location.slopeAngle,
    temperature: location.temperature,
    humidity: location.humidity,
    weatherCondition: location.rainfall > 88 ? 'cloudburst' : location.rainfall > 70 ? 'heavyRain' : location.rainfall > 45 ? 'storm' : 'clear'
  };
  const rain = document.getElementById('rainIntensity');
  if (rain) {
    rain.value = location.rainfall;
    document.getElementById('rain24').value = phase.rainfall24;
    document.getElementById('rain72').value = phase.rainfall72;
    document.getElementById('soilMoisture').value = location.soilMoisture;
    document.getElementById('slopeMovement').value = location.slopeMovement;
    document.getElementById('slopeAngle').value = location.slopeAngle;
    document.getElementById('temperature').value = location.temperature;
    document.getElementById('humidity').value = location.humidity;
    document.getElementById('weatherCondition').value = appState.aiModel.weatherCondition;
  }
}

function countTo(element, next, suffix = '') {
  if (!element) return;
  const from = Number(element.dataset.val || 0);
  const to = Number(next);
  element.dataset.val = String(to);
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / 520);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = from + (to - from) * eased;
    element.textContent = `${to % 1 ? value.toFixed(1) : Math.round(value)}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function setView(view) {
  if (!VIEWS.includes(view)) view = 'dashboard';
  appState.activeView = view;
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  document.querySelectorAll('.view').forEach(section => {
    const active = section.dataset.viewPanel === view;
    section.classList.toggle('active', active);
    if (active) {
      section.classList.remove('view-refresh');
      requestAnimationFrame(() => section.classList.add('view-refresh'));
    }
  });
  if (location.hash.replace('#', '') !== view) history.replaceState(null, '', `#${view}`);
  document.body.classList.remove('nav-open');
  if (view === 'analytics' || view === 'weather') renderCharts();
}

function navigateTo(view, options = {}) {
  if (options.locationId) appState.selectedLocationId = options.locationId;
  if (options.riskFilter) {
    appState.mapRiskFilter = options.riskFilter;
    const filter = document.getElementById('mapRiskFilter');
    if (filter) filter.value = options.riskFilter;
  }
  setView(view);
  renderAll();
}

function showApp() {
  appState.authenticated = true;
  document.getElementById('bootOverlay')?.remove();
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('appShell').classList.remove('hidden');
  setAssistantState(sessionStorage.getItem(ASSISTANT_STATE_KEY) || 'minimized');
  const hashView = location.hash.replace('#', '');
  setView(VIEWS.includes(hashView) ? hashView : 'dashboard');
  renderAll();
}

function showLogin() {
  appState.authenticated = false;
  if (appState.demoTimer) {
    clearInterval(appState.demoTimer);
    appState.demoTimer = null;
    appState.liveDemoRunning = false;
  }
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('appShell').classList.add('hidden');
  document.getElementById('cinematicOverlay')?.classList.add('hidden');
  document.getElementById('assistantBox')?.classList.remove('open', 'maximized');
  document.getElementById('assistantLauncher')?.classList.remove('visible');
  const form = document.getElementById('loginForm');
  form?.reset();
  const submit = document.querySelector('.login-submit');
  if (submit) {
    submit.disabled = false;
    const label = submit.querySelector('b');
    if (label) label.textContent = 'SIGN IN';
  }
  document.getElementById('authStatus')?.classList.add('hidden');
  document.getElementById('loginError')?.classList.add('hidden');
  history.replaceState(null, '', location.pathname + location.search);
}

function setAssistantState(state) {
  const assistant = document.getElementById('assistantBox');
  const launcher = document.getElementById('assistantLauncher');
  if (!assistant || !launcher) return;
  const safeState = ['open', 'maximized', 'minimized', 'closed'].includes(state) ? state : 'minimized';
  assistant.classList.toggle('open', safeState === 'open' || safeState === 'maximized');
  assistant.classList.toggle('maximized', safeState === 'maximized');
  assistant.classList.toggle('minimized', safeState === 'minimized' || safeState === 'closed');
  launcher.classList.toggle('visible', safeState === 'minimized' || safeState === 'closed');
  launcher.setAttribute('aria-hidden', safeState === 'open' || safeState === 'maximized' ? 'true' : 'false');
  sessionStorage.setItem(ASSISTANT_STATE_KEY, safeState);
}

function showCriticalEvent(location, risk) {
  const overlay = document.getElementById('cinematicOverlay');
  const card = document.getElementById('cinematicCard');
  if (!overlay || !card) return;
  card.innerHTML = `
    <div class="cinematic-kicker">EARLY WARNING ACTIVATED</div>
    <h2>CRITICAL LANDSLIDE EVENT</h2>
    <div class="cinematic-location">${location.name.toUpperCase()} <span>•</span> ${location.district.toUpperCase()}</div>
    <div class="cinematic-risk"><strong>${risk}%</strong><span>AI RISK PROBABILITY</span></div>
    <div class="cinematic-flow">
      <span>AUTHORITY NOTIFIED</span><i></i><span>RESCUE TEAM DISPATCHED</span><i></i><span>CITIZEN ALERT ACTIVE</span><i></i><span>SAFE ROUTE UPDATED</span>
    </div>
  `;
  overlay.classList.remove('hidden');
  clearTimeout(showCriticalEvent.timer);
  showCriticalEvent.timer = setTimeout(() => overlay.classList.add('hidden'), 3600);
}

function openDrawer(html) {
  const drawer = document.getElementById('detailDrawer');
  const overlay = document.getElementById('drawerOverlay');
  drawer.innerHTML = `<button type="button" class="icon-btn drawer-close" id="closeDrawer">✕</button>${html}`;
  drawer.classList.remove('hidden');
  overlay.classList.remove('hidden');
}

function closeDrawer() {
  document.getElementById('detailDrawer').classList.add('hidden');
  document.getElementById('drawerOverlay').classList.add('hidden');
}

function contributionMarkup(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = getFactorContributions().map(item => `
    <div class="bar-row">
      <span>${item.label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${item.pct}%;"></div></div>
      <strong>${item.pct}%</strong>
    </div>
  `).join('');
}

function applyLanguage() {
  const hindi = appState.lang === 'hi';
  document.documentElement.lang = hindi ? 'hi' : 'en';
  const greet = document.getElementById('greetingLine');
  if (greet) greet.textContent = hindi ? 'कमांड अथॉरिटी' : 'COMMAND AUTHORITY';
  const note = document.getElementById('langNote');
  if (note) {
    note.textContent = hindi
      ? 'अंग्रेज़ी और हिंदी सक्रिय हैं। उत्तर-पूर्वी भाषाएँ भविष्य के विस्तार के लिए आरक्षित हैं।'
      : 'English and Hindi are active. Additional North-Eastern languages are reserved for future expansion.';
  }
}

function riskScoreFromLocation(location) {
  if (appState.demoRiskOverride !== null) return appState.demoRiskOverride;
  const phase = phaseDefinitions[appState.phaseIndex] || phaseDefinitions[0];
  const base = location.risk * 0.6;
  const offset = phase.risk * 0.7;
  const risk = Math.min(100, Math.max(12, Math.round(base + offset)));
  return risk;
}

function updateClock() {
  const now = new Date();
  document.getElementById('dateStamp').textContent = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  document.getElementById('clockStamp').textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function renderNotifications() {
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const severity = risk >= 80 ? 'critical' : risk >= 60 ? 'warning' : 'normal';
  const notifications = [
    `Risk in ${selected.name}: ${getEndRiskLabel(risk)}`,
    `${phaseDefinitions[appState.phaseIndex].label}`,
    `Priority action: ${risk >= 80 ? 'Evacuation prep' : risk >= 60 ? 'Escalated monitoring' : 'Routine watch'}`,
    `Sensor health: ${selected.sensorStatus === 'warning' ? 'Elevated' : 'Nominal'}`,
    `Telemetry: ${appState.telemetrySource}`
  ];

  const center = document.getElementById('notificationCenter');
  if (!center) return;
  center.innerHTML = notifications
    .map(item => `<div class="notif-item ${severity}">${item}</div>`)
    .join('');
  const count = document.getElementById('notificationCount');
  if (count) count.textContent = String(Math.min(99, alertBank.filter(alert => alert.status !== 'Resolved').length + (severity === 'critical' ? 1 : 0)));
}

async function syncExternalTelemetry() {
  const selected = getSelectedLocation();
  try {
    const response = await fetch(`http://127.0.0.1:8010/api/telemetry?location=${encodeURIComponent(selected.name)}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Gateway unavailable');
    const payload = await response.json();
    const readings = payload.readings || {};
    selected.rainfall = readings.rainfall ?? selected.rainfall;
    selected.soilMoisture = readings.soilMoisture ?? selected.soilMoisture;
    selected.slopeMovement = readings.slopeMovement ?? selected.slopeMovement;
    selected.humidity = readings.humidity ?? selected.humidity;
    selected.temperature = readings.temperature ?? selected.temperature;
    appState.telemetrySource = 'PYTHON GATEWAY';
    appState.telemetryLastSync = payload.timestamp;
    renderRiskOverview();
    renderWeather();
    renderMap();
    renderNotifications();
  } catch (error) {
    appState.telemetrySource = 'LOCAL SIMULATION';
  }
}

function renderCommandLog() {
  const log = document.getElementById('commandLog');
  if (!log) return;
  log.innerHTML = appState.commandEvents.slice(0, 6).map(event => `
    <div class="command-event ${event.tone}">
      <div class="event-marker"></div>
      <div class="event-time">${event.time}</div>
      <div class="event-copy"><span>${event.type}</span><strong>${event.title}</strong><p>${event.detail}</p></div>
    </div>
  `).join('');
}

function renderMetrics() {
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const online = 247 - (appState.phaseIndex === 3 ? 1 : 0);
  const metrics = [
    { ...metricTemplates[0], value: Math.max(8, Math.round((risk / 100) * 18 + 4)) },
    { ...metricTemplates[1], value: locationCatalog.filter(loc => getEndRiskLabel(riskScoreFromLocation(loc)) === 'CRITICAL').length || Math.max(1, Math.round(risk / 25)) },
    { ...metricTemplates[2], value: online },
    { ...metricTemplates[3], value: selected.rainfall },
    { ...metricTemplates[4], value: selected.soilMoisture },
    { ...metricTemplates[5], value: selected.slopeMovement }
  ];

  document.getElementById('metricsGrid').innerHTML = metrics.map(metric => `
    <button type="button" class="metric-card interactive" data-goto="${metric.goto}">
      <div class="top">
        <div class="icon" style="background: ${metric.color}22; color: ${metric.color};">${metric.icon}</div>
        <div class="trend" style="color: ${metric.color};">${metric.trend}</div>
      </div>
      <h4>${metric.label}</h4>
      <div class="value" style="color: ${metric.color};">${metric.value}${metric.unit || ''}</div>
      <div class="sparkline">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0 30 L18 26 L36 24 L52 16 L70 18 L86 8 L100 10" stroke="${metric.color}" fill="none" stroke-width="2.2" stroke-linecap="round" />
        </svg>
      </div>
    </button>
  `).join('');
}

function renderLocationSelectors() {
  const stateOptions = [...new Set(locationCatalog.map(location => location.state))];
  const selected = getSelectedLocation();
  const districtOptions = [...new Set(locationCatalog.filter(location => location.state === selected.state).map(location => location.district))];
  const zoneOptions = locationCatalog.filter(location => location.state === selected.state);

  const stateSelect = document.getElementById('stateSelect');
  const districtSelect = document.getElementById('districtSelect');
  const zoneSelect = document.getElementById('zoneSelect');
  const weatherState = document.getElementById('weatherState');
  const weatherDistrict = document.getElementById('weatherDistrict');
  const weatherZone = document.getElementById('weatherZone');
  const routeFrom = document.getElementById('routeFrom');
  const routeTo = document.getElementById('routeTo');
  const mapStateFilter = document.getElementById('mapStateFilter');
  const mapDistrictFilter = document.getElementById('mapDistrictFilter');
  const commLocation = document.getElementById('commLocation');

  const updateSelect = (element, values, selectedValue) => {
    if (!element) return;
    const safeValues = values.filter(Boolean);
    element.innerHTML = safeValues.map(value => `<option value="${value}" ${String(value) === String(selectedValue) ? 'selected' : ''}>${value}</option>`).join('');
  };

  updateSelect(stateSelect, stateOptions, selected.state);
  updateSelect(districtSelect, districtOptions, selected.district);
  updateSelect(zoneSelect, zoneOptions.map(loc => loc.name), selected.name);
  updateSelect(weatherState, stateOptions, selected.state);
  updateSelect(weatherDistrict, districtOptions, selected.district);
  updateSelect(weatherZone, zoneOptions.map(loc => loc.name), selected.name);
  updateSelect(routeFrom, locationCatalog.map(loc => loc.name), appState.selectedRoute.from || selected.name);
  updateSelect(routeTo, [...new Set(safeZoneData.map(zone => zone.name))], appState.selectedRoute.to || selected.safeZones[0]);

  const currentMapState = mapStateFilter && mapStateFilter.value && mapStateFilter.value !== 'all' ? mapStateFilter.value : 'all';
  const currentMapDistrict = mapDistrictFilter && mapDistrictFilter.value && mapDistrictFilter.value !== 'all' ? mapDistrictFilter.value : 'all';
  const mapStateValues = ['all', ...stateOptions];
  const mapDistrictValues = currentMapState === 'all'
    ? ['all', ...[...new Set(locationCatalog.map(location => location.district))]]
    : ['all', ...[...new Set(locationCatalog.filter(location => location.state === currentMapState).map(location => location.district))]];

  updateSelect(mapStateFilter, mapStateValues, currentMapState);
  updateSelect(mapDistrictFilter, mapDistrictValues, currentMapDistrict);
  updateSelect(commLocation, locationCatalog.map(loc => loc.name), selected.name);

  appState.communication.location = selected.name;
  const headerState = document.getElementById('headerState');
  const headerDistrict = document.getElementById('headerDistrict');
  const headerZone = document.getElementById('headerZone');
  if (headerState) headerState.textContent = selected.state.toUpperCase();
  if (headerDistrict) headerDistrict.textContent = selected.district.toUpperCase();
  if (headerZone) headerZone.textContent = selected.name.replace(' Monitoring Zone', ' ZONE').toUpperCase();
}

function renderLiveIncidents() {
  const feed = document.getElementById('liveIncidentFeed');
  if (!feed) return;
  const selected = getSelectedLocation();
  const incidents = incidentTableData
    .filter(incident => incident.location === selected.name)
    .slice(0, 3);
  const fallback = appState.commandEvents.slice(0, 3).map(event => ({
    title: event.title,
    detail: event.detail,
    status: event.type,
    time: event.time,
    risk: event.tone
  }));
  const items = incidents.length ? incidents.map(incident => ({
    title: incident.id,
    detail: `${incident.team} • ETA ${incident.eta}`,
    status: incident.status,
    time: incident.lastUpdated,
    risk: incident.risk
  })) : fallback;
  feed.innerHTML = items.map(item => `
    <div class="incident-row">
      <strong>${item.title}</strong>
      <span>${item.detail}</span>
      <span class="tag ${String(item.risk).toLowerCase()}">${item.status}</span>
      <small>${item.time}</small>
    </div>
  `).join('');
}

function renderTelemetry() {
  const grid = document.getElementById('telemetryGrid');
  if (!grid) return;
  const selected = getSelectedLocation();
  const sensors = sensorCatalog.filter(sensor => sensor.location === selected.name).slice(0, 4);
  grid.innerHTML = sensors.map(sensor => `
    <div class="intel-row">
      <span>${sensor.name}</span>
      <strong>${sensor.reading}${sensor.unit} <small>${sensor.status.toUpperCase()}</small></strong>
    </div>
  `).join('');
}

function renderDashboardOps() {
  const incidentTarget = document.getElementById('dashboardIncidents');
  const rescueTarget = document.getElementById('dashboardRescue');
  const selected = getSelectedLocation();
  if (incidentTarget) {
    const incidents = incidentTableData.filter(item => item.location === selected.name).slice(0, 2);
    incidentTarget.innerHTML = (incidents.length ? incidents : incidentTableData.slice(0, 2)).map(item => `
      <div class="intel-row">
        <span>${item.location}</span>
        <strong class="tag ${item.risk.toLowerCase()}">${item.status}</strong>
      </div>
    `).join('');
  }
  if (rescueTarget) {
    const teams = rescueTeams.filter(team => team.location === selected.name).slice(0, 2);
    rescueTarget.innerHTML = (teams.length ? teams : rescueTeams.slice(0, 2)).map(team => `
      <div class="intel-row">
        <span>${team.team}</span>
        <strong>${team.progress}% • ${team.status}</strong>
      </div>
    `).join('');
  }
}

function renderRiskOverview() {
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const level = getEndRiskLabel(risk);
  const riskColor = getRiskColor(risk);

  document.getElementById('selectedLocationName').textContent = selected.name;
  countTo(document.getElementById('riskPercent'), risk, '%');
  document.getElementById('riskLevelText').textContent = `${level} RISK`;
  document.getElementById('rainfallFact').textContent = risk > 70 ? 'HIGH' : risk > 40 ? 'MODERATE' : 'LOW';
  document.getElementById('moistureFact').textContent = risk > 70 ? 'HIGH' : risk > 40 ? 'ELEVATED' : 'NORMAL';
  document.getElementById('movementFact').textContent = risk > 80 ? 'CRITICAL' : risk > 60 ? 'ELEVATED' : 'STABLE';
  document.getElementById('conditionFact').textContent = selected.weather.toUpperCase();
  document.getElementById('aiInsight').textContent = explanationCopy(level);
  document.getElementById('riskMatterText').textContent = explanationCopy(level);
  const confidenceEl = document.getElementById('aiConfidenceValue');
  if (confidenceEl) countTo(confidenceEl, aiConfidence(), '%');
  const regionEl = document.getElementById('regionIndicator');
  if (regionEl) regionEl.textContent = `${selected.state} • ${selected.district}`;
  const ts = document.getElementById('riskTimestamp');
  if (ts) ts.textContent = nowStamp() + ' IST';
  const trend = document.getElementById('riskMiniTrend');
  if (trend) {
    const pts = [18, 28, 36, 48, 62, risk].map((v, i) => `${i * 20},${36 - (v / 100) * 32}`).join(' ');
    trend.innerHTML = `<polyline points="${pts}" fill="none" stroke="${riskColor}" stroke-width="2.2" />`;
  }

  const gauge = document.getElementById('riskGauge');
  gauge.style.setProperty('--risk-progress', `${risk}%`);
  gauge.style.setProperty('--risk-color', riskColor);
  gauge.dataset.level = level.toLowerCase();
  contributionMarkup('dashboardContributionBars');
  const status = document.getElementById('systemStatusLabel');
  if (status) status.textContent = level === 'CRITICAL' ? 'CRITICAL WATCH' : level === 'HIGH' ? 'ELEVATED' : 'STABLE';
  const mode = document.getElementById('systemModeLabel');
  if (mode) mode.textContent = appState.systemMode;
  renderLiveIncidents();
  renderTelemetry();
  renderDashboardOps();
}

function renderWeather() {
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const weatherValues = [
    { label: 'Current Weather', value: selected.weather, icon: '☂' },
    { label: 'Temperature', value: `${selected.temperature}°C`, icon: '◌' },
    { label: 'Humidity', value: `${selected.humidity}%`, icon: '◔' },
    { label: 'Rainfall Intensity', value: `${selected.rainfall} mm/hr`, icon: '▣' },
    { label: '24-Hour Rainfall', value: `${phaseDefinitions[appState.phaseIndex].rainfall24} mm`, icon: '◍' },
    { label: '72-Hour Rainfall', value: `${phaseDefinitions[appState.phaseIndex].rainfall72} mm`, icon: '◒' },
    { label: 'Weather Trend', value: risk > 80 ? 'Escalating' : risk > 50 ? 'Rising' : 'Stable', icon: '△' },
    { label: 'Rainfall Forecast', value: risk > 70 ? 'High' : 'Moderate', icon: '☼' }
  ];

  document.getElementById('weatherGrid').innerHTML = weatherValues.map(item => `
    <div class="weather-item">
      <span class="label">${item.label}</span>
      <div class="value">${item.value}</div>
    </div>
  `).join('');

  document.getElementById('weatherHero').innerHTML = weatherValues.map(item => `
    <div class="weather-box">
      <div class="icon">${item.icon}</div>
      <h5>${item.label}</h5>
      <strong>${item.value}</strong>
    </div>
  `).join('');
}

function renderSensors() {
  const filtered = sensorCatalog.filter(sensor => sensor.location === getSelectedLocation().name || sensor.location === 'Gangtok Monitoring Zone' || sensor.location === 'Shillong Monitoring Zone');
  const online = filtered.filter(s => s.status === 'online').length;
  const warning = filtered.filter(s => s.status === 'warning').length;
  const offline = filtered.filter(s => s.status === 'offline').length || 1;

  document.getElementById('sensorSummary').innerHTML = `
    <div class="summary-pill"><span>Total Sensors</span><strong>${filtered.length}</strong></div>
    <div class="summary-pill"><span>Online</span><strong>${online}</strong></div>
    <div class="summary-pill"><span>Warning</span><strong>${warning}</strong></div>
    <div class="summary-pill"><span>Offline</span><strong>${offline}</strong></div>
  `;

  document.getElementById('sensorGrid').innerHTML = filtered.map(sensor => `
    <div class="sensor-card">
      <div class="sensor-head">
        <h5>${sensor.name}</h5>
        <span class="status-chip ${sensor.status}">${sensor.status.toUpperCase()}</span>
      </div>
      <div class="readout">
        <div>
          <strong>${sensor.reading}${sensor.unit}</strong>
          <small>${sensor.id}</small>
        </div>
        <div>
          <strong>${sensor.strength}</strong>
          <small>Signal</small>
        </div>
      </div>
      <div class="sensor-meta">
        <span>Location: ${sensor.location}</span>
        <span>Battery: ${sensor.battery}</span>
        <span>Last Updated: ${sensor.lastUpdated}</span>
      </div>
    </div>
  `).join('');
}

function renderAlerts() {
  document.getElementById('alertList').innerHTML = alertBank.map(alert => {
    const critical = alert.riskLevel === 'CRITICAL';
    return `
      <div class="alert-item ${critical ? 'critical' : ''}">
        <div>
          <div class="small-label">Alert ID</div>
          <strong>${alert.id}</strong>
        </div>
        <div>
          <div class="small-label">Location</div>
          <strong>${alert.location}</strong>
        </div>
        <div>
          <div class="small-label">District</div>
          <strong>${alert.district}</strong>
        </div>
        <div>
          <div class="small-label">Risk Level</div>
          <strong>${alert.riskLevel}</strong>
        </div>
        <div>
          <div class="small-label">AI Probability</div>
          <strong>${alert.probability}</strong>
        </div>
        <div>
          <div class="small-label">Detected Time</div>
          <strong>${alert.time}</strong>
        </div>
        <div>
          <div class="small-label">Action</div>
          <div class="alert-actions">
            <button class="action-btn" data-alert-action="view" data-alert-id="${alert.id}">View Intelligence</button>
            <button class="action-btn" data-alert-action="acknowledge" data-alert-id="${alert.id}">${alert.status === 'Acknowledged' ? 'Acknowledged' : 'Acknowledge'}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderIncidentTable() {
  document.getElementById('incidentTable').innerHTML = incidentTableData.map(item => `
    <div class="incident-row">
      <div>
        <div class="small-label">Location</div>
        <strong>${item.location}</strong>
      </div>
      <div>
        <div class="small-label">Risk</div>
        <span class="tag ${item.risk.toLowerCase()}">${item.risk}</span>
      </div>
      <div>
        <div class="small-label">Status</div>
        <strong>${item.status}</strong>
      </div>
      <div>
        <div class="small-label">Authority</div>
        <strong>${item.authority}</strong>
      </div>
      <div>
        <div class="small-label">Response Team</div>
        <strong>${item.team}</strong>
      </div>
      <div>
        <div class="small-label">Priority</div>
        <strong>${item.priority}</strong>
      </div>
      <div>
        <div class="small-label">Last Updated</div>
        <strong>${item.lastUpdated}</strong>
      </div>
      <div class="alert-actions">
        <button class="action-btn" data-incident-action="advance" data-incident-id="${item.id}">ADVANCE</button>
      </div>
    </div>
  `).join('');
}

function renderRescue() {
  document.getElementById('rescueGrid').innerHTML = rescueTeams.map(team => `
    <div class="rescue-item">
      <div class="rescue-header">
        <strong>${team.team}</strong>
        <span class="status-chip ${team.status === 'IN PROGRESS' ? 'online' : 'warning'}">${team.status}</span>
      </div>
      <div class="sensor-meta">
        <span>Location: ${team.location}</span>
        <span>Priority: ${team.priority}</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${team.progress}%"></div></div>
      <div class="rescue-footer">
        <span>Task Progress: ${team.progress}%</span>
        <span>ETA: ${team.eta}</span>
      </div>
      <div class="sensor-meta" style="margin-top: 12px;">
        ${team.tasks.map(task => `<span>• ${task}</span>`).join('')}
      </div>
      <div class="alert-actions">
        <button class="action-btn" data-team-action="assign" data-team="${team.team}">ASSIGN</button>
        <button class="action-btn" data-team-action="dispatch" data-team="${team.team}">DISPATCH</button>
        <button class="action-btn" data-team-action="complete" data-team="${team.team}">COMPLETE</button>
      </div>
    </div>
  `).join('');
}

function renderCitizen() {
  const response = document.getElementById('citizenResponse');
  if (!response) return;
  response.innerHTML = `
    <div>
      <strong>Current status:</strong> ${appState.citizenStatus || 'Awaiting citizen update.'}
    </div>
    ${appState.citizenWarning ? `<div class="citizen-warning"><strong>CRITICAL CITIZEN WARNING</strong><span>${appState.citizenWarning}</span></div>` : ''}
  `;
}

function renderSafeZones() {
  const target = document.getElementById('safeZoneGrid');
  if (!target) return;
  target.innerHTML = safeZoneData.map(zone => `
    <div class="zone-card">
      <h4>${zone.name}</h4>
      <div class="meta">
        <span>Distance: ${zone.distance}</span>
        <span>Capacity: ${zone.capacity}</span>
        <span>Availability: ${zone.availability}</span>
        <span>Risk Level: ${zone.risk}</span>
      </div>
      <div class="actions">
        <button class="action-btn" data-zone-action="map" data-zone="${zone.name}">VIEW ON MAP</button>
        <button class="action-btn" data-zone-action="route" data-zone="${zone.name}">GET DIRECTIONS</button>
      </div>
    </div>
  `).join('');
}

const routeCorridors = {
  safest: {
    id: 'safest',
    label: 'Safest Route (Recommended)',
    name: 'Primary Valley Bypass (NH-10 / Umiam Corridor)',
    distance: '5.8 km',
    eta: '12 min',
    riskLevel: 'LOW',
    riskScore: 18,
    terrainExposure: '12% Gentle Slope',
    color: 'var(--green)',
    pathD: 'M 80,240 C 180,250 260,220 370,180 S 520,150 690,130',
    checkpoints: [
      { name: 'Valley Access Point', elevation: '1,120 m', status: 'Clear', risk: 'LOW' },
      { name: 'River Bypass Causeway', elevation: '1,090 m', status: 'Sensors Nominal', risk: 'LOW' },
      { name: 'Safe Zone Perimeter', elevation: '1,180 m', status: 'Evacuation Ready', risk: 'LOW' }
    ]
  },
  alternative: {
    id: 'alternative',
    label: 'Alternative Route',
    name: 'Upper Ridge Parkway Bypass',
    distance: '7.6 km',
    eta: '16 min',
    riskLevel: 'MEDIUM',
    riskScore: 44,
    terrainExposure: '26% Moderate Ridge',
    color: 'var(--blue)',
    pathD: 'M 80,240 C 150,170 250,130 390,110 S 560,90 690,130',
    checkpoints: [
      { name: 'Ridge Crest Gate', elevation: '1,380 m', status: 'Wind Monitored', risk: 'MEDIUM' },
      { name: 'North Culvert Crossing', elevation: '1,320 m', status: 'Drainage Clear', risk: 'MEDIUM' },
      { name: 'Safe Zone West Gate', elevation: '1,180 m', status: 'Secondary Assembly', risk: 'LOW' }
    ]
  },
  highrisk: {
    id: 'highrisk',
    label: 'High-Risk Route (Restricted)',
    name: 'Direct Escarpment Gorge Cut',
    distance: '4.2 km',
    eta: '32 min (Restricted)',
    riskLevel: 'CRITICAL',
    riskScore: 88,
    terrainExposure: '74% Steep Fault Incline',
    color: 'var(--red)',
    pathD: 'M 80,240 C 200,180 310,250 430,200 S 590,170 690,130',
    checkpoints: [
      { name: 'Lower Gorge Incline', elevation: '980 m', status: 'Active Slope Creep', risk: 'HIGH' },
      { name: 'Sector 4 Fault Slip', elevation: '1,240 m', status: 'Rockfall Hazard', risk: 'CRITICAL' },
      { name: 'Barricaded Ramp', elevation: '1,180 m', status: 'Restricted Access', risk: 'CRITICAL' }
    ]
  }
};

function renderRoute() {
  const selected = getSelectedLocation();
  const from = appState.selectedRoute.from || selected.name;
  const to = appState.selectedRoute.to || selected.safeZones[0] || 'Umiam Safe Point';
  const corridorKey = appState.activeCorridor || 'safest';
  const corridor = routeCorridors[corridorKey] || routeCorridors.safest;

  const panel = document.getElementById('routePanel');
  if (!panel) return;

  // Sync corridor tabs UI
  document.querySelectorAll('#routeCorridorTabs button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.corridor === corridorKey);
  });

  // Sync reroute banner
  const banner = document.getElementById('routeRerouteBanner');
  if (banner) {
    if (appState.reroutingActive) {
      banner.classList.remove('hidden');
      const title = document.getElementById('rerouteTitle');
      const subtitle = document.getElementById('rerouteSubtitle');
      const badge = document.getElementById('rerouteBadge');
      if (appState.reroutingStage === 1) {
        banner.className = 'route-reroute-banner critical';
        if (title) title.textContent = 'ROUTE RISK INCREASED';
        if (subtitle) subtitle.textContent = `Slope sensor anomaly detected along Primary Corridor near ${selected.name}. Recalculating...`;
        if (badge) { badge.textContent = 'HAZARD DETECTED'; badge.className = 'status-chip red'; }
      } else if (appState.reroutingStage === 2) {
        banner.className = 'route-reroute-banner';
        if (title) title.textContent = 'AI ENGINE RECALCULATING...';
        if (subtitle) subtitle.textContent = 'Evaluating topographic slope resistance and active sensor telemetry...';
        if (badge) { badge.textContent = 'COMPUTING DETOUR'; badge.className = 'status-chip warning'; }
      } else {
        banner.className = 'route-reroute-banner';
        if (title) title.textContent = 'SAFER ROUTE FOUND';
        if (subtitle) subtitle.textContent = 'Switched to Upper Ridge Parkway Bypass. Exposure to vulnerable slope minimized.';
        if (badge) { badge.textContent = 'REROUTED (LOW RISK)'; badge.className = 'status-chip green'; }
      }
    } else {
      banner.classList.add('hidden');
    }
  }

  panel.innerHTML = `
    <div class="route-card">
      <div class="route-map">
        <svg viewBox="0 0 780 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeSafeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#20c997" />
              <stop offset="100%" stop-color="#38d9a9" />
            </linearGradient>
            <linearGradient id="routeAltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#42c4ff" />
              <stop offset="100%" stop-color="#1e70d4" />
            </linearGradient>
            <linearGradient id="routeHighGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff7b39" />
              <stop offset="100%" stop-color="#e03131" />
            </linearGradient>
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          <!-- Topographic Contour Lines -->
          <path d="M 0,90 Q 200,60 400,90 T 780,80" stroke="rgba(120, 175, 230, 0.12)" stroke-width="1.2" fill="none" />
          <path d="M 0,160 Q 180,130 380,160 T 780,150" stroke="rgba(120, 175, 230, 0.1)" stroke-width="1.2" fill="none" />
          <path d="M 0,240 Q 240,210 440,250 T 780,230" stroke="rgba(120, 175, 230, 0.08)" stroke-width="1.2" fill="none" />

          <!-- Hazard Corridor Polygon Area -->
          <polygon points="340,140 480,120 450,230 310,210" fill="rgba(224, 49, 49, 0.12)" stroke="rgba(224, 49, 49, 0.35)" stroke-dasharray="4 3" />
          <text x="390" y="180" fill="#ff7b8a" font-size="10" font-family="'IBM Plex Mono', monospace" text-anchor="middle" letter-spacing="1">SLOPE FAILURE ZONE</text>

          <!-- Corridors -->
          <path d="${routeCorridors.highrisk.pathD}" stroke="${corridorKey === 'highrisk' ? 'url(#routeHighGrad)' : 'rgba(224, 49, 49, 0.28)'}" stroke-width="${corridorKey === 'highrisk' ? '4' : '2'}" stroke-dasharray="${corridorKey === 'highrisk' ? '8 4' : '4 4'}" fill="none" ${corridorKey === 'highrisk' ? 'class="route-path-animated" filter="url(#routeGlow)"' : ''} />
          <path d="${routeCorridors.alternative.pathD}" stroke="${corridorKey === 'alternative' ? 'url(#routeAltGrad)' : 'rgba(66, 196, 255, 0.28)'}" stroke-width="${corridorKey === 'alternative' ? '4' : '2'}" stroke-dasharray="${corridorKey === 'alternative' ? '8 4' : '4 4'}" fill="none" ${corridorKey === 'alternative' ? 'class="route-path-animated" filter="url(#routeGlow)"' : ''} />
          <path d="${routeCorridors.safest.pathD}" stroke="${corridorKey === 'safest' ? 'url(#routeSafeGrad)' : 'rgba(32, 201, 151, 0.28)'}" stroke-width="${corridorKey === 'safest' ? '4.5' : '2'}" stroke-dasharray="${corridorKey === 'safest' ? '8 4' : '4 4'}" fill="none" ${corridorKey === 'safest' ? 'class="route-path-animated" filter="url(#routeGlow)"' : ''} />

          <!-- Checkpoint Marker Nodes -->
          <g>
            <circle cx="210" cy="215" r="5" fill="#122538" stroke="${corridor.color}" stroke-width="2" />
            <text x="210" y="235" fill="var(--muted)" font-size="9" font-family="'IBM Plex Mono', monospace" text-anchor="middle">CP-01</text>
          </g>
          <g>
            <circle cx="370" cy="180" r="5" fill="#122538" stroke="${corridor.color}" stroke-width="2" />
            <text x="370" y="200" fill="var(--muted)" font-size="9" font-family="'IBM Plex Mono', monospace" text-anchor="middle">CP-02</text>
          </g>
          <g>
            <circle cx="530" cy="145" r="5" fill="#122538" stroke="${corridor.color}" stroke-width="2" />
            <text x="530" y="165" fill="var(--muted)" font-size="9" font-family="'IBM Plex Mono', monospace" text-anchor="middle">CP-03</text>
          </g>

          <!-- Origin and Destination Markers -->
          <circle cx="80" cy="240" r="8" fill="#42c4ff" stroke="#fff" stroke-width="2" class="nav-pulse-marker" />
          <text x="80" y="265" fill="#fff" font-size="10" font-family="'IBM Plex Sans', sans-serif" font-weight="700" text-anchor="middle">ORIGIN</text>

          <circle cx="690" cy="130" r="8" fill="var(--green)" stroke="#fff" stroke-width="2" class="nav-pulse-marker" />
          <text x="690" y="112" fill="#fff" font-size="10" font-family="'IBM Plex Sans', sans-serif" font-weight="700" text-anchor="middle">SAFE ZONE</text>
        </svg>
      </div>

      <div class="route-metrics-bar">
        <div class="route-metric-pill">
          <span>Estimated Distance</span>
          <strong>${corridor.distance}</strong>
        </div>
        <div class="route-metric-pill">
          <span>Estimated Travel Time</span>
          <strong>${corridor.eta}</strong>
        </div>
        <div class="route-metric-pill">
          <span>Terrain Exposure</span>
          <strong>${corridor.terrainExposure}</strong>
        </div>
        <div class="route-metric-pill">
          <span>Corridor Risk</span>
          <strong style="color: ${corridor.color};">${corridor.riskLevel} (${corridor.riskScore}%)</strong>
        </div>
      </div>
    </div>

    <div class="route-summary">
      <h4>PROTOTYPE ROUTE SIMULATION</h4>
      <p><strong>Active Corridor:</strong> ${corridor.name}</p>
      <p>Path navigation dynamically evaluates slope inclinometers, historical debris channels, and real-time precipitation radars. High-risk corridors are locked when saturation exceeds 75%.</p>
      
      <h5 style="margin: 14px 0 8px; font-size: 0.76rem; letter-spacing: 0.1em; color: var(--muted);">CORRIDOR CHECKPOINTS &amp; GROUND CONDITIONS</h5>
      <div style="display: grid; gap: 6px;">
        ${corridor.checkpoints.map(cp => `
          <div class="intel-row" style="padding: 8px 10px; background: rgba(8, 16, 26, 0.6); border-radius: 8px;">
            <span><strong>${cp.name}</strong> • ${cp.elevation}</span>
            <span class="status-chip ${cp.risk.toLowerCase()}">${cp.status}</span>
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 14px; display: flex; gap: 8px;">
        <button type="button" class="action-btn" data-goto="map">INSPECT ON RISK MAP</button>
        <button type="button" class="action-btn" data-goto="zones">VIEW SAFE ZONES</button>
      </div>
    </div>
  `;
}

function renderPrecautions() {
  const risk = riskScoreFromLocation(getSelectedLocation());
  const currentLevel = getEndRiskLabel(risk);

  const guidance = {
    LOW: ['Monitor rainfall and keep emergency contacts ready.', 'Remain alert to road conditions and local advisories.'],
    MEDIUM: ['Check updated advisories before travel.', 'Avoid isolated slope routes and unstable terrain.'],
    HIGH: ['Avoid travelling through vulnerable slope areas.', 'Monitor emergency alerts and keep emergency contacts available.'],
    CRITICAL: ['Avoid travelling through vulnerable slope areas.', 'Follow authority instructions immediately and move to safer locations when advised.']
  };

  const items = guidance[currentLevel] || guidance.HIGH;
  document.getElementById('precautionList').innerHTML = `
    <div class="precaution-item">
      <strong>Current Risk: ${currentLevel}</strong>
      <p>Prototype Safety Guidance for ${currentLevel} risk. Follow all local advisories and keep emergency routes clear.</p>
    </div>
    <div class="precaution-item">
      <strong>Immediate Action</strong>
      <p>${items[0]}</p>
    </div>
    <div class="precaution-item">
      <strong>Preparedness</strong>
      <p>${items[1] || items[0]}</p>
    </div>
    <div class="precaution-item">
      <strong>Authority Coordination</strong>
      <p>Keep emergency contacts available and stay connected to official response channels.</p>
    </div>
  `;
}

function renderContacts() {
  const target = document.getElementById('contactGrid');
  if (!target) return;
  target.innerHTML = emergencyContacts.map(contact => `
    <div class="contact-card">
      <h4>${contact.category}</h4>
      <div class="meta">
        <span>Service Name: ${contact.name}</span>
        <span>Emergency Number: ${contact.number}</span>
        <span>Region: ${contact.region}</span>
        <span>Availability: ${contact.status}</span>
      </div>
      <div class="actions">
        <button class="action-btn" data-contact-action="call" data-contact="${contact.name}">CALL</button>
        <button class="action-btn" data-contact-action="notify" data-contact="${contact.name}">NOTIFY</button>
      </div>
    </div>
  `).join('');
}

function renderEnergy() {
  const target = document.getElementById('energyGrid');
  if (!target) return;
  const modeLabel = document.getElementById('systemModeLabel');
  if (modeLabel) modeLabel.textContent = appState.systemMode;
  target.innerHTML = energyModes.map(mode => `
    <div class="energy-card">
      <h4>${mode.label}</h4>
      <div class="meta">
        <span>Current Status: ${appState.systemMode === mode.label ? 'ACTIVE' : 'STANDBY'}</span>
      </div>
      <div class="switch-row">
        <span>Mode</span>
        <button type="button" class="toggle ${appState.systemMode === mode.label ? 'active' : ''}" data-energy-mode="${mode.label}" aria-label="Set ${mode.label}"></button>
      </div>
    </div>
  `).join('');
}

function renderMap() {
  const mapViewport = document.getElementById('mapViewport');
  if (!mapViewport) return;

  const selected = getSelectedLocation();
  const mapRiskFilter = document.getElementById('mapRiskFilter');
  const stateFilter = document.getElementById('mapStateFilter');
  const districtFilter = document.getElementById('mapDistrictFilter');
  const sensorFilter = document.getElementById('mapSensorFilter');
  const mapLayerFilter = document.getElementById('mapLayerFilter');
  const searchValue = document.getElementById('searchLocation')?.value.trim().toLowerCase() || '';

  const activeLayer = mapLayerFilter ? mapLayerFilter.value : 'standard';
  mapViewport.dataset.layer = activeLayer;
  const zoom = appState.mapZoom || 1.0;

  const filteredLocations = locationCatalog.filter(location => {
    const stateMatch = !stateFilter || stateFilter.value === 'all' || location.state === stateFilter.value;
    const districtMatch = !districtFilter || districtFilter.value === 'all' || location.district === districtFilter.value;
    const riskMatch = !mapRiskFilter || mapRiskFilter.value === 'all' || getEndRiskLabel(riskScoreFromLocation(location)) === mapRiskFilter.value;
    const sensorMatch = !sensorFilter || sensorFilter.value === 'all' ||
      (sensorFilter.value === 'online' && location.sensorStatus === 'online') ||
      (sensorFilter.value === 'warning' && location.sensorStatus === 'warning') ||
      (sensorFilter.value === 'offline' && location.sensorStatus === 'offline');
    const searchMatch = !searchValue || location.name.toLowerCase().includes(searchValue) || location.state.toLowerCase().includes(searchValue);
    return stateMatch && districtMatch && riskMatch && sensorMatch && searchMatch;
  });

  // Layer-specific SVG elements
  const showHeatmap = activeLayer === 'heatmap';
  const showSensors = activeLayer === 'sensors';
  const showRainfall = activeLayer === 'rainfall';
  const showSlope = activeLayer === 'slope';
  const showSafe = activeLayer === 'safe';
  const showIncidents = activeLayer === 'incidents';
  const showTerrain = activeLayer === 'terrain' || activeLayer === 'standard';

  // Heatmap circles
  const heatmapSvg = showHeatmap ? filteredLocations.map(loc => {
    const risk = riskScoreFromLocation(loc);
    const color = getRiskColor(risk);
    const radius = Math.max(28, (risk / 100) * 58);
    const opacity = (risk / 100) * 0.48;
    return `<circle cx="${loc.mapX}%" cy="${loc.mapY}%" r="${radius}" fill="${color}" opacity="${opacity}" filter="url(#mapBlur)" class="map-risk-halo" />`;
  }).join('') : '';

  // Rainfall Radar Grid Overlay
  const rainfallSvg = showRainfall ? `
    <g class="map-rainfall-layer" opacity="0.65">
      <defs>
        <pattern id="radarGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="none" stroke="rgba(66, 196, 255, 0.14)" stroke-width="0.8" />
          <circle cx="15" cy="15" r="2" fill="rgba(66, 196, 255, 0.3)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#radarGrid)" />
      <circle cx="48%" cy="32%" r="120" fill="rgba(66, 196, 255, 0.18)" filter="url(#mapBlur)" />
      <circle cx="81%" cy="30%" r="90" fill="rgba(255, 77, 95, 0.2)" filter="url(#mapBlur)" />
      <text x="48%" y="24%" fill="#6be3ff" font-size="11" font-family="'IBM Plex Mono', monospace">PRECIPITATION BAND: 82 mm/hr</text>
      <text x="81%" y="22%" fill="#ff7b8a" font-size="11" font-family="'IBM Plex Mono', monospace">CLOUDBURST ANOMALY: 96 mm/hr</text>
    </g>
  ` : '';

  // Slope Displacement Vectors
  const slopeVectorsSvg = showSlope ? filteredLocations.map(loc => {
    const risk = riskScoreFromLocation(loc);
    const color = getRiskColor(risk);
    const dx = loc.slopeMovement * 0.35;
    const dy = loc.slopeMovement * 0.45;
    return `
      <g>
        <line x1="${loc.mapX}%" y1="${loc.mapY}%" x2="calc(${loc.mapX}% + ${dx}px)" y2="calc(${loc.mapY}% + ${dy}px)" stroke="${color}" stroke-width="2.5" class="map-slope-vector" marker-end="url(#vectorArrow)" />
        <text x="calc(${loc.mapX}% + ${dx + 8}px)" y="calc(${loc.mapY}% + ${dy + 4}px)" fill="${color}" font-size="9" font-family="'IBM Plex Mono', monospace" font-weight="600">${loc.slopeMovement} mm/hr</text>
      </g>
    `;
  }).join('') : '';

  // Safe Shelters
  const safeSheltersSvg = showSafe ? selected.safeZones.map((zone, idx) => {
    const left = Math.min(88, Math.max(12, selected.mapX + (idx % 2 === 0 ? 9 : -9)));
    const top = Math.min(82, Math.max(16, selected.mapY + (idx * 12) - 8));
    return `
      <g class="safe-zone-node">
        <circle cx="${left}%" cy="${top}%" r="14" fill="rgba(32, 201, 151, 0.22)" stroke="var(--green)" stroke-width="1.8" />
        <circle cx="${left}%" cy="${top}%" r="4" fill="var(--green)" />
        <text x="${left}%" y="${top + 4}%" fill="#fff" font-size="9.5" font-family="'IBM Plex Sans', sans-serif" font-weight="700" text-anchor="middle">${zone}</text>
      </g>
    `;
  }).join('') : '';

  // Active Incidents and Rescue vectors
  const incidentsSvg = showIncidents ? incidentTableData.slice(0, 3).map((inc, i) => {
    const loc = locationCatalog.find(l => l.name === inc.location) || locationCatalog[i];
    return `
      <g class="incident-marker-group">
        <circle cx="${loc.mapX}%" cy="${loc.mapY}%" r="16" fill="rgba(224, 49, 49, 0.25)" stroke="var(--red)" stroke-width="2" class="map-risk-halo" />
        <rect x="calc(${loc.mapX}% - 34px)" y="calc(${loc.mapY}% - 34px)" width="68" height="18" rx="4" fill="#140608" stroke="var(--red)" stroke-width="1" />
        <text x="${loc.mapX}%" y="calc(${loc.mapY}% - 22px)" fill="#ffd4d9" font-size="9" font-family="'IBM Plex Mono', monospace" text-anchor="middle" font-weight="700">${inc.id} • ${inc.status}</text>
      </g>
    `;
  }).join('') : '';

  // Map markers
  const markersHtml = filteredLocations.map(location => {
    const risk = riskScoreFromLocation(location);
    const level = getEndRiskLabel(risk);
    const isSelected = location.id === selected.id;
    const isCritical = level === 'CRITICAL';
    const isHigh = level === 'HIGH';

    return `
      <div
        class="marker-wrapper"
        style="position: absolute; left: ${location.mapX}%; top: ${location.mapY}%; transform: translate(-50%, -50%); z-index: ${isSelected ? 8 : 4};"
        data-location-id="${location.id}"
      >
        ${(isCritical || isHigh) ? `<div class="map-risk-halo" style="position: absolute; inset: -10px; border-radius: 50%; border: 1.5px solid ${getRiskColor(risk)}; pointer-events: none;"></div>` : ''}
        ${isSelected ? `<div class="marker-reticle" style="position: absolute; inset: -14px; border: 1.5px dashed #42c4ff; border-radius: 50%; animation: radarRotate 8s linear infinite; pointer-events: none;"></div>` : ''}
        <button
          type="button"
          class="marker ${level.toLowerCase()} ${isSelected ? 'selected' : ''}"
          data-location-id="${location.id}"
          title="${location.name}"
          aria-label="${location.name} - ${risk}% ${level} risk"
        >
          <span class="marker-core"></span>
        </button>
        <span class="marker-label-tag" style="position: absolute; left: 16px; top: -6px; white-space: nowrap; font-family: 'IBM Plex Mono', monospace; font-size: 10px; padding: 2px 6px; border-radius: 4px; background: rgba(5, 12, 22, 0.9); border: 1px solid var(--border); color: #edf5ff; pointer-events: none;">
          ${location.name.replace(' Monitoring Zone', '')} <strong style="color:${getRiskColor(risk)};">${risk}%</strong>
        </span>
      </div>
    `;
  }).join('');

  mapViewport.innerHTML = `
    <div class="map-telemetry">
      <span>LIVE GEOSPATIAL TELEMETRY</span>
      <strong>${selected.name.toUpperCase()} • ${riskScoreFromLocation(selected)}% ${getEndRiskLabel(riskScoreFromLocation(selected))}</strong>
    </div>

    <div class="map-badge">${selected.state.toUpperCase()} <i>›</i> ${selected.district.toUpperCase()}</div>

    <div class="map-legend">
      <span><i class="legend-dot risk"></i>Risk Signal</span>
      <span><i class="legend-dot route"></i>Safe Corridor</span>
      <span><i class="legend-dot safe"></i>Safe Zone</span>
      <span><i class="legend-dot" style="background:var(--blue);"></i>IoT Sensors</span>
    </div>

    <div class="map-radar-sweep-beam"></div>

    <div class="map-stage-scalable" style="position: absolute; inset: 0; width: 100%; height: 100%; transform: scale(${zoom}); transform-origin: 50% 50%; transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);">
      <svg class="ner-svg-map" viewBox="0 0 1000 700" preserveAspectRatio="none">
        <defs>
          <filter id="mapBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <marker id="vectorArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="context-stroke" />
          </marker>
          <linearGradient id="nerLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#09182a" />
            <stop offset="50%" stop-color="#0d2138" />
            <stop offset="100%" stop-color="#071322" />
          </linearGradient>
        </defs>

        <!-- North East India Regional Base Silhouette -->
        <path
          class="ner-regional-land"
          d="M 120,170 C 180,120, 280,100, 390,90 C 520,80, 680,110, 840,150 C 890,190, 880,280, 820,340 C 810,420, 770,510, 740,580 C 700,660, 620,680, 530,640 C 460,610, 420,530, 360,490 C 290,480, 210,430, 180,360 C 140,290, 100,220, 120,170 Z"
          fill="url(#nerLandGrad)"
          stroke="#1b395b"
          stroke-width="1.8"
        />

        <!-- Topographic Ridge Elevation Bands -->
        <g class="map-layer-terrain" opacity="0.6">
          <path d="M 140,190 Q 300,140 500,120 T 820,170" stroke="rgba(66, 196, 255, 0.22)" stroke-width="1.4" fill="none" />
          <path d="M 160,250 Q 320,190 530,170 T 800,230" stroke="rgba(66, 196, 255, 0.18)" stroke-width="1.4" fill="none" />
          <path d="M 200,320 Q 360,260 560,240 T 780,310" stroke="rgba(66, 196, 255, 0.15)" stroke-width="1.2" fill="none" />
          <path d="M 240,390 Q 420,330 600,340 T 740,420" stroke="rgba(66, 196, 255, 0.12)" stroke-width="1.2" fill="none" />
          <path d="M 320,470 Q 480,420 640,430 T 720,520" stroke="rgba(66, 196, 255, 0.1)" stroke-width="1.2" fill="none" />
          <path d="M 420,550 Q 540,510 650,530 T 690,620" stroke="rgba(66, 196, 255, 0.08)" stroke-width="1.2" fill="none" />
        </g>

        <!-- Brahmaputra River Major Drainage Channel -->
        <path
          class="ner-river-brahmaputra"
          d="M 820,190 C 720,220, 580,240, 470,270 C 370,300, 270,360, 210,450"
          fill="none"
          stroke="#1d5c88"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.75"
        />

        <!-- Active Low-Risk Route Corridor Line -->
        <path
          d="M 340,336 C 380,390, 440,370, 480,224 S 600,380, 640,308"
          fill="none"
          stroke="rgba(32, 201, 151, 0.65)"
          stroke-width="2.5"
          stroke-dasharray="6 4"
          class="route-path-animated"
        />

        ${heatmapSvg}
        ${rainfallSvg}
        ${slopeVectorsSvg}
        ${safeSheltersSvg}
        ${incidentsSvg}
      </svg>

      <!-- Active Marker Overlay -->
      ${markersHtml}
    </div>

    <!-- Floating HUD Hover Tooltip -->
    <div class="map-hover-tooltip hidden" id="mapHoverTooltip" aria-hidden="true"></div>
  `;

  // Bind marker hover events for live data inspection
  const tooltip = document.getElementById('mapHoverTooltip');
  mapViewport.querySelectorAll('.marker-wrapper').forEach(wrapper => {
    const locId = Number(wrapper.dataset.locationId);
    const loc = locationCatalog.find(l => l.id === locId);
    if (!loc) return;

    wrapper.addEventListener('mouseenter', (e) => {
      if (!tooltip) return;
      const risk = riskScoreFromLocation(loc);
      const level = getEndRiskLabel(risk);
      const rect = mapViewport.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      const left = wrapRect.left - rect.left + 24;
      const top = wrapRect.top - rect.top - 10;

      tooltip.innerHTML = `
        <h5>${loc.name}</h5>
        <div class="tooltip-grid">
          <span>State: <strong>${loc.state}</strong></span>
          <span>District: <strong>${loc.district}</strong></span>
          <span>Risk Probability: <strong style="color:${getRiskColor(risk)}">${risk}% (${level})</strong></span>
          <span>Rainfall: <strong>${loc.rainfall} mm/hr</strong></span>
          <span>Soil Moisture: <strong>${loc.soilMoisture}%</strong></span>
          <span>Slope Movement: <strong>${loc.slopeMovement} mm/hr</strong></span>
          <span>Sensor Network: <strong>${loc.sensorStatus.toUpperCase()}</strong></span>
        </div>
      `;
      tooltip.style.left = `${Math.min(rect.width - 200, Math.max(10, left))}px`;
      tooltip.style.top = `${Math.min(rect.height - 180, Math.max(10, top))}px`;
      tooltip.classList.remove('hidden');
    });

    wrapper.addEventListener('mouseleave', () => {
      tooltip?.classList.add('hidden');
    });

    wrapper.addEventListener('click', () => {
      appState.selectedLocationId = loc.id;
      appState.demoRiskOverride = null;
      syncAiModelFromLocation(loc);
      renderAll();
      showToast(`Selected monitoring zone: ${loc.name}`, 'info');
    });
  });

  renderMapInfoPanel();
}

function renderMapInfoPanel() {
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const level = getEndRiskLabel(risk);
  const action = risk >= 80 ? 'Evacuation readiness & emergency corridors open' : risk >= 60 ? 'Escalate warning advisory & response standby' : 'Routine continuous observation';
  const panel = document.getElementById('mapInfoPanel');
  if (!panel) return;

  panel.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
      <h4 style="margin: 0;">${selected.name}</h4>
      <span class="status-chip ${level.toLowerCase()}">${level}</span>
    </div>
    <div class="intel-row"><span>State &amp; District</span><strong>${selected.state} • ${selected.district}</strong></div>
    <div class="intel-row"><span>AI Landslide Probability</span><strong style="color:${getRiskColor(risk)}; font-size: 1.1rem;">${risk}%</strong></div>
    <div class="intel-row"><span>Sensor Network Health</span><strong class="status-chip ${selected.sensorStatus}">${selected.sensorStatus.toUpperCase()}</strong></div>
    <div class="intel-row"><span>Rainfall Rate</span><strong>${selected.rainfall} mm/hr</strong></div>
    <div class="intel-row"><span>Soil Saturation</span><strong>${selected.soilMoisture}%</strong></div>
    <div class="intel-row"><span>Slope Movement Velocity</span><strong>${selected.slopeMovement} mm/hr</strong></div>
    <div class="intel-row"><span>Slope Angle</span><strong>${selected.slopeAngle}°</strong></div>
    <div class="intel-row"><span>Current Weather</span><strong>${selected.weather}</strong></div>
    <div class="intel-row"><span>Configured Safe Zone</span><strong>${selected.safeZones[0]}</strong></div>
    <div class="intel-row"><span>Priority Action Advisory</span><strong>${action}</strong></div>
    <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
      <button type="button" class="action-btn wide" data-goto="route">CALCULATE SAFE ROUTE</button>
      <button type="button" class="action-btn wide" data-goto="prediction">RUN AI SIMULATION</button>
      <button type="button" class="action-btn wide" data-goto="alerts">VIEW ACTIVE ALERTS</button>
    </div>
  `;
}

function renderAiModel() {
  const model = appState.aiModel;
  const probability = calculateAiProbability(model);
  const level = getEndRiskLabel(probability);

  const labels = {
    rainfallIntensity: model.rainfallIntensity + ' mm/hr',
    rainfall24: model.rainfall24 + ' mm',
    rainfall72: model.rainfall72 + ' mm',
    soilMoisture: model.soilMoisture + '%',
    slopeMovement: model.slopeMovement + ' mm',
    slopeAngle: model.slopeAngle + '°',
    temperature: model.temperature + '°C',
    humidity: model.humidity + '%'
  };

  document.getElementById('rainIntensityValue').textContent = labels.rainfallIntensity;
  document.getElementById('rain24Value').textContent = labels.rainfall24;
  document.getElementById('rain72Value').textContent = labels.rainfall72;
  document.getElementById('soilValue').textContent = labels.soilMoisture;
  document.getElementById('slopeMoveValue').textContent = labels.slopeMovement;
  document.getElementById('slopeAngleValue').textContent = labels.slopeAngle;
  document.getElementById('temperatureValue').textContent = labels.temperature;
  document.getElementById('humidityValue').textContent = labels.humidity;

  document.getElementById('aiProbability').textContent = `${probability}%`;
  document.getElementById('aiProbability').style.color = getRiskColor(probability);
  document.getElementById('aiRiskLabel').textContent = `${level} RISK`;
  document.getElementById('aiRiskLabel').style.color = getRiskColor(probability);

  const forecastSteps = [
    { label: 'Now', value: probability },
    { label: '+6 hrs', value: Math.min(100, probability + (probability > 60 ? 7 : 4)) },
    { label: '+12 hrs', value: Math.min(100, probability + (probability > 60 ? 12 : 7)) },
    { label: '+24 hrs', value: Math.min(100, probability + (probability > 60 ? 16 : 10)) }
  ];
  document.getElementById('forecastStrip').innerHTML = forecastSteps.map(step => `
    <div class="forecast-step">
      <span>${step.label}</span>
      <strong style="color:${getRiskColor(step.value)}">${step.value}%</strong>
      <small>${getEndRiskLabel(step.value)}</small>
    </div>
  `).join('');

  const contributors = [
    { label: 'Rainfall', value: 35 },
    { label: 'Soil Moisture', value: 25 },
    { label: 'Slope Movement', value: 20 },
    { label: 'Slope Angle', value: 10 },
    { label: 'Weather Condition', value: 10 }
  ];

  const bars = contributors.map(item => {
    const width = `${(probability / 100) * item.value}%`;
    return `
      <div class="bar-row">
        <span>${item.label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${width};"></div></div>
        <strong>${item.value}%</strong>
      </div>
    `;
  }).join('');

  document.getElementById('riskContributionBars').innerHTML = bars;

  document.getElementById('aiReasonList').innerHTML = `
    <li>Rainfall intensity is elevated and sustained over the last 72 hours.</li>
    <li>Soil moisture is nearing saturation, reducing slope resistance.</li>
    <li>Slope movement is increasing and may indicate early ground deformation.</li>
    <li>Current weather condition is amplifying the instability signal.</li>
  `;
}

function calculateAiProbability(model) {
  const rainfallWeight = (model.rainfallIntensity / 100) * 35;
  const moistureWeight = (model.soilMoisture / 100) * 25;
  const movementWeight = (model.slopeMovement / 100) * 20;
  const angleWeight = (model.slopeAngle / 60) * 10;
  const weatherBase = model.weatherCondition === 'heavyRain' ? 10 : model.weatherCondition === 'storm' ? 9 : model.weatherCondition === 'cloudburst' ? 10 : 4;
  const result = Math.round(rainfallWeight + moistureWeight + movementWeight + angleWeight + weatherBase);
  return Math.min(100, Math.max(12, result));
}

const intelligenceCrosshairPlugin = {
  id: 'intelligenceCrosshair',
  afterDraw(chart) {
    const active = chart.tooltip?._active?.[0];
    if (!active) return;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.strokeStyle = 'rgba(66, 196, 255, 0.55)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(active.element.x, chartArea.top);
    ctx.lineTo(active.element.x, chartArea.bottom);
    ctx.stroke();

    // Draw active point highlight halo
    ctx.beginPath();
    ctx.arc(active.element.x, active.element.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(66, 196, 255, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
};

function getCustomChartTooltip(extraMetrics = true) {
  return {
    enabled: true,
    mode: 'index',
    intersect: false,
    backgroundColor: 'rgba(6, 14, 25, 0.95)',
    titleColor: '#6be3ff',
    titleFont: { family: "'IBM Plex Mono', monospace", size: 11, weight: '600' },
    bodyColor: '#edf5ff',
    bodyFont: { family: "'IBM Plex Sans', sans-serif", size: 12 },
    borderColor: 'rgba(66, 196, 255, 0.35)',
    borderWidth: 1,
    padding: 12,
    boxPadding: 6,
    cornerRadius: 8,
    displayColors: true,
    callbacks: {
      title(items) {
        const item = items[0];
        const raw = item?.label || '';
        const timeMap = {
          '00h': '12:00 AM (Sync 01)',
          '04h': '04:00 AM (Sync 02)',
          '08h': '08:00 AM (Sync 03)',
          '12h': '12:00 PM (Sync 04)',
          '18h': '06:00 PM (Sync 05)',
          'Now': '12:42 PM (Live Telemetry)',
          'Mon': 'Monday · 12:42 PM',
          'Tue': 'Tuesday · 12:42 PM',
          'Wed': 'Wednesday · 12:42 PM',
          'Thu': 'Thursday · 12:42 PM',
          'Fri': 'Friday · 12:42 PM',
          'Sat': 'Saturday · 12:42 PM'
        };
        return timeMap[raw] || `${raw} · 12:42 PM`;
      },
      afterBody(items) {
        if (!extraMetrics) return [];
        const selected = getSelectedLocation();
        const item = items[0];
        const idx = item?.dataIndex ?? 0;
        const factor = [0.45, 0.58, 0.72, 0.85, 0.94, 1.0][idx] ?? 1.0;
        const rainVal = Math.round(selected.rainfall * factor);
        const soilVal = Math.min(100, Math.round(selected.soilMoisture * (0.6 + factor * 0.4)));
        const slopeVal = (selected.slopeMovement * (0.5 + factor * 0.5) / 10).toFixed(1);
        return [
          `── Related Telemetry ──`,
          `Rainfall: ${rainVal} mm`,
          `Soil Moisture: ${soilVal}%`,
          `Slope Movement: ${slopeVal} mm/hr`
        ];
      }
    }
  };
}

function renderCharts() {
  appState.chartInstances.forEach(chart => chart.destroy());
  appState.chartInstances = [];
  if (typeof Chart !== 'undefined' && !Chart.registry.plugins.get('intelligenceCrosshair')) {
    Chart.register(intelligenceCrosshairPlugin);
  }

  const ctxRiskTrend = document.getElementById('riskTrendChart');
  const ctxRainRisk = document.getElementById('rainRiskChart');
  const ctxFactor = document.getElementById('factorChart');
  const ctxDistribution = document.getElementById('riskDistributionChart');
  const ctxVulnerable = document.getElementById('vulnerableChart');
  const ctxAlertFrequency = document.getElementById('alertFrequencyChart');
  const ctxWeatherHistory = document.getElementById('weatherHistoryChart');
  const ctxSensorHealth = document.getElementById('sensorHealthChart');
  const ctxHeatmap = document.getElementById('heatmapChart');
  const ctxWeatherCompare = document.getElementById('weatherCompareChart');

  const base = phaseDefinitions[appState.phaseIndex].risk;
  const riskTrendData = [18, 34, 52, 74, 88, base].map(val => Math.min(100, val));
  const rainfallData = [12, 22, 36, 52, 66, 82];
  const riskValues = [20, 35, 48, 66, 78, base];

  // 1. Risk Trend Chart
  if (ctxRiskTrend) {
    appState.chartInstances.push(new Chart(ctxRiskTrend, {
      type: 'line',
      data: {
        labels: ['00h', '04h', '08h', '12h', '18h', 'Now'],
        datasets: [{
          label: 'Risk Probability',
          data: riskTrendData,
          borderColor: '#60b4ff',
          backgroundColor: 'rgba(96,180,255,0.16)',
          fill: true,
          tension: 0.42,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#60b4ff',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: getCustomChartTooltip(true)
        },
        scales: {
          y: { grid: { color: 'rgba(120, 175, 230, 0.1)' }, ticks: { color: 'var(--muted)', callback: v => `${v}%` } },
          x: { grid: { color: 'rgba(120, 175, 230, 0.08)' }, ticks: { color: 'var(--muted)' } }
        }
      }
    }));
  }

  // 2. Rainfall vs Landslide Risk
  if (ctxRainRisk) {
    appState.chartInstances.push(new Chart(ctxRainRisk, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          { label: 'Rainfall (mm)', data: rainfallData, backgroundColor: '#5ea1ff', borderRadius: 6 },
          { label: 'Risk Probability (%)', data: riskValues, type: 'line', borderColor: '#ff9c45', backgroundColor: 'transparent', tension: 0.4, pointRadius: 4, pointHoverRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, labels: { color: 'var(--text)' } },
          tooltip: getCustomChartTooltip(true)
        },
        scales: {
          y: { grid: { color: 'rgba(120, 175, 230, 0.1)' }, ticks: { color: 'var(--muted)' } },
          x: { grid: { color: 'rgba(120, 175, 230, 0.08)' }, ticks: { color: 'var(--muted)' } }
        }
      }
    }));
  }

  // 3. Radar Factor Chart
  if (ctxFactor) {
    appState.chartInstances.push(new Chart(ctxFactor, {
      type: 'radar',
      data: {
        labels: ['Rainfall', 'Soil Moisture', 'Slope Movement', 'Slope Angle', 'Weather Condition'],
        datasets: [{
          label: 'Factor Weight',
          data: [35, 25, 20, 10, 10],
          borderColor: '#66d0ff',
          backgroundColor: 'rgba(102,208,255,0.18)',
          pointBackgroundColor: '#66d0ff',
          pointBorderColor: '#fff',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 40,
            grid: { color: 'rgba(120, 175, 230, 0.15)' },
            angleLines: { color: 'rgba(120, 175, 230, 0.15)' },
            pointLabels: { color: 'var(--muted)', font: { size: 11 } },
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: getCustomChartTooltip(false)
        }
      }
    }));
  }

  // 4. Risk Distribution Doughnut
  if (ctxDistribution) {
    appState.chartInstances.push(new Chart(ctxDistribution, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical Risk'],
        datasets: [{
          data: [28, 22, 33, 17],
          backgroundColor: ['#20c997', '#f59f00', '#f76707', '#e03131'],
          borderWidth: 2,
          borderColor: '#060e1a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        plugins: {
          legend: { position: 'bottom', labels: { color: 'var(--text)', font: { size: 11 } } },
          tooltip: getCustomChartTooltip(false)
        }
      }
    }));
  }

  // 5. Most Vulnerable Locations
  if (ctxVulnerable) {
    appState.chartInstances.push(new Chart(ctxVulnerable, {
      type: 'bar',
      data: {
        labels: ['Gangtok', 'Shillong', 'Kohima', 'Dirang', 'Imphal'],
        datasets: [{
          data: [91, 78, 69, 55, 44],
          backgroundColor: ['#e03131', '#f76707', '#f59f00', '#42c4ff', '#20c997'],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        plugins: {
          legend: { display: false },
          tooltip: getCustomChartTooltip(true)
        },
        scales: {
          x: { grid: { color: 'rgba(120, 175, 230, 0.1)' }, ticks: { color: 'var(--muted)', callback: v => `${v}%` } },
          y: { grid: { display: false }, ticks: { color: 'var(--text)' } }
        }
      }
    }));
  }

  // 6. Alert Frequency Trend
  if (ctxAlertFrequency) {
    appState.chartInstances.push(new Chart(ctxAlertFrequency, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          { label: 'Medium Risk', data: [3, 4, 8, 6, 9, 7], borderColor: '#f59f00', tension: 0.4, pointRadius: 3 },
          { label: 'High Risk', data: [2, 3, 5, 7, 8, 10], borderColor: '#f76707', tension: 0.4, pointRadius: 3 },
          { label: 'Critical Risk', data: [0, 1, 2, 3, 4, 5], borderColor: '#e03131', tension: 0.4, pointRadius: 3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: 'var(--text)' } },
          tooltip: getCustomChartTooltip(false)
        },
        scales: {
          y: { grid: { color: 'rgba(120, 175, 230, 0.1)' }, ticks: { color: 'var(--muted)' } },
          x: { grid: { color: 'rgba(120, 175, 230, 0.08)' }, ticks: { color: 'var(--muted)' } }
        }
      }
    }));
  }

  // 7. Weather History Chart
  if (ctxWeatherHistory) {
    appState.chartInstances.push(new Chart(ctxWeatherHistory, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          { label: 'Rainfall (mm)', data: [55, 62, 70, 74, 80, 88], borderColor: '#60b4ff', backgroundColor: 'rgba(96,180,255,0.2)', fill: true, tension: 0.35 },
          { label: 'Humidity (%)', data: [70, 72, 78, 82, 85, 89], borderColor: '#7ac7ff', backgroundColor: 'rgba(122,199,255,0.1)', fill: true, tension: 0.35 },
          { label: 'Temperature (°C)', data: [23, 21, 20, 19, 18, 17], borderColor: '#ffc857', backgroundColor: 'rgba(255,200,87,0.1)', fill: true, tension: 0.35 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: 'var(--text)' } },
          tooltip: getCustomChartTooltip(true)
        },
        scales: {
          y: { grid: { color: 'rgba(120, 175, 230, 0.1)' }, ticks: { color: 'var(--muted)' } },
          x: { grid: { color: 'rgba(120, 175, 230, 0.08)' }, ticks: { color: 'var(--muted)' } }
        }
      }
    }));
  }

  // 8. Sensor Health Doughnut
  if (ctxSensorHealth) {
    appState.chartInstances.push(new Chart(ctxSensorHealth, {
      type: 'doughnut',
      data: {
        labels: ['Online (Normal)', 'Warning (Elevated)', 'Offline'],
        datasets: [{
          data: [247, 2, 1],
          backgroundColor: ['#20c997', '#f59f00', '#e03131'],
          borderWidth: 2,
          borderColor: '#060e1a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        plugins: {
          legend: { position: 'bottom', labels: { color: 'var(--text)' } },
          tooltip: getCustomChartTooltip(false)
        }
      }
    }));
  }

  // 9. Weather Comparison Chart in Weather Intelligence View
  if (ctxWeatherCompare) {
    const sel = getSelectedLocation();
    appState.chartInstances.push(new Chart(ctxWeatherCompare, {
      type: 'line',
      data: {
        labels: ['00h', '04h', '08h', '12h', '18h', 'Now'],
        datasets: [
          { label: 'Rainfall Intensity (mm/hr)', data: [18, 28, 45, 62, 75, sel.rainfall], borderColor: '#42c4ff', backgroundColor: 'rgba(66, 196, 255, 0.12)', fill: true, tension: 0.4 },
          { label: 'Soil Saturation (%)', data: [52, 58, 64, 70, 74, sel.soilMoisture], borderColor: '#20c997', backgroundColor: 'transparent', borderDash: [4, 4], tension: 0.4 },
          { label: 'Slope Movement (mm)', data: [22, 28, 38, 48, 56, sel.slopeMovement], borderColor: '#ff9c4a', backgroundColor: 'transparent', tension: 0.4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: null,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { labels: { color: 'var(--text)' } },
          tooltip: getCustomChartTooltip(true)
        },
        scales: {
          y: { grid: { color: 'rgba(120, 175, 230, 0.1)' }, ticks: { color: 'var(--muted)' } },
          x: { grid: { color: 'rgba(120, 175, 230, 0.08)' }, ticks: { color: 'var(--muted)' } }
        }
      }
    }));
  }

  // 10. Historical Heatmap Grid Canvas
  if (ctxHeatmap) {
    const heatmapValues = [
      [58, 66, 71, 53, 80, 92],
      [50, 61, 77, 83, 89, 95]
    ];
    const heatmapCtx = ctxHeatmap.getContext('2d');
    const width = ctxHeatmap.width || 600;
    const height = ctxHeatmap.height || 220;
    const cellWidth = width / heatmapValues[0].length;
    const cellHeight = height / heatmapValues.length;

    heatmapCtx.clearRect(0, 0, width, height);
    heatmapCtx.fillStyle = '#060e1a';
    heatmapCtx.fillRect(0, 0, width, height);

    heatmapValues.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const x = colIndex * cellWidth;
        const y = rowIndex * cellHeight;
        let color = '#20c997';
        if (value >= 60 && value < 80) color = '#f59f00';
        else if (value >= 80 && value < 90) color = '#f76707';
        else if (value >= 90) color = '#e03131';
        heatmapCtx.fillStyle = color;
        heatmapCtx.fillRect(x + 2, y + 2, cellWidth - 4, cellHeight - 4);
      });
    });

    heatmapCtx.fillStyle = '#edf5ff';
    heatmapCtx.font = '12px "IBM Plex Sans"';
    heatmapCtx.fillText('Week 1 (Prior)', 10, 18);
    heatmapCtx.fillText('Week 2 (Observed)', 10, 18 + cellHeight);
    heatmapCtx.fillStyle = '#8ea7c5';
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((label, index) => {
      heatmapCtx.fillText(label, index * cellWidth + 10, height - 8);
    });
  }
}

function renderAssistant() {
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const level = getEndRiskLabel(risk);
  const confidence = Math.min(98, Math.round(72 + (selected.sensorStatus === 'warning' ? 12 : 8) + appState.phaseIndex * 3));
  const action = risk >= 80 ? 'Prepare evacuation readiness' : risk >= 60 ? 'Escalate monitoring posture' : 'Continue routine observation';
  document.getElementById('assistantContext').innerHTML = `
    <div><span>LIVE RISK</span><strong style="color:${getRiskColor(risk)}">${risk}% ${level}</strong></div>
    <div><span>CONFIDENCE</span><strong>${confidence}%</strong></div>
    <div><span>SOURCE</span><strong>${appState.telemetrySource === 'PYTHON GATEWAY' ? 'LIVE GATEWAY' : 'SIMULATION'}</strong></div>
  `;
  document.getElementById('assistantAnswers').innerHTML = `
    <strong>${action}</strong><br>Current risk in ${selected.name} is ${risk}% (${level}). ${selected.weather} and ${selected.slopeMovement} mm slope movement are shaping the recommendation.
  `;
}

function answerAssistantQuery(query) {
  const normalized = query.trim().toLowerCase();
  const selected = getSelectedLocation();
  const risk = riskScoreFromLocation(selected);
  const level = getEndRiskLabel(risk);

  if (!normalized) {
    return 'Ask about current risk, rainfall, critical zones, safe route, online sensors, or emergency response.';
  }

  // Navigation commands
  if (normalized.includes('show') && normalized.includes('sensor')) {
    navigateTo('sensors');
    return `Navigating to Sensor Monitoring network for ${selected.name}.`;
  }
  if (normalized.includes('show') && (normalized.includes('route') || normalized.includes('map'))) {
    navigateTo(normalized.includes('map') ? 'map' : 'route');
    return `Opening ${normalized.includes('map') ? 'Geospatial Intelligence Map' : 'Safe Route Navigator'}.`;
  }

  // 1. Current Risk
  if (normalized.includes('current risk') || (normalized.includes('risk') && !normalized.includes('why') && !normalized.includes('high'))) {
    return `<strong>Current Landslide Probability for ${selected.name} (${selected.district}, ${selected.state}):</strong> <span style="color:${getRiskColor(risk)}">${risk}% [${level}]</span>.<br>Multi-factor breakdown: Rainfall Weight 35%, Soil Saturation 25%, Slope Vector Displacement 20%, Slope Gradient 10%, Weather System 10%. Operational posture: <em>${risk >= 80 ? 'Prepare immediate evacuation readiness.' : risk >= 60 ? 'Escalate monitoring posture.' : 'Maintain continuous observation.'}</em>`;
  }

  // 2. Why is the risk high?
  if (normalized.includes('why') || normalized.includes('factor') || normalized.includes('high')) {
    return `In <strong>${selected.name}</strong>, risk is driven by <strong>${selected.rainfall} mm/hr</strong> intense precipitation, soil saturation reaching <strong>${selected.soilMoisture}%</strong>, and slope vector displacement of <strong>${selected.slopeMovement} mm/hr</strong> under <em>${selected.weather}</em> conditions. Multi-layer sensor telemetry confirms shear strength degradation along active mountain fault lines.`;
  }

  // 3. Rainfall data
  if (normalized.includes('rain') || normalized.includes('precipitation')) {
    const rain24 = appState.aiModel.rainfall24 || Math.round(selected.rainfall * 3.6);
    const rain72 = appState.aiModel.rainfall72 || Math.round(selected.rainfall * 7.4);
    return `<strong>Precipitation Telemetry for ${selected.name}:</strong><br>• Current Intensity: <strong>${selected.rainfall} mm/hr</strong><br>• 24-Hour Cumulative: <strong>${rain24} mm</strong><br>• 72-Hour Cumulative: <strong>${rain72} mm</strong><br>Ground saturation index is at ${selected.soilMoisture}%, significantly exceeding baseline percolation limits.`;
  }

  // 4. Critical zones
  if (normalized.includes('critical') || normalized.includes('vulnerable') || normalized.includes('which zone')) {
    const sorted = [...locationCatalog]
      .map(l => ({ name: l.name, risk: riskScoreFromLocation(l), state: l.state, district: l.district }))
      .sort((a, b) => b.risk - a.risk);
    const top3 = sorted.slice(0, 3).map(z => `<strong>${z.name}</strong> (${z.district}, ${z.state}) at <span style="color:${getRiskColor(z.risk)}">${z.risk}%</span>`).join(', ');
    return `<strong>Highest Vulnerability Zones:</strong> ${top3}. Priority response surveillance and early warning dispatches are currently focused on these mountain corridors.`;
  }

  // 5. Nearest safe zone
  if (normalized.includes('shelter') || normalized.includes('safe zone') || normalized.includes('nearest safe')) {
    const primary = selected.safeZones[0] || 'Designated High-Ground Assembly Point';
    const secondary = selected.safeZones[1] || 'District Sports Complex Emergency Shelter';
    return `<strong>Designated Safe Havens for ${selected.name}:</strong><br>• Primary Haven: <strong>${primary}</strong> (Reinforced structural shelter on stable bedrock).<br>• Secondary Fallback: <strong>${secondary}</strong>.<br>Both zones have emergency medical caches, drinking water, and satellite communication links.`;
  }

  // 6. Routes to avoid
  if (normalized.includes('route') || normalized.includes('avoid') || normalized.includes('corridor')) {
    return `<strong>Route Advisory for ${selected.name}:</strong><br>⚠ <strong>AVOID:</strong> Lower Cliffside Highway and cut-slope mountain bypasses due to high rockfall and mudslide hazards.<br>✓ <strong>RECOMMENDED:</strong> Use the <em>Upper Ridge Parkway Bypass</em> (Low-Risk Corridor). Check the <strong>Safe Route</strong> view for real-time corridor status and checkpoint milestones.`;
  }

  // 7. Sensors online
  if (normalized.includes('sensor') || normalized.includes('online') || normalized.includes('telemetry') || normalized.includes('iot')) {
    const online = sensorCatalog.filter(s => s.status === 'online').length;
    const warning = sensorCatalog.filter(s => s.status === 'warning').length;
    const offline = sensorCatalog.filter(s => s.status === 'offline').length;
    return `<strong>IoT Sensor Grid Overview:</strong> 250 telemetry nodes active across 8 North-Eastern states.<br>• Online (Normal): <strong>${online} nodes</strong> (98.8%)<br>• Warning (Elevated): <strong>${warning} nodes</strong><br>• Offline: <strong>${offline} node</strong><br>Data stream syncs every 8s via automated edge gateway telemetry.`;
  }

  // 8. Live Demo query
  if (normalized.includes('live demo') || normalized.includes('demo') || normalized.includes('what happened')) {
    const phase = phaseDefinitions[appState.phaseIndex] || phaseDefinitions[0];
    return `<strong>Live Simulation Intelligence:</strong><br>Currently at <strong>${phase.label}</strong>.<br>• Monitored Zone: <strong>${selected.name}</strong> (${level} Risk, ${risk}%)<br>• Multi-Agency Sync: Weather telemetry, IoT sensor alarms, automated SMS/Radio broadcasts, and rescue team dispatches are coordinated across all dashboard views.`;
  }

  // 9. Report emergency / SOS
  if (normalized.includes('report') || normalized.includes('emergency') || normalized.includes('help') || normalized.includes('sos')) {
    return `<strong>Emergency Response Protocol:</strong><br>1. Open the <strong>Citizen Safety</strong> tab or click <em>Emergency Help</em>.<br>2. Submit your exact location and incident type (Landslide Trapped / Road Blocked / Medical Need).<br>3. The incident is instantly logged in the <strong>Authority Response</strong> command desk with automated team dispatch (Alpha Rescue / SDRF).`;
  }

  // Precautions & General Safety
  if (normalized.includes('precaution') || normalized.includes('prepare') || normalized.includes('before')) {
    return `<strong>Essential Landslide Precautions:</strong><br>1. Keep emergency grab-bag ready with essential documents, flashlight, and first-aid.<br>2. Stay alert for unusual sounds like trees cracking or boulders knocking together.<br>3. Avoid steep slopes, river valleys, and drainage gullies during heavy rain.<br>4. Follow official BhooShanket advisories and evacuate immediately when warned.`;
  }

  return `BhooShanket Disaster Intelligence active for <strong>${selected.name}</strong>. You can ask about current risk, rainfall, critical zones, safe routes, sensor status, or emergency response workflows.`;
}

function buildAlertMessage() {
  const loc = appState.communication.location || getSelectedLocation().name;
  const riskLevel = appState.communication.riskLevel || 'HIGH';
  const target = appState.communication.targetGroup || 'Villagers';
  const channel = appState.communication.channel || 'SMS';
  const msg = `⚠ BHOOSHANKET EMERGENCY ALERT\n\nHigh landslide risk has been detected near ${loc}.\nPlease avoid vulnerable areas and follow instructions from authorities.\nRisk Level: ${riskLevel}.\nTarget Group: ${target}.\nChannel: ${channel}.`;
  appState.communication.message = msg;
  const messageBox = document.getElementById('commMessageBox');
  if (messageBox) messageBox.textContent = msg;

  const timeline = ['MESSAGE GENERATED', 'QUEUED', 'DISPATCHED', 'DELIVERY SIMULATED'];
  const timelineTarget = document.getElementById('commTimeline');
  if (timelineTarget) timelineTarget.innerHTML = timeline.map((item, index) => `
    <span class="timeline-step complete"><i>${index + 1}</i>${item}</span>
  `).join('');
}

function initializeEvents() {
  const showDashboard = () => {
    appState.authenticated = true;
    document.getElementById('bootOverlay')?.remove();
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appShell').classList.remove('hidden');
    setAssistantState('minimized');
    appState.activeView = 'dashboard';
    renderAll();
  };

  const activateCommandNetwork = () => {
    const status = document.getElementById('authStatus');
    const submit = document.querySelector('.login-submit');
    const messages = ['AUTHENTICATION VERIFIED', 'SECURE CHANNEL ESTABLISHED', 'COMMAND NETWORK ONLINE'];
    let index = 0;
    if (submit) submit.querySelector('b').textContent = 'AUTHENTICATING...';
    if (status) status.classList.remove('hidden');
    const advance = () => {
      if (status) status.textContent = messages[index];
      index += 1;
      if (index < messages.length) setTimeout(advance, 240);
      else setTimeout(showDashboard, 360);
    };
    advance();
  };

  document.getElementById('demoAccessBtn')?.addEventListener('click', showDashboard);

  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const config = getAuthConfig();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const passcode = document.getElementById('passwordInput').value;
    // This is intentionally prototype-only client-side auth. A missing local
    // configuration must never become an open sign-in path.
    const configured = Boolean(config.email && config.passcode);
    const valid = configured && email === config.email && passcode === config.passcode;
    document.getElementById('loginError').classList.toggle('hidden', valid);
    if (valid) {
      const status = document.getElementById('authStatus');
      const submit = document.querySelector('.login-submit');
      if (status) { status.textContent = 'AUTHENTICATION VERIFIED'; status.classList.remove('hidden'); }
      if (submit) submit.disabled = true;
      persistAuth(document.getElementById('rememberMe').checked);
      activateCommandNetwork();
    } else {
      const status = document.getElementById('authStatus');
      if (status) status.classList.add('hidden');
      document.getElementById('loginError').textContent = 'Invalid email or passcode.';
    }
  });

  document.getElementById('togglePassword').addEventListener('click', () => {
    const input = document.getElementById('passwordInput');
    const btn = document.getElementById('togglePassword');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.textContent = isPassword ? 'Hide' : 'Show';
    btn.setAttribute('aria-label', isPassword ? 'Hide passcode' : 'Show passcode');
  });

  document.getElementById('forgotPasscode')?.addEventListener('click', () => {
    showToast('Passcode recovery is disabled in prototype mode.', 'info');
  });

  const updateLocationFromSelectors = (state, district, zone) => {
    const match = locationCatalog.find(location => {
      const stateMatch = !state || location.state === state;
      const districtMatch = !district || location.district === district;
      const zoneMatch = !zone || location.name === zone;
      return stateMatch && districtMatch && zoneMatch;
    });
    if (match) {
      appState.selectedLocationId = match.id;
      appState.demoRiskOverride = null;
      renderAll();
    }
  };

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      navigateTo(item.dataset.view);
    });
  });

  document.getElementById('startDemoBtn').addEventListener('click', startLiveDemo);

  document.getElementById('stateSelect').addEventListener('change', (e) => {
    const selectedState = e.target.value;
    const nextLocation = locationCatalog.find(location => location.state === selectedState);
    if (nextLocation) {
      appState.selectedLocationId = nextLocation.id;
      appState.demoRiskOverride = null;
      renderAll();
    }
  });

  document.getElementById('districtSelect').addEventListener('change', (e) => {
    const nextLocation = locationCatalog.find(location => location.district === e.target.value);
    if (nextLocation) {
      appState.selectedLocationId = nextLocation.id;
      appState.demoRiskOverride = null;
      renderAll();
    }
  });

  document.getElementById('zoneSelect').addEventListener('change', (e) => {
    const nextLocation = locationCatalog.find(location => location.name === e.target.value);
    if (nextLocation) {
      appState.selectedLocationId = nextLocation.id;
      appState.demoRiskOverride = null;
      renderAll();
    }
  });

  document.getElementById('weatherState').addEventListener('change', (e) => {
    const state = e.target.value;
    const district = document.getElementById('weatherDistrict').value;
    const zone = document.getElementById('weatherZone').value;
    updateLocationFromSelectors(state, district, zone);
  });

  document.getElementById('weatherDistrict').addEventListener('change', (e) => {
    const state = document.getElementById('weatherState').value;
    const district = e.target.value;
    const zone = document.getElementById('weatherZone').value;
    updateLocationFromSelectors(state, district, zone);
  });

  document.getElementById('weatherZone').addEventListener('change', (e) => {
    const state = document.getElementById('weatherState').value;
    const district = document.getElementById('weatherDistrict').value;
    const zone = e.target.value;
    updateLocationFromSelectors(state, district, zone);
  });

  document.getElementById('mapRiskFilter').addEventListener('change', renderMap);
  document.getElementById('mapStateFilter').addEventListener('change', () => {
    const stateValue = document.getElementById('mapStateFilter').value;
    const districtOptions = stateValue === 'all'
      ? [...new Set(locationCatalog.map(location => location.district))]
      : [...new Set(locationCatalog.filter(location => location.state === stateValue).map(location => location.district))];
    const districtSelect = document.getElementById('mapDistrictFilter');
    districtSelect.innerHTML = ['all', ...districtOptions].map(value => `<option value="${value}" ${value === 'all' ? 'selected' : ''}>${value === 'all' ? 'All Districts' : value}</option>`).join('');
    renderMap();
  });
  document.getElementById('mapDistrictFilter').addEventListener('change', renderMap);
  document.getElementById('mapSensorFilter').addEventListener('change', renderMap);
  document.getElementById('mapLayerFilter').addEventListener('change', renderMap);
  document.getElementById('searchLocation').addEventListener('input', renderMap);

  document.getElementById('mapZoomIn')?.addEventListener('click', () => {
    appState.mapZoom = Math.min(2.5, Number(((appState.mapZoom || 1.0) + 0.25).toFixed(2)));
    renderMap();
  });
  document.getElementById('mapZoomOut')?.addEventListener('click', () => {
    appState.mapZoom = Math.max(0.75, Number(((appState.mapZoom || 1.0) - 0.25).toFixed(2)));
    renderMap();
  });
  document.getElementById('mapZoomReset')?.addEventListener('click', () => {
    appState.mapZoom = 1.0;
    renderMap();
  });

  document.getElementById('runAiAnalysis').addEventListener('click', () => {
    const values = {
      rainfallIntensity: Number(document.getElementById('rainIntensity').value),
      rainfall24: Number(document.getElementById('rain24').value),
      rainfall72: Number(document.getElementById('rain72').value),
      soilMoisture: Number(document.getElementById('soilMoisture').value),
      slopeMovement: Number(document.getElementById('slopeMovement').value),
      slopeAngle: Number(document.getElementById('slopeAngle').value),
      temperature: Number(document.getElementById('temperature').value),
      humidity: Number(document.getElementById('humidity').value),
      weatherCondition: document.getElementById('weatherCondition').value
    };
    appState.aiModel = values;
    renderAiModel();
  });

  ['rainIntensity', 'rain24', 'rain72', 'soilMoisture', 'slopeMovement', 'slopeAngle', 'temperature', 'humidity'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
      const keyMap = {
        rainIntensity: 'rainfallIntensity',
        rain24: 'rainfall24',
        rain72: 'rainfall72',
        soilMoisture: 'soilMoisture',
        slopeMovement: 'slopeMovement',
        slopeAngle: 'slopeAngle',
        temperature: 'temperature',
        humidity: 'humidity'
      };
      appState.aiModel[keyMap[id]] = Number(e.target.value);
      renderAiModel();
    });
  });

  document.getElementById('weatherCondition').addEventListener('change', (e) => {
    appState.aiModel.weatherCondition = e.target.value;
    renderAiModel();
  });

  document.getElementById('generateAlert').addEventListener('click', () => {
    appState.communication.location = document.getElementById('commLocation').value;
    appState.communication.riskLevel = document.getElementById('commRiskLevel').value;
    appState.communication.targetGroup = document.getElementById('commTargetGroup').value;
    appState.communication.channel = document.getElementById('commChannel').value;
    buildAlertMessage();
  });

  document.getElementById('citizenSafe').addEventListener('click', () => {
    appState.citizenStatus = 'Your safety status has been recorded in this prototype.';
    renderCitizen();
  });

  document.getElementById('citizenHelp').addEventListener('click', () => {
    document.getElementById('helpForm').classList.remove('hidden');
    appState.citizenStatus = 'Emergency help assistance is being prepared.';
    renderCitizen();
  });

  document.getElementById('sendHelpRequest').addEventListener('click', () => {
    const name = document.getElementById('helpName').value || 'Anonymous';
    const phone = document.getElementById('helpPhone').value || 'Unknown';
    const location = document.getElementById('helpLocation').value || getSelectedLocation().name;
    const type = document.getElementById('helpType').value;
    appState.emergencyRequests.unshift({ name, type, location, status: 'Sent to response center' });
    const linkedIncident = { id: `INC-${Date.now().toString().slice(-4)}`, location, risk: getEndRiskLabel(riskScoreFromLocation(getSelectedLocation())), status: 'NEW', authority: 'Prototype Control Room', team: 'Unassigned', priority: type, lastUpdated: 'Now', eta: 'Pending' };
    incidentTableData.unshift(linkedIncident);
    alertBank.unshift({ id: `AL-${Date.now().toString().slice(-4)}`, location, district: getSelectedLocation().district, riskLevel: linkedIncident.risk, probability: `${riskScoreFromLocation(getSelectedLocation())}%`, time: `${nowStamp()} IST`, factors: [type, 'Citizen-submitted request'], action: 'Review and assign response team', status: 'Active' });
    logCommand('CITIZEN', 'Emergency request received', `${name} reported ${type} assistance needed at ${location}.`, 'red');
    appState.citizenStatus = 'Your emergency request has been sent to the prototype response control center.';
    document.getElementById('helpForm').classList.add('hidden');
    renderAll();
    showToast(`Emergency request ${linkedIncident.id} created`, 'warning');
  });

  document.querySelectorAll('.period-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      appState.selectedPeriod = button.dataset.period;
      renderCharts();
    });
  });

  document.querySelectorAll('.lang-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      appState.lang = button.dataset.lang;
    });
  });

  document.querySelectorAll('.assistant-actions button').forEach(button => {
    button.addEventListener('click', () => {
      const question = button.dataset.question;
      const ansBox = document.getElementById('assistantAnswers');
      if (ansBox && question) {
        ansBox.innerHTML = answerAssistantQuery(question);
      }
    });
  });

  const assistantQuery = document.getElementById('assistantQuery');
  const submitAssistantQuery = () => {
    if (!assistantQuery) return;
    const q = assistantQuery.value.trim();
    if (!q) return;
    const ansBox = document.getElementById('assistantAnswers');
    if (ansBox) {
      ansBox.innerHTML = answerAssistantQuery(q);
    }
    assistantQuery.value = '';
  };
  document.getElementById('assistantSend')?.addEventListener('click', submitAssistantQuery);
  assistantQuery?.addEventListener('keydown', event => {
    if (event.key === 'Enter') submitAssistantQuery();
  });

  document.querySelectorAll('#routeCorridorTabs button').forEach(button => {
    button.addEventListener('click', () => {
      appState.activeCorridor = button.dataset.corridor;
      renderRoute();
    });
  });

  document.getElementById('assistantLauncher')?.addEventListener('click', () => setAssistantState('open'));
  document.getElementById('assistantMinimize')?.addEventListener('click', () => setAssistantState('minimized'));
  document.getElementById('assistantMaximize')?.addEventListener('click', () => {
    const assistant = document.getElementById('assistantBox');
    setAssistantState(assistant?.classList.contains('maximized') ? 'open' : 'maximized');
  });
  document.getElementById('assistantClose')?.addEventListener('click', () => setAssistantState('closed'));

  document.addEventListener('click', event => {
    const goto = event.target.closest('[data-goto]');
    if (goto) navigateTo(goto.dataset.goto);

    const alertAction = event.target.closest('[data-alert-action]');
    if (alertAction) {
      const alert = alertBank.find(item => item.id === alertAction.dataset.alertId);
      if (alertAction.dataset.alertAction === 'acknowledge' && alert) {
        alert.status = 'Acknowledged';
        logCommand('ALERT', `${alert.id} acknowledged`, `${alert.location} alert accepted by prototype authority.`, 'yellow');
        renderAll();
        showToast(`${alert.id} acknowledged`, 'success');
      }
      if (alertAction.dataset.alertAction === 'view' && alert) openDrawer(`<div class="eyebrow">ZONE INTELLIGENCE</div><h3>${alert.location}</h3><p>${alert.action}</p><p>Probability: ${alert.probability} • Status: ${alert.status}</p>`);
    }

    const incidentAction = event.target.closest('[data-incident-action]');
    if (incidentAction) advanceIncident(incidentAction.dataset.incidentId);

    const teamAction = event.target.closest('[data-team-action]');
    if (teamAction) {
      const team = rescueTeams.find(item => item.team === teamAction.dataset.team);
      if (team) {
        const action = teamAction.dataset.teamAction;
        team.status = action === 'assign' ? 'ASSIGNED' : action === 'dispatch' ? 'EN ROUTE' : 'COMPLETED';
        if (action === 'dispatch') team.progress = Math.max(team.progress, 82);
        if (action === 'complete') team.progress = 100;
        logCommand('RESCUE', `${team.team} ${team.status}`, `${team.location} response workflow updated.`, action === 'complete' ? 'green' : 'orange');
        renderAll();
        showToast(`${team.team} ${team.status.toLowerCase()}`, 'success');
      }
    }

    const zoneAction = event.target.closest('[data-zone-action]');
    if (zoneAction) {
      appState.selectedRoute.to = zoneAction.dataset.zone;
      if (zoneAction.dataset.zoneAction === 'map') navigateTo('map');
      else { navigateTo('route'); findSafestRoute(); }
    }

    const contactAction = event.target.closest('[data-contact-action]');
    if (contactAction) showToast(`${contactAction.dataset.contact} ${contactAction.dataset.contactAction} simulated`, 'info');

    const energyMode = event.target.closest('[data-energy-mode]');
    if (energyMode) {
      appState.systemMode = energyMode.dataset.energyMode;
      energyModes.forEach(mode => { mode.active = mode.label === appState.systemMode; });
      renderEnergy();
      renderNotifications();
      showToast(`${appState.systemMode} enabled`, 'success');
    }
  });

  document.getElementById('sendSimAlert')?.addEventListener('click', dispatchSimulationAlert);
  document.getElementById('findRouteBtn')?.addEventListener('click', findSafestRoute);
  document.getElementById('settingsLight')?.addEventListener('click', () => { applyTheme('light'); renderAll(); });
  document.getElementById('settingsDark')?.addEventListener('click', () => { applyTheme('dark'); renderAll(); });
  document.getElementById('themeToggle')?.addEventListener('click', () => { applyTheme(appState.theme === 'dark' ? 'light' : 'dark'); });
  document.getElementById('logoutBtn')?.addEventListener('click', () => { clearAuth(); showLogin(); showToast('Prototype session ended', 'info'); });
  document.getElementById('drawerOverlay')?.addEventListener('click', closeDrawer);
  document.addEventListener('click', event => { if (event.target.closest('#closeDrawer')) closeDrawer(); });
  document.getElementById('weatherTimeRange')?.addEventListener('change', event => { appState.weatherTimeRange = event.target.value; renderCharts(); });
  document.querySelectorAll('#weatherMetricToggles [data-metric]').forEach(button => button.addEventListener('click', () => { appState.weatherMetric = button.dataset.metric; renderCharts(); }));
  document.querySelectorAll('#historyMetricToggles [data-history]').forEach(button => button.addEventListener('click', () => { appState.historyMetrics = [button.dataset.history]; renderCharts(); }));
  document.querySelectorAll('#precautionTabs [data-risk-tab]').forEach(button => button.addEventListener('click', () => { appState.precautionTab = button.dataset.riskTab; renderPrecautions(); }));
  document.querySelectorAll('.lang-btn').forEach(button => button.addEventListener('click', () => { appState.lang = button.dataset.lang; applyLanguage(); }));
  document.getElementById('sidebarToggle')?.addEventListener('click', () => document.body.classList.toggle('nav-open'));
  document.getElementById('notificationBell')?.addEventListener('click', event => {
    event.stopPropagation();
    const popover = document.getElementById('notificationPopover');
    const open = popover?.classList.toggle('open');
    document.getElementById('notificationBell')?.setAttribute('aria-expanded', String(Boolean(open)));
    popover?.setAttribute('aria-hidden', String(!open));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.notification-menu')) {
      document.getElementById('notificationPopover')?.classList.remove('open');
      document.getElementById('notificationBell')?.setAttribute('aria-expanded', 'false');
    }
  });

  let pointerFrame = null;
  document.addEventListener('pointermove', event => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty('--pointer-x', `${(x * 4).toFixed(2)}px`);
      document.documentElement.style.setProperty('--pointer-y', `${(y * 3).toFixed(2)}px`);
      document.documentElement.style.setProperty('--pointer-map-x', `${(x * 1.2).toFixed(2)}%`);
      document.documentElement.style.setProperty('--pointer-map-y', `${(y * 0.8).toFixed(2)}%`);
      pointerFrame = null;
    });
  }, { passive: true });
}

function renderAll() {
  renderMetrics();
  renderLocationSelectors();
  renderRiskOverview();
  renderWeather();
  renderSensors();
  renderAlerts();
  renderIncidentTable();
  renderRescue();
  renderCitizen();
  renderSafeZones();
  renderRoute();
  renderPrecautions();
  renderContacts();
  renderEnergy();
  renderMap();
  renderAiModel();
  renderCharts();
  renderNotifications();
  renderCommandLog();
  renderAssistant();
  renderCommunicationDefaults();
}

function renderCommunicationDefaults() {
  const selected = getSelectedLocation();
  appState.communication.location ||= selected.name;
  appState.communication.riskLevel ||= 'HIGH';
  appState.communication.targetGroup ||= 'Villagers';
  appState.communication.channel ||= 'SMS';
  document.getElementById('commLocation').value = appState.communication.location;
  document.getElementById('commRiskLevel').value = appState.communication.riskLevel;
  document.getElementById('commTargetGroup').value = appState.communication.targetGroup;
  document.getElementById('commChannel').value = appState.communication.channel;
  buildAlertMessage();
}

function setIncidentStatus(incident, status) {
  incident.status = status;
  incident.lastUpdated = 'Now';
  if (status === 'TEAM ASSIGNED' && incident.team === 'Unassigned') incident.team = rescueTeams[0]?.team || 'Response Team';
  if (status === 'DISPATCHED') incident.eta = 'En route';
  if (status === 'RESOLVED') incident.eta = 'Closed';
}

function advanceIncident(id) {
  const incident = incidentTableData.find(item => item.id === id);
  if (!incident) return;
  const index = Math.max(0, INCIDENT_FLOW.indexOf(incident.status));
  const next = INCIDENT_FLOW[Math.min(INCIDENT_FLOW.length - 1, index + 1)];
  setIncidentStatus(incident, next);
  logCommand('AUTHORITY', `${incident.id} ${next}`, `${incident.location} workflow advanced in prototype response control.`, next === 'RESOLVED' ? 'green' : 'orange');
  renderAll();
  showToast(`${incident.id} moved to ${next}`, next === 'RESOLVED' ? 'success' : 'info');
}

function dispatchSimulationAlert() {
  const communication = appState.communication;
  const alert = {
    id: `AL-${Date.now().toString().slice(-4)}`,
    location: communication.location,
    district: getSelectedLocation().district,
    riskLevel: communication.riskLevel,
    probability: `${riskScoreFromLocation(getSelectedLocation())}%`,
    time: `${nowStamp()} IST`,
    factors: ['Persistent rainfall', 'Ground saturation', 'Slope movement'],
    action: 'Prototype alert delivered to selected audience',
    status: 'Active'
  };
  alertBank.unshift(alert);
  appState.lastAlertStatus = 'DELIVERED';
  appState.commLog.unshift({ channel: communication.channel, target: communication.targetGroup, status: 'DELIVERED', time: nowStamp() });
  const incident = incidentTableData.find(item => item.location === communication.location);
  if (incident) setIncidentStatus(incident, 'ACKNOWLEDGED');
  else incidentTableData.unshift({ id: `INC-${Date.now().toString().slice(-4)}`, location: communication.location, risk: communication.riskLevel, status: 'ACKNOWLEDGED', authority: 'Prototype Control Room', team: 'Unassigned', priority: communication.riskLevel, lastUpdated: 'Now', eta: 'Pending' });
  buildAlertMessage();
  renderAll();
  showToast(`Simulated ${communication.channel} alert delivered`, 'success');
}

function findSafestRoute() {
  const from = document.getElementById('routeFrom')?.value || getSelectedLocation().name;
  const to = document.getElementById('routeTo')?.value || 'Umiam Safe Point';
  appState.selectedRoute = { from, to };
  const risk = riskScoreFromLocation(getSelectedLocation());
  appState.routeRisk = risk >= 80 ? 'CRITICAL' : risk >= 60 ? 'HIGH' : 'LOW';
  appState.routeStatus = risk >= 80 ? 'ALTERNATIVE REQUIRED' : risk >= 60 ? 'RISKY' : 'SAFE';
  renderRoute();
  showToast(appState.routeStatus === 'SAFE' ? 'Low-risk route identified' : 'Route risk updated; safer corridor recommended', appState.routeStatus === 'SAFE' ? 'success' : 'warning');
}

function bootSequence() {
  const overlay = document.getElementById('bootOverlay');
  const status = document.getElementById('bootStatus');
  const systems = [...document.querySelectorAll('#bootSystems li')];

  // Strictly execute only once per session
  if (sessionStorage.getItem('bhooshanket_booted')) {
    overlay?.remove();
    return;
  }

  if (!overlay) return;
  overlay.classList.remove('hidden');
  mountBhooShanketLogo('bootLogoMount', { width: 56, height: 56, showText: true, textVariant: 'full' });

  const messages = [
    'ENVIRONMENTAL SENSORS ONLINE',
    'AI RISK ENGINE ONLINE',
    'GEOSPATIAL INTELLIGENCE ONLINE',
    'EMERGENCY NETWORK READY',
    'RESPONSE COORDINATION READY'
  ];

  systems.forEach((item, index) => setTimeout(() => {
    item.classList.add('online');
    if (status) status.textContent = messages[index];
  }, 180 + index * 180));

  const finishBoot = () => {
    sessionStorage.setItem('bhooshanket_booted', 'true');
    overlay.classList.add('hidden');
    setTimeout(() => {
      overlay.remove();
    }, 450);
  };

  document.getElementById('skipBootBtn')?.addEventListener('click', finishBoot, { once: true });
  setTimeout(finishBoot, 1850);
}

function startLiveDemo() {
  if (appState.liveDemoRunning) return;
  appState.liveDemoRunning = true;
  appState.reroutingActive = false;
  appState.reroutingStage = 0;
  appState.activeCorridor = 'safest';

  const demoButton = document.getElementById('startDemoBtn');
  if (demoButton) demoButton.textContent = '● LIVE DEMO RUNNING';
  demoButton?.classList.add('live');

  const cycle = phaseDefinitions;
  const transitionLocations = [2, 4, 5, 5];

  let i = 0;
  appState.demoTimer = setInterval(() => {
    if (i >= cycle.length) {
      clearInterval(appState.demoTimer);
      appState.demoTimer = null;
      appState.liveDemoRunning = false;
      if (demoButton) demoButton.textContent = '▶ REPLAY LIVE DEMO';
      demoButton?.classList.remove('live');
      appState.phaseIndex = cycle.length - 1;
      renderAll();
      return;
    }

    appState.phaseIndex = i;
    appState.demoRiskOverride = phaseDefinitions[i].risk;
    appState.selectedLocationId = transitionLocations[i];
    const phase = cycle[i];
    const selected = getSelectedLocation();
    const risk = phase.risk;
    const level = getEndRiskLabel(risk);

    appState.commandEvents.unshift({
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      type: level === 'CRITICAL' ? 'ESCALATION' : 'AI ENGINE',
      title: `${phase.label.replace('Phase 0' + (i + 1) + ' — ', '')} detected`,
      detail: `${selected.name} is now ${level} at ${risk}% probability. ${level === 'CRITICAL' ? 'Evacuation preparation recommended.' : 'Monitoring posture updated.'}`,
      tone: level === 'CRITICAL' ? 'red' : level === 'HIGH' ? 'orange' : 'blue'
    });

    selected.rainfall = phase.rainfall;
    selected.humidity = phase.humidity;
    selected.soilMoisture = phase.soil;
    selected.slopeMovement = phase.slope;
    selected.weather = phase.weather;
    selected.risk = phase.risk;
    selected.sensorStatus = level === 'CRITICAL' || level === 'HIGH' ? 'warning' : 'online';
    syncAiModelFromLocation(selected);

    document.getElementById('notificationCenter').innerHTML = `
      <div class="notif-item">${phase.label}</div>
      <div class="notif-item">${selected.name} changed to ${level} risk</div>
      <div class="notif-item">Authority response system synchronized</div>
    `;

    // Phase 01 & 02: Normal to Elevated Baseline
    if (i === 0 || i === 1) {
      appState.reroutingActive = false;
      appState.activeCorridor = 'safest';
    }

    // Phase 03: Alert Escalation & Initial Route Warning
    if (i === 2) {
      appState.reroutingActive = true;
      appState.reroutingStage = 1; // 'ROUTE RISK INCREASED'
      appState.activeCorridor = 'safest';
      showToast('Slope sensor anomaly: Primary route risk increased', 'warning');
    }

    if (i === 2 || i === 3) {
      alertBank.unshift({
        id: `AL-${Math.floor(Math.random() * 9000 + 3000)}`,
        location: selected.name,
        district: selected.district,
        riskLevel: level,
        probability: `${risk}%`,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
        factors: ['Persistent rainfall', 'Ground saturation', 'Routing risk'],
        action: level === 'CRITICAL' ? 'Deploy emergency teams and initiate evacuation prep' : 'Escalate monitoring and dispatch advisory',
        status: level === 'CRITICAL' ? 'Escalated' : 'Active'
      });
    }

    // Phase 04: Emergency Response & Dynamic Recalculation
    if (i === 3) {
      const existingIncident = incidentTableData.find(item => item.location === selected.name);
      if (existingIncident) {
        existingIncident.risk = 'CRITICAL';
        existingIncident.status = 'TEAM ASSIGNED';
        existingIncident.team = 'Alpha Rescue Team';
        existingIncident.lastUpdated = 'Now';
      }
      const rescue = rescueTeams.find(team => team.location === selected.name) || rescueTeams[0];
      if (rescue) { rescue.status = 'ASSIGNED'; rescue.progress = Math.max(rescue.progress, 72); }
      appState.communication.location = selected.name;
      appState.communication.riskLevel = 'CRITICAL';
      appState.citizenWarning = `Critical warning active for ${selected.name}. Move away from vulnerable slopes and follow authority instructions.`;
      appState.routeStatus = 'ALTERNATIVE REQUIRED';
      appState.routeRisk = 'CRITICAL';

      // Dynamic Route Recalculation sequence
      appState.reroutingActive = true;
      appState.reroutingStage = 2; // 'AI ENGINE RECALCULATING...'
      renderRoute();

      setTimeout(() => {
        appState.reroutingStage = 3; // 'SAFER ROUTE FOUND'
        appState.activeCorridor = 'alternative';
        renderRoute();
        showToast('AI Safe Route resolved: Upper Ridge Parkway Bypass', 'success');
      }, 700);

      logCommand('CITIZEN', 'Critical warning synchronized', appState.citizenWarning, 'red');
      showCriticalEvent(selected, risk);
    }

    renderAll();
    i += 1;
  }, 1800);
}

function init() {
  applyTheme(appState.theme);
  applyLanguage();
  updateClock();
  setInterval(updateClock, 1000);

  // Mount official vector BhooShanket logos across primary UI touchpoints
  mountBhooShanketLogo('sidebarBrandMount', { width: 38, height: 38, showText: true, textVariant: 'full' });
  mountBhooShanketLogo('headerBrandMount', { width: 30, height: 30, showText: true, textVariant: 'compact' });
  mountBhooShanketLogo('loginBrandMount', { width: 54, height: 54, showText: true, textVariant: 'full' });

  // Setup dynamic vector favicon
  setupBhooShanketFavicon();

  initializeEvents();
  bootSequence();

  if (hasAuthSession()) showApp();
  else renderAll();

  syncExternalTelemetry();
  setInterval(syncExternalTelemetry, 8000);
}

init();
