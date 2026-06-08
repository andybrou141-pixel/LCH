// ══════════════════════════════════════════
//  INDEXEDDB — PDF
// ══════════════════════════════════════════
function openPdfDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(PDF_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(PDF_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function savePdf(courseId, blob, fileName) {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, 'readwrite');
    tx.objectStore(PDF_STORE).put({ blob, fileName, updatedAt: Date.now() }, courseId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getPdf(courseId) {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, 'readonly');
    const req = tx.objectStore(PDF_STORE).get(courseId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deletePdf(courseId) {
  const db = await openPdfDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PDF_STORE, 'readwrite');
    tx.objectStore(PDF_STORE).delete(courseId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ══════════════════════════════════════════
//  AUTH & SESSION
// ══════════════════════════════════════════
function saveSession(remember) {
  const data = JSON.stringify({ role: auth.role, userId: auth.userId });
  try {
    localStorage.removeItem('hermes_logged_out'); // Nouvelle session → effacer le flag déconnexion
    if (remember === true) {
      localStorage.setItem(SESSION_KEY, data);
      localStorage.setItem(REMEMBER_KEY, '1');
      sessionStorage.removeItem(SESSION_KEY);
    } else if (remember === false) {
      sessionStorage.setItem(SESSION_KEY, data);
      localStorage.removeItem(SESSION_KEY);
      localStorage.setItem(REMEMBER_KEY, '0');
    } else {
      // Appel sans choix explicite (admin, formateur, etc.)
      localStorage.setItem(SESSION_KEY, data);
    }
  } catch (e) {}
}

function loadSession() {
  try {
    if (localStorage.getItem('hermes_logged_out') === '1') return; // Déconnexion explicite — ne pas restaurer
    const persistent = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    if (persistent?.role) { auth.role = persistent.role; auth.userId = persistent.userId; return; }
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    if (session?.role) { auth.role = session.role; auth.userId = session.userId; }
  } catch (e) {}
}

function clearSession() {
  auth.role   = null;
  auth.userId = null;
  // Supprimer immédiatement de la mémoire JS avant toute opération storage
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SCREEN_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SCREEN_KEY);
  } catch (_) {}
  // Marquer explicitement "déconnecté" pour que le script inline <head> ne restaure pas la session
  try { localStorage.setItem('hermes_logged_out', '1'); } catch (_) {}
  // REMEMBER_KEY conservé intentionnellement : la préférence "enregistrer sur ce téléphone" persiste.
}

function resetDeviceMemory() {
  try {
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PHONE_CACHE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}
}

function studentLogin() {
  const name  = document.getElementById('student-name').value.trim();
  const phone = document.getElementById('student-phone').value.trim();
  // Validations déjà faites dans requestOTP — on revérifie en sécurité
  if (!name || !validateFullName(name))  { showNotif('Nom complet requis (prénom + nom).', 'error'); return; }
  if (!phone || !validatePhone(phone))   { showNotif('Numéro de téléphone invalide.', 'error'); return; }

  // ── Vérification promotion sélectionnée ──
  const selectedPromoEl = document.querySelector('.promo-select-item.selected');
  const promotionId = selectedPromoEl ? selectedPromoEl.dataset.promoId : null;
  if (!promotionId) {
    showNotif('Veuillez sélectionner une promotion.', 'error');
    goToRegStep1();
    return;
  }
  const selPromo = (appData.promotions || []).find(p => p.id === promotionId);
  if (!selPromo) {
    showNotif('Promotion introuvable. Contactez votre administrateur.', 'error');
    goToRegStep1();
    return;
  }
  if (promoStatus(selPromo) !== 'active') {
    showNotif('La promotion "' + selPromo.name + '" est clôturée. Vous ne pouvez plus vous inscrire.', 'error');
    goToRegStep1();
    return;
  }

  // ── Recherche du compte par téléphone (clé primaire — OTP a prouvé la propriété du numéro) ──
  let user = appData.users.find(u => u.phone === phone);

  if (user) {
    // Compte existant → vérifier que SA promotion n'est pas expirée
    const userPromo = (appData.promotions || []).find(p => p.id === user.promotionId);
    if (userPromo && promoStatus(userPromo) === 'expired') {
      showNotif(
        'Votre promotion "' + userPromo.name + '" est clôturée. Vous ne pouvez plus vous connecter.',
        'error'
      );
      return;
    }
    // ── Vérification mensualité ──
    if (user.paidUntil) {
      const today = new Date(); today.setHours(0,0,0,0);
      const paid  = new Date(user.paidUntil); paid.setHours(0,0,0,0);
      if (today > paid) {
        showNotif(
          'Votre accès mensuel a expiré le ' + fmtDate(user.paidUntil) +
          '. Veuillez contacter l\'administration pour régulariser votre mensualité.',
          'error'
        );
        return;
      }
    } else if (user.accessSuspended) {
      showNotif(
        'Votre accès a été suspendu. Veuillez contacter l\'administration.',
        'error'
      );
      return;
    }
    if (!user.promotionId) user.promotionId = promotionId;
    user.lastLogin = Date.now();
    saveAppData(false);
  } else {
    // Nouveau compte → on lui affecte la promotion choisie
    user = {
      id: genId('user'),
      name,
      phone,
      promotionId,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      totalScore: 0,
      quizPlayed: 0,
      bestScore: 0,
      catScores: {},
      catPlayed: {},
    };
    appData.users.push(user);
    saveAppData(false);
  }

  auth.role = 'student';
  auth.userId = user.id;
  loadUserStats(user);
  document.body.classList.remove('direct-link-mode');
  history.replaceState(null, '', location.pathname);
  // Vérifier si l'étudiant a déjà fait son choix de mémorisation
  const rememberPref = localStorage.getItem(REMEMBER_KEY);
  if (rememberPref === '1') {
    // Déjà choisi "Oui" → session persistante, accès direct
    saveSession(true);
    enterStudentApp();
  } else {
    // Demander le choix (première fois ou après un "Non")
    saveSession(false); // Session temporaire en attendant le choix
    showRememberPrompt(name);
  }
}

// ── Helpers dates promotion ─────────────────────────────────────
function promoStatus(p) {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = p.startDate ? new Date(p.startDate) : null;
  const end   = p.endDate   ? new Date(p.endDate)   : null;
  if (end && today > end)   return 'expired';
  if (start && today < start) return 'upcoming';
  return 'active';
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}

// ── Inscription 2 étapes ─────────────────────────────────────────
function renderPromoSelector() {
  const grid    = document.getElementById('promo-select-grid');
  const noPromo = document.getElementById('reg-no-promo');
  const nextBtn = document.getElementById('reg-next-btn');
  const qcDiv   = document.getElementById('reg-quick-connect');
  if (!grid) return;

  // Connexion rapide : afficher si un téléphone est mémorisé
  if (qcDiv) {
    const cached = (() => { try { return JSON.parse(localStorage.getItem(PHONE_CACHE_KEY) || 'null'); } catch(e) { return null; } })();
    const cachedPromo = cached?.promotionId ? (appData.promotions || []).find(p => p.id === cached.promotionId && promoStatus(p) === 'active') : null;
    if (cached?.phone && cached?.name && cachedPromo) {
      qcDiv.style.display = 'block';
      qcDiv.innerHTML = `
        <div style="background:#F0FDF4;border:1.5px solid #86EFAC;border-radius:14px;padding:1rem 1.1rem;">
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.55rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span style="font-size:0.78rem;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.05em;">Accès mémorisé</span>
          </div>
          <div style="font-weight:700;color:#1A1A1A;font-size:0.93rem;">${cached.name}</div>
          <div style="color:#6B7280;font-size:0.82rem;margin-bottom:0.85rem;">${formatPhoneDisplay(cached.phone)} · ${cachedPromo.name}</div>
          <button onclick="quickConnect()" style="width:100%;padding:0.75rem;background:linear-gradient(135deg,#16A34A,#15803D);color:#fff;border:none;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:0.45rem;margin-bottom:0.45rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Connexion rapide
          </button>
          <button onclick="clearPhoneCache()" style="width:100%;padding:0.6rem;background:none;color:#9CA3AF;border:none;font-family:'DM Sans',sans-serif;font-size:0.8rem;cursor:pointer;">Utiliser un autre compte</button>
        </div>`;
    } else {
      qcDiv.style.display = 'none';
      qcDiv.innerHTML = '';
    }
  }

  const open = (appData.promotions || []).filter(p => promoStatus(p) === 'active');
  if (!open.length) {
    grid.innerHTML = '';
    if (noPromo) noPromo.style.display = 'block';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }
  if (noPromo) noPromo.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'block';
  grid.innerHTML = open.map(p => `
    <button class="promo-select-item" data-promo-id="${p.id}" onclick="selectPromo(this)" type="button">
      <div class="promo-select-item-avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12 12 0 01.665 6.479A12 12 0 0112 20.055a12 12 0 01-6.824-2.998 12 12 0 01.665-6.479L12 14z"/></svg>
      </div>
      <div style="flex:1;min-width:0;">
        <div class="promo-select-item-name">${p.name}</div>
        <div class="promo-select-item-meta">${p.year ? p.year + ' · ' : ''}Clôture : ${fmtDate(p.endDate)}</div>
      </div>
      <div class="promo-select-item-check">✓</div>
    </button>
  `).join('');
}

function quickConnect() {
  const cached = (() => { try { return JSON.parse(localStorage.getItem(PHONE_CACHE_KEY) || 'null'); } catch(e) { return null; } })();
  if (!cached?.phone || !cached?.name || !cached?.promotionId) return;
  // Sélectionner la promo dans la grille
  document.querySelectorAll('.promo-select-item').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.promoId === cached.promotionId);
  });
  // Pré-remplir étape 2
  const nameEl  = document.getElementById('student-name');
  const phoneEl = document.getElementById('student-phone');
  if (nameEl)  nameEl.value  = cached.name;
  if (phoneEl) { phoneEl.value = cached.phone; onPhoneInput(phoneEl); }
  // Passer à l'étape 2 puis générer le code directement
  goToRegStep2();
  requestOTP();
}

function clearPhoneCache() {
  try { localStorage.removeItem(PHONE_CACHE_KEY); } catch(e) {}
  const qcDiv = document.getElementById('reg-quick-connect');
  if (qcDiv) { qcDiv.style.display = 'none'; qcDiv.innerHTML = ''; }
}

