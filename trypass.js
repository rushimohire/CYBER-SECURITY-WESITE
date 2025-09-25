// PASSWORD GENERATOR SCRIPT

// wordlist for passphrase (small list; you can expand)
const WORDS = ["alpha","bravo","charlie","delta","echo","foxtrot","golf","hotel","india","juliet","kilo","lima","mango","nova","omega","panda","quartz","radar","sigma","tango"];

function applyPreset(preset) {
  const lenEl = document.getElementById('length');
  const u = document.getElementById('opt-upper');
  const l = document.getElementById('opt-lower');
  const d = document.getElementById('opt-digits');
  const s = document.getElementById('opt-symbols');

  switch (preset) {
    case 'pin':
      lenEl.value = 6;
      u.checked = false; l.checked = false; d.checked = true; s.checked = false;
      break;
    case 'alpha':
      lenEl.value = 12;
      u.checked = true; l.checked = true; d.checked = false; s.checked = false;
      break;
    case 'alnum':
      lenEl.value = 12;
      u.checked = true; l.checked = true; d.checked = true; s.checked = false;
      break;
    case 'strong':
      lenEl.value = 16;
      u.checked = true; l.checked = true; d.checked = true; s.checked = true;
      break;
    case 'passphrase':
      lenEl.value = 4; // means 4 words
      u.checked = false; l.checked = false; d.checked = false; s.checked = false;
      break;
    default:
      // do nothing
      break;
  }
}

// characters pools
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // removed ambiguous O
const LOWER = "abcdefghijkmnpqrstuvwxyz"; // removed ambiguous l
const DIGITS = "23456789"; // removed 0 and 1 if you prefer
const SYMBOLS = "!@#$%^&*()-_=+[]{}<>?/";

// generate password based on user choices
function generatePassword() {
  const length = parseInt(document.getElementById('length').value, 10) || 12;
  const isUpper = document.getElementById('opt-upper').checked;
  const isLower = document.getElementById('opt-lower').checked;
  const isDigits = document.getElementById('opt-digits').checked;
  const isSymbols = document.getElementById('opt-symbols').checked;
  const preset = document.getElementById('preset').value;

  // passphrase flow
  if (preset === 'passphrase') {
    const words = [];
    for (let i = 0; i < Math.max(1, length); i++) {
      words.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
    }
    const passphrase = words.join('-');
    showResult(passphrase);
    return;
  }

  // build pool
  let pool = "";
  if (isUpper) pool += UPPER;
  if (isLower) pool += LOWER;
  if (isDigits) pool += DIGITS;
  if (isSymbols) pool += SYMBOLS;

  if (!pool) {
    alert("Choose at least one character type.");
    return;
  }

  // ensure at least one of each selected type is present
  const must = [];
  if (isUpper) must.push(randomChar(UPPER));
  if (isLower) must.push(randomChar(LOWER));
  if (isDigits) must.push(randomChar(DIGITS));
  if (isSymbols) must.push(randomChar(SYMBOLS));

  let pwdArr = [];
  // add required chars first
  pwdArr = pwdArr.concat(must);

  // fill remaining
  for (let i = pwdArr.length; i < length; i++) {
    pwdArr.push(randomChar(pool));
  }

  // shuffle
  pwdArr = shuffleArray(pwdArr);

  const password = pwdArr.join('');
  showResult(password);
}

// helper: random char
function randomChar(str) {
  return str.charAt(Math.floor(Math.random() * str.length));
}

// helper: Fisher-Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// show result and compute strength/entropy
function showResult(pwd) {
  const out = document.getElementById('generated');
  out.value = pwd;

  // entropy estimate: log2(poolSize^length) = length * log2(pool)
  let poolSize = 0;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

  if (hasUpper) poolSize += UPPER.length;
  if (hasLower) poolSize += LOWER.length;
  if (hasDigit) poolSize += DIGITS.length;
  if (hasSymbol) poolSize += SYMBOLS.length;

  // if passphrase (words with hyphens), estimate differently
  let entropy = 0;
  if (pwd.includes('-')) {
    const wordsCount = pwd.split('-').length;
    // assume WORDS.length possibilities each
    entropy = Math.log2(Math.pow(WORDS.length, wordsCount));
  } else {
    const length = pwd.length;
    if (poolSize === 0) poolSize = 1;
    entropy = length * Math.log2(poolSize);
  }

  const strengthText = (entropy >= 80) ? "Very strong" : (entropy >= 60) ? "Strong" : (entropy >= 40) ? "Medium" : "Weak";

  document.getElementById('strength').innerText = "Strength: " + strengthText;
  document.getElementById('entropy').innerText = "Entropy: " + Math.round(entropy) + " bits";
}

// copy
function copyPassword() {
  const out = document.getElementById('generated');
  out.select();
  out.setSelectionRange(0, 99999);
  try {
    document.execCommand('copy');
    alert('Password copied to clipboard');
  } catch (e) {
    navigator.clipboard.writeText(out.value).then(()=> alert('Password copied to clipboard'));
  }
}
