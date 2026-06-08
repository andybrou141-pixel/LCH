// ══════════════════════════════════════════
//  Bloc HTML : participants de la session live
// ══════════════════════════════════════════
function _buildLivePresenceBlock(liveSession, now) {
  const attendees = Object.entries(liveSession.attendees || {});
  if (!attendees.length) return '';

  const STALE = 120 * 1000; // 2 minutes
  const fmtD  = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return (m > 0 ? m + 'min ' : '') + sec + 's';
  };

  const rows = attendees.map(([uid, a]) => {
    const online = a.lastSeen && (now - a.lastSeen) < STALE;
    const dur    = a.duration ? fmtD(a.duration) : '0s';
    const ini    = (a.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const joinAt = a.joinedAt ? new Date(a.joinedAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '–';
    const presBar = Math.min(100, a.duration ? Math.round(a.duration / 600 * 100) : 0);

    return `
      <div style="display:flex;align-items:center;gap:0.7rem;padding:0.55rem 0;border-bottom:1px solid rgba(255,255,255,0.06);">
        <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#2d6a4f,#22C55E);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;color:#fff;flex-shrink:0;position:relative;">
          ${ini}
          <span style="position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;background:${online?'#22C55E':'#64748b'};border:1.5px solid #0d1420;"></span>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${(a.name||'Étudiant').replace(/</g,'&lt;')}</div>
          <div style="font-size:0.65rem;color:rgba(255,255,255,0.45);margin-top:0.1rem;display:flex;align-items:center;gap:0.4rem;">
            <span style="color:${online?'#4ade80':'#64748b'};">${online?'● En ligne':'● Hors ligne'}</span>
            · Rejoint ${joinAt} · ${dur}
          </div>
          ${!a.marked && presBar > 0 ? `<div style="height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-top:0.3rem;"><div style="height:100%;width:${presBar}%;background:${presBar>50?'#22C55E':'#f97316'};border-radius:2px;"></div></div>` : ''}
        </div>
        ${a.marked
          ? '<span style="background:rgba(34,197,94,0.25);color:#4ade80;font-size:0.65rem;font-weight:800;border-radius:50px;padding:0.15rem 0.6rem;border:1px solid rgba(34,197,94,0.4);white-space:nowrap;flex-shrink:0;">✓ Présent</span>'
          : `<span style="background:rgba(234,179,8,0.15);color:#fbbf24;font-size:0.65rem;font-weight:700;border-radius:50px;padding:0.15rem 0.6rem;border:1px solid rgba(234,179,8,0.3);white-space:nowrap;flex-shrink:0;">${presBar}%</span>`
        }
      </div>`;
  }).join('');

  const onlineCnt = attendees.filter(([,a]) => a.lastSeen && (now-a.lastSeen)<STALE).length;
  const markedCnt = attendees.filter(([,a]) => a.marked).length;

  return `
    <div style="margin-top:1.5rem;background:linear-gradient(135deg,rgba(15,61,46,0.9),rgba(26,92,64,0.9));border:1.5px solid rgba(34,197,94,0.35);border-radius:16px;overflow:hidden;">
      <div style="padding:0.85rem 1rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(34,197,94,0.2);">
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <div style="width:8px;height:8px;background:#ef4444;border-radius:50%;animation:livePulse 1.2s infinite;"></div>
          <span style="font-size:0.88rem;font-weight:800;color:#fff;">Cours en direct en cours</span>
          <span style="background:rgba(239,68,68,0.2);color:#fca5a5;font-size:0.62rem;font-weight:800;padding:0.1rem 0.45rem;border-radius:50px;border:1px solid rgba(239,68,68,0.4);">LIVE</span>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <span style="background:rgba(34,197,94,0.2);color:#4ade80;font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:8px;">${onlineCnt} en ligne</span>
          <span style="background:rgba(34,197,94,0.15);color:#86efac;font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:8px;">${markedCnt} présents</span>
        </div>
      </div>
      <div style="padding:0.5rem 1rem 0.75rem;">
        <div style="font-size:0.7rem;color:rgba(255,255,255,0.45);margin-bottom:0.5rem;font-weight:600;">${liveSession.courseName||'Session'} · ${attendees.length} participant(s)</div>
        ${rows}
        <button onclick="switchTrainerView('live')" style="margin-top:0.75rem;width:100%;padding:0.55rem;background:rgba(34,197,94,0.2);border:1px solid rgba(34,197,94,0.4);border-radius:10px;color:#4ade80;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">
          Ouvrir la salle en direct →
        </button>
      </div>
    </div>`;
}

function renderTrainerLivePresenceBadge() {
  const activeLive = (appData.liveSessions||[]).find(s=>s.status==='active'&&s.trainerId===auth.userId);
  const badge = document.getElementById('live-sidebar-active-badge');
  if (badge) badge.style.display = activeLive ? 'inline-flex' : 'none';
}

function showAllTrainerSessions() {
  const overlay  = document.getElementById('pres-all-sessions-overlay');
  const listEl   = document.getElementById('pres-all-sessions-list');
  const countEl  = document.getElementById('pres-all-sessions-count');
  if (!overlay || !listEl) return;

  const allSessions = (appData.sessions || [])
    .filter(s => s.trainerId === auth.userId)
    .sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0));

  if (countEl) countEl.textContent = allSessions.length + ' séance' + (allSessions.length !== 1 ? 's' : '') + ' au total';

  const avatarPalette = ['#2d6a4f','#1565C0','#d97706','#8b5cf6','#e8748a','#0891b2','#b45309'];

  if (!allSessions.length) {
    listEl.innerHTML = '<div style="text-align:center;padding:2.5rem;color:#aaa;font-size:0.85rem;">Aucune séance enregistrée.</div>';
  } else {
    listEl.innerHTML = allSessions.map((s, idx) => {
      const attendees  = Object.values(s.attendees || {});
      const present    = attendees.filter(a => a.status === 'present').length;
      const total      = attendees.length;
      const rate       = total > 0 ? Math.round(present / total * 100) : 0;
      const rateColor  = rate >= 80 ? '#2d6a4f' : rate >= 50 ? '#d97706' : '#e8748a';
      const color      = avatarPalette[idx % avatarPalette.length];
      const initial    = (s.label || '?').trim()[0].toUpperCase();
      const dateStr    = new Date(s.startedAt).toLocaleDateString('fr-FR', {day:'2-digit', month:'short', year:'numeric'});
      const statusDot  = s.status === 'active' ? '#22C55E' : '#ccc';
      return '<div style="display:flex;align-items:center;gap:0.85rem;padding:0.85rem 0;border-bottom:1px solid #f5f5f5;">' +
        '<div style="width:40px;height:40px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.88rem;font-weight:800;flex-shrink:0;">' + initial + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.15rem;">' +
            '<div style="width:7px;height:7px;border-radius:50%;background:' + statusDot + ';flex-shrink:0;"></div>' +
            '<div style="font-size:0.85rem;font-weight:700;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + s.label + '</div>' +
          '</div>' +
          '<div style="font-size:0.72rem;color:#aaa;">' + (s.promotionName || '–') + ' · ' + dateStr + '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0;">' +
          '<div style="font-size:0.82rem;font-weight:700;color:' + rateColor + ';">' + present + '/' + total + '</div>' +
          '<div style="font-size:0.68rem;color:#bbb;">' + rate + '%</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  overlay.classList.add('open');
}

function showPresenceConfirm() {
  const slotSel = document.getElementById('sess-slot-select');
  if (!slotSel) { startSession(); return; }

  const slotId  = slotSel.value;
  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  const slot    = slotId && trainer ? (trainer.schedule || []).find(s => s.id === slotId) : null;

  let promoName = '', startInfo = '—', endInfo = '—';

  if (slot) {
    // Mode créneau
    if (!slot.promotionId) {
      showNotif('⚠️ Ce créneau n\'a pas de promotion associée. Ajoutez-en une via "Mes créneaux".', 'error');
      return;
    }
    const promo = (appData.promotions || []).find(p => p.id === slot.promotionId);
    promoName = promo ? promo.name : '(promotion introuvable)';
    startInfo = slot.startTime || '—';
    endInfo   = slot.endTime   || '—';

    // Valider que l'heure de fin est après l'heure de début
    if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
      showNotif('L\'heure de clôture du créneau doit être après l\'heure de début.', 'error');
      return;
    }
  } else {
    // Mode manuel
    const promSel = document.getElementById('sess-promo-select');
    const startEl = document.getElementById('sess-start-time');
    const endEl   = document.getElementById('sess-end-time');
    if (!promSel) { startSession(); return; }

    const promoId = promSel.value;
    if (!promoId) {
      showNotif('Sélectionnez une promotion dans la liste.', 'error');
      promSel.style.borderColor = '#EF4444';
      setTimeout(() => { promSel.style.borderColor = ''; }, 2000);
      return;
    }
    if (startEl && endEl && startEl.value && endEl.value && startEl.value >= endEl.value) {
      showNotif('L\'heure de clôture doit être après l\'heure de début.', 'error');
      endEl.style.borderColor = '#EF4444';
      setTimeout(() => { endEl.style.borderColor = ''; }, 2000);
      return;
    }
    promoName = promSel.options[promSel.selectedIndex].text;
    startInfo = startEl?.value || '—';
    endInfo   = endEl?.value   || '—';
  }

  const overlay  = document.getElementById('pres-confirm-overlay');
  const textEl   = document.getElementById('pres-confirm-text');
  const detailEl = document.getElementById('pres-confirm-details');
  if (!overlay) { startSession(); return; }
  if (textEl)   textEl.textContent = 'Lancer la séance pour ' + promoName + ' ?';
  if (detailEl) detailEl.innerHTML =
    '<strong>Début :</strong> ' + startInfo + '<br>' +
    '<strong>Clôture :</strong> ' + endInfo;
  overlay.classList.add('open');
}

function confirmAndStartSession() {
  document.getElementById('pres-confirm-overlay').classList.remove('open');
  startSession();
}

// ── Schedule CRUD — côté formateur ──────────────────────────

function toggleTrainerSlotForm() {
  const form = document.getElementById('trainer-slot-form');
  const btn  = document.getElementById('trainer-slot-toggle-btn');
  if (!form) return;
  const visible = form.style.display !== 'none';
  form.style.display = visible ? 'none' : 'block';
  if (btn) btn.textContent = visible ? '+ Ajouter' : '✕ Annuler';
  if (!visible) {
    const dateEl  = document.getElementById('tsf-date');
    if (dateEl && !dateEl.value)   dateEl.value  = new Date().toISOString().slice(0, 10);
    const startEl = document.getElementById('tsf-start');
    if (startEl && !startEl.value) startEl.value = '08:00';
    const endEl   = document.getElementById('tsf-end');
    if (endEl && !endEl.value)     endEl.value   = '11:00';
  }
}

function saveTrainerScheduleSlot() {
  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  if (!trainer) return;
  const date        = document.getElementById('tsf-date')?.value || '';
  const startTime   = document.getElementById('tsf-start')?.value || '08:00';
  const endTime     = document.getElementById('tsf-end')?.value   || '11:00';
  const promotionId = document.getElementById('tsf-promo')?.value || '';
  const label       = (document.getElementById('tsf-label')?.value || '').trim();

  if (!date) {
    showNotif('Sélectionnez une date pour ce créneau.', 'error'); return;
  }
  if (!promotionId) {
    showNotif('Sélectionnez une promotion.', 'error'); return;
  }
  if (!startTime || !endTime || startTime >= endTime) {
    showNotif('L\'heure de fin doit être après l\'heure de début.', 'error'); return;
  }
  if (!trainer.schedule) trainer.schedule = [];
  trainer.schedule.push({ id: genId('sched'), date, startTime, endTime, promotionId, label });
  saveAppData(false);
  showNotif('Créneau ajouté — ' + _fmtDateStr(date) + ' ' + startTime + '–' + endTime, 'success');
  // Réinitialiser le formulaire
  const dateEl2  = document.getElementById('tsf-date');
  const startEl2 = document.getElementById('tsf-start');
  const endEl2   = document.getElementById('tsf-end');
  const labelEl2 = document.getElementById('tsf-label');
  const promoEl2 = document.getElementById('tsf-promo');
  if (dateEl2)  dateEl2.value  = new Date().toISOString().slice(0, 10);
  if (startEl2) startEl2.value = '08:00';
  if (endEl2)   endEl2.value   = '11:00';
  if (labelEl2) labelEl2.value = '';
  if (promoEl2) promoEl2.value = '';
  renderTrainerPresence();
}

function deleteTrainerScheduleSlot(slotId) {
  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  if (!trainer) return;
  trainer.schedule = (trainer.schedule || []).filter(s => s.id !== slotId);
  saveAppData(false);
  showNotif('Créneau supprimé', '');
  renderTrainerPresence();
}

// Met à jour l'affichage selon le créneau sélectionné (ou mode manuel)
function prefillFromSlot() {
  const slotId    = document.getElementById('sess-slot-select')?.value || '';
  const summary   = document.getElementById('sess-slot-summary');
  const manualDiv = document.getElementById('sess-manual-times');
  const labelIn   = document.getElementById('sess-label-input');

  if (!slotId) {
    // Aucun créneau → afficher les champs manuels
    if (summary)   summary.style.display   = 'none';
    if (manualDiv) manualDiv.style.display = 'block';
    return;
  }

  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  if (!trainer) return;
  const slot = (trainer.schedule || []).find(s => s.id === slotId);
  if (!slot) return;

  // Créneau sélectionné → masquer les champs manuels, afficher le récapitulatif
  if (manualDiv) manualDiv.style.display = 'none';
  if (summary)   summary.style.display   = 'block';

  // Calculer la date du créneau
  const promos = appData.promotions || [];
  const promo  = promos.find(p => p.id === slot.promotionId);
  const nextDate = _slotDateObj(slot);

  // Mettre à jour les éléments du récapitulatif
  const promoEl = document.getElementById('slot-summary-promo');
  const startEl = document.getElementById('slot-summary-start');
  const endEl   = document.getElementById('slot-summary-end');
  const dateEl  = document.getElementById('slot-summary-date');
  if (promoEl) promoEl.textContent = promo ? promo.name : '⚠️ Promotion introuvable';
  if (startEl) startEl.textContent = slot.startTime || '—';
  if (endEl)   endEl.textContent   = slot.endTime   || '—';
  if (dateEl)  dateEl.textContent  = _fmtSlotDate(nextDate);
  // Synchroniser les inputs manuels pour que startSession() dispose des heures du créneau
  const startInp = document.getElementById('sess-start-time');
  const endInp   = document.getElementById('sess-end-time');
  if (startInp && slot.startTime) startInp.value = slot.startTime;
  if (endInp   && slot.endTime)   endInp.value   = slot.endTime;

  // Pré-remplir l'intitulé si vide
  if (labelIn && slot.label && !labelIn.value) labelIn.value = slot.label;
}

// ── Schedule CRUD — côté admin ───────────────────────────────

function renderScheduleSlots(trainer) {
  const slots = trainer.schedule || [];
  if (!slots.length) return '<div style="color:#94A3B8;font-size:0.78rem;">Aucun horaire — cliquez sur + Horaire.</div>';
  return slots.map(s => {
    const promo = (appData.promotions || []).find(p => p.id === s.promotionId);
    const nextDate = _slotNextDate(s.day);
    const isToday = nextDate.toDateString() === new Date().toDateString();
    return `<div class="schedule-slot" style="flex-direction:column;align-items:flex-start;gap:0.1rem;">
      <div style="display:flex;align-items:center;gap:0.5rem;width:100%;">
        <span class="schedule-slot-day">${DAYS_FR[s.day]}</span>
        <span style="font-size:0.78rem;font-weight:600;color:#334155;">${s.startTime}–${s.endTime}</span>
        ${s.label ? `<span style="color:#64748B;font-size:0.75rem;">${s.label}</span>` : ''}
        ${promo ? `<span style="background:#EFF6FF;color:#1D4ED8;border-radius:50px;padding:0.05rem 0.4rem;font-size:0.65rem;font-weight:700;">${promo.name}</span>` : ''}
        <button onclick="deleteScheduleSlot('${trainer.id}','${s.id}')" style="margin-left:auto;background:none;border:none;color:#EF4444;cursor:pointer;font-size:0.8rem;padding:0 0.2rem;">✕</button>
      </div>
      <div style="font-size:0.67rem;color:${isToday ? '#16A34A' : '#6366F1'};font-weight:600;padding-left:0.1rem;">
        📅 ${_fmtSlotDate(nextDate)}${isToday ? ' · Aujourd\'hui' : ''}
      </div>
    </div>`;
  }).join('');
}

function openScheduleModal(trainerId) {
  const trainer = (appData.trainers || []).find(t => t.id === trainerId);
  if (!trainer) return;
  document.getElementById('sched-trainer-id').value = trainerId;
  document.getElementById('sched-trainer-name-label').textContent = trainer.name;
  // Pré-remplir avec la date d'aujourd'hui
  document.getElementById('sched-date').value = new Date().toISOString().slice(0, 10);
  document.getElementById('sched-start').value = '08:00';
  document.getElementById('sched-end').value = '10:00';
  document.getElementById('sched-label').value = '';
  const promoSel = document.getElementById('sched-promo');
  promoSel.innerHTML = '<option value="">— Choisir une promotion —</option>';
  (appData.promotions || []).forEach(p => {
    const o = document.createElement('option'); o.value = p.id; o.textContent = p.name;
    promoSel.appendChild(o);
  });
  document.getElementById('schedule-modal-overlay').classList.add('open');
}

function closeScheduleModal(e) {
  if (e && e.target !== document.getElementById('schedule-modal-overlay')) return;
  document.getElementById('schedule-modal-overlay').classList.remove('open');
}

function saveScheduleSlot() {
  const trainerId   = document.getElementById('sched-trainer-id').value;
  const date        = document.getElementById('sched-date').value;
  const startTime   = document.getElementById('sched-start').value;
  const endTime     = document.getElementById('sched-end').value;
  const promotionId = document.getElementById('sched-promo').value;
  const label       = document.getElementById('sched-label').value.trim();

  if (!date) {
    showNotif('Sélectionnez une date pour ce créneau.', 'error'); return;
  }
  if (!promotionId) {
    showNotif('Sélectionnez une promotion.', 'error'); return;
  }
  if (!startTime || !endTime || startTime >= endTime) {
    showNotif('L\'heure de fin doit être après l\'heure de début.', 'error'); return;
  }
  const trainer = (appData.trainers || []).find(t => t.id === trainerId);
  if (!trainer) return;
  if (!trainer.schedule) trainer.schedule = [];
  trainer.schedule.push({ id: genId('sched'), date, startTime, endTime, promotionId, label });
  saveAppData(false);
  document.getElementById('schedule-modal-overlay').classList.remove('open');
  const slotEl = document.getElementById('schedule-list-' + trainerId);
  if (slotEl) slotEl.innerHTML = renderScheduleSlots(trainer);
  showNotif('Créneau ajouté — ' + _fmtDateStr(date) + ' ' + startTime + '–' + endTime, 'success');
}

function deleteScheduleSlot(trainerId, slotId) {
  const trainer = (appData.trainers || []).find(t => t.id === trainerId);
  if (!trainer) return;
  trainer.schedule = (trainer.schedule || []).filter(s => s.id !== slotId);
  saveAppData(false);
  const slotEl = document.getElementById('schedule-list-' + trainerId);
  if (slotEl) slotEl.innerHTML = renderScheduleSlots(trainer);
  showNotif('Horaire supprimé', '');
}

// Retourne la date exacte (objet Date) de la prochaine occurrence d'un jour de semaine (rétrocompatibilité)
function _slotNextDate(dayOfWeek) {
  const today = new Date();
  const diff = (parseInt(dayOfWeek, 10) - today.getDay() + 7) % 7;
  const next = new Date(today);
  next.setDate(today.getDate() + diff);
  return next;
}

// Retourne un objet Date à partir d'un slot (supporte slot.date 'YYYY-MM-DD' et slot.day 0-6)
function _slotDateObj(slot) {
  if (slot.date) {
    const [y, mo, d] = slot.date.split('-').map(Number);
    return new Date(y, mo - 1, d);
  }
  return _slotNextDate(slot.day); // rétrocompatibilité anciens créneaux
}

// Formate une date en "Lundi 3 juin 2026"
function _fmtSlotDate(d) {
  const MONTHS = ['janv','févr','mars','avr','mai','juin','juil','août','sept','oct','nov','déc'];
  return DAYS_FR[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
}

// Formate une chaîne 'YYYY-MM-DD' en "Lundi 3 juin 2026"
function _fmtDateStr(dateStr) {
  if (!dateStr) return '—';
  const [y, mo, d] = dateStr.split('-').map(Number);
  return _fmtSlotDate(new Date(y, mo - 1, d));
}

function fmtDuration(ms) {
  if (!ms || ms <= 0) return '—';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return h + 'h' + String(m).padStart(2,'0');
  return m + 'min';
}

function renderPointageView() {
  const monthEl = document.getElementById('ptg-month');
  const yearEl  = document.getElementById('ptg-year');
  const promoEl = document.getElementById('ptg-promo');
  if (!monthEl || !yearEl) return;

  // Init year select once
  if (yearEl.options.length === 0) {
    const cy = new Date().getFullYear();
    for (let y = cy - 1; y <= cy + 1; y++) {
      const o = document.createElement('option');
      o.value = y; o.textContent = y;
      if (y === cy) o.selected = true;
      yearEl.appendChild(o);
    }
    monthEl.value = String(new Date().getMonth());
  }

  // Promo select : toujours synchronisé avec appData
  if (promoEl) {
    const savedPromo = promoEl.value;
    promoEl.innerHTML = '<option value="">Toutes les promotions</option>';
    (appData.promotions || []).forEach(p => {
      const o = document.createElement('option'); o.value = p.id; o.textContent = p.name;
      promoEl.appendChild(o);
    });
    if (savedPromo) promoEl.value = savedPromo;
  }

  const month = parseInt(monthEl.value, 10);
  const year  = parseInt(yearEl.value, 10);
  const promoFilter = promoEl?.value || '';
  const searchQ = (document.getElementById('ptg-search')?.value || '').toLowerCase().trim();

  let users = (appData.users || []).filter(u =>
    (!promoFilter || u.promotionId === promoFilter) &&
    (!searchQ || u.name.toLowerCase().includes(searchQ))
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(23, 59, 59, 999);

  let totalPresences = 0, totalTime = 0, presentUsers = 0;

  const MIN_PRESENCE_MS = 5 * 60 * 1000; // 5 minutes

  // Header row
  const dayHdrs = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const dow = new Date(year, month, d).getDay();
    const isWE = dow === 0 || dow === 6;
    return '<div class="ptg-header-cell' + (isWE ? '" style="background:#64748B' : '') + '">' + String(d).padStart(2,'0') + '</div>';
  }).join('');

  const cols = '200px repeat(' + daysInMonth + ',26px) 62px 78px 90px';

  const header = '<div class="ptg-calendar-grid" style="grid-template-columns:' + cols + ';">'
    + '<div class="ptg-header-cell ptg-header-name">Auditeur</div>'
    + dayHdrs
    + '<div class="ptg-header-cell">Taux</div>'
    + '<div class="ptg-header-cell">Durée</div>'
    + '<div class="ptg-header-cell">Activités</div>'
    + '</div>';

  const rows = users.map(u => {
    const att = u.attendance || {};
    let presences = 0, weekdays = 0, monthTime = 0;
    const allActs = new Set();

    const cells = Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      const date = new Date(year, month, d);
      const dow  = date.getDay();
      const isWE = dow === 0 || dow === 6;
      const isFuture = date > today;
      const key  = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');

      if (isFuture) return '<div class="ptg-cell ptg-cell--future">·</div>';
      if (!isWE) weekdays++;

      const dayData  = att[key];
      const dayTime  = dayData?.totalTime || 0;
      const manualOverride = dayData?.manualPresent;
      const present  = manualOverride !== undefined ? manualOverride : dayTime >= MIN_PRESENCE_MS;
      if (present) { presences++; monthTime += dayTime; }
      (dayData?.activities || []).forEach(a => allActs.add(a));

      if (isWE) return '<div class="ptg-cell ptg-cell--weekend" title="Weekend">W</div>';
      const title = (dayTime > 0 ? fmtDuration(dayTime) + ' · ' : '') + 'Cliquer pour modifier';
      return present
        ? '<div class="ptg-cell ptg-cell--present" title="' + title + '" style="cursor:pointer;" onclick="adminToggleAttendance(\'' + u.id + '\',\'' + key + '\',false)">P</div>'
        : '<div class="ptg-cell ptg-cell--absent" title="' + title + '" style="cursor:pointer;" onclick="adminToggleAttendance(\'' + u.id + '\',\'' + key + '\',true)">—</div>';
    }).join('');

    if (presences > 0) presentUsers++;
    totalPresences += presences;
    totalTime += monthTime;

    const rate = weekdays > 0 ? Math.round(presences / weekdays * 100) : 0;
    const rateColor  = rate >= 80 ? '#065F46' : rate >= 50 ? '#92400E' : '#7F1D1D';
    const rateBg     = rate >= 80 ? '#D1FAE5' : rate >= 50 ? '#FEF3C7' : '#FEE2E2';
    const rateBorder = rate >= 80 ? '#6EE7B7' : rate >= 50 ? '#FCD34D' : '#FCA5A5';

    const actIcons = { quiz:'🎯', cours:'📖', video:'🎬' };
    const actStr = [...allActs].map(a => actIcons[a] || a).join(' ') || '—';

    return '<div class="ptg-calendar-grid" style="grid-template-columns:' + cols + ';margin-top:2px;">'
      + '<div class="ptg-cell ptg-cell-name" title="' + u.name + '">' + (u.name.length > 24 ? u.name.slice(0,22)+'…' : u.name) + '</div>'
      + cells
      + '<div class="ptg-cell ptg-cell--rate" style="background:' + rateBg + ';border-color:' + rateBorder + ';color:' + rateColor + ';">' + rate + '%</div>'
      + '<div class="ptg-cell ptg-cell--time">' + fmtDuration(monthTime) + '</div>'
      + '<div class="ptg-cell" style="font-size:0.8rem;">' + actStr + '</div>'
      + '</div>';
  }).join('');

  const tableEl = document.getElementById('ptg-table');
  if (tableEl) {
    tableEl.innerHTML = users.length
      ? header + rows
      : '<div style="text-align:center;padding:2.5rem;color:#94A3B8;font-size:0.88rem;">Aucun auditeur pour ce filtre.</div>';
  }

  // Calcul taux moyen sur jours ouvrés écoulés
  const elapsedWeekdays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    const dow  = date.getDay();
    return date <= today && dow !== 0 && dow !== 6 ? 1 : 0;
  }).reduce((a, b) => a + b, 0);

  const denominator = users.length * Math.max(1, elapsedWeekdays);
  const avgRate = denominator > 0 ? Math.round(totalPresences / denominator * 100) : 0;
  const avgTime = users.length > 0 ? Math.round(totalTime / users.length) : 0;

  const statsEl = document.getElementById('ptg-stats');
  if (statsEl) {
    statsEl.innerHTML = `
      <div class="ptg-stat-box">
        <div style="font-size:0.7rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.3rem;">Auditeurs suivis</div>
        <div style="font-size:1.9rem;font-weight:800;color:#1E293B;">${users.length}</div>
      </div>
      <div class="ptg-stat-box">
        <div style="font-size:0.7rem;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.3rem;">Actifs ce mois</div>
        <div style="font-size:1.9rem;font-weight:800;color:#7C3AED;">${presentUsers}</div>
      </div>
      <div class="ptg-stat-box">
        <div style="font-size:0.7rem;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.3rem;">Taux moyen</div>
        <div style="font-size:1.9rem;font-weight:800;color:#1D4ED8;">${avgRate}%</div>
      </div>
      <div class="ptg-stat-box">
        <div style="font-size:0.7rem;font-weight:700;color:#065F46;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.3rem;">Temps moyen/auditeur</div>
        <div style="font-size:1.9rem;font-weight:800;color:#065F46;">${fmtDuration(avgTime)}</div>
      </div>`;
  }
}

// ── Admin : liste des séances ────────────────────────────────
function renderAdminSessions() {
  const el = document.getElementById('admin-sessions-list');
  if (!el) return;
  const sessions = (appData.sessions || []).slice().reverse();
  if (!sessions.length) {
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:#94A3B8;font-size:0.88rem;">Aucune séance enregistrée.</div>';
    return;
  }
  el.innerHTML = sessions.map(s => {
    const att = Object.values(s.attendees);
    const total = att.length;
    const pres  = att.filter(a => a.status === 'present').length;
    const abs   = att.filter(a => a.status === 'absent').length;
    const pend  = total - pres - abs;
    const rate  = total > 0 ? Math.round(pres / total * 100) : 0;
    const rateColor = rate >= 80 ? '#065F46' : rate >= 50 ? '#92400E' : '#7F1D1D';
    const rateBg    = rate >= 80 ? '#D1FAE5' : rate >= 50 ? '#FEF3C7' : '#FEE2E2';
    const statusBadge = s.status === 'active'
      ? '<span style="background:#D1FAE5;color:#065F46;border-radius:50px;padding:0.12rem 0.55rem;font-size:0.68rem;font-weight:800;">● En cours</span>'
      : '<span style="background:#F1F5F9;color:#64748B;border-radius:50px;padding:0.12rem 0.55rem;font-size:0.68rem;font-weight:700;">Clôturée</span>';
    const dur = s.closedAt ? fmtDuration(s.closedAt - s.startedAt) : fmtDuration(Date.now() - s.startedAt);

    const rowsHtml = Object.entries(s.attendees).map(([uid, a]) => {
      const sc = a.status === 'present' ? '#065F46' : a.status === 'absent' ? '#7F1D1D' : '#92400E';
      const sb = a.status === 'present' ? '#D1FAE5' : a.status === 'absent' ? '#FEE2E2' : '#FEF3C7';
      const sl = a.status === 'present' ? 'Présent' : a.status === 'absent' ? 'Absent' : 'En attente';
      return `<tr style="font-size:0.78rem;">
        <td style="padding:0.4rem 0.65rem;border-bottom:1px solid #F1F5F9;">${a.name}</td>
        <td style="padding:0.4rem 0.65rem;border-bottom:1px solid #F1F5F9;">${fmtTime(a.connectedAt)}</td>
        <td style="padding:0.4rem 0.65rem;border-bottom:1px solid #F1F5F9;">${fmtTime(a.validatedAt)}</td>
        <td style="padding:0.4rem 0.65rem;border-bottom:1px solid #F1F5F9;">${fmtDuration(a.cumulativeMs)}</td>
        <td style="padding:0.4rem 0.65rem;border-bottom:1px solid #F1F5F9;"><span style="background:${sb};color:${sc};border-radius:50px;padding:0.1rem 0.5rem;font-size:0.68rem;font-weight:700;">${sl}</span></td>
      </tr>`;
    }).join('');

    return `<div class="admin-sess-card">
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.6rem;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-weight:700;font-size:0.95rem;color:#1E293B;">${s.label}</div>
          <div style="font-size:0.75rem;color:#64748B;margin-top:0.15rem;">
            ${s.trainerName} · ${s.promotionName} · ${new Date(s.startedAt).toLocaleDateString('fr-FR')} · ${fmtTime(s.startedAt)}–${fmtTime(s.closedAt || s.endsAt)} · Durée : ${dur}
          </div>
        </div>
        ${statusBadge}
        <span style="background:${rateBg};color:${rateColor};border-radius:8px;padding:0.3rem 0.75rem;font-size:0.82rem;font-weight:800;">${rate}% · ${pres}P ${abs}A ${pend}⏳</span>
        <button onclick="exportOneSessionExcel('${s.id}')" style="padding:0.35rem 0.75rem;border-radius:7px;border:1px solid #22C55E;background:#F0FDF4;color:#065F46;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">Excel</button>
        <button onclick="exportOneSessionPDF('${s.id}')" style="padding:0.35rem 0.75rem;border-radius:7px;border:1px solid #EF4444;background:#FEF2F2;color:#7F1D1D;font-size:0.72rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">PDF</button>
      </div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.78rem;">
          <thead><tr style="background:#F8FAFC;">
            <th style="padding:0.4rem 0.65rem;text-align:left;font-size:0.68rem;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid #E2E8F0;">Auditeur</th>
            <th style="padding:0.4rem 0.65rem;text-align:left;font-size:0.68rem;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid #E2E8F0;">Connexion</th>
            <th style="padding:0.4rem 0.65rem;text-align:left;font-size:0.68rem;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid #E2E8F0;">Validé à</th>
            <th style="padding:0.4rem 0.65rem;text-align:left;font-size:0.68rem;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid #E2E8F0;">Durée cumulée</th>
            <th style="padding:0.4rem 0.65rem;text-align:left;font-size:0.68rem;color:#64748B;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;border-bottom:2px solid #E2E8F0;">Statut</th>
          </tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>`;
  }).join('');
}

function _sessionToRows(s) {
  return Object.entries(s.attendees).map(([, a]) => [
    a.name, fmtTime(a.connectedAt), fmtTime(a.validatedAt),
    fmtDuration(a.cumulativeMs),
    a.status === 'present' ? 'Présent' : a.status === 'absent' ? 'Absent' : 'En attente'
  ]);
}

function exportOneSessionExcel(sessionId) {
  const s = (appData.sessions || []).find(x => x.id === sessionId);
  if (!s) return;
  const headers = ['Auditeur','Heure connexion','Heure validation','Durée cumulée','Statut'];
  const rows = _sessionToRows(s);
  const info = [[`Séance : ${s.label}`],[`Formateur : ${s.trainerName}`],[`Promotion : ${s.promotionName}`],
    [`Date : ${new Date(s.startedAt).toLocaleDateString('fr-FR')}`],[`Heure : ${fmtTime(s.startedAt)} – ${fmtTime(s.closedAt||s.endsAt)}`],[],[headers],...rows];
  const csv = info.map(r => Array.isArray(r) ? r.map(c=>`"${String(c||'').replace(/"/g,'""')}"`).join(',') : `"${r}"`).join('\r\n');
  const blob = new Blob(['﻿'+csv],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url;
  a.download = `seance_${s.label.replace(/\s+/g,'_')}_${new Date(s.startedAt).toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotif('Export Excel généré', 'success');
}

function exportOneSessionPDF(sessionId) {
  const s = (appData.sessions || []).find(x => x.id === sessionId);
  if (!s) return;
  const att = Object.values(s.attendees);
  const pres = att.filter(a => a.status === 'present').length;
  const abs  = att.filter(a => a.status === 'absent').length;
  const rate = att.length > 0 ? Math.round(pres / att.length * 100) : 0;
  const rows = att.map(a => {
    const sc = a.status === 'present' ? '#065F46' : a.status === 'absent' ? '#7F1D1D' : '#92400E';
    const sb = a.status === 'present' ? '#D1FAE5' : a.status === 'absent' ? '#FEE2E2' : '#FEF3C7';
    const sl = a.status === 'present' ? 'Présent' : a.status === 'absent' ? 'Absent' : 'En attente';
    return `<tr><td>${a.name}</td><td>${fmtTime(a.connectedAt)}</td><td>${fmtTime(a.validatedAt)}</td><td>${fmtDuration(a.cumulativeMs)}</td><td style="color:${sc};font-weight:700;background:${sb};">${sl}</td></tr>`;
  }).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pointage — ${s.label}</title>
  <style>body{font-family:Arial,sans-serif;padding:2rem;color:#1E293B;}h1{font-size:1.2rem;margin-bottom:0.25rem;}
  .meta{font-size:0.85rem;color:#64748B;margin-bottom:1.5rem;}
  .stats{display:flex;gap:1rem;margin-bottom:1.5rem;}
  .stat{padding:0.75rem 1rem;border-radius:8px;text-align:center;min-width:80px;}
  table{width:100%;border-collapse:collapse;font-size:0.88rem;}
  th{background:#1E293B;color:#fff;padding:0.5rem 0.75rem;text-align:left;}
  td{padding:0.5rem 0.75rem;border-bottom:1px solid #E2E8F0;}
  tr:nth-child(even) td{background:#F8FAFC;}
  @media print{button{display:none!important;}}</style></head><body>
  <h1>Fiche de présence — ${s.label}</h1>
  <div class="meta">Formateur : ${s.trainerName} &nbsp;|&nbsp; Promotion : ${s.promotionName} &nbsp;|&nbsp; Date : ${new Date(s.startedAt).toLocaleDateString('fr-FR')} &nbsp;|&nbsp; ${fmtTime(s.startedAt)} – ${fmtTime(s.closedAt||s.endsAt)}</div>
  <div class="stats">
    <div class="stat" style="background:#D1FAE5;color:#065F46;"><div style="font-size:1.5rem;font-weight:800;">${pres}</div><div>Présents</div></div>
    <div class="stat" style="background:#FEE2E2;color:#7F1D1D;"><div style="font-size:1.5rem;font-weight:800;">${abs}</div><div>Absents</div></div>
    <div class="stat" style="background:#EFF6FF;color:#1D4ED8;"><div style="font-size:1.5rem;font-weight:800;">${rate}%</div><div>Taux</div></div>
  </div>
  <table><thead><tr><th>Auditeur</th><th>Heure connexion</th><th>Validé à</th><th>Durée cumulée</th><th>Statut</th></tr></thead>
  <tbody>${rows}</tbody></table>
  </body></html>`;
  const w = window.open('','_blank','width=900,height=700');
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
}

function exportAllSessionsExcel() {
  const sessions = appData.sessions || [];
  if (!sessions.length) { showNotif('Aucune séance à exporter.', 'error'); return; }
  const lines = [];
  sessions.forEach(s => {
    lines.push([`Séance : ${s.label}`, `Formateur : ${s.trainerName}`, `Promotion : ${s.promotionName}`, `Date : ${new Date(s.startedAt).toLocaleDateString('fr-FR')}`, `Horaire : ${fmtTime(s.startedAt)}–${fmtTime(s.closedAt||s.endsAt)}`].join(' | '));
    lines.push('"Auditeur","Connexion","Validation","Durée","Statut"');
    _sessionToRows(s).forEach(r => lines.push(r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')));
    lines.push('');
  });
  const blob = new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`toutes_seances_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotif('Export Excel de toutes les séances généré', 'success');
}

function exportAllSessionsPDF() {
  const sessions = appData.sessions || [];
  if (!sessions.length) { showNotif('Aucune séance à exporter.', 'error'); return; }
  const blocks = sessions.map(s => {
    const att = Object.values(s.attendees);
    const pres = att.filter(a => a.status === 'present').length;
    const rate = att.length > 0 ? Math.round(pres / att.length * 100) : 0;
    const rows = att.map(a => {
      const sl = a.status === 'present' ? 'Présent' : a.status === 'absent' ? 'Absent' : 'En attente';
      return `<tr><td>${a.name}</td><td>${fmtTime(a.connectedAt)}</td><td>${fmtTime(a.validatedAt)}</td><td>${fmtDuration(a.cumulativeMs)}</td><td>${sl}</td></tr>`;
    }).join('');
    return `<div class="block"><h2>${s.label}</h2><p class="meta">${s.trainerName} · ${s.promotionName} · ${new Date(s.startedAt).toLocaleDateString('fr-FR')} · Taux : ${rate}% (${pres}/${att.length})</p>
    <table><thead><tr><th>Auditeur</th><th>Connexion</th><th>Validation</th><th>Durée</th><th>Statut</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rapport Présences</title>
  <style>body{font-family:Arial,sans-serif;padding:2rem;color:#1E293B;font-size:0.82rem;}
  h1{font-size:1.3rem;margin-bottom:0.3rem;}h2{font-size:1rem;margin:0 0 0.15rem;}
  .meta{color:#64748B;font-size:0.78rem;margin-bottom:0.75rem;}
  .block{margin-bottom:2rem;break-inside:avoid;}
  table{width:100%;border-collapse:collapse;font-size:0.78rem;margin-bottom:0.5rem;}
  th{background:#1E293B;color:#fff;padding:0.35rem 0.6rem;text-align:left;}
  td{padding:0.35rem 0.6rem;border-bottom:1px solid #E2E8F0;}
  @media print{button{display:none!important;}}</style></head><body>
  <h1>Rapport global des présences</h1>
  <p class="meta">Exporté le ${new Date().toLocaleDateString('fr-FR')} à ${fmtTime(Date.now())} — ${sessions.length} séance(s)</p>
  ${blocks}</body></html>`;
  const w = window.open('','_blank','width=900,height=700');
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
}

function adminToggleAttendance(userId, dateKey, markPresent) {
  const user = appData.users.find(u => u.id === userId);
  if (!user) return;
  if (!user.attendance) user.attendance = {};
  if (!user.attendance[dateKey]) user.attendance[dateKey] = { sessions:[], activities:[], totalTime:0 };
  user.attendance[dateKey].manualPresent = markPresent;
  saveAppData(false);
  renderPointageView();
  showNotif(user.name + ' — ' + dateKey + ' : ' + (markPresent ? 'Présent ✓' : 'Absent'), markPresent ? 'success' : '');
}

function exportPointageCSV() {
  const monthEl = document.getElementById('ptg-month');
  const yearEl  = document.getElementById('ptg-year');
  const promoEl = document.getElementById('ptg-promo');
  const month = parseInt(monthEl?.value ?? new Date().getMonth(), 10);
  const year  = parseInt(yearEl?.value ?? new Date().getFullYear(), 10);
  const promoFilter = promoEl?.value || '';
  const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  let users = (appData.users || []).filter(u => !promoFilter || u.promotionId === promoFilter);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(23, 59, 59, 999);
  const MIN_PRESENCE_MS = 5 * 60 * 1000;

  const dayLabels = Array.from({ length: daysInMonth }, (_, i) => String(i+1).padStart(2,'0') + '/' + String(month+1).padStart(2,'0'));
  const headers = ['Nom', 'Promotion', ...dayLabels, 'Taux présence', 'Temps total', 'Activités'];

  const csvRows = users.map(u => {
    const att = u.attendance || {};
    const promo = (appData.promotions || []).find(p => p.id === u.promotionId);
    let presences = 0, weekdays = 0, monthTime = 0;
    const allActs = new Set();

    const cells = Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1;
      const date = new Date(year, month, d);
      const dow  = date.getDay();
      const isWE = dow === 0 || dow === 6;
      const isFuture = date > today;
      if (isFuture) return '';
      if (!isWE) weekdays++;
      const key = year + '-' + String(month+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      const dayData = att[key];
      const dayTime = dayData?.totalTime || 0;
      const present = dayTime >= MIN_PRESENCE_MS;
      if (present) { presences++; monthTime += dayTime; }
      (dayData?.activities || []).forEach(a => allActs.add(a));
      if (isWE) return 'W';
      return present ? 'P' : '-';
    });

    const rate = weekdays > 0 ? Math.round(presences / weekdays * 100) + '%' : '0%';
    return [u.name, promo?.name || '-', ...cells, rate, fmtDuration(monthTime), [...allActs].join('+') || '-'];
  });

  const csv = [headers, ...csvRows].map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pointage_' + MONTHS[month] + '_' + year + '.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotif('CSV exporté — ' + MONTHS[month] + ' ' + year, 'success');
}

function checkPaymentAlert() {
  if (auth.role !== 'student' || !auth.userId) return;
  const user = appData.users.find(u => u.id === auth.userId);
  if (!user || !user.paidUntil) return;

  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const paidDate = new Date(user.paidUntil); paidDate.setHours(0, 0, 0, 0);
  const diffMs   = paidDate - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Alerte uniquement si l'échéance est dans 1 à 7 jours
  if (diffDays < 1 || diffDays > 7) return;

  // Ne pas répéter si déjà fermé aujourd'hui
  const dismissedKey = 'hermes_pay_alert_' + auth.userId + '_' + today.toISOString().slice(0, 10);
  if (sessionStorage.getItem(dismissedKey)) return;

  const overlay  = document.getElementById('pay-alert-overlay');
  const daysEl   = document.getElementById('pay-alert-days');
  const dateEl   = document.getElementById('pay-alert-date');
  if (!overlay) return;

  if (daysEl) daysEl.textContent = diffDays === 1
    ? 'Votre accès expire demain !'
    : 'Il vous reste ' + diffDays + ' jours avant expiration.';
  if (dateEl) dateEl.textContent = fmtDate(user.paidUntil);

  overlay._dismissKey = dismissedKey;
  overlay.style.display = 'flex';
}

function closePayAlert() {
  const overlay = document.getElementById('pay-alert-overlay');
  if (!overlay) return;
  if (overlay._dismissKey) sessionStorage.setItem(overlay._dismissKey, '1');
  overlay.style.display = 'none';
}

function previewPayAlert() {
  // Aperçu forcé de l'alerte — sans condition de délai ni de session
  const overlay = document.getElementById('pay-alert-overlay');
  const daysEl  = document.getElementById('pay-alert-days');
  const dateEl  = document.getElementById('pay-alert-date');
  if (!overlay) return;
  const exampleDate = addOneMonth(null);
  if (daysEl) daysEl.textContent = 'Il vous reste 5 jours avant expiration. (aperçu)';
  if (dateEl) dateEl.textContent = fmtDate(exampleDate);
  overlay._dismissKey = null;
  overlay.style.display = 'flex';
}

function enterStudentApp() {
  // Effacer toute notification résiduelle (ex: "À bientôt !" d'une déconnexion précédente)
  clearTimeout(notifTimer);
  const notifEl = document.getElementById('notif');
  if (notifEl) notifEl.className = 'notif';

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('student-app').style.display = 'block';
  setTimeout(studentNavScrollCheck, 50);
  document.getElementById('admin-app').classList.remove('active');
  const trainerAppEl2 = document.getElementById('trainer-app');
  if (trainerAppEl2) trainerAppEl2.classList.remove('active');
  updateStudentUI();
  renderDashboardWidgets();
  renderStudentVideos();
  goTo('splash');
  startAttendanceSession();
  // Démarrer le polling pour les notifications de cours en direct
  if (typeof startLiveStudentPolling === 'function') startLiveStudentPolling();
  // Alerte mensualité si échéance dans ≤ 7 jours
  setTimeout(checkPaymentAlert, 600);
}

function showRememberPrompt(name) {
  const overlay = document.getElementById('remember-overlay');
  const nameEl  = document.getElementById('remember-welcome-name');
  if (nameEl) nameEl.textContent = 'Bienvenue, ' + name + ' !';
  if (overlay) overlay.style.display = 'flex';
}

function confirmRemember(remember) {
  const overlay = document.getElementById('remember-overlay');
  if (overlay) overlay.style.display = 'none';
  saveSession(remember);
  if (remember) {
    // Mémoriser aussi le téléphone pour la connexion rapide future
    const user = appData.users.find(u => u.id === auth.userId);
    if (user?.phone) {
      try {
        localStorage.setItem(PHONE_CACHE_KEY, JSON.stringify({
          name: user.name,
          phone: user.phone,
          promotionId: user.promotionId
        }));
      } catch(e) {}
    }
  }
  enterStudentApp();
  const msg = remember
    ? 'Bienvenue ! Vos informations sont enregistrées pour la prochaine visite.'
    : 'Bienvenue ! Vous devrez vous identifier à la prochaine visite.';
  showNotif(msg, 'success');
}

function buildCourseCard(c, accentColor) {
  const hasPdf = !!c.pdfName;
  const hasVideo = !!(c.videoFileName);
  const badge = hasPdf
    ? `<span style="background:#E3F2FD;color:#1565C0;border-radius:50px;padding:0.15rem 0.5rem;font-size:0.68rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF</span>`
    : hasVideo
      ? `<span style="background:#FFEBEE;color:#C62828;border-radius:50px;padding:0.15rem 0.5rem;font-size:0.68rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> Vidéo</span>`
      : `<span style="background:#F5F5F5;color:#aaa;border-radius:50px;padding:0.15rem 0.5rem;font-size:0.68rem;font-weight:600;">Bientôt</span>`;
  return `<div onclick="openCourseDetailModal('${c.id}','${accentColor}')" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0.85rem;border-radius:12px;border:1px solid #F0F0F0;background:#FAFAFA;cursor:pointer;transition:background 0.15s,border-color 0.15s;" onmouseenter="this.style.background='${accentColor}10';this.style.borderColor='${accentColor}40';" onmouseleave="this.style.background='#FAFAFA';this.style.borderColor='#F0F0F0';">
    <div style="width:40px;height:40px;border-radius:12px;background:${accentColor}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iconHTML(c.icon, 22)}</div>
    <div style="flex:1;min-width:0;">
      <div style="font-weight:700;font-size:0.88rem;color:#1A1A1A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
      <div style="margin-top:0.2rem;">${badge}</div>
    </div>
    <span style="color:${accentColor};font-size:1rem;flex-shrink:0;">›</span>
  </div>`;
}

function openCourseDetailModal(courseId, accentColor) {
  const c = getCourse(courseId);
  if (!c) return;
  trackActivity('cours');
  const hasPdf = !!c.pdfName;
  const hasVideo = !!(c.videoFileName);
  const backdrop = document.getElementById('course-modal-backdrop');
  document.getElementById('course-modal-banner').style.background = `linear-gradient(135deg,${accentColor},${accentColor}cc)`;
  document.getElementById('course-modal-banner').innerHTML = iconHTML(c.icon, 28);
  document.getElementById('course-modal-name').style.color = accentColor;
  document.getElementById('course-modal-name').textContent = c.name;
  document.getElementById('course-modal-desc').textContent = c.desc || '';
  const badge = hasPdf
    ? `<span style="background:#E3F2FD;color:#1565C0;border-radius:50px;padding:0.2rem 0.7rem;font-size:0.75rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF</span>`
    : hasVideo
      ? `<span style="background:#FFEBEE;color:#C62828;border-radius:50px;padding:0.2rem 0.7rem;font-size:0.75rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> Vidéo</span>`
      : `<span style="background:#F5F5F5;color:#aaa;border-radius:50px;padding:0.2rem 0.7rem;font-size:0.75rem;font-weight:600;">Pas encore de fichier</span>`;
  document.getElementById('course-modal-badge').innerHTML = badge;
  const actions = document.getElementById('course-modal-actions');
  actions.innerHTML = '';
  if (hasPdf) {
    actions.innerHTML += `<button onclick="closeCourseDetailModal();openPdfPreview('${c.id}','${c.name.replace(/'/g,"\\'")}');" style="width:100%;background:${accentColor};color:#fff;border:none;border-radius:10px;padding:0.8rem;font-weight:700;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;gap:0.45rem;">${iconHTML('📖', 15)} Lire le cours PDF</button>`;
  }
  if (hasVideo) {
    actions.innerHTML += `<button onclick="closeCourseDetailModal();openCourseVideoById('${c.id}')" style="width:100%;background:#C62828;color:#fff;border:none;border-radius:10px;padding:0.8rem;font-weight:700;cursor:pointer;font-size:0.9rem;">▶ Regarder la vidéo</button>`;
  }
  backdrop.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCourseDetailModal(event) {
  if (event && event.target !== document.getElementById('course-modal-backdrop')) return;
  document.getElementById('course-modal-backdrop').style.display = 'none';
  document.body.style.overflow = '';
}

function renderSectionCourses() {
  // TOUR 1
  const tour1 = document.getElementById('sec-courses-tour1');
  const t1Courses = getCoursesByTour('tour1');
  if (tour1) {
    tour1.innerHTML = t1Courses.length
      ? t1Courses.map(c => buildCourseCard(c, '#0D47A1')).join('')
      : '<p style="color:#aaa;font-size:0.85rem;padding:0.5rem;">Aucun cours du 1er tour.</p>';
  }
  const cw1 = document.getElementById('cw-t1-count');
  if (cw1) cw1.textContent = t1Courses.length;

  // TOUR 2
  const tour2 = document.getElementById('sec-courses-tour2');
  const t2Courses = getCoursesByTour('tour2');
  if (tour2) {
    tour2.innerHTML = t2Courses.length
      ? t2Courses.map(c => buildCourseCard(c, '#00796B')).join('')
      : '<p style="color:#aaa;font-size:0.85rem;padding:0.5rem;">Aucun cours du 2ème tour.</p>';
  }
  const cw2 = document.getElementById('cw-t2-count');
  if (cw2) cw2.textContent = t2Courses.length;

  // TOUR 3 — Cours PDF + Capsules vidéo
  const filters = document.getElementById('sec-courses-tour3-videos');
  const grid = document.getElementById('sec-courses-tour3-grid');
  const t3Courses = getCoursesByTour('tour3');
  const allVideos = loadVideos();
  const t3PdfCourses = t3Courses.filter(c => !!c.pdfName || c.contentType === 'pdf');
  const cw3 = document.getElementById('cw-t3-count');
  if (cw3) cw3.textContent = t3PdfCourses.length + allVideos.length;

  if (filters) {
    // Filtres vidéo
    if (allVideos.length) {
      filters.innerHTML = '<button onclick="filterTour3Videos(\'all\', this)" class="t3-filter" style="background:#C62828;color:#fff;border:none;border-radius:50px;padding:0.35rem 0.85rem;font-size:0.75rem;font-weight:600;cursor:pointer;">Toutes</button>'
        + t3Courses.filter(c => allVideos.some(v => v.courseId === c.id)).map(c =>
            `<button onclick="filterTour3Videos('${c.id}', this)" class="t3-filter" style="background:#fff;color:#C62828;border:1px solid #C62828;border-radius:50px;padding:0.35rem 0.85rem;font-size:0.75rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;">${iconHTML(c.icon, 12)} ${c.name}</button>`).join('');
    } else {
      filters.innerHTML = '';
    }
    if (grid) {
      buildTour3Grid(grid, t3PdfCourses, allVideos);
    }
  }
}

function buildTour3Grid(grid, pdfCourses, videos) {
  const pdfHtml = pdfCourses.map(c => buildCourseCard(c, '#C62828')).join('');
  const videoHtml = videos.map(v => {
    const course = getCourse(v.courseId);
    return `<div onclick="openVideoPlayer('${v.id}')" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0.85rem;border-radius:12px;border:1px solid #F0F0F0;background:#FAFAFA;cursor:pointer;transition:background 0.15s,border-color 0.15s;" onmouseenter="this.style.background='#FFEBEE';this.style.borderColor='#EF9A9A';" onmouseleave="this.style.background='#FAFAFA';this.style.borderColor='#F0F0F0';">
      <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#B71C1C,#E53935);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        ${v.duration ? `<span style="position:absolute;bottom:-4px;right:-4px;background:#C62828;color:#fff;font-size:0.55rem;padding:0.1rem 0.3rem;border-radius:4px;font-weight:700;">${v.duration}</span>` : ''}
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;font-size:0.88rem;color:#1A1A1A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${v.title}</div>
        ${course ? `<span style="background:#FFEBEE;color:#C62828;border-radius:50px;padding:0.12rem 0.45rem;font-size:0.67rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;">${iconHTML(course.icon, 11)} ${course.name}</span>` : ''}
      </div>
      <span style="color:#C62828;font-size:1rem;flex-shrink:0;">▶</span>
    </div>`;
  }).join('');
  grid.innerHTML = pdfHtml + videoHtml
    || '<p style="color:#aaa;font-size:0.83rem;padding:0.5rem 0;text-align:center;">Aucun contenu du 3ème tour.</p>';
}

function filterTour3Videos(courseId, btn) {
  const grid = document.getElementById('sec-courses-tour3-grid');
  const all = loadVideos();
  const filtered = courseId === 'all' ? all : all.filter(v => v.courseId === courseId);
  const t3PdfCourses = getCoursesByTour('tour3').filter(c => !!c.pdfName || c.contentType === 'pdf');
  document.querySelectorAll('.t3-filter').forEach(b => {
    b.style.background = '#fff'; b.style.color = '#C62828';
  });
  if (btn) { btn.style.background = '#C62828'; btn.style.color = '#fff'; }
  buildTour3Grid(grid, courseId === 'all' ? t3PdfCourses : [], filtered);
}


function updateDashboard() {
  renderDashboardWidgets();
  updateRecouvrementBadge();
}

function renderDashboardWidgets() {
  const totalQ = Object.values(appData.questions || {}).reduce((s, a) => s + (a?.length || 0), 0);

  const coursesEl = document.getElementById('dash-courses-count');
  if (coursesEl) coursesEl.textContent = appData.courses.length;

  const videosEl = document.getElementById('dash-videos-count');
  if (videosEl) videosEl.textContent = loadVideos().length;

  // ── Carte cours en direct ──
  updateStudentLiveCard();

  const exList = document.getElementById('dash-exercises-list');
  if (exList) {
    if (!appData.courses.length) {
      exList.innerHTML = '<span style="color:#aaa;font-size:0.82rem;">⏳ En attente de contenu de l\'admin</span>';
    } else {
      const uniqueTypes = [...new Set(appData.exerciseTypes.map(e => e.icon + ' ' + e.name))];
      exList.innerHTML = uniqueTypes.length
        ? uniqueTypes.map(t => `<span style="background:#FFF3E0;color:#E65100;border:1px solid #FFCC80;border-radius:50px;padding:0.3rem 0.75rem;font-size:0.78rem;font-weight:600;">${t}</span>`).join('')
        : `<span style="background:#E8F5E9;color:#2E7D32;border-radius:50px;padding:0.3rem 0.75rem;font-size:0.78rem;font-weight:600;">❓ ${totalQ} question${totalQ>1?'s':''} QCM</span>`;
    }
  }

  // Bannière vide si aucun contenu
  const welcomeArea = document.getElementById('welcome-student-name');
  if (welcomeArea && !appData.courses.length) {
    const parent = welcomeArea.closest('div');
    if (parent && !document.getElementById('no-content-banner')) {
      const banner = document.createElement('div');
      banner.id = 'no-content-banner';
      banner.style.cssText = 'margin-top:1rem;padding:0.85rem 1rem;background:#FFF3E0;border-radius:10px;border-left:4px solid #FF9800;color:#E65100;font-size:0.85rem;';
      banner.textContent = '⏳ Votre formateur n\'a pas encore ajouté de contenu. Revenez bientôt !';
      parent.appendChild(banner);
    }
  } else {
    const b = document.getElementById('no-content-banner');
    if (b) b.remove();
  }
}

// ══════════════════════════════════════════
//  COURS EN DIRECT — espace étudiant
// ══════════════════════════════════════════

// Lit la session live active depuis localStorage (données fraîches)
function getActiveLiveSessionForStudent() {
  try { return (appData.liveSessions || []).find(s => s.status === "active") || null; }
  catch(e) { return null; }
}

// Met à jour la carte "Cours en direct" du tableau de bord
function updateStudentLiveCard() {
  const card    = document.getElementById('student-live-card');
  const titleEl = document.getElementById('student-live-card-title');
  const trainEl = document.getElementById('student-live-card-trainer');
  const btn     = document.getElementById('student-live-card-btn');
  if (!card) return;

  const liveSession = getActiveLiveSessionForStudent();

  if (liveSession) {
    if (titleEl) titleEl.textContent = liveSession.courseName || 'Cours en direct';
    if (trainEl) trainEl.textContent = 'Formateur : ' + (liveSession.trainerName || '–');
    if (btn) btn.onclick = function() {
      if (typeof studentJoinLiveSession === 'function') studentJoinLiveSession(liveSession.id);
    };
    card.style.display = 'block';
    // Badge rouge LIVE sur le bouton sidebar
    const sideBadge = document.getElementById('student-live-rec-badge');
    if (sideBadge) { sideBadge.textContent = 'LIVE'; sideBadge.style.background = '#ef4444'; sideBadge.style.display = 'inline-flex'; }
  } else {
    card.style.display = 'none';
    const sideBadge = document.getElementById('student-live-rec-badge');
    if (sideBadge) sideBadge.style.display = 'none';
  }
}

// Met à jour la zone "rejoindre" dans la section Cours en direct
function renderStudentLiveSection() {
  const zone = document.getElementById('student-live-join-zone');
  if (!zone) return;

  const liveSession = getActiveLiveSessionForStudent();

  if (liveSession) {
    zone.innerHTML = `
      <div style="background:linear-gradient(135deg,#0f3d2e,#1a5c40);border-radius:18px;border:2px solid rgba(34,197,94,0.5);padding:2rem;margin-bottom:1.5rem;box-shadow:0 8px 32px rgba(34,197,94,0.2);">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem;">
          <span style="width:10px;height:10px;background:#ef4444;border-radius:50%;display:inline-block;animation:livePulse 1.2s infinite;"></span>
          <span style="background:#ef4444;color:#fff;font-size:0.62rem;font-weight:800;padding:0.15rem 0.6rem;border-radius:50px;letter-spacing:0.1em;text-transform:uppercase;">EN DIRECT</span>
        </div>
        <div style="font-size:1.25rem;font-weight:800;color:#fff;margin-bottom:0.35rem;">${(liveSession.courseName||'Cours en direct').replace(/</g,'&lt;')}</div>
        <div style="font-size:0.85rem;color:rgba(255,255,255,0.65);margin-bottom:1.5rem;">
          Animé par <strong style="color:#4ade80;">${(liveSession.trainerName||'Formateur').replace(/</g,'&lt;')}</strong>
          &nbsp;·&nbsp; Démarré à ${new Date(liveSession.startedAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}
        </div>
        <button onclick="if(typeof studentJoinLiveSession==='function') studentJoinLiveSession('${liveSession.id}')"
          style="background:#22C55E;color:#fff;border:none;border-radius:14px;padding:1rem 2.5rem;font-size:1rem;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 4px 16px rgba(34,197,94,0.45);transition:transform 0.15s;display:inline-flex;align-items:center;gap:0.6rem;width:100%;justify-content:center;"
          onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Rejoindre le cours en direct
        </button>
      </div>`;
  } else {
    zone.innerHTML = `
      <div style="background:#f0fdf4;border:1.5px dashed #bbf7d0;border-radius:16px;padding:2rem;text-align:center;margin-bottom:1.5rem;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 0.75rem;display:block;opacity:0.6;"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        <div style="font-size:0.95rem;font-weight:700;color:#16a34a;margin-bottom:0.25rem;">Aucun cours en direct pour le moment</div>
        <div style="font-size:0.8rem;color:#888;">Vous serez notifié dès qu'un cours démarre.</div>
      </div>`;
  }

  // Aussi rafraîchir les enregistrements
  if (typeof renderStudentLiveRecordings === 'function') renderStudentLiveRecordings();
}

function updateStudentUI() {
  const name = state.playerName || 'Étudiant';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const welcomeIcons = ['🎓','📖','✏️','🏆','📝','🎯'];
  const welcomeIcon = welcomeIcons[name.length % welcomeIcons.length];

  // Message de bienvenue
  const welcomeEl = document.getElementById('welcome-student-name');
  if (welcomeEl) welcomeEl.innerHTML = iconHTML(welcomeIcon, 15) + ' Bon retour, ' + name + ' !';

  // Avatar header
  const headerAv = document.getElementById('header-avatar');
  if (headerAv) headerAv.textContent = initials;

  // Sidebar
  const sidebarAv = document.getElementById('sidebar-avatar');
  if (sidebarAv) sidebarAv.textContent = initials;
  const sidebarName = document.getElementById('sidebar-name');
  if (sidebarName) sidebarName.textContent = name;
}

function sidebarNav(view) {
  // Réinitialiser tous les boutons
  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.style.background = 'transparent';
    btn.style.color = 'rgba(255,255,255,0.7)';
  });

  // Activer le bouton sélectionné
  const viewMap = { dashboard:0, courses:1, exercises:2, assessments:3, videos:4, results:5, profile:6, 'live-recordings':7 };
  const allBtns = document.querySelectorAll('.sidebar-btn');
  const idx = viewMap[view];
  if (idx !== undefined && allBtns[idx]) {
    allBtns[idx].style.background = 'rgba(255,255,255,0.2)';
    allBtns[idx].style.color = '#FFFFFF';
    allBtns[idx].style.fontWeight = '700';
  }

  // Cacher toutes les sections
  ['sec-dashboard','sec-courses','sec-exercises','sec-assessments','sec-videos','sec-results','sec-profile','sec-live-recordings'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Afficher la bonne section
  switch(view) {
    case 'dashboard':
      document.getElementById('sec-dashboard').style.display = 'block';
      renderDashboardWidgets();
      break;
    case 'courses':
      document.getElementById('sec-courses').style.display = 'block';
      renderSectionCourses();
      break;
    case 'exercises':
      document.getElementById('sec-exercises').style.display = 'block';
      renderSectionExercises();
      break;
    case 'assessments':
      document.getElementById('sec-assessments').style.display = 'block';
      renderStudentAssessments();
      break;
    case 'videos':
      document.getElementById('sec-videos').style.display = 'block';
      renderStudentVideos();
      break;
    case 'results':
      document.getElementById('sec-results').style.display = 'block';
      renderSectionResults();
      break;
    case 'profile':
      document.getElementById('sec-profile').style.display = 'block';
      renderSectionProfile();
      break;
    case 'live-recordings':
      document.getElementById('sec-live-recordings').style.display = 'block';
      renderStudentLiveSection();
      break;
  }
  // Fermer la sidebar sur mobile après navigation
  if (window.innerWidth <= 800) closeStudentSidebar();
}

function toggleStudentSidebar() {
  const aside = document.getElementById('student-main-aside');
  const overlay = document.getElementById('student-sidebar-overlay');
  if (!aside) return;
  const open = aside.classList.toggle('mobile-open');
  if (overlay) overlay.classList.toggle('active', open);
}

function closeStudentSidebar() {
  const aside = document.getElementById('student-main-aside');
  const overlay = document.getElementById('student-sidebar-overlay');
  if (aside) aside.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
}

// ══ ADMIN SIDEBAR DRAWER ══
// ══ ADMIN SIDEBAR DRAWER ══
function openAdminDrawer() {
  const drawer = document.getElementById('admin-drawer');
  const overlay = document.getElementById('admin-drawer-overlay');
  if (!drawer) return;
  drawer.setAttribute('style',
    'display:block!important;position:fixed!important;top:0;left:0;' +
    'width:280px;max-width:85vw;height:100vh;overflow-y:auto;' +
    '-webkit-overflow-scrolling:touch;background:#fff;' +
    'z-index:9999;box-shadow:6px 0 32px rgba(0,0,0,0.22);'
  );
  if (overlay) overlay.setAttribute('style',
    'display:block!important;position:fixed!important;top:0;left:0;' +
    'right:0;bottom:0;background:rgba(0,0,0,0.52);z-index:9998;cursor:pointer;'
  );
  document.documentElement.style.overflowY = 'hidden';
}
function closeAdminDrawer() {
  const drawer = document.getElementById('admin-drawer');
  const overlay = document.getElementById('admin-drawer-overlay');
  if (drawer) drawer.setAttribute('style', 'display:none');
  if (overlay) overlay.setAttribute('style', 'display:none');
  document.documentElement.style.overflowY = '';
}

// ══ FORMATEUR SIDEBAR DRAWER ══
function openTrainerDrawer() {
  const drawer = document.getElementById('trainer-drawer');
  const overlay = document.getElementById('trainer-drawer-overlay');
  if (!drawer) return;
  const nameEl = document.getElementById('trainer-topbar-name-display');
  const avatarEl = document.getElementById('trainer-topbar-avatar-display');
  const drawerName = document.getElementById('trainer-drawer-name');
  const drawerAvatar = document.getElementById('trainer-drawer-avatar');
  if (nameEl && drawerName && nameEl.textContent.trim() !== '–') drawerName.textContent = nameEl.textContent;
  if (avatarEl && drawerAvatar) drawerAvatar.textContent = avatarEl.textContent;
  drawer.setAttribute('style',
    'display:block!important;position:fixed!important;top:0;left:0;' +
    'width:280px;max-width:85vw;height:100vh;overflow-y:auto;' +
    '-webkit-overflow-scrolling:touch;background:#fff;' +
    'z-index:9999;box-shadow:6px 0 32px rgba(0,0,0,0.22);'
  );
  if (overlay) overlay.setAttribute('style',
    'display:block!important;position:fixed!important;top:0;left:0;' +
    'right:0;bottom:0;background:rgba(0,0,0,0.52);z-index:9998;cursor:pointer;'
  );
  document.documentElement.style.overflowY = 'hidden';
}
function closeTrainerDrawer() {
  const drawer = document.getElementById('trainer-drawer');
  const overlay = document.getElementById('trainer-drawer-overlay');
  if (drawer) drawer.setAttribute('style', 'display:none');
  if (overlay) overlay.setAttribute('style', 'display:none');
  document.documentElement.style.overflowY = '';
}

// ══ ACCORDÉON DU DRAWER ══
function toggleDrawerAccordion(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function goToSelector() {
  goTo('selector');
}

function renderSectionResults() {
  document.getElementById('res-total-pts').textContent = state.totalScore;
  document.getElementById('res-quiz-count').textContent = state.quizPlayed;
  document.getElementById('res-best').textContent = state.bestScore + '%';
  const cats = document.getElementById('sec-results-cats');
  if (!cats) return;
  const courses = appData.courses || [];
  cats.innerHTML = courses.map(c => {
    const pct = state.catScores[c.id] || 0;
    return `<div style="margin-bottom:1rem;">
      <div style="display:flex;justify-content:space-between;margin-bottom:0.35rem;font-size:0.85rem;">
        <span style="display:inline-flex;align-items:center;gap:4px;">${iconHTML(c.icon, 14)} ${c.name}</span><span style="font-weight:700;color:#0D47A1;">${pct}%</span>
      </div>
      <div style="height:8px;background:#E0E0E0;border-radius:4px;overflow:hidden;">
        <div style="width:${pct}%;height:100%;background:#00C853;border-radius:4px;transition:width 0.6s;"></div>
      </div>
    </div>`;
  }).join('') || '<p style="color:#999;text-align:center;">Aucun résultat pour le moment.</p>';
}

function renderSectionProfile() {
  const name = state.playerName || 'Étudiant';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const av = document.getElementById('prof-avatar-sec');
  if (av) av.textContent = initials;
  const nm = document.getElementById('prof-name-sec');
  if (nm) nm.textContent = name;
  const inp = document.getElementById('prof-name-input-sec');
  if (inp) inp.value = name;
  const pts = document.getElementById('prof-pts-sec');
  if (pts) pts.textContent = state.totalScore;
  const qz = document.getElementById('prof-quiz-sec');
  if (qz) qz.textContent = state.quizPlayed;
  const bs = document.getElementById('prof-best-sec');
  if (bs) bs.textContent = state.bestScore + '%';
}

function buildExerciseCard(ex, accent, now, sevenDays) {
  const ct2 = ex.contentType || 'pdf';
  const isNew = ex.createdAt && (now - ex.createdAt) < sevenDays;
  const typeIcon = ct2 === 'pdf' ? iconHTML('📄', 22) : iconHTML('🎬', 22);
  return `<div onclick="openExerciseDetailModal('${ex.id}')" style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem 0.85rem;border-radius:12px;border:1px solid ${isNew ? '#FF3D00' : '#F0F0F0'};background:${isNew ? '#FFF8F6' : '#FAFAFA'};cursor:pointer;transition:background 0.15s,border-color 0.15s;" onmouseenter="this.style.background='${accent}10';this.style.borderColor='${accent}40';" onmouseleave="this.style.background='${isNew ? '#FFF8F6' : '#FAFAFA'}';this.style.borderColor='${isNew ? '#FF3D00' : '#F0F0F0'}';">
    <div style="width:40px;height:40px;border-radius:12px;background:${accent}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${typeIcon}</div>
    <div style="flex:1;min-width:0;">
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <span style="font-weight:700;font-size:0.88rem;color:#1A1A1A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">${ex.name}</span>
        ${isNew ? '<span style="background:#FF3D00;color:#fff;border-radius:50px;padding:0.1rem 0.4rem;font-size:0.62rem;font-weight:700;flex-shrink:0;">NOUVEAU</span>' : ''}
      </div>
      <div style="font-size:0.72rem;color:#888;margin-top:0.15rem;">${ct2 === 'video' ? '🎬 Vidéo' : '📄 PDF'}</div>
    </div>
    <span style="color:${accent};font-size:1rem;flex-shrink:0;">›</span>
  </div>`;
}

function buildTour3ExGrid(grid, pdfExs, videoExs, now, sevenDays) {
  const accent = '#C62828';
  const html = [...pdfExs, ...videoExs].map(ex => buildExerciseCard(ex, accent, now, sevenDays)).join('');
  grid.innerHTML = html || '<p style="color:#aaa;font-size:0.83rem;padding:0.5rem 0;text-align:center;">Aucun exercice du 3ème tour.</p>';
}

function filterTour3Exercises(exId, btn) {
  const grid = document.getElementById('sec-exercises-tour3-grid');
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const t3All = [...(appData.exerciseTypes || [])].filter(ex => (ex.tourId || 'tour1') === 'tour3');
  const t3PdfExs = t3All.filter(ex => !ex.contentType || ex.contentType === 'pdf');
  const t3VideoExs = t3All.filter(ex => ex.contentType === 'video');
  document.querySelectorAll('.t3-ex-filter').forEach(b => { b.style.background = '#fff'; b.style.color = '#C62828'; });
  if (btn) { btn.style.background = '#C62828'; btn.style.color = '#fff'; }
  const filteredVideos = exId === 'all' ? t3VideoExs : t3VideoExs.filter(ex => ex.id === exId);
  buildTour3ExGrid(grid, exId === 'all' ? t3PdfExs : [], filteredVideos, now, sevenDays);
}

function renderSectionExercises() {
  const now = Date.now();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const exercises = [...(appData.exerciseTypes || [])].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const byTour = { tour1: [], tour2: [], tour3: [] };
  exercises.forEach(ex => {
    const t = ex.tourId || 'tour1';
    if (byTour[t]) byTour[t].push(ex); else byTour['tour1'].push(ex);
  });

  const configs = [
    { id: 'tour1', elId: 'sec-exercises-tour1', countId: 'ex-t1-count', accent: '#0D47A1' },
    { id: 'tour2', elId: 'sec-exercises-tour2', countId: 'ex-t2-count', accent: '#00796B' }
  ];

  configs.forEach(({ id, elId, countId, accent }) => {
    const el = document.getElementById(elId);
    const ct = document.getElementById(countId);
    const list = byTour[id];
    if (ct) ct.textContent = list.length;
    if (!el) return;
    if (!list.length) {
      el.innerHTML = '<p style="color:#aaa;font-size:0.83rem;padding:0.5rem 0;text-align:center;">Aucun exercice</p>';
      return;
    }
    el.innerHTML = list.map(ex => buildExerciseCard(ex, accent, now, sevenDays)).join('');
  });

  // TOUR 3 — Exercices PDF + Exercices Vidéo (même structure que COURS Tour 3)
  const t3Filters = document.getElementById('sec-exercises-tour3-videos');
  const t3Grid = document.getElementById('sec-exercises-tour3-grid');
  const t3List = byTour['tour3'];
  const t3PdfExs = t3List.filter(ex => !ex.contentType || ex.contentType === 'pdf');
  const t3VideoExs = t3List.filter(ex => ex.contentType === 'video');
  const ct3 = document.getElementById('ex-t3-count');
  if (ct3) ct3.textContent = t3List.length;

  if (t3Filters) {
    if (t3VideoExs.length) {
      t3Filters.innerHTML = '<button onclick="filterTour3Exercises(\'all\', this)" class="t3-ex-filter" style="background:#C62828;color:#fff;border:none;border-radius:50px;padding:0.35rem 0.85rem;font-size:0.75rem;font-weight:600;cursor:pointer;">Toutes</button>'
        + t3VideoExs.map(ex => `<button onclick="filterTour3Exercises('${ex.id}', this)" class="t3-ex-filter" style="background:#fff;color:#C62828;border:1px solid #C62828;border-radius:50px;padding:0.35rem 0.85rem;font-size:0.75rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> ${ex.name}</button>`).join('');
    } else {
      t3Filters.innerHTML = '';
    }
    if (t3Grid) buildTour3ExGrid(t3Grid, t3PdfExs, t3VideoExs, now, sevenDays);
  }
}

function openExerciseDetailModal(exId) {
  const ex = (appData.exerciseTypes || []).find(e => e.id === exId);
  if (!ex) return;
  const ct = ex.contentType || 'pdf';
  const isInteractive = ct === 'interactive';
  const hasFile = isInteractive ? (ex.questions?.length > 0) : (ct === 'pdf' ? !!ex.pdfName : !!ex.videoFileName);
  const isNew = ex.createdAt && (Date.now() - ex.createdAt) < 7 * 24 * 60 * 60 * 1000;
  const accent = isInteractive ? '#6D28D9' : (ex.tourId === 'tour2' ? '#00796B' : ex.tourId === 'tour3' ? '#C62828' : '#0D47A1');
  const bannerGrad = isInteractive
    ? 'linear-gradient(135deg,#4C1D95,#7C3AED)'
    : (ex.tourId === 'tour2'
        ? 'linear-gradient(135deg,#00897B,#00C853)'
        : ex.tourId === 'tour3'
          ? 'linear-gradient(135deg,#C62828,#E53935)'
          : 'linear-gradient(135deg,#0D47A1,#1976D2)');
  const typeIcon = isInteractive ? iconHTML('🎯', 26) : (ct === 'pdf' ? iconHTML('📄', 26) : iconHTML('🎬', 26));
  const tourLabel = ex.tourId === 'tour2' ? '2ème Tour' : ex.tourId === 'tour3' ? '3ème Tour' : '1er Tour';

  document.getElementById('ex-modal-banner').style.background = bannerGrad;
  document.getElementById('ex-modal-banner').innerHTML = typeIcon;
  document.getElementById('ex-modal-name').style.color = accent;
  document.getElementById('ex-modal-name').textContent = ex.name;
  document.getElementById('ex-modal-meta').innerHTML = tourLabel + (isInteractive ? ' · <strong>' + (ex.questions?.length || 0) + ' questions</strong>' : '');
  document.getElementById('ex-modal-date').textContent = ex.createdAt ? 'Ajouté le ' + new Date(ex.createdAt).toLocaleDateString('fr-FR') : '';

  const badges = document.getElementById('ex-modal-badges');
  const typeBadge = isInteractive
    ? `<span style="background:rgba(109,40,217,0.15);color:#6D28D9;border-radius:50px;padding:0.18rem 0.6rem;font-size:0.73rem;font-weight:700;">🎯 Interactif</span>`
    : '';
  badges.innerHTML = `<span style="background:${accent}18;color:${accent};border-radius:50px;padding:0.18rem 0.6rem;font-size:0.73rem;font-weight:600;">${tourLabel}</span>`
    + typeBadge
    + (isNew ? '<span style="background:#FF3D00;color:#fff;border-radius:50px;padding:0.18rem 0.6rem;font-size:0.73rem;font-weight:700;">NOUVEAU</span>' : '')
    + (hasFile
        ? `<span style="background:#E8F5E9;color:#2E7D32;border-radius:50px;padding:0.18rem 0.6rem;font-size:0.73rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Disponible</span>`
        : `<span style="background:#FFF3E0;color:#E65100;border-radius:50px;padding:0.18rem 0.6rem;font-size:0.73rem;font-weight:600;">Bientôt</span>`);

  const actions = document.getElementById('ex-modal-actions');
  if (hasFile) {
    if (isInteractive) {
      actions.innerHTML = `<button onclick="closeExerciseDetailModal();startInteractiveExercise('${ex.id}')" style="width:100%;background:linear-gradient(135deg,#4C1D95,#7C3AED);color:#fff;border:none;border-radius:10px;padding:0.8rem;font-weight:700;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;gap:0.45rem;box-shadow:0 4px 14px rgba(109,40,217,0.35);">🎯 Commencer l'exercice · ${ex.questions.length} questions</button>`;
    } else {
      actions.innerHTML = ct === 'pdf'
        ? `<button onclick="closeExerciseDetailModal();openExercisePdf('${ex.id}')" style="width:100%;background:${accent};color:#fff;border:none;border-radius:10px;padding:0.8rem;font-weight:700;cursor:pointer;font-size:0.9rem;display:flex;align-items:center;justify-content:center;gap:0.45rem;">${iconHTML('📖', 15)} Ouvrir l'exercice</button>`
        : `<button onclick="closeExerciseDetailModal();openExerciseVideo('${ex.id}')" style="width:100%;background:#C62828;color:#fff;border:none;border-radius:10px;padding:0.8rem;font-weight:700;cursor:pointer;font-size:0.9rem;">▶ Regarder l'exercice</button>`;
    }
  } else {
    actions.innerHTML = `<div style="background:#FFF3E0;border-radius:10px;padding:0.8rem;text-align:center;color:#E65100;font-size:0.85rem;font-weight:600;">⏳ Fichier pas encore disponible</div>`;
  }

  document.getElementById('exercise-modal-backdrop').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeExerciseDetailModal(event) {
  if (event && event.target !== document.getElementById('exercise-modal-backdrop')) return;
  document.getElementById('exercise-modal-backdrop').style.display = 'none';
  document.body.style.overflow = '';
}

function saveProfileSec() {
  const inp = document.getElementById('prof-name-input-sec');
  if (inp && inp.value.trim()) {
    state.playerName = inp.value.trim();
    saveUserStats();
    updateStudentUI();
    renderSectionProfile();
    showNotif('✅ Profil mis à jour !', 'success');
  }
}

function enterAdminApp() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('student-app').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  document.getElementById('admin-app').classList.add('active');
  switchAdminView('dashboard');
  renderAdminPanel();
}

function removeRedactionJuridique() {
  const removedId = 'redaction-juridique';
  appData.courses = appData.courses.filter(c => c.id !== removedId);
  if (appData.questions) delete appData.questions[removedId];
  const t2 = (appData.tours || []).find(t => t.id === 'tour2');
  const defT2 = DEFAULT_TOURS.find(t => t.id === 'tour2');
  if (t2 && defT2) t2.subtitle = defT2.subtitle;
  if (state.selectedCat === removedId) {
    state.selectedCat = getCoursesByTour(state.selectedTour || 'tour1')[0]?.id || 'culture';
  }
}

function migrateToursData() {
  if (!appData.tours?.length) appData.tours = [...DEFAULT_TOURS];

  const tour2Ids = ['droit-administratif','droit-constitutionnel','resume-texte','problemes-eco-sociaux'];
  const tour1Ids = ['culture','numerique','verbale','aptitude','anglais'];

  removeRedactionJuridique();

  appData.courses.forEach(c => {
    if (!c.tourId) {
      if (tour1Ids.includes(c.id)) c.tourId = 'tour1';
      else if (tour2Ids.includes(c.id) || c.id.includes('droit') || c.id.includes('resume') || c.id.includes('eco')) c.tourId = 'tour2';
      else if (c.id === 'oral' || (c.name || '').toLowerCase().includes('oral')) c.tourId = 'tour3';
      else c.tourId = 'tour1';
    }
    if (c.pdfName === undefined) c.pdfName = c.hasPdf ? 'document.pdf' : null;
  });

  // Les cours et QCM sont ajoutés uniquement par l'administrateur
  appData.tours.sort((a, b) => (a.order || 0) - (b.order || 0));
  appData.courses.sort((a, b) => {
    const ta = appData.tours.findIndex(t => t.id === a.tourId) - appData.tours.findIndex(t => t.id === b.tourId);
    if (ta !== 0) return ta;
    return a.name.localeCompare(b.name, 'fr');
  });
}

function mergeQuestionsBank() {
  const bank = typeof CONCOURS_QUESTIONS !== 'undefined' ? CONCOURS_QUESTIONS : DEFAULT_QUESTIONS;
  if (!bank || !Object.keys(bank).length) return false;
  if (!appData.questions) appData.questions = {};
  const storedVersion = parseInt(localStorage.getItem(VERSION_KEY) || '0', 10);
  let updated = false;
  if (storedVersion < DATA_VERSION) {
    Object.entries(bank).forEach(([courseId, list]) => {
      if (Array.isArray(list) && list.length) appData.questions[courseId] = list.map(q => ({ ...q }));
    });
    try { localStorage.setItem(VERSION_KEY, String(DATA_VERSION)); } catch (e) {}
    updated = true;
  } else {
    Object.entries(bank).forEach(([courseId, list]) => {
      if (!appData.questions[courseId]?.length && Array.isArray(list)) {
        appData.questions[courseId] = [...list];
        updated = true;
      }
    });
  }
  return updated;
}

function _fixAppDataFields(d) {
  if (!d) return;
  if (!d.tours || !d.tours.length) d.tours = [...DEFAULT_TOURS];
  if (!d.courses)            d.courses = [];
  if (!d.exerciseTypes)      d.exerciseTypes = [];
  if (!d.questions)          d.questions = {};
  if (!d.users)              d.users = [];
  if (!d.promotions)         d.promotions = [];
  if (!d.trainers)           d.trainers = [];
  if (!d.sessions)           d.sessions = [];
  if (!d.liveSessions)       d.liveSessions = [];
  if (!d.liveRecordings)     d.liveRecordings = [];
  if (!d.assessments)        d.assessments = [];
  if (!d.assessmentAttempts) d.assessmentAttempts = [];
  if (!d.liveChats) d.liveChats = {};
  if (!d.accessCodes) d.accessCodes = [];
  d.trainers.forEach(t => { if (!t.schedule) t.schedule = []; });
  d.users.forEach(u => { if (!u.attendance) u.attendance = {}; });
  d.tours.sort((a, b) => (a.order || 0) - (b.order || 0));
}

async function _saveToJsonBin() {
  try {
    await fetch(JSONBIN_URL, {
      method: "PUT",
      headers: { "X-Master-Key": JSONBIN_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(appData)
    });
  } catch(e) { console.warn("[JSONBin] Save failed", e); }
}

async function loadAppData() {
  const _emptyData = () => ({
    tours: [...DEFAULT_TOURS], courses: [], exerciseTypes: [], questions: {},
    users: [], promotions: [], trainers: [], sessions: [],
    liveSessions: [], liveRecordings: [], assessments: [], assessmentAttempts: [], liveChats: {}, accessCodes: []
  });
  try {
    const res = await fetch(JSONBIN_URL + "/latest", {
      headers: { "X-Master-Key": JSONBIN_KEY }
    });
    if (res.ok) {
      const json = await res.json();
      appData = json.record || json;
      _fixAppDataFields(appData);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); } catch(e) {}
      return;
    }
  } catch(e) { console.warn("[JSONBin] Load failed, fallback localStorage", e); }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) { appData = JSON.parse(saved); _fixAppDataFields(appData); }
    else { appData = _emptyData(); }
  } catch(e) { appData = _emptyData(); }
}
function saveAppData(render = true) {
  try {
    // Les onglets non-formateur ne doivent pas écraser les données créées par le formateur
    if (auth.role && auth.role !== 'trainer') {
      try {
        const _stored = localStorage.getItem(STORAGE_KEY);
        if (_stored) {
          const _sd = JSON.parse(_stored);
          // Préserver les sessions de présence classiques
          if (_sd.sessions && _sd.sessions.length > 0) appData.sessions = _sd.sessions;
          // Préserver les sessions en direct (le formateur peut en créer à tout moment)
          if (_sd.liveSessions && _sd.liveSessions.length > 0) {
            appData.liveSessions = _sd.liveSessions;
          }
          // Préserver les enregistrements live
          if (_sd.liveRecordings && _sd.liveRecordings.length > 0) {
            appData.liveRecordings = _sd.liveRecordings;
          }
        }
      } catch(_e) {}
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    _saveToJsonBin();
  } catch (e) {
    console.warn('localStorage indisponible', e);
  }
  if (render) {
    renderSelectorCategories();
    renderExerciseTypesSelector();
    renderDashboardWidgets();
    renderStudentVideos();
    if (document.getElementById('sec-courses')?.style.display !== 'none') renderSectionCourses();
    if (document.getElementById('sec-exercises')?.style.display !== 'none') renderSectionExercises();
    if (auth.role === 'admin') renderAdminPanel();
  } else if (auth.role === 'admin' && adminState?.adminView === 'dashboard') {
    // Mise à jour légère du widget séances sans re-rendre tout le panel
    const _sb = document.getElementById('adw-sessions-body');
    if (_sb) renderAdminWidgets();
  }
}

function getQuestions() { return appData.questions; }

function getCourse(id) { return appData.courses.find(c => c.id === id); }

function getTour(id) { return (appData.tours || []).find(t => t.id === id); }

function getTours() {
  return [...(appData.tours || DEFAULT_TOURS)].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function getCoursesByTour(tourId) {
  return appData.courses.filter(c => (c.tourId || 'tour1') === tourId);
}

function getCourseName(id) {
  if (id === 'mixte') return 'Mixte';
  return getCourse(id)?.name || id;
}

function getCourseEmoji(id) {
  if (id === 'mixte') return '🎯';
  return getCourse(id)?.icon || '📚';
}

function getExerciseTypesForCourse(courseId) {
  return appData.exerciseTypes || [];
}

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
}

function genId(prefix) {
  return prefix + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function countQuestions(courseId) {
  return (appData.questions[courseId] || []).length;
}

function renderCourseCardHtml(c) {
  const qCount = countQuestions(c.id);
  const hasPdf = !!c.pdfName;
  const pdfDot = hasPdf ? '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#1D9BF0;margin-right:4px;vertical-align:middle;"></span>' : '';
  return '<div class="course-card-student">'
    + '<div class="course-card-header">'
      + '<span class="course-card-icon">' + iconHTML(c.icon, 22) + '</span>'
      + '<div style="min-width:0;">'
        + '<div class="course-card-title">' + pdfDot + c.name + '</div>'
        + '<div class="course-card-meta">' + (qCount > 0 ? qCount + ' QCM' : 'Pas encore de QCM') + '</div>'
      + '</div>'
    + '</div>'
    + '<div class="course-card-actions">'
      + '<button class="btn-secondary" onclick="openCourseStudy(\'' + c.id + '\')" style="display:flex;align-items:center;gap:0.4rem;">' + iconHTML('📖', 14) + ' Étudier</button>'
    + '</div>'
  + '</div>';
}

// ══════════════════════════════════════════
//  STUDENT TABS MANAGEMENT
// ══════════════════════════════════════════
function switchStudentTab(tabName) {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
  document.querySelectorAll('.student-section').forEach(section => {
    section.classList.toggle('active', section.id === 'student-' + tabName + '-section');
  });
}

function setQuizMode(mode) {
  state.selectedMode = mode;
}

function renderStudentCourses() {
  const list = document.getElementById('student-courses-list');
  const welcome = document.getElementById('student-welcome');
  if (welcome && auth.role === 'student') welcome.textContent = 'Bonjour ' + state.playerName + ' — Prépare-toi. Performe. Excelle.';
  if (!list) return;

  const tours = getTours();
  if (!tours.length || !appData.courses.length) {
    list.innerHTML = '<div class="empty-state">Aucun cours disponible pour le moment.</div>';
    return;
  }

  const tourNums = ['\u2460','\u2461','\u2462','\u2463','\u2464'];
  list.innerHTML = '<div class="tours-timeline">' + tours.map((tour, idx) => {
    const courses = getCoursesByTour(tour.id);
    const countLabel = courses.length + ' mati\u00e8re' + (courses.length !== 1 ? 's' : '');
    const coursesHtml = courses.length
      ? '<div class="tour-courses-grid">' + courses.map(c => renderCourseCardHtml(c)).join('') + '</div>'
      : '<div class="empty-state" style="padding:1rem;text-align:center;">Aucune mati\u00e8re dans ce tour.</div>';
    const isOpen = idx === 0;
    const num = tourNums[idx] || (idx + 1);
    return '<div class="tour-block"><div class="tour-timeline-dot">' + num + '</div><details class="tour-accordion" data-tour="' + tour.id + '" ' + (isOpen ? 'open' : '') + '><summary class="tour-accordion-summary"><div class="tour-summary-row"><span class="tour-header-icon">' + tour.icon + '</span><div class="tour-summary-text"><div class="tour-header-title">' + tour.name + '</div><div class="tour-header-sub">' + (tour.subtitle || '') + '</div></div><span class="tour-matiere-count">' + countLabel + '</span><span class="tour-summary-chevron">\u25bc</span></div></summary><div class="tour-accordion-body"><div class="tour-body-divider"></div>' + coursesHtml + '</div></details></div>';
  }).join('') + '</div>';
  initTourAccordions();
}

function initTourAccordions() {
  document.querySelectorAll('details.tour-accordion').forEach(el => {
    if (el._tourBound) return;
    el._tourBound = true;
    el.addEventListener('toggle', () => {
      if (!el.open) return;
      document.querySelectorAll('details.tour-accordion').forEach(other => {
        if (other !== el) other.open = false;
      });
      state.selectedTour = el.dataset.tour;
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

// ─── Overlay PDF universel (étudiant + admin) ──────────────────────────────
async function renderPdfInContainer(blob, container) {
  container.innerHTML = '<div style="text-align:center;padding:2rem;color:#555;font-size:0.9rem;">⏳ Chargement du PDF…</div>';
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    container.innerHTML = '';
    const containerWidth = container.clientWidth || 340;
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const scale = Math.min((containerWidth - 16) / page.getViewport({ scale: 1 }).width, 2);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const ratio = window.devicePixelRatio || 1;
      canvas.width = viewport.width * ratio;
      canvas.height = viewport.height * ratio;
      canvas.style.width = viewport.width + 'px';
      canvas.style.height = viewport.height + 'px';
      canvas.style.display = 'block';
      canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
      canvas.style.borderRadius = '4px';
      canvas.style.background = '#fff';
      const ctx = canvas.getContext('2d');
      ctx.scale(ratio, ratio);
      await page.render({ canvasContext: ctx, viewport }).promise;
      container.appendChild(canvas);
    }
  } catch(e) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:#e53e3e;">❌ Erreur de chargement du PDF.</div>';
  }
}

function closePdfPreview() {
  document.getElementById('pdf-preview-overlay').style.display = 'none';
  document.body.classList.remove('modal-open');
  const frame = document.getElementById('pdf-preview-frame');
  frame.innerHTML = '';
  frame.style.display = 'none';
}

async function openPdfPreview(key, title) {
  const overlay = document.getElementById('pdf-preview-overlay');
  const frame   = document.getElementById('pdf-preview-frame');
  const empty   = document.getElementById('pdf-preview-empty');
  const emptyMsg= document.getElementById('pdf-preview-empty-msg');
  document.getElementById('pdf-preview-title').textContent = title || 'Aperçu';
  frame.innerHTML = '';
  frame.style.display = 'none';
  empty.style.display = 'none';
  overlay.style.display = 'flex';
  document.body.classList.add('modal-open');
  try {
    const pdfData = await getPdf(key);
    if (pdfData?.blob) {
      frame.style.display = 'flex';
      await renderPdfInContainer(pdfData.blob, frame);
    } else {
      emptyMsg.textContent = title ? '« ' + title + ' » — fichier non disponible' : 'Fichier non disponible';
      empty.style.display = 'flex';
    }
  } catch(e) {
    emptyMsg.textContent = 'Erreur de chargement du fichier.';
    empty.style.display = 'flex';
  }
}

// ─── Admin : prévisualiser un exercice ─────────────────────────────────────
async function adminPreviewExercise(exId) {
  const ex = appData.exerciseTypes.find(e => e.id === exId);
  if (!ex) { showNotif('❌ Exercice introuvable', 'error'); return; }
  const ct = ex.contentType || 'pdf';
  if (ct === 'video') {
    const videoId = exId + '_vid';
    const v = getVideoById(videoId);
    if (!v) { showNotif('❌ Aucune vidéo uploadée pour cet exercice', 'error'); return; }
    openVideoPlayer(videoId);
  } else {
    if (!ex.pdfName) { showNotif('❌ Aucun PDF uploadé pour cet exercice', 'error'); return; }
    openPdfPreview(exId, ex.name);
  }
}

async function openExercisePdf(exId) {
  const ex = appData.exerciseTypes.find(e => e.id === exId);
  if (!ex) { showNotif('❌ Exercice introuvable', 'error'); return; }
  openPdfPreview(exId, '📝 ' + ex.name);
}

async function openExerciseVideo(exId) {
  const ex = appData.exerciseTypes.find(e => e.id === exId);
  if (!ex) { showNotif('❌ Exercice introuvable', 'error'); return; }
  const videoId = exId + '_vid';
  const v = getVideoById(videoId);
  if (!v) { showNotif('❌ La vidéo n\'est pas encore disponible', 'error'); return; }
  openVideoPlayer(videoId);
}



async function openCourseVideoById(courseId) {
  const videoId = courseId + '_vid';
  openVideoPlayer(videoId);
}

async function openCourseStudy(courseId) {
  state.studyCourseId = courseId;
  const course = getCourse(courseId);
  if (!course) return;
  document.getElementById('study-course-title').textContent = course.name;
  const exBtn = document.getElementById('study-exercise-btn');
  if (exBtn) exBtn.style.display = '';
  const container = document.getElementById('pdf-container');
  container.innerHTML = '<div class="pdf-empty"><span style="font-size:2.5rem;margin-bottom:0.75rem;">⏳</span>Chargement…</div>';

  goTo('course-study');

  const pdfData = await getPdf(courseId);
  if (pdfData?.blob) {
    container.style.cssText = 'overflow-y:auto;display:flex;flex-direction:column;align-items:center;gap:8px;padding:0.75rem;flex:1;min-height:400px;';
    await renderPdfInContainer(pdfData.blob, container);
  } else {
    container.innerHTML = `
      <div class="pdf-empty">
        <span style="display:flex;justify-content:center;margin-bottom:0.75rem;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></span>
        <p><strong>Aucun PDF disponible</strong></p>
        <p style="font-size:0.85rem;margin-top:0.5rem;">L'administrateur n'a pas encore ajouté de support pour ce cours.<br>Vous pouvez quand même vous exercer.</p>
      </div>`;
  }
}

function exerciseFromStudy() {
  if (state.studyCourseId) startCourseExercise(state.studyCourseId);
}

function startCourseExercise(courseId) {
  const course = getCourse(courseId);
  if (course?.tourId) state.selectedTour = course.tourId;
  selectCat(courseId);
  state.selectedMode = 'training';
  state.selectedDiff = 'moyen';
  goTo('selector');
}

function renderAllCourses() {
  // renderStudentCourses(); // Désactivé - contenu statique utilisé
  renderSelectorTours();
  renderSelectorCategories();
  renderExerciseTypesSelector();
}

function renderSelectorTours() {
  const tabs = document.getElementById('selector-tours');
  if (!tabs) return;
  tabs.innerHTML = getTours().map(t => `
    <button type="button" class="tour-tab ${state.selectedTour === t.id ? 'active' : ''}" onclick="selectTour('${t.id}')">
      <span class="tour-tab-icon">${iconHTML(t.icon, 16)}</span>
      <span class="tour-tab-label">${t.name}</span>
    </button>
  `).join('');
}

function selectTour(tourId) {
  state.selectedTour = tourId;
  const courses = getCoursesByTour(tourId);
  if (state.selectedCat === 'mixte' || !courses.find(c => c.id === state.selectedCat)) {
    state.selectedCat = courses[0]?.id || 'culture';
    state.selectedExerciseType = null;
  }
  renderSelectorTours();
  renderSelectorCategories();
  renderExerciseTypesSelector();
}

function renderSelectorCategories() {
  const grid = document.getElementById('selector-categories');
  if (!grid) return;
  const tourCourses = getCoursesByTour(state.selectedTour || 'tour1');
  const courseCards = tourCourses.map(c => `
    <div class="mode-card" style="flex-direction:column;padding:0.75rem;text-align:center;" data-sel-cat="${c.id}" onclick="selectCat('${c.id}')">
      <span style="display:flex;justify-content:center;align-items:center;height:1.6rem;">${iconHTML(c.icon, 22)}</span>
      <div style="font-size:0.72rem;font-weight:600;margin-top:0.3rem;line-height:1.2;">${c.name.length > 14 ? c.name.split(' ').slice(0, 2).join(' ') : c.name}</div>
    </div>
  `).join('');
  const mixteCard = `
    <div class="mode-card" style="flex-direction:column;padding:0.75rem;text-align:center;" data-sel-cat="mixte" onclick="selectCat('mixte')">
      <span style="display:flex;justify-content:center;align-items:center;height:1.6rem;">${iconHTML('🎯', 22)}</span>
      <div style="font-size:0.72rem;font-weight:600;margin-top:0.3rem;">Tout le tour</div>
    </div>
  `;
  grid.innerHTML = courseCards + mixteCard;
  document.querySelectorAll('[data-sel-cat]').forEach(el => el.classList.remove('selected'));
  const el = document.querySelector('[data-sel-cat="'+state.selectedCat+'"]');
  if (el) el.classList.add('selected');
}

function renderExerciseTypesSelector() {
  const section = document.getElementById('exercise-types-section');
  const list = document.getElementById('selector-exercise-types');
  if (!section || !list) return;

  if (state.selectedCat === 'mixte') {
    section.style.display = 'block';
    list.style.display = 'flex';
    list.innerHTML = '<div class="mode-card selected" style="cursor:default;"><span class="mode-icon">' + iconHTML('🎯', 20) + '</span><div class="mode-info"><div class="mode-title">Toutes les matières du tour</div><div class="mode-desc">Questions mélangées du ' + (getTour(state.selectedTour)?.name || 'tour') + '</div></div></div>';
    state.selectedExerciseType = null;
    return;
  }

  const types = getExerciseTypesForCourse(state.selectedCat);
  section.style.display = types.length ? 'block' : 'none';
  list.style.display = types.length ? 'flex' : 'none';

  if (!types.length) {
    state.selectedExerciseType = null;
    list.innerHTML = '';
    return;
  }

  if (!state.selectedExerciseType || !types.find(t => t.id === state.selectedExerciseType)) {
    state.selectedExerciseType = types[0].id;
  }

  list.innerHTML = types.map(t => `
    <div class="mode-card ${state.selectedExerciseType === t.id ? 'selected' : ''}" data-ex-type="${t.id}" onclick="selectExerciseType('${t.id}')">
      <span class="mode-icon">${iconHTML(t.icon, 20)}</span>
      <div class="mode-info">
        <div class="mode-title">${t.name}</div>
        <div class="mode-desc">${t.desc || ''}</div>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
//  ADMIN
// ══════════════════════════════════════════
function switchAdminView(view, filterPromoId) {
  try { localStorage.setItem(SCREEN_KEY, 'admin:' + view); } catch(e) {}
  adminState.adminView = view;
  document.querySelectorAll('.admin-nav-item, .admin-mobile-nav button, #admin-drawer .drawer-nav-item, #admin-drawer .drawer-accordion-item').forEach(el => {
    el.classList.toggle('active', el.dataset.adminView === view);
  });
  // Auto-open accordion if active sub-item is inside it
  document.querySelectorAll('#admin-drawer .drawer-accordion').forEach(acc => {
    if (acc.querySelector('.drawer-accordion-item.active')) acc.classList.add('open');
  });
  closeAdminDrawer();
  document.querySelectorAll('.admin-view').forEach(v => {
    v.style.display = v.id === 'admin-view-' + view ? 'block' : 'none';
  });
  if (view === 'results') {
    renderAdminResults();
  } else if (view === 'videos') {
    populateVideoCoursesSelect();
    renderVideoMatiereChips();
    renderAdminVideosList();
  } else if (view === 'questions') {
    renderQCMCourseChips();
    renderAdminQCMList();
  } else if (view === 'exercises') {
    renderExerciseMatiereSelect();
    renderAdminExercisesList();
  } else if (view === 'promotions') {
    renderAdminPromotions();
  } else if (view === 'recouvrement') {
    renderRecouvrementView();
    updateRecouvrementBadge();
  } else if (view === 'pointage') {
    renderPointageView();
    // Réinitialiser sur l'onglet Grille
    switchPtgTab('grid');
  } else if (view === 'users') {
    const promo = filterPromoId ? appData.promotions.find(p => p.id === filterPromoId) : null;
    const titleEl = document.getElementById('users-view-title');
    const subEl   = document.getElementById('users-view-sub');
    if (titleEl) titleEl.textContent = promo ? 'Dossiers — ' + promo.name : 'Tous les apprenants';
    if (subEl)   subEl.textContent   = promo ? (promo.year ? promo.year + ' · ' : '') + 'Clôture : ' + fmtDate(promo.endDate) : 'Tous les groupes confondus';
    renderAdminUsersList(filterPromoId || null);
  } else if (view === 'settings') {
    loadEmailJSConfigToForm();
  } else if (view === 'trainers') {
    renderAdminTrainers();
  } else if (view === 'live-sessions') {
    renderAdminLiveSessions();
    // Mettre à jour le badge LIVE
    const activeLive = (appData.liveSessions||[]).find(s=>s.status==='active');
    const adminLiveBadge = document.getElementById('admin-live-active-badge');
    if (adminLiveBadge) adminLiveBadge.style.display = activeLive ? 'inline-block' : 'none';
  } else if (view === 'securite') {
    renderSecurityView();
  } else {
    renderAdminPanel();
  }
}

function renderSecurityView() {
  if (typeof HermesAuth === 'undefined') return;
  const actionFilter = document.getElementById('sec-filter-action')?.value || '';
  const roleFilter   = document.getElementById('sec-filter-role')?.value || '';
  let logs = HermesAuth.getHistory();
  if (actionFilter) logs = logs.filter(l => l.action === actionFilter);
  if (roleFilter)   logs = logs.filter(l => l.role === roleFilter);

  // Stats
  const allLogs = HermesAuth.getHistory();
  const el = id => document.getElementById(id);
  if (el('sec-stat-logins')) el('sec-stat-logins').textContent = allLogs.filter(l => l.action === 'login').length;
  if (el('sec-stat-failed')) el('sec-stat-failed').textContent = allLogs.filter(l => l.action === 'failed').length;
  if (el('sec-stat-locked')) el('sec-stat-locked').textContent = allLogs.filter(l => l.action === 'locked').length;
  if (el('sec-stat-total'))  el('sec-stat-total').textContent  = allLogs.length;

  // Table
  const container = el('sec-history-container');
  if (!container) return;
  if (!logs.length) {
    container.innerHTML = '<p style="color:#A6B4C8;font-size:.85rem;text-align:center;padding:2rem">Aucun événement enregistré.</p>';
    return;
  }
  const LABELS = { login:'Connexion', logout:'Déconnexion', failed:'Échec', locked:'Bloqué', auto_logout:'Timeout', password_changed:'MDP changé' };
  container.innerHTML = `<table class="ha-history-table" style="min-width:640px;">
    <thead><tr>
      <th>Date / Heure</th><th>Action</th><th>Email</th><th>Rôle</th><th>IP</th><th>Appareil</th>
    </tr></thead>
    <tbody>${logs.slice(0, 200).map(l => {
      const d = new Date(l.ts);
      const ds = d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR');
      const ac = l.action || 'login';
      return `<tr>
        <td style="white-space:nowrap">${ds}</td>
        <td><span class="ha-action-badge ${ac}">${LABELS[ac] || ac}</span></td>
        <td>${l.email || '—'}</td>
        <td style="text-transform:capitalize">${l.role || '—'}</td>
        <td style="font-variant-numeric:tabular-nums">${l.ip || '—'}</td>
        <td style="font-size:.78rem;color:#A6B4C8">${l.device || '—'}</td>
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}

function clearSecurityLogs() {
  confirmDialog('Vider tout l\'historique des connexions ? Cette action est irréversible.', { confirmText: 'Vider' }).then(ok => {
    if (!ok) return;
    localStorage.removeItem('hermes_conn_history');
    renderSecurityView();
    showNotif('Historique vidé.', 'success');
  });
}

function populateVideoCoursesSelect() {
  const courseSelect = document.getElementById('video-course');
  if (!courseSelect) return;
  // Clear all except first option
  while (courseSelect.options.length > 1) courseSelect.remove(1);
  appData.courses.forEach(c => {
    const o = document.createElement('option');
    o.value = c.id; o.textContent = c.icon + ' ' + c.name;
    courseSelect.appendChild(o);
  });
}

function updateRecouvrementBadge() {
  const badge = document.getElementById('rec-overdue-badge');
  if (!badge) return;
  const n = (appData.users || []).filter(u => paymentStatus(u) !== 'ok').length;
  if (n > 0) { badge.textContent = n; badge.style.display = 'inline-flex'; }
  else        { badge.style.display = 'none'; }
}

function renderAdminPanel() {
  if (auth.role !== 'admin') return;
  renderAdminStats();
  renderAdminTrainers();
  renderAdminCoursesList();
  renderCourseMatiereSelect();
  renderAdminExercisesList();
  renderExerciseMatiereSelect();
  renderAdminVideosList();
  renderAdminPromotions();
  updateRecouvrementBadge();
  if (typeof renderAdminAssessStats === 'function') renderAdminAssessStats();
}

function renderAdminStats() {
  const el = document.getElementById('admin-stats');
  if (!el) return;
  const users = appData.users.length;
  const courses = appData.courses.length;
  const pdfs = appData.courses.filter(c => c.pdfName).length;
  const exercises = appData.exerciseTypes.length;
  const totalQ = Object.values(appData.questions || {}).reduce((s, a) => s + (a?.length || 0), 0);
  const totalVideos = loadVideos().length;
  const totalSessions = (appData.sessions || []).length;
  const activeSessions = (appData.sessions || []).filter(s => s.status === 'active').length;
  const allAttendees = (appData.sessions || []).flatMap(s => Object.values(s.attendees));
  const globalRate = allAttendees.length > 0
    ? Math.round(allAttendees.filter(a => a.status === 'present').length / allAttendees.length * 100) : 0;
  const svgCalCheck = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></svg>`;

  const svgUsers = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const svgBook  = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
  const svgClip  = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
  const svgVideo = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`;

  el.innerHTML = `
    <div class="admin-stat-card" style="--card-accent:#3B82F6;--icon-bg:#EFF6FF;--icon-color:#2563EB;">
      <div class="admin-stat-card-top">
        <div class="admin-stat-icon">${svgUsers}</div>
        <span class="admin-stat-trend trend-up">actifs</span>
      </div>
      <div>
        <div class="admin-stat-val">${users}</div>
        <div class="admin-stat-lbl">Étudiants inscrits</div>
      </div>
    </div>
    <div class="admin-stat-card" style="--card-accent:#10B981;--icon-bg:#F0FDF4;--icon-color:#16A34A;">
      <div class="admin-stat-card-top">
        <div class="admin-stat-icon">${svgBook}</div>
        <span class="admin-stat-trend trend-up">${pdfs} PDF</span>
      </div>
      <div>
        <div class="admin-stat-val">${courses}</div>
        <div class="admin-stat-lbl">Cours / Matières</div>
      </div>
    </div>
    <div class="admin-stat-card" style="--card-accent:#F59E0B;--icon-bg:#FFFBEB;--icon-color:#D97706;">
      <div class="admin-stat-card-top">
        <div class="admin-stat-icon">${svgClip}</div>
        <span class="admin-stat-trend trend-warn">${exercises} type${exercises > 1 ? 's' : ''}</span>
      </div>
      <div>
        <div class="admin-stat-val">${exercises}</div>
        <div class="admin-stat-lbl">Types d'exercices</div>
      </div>
    </div>
    <div class="admin-stat-card" style="--card-accent:#8B5CF6;--icon-bg:#F5F3FF;--icon-color:#7C3AED;">
      <div class="admin-stat-card-top">
        <div class="admin-stat-icon">${svgVideo}</div>
        <span class="admin-stat-trend trend-info">en ligne</span>
      </div>
      <div>
        <div class="admin-stat-val">${totalVideos}</div>
        <div class="admin-stat-lbl">Capsules Vidéo</div>
      </div>
    </div>
    <div class="admin-stat-card" style="--card-accent:#22C55E;--icon-bg:#F0FDF4;--icon-color:#16A34A;" onclick="switchAdminView('pointage')" style="cursor:pointer;">
      <div class="admin-stat-card-top">
        <div class="admin-stat-icon">${svgCalCheck}</div>
        <span class="admin-stat-trend ${activeSessions > 0 ? 'trend-up' : 'trend-info'}">${activeSessions > 0 ? activeSessions + ' active' : globalRate + '% taux'}</span>
      </div>
      <div>
        <div class="admin-stat-val">${totalSessions}</div>
        <div class="admin-stat-lbl">Séances enregistrées</div>
      </div>
    </div>
  `;

  renderAdminWidgets();
}

function renderAdminWidgets() {
  const users          = appData.users;
  const courses        = appData.courses;
  const totalVideos    = loadVideos().length;
  const pdfs           = courses.filter(c => c.pdfName).length;
  const exercisesCount = appData.exerciseTypes ? appData.exerciseTypes.length : 0;

  // ── Widget 1 : Répartition par tour ──────────────────────────────
  const tourDef = [
    { key:'tour1', label:'1er Tour — Cours', color:'#3B82F6' },
    { key:'tour2', label:'2ème Tour — Rédaction', color:'#10B981' },
    { key:'tour3', label:'3ème Tour — Oral', color:'#F59E0B' },
  ];
  const maxTour = Math.max(1, ...tourDef.map(t => courses.filter(c => c.tour === t.key).length));
  const toursHtml = tourDef.map(t => {
    const n = courses.filter(c => c.tour === t.key).length;
    const pct = Math.round((n / maxTour) * 100);
    return `<div class="adw-tour-row">
      <div class="adw-tour-label">${t.label}</div>
      <div class="adw-tour-bar"><div class="adw-tour-fill" style="width:${pct}%;background:${t.color};"></div></div>
      <div class="adw-tour-count">${n}</div>
    </div>`;
  }).join('');
  const toursBody = document.getElementById('adw-tours-body');
  if (toursBody) toursBody.innerHTML = toursHtml || '<div style="color:#94A3B8;font-size:0.82rem;">Aucun cours enregistré.</div>';

  // ── Widget 2 : Alertes ───────────────────────────────────────────
  const _activeSess = (appData.sessions || []).filter(s => s.status === 'active');
  const _allAtt = (appData.sessions || []).flatMap(s => Object.values(s.attendees));
  const _globalRate = _allAtt.length > 0 ? Math.round(_allAtt.filter(a => a.status === 'present').length / _allAtt.length * 100) : null;
  const _overdueUsers = users.filter(u => paymentStatus(u) !== 'ok');
  const alerts = [];
  if (_activeSess.length > 0)
    alerts.push({ color:'#22C55E', text:`${_activeSess.length} séance(s) en cours — ${_activeSess.map(s => s.label).join(', ')}` });
  if (_globalRate !== null)
    alerts.push({ color: _globalRate >= 80 ? '#10B981' : _globalRate >= 50 ? '#F59E0B' : '#EF4444', text:`Taux de présence global : ${_globalRate}% sur ${(appData.sessions||[]).length} séance(s)` });
  if (_overdueUsers.length > 0)
    alerts.push({ color:'#EF4444', text:`${_overdueUsers.length} auditeur(s) en retard de paiement.` });
  if (!users.length)   alerts.push({ color:'#EF4444', text:'Aucun étudiant inscrit sur la plateforme.' });
  if (!courses.length) alerts.push({ color:'#F59E0B', text:'Aucun cours ajouté — commencez par l\'onglet Cours.' });
  if (!pdfs)           alerts.push({ color:'#F59E0B', text:'Aucun cours n\'a de PDF associé.' });
  if (!exercisesCount) alerts.push({ color:'#F59E0B', text:'Aucun exercice n\'a été créé.' });
  if (!totalVideos)    alerts.push({ color:'#F59E0B', text:'Aucune capsule vidéo disponible.' });
  if (users.length > 0 && courses.length > 0 && exercisesCount > 0 && _activeSess.length === 0)
    alerts.push({ color:'#10B981', text:`Plateforme opérationnelle — ${users.length} étudiant(s) actif(s).` });
  const alertsHtml = alerts.map(a => `<div class="adw-alert-row">
    <div class="adw-alert-dot" style="background:${a.color};"></div>
    <div class="adw-alert-text">${a.text}</div>
  </div>`).join('');
  const alertsBody = document.getElementById('adw-alerts-body');
  if (alertsBody) alertsBody.innerHTML = alertsHtml || '<div style="color:#94A3B8;font-size:0.82rem;">Aucune alerte.</div>';

  // ── Widget 3 : Dernières connexions ─────────────────────────────
  const stuBody = document.getElementById('adw-students-body');
  if (stuBody) {
    if (!users.length) {
      stuBody.innerHTML = '<div style="color:#94A3B8;font-size:0.82rem;">Aucun étudiant inscrit.</div>';
    } else {
      const sorted = [...users].sort((a, b) => (b.lastLogin || 0) - (a.lastLogin || 0)).slice(0, 6);
      stuBody.innerHTML = sorted.map(u => {
        const date = u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('fr-FR') : 'jamais';
        return `<div class="adw-student-row">
          <div class="adw-avatar">${u.name.substring(0,2).toUpperCase()}</div>
          <div class="adw-stu-name">${u.name}</div>
          <div class="adw-stu-date"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${date}</div>
        </div>`;
      }).join('');
    }
  }

  // ── Widget 4 : Répartition du contenu ─────────────────────────
  const total = pdfs + totalVideos + exercisesCount;
  const contentBody = document.getElementById('adw-content-body');
  if (contentBody) {
    if (!total) {
      contentBody.innerHTML = '<div style="color:#94A3B8;font-size:0.82rem;">Aucun contenu ajouté.</div>';
    } else {
      const types = [
        { label:'PDF',       val:pdfs,           color:'#3B82F6', icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>` },
        { label:'Vidéos',    val:totalVideos,     color:'#8B5CF6', icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>` },
        { label:'Exercices', val:exercisesCount,  color:'#F59E0B', icon:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>` },
      ];
      contentBody.innerHTML = types.map(t => {
        const pct = total ? Math.round((t.val / total) * 100) : 0;
        return `<div class="adw-tour-row">
          <div class="adw-tour-label">${t.icon} ${t.label}</div>
          <div class="adw-tour-bar"><div class="adw-tour-fill" style="width:${pct}%;background:${t.color};"></div></div>
          <div class="adw-tour-count" style="min-width:40px;">${t.val} <span style="color:var(--text-muted);font-size:0.65rem;">(${pct}%)</span></div>
        </div>`;
      }).join('');
    }
  }

  // ── Widget 5 : Séances récentes ──────────────────────────────
  const sessBody = document.getElementById('adw-sessions-body');
  if (sessBody) {
    const sessions = (appData.sessions || []).slice().reverse().slice(0, 5);
    if (!sessions.length) {
      sessBody.innerHTML = '<div style="color:#94A3B8;font-size:0.82rem;">Aucune séance enregistrée — lancez la première depuis l\'espace Formateur.</div>';
    } else {
      sessBody.innerHTML = sessions.map(s => {
        const att = Object.values(s.attendees);
        const pres = att.filter(a => a.status === 'present').length;
        const total = att.length;
        const rate = total > 0 ? Math.round(pres / total * 100) : 0;
        const rateColor = rate >= 80 ? '#065F46' : rate >= 50 ? '#92400E' : '#7F1D1D';
        const rateBg    = rate >= 80 ? '#D1FAE5' : rate >= 50 ? '#FEF3C7' : '#FEE2E2';
        const dot = s.status === 'active'
          ? '<span style="width:8px;height:8px;border-radius:50%;background:#22C55E;display:inline-block;box-shadow:0 0 0 3px rgba(34,197,94,0.2);"></span>'
          : '<span style="width:8px;height:8px;border-radius:50%;background:#94A3B8;display:inline-block;"></span>';
        return `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.55rem 0;border-bottom:1px solid #F1F5F9;">
          ${dot}
          <span style="font-weight:700;font-size:0.84rem;color:#1E293B;flex:1;">${s.label}</span>
          <span style="font-size:0.72rem;color:#64748B;">${s.trainerName}</span>
          <span style="font-size:0.72rem;color:#64748B;">${s.promotionName}</span>
          <span style="font-size:0.72rem;color:#64748B;">${new Date(s.startedAt).toLocaleDateString('fr-FR')}</span>
          <span style="background:${rateBg};color:${rateColor};border-radius:50px;padding:0.1rem 0.5rem;font-size:0.7rem;font-weight:800;">${pres}/${total} · ${rate}%</span>
        </div>`;
      }).join('');
    }
  }
}

// ─── Cours : type de contenu PDF/Vidéo ───────────────────────────────────────
function selectCourseContentType(type) {
  document.getElementById('course-content-type').value = type;
  document.getElementById('course-type-pdf-btn').classList.toggle('active', type === 'pdf');
  document.getElementById('course-type-video-btn').classList.toggle('active', type === 'video');
  document.getElementById('course-pdf-zone').style.display = type === 'pdf' ? '' : 'none';
  document.getElementById('course-video-zone').style.display = type === 'video' ? '' : 'none';
}

function selectCourseTourSimple(tourId) {
  document.getElementById('course-tour').value = tourId;
  document.querySelectorAll('#course-tour-btns .stour-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.stour === tourId);
  });
  renderCourseMatiereSelect();
}

function renderCourseMatiereSelect() {
  const select = document.getElementById('course-matiere-select');
  if (!select) return;
  const tourId = document.getElementById('course-tour').value || 'tour1';
  const courses = getCoursesByTour(tourId);
  const currentVal = select.value;
  select.innerHTML = '<option value="">— Sélectionnez ou créez une matière —</option>';
  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = (c.icon || '📚') + ' ' + c.name;
    select.appendChild(opt);
  });
  const newOpt = document.createElement('option');
  newOpt.value = '__new__';
  newOpt.textContent = '➕ Nouvelle matière…';
  select.appendChild(newOpt);
  if (currentVal && (courses.find(c => c.id === currentVal) || currentVal === '__new__')) {
    select.value = currentVal;
    onCourseMatiereChange();
  }
}

function onCourseMatiereChange() {
  const select = document.getElementById('course-matiere-select');
  const nameInput = document.getElementById('course-name');
  const editId = document.getElementById('course-edit-id');
  const val = select.value;
  if (val === '__new__') {
    nameInput.style.display = '';
    nameInput.value = '';
    nameInput.focus();
    editId.value = '';
    const _cft1 = document.getElementById('course-modal-title'); if (_cft1) _cft1.textContent = 'Ajouter un cours';
    document.getElementById('pdf-upload-label').textContent = 'Cliquer pour uploader un PDF';
    document.getElementById('pdf-current-info').style.display = 'none';
    adminState.pendingPdf = null;
    adminState.pendingCourseVideo = null;
  } else if (val) {
    const c = getCourse(val);
    nameInput.style.display = 'none';
    nameInput.value = c ? c.name : '';
    editId.value = val;
    const _cft2 = document.getElementById('course-modal-title'); if (_cft2) _cft2.textContent = 'Modifier le cours';
    if (c) {
      const ct = c.contentType || 'pdf';
      selectCourseContentType(ct);
      if (c.pdfName) {
        document.getElementById('pdf-upload-label').textContent = '📄 ' + c.pdfName;
        document.getElementById('pdf-current-info').style.display = 'block';
        document.getElementById('pdf-current-info').textContent = 'PDF actuel : ' + c.pdfName + ' — sélectionnez un fichier pour le remplacer';
      } else if (c.videoFileName) {
        document.getElementById('course-video-upload-label').textContent = '🎬 ' + c.videoFileName;
        document.getElementById('course-video-file-info').classList.add('show');
        document.getElementById('course-video-file-name').textContent = c.videoFileName;
      }
    }
  } else {
    nameInput.style.display = 'none';
    nameInput.value = '';
    editId.value = '';
  }
}

function handleCourseVideoSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) { showNotif('❌ Ce fichier n\'est pas une vidéo', 'error'); return; }
  if (file.size > 500 * 1024 * 1024) { showNotif('❌ Fichier trop lourd (max 500 Mo)', 'error'); return; }
  adminState.pendingCourseVideo = file;
  adminState.pendingCourseVideoName = file.name;
  const zone = document.getElementById('course-video-upload-zone');
  if (zone) zone.classList.add('has-file');
  document.getElementById('course-video-upload-label').textContent = '✅ Vidéo sélectionnée';
  document.getElementById('course-video-file-name').textContent = file.name;
  document.getElementById('course-video-file-size').textContent = formatFileSize(file.size);
  document.getElementById('course-video-file-info').classList.add('show');
  const nameInput = document.getElementById('course-name');
  if (nameInput && !nameInput.value.trim()) {
    nameInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }
}

function clearCourseVideoFile() {
  adminState.pendingCourseVideo = null;
  adminState.pendingCourseVideoName = null;
  const input = document.getElementById('course-video-file-input');
  if (input) input.value = '';
  const zone = document.getElementById('course-video-upload-zone');
  if (zone) zone.classList.remove('has-file');
  document.getElementById('course-video-upload-label').textContent = 'Cliquer pour choisir une vidéo';
  document.getElementById('course-video-file-info').classList.remove('show');
}

// ─── Vidéo : matière chips ─────────────────────────────────────────────────
function selectVideoTourSimple(tourId) {
  document.getElementById('video-tour-selected').value = tourId;
  document.querySelectorAll('#video-tour-btns .stour-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.vtour === tourId);
  });
  renderVideoMatiereChips(tourId);
}

function renderVideoMatiereChips(tourId) {
  const chips = document.getElementById('video-matiere-chips');
  if (!chips) return;
  const tid = tourId || document.getElementById('video-tour-selected')?.value || 'tour1';
  const courses = getCoursesByTour(tid);
  if (!courses.length) {
    chips.innerHTML = '<span style="color:#aaa;font-size:0.82rem;">Créez d\'abord un cours pour ce tour.</span>';
    document.getElementById('video-course').value = '';
    return;
  }
  const currentId = document.getElementById('video-course').value;
  const selected = currentId && courses.find(c => c.id === currentId) ? currentId : courses[0].id;
  document.getElementById('video-course').value = selected;
  chips.innerHTML = courses.map(c =>
    `<button type="button" class="stour-btn ${selected === c.id ? 'active' : ''}"
      style="font-size:0.78rem;padding:0.4rem 0.7rem;" data-vmatiere="${c.id}"
      onclick="selectVideoMatiere('${c.id}')">
      ${c.icon || '📚'} ${c.name}
    </button>`
  ).join('');
}

function selectVideoMatiere(courseId) {
  document.getElementById('video-course').value = courseId;
  document.querySelectorAll('#video-matiere-chips .stour-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.vmatiere === courseId);
  });
}

// ─── Exercice : nouvelles fonctions ──────────────────────────────────────────
function selectExerciseContentType(type) {
  document.getElementById('exercise-content-type').value = type;
  document.getElementById('ex-type-pdf-btn').classList.toggle('active', type === 'pdf');
  document.getElementById('ex-type-video-btn').classList.toggle('active', type === 'video');
  const intBtn = document.getElementById('ex-type-interactive-btn');
  if (intBtn) {
    intBtn.style.background = type === 'interactive' ? '#EEF2FF' : '#fff';
    intBtn.style.borderColor = type === 'interactive' ? '#7C3AED' : '#E2E8F0';
    intBtn.style.color = type === 'interactive' ? '#5B21B6' : '#64748B';
    intBtn.style.fontWeight = type === 'interactive' ? '700' : '600';
  }
  document.getElementById('exercise-pdf-zone').style.display = type === 'pdf' ? '' : 'none';
  document.getElementById('exercise-video-zone').style.display = type === 'video' ? '' : 'none';
  const intZone = document.getElementById('exercise-interactive-zone');
  if (intZone) intZone.style.display = type === 'interactive' ? '' : 'none';
}

function selectExerciseTour(tourId) {
  document.getElementById('exercise-tour').value = tourId;
  document.querySelectorAll('#exercise-tour-btns .stour-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.extour === tourId);
  });
}

function renderExerciseMatiereSelect() {
  const select = document.getElementById('exercise-matiere-select');
  if (!select) return;
  const currentVal = adminState.selectedExerciseCourseId || '';
  select.innerHTML = '<option value="">— Sélectionnez la matière —</option>';
  if (!appData.courses.length) {
    const opt = document.createElement('option');
    opt.disabled = true;
    opt.textContent = 'Aucune matière — créez d\'abord un cours';
    select.appendChild(opt);
    return;
  }
  appData.courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = (c.icon || '📚') + ' ' + c.name;
    if (currentVal === c.id) opt.selected = true;
    select.appendChild(opt);
  });
}

function onExerciseMatiereChange() {
  const val = document.getElementById('exercise-matiere-select').value;
  adminState.selectedExerciseCourseId = val || null;
}

function renderExerciseMatiereChips() { renderExerciseMatiereSelect(); }

function handleExercisePdfSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') { showNotif('❌ Seuls les fichiers PDF sont acceptés', 'error'); return; }
  if (file.size > 15 * 1024 * 1024) { showNotif('❌ PDF trop volumineux (max 15 Mo)', 'error'); return; }
  adminState.pendingExercisePdf = file;
  adminState.pendingExercisePdfName = file.name;
  document.getElementById('exercise-pdf-upload-label').textContent = '📄 ' + file.name;
  document.getElementById('exercise-pdf-current-info').style.display = 'block';
  document.getElementById('exercise-pdf-current-info').textContent = 'Fichier sélectionné : ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)';
  const nameInput = document.getElementById('exercise-name');
  if (nameInput && !nameInput.value.trim()) {
    nameInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }
}

function handleExerciseVideoSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) { showNotif('❌ Ce fichier n\'est pas une vidéo', 'error'); return; }
  if (file.size > 500 * 1024 * 1024) { showNotif('❌ Fichier trop lourd (max 500 Mo)', 'error'); return; }
  adminState.pendingExerciseVideo = file;
  adminState.pendingExerciseVideoName = file.name;
  const zone = document.getElementById('exercise-video-upload-zone');
  if (zone) zone.classList.add('has-file');
  document.getElementById('exercise-video-upload-label').textContent = '✅ Vidéo sélectionnée';
  document.getElementById('exercise-video-file-name').textContent = file.name;
  document.getElementById('exercise-video-file-size').textContent = formatFileSize(file.size);
  document.getElementById('exercise-video-file-info').classList.add('show');
  const nameInput = document.getElementById('exercise-name');
  if (nameInput && !nameInput.value.trim()) {
    nameInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }
}

function clearExerciseVideoFile() {
  adminState.pendingExerciseVideo = null;
  adminState.pendingExerciseVideoName = null;
  const input = document.getElementById('exercise-video-file-input');
  if (input) input.value = '';
  const zone = document.getElementById('exercise-video-upload-zone');
  if (zone) zone.classList.remove('has-file');
  document.getElementById('exercise-video-upload-label').textContent = 'Cliquer pour choisir une vidéo';
  document.getElementById('exercise-video-file-info').classList.remove('show');
}

function renderAdminCoursesList(filteredList) {
  const list = document.getElementById('admin-courses-list');
  const badge = document.getElementById('courses-count-badge');
  if (!list) return;
  const allCourses = filteredList !== undefined ? filteredList : appData.courses;
  if (badge) badge.textContent = allCourses.length;

  if (!allCourses.length) {
    const isEmpty = !filteredList && !appData.courses.length;
    list.innerHTML = `<div style="text-align:center;padding:3rem 1rem;background:#F8FAFC;border:1.5px dashed #E2E8F0;border-radius:16px;">
      <div style="width:52px;height:52px;border-radius:14px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      </div>
      <div style="font-weight:700;color:#334155;font-size:0.9rem;margin-bottom:0.3rem;">${isEmpty ? 'Aucun cours ajouté' : 'Aucun résultat'}</div>
      <div style="color:#94A3B8;font-size:0.8rem;">${isEmpty ? 'Cliquez sur « Ajouter un cours » pour commencer.' : 'Essayez un autre terme.'}</div>
    </div>`;
    return;
  }

  const tourConfigs = [
    { id:'tour1', label:'1er Tour',   sub:'Leçons & QCM',    grad:'linear-gradient(135deg,#0D47A1,#1976D2)' },
    { id:'tour2', label:'2ème Tour',  sub:'Rédaction',       grad:'linear-gradient(135deg,#00897B,#00C853)' },
    { id:'tour3', label:'3ème Tour',  sub:'Capsules Vidéo',  grad:'linear-gradient(135deg,#C62828,#E53935)' },
  ];

  list.innerHTML = `<div style="display:flex;gap:1.1rem;align-items:flex-start;flex-wrap:wrap;">` +
    tourConfigs.map(tc => {
      const courses = allCourses.filter(c => (c.tourId || 'tour1') === tc.id);
      const items = courses.map(c => {
        const exCount = 0;
        const qCount = countQuestions(c.id);
        const fileInfo = c.pdfName
          ? `<span class="pdf-badge" style="display:inline-flex;align-items:center;gap:0.25rem;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${c.pdfName}</span>`
          : c.videoFileName
            ? `<span class="pdf-badge" style="display:inline-flex;align-items:center;gap:0.25rem;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> ${c.videoFileName}</span>`
            : '<span style="color:var(--text-muted);font-size:0.75rem;">Pas de fichier</span>';
        return `<div class="admin-item">
          <span class="admin-item-icon">${iconHTML(c.icon, 20)}</span>
          <div class="admin-item-info">
            <div class="admin-item-title">${c.name}</div>
            <div class="admin-item-meta">${exCount} ex. · ${qCount} QCM · ${fileInfo}</div>
          </div>
          <div class="admin-item-actions">
            <button class="btn-icon" onclick="editCourse('${c.id}')" title="Modifier" style="display:flex;align-items:center;justify-content:center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn-icon danger" onclick="deleteCourse('${c.id}')" title="Supprimer" style="display:flex;align-items:center;justify-content:center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
          </div>
        </div>`;
      }).join('');

      return `<div style="flex:1;min-width:240px;background:#fff;border-radius:18px;border:1px solid #E0E0E0;box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:hidden;display:flex;flex-direction:column;">
        <div style="background:${tc.grad};padding:1rem 1.2rem;display:flex;align-items:center;gap:0.75rem;">
          <div style="flex:1;">
            <div style="font-weight:800;font-size:0.95rem;color:#fff;">${tc.label}</div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.75);">${tc.sub}</div>
          </div>
          <div style="background:rgba(255,255,255,0.25);color:#fff;font-weight:800;font-size:0.85rem;border-radius:50px;padding:0.2rem 0.65rem;">${courses.length}</div>
        </div>
        <div style="padding:0.75rem;display:flex;flex-direction:column;gap:0.5rem;max-height:500px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#E0E0E0 transparent;">
          ${items || '<p style="color:#aaa;font-size:0.82rem;text-align:center;padding:1rem 0;">Aucun cours dans ce tour</p>'}
        </div>
      </div>`;
    }).join('') + `</div>`;
}

function handlePdfSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') { showNotif('❌ Seuls les fichiers PDF sont acceptés', 'error'); return; }
  if (file.size > 15 * 1024 * 1024) { showNotif('❌ PDF trop volumineux (max 15 Mo)', 'error'); return; }
  adminState.pendingPdf = file;
  adminState.pendingPdfName = file.name;
  document.getElementById('pdf-upload-label').textContent = '📄 ' + file.name;
  document.getElementById('pdf-current-info').style.display = 'block';
  document.getElementById('pdf-current-info').textContent = 'Nouveau fichier sélectionné : ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)';
}

function resetCourseForm() {
  document.getElementById('course-edit-id').value = '';
  document.getElementById('course-tour').value = 'tour1';
  document.getElementById('course-name').value = '';
  document.getElementById('course-desc').value = '';
  document.getElementById('course-icon').value = '📖';
  document.getElementById('course-color').value = 'culture';
  const _cft3 = document.getElementById('course-modal-title'); if (_cft3) _cft3.textContent = 'Ajouter un cours';
  const _pul = document.getElementById('pdf-upload-label'); if (_pul) _pul.textContent = 'Cliquer pour uploader un PDF';
  document.getElementById('pdf-current-info').style.display = 'none';
  document.getElementById('course-pdf-input').value = '';
  adminState.pendingPdf = null;
  adminState.pendingPdfName = null;
  adminState.pendingCourseVideo = null;
  adminState.pendingCourseVideoName = null;
  selectCourseContentType('pdf');
  selectCourseTourSimple('tour1');
  const nameInput = document.getElementById('course-name');
  if (nameInput) nameInput.style.display = 'none';
  const matiereSelect = document.getElementById('course-matiere-select');
  if (matiereSelect) matiereSelect.value = '';
}

async function saveCourse() {
  const contentType = document.getElementById('course-content-type').value || 'pdf';
  const tourId = document.getElementById('course-tour').value || 'tour1';
  const name = document.getElementById('course-name').value.trim();
  const desc = document.getElementById('course-desc').value.trim();
  const icon = contentType === 'video' ? '🎬' : (document.getElementById('course-icon').value.trim() || '📚');
  const color = document.getElementById('course-color').value;
  const editId = document.getElementById('course-edit-id').value;

  if (!name) { showNotif('❌ Le titre / nom de matière est requis', 'error'); return; }

  let courseId;
  if (editId) {
    const course = getCourse(editId);
    if (course) { course.name = name; course.desc = desc; course.icon = icon; course.color = color; course.tourId = tourId; course.contentType = contentType; }
    courseId = editId;
    showNotif('✅ Cours modifié', 'success');
  } else {
    courseId = slugify(name);
    if (appData.courses.some(c => c.id === courseId)) courseId = genId('cours');
    appData.courses.push({ id: courseId, tourId, name, desc, icon, color, contentType, pdfName: null });
    if (!appData.questions[courseId]) appData.questions[courseId] = [];
    showNotif('✅ Cours ajouté', 'success');
  }

  if (contentType === 'pdf' && adminState.pendingPdf) {
    try {
      await savePdf(courseId, adminState.pendingPdf, adminState.pendingPdfName);
      const course = getCourse(courseId);
      if (course) course.pdfName = adminState.pendingPdfName;
      showNotif('📄 PDF enregistré', 'success');
    } catch (e) {
      showNotif('❌ Erreur enregistrement PDF', 'error');
    }
  } else if (contentType === 'video' && adminState.pendingCourseVideo) {
    try {
      const videoId = courseId + '_vid';
      showNotif('⏳ Enregistrement vidéo…', '');
      await saveVideoFile(videoId, adminState.pendingCourseVideo, adminState.pendingCourseVideoName);
      const videos = loadVideos();
      const existingIdx = videos.findIndex(v => v.id === videoId);
      const videoEntry = { id: videoId, courseId, title: name, fileName: adminState.pendingCourseVideoName, fileSize: adminState.pendingCourseVideo.size, views: 0, createdAt: Date.now(), isCourseVideo: true };
      if (existingIdx >= 0) videos[existingIdx] = { ...videos[existingIdx], ...videoEntry };
      else videos.push(videoEntry);
      saveVideos(videos);
      const course = getCourse(courseId);
      if (course) course.videoFileName = adminState.pendingCourseVideoName;
      showNotif('🎬 Vidéo enregistrée', 'success');
    } catch (e) {
      showNotif('❌ Erreur enregistrement vidéo', 'error');
    }
  }

  saveAppData();
  resetCourseForm();
  closeCourseModal();
  const csi = document.getElementById('course-search-input'); if (csi) csi.value = '';
  const csc = document.getElementById('course-search-count'); if (csc) csc.style.display = 'none';
  renderAdminCoursesList();
  renderStudentVideos();
}

function editCourse(id) {
  const c = getCourse(id);
  if (!c) return;
  switchAdminView('courses');
  openCourseModal(true);
  document.getElementById('course-edit-id').value = c.id;
  document.getElementById('course-tour').value = c.tourId || 'tour1';
  document.getElementById('course-name').value = c.name;
  document.getElementById('course-desc').value = c.desc || '';
  document.getElementById('course-icon').value = c.icon;
  document.getElementById('course-color').value = c.color;
  const _cft4 = document.getElementById('course-modal-title'); if (_cft4) _cft4.textContent = 'Modifier le cours';
  const ct = c.contentType || 'pdf';
  selectCourseTourSimple(c.tourId || 'tour1');
  selectCourseContentType(ct);
  const cSel = document.getElementById('course-matiere-select');
  if (cSel) { cSel.value = c.id; }
  const nameInput = document.getElementById('course-name');
  if (nameInput) { nameInput.value = c.name; nameInput.style.display = 'none'; }
  if (c.pdfName) {
    document.getElementById('pdf-upload-label').textContent = '📄 ' + c.pdfName;
    document.getElementById('pdf-current-info').style.display = 'block';
    document.getElementById('pdf-current-info').textContent = 'PDF actuel : ' + c.pdfName + ' — sélectionnez un fichier pour le remplacer';
  }
  if (c.videoFileName) {
    document.getElementById('course-video-upload-label').textContent = '🎬 ' + c.videoFileName;
    document.getElementById('course-video-file-info').classList.add('show');
    document.getElementById('course-video-file-name').textContent = c.videoFileName;
  }
  adminState.pendingPdf = null;
  adminState.pendingCourseVideo = null;
  adminState.pendingCourseVideoName = null;
}

async function deleteCourse(id) {
  const c = getCourse(id);
  if (!c) return;
  const ok = await confirmDialog('Supprimer le cours « ' + c.name + ' » ?');
  if (!ok) return;
  appData.courses = appData.courses.filter(x => x.id !== id);
  delete appData.questions[id];
  try { await deletePdf(id); } catch (e) {}
  if (state.selectedCat === id) state.selectedCat = appData.courses[0]?.id || 'mixte';
  if (adminState.selectedCourseId === id) adminState.selectedCourseId = appData.courses[0]?.id || null;
  saveAppData();
  showNotif('🗑️ Cours supprimé', '');
}

function renderAdminCourseChips() {
  const chips = document.getElementById('admin-course-chips');
  if (!chips) return;
  if (!appData.courses.length) {
    chips.innerHTML = '<div class="empty-state">Créez d\'abord un cours.</div>';
    /* exercise-form-wrap moved to modal */
    return;
  }
  /* exercise-form-wrap moved to modal */
  if (!adminState.selectedCourseId || !getCourse(adminState.selectedCourseId)) {
    adminState.selectedCourseId = appData.courses[0].id;
  }
  chips.innerHTML = appData.courses.map(c => `
    <button class="course-select-chip ${adminState.selectedCourseId === c.id ? 'active' : ''}" onclick="selectAdminCourse('${c.id}')" style="display:inline-flex;align-items:center;gap:4px;">
      ${iconHTML(c.icon, 13)} ${c.name}
    </button>
  `).join('');
}

function selectAdminCourse(id) {
  adminState.selectedCourseId = id;
  resetExerciseForm();
  renderAdminCourseChips();
  renderAdminExercisesList();
}

function renderAdminExercisesList(filteredList) {
  const list = document.getElementById('admin-exercises-list');
  const badge = document.getElementById('exercises-count-badge');
  if (!list) return;
  const allTypes = filteredList !== undefined ? filteredList : (appData.exerciseTypes || []);
  if (badge) badge.textContent = allTypes.length;

  if (!allTypes.length) {
    const isEmpty = !filteredList && !(appData.exerciseTypes || []).length;
    list.innerHTML = `<div style="text-align:center;padding:3rem 1rem;background:#F8FAFC;border:1.5px dashed #E2E8F0;border-radius:16px;">
      <div style="width:52px;height:52px;border-radius:14px;background:#FFF7ED;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
      </div>
      <div style="font-weight:700;color:#334155;font-size:0.9rem;margin-bottom:0.3rem;">${isEmpty ? 'Aucun exercice ajouté' : 'Aucun résultat'}</div>
      <div style="color:#94A3B8;font-size:0.8rem;">${isEmpty ? 'Cliquez sur « Ajouter un exercice » pour commencer.' : 'Essayez un autre terme.'}</div>
    </div>`;
    return;
  }

  const tourConfigs = [
    { id:'tour1', label:'1er Tour',  sub:'Leçons & QCM',   grad:'linear-gradient(135deg,#0D47A1,#1976D2)' },
    { id:'tour2', label:'2ème Tour', sub:'Rédaction',      grad:'linear-gradient(135deg,#00897B,#00C853)' },
    { id:'tour3', label:'3ème Tour', sub:'Oral & Vidéo',   grad:'linear-gradient(135deg,#C62828,#E53935)' },
  ];

  list.innerHTML = `<div style="display:flex;gap:1.1rem;align-items:flex-start;flex-wrap:wrap;">` +
    tourConfigs.map(tc => {
      const types = allTypes.filter(t => (t.tourId || 'tour1') === tc.id);
      const items = types.map(t => {
        const ct = t.contentType || 'pdf';
        const fileInfo = t.pdfName
          ? `<span style="display:inline-flex;align-items:center;gap:0.25rem;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> ${t.pdfName}</span>`
          : t.videoFileName
            ? `<span style="display:inline-flex;align-items:center;gap:0.25rem;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> ${t.videoFileName}</span>`
            : '<span style="color:var(--text-muted);font-size:0.75rem;">Pas de fichier</span>';
        const typeIcon = ct === 'video'
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
        return `<div class="admin-item">
          <span class="admin-item-icon" style="font-size:1.3rem;">${typeIcon}</span>
          <div class="admin-item-info">
            <div class="admin-item-title">${t.name}</div>
            <div class="admin-item-meta">${fileInfo}</div>
          </div>
          <div class="admin-item-actions">
            ${(t.pdfName || t.videoFileName) ? `<button class="btn-icon" onclick="adminPreviewExercise('${t.id}')" title="Aperçu" style="display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>` : ''}
            <button class="btn-icon" onclick="editExerciseType('${t.id}')" title="Modifier" style="display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
            <button class="btn-icon danger" onclick="deleteExerciseType('${t.id}')" title="Supprimer" style="display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
          </div>
        </div>`;
      }).join('');

      return `<div style="flex:1;min-width:240px;background:#fff;border-radius:18px;border:1px solid #E0E0E0;box-shadow:0 2px 12px rgba(0,0,0,0.06);overflow:hidden;display:flex;flex-direction:column;">
        <div style="background:${tc.grad};padding:1rem 1.2rem;display:flex;align-items:center;gap:0.75rem;">
          <div style="flex:1;">
            <div style="font-weight:800;font-size:0.95rem;color:#fff;">${tc.label}</div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.75);">${tc.sub}</div>
          </div>
          <div style="background:rgba(255,255,255,0.25);color:#fff;font-weight:800;font-size:0.85rem;border-radius:50px;padding:0.2rem 0.65rem;">${types.length}</div>
        </div>
        <div style="padding:0.75rem;display:flex;flex-direction:column;gap:0.5rem;max-height:500px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#E0E0E0 transparent;">
          ${items || '<p style="color:#aaa;font-size:0.82rem;text-align:center;padding:1rem 0;">Aucun exercice dans ce tour</p>'}
        </div>
      </div>`;
    }).join('') + `</div>`;
}

function resetExerciseForm() {
  document.getElementById('exercise-edit-id').value = '';
  document.getElementById('exercise-name').value = '';
  document.getElementById('exercise-content-type').value = 'pdf';
  document.getElementById('exercise-tour').value = 'tour1';
  const _eft1 = document.getElementById('exercise-modal-title'); if (_eft1) _eft1.textContent = 'Ajouter un exercice';
  adminState.selectedExerciseCourseId = null;
  adminState.pendingExercisePdf = null;
  adminState.pendingExercisePdfName = null;
  adminState.pendingExerciseVideo = null;
  adminState.pendingExerciseVideoName = null;
  adminInteractiveQs = [];
  renderAdminInteractiveQList();
  const adminIqText = document.getElementById('admin-iq-text'); if (adminIqText) adminIqText.value = '';
  [0,1,2,3].forEach(i => { const el = document.getElementById('admin-iq-opt'+i); if (el) el.value = ''; });
  const adminIqExp = document.getElementById('admin-iq-exp'); if (adminIqExp) adminIqExp.value = '';
  selectExerciseContentType('pdf');
  selectExerciseTour('tour1');
  renderExerciseMatiereSelect();
  const exSelect = document.getElementById('exercise-matiere-select');
  if (exSelect) exSelect.value = '';
  const pdfLabel = document.getElementById('exercise-pdf-upload-label');
  if (pdfLabel) pdfLabel.textContent = 'Cliquer pour uploader un PDF';
  const pdfInfo = document.getElementById('exercise-pdf-current-info');
  if (pdfInfo) pdfInfo.style.display = 'none';
  const pdfInput = document.getElementById('exercise-pdf-input');
  if (pdfInput) pdfInput.value = '';
  clearExerciseVideoFile();
}

async function saveExerciseType() {
  const name = document.getElementById('exercise-name').value.trim();
  const contentType = document.getElementById('exercise-content-type').value || 'pdf';
  const tourId = document.getElementById('exercise-tour').value || 'tour1';
  const icon = contentType === 'video' ? '🎬' : contentType === 'interactive' ? '🎯' : '📄';
  const editId = document.getElementById('exercise-edit-id').value;

  if (!name) { showNotif('❌ Le titre de l\'exercice est requis', 'error'); return; }
  if (contentType === 'interactive' && adminInteractiveQs.length === 0) {
    showNotif('❌ Ajoutez au moins une question à l\'exercice interactif', 'error'); return;
  }

  let exId;
  if (editId) {
    exId = editId;
    const ex = appData.exerciseTypes.find(e => e.id === editId);
    if (ex) {
      ex.name = name; ex.icon = icon; ex.tourId = tourId; ex.contentType = contentType;
      if (contentType === 'interactive') ex.questions = adminInteractiveQs.slice();
    }
    showNotif('✅ Exercice modifié', 'success');
  } else {
    exId = genId('ex');
    const newEx = { id: exId, tourId, name, icon, contentType, desc: '', pdfName: null, createdAt: Date.now() };
    if (contentType === 'interactive') newEx.questions = adminInteractiveQs.slice();
    appData.exerciseTypes.push(newEx);
    showNotif('✅ Exercice ajouté', 'success');
  }

  const ex = appData.exerciseTypes.find(e => e.id === exId);

  if (contentType === 'pdf' && adminState.pendingExercisePdf) {
    try {
      await savePdf(exId, adminState.pendingExercisePdf, adminState.pendingExercisePdfName);
      if (ex) ex.pdfName = adminState.pendingExercisePdfName;
      showNotif('📄 PDF enregistré', 'success');
    } catch(e) { showNotif('❌ Erreur enregistrement PDF', 'error'); }
  } else if (contentType === 'video' && adminState.pendingExerciseVideo) {
    try {
      const videoId = exId + '_vid';
      showNotif('⏳ Enregistrement vidéo…', '');
      await saveVideoFile(videoId, adminState.pendingExerciseVideo, adminState.pendingExerciseVideoName);
      const videos = loadVideos();
      const videoEntry = { id: videoId, exerciseId: exId, title: name, fileName: adminState.pendingExerciseVideoName, fileSize: adminState.pendingExerciseVideo.size, views: 0, createdAt: Date.now(), isExerciseVideo: true };
      const idx = videos.findIndex(v => v.id === videoId);
      if (idx >= 0) videos[idx] = { ...videos[idx], ...videoEntry };
      else videos.push(videoEntry);
      saveVideos(videos);
      if (ex) ex.videoFileName = adminState.pendingExerciseVideoName;
      showNotif('🎬 Vidéo enregistrée', 'success');
    } catch(e) { showNotif('❌ Erreur enregistrement vidéo', 'error'); }
  }

  saveAppData();
  resetExerciseForm();
  closeExerciseModal();
  const esi = document.getElementById('exercise-search-input'); if (esi) esi.value = '';
  const esc = document.getElementById('exercise-search-count'); if (esc) esc.style.display = 'none';
  renderAdminExercisesList();
  renderExerciseTypesSelector();
}

function editExerciseType(id) {
  const ex = appData.exerciseTypes.find(e => e.id === id);
  if (!ex) return;
  switchAdminView('exercises');
  openExerciseModal(true);
  document.getElementById('exercise-edit-id').value = ex.id;
  document.getElementById('exercise-name').value = ex.name;
  const _eft2 = document.getElementById('exercise-modal-title'); if (_eft2) _eft2.textContent = 'Modifier l\'exercice';
  const ct = ex.contentType || 'pdf';
  document.getElementById('exercise-content-type').value = ct;
  selectExerciseContentType(ct);
  const tourId = ex.tourId || 'tour1';
  document.getElementById('exercise-tour').value = tourId;
  selectExerciseTour(tourId);
  if (ex.pdfName) {
    document.getElementById('exercise-pdf-upload-label').textContent = '📄 ' + ex.pdfName;
    document.getElementById('exercise-pdf-current-info').style.display = 'block';
    document.getElementById('exercise-pdf-current-info').textContent = 'PDF actuel : ' + ex.pdfName;
  }
}

function deleteExerciseType(id) {
  const ex = appData.exerciseTypes.find(e => e.id === id);
  if (!ex) return;
  (async () => {
    const ok = await confirmDialog('Supprimer le type « ' + ex.name + ' » ?');
    if (!ok) return;
    appData.exerciseTypes = appData.exerciseTypes.filter(x => x.id !== id);
    if (state.selectedExerciseType === id) state.selectedExerciseType = null;
    saveAppData();
    showNotif('🗑️ Type supprimé', '');
  })();
}

function selectExerciseType(id) {
  state.selectedExerciseType = id;
  renderExerciseTypesSelector();
}

// Leaderboard data
const LEADERBOARD = [
  { name:"Aminata K.", cat:"Culture Générale", pts:2840, av:"AK", col:"#C9A84C" },
  { name:"Kofi M.", cat:"Logique Numérique", pts:2610, av:"KM", col:"#3B82F6" },
  { name:"Fatou D.", cat:"Anglais", pts:2450, av:"FD", col:"#E74C3C" },
  { name:"Yao B.", cat:"Aptitude Verbale", pts:2200, av:"YB", col:"#F59E0B" },
  { name:"Grace O.", cat:"Logique Verbale", pts:2100, av:"GO", col:"#2ECC71" },
  { name:"Ibrahim S.", cat:"Culture Générale", pts:1980, av:"IS", col:"#C9A84C" },
  { name:"Mariam T.", cat:"Numérique", pts:1850, av:"MT", col:"#3B82F6" },
];

