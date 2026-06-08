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

