/* ══════════════════════════════════════════════════════════════
   HERMES KNOWLEDGE — MODULE COURS EN DIRECT
   WebRTC (PeerJS) · MediaRecorder · Chat · Présence automatique
   ══════════════════════════════════════════════════════════════ */

// ── Constantes IndexedDB pour enregistrements ──
const LIVE_DB_NAME    = 'hermes_live_recordings';
const LIVE_REC_STORE  = 'recordings';
const LIVE_POLL_MS    = 3000;   // intervalle de polling chat + présence
const LIVE_PRESENCE_THRESHOLD_MS = 10 * 60 * 1000; // 10 min → marqué présent

// ── État global du module live ──
const liveState = {
  sessionId:        null,
  role:             null,    // 'trainer' | 'student'
  peer:             null,    // instance PeerJS
  connections:      {},      // peerId → DataConnection
  calls:            {},      // remotePeerId → MediaConnection
  localStream:      null,    // flux caméra/micro
  screenStream:     null,    // flux partage d'écran
  recorder:         null,    // MediaRecorder
  recordedChunks:   [],
  recording:        false,
  camEnabled:       true,
  micEnabled:       true,
  screenSharing:    false,
  chatPollTimer:    null,
  presencePollTimer:null,
  sessionTimerInterval: null,
  sessionStartTs:   0,
  lastChatCount:    0,
  joinedAt:         0,
  markedPresent:    false,
  bannerDismissed:  false,
  // ── Document partagé ──
  pdfDoc:           null,   // objet pdf.js (formateur uniquement)
  docPages:         [],     // [{type:'image'|'html', dataUrl?:'', html?:''}]
  docCurrentPage:   0,
  docName:          '',
  docZoom:          1.0,
};

// ── État tableau blanc ──
const wbState = {
  active:       false,
  tool:         'pen',      // 'pen' | 'marker' | 'eraser'
  color:        '#ffffff',
  size:         4,
  drawing:      false,
  lastPt:       null,
  strokes:      [],         // pour replay
  currentStroke: [],
};

// ══════════════════════════════════════════
//  INDEXEDDB — Enregistrements vidéo live
// ══════════════════════════════════════════
function openLiveDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LIVE_DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(LIVE_REC_STORE);
    req.onsuccess  = () => resolve(req.result);
    req.onerror    = () => reject(req.error);
  });
}

async function saveLiveRecordingBlob(blobKey, blob) {
  const db = await openLiveDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIVE_REC_STORE, 'readwrite');
    tx.objectStore(LIVE_REC_STORE).put(blob, blobKey);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

async function getLiveRecordingBlob(blobKey) {
  const db = await openLiveDb();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(LIVE_REC_STORE, 'readonly');
    const req = tx.objectStore(LIVE_REC_STORE).get(blobKey);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror   = () => reject(req.error);
  });
}

async function deleteLiveRecordingBlob(blobKey) {
  const db = await openLiveDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(LIVE_REC_STORE, 'readwrite');
    tx.objectStore(LIVE_REC_STORE).delete(blobKey);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
  });
}

// ══════════════════════════════════════════
//  CHAT — stockage dans appData (synchronisé JSONBin)
// ══════════════════════════════════════════

function liveGetChat(sessionId) {
  try { return (appData.liveChats && appData.liveChats[sessionId]) || []; }
  catch(e) { return []; }
}

function liveSaveChat(sessionId, messages) {
  try {
    if (!appData.liveChats) appData.liveChats = {};
    appData.liveChats[sessionId] = messages;
    if (typeof _saveToJsonBin === "function") _saveToJsonBin();
  } catch(e) {}
}

function liveCleanupChat(sessionId) {
  try {
    if (appData.liveChats) delete appData.liveChats[sessionId];
  } catch(e) {}
}

// ══════════════════════════════════════════
//  UTILITAIRES
// ══════════════════════════════════════════
function genLiveId(prefix) {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,7);
}

function fmtLiveDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return h + 'h ' + String(m).padStart(2,'0') + 'min';
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function fmtLiveDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}

function initials(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

// Lire la session live active depuis localStorage (pour polling cross-tab)
function getActiveLiveSession() {
  try { return (appData.liveSessions || []).find(s => s.status === "active") || null; }
  catch(e) { return null; }
}

// ══════════════════════════════════════════
//  DÉMARRAGE — FORMATEUR
// ══════════════════════════════════════════
function openLiveStartModal() {
  if (!appData.liveSessions) appData.liveSessions = [];

  // Vérifier si une session est déjà active
  const existing = appData.liveSessions.find(s => s.status === 'active' && s.trainerId === auth.userId);
  if (existing) {
    showNotif('⚠️ Une session est déjà active. Utilisez "Terminer la session" pour la clore avant d\'en démarrer une nouvelle.', 'error');
    return;
  }

  // Remplir le sélecteur de cours
  const sel = document.getElementById('live-modal-course-select');
  if (sel) {
    sel.innerHTML = '<option value="">— Cours libre —</option>' +
      getTrainerCourses().map(c =>
        `<option value="${c.id}">${c.name}</option>`
      ).join('');
  }

  // Pré-remplir le titre avec la date
  const titleInput = document.getElementById('live-modal-title');
  if (titleInput) {
    const today = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    titleInput.value = 'Cours du ' + today;
  }

  document.getElementById('live-start-modal-overlay').classList.add('active');
}

function closeLiveStartModal() {
  document.getElementById('live-start-modal-overlay').classList.remove('active');
}

async function confirmStartLiveSession() {
  const titleEl  = document.getElementById('live-modal-title');
  const courseEl = document.getElementById('live-modal-course-select');
  const title    = titleEl ? titleEl.value.trim() : '';
  const courseId = courseEl ? courseEl.value : '';

  if (!title) { showNotif('⚠️ Veuillez saisir un titre pour la session.', 'error'); return; }

  closeLiveStartModal();

  const curTrainer = (appData.trainers || []).find(t => t.id === auth.userId);
  const course     = courseId ? (appData.courses || []).find(c => c.id === courseId) : null;
  const sessionId  = genLiveId('live');

  const session = {
    id:          sessionId,
    trainerId:   auth.userId,
    trainerName: curTrainer ? curTrainer.name : 'Formateur',
    courseId:    courseId || null,
    courseName:  title,
    status:      'active',
    startedAt:   Date.now(),
    endedAt:     null,
    peerId:      sessionId,
    attendees:   {},
    recordingId: null,
  };

  if (!appData.liveSessions) appData.liveSessions = [];
  appData.liveSessions.unshift(session);
  saveAppData(false);

  // Ouvrir la salle
  await openLiveRoom(sessionId, 'trainer');
}

// ══════════════════════════════════════════
//  REJOINDRE — ÉTUDIANT
// ══════════════════════════════════════════
async function studentJoinLiveSession(sessionId) {
  liveState.bannerDismissed = true;
  hideLiveStudentBanner();
  await openLiveRoom(sessionId, 'student');
}

// ══════════════════════════════════════════
//  OUVERTURE DE LA SALLE
// ══════════════════════════════════════════
async function openLiveRoom(sessionId, role) {
  liveState.sessionId   = sessionId;
  liveState.role        = role;
  liveState.camEnabled  = true;
  liveState.micEnabled  = true;
  liveState.screenSharing = false;
  liveState.recording   = false;
  liveState.recordedChunks = [];
  liveState.joinedAt    = Date.now();
  liveState.markedPresent = false;
  liveState.lastChatCount = 0;
  liveState.pdfDoc = null;
  liveState.docPages = [];
  liveState.docCurrentPage = 0;
  liveState.docName = '';
  liveState.docZoom = 1.0;
  wbState.strokes = [];
  wbState.active = false;
  wbState.drawing = false;

  // Afficher l'overlay
  const overlay = document.getElementById('live-room-overlay');
  overlay.classList.add('active');

  // Mettre à jour le titre
  const session = getLiveSessionById(sessionId);
  const titleEl = document.getElementById('live-session-title');
  if (titleEl) titleEl.textContent = session ? session.courseName : 'Cours en direct';

  updateLiveTopbarInfo();
  // Synchroniser depuis localStorage avant le premier rendu
  syncSessionFromStorage(sessionId);
  renderLiveParticipants();
  renderLiveChat();

  // Sur mobile : afficher le bouton d'accès au panneau (chat/participants)
  const toggleBtn = document.getElementById('live-panel-toggle-btn');
  if (toggleBtn) {
    toggleBtn.style.display = window.innerWidth <= 768 ? 'block' : 'none';
  }

  // Connecter l'audio/vidéo local
  showLiveConnecting(true);
  try {
    liveState.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  } catch(e) {
    try {
      liveState.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      liveState.camEnabled = false;
    } catch(e2) {
      liveState.localStream = null;
      liveState.camEnabled = false;
      liveState.micEnabled = false;
    }
  }

  // Afficher le flux local dans le PiP
  const localVid = document.getElementById('live-local-video');
  if (localVid && liveState.localStream) {
    localVid.srcObject = liveState.localStream;
    localVid.play().catch(()=>{});
    document.getElementById('live-local-pip').style.display = 'block';
  } else {
    document.getElementById('live-local-pip').style.display = 'none';
  }

  // Initialiser PeerJS
  await initPeer(sessionId, role);

  // Démarrer les intervalles
  startLiveTimers(sessionId, role);
  updateLiveControls();
  showLiveConnecting(false);

  // Enregistrement automatique pour le formateur
  if (role === 'trainer') {
    setTimeout(() => startLiveRecording(), 1500);
  }

  // Si étudiant : enregistrer la présence initiale
  if (role === 'student') {
    registerStudentJoin(sessionId);
  }
}

function getLiveSessionById(id) {
  try { return (appData.liveSessions || []).find(s => s.id === id) || null; }
  catch(e) { return null; }
}

// ══════════════════════════════════════════
//  PEERJS — Initialisation WebRTC
// ══════════════════════════════════════════
async function initPeer(sessionId, role) {
  return new Promise((resolve) => {
    try {
      // Le formateur prend comme peerId le sessionId
      // Les étudiants obtiennent un ID aléatoire
      const myPeerId = role === 'trainer' ? sessionId : undefined;

      const peer = new Peer(myPeerId, {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        }
      });

      liveState.peer = peer;

      peer.on('open', (id) => {
        console.log('[Live] Peer ouvert, ID:', id);

        if (role === 'student') {
          // Appeler le formateur
          callTrainer(sessionId);
        }
        resolve();
      });

      peer.on('call', (call) => {
        // Le formateur répond aux appels entrants des étudiants
        if (role === 'trainer') {
          call.answer(liveState.localStream || new MediaStream());
          handleIncomingCall(call);
        }
      });

      peer.on('connection', (conn) => {
        conn.on('open', () => {
          // Envoyer la page courante du document au nouvel étudiant
          if (liveState.docPages.length && liveState.docPages[liveState.docCurrentPage]) {
            try {
              conn.send({
                type: 'doc-page-data',
                pageData: liveState.docPages[liveState.docCurrentPage],
                pageNum:  liveState.docCurrentPage,
                total:    liveState.docPages.length,
                name:     liveState.docName,
              });
            } catch(e) {}
          }
          // Envoyer les traits du tableau blanc
          if (wbState.strokes.length) {
            try { conn.send({ type: 'wb-init', strokes: wbState.strokes }); } catch(e) {}
          }
        });
        conn.on('data', (data) => handlePeerData(data));
        liveState.connections[conn.peer] = conn;
      });

      peer.on('error', (err) => {
        console.warn('[Live] PeerJS error:', err.type, err.message);
        if (err.type === 'unavailable-id') {
          showNotif('⚠️ Session déjà en cours par un autre formateur.', 'error');
        }
        resolve(); // continuer même en cas d'erreur
      });

      // Timeout de 8 secondes si pas de réponse
      setTimeout(resolve, 8000);

    } catch(e) {
      console.warn('[Live] PeerJS non disponible:', e);
      showNotif('ℹ️ Mode hors-ligne activé (WebRTC non disponible).', '');
      resolve();
    }
  });
}

function callTrainer(sessionId) {
  if (!liveState.peer) return;
  try {
    const call = liveState.peer.call(sessionId, liveState.localStream || new MediaStream());
    if (!call) return;
    handleOutgoingCall(call);
    liveState.calls[sessionId] = call;

    // Connexion données pour le chat temps réel
    const conn = liveState.peer.connect(sessionId);
    if (conn) {
      conn.on('open', () => { liveState.connections[sessionId] = conn; });
      conn.on('data', (data) => handlePeerData(data));
    }
  } catch(e) { console.warn('[Live] Erreur appel formateur:', e); }
}

function handleOutgoingCall(call) {
  call.on('stream', (remoteStream) => {
    // Étudiant reçoit le flux du formateur
    const mainVid = document.getElementById('live-main-video');
    if (mainVid) {
      mainVid.srcObject = remoteStream;
      mainVid.play().catch(()=>{});
    }
    document.getElementById('live-no-video-msg').style.display = 'none';
  });
  call.on('close', () => handleSessionEnded());
  call.on('error', (e) => console.warn('[Live] Call error:', e));
}

function handleIncomingCall(call) {
  const peerId = call.peer;
  call.on('stream', (remoteStream) => {
    addStudentVideoTile(peerId, remoteStream);
  });
  call.on('close', () => removeStudentVideoTile(peerId));
  liveState.calls[peerId] = call;
  updateParticipantsCountDisplay();
}

function addStudentVideoTile(peerId, stream) {
  const strip = document.getElementById('live-student-strip');
  if (!strip) return;

  let tile = document.getElementById('live-tile-' + peerId);
  if (!tile) {
    tile = document.createElement('div');
    tile.className = 'live-student-tile';
    tile.id = 'live-tile-' + peerId;
    tile.innerHTML = `
      <video autoplay playsinline></video>
      <div class="live-student-tile-online"></div>
      <div class="live-student-tile-label">Étudiant</div>
    `;
    strip.appendChild(tile);
  }

  const vid = tile.querySelector('video');
  if (vid) { vid.srcObject = stream; vid.play().catch(()=>{}); }
}

function removeStudentVideoTile(peerId) {
  const tile = document.getElementById('live-tile-' + peerId);
  if (tile) tile.remove();
  delete liveState.calls[peerId];
  updateParticipantsCountDisplay();
}

function handlePeerData(data) {
  if (!data || !data.type) return;
  if (data.type === 'chat') {
    const msgs = liveGetChat(liveState.sessionId);
    msgs.push(data.msg);
    liveSaveChat(liveState.sessionId, msgs);
    renderLiveChat();
  } else if (data.type === 'session-end') {
    handleSessionEnded();
  } else if (data.type === 'doc-page-data') {
    _receiveDocPageData(data);
  } else if (data.type === 'doc-page') {
    if (typeof data.pageNum === 'number' && liveState.docPages[data.pageNum]) {
      liveState.docCurrentPage = data.pageNum;
      liveDocShowCurrent();
    }
  } else if (data.type === 'doc-close') {
    liveState.docPages = [];
    liveState.docCurrentPage = 0;
    liveState.docName = '';
    const area = document.getElementById('live-doc-view-area');
    const vw   = document.getElementById('live-main-video-wrapper');
    if (area) area.classList.remove('active');
    if (vw)   vw.style.display = '';
    renderLiveDocsList();
  } else if (data.type === 'wb-seg') {
    // Segment en temps réel : dessiner immédiatement sans attendre la fin du trait
    if (data.seg) _receiveWbSeg(data.seg);
  } else if (data.type === 'wb-stroke') {
    if (data.stroke) _receiveWbStroke(data.stroke);
  } else if (data.type === 'wb-init') {
    wbState.strokes = data.strokes || [];
    if (wbState.strokes.length) {
      const canvas = document.getElementById('live-whiteboard-canvas');
      if (canvas) {
        _ensureWbCanvas(canvas);
        _redrawWb();
      }
    }
  } else if (data.type === 'wb-clear') {
    wbState.strokes = [];
    const canvas = document.getElementById('live-whiteboard-canvas');
    if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
  } else if (data.type === 'wb-toggle') {
    const canvas = document.getElementById('live-whiteboard-canvas');
    if (!canvas) return;
    if (data.active) {
      _ensureWbCanvas(canvas);
      _redrawWb();
    } else {
      canvas.classList.remove('active', 'view-only');
    }
  }
}

// ══════════════════════════════════════════
//  ENREGISTREMENT — MediaRecorder
// ══════════════════════════════════════════
function startLiveRecording() {
  if (!liveState.localStream || liveState.recording) return;
  try {
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : '';

    const options = mimeType ? { mimeType } : {};
    liveState.recorder = new MediaRecorder(liveState.localStream, options);
    liveState.recordedChunks = [];

    liveState.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) liveState.recordedChunks.push(e.data);
    };

    liveState.recorder.onstop = onRecordingStopped;
    liveState.recorder.start(2000); // chunk toutes les 2s
    liveState.recording = true;
    updateLiveControls();
    showNotif('⏺ Enregistrement démarré automatiquement.', '');
  } catch(e) {
    console.warn('[Live] MediaRecorder non disponible:', e);
  }
}

function stopLiveRecording() {
  if (liveState.recorder && liveState.recording) {
    liveState.recorder.stop();
    liveState.recording = false;
    updateLiveControls();
  }
}

async function onRecordingStopped() {
  if (!liveState.recordedChunks.length) return;
  try {
    const blob    = new Blob(liveState.recordedChunks, { type: 'video/webm' });
    const blobKey = 'liveRec_' + liveState.sessionId;
    await saveLiveRecordingBlob(blobKey, blob);

    const session = (appData.liveSessions || []).find(s => s.id === liveState.sessionId);
    const durationSec = session
      ? Math.round((Date.now() - session.startedAt) / 1000)
      : 0;

    if (!appData.liveRecordings) appData.liveRecordings = [];
    const existing = appData.liveRecordings.find(r => r.sessionId === liveState.sessionId);
    if (!existing) {
      appData.liveRecordings.unshift({
        id:          genLiveId('rec'),
        sessionId:   liveState.sessionId,
        trainerId:   session ? session.trainerId : auth.userId,
        trainerName: session ? session.trainerName : 'Formateur',
        courseId:    session ? session.courseId   : null,
        courseName:  session ? session.courseName : 'Session',
        startedAt:   session ? session.startedAt  : Date.now(),
        duration:    durationSec,
        size:        blob.size,
        blobKey:     blobKey,
      });
    } else {
      existing.duration = durationSec;
      existing.size     = blob.size;
      existing.blobKey  = blobKey;
    }
    saveAppData(false);
    showNotif('✅ Enregistrement sauvegardé.', 'success');
  } catch(e) {
    console.error('[Live] Erreur sauvegarde enregistrement:', e);
    showNotif('⚠️ Erreur lors de la sauvegarde.', 'error');
  }
}

// ══════════════════════════════════════════
//  CONTRÔLES MÉDIA
// ══════════════════════════════════════════
function liveToggleCamera() {
  if (!liveState.localStream) return;
  const videoTracks = liveState.localStream.getVideoTracks();
  if (!videoTracks.length) return;
  liveState.camEnabled = !liveState.camEnabled;
  videoTracks.forEach(t => t.enabled = liveState.camEnabled);
  const localVid = document.getElementById('live-local-video');
  if (localVid) localVid.style.visibility = liveState.camEnabled ? 'visible' : 'hidden';
  updateLiveControls();
}

function liveToggleMic() {
  if (!liveState.localStream) return;
  const audioTracks = liveState.localStream.getAudioTracks();
  if (!audioTracks.length) return;
  liveState.micEnabled = !liveState.micEnabled;
  audioTracks.forEach(t => t.enabled = liveState.micEnabled);
  updateLiveControls();
}

async function liveToggleScreenShare() {
  if (liveState.screenSharing) {
    await liveStopScreenShare();
  } else {
    await liveStartScreenShare();
  }
}

async function liveStartScreenShare() {
  try {
    liveState.screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    liveState.screenSharing = true;

    const mainVid = document.getElementById('live-main-video');
    if (mainVid) {
      mainVid.srcObject = liveState.screenStream;
      mainVid.play().catch(()=>{});
    }

    // Remplacer le flux vidéo dans tous les appels actifs
    const videoTrack = liveState.screenStream.getVideoTracks()[0];
    Object.values(liveState.calls).forEach(call => {
      try {
        const sender = call.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
        if (sender) sender.replaceTrack(videoTrack);
      } catch(e) {}
    });

    liveState.screenStream.getVideoTracks()[0].onended = liveStopScreenShare;
    updateLiveControls();
    showNotif('🖥️ Partage d\'écran activé.', '');
  } catch(e) {
    if (e.name !== 'NotAllowedError') {
      showNotif('⚠️ Impossible de partager l\'écran.', 'error');
    }
  }
}

async function liveStopScreenShare() {
  if (!liveState.screenStream) return;
  liveState.screenStream.getTracks().forEach(t => t.stop());
  liveState.screenStream = null;
  liveState.screenSharing = false;

  // Remettre la caméra dans les appels
  const camTrack = liveState.localStream?.getVideoTracks()[0];
  Object.values(liveState.calls).forEach(call => {
    try {
      const sender = call.peerConnection?.getSenders().find(s => s.track?.kind === 'video');
      if (sender && camTrack) sender.replaceTrack(camTrack);
    } catch(e) {}
  });

  // Afficher la caméra locale dans la vidéo principale (formateur)
  if (liveState.role === 'trainer') {
    const mainVid = document.getElementById('live-main-video');
    if (mainVid && liveState.localStream) {
      mainVid.srcObject = liveState.localStream;
    }
  }

  updateLiveControls();
  showNotif('🖥️ Partage d\'écran arrêté.', '');
}

// ══════════════════════════════════════════
//  FIN DE SESSION
// ══════════════════════════════════════════
function liveEndOrLeave() {
  if (liveState.role === 'trainer') {
    if (!confirm('Mettre fin au cours en direct ? La session sera terminée pour tous les participants.')) return;
    endLiveSession();
  } else {
    if (!confirm('Quitter le cours en direct ?')) return;
    leaveSession();
  }
}

function endLiveSession() {
  // Arrêter l'enregistrement
  stopLiveRecording();

  // Mettre à jour la session
  const session = (appData.liveSessions || []).find(s => s.id === liveState.sessionId);
  if (session) {
    session.status  = 'ended';
    session.endedAt = Date.now();
  }
  saveAppData(false);

  // Diffuser la fin aux étudiants via DataConnections
  Object.values(liveState.connections).forEach(conn => {
    try { conn.send({ type: 'session-end' }); } catch(e) {}
  });

  cleanupLive();
  showNotif('✅ Session terminée. L\'enregistrement a été sauvegardé.', 'success');

  // Retourner à la vue "En direct"
  switchTrainerView('live');
}

function leaveSession() {
  cleanupLive();
  showNotif('👋 Vous avez quitté le cours.', '');
  goTo('splash');
}

function handleSessionEnded() {
  if (liveState.role === 'student') {
    cleanupLive();
    showNotif('📴 Le cours en direct est terminé.', '');
    goTo('splash');
  }
}

// ══════════════════════════════════════════
//  INTÉGRATION POINTAGE — Marquer la présence dans user.attendance[dateKey]
// ══════════════════════════════════════════
function markLivePresenceInPointage(sessionId) {
  try {
    const userId  = auth.userId;
    const userIdx = (appData.users || []).findIndex(u => u.id === userId);
    if (userIdx === -1) return;
    const user    = appData.users[userIdx];
    const session = (appData.liveSessions || []).find(s => s.id === sessionId);
    if (!session) return;
    const today   = new Date();
    const dateKey = today.getFullYear() + "-" +
      String(today.getMonth() + 1).padStart(2, "0") + "-" +
      String(today.getDate()).padStart(2, "0");
    if (!user.attendance)          user.attendance = {};
    if (!user.attendance[dateKey]) user.attendance[dateKey] = { sessions:[], activities:[], totalTime:0, courseAttendance:[] };
    const att = user.attendance[dateKey];
    if (!att.courseAttendance) att.courseAttendance = [];
    if (!att.courseAttendance.find(ca => ca.sessionId === sessionId)) {
      att.courseAttendance.push({
        sessionId:   sessionId,
        trainerId:   session.trainerId,
        trainerName: session.trainerName || "Formateur",
        label:       session.courseName  || "Cours en direct",
        type:        "live", status: "present", markedAt: Date.now(),
      });
    }
    att.totalTime = (att.totalTime || 0) + LIVE_PRESENCE_THRESHOLD_MS;
    if (!att.activities) att.activities = [];
    if (!att.activities.includes("live")) att.activities.push("live");
    appData.users[userIdx] = user;
    if (typeof _saveToJsonBin === "function") _saveToJsonBin();
    console.log("[Live] Pointage enregistré pour", user.name, "le", dateKey);
  } catch(e) { console.warn("[Live] Erreur markLivePresenceInPointage:", e); }
}

function cleanupLive() {
  // Arrêter les streams
  if (liveState.localStream)  { liveState.localStream.getTracks().forEach(t => t.stop()); liveState.localStream = null; }
  if (liveState.screenStream) { liveState.screenStream.getTracks().forEach(t => t.stop()); liveState.screenStream = null; }

  // Fermer les appels PeerJS
  Object.values(liveState.calls).forEach(call => { try { call.close(); } catch(e) {} });
  liveState.calls = {};
  Object.values(liveState.connections).forEach(conn => { try { conn.close(); } catch(e) {} });
  liveState.connections = {};
  if (liveState.peer) { try { liveState.peer.destroy(); } catch(e) {} liveState.peer = null; }

  // Arrêter les timers
  clearInterval(liveState.chatPollTimer);
  clearInterval(liveState.presencePollTimer);
  clearInterval(liveState.sessionTimerInterval);
  liveState.chatPollTimer = null;
  if (liveState.jsonbinSyncTimer) { clearInterval(liveState.jsonbinSyncTimer); liveState.jsonbinSyncTimer = null; }
  if (liveState.attendeeSaveTimer) { clearInterval(liveState.attendeeSaveTimer); liveState.attendeeSaveTimer = null; }
  liveState.presencePollTimer = null;
  liveState.sessionTimerInterval = null;
  // Réinitialiser document + tableau blanc
  liveState.pdfDoc = null;
  liveState.docPages = [];
  liveState.docCurrentPage = 0;
  liveState.docName = '';
  liveState.docZoom = 1.0;
  wbState.strokes = [];
  wbState.active = false;
  wbState.drawing = false;
  _wbHideTextInput();
  const wbCanvas = document.getElementById('live-whiteboard-canvas');
  if (wbCanvas) { wbCanvas.classList.remove('active','view-only'); try { const ctx=wbCanvas.getContext('2d'); ctx.clearRect(0,0,wbCanvas.width,wbCanvas.height); } catch(e){} }
  const wbToolbar = document.getElementById('live-wb-toolbar');
  if (wbToolbar) wbToolbar.classList.remove('active');
  const docArea = document.getElementById('live-doc-view-area');
  if (docArea) docArea.classList.remove('active');
  const vw = document.getElementById('live-main-video-wrapper');
  if (vw) vw.style.display = '';

  // Nettoyer le pulse en ligne (si étudiant)
  // On ne supprime PAS hermes_online_ car le système de présence classique
  // l'utilise aussi → on retire juste le flag liveSessionId
  if (auth.role === 'student' && auth.userId) {
    try {
      const existing = localStorage.getItem('hermes_online_' + auth.userId);
      if (existing) {
        const pulse = JSON.parse(existing);
        if (pulse.isLive) {
          // Remettre un pulse classique sans le flag live
          pulse.isLive        = false;
          pulse.liveSessionId = null;
          pulse.ts            = Date.now();
          localStorage.setItem('hermes_online_' + auth.userId, JSON.stringify(pulse));
        }
      }
    } catch(e) {}
  }

  // Fermer l'overlay
  const overlay = document.getElementById('live-room-overlay');
  if (overlay) overlay.classList.remove('active');

  liveState.sessionId = null;
  liveState.role = null;
}

// ══════════════════════════════════════════
//  CHAT
// ══════════════════════════════════════════
function liveSendChat() {
  const input = document.getElementById('live-chat-input');
  const text  = input ? input.value.trim() : '';
  if (!text || !liveState.sessionId) return;

  const name = auth.role === 'trainer'
    ? ((appData.trainers||[]).find(t=>t.id===auth.userId)||{}).name || 'Formateur'
    : auth.name || 'Étudiant';

  const msg = {
    id:     genLiveId('msg'),
    userId: auth.userId || auth.role,
    name:   name,
    role:   auth.role,
    text:   text,
    ts:     Date.now(),
  };

  // Sauvegarder dans localStorage
  const msgs = liveGetChat(liveState.sessionId);
  msgs.push(msg);
  liveSaveChat(liveState.sessionId, msgs);

  // Diffuser via DataConnections
  Object.values(liveState.connections).forEach(conn => {
    try { conn.send({ type: 'chat', msg }); } catch(e) {}
  });

  if (input) input.value = '';
  renderLiveChat();
}

function handleChatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); liveSendChat(); }
}

// ══════════════════════════════════════════
//  PRÉSENCE ÉTUDIANT
// ══════════════════════════════════════════
async function registerStudentJoin(sessionId) {
  const userId  = auth.userId;
  const userObj = (appData.users || []).find(u => u.id === userId);
  const userName = userObj ? userObj.name : (auth.name || 'Étudiant');

  updateStudentAttendee(sessionId, userId, {
    name:     userName,
    joinedAt: Date.now(),
    lastSeen: Date.now(),
    duration: 0,
    marked:   false,
  });

  refreshLiveOnlinePulse(sessionId, userName, userObj?.promotionId || '');

  // Merge-save immédiat : fusionne notre présence avec les autres étudiants déjà connectés
  await _saveLiveAttendeeMerge(sessionId, userId);
}

// Rafraîchit le pulse "en ligne" de l'étudiant avec la référence à la session live
function refreshLiveOnlinePulse(sessionId, userName, promotionId) {
  try {
    if (!auth.userId) return;
    localStorage.setItem('hermes_online_' + auth.userId, JSON.stringify({
      name:          userName || (appData.users||[]).find(u=>u.id===auth.userId)?.name || 'Étudiant',
      promotionId:   promotionId,
      sessionId:     null,         // session classique = null (c'est une session live)
      liveSessionId: sessionId,    // référence live
      isLive:        true,
      token:         Date.now(),
      ts:            Date.now(),
    }));
  } catch(e) {}
}

function updateStudentAttendee(sessionId, userId, data) {
  try {
    if (!appData.liveSessions) return;
    const session = appData.liveSessions.find(s => s.id === sessionId);
    if (!session) return;
    if (!session.attendees) session.attendees = {};
    session.attendees[userId] = Object.assign(session.attendees[userId] || {}, data);
    // Sauvegarder uniquement en local — JSONBin géré par _saveLiveAttendeeMerge
    try { localStorage.setItem("hermes_knowledge_data", JSON.stringify(appData)); } catch(e) {}
  } catch(e) {}
}

// Merge-save : lit JSONBin, fusionne notre entrée, puis sauvegarde
// → évite d'écraser les autres étudiants présents
async function _saveLiveAttendeeMerge(sessionId, userId) {
  try {
    const localSession = (appData.liveSessions || []).find(s => s.id === sessionId);
    const myAttendee  = localSession?.attendees?.[userId];
    if (!myAttendee) return;

    // Lire l'état actuel depuis JSONBin
    const res = await fetch(JSONBIN_URL + "/latest", { headers: { "X-Master-Key": JSONBIN_KEY } });
    if (res.ok) {
      const json  = await res.json();
      const fresh = json.record || json;
      if (fresh && Array.isArray(fresh.liveSessions)) {
        // Fusionner notre présence dans la session fraîche
        fresh.liveSessions = fresh.liveSessions.map(s => {
          if (s.id !== sessionId) return s;
          const merged = Object.assign({}, s.attendees || {});
          merged[userId] = Object.assign(merged[userId] || {}, myAttendee);
          return Object.assign({}, s, { attendees: merged });
        });
        appData.liveSessions = fresh.liveSessions;
        if (Array.isArray(fresh.users)) appData.users = fresh.users;
        try { localStorage.setItem("hermes_knowledge_data", JSON.stringify(appData)); } catch(e) {}
      }
    }
    if (typeof _saveToJsonBin === "function") _saveToJsonBin();
  } catch(e) {
    // En cas d'erreur réseau, sauvegarder quand même localement
    if (typeof _saveToJsonBin === "function") _saveToJsonBin();
  }
}

function tickStudentPresence() {
  if (!liveState.sessionId || liveState.role !== 'student') return;
  const now      = Date.now();
  const duration = Math.floor((now - liveState.joinedAt) / 1000);

  updateStudentAttendee(liveState.sessionId, auth.userId, { lastSeen: now, duration });

  // Rafraîchir le pulse en ligne toutes les 45 secondes
  if (duration % 45 === 0) {
    const userObj = (appData.users||[]).find(u=>u.id===auth.userId);
    refreshLiveOnlinePulse(liveState.sessionId, userObj?.name, userObj?.promotionId || '');
  }

  // Marquer présent après LIVE_PRESENCE_THRESHOLD_MS de connexion continue
  if (!liveState.markedPresent && (now - liveState.joinedAt) >= LIVE_PRESENCE_THRESHOLD_MS) {
    liveState.markedPresent = true;
    updateStudentAttendee(liveState.sessionId, auth.userId, { marked: true });
    markLivePresenceInPointage(liveState.sessionId); // ← intégration pointage
    showNotif('✅ Présence enregistrée pour ce cours.', 'success');

    // Afficher le badge "Présent" dans la section enregistrements
    const badge = document.getElementById('student-live-rec-badge');
    if (badge) { badge.textContent = 'NEW'; badge.style.display = 'inline-flex'; }
  }

  // Vérifier si la session a été terminée par le formateur
  const session = getLiveSessionById(liveState.sessionId);
  if (session && session.status === 'ended') {
    handleSessionEnded();
  }
}

// ══════════════════════════════════════════
//  TIMERS ET POLLING
// ══════════════════════════════════════════
function startLiveTimers(sessionId, role) {
  const session = getLiveSessionById(sessionId);
  liveState.sessionStartTs = session ? session.startedAt : Date.now();

  // Timer d'affichage (durée session)
  liveState.sessionTimerInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - liveState.sessionStartTs) / 1000);
    const el = document.getElementById('live-timer-display');
    if (el) el.textContent = fmtLiveDuration(secs);
  }, 1000);

  // Polling chat + présence (commun formateur ET étudiant)
  liveState.chatPollTimer = setInterval(() => {
    pollLiveChat();

    // Synchroniser la session depuis localStorage (les deux rôles)
    syncSessionFromStorage(sessionId);

    // Mettre à jour la liste des participants (visible pour TOUS)
    renderLiveParticipants();
    updateParticipantsCountDisplay();

    if (role === 'student') {
      tickStudentPresence();
    }
    if (role === 'trainer') {
      if (typeof renderTrainerLivePresenceBadge === 'function') renderTrainerLivePresenceBadge();
    }
  }, LIVE_POLL_MS);

  // Timer JSONBin : rafraîchir les participants toutes les 5 secondes pendant le live
  liveState.jsonbinSyncTimer = setInterval(async () => {
    await _refreshLiveFromJsonBin();
    renderLiveParticipants();
    updateParticipantsCountDisplay();
  }, 5000);

  // Pour les étudiants : merge-save toutes les 30s + pulse en ligne toutes les 45s
  if (role === 'student') {
    const userObj = (appData.users||[]).find(u=>u.id===auth.userId);
    refreshLiveOnlinePulse(sessionId, userObj?.name, userObj?.promotionId || '');
    liveState.presencePollTimer = setInterval(() => {
      const uObj = (appData.users||[]).find(u=>u.id===auth.userId);
      refreshLiveOnlinePulse(sessionId, uObj?.name, uObj?.promotionId || '');
    }, 45 * 1000);
    // Merge-save périodique pour maintenir la présence dans JSONBin sans conflit
    liveState.attendeeSaveTimer = setInterval(() => {
      if (liveState.sessionId && auth.userId) {
        _saveLiveAttendeeMerge(liveState.sessionId, auth.userId);
      }
    }, 30 * 1000);
  }
}

function pollLiveChat() {
  const msgs = liveGetChat(liveState.sessionId);
  if (msgs.length !== liveState.lastChatCount) {
    liveState.lastChatCount = msgs.length;
    renderLiveChat();
    const badge = document.getElementById('live-chat-badge');
    const chatPanel = document.getElementById('live-chat-panel');
    if (badge && chatPanel && !chatPanel.classList.contains('active')) {
      badge.textContent = msgs.length - liveState.lastChatCount + 1;
      badge.style.display = 'inline-flex';
    }
  }
}

function syncSessionFromStorage(sessionId) {
  // Données gérées via JSONBin - appData est mis à jour par _refreshLiveFromJsonBin()
}

// ══════════════════════════════════════════
//  RENDU UI — SALLE LIVE
// ══════════════════════════════════════════
function renderLiveParticipants() {
  const container = document.getElementById('live-participants-list');
  if (!container) return;

  const session = getLiveSessionById(liveState.sessionId);
  if (!session) { container.innerHTML = ''; return; }

  const attendees   = Object.entries(session.attendees || {});
  const trainerName = session.trainerName || 'Formateur';
  const ti          = initials(trainerName);
  const now         = Date.now();
  const myUserId    = auth.userId;
  const STALE_MS    = 3 * LIVE_POLL_MS * 4; // 36 secondes = considéré en ligne

  // Trier : moi en premier, puis en ligne, puis par heure de connexion
  const sorted = attendees.sort(([uidA, a],[uidB, b]) => {
    if (uidA === myUserId) return -1;
    if (uidB === myUserId) return 1;
    const aOnline = a.lastSeen && (now - a.lastSeen) < STALE_MS;
    const bOnline = b.lastSeen && (now - b.lastSeen) < STALE_MS;
    if (aOnline !== bOnline) return aOnline ? -1 : 1;
    return (a.joinedAt || 0) - (b.joinedAt || 0);
  });

  const onlineCount = sorted.filter(([,a]) => a.lastSeen && (now - a.lastSeen) < STALE_MS).length;

  let html = `
    <!-- Ligne formateur -->
    <div class="live-participant-item">
      <div class="live-participant-avatar trainer">${ti}</div>
      <div class="live-participant-info">
        <div class="live-participant-name">${escHtml(trainerName)}</div>
        <div class="live-participant-role">Formateur · Animateur</div>
      </div>
      <div class="live-participant-status" title="En ligne"></div>
    </div>
    <!-- Séparateur -->
    <div style="font-size:0.65rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.08em;padding:0.5rem 0.5rem 0.25rem;font-weight:700;">
      Étudiants (${onlineCount} en ligne / ${sorted.length} connectés)
    </div>`;

  if (!sorted.length) {
    html += `<div style="text-align:center;padding:1.5rem 0;color:rgba(255,255,255,0.3);font-size:0.78rem;">
      En attente de connexions…<br>
      <span style="font-size:0.65rem;opacity:0.6;">Les étudiants apparaîtront ici dès leur connexion</span>
    </div>`;
  } else {
    sorted.forEach(([uid, a]) => {
      const isMe     = uid === myUserId;
      const online   = a.lastSeen && (now - a.lastSeen) < STALE_MS;
      const init     = initials(a.name || 'Étudiant');
      const dur      = a.duration ? fmtLiveDuration(a.duration) : '0:00';
      const joinTime = a.joinedAt ? new Date(a.joinedAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) : '';
      const presenceProgress = a.duration
        ? Math.min(100, Math.round(a.duration / (LIVE_PRESENCE_THRESHOLD_MS/1000) * 100))
        : 0;

      // Afficher "Vous" si c'est l'utilisateur courant, sinon le vrai nom
      const displayName = isMe
        ? (escHtml(a.name || 'Étudiant') + ' <span style="font-size:0.6rem;background:rgba(34,197,94,0.25);color:#4ade80;border-radius:50px;padding:0.05rem 0.4rem;font-weight:800;">Vous</span>')
        : escHtml(a.name || 'Étudiant');

      html += `
        <div class="live-participant-item" style="flex-direction:column;align-items:stretch;padding:0.6rem 0.5rem;gap:0.35rem;${isMe ? 'background:rgba(34,197,94,0.06);border-radius:10px;' : ''}">
          <div style="display:flex;align-items:center;gap:0.65rem;">
            <div class="live-participant-avatar" style="position:relative;${isMe ? 'background:linear-gradient(135deg,#1d4ed8,#3b82f6);' : ''}">
              ${init}
              ${online ? '<span style="position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;background:#22C55E;border-radius:50%;border:1.5px solid #0d1420;"></span>' : ''}
            </div>
            <div class="live-participant-info" style="flex:1;">
              <div class="live-participant-name" style="font-weight:700;color:${online?'#fff':'rgba(255,255,255,0.5)'};">
                ${displayName}
              </div>
              <div class="live-participant-role" style="display:flex;align-items:center;gap:0.35rem;flex-wrap:wrap;">
                <span style="width:7px;height:7px;border-radius:50%;background:${online?'#22C55E':'#64748b'};flex-shrink:0;"></span>
                <span style="color:${online?'#4ade80':'rgba(255,255,255,0.35)'};font-size:0.65rem;">${online ? 'En ligne' : 'Hors ligne'}</span>
                ${joinTime ? '<span style="color:rgba(255,255,255,0.25);">·</span><span style="font-size:0.65rem;color:rgba(255,255,255,0.4);">Rejoint à ' + joinTime + '</span>' : ''}
                <span style="color:rgba(255,255,255,0.25);">·</span>
                <span style="font-size:0.65rem;color:rgba(255,255,255,0.4);">${dur}</span>
              </div>
            </div>
            ${a.marked
              ? '<span class="live-present-badge" style="background:rgba(34,197,94,0.3);color:#4ade80;font-size:0.62rem;padding:0.15rem 0.5rem;border-radius:50px;border:1px solid rgba(34,197,94,0.4);font-weight:800;white-space:nowrap;">✓ Présent</span>'
              : (presenceProgress > 0
                  ? `<span style="font-size:0.6rem;color:rgba(255,255,255,0.4);white-space:nowrap;">${presenceProgress}%</span>`
                  : '')
            }
          </div>
          ${!a.marked && presenceProgress > 0 ? `
          <div style="height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;margin-left:2.3rem;">
            <div style="height:100%;width:${presenceProgress}%;background:${presenceProgress>50?'#22C55E':'#f97316'};border-radius:2px;transition:width 0.5s;"></div>
          </div>` : ''}
        </div>`;
    });
  }

  container.innerHTML = html;

  // Mettre à jour les badges onglets et topbar
  const cntBadge = document.getElementById('live-participants-badge');
  if (cntBadge) cntBadge.textContent = sorted.length;
  const cntNum = document.getElementById('live-participants-count-num');
  if (cntNum) cntNum.textContent = onlineCount;
}

function renderLiveChat() {
  const container = document.getElementById('live-chat-messages');
  if (!container) return;

  const msgs = liveGetChat(liveState.sessionId);
  liveState.lastChatCount = msgs.length;

  if (!msgs.length) {
    container.innerHTML = '<div style="text-align:center;padding:2rem 0;color:rgba(255,255,255,0.25);font-size:0.78rem;">Soyez le premier à envoyer un message…</div>';
    return;
  }

  const myId = auth.userId || auth.role;
  container.innerHTML = msgs.map(m => {
    const isMine = m.userId === myId;
    const time   = new Date(m.ts).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
    return `
      <div class="live-msg ${isMine ? 'live-msg-mine' : 'live-msg-other'}">
        ${!isMine ? `<div class="live-msg-sender">${escHtml(m.name)}</div>` : ''}
        <div class="live-msg-bubble">${escHtml(m.text)}</div>
        <div class="live-msg-meta">${time}</div>
      </div>`;
  }).join('');

  // Scroller vers le bas
  container.scrollTop = container.scrollHeight;

  // Cacher badge
  const badge = document.getElementById('live-chat-badge');
  if (badge) badge.style.display = 'none';
}

function updateLiveTopbarInfo() {
  const session = getLiveSessionById(liveState.sessionId);
  if (!session) return;

  const el = document.getElementById('live-session-title');
  if (el) el.textContent = session.courseName || 'Cours en direct';
}

function updateParticipantsCountDisplay() {
  const session = getLiveSessionById(liveState.sessionId);
  const n = session ? Object.keys(session.attendees || {}).length : 0;
  const el = document.getElementById('live-participants-count-num');
  if (el) el.textContent = n;
}

function updateLiveControls() {
  // Caméra
  const camBtn = document.getElementById('live-btn-cam');
  if (camBtn) {
    camBtn.classList.toggle('off', !liveState.camEnabled);
    camBtn.querySelector('.live-ctrl-label').textContent = liveState.camEnabled ? 'Caméra' : 'Caméra off';
    camBtn.querySelector('svg').style.opacity = liveState.camEnabled ? '1' : '0.5';
  }
  // Micro
  const micBtn = document.getElementById('live-btn-mic');
  if (micBtn) {
    micBtn.classList.toggle('off', !liveState.micEnabled);
    micBtn.querySelector('.live-ctrl-label').textContent = liveState.micEnabled ? 'Micro' : 'Micro off';
  }
  // Écran
  const screenBtn = document.getElementById('live-btn-screen');
  if (screenBtn) {
    screenBtn.classList.toggle('active-screen', liveState.screenSharing);
    screenBtn.querySelector('.live-ctrl-label').textContent = liveState.screenSharing ? 'Arrêter' : 'Partager';
  }
  // Enregistrement
  const recBtn = document.getElementById('live-btn-record');
  if (recBtn) {
    recBtn.classList.toggle('recording', liveState.recording);
    recBtn.querySelector('.live-ctrl-label').textContent = liveState.recording ? 'Enreg…' : 'Enreg.';
  }

  // Documents
  const docsBtn = document.getElementById('live-btn-docs');
  if (docsBtn) docsBtn.classList.toggle('active-screen', liveState.docPages.length > 0);

  // Tableau blanc
  const wbBtn = document.getElementById('live-btn-wb');
  if (wbBtn) {
    wbBtn.classList.toggle('active-wb', wbState.active);
    wbBtn.querySelector('.live-ctrl-label').textContent = wbState.active ? 'Tableau ✓' : 'Tableau';
  }

  // Masquer les boutons formateur si étudiant
  if (liveState.role === 'student') {
    if (screenBtn) screenBtn.style.display = 'none';
    if (recBtn)    recBtn.style.display    = 'none';
    if (docsBtn)   docsBtn.style.display   = 'none';
    if (wbBtn)     wbBtn.style.display     = 'none';
    const fileInput = document.getElementById('live-doc-file-input');
    if (fileInput) fileInput.style.display = 'none';
  }
}

function showLiveConnecting(show) {
  const el = document.getElementById('live-connecting-overlay');
  if (el) el.style.display = show ? 'flex' : 'none';
}

function switchLivePanel(panel) {
  document.querySelectorAll('.live-panel-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.panel === panel);
  });
  document.getElementById('live-participants-panel').classList.toggle('active', panel === 'participants');
  document.getElementById('live-chat-panel').classList.toggle('active', panel === 'chat');
  const docsPanel = document.getElementById('live-docs-panel');
  if (docsPanel) docsPanel.classList.toggle('active', panel === 'documents');
  if (panel === 'documents') renderLiveDocsList();
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ══════════════════════════════════════════
//  NOTIFICATION ÉTUDIANT (bannière)
// ══════════════════════════════════════════
let _liveBannerPoll = null;

function startLiveStudentPolling() {
  if (_liveBannerPoll) return;
  _liveBannerPoll = setInterval(checkLiveStudentNotification, LIVE_POLL_MS);
  checkLiveStudentNotification(); // vérifier immédiatement
}

function stopLiveStudentPolling() {
  clearInterval(_liveBannerPoll);
  _liveBannerPoll = null;
}


// Refresh périodique depuis JSONBin pour voir les sessions live des autres appareils
let _liveRefreshCount = 0;
async function _refreshLiveFromJsonBin() {
  try {
    const res = await fetch(JSONBIN_URL + "/latest", { headers: { "X-Master-Key": JSONBIN_KEY } });
    if (res.ok) {
      const json = await res.json();
      const fresh = json.record || json;
      if (fresh && Array.isArray(fresh.liveSessions)) appData.liveSessions = fresh.liveSessions;
      if (fresh && Array.isArray(fresh.users))        appData.users        = fresh.users;
    }
  } catch(e) {}
}

function checkLiveStudentNotification() {
  // Rafraîchir les données JSONBin toutes les ~15s (5 polls x 3s)
  _liveRefreshCount++;
  if (_liveRefreshCount >= 5) { _liveRefreshCount = 0; _refreshLiveFromJsonBin(); }
  if (auth.role !== 'student') return;
  if (liveState.sessionId) return; // déjà dans une session

  const session = getActiveLiveSession();

  // Mettre à jour la carte du dashboard (toujours, même si bannerDismissed)
  if (typeof updateStudentLiveCard === 'function') updateStudentLiveCard();

  // Mettre à jour la section "Cours en direct & Enregistrements" si visible
  const liveRecSec = document.getElementById('sec-live-recordings');
  if (liveRecSec && liveRecSec.style.display !== 'none') {
    if (typeof renderStudentLiveSection === 'function') renderStudentLiveSection();
  }

  if (liveState.bannerDismissed) return;

  if (session) {
    showLiveStudentBanner(session);
  } else {
    hideLiveStudentBanner();
  }
}

function showLiveStudentBanner(session) {
  const banner = document.getElementById('live-student-banner');
  if (!banner) return;

  const trainerName = session.trainerName || 'Formateur';
  const courseName  = session.courseName  || 'Cours en direct';

  // Toujours mettre à jour le contenu (en cas de changement de session)
  const courseEl  = document.getElementById('live-banner-course-name');
  const nameEl    = document.getElementById('live-banner-trainer-name');
  const joinBtn   = document.getElementById('live-banner-join-btn');
  if (courseEl) courseEl.textContent = courseName;
  if (nameEl)   nameEl.textContent   = 'avec ' + trainerName;
  if (joinBtn)  joinBtn.onclick       = () => studentJoinLiveSession(session.id);

  // Afficher seulement si pas encore visible (animation)
  if (banner.style.display !== 'flex') {
    banner.style.display = 'flex';
  }
}

function hideLiveStudentBanner() {
  const banner = document.getElementById('live-student-banner');
  if (banner) banner.style.display = 'none';
}

function dismissLiveBanner() {
  liveState.bannerDismissed = true;
  hideLiveStudentBanner();
  // Réactiver après 3 minutes
  setTimeout(() => { liveState.bannerDismissed = false; }, 3 * 60 * 1000);
}

// ══════════════════════════════════════════
//  VUE FORMATEUR — Cours en direct
// ══════════════════════════════════════════
function renderTrainerLiveView() {
  const container = document.getElementById('trainer-live-content');
  if (!container) return;

  if (!appData.liveSessions) appData.liveSessions = [];
  const myActive  = appData.liveSessions.find(s => s.status === 'active' && s.trainerId === auth.userId);
  const pastSessions = appData.liveSessions
    .filter(s => s.status === 'ended' && s.trainerId === auth.userId)
    .sort((a,b) => (b.startedAt||0) - (a.startedAt||0));

  let html = `
    <div class="live-start-card">
      <div class="live-start-card-icon">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
        </svg>
      </div>
      <div class="live-start-card-text">
        <h2>${myActive ? '📡 Session active en cours' : 'Démarrer un cours en direct'}</h2>
        <p>${myActive
          ? `"${escHtml(myActive.courseName)}" — Démarré ${fmtLiveDate(myActive.startedAt)}`
          : 'Démarrez une session de visioconférence pour interagir avec vos étudiants en temps réel.'
        }</p>
      </div>
      ${myActive
        ? `<div style="display:flex;gap:0.6rem;flex-wrap:wrap;align-items:center;">
            <button class="live-btn-start-session" onclick="openLiveRoom('${myActive.id}','trainer')" style="background:#7C3AED;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              Rejoindre la salle
            </button>
            <button onclick="forceCloseActiveSession('${myActive.id}')" style="background:#ef4444;color:#fff;border:none;border-radius:12px;padding:0.65rem 1.1rem;font-size:0.82rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:0.45rem;transition:all 0.15s;" onmouseover="this.style.background='#dc2626'" onmouseout="this.style.background='#ef4444'">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Terminer la session
            </button>
          </div>`
        : `<button class="live-btn-start-session" onclick="openLiveStartModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
            Démarrer un cours
          </button>`
      }
    </div>`;

  // Sessions passées
  html += `<div style="font-size:0.8rem;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem;">Sessions récentes (${pastSessions.length})</div>`;

  if (!pastSessions.length) {
    html += '<div style="text-align:center;padding:2rem;background:#f9fafb;border-radius:14px;border:1.5px dashed #e5e7eb;color:#aaa;font-size:0.85rem;">Aucune session terminée.</div>';
  } else {
    pastSessions.slice(0, 10).forEach(s => {
      const rec  = (appData.liveRecordings||[]).find(r => r.sessionId === s.id);
      const dur  = s.endedAt ? fmtLiveDuration(Math.round((s.endedAt - s.startedAt)/1000)) : '–';
      const cnt  = Object.keys(s.attendees||{}).length;
      const pres = Object.values(s.attendees||{}).filter(a=>a.marked).length;

      html += `
        <div class="live-session-card">
          <div class="live-session-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </div>
          <div class="live-session-card-body">
            <div class="live-session-card-title">${escHtml(s.courseName)}</div>
            <div class="live-session-card-meta">
              <span>${fmtLiveDate(s.startedAt)}</span>
              <span>·</span><span>⏱ ${dur}</span>
              <span>·</span><span>👥 ${cnt} participants (${pres} présents)</span>
              ${rec ? '<span class="live-session-card-badge badge-rec">⏺ Enregistré</span>' : ''}
            </div>
          </div>
          <div class="live-session-actions">
            ${rec
              ? `<button class="live-session-btn live-session-btn-play" onclick="playLiveRecording('${rec.blobKey}','${escHtml(s.courseName)}')">▶ Voir</button>
                 <button class="live-session-btn live-session-btn-dl" onclick="downloadLiveRecording('${rec.blobKey}','${escHtml(s.courseName)}')">⬇ DL</button>`
              : ''
            }
            <button class="live-session-btn live-session-btn-del" onclick="deleteTrainerLiveSession('${s.id}')">🗑</button>
          </div>
        </div>`;
    });
  }

  container.innerHTML = html;
}

function deleteTrainerLiveSession(sessionId) {
  if (!confirm('Supprimer cette session et son enregistrement ?')) return;
  if (appData.liveSessions) {
    const idx = appData.liveSessions.findIndex(s => s.id === sessionId);
    if (idx !== -1) appData.liveSessions.splice(idx, 1);
  }
  const rec = (appData.liveRecordings||[]).find(r => r.sessionId === sessionId);
  if (rec) {
    deleteLiveRecordingBlob(rec.blobKey).catch(()=>{});
    if (appData.liveRecordings) {
      const ri = appData.liveRecordings.findIndex(r => r.sessionId === sessionId);
      if (ri !== -1) appData.liveRecordings.splice(ri, 1);
    }
    liveCleanupChat(sessionId);
  }
  saveAppData(false);
  renderTrainerLiveView();
  showNotif('🗑 Session supprimée.', '');
}

function forceCloseActiveSession(sessionId) {
  if (!confirm('Terminer définitivement cette session ? Elle sera marquée comme terminée et vous pourrez en démarrer une nouvelle.')) return;
  const session = (appData.liveSessions || []).find(s => s.id === sessionId);
  if (session) {
    session.status  = 'ended';
    session.endedAt = Date.now();
  }
  saveAppData(false);
  renderTrainerLiveView();
  showNotif('✅ Session terminée. Vous pouvez maintenant lancer une nouvelle séance.', 'success');
}

// ══════════════════════════════════════════
//  VUE FORMATEUR — Enregistrements
// ══════════════════════════════════════════
function renderTrainerRecordingsView() {
  const container = document.getElementById('trainer-recordings-content');
  if (!container) return;

  if (!appData.liveRecordings) appData.liveRecordings = [];
  const recs = appData.liveRecordings
    .filter(r => r.trainerId === auth.userId)
    .sort((a,b) => (b.startedAt||0) - (a.startedAt||0));

  if (!recs.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 2rem;color:#aaa;">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 1rem;display:block;"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        <p style="font-weight:700;font-size:1rem;color:#888;margin-bottom:0.5rem;">Aucun enregistrement disponible</p>
        <p style="font-size:0.82rem;">Les sessions en direct sont enregistrées automatiquement.</p>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="rec-cards-grid">${recs.map(r => buildRecCard(r, true)).join('')}</div>`;
}

function buildRecCard(r, canDelete) {
  const dur  = fmtLiveDuration(r.duration || 0);
  const size = r.size ? Math.round(r.size / 1024 / 1024 * 10) / 10 + ' Mo' : '';
  const date = fmtLiveDate(r.startedAt);

  return `
    <div class="rec-card">
      <div class="rec-card-thumb">
        <button class="rec-card-play-btn" onclick="playLiveRecording('${r.blobKey}','${escHtml(r.courseName)}')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </button>
        <div class="rec-card-duration">${dur}</div>
      </div>
      <div class="rec-card-body">
        <div class="rec-card-title">${escHtml(r.courseName)}</div>
        <div class="rec-card-meta">
          <span>📅 ${date}</span>
          <span>👤 ${escHtml(r.trainerName)}</span>
          ${size ? '<span>💾 ' + size + '</span>' : ''}
        </div>
      </div>
      <div class="rec-card-footer">
        <button class="live-session-btn live-session-btn-play" style="flex:1;" onclick="playLiveRecording('${r.blobKey}','${escHtml(r.courseName)}')">▶ Lire</button>
        <button class="live-session-btn live-session-btn-dl" onclick="downloadLiveRecording('${r.blobKey}','${escHtml(r.courseName)}')">⬇</button>
        ${canDelete ? `<button class="live-session-btn live-session-btn-del" onclick="deleteLiveRecording('${r.id}','${r.blobKey}')">🗑</button>` : ''}
      </div>
    </div>`;
}

function deleteLiveRecording(recId, blobKey) {
  if (!confirm('Supprimer cet enregistrement ?')) return;
  deleteLiveRecordingBlob(blobKey).catch(()=>{});
  if (appData.liveRecordings) {
    const idx = appData.liveRecordings.findIndex(r => r.id === recId);
    if (idx !== -1) appData.liveRecordings.splice(idx, 1);
  }
  saveAppData(false);
  renderTrainerRecordingsView();
  showNotif('🗑 Enregistrement supprimé.', '');
}

// ══════════════════════════════════════════
//  VUE ÉTUDIANT — Enregistrements
// ══════════════════════════════════════════
function renderStudentLiveRecordings() {
  const container = document.getElementById('student-live-recordings');
  if (!container) return;

  if (!appData.liveRecordings) { container.innerHTML = ''; return; }

  const recs = appData.liveRecordings.sort((a,b) => (b.startedAt||0) - (a.startedAt||0));

  if (!recs.length) {
    container.innerHTML = '<div style="text-align:center;padding:2.5rem 0;color:rgba(255,255,255,0.35);font-size:0.85rem;">Aucun cours enregistré disponible.</div>';
    return;
  }

  container.innerHTML = `<div class="rec-cards-grid">${recs.map(r => buildRecCard(r, false)).join('')}</div>`;
}

// ══════════════════════════════════════════
//  VUE ADMIN — Toutes les sessions
// ══════════════════════════════════════════
function renderAdminLiveSessions() {
  const container = document.getElementById('admin-live-content');
  if (!container) return;

  if (!appData.liveSessions) appData.liveSessions = [];
  const all = [...appData.liveSessions].sort((a,b) => (b.startedAt||0) - (a.startedAt||0));

  // Stats
  const total   = all.length;
  const active  = all.filter(s=>s.status==='active').length;
  const totalPart = all.reduce((sum,s) => sum + Object.keys(s.attendees||{}).length, 0);
  const totalPresent = all.reduce((sum,s) => sum + Object.values(s.attendees||{}).filter(a=>a.marked).length, 0);

  let html = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem;">
      ${[
        { label:'Sessions totales',  val: total,      color:'#7C3AED', bg:'#EDE9FE' },
        { label:'En cours',           val: active,     color:'#16a34a', bg:'#dcfce7' },
        { label:'Participants total', val: totalPart,  color:'#0D47A1', bg:'#EFF6FF' },
        { label:'Présences validées', val: totalPresent, color:'#d97706', bg:'#FFF3CD' },
      ].map(s => `
        <div style="background:#fff;border-radius:14px;border:1.5px solid #e8eaed;padding:1.1rem 1.25rem;">
          <div style="font-size:1.6rem;font-weight:800;color:${s.color};">${s.val}</div>
          <div style="font-size:0.75rem;color:#888;font-weight:600;margin-top:0.25rem;">${s.label}</div>
        </div>`).join('')}
    </div>`;

  if (!all.length) {
    html += '<div style="text-align:center;padding:3rem;background:#f9fafb;border-radius:14px;border:1.5px dashed #e5e7eb;color:#aaa;">Aucune session enregistrée.</div>';
  } else {
    html += all.map(s => {
      const rec   = (appData.liveRecordings||[]).find(r => r.sessionId === s.id);
      const dur   = s.endedAt ? fmtLiveDuration(Math.round((s.endedAt - s.startedAt)/1000)) : 'En cours';
      const cnt   = Object.keys(s.attendees||{}).length;
      const pres  = Object.values(s.attendees||{}).filter(a=>a.marked).length;
      const statusClass = s.status === 'active' ? 'badge-active' : 'badge-ended';
      const statusLabel = s.status === 'active' ? '🔴 En direct' : '✅ Terminée';

      return `
        <div class="live-session-card">
          <div class="live-session-card-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </div>
          <div class="live-session-card-body">
            <div class="live-session-card-title">${escHtml(s.courseName)}</div>
            <div class="live-session-card-meta">
              <span class="live-session-card-badge ${statusClass}">${statusLabel}</span>
              <span>📅 ${fmtLiveDate(s.startedAt)}</span>
              <span>·</span><span>👤 ${escHtml(s.trainerName)}</span>
              <span>·</span><span>⏱ ${dur}</span>
              <span>·</span><span>👥 ${cnt} dont ${pres} présents</span>
              ${rec ? '<span class="live-session-card-badge badge-rec">⏺ Enreg.</span>' : ''}
            </div>
          </div>
          <div class="live-session-actions">
            ${rec ? `<button class="live-session-btn live-session-btn-play" onclick="playLiveRecording('${rec.blobKey}','${escHtml(s.courseName)}')">▶ Voir</button>` : ''}
            <button class="live-session-btn live-session-btn-del" onclick="adminDeleteLiveSession('${s.id}')">🗑</button>
          </div>
        </div>`;
    }).join('');
  }

  container.innerHTML = html;
}

function adminDeleteLiveSession(sessionId) {
  if (!confirm('Supprimer définitivement cette session et son enregistrement ?')) return;
  if (appData.liveSessions) {
    const idx = appData.liveSessions.findIndex(s => s.id === sessionId);
    if (idx !== -1) appData.liveSessions.splice(idx, 1);
  }
  const rec = (appData.liveRecordings||[]).find(r => r.sessionId === sessionId);
  if (rec) {
    deleteLiveRecordingBlob(rec.blobKey).catch(()=>{});
    const ri = (appData.liveRecordings||[]).findIndex(r => r.sessionId === sessionId);
    if (ri !== -1) appData.liveRecordings.splice(ri, 1);
    liveCleanupChat(sessionId);
  }
  saveAppData(false);
  renderAdminLiveSessions();
  showNotif('🗑 Session supprimée.', '');
}

// ══════════════════════════════════════════
//  LECTURE + TÉLÉCHARGEMENT ENREGISTREMENTS
// ══════════════════════════════════════════
async function playLiveRecording(blobKey, title) {
  try {
    showNotif('⏳ Chargement de l\'enregistrement…', '');
    const blob = await getLiveRecordingBlob(blobKey);
    if (!blob) { showNotif('⚠️ Enregistrement introuvable.', 'error'); return; }

    const url     = URL.createObjectURL(blob);
    const overlay = document.getElementById('video-player-overlay');
    const vid     = document.getElementById('vp-video');
    const titleEl = document.getElementById('vp-title');
    const infoTitle = document.getElementById('vp-info-title');
    const infoDec   = document.getElementById('vp-info-desc');
    const loading   = document.getElementById('vp-loading');
    const tags      = document.getElementById('vp-tags');

    if (!overlay || !vid) { window.open(url, '_blank'); return; }

    // Remplir les métadonnées
    if (titleEl)   titleEl.textContent   = title || 'Enregistrement';
    if (infoTitle) infoTitle.textContent = title || 'Enregistrement';
    if (infoDec)   infoDec.textContent   = 'Cours enregistré en direct';
    if (tags)      tags.innerHTML        = '<span class="video-player-tag">🔴 Enregistrement live</span>';

    // Réinitialiser l'état du lecteur
    if (loading) loading.style.display = 'none';
    vid.src = url;
    vid.style.display = 'block';
    vid.load();
    vid.play().catch(() => {});

    // Ouvrir l'overlay avec la MÊME méthode que le lecteur classique (classe CSS)
    // → closeVideoPlayer() pourra le fermer correctement
    overlay.classList.add('show');
    document.body.classList.add('modal-open');

    // Libérer le blob URL quand la vidéo se termine ou que le lecteur est fermé
    vid.onended = () => URL.revokeObjectURL(url);
  } catch(e) {
    showNotif('⚠️ Impossible de lire l\'enregistrement.', 'error');
  }
}

async function downloadLiveRecording(blobKey, title) {
  try {
    showNotif('⏳ Préparation du téléchargement…', '');
    const blob = await getLiveRecordingBlob(blobKey);
    if (!blob) { showNotif('⚠️ Enregistrement introuvable.', 'error'); return; }

    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = (title || 'cours-enregistre') + '.webm';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showNotif('✅ Téléchargement lancé.', 'success');
  } catch(e) {
    showNotif('⚠️ Impossible de télécharger l\'enregistrement.', 'error');
  }
}

// ══════════════════════════════════════════
//  PARTAGE DE DOCUMENTS
// ══════════════════════════════════════════

function liveOpenDocPicker() {
  if (liveState.role !== 'trainer') return;
  const inp = document.getElementById('live-doc-file-input');
  if (inp) inp.click();
}

async function liveHandleDocFile(file) {
  if (!file || liveState.role !== 'trainer') return;
  const ext = file.name.split('.').pop().toLowerCase();
  const maxMB = 25;
  if (file.size > maxMB * 1024 * 1024) {
    alert('Fichier trop volumineux (maximum ' + maxMB + ' Mo). Compressez le fichier ou exportez en PDF plus léger.');
    return;
  }
  showLiveConnecting(true);
  try {
    if (ext === 'pdf') {
      await _liveLoadPdf(file);
    } else if (['jpg','jpeg','png','webp','gif'].includes(ext)) {
      await _liveLoadImage(file);
    } else if (['doc','docx'].includes(ext)) {
      await _liveLoadDocx(file);
    } else {
      alert('Format non supporté. Utilisez PDF, DOCX, JPG ou PNG.');
    }
  } catch(e) {
    console.error('[Live] Erreur chargement document:', e);
    alert('Erreur lors du chargement du document.');
  }
  showLiveConnecting(false);
}

function _readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload  = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function _renderPdfPageToDataUrl(pdfDoc, pageNum) {
  const page     = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.2 });
  const canvas   = document.createElement('canvas');
  canvas.width   = viewport.width;
  canvas.height  = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL('image/jpeg', 0.72);
}

async function _liveLoadPdf(file) {
  if (typeof pdfjsLib === 'undefined') {
    alert('pdf.js non disponible.'); return;
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  liveState.pdfDoc = pdfDoc;
  liveState.docPages = [];
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const dataUrl = await _renderPdfPageToDataUrl(pdfDoc, i);
    liveState.docPages.push({ type: 'image', dataUrl });
  }
  liveState.docCurrentPage = 0;
  liveState.docName  = file.name;
  liveState.docZoom  = 1.0;
  liveDocShowCurrent();
  _liveDocBroadcastCurrent();
  renderLiveDocsList();
  // Afficher le badge
  const badge = document.getElementById('live-docs-badge');
  if (badge) { badge.textContent = pdfDoc.numPages; badge.style.display = 'inline-flex'; }
}

async function _liveLoadImage(file) {
  const dataUrl = await _readFileAsDataUrl(file);
  liveState.docPages = [{ type: 'image', dataUrl }];
  liveState.docCurrentPage = 0;
  liveState.docName  = file.name;
  liveState.docZoom  = 1.0;
  liveDocShowCurrent();
  _liveDocBroadcastCurrent();
  renderLiveDocsList();
}

async function _liveLoadDocx(file) {
  if (typeof mammoth === 'undefined') {
    // Fallback: afficher comme téléchargement
    alert('Conversion DOCX non disponible. Exportez votre document en PDF pour le partager.');
    return;
  }
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  liveState.docPages = [{ type: 'html', html: result.value }];
  liveState.docCurrentPage = 0;
  liveState.docName  = file.name;
  liveState.docZoom  = 1.0;
  liveDocShowCurrent();
  _liveDocBroadcastCurrent();
  renderLiveDocsList();
}

function liveDocShowCurrent() {
  const pages = liveState.docPages;
  const area  = document.getElementById('live-doc-view-area');
  const vw    = document.getElementById('live-main-video-wrapper');

  if (!pages.length) {
    if (area) area.classList.remove('active');
    if (vw)   vw.style.display = '';
    return;
  }

  if (area) area.classList.add('active');
  if (vw)   vw.style.display = 'none';

  const page    = pages[liveState.docCurrentPage];
  const img     = document.getElementById('live-doc-img-view');
  const htmlDiv = document.getElementById('live-doc-html-view');
  const zoom    = liveState.docZoom || 1.0;

  if (page && page.type === 'image') {
    if (img) { img.src = page.dataUrl; img.style.display = 'block'; img.style.transform = 'scale(' + zoom + ')'; }
    if (htmlDiv) htmlDiv.style.display = 'none';
  } else if (page && page.type === 'html') {
    if (htmlDiv) { htmlDiv.innerHTML = page.html; htmlDiv.style.display = 'block'; htmlDiv.style.transform = 'scale(' + zoom + ')'; }
    if (img) img.style.display = 'none';
  }

  const info = document.getElementById('live-doc-page-info');
  if (info) info.textContent = (liveState.docCurrentPage + 1) + ' / ' + pages.length;
  const nameEl = document.getElementById('live-doc-name');
  if (nameEl) nameEl.textContent = liveState.docName || '';
  const zoomEl = document.getElementById('live-doc-zoom-level');
  if (zoomEl) zoomEl.textContent = Math.round(zoom * 100) + '%';
  const prevBtn = document.getElementById('live-doc-prev-btn');
  const nextBtn = document.getElementById('live-doc-next-btn');
  if (prevBtn) prevBtn.disabled = liveState.docCurrentPage <= 0;
  if (nextBtn) nextBtn.disabled = liveState.docCurrentPage >= pages.length - 1;

  updateLiveControls();
}

function liveDocPrevPage() {
  if (liveState.docCurrentPage <= 0) return;
  liveState.docCurrentPage--;
  liveDocShowCurrent();
  if (liveState.role === 'trainer') _liveDocBroadcastCurrent();
}

function liveDocNextPage() {
  if (liveState.docCurrentPage >= liveState.docPages.length - 1) return;
  liveState.docCurrentPage++;
  liveDocShowCurrent();
  if (liveState.role === 'trainer') _liveDocBroadcastCurrent();
}

function liveDocZoom(delta) {
  liveState.docZoom = Math.max(0.3, Math.min(3.0, (liveState.docZoom || 1.0) + delta));
  liveDocShowCurrent();
}

function liveDocClose() {
  liveState.docPages = [];
  liveState.pdfDoc   = null;
  liveState.docCurrentPage = 0;
  liveState.docName  = '';
  liveDocShowCurrent(); // will hide area
  renderLiveDocsList();
  const badge = document.getElementById('live-docs-badge');
  if (badge) badge.style.display = 'none';
  if (liveState.role === 'trainer') {
    Object.values(liveState.connections).forEach(conn => {
      try { conn.send({ type: 'doc-close' }); } catch(e) {}
    });
  }
  updateLiveControls();
}

function _liveDocBroadcastCurrent() {
  if (!liveState.docPages.length) return;
  const page = liveState.docPages[liveState.docCurrentPage];
  if (!page) return;
  Object.values(liveState.connections).forEach(conn => {
    try {
      conn.send({
        type:     'doc-page-data',
        pageData: page,
        pageNum:  liveState.docCurrentPage,
        total:    liveState.docPages.length,
        name:     liveState.docName,
      });
    } catch(e) {}
  });
}

function _receiveDocPageData(data) {
  if (!data || !data.pageData) return;
  // Stocker la page reçue
  if (!liveState.docPages.length || liveState.docPages.length !== data.total) {
    liveState.docPages = new Array(data.total || 1).fill(null);
  }
  liveState.docPages[data.pageNum] = data.pageData;
  liveState.docCurrentPage = data.pageNum;
  liveState.docName  = data.name || 'Document';
  liveDocShowCurrent();
  renderLiveDocsList();
  // Badge
  const badge = document.getElementById('live-docs-badge');
  if (badge) { badge.textContent = data.total; badge.style.display = 'inline-flex'; }
}

function renderLiveDocsList() {
  const inner = document.getElementById('live-docs-panel-inner');
  if (!inner) return;
  const isTrainer = liveState.role === 'trainer';
  const pages     = liveState.docPages || [];
  let html = '';

  if (isTrainer) {
    html += `<label class="live-doc-upload-zone" onclick="document.getElementById('live-doc-file-input').click()">
      <span class="live-doc-upload-icon">📄</span>
      <div class="live-doc-upload-text"><strong>Téléverser un document</strong><br>PDF · DOCX · JPG · PNG (max 25 Mo)</div>
    </label>`;
  }

  const hasDoc = pages.length && pages.some(p => p != null);
  if (hasDoc) {
    const icon = _getDocIcon(liveState.docName || '');
    html += `<div class="live-doc-item active" onclick="liveDocShowCurrent()">
      <span class="live-doc-item-icon">${icon}</span>
      <div class="live-doc-item-name">${escHtml(liveState.docName || 'Document')}</div>
      <span class="live-doc-item-meta">${pages.length} p.</span>
    </div>`;
    if (isTrainer) {
      html += `<div style="text-align:center;margin-top:0.5rem;">
        <button onclick="liveDocClose()" style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);color:#fca5a5;border-radius:8px;padding:0.3rem 0.8rem;font-size:0.7rem;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;">✕ Retirer le document</button>
      </div>`;
    }
  } else {
    html += `<div id="live-docs-no-doc">Aucun document partagé.<br><span style="font-size:0.68rem;opacity:0.7;">${isTrainer ? 'Utilisez le bouton ci-dessus pour partager.' : 'Le formateur n\'a pas encore partagé de document.'}</span></div>`;
  }

  inner.innerHTML = html;
}

function _getDocIcon(name) {
  const ext = (name || '').split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📕';
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️';
  if (['doc','docx'].includes(ext)) return '📝';
  if (['ppt','pptx'].includes(ext)) return '📊';
  return '📄';
}

// ══════════════════════════════════════════
//  TABLEAU BLANC (WHITEBOARD)
// ══════════════════════════════════════════

function liveToggleWhiteboard() {
  if (liveState.role !== 'trainer') return;
  wbState.active = !wbState.active;
  const canvas  = document.getElementById('live-whiteboard-canvas');
  const toolbar = document.getElementById('live-wb-toolbar');
  if (canvas)  canvas.classList.toggle('active', wbState.active);
  if (toolbar) toolbar.classList.toggle('active', wbState.active);
  updateLiveControls();
  // Initier ou redimensionner le canvas (toujours recalculer les dimensions)
  if (wbState.active) _initWbCanvas();
  // Écouter les redimensionnements de fenêtre pour adapter le canvas
  if (wbState.active && !window._wbResizeListener) {
    window._wbResizeListener = () => {
      if (!wbState.active) return;
      const c = document.getElementById('live-whiteboard-canvas');
      const a = document.getElementById('live-video-area');
      if (c && a && a.offsetWidth > 0) { c.width = a.offsetWidth; c.height = a.offsetHeight; _redrawWb(); }
    };
    window.addEventListener('resize', window._wbResizeListener);
  } else if (!wbState.active && window._wbResizeListener) {
    window.removeEventListener('resize', window._wbResizeListener);
    window._wbResizeListener = null;
  }
  // Diffuser aux étudiants
  Object.values(liveState.connections).forEach(conn => {
    try { conn.send({ type: 'wb-toggle', active: wbState.active }); } catch(e) {}
  });
}

function _initWbCanvas() {
  const canvas = document.getElementById('live-whiteboard-canvas');
  if (!canvas) return;
  const area = document.getElementById('live-video-area');
  if (area) { canvas.width = area.offsetWidth; canvas.height = area.offsetHeight; }
  _redrawWb();
  canvas.onpointerdown = _wbDown;
  canvas.onpointermove = _wbMove;
  canvas.onpointerup   = _wbUp;
  canvas.onpointerleave = _wbUp;
}

function _wbNorm(e, canvas) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
}

function _wbDown(e) {
  if (!wbState.active || liveState.role !== 'trainer') return;
  // Outil texte : ouvrir la saisie clavier à l'endroit du clic
  if (wbState.tool === 'text') {
    const pt = _wbNorm(e, this);
    _wbShowTextInput(pt.x, pt.y, this);
    e.preventDefault();
    return;
  }
  wbState.drawing = true;
  wbState.lastPt  = _wbNorm(e, this);
  wbState.currentStroke = [wbState.lastPt];
  e.preventDefault();
}

function _wbMove(e) {
  if (!wbState.drawing || wbState.tool === 'text') return;
  const canvas = document.getElementById('live-whiteboard-canvas');
  if (!canvas) return;
  const pt  = _wbNorm(e, canvas);
  const ctx = canvas.getContext('2d');

  const isEraser = wbState.tool === 'eraser';
  const isMarker = wbState.tool === 'marker';

  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : wbState.color;
  ctx.globalAlpha = isMarker ? 0.45 : 1.0;
  ctx.lineWidth   = isEraser ? wbState.size * 6 : (isMarker ? wbState.size * 3 : wbState.size);
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';

  const last = wbState.lastPt;
  ctx.beginPath();
  ctx.moveTo(last.x * canvas.width, last.y * canvas.height);
  ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
  ctx.stroke();

  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';

  wbState.lastPt = pt;
  wbState.currentStroke.push(pt);

  // Diffuser en temps réel : envoyer le segment à chaque mouvement
  // → les étudiants voient le trait immédiatement, pas seulement à la fin
  const seg = { from: last, to: pt, color: wbState.color, size: wbState.size, tool: wbState.tool };
  Object.values(liveState.connections).forEach(conn => {
    try { conn.send({ type: 'wb-seg', seg }); } catch(e) {}
  });

  e.preventDefault();
}

function _wbUp(e) {
  if (!wbState.drawing) return;
  wbState.drawing = false;
  if (wbState.currentStroke.length < 2) { wbState.currentStroke = []; return; }
  const stroke = {
    points: wbState.currentStroke,
    color:  wbState.color,
    size:   wbState.size,
    tool:   wbState.tool,
  };
  wbState.strokes.push(stroke);
  wbState.currentStroke = [];
  // Diffuser
  Object.values(liveState.connections).forEach(conn => {
    try { conn.send({ type: 'wb-stroke', stroke }); } catch(e) {}
  });
  e.preventDefault();
}

function _redrawWb() {
  const canvas = document.getElementById('live-whiteboard-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  wbState.strokes.forEach(s => _drawWbStroke(ctx, canvas, s));
}

function _drawWbStroke(ctx, canvas, stroke) {
  // Élément texte
  if (stroke.tool === 'text') {
    _drawWbText(ctx, canvas, stroke);
    return;
  }
  if (!stroke.points || stroke.points.length < 2) return;
  const isEraser = stroke.tool === 'eraser';
  const isMarker = stroke.tool === 'marker';
  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : (stroke.color || '#fff');
  ctx.globalAlpha = isMarker ? 0.45 : 1.0;
  ctx.lineWidth   = isEraser ? stroke.size * 6 : (isMarker ? stroke.size * 3 : stroke.size);
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
  }
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
}

function _drawWbText(ctx, canvas, item) {
  const fontSize = Math.max(14, item.size || 24);
  // Police avec fallbacks larges pour garantir le rendu même sans DM Sans chargé
  ctx.font = '600 ' + fontSize + 'px "DM Sans", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = item.color || '#ffffff';
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.textBaseline = 'top';
  // Ombre pour lisibilité sur n'importe quel fond
  ctx.shadowColor = 'rgba(0,0,0,0.85)';
  ctx.shadowBlur  = 5;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  const maxW  = canvas.width * 0.48;
  const lines = _wbWrapText(ctx, item.text || '', maxW);
  const lineH = fontSize * 1.45;
  const x = item.x * canvas.width;
  const y = item.y * canvas.height;
  lines.forEach(function(line, i) { ctx.fillText(line, x, y + i * lineH); });
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur  = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

function _wbWrapText(ctx, text, maxWidth) {
  if (!text) return [''];
  const paragraphs = text.split('\n');
  const result = [];
  paragraphs.forEach(function(para) {
    const words = para.split(' ');
    let current = '';
    words.forEach(function(word) {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        result.push(current);
        current = word;
      } else {
        current = test;
      }
    });
    if (current) result.push(current);
    else result.push('');
  });
  return result.length ? result : [''];
}

// ── Saisie texte (outil texte du tableau blanc) ──
function _wbShowTextInput(normX, normY, canvas) {
  _wbHideTextInput(); // fermer l'éventuelle saisie précédente

  const rect     = canvas.getBoundingClientRect();
  const pixX     = normX * rect.width  + rect.left;
  const pixY     = normY * rect.height + rect.top;
  const fontSize = Math.max(14, wbState.size * 4);
  const color    = wbState.color || '#ffffff';

  const overlay = document.createElement('div');
  overlay.id = 'live-wb-text-overlay';
  overlay.style.left = pixX + 'px';
  overlay.style.top  = pixY + 'px';

  const ta = document.createElement('textarea');
  ta.id = 'live-wb-text-ta';
  ta.rows = 2;
  ta.placeholder = 'Écrivez ici…';
  ta.style.cssText = [
    'border: 1.5px dashed ' + color,
    'color: ' + color,
    'font-size: ' + fontSize + 'px',
    'caret-color: ' + color,
    'text-shadow: 0 1px 6px rgba(0,0,0,0.9)',
    'width: 220px',
    'max-height: 160px',
  ].join(';');

  const confirmBtn = document.createElement('button');
  confirmBtn.textContent = '✓';
  confirmBtn.className   = 'wb-text-action-btn';
  confirmBtn.style.cssText = 'background:#22C55E;color:#fff;';
  confirmBtn.onclick = _wbCommitText;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = '✕';
  cancelBtn.className   = 'wb-text-action-btn';
  cancelBtn.style.cssText = 'background:#ef4444;color:#fff;margin-top:4px;';
  cancelBtn.onclick = _wbHideTextInput;

  const btnCol = document.createElement('div');
  btnCol.style.cssText = 'display:flex;flex-direction:column;';
  btnCol.appendChild(confirmBtn);
  btnCol.appendChild(cancelBtn);

  overlay.appendChild(ta);
  overlay.appendChild(btnCol);
  document.body.appendChild(overlay);

  // Stocker la position normalisée pour le commit
  overlay.dataset.normX = normX;
  overlay.dataset.normY = normY;

  ta.focus();
  ta.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { _wbHideTextInput(); }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _wbCommitText(); }
  });
}

function _wbCommitText() {
  const overlay = document.getElementById('live-wb-text-overlay');
  const ta      = document.getElementById('live-wb-text-ta');
  if (!overlay || !ta) return;

  const text  = ta.value.trim();
  const normX = parseFloat(overlay.dataset.normX || '0');
  const normY = parseFloat(overlay.dataset.normY || '0');
  _wbHideTextInput();

  if (!text) return;

  const canvas = document.getElementById('live-whiteboard-canvas');
  if (!canvas) return;

  // Initialiser le canvas si pas encore actif (formateur uniquement)
  if (!canvas.classList.contains('active')) {
    const area = document.getElementById('live-video-area');
    if (area) { canvas.width = area.offsetWidth; canvas.height = area.offsetHeight; }
    canvas.classList.add('active');
  }

  const item = {
    tool:  'text',
    text:  text,
    x:     normX,
    y:     normY,
    color: wbState.color,
    size:  Math.max(14, wbState.size * 4),
  };

  wbState.strokes.push(item);
  const ctx = canvas.getContext('2d');
  _drawWbText(ctx, canvas, item);

  // Diffuser aux étudiants
  Object.values(liveState.connections).forEach(function(conn) {
    try { conn.send({ type: 'wb-stroke', stroke: item }); } catch(e) {}
  });
}

function _wbHideTextInput() {
  const overlay = document.getElementById('live-wb-text-overlay');
  if (overlay) overlay.remove();
}

// Garantit que le canvas étudiant est visible et dimensionné correctement
function _ensureWbCanvas(canvas) {
  const area = document.getElementById('live-video-area');
  const w = area ? area.offsetWidth  : window.innerWidth;
  const h = area ? area.offsetHeight : window.innerHeight;
  // Redimensionner si nécessaire (0×0 ou taille changée)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width  = w || canvas.offsetWidth  || 800;
    canvas.height = h || canvas.offsetHeight || 600;
  }
  if (!canvas.classList.contains('active')) {
    canvas.classList.add('active', 'view-only');
  }
}

// Reçoit un segment en temps réel et le dessine immédiatement
function _receiveWbSeg(seg) {
  const canvas = document.getElementById('live-whiteboard-canvas');
  if (!canvas) return;
  _ensureWbCanvas(canvas);
  const ctx      = canvas.getContext('2d');
  const isEraser = seg.tool === 'eraser';
  const isMarker = seg.tool === 'marker';
  ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
  ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : (seg.color || '#fff');
  ctx.globalAlpha = isMarker ? 0.45 : 1.0;
  ctx.lineWidth   = isEraser ? seg.size * 6 : (isMarker ? seg.size * 3 : seg.size);
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.beginPath();
  ctx.moveTo(seg.from.x * canvas.width, seg.from.y * canvas.height);
  ctx.lineTo(seg.to.x   * canvas.width, seg.to.y   * canvas.height);
  ctx.stroke();
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
}

function _receiveWbStroke(stroke) {
  wbState.strokes.push(stroke);
  const canvas = document.getElementById('live-whiteboard-canvas');
  if (!canvas) return;
  _ensureWbCanvas(canvas);
  const ctx = canvas.getContext('2d');
  _drawWbStroke(ctx, canvas, stroke);
}

function liveWbClear() {
  wbState.strokes = [];
  const canvas = document.getElementById('live-whiteboard-canvas');
  if (canvas) { const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height); }
  if (liveState.role === 'trainer') {
    Object.values(liveState.connections).forEach(conn => {
      try { conn.send({ type: 'wb-clear' }); } catch(e) {}
    });
  }
}

function setWbTool(tool) {
  wbState.tool = tool;
  document.querySelectorAll('.wb-tool-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('wb-tool-' + tool);
  if (btn) btn.classList.add('active');
}

function setWbColor(color) {
  wbState.color = color;
  document.querySelectorAll('.wb-color-swatch').forEach(s => {
    s.classList.toggle('active', s.dataset.color === color);
  });
}

function setWbSize(val) {
  wbState.size = Math.max(1, parseInt(val) || 4);
}

// ══════════════════════════════════════════
//  RAPPORT DE PRÉSENCE (Admin)
// ══════════════════════════════════════════
function exportLivePresenceReport(sessionId) {
  const session = (appData.liveSessions||[]).find(s=>s.id===sessionId);
  if (!session) return;

  const rows = [
    ['Nom', 'Heure de connexion', 'Durée (min)', 'Présence validée'],
    ...Object.values(session.attendees||{}).map(a => [
      a.name || 'Inconnu',
      a.joinedAt ? new Date(a.joinedAt).toLocaleString('fr-FR') : '–',
      a.duration ? Math.round(a.duration/60) : 0,
      a.marked ? 'Oui' : 'Non',
    ])
  ];

  const csv  = rows.map(r => r.map(v => '"' + String(v).replace(/"/g,'""') + '"').join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'presence_' + session.courseName.replace(/\s+/g,'_') + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showNotif('✅ Rapport exporté en CSV.', 'success');
}
