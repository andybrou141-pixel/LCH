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

