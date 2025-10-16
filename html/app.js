const $ = (id) => document.getElementById(id);

const elements = {
  app: $('app'),
  info: $('info'),
  btnClose: $('btn-close'),
  btnFreeze: $('btn-freeze'),
  btnInstant: $('btn-instant'),
  btnMult: $('btn-mult'),
  btnLengths: $('btn-lengths'),
  btnStarts: $('btn-starts'),
  mult: $('mult'),
  dayLen: $('dayLen'),
  nightLen: $('nightLen'),
  dayStart: $('dayStart'),
  nightStart: $('nightStart'),
  setHour: $('set-h'),
  setMinute: $('set-m'),
  labels: {
    title: $('i-title'),
    sectionState: $('i-section-state'),
    sectionSpeed: $('i-section-speed'),
    sectionInfo: $('i-section-info'),
    dayStart: $('i-day-start'),
    dayEnd: $('i-day-end'),
    nightStart: $('i-night-start'),
    nightEnd: $('i-night-end'),
    goto: $('i-goto-label'),
    mult: $('i-mult-label'),
    dayLen: $('i-daylen-label'),
    nightLen: $('i-nightlen-label'),
    dayStartHour: $('i-daystart-label'),
    nightStartHour: $('i-nightstart-label')
  }
};

const I18N = {
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
    freezeLabel: 'Freeze',
    start: 'start',
    dayLabel: 'Day',
    nightLabel: 'Night'
  },
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
    freezeLabel: 'Gel',
    start: 'début',
    dayLabel: 'Jour',
    nightLabel: 'Nuit'
  }
};

const DEFAULTS = {
  locale: 'en',
  theme: 'dark-gold',
  style: 'transparent'
};

const formatTwoDigits = (value) => String(value).padStart(2, '0');

const TimeControlUI = {
  locale: DEFAULTS.locale,
  strings: I18N[DEFAULTS.locale],
  state: {},

  setLocale(locale) {
    const next = I18N[locale] ? locale : DEFAULTS.locale;
    this.locale = next;
    this.strings = I18N[next];
    document.documentElement.lang = next;
    elements.btnFreeze.textContent = this.strings.stopResume;
    elements.btnInstant.textContent = this.strings.gotoBtn;
    elements.btnMult.textContent = this.strings.apply;
    elements.btnLengths.textContent = this.strings.saveRatios;
    elements.btnStarts.textContent = this.strings.saveHours;

    const labelMap = {
      title: 'title',
      sectionState: 'sectionState',
      sectionSpeed: 'sectionSpeed',
      sectionInfo: 'sectionInfo',
      dayStart: 'dayStart',
      dayEnd: 'dayEnd',
      nightStart: 'nightStart',
      nightEnd: 'nightEnd',
      goto: 'gotoLabel',
      mult: 'multLabel',
      dayLen: 'dayLen',
      nightLen: 'nightLen',
      dayStartHour: 'dayStartHour',
      nightStartHour: 'nightStartHour'
    };

    Object.entries(labelMap).forEach(([key, prop]) => {
      const el = elements.labels[key];
      if (el) el.textContent = this.strings[prop];
    });
  },

  setVisible(isVisible) {
    const { app } = elements;
    app.classList.toggle('hidden', !isVisible);
    app.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
    if (isVisible) {
      app.focus?.();
    }
  },

  updateState(nextState = {}) {
    this.state = { ...this.state, ...nextState };
    this.render();
  },

  render() {
    const s = this.state;
    elements.mult.value = String(s.multiplier ?? 1);
    elements.dayLen.value = String(s.dayLenMinutes ?? 45);
    elements.nightLen.value = String(s.nightLenMinutes ?? 20);
    elements.dayStart.value = String(s.dayStartHour ?? 6);
    elements.nightStart.value = String(s.nightStartHour ?? 20);

    const freeze = s.freeze ? this.strings.freezeOn : this.strings.freezeOff;
    const freezeEmoji = s.freeze ? '🧊' : '💨';
    const parts = [
      `${this.strings.freezeLabel}: ${freezeEmoji} ${freeze}`,
      `${this.strings.multLabel}: x${s.multiplier ?? 1}`,
      `${this.strings.dayLabel}: ${s.dayLenMinutes ?? 45}min (${this.strings.start} ${s.dayStartHour ?? 6}:00)`,
      `${this.strings.nightLabel}: ${s.nightLenMinutes ?? 20}min (${this.strings.start} ${s.nightStartHour ?? 20}:00)`
    ];
    elements.info.textContent = parts.join(' • ');
  },

  open(payload = {}) {
    const { data, theme, style, locale, now } = payload;
    elements.app.dataset.theme = theme || DEFAULTS.theme;
    elements.app.dataset.style = style || DEFAULTS.style;
    this.setLocale(locale || DEFAULTS.locale);
    this.updateState(data || {});

    if (now) {
      elements.setHour.value = String(now.h ?? 12);
      elements.setMinute.value = formatTwoDigits(now.m ?? 0);
    }

    this.setVisible(true);
  }
};

const nui = (event, data = {}) => {
  fetch(`https://${GetParentResourceName()}/${event}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data)
  }).catch(() => {});
};

window.addEventListener('message', (e) => {
  const { action, data, theme, now, locale, style } = e.data || {};
  if (action === 'open') {
    TimeControlUI.open({ data, theme, now, locale, style });
  }
  if (action === 'state') {
    TimeControlUI.updateState(data || {});
  }
});

elements.btnClose.addEventListener('click', () => {
  nui('close');
  TimeControlUI.setVisible(false);
});

elements.btnFreeze.addEventListener('click', () => nui('toggleFreeze'));

elements.btnMult.addEventListener('click', () => {
  nui('setMultiplier', { multiplier: Number(elements.mult.value || '1') });
});

elements.btnLengths.addEventListener('click', () => {
  nui('setLengths', {
    dayLen: Number(elements.dayLen.value || '45'),
    nightLen: Number(elements.nightLen.value || '20')
  });
});

elements.btnStarts.addEventListener('click', () => {
  nui('setStartHours', {
    dayStart: Number(elements.dayStart.value || '6'),
    nightStart: Number(elements.nightStart.value || '20')
  });
});

elements.btnInstant.addEventListener('click', () => {
  nui('instantSet', {
    h: Number(elements.setHour.value || '12'),
    m: Number(elements.setMinute.value || '0')
  });
});

document.querySelectorAll('[data-jump]').forEach((el) => {
  el.addEventListener('click', () => {
    nui('jumpTo', { which: el.getAttribute('data-jump') });
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    nui('close');
    TimeControlUI.setVisible(false);
  }
});

// Initialize in case we need instant rendering before the first message arrives.
TimeControlUI.setLocale(DEFAULTS.locale);
