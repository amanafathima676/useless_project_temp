const fs = require('fs');

// 1. Verify index.html essential elements
const html1 = fs.readFileSync('index.html', 'utf8');
const act1RequiredIds = [
  'screenTitle', 'screenQuestions', 'screenEvaluating', 'screenCertificate', 'screenTransition',
  'candidateName', 'btnStart', 'stepIndicator', 'progressBar', 'questionContainer',
  'btnPrev', 'btnNext', 'evaluatingSubtitle', 'settingsModal', 'btnCloseSettings',
  'btnSaveSettings', 'inputGeminiKey', 'selectModel'
];

let missing1 = [];
act1RequiredIds.forEach(id => {
  if (!html1.includes(`id="${id}"`)) missing1.push(id);
});

if (missing1.length > 0) {
  console.error('Missing IDs in index.html:', missing1);
  process.exit(1);
} else {
  console.log(`✓ All ${act1RequiredIds.length} essential DOM elements verified in index.html`);
}

// 2. Verify act2.html essential elements
const html2 = fs.readFileSync('act2.html', 'utf8');
const act2RequiredIds = [
  'act2Video', 'act2HudCanvas', 'act2RadarCanvas', 'act2Timer', 'act2ActiveZoneBox',
  'pillAcademics', 'pillHackathons', 'pillSkillDev', 'pillArtsSports',
  'act2IntroOverlay', 'act2CountdownOverlay', 'act2CountdownNumber',
  'act2ResultContainer', 'barAcademics', 'barHackathons', 'barSkillDev', 'barArtsSports',
  'vitalSleep', 'vitalHappiness', 'vitalPassion', 'vitalMental'
];

let missing2 = [];
act2RequiredIds.forEach(id => {
  if (!html2.includes(`id="${id}"`)) missing2.push(id);
});

if (missing2.length > 0) {
  console.error('Missing IDs in act2.html:', missing2);
  process.exit(1);
} else {
  console.log(`✓ All ${act2RequiredIds.length} essential DOM elements verified in act2.html`);
}

// 3. Verify all JavaScript files exist on disk
const scripts = [
  'server.js',
  'js/fallback-bank.js',
  'js/persona-prompt.js',
  'js/api-client.js',
  'js/audio.js',
  'js/kinetic-grid.js',
  'js/certificate.js',
  'js/app.js',
  'js/zone-mapper.js',
  'js/stat-engine.js',
  'js/audio-synthesizer.js',
  'js/radar-chart.js',
  'js/result-card.js',
  'js/hand-tracker.js',
  'js/act2-app.js',
  'test_act2.js'
];

scripts.forEach(s => {
  if (!fs.existsSync(s)) {
    console.error('Missing script file:', s);
    process.exit(1);
  }
});
console.log(`✓ All ${scripts.length} project JavaScript files exist on disk`);

// 4. Verify CSS files
const css1 = fs.readFileSync('css/style.css', 'utf8');
const css2 = fs.readFileSync('css/act2.css', 'utf8');

if (css1.includes('.certificate-frame') && css1.includes('.rubber-stamp') && css2.includes('.act2-arena')) {
  console.log('✓ CSS design system and Act 2 cyber styles verified');
} else {
  console.error('CSS missing core styles');
  process.exit(1);
}

console.log('ALL DOM AND MODULE INTEGRITY CHECKS PASSED!');
