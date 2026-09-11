const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const requiredIds = [
  'screenTitle', 'screenQuestions', 'screenEvaluating', 'screenCertificate', 'screenTransition',
  'candidateName', 'btnStart', 'stepIndicator', 'progressBar', 'questionContainer',
  'btnPrev', 'btnNext', 'evaluatingSubtitle', 'btnToggleAudio', 'btnSettings',
  'settingsModal', 'btnCloseSettings', 'btnSaveSettings', 'inputGeminiKey', 'selectModel', 'apiStatusBadge'
];

let missing = [];
requiredIds.forEach(id => {
  if (!html.includes(`id="${id}"`)) missing.push(id);
});

if (missing.length > 0) {
  console.error('Missing IDs in index.html:', missing);
  process.exit(1);
} else {
  console.log('✓ All 21 essential DOM elements verified in index.html');
}

const scripts = [
  'js/fallback-bank.js',
  'js/persona-prompt.js',
  'js/api-client.js',
  'js/audio.js',
  'js/certificate.js',
  'js/app.js'
];

scripts.forEach(s => {
  if (!fs.existsSync(s)) {
    console.error('Missing script file:', s);
    process.exit(1);
  }
});
console.log('✓ All 6 referenced JavaScript files exist on disk');

const css = fs.readFileSync('css/style.css', 'utf8');
if (css.includes('.certificate-frame') && css.includes('.rubber-stamp') && css.includes('.kerala-kasavu-strip')) {
  console.log('✓ CSS design system and certificate styles verified');
} else {
  console.error('CSS missing core styles');
  process.exit(1);
}
console.log('ALL DOM INTEGRITY CHECKS PASSED!');
