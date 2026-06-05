// ══════════════════════════════════════════════════════════════
//  PDF → QCM ENGINE — HERMES KNOWLEDGE
//  Transforme automatiquement un document PDF en QCM interactif
// ══════════════════════════════════════════════════════════════

const pdfQcmState = {
  extractedPages: [],   // { pageNum, text, items }
  allText: '',
  allTerms: [],         // corpus de mots-clés du document
  generatedQuestions: [],
  selectedIndexes: new Set(),
  currentFile: null,
  pdfBase64: null,
};

// ── Initialisation du worker PDF.js ──────────────────────────
function initPdfWorker() {
  if (typeof pdfjsLib !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
}

// ══════════════════════════════════════════════════════════════
//  EXTRACTION DU TEXTE PDF
// ══════════════════════════════════════════════════════════════
async function extractPDFFullText(file) {
  initPdfWorker();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        const pages = [];
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          // Reconstitue les lignes en respectant les sauts de ligne
          const items = content.items;
          let pageText = '';
          let lastY = null;
          items.forEach(item => {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n';
            }
            pageText += item.str + ' ';
            lastY = item.transform[5];
          });
          pageText = pageText.replace(/ +/g, ' ').trim();
          pages.push({ pageNum: i, text: pageText });
          fullText += pageText + '\n\n';
        }

        pdfQcmState.extractedPages = pages;
        pdfQcmState.allText = fullText;
        resolve({ pages, fullText, numPages: pdf.numPages });
      } catch (err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// Encode PDF en base64 pour stockage et affichage étudiant
async function encodePDFBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ══════════════════════════════════════════════════════════════
//  NETTOYAGE ET SEGMENTATION
// ══════════════════════════════════════════════════════════════
function cleanText(text) {
  return text
    .replace(/\f/g, '\n')
    .replace(/-\n(\w)/g, '$1')          // tirets de coupure de ligne
    .replace(/\s*\n\s*/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/[""«»]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

function splitIntoSentences(text) {
  const clean = cleanText(text);
  // Segmentation respectant les abréviations courantes françaises
  const abbr = /(?:M\.|Mme\.|Dr\.|Prof\.|Art\.|al\.|etc\.|cf\.|N°|n°|p\.|pp\.)/gi;
  const placeholder = clean.replace(abbr, m => m.replace('.', '§§'));
  const sentences = placeholder
    .split(/(?<=[.!?])\s+(?=[A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ])/g)
    .map(s => s.replace(/§§/g, '.').trim())
    .filter(s => s.length > 25 && /[a-zA-ZÀ-ÿ]{3,}/.test(s));
  return sentences;
}

function splitIntoParagraphs(text) {
  return text.split(/\n{2,}/).map(p => cleanText(p)).filter(p => p.length > 40);
}

// ══════════════════════════════════════════════════════════════
//  EXTRACTION DES TERMES CLÉS (corpus)
// ══════════════════════════════════════════════════════════════
const STOP_FR = new Set([
  'le','la','les','un','une','des','du','de','d','l','et','est','en',
  'que','qui','que','sur','par','au','aux','ce','se','si','ne','pas',
  'pour','dans','avec','mais','ou','où','car','donc','or','ni','que',
  'sont','ont','être','avoir','this','the','and','que','son','sa','ses',
  'leur','leurs','lui','elle','elles','ils','nous','vous','je','tu','on',
  'plus','très','bien','tout','tous','aussi','même','dont','quand','comme',
  'selon','ainsi','alors','après','avant','depuis','jusqu','entre','vers',
  'lors','dont','ceci','cela','cet','cette','ces','mon','ton','tel',
  'tels','telle','telles','être','avoir','faire','dire','aller','voir'
]);

function extractCorpusTerms(text) {
  const words = text.toLowerCase()
    .split(/[\s,;:!?()\[\]{}"'\/\\|@#$%^&*+=<>~`]+/)
    .filter(w => w.length >= 4 && !STOP_FR.has(w) && /^[a-zàâéèêëîïôùûüçœæ]+$/.test(w));

  // Fréquence
  const freq = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });

  // Trier par fréquence (hors hapax)
  const terms = Object.entries(freq)
    .filter(([, f]) => f >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);

  // Aussi extraire noms propres (mots capitalisés hors début de phrase)
  const propNouns = [];
  const capPattern = /(?<=[.!?]\s|["«]\s*)([A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]{2,}(?:\s[A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][a-zàâéèêëîïôùûüç]{2,})*)/g;
  let m;
  while ((m = capPattern.exec(text)) !== null) {
    if (!STOP_FR.has(m[1].toLowerCase())) propNouns.push(m[1]);
  }

  pdfQcmState.allTerms = [...new Set([...terms, ...propNouns.map(p => p.toLowerCase())])];
  return pdfQcmState.allTerms;
}

// Capitalise le premier caractère
function cap(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : str; }

// Génère des distracteurs à partir du corpus
function generateDistractors(correctTerm, count, extraTerms) {
  const correct = correctTerm.toLowerCase().trim();
  const pool = [...(extraTerms || []), ...pdfQcmState.allTerms]
    .filter(t => t !== correct && t.length >= 3 && Math.abs(t.length - correct.length) < correct.length + 5);

  // Shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = [...new Set(pool)].slice(0, count);
  while (selected.length < count) {
    selected.push(['un autre concept', 'une définition différente', 'un terme non lié', 'aucune de ces réponses'][selected.length % 4]);
  }
  return selected.slice(0, count).map(cap);
}

// Mélange un tableau
function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ══════════════════════════════════════════════════════════════
//  STRATÉGIES DE GÉNÉRATION DE QUESTIONS
// ══════════════════════════════════════════════════════════════

// Stratégie 1 : Définitions "X est (un|une|le|la) Y"
function extractDefinitionQuestions(sentences) {
  const questions = [];
  const defPatterns = [
    /^(.{3,40}?)\s+est\s+(?:un|une|le|la|l'|l')\s+(.{10,120}?)(?:\.|,|;|$)/i,
    /^(.{3,40}?)\s+désigne\s+(.{10,100}?)(?:\.|,|;|$)/i,
    /^(.{3,40}?)\s+(?:se |s')appelle\s+(.{5,60}?)(?:\.|,|;|$)/i,
    /^(.{3,40}?)\s+correspond\s+à\s+(.{10,100}?)(?:\.|,|;|$)/i,
    /^(?:Le|La|L'|Un|Une)\s+(.{3,40}?)\s+est\s+(.{10,120}?)(?:\.|,|;|$)/i,
    /^(.{3,40}?)\s+(?:peut être défini|est défini)\s+(?:comme|comme étant)?\s+(.{10,100}?)(?:\.|,|;|$)/i,
  ];

  for (const sentence of sentences) {
    for (const pattern of defPatterns) {
      const m = sentence.match(pattern);
      if (!m) continue;
      const subject = cap(m[1].trim());
      const definition = cap(m[2].trim());
      if (subject.length < 3 || definition.length < 8) continue;
      if (STOP_FR.has(subject.toLowerCase())) continue;

      const distractors = generateDistractors(definition.split(' ')[0], 3);
      const options = shuffleArr([definition.slice(0,100), ...distractors]);
      const correctIdx = options.findIndex(o => o.toLowerCase().startsWith(definition.slice(0,20).toLowerCase()));

      questions.push({
        id: genId('qpdf'),
        type: 'mcq_single',
        text: `Que désigne ou représente « ${subject} » selon le document ?`,
        options,
        correctAnswer: correctIdx >= 0 ? correctIdx : 0,
        points: 2,
        explanation: `Selon le document : "${sentence.trim()}"`,
        source: 'definition',
        _correctText: definition,
      });
      break;
    }
  }
  return questions;
}

// Stratégie 2 : Faits numériques "il y a N / X compte N"
function extractNumericalQuestions(sentences) {
  const questions = [];
  const numPattern = /(.{5,60}?)\s+(\d+(?:[.,]\d+)?)\s+([a-zA-ZÀ-ÿ]{3,30})(.{0,60})/;

  for (const sentence of sentences) {
    const m = sentence.match(numPattern);
    if (!m) continue;
    const number = m[2].replace(',', '.');
    const noun = m[3];
    const n = parseFloat(number);
    if (isNaN(n)) continue;

    // Distracteurs numériques proches
    const variations = [
      Math.round(n * 0.6),
      Math.round(n * 1.5),
      Math.round(n * 2),
    ].map(String);

    const options = shuffleArr([number, ...variations]);
    const correctIdx = options.indexOf(number);

    questions.push({
      id: genId('qpdf'),
      type: 'mcq_single',
      text: `Selon le document, quel est le nombre de ${noun.toLowerCase()} mentionné ?`,
      options,
      correctAnswer: correctIdx,
      points: 1,
      explanation: `Le texte indique : "${sentence.trim().substring(0, 150)}"`,
      source: 'numerical',
    });
    if (questions.length >= 5) break;
  }
  return questions;
}

// Stratégie 3 : Questions de type "qui/quoi" sur les personnes et entités
function extractWhoWhatQuestions(sentences) {
  const questions = [];
  const patterns = [
    { re: /^([\w\s\-]{3,40}?)\s+(?:a créé|a fondé|a inventé|a établi|a rédigé|a publié)\s+(.{5,80})/i, q: (s,o) => `Qui a créé ou fondé « ${o} » selon le document ?`, ans: s => s },
    { re: /^([\w\s\-]{3,40}?)\s+(?:est né|est née)\s+(?:en|le|à)?\s+(.{3,40})/i, q: (s,o) => `Quand ou où « ${s} » est-il(elle) né(e) selon le document ?`, ans: (s,o) => o },
    { re: /^([A-ZÀÂÉÈÊËÎÏÔÙÛÜÇ][\w\s]{2,30}),?\s+(?:(?:premier|deuxième|président|directeur|ministre|chef|fondateur|auteur))\s+de\s+(.{5,60})/i, q: (s,o) => `Quel est le rôle de « ${s} » par rapport à « ${o} » ?`, ans: (s) => s },
  ];

  for (const sentence of sentences) {
    for (const { re, q, ans } of patterns) {
      const m = sentence.match(re);
      if (!m) continue;
      const subject = cap(m[1].trim());
      const obj = cap(m[2]?.trim() || '');
      const correctAnswer = ans(subject, obj).slice(0, 80);
      if (correctAnswer.length < 3 || STOP_FR.has(subject.toLowerCase())) continue;

      const distractors = generateDistractors(correctAnswer, 3);
      const options = shuffleArr([correctAnswer, ...distractors]);
      const correctIdx = options.findIndex(o => o.toLowerCase().includes(correctAnswer.toLowerCase().substring(0, 15)));

      questions.push({
        id: genId('qpdf'),
        type: 'mcq_single',
        text: q(subject, obj),
        options,
        correctAnswer: correctIdx >= 0 ? correctIdx : 0,
        points: 2,
        explanation: `Référence : "${sentence.trim().substring(0, 150)}"`,
        source: 'who_what',
      });
      break;
    }
  }
  return questions;
}

// Stratégie 4 : Vrai/Faux à partir d'affirmations factuelles
function extractTrueFalseQuestions(sentences) {
  const questions = [];
  // Préférer les phrases courtes, affirmatives, avec verbe "être/avoir/faire"
  const goodSentences = sentences.filter(s =>
    s.length < 200 && s.length > 30 &&
    /\b(est|sont|a|ont|permet|comprend|inclut|représente|constitue|joue|assure|garantit)\b/.test(s) &&
    !/\?|(!$)/.test(s) &&
    !/hypothèse|pourrait|peut-être|environ|parfois|souvent/.test(s.toLowerCase())
  );

  for (let i = 0; i < Math.min(goodSentences.length, 8); i++) {
    const s = goodSentences[i].trim();
    questions.push({
      id: genId('qpdf'),
      type: 'true_false',
      text: `Affirmation : « ${s.charAt(0).toUpperCase() + s.slice(1)} »`,
      correctAnswer: true,
      points: 1,
      explanation: `Cette affirmation est directement tirée du document.`,
      source: 'true_false',
    });
  }
  return questions;
}

// Stratégie 5 : Complétion de phrase (QCM avec lacune)
function extractCompletionQuestions(sentences) {
  const questions = [];

  for (const sentence of sentences) {
    if (sentence.length < 40 || sentence.length > 250) continue;

    // Identifier un mot-clé important à masquer
    const words = sentence.split(/\s+/);
    // Chercher un terme significatif (nom commun ou propre, ni début ni fin)
    const candidates = words
      .map((w, i) => ({ w, i }))
      .filter(({ w, i }) =>
        i > 0 && i < words.length - 1 &&
        w.length >= 5 &&
        !STOP_FR.has(w.toLowerCase().replace(/[^a-zàâéèêëîïôùûüç]/g, '')) &&
        /^[a-zA-ZÀ-ÿ]/.test(w)
      );

    if (!candidates.length) continue;
    const { w: keyword, i: kidx } = candidates[Math.floor(candidates.length / 2)];
    const cleanKw = keyword.replace(/[.,;:!?()]/g, '');
    if (cleanKw.length < 4) continue;

    const masked = words.map((w, i) => i === kidx ? '___' : w).join(' ');
    const distractors = generateDistractors(cleanKw.toLowerCase(), 3);
    const options = shuffleArr([cap(cleanKw), ...distractors]);
    const correctIdx = options.findIndex(o => o.toLowerCase() === cleanKw.toLowerCase());

    questions.push({
      id: genId('qpdf'),
      type: 'mcq_single',
      text: `Complétez la phrase tirée du document :\n« ${masked} »`,
      options,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      points: 2,
      explanation: `La phrase complète est : "${sentence.trim()}"`,
      source: 'completion',
    });

    if (questions.length >= 8) break;
  }
  return questions;
}

// Stratégie 6 : Questions sur les listes/énumérations
function extractListQuestions(sentences) {
  const questions = [];
  // Détecter les listes : "A, B, C et D"
  const listPattern = /(.{5,60}?)(?:comprend|inclut|comporte|contient|regroupe|englobe|réunit|sont)\s*:?\s*([^.]{15,200}(?:,\s*[^.]{3,60}){2,}(?:\s+et\s+[^.]{3,60})?)/i;

  for (const sentence of sentences) {
    const m = sentence.match(listPattern);
    if (!m) continue;

    const subject = cap(m[1].trim());
    const listStr = m[2];
    // Parser les éléments de la liste
    const items = listStr.split(/,|;\s*et\s+|,\s*et\s+|\bet\b/)
      .map(s => s.replace(/^\s*(et|ou|–|-)\s*/i, '').trim())
      .filter(s => s.length >= 3 && s.length <= 60);

    if (items.length < 3) continue;

    // Question "lequel fait partie de X ?"
    const correctItem = cap(items[0]);
    const wrongItems = generateDistractors(items[0], 3, items.slice(1).map(s => s.toLowerCase()));
    const options = shuffleArr([correctItem, ...wrongItems]);
    const correctIdx = options.findIndex(o => o.toLowerCase() === correctItem.toLowerCase());

    questions.push({
      id: genId('qpdf'),
      type: 'mcq_single',
      text: `Parmi les propositions suivantes, laquelle fait partie de « ${subject} » selon le document ?`,
      options,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      points: 2,
      explanation: `Le document indique : "${sentence.trim().substring(0, 150)}"`,
      source: 'list',
    });

    if (questions.length >= 5) break;
  }
  return questions;
}

// ══════════════════════════════════════════════════════════════
//  ORCHESTRATEUR : génère les questions depuis le texte
// ══════════════════════════════════════════════════════════════
function generateQCMFromText(fullText, options = {}) {
  const { maxQuestions = 15, types = ['mcq_single', 'true_false', 'completion'] } = options;

  extractCorpusTerms(fullText);
  const sentences = splitIntoSentences(fullText);

  let all = [];

  if (types.includes('mcq_single') || types.includes('definition')) {
    all.push(...extractDefinitionQuestions(sentences));
  }
  if (types.includes('mcq_single') || types.includes('completion')) {
    all.push(...extractCompletionQuestions(sentences));
  }
  if (types.includes('mcq_single') || types.includes('list')) {
    all.push(...extractListQuestions(sentences));
  }
  if (types.includes('mcq_single') || types.includes('numerical')) {
    all.push(...extractNumericalQuestions(sentences));
  }
  if (types.includes('mcq_single') || types.includes('who_what')) {
    all.push(...extractWhoWhatQuestions(sentences));
  }
  if (types.includes('true_false')) {
    all.push(...extractTrueFalseQuestions(sentences));
  }

  // Dédoublonner par texte de question
  const seen = new Set();
  all = all.filter(q => {
    const key = q.text.substring(0, 50).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Trier: définitions en premier, puis complétions, puis V/F
  const priority = { definition:0, list:1, completion:2, numerical:3, who_what:4, true_false:5 };
  all.sort((a,b) => (priority[a.source]||9) - (priority[b.source]||9));

  return all.slice(0, maxQuestions);
}

// ══════════════════════════════════════════════════════════════
//  UI — PANNEAU D'IMPORT PDF
// ══════════════════════════════════════════════════════════════
function openPdfImportPanel() {
  const panel = document.getElementById('pdf-import-panel');
  if (!panel) return;
  panel.style.display = 'block';
  // Reset
  pdfQcmState.generatedQuestions = [];
  pdfQcmState.selectedIndexes = new Set();
  panel.querySelector('#pdf-import-preview').style.display = 'none';
  panel.querySelector('#pdf-import-dropzone').style.display = 'flex';
  panel.querySelector('#pdf-gen-results').innerHTML = '';
  panel.querySelector('#pdf-gen-results').style.display = 'none';
  panel.querySelector('#pdf-add-btn').style.display = 'none';
}

function closePdfImportPanel() {
  const panel = document.getElementById('pdf-import-panel');
  if (panel) panel.style.display = 'none';
}

async function handlePdfFileSelect(input) {
  const file = input?.files?.[0];
  if (!file || file.type !== 'application/pdf') {
    showNotif('Sélectionnez un fichier PDF valide.', 'error');
    return;
  }
  pdfQcmState.currentFile = file;

  // Show progress
  const dropzone = document.getElementById('pdf-import-dropzone');
  const progress = document.getElementById('pdf-import-preview');
  if (dropzone) dropzone.style.display = 'none';
  if (progress) {
    progress.style.display = 'flex';
    progress.innerHTML = `
      <div style="text-align:center;padding:1.5rem;">
        <div style="display:inline-block;width:40px;height:40px;border:3px solid #e2e8f0;border-top-color:#2d6a4f;border-radius:50%;animation:spin 0.8s linear infinite;margin-bottom:0.75rem;"></div>
        <div style="font-size:0.88rem;font-weight:600;color:#1e293b;" id="pdf-extract-status">Extraction du texte…</div>
        <div style="font-size:0.75rem;color:#94A3B8;margin-top:0.25rem;" id="pdf-extract-sub">Veuillez patienter</div>
      </div>`;
  }

  try {
    // Encode PDF for student reference
    pdfQcmState.pdfBase64 = await encodePDFBase64(file);

    // Extract text
    document.getElementById('pdf-extract-status').textContent = `Lecture du PDF « ${file.name} »…`;
    const { fullText, numPages } = await extractPDFFullText(file);
    document.getElementById('pdf-extract-status').textContent = `Analyse de ${numPages} page(s)…`;
    document.getElementById('pdf-extract-sub').textContent = `${fullText.split(/\s+/).length} mots extraits`;

    await new Promise(r => setTimeout(r, 400));

    // Generate questions
    document.getElementById('pdf-extract-status').textContent = 'Génération des questions…';
    await new Promise(r => setTimeout(r, 100));

    const maxQ = parseInt(document.getElementById('pdf-max-questions')?.value || '12');
    const types = ['mcq_single', 'true_false', 'completion'];
    const questions = generateQCMFromText(fullText, { maxQuestions: maxQ, types });

    pdfQcmState.generatedQuestions = questions;

    if (progress) {
      progress.innerHTML = `
        <div style="display:flex;align-items:center;gap:0.75rem;padding:0.85rem;background:#f0fdf4;border:1px solid #86efac;border-radius:12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:#16a34a;">${questions.length} question${questions.length>1?'s':''} générée${questions.length>1?'s':''}</div>
            <div style="font-size:0.73rem;color:#64748b;">depuis « ${file.name} » (${numPages} page${numPages>1?'s':''})</div>
          </div>
          <button onclick="openPdfImportPanel()" style="margin-left:auto;font-size:0.72rem;color:#94A3B8;background:none;border:none;cursor:pointer;text-decoration:underline;">Réinitialiser</button>
        </div>`;
    }

    renderGeneratedQCM(questions);

  } catch (err) {
    console.error(err);
    if (progress) progress.innerHTML = `<div style="color:#dc2626;font-size:0.85rem;padding:1rem;">Erreur d'extraction : ${err.message}</div>`;
    showNotif('Erreur lors de la lecture du PDF.', 'error');
  }
}

function renderGeneratedQCM(questions) {
  const container = document.getElementById('pdf-gen-results');
  const addBtn = document.getElementById('pdf-add-btn');
  if (!container) return;

  if (!questions.length) {
    container.style.display = 'block';
    container.innerHTML = `<div style="text-align:center;padding:1.5rem;color:#94A3B8;font-size:0.85rem;">Aucune question détectée. Essayez un PDF avec plus de contenu textuel structuré.</div>`;
    return;
  }

  // Tout sélectionner par défaut
  pdfQcmState.selectedIndexes = new Set(questions.map((_, i) => i));

  const typeLabel = { mcq_single:'QCM', true_false:'Vrai/Faux', mcq_multiple:'QCM multiple', completion:'Complétion' };
  const typeColor = { mcq_single:'#2563eb', true_false:'#d97706', completion:'#7c3aed' };
  const sourceLabel = { definition:'Définition', completion:'Complétion', list:'Énumération', numerical:'Chiffre', who_what:'Identité', true_false:'Vrai/Faux' };

  container.style.display = 'block';
  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
      <div style="font-size:0.8rem;font-weight:700;color:#1e293b;">${questions.length} questions générées <span style="color:#94A3B8;font-weight:400;">— cochez celles à ajouter</span></div>
      <div style="display:flex;gap:0.4rem;">
        <button onclick="pdfSelectAll(true)" style="font-size:0.72rem;color:#2d6a4f;background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:0.25rem 0.6rem;cursor:pointer;font-family:'DM Sans',sans-serif;">Tout</button>
        <button onclick="pdfSelectAll(false)" style="font-size:0.72rem;color:#64748b;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:0.25rem 0.6rem;cursor:pointer;font-family:'DM Sans',sans-serif;">Aucun</button>
      </div>
    </div>
    <div id="pdf-qcm-list" style="display:flex;flex-direction:column;gap:0.5rem;max-height:340px;overflow-y:auto;scrollbar-width:thin;">
      ${questions.map((q, i) => `
        <div id="pdf-qrow-${i}" style="background:#fff;border:1.5px solid ${pdfQcmState.selectedIndexes.has(i)?'#86efac':'#e2e8f0'};border-radius:10px;padding:0.75rem;cursor:pointer;transition:border-color 0.15s;" onclick="togglePdfQSelect(${i})">
          <div style="display:flex;align-items:flex-start;gap:0.6rem;">
            <div id="pdf-qcheck-${i}" style="width:18px;height:18px;border-radius:5px;border:2px solid ${pdfQcmState.selectedIndexes.has(i)?'#16a34a':'#cbd5e1'};background:${pdfQcmState.selectedIndexes.has(i)?'#16a34a':'#fff'};display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;transition:all 0.15s;">
              ${pdfQcmState.selectedIndexes.has(i)?'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.3rem;flex-wrap:wrap;">
                <span style="font-size:0.65rem;font-weight:700;color:${typeColor[q.type]||'#64748b'};background:${typeColor[q.type]||'#64748b'}18;padding:0.12rem 0.45rem;border-radius:50px;">${typeLabel[q.type]||q.type}</span>
                <span style="font-size:0.62rem;color:#94A3B8;">${sourceLabel[q.source]||''}</span>
                <span style="font-size:0.62rem;color:#2d6a4f;margin-left:auto;">${q.points} pt${q.points>1?'s':''}</span>
              </div>
              <div style="font-size:0.82rem;color:#1e293b;line-height:1.45;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${q.text}</div>
              ${q.options ? `<div style="margin-top:0.4rem;display:flex;gap:0.3rem;flex-wrap:wrap;">${q.options.slice(0,3).map((o,oi) => `<span style="font-size:0.68rem;padding:0.1rem 0.45rem;border-radius:50px;background:${oi===q.correctAnswer?'#f0fdf4':'#f8fafc'};border:1px solid ${oi===q.correctAnswer?'#86efac':'#e2e8f0'};color:${oi===q.correctAnswer?'#16a34a':'#94A3B8'};">${o.substring(0,30)}${o.length>30?'…':''}</span>`).join('')}</div>` : ''}
            </div>
          </div>
        </div>`).join('')}
    </div>`;

  if (addBtn) {
    addBtn.style.display = 'flex';
    updatePdfAddBtn();
  }
}

function togglePdfQSelect(i) {
  if (pdfQcmState.selectedIndexes.has(i)) {
    pdfQcmState.selectedIndexes.delete(i);
  } else {
    pdfQcmState.selectedIndexes.add(i);
  }
  // Update UI
  const row = document.getElementById('pdf-qrow-' + i);
  const check = document.getElementById('pdf-qcheck-' + i);
  const sel = pdfQcmState.selectedIndexes.has(i);
  if (row) row.style.borderColor = sel ? '#86efac' : '#e2e8f0';
  if (check) {
    check.style.borderColor = sel ? '#16a34a' : '#cbd5e1';
    check.style.background = sel ? '#16a34a' : '#fff';
    check.innerHTML = sel ? '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '';
  }
  updatePdfAddBtn();
}

function pdfSelectAll(select) {
  if (select) {
    pdfQcmState.generatedQuestions.forEach((_, i) => pdfQcmState.selectedIndexes.add(i));
  } else {
    pdfQcmState.selectedIndexes.clear();
  }
  renderGeneratedQCM(pdfQcmState.generatedQuestions);
}

function updatePdfAddBtn() {
  const btn = document.getElementById('pdf-add-btn');
  if (!btn) return;
  const count = pdfQcmState.selectedIndexes.size;
  btn.textContent = `Ajouter ${count} question${count!==1?'s':''} à l'évaluation`;
  btn.disabled = count === 0;
  btn.style.opacity = count === 0 ? '0.4' : '1';
}

function addSelectedPdfQuestions() {
  const selected = [...pdfQcmState.selectedIndexes]
    .sort((a, b) => a - b)
    .map(i => pdfQcmState.generatedQuestions[i]);

  if (!selected.length) { showNotif('Sélectionnez au moins une question.', 'error'); return; }

  // Ajouter au draft
  assessState.draftQuestions.push(...selected.map(q => ({
    id: genId('q'),
    type: q.type,
    text: q.text,
    options: q.options,
    correctAnswer: q.correctAnswer,
    points: q.points,
    explanation: q.explanation,
  })));

  // Attacher le PDF à l'évaluation draft
  if (pdfQcmState.pdfBase64) {
    assessState.draftPdfData = pdfQcmState.pdfBase64;
    assessState.draftPdfName = pdfQcmState.currentFile?.name || 'document.pdf';
  }

  closePdfImportPanel();
  renderDraftQuestions();

  // Afficher badge PDF attaché
  const badge = document.getElementById('acreator-pdf-badge');
  if (badge) {
    badge.style.display = 'flex';
    badge.querySelector('#acreator-pdf-name').textContent = pdfQcmState.currentFile?.name || 'document.pdf';
  }

  showNotif(`${selected.length} question${selected.length>1?'s':''} ajoutée${selected.length>1?'s':''} depuis le PDF !`, 'success');
}

// ══════════════════════════════════════════════════════════════
//  INTÉGRATION DANS saveAssessment (patch)
// ══════════════════════════════════════════════════════════════
const _origSaveAssessment = typeof saveAssessment !== 'undefined' ? saveAssessment : null;

function saveAssessmentWithPdf() {
  const title = document.getElementById('acreator-title')?.value.trim();
  if (!title) { showNotif('Saisissez un titre pour l\'évaluation.', 'error'); return; }
  if (!assessState.draftQuestions.length) { showNotif('Ajoutez au moins une question.', 'error'); return; }

  const a = {
    id: assessState.editingId || genId('assess'),
    title,
    description: document.getElementById('acreator-desc')?.value.trim() || '',
    trainerId: auth.userId,
    trainerName: auth.userName || '',
    duration: parseInt(document.getElementById('acreator-duration')?.value) || 0,
    passingScore: parseInt(document.getElementById('acreator-passing')?.value) || 70,
    maxAttempts: parseInt(document.getElementById('acreator-attempts')?.value) || 0,
    badgeThreshold: parseInt(document.getElementById('acreator-badge')?.value) || 70,
    questions: assessState.draftQuestions,
    pdfData: assessState.draftPdfData || (assessState.editingId ? getAssessment(assessState.editingId)?.pdfData : null),
    pdfName: assessState.draftPdfName || (assessState.editingId ? getAssessment(assessState.editingId)?.pdfName : null),
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

  assessState.draftPdfData = null;
  assessState.draftPdfName = null;
  saveAppData(false);
  closeAssessmentCreator();
  renderTrainerAssessments();
  showNotif('Évaluation sauvegardée.', 'success');
}

// Override de saveAssessment pour inclure le PDF
window.saveAssessment = saveAssessmentWithPdf;

// ══════════════════════════════════════════════════════════════
//  LECTEUR PDF POUR L'ÉTUDIANT (pendant l'évaluation)
// ══════════════════════════════════════════════════════════════
function openStudentPdfViewer(assessmentId) {
  const a = getAssessment(assessmentId);
  if (!a?.pdfData) return;

  const overlay = document.getElementById('student-pdf-overlay');
  if (!overlay) return;

  const iframe = overlay.querySelector('#student-pdf-iframe');
  if (iframe) {
    // Utiliser blob URL pour charger le PDF dans l'iframe
    try {
      const byteString = atob(a.pdfData.split(',')[1]);
      const mimeString = 'application/pdf';
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      const blobUrl = URL.createObjectURL(blob);
      iframe.src = blobUrl;
    } catch(e) {
      iframe.src = a.pdfData;
    }
  }

  overlay.querySelector('#spdf-name').textContent = a.pdfName || 'Document de référence';
  overlay.style.display = 'flex';
}

function closeStudentPdfViewer() {
  const overlay = document.getElementById('student-pdf-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    const iframe = overlay.querySelector('#student-pdf-iframe');
    if (iframe) iframe.src = '';
  }
}

// Patch renderAssessQuestion pour afficher le bouton PDF si disponible
const _origRenderAssessQuestion = typeof renderAssessQuestion !== 'undefined' ? renderAssessQuestion : null;
function renderAssessQuestion() {
  if (_origRenderAssessQuestion) _origRenderAssessQuestion();
  // Afficher bouton PDF si l'évaluation a un PDF
  const a = getAssessment(assessState.currentAssessmentId);
  const pdfBtn = document.getElementById('assess-pdf-ref-btn');
  if (pdfBtn) {
    pdfBtn.style.display = a?.pdfData ? 'flex' : 'none';
    if (a?.pdfData) {
      pdfBtn.onclick = () => openStudentPdfViewer(a.id);
    }
  }
}

// CSS animation spinner (injecté dynamiquement)
if (!document.getElementById('pdf-qcm-style')) {
  const style = document.createElement('style');
  style.id = 'pdf-qcm-style';
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    #pdf-qcm-list::-webkit-scrollbar { width: 4px; }
    #pdf-qcm-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
  `;
  document.head.appendChild(style);
}
