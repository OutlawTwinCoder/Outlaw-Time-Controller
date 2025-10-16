const app = document.getElementById('app');
const info = document.getElementById('info');
const btnClose = document.getElementById('btn-close');
const btnFreeze = document.getElementById('btn-freeze');
const btnInstant = document.getElementById('btn-instant');
const btnMult = document.getElementById('btn-mult');
const btnLengths = document.getElementById('btn-lengths');
const btnStarts = document.getElementById('btn-starts');
const multSel = document.getElementById('mult');
const dayLen = document.getElementById('dayLen');
const nightLen = document.getElementById('nightLen');
const dayStart = document.getElementById('dayStart');
const nightStart = document.getElementById('nightStart');
const setH = document.getElementById('set-h');
const setM = document.getElementById('set-m');

const i18n = {
  fr: {
    title: '⏱️ Outlaw • Time Control',
    sectionState: 'État & Actions',
    stopResume: '⏸️ Stop / Reprendre',
    dayStart: '🌅 Début du jour',
    dayEnd: '🌇 Fin du jour',
    nightStart: '🌃 Début de nuit',
    nightEnd: '🌌 Fin de nuit',
    gotoLabel: 'Aller à (HH:MM)',
    gotoBtn: 'Aller',
    sectionSpeed: 'Vitesse & Ratios',
    multLabel: 'Multiplicateur',
    apply: 'Appliquer',
    dayLen: 'Durée du jour (min)',
    nightLen: 'Durée de la nuit (min)',
    dayStartHour: 'Début du jour (heure)',
    nightStartHour: 'Début de la nuit (heure)',
    saveRatios: 'Sauver ratios',
    saveHours: 'Sauver heures',
    sectionInfo: 'Infos',
    freezeOn: 'Activé',
    freezeOff: 'Désactivé',
    start: 'début'
  },
  en: {
    title: '⏱️ Outlaw • Time Control',
    sectionState: 'Status & Actions',
    stopResume: '⏸️ Stop / Resume',
    dayStart: '🌅 Day start',
    dayEnd: '🌇 Day end',
    nightStart: '🌃 Night start',
    nightEnd: '🌌 Night end',
    gotoLabel: 'Go to (HH:MM)',
    gotoBtn: 'Go',
    sectionSpeed: 'Speed & Ratios',
    multLabel: 'Multiplier',
    apply: 'Apply',
    dayLen: 'Day length (min)',
    nightLen: 'Night length (min)',
    dayStartHour: 'Day start (hour)',
    nightStartHour: 'Night start (hour)',
    saveRatios: 'Save ratios',
    saveHours: 'Save hours',
    sectionInfo: 'Info',
    freezeOn: 'On',
    freezeOff: 'Off',
    start: 'start'
  }
};

let currentLocale = 'fr';

function applyI18n(locale='fr') {
  currentLocale = i18n[locale] ? locale : 'en';
  const t = i18n[currentLocale];
  document.getElementById('i-title').textContent = t.title;
  document.getElementById('i-section-state').textContent = t.sectionState;
  btnFreeze.textContent = t.stopResume;
  document.getElementById('i-day-start').textContent = t.dayStart;
  document.getElementById('i-day-end').textContent = t.dayEnd;
  document.getElementById('i-night-start').textContent = t.nightStart;
  document.getElementById('i-night-end').textContent = t.nightEnd;
  document.getElementById('i-goto-label').textContent = t.gotoLabel;
  btnInstant.textContent = t.gotoBtn;
  document.getElementById('i-section-speed').textContent = t.sectionSpeed;
  document.getElementById('i-mult-label').textContent = t.multLabel;
  document.getElementById('i-daylen-label').textContent = t.dayLen;
  document.getElementById('i-nightlen-label').textContent = t.nightLen;
  document.getElementById('i-daystart-label').textContent = t.dayStartHour;
  document.getElementById('i-nightstart-label').textContent = t.nightStartHour;
  document.getElementById('i-section-info').textContent = t.sectionInfo;
  document.getElementById('btn-mult').textContent = t.apply;
  document.getElementById('btn-lengths').textContent = t.saveRatios;
  document.getElementById('btn-starts').textContent = t.saveHours;
}

// NUI plumbing
function nui(event, data = {}) {
  fetch(`https://${GetParentResourceName()}/${event}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data)
  }).catch(() => {});
}

function setVisible(v) {
  if (v) {
    app.classList.remove('hidden');
    app.setAttribute('aria-hidden', 'false');
  } else {
    app.classList.add('hidden');
    app.setAttribute('aria-hidden', 'true');
  }
}

function renderState(s) {
  const t = i18n[currentLocale];
  multSel.value = String(s.multiplier ?? 1);
  dayLen.value = String(s.dayLenMinutes ?? 45);
  nightLen.value = String(s.nightLenMinutes ?? 20);
  dayStart.value = String(s.dayStartHour ?? 6);
  nightStart.value = String(s.nightStartHour ?? 20);
  const freeze = s.freeze ? t.freezeOn : t.freezeOff;
  info.textContent = `Freeze: ${freeze} • ${t.multLabel} x${s.multiplier ?? 1} • Day: ${s.dayLenMinutes ?? 45}min (${t.start} ${s.dayStartHour ?? 6}:00) • Night: ${s.nightLenMinutes ?? 20}min (${t.start} ${s.nightStartHour ?? 20}:00)`;
}

window.addEventListener('message', (e) => {
  const { action, data, theme, now, locale, style } = e.data || {};
  if (action === 'open') {
    if (theme) app.dataset.theme = theme;
    if (style) app.dataset.style = style;
    applyI18n(locale || 'fr');
    renderState(data || {});
    if (now) {
      setH.value = String(now.h ?? 12);
      setM.value = String(now.m ?? 0).padStart(2, '0');
    }
    setVisible(true);
  }
  if (action === 'state') {
    renderState(data || {});
  }
});

btnClose.addEventListener('click', () => {
  nui('close'); setVisible(false);
});
btnFreeze.addEventListener('click', () => nui('toggleFreeze'));
btnMult.addEventListener('click', () => {
  nui('setMultiplier', { multiplier: Number(multSel.value || '1') });
});
btnLengths.addEventListener('click', () => {
  nui('setLengths', { dayLen: Number(dayLen.value||'45'), nightLen: Number(nightLen.value||'20') });
});
btnStarts.addEventListener('click', () => {
  nui('setStartHours', { dayStart: Number(dayStart.value||'6'), nightStart: Number(nightStart.value||'20') });
});
btnInstant.addEventListener('click', () => {
  nui('instantSet', { h: Number(setH.value||'12'), m: Number(setM.value||'0') });
});

document.querySelectorAll('[data-jump]').forEach(el => {
  el.addEventListener('click', () => {
    nui('jumpTo', { which: el.getAttribute('data-jump') });
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    nui('close'); setVisible(false);
  }
});
