// ══════════════════════════════════════════
//  JSONBIN — Base de données en ligne
// ══════════════════════════════════════════
const JSONBIN_ID  = "6a22a4cef5f4af5e29bd2e33";
const JSONBIN_KEY = "$2a$10$0C9F6sPdC03PqfZXnjTnked9IIpFlH/UHr7uKppJLmiaoXvhsw7RG";
const JSONBIN_URL = "https://api.jsonbin.io/v3/b/" + JSONBIN_ID;

// ══════════════════════════════════════════
//  DEFAULT DATA
// ══════════════════════════════════════════
const DATA_VERSION = 4;
const VERSION_KEY = 'hermes_data_version';
const DEFAULT_QUESTIONS = typeof CONCOURS_QUESTIONS !== 'undefined' ? CONCOURS_QUESTIONS : {};

const ICON_MAP = {
  '📝': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  '⚖️': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
  '🎤': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
  '🏛️': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  '🔢': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3 8 21"/><path d="M16 3l-2 18"/></svg>`,
  '💬': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  '🧠': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>`,
  '🇬🇧': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  '📜': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
  '📋': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
  '📊': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  '✅': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  '✏️': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>`,
  '🌐': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  '📖': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  '📚': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  '🎯': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
};
function iconHTML(icon, size) {
  const sz = size || 18;
  const svg = ICON_MAP[icon];
  if (!svg) return icon;
  return svg.replace(/width="18" height="18"/g, `width="${sz}" height="${sz}"`);
}

const DEFAULT_TOURS = [
  { id:'tour1', name:'1er tour', subtitle:'Culture générale, logique numérique & verbale, anglais, aptitude…', icon:'📝', order:1 },
  { id:'tour2', name:'2ème tour', subtitle:'Droit administratif & constitutionnel, résumé de texte, problèmes économiques et sociaux', icon:'⚖️', order:2 },
  { id:'tour3', name:'3ème partie — Oral', subtitle:'Préparation à l\'épreuve orale du concours', icon:'🎤', order:3 },
];

const DEFAULT_COURSES = [
  /* 1er tour */
  { id:'culture', tourId:'tour1', name:'Culture Générale', icon:'🏛️', color:'culture', desc:'Histoire, géographie, actualité', teacher:'M. Lefèvre', progress:72 },
  { id:'numerique', tourId:'tour1', name:'Logique Numérique', icon:'🔢', color:'numerique', desc:'Calcul, suites, problèmes', teacher:'Mme Moreau', progress:63 },
  { id:'verbale', tourId:'tour1', name:'Logique Verbale', icon:'💬', color:'verbale', desc:'Analogies, synonymes, compréhension', teacher:'Mme Martin', progress:80 },
  { id:'aptitude', tourId:'tour1', name:'Aptitude Verbale', icon:'🧠', color:'aptitude', desc:'Raisonnement et organisation', teacher:'M. Bernard', progress:55 },
  { id:'anglais', tourId:'tour1', name:'Anglais', icon:'🇬🇧', color:'anglais', desc:'Grammaire, vocabulaire, traduction', teacher:'Mme Johnson', progress:68 },
  /* 2ème tour */
  { id:'droit-administratif', tourId:'tour2', name:'Droit administratif', icon:'🏛️', color:'numerique', desc:'Actes administratifs, contentieux, service public', teacher:'Mme Moreau', progress:50 },
  { id:'droit-constitutionnel', tourId:'tour2', name:'Droit constitutionnel', icon:'📜', color:'verbale', desc:'Institutions, droits fondamentaux, Constitution', teacher:'M. Lefèvre', progress:45 },
  { id:'resume-texte', tourId:'tour2', name:'Résumé de texte', icon:'📋', color:'aptitude', desc:'Synthèse et reformulation', teacher:'M. Durand', progress:58 },
  { id:'problemes-eco-sociaux', tourId:'tour2', name:'Problèmes économiques & sociaux', icon:'📊', color:'anglais', desc:'Analyse de situations économiques et sociales', teacher:'Mme Bernard', progress:62 },
  /* 3ème partie — oral */
  { id:'oral', tourId:'tour3', name:'Épreuve orale', icon:'🎤', color:'culture', desc:'Expression orale, entretien avec le jury', teacher:'M. Diallo', progress:40 },
];

const DEFAULT_EXERCISE_TYPES = [
  { id:'qcm-culture', courseId:'culture', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'qcm-numerique', courseId:'numerique', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'qcm-verbale', courseId:'verbale', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'qcm-aptitude', courseId:'aptitude', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'qcm-anglais', courseId:'anglais', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'vf-culture', courseId:'culture', name:'Vrai / Faux', icon:'⚖️', desc:'Affirmations vraies ou fausses' },
  { id:'completer-verbale', courseId:'verbale', name:'Compléter', icon:'✏️', desc:'Compléter les phrases ou analogies' },
  { id:'traduction-anglais', courseId:'anglais', name:'Traduction', icon:'🌐', desc:'Traduction français-anglais' },
  { id:'qcm-droit-adm', courseId:'droit-administratif', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'qcm-droit-const', courseId:'droit-constitutionnel', name:'QCM', icon:'✅', desc:'Questions à choix multiples' },
  { id:'qcm-resume', courseId:'resume-texte', name:'Résumé', icon:'📋', desc:'Résumé et synthèse' },
  { id:'qcm-eco', courseId:'problemes-eco-sociaux', name:'Analyse', icon:'📊', desc:'Cas pratiques économiques et sociaux' },
  { id:'oral-entretien', courseId:'oral', name:'Entretien oral', icon:'🎤', desc:'Simulation d\'entretien' },
  { id:'oral-expression', courseId:'oral', name:'Expression orale', icon:'💬', desc:'Prise de parole et argumentation' },
];

const ADMIN_PASSWORD = 'hermes2024';
const STORAGE_KEY = 'hermes_knowledge_data';
const SESSION_KEY = 'hermes_session';
const REMEMBER_KEY = 'hermes_remember';
const SCREEN_KEY = 'hermes_screen_v1';
const PHONE_CACHE_KEY = 'hermes_phone_cache';
const PDF_DB_NAME = 'hermes_pdfs';
const PDF_STORE = 'pdfs';
if (typeof pdfjsLib !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

let appData = { tours: [], courses: [], exerciseTypes: [], questions: {}, users: [] };
let adminState = {
  selectedCourseId: null,
  adminView: 'dashboard',
  pendingPdf: null,
  pendingPdfName: null,
  pendingCourseVideo: null,
  pendingCourseVideoName: null,
  selectedExerciseCourseId: null,
  pendingExercisePdf: null,
  pendingExercisePdfName: null,
  pendingExerciseVideo: null,
  pendingExerciseVideoName: null,
};
let auth = { role: null, userId: null };
let state = {
  screen: 'login',
  selectedCat: 'culture',
  selectedTour: 'tour1',
  selectedExerciseType: null,
  selectedMode: 'training',
  selectedDiff: 'moyen',
  studyCourseId: null,
  questions: [],
  currentQ: 0,
  score: 0,
  totalScore: 0,
  answers: [],
  timerVal: 30,
  timerInterval: null,
  startTime: null,
  quizPlayed: 0,
  bestScore: 0,
  catScores: {},
  catPlayed: {},
  playerName: 'Candidat',
};

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

// ══════════════════════════════════════════════════
//  CONNEXION PAR CODE D'ACCÈS (nouveau système)
// ══════════════════════════════════════════════════
const CODE_CACHE_KEY = 'hermes_code_cache';

function onCodeInput(input) {
  let val = input.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 7);
  if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3);
  input.value = val;
}

function initLoginScreen() {
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(CODE_CACHE_KEY) || 'null'); } catch(e) {}
  const banner    = document.getElementById('quick-access-banner');
  const separator = document.getElementById('code-or-separator');
  const codeInput = document.getElementById('access-code-input');

  if (cached?.code && cached?.userId) {
    const user      = (appData.users || []).find(u => u.id === cached.userId);
    const codeEntry = (appData.accessCodes || []).find(c => c.code === cached.code);
    const promo     = codeEntry ? (appData.promotions || []).find(p => p.id === codeEntry.promotionId) : null;
    if (user && codeEntry && promo && promoStatus(promo) === 'active' && !user.suspended) {
      const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const av = document.getElementById('quick-user-avatar');
      const nm = document.getElementById('quick-user-name');
      if (av) av.textContent = initials;
      if (nm) nm.textContent = user.name;
      if (banner)    banner.style.display = 'block';
      if (separator) separator.style.display = 'flex';
      if (codeInput) codeInput.value = cached.code;
      return;
    }
  }
  if (banner)    banner.style.display = 'none';
  if (separator) separator.style.display = 'none';
  const errDiv = document.getElementById('code-login-error');
  if (errDiv) errDiv.style.display = 'none';
}

function studentLoginWithCode() {
  const codeInput    = document.getElementById('access-code-input');
  const nameInput    = document.getElementById('student-name-code');
  const rememberChk  = document.getElementById('remember-device-code');
  const errDiv       = document.getElementById('code-login-error');
  const errMsg       = document.getElementById('code-login-error-msg');

  function showErr(msg) {
    if (errMsg) errMsg.textContent = msg;
    if (errDiv) { errDiv.style.display = 'flex'; }
  }
  function hideErr() { if (errDiv) errDiv.style.display = 'none'; }
  hideErr();

  const code = (codeInput?.value || '').trim().toUpperCase();
  const name = (nameInput?.value || '').trim();

  if (!code || !/^HRM-[A-Z0-9]{4}$/.test(code)) {
    showErr('Format de code invalide. Exemple : HRM-A1B2');
    codeInput?.focus();
    return;
  }
  if (!name || name.split(/\s+/).filter(Boolean).length < 2) {
    showErr('Entrez votre prénom et votre nom de famille.');
    nameInput?.focus();
    return;
  }

  if (!appData.accessCodes) appData.accessCodes = [];
  const codeEntry = appData.accessCodes.find(c => c.code === code);
  if (!codeEntry) {
    showErr('Code d\'accès introuvable. Vérifiez et réessayez.');
    return;
  }

  const promo = (appData.promotions || []).find(p => p.id === codeEntry.promotionId);
  if (!promo || promoStatus(promo) !== 'active') {
    showErr('La promotion associée à ce code est clôturée. Contactez votre responsable.');
    return;
  }

  let user;
  if (!codeEntry.usedBy) {
    user = { id: genId('user'), name, promotionId: codeEntry.promotionId, createdAt: Date.now(),
             stats: { score: 0, xp: 0, streak: 0, completed: [] }, attendance: {} };
    appData.users.push(user);
    codeEntry.usedBy = user.id;
    saveAppData(false);
  } else {
    user = (appData.users || []).find(u => u.id === codeEntry.usedBy);
    if (!user) { showErr('Compte introuvable. Contactez votre administrateur.'); return; }
    if (user.name.toLowerCase().trim() !== name.toLowerCase()) {
      showErr('Le nom ne correspond pas à ce code. Vérifiez votre saisie.');
      return;
    }
    if (user.suspended) { showErr('Votre compte est suspendu. Contactez votre administrateur.'); return; }
    const userPromo = (appData.promotions || []).find(p => p.id === user.promotionId);
    if (userPromo && promoStatus(userPromo) === 'expired') {
      showErr('Votre promotion "' + userPromo.name + '" est clôturée.');
      return;
    }
  }

  auth.role   = 'student';
  auth.userId = user.id;
  const remember = rememberChk?.checked ? true : false;
  saveSession(remember);
  if (remember) {
    try { localStorage.setItem(CODE_CACHE_KEY, JSON.stringify({ code, userId: user.id })); } catch(e) {}
  }
  localStorage.removeItem('hermes_logged_out');
  enterStudentApp();
  showNotif('Bienvenue, ' + user.name.split(' ')[0] + ' !', 'success');
}

function quickLoginFromCache() {
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(CODE_CACHE_KEY) || 'null'); } catch(e) {}
  if (!cached?.userId || !cached?.code) return;
  const user = (appData.users || []).find(u => u.id === cached.userId);
  if (!user) { clearCodeCache(); return; }
  const codeEntry = (appData.accessCodes || []).find(c => c.code === cached.code);
  const promo = codeEntry ? (appData.promotions || []).find(p => p.id === codeEntry.promotionId) : null;
  if (!promo || promoStatus(promo) !== 'active') {
    clearCodeCache(); showNotif('Votre promotion est clôturée. Entrez un nouveau code.', 'error'); initLoginScreen(); return;
  }
  if (user.suspended) { showNotif('Votre compte est suspendu. Contactez votre administrateur.', 'error'); return; }
  auth.role   = 'student';
  auth.userId = user.id;
  saveSession(true);
  localStorage.removeItem('hermes_logged_out');
  enterStudentApp();
  showNotif('Bienvenue, ' + user.name.split(' ')[0] + ' !', 'success');
}

function clearCodeCache() {
  try { localStorage.removeItem(CODE_CACHE_KEY); } catch(e) {}
  const banner    = document.getElementById('quick-access-banner');
  const separator = document.getElementById('code-or-separator');
  if (banner)    banner.style.display = 'none';
  if (separator) separator.style.display = 'none';
}

function selectPromo(el) {
  document.querySelectorAll('.promo-select-item').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function goToRegStep2(fromStep3) {
  if (!fromStep3) {
    // Depuis étape 1 : vérifier sélection promo
    const selected = document.querySelector('.promo-select-item.selected');
    if (!selected) { showNotif('Veuillez choisir une promotion pour continuer.', 'error'); return; }
    const promoId = selected.dataset.promoId;
    const promo   = (appData.promotions || []).find(p => p.id === promoId);
    if (!promo) return;
    document.getElementById('reg-promo-summary-name').textContent = promo.name;
    document.getElementById('reg-promo-summary-sub').textContent  =
      (promo.year ? promo.year + ' · ' : '') + 'Clôture : ' + fmtDate(promo.endDate);
    document.getElementById('dot-step-1').className  = 'reg-step-dot done';
    document.getElementById('lbl-step-1').className  = 'reg-step-label done';
    document.getElementById('line-step-1').className = 'reg-step-line done';
  }
  document.getElementById('dot-step-2').className  = 'reg-step-dot active';
  document.getElementById('lbl-step-2').className  = 'reg-step-label active';
  document.getElementById('line-step-2').className = 'reg-step-line';
  document.getElementById('dot-step-3').className  = 'reg-step-dot';
  document.getElementById('lbl-step-3').className  = 'reg-step-label';
  document.getElementById('reg-step-1').style.display = 'none';
  document.getElementById('reg-step-2').style.display = 'block';
  document.getElementById('reg-step-3').style.display = 'none';
  if (!fromStep3) document.getElementById('student-name').focus();
}

function goToRegStep1() {
  document.getElementById('dot-step-1').className  = 'reg-step-dot active';
  document.getElementById('lbl-step-1').className  = 'reg-step-label active';
  document.getElementById('line-step-1').className = 'reg-step-line';
  document.getElementById('dot-step-2').className  = 'reg-step-dot';
  document.getElementById('lbl-step-2').className  = 'reg-step-label';
  document.getElementById('line-step-2').className = 'reg-step-line';
  document.getElementById('dot-step-3').className  = 'reg-step-dot';
  document.getElementById('lbl-step-3').className  = 'reg-step-label';
  document.getElementById('reg-step-1').style.display = 'block';
  document.getElementById('reg-step-2').style.display = 'none';
  document.getElementById('reg-step-3').style.display = 'none';
}

// ══════════════════════════════════════════
//  OTP — VÉRIFICATION TÉLÉPHONE
// ══════════════════════════════════════════
let _pendingOTP = null;
let _otpExpiry  = null;

function validatePhone(raw) {
  // CI : 0788816188 (10 chiffres locaux avec le 0)
  // International : +2250788816188 ou 002250788816188
  const c = raw.replace(/[\s\-\.]/g, '');
  return (
    /^0[0-9]{9}$/.test(c)          ||  // 0788816188  (10 chiffres, format local CI)
    /^\+2250[0-9]{9}$/.test(c)     ||  // +2250788816188
    /^002250[0-9]{9}$/.test(c)     ||  // 002250788816188
    /^2250[0-9]{9}$/.test(c)           // 2250788816188 (sans le +)
  );
}

function formatPhoneDisplay(raw) {
  // Affiche joliment : 0788816188 → 07 88 81 61 88
  const c = raw.replace(/[\s\-\.]/g, '');
  if (c.startsWith('+2250')) return c;
  if (c.startsWith('00225')) return '+' + c.slice(2);
  if (c.startsWith('2250'))  return '+' + c;
  if (c.startsWith('0') && c.length === 10) {
    return c.replace(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5');
  }
  return c;
}

function onPhoneInput(input) {
  const hint = document.getElementById('phone-hint');
  const field = document.getElementById('phone-field');
  const val = input.value;
  if (!val) {
    hint.style.color = '#94A3B8';
    hint.textContent = 'Format : 0788816188 (10 chiffres) ou +2250788816188';
    field.style.borderColor = '';
    return;
  }
  if (validatePhone(val)) {
    hint.style.color = '#16A34A';
    hint.textContent = '✓ Numéro valide';
    field.style.borderColor = '#86EFAC';
  } else {
    hint.style.color = '#EF4444';
    hint.textContent = 'Numéro invalide. Entrez 10 chiffres, ex : 0788816188';
    field.style.borderColor = '#FCA5A5';
  }
}

function validateFullName(name) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 && parts.every(p => p.length >= 2);
}

function normalizeStr(s) {
  return (s || '').toLowerCase().trim()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
}

function requestOTP() {
  const name  = document.getElementById('student-name').value.trim();
  const phone = document.getElementById('student-phone').value.trim();

  if (!validateFullName(name)) {
    showNotif('Entrez votre prénom et votre nom de famille (au moins 2 mots).', 'error');
    document.getElementById('student-name').focus();
    return;
  }
  if (!validatePhone(phone)) {
    showNotif('Numéro de téléphone invalide. Vérifiez le format.', 'error');
    document.getElementById('student-phone').focus();
    return;
  }

  // Bloquer si ce nom est déjà enregistré avec un numéro différent
  const nameOwner = (appData.users || []).find(u => normalizeStr(u.name) === normalizeStr(name));
  if (nameOwner && nameOwner.phone !== phone) {
    showNotif('Ce nom est déjà enregistré avec un autre numéro. Utilisez le numéro associé à votre compte.', 'error');
    document.getElementById('student-phone').focus();
    return;
  }
  // Info si ce numéro est utilisé par quelqu'un d'autre
  const phoneOwner = (appData.users || []).find(u => u.phone === phone);
  if (phoneOwner && normalizeStr(phoneOwner.name) !== normalizeStr(name)) {
    showNotif('Ce numéro appartient à un autre compte. Vérifiez votre numéro ou votre nom.', 'error');
    document.getElementById('student-phone').focus();
    return;
  }

  // Génération OTP 6 chiffres
  _pendingOTP = Math.floor(100000 + Math.random() * 900000).toString();
  _otpExpiry  = Date.now() + 10 * 60 * 1000;

  document.getElementById('otp-display-phone').textContent = formatPhoneDisplay(phone);

  // Passer à l'étape 3
  document.getElementById('dot-step-2').className  = 'reg-step-dot done';
  document.getElementById('lbl-step-2').className  = 'reg-step-label done';
  document.getElementById('line-step-2').className = 'reg-step-line done';
  document.getElementById('dot-step-3').className  = 'reg-step-dot active';
  document.getElementById('lbl-step-3').className  = 'reg-step-label active';
  document.getElementById('reg-step-2').style.display = 'none';
  document.getElementById('reg-step-3').style.display = 'block';

  // Vider champs OTP
  [0,1,2,3,4,5].forEach(i => {
    const el = document.getElementById('otp-' + i);
    if (el) { el.value = ''; el.className = 'otp-box'; }
  });
  document.getElementById('otp-error').style.display = 'none';

  // Afficher le code généré
  const codeEl = document.getElementById('otp-code-display');
  if (codeEl) codeEl.textContent = _pendingOTP;
  setTimeout(() => { const f = document.getElementById('otp-0'); if (f) f.focus(); }, 100);
}

function resendOTP() {
  _pendingOTP = Math.floor(100000 + Math.random() * 900000).toString();
  _otpExpiry  = Date.now() + 10 * 60 * 1000;
  [0,1,2,3,4,5].forEach(i => {
    const el = document.getElementById('otp-' + i);
    if (el) { el.value = ''; el.className = 'otp-box'; }
  });
  document.getElementById('otp-error').style.display = 'none';

  const codeEl = document.getElementById('otp-code-display');
  if (codeEl) codeEl.textContent = _pendingOTP;
  document.getElementById('otp-0').focus();
  showNotif('Nouveau code généré.', 'success');
}

function otpMove(input, idx) {
  input.value = input.value.replace(/[^0-9]/g, '').slice(-1);
  input.classList.toggle('filled', input.value.length > 0);
  if (input.value && idx < 5) {
    const next = document.getElementById('otp-' + (idx + 1));
    if (next) next.focus();
  }
  // Auto-vérifier quand les 6 cases sont remplies
  const all = [0,1,2,3,4,5].map(i => document.getElementById('otp-' + i)?.value || '');
  if (all.every(v => v.length === 1)) setTimeout(verifyOTP, 150);
}

function otpBack(input, idx) {
  if (event.key === 'Backspace' && !input.value && idx > 0) {
    const prev = document.getElementById('otp-' + (idx - 1));
    if (prev) { prev.value = ''; prev.classList.remove('filled'); prev.focus(); }
  }
}

function verifyOTP() {
  const entered = [0,1,2,3,4,5].map(i => document.getElementById('otp-' + i)?.value || '').join('');
  if (entered.length < 6) { showNotif('Entrez les 6 chiffres du code.', 'error'); return; }
  if (!_pendingOTP) { showNotif('Aucun code en attente. Recommencez.', 'error'); return; }
  if (Date.now() > _otpExpiry) {
    showNotif('Le code a expiré. Renvoyez un nouveau code.', 'error');
    document.getElementById('otp-error').style.display = 'none';
    return;
  }
  if (entered !== _pendingOTP) {
    [0,1,2,3,4,5].forEach(i => {
      const el = document.getElementById('otp-' + i);
      if (el) { el.className = 'otp-box error'; setTimeout(() => el.classList.remove('error'), 500); }
    });
    document.getElementById('otp-error').style.display = 'block';
    return;
  }
  // Code correct → connexion
  document.getElementById('otp-error').style.display = 'none';
  _pendingOTP = null;
  studentLogin();
}

// ══════════════════════════════════════════
//  PROMOTIONS — ADMIN
// ══════════════════════════════════════════
// ══════════════════════════════════════════
//  EMAIL OTP — Config EmailJS
// ══════════════════════════════════════════
const EJS_KEY = 'hermes_emailjs_config';

const EMAIL_TEMPLATE_TEXT = `Objet : Code de vérification - Les Cours Hermès

Bonjour {{to_name}},

Nous avons reçu une demande de connexion à votre espace Les Cours Hermès.

Votre code de vérification est :

{{otp_code}}

Ce code est valable pendant 10 minutes.

Pour des raisons de sécurité, ne communiquez jamais ce code à une autre personne.

Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail.

Cordialement,

L'équipe Les Cours Hermès
L'excellence au service de votre réussite à l'ENA`;

function copyEmailTemplate() {
  navigator.clipboard.writeText(EMAIL_TEMPLATE_TEXT).then(() => {
    const btn = document.getElementById('copy-template-btn');
    if (btn) {
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copié !';
      btn.style.background = '#DCFCE7'; btn.style.borderColor = '#86EFAC'; btn.style.color = '#166534';
      setTimeout(() => {
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier';
        btn.style.background = '#F1F5F9'; btn.style.borderColor = '#E2E8F0'; btn.style.color = '#374151';
      }, 2000);
    }
  }).catch(() => showNotif('Copiez manuellement le texte du template.', ''));
}

function loadEmailJSConfig() {
  try { return JSON.parse(localStorage.getItem(EJS_KEY) || 'null') || {}; } catch(e) { return {}; }
}
function saveEmailJSConfig() {
  const cfg = {
    publicKey:  (document.getElementById('ejs-public-key').value || '').trim(),
    serviceId:  (document.getElementById('ejs-service-id').value || '').trim(),
    templateId: (document.getElementById('ejs-template-id').value || '').trim(),
  };
  if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) {
    showNotif('Remplissez tous les champs EmailJS.', 'error'); return;
  }
  localStorage.setItem(EJS_KEY, JSON.stringify(cfg));
  if (typeof emailjs !== 'undefined') emailjs.init(cfg.publicKey);
  updateEmailJSBadge();
  showNotif('✅ Configuration EmailJS enregistrée.', 'success');
}
function updateEmailJSBadge() {
  const cfg = loadEmailJSConfig();
  const badge = document.getElementById('emailjs-status-badge');
  if (!badge) return;
  if (cfg.publicKey && cfg.serviceId && cfg.templateId) {
    badge.textContent = 'Configuré ✓';
    badge.style.background = '#DCFCE7'; badge.style.color = '#166534'; badge.style.borderColor = '#86EFAC';
  } else {
    badge.textContent = 'Non configuré';
    badge.style.background = '#FEF3C7'; badge.style.color = '#92400E'; badge.style.borderColor = '#FDE68A';
  }
}
function loadEmailJSConfigToForm() {
  const cfg = loadEmailJSConfig();
  const pk = document.getElementById('ejs-public-key');
  const si = document.getElementById('ejs-service-id');
  const ti = document.getElementById('ejs-template-id');
  if (pk) pk.value = cfg.publicKey || '';
  if (si) si.value = cfg.serviceId || '';
  if (ti) ti.value = cfg.templateId || '';
  updateEmailJSBadge();
  if (cfg.publicKey && typeof emailjs !== 'undefined') emailjs.init(cfg.publicKey);
}
async function testEmailJSConfig() {
  const cfg = loadEmailJSConfig();
  if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) {
    showNotif('Configurez EmailJS d\'abord.', 'error'); return;
  }
  const testCode = '123456';
  showNotif('⏳ Envoi de l\'e-mail de test…', '');
  const ok = await sendOTPEmail('lescourshermes@gmail.com', testCode, 'Test');
  if (ok) showNotif('✅ E-mail de test envoyé à lescourshermes@gmail.com', 'success');
  else showNotif('❌ Échec. Vérifiez vos identifiants EmailJS.', 'error');
}

// ══════════════════════════════════════════
//  EMAIL OTP — Génération & envoi
// ══════════════════════════════════════════
let _otpSession = { code: null, email: null, expires: null, role: null, trainerId: null, timerInterval: null };

function generateOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOTPEmail(toEmail, code, toName) {
  const cfg = loadEmailJSConfig();
  if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) return false;
  try {
    if (typeof emailjs === 'undefined') return false;
    emailjs.init(cfg.publicKey);
    await emailjs.send(cfg.serviceId, cfg.templateId, {
      to_email: toEmail,
      to_name: toName || toEmail,
      otp_code: code,
      from_name: 'Les Cours Hermès',
    });
    return true;
  } catch(e) {
    console.error('EmailJS error:', e);
    return false;
  }
}

function startOTPTimer(prefix) {
  if (_otpSession.timerInterval) clearInterval(_otpSession.timerInterval);
  let secondsLeft = 600;
  const timerEl = document.getElementById(prefix + '-otp-timer');
  function tick() {
    if (!timerEl) { clearInterval(_otpSession.timerInterval); return; }
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    timerEl.textContent = 'Expire dans ' + m + ':' + String(s).padStart(2, '0');
    if (secondsLeft <= 0) {
      clearInterval(_otpSession.timerInterval);
      timerEl.textContent = 'Code expiré';
      timerEl.style.color = '#EF4444';
      _otpSession.code = null;
    }
    secondsLeft--;
  }
  tick();
  _otpSession.timerInterval = setInterval(tick, 1000);
}

// ══ Navigations OTP ══
function otpMoveGen(prefix, input, idx) {
  input.value = input.value.replace(/\D/g, '');
  if (input.value && idx < 5) {
    const next = document.getElementById(prefix + '-otp-' + (idx + 1));
    if (next) next.focus();
  }
}
function otpBackGen(prefix, input, idx) {
  if (event.key === 'Backspace' && !input.value && idx > 0) {
    const prev = document.getElementById(prefix + '-otp-' + (idx - 1));
    if (prev) { prev.value = ''; prev.focus(); }
  }
  if (event.key === 'Enter') {
    if (prefix === 'admin') verifyAdminOTP();
    else verifyTrainerOTP();
  }
}
function getOTPValue(prefix) {
  return [0,1,2,3,4,5].map(i => {
    const el = document.getElementById(prefix + '-otp-' + i);
    return el ? el.value : '';
  }).join('');
}
function clearOTPInputs(prefix) {
  [0,1,2,3,4,5].forEach(i => {
    const el = document.getElementById(prefix + '-otp-' + i);
    if (el) el.value = '';
  });
  const first = document.getElementById(prefix + '-otp-0');
  if (first) first.focus();
}

// ══ ADMIN — Login OTP ══
async function requestAdminOTP(resend) {
  const email = (document.getElementById('admin-email-input').value || '').trim().toLowerCase();
  const errEl = document.getElementById('admin-email-error');
  if (!email || !email.includes('@')) {
    if (errEl) { errEl.textContent = 'Saisissez une adresse e-mail valide.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';
  const btn = document.getElementById('admin-send-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }
  const code = generateOTP();
  _otpSession = { code, email, expires: Date.now() + 600000, role: 'admin', trainerId: null, timerInterval: null };
  const cfg = loadEmailJSConfig();
  let sent = false;
  if (cfg.publicKey && cfg.serviceId && cfg.templateId) {
    sent = await sendOTPEmail(email, code, 'Administrateur');
  }
  if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Recevoir le code'; }
  const disp = document.getElementById('admin-otp-email-display');
  if (disp) disp.textContent = email;
  document.getElementById('admin-step-email').style.display = 'none';
  document.getElementById('admin-step-otp').style.display = '';
  const testBox = document.getElementById('admin-test-code-box');
  const testDisp = document.getElementById('admin-test-code-display');
  if (!sent && testBox && testDisp) {
    testBox.style.display = 'block';
    testDisp.textContent = code;
  } else if (testBox) {
    testBox.style.display = 'none';
    showNotif('✅ Code envoyé à ' + email, 'success');
  }
  clearOTPInputs('admin');
  startOTPTimer('admin');
}
function adminOTPBack() {
  if (_otpSession.timerInterval) clearInterval(_otpSession.timerInterval);
  _otpSession.code = null;
  document.getElementById('admin-step-email').style.display = '';
  document.getElementById('admin-step-otp').style.display = 'none';
  const tb = document.getElementById('admin-test-code-box');
  if (tb) tb.style.display = 'none';
}
function verifyAdminOTP() {
  const entered = getOTPValue('admin');
  const errEl = document.getElementById('admin-otp-error');
  if (entered.length < 6) {
    if (errEl) { errEl.textContent = 'Saisissez les 6 chiffres du code.'; errEl.style.display = 'block'; } return;
  }
  if (!_otpSession.code) {
    if (errEl) { errEl.textContent = 'Le code a expiré. Renvoyez-en un.'; errEl.style.display = 'block'; } return;
  }
  if (Date.now() > _otpSession.expires) {
    if (errEl) { errEl.textContent = 'Le code a expiré. Cliquez sur « Renvoyer ».'; errEl.style.display = 'block'; }
    _otpSession.code = null; return;
  }
  if (entered !== _otpSession.code) {
    if (errEl) { errEl.textContent = 'Code incorrect. Vérifiez votre boîte mail.'; errEl.style.display = 'block'; }
    clearOTPInputs('admin'); return;
  }
  if (errEl) errEl.style.display = 'none';
  if (_otpSession.timerInterval) clearInterval(_otpSession.timerInterval);
  _otpSession.code = null;
  auth.role = 'admin'; auth.userId = null;
  saveSession();
  document.body.classList.remove('direct-link-mode');
  history.replaceState(null, '', location.pathname);
  adminOTPBack();
  document.getElementById('admin-email-input').value = '';
  enterAdminApp();
}

// ══ TRAINER — Login OTP ══
async function requestTrainerOTP(resend) {
  const email = (document.getElementById('trainer-email-input').value || '').trim().toLowerCase();
  const errEl = document.getElementById('trainer-email-error');
  if (!email || !email.includes('@')) {
    if (errEl) { errEl.textContent = 'Saisissez une adresse e-mail valide.'; errEl.style.display = 'block'; }
    return;
  }
  const trainer = (appData.trainers || []).find(t => t.email === email);
  if (!trainer) {
    if (errEl) { errEl.textContent = 'Aucun formateur trouvé avec cet e-mail. Contactez l\'administrateur.'; errEl.style.display = 'block'; }
    return;
  }
  if (errEl) errEl.style.display = 'none';
  const code = generateOTP();
  _otpSession = { code, email, expires: Date.now() + 600000, role: 'trainer', trainerId: trainer.id, timerInterval: null };
  const cfg = loadEmailJSConfig();
  let sent = false;
  if (cfg.publicKey && cfg.serviceId && cfg.templateId) {
    sent = await sendOTPEmail(email, code, trainer.name);
  }
  const disp = document.getElementById('trainer-otp-email-display');
  if (disp) disp.textContent = email;
  document.getElementById('trainer-step-email').style.display = 'none';
  document.getElementById('trainer-step-otp').style.display = '';
  const testBox = document.getElementById('trainer-test-code-box');
  const testDisp = document.getElementById('trainer-test-code-display');
  if (!sent && testBox && testDisp) {
    testBox.style.display = 'block';
    testDisp.textContent = code;
  } else if (testBox) {
    testBox.style.display = 'none';
    showNotif('✅ Code envoyé à ' + email, 'success');
  }
  clearOTPInputs('trainer');
  startOTPTimer('trainer');
}
function trainerOTPBack() {
  if (_otpSession.timerInterval) clearInterval(_otpSession.timerInterval);
  _otpSession.code = null;
  document.getElementById('trainer-step-email').style.display = '';
  document.getElementById('trainer-step-otp').style.display = 'none';
  const tb = document.getElementById('trainer-test-code-box');
  if (tb) tb.style.display = 'none';
}
function verifyTrainerOTP() {
  const entered = getOTPValue('trainer');
  const errEl = document.getElementById('trainer-otp-error');
  if (entered.length < 6) {
    if (errEl) { errEl.textContent = 'Saisissez les 6 chiffres du code.'; errEl.style.display = 'block'; } return;
  }
  if (!_otpSession.code) {
    if (errEl) { errEl.textContent = 'Le code a expiré. Renvoyez-en un.'; errEl.style.display = 'block'; } return;
  }
  if (Date.now() > _otpSession.expires) {
    if (errEl) { errEl.textContent = 'Code expiré. Cliquez sur « Renvoyer ».'; errEl.style.display = 'block'; }
    _otpSession.code = null; return;
  }
  if (entered !== _otpSession.code) {
    if (errEl) { errEl.textContent = 'Code incorrect. Vérifiez votre boîte mail.'; errEl.style.display = 'block'; }
    clearOTPInputs('trainer'); return;
  }
  if (errEl) errEl.style.display = 'none';
  if (_otpSession.timerInterval) clearInterval(_otpSession.timerInterval);
  const trainer = (appData.trainers || []).find(t => t.id === _otpSession.trainerId);
  _otpSession.code = null;
  if (!trainer) { showNotif('Formateur introuvable.', 'error'); return; }
  auth.role = 'trainer'; auth.userId = trainer.id;
  saveSession();
  document.body.classList.remove('direct-link-mode');
  history.replaceState(null, '', location.pathname);
  trainerOTPBack();
  document.getElementById('trainer-email-input').value = '';
  enterTrainerApp();
}

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

// ══════════════════════════════════════════
//  TRAINER — AUTH & APP
// ══════════════════════════════════════════
function trainerLogin() {
  const login    = (document.getElementById('trainer-login-field').value || '').trim();
  const password = (document.getElementById('trainer-password-field').value || '').trim();
  const errEl    = document.getElementById('trainer-login-error');
  const setErr   = msg => { if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; } };
  if (errEl) errEl.style.display = 'none';
  if (!login || !password) { setErr('Remplissez tous les champs.'); return; }
  const trainer = (appData.trainers || []).find(
    t => t.login.toLowerCase() === login.toLowerCase() && t.password === password
  );
  if (!trainer) { setErr('Identifiant ou mot de passe incorrect.'); return; }
  auth.role   = 'trainer';
  auth.userId = trainer.id;
  saveSession();
  document.body.classList.remove('direct-link-mode');
  history.replaceState(null, '', location.pathname);
  document.getElementById('trainer-login-field').value = '';
  document.getElementById('trainer-password-field').value = '';
  enterTrainerApp();
}

function trainerLogout() {
  clearInterval(_presenceRefresh);  _presenceRefresh  = null;
  clearInterval(_sessionCountdown); _sessionCountdown = null;
  clearSession();
  document.getElementById('trainer-app').classList.remove('active');
  showLoginScreen();
}

function enterTrainerApp() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('student-app').style.display = 'none';
  document.getElementById('admin-app').classList.remove('active');
  document.getElementById('bottom-nav') && (document.getElementById('bottom-nav').style.display = 'none');
  document.getElementById('trainer-app').classList.add('active');
  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  if (trainer) {
    const nameEl = document.getElementById('trainer-topbar-name');
    if (nameEl) nameEl.style.display = 'none';
    const sbName = document.getElementById('trainer-sidebar-name');
    if (sbName) sbName.style.display = 'none';
    const sbRole = document.getElementById('trainer-sidebar-specialty');
    if (sbRole) sbRole.textContent = trainer.specialty || 'Formateur';
    // Avatar initiales sidebar
    const avatarEl = document.getElementById('trainer-sidebar-avatar');
    if (avatarEl) {
      const initials = trainer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      avatarEl.textContent = initials;
      avatarEl.style.background = 'linear-gradient(135deg,#2d6a4f,#40916c)';
    }
    // Topbar profil
    const tbName = document.getElementById('trainer-topbar-name-display');
    if (tbName) tbName.textContent = trainer.name;
    const tbRole = document.getElementById('trainer-topbar-role-display');
    if (tbRole) tbRole.textContent = trainer.specialty || 'Formatrice';
    const tbAvatar = document.getElementById('trainer-topbar-avatar-display');
    if (tbAvatar) tbAvatar.textContent = trainer.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }
  switchTrainerView('dashboard');
}

function switchTrainerView(view) {
  try { localStorage.setItem(SCREEN_KEY, 'trainer:' + view); } catch(e) {}
  document.querySelectorAll('.trainer-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('[data-trainer-view]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.trainerView === view);
  });
  // Auto-open accordion if active sub-item is inside it
  document.querySelectorAll('#trainer-drawer .drawer-accordion').forEach(acc => {
    if (acc.querySelector('.drawer-accordion-item.active')) acc.classList.add('open');
  });
  closeTrainerDrawer();
  const el = document.getElementById('trainer-view-' + view);
  if (el) el.classList.add('active');
  if (view === 'dashboard')   renderTrainerDashboard();
  if (view === 'courses')     renderTrainerCoursesList();
  if (view === 'exercises')   renderTrainerExercisesList();
  if (view === 'results')     renderTrainerResults();
  if (view === 'assessments') renderTrainerAssessments();
  if (view === 'live')        renderTrainerLiveView();
  if (view === 'recordings')  renderTrainerRecordingsView();
  if (view === 'presence') {
    renderTrainerPresence();
    clearInterval(_presenceRefresh);
    // Actualisation toutes les 15 s : met à jour attendees + re-render
    _presenceRefresh = setInterval(() => {
      // Recharger la liste des utilisateurs en cas de nouvelle inscription depuis un autre onglet
      try {
        const _fr = localStorage.getItem(STORAGE_KEY);
        if (_fr) { const _fd = JSON.parse(_fr); if (_fd.users) appData.users = _fd.users; }
      } catch(_e) {}
      const s = getMyActiveSession();
      if (s) updateSessionAttendees(s);
      renderTrainerPresence();
    }, 15 * 1000);
  } else {
    clearInterval(_presenceRefresh); _presenceRefresh = null;
    clearInterval(_sessionCountdown); _sessionCountdown = null;
  }

  // Mettre à jour le badge "LIVE" dans la sidebar
  const liveSession = (appData.liveSessions||[]).find(s=>s.status==='active'&&s.trainerId===auth.userId);
  const liveBadge = document.getElementById('live-sidebar-active-badge');
  if (liveBadge) liveBadge.style.display = liveSession ? 'inline-flex' : 'none';
  const liveMobBadge = document.getElementById('live-mob-badge');
  if (liveMobBadge) liveMobBadge.style.display = liveSession ? 'block' : 'none';
}

function getTrainerCourses() {
  return (appData.courses || []).filter(c => c.trainerId === auth.userId);
}

function getTrainerExercises() {
  return (appData.exerciseTypes || []).filter(e => e.trainerId === auth.userId);
}

function renderTrainerDashboard() {
  const el = document.getElementById('trainer-dashboard-content');
  if (!el) return;

  // ── Données réelles des pages de navigation ──
  const courses   = getTrainerCourses();                                        // page "Mes Cours"
  const exercises = getTrainerExercises();                                      // page "Mes Exercices"
  const users     = (appData.users || []).sort((a,b)=>(b.totalScore||0)-(a.totalScore||0)); // page "Résultats"
  const sessions  = (appData.sessions||[]).filter(s=>s.trainerId===auth.userId)  // page "Présence"
                      .sort((a,b)=>(b.startedAt||0)-(a.startedAt||0));

  const curTrainer  = (appData.trainers||[]).find(t=>t.id===auth.userId);
  const firstName   = curTrainer ? curTrainer.name.split(' ')[0] : 'Formateur';

  function fmtAge(ts) {
    if (!ts) return '';
    const m = Math.floor((Date.now()-ts)/60000);
    if (m < 60) return 'Il y a ' + m + 'min';
    const h = Math.floor(m/60);
    if (h < 24) return 'Il y a ' + h + 'h';
    return 'Il y a ' + Math.floor(h/24) + 'j';
  }

  function fmtDate(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('fr-FR', {day:'2-digit',month:'short'});
  }

  // ── Tour helpers (depuis "Mes Cours") ──
  const tourCfg = {
    tour1: {label:'1er Tour',  color:'#0D47A1', bg:'#EFF6FF'},
    tour2: {label:'2ème Tour', color:'#00796B', bg:'#E8F5E9'},
    tour3: {label:'3ème Tour', color:'#C62828', bg:'#FFEBEE'},
  };

  // ══════════════════════════════════════════
  //  WIDGET 1 — MES FORMATIONS (= "Mes Cours")
  // ══════════════════════════════════════════
  let formationsHTML = '';
  const displayCourses = courses.slice(-4).reverse();
  if (!displayCourses.length) {
    formationsHTML = '<div style="text-align:center;padding:2rem 0;color:#aaa;font-size:0.82rem;">' +
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 0.5rem;display:block;"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>' +
      'Aucun cours ajouté.<br><span style="font-size:0.72rem;">Utilisez « Mes Cours » pour commencer.</span></div>';
  } else {
    displayCourses.forEach(c => {
      const tc = tourCfg[c.tourId] || tourCfg.tour1;
      const fileBadge = c.pdfName
        ? '<span style="background:#EFF6FF;color:#1565C0;border-radius:50px;padding:0.1rem 0.45rem;font-size:0.63rem;font-weight:700;">PDF</span>'
        : c.videoFileName
          ? '<span style="background:#FFEBEE;color:#C62828;border-radius:50px;padding:0.1rem 0.45rem;font-size:0.63rem;font-weight:700;">Vidéo</span>'
          : '<span style="background:#f5f5f5;color:#bbb;border-radius:50px;padding:0.1rem 0.45rem;font-size:0.63rem;font-weight:600;">Aucun fichier</span>';
      const hasFile = !!(c.pdfName || c.videoFileName);
      formationsHTML +=
        '<div onclick="switchTrainerView(\'courses\')" style="display:flex;align-items:center;gap:0.75rem;padding:0.65rem 0;border-bottom:1px solid #f5f5f5;cursor:pointer;">' +
          '<div style="width:38px;height:38px;background:' + tc.bg + ';border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;border-left:3px solid ' + tc.color + ';">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="' + tc.color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:0.8rem;font-weight:600;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + c.name + '</div>' +
            '<div style="display:flex;align-items:center;gap:0.35rem;margin-top:0.25rem;flex-wrap:wrap;">' +
              '<span style="background:' + tc.bg + ';color:' + tc.color + ';border-radius:50px;padding:0.1rem 0.45rem;font-size:0.63rem;font-weight:700;">' + tc.label + '</span>' +
              fileBadge +
            '</div>' +
          '</div>' +
          '<div style="width:10px;height:10px;border-radius:50%;background:' + (hasFile ? '#22C55E' : '#e0e0e0') + ';flex-shrink:0;" title="' + (hasFile ? 'Contenu disponible' : 'Pas de fichier') + '"></div>' +
        '</div>';
    });
  }

  // ══════════════════════════════════════════
  //  WIDGET 2 — APPRENANTS  (= "Résultats")
  // ══════════════════════════════════════════
  const totalScore = users.reduce((s,u)=>s+(u.totalScore||0),0);
  const avgScore   = users.length ? Math.round(totalScore/users.length) : 0;
  const totalQuiz  = users.reduce((s,u)=>s+(u.quizPlayed||0),0);
  const maxScore   = users.length ? (users[0].totalScore||1) : 1;
  const topUsers   = users.slice(0,5);

  let learnersChart = '';
  if (!users.length) {
    learnersChart = '<div style="text-align:center;padding:1.25rem 0;color:#aaa;font-size:0.78rem;">Aucun apprenant inscrit.</div>';
  } else {
    topUsers.forEach((u,i) => {
      const initials = (u.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
      const score    = u.totalScore || 0;
      const pct      = Math.round((score / maxScore) * 100);
      const avatarColors = ['#2d6a4f','#0D47A1','#8b5cf6','#e8748a','#d97706'];
      learnersChart +=
        '<div style="display:flex;align-items:center;gap:0.55rem;margin-bottom:0.5rem;">' +
          '<div style="width:26px;height:26px;border-radius:50%;background:' + avatarColors[i%5] + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;flex-shrink:0;">' + initials + '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:0.7rem;font-weight:600;color:#334155;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:0.18rem;">' + u.name + '</div>' +
            '<div style="height:5px;background:#f0f0f0;border-radius:3px;overflow:hidden;">' +
              '<div style="height:100%;width:' + pct + '%;background:' + avatarColors[i%5] + ';border-radius:3px;transition:width 0.4s;"></div>' +
            '</div>' +
          '</div>' +
          '<div style="font-size:0.68rem;font-weight:700;color:#555;flex-shrink:0;min-width:36px;text-align:right;">' + score + ' pts</div>' +
        '</div>';
    });
  }

  // ══════════════════════════════════════════
  //  WIDGET 3 — MES ACTIVITÉS  (= "Présence" + ajouts récents)
  // ══════════════════════════════════════════
  let activitiesHTML = '';
  const recentSessions = sessions.slice(0,3);

  // Séances récentes (page Présence)
  recentSessions.forEach(s => {
    const attendees  = Object.values(s.attendees||{});
    const present    = attendees.filter(a=>a.status==='present').length;
    const total      = attendees.length;
    const rate       = total > 0 ? Math.round(present/total*100) : 0;
    const rateColor  = rate>=80?'#2d6a4f':rate>=50?'#d97706':'#e8748a';
    const statusDot  = s.status==='active' ? '#22C55E' : '#aaa';
    activitiesHTML +=
      '<div onclick="switchTrainerView(\'presence\')" style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.58rem 0;border-bottom:1px solid #f5f5f5;cursor:pointer;">' +
        '<div style="width:34px;height:34px;border-radius:9px;background:#e8f4ef;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="display:flex;align-items:center;gap:0.35rem;margin-bottom:0.1rem;">' +
            '<div style="width:7px;height:7px;border-radius:50%;background:' + statusDot + ';flex-shrink:0;"></div>' +
            '<div style="font-size:0.78rem;font-weight:600;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + s.label + '</div>' +
          '</div>' +
          '<div style="font-size:0.68rem;color:#aaa;">' + (s.promotionName||'–') + ' · ' +
            '<span style="font-weight:700;color:' + rateColor + ';">' + present + '/' + total + ' présents (' + rate + '%)</span>' +
          '</div>' +
        '</div>' +
        '<div style="font-size:0.65rem;color:#bbb;flex-shrink:0;white-space:nowrap;">' + fmtDate(s.startedAt) + '</div>' +
      '</div>';
  });

  // Compléter avec ajouts récents de cours/exercices si besoin
  if (activitiesHTML.length < 1 || recentSessions.length < 2) {
    const recent = [
      ...[...courses].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,2)
         .map(c=>({icon:'doc',color:'green',title:c.name,desc:'Cours ajouté',time:fmtAge(c.createdAt)})),
      ...[...exercises].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,2)
         .map(e=>({icon:'check',color:'pink',title:e.name,desc:'Exercice ajouté',time:fmtAge(e.createdAt)})),
    ];
    recent.slice(0, 4 - recentSessions.length).forEach(a => {
      const bg    = a.color==='green' ? '#e8f4ef' : '#fce8ee';
      const ic    = a.color==='green' ? '#2d6a4f' : '#e8748a';
      const path  = a.icon==='doc'
        ? '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'
        : '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>';
      activitiesHTML +=
        '<div style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.58rem 0;border-bottom:1px solid #f5f5f5;">' +
          '<div style="width:34px;height:34px;border-radius:9px;background:' + bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="' + ic + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + path + '</svg>' +
          '</div>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-size:0.78rem;font-weight:600;color:#1a1a2e;margin-bottom:0.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + a.title + '</div>' +
            '<div style="font-size:0.68rem;color:#aaa;">' + a.desc + '</div>' +
          '</div>' +
          (a.time ? '<div style="font-size:0.65rem;color:#bbb;flex-shrink:0;white-space:nowrap;">' + a.time + '</div>' : '') +
        '</div>';
    });
  }
  if (!activitiesHTML) {
    activitiesHTML = '<div style="text-align:center;padding:2rem 0;color:#aaa;font-size:0.78rem;">Aucune activité récente.</div>';
  }

  // ══════════════════════════════════════════
  //  QUICK ACTIONS (compteurs réels)
  // ══════════════════════════════════════════
  const actions = [
    {bg:'#e8f4ef',ic:'#2d6a4f',count:courses.length,unit:'cours',title:'Mes formations',desc:'Créer ou gérer mes cours PDF / Vidéo',view:'courses',svg:'<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>'},
    {bg:'#fce8ee',ic:'#e8748a',count:users.length,unit:'apprenants',title:'Résultats',desc:'Scores et progression des apprenants',view:'results',svg:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'},
    {bg:'#e8f4ef',ic:'#2d6a4f',count:exercises.length,unit:'exercices',title:'Mes exercices',desc:'Ajouter des exercices liés aux cours',view:'exercises',svg:'<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>'},
    {bg:'#fce8ee',ic:'#e8748a',count:sessions.length,unit:'séances',title:'Présence',desc:'Lancer une séance et suivre la présence',view:'presence',svg:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><circle cx="19" cy="11" r="2" fill="currentColor"/>'},
  ];
  let actionsHTML = '';
  actions.forEach(a => {
    actionsHTML +=
      '<div onclick="switchTrainerView(\'' + a.view + '\')" style="background:#fff;border-radius:14px;padding:1.1rem 1.2rem;display:flex;align-items:center;gap:0.85rem;cursor:pointer;border:1px solid #f0f0f0;transition:box-shadow 0.15s,transform 0.15s;" onmouseover="this.style.boxShadow=\'0 4px 18px rgba(0,0,0,0.09)\';this.style.transform=\'translateY(-1px)\'" onmouseout="this.style.boxShadow=\'\';this.style.transform=\'\'">' +
        '<div style="width:46px;height:46px;background:' + a.bg + ';border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + a.ic + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + a.svg + '</svg>' +
        '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:0.84rem;font-weight:600;color:#1a1a2e;margin-bottom:0.1rem;">' + a.title + '</div>' +
          '<div style="font-size:0.68rem;color:#aaa;line-height:1.3;">' + a.desc + '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0;">' +
          '<div style="font-size:1.35rem;font-weight:800;color:' + a.ic + ';line-height:1;">' + a.count + '</div>' +
          '<div style="font-size:0.6rem;color:#bbb;">' + a.unit + '</div>' +
        '</div>' +
      '</div>';
  });

  // ══════════════════════════════════════════
  //  FEATURES FOOTER
  // ══════════════════════════════════════════
  const features = [
    {title:'Pédagogie active',    desc:'Des méthodes interactives et engageantes', svg:'<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'},
    {title:'Suivi personnalisé',  desc:'Chaque apprenant est unique',             svg:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>'},
    {title:'Outils professionnels',desc:'Des ressources modernes et efficaces',   svg:'<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'},
    {title:'Résultats mesurables', desc:'Des compétences qui font la différence', svg:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'},
  ];
  let featuresHTML = '';
  features.forEach(f => {
    featuresHTML +=
      '<div style="text-align:center;">' +
        '<div style="width:42px;height:42px;background:#e8f4ef;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 0.42rem;">' +
          '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + f.svg + '</svg>' +
        '</div>' +
        '<div style="font-size:0.73rem;font-weight:700;color:#1a1a2e;margin-bottom:0.15rem;">' + f.title + '</div>' +
        '<div style="font-size:0.63rem;color:#aaa;line-height:1.4;">' + f.desc + '</div>' +
      '</div>';
  });

  // ══════════════════════════════════════════
  //  ASSEMBLAGE FINAL
  // ══════════════════════════════════════════
  el.innerHTML =
    '<div style="padding-bottom:1.5rem;">' +

    /* ── QUICK ACTIONS (avec compteurs réels) ── */
    '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem;">' + actionsHTML + '</div>' +

    /* ── 3 COLONNES ── */
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;margin-bottom:1.5rem;">' +

      /* ① Mes Cours */
      '<div style="background:#fff;border-radius:14px;padding:1.4rem;border:1px solid #f0f0f0;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">' +
          '<span style="font-size:1rem;font-weight:700;color:#1a1a2e;">Mes formations</span>' +
          '<a href="#" onclick="switchTrainerView(\'courses\');return false;" style="font-size:0.75rem;color:#e8748a;text-decoration:none;font-weight:500;">Voir toutes</a>' +
        '</div>' +
        formationsHTML +
        (courses.length > 0 ? '<div style="margin-top:0.6rem;font-size:0.68rem;color:#aaa;text-align:right;">' + courses.length + ' cours au total · ' + exercises.length + ' exercice' + (exercises.length!==1?'s':'') + '</div>' : '') +
      '</div>' +

      /* ② Résultats / Apprenants */
      '<div style="background:#fff;border-radius:14px;padding:1.4rem;border:1px solid #f0f0f0;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.85rem;">' +
          '<span style="font-size:1rem;font-weight:700;color:#1a1a2e;">Apprenants</span>' +
          '<a href="#" onclick="switchTrainerView(\'results\');return false;" style="font-size:0.75rem;color:#e8748a;text-decoration:none;font-weight:500;">Voir tous</a>' +
        '</div>' +
        /* Stats bar */
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem;margin-bottom:1rem;">' +
          '<div style="background:#f8f9fa;border-radius:10px;padding:0.55rem;text-align:center;">' +
            '<div style="font-size:1.3rem;font-weight:800;color:#1a1a2e;line-height:1;">' + users.length + '</div>' +
            '<div style="font-size:0.6rem;color:#aaa;margin-top:0.15rem;">inscrits</div>' +
          '</div>' +
          '<div style="background:#f8f9fa;border-radius:10px;padding:0.55rem;text-align:center;">' +
            '<div style="font-size:1.3rem;font-weight:800;color:#2d6a4f;line-height:1;">' + avgScore + '</div>' +
            '<div style="font-size:0.6rem;color:#aaa;margin-top:0.15rem;">pts moy.</div>' +
          '</div>' +
          '<div style="background:#f8f9fa;border-radius:10px;padding:0.55rem;text-align:center;">' +
            '<div style="font-size:1.3rem;font-weight:800;color:#e8748a;line-height:1;">' + totalQuiz + '</div>' +
            '<div style="font-size:0.6rem;color:#aaa;margin-top:0.15rem;">quiz joués</div>' +
          '</div>' +
        '</div>' +
        /* Classement top 5 */
        (users.length ? '<div style="font-size:0.68rem;font-weight:700;color:#aaa;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:0.5rem;">Top apprenants</div>' : '') +
        learnersChart +
      '</div>' +

      /* ③ Présence / Activités */
      '<div style="background:#fff;border-radius:14px;padding:1.4rem;border:1px solid #f0f0f0;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">' +
          '<span style="font-size:1rem;font-weight:700;color:#1a1a2e;">Mes activités</span>' +
          '<a href="#" onclick="switchTrainerView(\'presence\');return false;" style="font-size:0.75rem;color:#e8748a;text-decoration:none;font-weight:500;">Présence</a>' +
        '</div>' +
        activitiesHTML +
        (sessions.length ? '<div style="margin-top:0.6rem;font-size:0.68rem;color:#aaa;text-align:right;">' + sessions.length + ' séance' + (sessions.length!==1?'s':'') + ' au total</div>' : '') +
      '</div>' +

    '</div>' + /* /3 colonnes */

    /* ── FOOTER ── */
    '<div style="background:#fff;border-radius:14px;padding:1.5rem 2rem;display:flex;align-items:center;gap:2.5rem;border:1px solid #f0f0f0;flex-wrap:wrap;">' +
      '<div style="flex-shrink:0;max-width:240px;">' +
        '<div style="font-size:2rem;color:#f4a5b0;line-height:1;margin-bottom:0.3rem;font-family:Georgia,serif;">"</div>' +
        '<div style="font-size:0.79rem;color:#555;font-style:italic;line-height:1.6;margin-bottom:0.3rem;">La formation est l\'arme la plus puissante que vous pouvez utiliser pour changer le monde.</div>' +
        '<div style="font-size:0.68rem;color:#aaa;font-weight:500;">– Nelson Mandela</div>' +
      '</div>' +
      '<div style="width:1px;height:72px;background:#eee;flex-shrink:0;"></div>' +
      '<div style="flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;min-width:280px;">' + featuresHTML + '</div>' +
    '</div>' +

    '</div>'; /* /padding-bottom */
}

function renderTrainerCoursesList(filteredList) {
  const list = document.getElementById('trainer-courses-list');
  if (!list) return;
  const allCourses = getTrainerCourses();
  const courses = filteredList !== undefined ? filteredList : allCourses;

  // Compteur
  const countEl = document.getElementById('trainer-courses-count');
  if (countEl) countEl.textContent = allCourses.length + ' cours';

  // Remplir le select exercices
  const sel = document.getElementById('texercise-course');
  if (sel) {
    sel.innerHTML = allCourses.length
      ? allCourses.map(c => `<option value="${c.id}">${c.name}</option>`).join('')
      : '<option value="">— Aucun cours —</option>';
  }

  if (!courses.length) {
    list.innerHTML = `<div style="text-align:center;padding:3rem 1rem;background:#F8FAFC;border:1.5px dashed #E2E8F0;border-radius:16px;">
      <div style="margin-bottom:0.75rem;display:flex;justify-content:center;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
      <div style="font-weight:700;color:#334155;font-size:0.9rem;margin-bottom:0.3rem;">${filteredList !== undefined ? 'Aucun résultat' : 'Aucun cours ajouté'}</div>
      <div style="color:#94A3B8;font-size:0.8rem;">${filteredList !== undefined ? 'Essayez un autre terme.' : 'Cliquez sur « Ajouter un cours » pour commencer.'}</div>
    </div>`;
    return;
  }

  const tourColors = { tour1:'#0D47A1', tour2:'#00796B', tour3:'#C62828' };
  const tourLabels = { tour1:'1er Tour', tour2:'2ème Tour', tour3:'3ème Tour' };

  list.innerHTML = '<div style="display:flex;flex-direction:column;gap:0.7rem;">' +
    courses.map(c => {
      const accent = tourColors[c.tourId || 'tour1'] || '#0D47A1';
      const tourLabel = tourLabels[c.tourId || 'tour1'] || '1er Tour';
      const fileBadge = c.pdfName
        ? `<span style="background:#EFF6FF;color:#1565C0;border-radius:50px;padding:0.15rem 0.55rem;font-size:0.7rem;font-weight:600;display:inline-flex;align-items:center;gap:0.3rem;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>${c.pdfName}</span>`
        : c.videoFileName
          ? `<span style="background:#FFEBEE;color:#C62828;border-radius:50px;padding:0.15rem 0.55rem;font-size:0.7rem;font-weight:600;display:inline-flex;align-items:center;gap:3px;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> Vidéo</span>`
          : `<span style="background:#F5F5F5;color:#aaa;border-radius:50px;padding:0.15rem 0.55rem;font-size:0.7rem;font-weight:600;">Pas de fichier</span>`;
      return `<div style="background:#fff;border-radius:14px;padding:1rem 1.1rem;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;gap:0.9rem;border-left:4px solid ${accent};">
        <div style="width:42px;height:42px;border-radius:12px;background:${accent}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iconHTML(c.icon || '📖', 22)}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;color:#1E293B;font-size:0.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.3rem;flex-wrap:wrap;">
            <span style="background:${accent}18;color:${accent};border-radius:50px;padding:0.12rem 0.5rem;font-size:0.7rem;font-weight:700;">${tourLabel}</span>
            ${fileBadge}
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0;">
          ${(c.pdfName || c.videoFileName) ? `
          <button onclick="${c.pdfName ? `openPdfPreview('${c.id}','${c.name.replace(/'/g,"\\'")}')`  : `openCourseVideoById('${c.id}')`}" title="Voir le contenu" style="background:#F0F9FF;color:#0369A1;border:1.5px solid #BAE6FD;border-radius:8px;padding:0.45rem 0.55rem;cursor:pointer;display:flex;align-items:center;transition:background 0.15s;" onmouseover="this.style.background='#E0F2FE'" onmouseleave="this.style.background='#F0F9FF'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>` : ''}
          <button onclick="trainerDeleteCourse('${c.id}')" title="Supprimer" style="background:#FEE2E2;color:#EF4444;border:none;border-radius:8px;padding:0.45rem 0.55rem;cursor:pointer;display:flex;align-items:center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
          </button>
        </div>
      </div>`;
    }).join('') + '</div>';
}

function openTrainerCourseModal() {
  document.getElementById('tcourse-name').value = '';
  document.getElementById('tcourse-desc').value = '';
  document.getElementById('tcourse-pdf-file').value = '';
  document.getElementById('tcourse-pdf-label').textContent = 'Cliquer pour sélectionner un PDF';
  document.getElementById('tcourse-pdf-info').style.display = 'none';
  const vFile = document.getElementById('tcourse-video-file');
  if (vFile) vFile.value = '';
  const vLabel = document.getElementById('tcourse-video-label');
  if (vLabel) vLabel.textContent = 'Cliquer pour choisir une vidéo';
  const vInfo = document.getElementById('tcourse-video-info');
  if (vInfo) vInfo.style.display = 'none';
  const vDrop = document.getElementById('tcourse-video-dropzone');
  if (vDrop) vDrop.style.borderColor = '#D4A853';
  document.getElementById('trainer-course-modal-title').textContent = 'Ajouter un cours';
  // Filtrer les tours visibles selon les tours assignés au formateur
  const _curTrainer = (appData.trainers || []).find(t => t.id === auth.userId);
  const _assigned = (_curTrainer && _curTrainer.assignedTours && _curTrainer.assignedTours.length)
    ? _curTrainer.assignedTours
    : ['tour1','tour2','tour3'];
  ['tour1','tour2','tour3'].forEach(tid => {
    const tb = document.getElementById('tcourse-tour-btn-' + tid);
    if (tb) tb.style.display = _assigned.includes(tid) ? '' : 'none';
  });
  selectTrainerTour(_assigned[0] || 'tour1');
  selectTrainerCourseType('pdf');
  document.getElementById('trainer-course-modal-backdrop').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('tcourse-name').focus(), 100);
}

function closeTrainerCourseModal(event) {
  if (event && event.target !== document.getElementById('trainer-course-modal-backdrop')) return;
  document.getElementById('trainer-course-modal-backdrop').style.display = 'none';
  document.body.style.overflow = '';
}

function selectTrainerTour(tourId) {
  document.getElementById('tcourse-tour').value = tourId;
  const configs = {
    tour1: { accent:'#0D47A1', bg:'#EFF6FF' },
    tour2: { accent:'#00796B', bg:'#E8F5E9' },
    tour3: { accent:'#C62828', bg:'#FFEBEE' },
  };
  ['tour1','tour2','tour3'].forEach(t => {
    const btn = document.getElementById('tcourse-tour-btn-' + t);
    if (!btn) return;
    const active = t === tourId;
    btn.style.borderColor = active ? configs[t].accent : '#E2E8F0';
    btn.style.background  = active ? configs[t].bg    : '#fff';
    btn.style.color       = active ? configs[t].accent : '#64748B';
    btn.style.fontWeight  = active ? '700' : '600';
  });
}

function selectTrainerCourseType(type) {
  document.getElementById('tcourse-type').value = type;
  const isPdf = type === 'pdf';
  document.getElementById('tcourse-pdf-row').style.display   = isPdf ? 'block' : 'none';
  document.getElementById('tcourse-video-row').style.display = isPdf ? 'none'  : 'block';
  const pdfBtn   = document.getElementById('tcourse-type-pdf-btn');
  const videoBtn = document.getElementById('tcourse-type-video-btn');
  if (isPdf) {
    pdfBtn.style.borderColor = '#0D47A1'; pdfBtn.style.background = '#EFF6FF'; pdfBtn.style.color = '#0D47A1'; pdfBtn.style.fontWeight = '700';
    videoBtn.style.borderColor = '#E2E8F0'; videoBtn.style.background = '#fff'; videoBtn.style.color = '#64748B'; videoBtn.style.fontWeight = '600';
  } else {
    videoBtn.style.borderColor = '#C9A84C'; videoBtn.style.background = '#FFFBF0'; videoBtn.style.color = '#8B6914'; videoBtn.style.fontWeight = '700';
    pdfBtn.style.borderColor = '#E2E8F0'; pdfBtn.style.background = '#fff'; pdfBtn.style.color = '#64748B'; pdfBtn.style.fontWeight = '600';
  }
}

function onTrainerVideoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const label = document.getElementById('tcourse-video-label');
  const info  = document.getElementById('tcourse-video-info');
  const infoText = document.getElementById('tcourse-video-info-text');
  const dropzone = document.getElementById('tcourse-video-dropzone');
  label.textContent = '🎬 ' + file.name;
  infoText.textContent = file.name + ' (' + (file.size / (1024*1024)).toFixed(1) + ' Mo)';
  info.style.display = 'flex';
  if (dropzone) { dropzone.style.borderColor = '#22C55E'; dropzone.style.background = '#F0FDF4'; }
}

function clearTrainerVideoFile() {
  const f = document.getElementById('tcourse-video-file');
  if (f) f.value = '';
  const label = document.getElementById('tcourse-video-label');
  if (label) label.textContent = 'Cliquer pour choisir une vidéo';
  const info = document.getElementById('tcourse-video-info');
  if (info) info.style.display = 'none';
  const drop = document.getElementById('tcourse-video-dropzone');
  if (drop) { drop.style.borderColor = '#D4A853'; drop.style.background = '#FFFBF0'; }
}

function onTrainerExerciseVideoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const label = document.getElementById('texercise-video-label');
  const info  = document.getElementById('texercise-video-info');
  const infoText = document.getElementById('texercise-video-info-text');
  const drop = document.getElementById('texercise-video-dropzone');
  if (label) label.textContent = '🎬 ' + file.name;
  if (infoText) infoText.textContent = file.name + ' (' + (file.size / (1024*1024)).toFixed(1) + ' Mo)';
  if (info) info.style.display = 'flex';
  if (drop) { drop.style.borderColor = '#22C55E'; drop.style.background = '#F0FDF4'; }
}

function onTrainerPdfSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const label = document.getElementById('tcourse-pdf-label');
  const info  = document.getElementById('tcourse-pdf-info');
  const infoText = document.getElementById('tcourse-pdf-info-text');
  label.textContent = '📄 ' + file.name;
  infoText.textContent = file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)';
  info.style.display = 'flex';
}

function filterTrainerCourses(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) { renderTrainerCoursesList(); return; }
  const filtered = getTrainerCourses().filter(c =>
    c.name.toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q)
  );
  renderTrainerCoursesList(filtered);
}

async function saveTrainerCourse() {
  const name   = (document.getElementById('tcourse-name').value || '').trim();
  const tourId = document.getElementById('tcourse-tour').value || 'tour1';
  const desc   = (document.getElementById('tcourse-desc').value || '').trim();
  const type   = document.getElementById('tcourse-type').value || 'pdf';
  if (!name) { showNotif('Saisissez un nom de cours.', 'error'); return; }

  const course = {
    id: genId('tcourse'),
    name, tourId, desc,
    icon: '📖',
    contentType: type,
    pdfName: null, videoFileName: null,
    trainerId: auth.userId,
    createdAt: Date.now(),
  };

  if (type === 'pdf') {
    const fileInput = document.getElementById('tcourse-pdf-file');
    if (fileInput && fileInput.files[0]) {
      const file = fileInput.files[0];
      if (file.size > 15 * 1024 * 1024) { showNotif('PDF trop volumineux (max 15 Mo)', 'error'); return; }
      await savePdf(course.id, file, file.name);
      course.pdfName = file.name;
      fileInput.value = '';
    }
  } else {
    const videoInput = document.getElementById('tcourse-video-file');
    if (videoInput && videoInput.files[0]) {
      const file = videoInput.files[0];
      if (file.size > 500 * 1024 * 1024) { showNotif('Vidéo trop volumineuse (max 500 Mo)', 'error'); return; }
      showNotif('⏳ Enregistrement vidéo…', '');
      const videoId = course.id + '_vid';
      try {
        await saveVideoFile(videoId, file, file.name);
        const videos = loadVideos();
        const vEntry = { id: videoId, courseId: course.id, title: name, fileName: file.name, fileSize: file.size, views: 0, createdAt: Date.now(), isCourseVideo: true, isTrainerVideo: true };
        const existIdx = videos.findIndex(v => v.id === videoId);
        if (existIdx >= 0) videos[existIdx] = { ...videos[existIdx], ...vEntry };
        else videos.push(vEntry);
        saveVideos(videos);
        course.videoFileName = file.name;
        videoInput.value = '';
      } catch(e) {
        showNotif('❌ Erreur enregistrement vidéo', 'error'); return;
      }
    }
  }

  if (!appData.courses) appData.courses = [];
  appData.courses.push(course);
  saveAppData(false);
  closeTrainerCourseModal();
  renderTrainerCoursesList();
  renderTrainerDashboard();
  showNotif('✅ Cours "' + name + '" ajouté avec succès !', 'success');
}

function buildTrainerExerciseCard(ex) {
  const tourLabel = ex.tourId === 'tour2' ? '2ème Tour' : ex.tourId === 'tour3' ? '3ème Tour' : '1er Tour';
  const tourColor = ex.tourId === 'tour2' ? '#00796B' : ex.tourId === 'tour3' ? '#C62828' : '#0D47A1';
  const fileTag = ex.pdfName ? 'PDF' : ex.videoFileName ? 'Vidéo' : 'Sans fichier';
  return `<div style="background:#fff;border-radius:14px;padding:1rem 1.25rem;box-shadow:0 2px 10px rgba(0,0,0,0.06);display:flex;align-items:center;gap:1rem;border:1px solid #F1F5F9;">
    <div style="width:46px;height:46px;border-radius:12px;background:${tourColor}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${iconHTML(ex.icon || '📝', 24)}</div>
    <div style="flex:1;min-width:0;">
      <div style="font-weight:700;color:#334155;font-size:0.9rem;margin-bottom:0.3rem;">${ex.name}</div>
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <span style="background:${tourColor}18;color:${tourColor};border-radius:50px;padding:0.1rem 0.5rem;font-size:0.69rem;font-weight:700;">${tourLabel}</span>
        <span style="background:#F1F5F9;color:#64748B;border-radius:50px;padding:0.1rem 0.5rem;font-size:0.69rem;font-weight:600;">${fileTag}</span>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:0.4rem;flex-shrink:0;">
      ${ex.pdfName ? `<button onclick="openPdfPreview('${ex.id}','${ex.name.replace(/'/g,"\\'")}' )" title="Voir le PDF" style="background:#F0F9FF;color:#0369A1;border:1.5px solid #BAE6FD;border-radius:8px;padding:0.45rem 0.55rem;cursor:pointer;display:flex;align-items:center;" onmouseover="this.style.background='#E0F2FE'" onmouseout="this.style.background='#F0F9FF'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>` : ''}
      ${ex.videoFileName ? `<button onclick="openVideoPlayer('${ex.id}_vid')" title="Voir la vidéo" style="background:#FFF0F0;color:#C62828;border:1.5px solid #FECACA;border-radius:8px;padding:0.45rem 0.55rem;cursor:pointer;display:flex;align-items:center;" onmouseover="this.style.background='#FECACA'" onmouseout="this.style.background='#FFF0F0'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg></button>` : ''}
      <button onclick="trainerDeleteExercise('${ex.id}')" title="Supprimer" style="background:#FEE2E2;color:#EF4444;border:none;border-radius:8px;padding:0.45rem 0.55rem;cursor:pointer;display:flex;align-items:center;" onmouseover="this.style.background='#FECACA'" onmouseout="this.style.background='#FEE2E2'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
      </button>
    </div>
  </div>`;
}

function renderTrainerExercisesList(filtered) {
  const list = document.getElementById('trainer-exercises-list');
  if (!list) return;
  const exercises = filtered !== undefined ? filtered : getTrainerExercises();
  if (!exercises.length) {
    list.innerHTML = '<div style="text-align:center;padding:2.5rem 1rem;background:#F8FAFC;border:1.5px dashed #E2E8F0;border-radius:16px;color:#94A3B8;font-size:0.88rem;">Aucun exercice ajouté.</div>';
    return;
  }
  list.innerHTML = '<div style="display:grid;gap:0.85rem;">' + exercises.map(ex => buildTrainerExerciseCard(ex)).join('') + '</div>';
}

function filterTrainerExercises(query) {
  const q = (query || '').toLowerCase().trim();
  const countEl = document.getElementById('trainer-exercise-search-count');
  if (!q) {
    renderTrainerExercisesList();
    if (countEl) countEl.style.display = 'none';
    return;
  }
  const filtered = getTrainerExercises().filter(ex => ex.name.toLowerCase().includes(q));
  if (countEl) {
    countEl.textContent = filtered.length + ' résultat' + (filtered.length > 1 ? 's' : '') + ' pour « ' + query + ' »';
    countEl.style.display = 'block';
  }
  renderTrainerExercisesList(filtered);
}

function openTrainerExerciseModal() {
  const nameEl = document.getElementById('tm-exercise-name');
  if (nameEl) nameEl.value = '';
  selectTmTour('tour1');
  selectTmExerciseType('pdf');
  const pdfIn = document.getElementById('tm-exercise-pdf-input');
  if (pdfIn) pdfIn.value = '';
  const vidIn = document.getElementById('tm-exercise-video-input');
  if (vidIn) vidIn.value = '';
  const pdfLbl = document.getElementById('tm-pdf-label');
  if (pdfLbl) pdfLbl.textContent = 'Cliquer pour uploader un PDF';
  const vidLbl = document.getElementById('tm-video-label');
  if (vidLbl) vidLbl.textContent = 'Cliquer pour choisir une vidéo';
  const pdfInfo = document.getElementById('tm-pdf-info');
  if (pdfInfo) pdfInfo.style.display = 'none';
  const vidInfo = document.getElementById('tm-video-info');
  if (vidInfo) vidInfo.style.display = 'none';
  tmInteractiveQs = [];
  renderTmInteractiveQList();
  const tmIqText = document.getElementById('tm-iq-text'); if (tmIqText) tmIqText.value = '';
  [0,1,2,3].forEach(i => { const el = document.getElementById('tm-iq-opt'+i); if (el) el.value = ''; });
  const tmIqExp = document.getElementById('tm-iq-exp'); if (tmIqExp) tmIqExp.value = '';
  document.getElementById('tm-exercise-overlay').style.display = 'flex';
}

function closeTmExerciseModal(e) {
  if (e && e.target !== document.getElementById('tm-exercise-overlay')) return;
  document.getElementById('tm-exercise-overlay').style.display = 'none';
}

function selectTmTour(tourId) {
  document.querySelectorAll('.tm-tour-btn').forEach(b => {
    const active = b.dataset.tour === tourId;
    const colors = { tour1: '#0D47A1', tour2: '#00796B', tour3: '#C62828' };
    const c = colors[b.dataset.tour] || '#0D47A1';
    b.style.background = active ? c : '#fff';
    b.style.color = active ? '#fff' : '#64748B';
    b.style.borderColor = active ? c : '#E2E8F0';
  });
  const h = document.getElementById('tm-exercise-tour');
  if (h) h.value = tourId;
}

function selectTmExerciseType(type) {
  const h = document.getElementById('tm-exercise-type');
  if (h) h.value = type;
  const pdfBtn = document.getElementById('tm-type-pdf-btn');
  const vidBtn = document.getElementById('tm-type-video-btn');
  const intBtn = document.getElementById('tm-type-interactive-btn');
  const pdfZone = document.getElementById('tm-pdf-zone');
  const vidZone = document.getElementById('tm-video-zone');
  const intZone = document.getElementById('tm-interactive-zone');
  const activeStyle = { bg: '#EEF2FF', border: '#7C3AED', color: '#5B21B6', fw: '700' };
  const inactiveStyle = { bg: '#fff', border: '#E2E8F0', color: '#64748B', fw: '600' };
  [['pdf', pdfBtn], ['video', vidBtn], ['interactive', intBtn]].forEach(([t, btn]) => {
    if (!btn) return;
    const s = t === type ? activeStyle : inactiveStyle;
    btn.style.background = t === type && t === 'pdf' ? '#FFFBF0' : s.bg;
    btn.style.borderColor = t === type && t === 'pdf' ? '#C9A84C' : s.border;
    btn.style.color = t === type && t === 'pdf' ? '#8B6914' : s.color;
    btn.style.fontWeight = s.fw;
  });
  if (pdfBtn && type === 'pdf') { pdfBtn.style.background = '#FFFBF0'; pdfBtn.style.borderColor = '#C9A84C'; pdfBtn.style.color = '#8B6914'; }
  if (pdfZone) pdfZone.style.display = type === 'pdf' ? '' : 'none';
  if (vidZone) vidZone.style.display = type === 'video' ? '' : 'none';
  if (intZone) intZone.style.display = type === 'interactive' ? '' : 'none';
}

function onTmPdfSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const lbl = document.getElementById('tm-pdf-label');
  if (lbl) lbl.textContent = '📄 ' + file.name;
  const info = document.getElementById('tm-pdf-info');
  if (info) { info.textContent = '✅ ' + file.name + ' (' + (file.size / 1024).toFixed(0) + ' Ko)'; info.style.display = 'block'; }
}

function onTmVideoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  const lbl = document.getElementById('tm-video-label');
  if (lbl) lbl.textContent = '🎬 ' + file.name;
  const info = document.getElementById('tm-video-info');
  if (info) { info.textContent = '✅ ' + file.name + ' (' + (file.size / (1024 * 1024)).toFixed(1) + ' Mo)'; info.style.display = 'flex'; }
}

async function submitTmExercise() {
  const name   = (document.getElementById('tm-exercise-name')?.value || '').trim();
  const tourId = document.getElementById('tm-exercise-tour')?.value || 'tour1';
  const type   = document.getElementById('tm-exercise-type')?.value || 'pdf';
  if (!name) { showNotif('Saisissez un nom d\'exercice.', 'error'); return; }
  if (type === 'interactive' && tmInteractiveQs.length === 0) {
    showNotif('Ajoutez au moins une question à l\'exercice interactif.', 'error'); return;
  }

  const icon = type === 'video' ? '🎬' : type === 'interactive' ? '🎯' : '📝';
  const ex = { id: genId('texercise'), name, tourId, icon, contentType: type, pdfName: null, videoFileName: null, trainerId: auth.userId, createdAt: Date.now() };
  if (type === 'interactive') ex.questions = tmInteractiveQs.slice();

  if (type === 'pdf') {
    const fi = document.getElementById('tm-exercise-pdf-input');
    if (fi && fi.files[0]) {
      const file = fi.files[0];
      await savePdf(ex.id, file, file.name);
      ex.pdfName = file.name;
      fi.value = '';
    }
  } else {
    const vi = document.getElementById('tm-exercise-video-input');
    if (vi && vi.files[0]) {
      const file = vi.files[0];
      if (file.size > 500 * 1024 * 1024) { showNotif('Vidéo trop volumineuse (max 500 Mo)', 'error'); return; }
      showNotif('⏳ Enregistrement vidéo…', '');
      const videoId = ex.id + '_vid';
      try {
        await saveVideoFile(videoId, file, file.name);
        const videos = loadVideos();
        const vEntry = { id: videoId, exerciseId: ex.id, title: name, fileName: file.name, fileSize: file.size, views: 0, createdAt: Date.now(), isExerciseVideo: true, isTrainerVideo: true };
        const idx = videos.findIndex(v => v.id === videoId);
        if (idx >= 0) videos[idx] = { ...videos[idx], ...vEntry }; else videos.push(vEntry);
        saveVideos(videos);
        ex.videoFileName = file.name;
        vi.value = '';
      } catch(e) { showNotif('❌ Erreur enregistrement vidéo', 'error'); return; }
      const vLbl = document.getElementById('tm-video-label');
      if (vLbl) vLbl.textContent = 'Cliquer pour choisir une vidéo';
    }
  }

  if (!appData.exerciseTypes) appData.exerciseTypes = [];
  appData.exerciseTypes.push(ex);
  saveAppData(false);
  document.getElementById('tm-exercise-overlay').style.display = 'none';
  tmInteractiveQs = [];
  const searchEl = document.getElementById('trainer-exercise-search');
  if (searchEl) searchEl.value = '';
  const countEl = document.getElementById('trainer-exercise-search-count');
  if (countEl) countEl.style.display = 'none';
  renderTrainerExercisesList();
  showNotif('Exercice "' + name + '" ajouté.', 'success');
}

function renderTrainerResults() {
  const el = document.getElementById('trainer-results-content');
  if (!el) return;
  const users = appData.users || [];
  if (!users.length) {
    el.innerHTML = '<div style="text-align:center;padding:3rem;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" style="display:block;margin:0 auto 0.75rem;"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><div style="color:#aaa;font-size:0.88rem;">Aucun apprenant inscrit pour le moment.</div></div>';
    return;
  }
  const sorted = [...users].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  const maxScore = sorted[0].totalScore || 1;
  const avatarColors = ['#2d6a4f','#1565C0','#d97706','#8b5cf6','#e8748a','#0891b2','#b45309','#16a34a'];
  el.innerHTML =
    '<div style="background:#fff;border-radius:16px;overflow:hidden;border:1px solid #f0f0f0;">' +
    '<div style="padding:1rem 1.5rem;border-bottom:1px solid #f5f5f5;display:flex;align-items:center;justify-content:space-between;">' +
      '<span style="font-weight:700;color:#1a1a2e;font-size:0.95rem;">Progression des apprenants</span>' +
      '<span style="background:#e8f4ef;color:#2d6a4f;border-radius:50px;padding:0.2rem 0.65rem;font-size:0.72rem;font-weight:700;">' + sorted.length + ' apprenant' + (sorted.length>1?'s':'') + '</span>' +
    '</div>' +
    sorted.map((u, i) => {
      const initials = (u.name||'?').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
      const score = u.totalScore || 0;
      const pct = Math.round((score / maxScore) * 100);
      const color = avatarColors[i % avatarColors.length];
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
      return '<div style="display:flex;align-items:center;gap:0.9rem;padding:0.85rem 1.5rem;border-bottom:1px solid #f8f8f8;">' +
        '<div style="width:28px;text-align:center;font-size:0.75rem;font-weight:700;color:#aaa;flex-shrink:0;">' + (medal || (i+1)) + '</div>' +
        '<div style="width:36px;height:36px;border-radius:50%;background:' + color + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;flex-shrink:0;">' + initials + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-weight:600;font-size:0.85rem;color:#1a1a2e;margin-bottom:0.25rem;">' + u.name + '</div>' +
          '<div style="height:5px;background:#f0f0f0;border-radius:3px;overflow:hidden;">' +
            '<div style="height:100%;width:' + pct + '%;background:' + color + ';border-radius:3px;"></div>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right;flex-shrink:0;min-width:60px;">' +
          '<div style="font-weight:800;color:' + color + ';font-size:0.9rem;">' + score + ' pts</div>' +
          '<div style="font-size:0.68rem;color:#aaa;margin-top:0.1rem;">' + (u.quizPlayed||0) + ' quiz</div>' +
        '</div>' +
      '</div>';
    }).join('') +
    '</div>';
}


async function trainerAddExercise() {
  const name = (document.getElementById('texercise-name').value || '').trim();
  const type = document.getElementById('texercise-type').value;
  if (!name) { showNotif('Saisissez un nom d\'exercice.', 'error'); return; }

  const ex = {
    id: genId('texercise'),
    name,
    icon: '📝',
    contentType: type,
    pdfName: null, videoFileName: null,
    trainerId: auth.userId,
    createdAt: Date.now(),
  };

  if (type === 'pdf') {
    const fileInput = document.getElementById('texercise-pdf-file');
    if (fileInput && fileInput.files[0]) {
      const file = fileInput.files[0];
      await savePdf(ex.id, file, file.name);
      ex.pdfName = file.name;
      fileInput.value = '';
    }
  } else {
    const videoInput = document.getElementById('texercise-video-file');
    if (videoInput && videoInput.files[0]) {
      const file = videoInput.files[0];
      if (file.size > 500 * 1024 * 1024) { showNotif('Vidéo trop volumineuse (max 500 Mo)', 'error'); return; }
      showNotif('⏳ Enregistrement vidéo…', '');
      const videoId = ex.id + '_vid';
      try {
        await saveVideoFile(videoId, file, file.name);
        const videos = loadVideos();
        const vEntry = { id: videoId, exerciseId: ex.id, title: name, fileName: file.name, fileSize: file.size, views: 0, createdAt: Date.now(), isExerciseVideo: true, isTrainerVideo: true };
        const existIdx = videos.findIndex(v => v.id === videoId);
        if (existIdx >= 0) videos[existIdx] = { ...videos[existIdx], ...vEntry };
        else videos.push(vEntry);
        saveVideos(videos);
        ex.videoFileName = file.name;
        videoInput.value = '';
      } catch(e) {
        showNotif('❌ Erreur enregistrement vidéo', 'error'); return;
      }
    }
    const vLabel = document.getElementById('texercise-video-label');
    if (vLabel) vLabel.textContent = 'Cliquer pour choisir une vidéo';
    const vInfo = document.getElementById('texercise-video-info');
    if (vInfo) vInfo.style.display = 'none';
  }

  if (!appData.exerciseTypes) appData.exerciseTypes = [];
  appData.exerciseTypes.push(ex);
  saveAppData(false);
  document.getElementById('texercise-name').value = '';
  renderTrainerExercisesList();
  showNotif('Exercice "' + name + '" ajouté.', 'success');
}

function trainerDeleteCourse(id) {
  if (!confirm('Supprimer ce cours ?')) return;
  appData.courses = (appData.courses || []).filter(c => c.id !== id);
  deletePdf(id).catch(() => {});
  saveAppData(false);
  renderTrainerCoursesList();
  renderTrainerDashboard();
  showNotif('Cours supprimé.', '');
}

function trainerDeleteExercise(id) {
  if (!confirm('Supprimer cet exercice ?')) return;
  appData.exerciseTypes = (appData.exerciseTypes || []).filter(e => e.id !== id);
  deletePdf(id).catch(() => {});
  saveAppData(false);
  renderTrainerExercisesList();
  showNotif('Exercice supprimé.', '');
}


function trainerToggleExerciseType() {
  const type = document.getElementById('texercise-type').value;
  document.getElementById('texercise-pdf-row').style.display   = type === 'pdf'   ? '' : 'none';
  document.getElementById('texercise-video-row').style.display = type === 'video' ? '' : 'none';
  if (type === 'video') {
    const vLabel = document.getElementById('texercise-video-label');
    if (vLabel) vLabel.textContent = 'Cliquer pour choisir une vidéo';
    const vInfo = document.getElementById('texercise-video-info');
    if (vInfo) vInfo.style.display = 'none';
    const vFile = document.getElementById('texercise-video-file');
    if (vFile) vFile.value = '';
  }
}


function studentNavScroll(delta) {
  var nav = document.getElementById('sidebar-nav');
  if (nav) { nav.scrollBy({ top: delta, behavior: 'smooth' }); }
}
function studentNavScrollCheck() {
  var nav = document.getElementById('sidebar-nav');
  var up = document.getElementById('nav-arr-up');
  var down = document.getElementById('nav-arr-down');
  if (!nav || !up || !down) return;
  up.style.display = nav.scrollTop > 5 ? 'flex' : 'none';
  down.style.display = (nav.scrollTop + nav.clientHeight < nav.scrollHeight - 5) ? 'flex' : 'none';
}

function logout() {
  saveUserStats();
  endAttendanceSession();
  clearSession(); // Supprime SESSION_KEY + SCREEN_KEY + pose hermes_logged_out
  document.getElementById('student-app').style.display = 'none';
  document.getElementById('bottom-nav').style.display = 'none';
  showLoginScreen();
}

function showLogoFallback(img) {
  if (!img || img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.style.display = 'none';
  const fb = document.createElement('div');
  fb.className = 'auth-logo-fallback';
  fb.textContent = 'H';
  img.parentNode.insertBefore(fb, img);
  document.querySelectorAll('.auth-bg').forEach(bg => bg.classList.add('is-fallback'));
}

function initAuthBackgrounds() {
  const testImg = new Image();
  testImg.onload = () => {
    document.querySelectorAll('.auth-bg').forEach(bg => bg.classList.remove('is-fallback'));
  };
  testImg.onerror = () => {
    document.querySelectorAll('.auth-bg').forEach(bg => bg.classList.add('is-fallback'));
  };
  testImg.src = 'background.png';
}

function showWelcomePage() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('welcome').classList.add('active');
  document.getElementById('student-app').style.display = 'none';
  document.getElementById('admin-app').classList.remove('active');
  const trainerAppEl = document.getElementById('trainer-app');
  if (trainerAppEl) trainerAppEl.classList.remove('active');
  document.getElementById('bottom-nav').style.display = 'none';
  state.screen = 'welcome';
  updateSessionResumeBanner();
}

function showLoginScreen() {
  showWelcomePage();
}

function updateSessionResumeBanner() {
  const banner = document.getElementById('session-resume');
  const nameEl = document.getElementById('resume-name');
  if (!banner || !nameEl) return;

  // Utiliser auth en mémoire ou, si vide (après déconnexion), relire le localStorage
  let role = auth.role;
  let userId = auth.userId;
  if (!role) {
    try {
      const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      if (stored) { role = stored.role; userId = stored.userId; }
    } catch(e) {}
  }

  if (role === 'student' && userId) {
    const user = appData.users.find(u => u.id === userId);
    if (user) {
      nameEl.textContent = user.name + (user.phone ? ' · ' + user.phone : '');
      banner.style.display = 'block';
      return;
    }
  }
  if (role === 'admin') {
    nameEl.textContent = 'Administrateur';
    banner.style.display = 'block';
    return;
  }
  if (role === 'trainer' && userId) {
    const trainer = (appData.trainers || []).find(t => t.id === userId);
    if (trainer) {
      nameEl.textContent = trainer.name + ' (Formateur)';
      banner.style.display = 'block';
      return;
    }
  }
  banner.style.display = 'none';
}

function resumeSession() {
  if (!auth.role) loadSession(); // Recharger depuis localStorage si auth vidé par logout()
  const savedScreen = (() => { try { return localStorage.getItem(SCREEN_KEY) || null; } catch(e) { return null; } })();

  if (auth.role === 'student' && auth.userId) {
    const user = appData.users.find(u => u.id === auth.userId);
    if (user) {
      // Bloquer si la promotion est expirée
      const promo = (appData.promotions || []).find(p => p.id === user.promotionId);
      if (promo && promoStatus(promo) === 'expired') {
        clearSession();
        showWelcomePage();
        showNotif('Votre promotion "' + promo.name + '" est clôturée. Accès refusé.', 'error');
        return;
      }
      loadUserStats(user);
      enterStudentApp(); // navigates to 'splash' by default
      // Restore the exact student screen they were on
      if (savedScreen?.startsWith('student:')) {
        const screen = savedScreen.split(':')[1];
        const validScreens = ['splash','course-study','selector','profile','leaderboard'];
        if (validScreens.includes(screen)) goTo(screen);
      }
      return;
    }
  }
  if (auth.role === 'admin') {
    enterAdminApp(); // navigates to 'dashboard' by default
    if (savedScreen?.startsWith('admin:')) switchAdminView(savedScreen.split(':')[1]);
    return;
  }
  if (auth.role === 'trainer' && auth.userId) {
    const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
    if (trainer) {
      enterTrainerApp(); // navigates to 'dashboard' by default
      if (savedScreen?.startsWith('trainer:')) switchTrainerView(savedScreen.split(':')[1]);
      return;
    }
  }
  clearSession();
  showWelcomePage();
}

function switchAccount() {
  endAttendanceSession();
  clearSession();
  showWelcomePage();
  showNotif('Choisissez un type de connexion', '');
}

// ══════════════════════════════════════════
//  POINTAGE — SUIVI DES PRÉSENCES
// ══════════════════════════════════════════

const DAYS_FR = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];

let _attStart = null;
let _attHeartbeat = null;
let _onlineHeartbeat = null;   // pulse "en ligne" pour le formateur
let _absenceTimer = null;      // minuterie auto-absent 30 min
let _presenceRefresh = null;   // polling vue formateur

function _attDateKey(ts) {
  const d = ts ? new Date(ts) : new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// ── Token anti-fraude : une seule connexion active par étudiant
const _pageToken = Math.random().toString(36).slice(2);

// ── Heartbeat "en ligne" (toutes les 45 s) ──────────────────
function _writeOnlinePulse() {
  if (!auth.userId || auth.role !== 'student') return;
  const user = appData.users.find(u => u.id === auth.userId);
  if (!user) return;

  // Trouver la session active qui concerne cet étudiant
  const activeSess = (appData.sessions || []).find(s =>
    s.status === 'active' && s.promotionId === user.promotionId
  );

  // Anti-fraude : si un autre onglet/appareil a un token différent → celui-ci est prioritaire
  // (dernier heartbeat gagne — le formateur voit le plus récent)
  localStorage.setItem('hermes_online_' + auth.userId, JSON.stringify({
    name: user.name,
    promotionId: user.promotionId || '',
    sessionId: activeSess?.id || null,
    token: _pageToken,
    ts: Date.now()
  }));
}

function _clearOnlinePulse() {
  if (auth.userId) localStorage.removeItem('hermes_online_' + auth.userId);
}

// ── Détecte la session formateur active maintenant ──────────
function getActiveTrainerSession(promotionId) {
  const now = new Date();
  const dow = now.getDay();
  const cur = now.getHours() * 60 + now.getMinutes();
  for (const t of (appData.trainers || [])) {
    for (const s of (t.schedule || [])) {
      if (parseInt(s.day, 10) !== dow) continue;
      const [sh, sm] = s.startTime.split(':').map(Number);
      const [eh, em] = s.endTime.split(':').map(Number);
      if (cur >= sh * 60 + sm && cur <= eh * 60 + em) {
        if (!s.promotionId || !promotionId || s.promotionId === promotionId) {
          return { ...s, trainerId: t.id, trainerName: t.name };
        }
      }
    }
  }
  return null;
}

// ── Marque l'étudiant PRÉSENT à la session active ───────────
function autoMarkPresent() {
  if (!auth.userId || auth.role !== 'student') return;
  const user = appData.users.find(u => u.id === auth.userId);
  if (!user) return;
  const session = getActiveTrainerSession(user.promotionId);
  if (!session) return;
  const key = _attDateKey();
  if (!user.attendance) user.attendance = {};
  if (!user.attendance[key]) user.attendance[key] = { sessions:[], activities:[], totalTime:0, courseAttendance:[] };
  if (!user.attendance[key].courseAttendance) user.attendance[key].courseAttendance = [];
  const already = user.attendance[key].courseAttendance.find(c => c.scheduleId === session.id);
  if (!already) {
    user.attendance[key].courseAttendance.push({
      scheduleId: session.id,
      trainerId: session.trainerId,
      promotionId: session.promotionId || '',
      label: session.label || '',
      status: 'present',
      markedAt: Date.now()
    });
    saveAppData(false);
  }
}

// ── Réinitialise le timer d'absence 30 min ──────────────────
function resetAbsenceTimer() {
  clearTimeout(_absenceTimer);
  _absenceTimer = setTimeout(() => {
    // Après 30 min d'inactivité → fermer la session
    if (auth.role === 'student') endAttendanceSession();
  }, 30 * 60 * 1000);
}

function startAttendanceSession() {
  if (!auth.userId) return;
  _attStart = Date.now();
  localStorage.setItem('hermes_att_start_' + auth.userId, String(_attStart));
  clearInterval(_attHeartbeat);
  _attHeartbeat = setInterval(() => {
    if (auth.userId) localStorage.setItem('hermes_att_hb_' + auth.userId, String(Date.now()));
  }, 3 * 60 * 1000);
  // Heartbeat "en ligne" toutes les 45 s
  clearInterval(_onlineHeartbeat);
  _writeOnlinePulse();
  _onlineHeartbeat = setInterval(_writeOnlinePulse, 45 * 1000);
  // Marquer présent si cours actif
  autoMarkPresent();
  // Lancer le timer d'absence
  resetAbsenceTimer();
  // Réinitialiser timer sur toute interaction
  ['click','keydown','touchstart','scroll'].forEach(ev =>
    document.addEventListener(ev, resetAbsenceTimer, { passive: true })
  );
}

function endAttendanceSession() {
  clearInterval(_attHeartbeat); _attHeartbeat = null;
  clearInterval(_onlineHeartbeat); _onlineHeartbeat = null;
  clearTimeout(_absenceTimer); _absenceTimer = null;
  _clearOnlinePulse();
  ['click','keydown','touchstart','scroll'].forEach(ev =>
    document.removeEventListener(ev, resetAbsenceTimer)
  );
  if (!_attStart || !auth.userId) { _attStart = null; return; }
  const uid = auth.userId, start = _attStart, end = Date.now();
  _attStart = null;
  localStorage.removeItem('hermes_att_start_' + uid);
  localStorage.removeItem('hermes_att_hb_' + uid);
  if (end - start < 2 * 60 * 1000) return;
  _saveAttSession(uid, start, end);
}

function _saveAttSession(uid, start, end) {
  const user = appData.users.find(u => u.id === uid);
  if (!user) return;
  const key = _attDateKey(start);
  if (!user.attendance) user.attendance = {};
  if (!user.attendance[key]) user.attendance[key] = { sessions: [], activities: [], totalTime: 0 };
  const dur = end - start;
  user.attendance[key].sessions.push({ start, end, duration: dur });
  user.attendance[key].totalTime = (user.attendance[key].totalTime || 0) + dur;
  saveAppData(false);
}

function trackActivity(type) {
  if (!auth.userId || auth.role !== 'student') return;
  const user = appData.users.find(u => u.id === auth.userId);
  if (!user) return;
  const key = _attDateKey();
  if (!user.attendance) user.attendance = {};
  if (!user.attendance[key]) user.attendance[key] = { sessions: [], activities: [], totalTime: 0 };
  if (!user.attendance[key].activities.includes(type)) {
    user.attendance[key].activities.push(type);
    saveAppData(false);
  }
}

// ══════════════════════════════════════════
//  GESTION DES SÉANCES — SESSION MANAGEMENT
// ══════════════════════════════════════════

const SESSION_DURATION_MS  = 3 * 60 * 60 * 1000;  // 3 heures
const VALIDATE_DELAY_MS    = 2 * 60 * 1000;        // 2 min en ligne → Présent (P)
const ABSENCE_DELAY_MS     = 15 * 60 * 1000;       // 15 min hors ligne → Absent (A)
const HEARTBEAT_STALE_MS   = 2 * 60 * 1000;        // 2 min → considéré hors ligne
let _sessionCountdown = null;

function getMyActiveSession() {
  if (auth.role !== 'trainer') return null;
  return (appData.sessions || []).find(s => s.trainerId === auth.userId && s.status === 'active') || null;
}

function startSession() {
  const slotSel  = document.getElementById('sess-slot-select');
  const labelIn  = document.getElementById('sess-label-input');

  if (!slotSel) {
    showNotif('Erreur : formulaire introuvable. Actualisez la vue.', 'error');
    return;
  }

  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  if (!trainer) {
    showNotif('Erreur : formateur non identifié. Reconnectez-vous.', 'error');
    return;
  }

  const slotId = slotSel.value;
  const slot   = (trainer.schedule || []).find(s => s.id === slotId) || null;

  let promoId, startedAt, endsAt;

  if (slot) {
    // ── MODE CRÉNEAU : tout vient du créneau ──
    promoId = slot.promotionId || '';
    if (!promoId) {
      showNotif('⚠️ Ce créneau n\'a pas de promotion associée. Veuillez en ajouter une via "Mes créneaux".', 'error');
      return;
    }

    // Calculer les timestamps à partir des heures du créneau et de sa date exacte
    const rawStart = (slot.startTime || '').trim();
    const rawEnd   = (slot.endTime   || '').trim();
    if (!rawStart || !rawEnd) {
      showNotif("Les heures de ce créneau sont manquantes.", 'error');
      return;
    }
    const [sh, sm] = rawStart.split(':').map(Number);
    const [eh, em] = rawEnd.split(':').map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
      showNotif("Heure du créneau invalide. Supprimez-le et recréez-le.", 'error');
      return;
    }
    const baseDate = _slotDateObj(slot);

    const startDate = new Date(baseDate); startDate.setHours(sh, sm, 0, 0);
    const endDate   = new Date(baseDate); endDate.setHours(eh, em, 0, 0);
    // Si fin < début (créneau à cheval sur minuit) → ajouter 1 jour à la fin
    if (endDate.getTime() <= startDate.getTime()) endDate.setDate(endDate.getDate() + 1);

    startedAt = startDate.getTime();
    endsAt    = endDate.getTime();

  } else {
    // ── MODE MANUEL : champs horaires libres ──
    const promSel     = document.getElementById('sess-promo-select');
    const startTimeEl = document.getElementById('sess-start-time');
    const endTimeEl   = document.getElementById('sess-end-time');

    if (!promSel) {
      showNotif('Erreur : formulaire introuvable. Actualisez la vue.', 'error');
      return;
    }

    promoId = promSel.value;
    if (!promoId) {
      showNotif('Sélectionnez une promotion dans la liste.', 'error');
      promSel.style.borderColor = '#EF4444';
      setTimeout(() => { promSel.style.borderColor = ''; }, 2000);
      return;
    }

    startedAt = Date.now();
    const startTimeVal = startTimeEl?.value || '';
    if (startTimeVal.includes(':')) {
      const [sh, sm] = startTimeVal.split(':').map(Number);
      const sd = new Date(); sd.setHours(sh, sm, 0, 0);
      startedAt = Math.max(sd.getTime(), Date.now());
    }

    const endTimeVal = endTimeEl?.value || '';
    if (endTimeVal.includes(':')) {
      const [eh, em] = endTimeVal.split(':').map(Number);
      const ed = new Date(); ed.setHours(eh, em, 0, 0);
      if (ed.getTime() <= startedAt) ed.setDate(ed.getDate() + 1);
      endsAt = ed.getTime();
    } else {
      endsAt = startedAt + SESSION_DURATION_MS;
    }

    if (endsAt <= startedAt) {
      showNotif('L\'heure de clôture doit être après l\'heure de début.', 'error');
      return;
    }
    if (endsAt <= Date.now()) {
      showNotif('⚠️ L\'heure de clôture est déjà passée. Saisissez une heure dans le futur.', 'error');
      if (endTimeEl) { endTimeEl.style.borderColor = '#EF4444'; setTimeout(() => { endTimeEl.style.borderColor = ''; }, 3000); }
      return;
    }
  }

  const label = (labelIn?.value || '').trim() || (slot?.label || trainer.specialty || 'Séance de formation');

  // Empêcher double session — forcer la fermeture si la précédente est dépassée ou orpheline
  const existingSess = getMyActiveSession();
  if (existingSess) {
    if (Date.now() >= existingSess.endsAt || !existingSess.endsAt) {
      closeSession(existingSess.id, true);   // clôture silencieuse si expirée
    } else {
      showNotif('Une séance est déjà en cours. Clôturez-la avant d\'en lancer une nouvelle.', 'error');
      return;
    }
  }

  const promo = (appData.promotions || []).find(p => p.id === promoId);
  const students = (appData.users || []).filter(u => u.promotionId === promoId);

  const session = {
    id: genId('sess'),
    trainerId: auth.userId,
    trainerName: trainer.name,
    promotionId: promoId,
    promotionName: promo?.name || '—',
    label,
    scheduleId: slotId || null,
    startedAt,
    endsAt,
    closedAt: null,
    status: 'active',
    attendees: {}
  };

  students.forEach(u => {
    session.attendees[u.id] = {
      name: u.name, status: 'pending',
      connectedAt: null, validatedAt: null, disconnectedAt: null,
      absenceStart: null, continuousFrom: null, cumulativeMs: 0
    };
  });

  if (!appData.sessions) appData.sessions = [];
  appData.sessions.push(session);
  saveAppData(false);
  showNotif('Séance lancée — ' + label, 'success');
  renderTrainerPresence();
}

function closeSession(sessionId, auto) {
  const session = (appData.sessions || []).find(s => s.id === sessionId);
  if (!session) return;
  const now = Date.now();

  // Finaliser les cumuls de temps pour les étudiants encore en ligne
  Object.values(session.attendees).forEach(a => {
    if (a.continuousFrom) {
      a.cumulativeMs += now - a.continuousFrom;
      a.continuousFrom = null;
    }
    // Si toujours pending et pas de présence → absent
    if (a.status === 'pending' && !a.connectedAt) a.status = 'absent';
  });

  session.closedAt = now;
  session.status = 'closed';
  saveAppData(false);

  clearInterval(_sessionCountdown); _sessionCountdown = null;
  if (!auto) showNotif('Séance clôturée.', 'success');
  renderTrainerPresence();
}

function updateSessionAttendees(session) {
  if (!session || session.status !== 'active') return;
  const now = Date.now();
  let changed = false;

  // Auto-fermeture à 3h
  if (now >= session.endsAt) {
    closeSession(session.id, true);
    showNotif('Séance clôturée automatiquement à l\'heure de fin prévue.', '');
    return;
  }

  const promId = session.promotionId;
  const students = (appData.users || []).filter(u => u.promotionId === promId);

  students.forEach(u => {
    const pulse = _getOnlinePulse(u.id);
    const isOnline = pulse && (now - pulse.ts < HEARTBEAT_STALE_MS);
    const att = session.attendees[u.id];
    if (!att) {
      session.attendees[u.id] = {
        name: u.name, status: 'pending',
        connectedAt: null, validatedAt: null, disconnectedAt: null,
        absenceStart: null, continuousFrom: null, cumulativeMs: 0
      };
      changed = true;
    }
    const a = session.attendees[u.id];

    if (isOnline) {
      if (!a.connectedAt) { a.connectedAt = pulse.ts; changed = true; }
      if (!a.continuousFrom) { a.continuousFrom = pulse.ts; changed = true; }
      if (a.absenceStart) { a.absenceStart = null; changed = true; }

      // Validation présence après 2 min continus
      if (a.status === 'pending' && a.continuousFrom && (now - a.continuousFrom >= VALIDATE_DELAY_MS)) {
        a.status = 'present';
        a.validatedAt = now;
        changed = true;
        // Sync → grille mensuelle (user.attendance)
        const uRef = appData.users.find(x => x.id === u.id);
        if (uRef) {
          const dk = _attDateKey(session.startedAt);
          if (!uRef.attendance) uRef.attendance = {};
          if (!uRef.attendance[dk]) uRef.attendance[dk] = { sessions:[], activities:[], totalTime:0, courseAttendance:[] };
          if (!uRef.attendance[dk].courseAttendance) uRef.attendance[dk].courseAttendance = [];
          if (!uRef.attendance[dk].courseAttendance.find(c => c.sessionId === session.id)) {
            uRef.attendance[dk].courseAttendance.push({
              sessionId: session.id, trainerId: session.trainerId,
              label: session.label, status: 'present', markedAt: now
            });
          }
          uRef.attendance[dk].manualPresent = true;
        }
      }
    } else {
      // Hors ligne
      if (a.continuousFrom) {
        a.cumulativeMs += now - a.continuousFrom;
        a.continuousFrom = null;
        changed = true;
      }
      if (a.connectedAt && !a.absenceStart) {
        a.absenceStart = now;
        changed = true;
      }
      if (a.absenceStart && (now - a.absenceStart >= ABSENCE_DELAY_MS) && a.status !== 'absent') {
        a.status = 'absent';
        a.disconnectedAt = a.absenceStart;
        changed = true;
      }
    }
  });

  if (changed) saveAppData(false);
}

function _getOnlinePulse(userId) {
  try {
    const raw = localStorage.getItem('hermes_online_' + userId);
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

function fmtTime(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

function fmtCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function switchPtgTab(tab) {
  const gridPanel = document.getElementById('ptg-panel-grid');
  const sessPanel = document.getElementById('ptg-panel-sessions');
  const gridBtn   = document.getElementById('ptg-tab-grid');
  const sessBtn   = document.getElementById('ptg-tab-sessions');
  if (!gridPanel || !sessPanel) return;
  gridPanel.style.display = tab === 'grid' ? '' : 'none';
  sessPanel.style.display = tab === 'sessions' ? '' : 'none';
  if (gridBtn) gridBtn.classList.toggle('active', tab === 'grid');
  if (sessBtn) sessBtn.classList.toggle('active', tab === 'sessions');
  if (tab === 'sessions') renderAdminSessions();
}

// ══════════════════════════════════════════
//  PRÉSENCE FORMATEUR — TEMPS RÉEL
// ══════════════════════════════════════════

function renderTrainerPresence() {
  if (auth.role !== 'trainer') return;
  const trainer = (appData.trainers || []).find(t => t.id === auth.userId);
  if (!trainer) return;

  const area = document.getElementById('presence-main-area');
  if (!area) return;

  // Toujours vider le countdown avant de reconstruire le DOM
  clearInterval(_sessionCountdown);
  _sessionCountdown = null;

  // Mettre à jour les attendees si session active
  const session = getMyActiveSession();
  if (session) updateSessionAttendees(session);

  // Compter les étudiants en ligne (toutes promotions du formateur + session live)
  const trainerPromoIds = new Set((trainer.schedule || []).filter(s => s.promotionId).map(s => s.promotionId));
  const now = Date.now();
  const onlineUsers = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k.startsWith('hermes_online_')) continue;
    try {
      const d = JSON.parse(localStorage.getItem(k));
      if (now - d.ts > HEARTBEAT_STALE_MS) continue;
      // Inclure les étudiants d'une session live de CE formateur
      const inLive = d.isLive && d.liveSessionId && (appData.liveSessions||[]).find(
        s => s.id === d.liveSessionId && s.trainerId === auth.userId && s.status === 'active'
      );
      if (!inLive && trainerPromoIds.size > 0 && !trainerPromoIds.has(d.promotionId)) continue;
      onlineUsers.push(d);
    } catch(e) {}
  }

  // Session live active de ce formateur
  const activeLiveSession = (appData.liveSessions || []).find(
    s => s.trainerId === auth.userId && s.status === 'active'
  );

  // Badges en ligne
  const totalOnline = onlineUsers.length + (activeLiveSession ? Object.keys(activeLiveSession.attendees||{}).filter(uid => {
    const a = activeLiveSession.attendees[uid];
    return a.lastSeen && (now - a.lastSeen) < HEARTBEAT_STALE_MS * 2;
  }).length : 0);
  const pill = document.getElementById('sess-online-pill');
  if (pill) { pill.textContent = totalOnline + ' en ligne'; pill.style.display = totalOnline > 0 ? '' : 'none'; }
  [document.getElementById('presence-online-badge'), document.getElementById('presence-online-badge-mob')].forEach(b => {
    if (!b) return;
    if (totalOnline > 0) { b.textContent = totalOnline; b.style.display = ''; }
    else b.style.display = 'none';
  });

  // ── BLOC : participants de la session live en cours ──
  const livePresenceBlock = activeLiveSession
    ? _buildLivePresenceBlock(activeLiveSession, now)
    : '';

  if (!session) {
    // ── Aucune séance active : formulaire de lancement ──
    // Sauvegarder les valeurs actuelles du formulaire pour les restaurer après le rebuild
    const _savedSlot      = document.getElementById('sess-slot-select')?.value  || '';
    const _savedPromo     = document.getElementById('sess-promo-select')?.value || '';
    const _savedLabel     = document.getElementById('sess-label-input')?.value  || '';
    const _savedEnd       = document.getElementById('sess-end-time')?.value     || '';
    const _savedStart     = document.getElementById('sess-start-time')?.value   || '';
    // Sauvegarder l'état du formulaire d'ajout de créneau
    const _slotFormOpen   = document.getElementById('trainer-slot-form')?.style.display === 'block';
    const _savedTsfDate   = document.getElementById('tsf-date')?.value   || '';
    const _savedTsfStart  = document.getElementById('tsf-start')?.value  || '';
    const _savedTsfEnd    = document.getElementById('tsf-end')?.value    || '';
    const _savedTsfLabel  = document.getElementById('tsf-label')?.value  || '';
    const _savedTsfPromo  = document.getElementById('tsf-promo')?.value  || '';

    const slots  = trainer.schedule || [];
    const promos = appData.promotions || [];
    const slotOptions = slots.map(s => {
      const p = promos.find(x => x.id === s.promotionId);
      const slotDate = _slotDateObj(s);
      const dateLabel = _fmtSlotDate(slotDate);
      return `<option value="${s.id}">${dateLabel} ${s.startTime}–${s.endTime}${s.label ? ' · ' + s.label : ''}${p ? ' · ' + p.name : ''}</option>`;
    }).join('');
    const promoOptions = promos.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    // Séances récentes de ce formateur
    const recent = (appData.sessions || []).filter(s => s.trainerId === auth.userId).slice(-5).reverse();
    // recentHtml est construit plus bas avec le nouveau design

    // Heure de début par défaut = maintenant
    const _nowCur = new Date();
    const _nowStart = String(_nowCur.getHours()).padStart(2,'0') + ':' + String(_nowCur.getMinutes()).padStart(2,'0');
    // Heure de clôture par défaut = maintenant + 3h
    const _nowD = new Date(Date.now() + SESSION_DURATION_MS);
    const _defEnd = _savedEnd || (String(_nowD.getHours()).padStart(2,'0') + ':' + String(_nowD.getMinutes()).padStart(2,'0'));

    // ── Créneaux HTML (nouveau design) ──
    const avatarPalette = ['#2d6a4f','#1565C0','#d97706','#8b5cf6','#e8748a','#0891b2','#b45309'];
    const slotsHtml = slots.length
      ? slots.map(s => {
          const p = promos.find(x => x.id === s.promotionId);
          const slotDate  = _slotDateObj(s);
          const dateLabel = _fmtSlotDate(slotDate);
          const isToday   = slotDate.toDateString() === new Date().toDateString();
          const isPast    = slotDate < new Date() && !isToday;
          return `<div class="pres-slot-item" style="${isPast ? 'opacity:0.55;' : ''}">
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;margin-bottom:0.3rem;">
                <span class="pres-day-badge" style="${isPast ? 'background:#94A3B8;' : ''}">${DAYS_FR[slotDate.getDay()]}</span>
                <span style="font-size:0.82rem;font-weight:700;color:#1a1a2e;">${s.startTime}–${s.endTime}</span>
                ${s.label ? `<span style="background:#f0f0f0;color:#555;border-radius:5px;padding:0.12rem 0.45rem;font-size:0.68rem;font-weight:600;text-transform:uppercase;">${s.label}</span>` : ''}
                ${p ? `<span style="background:#EFF6FF;color:#1D4ED8;border-radius:5px;padding:0.12rem 0.45rem;font-size:0.68rem;font-weight:700;">${p.name}</span>` : ''}
              </div>
              <div style="display:flex;align-items:center;gap:0.35rem;font-size:0.7rem;color:${isToday ? '#2d6a4f' : isPast ? '#ef4444' : '#aaa'};">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${dateLabel}${isToday ? ' · Aujourd\'hui' : isPast ? ' · Passé' : ''}
              </div>
            </div>
            <div style="display:flex;gap:0.35rem;align-items:center;flex-shrink:0;">
              <button onclick="deleteTrainerScheduleSlot('${s.id}')" style="width:28px;height:28px;border-radius:50%;border:none;background:none;cursor:pointer;color:#ccc;display:flex;align-items:center;justify-content:center;" title="Supprimer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
              </button>
            </div>
          </div>`;
        }).join('')
      : '<div style="padding:1.25rem;text-align:center;color:#aaa;font-size:0.82rem;">Aucun créneau défini.</div>';

    // ── Séances récentes HTML (nouveau design) ──
    const recentHtml = recent.length
      ? recent.map((s, idx) => {
          const presCount = Object.values(s.attendees||{}).filter(a => a.status === 'present').length;
          const total = Object.keys(s.attendees||{}).length;
          const rate = total > 0 ? Math.round(presCount/total*100) : 0;
          const rateColor = rate>=80?'#2d6a4f':rate>=50?'#d97706':'#e8748a';
          const color = avatarPalette[idx % avatarPalette.length];
          const initial = (s.label||'?').trim()[0].toUpperCase();
          const dateStr = new Date(s.startedAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});
          return `<div class="pres-recent-item">
            <div class="pres-recent-avatar" style="background:${color};">${initial}</div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:0.85rem;font-weight:700;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.label}</div>
              <div style="font-size:0.72rem;color:#aaa;margin-top:0.1rem;">${s.promotionName||'–'} · ${dateStr}</div>
            </div>
            <div style="text-align:right;flex-shrink:0;margin-left:0.5rem;">
              <div style="font-size:0.78rem;font-weight:700;color:${rateColor};">${presCount}/${total} (${rate}%)</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="2" flex-shrink="0"><polyline points="9 18 15 12 9 6"/></svg>
          </div>`;
        }).join('')
      : '<div style="padding:1.5rem;text-align:center;color:#aaa;font-size:0.82rem;">Aucune séance récente.</div>';

    area.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start;">

        <!-- ── Colonne gauche : Démarrer une séance ── -->
        <div class="sess-launch-card">
          <div style="font-size:1.15rem;font-weight:800;color:#fff;margin-bottom:0.3rem;">Démarrer une séance</div>
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
            <span style="background:rgba(34,197,94,0.2);color:#4ADE80;border-radius:5px;padding:0.15rem 0.5rem;font-weight:700;">P</span>
            <span style="color:rgba(255,255,255,0.4);">après 2 min en ligne</span>
            <span style="color:rgba(255,255,255,0.2);">·</span>
            <span style="background:rgba(239,68,68,0.2);color:#F87171;border-radius:5px;padding:0.15rem 0.5rem;font-weight:700;">A</span>
            <span style="color:rgba(255,255,255,0.4);">après 15 min hors ligne</span>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="pres-label">Créneau</label>
            <select id="sess-slot-select" class="pres-input" onchange="prefillFromSlot()">
              <option value="">— Choisir un créneau —</option>
              ${slotOptions}
            </select>
          </div>

          <!-- Récapitulatif du créneau sélectionné (affiché quand un créneau est choisi) -->
          <div id="sess-slot-summary" style="display:none;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:0.85rem 1rem;margin-bottom:1rem;">
            <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.5rem;">Détails du créneau</div>
            <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
              <div>
                <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">Promotion</div>
                <div id="slot-summary-promo" style="font-size:0.88rem;font-weight:700;color:#4ADE80;">—</div>
              </div>
              <div>
                <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">Début</div>
                <div id="slot-summary-start" style="font-size:0.88rem;font-weight:700;color:#fff;">—</div>
              </div>
              <div>
                <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">Clôture</div>
                <div id="slot-summary-end" style="font-size:0.88rem;font-weight:700;color:#F87171;">—</div>
              </div>
              <div>
                <div style="font-size:0.68rem;color:rgba(255,255,255,0.4);">Date</div>
                <div id="slot-summary-date" style="font-size:0.88rem;font-weight:700;color:rgba(255,255,255,0.7);">—</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom:1rem;">
            <label class="pres-label">Intitulé du cours <span style="font-weight:400;opacity:0.5;">(optionnel)</span></label>
            <input type="text" id="sess-label-input" class="pres-input" placeholder="${trainer.specialty || 'Ex : Aptitude verbale'}">
          </div>

          <!-- Champs horaires manuels : uniquement si aucun créneau sélectionné -->
          <div id="sess-manual-times" style="display:none;margin-bottom:1.5rem;">
            <label class="pres-label" style="margin-bottom:0.5rem;display:block;">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align:middle;margin-right:3px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 8 14"/></svg>
              Promotion <span style="color:#F87171;">*</span>
            </label>
            <select id="sess-promo-select" class="pres-input" style="margin-bottom:0.75rem;">
              <option value="">Choisir une promotion</option>
              ${promoOptions || '<option disabled>Aucune promotion — contactez l\'admin</option>'}
            </select>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
              <div>
                <label class="pres-label">Heure de début</label>
                <input type="time" id="sess-start-time" class="pres-input" value="${_savedStart || _nowStart}">
              </div>
              <div>
                <label class="pres-label">Heure de clôture</label>
                <input type="time" id="sess-end-time" class="pres-input" value="${_defEnd}">
              </div>
            </div>
          </div>

          <button onclick="showPresenceConfirm()" style="width:100%;padding:0.9rem;border:none;border-radius:12px;background:linear-gradient(135deg,#22C55E,#16A34A);color:#fff;font-size:0.95rem;font-weight:800;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:0.6rem;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Lancer la séance
          </button>
        </div>

        <!-- ── Colonne droite : Séances récentes + Créneaux ── -->
        <div>

          <!-- Séances récentes -->
          <div style="background:#fff;border-radius:14px;border:1px solid #f0f0f0;margin-bottom:1.25rem;overflow:hidden;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.1rem;border-bottom:1px solid #f5f5f5;">
              <span style="font-size:0.92rem;font-weight:700;color:#1a1a2e;">Séances récentes</span>
              <a href="#" onclick="showAllTrainerSessions();return false;" style="font-size:0.75rem;color:#2d6a4f;text-decoration:none;font-weight:600;">Voir tout</a>
            </div>
            ${recentHtml}
          </div>

          <!-- Mes créneaux -->
          <div style="background:#fff;border-radius:14px;border:1px solid #f0f0f0;overflow:hidden;">
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1rem 1.1rem;border-bottom:1px solid #f5f5f5;">
              <span style="font-size:0.92rem;font-weight:700;color:#1a1a2e;">Mes créneaux</span>
              <button onclick="toggleTrainerSlotForm()" id="trainer-slot-toggle-btn"
                style="font-size:0.75rem;font-weight:600;padding:0.25rem 0.7rem;border-radius:7px;border:1.5px solid #2d6a4f;background:#e8f4ef;color:#2d6a4f;cursor:pointer;font-family:'DM Sans',sans-serif;">
                + Ajouter
              </button>
            </div>
            <div id="trainer-schedule-display">${slotsHtml}</div>
            <div id="trainer-slot-form" style="display:none;padding:1rem;border-top:1px solid #f0f0f0;background:#f8f9fa;">
              <div style="margin-bottom:0.5rem;">
                <label style="font-size:0.7rem;font-weight:700;color:#64748B;display:block;margin-bottom:0.25rem;">Date de la séance</label>
                <input type="date" id="tsf-date" class="ptg-select" style="width:100%;font-size:0.78rem;">
              </div>
              <div style="margin-bottom:0.5rem;">
                <label style="font-size:0.7rem;font-weight:700;color:#64748B;display:block;margin-bottom:0.25rem;">Promotion</label>
                <select id="tsf-promo" class="ptg-select" style="width:100%;font-size:0.78rem;"><option value="">— Choisir —</option>${promoOptions}</select>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.5rem;">
                <div>
                  <label style="font-size:0.7rem;font-weight:700;color:#64748B;display:block;margin-bottom:0.25rem;">Début</label>
                  <input type="time" id="tsf-start" class="ptg-select" style="width:100%;font-size:0.78rem;" value="08:00">
                </div>
                <div>
                  <label style="font-size:0.7rem;font-weight:700;color:#64748B;display:block;margin-bottom:0.25rem;">Fin</label>
                  <input type="time" id="tsf-end" class="ptg-select" style="width:100%;font-size:0.78rem;" value="11:00">
                </div>
              </div>
              <div style="margin-bottom:0.65rem;">
                <label style="font-size:0.7rem;font-weight:700;color:#64748B;display:block;margin-bottom:0.25rem;">Matière (optionnel)</label>
                <input type="text" id="tsf-label" class="ptg-select" style="width:100%;font-size:0.78rem;" placeholder="Ex : Culture générale">
              </div>
              <button onclick="saveTrainerScheduleSlot()"
                style="width:100%;padding:0.55rem;border:none;border-radius:9px;background:#2d6a4f;color:#fff;font-size:0.8rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">
                Enregistrer le créneau
              </button>
            </div>
          </div>

        </div>
      </div>`;

    // Restaurer les valeurs du formulaire saisies par le formateur
    if (_savedSlot)  { const el = document.getElementById('sess-slot-select'); if (el) el.value = _savedSlot; }
    if (_savedLabel) { const el = document.getElementById('sess-label-input'); if (el) el.value = _savedLabel; }
    // Rafraîchir l'affichage (récapitulatif créneau ou champs manuels)
    prefillFromSlot();
    // En mode manuel, définir les valeurs programmatiquement (value attribute peut être ignoré pour <input type="time">)
    if (!_savedSlot) {
      if (_savedPromo) { const el = document.getElementById('sess-promo-select'); if (el) el.value = _savedPromo; }
      const _stEl = document.getElementById('sess-start-time');
      if (_stEl) _stEl.value = _savedStart || _nowStart;
      const _etEl = document.getElementById('sess-end-time');
      if (_etEl) _etEl.value = _defEnd;
    }
    // Restaurer le formulaire d'ajout de créneau s'il était ouvert
    if (_slotFormOpen) {
      const form = document.getElementById('trainer-slot-form');
      const btn  = document.getElementById('trainer-slot-toggle-btn');
      if (form) form.style.display = 'block';
      if (btn)  btn.textContent = '✕ Annuler';
      if (_savedTsfDate)  { const el = document.getElementById('tsf-date');  if (el) el.value = _savedTsfDate; }
      if (_savedTsfStart) { const el = document.getElementById('tsf-start'); if (el) el.value = _savedTsfStart; }
      if (_savedTsfEnd)   { const el = document.getElementById('tsf-end');   if (el) el.value = _savedTsfEnd; }
      if (_savedTsfLabel) { const el = document.getElementById('tsf-label'); if (el) el.value = _savedTsfLabel; }
      if (_savedTsfPromo) { const el = document.getElementById('tsf-promo'); if (el) el.value = _savedTsfPromo; }
    }

    // Injecter le bloc participants de la session live si elle est active
    if (livePresenceBlock) {
      const existingBlock = document.getElementById('live-presence-in-trainer-view');
      if (!existingBlock) {
        const liveDiv = document.createElement('div');
        liveDiv.id = 'live-presence-in-trainer-view';
        liveDiv.innerHTML = livePresenceBlock;
        area.appendChild(liveDiv);
      } else {
        existingBlock.innerHTML = livePresenceBlock;
      }
    }
    return;
  }

  // ── Séance active ──
  const remaining = session.endsAt - now;
  const elapsed   = now - session.startedAt;
  const promo     = (appData.promotions || []).find(p => p.id === session.promotionId);
  const attendees = Object.entries(session.attendees);
  const presCount = attendees.filter(([,a]) => a.status === 'present').length;
  const abCount   = attendees.filter(([,a]) => a.status === 'absent').length;
  const pendCount = attendees.filter(([,a]) => a.status === 'pending').length;

  // Séparer les auditeurs connectés (au moins une fois) des jamais connectés
  const connectedAttendees = attendees.filter(([, a]) => a.connectedAt !== null);
  const notYetConnectedAttendees = attendees.filter(([, a]) => a.connectedAt === null);

  // Couleurs d'avatar par index
  const _avatarColors = ['#6366F1','#8B5CF6','#EC4899','#F59E0B','#10B981','#3B82F6','#14B8A6','#F97316'];
  function _avatarColor(name) {
    let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xFFFFFF;
    return _avatarColors[h % _avatarColors.length];
  }
  function _initials(name) {
    const p = name.trim().split(/\s+/);
    return p.length >= 2 ? (p[0][0] + p[p.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
  }

  const tableRows = connectedAttendees.map(([uid, a]) => {
    const pulse    = _getOnlinePulse(uid);
    const isOnline = pulse && (now - pulse.ts < HEARTBEAT_STALE_MS);
    const cumul    = a.cumulativeMs + (isOnline && a.continuousFrom ? (now - a.continuousFrom) : 0);
    const rowCls   = a.status === 'present' ? 'row-present' : a.status === 'absent' ? 'row-absent' : '';

    // ── Icône statut en ligne ──
    const onlineCell = isOnline
      ? `<span class="sess-online-icon">
           <span class="sess-pulse-ring"></span>
           <span style="font-size:0.72rem;font-weight:700;color:#16A34A;">En ligne</span>
         </span>`
      : `<span class="sess-offline-icon">
           <span class="sess-offline-dot"></span>
           <span style="font-size:0.72rem;font-weight:600;color:#94A3B8;">Hors ligne</span>
         </span>`;

    // ── Badge Pointage P / A / countdown ──
    let ptgCell;
    if (a.status === 'present') {
      ptgCell = `<span class="ptg-badge-p" title="Présent — validé à ${fmtTime(a.validatedAt)}">P</span>`;
    } else if (a.status === 'absent') {
      ptgCell = `<span class="ptg-badge-a" title="Absent depuis ${fmtTime(a.disconnectedAt)}">A</span>`;
    } else if (isOnline && a.continuousFrom) {
      const left = VALIDATE_DELAY_MS - (now - a.continuousFrom);
      if (left > 0) {
        const secs = Math.ceil(left / 1000);
        const mm = String(Math.floor(secs / 60)).padStart(2,'0');
        const ss = String(secs % 60).padStart(2,'0');
        ptgCell = `<span class="ptg-badge-wait">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${mm}:${ss} → P
        </span>`;
      } else {
        ptgCell = `<span class="ptg-badge-p">P</span>`;
      }
    } else if (!isOnline && a.absenceStart) {
      const gone = now - a.absenceStart;
      const leftA = ABSENCE_DELAY_MS - gone;
      if (leftA > 0) {
        const mm = String(Math.floor(leftA / 60000)).padStart(2,'0');
        const ss = String(Math.floor((leftA % 60000) / 1000)).padStart(2,'0');
        ptgCell = `<span class="ptg-badge-absent-wait">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${mm}:${ss} → A
        </span>`;
      } else {
        ptgCell = `<span class="ptg-badge-a">A</span>`;
      }
    } else {
      ptgCell = `<span class="ptg-badge-dash">—</span>`;
    }

    // ── Avatar initiales ──
    const av = _avatarColor(a.name);
    const ini = _initials(a.name);

    return `<tr class="${rowCls}">
      <td>
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <span class="sess-avatar" style="background:${av};">${ini}</span>
          <div>
            <div style="font-weight:700;color:#1E293B;font-size:0.84rem;">${a.name}</div>
            <div style="font-size:0.67rem;color:#64748B;margin-top:0.05rem;display:flex;align-items:center;gap:0.25rem;">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Connexion ${fmtTime(a.connectedAt)}
            </div>
          </div>
        </div>
      </td>
      <td style="text-align:center;">${onlineCell}</td>
      <td style="text-align:center;">${ptgCell}</td>
      <td style="text-align:center;">
        <span style="font-size:0.78rem;font-weight:600;color:#475569;display:flex;align-items:center;gap:0.25rem;justify-content:center;">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${fmtDuration(cumul)}
        </span>
      </td>
    </tr>`;
  }).join('');

  // Ligne récapitulative des auditeurs pas encore connectés
  const notYetRow = notYetConnectedAttendees.length > 0
    ? `<tr><td colspan="4" style="text-align:center;padding:0.65rem 1rem;background:#FFFBEB;border-top:1px dashed #FCD34D;font-size:0.78rem;color:#92400E;">
         <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
         ${notYetConnectedAttendees.length} auditeur${notYetConnectedAttendees.length > 1 ? 's' : ''} pas encore connecté${notYetConnectedAttendees.length > 1 ? 's' : ''} :
         <span style="font-weight:700;">${notYetConnectedAttendees.map(([,a]) => a.name).join(', ')}</span>
       </td></tr>`
    : '';

  area.innerHTML = `
    <!-- Bannière session active -->
    <div class="sess-banner" style="margin-bottom:1.25rem;">
      <div style="flex:1;">
        <div style="font-size:0.68rem;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.2rem;">Séance en cours</div>
        <div style="font-size:1rem;font-weight:800;color:#fff;">${session.label}</div>
        <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:0.2rem;">${session.promotionName} · Début ${fmtTime(session.startedAt)} · Clôture ${fmtTime(session.endsAt)}</div>
        <div style="display:flex;gap:0.5rem;margin-top:0.5rem;flex-wrap:wrap;">
          <span style="background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:6px;padding:0.1rem 0.5rem;font-size:0.67rem;font-weight:700;color:#4ADE80;">P après 2 min en ligne</span>
          <span style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:0.1rem 0.5rem;font-size:0.67rem;font-weight:700;color:#F87171;">A après 15 min hors ligne</span>
        </div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:0.65rem;font-weight:700;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.2rem;">Temps restant</div>
        <div class="sess-timer${remaining < 15*60*1000 ? ' ending' : ''}" id="sess-countdown-display">${fmtCountdown(remaining)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:0.4rem;align-items:flex-end;">
        <div style="display:flex;gap:0.6rem;">
          <div style="text-align:center;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:0.4rem 0.75rem;">
            <div style="font-size:1.3rem;font-weight:800;color:#22C55E;">${presCount}</div>
            <div style="font-size:0.62rem;color:rgba(255,255,255,0.45);">Présents</div>
          </div>
          <div style="text-align:center;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:0.4rem 0.75rem;">
            <div style="font-size:1.3rem;font-weight:800;color:#EF4444;">${abCount}</div>
            <div style="font-size:0.62rem;color:rgba(255,255,255,0.45);">Absents</div>
          </div>
          <div style="text-align:center;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.3);border-radius:10px;padding:0.4rem 0.75rem;">
            <div style="font-size:1.3rem;font-weight:800;color:#EAB308;">${pendCount}</div>
            <div style="font-size:0.62rem;color:rgba(255,255,255,0.45);">En attente</div>
          </div>
        </div>
        <button onclick="closeSession('${session.id}',false)" style="padding:0.5rem 1rem;border:none;border-radius:9px;background:rgba(239,68,68,0.8);color:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:0.3rem;">
          ■ Clôturer la séance
        </button>
      </div>
    </div>

    <!-- Tableau de présence -->
    <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;">
      <span style="font-size:0.88rem;font-weight:800;color:#1E293B;display:flex;align-items:center;gap:0.4rem;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Tableau de présence
      </span>
      <span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;color:#64748B;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:0.15rem 0.5rem;">
        <span class="ptg-badge-p" style="width:18px;height:18px;font-size:0.65rem;">P</span> 2 min en ligne
      </span>
      <span style="display:inline-flex;align-items:center;gap:0.3rem;font-size:0.7rem;color:#64748B;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:0.15rem 0.5rem;">
        <span class="ptg-badge-a" style="width:18px;height:18px;font-size:0.65rem;">A</span> 15 min hors ligne
      </span>
      <span style="margin-left:auto;font-size:0.7rem;color:#94A3B8;display:flex;align-items:center;gap:0.25rem;">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        Actualisé toutes les 15 s
      </span>
    </div>
    <div style="overflow-x:auto;border-radius:12px;border:1px solid #E2E8F0;box-shadow:0 1px 6px rgba(0,0,0,0.04);">
      <table class="sess-table" style="width:100%;">
        <thead><tr>
          <th style="padding-left:1rem;">
            <span style="display:flex;align-items:center;gap:0.35rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Auditeur
            </span>
          </th>
          <th style="text-align:center;">
            <span style="display:inline-flex;align-items:center;gap:0.3rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
              Connexion
            </span>
          </th>
          <th style="text-align:center;">
            <span style="display:inline-flex;align-items:center;gap:0.3rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Pointage
            </span>
          </th>
          <th style="text-align:center;">
            <span style="display:inline-flex;align-items:center;gap:0.3rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Durée
            </span>
          </th>
        </tr></thead>
        <tbody>${connectedAttendees.length === 0
          ? (attendees.length === 0
            ? '<tr><td colspan="4" style="text-align:center;color:#94A3B8;padding:2.5rem;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" style="display:block;margin:0 auto 0.5rem;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>Aucun auditeur dans cette promotion.</td></tr>'
            : '<tr><td colspan="4" style="text-align:center;color:#94A3B8;padding:2.5rem;"><div style="font-size:1.6rem;margin-bottom:0.35rem;">⏳</div>En attente de connexion des auditeurs…</td></tr>')
          : tableRows + notYetRow
        }</tbody>
      </table>
    </div>`;

  // Injecter le bloc participants live (s'il y a une session live active)
  if (livePresenceBlock) {
    const liveInsert = document.createElement('div');
    liveInsert.id = 'live-presence-in-trainer-view';
    liveInsert.innerHTML = livePresenceBlock;
    area.appendChild(liveInsert);
  }

  // Countdown en temps réel (démarré APRÈS le innerHTML pour éviter race-condition)
  const _sessIdForCountdown = session.id;
  _sessionCountdown = setInterval(() => {
    const el = document.getElementById('sess-countdown-display');
    if (!el) { clearInterval(_sessionCountdown); _sessionCountdown = null; return; }
    const rem = session.endsAt - Date.now();
    el.textContent = fmtCountdown(rem);
    if (rem < 15 * 60 * 1000) el.classList.add('ending');
    if (rem <= 0) { clearInterval(_sessionCountdown); _sessionCountdown = null; closeSession(_sessIdForCountdown, true); }
  }, 1000);
}

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

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════
function goTo(screenId) {
  const publicScreens = ['welcome', 'login-student', 'login-admin', 'login-trainer'];

  if (publicScreens.includes(screenId)) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
    document.getElementById('bottom-nav').style.display = 'none';
    document.getElementById('student-app').style.display = 'none';
    document.getElementById('admin-app').classList.remove('active');
    const tapp = document.getElementById('trainer-app'); if (tapp) tapp.classList.remove('active');
    state.screen = screenId;
    if (screenId === 'welcome' || screenId === 'login-admin' || screenId === 'login-trainer') {
      history.replaceState(null, '', location.pathname);
      document.body.classList.remove('direct-link-mode');
    }
    if (screenId === 'login-student') {
      history.replaceState(null, '', '#etudiant');
      document.body.classList.remove('direct-link-mode');
    }
    if (screenId === 'welcome') updateSessionResumeBanner();
    if (screenId === 'login-student') initLoginScreen();
    window.scrollTo(0, 0);
    return;
  }

  // Vérifier si l'utilisateur est connecté
  if (auth.role !== 'student') {
    showLoginScreen();
    return;
  }

  // Écrans étudiants (après connexion)
  const studentScreens = ['splash','course-study','selector','quiz','results','profile','leaderboard'];
  if (!studentScreens.includes(screenId)) return;

  document.querySelectorAll('#student-app .screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  state.screen = screenId;
  try { localStorage.setItem(SCREEN_KEY, 'student:' + screenId); } catch(e) {}

  const showNav = ['splash','course-study','selector','profile','leaderboard'].includes(screenId);
  document.getElementById('bottom-nav').style.display = showNav ? 'flex' : 'none';

  ['home','quiz','prof'].forEach(k => {
    const el = document.getElementById('nav-'+k);
    if (el) el.classList.remove('active');
  });
  if(screenId==='splash' || screenId==='course-study') { document.getElementById('nav-home').classList.add('active'); // renderStudentCourses(); // Désactivé - contenu statique utilisé
  }
  if(screenId==='selector') { document.getElementById('nav-quiz').classList.add('active'); renderSelectorTours(); renderSelectorCategories(); renderExerciseTypesSelector(); }
  if(screenId==='profile' || screenId==='leaderboard') { document.getElementById('nav-prof').classList.add('active'); renderProfile(); }

  document.querySelectorAll('#hdr-score').forEach(el => el.textContent = state.totalScore);
  window.scrollTo(0,0);
}

// ══════════════════════════════════════════
//  SELECTORS
// ══════════════════════════════════════════
function selectCat(cat) {
  state.selectedCat = cat;
  state.selectedExerciseType = null;
  document.querySelectorAll('[data-sel-cat]').forEach(el => el.classList.remove('selected'));
  const el = document.querySelector('[data-sel-cat="'+cat+'"]');
  if(el) el.classList.add('selected');
  renderExerciseTypesSelector();
}

function selectMode(mode) {
  state.selectedMode = mode;
  document.querySelectorAll('[data-mode]').forEach(el => el.classList.remove('selected'));
  document.querySelector('[data-mode="'+mode+'"]').classList.add('selected');
}

function selectDiff(diff) {
  state.selectedDiff = diff;
  document.querySelectorAll('[data-diff]').forEach(el => {
    el.style.borderColor = diff === el.dataset.diff ? 'var(--gold)' : '';
    el.style.background = diff === el.dataset.diff ? 'rgba(201,168,76,0.1)' : '';
  });
}

// ══════════════════════════════════════════
//  QUIZ LAUNCH
// ══════════════════════════════════════════
function startQuickQuiz(cat) {
  selectCat(cat);
  state.selectedMode = 'training';
  state.selectedDiff = 'moyen';
  launchQuiz();
}

function launchQuiz() {
  clearInterval(state.timerInterval);
  const cat = state.selectedCat;
  const QUESTIONS = getQuestions();
  let pool;
  if (cat === 'mixte') {
    const tourCourseIds = getCoursesByTour(state.selectedTour || 'tour1').map(c => c.id);
    pool = tourCourseIds.flatMap(id => QUESTIONS[id] || []);
  } else {
    pool = QUESTIONS[cat] || [];
  }

  if (!pool.length) {
    showNotif('❌ Aucune question disponible pour ce cours', 'error');
    return;
  }

  pool = shuffle([...pool]);
  const count = state.selectedMode === 'exam' ? 20 : 10;
  state.questions = pool.slice(0, Math.min(count, pool.length));
  state.currentQ = 0;
  state.score = 0;
  state.answers = [];
  state.startTime = Date.now();

  trackActivity('quiz');
  goTo('quiz');
  document.getElementById('bottom-nav').style.display = 'none';
  renderQuestion();
}

function shuffle(arr) {
  for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
  return arr;
}

// ══════════════════════════════════════════
//  RENDER QUESTION
// ══════════════════════════════════════════
function renderQuestion() {
  const q = state.questions[state.currentQ];
  const total = state.questions.length;
  const idx = state.currentQ;
  const cat = state.selectedCat === 'mixte' ? 'mixte' : state.selectedCat;

  // Determine cat of this question (for mixte)
  let qCat = state.selectedCat;
  if(state.selectedCat === 'mixte') {
    const QUESTIONS = getQuestions();
    for(const [k,arr] of Object.entries(QUESTIONS)) { if(arr.includes(q)) { qCat = k; break; } }
  }

  const badge = document.getElementById('q-cat-badge');
  const courseColor = getCourse(qCat)?.color || qCat;
  const courseIconEmoji = getCourseEmoji(qCat);
  let badgeText = iconHTML(courseIconEmoji, 13) + ' ' + getCourseName(qCat);
  if (state.selectedExerciseType && state.selectedCat !== 'mixte') {
    const exType = appData.exerciseTypes.find(e => e.id === state.selectedExerciseType);
    if (exType) badgeText += ' · ' + iconHTML(exType.icon, 13) + ' ' + exType.name;
  }
  badge.innerHTML = badgeText;
  badge.className = 'quiz-category-badge badge-' + courseColor;

  document.getElementById('progress-fill').style.width = ((idx/total)*100)+'%';
  document.getElementById('q-counter').textContent = (idx+1)+'/'+total;
  document.getElementById('q-number').textContent = 'Question ' + (idx+1);
  document.getElementById('q-text').textContent = q.q;
  document.getElementById('explanation-box').className = 'explanation-box';
  document.getElementById('explanation-box').textContent = '';
  document.getElementById('btn-next').className = 'btn-next';

  // Options
  const letters = ['A','B','C','D'];
  const optHtml = q.opts.map((opt, i) => `
    <button class="option-btn" onclick="selectAnswer(${i})" data-idx="${i}">
      <span class="option-letter">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');
  document.getElementById('options-list').innerHTML = optHtml;
  document.getElementById('quiz-score-hdr').textContent = state.score;

  // Timer
  clearInterval(state.timerInterval);
  if(state.selectedMode === 'timed' || state.selectedMode === 'exam') {
    state.timerVal = 30;
    updateTimer();
    state.timerInterval = setInterval(() => {
      state.timerVal--;
      updateTimer();
      if(state.timerVal <= 0) {
        clearInterval(state.timerInterval);
        timeOut();
      }
    }, 1000);
  } else {
    document.getElementById('timer-display').textContent = '⏳ Libre';
    document.getElementById('timer-display').className = 'timer-chip';
  }

  // Scroll top
  document.getElementById('quiz-scroll').scrollTo(0,0);
}

function updateTimer() {
  const el = document.getElementById('timer-display');
  el.textContent = '⏱ ' + state.timerVal + 's';
  if(state.timerVal <= 5) el.className = 'timer-chip danger';
  else if(state.timerVal <= 10) el.className = 'timer-chip warning';
  else el.className = 'timer-chip';
}

function timeOut() {
  showNotif('⏰ Temps écoulé !', 'error');
  const q = state.questions[state.currentQ];
  state.answers.push({ q: q.q, chosen: -1, correct: q.a, opts: q.opts, exp: q.exp, ok: false });
  disableOptions();
  revealAnswer(-1);
}

// ══════════════════════════════════════════
//  ANSWER HANDLING
// ══════════════════════════════════════════
function selectAnswer(idx) {
  clearInterval(state.timerInterval);
  const q = state.questions[state.currentQ];
  const correct = q.a;
  const isCorrect = idx === correct;

  // Sudden death
  if(state.selectedMode === 'sudden' && !isCorrect) {
    state.answers.push({ q:q.q, chosen:idx, correct:correct, opts:q.opts, exp:q.exp, ok:false });
    disableOptions();
    revealAnswer(idx);
    setTimeout(() => endQuiz(), 1500);
    showNotif('Partie terminée !', 'error');
    return;
  }

  if(isCorrect) {
    state.score++;
    state.totalScore += 10;
    document.getElementById('quiz-score-hdr').textContent = state.score;
    showNotif('Bonne réponse ! +10 pts', 'success');
  } else {
    showNotif('Mauvaise réponse', 'error');
  }

  state.answers.push({ q:q.q, chosen:idx, correct:correct, opts:q.opts, exp:q.exp, ok:isCorrect });
  disableOptions();
  revealAnswer(idx);
}

function revealAnswer(chosen) {
  const q = state.questions[state.currentQ];
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    if(i === q.a) btn.classList.add('correct');
    else if(i === chosen && chosen !== q.a) btn.classList.add('wrong');
  });

  if(state.selectedMode === 'training' || state.selectedMode === 'exam') {
    const expBox = document.getElementById('explanation-box');
    expBox.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;flex-shrink:0;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ' + q.exp;
    expBox.className = 'explanation-box visible';
  }

  document.getElementById('btn-next').className = 'btn-next visible';
  document.getElementById('btn-next').textContent =
    state.currentQ < state.questions.length - 1 ? 'Question suivante →' : 'Voir les résultats →';
}

function disableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
}

function nextQuestion() {
  state.currentQ++;
  if(state.currentQ >= state.questions.length) {
    endQuiz();
  } else {
    renderQuestion();
  }
}

async function confirmExit() {
  const ok = await confirmDialog('Quitter le quiz en cours ?');
  if (ok) {
    clearInterval(state.timerInterval);
    goTo('splash');
  }
}

// ══════════════════════════════════════════
//  END QUIZ
// ══════════════════════════════════════════
function endQuiz() {
  clearInterval(state.timerInterval);
  const elapsed = Math.round((Date.now() - state.startTime)/1000);
  const total = state.questions.length;
  const pct = Math.round((state.score / total) * 100);

  // Update stats
  state.quizPlayed++;
  if(pct > state.bestScore) state.bestScore = pct;
  const cat = state.selectedCat === 'mixte' ? 'culture' : state.selectedCat;
  if(state.catPlayed[cat] !== undefined) {
    state.catPlayed[cat]++;
    state.catScores[cat] = Math.max(state.catScores[cat]||0, pct);
  } else if (getCourse(cat)) {
    state.catPlayed[cat] = (state.catPlayed[cat] || 0) + 1;
    state.catScores[cat] = Math.max(state.catScores[cat]||0, pct);
  }

  // Render results
  document.getElementById('score-pct').textContent = pct + '%';
  document.getElementById('r-correct').textContent = state.score;
  document.getElementById('r-wrong').textContent = total - state.score;
  document.getElementById('r-time').textContent = elapsed < 60 ? elapsed+'s' : Math.floor(elapsed/60)+'m'+(elapsed%60)+'s';

  // Arc animation
  const circumference = 377;
  const offset = circumference - (pct/100) * circumference;
  document.getElementById('score-arc').style.strokeDashoffset = offset;

  // Mention
  let mention, desc;
  const mentionIcons = {
    gold: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
    star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F0D080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg>`,
    book: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    up: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:4px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  };
  if(pct >= 90) { mention = mentionIcons.gold + ' Excellent !'; desc = 'Performance exceptionnelle ! Tu es prêt pour le concours.'; }
  else if(pct >= 75) { mention = mentionIcons.star + ' Très Bien'; desc = 'Bon travail ! Continue à te perfectionner.'; }
  else if(pct >= 60) { mention = mentionIcons.check + ' Bien'; desc = 'Résultat correct. Revise les points manqués.'; }
  else if(pct >= 50) { mention = mentionIcons.book + ' Passable'; desc = 'Il faut travailler davantage. Ne lâche pas !'; }
  else { mention = mentionIcons.up + ' À Améliorer'; desc = 'Beaucoup à apprendre, mais la persévérance paye !'; }

  document.getElementById('score-mention').innerHTML = mention;
  document.getElementById('score-desc').textContent = desc;
  document.getElementById('review-section').style.display = 'none';

  saveQuizResult();
  saveUserStats();
  goTo('results');
}

function restartSameQuiz() { launchQuiz(); }

function showReview() {
  const sec = document.getElementById('review-section');
  sec.style.display = 'block';
  const list = document.getElementById('review-list');
  list.innerHTML = state.answers.map((ans, i) => `
    <div class="review-item ${ans.ok ? 'r-correct' : 'r-wrong'}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
        <span style="font-size:0.75rem;color:var(--text-muted);">Q${i+1}</span>
        <span class="review-status" style="color:${ans.ok ? 'var(--green)' : 'var(--red)'};">${ans.ok ? '✅ Correct' : '❌ Faux'}</span>
      </div>
      <div class="review-q">${ans.q}</div>
      <div class="review-answers">
        ${ans.chosen !== ans.correct && ans.chosen !== -1 ? `<div class="review-answer r-wrong-ans">Votre réponse : ${ans.opts[ans.chosen]}</div>` : ''}
        ${ans.chosen === -1 ? `<div class="review-answer r-wrong-ans">⏰ Pas de réponse (temps écoulé)</div>` : ''}
        <div class="review-answer r-correct-ans">✅ Bonne réponse : ${ans.opts[ans.correct]}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.35rem;line-height:1.5;display:flex;align-items:flex-start;gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${ans.exp}</div>
      </div>
    </div>
  `).join('');
  sec.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════════════════════════
//  LEADERBOARD
// ══════════════════════════════════════════
function renderLeaderboard() {
  // Add player to leaderboard if has score
  let lb = [...LEADERBOARD];
  if(state.totalScore > 0) {
    lb.push({ name: state.playerName, cat:"Joueur local", pts: state.totalScore, av: state.playerName.substring(0,2).toUpperCase(), col:"#C9A84C" });
    lb.sort((a,b) => b.pts - a.pts);
  }

  const top3 = lb.slice(0,3);
  const order = [1,0,2]; // 2nd, 1st, 3rd for podium display
  const podiumColors = ['#C0C0C0','linear-gradient(135deg,#F0D080,#C9A84C)','#CD7F32'];
  const podiumH = ['50px','70px','35px'];
  const podiumLabels = ['2','1','3'];

  document.getElementById('lb-podium').innerHTML = order.map((ri, pi) => {
    const p = top3[ri];
    if(!p) return '';
    return `
      <div class="podium-item podium-${pi===1?1:pi===0?2:3}">
        <div class="podium-avatar" style="background:${p.col}22;color:${p.col}">${p.av}</div>
        <div class="podium-name">${p.name}</div>
        <div class="podium-score">${p.pts} pts</div>
        <div class="podium-block" style="height:${podiumH[pi]};background:${podiumColors[pi]}">${podiumLabels[pi]}</div>
      </div>
    `;
  }).join('');

  document.getElementById('lb-list').innerHTML = lb.slice(0,10).map((p,i) => `
    <div class="lb-row">
      <div class="lb-rank">${i+1}</div>
      <div class="lb-av" style="background:${p.col}22;color:${p.col}">${p.av}</div>
      <div class="lb-info">
        <div class="lb-nm">${p.name}</div>
        <div class="lb-cat">${p.cat}</div>
      </div>
      <div class="lb-pts">${p.pts}</div>
    </div>
  `).join('');
}

// ══════════════════════════════════════════
//  PROFILE
// ══════════════════════════════════════════
function renderProfile() {
  const init = state.playerName.substring(0,2).toUpperCase();
  document.getElementById('prof-av').textContent = init;
  document.getElementById('prof-name').textContent = state.playerName;
  document.getElementById('name-input').value = state.playerName;

  const pts = state.totalScore;
  let level = 'Débutant';
  if(pts>=5000) level='Expert Concours';
  else if(pts>=2000) level='Avancé';
  else if(pts>=800) level='Intermédiaire';
  else if(pts>=200) level='Débutant+';
  document.getElementById('prof-level').innerHTML = iconHTML('🎓', 14) + ' ' + level;

  document.getElementById('p-total').textContent = pts;
  document.getElementById('p-quizzes').textContent = state.quizPlayed;
  document.getElementById('p-best').textContent = state.bestScore + '%';

  document.getElementById('cat-progress').innerHTML = getTours().map((tour, idx) => {
    const courses = getCoursesByTour(tour.id);
    const rows = courses.map(cat => {
      const pct = state.catScores[cat.id] || 0;
      const color = cat.color || 'culture';
      return `
        <div class="cat-prog-item">
          <div class="cat-prog-header">
            <span class="cat-prog-name">${iconHTML(cat.icon, 14)} ${cat.name}</span>
            <span class="cat-prog-pct">${pct}%</span>
          </div>
          <div class="cat-prog-bar">
            <div class="cat-prog-fill prog-${color}" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
    return `
      <details class="tour-accordion" data-tour="${tour.id}" style="max-width:100%;" ${idx === 0 ? 'open' : ''}>
        <summary class="tour-accordion-summary">
          <div class="tour-summary-row">
            <span class="tour-summary-chevron">▼</span>
            <span class="tour-header-icon">${iconHTML(tour.icon, 16)}</span>
            <div class="tour-summary-text">
              <div class="tour-header-title">${tour.name}</div>
            </div>
          </div>
        </summary>
        <div class="tour-accordion-body" style="padding-top:0.5rem;">
          ${rows || '<p class="muted" style="font-size:0.82rem;">Aucune matière</p>'}
        </div>
      </details>
    `;
  }).join('');
  initTourAccordions();
}

function saveName() {
  const val = document.getElementById('name-input').value.trim();
  if(val) {
    state.playerName = val;
    saveUserStats();
    renderProfile();
    showNotif('✅ Profil mis à jour !', 'success');
  }
}

// ══════════════════════════════════════════
//  NOTIFICATION
// ══════════════════════════════════════════
let notifTimer = null;
function showNotif(msg, type='') {}

// ══════════════════════════════════════════
//  STUDENT RESULTS TRACKING
// ══════════════════════════════════════════
function saveQuizResult() {
  if (auth.role !== 'student' || !auth.userId) return;
  
  const user = appData.users.find(u => u.id === auth.userId);
  if (!user) return;
  
  const courseName = getCourseName(state.selectedCat);
  const correct = state.answers.filter((a, i) => a === state.questions[i].a).length;
  const wrong = state.questions.length - correct;
  const percentage = Math.round((correct / state.questions.length) * 100);
  const elapsedTime = Math.round((Date.now() - state.startTime) / 1000);
  
  const quizResult = {
    id: genId('quiz'),
    date: Date.now(),
    score: state.score,
    maxScore: state.totalScore,
    percentage: percentage,
    correct: correct,
    wrong: wrong,
    timeSpent: elapsedTime,
    category: state.selectedCat,
    courseId: state.selectedCat,
    courseName: courseName,
    mode: state.selectedMode,
    difficulty: state.selectedDiff,
    questionCount: state.questions.length
  };
  
  if (!appData.studentResults) appData.studentResults = {};
  if (!appData.studentResults[auth.userId]) {
    appData.studentResults[auth.userId] = {
      userId: auth.userId,
      name: user.name,
      phone: user.phone,
      quizzes: [],
      totalPoints: 0,
      totalQuizzes: 0,
      lastActivity: Date.now(),
      averageScore: 0
    };
  }
  
  const studentData = appData.studentResults[auth.userId];
  studentData.quizzes.push(quizResult);
  studentData.totalPoints = (studentData.totalPoints || 0) + state.score;
  studentData.totalQuizzes = studentData.quizzes.length;
  studentData.lastActivity = Date.now();
  studentData.averageScore = Math.round(studentData.quizzes.reduce((sum, q) => sum + q.percentage, 0) / studentData.quizzes.length);
  
  saveAppData(false);
}

// ════════════════════════════════════════════
//  ADMIN QCM MANUEL
// ════════════════════════════════════════════
let qcmAdminCourseId = null;

function renderQCMCourseChips() {
  const chips = document.getElementById('qcm-course-chips');
  if (!chips) return;
  if (!appData.courses.length) {
    chips.innerHTML = '<div class="empty-state">Créez d\'abord un cours dans « Cours & PDF ».</div>';
    document.getElementById('qcm-form-wrap').style.display = 'none';
    return;
  }
  document.getElementById('qcm-form-wrap').style.display = 'block';
  if (!qcmAdminCourseId || !getCourse(qcmAdminCourseId)) qcmAdminCourseId = appData.courses[0].id;
  chips.innerHTML = appData.courses.map(c =>
    `<button class="course-select-chip ${qcmAdminCourseId === c.id ? 'active' : ''}" onclick="selectQCMCourse('${c.id}')" style="display:inline-flex;align-items:center;gap:4px;">${iconHTML(c.icon, 13)} ${c.name}</button>`
  ).join('');
}

function selectQCMCourse(id) {
  qcmAdminCourseId = id;
  resetQCMForm();
  renderQCMCourseChips();
  renderAdminQCMList();
}

function renderAdminQCMList() {
  const list = document.getElementById('admin-qcm-list');
  const badge = document.getElementById('qcm-count-badge');
  if (!list) return;
  if (!qcmAdminCourseId) { list.innerHTML = '<div class="empty-state">Sélectionnez un cours.</div>'; return; }
  const questions = (appData.questions[qcmAdminCourseId] || []);
  if (badge) badge.textContent = questions.length;
  if (!questions.length) {
    list.innerHTML = '<div class="empty-state" style="padding:2rem;text-align:center;">Aucune question.<br>Ajoutez la première via le formulaire.</div>';
    return;
  }
  const letters = ['A','B','C','D'];
  list.innerHTML = questions.map((q, i) => `
    <div class="admin-item" style="flex-direction:column;align-items:flex-start;gap:0.6rem;">
      <div style="display:flex;width:100%;align-items:center;gap:0.75rem;">
        <div style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:rgba(124,58,237,0.15);color:#7C3AED;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">${i+1}</div>
        <div style="flex:1;font-weight:600;font-size:0.875rem;">${q.q}</div>
        <div style="display:flex;gap:0.35rem;flex-shrink:0;">
          <button class="btn-icon" onclick="editQCMQuestion(${i})" title="Modifier">✏️</button>
          <button class="btn-icon danger" onclick="deleteQCMQuestion(${i})" title="Supprimer">🗑️</button>
        </div>
      </div>
      <div style="padding-left:2.5rem;display:flex;flex-wrap:wrap;gap:0.35rem;">
        ${q.opts.map((opt, oi) => `<span style="font-size:0.72rem;padding:0.18rem 0.55rem;border-radius:50px;background:${oi===q.a?'rgba(16,185,129,0.15)':'rgba(255,255,255,0.06)'};color:${oi===q.a?'#10B981':'var(--text-muted)'};border:1px solid ${oi===q.a?'rgba(16,185,129,0.3)':'var(--border)'};">${letters[oi]}. ${opt}</span>`).join('')}
      </div>
      ${q.exp ? `<div style="padding-left:2.5rem;font-size:0.75rem;color:var(--text-muted);line-height:1.5;">💡 ${q.exp}</div>` : ''}
    </div>
  `).join('');
}

function saveQCMQuestion() {
  if (!qcmAdminCourseId) { showNotif('⚠️ Sélectionnez un cours', 'error'); return; }
  const q = document.getElementById('qcm-q-text').value.trim();
  const opts = [0,1,2,3].map(i => document.getElementById('qcm-opt-'+i).value.trim());
  const a = parseInt(document.getElementById('qcm-correct').value);
  const exp = document.getElementById('qcm-exp').value.trim();
  const diff = document.getElementById('qcm-diff').value;

  if (!q) { showNotif('⚠️ La question est requise', 'error'); return; }
  if (opts.some(o => !o)) { showNotif('⚠️ Remplissez les 4 options', 'error'); return; }
  if (!exp) { showNotif('⚠️ L\'explication est requise', 'error'); return; }

  const newQ = { q, opts, a, exp, diff };
  if (!appData.questions[qcmAdminCourseId]) appData.questions[qcmAdminCourseId] = [];

  const editIdx = document.getElementById('qcm-edit-idx').value;
  if (editIdx !== '') {
    appData.questions[qcmAdminCourseId][parseInt(editIdx)] = newQ;
    showNotif('✅ Question modifiée', 'success');
  } else {
    appData.questions[qcmAdminCourseId].push(newQ);
    showNotif('✅ Question ajoutée', 'success');
  }
  saveAppData(false);
  resetQCMForm();
  renderAdminQCMList();
  renderAdminStats();
}

function editQCMQuestion(idx) {
  if (!qcmAdminCourseId) return;
  const q = (appData.questions[qcmAdminCourseId] || [])[idx];
  if (!q) return;
  document.getElementById('qcm-edit-idx').value = idx;
  document.getElementById('qcm-q-text').value = q.q;
  [0,1,2,3].forEach(i => { document.getElementById('qcm-opt-'+i).value = q.opts[i] || ''; });
  document.getElementById('qcm-correct').value = q.a;
  document.getElementById('qcm-exp').value = q.exp || '';
  document.getElementById('qcm-diff').value = q.diff || 'moyen';
  document.getElementById('qcm-form-title').textContent = '✏️ Modifier la question';
  document.getElementById('qcm-q-text').focus();
}

function deleteQCMQuestion(idx) {
  (async () => {
    const ok = await confirmDialog('Supprimer cette question ?');
    if (!ok) return;
    appData.questions[qcmAdminCourseId].splice(idx, 1);
    saveAppData(false);
    renderAdminQCMList();
    renderAdminStats();
    showNotif('🗑️ Question supprimée', '');
  })();
}

function resetQCMForm() {
  document.getElementById('qcm-edit-idx').value = '';
  document.getElementById('qcm-q-text').value = '';
  [0,1,2,3].forEach(i => { document.getElementById('qcm-opt-'+i).value = ''; });
  document.getElementById('qcm-correct').value = '0';
  document.getElementById('qcm-exp').value = '';
  document.getElementById('qcm-diff').value = 'moyen';
  document.getElementById('qcm-form-title').textContent = 'Ajouter une question';
}

function resetAllContent() {
  (async () => {
    const ok = await confirmDialog('Vider TOUS les cours, questions et vidéos ? Les comptes étudiants seront conservés. Cette action est irréversible.', { confirmText:'Vider le contenu' });
    if (!ok) return;
    appData.courses = [];
    appData.exerciseTypes = [];
    appData.questions = {};
    saveVideos([]);
    saveAppData(false);
    renderAdminPanel();
    showNotif('Contenu vidé — ajoutez vos cours', 'success');
  })();
}

function resetAllStudents() {
  (async () => {
    const ok = await confirmDialog(
      'Supprimer TOUS les comptes étudiants ? Cette action est irréversible. Les promotions et le contenu seront conservés.',
      { confirmText: 'Vider les comptes' }
    );
    if (!ok) return;
    appData.users = [];
    saveAppData(false);
    renderAdminPanel();
    showNotif('Tous les comptes étudiants ont été supprimés.', 'success');
  })();
}

// ════════════════════════════════════════════
//  ADMIN RESULTS
// ════════════════════════════════════════════
function renderAdminResults() {
  const resultsContainer = document.getElementById('admin-results-list');
  if (!resultsContainer) return;
  
  if (!appData.studentResults || Object.keys(appData.studentResults).length === 0) {
    resultsContainer.innerHTML = '<div class="empty-state">Aucun résultat pour le moment. Les résultats des apprenants apparaîtront ici.</div>';
    return;
  }
  
  const students = Object.values(appData.studentResults).sort((a, b) => b.lastActivity - a.lastActivity);
  
  resultsContainer.innerHTML = students.map(student => `
    <div class="student-result-card" onclick="showStudentDetails('${student.userId}')">
      <div class="student-result-info">
        <div class="student-result-name">👤 ${student.name}</div>
        <div class="student-result-meta">
          📞 ${student.phone} · Dernier quiz: ${new Date(student.lastActivity).toLocaleDateString('fr-FR')}
        </div>
      </div>
      <div class="student-result-stats">
        <div class="student-stat">
          <div class="student-stat-value">${student.totalPoints}</div>
          <div class="student-stat-label">Points</div>
        </div>
        <div class="student-stat">
          <div class="student-stat-value">${student.totalQuizzes}</div>
          <div class="student-stat-label">Quiz</div>
        </div>
        <div class="student-stat">
          <div class="student-stat-value">${student.averageScore}%</div>
          <div class="student-stat-label">Moyenne</div>
        </div>
      </div>
      <button class="btn-secondary" style="padding:0.5rem 0.8rem;" onclick="event.stopPropagation(); showStudentDetails('${student.userId}')">➜</button>
    </div>
  `).join('');
}

function showStudentDetails(userId) {
  const student = appData.studentResults?.[userId];
  if (!student) return;

  const quizHistory = student.quizzes.map(q => `
    <div class="quiz-history-item">
      <div class="quiz-history-item-header">
        <span>${q.courseName} (${q.mode})</span>
        <span class="quiz-history-item-score">${q.percentage}%</span>
      </div>
      <div class="quiz-history-item-meta">
        ${q.correct}✅ / ${q.wrong}❌ · ${q.timeSpent}s · ${new Date(q.date).toLocaleDateString('fr-FR')} ${new Date(q.date).toLocaleTimeString('fr-FR')}
      </div>
    </div>
  `).join('');

  const body = document.createElement('div');
  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <div class="student-detail-avatar">${student.name.substring(0,2).toUpperCase()}</div>
        <div>
          <h3 style="margin:0;color:var(--text);">${student.name}</h3>
          <div style="font-size:0.9rem;color:var(--text-muted);">📞 ${student.phone}</div>
        </div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1rem;">
      <div style="background:var(--surface);border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:1.6rem;font-weight:700;color:var(--blue);">${student.totalPoints}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">POINTS TOTAUX</div>
      </div>
      <div style="background:var(--surface);border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:1.6rem;font-weight:700;color:var(--blue);">${student.totalQuizzes}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">QUIZ JOUÉS</div>
      </div>
      <div style="background:var(--surface);border-radius:12px;padding:1rem;text-align:center;">
        <div style="font-size:1.6rem;font-weight:700;color:var(--blue);">${student.averageScore}%</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">MOYENNE</div>
      </div>
    </div>
    <div style="margin-top:0.5rem;">
      <h4 style="margin-bottom:0.75rem;color:var(--text);">📋 Historique des Quiz</h4>
      ${quizHistory || '<div class="empty-state">Aucun quiz joué encore.</div>'}
    </div>
  `;

  openModal({ title: student.name, body, showConfirm: false });
}

function sortStudentResults(sortBy) {
  const students = Object.values(appData.studentResults || {});
  
  if (sortBy === 'name') {
    students.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'score') {
    students.sort((a, b) => b.averageScore - a.averageScore);
  } else if (sortBy === 'recent') {
    students.sort((a, b) => b.lastActivity - a.lastActivity);
  }
  
  appData.studentResults = {};
  students.forEach(s => appData.studentResults[s.userId] = s);
  renderAdminResults();
}

// ══════════════════════════════════════════
//  QCM GENERATOR (LOCAL - NO API)
// ══════════════════════════════════════════
let qcmGeneratorState = {
  selectedCourseId: null,
  extractedText: '',
  generatedQuestions: []
};

async function renderQCMGeneratorPanel() {
  const courseList = document.getElementById('qcm-course-list');
  if (!courseList) return;
  
  const coursesWithPDF = appData.courses.filter(c => c.pdfName);
  
  if (coursesWithPDF.length === 0) {
    courseList.innerHTML = '<div class="empty-state" style="grid-column:1/-1;padding:2rem;">Aucun cours avec PDF. Ajoutez un PDF à un cours d\'abord.</div>';
    return;
  }
  
  courseList.innerHTML = coursesWithPDF.map(course => `
    <button class="mode-card" style="cursor:pointer;padding:1rem;" onclick="selectCourseForQCM('${course.id}')">
      <span style="display:flex;justify-content:center;align-items:center;">${iconHTML(course.icon, 24)}</span>
      <div style="font-size:0.9rem;font-weight:600;margin-top:0.5rem;">${course.name}</div>
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.25rem;display:flex;align-items:center;gap:3px;justify-content:center;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> PDF présent</div>
    </button>
  `).join('');
}

function selectCourseForQCM(courseId) {
  qcmGeneratorState.selectedCourseId = courseId;
  const course = getCourse(courseId);
  document.getElementById('qcm-selected-course').innerHTML = iconHTML(course.icon, 14) + ' ' + course.name;
  document.getElementById('qcm-generator-form').style.display = 'block';
  document.getElementById('qcm-generation-progress').style.display = 'none';
  document.getElementById('qcm-generated-list').style.display = 'none';
}

function cancelQCMGeneration() {
  qcmGeneratorState.selectedCourseId = null;
  qcmGeneratorState.generatedQuestions = [];
  document.getElementById('qcm-generator-form').style.display = 'none';
  document.getElementById('qcm-generation-progress').style.display = 'none';
  document.getElementById('qcm-generated-list').style.display = 'none';
}

async function generateQCMFromPDF() {
  if (!qcmGeneratorState.selectedCourseId) {
    showNotif('❌ Sélectionnez un cours', 'error');
    return;
  }
  
  const courseId = qcmGeneratorState.selectedCourseId;
  const course = getCourse(courseId);
  const count = parseInt(document.getElementById('qcm-count').value) || 15;
  
  document.getElementById('qcm-generator-form').style.display = 'none';
  document.getElementById('qcm-generation-progress').style.display = 'block';
  document.getElementById('qcm-generated-list').style.display = 'none';
  
  try {
    updateQCMProgress('Extraction du PDF...', 0);
    const pdfData = await getPdf(courseId);
    
    if (!pdfData?.blob) {
      showNotif('❌ Aucun PDF trouvé', 'error');
      cancelQCMGeneration();
      return;
    }
    
    updateQCMProgress('Extraction du texte...', 20);
    const text = await extractTextFromPDF(pdfData.blob);
    qcmGeneratorState.extractedText = text;
    
    updateQCMProgress('Génération des questions...', 50);
    const questions = generateQuestionsFromText(text, count, course);
    qcmGeneratorState.generatedQuestions = questions;
    
    updateQCMProgress('Questions prêtes !', 100);
    
    setTimeout(() => {
      displayGeneratedQCM(questions, course);
    }, 500);
    
  } catch (error) {
    console.error('Erreur génération QCM:', error);
    showNotif('❌ Erreur lors de la génération', 'error');
    cancelQCMGeneration();
  }
}

function updateQCMProgress(text, percentage) {
  document.getElementById('qcm-progress-text').textContent = text;
  document.getElementById('qcm-progress-bar').style.width = percentage + '%';
}

async function extractTextFromPDF(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const pdf = await pdfjsLib.getDocument(e.target.result).promise;
        let fullText = '';
        
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          fullText += text.items.map(item => item.str).join(' ') + '\n';
        }
        
        resolve(fullText);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

function generateQuestionsFromText(text, count, course) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const questions = [];
  
  const templates = [
    { type: 'definition', pattern: 'Qu\'est-ce que' },
    { type: 'fact', pattern: 'Quel' },
    { type: 'year', pattern: 'En quelle année' },
    { type: 'who', pattern: 'Qui' },
    { type: 'where', pattern: 'Où' }
  ];
  
  const textChunks = sentences.slice(0, Math.min(count * 3, sentences.length));
  
  for (let i = 0; i < count && i < textChunks.length; i++) {
    const sentence = textChunks[i].trim();
    if (sentence.length < 20) continue;
    
    const keywords = extractKeywords(sentence);
    if (keywords.length < 2) continue;
    
    const difficulty = ['facile', 'moyen', 'difficile'][i % 3];
    const mainKeyword = keywords[0];
    
    const question = {
      q: generateQuestionText(sentence, templates[i % templates.length], mainKeyword),
      opts: generateOptions(sentence, keywords, course),
      a: 0,
      exp: generateExplanation(sentence),
      difficulty: difficulty,
      courseId: course.id,
      courseName: course.name
    };
    
    if (question.opts.length === 4 && question.q.length > 15) {
      questions.push(question);
    }
  }
  
  return questions.slice(0, count);
}

function extractKeywords(sentence) {
  const words = sentence.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4 && !['est', 'que', 'pour', 'avec', 'dans', 'dont'].includes(w));
  return [...new Set(words)].slice(0, 3);
}

function generateQuestionText(sentence, template, keyword) {
  const questions = [
    `Selon le texte, qu'est-ce que "${keyword}" ?`,
    `En se basant sur le passage, quel est le rôle de "${keyword}" ?`,
    `Quelle affirmation sur "${keyword}" est correcte ?`,
    `Le texte mentionne "${keyword}" en rapport avec :`,
    `Comment le texte décrit-il "${keyword}" ?`
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

function generateOptions(sentence, keywords, course) {
  const correct = keywords[0].charAt(0).toUpperCase() + keywords[0].slice(1);
  
  const distractors = [
    'Un concept non lié au sujet',
    'Une définition incorrecte',
    'Une information opposée'
  ];
  
  const options = [correct, ...distractors];
  return shuffleArray(options);
}

function generateExplanation(sentence) {
  return sentence.trim().length > 100 
    ? sentence.substring(0, 150) + '...'
    : sentence.trim();
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function displayGeneratedQCM(questions, course) {
  document.getElementById('qcm-generation-progress').style.display = 'none';
  document.getElementById('qcm-generated-list').style.display = 'block';
  
  const preview = document.getElementById('qcm-preview');
  preview.innerHTML = questions.map((q, idx) => `
    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:1rem;">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:0.75rem;">
        <div style="font-weight:600;color:var(--blue);">Q${idx + 1}</div>
        <span style="background:var(--surface2);padding:0.25rem 0.6rem;border-radius:50px;font-size:0.7rem;color:var(--text-muted);">📊 ${q.difficulty}</span>
      </div>
      <div style="margin-bottom:0.75rem;font-weight:600;">${q.q}</div>
      <div style="margin-left:1rem;color:var(--text-muted);font-size:0.85rem;">
        ${q.opts.map((opt, i) => `<div>• ${opt}</div>`).join('')}
      </div>
      <div style="margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid var(--border);font-size:0.8rem;color:var(--blue);">
        ✅ Réponse: ${q.opts[q.a]}
      </div>
    </div>
  `).join('');
  
  showNotif(`✅ ${questions.length} questions générées !`, 'success');
}

function saveGeneratedQCM() {
  if (!qcmGeneratorState.selectedCourseId || qcmGeneratorState.generatedQuestions.length === 0) {
    showNotif('❌ Aucune question à sauvegarder', 'error');
    return;
  }
  
  const courseId = qcmGeneratorState.selectedCourseId;
  
  if (!appData.questions[courseId]) {
    appData.questions[courseId] = [];
  }
  
  appData.questions[courseId].push(...qcmGeneratorState.generatedQuestions);
  
  saveAppData(false);
  
  showNotif(`✅ ${qcmGeneratorState.generatedQuestions.length} questions ajoutées !`, 'success');
  
  setTimeout(() => {
    cancelQCMGeneration();
    renderQCMGeneratorPanel();
  }, 1000);
}

function discardGeneratedQCM() {
  qcmGeneratorState.generatedQuestions = [];
  cancelQCMGeneration();
  renderQCMGeneratorPanel();
}

// ══════════════════════════════════════════
//  VIDEO CAPSULES — IndexedDB + Upload local
// ══════════════════════════════════════════
const VIDEO_STORAGE_KEY = 'hermes_videos';
const VIDEO_DB_NAME = 'hermes_video_files';
const VIDEO_FILE_STORE = 'video_files';

// ── IndexedDB pour les fichiers vidéo ──
function openVideoDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(VIDEO_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(VIDEO_FILE_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveVideoFile(videoId, blob, fileName) {
  const db = await openVideoDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_FILE_STORE, 'readwrite');
    tx.objectStore(VIDEO_FILE_STORE).put({ blob, fileName, updatedAt: Date.now() }, videoId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getVideoFile(videoId) {
  const db = await openVideoDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_FILE_STORE, 'readonly');
    const req = tx.objectStore(VIDEO_FILE_STORE).get(videoId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteVideoFile(videoId) {
  const db = await openVideoDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VIDEO_FILE_STORE, 'readwrite');
    tx.objectStore(VIDEO_FILE_STORE).delete(videoId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── Métadonnées vidéo (localStorage) ──
function loadVideos() {
  try {
    const saved = localStorage.getItem(VIDEO_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch(e) { return []; }
}

function saveVideos(videos) {
  try { localStorage.setItem(VIDEO_STORAGE_KEY, JSON.stringify(videos)); } catch(e) {}
}

function getVideos() { return loadVideos(); }
function getVideoById(id) { return loadVideos().find(v => v.id === id); }

function getLevelLabel(level) {
  const map = { debutant:'🟢 Débutant', intermediaire:'🟡 Intermédiaire', avance:'🔴 Avancé' };
  return map[level] || level;
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' Ko';
  return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

// ── Gestion de l'upload ──
let pendingVideoFile = null;
let pendingVideoFileName = null;

function handleVideoFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    showNotif('❌ Ce fichier n\'est pas une vidéo', 'error');
    return;
  }
  const maxSize = 500 * 1024 * 1024; // 500 Mo
  if (file.size > maxSize) {
    showNotif('❌ Fichier trop lourd (max 500 Mo)', 'error');
    return;
  }
  pendingVideoFile = file;
  pendingVideoFileName = file.name;

  // Mise à jour UI
  const zone = document.getElementById('video-upload-zone');
  const label = document.getElementById('video-upload-label');
  const info = document.getElementById('video-file-info');
  const nameEl = document.getElementById('video-file-name');
  const sizeEl = document.getElementById('video-file-size');

  if (zone) zone.classList.add('has-file');
  if (label) label.textContent = '✅ Vidéo sélectionnée';
  if (nameEl) nameEl.textContent = file.name;
  if (sizeEl) sizeEl.textContent = formatFileSize(file.size);
  if (info) info.classList.add('show');

  // Pré-remplir le titre si vide
  const titleInput = document.getElementById('video-title');
  if (titleInput && !titleInput.value.trim()) {
    titleInput.value = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  }
}

function clearVideoFile() {
  pendingVideoFile = null;
  pendingVideoFileName = null;
  const input = document.getElementById('video-file-input');
  if (input) input.value = '';
  const zone = document.getElementById('video-upload-zone');
  const label = document.getElementById('video-upload-label');
  const info = document.getElementById('video-file-info');
  if (zone) zone.classList.remove('has-file');
  if (label) label.textContent = 'Cliquer pour choisir une vidéo';
  if (info) info.classList.remove('show');
  document.getElementById('video-current-info').style.display = 'none';
}

// ── ADMIN: Sauvegarder une capsule ──
async function saveVideo() {
  const title = document.getElementById('video-title')?.value.trim();
  const courseId = document.getElementById('video-course')?.value;
  const duration = document.getElementById('video-duration')?.value.trim();
  const level = document.getElementById('video-level')?.value;
  const desc = document.getElementById('video-desc')?.value.trim();
  const editId = document.getElementById('video-edit-id')?.value;

  if (!title) { showNotif('❌ Le titre est requis', 'error'); return; }
  if (!courseId) { showNotif('❌ Veuillez sélectionner un cours', 'error'); return; }

  const videos = loadVideos();

  if (editId) {
    // Modification
    const idx = videos.findIndex(v => v.id === editId);
    if (idx === -1) return;
    if (pendingVideoFile) {
      await deleteVideoFile(editId);
      await saveVideoFile(editId, pendingVideoFile, pendingVideoFileName);
      videos[idx].fileName = pendingVideoFileName;
      videos[idx].fileSize = pendingVideoFile.size;
    }
    videos[idx] = { ...videos[idx], title, courseId, duration, level, desc, updatedAt: Date.now() };
    showNotif('✅ Capsule modifiée !', 'success');
  } else {
    // Nouvelle capsule
    if (!pendingVideoFile) { showNotif('❌ Veuillez choisir un fichier vidéo', 'error'); return; }
    const newId = genId('vid');
    try {
      showNotif('⏳ Enregistrement en cours…', '');
      await saveVideoFile(newId, pendingVideoFile, pendingVideoFileName);
      const newVideo = {
        id: newId,
        title, courseId, duration, level, desc,
        fileName: pendingVideoFileName,
        fileSize: pendingVideoFile.size,
        views: 0,
        createdAt: Date.now(),
      };
      videos.push(newVideo);
      showNotif('✅ Capsule ajoutée !', 'success');
    } catch(e) {
      showNotif('❌ Erreur lors de l\'enregistrement', 'error');
      return;
    }
  }

  saveVideos(videos);
  resetVideoForm();
  renderAdminVideosList();
  renderStudentVideos();
}

function resetVideoForm() {
  ['video-title','video-duration','video-desc'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const lvl = document.getElementById('video-level');
  if (lvl) lvl.value = 'intermediaire';
  const crs = document.getElementById('video-course');
  if (crs) crs.value = '';
  const editId = document.getElementById('video-edit-id');
  if (editId) editId.value = '';
  const title = document.getElementById('video-form-title');
  if (title) title.textContent = 'Ajouter une capsule';
  clearVideoFile();
}

function editVideo(id) {
  const v = getVideoById(id);
  if (!v) return;
  document.getElementById('video-edit-id').value = v.id;
  document.getElementById('video-title').value = v.title || '';
  document.getElementById('video-course').value = v.courseId || '';
  document.getElementById('video-duration').value = v.duration || '';
  document.getElementById('video-level').value = v.level || 'intermediaire';
  document.getElementById('video-desc').value = v.desc || '';
  document.getElementById('video-form-title').textContent = 'Modifier la capsule';

  // Afficher le fichier actuel
  if (v.fileName) {
    const cur = document.getElementById('video-current-info');
    cur.style.display = 'block';
    cur.innerHTML = '🎬 Fichier actuel : <strong>' + v.fileName + '</strong>' + (v.fileSize ? ' (' + formatFileSize(v.fileSize) + ')' : '') + '<br><span style="font-size:0.72rem;color:var(--text-muted);">Choisissez un nouveau fichier pour le remplacer</span>';
  }

  switchAdminView('videos');
  document.getElementById('video-title')?.focus();
  window.scrollTo(0, 0);
}

async function deleteVideo(id) {
  const confirmed = await confirmDialog('Supprimer cette capsule vidéo ? Le fichier sera définitivement effacé.', { title:'Supprimer', confirmText:'Supprimer' });
  if (!confirmed) return;
  try {
    await deleteVideoFile(id);
  } catch(e) {}
  const videos = loadVideos().filter(v => v.id !== id);
  saveVideos(videos);
  renderAdminVideosList();
  renderStudentVideos();
  showNotif('🗑️ Capsule supprimée', 'success');
}

function renderAdminVideosList() {
  const container = document.getElementById('admin-videos-list');
  const badge = document.getElementById('videos-count-badge');
  if (!container) return;

  const search = (document.getElementById('admin-video-search')?.value || '').toLowerCase();
  let videos = loadVideos();
  if (search) videos = videos.filter(v => v.title.toLowerCase().includes(search) || (getCourse(v.courseId)?.name || '').toLowerCase().includes(search));

  if (badge) badge.textContent = videos.length;

  if (!videos.length) {
    container.innerHTML = '<div class="empty-state" style="padding:2rem;text-align:center;color:var(--text-muted);">Aucune capsule vidéo.<br>Uploadez votre première vidéo !</div>';
    return;
  }

  container.innerHTML = videos.map(v => {
    const course = getCourse(v.courseId);
    return '<div class="admin-item" style="align-items:flex-start;gap:0.75rem;">'
      + '<div style="font-size:2rem;flex-shrink:0;margin-top:0.2rem;">🎬</div>'
      + '<div style="flex:1;min-width:0;">'
        + '<div class="admin-item-title">' + v.title + '</div>'
        + '<div class="admin-item-meta" style="margin-top:0.3rem;">'
          + (course ? '<span style="background:rgba(229,62,62,0.1);color:#FC8181;border:1px solid rgba(229,62,62,0.2);border-radius:50px;padding:0.12rem 0.5rem;font-size:0.68rem;font-weight:600;">' + course.icon + ' ' + course.name + '</span>' : '')
          + (v.duration ? '<span>⏱ ' + v.duration + '</span>' : '')
          + '<span>' + getLevelLabel(v.level) + '</span>'
          + (v.fileSize ? '<span style="color:var(--text-muted);">📦 ' + formatFileSize(v.fileSize) + '</span>' : '')
          + (v.views > 0 ? '<span>👁 ' + v.views + ' vue' + (v.views > 1 ? 's' : '') + '</span>' : '')
        + '</div>'
        + (v.fileName ? '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.25rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📁 ' + v.fileName + '</div>' : '')
      + '</div>'
      + '<div class="admin-item-actions">'
        + '<button class="btn-icon" onclick="editVideo(\'' + v.id + '\')" title="Modifier">✏️</button>'
        + '<button class="btn-icon danger" onclick="deleteVideo(\'' + v.id + '\')" title="Supprimer">🗑️</button>'
      + '</div>'
    + '</div>';
  }).join('');
}

// ── ÉTUDIANT: Filtres et grille vidéo ──
let activeVideoFilter = 'all';

function filterVideos(courseId) {
  activeVideoFilter = courseId;
  document.querySelectorAll('.video-filter-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.vfilter === courseId);
  });
  renderStudentVideos();
}

function renderStudentVideoFilters() {
  const container = document.getElementById('student-video-filters');
  if (!container) return;
  const videos = loadVideos();
  const courseIds = [...new Set(videos.map(v => v.courseId))];
  const courses = courseIds.map(id => getCourse(id)).filter(Boolean);
  container.innerHTML = '<button class="video-filter-chip' + (activeVideoFilter === 'all' ? ' active' : '') + '" data-vfilter="all" onclick="filterVideos(\'all\')" style="display:inline-flex;align-items:center;gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> Tout</button>'
    + courses.map(c => '<button class="video-filter-chip' + (activeVideoFilter === c.id ? ' active' : '') + '" data-vfilter="' + c.id + '" onclick="filterVideos(\'' + c.id + '\')" style="display:inline-flex;align-items:center;gap:4px;">' + iconHTML(c.icon, 12) + ' ' + c.name + '</button>').join('');
}

function renderStudentVideos() {
  const grid = document.getElementById('student-videos-grid');
  if (!grid) return;

  renderStudentVideoFilters();

  let videos = loadVideos();
  if (activeVideoFilter !== 'all') videos = videos.filter(v => v.courseId === activeVideoFilter);
  videos = videos.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (!videos.length) {
    grid.innerHTML = '<div class="video-empty-state"><div class="ve-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div><div class="ve-title">Aucune capsule disponible</div><p style="font-size:0.82rem;">Les vidéos ajoutées par votre formateur apparaîtront ici.</p></div>';
    return;
  }

  grid.innerHTML = '<div class="video-cards-grid">' + videos.map(v => {
    const course = getCourse(v.courseId);
    return '<div class="video-card" onclick="openVideoPlayer(\'' + v.id + '\')">'
      + '<div class="video-thumb">'
        + '<div class="video-thumb-placeholder"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg><span>' + (course?.name || 'Cours') + '</span></div>'
        + '<div class="video-play-btn"></div>'
        + (v.duration ? '<div class="video-duration">' + v.duration + '</div>' : '')
      + '</div>'
      + '<div class="video-card-body">'
        + '<div class="video-card-title">' + v.title + '</div>'
        + '<div class="video-card-meta">'
          + (course ? '<span class="video-card-course">' + iconHTML(course.icon, 11) + ' ' + course.name + '</span>' : '')
          + (v.views > 0 ? '<span class="video-card-views"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:2px;"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> ' + v.views + '</span>' : '')
        + '</div>'
      + '</div>'
    + '</div>';
  }).join('') + '</div>';
}

// ── Lecteur vidéo ──
let currentVideoObjectUrl = null;

async function openVideoPlayer(id) {
  const v = getVideoById(id);
  if (!v) return;
  trackActivity('video');

  // Incrémenter vues
  const videos = loadVideos();
  const idx = videos.findIndex(x => x.id === id);
  if (idx !== -1) { videos[idx].views = (videos[idx].views || 0) + 1; saveVideos(videos); }

  const overlay = document.getElementById('video-player-overlay');
  const videoEl = document.getElementById('vp-video');
  const loadingEl = document.getElementById('vp-loading');

  document.getElementById('vp-title').textContent = v.title;
  document.getElementById('vp-info-title').textContent = v.title;
  document.getElementById('vp-info-desc').textContent = v.desc || '';

  const course = getCourse(v.courseId);
  const tags = [];
  if (course) tags.push(course.icon + ' ' + course.name);
  if (v.level) tags.push(getLevelLabel(v.level));
  if (v.duration) tags.push('⏱ ' + v.duration);
  document.getElementById('vp-tags').innerHTML = tags.map(t => '<span class="video-player-tag">' + t + '</span>').join('');

  overlay.classList.add('show');
  document.body.classList.add('modal-open');

  if (loadingEl) loadingEl.style.display = 'flex';
  if (videoEl) videoEl.style.display = 'none';

  try {
    const fileData = await getVideoFile(id);
    if (!fileData?.blob) {
      if (loadingEl) loadingEl.innerHTML = '<div style="text-align:center;color:var(--text-muted);">⚠️ Fichier introuvable.<br><small>Réuploadez cette vidéo.</small></div>';
      return;
    }
    // Révoquer l'ancien blob URL si existant
    if (currentVideoObjectUrl) URL.revokeObjectURL(currentVideoObjectUrl);
    currentVideoObjectUrl = URL.createObjectURL(fileData.blob);
    if (videoEl) {
      videoEl.src = currentVideoObjectUrl;
      videoEl.style.display = 'block';
      videoEl.load();
    }
    if (loadingEl) loadingEl.style.display = 'none';
  } catch(e) {
    if (loadingEl) loadingEl.innerHTML = '<div style="text-align:center;color:var(--text-muted);">❌ Erreur de lecture</div>';
  }
}

function closeVideoPlayer() {
  const overlay = document.getElementById('video-player-overlay');
  overlay.classList.remove('show');
  overlay.style.display = '';  // annuler tout style inline éventuel
  document.body.classList.remove('modal-open');
  const videoEl = document.getElementById('vp-video');
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
    videoEl.style.display = 'none';
  }
  const loadingEl = document.getElementById('vp-loading');
  if (loadingEl) loadingEl.style.display = 'flex';  // remettre le spinner pour la prochaine ouverture
  if (currentVideoObjectUrl) { URL.revokeObjectURL(currentVideoObjectUrl); currentVideoObjectUrl = null; }
  renderStudentVideos();
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
async function initApp() {
  try {
    // Migration : retirer les cours et QCM par défaut injectés automatiquement
    // Migration v3 : supprimer TOUS les cours/questions injectés automatiquement
    const CLEAN_VERSION_KEY = 'hermes_clean_v3';
    if (!localStorage.getItem(CLEAN_VERSION_KEY)) {
      const defaultIds = ['culture','numerique','verbale','aptitude','anglais',
        'droit-administratif','droit-constitutionnel','resume-texte',
        'problemes-eco-sociaux','oral','redaction-juridique'];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const d = JSON.parse(raw);
          // Garder UNIQUEMENT les cours que l'admin a créés (avec PDF ou ID non-défaut)
          d.courses = (d.courses || []).filter(c => {
            if (!defaultIds.includes(c.id)) return true; // cours créé par admin → garder
            return !!c.pdfName; // cours par défaut : garder seulement si admin a uploadé un PDF
          });
          const keptIds = d.courses.map(c => c.id);
          d.exerciseTypes = d.exerciseTypes || [];
          // Supprimer les questions des cours par défaut retirés (issues de data-concours.js)
          defaultIds.forEach(id => {
            if (!keptIds.includes(id)) delete (d.questions || {})[id];
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
        }
        // Aussi invalider l'ancienne version de clean
        localStorage.removeItem('hermes_clean_v2');
        localStorage.setItem(CLEAN_VERSION_KEY, '1');
      } catch(e) {}
    }

    await loadAppData();
    // Nettoyer les heartbeats "en ligne" périmés (> 5 min) laissés par l'onglet précédent
    const _staleTs = Date.now() - 5 * 60 * 1000;
    for (let _i = localStorage.length - 1; _i >= 0; _i--) {
      const _k = localStorage.key(_i);
      if (!_k || !_k.startsWith('hermes_online_')) continue;
      try { const _d = JSON.parse(localStorage.getItem(_k)); if (_d.ts < _staleTs) localStorage.removeItem(_k); }
      catch(e) { localStorage.removeItem(_k); }
    }
    loadSession();
    appData.courses.forEach(c => {
      if (state.catScores[c.id] === undefined) state.catScores[c.id] = 0;
      if (state.catPlayed[c.id] === undefined) state.catPlayed[c.id] = 0;
    });

    initAuthBackgrounds();

    // ── Routage par hash : chaque rôle a son lien direct ──
    const hashRoutes = { '#etudiant': 'login-student', '#formateur': 'login-trainer', '#admin': 'login-admin' };
    const hash = window.location.hash.toLowerCase();
    if (hashRoutes[hash] && auth.role === null) {
      // Accès direct par lien — on affiche uniquement cette page de connexion, sans welcome
      document.body.classList.add('direct-link-mode');
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(hashRoutes[hash]).classList.add('active');
      document.getElementById('student-app').style.display = 'none';
      document.getElementById('admin-app').classList.remove('active');
      const tapp = document.getElementById('trainer-app'); if (tapp) tapp.classList.remove('active');
      document.documentElement.classList.remove('has-session');
    } else {
      resumeSession(); // reprend la session ou affiche l'accueil
      document.documentElement.classList.remove('has-session');
    }
  } catch (e) {
    console.error('Erreur initialisation:', e);
    document.documentElement.classList.remove('has-session');
    if (!auth.role) {
      showWelcomePage();
      showNotif('⚠️ Erreur de chargement — rechargez la page', 'error');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

window.addEventListener('beforeunload', () => {
  if (auth.role === 'student') endAttendanceSession();
});

// BFCache : le navigateur peut restaurer une ancienne version de la page (avec auth en mémoire)
// même après une déconnexion. On re-valide l'état de session si la page vient du cache.
window.addEventListener('pageshow', function(e) {
  if (!e.persisted) return; // Chargement normal — pas de BFCache
  const hasValidSession = (() => {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY) || 'null');
      return !!(s && s.role);
    } catch(_) { return false; }
  })();
  if (!hasValidSession && auth.role) {
    // Session supprimée (déconnexion) mais BFCache a restauré l'ancien état JS
    auth.role   = null;
    auth.userId = null;
    document.documentElement.classList.remove('has-session');
    showWelcomePage();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && auth.role === 'student') {
    // On arrête juste les intervalles — le heartbeat reste dans localStorage
    // et devient périmé naturellement après HEARTBEAT_STALE_MS (2 min)
    clearInterval(_onlineHeartbeat); _onlineHeartbeat = null;
    clearInterval(_attHeartbeat);    _attHeartbeat    = null;
    clearTimeout(_absenceTimer);     _absenceTimer    = null;
    ['click','keydown','touchstart','scroll'].forEach(ev =>
      document.removeEventListener(ev, resetAbsenceTimer)
    );
  } else if (document.visibilityState === 'visible' && auth.role === 'student') {
    // Retour sur l'onglet : rafraîchir le heartbeat immédiatement et relancer les timers
    if (!_attStart) {
      startAttendanceSession();
    } else {
      _writeOnlinePulse();
      clearInterval(_onlineHeartbeat);
      _onlineHeartbeat = setInterval(_writeOnlinePulse, 45 * 1000);
      resetAbsenceTimer();
      ['click','keydown','touchstart','scroll'].forEach(ev =>
        document.addEventListener(ev, resetAbsenceTimer, { passive: true })
      );
    }
  }
});

// Event listeners pour les formulaires
setTimeout(() => {
  document.getElementById('admin-password')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') adminLogin();
  });
  document.getElementById('student-name')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') studentLogin();
  });
  document.getElementById('student-phone')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') studentLogin();
  });
}, 100);

// ══════════════════════════════════════════
//  GLOBAL MODAL HELPERS
// ══════════════════════════════════════════
const globalModal = document.getElementById('global-modal');
const globalModalTitle = document.getElementById('global-modal-title');
const globalModalBody = document.getElementById('global-modal-body');
const globalModalFooter = document.getElementById('global-modal-footer');
const globalModalCloseBtn = document.getElementById('global-modal-close');
const globalModalConfirmBtn = document.getElementById('global-modal-confirm');

function openModal({ title = '', body = '', showConfirm = false, confirmText = 'Confirmer' } = {}) {
  if (!globalModal) return Promise.resolve(false);
  globalModalTitle.textContent = title || '';
  if (typeof body === 'string') globalModalBody.innerHTML = body;
  else if (body instanceof Node) {
    globalModalBody.innerHTML = '';
    globalModalBody.appendChild(body);
  }
  globalModalConfirmBtn.style.display = showConfirm ? 'inline-block' : 'none';
  globalModalConfirmBtn.textContent = confirmText;
  document.body.classList.add('modal-open');
  globalModal.classList.add('show');

  return new Promise((resolve) => {
    function cleanup(result) {
      globalModal.classList.remove('show');
      document.body.classList.remove('modal-open');
      globalModalCloseBtn.removeEventListener('click', onClose);
      globalModalConfirmBtn.removeEventListener('click', onConfirm);
      globalModal.removeEventListener('click', onBackdrop);
      resolve(result);
    }

    function onClose() { cleanup(false); }
    function onConfirm() { cleanup(true); }
    function onBackdrop(e) { if (e.target === globalModal) cleanup(false); }

    globalModalCloseBtn.addEventListener('click', onClose);
    globalModalConfirmBtn.addEventListener('click', onConfirm);
    globalModal.addEventListener('click', onBackdrop);
  });
}

function closeModal() {
  if (!globalModal) return;
  globalModal.classList.remove('show');
  document.body.classList.remove('modal-open');
}

function confirmDialog(message, opts = {}) {
  return openModal({ title: opts.title || 'Confirmation', body: '<p style="margin:0 0 0.6rem;">'+message+'</p>', showConfirm: true, confirmText: opts.confirmText || 'OK' });
}

// ══════════════════════════════════════════════════════════
//  EXERCICES INTERACTIFS — état temporaire de construction
// ══════════════════════════════════════════════════════════
let adminInteractiveQs = [];
let tmInteractiveQs = [];

// ── Admin : gestion questions ──────────────────────────────
function addAdminInteractiveQ() {
  const q   = (document.getElementById('admin-iq-text')?.value || '').trim();
  const opts = [0,1,2,3].map(i => (document.getElementById('admin-iq-opt'+i)?.value || '').trim());
  const a   = parseInt(document.getElementById('admin-iq-correct')?.value || '0');
  const exp = (document.getElementById('admin-iq-exp')?.value || '').trim();
  if (!q) { showNotif('⚠️ Saisissez le texte de la question', 'error'); return; }
  if (opts.some(o => !o)) { showNotif('⚠️ Remplissez les 4 options', 'error'); return; }
  adminInteractiveQs.push({ q, opts, a, exp });
  // Clear form
  document.getElementById('admin-iq-text').value = '';
  [0,1,2,3].forEach(i => { document.getElementById('admin-iq-opt'+i).value = ''; });
  document.getElementById('admin-iq-correct').value = '0';
  document.getElementById('admin-iq-exp').value = '';
  renderAdminInteractiveQList();
}

function removeAdminInteractiveQ(idx) {
  adminInteractiveQs.splice(idx, 1);
  renderAdminInteractiveQList();
}

function renderAdminInteractiveQList() {
  const el = document.getElementById('admin-interactive-q-list');
  if (!el) return;
  if (!adminInteractiveQs.length) { el.innerHTML = ''; return; }
  const letters = ['A','B','C','D'];
  el.innerHTML = adminInteractiveQs.map((q, i) => `
    <div style="background:#fff;border:1.5px solid #E2E8F0;border-radius:10px;padding:0.75rem 1rem;position:relative;">
      <div style="font-weight:700;font-size:0.82rem;color:#1e293b;margin-bottom:0.4rem;">${i+1}. ${q.q}</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.3rem;">
        ${q.opts.map((o, oi) => `<span style="font-size:0.73rem;padding:0.15rem 0.5rem;border-radius:50px;background:${oi===q.a?'rgba(109,40,217,0.12)':'#f1f5f9'};color:${oi===q.a?'#5B21B6':'#64748B'};font-weight:${oi===q.a?'700':'500'};border:1px solid ${oi===q.a?'rgba(109,40,217,0.3)':'#e2e8f0'};">${letters[oi]}. ${o}</span>`).join('')}
      </div>
      ${q.exp ? `<div style="font-size:0.73rem;color:#64748B;">💡 ${q.exp}</div>` : ''}
      <button onclick="removeAdminInteractiveQ(${i})" style="position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;color:#EF4444;cursor:pointer;font-size:0.8rem;padding:0.2rem 0.4rem;" title="Supprimer">✕</button>
    </div>
  `).join('');
}

// ── Trainer : gestion questions ────────────────────────────
function addTmInteractiveQ() {
  const q   = (document.getElementById('tm-iq-text')?.value || '').trim();
  const opts = [0,1,2,3].map(i => (document.getElementById('tm-iq-opt'+i)?.value || '').trim());
  const a   = parseInt(document.getElementById('tm-iq-correct')?.value || '0');
  const exp = (document.getElementById('tm-iq-exp')?.value || '').trim();
  if (!q) { showNotif('Saisissez le texte de la question', 'error'); return; }
  if (opts.some(o => !o)) { showNotif('Remplissez les 4 options', 'error'); return; }
  tmInteractiveQs.push({ q, opts, a, exp });
  document.getElementById('tm-iq-text').value = '';
  [0,1,2,3].forEach(i => { document.getElementById('tm-iq-opt'+i).value = ''; });
  document.getElementById('tm-iq-correct').value = '0';
  document.getElementById('tm-iq-exp').value = '';
  renderTmInteractiveQList();
}

function removeTmInteractiveQ(idx) {
  tmInteractiveQs.splice(idx, 1);
  renderTmInteractiveQList();
}

function renderTmInteractiveQList() {
  const el = document.getElementById('tm-interactive-q-list');
  if (!el) return;
  if (!tmInteractiveQs.length) { el.innerHTML = ''; return; }
  const letters = ['A','B','C','D'];
  el.innerHTML = tmInteractiveQs.map((q, i) => `
    <div style="background:#fff;border:1.5px solid #E2E8F0;border-radius:10px;padding:0.75rem 1rem;position:relative;">
      <div style="font-weight:700;font-size:0.82rem;color:#1e293b;margin-bottom:0.4rem;">${i+1}. ${q.q}</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.3rem;">
        ${q.opts.map((o, oi) => `<span style="font-size:0.73rem;padding:0.15rem 0.5rem;border-radius:50px;background:${oi===q.a?'rgba(109,40,217,0.12)':'#f1f5f9'};color:${oi===q.a?'#5B21B6':'#64748B'};font-weight:${oi===q.a?'700':'500'};border:1px solid ${oi===q.a?'rgba(109,40,217,0.3)':'#e2e8f0'};">${letters[oi]}. ${o}</span>`).join('')}
      </div>
      ${q.exp ? `<div style="font-size:0.73rem;color:#64748B;">💡 ${q.exp}</div>` : ''}
      <button onclick="removeTmInteractiveQ(${i})" style="position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;color:#EF4444;cursor:pointer;font-size:0.8rem;padding:0.2rem 0.4rem;" title="Supprimer">✕</button>
    </div>
  `).join('');
}

// ══════════════════════════════════════════════════════════
//  LECTEUR INTERACTIF — état & logique
// ══════════════════════════════════════════════════════════
const iexState = {
  exerciseId: null,
  questions: [],
  current: 0,
  answers: [],
  score: 0,
  totalPts: 0,
};

function startInteractiveExercise(exId) {
  const ex = (appData.exerciseTypes || []).find(e => e.id === exId);
  if (!ex || !ex.questions?.length) { showNotif('❌ Exercice sans questions', 'error'); return; }
  iexState.exerciseId = exId;
  iexState.questions = ex.questions;
  iexState.current = 0;
  iexState.answers = [];
  iexState.score = 0;
  iexState.totalPts = 0;

  document.getElementById('iex-intro-title').textContent = ex.name;
  document.getElementById('iex-intro-count').textContent = ex.questions.length + ' question' + (ex.questions.length > 1 ? 's' : '') + ' · ' + (ex.questions.length * 10) + ' pts max';
  document.getElementById('iex-intro').style.display = 'flex';
  document.getElementById('iex-question-screen').style.display = 'none';
  document.getElementById('iex-results-screen').style.display = 'none';
  document.getElementById('interactive-ex-overlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function beginInteractiveExercise() {
  document.getElementById('iex-intro').style.display = 'none';
  document.getElementById('iex-question-screen').style.display = 'flex';
  renderInteractiveQuestion();
}

function renderInteractiveQuestion() {
  const q = iexState.questions[iexState.current];
  const total = iexState.questions.length;
  const idx = iexState.current;
  const pct = Math.round((idx / total) * 100);
  const letters = ['A','B','C','D'];

  document.getElementById('iex-progress-bar').style.width = pct + '%';
  document.getElementById('iex-q-counter').textContent = (idx + 1) + ' / ' + total;
  document.getElementById('iex-score-badge').textContent = iexState.totalPts + ' pt' + (iexState.totalPts > 1 ? 's' : '');
  document.getElementById('iex-q-num').textContent = 'Question ' + (idx + 1);
  document.getElementById('iex-q-text').textContent = q.q;
  document.getElementById('iex-explanation').style.display = 'none';
  document.getElementById('iex-next-btn').style.display = 'none';

  document.getElementById('iex-options').innerHTML = q.opts.map((opt, i) => `
    <button class="iex-opt-btn" onclick="selectInteractiveAnswer(${i})"
      style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem 1rem;border-radius:12px;border:1.5px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.06);color:#fff;font-size:0.9rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;text-align:left;transition:all 0.15s;width:100%;"
      onmouseover="this.style.background='rgba(109,40,217,0.2)';this.style.borderColor='rgba(109,40,217,0.4)'"
      onmouseout="if(!this.dataset.answered){this.style.background='rgba(255,255,255,0.06)';this.style.borderColor='rgba(255,255,255,0.12)'}"
      data-idx="${i}">
      <span style="flex-shrink:0;width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.78rem;">${letters[i]}</span>
      <span>${opt}</span>
    </button>
  `).join('');

  document.getElementById('iex-question-screen').scrollTop = 0;
}

function selectInteractiveAnswer(idx) {
  const q = iexState.questions[iexState.current];
  const correct = q.a;
  const isOk = idx === correct;

  document.querySelectorAll('.iex-opt-btn').forEach(btn => {
    btn.disabled = true;
    btn.dataset.answered = '1';
    const bi = parseInt(btn.dataset.idx);
    if (bi === correct) {
      btn.style.background = 'rgba(16,185,129,0.2)';
      btn.style.borderColor = 'rgba(16,185,129,0.5)';
      btn.style.color = '#6EE7B7';
    } else if (bi === idx && !isOk) {
      btn.style.background = 'rgba(239,68,68,0.2)';
      btn.style.borderColor = 'rgba(239,68,68,0.5)';
      btn.style.color = '#FCA5A5';
    } else {
      btn.style.opacity = '0.45';
    }
  });

  if (isOk) {
    iexState.score++;
    iexState.totalPts += 10;
    document.getElementById('iex-score-badge').textContent = iexState.totalPts + ' pts';
  }
  iexState.answers.push({ q: q.q, opts: q.opts, chosen: idx, correct, exp: q.exp || '', ok: isOk });

  if (q.exp) {
    document.getElementById('iex-explanation-text').textContent = q.exp;
    document.getElementById('iex-explanation').style.display = 'block';
  }

  const nextBtn = document.getElementById('iex-next-btn');
  nextBtn.style.display = 'block';
  nextBtn.textContent = iexState.current < iexState.questions.length - 1 ? 'Question suivante →' : 'Voir les résultats →';
}

function nextInteractiveQuestion() {
  iexState.current++;
  if (iexState.current >= iexState.questions.length) {
    showInteractiveResults();
  } else {
    renderInteractiveQuestion();
  }
}

function showInteractiveResults() {
  document.getElementById('iex-question-screen').style.display = 'none';
  document.getElementById('iex-results-screen').style.display = 'flex';

  const total = iexState.questions.length;
  const pct = Math.round((iexState.score / total) * 100);
  const wrong = total - iexState.score;

  document.getElementById('iex-progress-bar').style.width = '100%';
  document.getElementById('iex-result-score').textContent = pct + '%';
  document.getElementById('iex-result-correct').textContent = iexState.score;
  document.getElementById('iex-result-wrong').textContent = wrong;
  document.getElementById('iex-result-pts').textContent = iexState.totalPts;

  let icon, mention;
  if (pct >= 90)      { icon = '🏆'; mention = 'Excellent !'; }
  else if (pct >= 75) { icon = '⭐'; mention = 'Très bien !'; }
  else if (pct >= 60) { icon = '✅'; mention = 'Bien !'; }
  else if (pct >= 50) { icon = '📖'; mention = 'Passable'; }
  else                { icon = '💪'; mention = 'À améliorer'; }
  document.getElementById('iex-result-icon').textContent = icon;
  document.getElementById('iex-result-mention').textContent = mention;

  const letters = ['A','B','C','D'];
  document.getElementById('iex-correction-list').innerHTML = iexState.answers.map((ans, i) => `
    <div style="background:${ans.ok ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'};border:1px solid ${ans.ok ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'};border-radius:12px;padding:0.9rem 1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
        <span style="font-size:0.72rem;font-weight:700;color:rgba(255,255,255,0.45);">Q${i+1}</span>
        <span style="font-size:0.75rem;font-weight:700;color:${ans.ok ? '#6EE7B7' : '#FCA5A5'};">${ans.ok ? '✅ Correct' : '❌ Faux'}</span>
      </div>
      <div style="font-size:0.88rem;font-weight:600;color:#fff;margin-bottom:0.5rem;line-height:1.4;">${ans.q}</div>
      ${!ans.ok && ans.chosen !== -1 ? `<div style="font-size:0.78rem;color:#FCA5A5;margin-bottom:0.25rem;">Votre réponse : ${ans.opts[ans.chosen]}</div>` : ''}
      <div style="font-size:0.78rem;color:#6EE7B7;margin-bottom:${ans.exp?'0.25rem':'0'};">✅ Bonne réponse : ${ans.opts[ans.correct]}</div>
      ${ans.exp ? `<div style="font-size:0.76rem;color:rgba(196,181,253,0.8);margin-top:0.3rem;line-height:1.4;">💡 ${ans.exp}</div>` : ''}
    </div>
  `).join('');

  document.getElementById('iex-results-screen').scrollTop = 0;

  // Mettre à jour les stats de l'étudiant
  if (typeof saveUserStats === 'function') {
    state.totalScore = (state.totalScore || 0) + iexState.totalPts;
    saveUserStats();
  }
  if (iexState && iexState.exerciseId && auth && auth.userId) {
    if (!appData.assessmentAttempts) appData.assessmentAttempts = [];
    appData.assessmentAttempts.push({ userId: auth.userId, exerciseId: iexState.exerciseId, score: iexState.score || 0, maxScore: iexState.totalPts || 0, date: Date.now() });
    saveAppData(false);
  }
}

function restartInteractiveExercise() {
  const exId = iexState.exerciseId;
  closeInteractivePlayer();
  startInteractiveExercise(exId);
}

function closeInteractivePlayer() {
  document.getElementById('interactive-ex-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

function renderStudentAssessments() {
  var container = document.getElementById('sec-assessments-content');
  if (!container) return;
  var assm = (appData.exerciseTypes || []).filter(function(ex) { return ex.questions && ex.questions.length > 0; });
  if (!assm.length) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;"><p style="font-size:1.5rem;">📋</p><p>Aucune évaluation disponible pour le moment.</p></div>';
    return;
  }
  var uid = auth && auth.userId;
  container.innerHTML = assm.map(function(ex) {
    var att = (appData.assessmentAttempts || []).filter(function(a) { return a.userId === uid && a.exerciseId === ex.id; });
    var best = att.reduce(function(m, a) { return Math.max(m, a.score || 0); }, 0);
    var maxScore = att.length > 0 ? (att[0].maxScore || 0) : 0;
    var done = att.length > 0;
    var pct = maxScore > 0 ? Math.round(best / maxScore * 100) : 0;
    return '<div style="background:#fff;border-radius:12px;padding:1.2rem 1.5rem;margin-bottom:1rem;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:space-between;">'
      + '<div><div style="font-weight:600;color:#1a2236;">' + (ex.name || 'Évaluation') + '</div>'
      + (done ? '<div style="font-size:.85rem;color:#4caf50;margin-top:.3rem;">Meilleur score : ' + best + '/' + maxScore + ' (' + pct + '%)</div>'
              : '<div style="font-size:.85rem;color:#999;margin-top:.3rem;">Non commencé</div>')
      + '</div>'
      + '<button onclick="startInteractiveExercise(\'' + ex.id + '\')" style="background:#C62828;color:#fff;border:none;border-radius:8px;padding:.5rem 1.2rem;font-size:.9rem;cursor:pointer;">'
      + (done ? '↻ Refaire' : '▶ Commencer') + '</button>'
      + '</div>';
  }).join('');
}

function renderTrainerAssessments() {
  var container = document.getElementById('trainer-assessments-content');
  if (!container) return;
  var myEx = (appData.exerciseTypes || []).filter(function(ex) {
    return (ex.trainerId === auth.userId || ex.createdBy === auth.userId) && ex.questions && ex.questions.length > 0;
  });
  if (!myEx.length) {
    container.innerHTML = '<div style="text-align:center;padding:2rem;color:#999;"><p style="font-size:1.5rem;">📋</p><p>Aucune évaluation créée. Ajoutez des questions à vos exercices interactifs.</p></div>';
    return;
  }
  var html = '<h3 style="margin:0 0 1rem;color:#1a2236;">Mes évaluations</h3>';
  myEx.forEach(function(ex) {
    var attempts = (appData.assessmentAttempts || []).filter(function(a) { return a.exerciseId === ex.id; });
    var nb = attempts.length;
    var avg = nb > 0 ? Math.round(attempts.reduce(function(s, a) { return s + (a.score || 0); }, 0) / nb) : 0;
    html += '<div style="background:#fff;border-radius:12px;padding:1.2rem 1.5rem;margin-bottom:1rem;box-shadow:0 2px 8px rgba(0,0,0,.08);">'
      + '<div style="font-weight:600;color:#1a2236;margin-bottom:.5rem;">' + (ex.name || 'Évaluation') + '</div>'
      + '<div style="font-size:.85rem;color:#666;">' + (ex.questions ? ex.questions.length : 0) + ' question(s) · ' + nb + ' tentative(s)'
      + (nb > 0 ? ' · Score moyen : ' + avg : '') + '</div>'
      + '</div>';
  });
  container.innerHTML = html;
}

// ══════════════════════════════════════════════════════
//  CONNEXION ÉTUDIANT PAR EMAIL + MOT DE PASSE
// ══════════════════════════════════════════════════════
const _STU_ATTEMPTS_KEY = 'hermes_auth_attempts';
const _STU_OTP_KEY      = 'hermes_otp_store';
const _STU_MAX_TRIES    = 5;
const _STU_LOCK_MS      = 15 * 60 * 1000;  // 15 min
const _STU_OTP_EXPIRY   = 10 * 60 * 1000;  // 10 min
const _STU_BCRYPT_ROUNDS = 10;

let _stuSession = { email: null, purpose: null, user: null, otpInterval: null };

/* ── bcrypt helpers ── */
function _stuBcrypt() {
  return (window.dcodeIO && window.dcodeIO.bcrypt) || window.bcrypt || null;
}
function _stuHashPwd(pwd) {
  return new Promise((resolve, reject) => {
    const lib = _stuBcrypt();
    if (!lib) { reject(new Error('bcryptjs non chargé')); return; }
    if (typeof lib.hash === 'function') {
      lib.hash(pwd, _STU_BCRYPT_ROUNDS, (err, h) => err ? reject(err) : resolve(h));
    } else {
      setTimeout(() => resolve(lib.hashSync(pwd, _STU_BCRYPT_ROUNDS)), 0);
    }
  });
}
function _stuCheckPwd(pwd, hash) {
  return new Promise(resolve => {
    const lib = _stuBcrypt();
    if (!lib) { resolve(false); return; }
    if (typeof lib.compare === 'function') {
      lib.compare(pwd, hash, (err, r) => resolve(err ? false : r));
    } else {
      setTimeout(() => { try { resolve(lib.compareSync(pwd, hash)); } catch(e) { resolve(false); } }, 0);
    }
  });
}

/* ── brute-force helpers ── */
function _stuGetAttempts(email) {
  try { const a = JSON.parse(localStorage.getItem(_STU_ATTEMPTS_KEY) || '{}'); return a[email.toLowerCase()] || { count:0, lockedUntil:0 }; } catch(e) { return { count:0, lockedUntil:0 }; }
}
function _stuRecordFail(email) {
  try {
    const all = JSON.parse(localStorage.getItem(_STU_ATTEMPTS_KEY) || '{}');
    const a = all[email.toLowerCase()] || { count:0, lockedUntil:0 };
    a.count++; a.last = Date.now();
    if (a.count >= _STU_MAX_TRIES) a.lockedUntil = Date.now() + _STU_LOCK_MS;
    all[email.toLowerCase()] = a;
    localStorage.setItem(_STU_ATTEMPTS_KEY, JSON.stringify(all));
    return a;
  } catch(e) { return { count:1, lockedUntil:0 }; }
}
function _stuClearAttempts(email) {
  try { const all = JSON.parse(localStorage.getItem(_STU_ATTEMPTS_KEY) || '{}'); delete all[email.toLowerCase()]; localStorage.setItem(_STU_ATTEMPTS_KEY, JSON.stringify(all)); } catch(e) {}
}

/* ── OTP storage ── */
function _stuSimpleHash(s) { let h=5381; for(let i=0;i<s.length;i++) h=((h<<5)+h)^s.charCodeAt(i); return (h>>>0).toString(36); }
function _stuStoreOTP(email, code) {
  try { const st=JSON.parse(localStorage.getItem(_STU_OTP_KEY)||'{}'); st[email.toLowerCase()]={h:_stuSimpleHash(code),exp:Date.now()+_STU_OTP_EXPIRY}; localStorage.setItem(_STU_OTP_KEY,JSON.stringify(st)); } catch(e) {}
}
function _stuVerifyOTP(email, code) {
  try {
    const st=JSON.parse(localStorage.getItem(_STU_OTP_KEY)||'{}'); const e=st[email.toLowerCase()];
    if(!e) return 'not_found'; if(Date.now()>e.exp) return 'expired'; if(e.h!==_stuSimpleHash(code)) return 'invalid';
    return 'ok';
  } catch(e) { return 'error'; }
}
function _stuClearOTP(email) {
  try { const st=JSON.parse(localStorage.getItem(_STU_OTP_KEY)||'{}'); delete st[email.toLowerCase()]; localStorage.setItem(_STU_OTP_KEY,JSON.stringify(st)); } catch(e) {}
}

/* ── UI helpers ── */
function _stuStep(step) {
  ['login','otp','setpwd'].forEach(s => {
    const el = document.getElementById('stu-step-'+s);
    if (el) el.style.display = s===step ? '' : 'none';
  });
}
function _stuErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}
function _stuBusy(id, busy) {
  const btn = document.getElementById(id);
  if (btn) { btn.disabled = busy; btn.textContent = busy ? 'Chargement…' : (btn.dataset.label || btn.textContent); }
}
function _stuGetOTPVal() {
  return [0,1,2,3,4,5].map(i => document.getElementById('stu-otp-'+i)?.value||'').join('');
}
function _stuClearOTPInputs() {
  [0,1,2,3,4,5].forEach(i => { const e=document.getElementById('stu-otp-'+i); if(e) e.value=''; });
  document.getElementById('stu-otp-0')?.focus();
}
function stuOtpMove(input, idx) {
  input.value = input.value.replace(/\D/g,'').slice(-1);
  if (input.value && idx < 5) document.getElementById('stu-otp-'+(idx+1))?.focus();
}
function stuOtpBack(event, input, idx) {
  if (event.key==='Backspace' && !input.value && idx>0) { const p=document.getElementById('stu-otp-'+(idx-1)); if(p){p.value='';p.focus();} }
  if (event.key==='Enter') stuVerifyOTP();
}
function stuTogglePwd() {
  const inp = document.getElementById('stu-pwd-input');
  if (!inp) return;
  inp.type = inp.type==='password' ? 'text' : 'password';
}
function stuTogglePwdField(id) {
  const inp = document.getElementById(id);
  if (!inp) return;
  inp.type = inp.type==='password' ? 'text' : 'password';
}
function stuStrength(pwd) {
  let s=0;
  if(pwd.length>=8) s++; if(pwd.length>=12) s++;
  if(/[a-z]/.test(pwd)) s++; if(/[A-Z]/.test(pwd)) s++;
  if(/[0-9]/.test(pwd)) s++; if(/[^a-zA-Z0-9]/.test(pwd)) s++;
  const bar=document.getElementById('stu-strength-bar'), lbl=document.getElementById('stu-strength-label');
  if(!bar||!lbl) return;
  const pct=Math.min((s/6)*100,100);
  bar.style.width=pct+'%';
  const lvls=[[2,'#EF4444','Très faible'],[3,'#F97316','Faible'],[4,'#EAB308','Moyen'],[5,'#16A34A','Fort'],[99,'#16A34A','Très fort']];
  const lvl=lvls.find(l=>s<=l[0]);
  bar.style.background=lvl[1]; lbl.style.color=lvl[1]; lbl.textContent=pwd?lvl[2]:'';
}
function stuShowLogin() { _stuStep('login'); }
function stuShowOTP()   { _stuStep('otp'); }

/* ── OTP timer ── */
function _stuStartTimer() {
  if (_stuSession.otpInterval) clearInterval(_stuSession.otpInterval);
  let secs = Math.floor(_STU_OTP_EXPIRY / 1000);
  const tick = () => {
    const el = document.getElementById('stu-otp-timer');
    if (!el) return;
    if (secs <= 0) { el.textContent='Code expiré'; el.style.color='#DC2626'; return; }
    el.style.color = secs < 60 ? '#DC2626' : '#64748B';
    const m=Math.floor(secs/60), s=secs%60;
    el.textContent = 'Expire dans '+m+':'+String(s).padStart(2,'0');
    secs--;
  };
  tick();
  _stuSession.otpInterval = setInterval(tick, 1000);
}
function _stuStopTimer() { if (_stuSession.otpInterval) { clearInterval(_stuSession.otpInterval); _stuSession.otpInterval=null; } }

/* ── Send OTP ── */
async function _stuSendOTP(email, name, purpose) {
  const code = generateOTP();
  _stuStoreOTP(email, code);
  const sent = await sendOTPEmail(email, code, name || email);
  const disp = document.getElementById('stu-otp-email-disp');
  if (disp) disp.textContent = email;
  const tbox = document.getElementById('stu-test-code-box');
  const tdisp = document.getElementById('stu-test-code-disp');
  if (!sent && tbox && tdisp) { tbox.style.display='block'; tdisp.textContent=code; }
  else if (tbox) { tbox.style.display='none'; if (typeof showNotif==='function') showNotif('✅ Code envoyé à '+email,'success'); }
  _stuClearOTPInputs();
  _stuStartTimer();
  _stuStep('otp');
}

/* ── MAIN LOGIN ── */
async function studentEmailLogin() {
  const email = (document.getElementById('stu-email-input')?.value||'').trim().toLowerCase();
  const pwd   = document.getElementById('stu-pwd-input')?.value||'';
  _stuErr('stu-email-error','');
  if (!email || !email.includes('@')) { _stuErr('stu-email-error','Saisissez une adresse e-mail valide.'); return; }
  if (!pwd) { _stuErr('stu-email-error','Saisissez votre mot de passe.'); return; }

  // Brute force check
  const att = _stuGetAttempts(email);
  if (att.lockedUntil && Date.now() < att.lockedUntil) {
    const mins = Math.ceil((att.lockedUntil-Date.now())/60000);
    _stuErr('stu-email-error','Compte bloqué. Réessayez dans '+mins+' minute(s).');
    return;
  }

  // Find student by email
  const user = (appData.users||[]).find(u => u.email && u.email.toLowerCase()===email);
  if (!user) {
    const a = _stuRecordFail(email);
    const rem = _STU_MAX_TRIES - a.count;
    _stuErr('stu-email-error', rem <= 0
      ? 'Compte bloqué 15 min suite à trop de tentatives.'
      : 'Email introuvable ou mot de passe incorrect. '+rem+' tentative(s) restante(s).');
    return;
  }

  // Check suspended / payment
  if (user.accessSuspended) { _stuErr('stu-email-error','Votre accès a été suspendu. Contactez l\'administration.'); return; }
  if (user.paidUntil) {
    const today=new Date(); today.setHours(0,0,0,0);
    const paid=new Date(user.paidUntil); paid.setHours(0,0,0,0);
    if (today>paid) { _stuErr('stu-email-error','Votre accès mensuel a expiré. Contactez l\'administration.'); return; }
  }

  // First login (no password set yet)
  if (!user.passwordHash) {
    _stuSession = { email, purpose:'first-login', user, otpInterval:null };
    const btn = document.getElementById('stu-email-btn');
    if (btn) { btn.disabled=true; btn.textContent='Envoi en cours…'; }
    await _stuSendOTP(email, user.name, 'first-login');
    if (btn) { btn.disabled=false; btn.textContent='Se connecter →'; }
    return;
  }

  // Verify password
  const btn = document.getElementById('stu-email-btn');
  if (btn) { btn.disabled=true; btn.textContent='Vérification…'; }
  const ok = await _stuCheckPwd(pwd, user.passwordHash);
  if (btn) { btn.disabled=false; btn.textContent='Se connecter →'; }

  if (!ok) {
    const a = _stuRecordFail(email);
    const rem = _STU_MAX_TRIES - a.count;
    _stuErr('stu-email-error', rem <= 0
      ? 'Compte bloqué 15 min suite à trop de tentatives.'
      : 'Mot de passe incorrect. '+rem+' tentative(s) restante(s).');
    return;
  }

  // Success
  _stuClearAttempts(email);
  _stuLoginSuccess(user);
}

function _stuLoginSuccess(user) {
  auth.role   = 'student';
  auth.userId = user.id;
  user.lastLogin = Date.now();
  saveAppData(false);
  loadUserStats(user);
  document.body.classList.remove('direct-link-mode');
  history.replaceState(null,'',location.pathname);
  const remember = document.getElementById('remember-device-code')?.checked || false;
  saveSession(remember);
  enterStudentApp();
}

/* ── FORGOT / RESET ── */
async function stuShowForgot() {
  const email = (document.getElementById('stu-email-input')?.value||'').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    _stuErr('stu-email-error','Saisissez d\'abord votre adresse e-mail.');
    document.getElementById('stu-email-input')?.focus();
    return;
  }
  const user = (appData.users||[]).find(u => u.email && u.email.toLowerCase()===email);
  if (!user) { _stuErr('stu-email-error','Aucun compte trouvé pour cet e-mail.'); return; }
  _stuSession = { email, purpose:'reset', user, otpInterval:null };
  const btn = document.getElementById('stu-email-btn');
  if (btn) { btn.disabled=true; btn.textContent='Envoi en cours…'; }
  await _stuSendOTP(email, user.name, 'reset');
  if (btn) { btn.disabled=false; btn.textContent='Se connecter →'; }
}

/* ── VERIFY OTP ── */
function stuVerifyOTP() {
  const code = _stuGetOTPVal();
  _stuErr('stu-otp-error','');
  if (code.length < 6) { _stuErr('stu-otp-error','Saisissez les 6 chiffres du code.'); return; }
  const res = _stuVerifyOTP(_stuSession.email, code);
  if (res==='expired') { _stuErr('stu-otp-error','Code expiré. Cliquez sur « Renvoyer ».'); return; }
  if (res!=='ok') { _stuErr('stu-otp-error','Code incorrect. Vérifiez votre boîte mail.'); _stuClearOTPInputs(); return; }
  _stuClearOTP(_stuSession.email);
  _stuStopTimer();
  const title = document.getElementById('stu-setpwd-title');
  if (title) title.textContent = _stuSession.purpose==='reset' ? 'Nouveau mot de passe' : 'Créer votre mot de passe';
  _stuStep('setpwd');
  document.getElementById('stu-new-pwd')?.focus();
}

async function stuResendOTP() {
  _stuStopTimer();
  await _stuSendOTP(_stuSession.email, _stuSession.user?.name||_stuSession.email, _stuSession.purpose);
}

/* ── SET PASSWORD ── */
async function stuSetPassword() {
  const pwd  = document.getElementById('stu-new-pwd')?.value||'';
  const conf = document.getElementById('stu-confirm-pwd')?.value||'';
  _stuErr('stu-setpwd-error','');
  if (pwd.length < 8) { _stuErr('stu-setpwd-error','Minimum 8 caractères requis.'); return; }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(pwd)) { _stuErr('stu-setpwd-error','Requis : 1 majuscule, 1 minuscule et 1 chiffre.'); return; }
  if (pwd !== conf) { _stuErr('stu-setpwd-error','Les mots de passe ne correspondent pas.'); return; }
  const btn = document.getElementById('stu-setpwd-btn');
  if (btn) { btn.disabled=true; btn.textContent='Enregistrement…'; }
  try {
    const hash = await _stuHashPwd(pwd);
    const user = (appData.users||[]).find(u => u.email && u.email.toLowerCase()===_stuSession.email);
    if (!user) { _stuErr('stu-setpwd-error','Compte introuvable. Actualisez la page.'); return; }
    user.passwordHash = hash;
    user.emailVerified = true;
    saveAppData(false);
    if (typeof showNotif==='function') showNotif('Mot de passe créé avec succès !','success');
    _stuClearAttempts(_stuSession.email);
    _stuLoginSuccess(user);
  } catch(e) {
    _stuErr('stu-setpwd-error','Erreur lors de la sauvegarde. Réessayez.');
  } finally {
    if (btn) { btn.disabled=false; btn.textContent='Définir le mot de passe'; }
  }
}
