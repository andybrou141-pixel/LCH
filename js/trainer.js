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

