// ══ Accès personnel ══
function openAccessModal() {
  const el = document.getElementById('access-overlay');
  if (el) el.style.display = 'flex';
}
function closeAccessModal(e) {
  if (e && e.target !== document.getElementById('access-overlay')) return;
  const el = document.getElementById('access-overlay');
  if (el) el.style.display = 'none';
}

// ══ Cours — modal ══
function openCourseModal(editMode) {
  if (!editMode) resetCourseForm();
  const title = document.getElementById('course-modal-title');
  if (title) title.textContent = editMode ? 'Modifier le cours' : 'Ajouter un cours';
  document.getElementById('create-course-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCourseModal(e) {
  if (e && e.target !== document.getElementById('create-course-overlay')) return;
  document.getElementById('create-course-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function filterCourses(query) {
  const q = (query || '').toLowerCase().trim();
  const countEl = document.getElementById('course-search-count');
  if (!q) { renderAdminCoursesList(); if (countEl) countEl.style.display = 'none'; return; }
  const filtered = (appData.courses || []).filter(c => c.name.toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q));
  renderAdminCoursesList(filtered);
  if (countEl) { countEl.style.display = 'block'; countEl.textContent = filtered.length + ' cours trouvé' + (filtered.length !== 1 ? 's' : '') + ' pour "' + query + '"'; }
}

// ══ Exercices — modal ══
function openExerciseModal(editMode) {
  if (!editMode) resetExerciseForm();
  const title = document.getElementById('exercise-modal-title');
  if (title) title.textContent = editMode ? 'Modifier l\'exercice' : 'Ajouter un exercice';
  document.getElementById('create-exercise-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeExerciseModal(e) {
  if (e && e.target !== document.getElementById('create-exercise-overlay')) return;
  document.getElementById('create-exercise-overlay').classList.remove('open');
  document.body.style.overflow = '';
}
function filterExercises(query) {
  const q = (query || '').toLowerCase().trim();
  const countEl = document.getElementById('exercise-search-count');
  if (!q) { renderAdminExercisesList(); if (countEl) countEl.style.display = 'none'; return; }
  const filtered = (appData.exerciseTypes || []).filter(e => e.name.toLowerCase().includes(q));
  renderAdminExercisesList(filtered);
  if (countEl) { countEl.style.display = 'block'; countEl.textContent = filtered.length + ' exercice' + (filtered.length !== 1 ? 's' : '') + ' trouvé' + (filtered.length !== 1 ? 's' : '') + ' pour "' + query + '"'; }
}

function openPromoModal() {
  // Pré-remplir l'année courante
  const yearInput = document.getElementById('promo-year-input');
  if (yearInput && !yearInput.value) yearInput.value = new Date().getFullYear();
  document.getElementById('create-promo-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const el = document.getElementById('promo-name-input'); if (el) el.focus(); }, 120);
}

function closePromoModal(e) {
  if (e && e.target !== document.getElementById('create-promo-overlay')) return;
  document.getElementById('create-promo-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function filterPromotions(query) {
  const q = (query || '').toLowerCase().trim();
  const countEl = document.getElementById('promo-search-count');
  const promos = appData.promotions || [];
  if (!q) {
    renderAdminPromotions();
    if (countEl) countEl.style.display = 'none';
    return;
  }
  const filtered = promos.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.year || '').includes(q) ||
    (p.desc || '').toLowerCase().includes(q)
  );
  renderAdminPromotions(filtered);
  if (countEl) {
    countEl.style.display = 'block';
    countEl.textContent = filtered.length + ' promotion' + (filtered.length !== 1 ? 's' : '') + ' trouvée' + (filtered.length !== 1 ? 's' : '') + ' pour "' + query + '"';
  }
}

function createPromotion() {
  const name  = document.getElementById('promo-name-input').value.trim();
  const year  = document.getElementById('promo-year-input').value.trim();
  const desc  = document.getElementById('promo-desc-input').value.trim();
  const start = document.getElementById('promo-start-input').value;
  const end   = document.getElementById('promo-end-input').value;
  if (!name)  { showNotif('Saisissez un nom de promotion', 'error'); return; }
  if (!start) { showNotif('Saisissez la date d\'ouverture', 'error'); return; }
  if (!end)   { showNotif('Saisissez la date de clôture', 'error'); return; }
  if (end <= start) { showNotif('La date de clôture doit être après l\'ouverture', 'error'); return; }
  const promo = { id: genId('promo'), name, year, desc, startDate: start, endDate: end, createdAt: Date.now() };
  appData.promotions.push(promo);
  saveAppData(false);
  ['promo-name-input','promo-year-input','promo-desc-input','promo-start-input','promo-end-input']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('create-promo-overlay').classList.remove('open');
  document.body.style.overflow = '';
  // Réinitialiser la recherche
  const si = document.getElementById('promo-search-input'); if (si) si.value = '';
  const sc = document.getElementById('promo-search-count'); if (sc) sc.style.display = 'none';
  renderAdminPromotions();
  showNotif('Promotion "' + name + '" créée', 'success');
}

function deletePromotion(id) {
  if (!confirm('Supprimer cette promotion ? Les étudiants ne seront pas supprimés.')) return;
  appData.promotions = appData.promotions.filter(p => p.id !== id);
  saveAppData(false);
  renderAdminPromotions();
  showNotif('Promotion supprimée', '');
}

// ══════════════════════════════════════════
//  CODES D'ACCÈS — ADMIN
// ══════════════════════════════════════════
function generateAccessCodes(promotionId, count) {
  if (!appData.accessCodes) appData.accessCodes = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let i = 0; i < count; i++) {
    let code, tries = 0;
    do {
      const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
      code = 'HRM-' + rand;
      tries++;
    } while (appData.accessCodes.some(c => c.code === code) && tries < 100);
    appData.accessCodes.push({ code, promotionId, usedBy: null, createdAt: Date.now() });
  }
  saveAppData(false);
}

function deleteAccessCode(code) {
  if (!confirm('Supprimer ce code ? S\'il est déjà utilisé, l\'étudiant perdra l\'accès.')) return;
  appData.accessCodes = (appData.accessCodes || []).filter(c => c.code !== code);
  saveAppData(false);
  openCodesPanel(_codesPanelPromoId);
}

let _codesPanelPromoId = null;

function openCodesPanel(promoId) {
  _codesPanelPromoId = promoId;
  const promo = (appData.promotions || []).find(p => p.id === promoId);
  if (!promo) return;

  const codes     = (appData.accessCodes || []).filter(c => c.promotionId === promoId);
  const freeCount = codes.filter(c => !c.usedBy).length;
  const usedCount = codes.filter(c => !!c.usedBy).length;

  const rows = codes.length ? codes.map(c => {
    const user       = c.usedBy ? (appData.users || []).find(u => u.id === c.usedBy) : null;
    const statusBadge = c.usedBy
      ? `<span style="background:#DCFCE7;color:#166534;border-radius:50px;padding:0.1rem 0.5rem;font-size:0.7rem;font-weight:700;">Utilisé</span>`
      : `<span style="background:#FFF7ED;color:#C2410C;border-radius:50px;padding:0.1rem 0.5rem;font-size:0.7rem;font-weight:700;">Libre</span>`;
    const userName   = user ? `<span style="color:#334155;font-size:0.78rem;">${user.name}</span>` : `<span style="color:#94A3B8;font-size:0.75rem;">—</span>`;
    const delBtn     = !c.usedBy
      ? `<button onclick="deleteAccessCode('${c.code}')" style="background:none;border:none;color:#EF4444;cursor:pointer;font-size:0.85rem;padding:0.2rem;" title="Supprimer">✕</button>` : '';
    return `<tr style="border-bottom:1px solid #F1F5F9;">
      <td style="padding:0.55rem 0.75rem;font-family:monospace;font-weight:700;font-size:0.88rem;letter-spacing:0.08em;color:#1E293B;">${c.code}</td>
      <td style="padding:0.55rem 0.75rem;">${statusBadge}</td>
      <td style="padding:0.55rem 0.75rem;">${userName}</td>
      <td style="padding:0.55rem 0.75rem;text-align:right;">${delBtn}</td>
    </tr>`;
  }).join('') : `<tr><td colspan="4" style="padding:2rem;text-align:center;color:#94A3B8;font-size:0.85rem;">Aucun code généré pour cette promotion.</td></tr>`;

  const html = `<div style="background:#fff;border-radius:20px;max-width:560px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.22);overflow:hidden;">
    <div style="background:linear-gradient(135deg,#0D47A1,#1976D2);padding:1.5rem;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="color:rgba(255,255,255,0.7);font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;">Codes d'accès</div>
        <div style="color:#fff;font-weight:800;font-size:1.05rem;">${promo.name}</div>
      </div>
      <button onclick="closeCodesPanel()" style="background:rgba(255,255,255,0.15);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:1.1rem;cursor:pointer;">✕</button>
    </div>
    <div style="padding:1.25rem;">
      <div style="display:flex;gap:0.75rem;margin-bottom:1rem;">
        <div style="flex:1;background:#F0FDF4;border-radius:10px;padding:0.75rem;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#166534;">${freeCount}</div>
          <div style="font-size:0.72rem;color:#16A34A;font-weight:600;">Libres</div>
        </div>
        <div style="flex:1;background:#EFF6FF;border-radius:10px;padding:0.75rem;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#1D4ED8;">${usedCount}</div>
          <div style="font-size:0.72rem;color:#2563EB;font-weight:600;">Utilisés</div>
        </div>
        <div style="flex:1;background:#F8FAFC;border-radius:10px;padding:0.75rem;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:#334155;">${codes.length}</div>
          <div style="font-size:0.72rem;color:#64748B;font-weight:600;">Total</div>
        </div>
      </div>
      <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
        <select id="codes-gen-count" style="flex:1;padding:0.55rem 0.75rem;border-radius:8px;border:1.5px solid #E2E8F0;font-family:'DM Sans',sans-serif;font-size:0.85rem;color:#334155;">
          <option value="5">5 codes</option>
          <option value="10" selected>10 codes</option>
          <option value="20">20 codes</option>
          <option value="30">30 codes</option>
          <option value="50">50 codes</option>
        </select>
        <button onclick="adminGenerateCodes('${promoId}')" style="padding:0.55rem 1rem;background:linear-gradient(135deg,#0D47A1,#1976D2);color:#fff;border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;white-space:nowrap;">+ Générer</button>
        <button onclick="copyAllFreeCodes('${promoId}')" style="padding:0.55rem 0.75rem;background:#F1F5F9;color:#475569;border:1px solid #E2E8F0;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:600;cursor:pointer;" title="Copier codes libres">📋 Copier</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;border-radius:10px;border:1px solid #E2E8F0;">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr style="background:#F8FAFC;">
            <th style="padding:0.5rem 0.75rem;text-align:left;font-size:0.72rem;font-weight:700;color:#64748B;text-transform:uppercase;">Code</th>
            <th style="padding:0.5rem 0.75rem;text-align:left;font-size:0.72rem;font-weight:700;color:#64748B;text-transform:uppercase;">Statut</th>
            <th style="padding:0.5rem 0.75rem;text-align:left;font-size:0.72rem;font-weight:700;color:#64748B;text-transform:uppercase;">Étudiant</th>
            <th></th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </div>`;

  let overlay = document.getElementById('codes-panel-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'codes-panel-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px);';
    overlay.onclick = (e) => { if (e.target === overlay) closeCodesPanel(); };
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = html;
  overlay.style.display = 'flex';
}

function closeCodesPanel() {
  const overlay = document.getElementById('codes-panel-overlay');
  if (overlay) overlay.style.display = 'none';
}

function adminGenerateCodes(promoId) {
  const count = parseInt(document.getElementById('codes-gen-count')?.value || '10', 10);
  generateAccessCodes(promoId, count);
  showNotif('✅ ' + count + ' codes générés', 'success');
  openCodesPanel(promoId);
}

function copyAllFreeCodes(promoId) {
  const freeCodes = (appData.accessCodes || []).filter(c => c.promotionId === promoId && !c.usedBy).map(c => c.code);
  if (!freeCodes.length) { showNotif('Aucun code libre à copier.', 'error'); return; }
  const text = freeCodes.join('\n');
  navigator.clipboard.writeText(text)
    .then(() => showNotif('📋 ' + freeCodes.length + ' codes copiés', 'success'))
    .catch(() => { prompt('Copiez ces codes :', text); });
}

function openExtendModal(id) {
  const promo = appData.promotions.find(p => p.id === id);
  if (!promo) return;
  document.getElementById('extend-promo-id').value   = id;
  document.getElementById('extend-promo-name').textContent = promo.name;
  document.getElementById('extend-end-input').value  = promo.endDate || '';
  document.getElementById('extend-promo-overlay').classList.add('open');
}

function closeExtendModal(e) {
  if (e && e.target !== document.getElementById('extend-promo-overlay')) return;
  document.getElementById('extend-promo-overlay').classList.remove('open');
}

function applyExtendPromotion() {
  const id  = document.getElementById('extend-promo-id').value;
  const end = document.getElementById('extend-end-input').value;
  if (!end) { showNotif('Saisissez une nouvelle date de clôture', 'error'); return; }
  const promo = appData.promotions.find(p => p.id === id);
  if (!promo) return;
  if (end <= promo.startDate) { showNotif('La date doit être après la date d\'ouverture', 'error'); return; }
  promo.endDate = end;
  saveAppData(false);
  closeExtendModal();
  renderAdminPromotions();
  showNotif('Promotion prolongée jusqu\'au ' + fmtDate(end), 'success');
}

// ══════════════════════════════════════════
//  FORMATEURS — ADMIN
// ══════════════════════════════════════════
function toggleTrainerPwd() {
  const inp = document.getElementById('trainer-password-input');
  const btn = document.getElementById('trainer-pwd-toggle');
  if (!inp) return;
  if (inp.type === 'password') { inp.type = 'text'; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'; }
  else { inp.type = 'password'; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'; }
}

const TRAINER_TOUR_CONFIGS = {
  tour1: { accent:'#0D47A1', bg:'#EFF6FF' },
  tour2: { accent:'#00796B', bg:'#E8F5E9' },
  tour3: { accent:'#C62828', bg:'#FFEBEE' },
};

function toggleTrainerTourBtn(tourId) {
  const btn = document.getElementById('trainer-form-tour-' + tourId);
  if (!btn) return;
  const active = btn.dataset.selected !== '1';
  btn.dataset.selected = active ? '1' : '0';
  const cfg = TRAINER_TOUR_CONFIGS[tourId];
  btn.style.borderColor = active ? cfg.accent : '#E2E8F0';
  btn.style.background  = active ? cfg.bg     : '#fff';
  btn.style.color       = active ? cfg.accent : '#64748B';
  btn.style.fontWeight  = active ? '700'      : '600';
  const dot = btn.querySelector('circle');
  if (dot) dot.setAttribute('fill', active ? cfg.accent : '#CBD5E1');
}

function resetTrainerTourBtns() {
  ['tour1','tour2','tour3'].forEach(id => {
    const btn = document.getElementById('trainer-form-tour-' + id);
    if (!btn) return;
    btn.dataset.selected = '0';
    btn.style.borderColor = '#E2E8F0'; btn.style.background = '#fff';
    btn.style.color = '#64748B'; btn.style.fontWeight = '600';
    const dot = btn.querySelector('circle');
    if (dot) dot.setAttribute('fill', '#CBD5E1');
  });
}

function createTrainer() {
  const name     = document.getElementById('trainer-name-input').value.trim();
  const login    = document.getElementById('trainer-login-input').value.trim();
  const password = document.getElementById('trainer-password-input').value.trim();
  const specialty= document.getElementById('trainer-specialty-input').value.trim();
  const desc     = document.getElementById('trainer-desc-input').value.trim();

  if (!name)     { showNotif('Saisissez le nom du formateur.', 'error'); return; }
  if (!login)    { showNotif('Saisissez un identifiant de connexion.', 'error'); return; }
  if (!password) { showNotif('Saisissez un mot de passe.', 'error'); return; }

  const exists = (appData.trainers || []).find(t => t.login.toLowerCase() === login.toLowerCase());
  if (exists) { showNotif('Cet identifiant est déjà utilisé. Choisissez-en un autre.', 'error'); return; }

  const assignedTours = ['tour1','tour2','tour3'].filter(id => {
    const btn = document.getElementById('trainer-form-tour-' + id);
    return btn && btn.dataset.selected === '1';
  });

  const trainer = {
    id: genId('trainer'),
    name, login, password, specialty, desc,
    assignedTours,
    createdAt: Date.now(),
  };
  if (!appData.trainers) appData.trainers = [];
  appData.trainers.push(trainer);
  saveAppData(false);

  ['trainer-name-input','trainer-login-input',
   'trainer-password-input','trainer-specialty-input','trainer-desc-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  resetTrainerTourBtns();
  const searchEl = document.getElementById('trainer-search-input');
  if (searchEl) searchEl.value = '';
  const countEl = document.getElementById('trainers-search-count');
  if (countEl) countEl.style.display = 'none';
  const form = document.getElementById('trainer-create-form');
  if (form && form.style.display !== 'none') toggleTrainerForm();
  renderAdminTrainers();
  showNotif('Espace formateur "' + name + '" créé.', 'success');
}

function deleteTrainer(id) {
  const t = (appData.trainers || []).find(t => t.id === id);
  if (!t) return;
  if (!confirm('Supprimer l\'espace formateur de "' + t.name + '" ? Cette action est irréversible.')) return;
  appData.trainers = appData.trainers.filter(t => t.id !== id);
  saveAppData(false);
  renderAdminTrainers();
  showNotif('Espace formateur supprimé.', '');
}

function toggleTrainerPassword(id) {
  const el = document.getElementById('trainer-pwd-' + id);
  const btn = document.getElementById('trainer-pwd-btn-' + id);
  if (!el) return;
  const trainer = (appData.trainers || []).find(t => t.id === id);
  if (!trainer) return;
  if (el.classList.contains('masked')) {
    el.textContent = trainer.password;
    el.classList.remove('masked');
    if (btn) btn.textContent = 'Masquer';
  } else {
    el.textContent = '••••••••';
    el.classList.add('masked');
    if (btn) btn.textContent = 'Voir';
  }
}

function toggleTrainerForm() {
  const form = document.getElementById('trainer-create-form');
  const btn  = document.getElementById('trainer-create-btn');
  if (!form) return;
  const open = form.style.display !== 'none';
  form.style.display = open ? 'none' : '';
  if (btn) {
    btn.innerHTML = open
      ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg> Créer espace formateur'
      : '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Fermer';
    btn.style.background = open ? 'linear-gradient(135deg,#0D47A1,#1976D2)' : '#64748B';
  }
}

function filterTrainers(query) {
  const q = (query || '').toLowerCase().trim();
  const all = appData.trainers || [];
  const filtered = q ? all.filter(t =>
    t.name.toLowerCase().includes(q) ||
    (t.specialty || '').toLowerCase().includes(q) ||
    t.login.toLowerCase().includes(q)
  ) : all;
  const countEl = document.getElementById('trainers-search-count');
  if (countEl) {
    if (q) { countEl.textContent = filtered.length + ' résultat' + (filtered.length !== 1 ? 's' : '') + ' pour « ' + query + ' »'; countEl.style.display = 'block'; }
    else { countEl.style.display = 'none'; }
  }
  renderAdminTrainers(filtered);
}

function renderAdminTrainers(filteredList) {
  const list = document.getElementById('admin-trainers-list');
  if (!list) return;
  const trainers = filteredList !== undefined ? filteredList : (appData.trainers || []);
  const badge = document.getElementById('trainers-count-badge');
  if (badge) badge.textContent = (appData.trainers || []).length;
  if (!trainers.length) {
    const isEmpty = filteredList === undefined && !(appData.trainers || []).length;
    list.innerHTML = `
      <div style="text-align:center;padding:2.5rem 1rem;background:#F8FAFC;border:1.5px dashed #E2E8F0;border-radius:16px;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" style="margin:0 auto 0.75rem;display:block;"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
        <div style="font-size:0.9rem;font-weight:700;color:#334155;margin-bottom:0.3rem;">${isEmpty ? 'Aucun formateur créé' : 'Aucun résultat'}</div>
        <div style="font-size:0.78rem;color:#94A3B8;">${isEmpty ? 'Cliquez sur « Créer espace formateur » pour commencer.' : 'Essayez un autre terme de recherche.'}</div>
      </div>`;
    return;
  }
  list.innerHTML = '<div class="trainer-grid">' + trainers.map(t => {
    const initials = t.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
    const date = new Date(t.createdAt).toLocaleDateString('fr-FR');
    const allTourDefs = { tour1:{label:'1er Tour',color:'#0D47A1',bg:'#EFF6FF'}, tour2:{label:'2ème Tour',color:'#00796B',bg:'#E8F5E9'}, tour3:{label:'3ème Tour',color:'#C62828',bg:'#FFEBEE'} };
    const assignedTours = (t.assignedTours && t.assignedTours.length) ? t.assignedTours : [];
    const tourBadgesHtml = assignedTours.length
      ? assignedTours.map(tid => {
          const td = allTourDefs[tid];
          return td ? `<span style="background:${td.bg};color:${td.color};border-radius:50px;padding:0.15rem 0.55rem;font-size:0.68rem;font-weight:700;">${td.label}</span>` : '';
        }).join('')
      : `<span style="background:#F1F5F9;color:#94A3B8;border-radius:50px;padding:0.15rem 0.55rem;font-size:0.68rem;font-weight:600;">Non assigné</span>`;
    const trainerCourses = (appData.courses || []).filter(c => c.trainerId === t.id);
    const coursesHtml = trainerCourses.length
      ? trainerCourses.map(c => {
          const tour = (appData.tours || []).find(tr => tr.id === c.tourId);
          const badge = c.pdfName
            ? `<span style="background:#EFF6FF;color:#1D4ED8;font-size:0.62rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:4px;flex-shrink:0;">PDF</span>`
            : c.videoFileName
            ? `<span style="background:#FEF2F2;color:#C62828;font-size:0.62rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:4px;flex-shrink:0;">Vidéo</span>`
            : `<span style="background:#F1F5F9;color:#94A3B8;font-size:0.62rem;font-weight:700;padding:0.1rem 0.4rem;border-radius:4px;flex-shrink:0;">Bientôt</span>`;
          return `<div style="display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0;border-bottom:1px solid #F1F5F9;">
            <span style="font-size:0.78rem;color:#334155;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</span>
            ${badge}
            <span style="font-size:0.68rem;color:#94A3B8;flex-shrink:0;">${tour ? tour.name : (c.tourId || '')}</span>
          </div>`;
        }).join('')
      : `<div style="font-size:0.78rem;color:#94A3B8;font-style:italic;padding:0.25rem 0;">Aucun cours mis en ligne.</div>`;
    return `
      <div class="trainer-card">
        <div class="trainer-card-header">
          <div class="trainer-avatar">${initials}</div>
          <div class="trainer-header-info">
            <div class="trainer-name">${t.name}</div>
            <div class="trainer-specialty">${t.specialty || 'Aucune spécialité renseignée'}</div>
            <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-top:0.3rem;">${tourBadgesHtml}</div>
          </div>
          <button class="trainer-card-delete" onclick="deleteTrainer('${t.id}')" title="Supprimer">✕</button>
        </div>
        <div class="trainer-card-body">
          <div class="trainer-credentials">
            <div>
              <div class="trainer-cred-row" style="margin-bottom:0.4rem;">
                <span class="trainer-cred-label">Identifiant</span>
                <span class="trainer-cred-val">${t.login}</span>
              </div>
              <div class="trainer-cred-row">
                <span class="trainer-cred-label">Mot de passe</span>
                <span class="trainer-cred-val masked" id="trainer-pwd-${t.id}">••••••••</span>
              </div>
            </div>
            <button class="trainer-reveal-btn" id="trainer-pwd-btn-${t.id}" onclick="toggleTrainerPassword('${t.id}')">Voir</button>
          </div>
          <div class="trainer-card-footer">
            <div class="trainer-desc">${t.desc || '—'}</div>
            <div class="trainer-date">Créé le ${date}</div>
          </div>
          <div style="margin-top:0.85rem;padding-top:0.75rem;border-top:1.5px solid #E2E8F0;">
            <div style="font-size:0.7rem;font-weight:700;color:#64748B;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.45rem;display:flex;align-items:center;gap:0.35rem;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Cours mis en ligne
              <span style="background:#0D47A1;color:#fff;border-radius:50px;padding:0.05rem 0.45rem;font-size:0.65rem;">${trainerCourses.length}</span>
            </div>
            ${coursesHtml}
          </div>
          <!-- Horaires du formateur -->
          <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1.5px solid #E2E8F0;">
            <div style="font-size:0.7rem;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.45rem;display:flex;align-items:center;gap:0.35rem;justify-content:space-between;">
              <span style="display:flex;align-items:center;gap:0.35rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Horaires de cours
              </span>
              <button onclick="openScheduleModal('${t.id}')" style="font-size:0.68rem;font-weight:700;padding:0.15rem 0.55rem;border-radius:6px;border:1px solid #7C3AED;background:#F5F3FF;color:#7C3AED;cursor:pointer;font-family:'DM Sans',sans-serif;">+ Horaire</button>
            </div>
            <div id="schedule-list-${t.id}">${renderScheduleSlots(t)}</div>
          </div>
        </div>
      </div>`;
  }).join('') + '</div>';
}

function renderAdminPromotions(filteredList) {
  const list = document.getElementById('admin-promotions-list');
  if (!list) return;
  const promos = filteredList !== undefined ? filteredList : (appData.promotions || []);
  if (!promos.length) {
    const isEmpty = !filteredList && !(appData.promotions || []).length;
    list.innerHTML = `<div style="text-align:center;padding:3rem 1rem;background:#F8FAFC;border:1.5px dashed #E2E8F0;border-radius:16px;">
      <div style="width:56px;height:56px;border-radius:16px;background:#EFF6FF;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12 12 0 01.665 6.479A12 12 0 0112 20.055a12 12 0 01-6.824-2.998 12 12 0 01.665-6.479L12 14z"/></svg>
      </div>
      <div style="font-weight:700;color:#334155;font-size:0.92rem;margin-bottom:0.35rem;">${isEmpty ? 'Aucune promotion créée' : 'Aucun résultat'}</div>
      <div style="color:#94A3B8;font-size:0.8rem;">${isEmpty ? 'Cliquez sur « Créer une promotion » pour commencer.' : 'Essayez un autre terme de recherche.'}</div>
    </div>`;
    return;
  }
  const statusLabel = { active:'Ouverte', expired:'Clôturée', upcoming:'À venir' };
  const statusClass = { active:'active', expired:'expired', upcoming:'upcoming' };
  list.innerHTML = '<div class="promo-grid">' + promos.map(p => {
    const count  = appData.users.filter(u => u.promotionId === p.id).length;
    const status = promoStatus(p);
    return `
      <div class="promo-card">
        <div class="promo-card-header">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
            <span class="promo-status-badge promo-status-badge--${statusClass[status]}">${statusLabel[status]}</span>
            <button class="promo-card-delete" onclick="deletePromotion('${p.id}')" title="Supprimer">✕</button>
          </div>
          <div class="promo-card-year">${p.year || 'Année non définie'}</div>
          <div class="promo-card-name">${p.name}</div>
          <div class="promo-card-dates">
            <span class="promo-card-date-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Ouverture : ${fmtDate(p.startDate)}
            </span>
            <span class="promo-card-date-item">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Clôture : ${fmtDate(p.endDate)}
            </span>
          </div>
        </div>
        <div class="promo-card-body">
          <div class="promo-card-desc">${p.desc || 'Aucune description'}</div>
          <div class="promo-card-footer">
            <span class="promo-student-count">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              ${count} apprenant${count !== 1 ? 's' : ''}
            </span>
            <div class="promo-card-actions">
              <button class="promo-extend-btn" onclick="openCodesPanel('${p.id}')" style="background:#EFF6FF;color:#1D4ED8;border-color:#BFDBFE;">🔑 Codes</button>
              <button class="promo-extend-btn" onclick="openExtendModal('${p.id}')">Prolonger</button>
              <button class="promo-view-btn" onclick="switchAdminView('users','${p.id}')">Dossiers →</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('') + '</div>';
}

// ══════════════════════════════════════════
//  UTILISATEURS groupés par promotion
// ══════════════════════════════════════════
const SVG = {
  user: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  phone: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1.18h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 5.54 5.54l1.36-1.36a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2z"/></svg>`,
  quiz: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  star: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  calendar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  folder: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  graduation: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  users: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
};

function renderAdminUsersList(filterPromoId) {
  adminState.currentPromoFilter = filterPromoId || null;
  const list = document.getElementById('admin-users-list');
  if (!list) return;

  if (!appData.users.length) {
    list.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;background:#F8FAFC;border-radius:16px;border:1.5px dashed #E2E8F0;">
        <div style="width:60px;height:60px;border-radius:50%;background:#EFF6FF;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;color:#3B82F6;">
          ${SVG.users}
        </div>
        <div style="font-weight:700;color:#334155;font-size:0.95rem;margin-bottom:0.35rem;">Aucun apprenant inscrit</div>
        <div style="color:#94A3B8;font-size:0.82rem;">Les étudiants apparaîtront ici dès leur première connexion.</div>
      </div>`;
    return;
  }

  const promos = appData.promotions || [];
  const groups = {};
  promos.forEach(p => { groups[p.id] = { promo: p, users: [] }; });
  groups['__none__'] = { promo: null, users: [] };
  appData.users.forEach(u => {
    const key = (u.promotionId && groups[u.promotionId]) ? u.promotionId : '__none__';
    groups[key].users.push(u);
  });

  const keysToShow = filterPromoId ? [filterPromoId] : [...promos.map(p => p.id), '__none__'];
  let html = '';

  keysToShow.forEach(key => {
    const g = groups[key];
    if (!g || !g.users.length) return;
    const promoColor = g.promo ? '#0D47A1' : '#64748B';
    const promoBg    = g.promo ? '#EFF6FF' : '#F8FAFC';
    html += `
      <div style="margin-bottom:2rem;">
        <div style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1.1rem;background:${promoBg};border:1px solid ${g.promo ? '#BFDBFE' : '#E2E8F0'};border-radius:12px;margin-bottom:0.75rem;">
          <div style="width:34px;height:34px;border-radius:10px;background:${promoColor};display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;">
            ${g.promo ? SVG.graduation : SVG.user}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:700;font-size:0.9rem;color:#1E293B;">${g.promo ? g.promo.name : 'Sans promotion'}</div>
            ${g.promo && g.promo.year ? `<div style="font-size:0.72rem;color:#64748B;">Promotion ${g.promo.year}</div>` : ''}
          </div>
          <span style="background:${promoColor};color:#fff;border-radius:50px;padding:0.22rem 0.75rem;font-size:0.72rem;font-weight:700;">
            ${SVG.users} ${g.users.length} apprenant${g.users.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style="display:grid;gap:0.6rem;">
          ${g.users.sort((a,b) => (b.lastLogin||0)-(a.lastLogin||0)).map((u, idx) => {
            const date      = u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('fr-FR') : '—';
            const initials  = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
            const pst       = paymentStatus(u);
            const avatarBg  = pst === 'ok' ? '#16A34A' : (pst === 'late' || pst === 'suspended') ? '#DC2626' : ['#0D47A1','#00796B','#C62828','#6A1B9A','#E65100'][idx % 5];
            const borderCol = pst === 'ok' ? '#D1FAE5' : (pst === 'late' || pst === 'suspended') ? '#FECACA' : '#E2E8F0';
            const rankBadge = idx === 0
              ? `<span style="background:#FEF9C3;color:#A16207;border:1px solid #FDE68A;border-radius:6px;padding:0.15rem 0.5rem;font-size:0.65rem;font-weight:700;">Actif récent</span>`
              : '';
            const payBtn = pst === 'ok'
              ? `<button class="pay-btn pay-btn--suspend" onclick="suspendUserAccess('${u.id}')">🔒</button>`
              : `<button class="pay-btn pay-btn--validate" onclick="validateMonthlyPayment('${u.id}')">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   Valider paiement
                 </button>`;
            return `
              <div style="display:flex;align-items:center;gap:1rem;background:#fff;border:1px solid ${borderCol};border-radius:14px;padding:1rem 1.1rem;box-shadow:0 1px 4px rgba(0,0,0,0.04);transition:box-shadow 0.15s;" onmouseover="this.style.boxShadow='0 4px 16px rgba(13,71,161,0.1)'" onmouseout="this.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'">

                <!-- Avatar -->
                <div style="width:46px;height:46px;border-radius:14px;background:${avatarBg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.95rem;flex-shrink:0;box-shadow:0 4px 12px ${avatarBg}55;">
                  ${initials}
                </div>

                <!-- Infos -->
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.3rem;">
                    <span style="font-weight:700;font-size:0.9rem;color:#1E293B;">${u.name}</span>
                    ${rankBadge}
                    ${paymentBadgeHTML(u)}
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:0.75rem;font-size:0.75rem;color:#64748B;">
                    <span style="display:flex;align-items:center;gap:0.3rem;">${SVG.phone} ${u.phone || '—'}</span>
                    <span style="display:flex;align-items:center;gap:0.3rem;">${SVG.quiz} ${u.quizPlayed||0} quiz</span>
                    <span style="display:flex;align-items:center;gap:0.3rem;color:#D97706;">${SVG.star} ${u.totalScore||0} pts</span>
                    <span style="display:flex;align-items:center;gap:0.3rem;">${SVG.calendar} ${date}</span>
                  </div>
                </div>

                <!-- Actions -->
                <div style="display:flex;gap:0.4rem;flex-shrink:0;">
                  ${payBtn}
                  <button onclick="openStudentDossier('${u.id}')"
                    style="display:flex;align-items:center;gap:0.4rem;background:#0D47A1;color:#fff;border:none;border-radius:10px;padding:0.55rem 1rem;font-size:0.78rem;font-weight:700;cursor:pointer;white-space:nowrap;transition:background 0.15s;box-shadow:0 4px 12px rgba(13,71,161,0.25);"
                    onmouseover="this.style.background='#1565C0'" onmouseout="this.style.background='#0D47A1'">
                    ${SVG.folder} Dossier
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  });

  list.innerHTML = html || `<div style="text-align:center;padding:2rem;color:#94A3B8;font-size:0.88rem;">Aucun apprenant dans cette promotion.</div>`;
}

// ══════════════════════════════════════════
//  PAIEMENT MENSUEL — ADMIN
// ══════════════════════════════════════════

function paymentStatus(user) {
  if (user.accessSuspended) return 'suspended';
  if (!user.paidUntil) return 'none';
  const today = new Date(); today.setHours(0,0,0,0);
  const paid  = new Date(user.paidUntil); paid.setHours(0,0,0,0);
  return today <= paid ? 'ok' : 'late';
}

function paymentBadgeHTML(user) {
  const st = paymentStatus(user);
  if (st === 'ok')        return `<span class="pay-badge pay-badge--ok">✓ Payé jusqu'au ${fmtDate(user.paidUntil)}</span>`;
  if (st === 'late')      return `<span class="pay-badge pay-badge--late">⚠ Expiré le ${fmtDate(user.paidUntil)}</span>`;
  if (st === 'suspended') return `<span class="pay-badge pay-badge--late">🔒 Suspendu</span>`;
  return `<span class="pay-badge pay-badge--none">— Non renseigné</span>`;
}

function addOneMonth(fromDateStr) {
  // Ajoute exactement 1 mois à la date donnée (ou à aujourd'hui si non fournie)
  const base = fromDateStr ? new Date(fromDateStr) : new Date();
  base.setHours(0, 0, 0, 0);
  const result = new Date(base);
  result.setMonth(result.getMonth() + 1);
  return result.toISOString().slice(0, 10);
}

function validateMonthlyPayment(userId) {
  const user = appData.users.find(u => u.id === userId);
  if (!user) return;
  // Si paidUntil est encore dans le futur, on prolonge depuis cette date ;
  // sinon on repart d'aujourd'hui — cycle de 1 mois glissant.
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const base  = (user.paidUntil && new Date(user.paidUntil) >= today) ? user.paidUntil : null;
  const newDate = addOneMonth(base);
  user.paidUntil = newDate;
  user.accessSuspended = false;
  saveAppData(false);
  showNotif('✅ Paiement validé pour ' + user.name + ' jusqu\'au ' + fmtDate(newDate), 'success');
  renderAdminUsersList(adminState.currentPromoFilter);
  renderRecouvrementView();
  updateDashboard();
}

function suspendUserAccess(userId) {
  const user = appData.users.find(u => u.id === userId);
  if (!user) return;
  if (!confirm('Suspendre l\'accès de ' + user.name + ' ? Il ne pourra plus se connecter.')) return;
  user.accessSuspended = true;
  user.paidUntil = null;
  saveAppData(false);
  showNotif('🔒 Accès suspendu pour ' + user.name, '');
  renderAdminUsersList(adminState.currentPromoFilter);
  renderRecouvrementView();
  updateDashboard();
}

function renderRecouvrementView() {
  const container = document.getElementById('recouvrement-list');
  if (!container) return;
  const users = appData.users || [];
  const overdue = users.filter(u => paymentStatus(u) !== 'ok');
  const paid    = users.filter(u => paymentStatus(u) === 'ok');

  // Stats
  const totalEl   = document.getElementById('rec-total');
  const overdueEl = document.getElementById('rec-overdue');
  const paidEl    = document.getElementById('rec-paid');
  if (totalEl)   totalEl.textContent   = users.length;
  if (overdueEl) overdueEl.textContent = overdue.length;
  if (paidEl)    paidEl.textContent    = paid.length;

  if (!users.length) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:#94A3B8;font-size:0.88rem;">Aucun apprenant inscrit.</div>';
    return;
  }

  const allSorted = [...overdue, ...paid];
  container.innerHTML = allSorted.map(u => {
    const st       = paymentStatus(u);
    const promo    = (appData.promotions || []).find(p => p.id === u.promotionId);
    const initials = u.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const rowClass = st === 'ok' ? 'recouvrement-row recouvrement-row--ok' : 'recouvrement-row';
    const avatarBg = st === 'ok' ? '#16A34A' : (st === 'late' || st === 'suspended') ? '#DC2626' : '#64748B';
    const actionBtns = st === 'ok'
      ? `<button class="pay-btn pay-btn--suspend" onclick="suspendUserAccess('${u.id}')">🔒 Suspendre</button>`
      : `<button class="pay-btn pay-btn--validate" onclick="validateMonthlyPayment('${u.id}')">
           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
           Valider paiement
         </button>`;
    return `
      <div class="${rowClass}">
        <div style="width:42px;height:42px;border-radius:12px;background:${avatarBg};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:0.88rem;flex-shrink:0;">${initials}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:0.88rem;color:#1E293B;margin-bottom:0.2rem;">${u.name}</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;">
            ${paymentBadgeHTML(u)}
            <span style="font-size:0.72rem;color:#94A3B8;">${promo ? promo.name : 'Sans promotion'}</span>
            <span style="font-size:0.72rem;color:#94A3B8;">${SVG.phone} ${u.phone || '—'}</span>
          </div>
        </div>
        <div style="display:flex;gap:0.45rem;flex-shrink:0;">
          ${actionBtns}
          <button class="pay-btn" style="background:#F1F5F9;color:#334155;" onclick="openStudentDossier('${u.id}')">
            ${SVG.folder}
          </button>
        </div>
      </div>`;
  }).join('');
}

// ══════════════════════════════════════════
//  DOSSIER PERSONNEL ÉTUDIANT
// ══════════════════════════════════════════
function openStudentDossier(userId) {
  const user = appData.users.find(u => u.id === userId);
  if (!user) return;
  const overlay = document.getElementById('dossier-overlay');
  const promo   = appData.promotions.find(p => p.id === user.promotionId);

  document.getElementById('dossier-avatar').textContent  = user.name.substring(0,2).toUpperCase();
  document.getElementById('dossier-name').textContent    = user.name;
  document.getElementById('dossier-promo').innerHTML = promo
    ? `<span style="display:inline-flex;align-items:center;gap:0.35rem;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>${promo.name}</span>`
    : `<span style="display:inline-flex;align-items:center;gap:0.35rem;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Sans promotion</span>`;
  document.getElementById('dossier-phone').textContent   = user.phone || '—';
  document.getElementById('dossier-date').textContent    = user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—';
  document.getElementById('dossier-last').textContent    = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : '—';
  document.getElementById('dossier-score').textContent   = user.totalScore || 0;
  document.getElementById('dossier-quizzes').textContent = user.quizPlayed || 0;
  document.getElementById('dossier-best').textContent    = user.bestScore || 0;

  // Progression par matière
  const catList = document.getElementById('dossier-cat-list');
  const catScores = user.catScores || {};
  const courses = appData.courses || [];
  const catKeys = Object.keys(catScores).filter(k => catScores[k] > 0);
  if (!catKeys.length) {
    catList.innerHTML = '<div style="color:#94A3B8;font-size:0.82rem;">Aucune activité enregistrée.</div>';
  } else {
    const maxScore = Math.max(...catKeys.map(k => catScores[k]));
    catList.innerHTML = catKeys.map(k => {
      const course = courses.find(c => c.id === k);
      const label  = course ? course.name : k;
      const score  = catScores[k];
      const pct    = maxScore ? Math.round((score / maxScore) * 100) : 0;
      const played = (user.catPlayed || {})[k] || 0;
      return `
        <div class="dossier-cat-row">
          <div class="dossier-cat-name" title="${label}">${label}</div>
          <div class="dossier-cat-bar"><div class="dossier-cat-fill" style="width:${pct}%"></div></div>
          <div class="dossier-cat-score">${score} pts <span style="color:#CBD5E1;font-size:0.65rem;">(${played}×)</span></div>
        </div>
      `;
    }).join('');
  }

  // Bloc mensualité dans le dossier
  const payBlock = document.getElementById('dossier-pay-section');
  if (payBlock) {
    const pst  = paymentStatus(user);
    const userId = user.id;
    const color  = pst === 'ok' ? '#16A34A' : (pst === 'late' || pst === 'suspended') ? '#DC2626' : '#64748B';
    const bg     = pst === 'ok' ? '#F0FDF4' : (pst === 'late' || pst === 'suspended') ? '#FEF2F2' : '#F8FAFC';
    const border = pst === 'ok' ? '#D1FAE5' : (pst === 'late' || pst === 'suspended') ? '#FECACA' : '#E2E8F0';
    const actionBtn = pst === 'ok'
      ? `<button onclick="suspendUserAccess('${userId}')" style="padding:0.5rem 1rem;border-radius:9px;border:1px solid #FECACA;background:#FEF2F2;color:#DC2626;font-size:0.8rem;font-weight:700;cursor:pointer;">🔒 Suspendre</button>`
      : `<button onclick="validateMonthlyPayment('${userId}')" style="padding:0.5rem 1rem;border-radius:9px;border:none;background:linear-gradient(135deg,#16A34A,#22C55E);color:#fff;font-size:0.8rem;font-weight:700;cursor:pointer;box-shadow:0 3px 10px rgba(22,163,74,0.28);">
           ✓ Valider le paiement du mois
         </button>`;
    payBlock.innerHTML = `
      <div class="dossier-section-title">Mensualité</div>
      <div style="background:${bg};border:1px solid ${border};border-radius:12px;padding:1rem 1.15rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
        <div style="flex:1;min-width:0;">
          ${paymentBadgeHTML(user)}
          <div style="margin-top:0.35rem;font-size:0.78rem;color:#64748B;">
            ${pst === 'ok' ? 'Accès valide jusqu\'au <strong style="color:#15803D;">' + fmtDate(user.paidUntil) + '</strong>.' : pst === 'late' ? 'Accès bloqué depuis le <strong style="color:#DC2626;">' + fmtDate(user.paidUntil) + '</strong>.' : pst === 'suspended' ? 'Accès suspendu manuellement.' : 'Aucun paiement enregistré pour cet auditeur.'}
          </div>
        </div>
        ${actionBtn}
      </div>`;
    payBlock.style.display = 'block';
  }

  overlay.classList.add('open');
}

function closeDossier(e) {
  if (e && e.target !== document.getElementById('dossier-overlay')) return;
  document.getElementById('dossier-overlay').classList.remove('open');
}

function loadUserStats(user) {
  state.playerName = user.name;
  state.totalScore = user.totalScore || 0;
  state.quizPlayed = user.quizPlayed || 0;
  state.bestScore = user.bestScore || 0;
  state.catScores = { ...(user.catScores || {}) };
  state.catPlayed = { ...(user.catPlayed || {}) };
}

function saveUserStats() {
  if (auth.role !== 'student' || !auth.userId) return;
  const user = appData.users.find(u => u.id === auth.userId);
  if (!user) return;
  user.name = state.playerName;
  user.totalScore = state.totalScore;
  user.quizPlayed = state.quizPlayed;
  user.bestScore = state.bestScore;
  user.catScores = { ...state.catScores };
  user.catPlayed = { ...state.catPlayed };
  user.lastLogin = Date.now();
  saveAppData(false);
}

function adminLogin() {
  const pwd = document.getElementById('admin-password').value;
  const errEl = document.getElementById('admin-login-error');
  if (errEl) errEl.style.display = 'none';
  if (pwd !== ADMIN_PASSWORD) {
    if (errEl) { errEl.textContent = 'Mot de passe incorrect.'; errEl.style.display = 'block'; }
    return;
  }
  auth.role = 'admin';
  auth.userId = null;
  saveSession();
  document.body.classList.remove('direct-link-mode');
  history.replaceState(null, '', location.pathname);
  document.getElementById('admin-password').value = '';
  enterAdminApp();
}

function adminLogout() {
  clearSession();
  document.getElementById('admin-app').classList.remove('active');
  showLoginScreen();
}

