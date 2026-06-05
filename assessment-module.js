// ══════════════════════════════════════════════════════════
//  ASSESSMENT MODULE — HERMES KNOWLEDGE
// ══════════════════════════════════════════════════════════

const assessState = {
  editingId: null,
  draftQuestions: [],
  currentAssessmentId: null,
  currentAttemptId: null,
  currentQuestionIndex: 0,
  autoSaveTimer: null,
  timerInterval: null,
  secondsLeft: 0,
  editingQuestionIndex: null,
};

// ── Data helpers ──────────────────────────────────────────
function getAssessments() {
  if (!appData.assessments) appData.assessments = [];
  return appData.assessments;
}
function getAttempts() {
  if (!appData.assessmentAttempts) appData.assessmentAttempts = [];
  return appData.assessmentAttempts;
}
function getAssessment(id) { return getAssessments().find(a => a.id === id); }
function getAttempt(id)    { return getAttempts().find(a => a.id === id); }
function assessTotalPoints(a) {
  return (a.questions || []).reduce((s, q) => s + (q.points || 1), 0);
}

// ── TRAINER: render list ──────────────────────────────────
function renderTrainerAssessments() {
  const el = document.getElementById('trainer-assessments-content');
  if (!el) return;
  const mine = getAssessments().filter(a => a.trainerId === auth.userId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const toolbar = `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;position:relative;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2" style="position:absolute;left:0.85rem;top:50%;transform:translateY(-50%);pointer-events:none;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Rechercher une évaluation…" oninput="filterAssessCards(this.value)"
          style="width:100%;padding:0.7rem 0.9rem 0.7rem 2.5rem;border:1.5px solid #E2E8F0;border-radius:12px;font-size:0.88rem;font-family:'DM Sans',sans-serif;background:#fff;color:#334155;outline:none;box-sizing:border-box;"
          onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#E2E8F0'">
      </div>
      <button onclick="openAssessmentCreator(null)"
        style="display:flex;align-items:center;gap:0.55rem;background:linear-gradient(135deg,#0D1B3E,#1A3A6B);color:#F0D080;border:1.5px solid rgba(201,168,76,0.35);border-radius:12px;padding:0.72rem 1.3rem;font-size:0.88rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        Créer une évaluation
      </button>
    </div>`;

  if (!mine.length) {
    el.innerHTML = toolbar + `
      <div style="text-align:center;padding:4rem 1rem;background:#fff;border-radius:16px;border:1px solid #f0f0f0;">
        <div style="width:64px;height:64px;margin:0 auto 1rem;background:#f0f4f8;border-radius:16px;display:flex;align-items:center;justify-content:center;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div style="font-size:1rem;font-weight:600;color:#1e293b;margin-bottom:0.4rem;">Aucune évaluation créée</div>
        <div style="font-size:0.85rem;color:#94A3B8;">Créez votre première évaluation interactive pour vos apprenants.</div>
      </div>`;
    return;
  }

  const cards = mine.map(a => buildAssessCard(a)).join('');
  el.innerHTML = toolbar + `<div id="assess-cards-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:1.1rem;">${cards}</div>`;
}

function buildAssessCard(a) {
  const attempts = getAttempts().filter(at => at.assessmentId === a.id && at.status === 'submitted');
  const tp = assessTotalPoints(a);
  const avg = attempts.length ? Math.round(attempts.reduce((s,at) => s + at.percentage, 0) / attempts.length) : null;
  const pub = a.published;
  return `<div class="assess-card" id="acard-${a.id}" style="background:#fff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;transition:box-shadow 0.2s,transform 0.2s;" onmouseover="this.style.boxShadow='0 8px 24px rgba(0,0,0,0.09)';this.style.transform='translateY(-2px)'" onmouseout="this.style.boxShadow='';this.style.transform=''">
    <div style="background:linear-gradient(135deg,#1e3a5f,#2d6a4f);padding:1.1rem 1.25rem;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:0.5rem;">
        <div style="min-width:0;">
          <div style="font-weight:700;font-size:0.97rem;color:#fff;margin-bottom:0.2rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.title}</div>
          ${a.description ? `<div style="font-size:0.73rem;color:rgba(255,255,255,0.68);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.description}</div>` : ''}
        </div>
        <span style="flex-shrink:0;border-radius:50px;padding:0.18rem 0.6rem;font-size:0.68rem;font-weight:700;background:${pub?'#dcfce7':'#f3f4f6'};color:${pub?'#16a34a':'#6b7280'};">${pub?'Publié':'Brouillon'}</span>
      </div>
      <div style="display:flex;gap:1.25rem;margin-top:0.85rem;">
        <div style="text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#fff;">${(a.questions||[]).length}</div><div style="font-size:0.64rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Questions</div></div>
        <div style="text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#F0D080;">${tp}</div><div style="font-size:0.64rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Points</div></div>
        <div style="text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:#86efac;">${attempts.length}</div><div style="font-size:0.64rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Soumissions</div></div>
        ${avg!==null?`<div style="text-align:center;"><div style="font-size:1.2rem;font-weight:800;color:${avg>=70?'#86efac':'#fca5a5'};">${avg}%</div><div style="font-size:0.64rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Moy.</div></div>`:''}
      </div>
    </div>
    <div style="padding:0.9rem 1.1rem;">
      <div style="font-size:0.73rem;color:#94A3B8;margin-bottom:0.85rem;">
        ${a.duration?`⏱ ${a.duration} min · `:'Durée libre · '}${a.passingScore||70}% pour valider · ${a.maxAttempts||'∞'} tentative${(a.maxAttempts||0)!==1?'s':''}
      </div>
      <div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
        <button onclick="openAssessmentCreator('${a.id}')" style="flex:1;min-width:70px;padding:0.5rem 0.6rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:9px;font-size:0.76rem;font-weight:600;color:#475569;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:0.3rem;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Modifier
        </button>
        <button onclick="toggleAssessPublish('${a.id}')" style="flex:1;min-width:70px;padding:0.5rem 0.6rem;background:${pub?'#fef2f2':'#f0fdf4'};border:1px solid ${pub?'#fecaca':'#bbf7d0'};border-radius:9px;font-size:0.76rem;font-weight:600;color:${pub?'#dc2626':'#16a34a'};cursor:pointer;font-family:'DM Sans',sans-serif;">
          ${pub?'Dépublier':'Publier'}
        </button>
        <button onclick="openAssessTrainerResults('${a.id}')" style="padding:0.5rem 0.6rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:9px;font-size:0.76rem;font-weight:600;color:#2563eb;cursor:pointer;font-family:'DM Sans',sans-serif;">Résultats</button>
        <button onclick="confirmDeleteAssess('${a.id}')" style="padding:0.5rem 0.6rem;background:#fff;border:1px solid #e2e8f0;border-radius:9px;color:#dc2626;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}

function filterAssessCards(q) {
  const lower = q.toLowerCase();
  document.querySelectorAll('.assess-card').forEach(el => {
    const title = el.querySelector('[style*="font-weight:700"]')?.textContent || '';
    el.style.display = title.toLowerCase().includes(lower) ? '' : 'none';
  });
}

// ── CREATOR MODAL ─────────────────────────────────────────
function openAssessmentCreator(id) {
  assessState.editingId = id || null;
  const a = id ? getAssessment(id) : null;
  assessState.draftQuestions = a ? JSON.parse(JSON.stringify(a.questions || [])) : [];

  const overlay = document.getElementById('assess-creator-overlay');
  if (!overlay) return;

  overlay.querySelector('#acreator-title').value = a?.title || '';
  overlay.querySelector('#acreator-desc').value = a?.description || '';
  overlay.querySelector('#acreator-duration').value = a?.duration || 0;
  overlay.querySelector('#acreator-passing').value = a?.passingScore || 70;
  overlay.querySelector('#acreator-attempts').value = a?.maxAttempts || 0;
  overlay.querySelector('#acreator-badge').value = a?.badgeThreshold || 70;

  renderDraftQuestions();
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAssessmentCreator() {
  const overlay = document.getElementById('assess-creator-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
  assessState.editingId = null;
  assessState.draftQuestions = [];
  assessState.editingQuestionIndex = null;
}

function saveAssessment() {
  const title = document.getElementById('acreator-title').value.trim();
  if (!title) { showNotif('Saisissez un titre pour l\'évaluation.', 'error'); return; }
  if (!assessState.draftQuestions.length) { showNotif('Ajoutez au moins une question.', 'error'); return; }

  const a = {
    id: assessState.editingId || genId('assess'),
    title,
    description: document.getElementById('acreator-desc').value.trim(),
    trainerId: auth.userId,
    trainerName: auth.userName || '',
    duration: parseInt(document.getElementById('acreator-duration').value) || 0,
    passingScore: parseInt(document.getElementById('acreator-passing').value) || 70,
    maxAttempts: parseInt(document.getElementById('acreator-attempts').value) || 0,
    badgeThreshold: parseInt(document.getElementById('acreator-badge').value) || 70,
    questions: assessState.draftQuestions,
    published: assessState.editingId ? (getAssessment(assessState.editingId)?.published || false) : false,
    createdAt: assessState.editingId ? (getAssessment(assessState.editingId)?.createdAt || Date.now()) : Date.now(),
    updatedAt: Date.now(),
  };

  if (assessState.editingId) {
    const idx = getAssessments().findIndex(x => x.id === assessState.editingId);
    if (idx >= 0) getAssessments()[idx] = a; else getAssessments().push(a);
  } else {
    getAssessments().push(a);
  }

  saveAppData(false);
  closeAssessmentCreator();
  renderTrainerAssessments();
  showNotif('Évaluation sauvegardée.', 'success');
}

function toggleAssessPublish(id) {
  const a = getAssessment(id);
  if (!a) return;
  if (!a.published && !a.questions?.length) { showNotif('Ajoutez des questions avant de publier.', 'error'); return; }
  a.published = !a.published;
  a.updatedAt = Date.now();
  saveAppData(false);
  renderTrainerAssessments();
  showNotif(a.published ? 'Évaluation publiée.' : 'Évaluation dépubliée.', 'success');
}

function confirmDeleteAssess(id) {
  const a = getAssessment(id);
  if (!a) return;
  if (!confirm(`Supprimer "${a.title}" ? Cette action est irréversible.`)) return;
  appData.assessments = getAssessments().filter(x => x.id !== id);
  appData.assessmentAttempts = getAttempts().filter(x => x.assessmentId !== id);
  saveAppData(false);
  renderTrainerAssessments();
  showNotif('Évaluation supprimée.', 'success');
}

// ── QUESTION BUILDER ──────────────────────────────────────
function renderDraftQuestions() {
  const el = document.getElementById('draft-questions-list');
  if (!el) return;
  if (!assessState.draftQuestions.length) {
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:#94A3B8;font-size:0.85rem;">Aucune question. Ajoutez des questions ci-dessous.</div>';
    document.getElementById('draft-q-count').textContent = '0 question';
    document.getElementById('draft-pts-count').textContent = '0 pt';
    return;
  }
  const total = assessState.draftQuestions.reduce((s,q)=>s+(q.points||1),0);
  document.getElementById('draft-q-count').textContent = assessState.draftQuestions.length + ' question' + (assessState.draftQuestions.length>1?'s':'');
  document.getElementById('draft-pts-count').textContent = total + ' pt' + (total>1?'s':'');

  const typeLabel = { mcq_single:'QCM unique', mcq_multiple:'QCM multiple', true_false:'Vrai/Faux', short_answer:'Réponse courte' };
  const typeColor = { mcq_single:'#2563eb', mcq_multiple:'#7c3aed', true_false:'#d97706', short_answer:'#059669' };

  el.innerHTML = assessState.draftQuestions.map((q,i) => `
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:0.85rem 1rem;display:flex;align-items:flex-start;gap:0.75rem;">
      <div style="width:26px;height:26px;border-radius:8px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:#64748b;flex-shrink:0;">${i+1}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.83rem;font-weight:600;color:#1e293b;margin-bottom:0.2rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${q.text||'Question sans texte'}</div>
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          <span style="font-size:0.65rem;font-weight:700;color:${typeColor[q.type]||'#64748b'};background:${typeColor[q.type]||'#64748b'}18;padding:0.15rem 0.5rem;border-radius:50px;">${typeLabel[q.type]||q.type}</span>
          <span style="font-size:0.65rem;color:#94A3B8;">${q.points||1} pt${(q.points||1)>1?'s':''}</span>
        </div>
      </div>
      <div style="display:flex;gap:0.3rem;flex-shrink:0;">
        <button onclick="editDraftQuestion(${i})" style="width:28px;height:28px;border:1px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;" title="Modifier">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button onclick="moveDraftQ(${i},-1)" ${i===0?'disabled':''} style="width:28px;height:28px;border:1px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button onclick="moveDraftQ(${i},1)" ${i===assessState.draftQuestions.length-1?'disabled':''} style="width:28px;height:28px;border:1px solid #e2e8f0;border-radius:7px;background:#f8fafc;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button onclick="removeDraftQ(${i})" style="width:28px;height:28px;border:1px solid #fecaca;border-radius:7px;background:#fef2f2;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#dc2626;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>`).join('');
}

function moveDraftQ(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= assessState.draftQuestions.length) return;
  [assessState.draftQuestions[i], assessState.draftQuestions[j]] = [assessState.draftQuestions[j], assessState.draftQuestions[i]];
  renderDraftQuestions();
}

function removeDraftQ(i) {
  assessState.draftQuestions.splice(i, 1);
  renderDraftQuestions();
}

function editDraftQuestion(i) {
  assessState.editingQuestionIndex = i;
  const q = assessState.draftQuestions[i];
  openQuestionEditor(q.type, q);
}

function openQuestionEditor(type, existing) {
  const panel = document.getElementById('assess-qeditor-panel');
  if (!panel) return;
  // If called from "add" buttons (existing===null), reset editing index
  if (existing === null) assessState.editingQuestionIndex = null;
  const idx = assessState.editingQuestionIndex;
  const isEdit = idx !== null && idx >= 0;

  const typeLabel = { mcq_single:'QCM à choix unique', mcq_multiple:'QCM à choix multiple', true_false:'Vrai / Faux', short_answer:'Réponse courte' };

  let optionsHtml = '';
  if (type === 'mcq_single' || type === 'mcq_multiple') {
    const opts = existing?.options || ['', '', '', ''];
    const correct = existing?.correctAnswer;
    const correctArr = Array.isArray(correct) ? correct : (correct !== undefined ? [correct] : []);
    optionsHtml = `
      <div style="margin-bottom:1rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.5rem;">Options <span style="color:#94A3B8;font-weight:400;">(cochez la/les bonne(s) réponse(s))</span></label>
        <div id="qed-options-list">
          ${opts.map((o,i) => `
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.45rem;" id="qed-opt-row-${i}">
              <input type="${type==='mcq_single'?'radio':'checkbox'}" name="qed-correct" value="${i}" ${correctArr.includes(i)?'checked':''} style="width:16px;height:16px;accent-color:#2d6a4f;flex-shrink:0;" id="qed-correct-${i}">
              <input type="text" value="${o}" placeholder="Option ${String.fromCharCode(65+i)}" id="qed-opt-${i}"
                style="flex:1;padding:0.55rem 0.7rem;border:1.5px solid #e2e8f0;border-radius:9px;font-size:0.82rem;font-family:'DM Sans',sans-serif;outline:none;"
                onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">
              <button onclick="removeQedOption(${i})" style="width:26px;height:26px;border:1px solid #fecaca;background:#fef2f2;border-radius:7px;color:#dc2626;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>`).join('')}
        </div>
        <button onclick="addQedOption()" style="font-size:0.78rem;color:#2d6a4f;background:#f0fdf4;border:1px dashed #86efac;border-radius:8px;padding:0.45rem 0.9rem;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;">+ Ajouter une option</button>
      </div>`;
  } else if (type === 'true_false') {
    const ans = existing?.correctAnswer;
    optionsHtml = `
      <div style="margin-bottom:1rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.5rem;">Bonne réponse</label>
        <div style="display:flex;gap:0.75rem;">
          <label style="flex:1;display:flex;align-items:center;gap:0.5rem;padding:0.75rem;background:${ans===true?'#f0fdf4':'#f8fafc'};border:1.5px solid ${ans===true?'#86efac':'#e2e8f0'};border-radius:10px;cursor:pointer;">
            <input type="radio" name="qed-tf" value="true" ${ans===true?'checked':''} style="accent-color:#16a34a;"> <span style="font-weight:600;color:#16a34a;">Vrai</span>
          </label>
          <label style="flex:1;display:flex;align-items:center;gap:0.5rem;padding:0.75rem;background:${ans===false?'#fef2f2':'#f8fafc'};border:1.5px solid ${ans===false?'#fecaca':'#e2e8f0'};border-radius:10px;cursor:pointer;">
            <input type="radio" name="qed-tf" value="false" ${ans===false?'checked':''} style="accent-color:#dc2626;"> <span style="font-weight:600;color:#dc2626;">Faux</span>
          </label>
        </div>
      </div>`;
  } else if (type === 'short_answer') {
    optionsHtml = `
      <div style="margin-bottom:1rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.5rem;">Réponse attendue <span style="color:#94A3B8;font-weight:400;">(mots-clés acceptés, séparés par |)</span></label>
        <input type="text" id="qed-short-answer" value="${existing?.correctAnswer||''}" placeholder="ex: photosynthèse | photosynthese"
          style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid #e2e8f0;border-radius:9px;font-size:0.82rem;font-family:'DM Sans',sans-serif;outline:none;box-sizing:border-box;"
          onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">
      </div>`;
  }

  panel.innerHTML = `
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:1.25rem;margin-bottom:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;">
        <div style="font-size:0.88rem;font-weight:700;color:#1e293b;">
          ${isEdit ? 'Modifier la question' : 'Nouvelle question'} — <span style="color:#2d6a4f;">${typeLabel[type]||type}</span>
        </div>
        <button onclick="closeQuestionEditor()" style="width:28px;height:28px;border:1px solid #e2e8f0;border-radius:50%;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:0.9rem;">✕</button>
      </div>
      <div style="margin-bottom:0.85rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">Texte de la question *</label>
        <textarea id="qed-text" rows="2" placeholder="Saisissez votre question…"
          style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid #e2e8f0;border-radius:9px;font-size:0.85rem;font-family:'DM Sans',sans-serif;resize:vertical;outline:none;box-sizing:border-box;"
          onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">${existing?.text||''}</textarea>
      </div>
      ${optionsHtml}
      <div style="display:flex;gap:0.75rem;margin-bottom:0.85rem;">
        <div style="flex:1;">
          <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">Points</label>
          <input type="number" id="qed-points" value="${existing?.points||1}" min="0.5" step="0.5"
            style="width:100%;padding:0.55rem 0.7rem;border:1.5px solid #e2e8f0;border-radius:9px;font-size:0.82rem;font-family:'DM Sans',sans-serif;outline:none;"
            onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">
        </div>
      </div>
      <div style="margin-bottom:0.85rem;">
        <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:0.4rem;">Explication / Corrigé <span style="color:#94A3B8;font-weight:400;">(optionnel)</span></label>
        <textarea id="qed-expl" rows="2" placeholder="Explication affichée après la soumission…"
          style="width:100%;padding:0.6rem 0.8rem;border:1.5px solid #e2e8f0;border-radius:9px;font-size:0.82rem;font-family:'DM Sans',sans-serif;resize:vertical;outline:none;box-sizing:border-box;"
          onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">${existing?.explanation||''}</textarea>
      </div>
      <div style="display:flex;gap:0.6rem;justify-content:flex-end;">
        <button onclick="closeQuestionEditor()" style="padding:0.55rem 1.2rem;border:1.5px solid #e2e8f0;border-radius:9px;background:#fff;font-size:0.82rem;font-weight:600;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;">Annuler</button>
        <button onclick="validateQuestionEditor('${type}')" style="padding:0.55rem 1.4rem;border:none;border-radius:9px;background:linear-gradient(135deg,#1e3a5f,#2d6a4f);color:#fff;font-size:0.82rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">
          ${isEdit ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </div>`;

  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeQuestionEditor() {
  const panel = document.getElementById('assess-qeditor-panel');
  if (panel) panel.innerHTML = '';
  assessState.editingQuestionIndex = null;
}

function addQedOption() {
  const list = document.getElementById('qed-options-list');
  if (!list) return;
  const rows = list.querySelectorAll('[id^="qed-opt-row-"]');
  const i = rows.length;
  const div = document.createElement('div');
  div.id = `qed-opt-row-${i}`;
  div.style.cssText = 'display:flex;align-items:center;gap:0.5rem;margin-bottom:0.45rem;';
  div.innerHTML = `
    <input type="checkbox" name="qed-correct" value="${i}" style="width:16px;height:16px;accent-color:#2d6a4f;flex-shrink:0;" id="qed-correct-${i}">
    <input type="text" value="" placeholder="Option ${String.fromCharCode(65+i)}" id="qed-opt-${i}"
      style="flex:1;padding:0.55rem 0.7rem;border:1.5px solid #e2e8f0;border-radius:9px;font-size:0.82rem;font-family:'DM Sans',sans-serif;outline:none;"
      onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">
    <button onclick="removeQedOption(${i})" style="width:26px;height:26px;border:1px solid #fecaca;background:#fef2f2;border-radius:7px;color:#dc2626;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>`;
  list.appendChild(div);
}

function removeQedOption(i) {
  const row = document.getElementById('qed-opt-row-' + i);
  if (row) row.remove();
}

function validateQuestionEditor(type) {
  const text = document.getElementById('qed-text')?.value.trim();
  if (!text) { showNotif('Saisissez le texte de la question.', 'error'); return; }

  const points = parseFloat(document.getElementById('qed-points')?.value) || 1;
  const explanation = document.getElementById('qed-expl')?.value.trim() || '';
  let correctAnswer, options;

  if (type === 'mcq_single' || type === 'mcq_multiple') {
    const list = document.getElementById('qed-options-list');
    const rows = list?.querySelectorAll('[id^="qed-opt-row-"]') || [];
    options = [];
    rows.forEach((_, i) => {
      const val = document.getElementById('qed-opt-' + i)?.value.trim() || '';
      if (val) options.push(val);
    });
    if (options.length < 2) { showNotif('Ajoutez au moins 2 options.', 'error'); return; }

    const checked = [];
    rows.forEach((_, i) => {
      const cb = document.getElementById('qed-correct-' + i);
      if (cb?.checked) checked.push(options.length > i ? i : -1);
    });
    const validChecked = checked.filter(c => c >= 0 && c < options.length);
    if (!validChecked.length) { showNotif('Cochez la bonne réponse.', 'error'); return; }
    correctAnswer = type === 'mcq_single' ? validChecked[0] : validChecked;
  } else if (type === 'true_false') {
    const sel = document.querySelector('input[name="qed-tf"]:checked');
    if (!sel) { showNotif('Sélectionnez Vrai ou Faux.', 'error'); return; }
    correctAnswer = sel.value === 'true';
  } else if (type === 'short_answer') {
    const ans = document.getElementById('qed-short-answer')?.value.trim();
    if (!ans) { showNotif('Saisissez la réponse attendue.', 'error'); return; }
    correctAnswer = ans;
  }

  const q = { id: genId('q'), type, text, options, correctAnswer, points, explanation };
  const idx = assessState.editingQuestionIndex;
  if (idx !== null && idx >= 0) {
    q.id = assessState.draftQuestions[idx].id || q.id;
    assessState.draftQuestions[idx] = q;
  } else {
    assessState.draftQuestions.push(q);
  }
  closeQuestionEditor();
  renderDraftQuestions();
}

// ── STUDENT: assessment list ──────────────────────────────
function renderStudentAssessments() {
  const el = document.getElementById('sec-assessments-content');
  if (!el) return;

  const published = getAssessments().filter(a => a.published);
  if (!published.length) {
    el.innerHTML = '<div style="text-align:center;padding:2rem;color:#94A3B8;font-size:0.85rem;">Aucune évaluation disponible pour le moment.</div>';
    return;
  }

  el.innerHTML = published.sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).map(a => {
    const myAttempts = getAttempts().filter(at => at.userId === auth.userId && at.assessmentId === a.id && at.status === 'submitted');
    const last = myAttempts.sort((x,y)=>(y.submittedAt||0)-(x.submittedAt||0))[0];
    const canAttempt = !a.maxAttempts || myAttempts.length < a.maxAttempts;
    const inProgress = getAttempts().find(at => at.userId === auth.userId && at.assessmentId === a.id && at.status === 'in_progress');
    const tp = assessTotalPoints(a);

    return `<div style="background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:0.85rem;display:flex;flex-direction:column;">
      <div style="background:linear-gradient(135deg,#1e3a5f,#2d6a4f);padding:0.9rem 1.1rem;display:flex;align-items:center;gap:0.75rem;">
        <div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:0.93rem;color:#fff;">${a.title}</div>
          ${a.description?`<div style="font-size:0.72rem;color:rgba(255,255,255,0.65);">${a.description}</div>`:''}
        </div>
        ${last ? `<span style="flex-shrink:0;background:${last.passed?'#dcfce7':'#fee2e2'};color:${last.passed?'#16a34a':'#dc2626'};border-radius:50px;padding:0.15rem 0.6rem;font-size:0.68rem;font-weight:700;">${last.percentage}%</span>` : ''}
      </div>
      <div style="padding:0.75rem 1.1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
        <div style="display:flex;gap:1rem;flex:1;">
          <div style="text-align:center;"><div style="font-weight:700;color:#1e293b;">${(a.questions||[]).length}</div><div style="font-size:0.65rem;color:#94A3B8;">Questions</div></div>
          <div style="text-align:center;"><div style="font-weight:700;color:#2d6a4f;">${tp}</div><div style="font-size:0.65rem;color:#94A3B8;">Points</div></div>
          <div style="text-align:center;"><div style="font-weight:700;color:#d97706;">${a.duration||'∞'}</div><div style="font-size:0.65rem;color:#94A3B8;">Min</div></div>
          <div style="text-align:center;"><div style="font-weight:700;color:#7c3aed;">${myAttempts.length}${a.maxAttempts?'/'+a.maxAttempts:''}</div><div style="font-size:0.65rem;color:#94A3B8;">Tentatives</div></div>
        </div>
        <div style="display:flex;gap:0.5rem;flex-shrink:0;">
          ${myAttempts.length ? `<button onclick="openStudentAssessHistory('${a.id}')" style="padding:0.5rem 0.85rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:9px;font-size:0.78rem;font-weight:600;color:#2563eb;cursor:pointer;font-family:'DM Sans',sans-serif;">Historique</button>` : ''}
          ${canAttempt ? `<button onclick="startAssessment('${a.id}','${inProgress?.id||''}')" style="padding:0.5rem 1rem;background:linear-gradient(135deg,#1e3a5f,#2d6a4f);color:#fff;border:none;border-radius:9px;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">
            ${inProgress ? 'Continuer' : 'Commencer'}
          </button>` : `<span style="font-size:0.75rem;color:#94A3B8;padding:0.5rem;">Tentatives épuisées</span>`}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── TAKE ASSESSMENT ───────────────────────────────────────
function startAssessment(assessmentId, existingAttemptId) {
  const a = getAssessment(assessmentId);
  if (!a) return;

  let attempt;
  if (existingAttemptId) {
    attempt = getAttempt(existingAttemptId);
  }
  if (!attempt) {
    const prevAttempts = getAttempts().filter(at => at.userId === auth.userId && at.assessmentId === assessmentId && at.status === 'submitted');
    attempt = {
      id: genId('attempt'),
      assessmentId,
      userId: auth.userId,
      userName: auth.userName || '',
      answers: {},
      startedAt: Date.now(),
      submittedAt: null,
      status: 'in_progress',
      score: 0, maxScore: assessTotalPoints(a), percentage: 0,
      note20: 0, note100: 0, passed: false, badgeEarned: false,
      attemptNumber: prevAttempts.length + 1,
      corrections: [],
    };
    getAttempts().push(attempt);
    saveAppData(false);
  }

  assessState.currentAssessmentId = assessmentId;
  assessState.currentAttemptId = attempt.id;
  assessState.currentQuestionIndex = 0;

  // Restore draft answers from localStorage
  try {
    const draft = JSON.parse(localStorage.getItem('hermes_assess_draft_' + attempt.id) || '{}');
    if (Object.keys(draft).length) attempt.answers = draft;
  } catch(e) {}

  // Open overlay
  const overlay = document.getElementById('assess-take-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Start timer if set
  if (a.duration > 0) {
    const elapsed = Math.floor((Date.now() - attempt.startedAt) / 1000);
    assessState.secondsLeft = Math.max(0, a.duration * 60 - elapsed);
    startAssessTimer();
  }

  // Auto-save every 30s
  clearInterval(assessState.autoSaveTimer);
  assessState.autoSaveTimer = setInterval(() => autoSaveDraft(), 30000);

  renderAssessQuestion();
}

function startAssessTimer() {
  clearInterval(assessState.timerInterval);
  updateTimerDisplay();
  assessState.timerInterval = setInterval(() => {
    assessState.secondsLeft--;
    updateTimerDisplay();
    if (assessState.secondsLeft <= 0) {
      clearInterval(assessState.timerInterval);
      showNotif('Temps écoulé ! Soumission automatique.', 'warning');
      submitAssessment(true);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('assess-timer-display');
  if (!el) return;
  const s = assessState.secondsLeft;
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const str = m + ':' + String(sec).padStart(2, '0');
  el.textContent = str;
  el.style.color = s < 60 ? '#dc2626' : s < 300 ? '#d97706' : '#16a34a';
}

function autoSaveDraft() {
  const attempt = getAttempt(assessState.currentAttemptId);
  if (!attempt) return;
  try { localStorage.setItem('hermes_assess_draft_' + attempt.id, JSON.stringify(attempt.answers)); } catch(e) {}
}

function renderAssessQuestion() {
  const a = getAssessment(assessState.currentAssessmentId);
  const attempt = getAttempt(assessState.currentAttemptId);
  if (!a || !attempt) return;

  const qi = assessState.currentQuestionIndex;
  const total = a.questions.length;
  const q = a.questions[qi];
  const pct = Math.round(((qi + 1) / total) * 100);
  const answered = Object.keys(attempt.answers).length;
  const answeredPct = Math.round((answered / total) * 100);

  document.getElementById('assess-take-title').textContent = a.title;
  document.getElementById('assess-take-qnum').textContent = `Question ${qi + 1} / ${total}`;
  document.getElementById('assess-take-progress-bar').style.width = pct + '%';
  document.getElementById('assess-take-answered').textContent = `${answered}/${total} répondu${answered>1?'s':''}`;

  // Timer
  const timerEl = document.getElementById('assess-timer-wrap');
  if (timerEl) timerEl.style.display = a.duration > 0 ? 'flex' : 'none';

  // Nav dots
  const dotsEl = document.getElementById('assess-take-dots');
  if (dotsEl) {
    dotsEl.innerHTML = a.questions.map((_, i) => {
      const isAns = attempt.answers[a.questions[i].id] !== undefined;
      const isCur = i === qi;
      return `<button onclick="goToAssessQuestion(${i})" title="Q${i+1}"
        style="width:${isCur?'28px':'10px'};height:10px;border-radius:50px;background:${isCur?'#2d6a4f':isAns?'#86efac':'#e2e8f0'};border:none;cursor:pointer;transition:all 0.2s;min-width:10px;"></button>`;
    }).join('');
  }

  // Question body
  const bodyEl = document.getElementById('assess-take-body');
  if (!bodyEl) return;

  const userAnswer = attempt.answers[q.id];
  let answerHtml = '';

  if (q.type === 'mcq_single') {
    answerHtml = (q.options || []).map((opt, i) => {
      const sel = userAnswer === i;
      return `<label style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.85rem 1rem;border:2px solid ${sel?'#2d6a4f':'#e2e8f0'};border-radius:12px;cursor:pointer;background:${sel?'#f0fdf4':'#fff'};margin-bottom:0.6rem;transition:all 0.15s;" onclick="selectAssessAnswer('${q.id}','mcq_single',${i})">
        <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${sel?'#2d6a4f':'#cbd5e1'};background:${sel?'#2d6a4f':'#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
          ${sel?'<div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>':''}
        </div>
        <span style="font-size:0.88rem;color:#1e293b;line-height:1.5;">${opt}</span>
      </label>`;
    }).join('');
  } else if (q.type === 'mcq_multiple') {
    const selArr = Array.isArray(userAnswer) ? userAnswer : [];
    answerHtml = (q.options || []).map((opt, i) => {
      const sel = selArr.includes(i);
      return `<label style="display:flex;align-items:flex-start;gap:0.75rem;padding:0.85rem 1rem;border:2px solid ${sel?'#7c3aed':'#e2e8f0'};border-radius:12px;cursor:pointer;background:${sel?'#f5f3ff':'#fff'};margin-bottom:0.6rem;transition:all 0.15s;" onclick="selectAssessAnswer('${q.id}','mcq_multiple',${i})">
        <div style="width:20px;height:20px;border-radius:5px;border:2px solid ${sel?'#7c3aed':'#cbd5e1'};background:${sel?'#7c3aed':'#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
          ${sel?'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
        </div>
        <span style="font-size:0.88rem;color:#1e293b;line-height:1.5;">${opt}</span>
      </label>`;
    }).join('');
  } else if (q.type === 'true_false') {
    answerHtml = ['Vrai', 'Faux'].map((lbl, i) => {
      const val = i === 0;
      const sel = userAnswer === val;
      const col = i === 0 ? '#16a34a' : '#dc2626';
      return `<label style="display:flex;align-items:center;gap:0.75rem;padding:1rem 1.25rem;border:2px solid ${sel?col:'#e2e8f0'};border-radius:12px;cursor:pointer;background:${sel?(i===0?'#f0fdf4':'#fef2f2'):'#fff'};margin-bottom:0.6rem;flex:1;justify-content:center;" onclick="selectAssessAnswer('${q.id}','true_false',${val})">
        <div style="width:20px;height:20px;border-radius:50%;border:2px solid ${sel?col:'#cbd5e1'};background:${sel?col:'#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${sel?'<div style="width:8px;height:8px;border-radius:50%;background:#fff;"></div>':''}
        </div>
        <span style="font-size:1rem;font-weight:700;color:${sel?col:'#64748b'};">${lbl}</span>
      </label>`;
    }).join('');
    answerHtml = `<div style="display:flex;gap:0.75rem;">${answerHtml}</div>`;
  } else if (q.type === 'short_answer') {
    answerHtml = `<textarea id="short-ans-input" rows="3" placeholder="Votre réponse…"
      oninput="selectAssessAnswer('${q.id}','short_answer',this.value)"
      style="width:100%;padding:0.85rem;border:2px solid #e2e8f0;border-radius:12px;font-size:0.9rem;font-family:'DM Sans',sans-serif;resize:vertical;outline:none;box-sizing:border-box;background:#fff;color:#1e293b;"
      onfocus="this.style.borderColor='#2d6a4f'" onblur="this.style.borderColor='#e2e8f0'">${userAnswer||''}</textarea>`;
  }

  bodyEl.innerHTML = `
    <div style="margin-bottom:0.5rem;">
      <span style="font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#2d6a4f;background:#f0fdf4;padding:0.2rem 0.6rem;border-radius:50px;">
        ${q.points} point${q.points>1?'s':''} · ${{mcq_single:'QCM unique',mcq_multiple:'QCM multiple',true_false:'Vrai/Faux',short_answer:'Réponse courte'}[q.type]||q.type}
      </span>
    </div>
    <div style="font-size:1.05rem;font-weight:600;color:#1e293b;line-height:1.55;margin-bottom:1.25rem;">${q.text}</div>
    <div>${answerHtml}</div>`;

  // Nav buttons
  document.getElementById('assess-btn-prev').disabled = qi === 0;
  document.getElementById('assess-btn-next').style.display = qi < total - 1 ? 'inline-flex' : 'none';
  document.getElementById('assess-btn-submit').style.display = qi === total - 1 ? 'inline-flex' : 'none';
}

function goToAssessQuestion(i) {
  assessState.currentQuestionIndex = i;
  renderAssessQuestion();
}

function selectAssessAnswer(questionId, type, value) {
  const attempt = getAttempt(assessState.currentAttemptId);
  if (!attempt) return;
  if (type === 'mcq_multiple') {
    const current = Array.isArray(attempt.answers[questionId]) ? [...attempt.answers[questionId]] : [];
    const idx = current.indexOf(value);
    if (idx >= 0) current.splice(idx, 1); else current.push(value);
    attempt.answers[questionId] = current;
  } else {
    attempt.answers[questionId] = value;
  }
  autoSaveDraft();
  renderAssessQuestion();
}

function prevAssessQuestion() {
  if (assessState.currentQuestionIndex > 0) {
    assessState.currentQuestionIndex--;
    renderAssessQuestion();
  }
}

function nextAssessQuestion() {
  const a = getAssessment(assessState.currentAssessmentId);
  if (!a) return;
  if (assessState.currentQuestionIndex < a.questions.length - 1) {
    assessState.currentQuestionIndex++;
    renderAssessQuestion();
  }
}

function confirmSubmitAssessment() {
  const attempt = getAttempt(assessState.currentAttemptId);
  const a = getAssessment(assessState.currentAssessmentId);
  if (!attempt || !a) return;
  const answered = Object.keys(attempt.answers).length;
  const total = a.questions.length;
  const unanswered = total - answered;

  const msg = unanswered > 0
    ? `Vous n'avez pas répondu à ${unanswered} question${unanswered>1?'s':''}. Soumettre quand même ?`
    : `Êtes-vous sûr de vouloir soumettre votre évaluation ?`;

  document.getElementById('assess-confirm-msg').textContent = msg;
  document.getElementById('assess-confirm-overlay').style.display = 'flex';
}

function submitAssessment(auto) {
  document.getElementById('assess-confirm-overlay').style.display = 'none';
  const attempt = getAttempt(assessState.currentAttemptId);
  const a = getAssessment(assessState.currentAssessmentId);
  if (!attempt || !a) return;

  clearInterval(assessState.timerInterval);
  clearInterval(assessState.autoSaveTimer);
  try { localStorage.removeItem('hermes_assess_draft_' + attempt.id); } catch(e) {}

  // ── AUTO-CORRECTION ────────────────────────────────────
  let totalEarned = 0;
  const corrections = a.questions.map(q => {
    const userAns = attempt.answers[q.id];
    let isCorrect = false;

    if (q.type === 'mcq_single') {
      isCorrect = userAns === q.correctAnswer;
    } else if (q.type === 'mcq_multiple') {
      const ua = Array.isArray(userAns) ? [...userAns].sort() : [];
      const ca = Array.isArray(q.correctAnswer) ? [...q.correctAnswer].sort() : [];
      isCorrect = ua.length === ca.length && ua.every((v,i) => v === ca[i]);
    } else if (q.type === 'true_false') {
      isCorrect = userAns === q.correctAnswer;
    } else if (q.type === 'short_answer') {
      if (userAns && q.correctAnswer) {
        const keywords = String(q.correctAnswer).split('|').map(k => k.trim().toLowerCase());
        const userLower = String(userAns).toLowerCase().trim();
        isCorrect = keywords.some(kw => userLower.includes(kw));
      }
    }

    const pointsEarned = isCorrect ? (q.points || 1) : 0;
    totalEarned += pointsEarned;

    return {
      questionId: q.id,
      questionText: q.text,
      type: q.type,
      isCorrect,
      pointsEarned,
      maxPoints: q.points || 1,
      userAnswer: userAns,
      correctAnswer: q.correctAnswer,
      options: q.options,
      explanation: q.explanation || '',
    };
  });

  const maxScore = assessTotalPoints(a);
  const percentage = maxScore > 0 ? Math.round((totalEarned / maxScore) * 100) : 0;
  const note20 = Math.round((totalEarned / maxScore) * 20 * 10) / 10;
  const note100 = percentage;
  const passed = percentage >= (a.passingScore || 70);
  const badgeEarned = percentage >= (a.badgeThreshold || 70);

  attempt.status = 'submitted';
  attempt.submittedAt = Date.now();
  attempt.score = totalEarned;
  attempt.maxScore = maxScore;
  attempt.percentage = percentage;
  attempt.note20 = note20;
  attempt.note100 = note100;
  attempt.passed = passed;
  attempt.badgeEarned = badgeEarned;
  attempt.corrections = corrections;

  // Integrate in student's dossier
  const user = (appData.users || []).find(u => u.id === auth.userId);
  if (user) {
    if (!user.assessmentHistory) user.assessmentHistory = [];
    user.assessmentHistory.push({ attemptId: attempt.id, assessmentId: a.id, title: a.title, percentage, note20, passed, badgeEarned, submittedAt: attempt.submittedAt });
  }

  saveAppData(false);

  // Close take overlay, show results
  document.getElementById('assess-take-overlay').style.display = 'none';
  showAssessResults(attempt.id);
}

// ── RESULTS PAGE ──────────────────────────────────────────
function showAssessResults(attemptId) {
  const attempt = getAttempt(attemptId);
  const a = getAssessment(attempt?.assessmentId);
  if (!attempt || !a) return;

  const overlay = document.getElementById('assess-results-overlay');
  if (!overlay) return;

  const { percentage, note20, note100, passed, badgeEarned, score, maxScore, corrections } = attempt;
  const circleColor = passed ? '#16a34a' : '#dc2626';
  const gradeColor = percentage >= 70 ? '#16a34a' : percentage >= 50 ? '#d97706' : '#dc2626';

  const correctCount = corrections.filter(c => c.isCorrect).length;
  const wrongCount = corrections.filter(c => !c.isCorrect).length;

  overlay.querySelector('#assess-res-content').innerHTML = `
    <div style="max-width:720px;margin:0 auto;">
      <!-- Score summary -->
      <div style="background:linear-gradient(135deg,${passed?'#1e3a5f,#2d6a4f':'#7f1d1d,#991b1b'});border-radius:20px;padding:2rem;text-align:center;margin-bottom:1.5rem;position:relative;overflow:hidden;">
        ${badgeEarned ? `<div style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,0.15);border-radius:50px;padding:0.3rem 0.8rem;font-size:0.75rem;font-weight:700;color:#fff;">🏆 Badge obtenu</div>` : ''}
        <div style="width:100px;height:100px;border-radius:50%;border:6px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.1);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto 1rem;">
          <div style="font-size:2rem;font-weight:900;color:#fff;line-height:1;">${percentage}</div>
          <div style="font-size:0.7rem;color:rgba(255,255,255,0.7);font-weight:600;">%</div>
        </div>
        <div style="font-size:1.4rem;font-weight:800;color:#fff;margin-bottom:0.35rem;">${passed ? 'Évaluation validée !' : 'Évaluation non validée'}</div>
        <div style="font-size:0.88rem;color:rgba(255,255,255,0.75);">${a.title}</div>
        <div style="display:flex;justify-content:center;gap:2rem;margin-top:1.25rem;">
          <div style="text-align:center;"><div style="font-size:1.5rem;font-weight:800;color:#fff;">${note20}<span style="font-size:0.85rem;color:rgba(255,255,255,0.6);">/20</span></div><div style="font-size:0.7rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Note</div></div>
          <div style="text-align:center;"><div style="font-size:1.5rem;font-weight:800;color:#fff;">${score}<span style="font-size:0.85rem;color:rgba(255,255,255,0.6);">/${maxScore}</span></div><div style="font-size:0.7rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Points</div></div>
          <div style="text-align:center;"><div style="font-size:1.5rem;font-weight:800;color:#4ade80;">${correctCount}</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Correctes</div></div>
          <div style="text-align:center;"><div style="font-size:1.5rem;font-weight:800;color:#f87171;">${wrongCount}</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.05em;">Erreurs</div></div>
        </div>
      </div>

      ${badgeEarned ? `
      <div style="background:linear-gradient(135deg,#92400e,#d97706);border-radius:16px;padding:1.25rem;text-align:center;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem;">
        <div style="font-size:3rem;flex-shrink:0;">🏆</div>
        <div style="text-align:left;">
          <div style="font-size:1.05rem;font-weight:800;color:#fff;">Félicitations ! Badge obtenu</div>
          <div style="font-size:0.82rem;color:rgba(255,255,255,0.8);">Vous avez obtenu ${percentage}% et dépassé le seuil de ${a.badgeThreshold||70}%. Un certificat vous a été attribué.</div>
        </div>
        <button onclick="generateCertificate('${attempt.id}')" style="margin-left:auto;flex-shrink:0;padding:0.55rem 1rem;background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.4);border-radius:9px;color:#fff;font-size:0.78rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;white-space:nowrap;">
          Voir le certificat
        </button>
      </div>` : ''}

      <!-- Buttons -->
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.5rem;">
        <button onclick="printAssessResults('${attempt.id}')" style="flex:1;min-width:150px;padding:0.7rem 1rem;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:10px;font-size:0.82rem;font-weight:700;color:#2563eb;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:0.5rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Télécharger PDF
        </button>
        ${getAttempts().filter(at=>at.userId===auth.userId&&at.assessmentId===a.id&&at.status==='submitted').length < (a.maxAttempts||999) ? `
        <button onclick="closeAssessResults();startAssessment('${a.id}','')" style="flex:1;min-width:150px;padding:0.7rem 1rem;background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;font-size:0.82rem;font-weight:700;color:#16a34a;cursor:pointer;font-family:'DM Sans',sans-serif;">Nouvelle tentative</button>` : ''}
        <button onclick="closeAssessResults()" style="flex:1;min-width:100px;padding:0.7rem 1rem;background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;font-size:0.82rem;font-weight:700;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;">Fermer</button>
      </div>

      <!-- Detailed corrections -->
      <div style="font-size:0.9rem;font-weight:700;color:#1e293b;margin-bottom:0.85rem;">Corrigé détaillé</div>
      ${corrections.map((c, i) => buildCorrectionCard(c, i)).join('')}
    </div>`;

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  overlay.querySelector('#assess-res-content').scrollTop = 0;
}

function buildCorrectionCard(c, i) {
  const typeLabel = { mcq_single:'QCM', mcq_multiple:'QCM multiple', true_false:'Vrai/Faux', short_answer:'Réponse courte' };
  const bg = c.isCorrect ? '#f0fdf4' : '#fef2f2';
  const border = c.isCorrect ? '#86efac' : '#fecaca';
  const icon = c.isCorrect
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  let answerDetails = '';
  if (c.type === 'mcq_single' || c.type === 'mcq_multiple') {
    const opts = c.options || [];
    const userArr = Array.isArray(c.userAnswer) ? c.userAnswer : (c.userAnswer !== undefined ? [c.userAnswer] : []);
    const corrArr = Array.isArray(c.correctAnswer) ? c.correctAnswer : (c.correctAnswer !== undefined ? [c.correctAnswer] : []);
    answerDetails = opts.map((opt,idx) => {
      const isUser = userArr.includes(idx);
      const isCorrect = corrArr.includes(idx);
      const mark = isCorrect ? '✓' : (isUser && !isCorrect ? '✗' : '');
      const color = isCorrect ? '#16a34a' : (isUser && !isCorrect ? '#dc2626' : '#64748b');
      return `<div style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;font-size:0.82rem;">
        <span style="width:18px;font-weight:700;color:${color};">${mark}</span>
        <span style="color:${color};font-weight:${(isUser||isCorrect)?'600':'400'};">${opt}</span>
        ${isUser&&!isCorrect?'<span style="font-size:0.65rem;color:#dc2626;background:#fef2f2;padding:0.1rem 0.4rem;border-radius:50px;">Votre réponse</span>':''}
        ${isCorrect?'<span style="font-size:0.65rem;color:#16a34a;background:#f0fdf4;padding:0.1rem 0.4rem;border-radius:50px;">Bonne réponse</span>':''}
      </div>`;
    }).join('');
  } else if (c.type === 'true_false') {
    const userLabel = c.userAnswer === true ? 'Vrai' : c.userAnswer === false ? 'Faux' : 'Non répondu';
    const corrLabel = c.correctAnswer === true ? 'Vrai' : 'Faux';
    answerDetails = `<div style="font-size:0.82rem;"><span style="color:#64748b;">Votre réponse : </span><strong style="color:${c.isCorrect?'#16a34a':'#dc2626'};">${userLabel}</strong> · <span style="color:#64748b;">Bonne réponse : </span><strong style="color:#16a34a;">${corrLabel}</strong></div>`;
  } else if (c.type === 'short_answer') {
    const userAns = c.userAnswer ? `"${c.userAnswer}"` : 'Non répondu';
    answerDetails = `<div style="font-size:0.82rem;"><span style="color:#64748b;">Votre réponse : </span><strong style="color:${c.isCorrect?'#16a34a':'#dc2626'};">${userAns}</strong> · <span style="color:#64748b;">Attendu : </span><strong style="color:#16a34a;">${c.correctAnswer}</strong></div>`;
  }

  return `<div style="background:${bg};border:1.5px solid ${border};border-radius:14px;padding:1rem 1.1rem;margin-bottom:0.75rem;">
    <div style="display:flex;align-items:flex-start;gap:0.65rem;margin-bottom:0.6rem;">
      <div style="flex-shrink:0;margin-top:2px;">${icon}</div>
      <div style="flex:1;">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.3rem;flex-wrap:wrap;">
          <span style="font-size:0.7rem;font-weight:700;color:#64748b;">Q${i+1}</span>
          <span style="font-size:0.68rem;color:#94A3B8;">${typeLabel[c.type]||c.type}</span>
          <span style="font-size:0.7rem;font-weight:700;color:${c.isCorrect?'#16a34a':'#dc2626'};">${c.pointsEarned}/${c.maxPoints} pt${c.maxPoints>1?'s':''}</span>
        </div>
        <div style="font-size:0.88rem;font-weight:600;color:#1e293b;line-height:1.4;margin-bottom:0.6rem;">${c.questionText}</div>
        ${answerDetails}
      </div>
    </div>
    ${c.explanation ? `<div style="background:rgba(255,255,255,0.6);border-radius:9px;padding:0.6rem 0.8rem;font-size:0.8rem;color:#475569;border-left:3px solid #2d6a4f;margin-top:0.5rem;"><strong style="color:#2d6a4f;">Explication : </strong>${c.explanation}</div>` : ''}
  </div>`;
}

function closeAssessResults() {
  const overlay = document.getElementById('assess-results-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
  assessState.currentAssessmentId = null;
  assessState.currentAttemptId = null;
  if (document.getElementById('sec-assessments-content')) renderStudentAssessments();
}

function closeAssessTake() {
  clearInterval(assessState.timerInterval);
  clearInterval(assessState.autoSaveTimer);
  autoSaveDraft();
  document.getElementById('assess-take-overlay').style.display = 'none';
  document.getElementById('assess-confirm-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

// ── TRAINER RESULTS VIEW ──────────────────────────────────
function openAssessTrainerResults(assessmentId) {
  const a = getAssessment(assessmentId);
  if (!a) return;
  const overlay = document.getElementById('assess-trainer-results-overlay');
  if (!overlay) return;

  const attempts = getAttempts().filter(at => at.assessmentId === assessmentId && at.status === 'submitted')
    .sort((a,b) => (b.submittedAt||0) - (a.submittedAt||0));

  const totalUsers = attempts.length;
  const passed = attempts.filter(at => at.passed).length;
  const avgScore = totalUsers ? Math.round(attempts.reduce((s,at) => s + at.percentage, 0) / totalUsers) : 0;
  const passRate = totalUsers ? Math.round((passed / totalUsers) * 100) : 0;

  // Question difficulty analysis
  const qDifficulty = (a.questions || []).map(q => {
    const qAttempts = attempts.filter(at => at.corrections?.find(c => c.questionId === q.id));
    const qCorrect = qAttempts.filter(at => at.corrections?.find(c => c.questionId === q.id && c.isCorrect)).length;
    const rate = qAttempts.length ? Math.round((qCorrect / qAttempts.length) * 100) : null;
    return { q, rate, correct: qCorrect, total: qAttempts.length };
  }).sort((a,b) => (a.rate||100) - (b.rate||100));

  overlay.querySelector('#assess-tr-content').innerHTML = `
    <div style="max-width:800px;margin:0 auto;">
      <div style="font-size:1.15rem;font-weight:800;color:#1e293b;margin-bottom:0.25rem;">${a.title}</div>
      <div style="font-size:0.82rem;color:#94A3B8;margin-bottom:1.5rem;">${totalUsers} soumission${totalUsers>1?'s':''}</div>

      <!-- Stats globales -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:0.85rem;margin-bottom:1.5rem;">
        ${[
          { label:'Soumissions', val:totalUsers, color:'#2563eb' },
          { label:'Taux de réussite', val:passRate+'%', color:'#16a34a' },
          { label:'Score moyen', val:avgScore+'%', color:'#d97706' },
          { label:'Admis', val:passed, color:'#16a34a' },
        ].map(s => `<div style="background:#fff;border-radius:12px;padding:1rem;border:1px solid #e2e8f0;text-align:center;">
          <div style="font-size:1.4rem;font-weight:800;color:${s.color};">${s.val}</div>
          <div style="font-size:0.72rem;color:#94A3B8;">${s.label}</div>
        </div>`).join('')}
      </div>

      <!-- Export -->
      <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;">
        <button onclick="exportAssessCSV('${assessmentId}')" style="padding:0.6rem 1rem;background:#f0fdf4;border:1.5px solid #86efac;border-radius:9px;font-size:0.8rem;font-weight:700;color:#16a34a;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:0.4rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exporter Excel/CSV
        </button>
        <button onclick="printTrainerResults('${assessmentId}')" style="padding:0.6rem 1rem;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:9px;font-size:0.8rem;font-weight:700;color:#2563eb;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:0.4rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Exporter PDF
        </button>
      </div>

      <!-- Questions difficiles -->
      ${qDifficulty.length ? `
      <div style="background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;margin-bottom:1.5rem;">
        <div style="padding:0.85rem 1.1rem;border-bottom:1px solid #f1f5f9;font-size:0.88rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:0.5rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Questions les plus difficiles
        </div>
        ${qDifficulty.slice(0,5).map((item,i) => `
          <div style="display:flex;align-items:center;gap:0.85rem;padding:0.7rem 1.1rem;border-bottom:1px solid #f8fafc;">
            <span style="width:24px;height:24px;background:#fff5e6;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#d97706;flex-shrink:0;">${i+1}</span>
            <div style="flex:1;min-width:0;"><div style="font-size:0.8rem;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.q.text}</div></div>
            <div style="text-align:right;flex-shrink:0;">
              <div style="font-size:0.85rem;font-weight:700;color:${(item.rate||0)<50?'#dc2626':(item.rate||0)<70?'#d97706':'#16a34a'};">${item.rate!==null?item.rate+'%':'–'}</div>
              <div style="font-size:0.65rem;color:#94A3B8;">${item.correct}/${item.total} corrects</div>
            </div>
          </div>`).join('')}
      </div>` : ''}

      <!-- Tableau résultats apprenants -->
      <div style="background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
        <div style="padding:0.85rem 1.1rem;border-bottom:1px solid #f1f5f9;font-size:0.88rem;font-weight:700;color:#1e293b;">Résultats par apprenant</div>
        ${attempts.length ? `
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:0.82rem;">
            <thead><tr style="background:#f8fafc;">
              <th style="text-align:left;padding:0.6rem 1rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Apprenant</th>
              <th style="text-align:center;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Score</th>
              <th style="text-align:center;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Note/20</th>
              <th style="text-align:center;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">%</th>
              <th style="text-align:center;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Statut</th>
              <th style="text-align:center;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Tentative</th>
              <th style="text-align:center;padding:0.6rem 0.75rem;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Date</th>
            </tr></thead>
            <tbody>
              ${attempts.map(at => `<tr style="border-bottom:1px solid #f8fafc;">
                <td style="padding:0.65rem 1rem;color:#1e293b;font-weight:500;">${at.userName||'–'}</td>
                <td style="padding:0.65rem 0.75rem;text-align:center;color:#1e293b;">${at.score}/${at.maxScore}</td>
                <td style="padding:0.65rem 0.75rem;text-align:center;font-weight:700;color:#1e293b;">${at.note20}</td>
                <td style="padding:0.65rem 0.75rem;text-align:center;font-weight:700;color:${at.percentage>=70?'#16a34a':at.percentage>=50?'#d97706':'#dc2626'};">${at.percentage}%</td>
                <td style="padding:0.65rem 0.75rem;text-align:center;"><span style="background:${at.passed?'#dcfce7':'#fee2e2'};color:${at.passed?'#16a34a':'#dc2626'};border-radius:50px;padding:0.15rem 0.55rem;font-size:0.7rem;font-weight:700;">${at.passed?'Admis':'Échec'}</span></td>
                <td style="padding:0.65rem 0.75rem;text-align:center;color:#64748b;">${at.attemptNumber||1}</td>
                <td style="padding:0.65rem 0.75rem;text-align:center;color:#94A3B8;font-size:0.75rem;">${at.submittedAt?new Date(at.submittedAt).toLocaleDateString('fr-FR'):''}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>` : '<div style="padding:2rem;text-align:center;color:#94A3B8;font-size:0.85rem;">Aucune soumission pour le moment.</div>'}
      </div>
    </div>`;

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAssessTrainerResults() {
  const overlay = document.getElementById('assess-trainer-results-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// ── STUDENT HISTORY ───────────────────────────────────────
function openStudentAssessHistory(assessmentId) {
  const a = getAssessment(assessmentId);
  if (!a) return;
  const myAttempts = getAttempts().filter(at => at.userId === auth.userId && at.assessmentId === assessmentId && at.status === 'submitted')
    .sort((x,y) => (y.submittedAt||0) - (x.submittedAt||0));

  const overlay = document.getElementById('assess-history-overlay');
  if (!overlay) return;
  overlay.querySelector('#assess-hist-content').innerHTML = `
    <div style="font-size:1rem;font-weight:700;color:#1e293b;margin-bottom:1.25rem;">${a.title} — Historique</div>
    ${myAttempts.map((at,i) => `
    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:0.85rem 1rem;margin-bottom:0.6rem;display:flex;align-items:center;gap:0.85rem;">
      <div style="width:36px;height:36px;border-radius:10px;background:${at.passed?'#f0fdf4':'#fef2f2'};border:1.5px solid ${at.passed?'#86efac':'#fecaca'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        ${at.passed?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}
      </div>
      <div style="flex:1;">
        <div style="font-size:0.85rem;font-weight:600;color:#1e293b;">Tentative ${at.attemptNumber||i+1}</div>
        <div style="font-size:0.73rem;color:#94A3B8;">${at.submittedAt?new Date(at.submittedAt).toLocaleString('fr-FR'):''}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1rem;font-weight:800;color:${at.passed?'#16a34a':'#dc2626'};">${at.percentage}%</div>
        <div style="font-size:0.72rem;color:#94A3B8;">${at.note20}/20 · ${at.score}/${at.maxScore} pts</div>
      </div>
      <button onclick="showAssessResults('${at.id}')" style="padding:0.4rem 0.7rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:0.73rem;font-weight:600;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;flex-shrink:0;">Détail</button>
    </div>`).join('')}`;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAssessHistory() {
  const overlay = document.getElementById('assess-history-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

// ── ADMIN STATS ───────────────────────────────────────────
function renderAdminAssessStats() {
  const el = document.getElementById('admin-assess-stats');
  if (!el) return;
  const assessments = getAssessments();
  const attempts = getAttempts().filter(a => a.status === 'submitted');
  const passedCount = attempts.filter(a => a.passed).length;
  const avgGlobal = attempts.length ? Math.round(attempts.reduce((s,a) => s+a.percentage, 0) / attempts.length) : 0;

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.85rem;margin-bottom:1.5rem;">
      ${[
        {label:'Évaluations', val:assessments.length, col:'#2563eb'},
        {label:'Soumissions', val:attempts.length, col:'#7c3aed'},
        {label:'Taux de réussite', val:attempts.length?Math.round(passedCount/attempts.length*100)+'%':'–', col:'#16a34a'},
        {label:'Score moyen', val:avgGlobal+'%', col:'#d97706'},
      ].map(s=>`<div style="background:#fff;border-radius:12px;padding:1rem;border:1px solid #e2e8f0;text-align:center;">
        <div style="font-size:1.4rem;font-weight:800;color:${s.col};">${s.val}</div>
        <div style="font-size:0.72rem;color:#94A3B8;">${s.label}</div>
      </div>`).join('')}
    </div>
    <div style="background:#fff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
      <div style="padding:0.85rem 1.1rem;border-bottom:1px solid #f1f5f9;font-size:0.88rem;font-weight:700;color:#1e293b;">Toutes les évaluations</div>
      ${assessments.length ? assessments.map(a => {
        const aAttempts = attempts.filter(at => at.assessmentId === a.id);
        const aPass = aAttempts.filter(at => at.passed).length;
        const aAvg = aAttempts.length ? Math.round(aAttempts.reduce((s,at)=>s+at.percentage,0)/aAttempts.length) : null;
        return `<div style="display:flex;align-items:center;gap:0.85rem;padding:0.75rem 1.1rem;border-bottom:1px solid #f8fafc;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.85rem;font-weight:600;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.title}</div>
            <div style="font-size:0.72rem;color:#94A3B8;">${aAttempts.length} soumissions · ${aPass} admis</div>
          </div>
          ${aAvg!==null?`<div style="font-size:0.9rem;font-weight:700;color:${aAvg>=70?'#16a34a':aAvg>=50?'#d97706':'#dc2626'};">${aAvg}%</div>`:'<div style="font-size:0.8rem;color:#94A3B8;">–</div>'}
          <button onclick="openAssessTrainerResults('${a.id}')" style="padding:0.35rem 0.7rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:7px;font-size:0.73rem;font-weight:600;color:#2563eb;cursor:pointer;font-family:'DM Sans',sans-serif;">Voir</button>
        </div>`;
      }).join('') : '<div style="padding:2rem;text-align:center;color:#94A3B8;font-size:0.85rem;">Aucune évaluation créée.</div>'}
    </div>`;
}

// ── EXPORTS ───────────────────────────────────────────────
function exportAssessCSV(assessmentId) {
  const a = getAssessment(assessmentId);
  if (!a) return;
  const attempts = getAttempts().filter(at => at.assessmentId === assessmentId && at.status === 'submitted');

  const header = ['Apprenant', 'Score', 'Max Points', 'Note/20', 'Note/100', 'Résultat', 'Tentative', 'Date'];
  const rows = attempts.map(at => [
    at.userName||'',
    at.score,
    at.maxScore,
    at.note20,
    at.note100,
    at.passed ? 'Admis' : 'Échoué',
    at.attemptNumber||1,
    at.submittedAt ? new Date(at.submittedAt).toLocaleString('fr-FR') : ''
  ]);

  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resultats_${a.title.replace(/\s+/g,'_')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showNotif('Export CSV téléchargé.', 'success');
}

function printAssessResults(attemptId) {
  const attempt = getAttempt(attemptId);
  const a = getAssessment(attempt?.assessmentId);
  if (!attempt || !a) return;

  const { percentage, note20, score, maxScore, passed, corrections, userName } = attempt;

  const win = window.open('', '_blank');
  const correctionsHtml = (corrections || []).map((c,i) => {
    const typeL = {mcq_single:'QCM',mcq_multiple:'QCM multiple',true_false:'Vrai/Faux',short_answer:'Réponse courte'};
    let ansHtml = '';
    if (c.type === 'mcq_single' || c.type === 'mcq_multiple') {
      const opts = c.options || [];
      const corrArr = Array.isArray(c.correctAnswer) ? c.correctAnswer : [c.correctAnswer];
      const userArr = Array.isArray(c.userAnswer) ? c.userAnswer : (c.userAnswer !== undefined ? [c.userAnswer] : []);
      ansHtml = opts.map((opt,idx) => {
        const isC = corrArr.includes(idx);
        const isU = userArr.includes(idx);
        return `<div style="padding:3px 0;color:${isC?'green':isU?'red':'#555'};">${isC?'✓':isU?'✗':'○'} ${opt}</div>`;
      }).join('');
    } else if (c.type === 'true_false') {
      ansHtml = `<div>Votre réponse: ${c.userAnswer===true?'Vrai':'Faux'} | Bonne réponse: ${c.correctAnswer===true?'Vrai':'Faux'}</div>`;
    } else {
      ansHtml = `<div>Votre réponse: "${c.userAnswer||''}" | Attendu: ${c.correctAnswer}</div>`;
    }
    return `<div style="margin-bottom:12px;padding:10px;border:1px solid ${c.isCorrect?'#86efac':'#fca5a5'};border-radius:8px;background:${c.isCorrect?'#f0fdf4':'#fef2f2'};">
      <div style="font-weight:700;margin-bottom:6px;">Q${i+1} · ${typeL[c.type]} · ${c.pointsEarned}/${c.maxPoints} pts — ${c.isCorrect?'✓ Correct':'✗ Incorrect'}</div>
      <div style="margin-bottom:6px;">${c.questionText}</div>
      <div style="font-size:13px;color:#555;">${ansHtml}</div>
      ${c.explanation?`<div style="margin-top:8px;font-size:12px;color:#2d6a4f;border-left:3px solid #2d6a4f;padding-left:8px;"><strong>Explication:</strong> ${c.explanation}</div>`:''}
    </div>`;
  }).join('');

  win.document.write(`<!DOCTYPE html><html><head><title>Résultat — ${a.title}</title>
  <style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:20px;color:#1e293b;}h1{color:#1e3a5f;}@media print{.no-print{display:none!important;}}</style></head><body>
  <div style="text-align:center;background:linear-gradient(135deg,#1e3a5f,#2d6a4f);color:#fff;padding:24px;border-radius:12px;margin-bottom:24px;">
    <h1 style="margin:0;color:#fff;">${a.title}</h1>
    <p style="margin:8px 0 0;opacity:0.8;">${userName||'Apprenant'} · ${new Date(attempt.submittedAt||Date.now()).toLocaleDateString('fr-FR')}</p>
    <div style="display:flex;justify-content:center;gap:32px;margin-top:16px;">
      <div><div style="font-size:2rem;font-weight:900;">${percentage}%</div><div style="font-size:12px;opacity:0.7;">Pourcentage</div></div>
      <div><div style="font-size:2rem;font-weight:900;">${note20}/20</div><div style="font-size:12px;opacity:0.7;">Note</div></div>
      <div><div style="font-size:2rem;font-weight:900;">${score}/${maxScore}</div><div style="font-size:12px;opacity:0.7;">Points</div></div>
      <div><div style="font-size:2rem;font-weight:900;color:${passed?'#86efac':'#f87171'};">${passed?'ADMIS':'ÉCHEC'}</div><div style="font-size:12px;opacity:0.7;">Résultat</div></div>
    </div>
  </div>
  <h2>Corrigé détaillé</h2>
  ${correctionsHtml}
  <div class="no-print" style="text-align:center;margin-top:24px;"><button onclick="window.print()" style="padding:10px 24px;background:#1e3a5f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:15px;">Imprimer / Sauvegarder PDF</button></div>
  </body></html>`);
  win.document.close();
}

function printTrainerResults(assessmentId) {
  const a = getAssessment(assessmentId);
  if (!a) return;
  const attempts = getAttempts().filter(at => at.assessmentId === assessmentId && at.status === 'submitted');
  const avgScore = attempts.length ? Math.round(attempts.reduce((s,at)=>s+at.percentage,0)/attempts.length) : 0;
  const passed = attempts.filter(at=>at.passed).length;

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>Résultats — ${a.title}</title>
  <style>body{font-family:Arial,sans-serif;max-width:900px;margin:0 auto;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;}th{background:#f8fafc;font-weight:600;}</style></head><body>
  <h1>${a.title} — Résultats</h1>
  <p>Généré le ${new Date().toLocaleString('fr-FR')}</p>
  <div style="display:flex;gap:24px;margin:16px 0;">
    <div><strong>${attempts.length}</strong> soumissions</div>
    <div><strong>${passed}</strong> admis</div>
    <div><strong>${attempts.length?Math.round(passed/attempts.length*100):0}%</strong> taux de réussite</div>
    <div><strong>${avgScore}%</strong> score moyen</div>
  </div>
  <table><thead><tr><th>Apprenant</th><th>Score</th><th>Note/20</th><th>%</th><th>Résultat</th><th>Date</th></tr></thead><tbody>
  ${attempts.map(at=>`<tr><td>${at.userName||'–'}</td><td>${at.score}/${at.maxScore}</td><td>${at.note20}</td><td>${at.percentage}%</td><td style="color:${at.passed?'green':'red'};font-weight:700;">${at.passed?'Admis':'Échec'}</td><td>${at.submittedAt?new Date(at.submittedAt).toLocaleDateString('fr-FR'):''}</td></tr>`).join('')}
  </tbody></table>
  <div style="text-align:center;margin-top:24px;"><button onclick="window.print()" style="padding:10px 24px;background:#1e3a5f;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:15px;">Imprimer / PDF</button></div>
  </body></html>`);
  win.document.close();
}

// ── CERTIFICATE ───────────────────────────────────────────
function generateCertificate(attemptId) {
  const attempt = getAttempt(attemptId);
  const a = getAssessment(attempt?.assessmentId);
  if (!attempt || !a) return;

  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html><html><head><title>Certificat</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body{margin:0;padding:0;background:#f0f4f8;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'DM Sans',sans-serif;}
    .cert{background:#fff;border:8px solid #C9A84C;border-radius:24px;padding:56px 64px;max-width:760px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.15);position:relative;}
    .cert::before{content:'';position:absolute;inset:12px;border:2px solid rgba(201,168,76,0.3);border-radius:16px;pointer-events:none;}
    h1{font-family:'Playfair Display',serif;font-size:2.8rem;color:#1e3a5f;margin:0 0 8px;}
    .subtitle{color:#94A3B8;font-size:0.9rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:40px;}
    .name{font-family:'Playfair Display',serif;font-size:2rem;color:#C9A84C;border-bottom:2px solid #C9A84C;display:inline-block;padding-bottom:4px;margin:16px 0 24px;}
    .score-box{background:linear-gradient(135deg,#1e3a5f,#2d6a4f);color:#fff;border-radius:16px;padding:20px 32px;display:inline-flex;gap:40px;margin:20px 0;}
    .score-item{text-align:center;}
    .score-val{font-size:2rem;font-weight:900;}
    .score-lbl{font-size:0.7rem;opacity:0.7;text-transform:uppercase;letter-spacing:0.08em;}
    .badge{font-size:4rem;margin-bottom:8px;}
    @media print{body{background:#fff;}.no-print{display:none!important;}}
  </style></head><body>
  <div class="cert">
    <div class="badge">🏆</div>
    <h1>Certificat de Réussite</h1>
    <p class="subtitle">Les Cours Hermès — Formation Excellence</p>
    <p style="color:#555;">Décerné à</p>
    <div class="name">${attempt.userName||'Apprenant'}</div>
    <p style="color:#555;max-width:500px;margin:0 auto 20px;">pour avoir complété avec succès l'évaluation</p>
    <div style="font-size:1.3rem;font-weight:700;color:#1e3a5f;margin-bottom:20px;">${a.title}</div>
    <div class="score-box">
      <div class="score-item"><div class="score-val">${attempt.percentage}%</div><div class="score-lbl">Réussite</div></div>
      <div class="score-item"><div class="score-val">${attempt.note20}/20</div><div class="score-lbl">Note</div></div>
      <div class="score-item"><div class="score-val">${attempt.score}/${attempt.maxScore}</div><div class="score-lbl">Points</div></div>
    </div>
    <p style="color:#94A3B8;font-size:0.82rem;margin-top:20px;">${new Date(attempt.submittedAt||Date.now()).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</p>
    <div class="no-print" style="margin-top:24px;">
      <button onclick="window.print()" style="padding:10px 28px;background:linear-gradient(135deg,#1e3a5f,#2d6a4f);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-family:'DM Sans',sans-serif;">Imprimer le certificat</button>
    </div>
  </div></body></html>`);
  win.document.close();
}

// ── Render student assessment history in profile ──────────
function renderStudentAssessHistory() {
  const el = document.getElementById('profile-assess-history');
  if (!el) return;
  const myAttempts = getAttempts().filter(at => at.userId === auth.userId && at.status === 'submitted')
    .sort((a,b) => (b.submittedAt||0) - (a.submittedAt||0));
  if (!myAttempts.length) {
    el.innerHTML = '<div style="color:#94A3B8;font-size:0.82rem;text-align:center;padding:1rem;">Aucune évaluation soumise.</div>';
    return;
  }
  el.innerHTML = myAttempts.slice(0,10).map(at => {
    const a = getAssessment(at.assessmentId);
    return `<div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem;border-radius:10px;background:#fff;border:1px solid #e2e8f0;margin-bottom:0.45rem;">
      <div style="width:32px;height:32px;border-radius:8px;background:${at.passed?'#f0fdf4':'#fef2f2'};border:1px solid ${at.passed?'#86efac':'#fecaca'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.9rem;">${at.passed?'✓':'✗'}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:0.82rem;font-weight:600;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a?.title||'Évaluation'}</div>
        <div style="font-size:0.7rem;color:#94A3B8;">${at.submittedAt?new Date(at.submittedAt).toLocaleDateString('fr-FR'):''}</div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-size:0.9rem;font-weight:800;color:${at.passed?'#16a34a':'#dc2626'};">${at.percentage}%</div>
        <div style="font-size:0.68rem;color:#94A3B8;">${at.note20}/20</div>
      </div>
      <button onclick="showAssessResults('${at.id}')" style="padding:0.3rem 0.6rem;background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;font-size:0.7rem;color:#64748b;cursor:pointer;font-family:'DM Sans',sans-serif;">Voir</button>
    </div>`;
  }).join('');
}
