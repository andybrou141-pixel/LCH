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
