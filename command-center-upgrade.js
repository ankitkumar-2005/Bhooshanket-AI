import {
  appState, locationCatalog, sensorCatalog, incidentTableData, alertBank,
  navigateTo, renderAll, showToast, logCommand
} from './app.js';

const initialLocations = new Map();
let sensorObserver;

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
  clearInterval(appState.demoTimer);
  appState.demoTimer = null;
  appState.liveDemoRunning = false;
  const start = document.getElementById('startDemoBtn');
  if (start) { start.textContent = '▶ RESTART LIVE DEMO'; start.classList.remove('live'); }
  logCommand('DEMO', 'Live demo paused', 'The synchronized simulation timeline was paused by the operator.', 'yellow');
  renderAudit();
  showToast('Live demo paused. Restart will replay the full scenario.', 'info');
}

function resetDemo() {
  clearInterval(appState.demoTimer);
  appState.demoTimer = null;
  appState.liveDemoRunning = false;
  appState.demoRiskOverride = null;
  appState.phaseIndex = 2;
  appState.reroutingActive = false;
  appState.reroutingStage = 0;
  appState.activeCorridor = 'safest';
  initialLocations.forEach((snapshot, location) => Object.assign(location, structuredClone(snapshot)));
  const start = document.getElementById('startDemoBtn');
  if (start) { start.textContent = '▶ START LIVE DEMO'; start.classList.remove('live'); }
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
  const reset = createButton('↺ RESET');
  pause.addEventListener('click', pauseDemo);
  reset.addEventListener('click', resetDemo);
  controls.append(pause, reset);
  start.after(controls);
}

export function installCommandCenterUpgrade() {
  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => requestAnimationFrame(renderAudit)));
  appState.commandEvents ||= [];
  // Snapshot the model inputs whose demo mutates, so reset is deterministic.
  locationCatalog.forEach(location => initialLocations.set(location, structuredClone(location)));
  addAuditView();
  addSensorFilters();
  addDemoControls();
  renderAudit();
  document.addEventListener('click', event => {
    if (event.target.closest('[data-view="audit"]')) renderAudit();
  });
}
