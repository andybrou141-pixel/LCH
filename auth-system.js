/* ═══════════════════════════════════════════════════════════════
   HERMES AUTH SYSTEM v2.0
   Authentification sécurisée : bcrypt · OTP · anti-brute-force
   Sessions · déconnexion automatique · historique connexions
   ═══════════════════════════════════════════════════════════════ */

const HermesAuth = (() => {
  'use strict';

  // ══════════════════════════════════════════
  //  CONFIGURATION
  // ══════════════════════════════════════════
  const CFG = {
    MAX_ATTEMPTS:      5,
    LOCKOUT_MS:        15 * 60 * 1000,   // 15 min
    INACTIVITY_MS:     30 * 60 * 1000,   // 30 min
    INACTIVITY_WARN:   5 * 60 * 1000,    // warn 5 min before
    OTP_EXPIRY_MS:     10 * 60 * 1000,   // 10 min
    BCRYPT_ROUNDS:     10,
    MAX_HISTORY:       1000,
  };

  const KEYS = {
    ADMIN:    'hermes_admin_creds',
    ATTEMPTS: 'hermes_auth_attempts',
    OTP:      'hermes_otp_store',
    HISTORY:  'hermes_conn_history',
  };

  // ══════════════════════════════════════════
  //  INTERNAL STATE
  // ══════════════════════════════════════════
  let _s = {
    step:         'login',   // login | otp | setpwd | forgot
    purpose:      null,      // first-login | reset | login
    email:        null,
    role:         null,
    userData:     null,
    inactTimer:   null,
    warnTimer:    null,
    warnToast:    null,
    otpInterval:  null,
  };

  // ══════════════════════════════════════════
  //  BCRYPT HELPERS
  // ══════════════════════════════════════════
  function _bcrypt() {
    // bcryptjs standalone CDN exposes dcodeIO.bcrypt; module build exposes window.bcrypt
    return (window.dcodeIO && window.dcodeIO.bcrypt) || window.bcrypt || null;
  }

  function hashPwd(pwd) {
    return new Promise((resolve, reject) => {
      const lib = _bcrypt();
      if (!lib) { reject(new Error('bcryptjs non chargé')); return; }
      // Use callback API (bcryptjs 2.4.3 CDN build)
      if (typeof lib.hash === 'function') {
        lib.hash(pwd, CFG.BCRYPT_ROUNDS, (err, hash) => err ? reject(err) : resolve(hash));
      } else {
        // Fallback to sync wrapped in timeout to avoid blocking UI
        setTimeout(() => resolve(lib.hashSync(pwd, CFG.BCRYPT_ROUNDS)), 0);
      }
    });
  }

  function checkPwd(pwd, hash) {
    return new Promise((resolve) => {
      const lib = _bcrypt();
      if (!lib) { resolve(false); return; }
      if (typeof lib.compare === 'function') {
        lib.compare(pwd, hash, (err, result) => resolve(err ? false : result));
      } else {
        setTimeout(() => {
          try { resolve(lib.compareSync(pwd, hash)); }
          catch(e) { resolve(false); }
        }, 0);
      }
    });
  }

  // ══════════════════════════════════════════
  //  BRUTE FORCE PROTECTION
  // ══════════════════════════════════════════
  function _getAttempts(email) {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '{}');
      return all[email.toLowerCase()] || { count: 0, lockedUntil: 0 };
    } catch(e) { return { count: 0, lockedUntil: 0 }; }
  }

  function _saveAttempts(email, data) {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '{}');
      all[email.toLowerCase()] = data;
      localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(all));
    } catch(e) {}
  }

  function isLocked(email) {
    const a = _getAttempts(email);
    if (a.lockedUntil && Date.now() < a.lockedUntil) return a.lockedUntil;
    return false;
  }

  function recordFailed(email) {
    const a = _getAttempts(email);
    a.count++;
    a.last = Date.now();
    if (a.count >= CFG.MAX_ATTEMPTS) a.lockedUntil = Date.now() + CFG.LOCKOUT_MS;
    _saveAttempts(email, a);
    return a;
  }

  function clearAttempts(email) {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.ATTEMPTS) || '{}');
      delete all[email.toLowerCase()];
      localStorage.setItem(KEYS.ATTEMPTS, JSON.stringify(all));
    } catch(e) {}
  }

  // ══════════════════════════════════════════
  //  OTP STORAGE (localStorage, time-limited)
  // ══════════════════════════════════════════
  function _simpleHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return (h >>> 0).toString(36);
  }

  function storeOTP(email, code) {
    try {
      const store = JSON.parse(localStorage.getItem(KEYS.OTP) || '{}');
      store[email.toLowerCase()] = { h: _simpleHash(code), exp: Date.now() + CFG.OTP_EXPIRY_MS };
      localStorage.setItem(KEYS.OTP, JSON.stringify(store));
    } catch(e) {}
  }

  function verifyStoredOTP(email, code) {
    try {
      const store = JSON.parse(localStorage.getItem(KEYS.OTP) || '{}');
      const entry = store[email.toLowerCase()];
      if (!entry)                   return 'not_found';
      if (Date.now() > entry.exp)   return 'expired';
      if (entry.h !== _simpleHash(code)) return 'invalid';
      return 'ok';
    } catch(e) { return 'error'; }
  }

  function clearStoredOTP(email) {
    try {
      const store = JSON.parse(localStorage.getItem(KEYS.OTP) || '{}');
      delete store[email.toLowerCase()];
      localStorage.setItem(KEYS.OTP, JSON.stringify(store));
    } catch(e) {}
  }

  // ══════════════════════════════════════════
  //  CONNECTION HISTORY
  // ══════════════════════════════════════════
  async function logConn(userId, role, email, action) {
    try {
      const ip     = await _getIP();
      const device = _getDevice();
      const logs   = JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
      logs.unshift({
        id:        'c' + Date.now(),
        userId:    userId || null,
        role:      role || null,
        email:     email || null,
        action,
        ts:        Date.now(),
        ip,
        device,
      });
      if (logs.length > CFG.MAX_HISTORY) logs.length = CFG.MAX_HISTORY;
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(logs));
    } catch(e) {}
  }

  async function _getIP() {
    try {
      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), 3000);
      const r = await fetch('https://api.ipify.org?format=json', { signal: ctl.signal });
      return (await r.json()).ip || 'Inconnue';
    } catch(e) { return 'Inconnue'; }
  }

  function _getDevice() {
    const ua = navigator.userAgent;
    let browser = 'Navigateur inconnu';
    if      (ua.includes('Edg'))                                   browser = 'Edge';
    else if (ua.includes('Chrome') && !ua.includes('Edg'))        browser = 'Chrome';
    else if (ua.includes('Firefox'))                               browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome'))     browser = 'Safari';
    else if (ua.includes('MSIE') || ua.includes('Trident'))       browser = 'IE';
    let os = 'OS inconnu';
    if      (ua.includes('Android'))                              os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad'))        os = 'iOS';
    else if (ua.includes('Windows'))                              os = 'Windows';
    else if (ua.includes('Mac'))                                  os = 'macOS';
    else if (ua.includes('Linux'))                                os = 'Linux';
    const mobile = /Mobi|Android/i.test(ua) ? 'Mobile' : 'Bureau';
    return `${browser} · ${os} · ${mobile}`;
  }

  // ══════════════════════════════════════════
  //  INACTIVITY MONITOR
  // ══════════════════════════════════════════
  const _ACTIVITY_EVENTS = ['mousemove','keydown','click','scroll','touchstart','pointerdown'];

  function _resetTimers() {
    if (_s.inactTimer) clearTimeout(_s.inactTimer);
    if (_s.warnTimer)  clearTimeout(_s.warnTimer);
    _removeWarnToast();

    _s.warnTimer = setTimeout(_showInactivityWarning, CFG.INACTIVITY_MS - CFG.INACTIVITY_WARN);
    _s.inactTimer = setTimeout(_autoLogout, CFG.INACTIVITY_MS);
  }

  function _showInactivityWarning() {
    _removeWarnToast();
    const toast = document.createElement('div');
    toast.className = 'ha-inactivity-toast';
    toast.id = 'ha-inact-toast';
    toast.innerHTML = `
      <div class="ha-inactivity-toast-title">⏱ Session sur le point d'expirer</div>
      <div class="ha-inactivity-toast-msg">Vous serez déconnecté dans 5 minutes en raison d'inactivité.</div>
      <button class="ha-inactivity-toast-btn" onclick="HermesAuth._keepAlive()">Rester connecté</button>`;
    document.body.appendChild(toast);
    _s.warnToast = toast;
  }

  function _removeWarnToast() {
    if (_s.warnToast) { _s.warnToast.remove(); _s.warnToast = null; }
  }

  async function _autoLogout() {
    _removeWarnToast();
    const uid  = (typeof auth !== 'undefined') ? auth.userId : null;
    const role = (typeof auth !== 'undefined') ? auth.role   : null;
    await logConn(uid, role, _s.email, 'auto_logout');
    stopInactivity();
    if (typeof logout === 'function') logout();
    else if (typeof clearSession === 'function') { clearSession(); location.reload(); }
    _showStep('login');
    showOverlay();
    _toast('Session expirée par inactivité', 'warning');
  }

  function startInactivity() {
    _ACTIVITY_EVENTS.forEach(ev => document.addEventListener(ev, _resetTimers, { passive: true }));
    _resetTimers();
  }

  function stopInactivity() {
    _ACTIVITY_EVENTS.forEach(ev => document.removeEventListener(ev, _resetTimers));
    if (_s.inactTimer) clearTimeout(_s.inactTimer);
    if (_s.warnTimer)  clearTimeout(_s.warnTimer);
    _removeWarnToast();
  }

  // ══════════════════════════════════════════
  //  EMAIL (re-uses existing sendOTPEmail)
  // ══════════════════════════════════════════
  async function _sendEmail(email, code, name) {
    // Delegate to the existing function defined in index.html
    if (typeof window.sendOTPEmail === 'function') {
      return window.sendOTPEmail(email, code, name || email);
    }
    return false;
  }

  // ══════════════════════════════════════════
  //  ROLE / USER LOOKUP
  // ══════════════════════════════════════════
  function _adminCreds() {
    try { return JSON.parse(localStorage.getItem(KEYS.ADMIN) || 'null'); } catch(e) { return null; }
  }

  function _saveAdminCreds(email, hash) {
    localStorage.setItem(KEYS.ADMIN, JSON.stringify({ email: email.toLowerCase(), hash }));
  }

  function detectRole(email) {
    const e = email.toLowerCase().trim();
    const creds = _adminCreds();
    if (creds && creds.email === e) return 'admin';
    if (typeof appData !== 'undefined') {
      if ((appData.trainers || []).find(t => t.email && t.email.toLowerCase() === e)) return 'trainer';
      if ((appData.users   || []).find(u => u.email && u.email.toLowerCase() === e)) return 'student';
    }
    return null;
  }

  // ══════════════════════════════════════════
  //  LOGIN FLOWS
  // ══════════════════════════════════════════
  async function _tryAdmin(email, pwd) {
    const creds = _adminCreds();
    if (!creds) {
      // Legacy: if ADMIN_PASSWORD still matches → force first-login flow
      if (typeof ADMIN_PASSWORD !== 'undefined' && pwd === ADMIN_PASSWORD) {
        return { role: 'admin', userId: null, name: 'Administrateur', email, firstLogin: true };
      }
      return null;
    }
    if (creds.email !== email.toLowerCase()) return null;
    const ok = await checkPwd(pwd, creds.hash);
    return ok ? { role: 'admin', userId: null, name: 'Administrateur', email, firstLogin: false } : null;
  }

  async function _tryTrainer(email, pwd) {
    if (typeof appData === 'undefined') return null;
    const t = (appData.trainers || []).find(r => r.email && r.email.toLowerCase() === email.toLowerCase());
    if (!t) return null;
    if (!t.passwordHash) return { role: 'trainer', userId: t.id, name: t.name, email, firstLogin: true };
    const ok = await checkPwd(pwd, t.passwordHash);
    return ok ? { role: 'trainer', userId: t.id, name: t.name, email, firstLogin: false } : null;
  }

  async function _tryStudent(email, pwd) {
    if (typeof appData === 'undefined') return null;
    const u = (appData.users || []).find(r => r.email && r.email.toLowerCase() === email.toLowerCase());
    if (!u) return null;
    if (!u.passwordHash) return { role: 'student', userId: u.id, name: u.name, email, firstLogin: true };
    const ok = await checkPwd(pwd, u.passwordHash);
    return ok ? { role: 'student', userId: u.id, name: u.name, email, firstLogin: false } : null;
  }

  async function _doLogin() {
    const email = _val('ha-email').toLowerCase().trim();
    const pwd   = _val('ha-password');
    const role  = _val('ha-role') || 'auto';

    _setError('');
    _setBusy('ha-login-btn', true);

    try {
      if (!email || !email.includes('@')) { _setError('Saisissez une adresse e-mail valide.'); return; }
      if (!pwd) { _setError('Saisissez votre mot de passe.'); return; }

      const lockUntil = isLocked(email);
      if (lockUntil) {
        const mins = Math.ceil((lockUntil - Date.now()) / 60000);
        _setError(`Compte bloqué. Réessayez dans ${mins} minute(s).`);
        logConn(null, null, email, 'locked');
        return;
      }

      let result = null;
      if      (role === 'admin')   result = await _tryAdmin(email, pwd);
      else if (role === 'trainer') result = await _tryTrainer(email, pwd);
      else if (role === 'student') result = await _tryStudent(email, pwd);
      else {
        // Auto-detect
        result = await _tryAdmin(email, pwd)
              || await _tryTrainer(email, pwd)
              || await _tryStudent(email, pwd);
      }

      if (!result) {
        const a = recordFailed(email);
        const rem = CFG.MAX_ATTEMPTS - a.count;
        if (rem <= 0) {
          _setError(`Trop de tentatives. Compte bloqué ${Math.ceil(CFG.LOCKOUT_MS/60000)} min.`);
          logConn(null, null, email, 'locked');
        } else {
          _setError(`Email ou mot de passe incorrect. ${rem} tentative(s) restante(s).`);
          logConn(null, null, email, 'failed');
        }
        return;
      }

      // Check student payment / promo status (reuse existing logic)
      if (result.role === 'student' && typeof appData !== 'undefined') {
        const u = (appData.users || []).find(x => x.id === result.userId);
        if (u) {
          if (u.accessSuspended) { _setError('Votre accès a été suspendu. Contactez l\'administration.'); return; }
          if (u.paidUntil) {
            const today = new Date(); today.setHours(0,0,0,0);
            const paid  = new Date(u.paidUntil); paid.setHours(0,0,0,0);
            if (today > paid) { _setError('Votre accès mensuel a expiré. Contactez l\'administration.'); return; }
          }
        }
      }

      if (result.firstLogin) {
        _s.email    = email;
        _s.role     = result.role;
        _s.userData = result;
        _s.purpose  = 'first-login';
        await _sendOTPStep(email, result.name, 'first-login');
        return;
      }

      clearAttempts(email);
      _s.email = email;
      await _finishLogin(result);

    } finally {
      _setBusy('ha-login-btn', false);
    }
  }

  async function _finishLogin(result) {
    await logConn(result.userId, result.role, result.email, 'login');

    if (typeof auth !== 'undefined') {
      auth.role   = result.role;
      auth.userId = result.userId;
    }

    const remember = document.getElementById('ha-remember')?.checked || false;
    if (typeof saveSession === 'function') saveSession(remember);

    if (result.role === 'student' && typeof loadUserStats === 'function' && typeof appData !== 'undefined') {
      const u = (appData.users || []).find(x => x.id === result.userId);
      if (u) { u.lastLogin = Date.now(); loadUserStats(u); if (typeof saveAppData === 'function') saveAppData(false); }
    }
    if ((result.role === 'trainer' || result.role === 'admin') && typeof appData !== 'undefined') {
      if (result.role === 'trainer') {
        const t = (appData.trainers || []).find(x => x.id === result.userId);
        if (t) { t.lastLogin = Date.now(); if (typeof saveAppData === 'function') saveAppData(false); }
      }
    }

    startInactivity();
    hideOverlay();

    if      (result.role === 'admin'   && typeof enterAdminApp   === 'function') enterAdminApp();
    else if (result.role === 'trainer' && typeof enterTrainerApp === 'function') enterTrainerApp();
    else if (result.role === 'student' && typeof enterStudentApp === 'function') enterStudentApp();
  }

  // ══════════════════════════════════════════
  //  OTP STEP
  // ══════════════════════════════════════════
  async function _sendOTPStep(email, name, purpose) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    storeOTP(email, code);

    const sent = await _sendEmail(email, code, name);

    const disp = document.getElementById('ha-otp-email-display');
    if (disp) disp.textContent = email;

    const testBox  = document.getElementById('ha-test-code-box');
    const testDisp = document.getElementById('ha-test-code-display');
    if (!sent && testBox && testDisp) {
      testBox.style.display = 'flex';
      testDisp.textContent  = code;
    } else if (testBox) {
      testBox.style.display = 'none';
      _toast('✅ Code OTP envoyé à ' + email, 'success');
    }

    _clearOTPInputs();
    _startOTPTimer();
    _showStep('otp');
  }

  function _verifyOTP() {
    const code = _getOTPVal();
    _setOTPError('');
    if (code.length < 6) { _setOTPError('Saisissez les 6 chiffres du code.'); return; }

    const res = verifyStoredOTP(_s.email, code);
    if (res === 'expired') { _setOTPError('Code expiré. Cliquez sur « Renvoyer ».'); return; }
    if (res !== 'ok')      { _setOTPError('Code incorrect. Vérifiez votre boîte mail.'); _clearOTPInputs(); return; }

    clearStoredOTP(_s.email);
    _stopOTPTimer();

    if (_s.purpose === 'first-login' || _s.purpose === 'reset') {
      const titleEl = document.getElementById('ha-setpwd-title');
      if (titleEl) titleEl.textContent = _s.purpose === 'reset' ? 'Nouveau mot de passe' : 'Créer votre mot de passe';
      _showStep('setpwd');
      document.getElementById('ha-new-pwd')?.focus();
    } else {
      _finishLogin(_s.userData);
    }
  }

  async function _resendOTP() {
    _stopOTPTimer();
    await _sendOTPStep(_s.email, _s.userData?.name || _s.email, _s.purpose);
  }

  // ══════════════════════════════════════════
  //  SET PASSWORD
  // ══════════════════════════════════════════
  async function _setPassword() {
    const pwd  = _val('ha-new-pwd');
    const conf = _val('ha-confirm-pwd');
    _setErr('ha-setpwd-error', '');

    if (pwd.length < 8) { _setErr('ha-setpwd-error', 'Minimum 8 caractères requis.'); return; }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(pwd)) {
      _setErr('ha-setpwd-error', 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre.');
      return;
    }
    if (pwd !== conf) { _setErr('ha-setpwd-error', 'Les mots de passe ne correspondent pas.'); return; }

    _setBusy('ha-setpwd-btn', true);
    try {
      const hash = await hashPwd(pwd);
      await _persistPassword(hash);
      await logConn(_s.userData?.userId, _s.role, _s.email, 'password_changed');
      _s.userData.firstLogin = false;
      clearAttempts(_s.email);
      _toast('Mot de passe défini. Bienvenue !', 'success');
      await _finishLogin(_s.userData);
    } catch(e) {
      _setErr('ha-setpwd-error', 'Erreur lors de la sauvegarde. Réessayez.');
    } finally {
      _setBusy('ha-setpwd-btn', false);
    }
  }

  async function _persistPassword(hash) {
    const email = _s.email;
    const role  = _s.role;
    if (role === 'admin') {
      _saveAdminCreds(email, hash);
    } else if (role === 'trainer' && typeof appData !== 'undefined') {
      const t = (appData.trainers || []).find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
      if (t) { t.passwordHash = hash; t.emailVerified = true; t.firstLogin = false; }
      if (typeof saveAppData === 'function') saveAppData(false);
    } else if (role === 'student' && typeof appData !== 'undefined') {
      const u = (appData.users || []).find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
      if (u) { u.passwordHash = hash; u.emailVerified = true; u.firstLogin = false; }
      if (typeof saveAppData === 'function') saveAppData(false);
    }
  }

  // ══════════════════════════════════════════
  //  FORGOT PASSWORD
  // ══════════════════════════════════════════
  async function _forgotPwd() {
    const email = _val('ha-forgot-email').toLowerCase().trim();
    _setErr('ha-forgot-error', '');
    if (!email || !email.includes('@')) { _setErr('ha-forgot-error', 'Saisissez une adresse e-mail valide.'); return; }

    const role = detectRole(email);
    if (!role) { _setErr('ha-forgot-error', 'Aucun compte trouvé pour cet e-mail.'); return; }

    let name = 'Utilisateur';
    if (role === 'admin') name = 'Administrateur';
    else if (role === 'trainer' && typeof appData !== 'undefined') {
      const t = (appData.trainers || []).find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
      if (t) name = t.name;
    } else if (role === 'student' && typeof appData !== 'undefined') {
      const u = (appData.users || []).find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
      if (u) name = u.name;
    }

    _s.email    = email;
    _s.role     = role;
    _s.purpose  = 'reset';
    _s.userData = { role, name, email, userId: null };
    if (role === 'trainer' && typeof appData !== 'undefined') {
      const t = (appData.trainers || []).find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
      if (t) _s.userData.userId = t.id;
    } else if (role === 'student' && typeof appData !== 'undefined') {
      const u = (appData.users || []).find(x => x.email && x.email.toLowerCase() === email.toLowerCase());
      if (u) _s.userData.userId = u.id;
    }

    _setBusy('ha-forgot-btn', true);
    try { await _sendOTPStep(email, name, 'reset'); }
    finally { _setBusy('ha-forgot-btn', false); }
  }

  // ══════════════════════════════════════════
  //  OTP TIMER UI
  // ══════════════════════════════════════════
  function _startOTPTimer() {
    _stopOTPTimer();
    let secs = Math.floor(CFG.OTP_EXPIRY_MS / 1000);
    _updateTimer(secs);
    _s.otpInterval = setInterval(() => {
      secs--;
      _updateTimer(secs);
      if (secs <= 0) _stopOTPTimer();
    }, 1000);
  }

  function _stopOTPTimer() {
    if (_s.otpInterval) { clearInterval(_s.otpInterval); _s.otpInterval = null; }
  }

  function _updateTimer(secs) {
    const el = document.getElementById('ha-otp-timer');
    if (!el) return;
    if (secs <= 0) { el.textContent = 'Code expiré'; el.style.color = '#EF4444'; return; }
    el.style.color = secs < 60 ? '#EF4444' : '';
    const m = Math.floor(secs / 60), s = secs % 60;
    el.textContent = `Expire dans ${m}:${String(s).padStart(2,'0')}`;
  }

  // ══════════════════════════════════════════
  //  DOM HELPERS
  // ══════════════════════════════════════════
  function _val(id)        { return document.getElementById(id)?.value || ''; }
  function _el(id)         { return document.getElementById(id); }
  function _setError(msg)  { _setErr('ha-error', msg); }
  function _setOTPError(m) { _setErr('ha-otp-error', m); }
  function _setErr(id, msg) {
    const el = _el(id);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
  }
  function _setBusy(id, busy) {
    const btn = _el(id);
    if (btn) { btn.disabled = busy; btn.dataset.loading = busy ? '1' : ''; }
  }
  function _showStep(step) {
    ['login','otp','setpwd','forgot'].forEach(s => {
      const el = _el('ha-step-' + s);
      if (el) el.style.display = (s === step) ? '' : 'none';
    });
    _s.step = step;
  }
  function _getOTPVal() {
    return [0,1,2,3,4,5].map(i => _el('ha-otp-' + i)?.value || '').join('');
  }
  function _clearOTPInputs() {
    [0,1,2,3,4,5].forEach(i => { const e = _el('ha-otp-' + i); if (e) e.value = ''; });
    _el('ha-otp-0')?.focus();
  }

  function _toast(msg, type) {
    if (typeof showNotif === 'function') { showNotif(msg, type || ''); return; }
    const d = document.createElement('div');
    const bg = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#F97316';
    d.style.cssText = `position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);
      background:${bg};color:#fff;padding:.75rem 1.25rem;border-radius:10px;font-size:.9rem;
      z-index:10001;box-shadow:0 4px 16px rgba(0,0,0,.4);font-family:'DM Sans',sans-serif;
      white-space:nowrap;max-width:90vw;text-align:center;`;
    d.textContent = msg;
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 3500);
  }

  // ══════════════════════════════════════════
  //  OVERLAY SHOW/HIDE
  // ══════════════════════════════════════════
  function showOverlay() {
    const ov = _el('hermes-auth-overlay');
    if (ov) { ov.classList.remove('ha-hiding'); ov.style.display = 'flex'; }
    _showStep('login');
  }

  function hideOverlay() {
    const ov = _el('hermes-auth-overlay');
    if (!ov) return;
    ov.classList.add('ha-hiding');
    setTimeout(() => { ov.style.display = 'none'; ov.classList.remove('ha-hiding'); }, 320);
  }

  // ══════════════════════════════════════════
  //  INJECT HTML
  // ══════════════════════════════════════════
  function _buildHTML() {
    const otpInputs = [0,1,2,3,4,5].map(i =>
      `<input type="text" id="ha-otp-${i}" class="ha-otp-input" maxlength="1" inputmode="numeric"
        autocomplete="one-time-code"
        oninput="HermesAuth.otpMove(this,${i})"
        onkeydown="HermesAuth.otpBack(event,this,${i})"
        placeholder="·">`
    ).join('');

    return `<div class="ha-bg-pattern"></div>
<div class="ha-card">

  <div class="ha-brand">
    <img src="logo.jpeg" alt="Hermès" class="ha-logo" onerror="this.style.display='none'">
    <h1 class="ha-title">Les Cours Hermès</h1>
    <p class="ha-subtitle">Espace sécurisé</p>
  </div>

  <!-- ══ STEP LOGIN ══ -->
  <div id="ha-step-login">
    <div class="ha-role-tabs">
      <button class="ha-role-tab active" data-role="auto"    onclick="HermesAuth.setRole(this)">Connexion</button>
      <button class="ha-role-tab"        data-role="student" onclick="HermesAuth.setRole(this)">Étudiant</button>
      <button class="ha-role-tab"        data-role="trainer" onclick="HermesAuth.setRole(this)">Formateur</button>
      <button class="ha-role-tab"        data-role="admin"   onclick="HermesAuth.setRole(this)">Admin</button>
    </div>
    <input type="hidden" id="ha-role" value="auto">

    <div class="ha-field-group">
      <label>Adresse e-mail</label>
      <div class="ha-input-wrap">
        <svg class="ha-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,12 2,6"/>
        </svg>
        <input type="email" id="ha-email" placeholder="votreemail@exemple.com" autocomplete="email"
          onkeydown="if(event.key==='Enter')document.getElementById('ha-password').focus()">
      </div>
    </div>

    <div class="ha-field-group">
      <div class="ha-label-row">
        <label>Mot de passe</label>
        <button class="ha-link-btn" onclick="HermesAuth.showForgot()">Oublié ?</button>
      </div>
      <div class="ha-input-wrap">
        <svg class="ha-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input type="password" id="ha-password" placeholder="Mot de passe" autocomplete="current-password"
          onkeydown="if(event.key==='Enter')HermesAuth.login()">
        <button type="button" class="ha-pwd-toggle" onclick="HermesAuth.togglePwd('ha-password',this)" tabindex="-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="ha-remember-row">
      <label class="ha-checkbox-label">
        <input type="checkbox" id="ha-remember">
        <span class="ha-checkbox-custom"></span>
        Se souvenir de moi
      </label>
    </div>

    <div id="ha-error" class="ha-error-msg" style="display:none"></div>

    <button id="ha-login-btn" class="ha-btn-primary" onclick="HermesAuth.login()">
      <span class="ha-btn-text">Se connecter</span>
      <svg class="ha-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
      </svg>
    </button>

    <p class="ha-first-login-hint">
      Première connexion ?
      <button class="ha-link-btn" onclick="HermesAuth._firstLoginHint()">Comment ça marche ?</button>
    </p>
  </div>

  <!-- ══ STEP OTP ══ -->
  <div id="ha-step-otp" style="display:none">
    <button class="ha-back-btn" onclick="HermesAuth.backToLogin()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Retour
    </button>
    <h2 class="ha-step-title">Vérification</h2>
    <p class="ha-step-desc">Code envoyé à <strong id="ha-otp-email-display"></strong></p>

    <div id="ha-test-code-box" class="ha-test-box" style="display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      EmailJS non configuré — code de test : <strong id="ha-test-code-display"></strong>
    </div>

    <div class="ha-otp-inputs">${otpInputs}</div>
    <div id="ha-otp-error" class="ha-error-msg" style="display:none"></div>
    <div id="ha-otp-timer" class="ha-timer"></div>

    <button id="ha-verify-btn" class="ha-btn-primary" onclick="HermesAuth.verifyOTP()">
      <span class="ha-btn-text">Vérifier</span>
    </button>
    <button class="ha-btn-secondary" onclick="HermesAuth.resendOTP()">Renvoyer le code</button>
  </div>

  <!-- ══ STEP SET PASSWORD ══ -->
  <div id="ha-step-setpwd" style="display:none">
    <button class="ha-back-btn" onclick="HermesAuth.backToLogin()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Retour
    </button>
    <h2 class="ha-step-title" id="ha-setpwd-title">Créer votre mot de passe</h2>
    <p class="ha-step-desc">Choisissez un mot de passe fort pour sécuriser votre compte.</p>

    <div class="ha-field-group">
      <label>Nouveau mot de passe</label>
      <div class="ha-input-wrap">
        <svg class="ha-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input type="password" id="ha-new-pwd" placeholder="Minimum 8 caractères" autocomplete="new-password"
          oninput="HermesAuth.strength(this.value)">
        <button type="button" class="ha-pwd-toggle" onclick="HermesAuth.togglePwd('ha-new-pwd',this)" tabindex="-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
      <div class="ha-strength-bar"><div id="ha-strength-fill"></div></div>
      <div id="ha-strength-label" class="ha-strength-label"></div>
    </div>

    <div class="ha-field-group">
      <label>Confirmer le mot de passe</label>
      <div class="ha-input-wrap">
        <svg class="ha-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <input type="password" id="ha-confirm-pwd" placeholder="Répétez le mot de passe" autocomplete="new-password"
          onkeydown="if(event.key==='Enter')HermesAuth.setPassword()">
        <button type="button" class="ha-pwd-toggle" onclick="HermesAuth.togglePwd('ha-confirm-pwd',this)" tabindex="-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </div>

    <div id="ha-setpwd-error" class="ha-error-msg" style="display:none"></div>

    <button id="ha-setpwd-btn" class="ha-btn-primary" onclick="HermesAuth.setPassword()">
      <span class="ha-btn-text">Définir le mot de passe</span>
    </button>
  </div>

  <!-- ══ STEP FORGOT ══ -->
  <div id="ha-step-forgot" style="display:none">
    <button class="ha-back-btn" onclick="HermesAuth.backToLogin()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Retour
    </button>
    <h2 class="ha-step-title">Réinitialisation</h2>
    <p class="ha-step-desc">Entrez votre e-mail pour recevoir un code de réinitialisation.</p>

    <div class="ha-field-group">
      <label>Adresse e-mail</label>
      <div class="ha-input-wrap">
        <svg class="ha-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,12 2,6"/>
        </svg>
        <input type="email" id="ha-forgot-email" placeholder="votreemail@exemple.com" autocomplete="email"
          onkeydown="if(event.key==='Enter')HermesAuth.forgotPassword()">
      </div>
    </div>

    <div id="ha-forgot-error" class="ha-error-msg" style="display:none"></div>

    <button id="ha-forgot-btn" class="ha-btn-primary" onclick="HermesAuth.forgotPassword()">
      <span class="ha-btn-text">Envoyer le code</span>
    </button>
  </div>

  <div class="ha-footer">
    <span>Les Cours Hermès · Connexion sécurisée</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  </div>
</div>`;
  }

  // ══════════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════════
  function init() {
    // Create overlay element
    let ov = document.getElementById('hermes-auth-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'hermes-auth-overlay';
      ov.innerHTML = _buildHTML();
      document.body.appendChild(ov);
    }
    _showStep('login');
    ov.style.display = 'flex';
  }

  // ══════════════════════════════════════════
  //  HISTORY RENDERING (for admin panel)
  // ══════════════════════════════════════════
  function renderHistoryTable(containerId, userId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const logs = getHistory(userId);
    if (!logs.length) {
      el.innerHTML = '<p style="color:#A6B4C8;font-size:.85rem;text-align:center;padding:1rem">Aucune connexion enregistrée.</p>';
      return;
    }
    const LABELS = { login:'Connexion', logout:'Déconnexion', failed:'Échec', locked:'Bloqué', auto_logout:'Timeout', password_changed:'MDP changé' };
    el.innerHTML = `<table class="ha-history-table">
      <thead><tr>
        <th>Date / Heure</th><th>Action</th><th>Email</th><th>Rôle</th><th>IP</th><th>Appareil</th>
      </tr></thead>
      <tbody>${logs.slice(0, 100).map(l => {
        const d = new Date(l.ts);
        const dateStr = d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR');
        const action = l.action || 'login';
        return `<tr>
          <td>${dateStr}</td>
          <td><span class="ha-action-badge ${action}">${LABELS[action] || action}</span></td>
          <td>${l.email || '—'}</td>
          <td>${l.role || '—'}</td>
          <td>${l.ip || '—'}</td>
          <td>${l.device || '—'}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>`;
  }

  function getHistory(userId) {
    try {
      const all = JSON.parse(localStorage.getItem(KEYS.HISTORY) || '[]');
      return userId ? all.filter(l => l.userId === userId) : all;
    } catch(e) { return []; }
  }

  // ══════════════════════════════════════════
  //  PUBLIC API
  // ══════════════════════════════════════════
  return {
    init,
    showOverlay,
    hideOverlay,
    startInactivity,
    stopInactivity,
    detectRole,
    isLocked,
    clearAttempts,
    getHistory,
    renderHistoryTable,

    // Exposed for onclick handlers
    login:         _doLogin,
    verifyOTP:     _verifyOTP,
    resendOTP:     _resendOTP,
    setPassword:   _setPassword,
    forgotPassword: _forgotPwd,

    setRole(btn) {
      document.querySelectorAll('.ha-role-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const inp = document.getElementById('ha-role');
      if (inp) inp.value = btn.dataset.role;
    },

    togglePwd(inputId, btn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      const svg = btn.querySelector('svg');
      if (svg) svg.style.opacity = show ? '0.45' : '1';
    },

    otpMove(input, idx) {
      input.value = input.value.replace(/\D/g, '').slice(-1);
      if (input.value && idx < 5) document.getElementById('ha-otp-' + (idx + 1))?.focus();
    },

    otpBack(event, input, idx) {
      if (event.key === 'Backspace' && !input.value && idx > 0) {
        const prev = document.getElementById('ha-otp-' + (idx - 1));
        if (prev) { prev.value = ''; prev.focus(); }
      }
      if (event.key === 'Enter') _verifyOTP();
    },

    backToLogin() {
      _stopOTPTimer();
      _showStep('login');
    },

    showForgot() { _showStep('forgot'); },

    strength(pwd) {
      let s = 0;
      if (pwd.length >= 8)  s++;
      if (pwd.length >= 12) s++;
      if (/[a-z]/.test(pwd)) s++;
      if (/[A-Z]/.test(pwd)) s++;
      if (/[0-9]/.test(pwd)) s++;
      if (/[^a-zA-Z0-9]/.test(pwd)) s++;
      const fill  = document.getElementById('ha-strength-fill');
      const label = document.getElementById('ha-strength-label');
      if (!fill || !label) return;
      const pct = Math.min((s / 6) * 100, 100);
      fill.style.width = pct + '%';
      const lvls = [
        [2, '#EF4444', 'Très faible'],
        [3, '#F97316', 'Faible'],
        [4, '#EAB308', 'Moyen'],
        [5, '#10B981', 'Fort'],
        [99,'#10B981', 'Très fort'],
      ];
      const lvl = lvls.find(l => s <= l[0]);
      fill.style.background  = lvl[1];
      label.style.color      = lvl[1];
      label.textContent      = pwd ? lvl[2] : '';
    },

    _keepAlive() {
      _removeWarnToast();
      _resetTimers();
    },

    _firstLoginHint() {
      _toast('À la première connexion, un code sera envoyé par e-mail pour sécuriser votre compte.', 'info');
    },

    authLogout() {
      const uid  = (typeof auth !== 'undefined') ? auth.userId : null;
      const role = (typeof auth !== 'undefined') ? auth.role   : null;
      logConn(uid, role, _s.email, 'logout').then(() => {
        stopInactivity();
        if (typeof logout === 'function') logout();
        else if (typeof clearSession === 'function') clearSession();
      });
    },
  };
})();
