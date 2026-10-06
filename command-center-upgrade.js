import {
  appState, locationCatalog, sensorCatalog, incidentTableData, alertBank,
  navigateTo, renderAll, showToast, logCommand, skipLiveDemo
} from './app.js';

const initialLocations = new Map();
let sensorObserver;
let initialAlerts = [];
let initialIncidents = [];
let initialRescueTeams = [];
let initialEmergencyRequests = [];

function createButton(label, className = 'secondary-btn') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  return button;
}

function addAuditView() {
  const menu = document.querySelector('.sidebar .menu');
  const systemGroup = [...menu.querySelectorAll('.nav-group')].find(item => item.textContent.trim() === 'System');
  if (systemGroup && !menu.querySelector('[data-view="audit"]')) {
    const button = createButton('◷ Audit Log', 'nav-item');
    button.dataset.view = 'audit';
    systemGroup.insertAdjacentElement('afterend', button);
    button.addEventListener('click', () => navigateTo('audit'));
  }

  const main = document.querySelector('.main-panel');
  if (!main || main.querySelector('[data-view-panel="audit"]')) return;
  const view = document.createElement('section');
  view.className = 'view';
  view.dataset.viewPanel = 'audit';
  view.innerHTML = `
    <div class="card">
      <div class="card-header split"><div><div class="eyebrow">SYSTEM ACCOUNTABILITY</div><h3>Operational Audit Log</h3></div><div class="badge neutral">LOCAL SIMULATION EVENTS</div></div>
      <p class="auth-note">This log records actions taken within this browser’s simulation. It is not a tamper-proof production audit trail.</p>
      <div class="audit-summary" id="auditSummary"></div>
      <div class="audit-log-list" id="auditLogList"></div>
    </div>`;
  main.appendChild(view);
}

function renderAudit() {
  const list = document.getElementById('auditLogList');
  const summary = document.getElementById('auditSummary');
  if (!list || !summary) return;
  const events = appState.commandEvents || [];
  const critical = alertBank.filter(item => item.riskLevel === 'CRITICAL' && item.status !== 'Acknowledged').length;
  summary.innerHTML = `
    <div class="audit-stat"><span>RECORDED EVENTS</span><strong>${events.length}</strong></div>
    <div class="audit-stat"><span>OPEN INCIDENTS</span><strong>${incidentTableData.filter(item => item.status !== 'RESOLVED').length}</strong></div>
    <div class="audit-stat"><span>UNACKNOWLEDGED CRITICAL</span><strong>${critical}</strong></div>`;
  list.innerHTML = events.length ? events.map(event => `
    <article class="audit-row"><time>${event.time}</time><span>${event.type}</span><div><strong>${event.title}</strong><p>${event.detail}</p></div></article>`).join('') :
    '<div class="empty-state"><strong>No recorded simulation events</strong><p>Events will appear as monitoring and response actions occur.</p></div>';
}

function filterSensors() {
  const status = document.getElementById('sensorStatusFilter')?.value || 'all';
  const location = document.getElementById('sensorLocationFilter')?.value || 'all';
  const query = document.getElementById('sensorSearch')?.value.trim().toLowerCase() || '';
  document.querySelectorAll('#sensorGrid .sensor-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    const source = sensorCatalog.find(sensor => text.includes(sensor.id.toLowerCase()));
    const matches = (!query || text.includes(query))
      && (status === 'all' || source?.status === status)
      && (location === 'all' || source?.location === location);
    card.hidden = !matches;
  });
}

function addSensorFilters() {
  const grid = document.getElementById('sensorGrid');
  if (!grid || document.getElementById('sensorToolbar')) return;
  const locations = [...new Set(sensorCatalog.map(sensor => sensor.location))];
  const toolbar = document.createElement('div');
  toolbar.id = 'sensorToolbar';
  toolbar.className = 'sensor-toolbar';
  toolbar.innerHTML = `
    <label>Search sensor<input id="sensorSearch" type="search" placeholder="ID, type, or location" /></label>
    <label>Status<select id="sensorStatusFilter"><option value="all">All statuses</option><option value="online">Online</option><option value="warning">Warning</option><option value="offline">Offline</option></select></label>
    <label>Location<select id="sensorLocationFilter"><option value="all">All monitored locations</option>${locations.map(name => `<option value="${name}">${name}</option>`).join('')}</select></label>`;
  grid.before(toolbar);
  toolbar.addEventListener('input', filterSensors);
  toolbar.addEventListener('change', filterSensors);
  sensorObserver = new MutationObserver(filterSensors);
  sensorObserver.observe(grid, { childList: true });
  filterSensors();
}

function pauseDemo() {
  if (!appState.demoTimer) {
    showToast('No demo is currently running', 'info');
    return;
  }
  appState.demoPausedRemaining = Math.max(0, (appState.demoNextStepAt || Date.now()) - Date.now());
  clearTimeout(appState.demoTimer);
  appState.demoTimer = null;
  appState.liveDemoRunning = false;
  appState.demoPaused = true;
  appState.pauseCriticalEvent?.();
  document.dispatchEvent(new CustomEvent('bhooshanket:simulation-rendered'));
  const start = document.getElementById('startDemoBtn');
  if (start) { start.textContent = '▶ RESUME LIVE DEMO'; start.classList.remove('live'); start.setAttribute('aria-label', 'Resume the simulated disaster sequence'); }
  logCommand('DEMO', 'Live demo paused', 'The synchronized simulation timeline was paused by the operator.', 'yellow');
  renderAudit();
  showToast('Live demo paused. Resume continues from this point.', 'info');
}

function resetDemo() {
  clearTimeout(appState.demoTimer);
  clearTimeout(appState.demoRouteTimer);
  appState.clearCriticalEvent?.();
  appState.demoTimer = null;
  appState.liveDemoRunning = false;
  appState.demoPaused = false;
  appState.demoPausedRemaining = null;
  appState.demoNextStepAt = null;
  appState.demoRouteTimer = null;
  document.dispatchEvent(new CustomEvent('bhooshanket:simulation-rendered'));
  appState.demoStepIndex = 0;
  appState.demoResponseStage = 0;
  appState.demoSkipRequested = false;
  appState.demoRiskOverride = null;
  appState.phaseIndex = 0;
  appState.selectedLocationId = 2;
  appState.selectedSensorId = null;
  appState.selectedIncidentId = null;
  appState.mapMode = 'manual';
  appState.mapZoom = 1;
  appState.mapPanX = 0;
  appState.mapPanY = 0;
  appState.reroutingActive = false;
  appState.reroutingStage = 0;
  appState.activeCorridor = 'safest';
  appState.routeStatus = 'READY';
  appState.routeRisk = 'LOW';
  appState.citizenWarning = '';
  appState.communication.riskLevel = 'HIGH';
  alertBank.splice(0, alertBank.length, ...structuredClone(initialAlerts));
  incidentTableData.splice(0, incidentTableData.length, ...structuredClone(initialIncidents));
  rescueTeams.splice(0, rescueTeams.length, ...structuredClone(initialRescueTeams));
  appState.emergencyRequests.splice(0, appState.emergencyRequests.length, ...structuredClone(initialEmergencyRequests));
  initialLocations.forEach((snapshot, location) => Object.assign(location, structuredClone(snapshot)));
  document.querySelectorAll('[data-map-mode]').forEach(button => {
    const active = button.dataset.mapMode === 'manual';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const mapModeStatus = document.getElementById('mapModeStatus');
  if (mapModeStatus) mapModeStatus.textContent = 'Manual exploration · simulated regional map';
  const start = document.getElementById('startDemoBtn');
  if (start) { start.textContent = '▶ START LIVE DEMO'; start.classList.remove('live'); start.setAttribute('aria-label', 'Start the simulated disaster sequence'); }
  logCommand('DEMO', 'Live demo reset', 'Simulation restored to the current monitored regional baseline.', 'blue');
  renderAll();
  renderAudit();
  showToast('Live demo reset to the monitoring baseline.', 'success');
}

function addDemoControls() {
  const start = document.getElementById('startDemoBtn');
  if (!start || document.getElementById('demoControls')) return;
  const controls = document.createElement('div');
  controls.id = 'demoControls';
  controls.className = 'demo-controls';
  const pause = createButton('Ⅱ PAUSE');
  const skip = createButton('SKIP →');
  const reset = createButton('↺ RESET');
  pause.setAttribute('aria-label', 'Pause the simulated disaster sequence');
  skip.setAttribute('aria-label', 'Skip to the critical response phase');
  reset.setAttribute('aria-label', 'Reset the simulated disaster sequence');
  start.setAttribute('aria-live', 'polite');
  pause.addEventListener('click', pauseDemo);
  skip.addEventListener('click', () => {
    if (!appState.liveDemoRunning) return showToast('Start the demo before skipping ahead.', 'info');
    skipLiveDemo();
    showToast('Skipping to the critical response phase.', 'warning');
  });
  reset.addEventListener('click', resetDemo);
  controls.append(pause, skip, reset);
  start.after(controls);
}

function renderPhaseTracker() {
  const tracker = document.getElementById('liveDemoTracker');
  if (!tracker) return;
  const phaseIndex = Math.max(0, Math.min(3, appState.phaseIndex || 0));
  const phaseName = ['NORMAL', 'WARNING', 'HIGH RISK', 'CRITICAL'][phaseIndex];
  const phase = appState.liveDemoRunning
    ? phaseName
    : appState.demoPaused ? `PAUSED · ${phaseName}`
      : appState.demoStepIndex === 0 ? 'BASELINE' : appState.demoStepIndex >= 4 ? 'SCENARIO COMPLETE' : 'PAUSED';
  const progress = appState.liveDemoRunning || appState.demoPaused
    ? (phaseIndex + 1) * 25
    : appState.demoStepIndex >= 4 ? 100 : 0;
  const location = locationCatalog.find(item => item.id === appState.selectedLocationId) || locationCatalog[1];
  const risk = appState.demoRiskOverride ?? location.risk;
  tracker.innerHTML = `
    <div class="demo-phase-head"><span>DEMO SIMULATION</span><strong>${appState.liveDemoRunning || appState.demoPaused ? `PHASE ${String(phaseIndex + 1).padStart(2, '0')} / 04` : 'CURRENT BASELINE'} · ${phase}</strong></div>
    <div class="demo-phase-stats"><div><small>RISK</small><b>${risk}%</b></div><div><small>RAINFALL</small><b>${location.rainfall} mm/hr</b></div><div><small>SOIL MOISTURE</small><b>${location.soilMoisture}%</b></div><div><small>SLOPE MOVEMENT</small><b>${location.slopeMovement} mm</b></div></div>
    <div class="demo-phase-progress" role="progressbar" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${progress / 25}" aria-label="${appState.liveDemoRunning || appState.demoPaused ? `Live demo phase ${phaseIndex + 1} of 4` : 'Current baseline'}"><i style="width:${progress}%"></i></div>`;
}

function addPhaseTracker() {
  const topbar = document.querySelector('.topbar-actions');
  if (!topbar || document.getElementById('liveDemoTracker')) return;
  const tracker = document.createElement('section');
  tracker.id = 'liveDemoTracker';
  tracker.className = 'live-demo-tracker';
  topbar.appendChild(tracker);
  renderPhaseTracker();
}

export function installCommandCenterUpgrade() {
  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => requestAnimationFrame(renderAudit)));
  appState.commandEvents ||= [];
  // Snapshot the model inputs whose demo mutates, so reset is deterministic.
  locationCatalog.forEach(location => initialLocations.set(location, structuredClone(location)));
  addAuditView();
  addSensorFilters();
  addDemoControls();
  addPhaseTracker();
  renderAudit();
  document.addEventListener('bhooshanket:simulation-rendered', renderPhaseTracker);
  initialAlerts = structuredClone(alertBank);
  initialIncidents = structuredClone(incidentTableData);
  initialRescueTeams = structuredClone(rescueTeams);
  initialEmergencyRequests = structuredClone(appState.emergencyRequests);
  appState.resetDemo = resetDemo;
  document.addEventListener('click', event => {
    if (event.target.closest('[data-view="audit"]')) renderAudit();
  });
}
