let words = [];
let shownIndices = [];
let currentFileName = 'index.json';
let japaneseVoice = null;

function loadJapaneseVoice(attempts = 10) {
  const voices = speechSynthesis.getVoices();

  if (!voices.length && attempts > 0) {
    return setTimeout(() => loadJapaneseVoice(attempts - 1), 250);
  }

  japaneseVoice = voices.find(voice => voice.lang === 'ja-JP') ||
                  voices.find(voice => voice.lang && voice.lang.toLowerCase().includes('ja'));

  if (!japaneseVoice && attempts === 0) {
    const warning = document.getElementById('browserWarning');
    if (warning) warning.style.display = 'inline';
  }
}

if ('onvoiceschanged' in speechSynthesis) {
  speechSynthesis.onvoiceschanged = () => loadJapaneseVoice(10);
}
loadJapaneseVoice();

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function loadShownIndices(key) {
  const cookie = getCookie(key);
  return cookie ? JSON.parse(cookie) : [];
}

function saveShownIndices(key, indices) {
  setCookie(key, JSON.stringify(indices));
}

async function loadWords(fileName = 'index.json') {
  try {
    currentFileName = fileName;
    const res = await fetch(fileName);
    words = await res.json();

    const cookieKey = `shownIndices_${fileName}`;
    shownIndices = loadShownIndices(cookieKey);
    if (shownIndices.length >= words.length) {
      shownIndices = [];
      saveShownIndices(cookieKey, shownIndices);
    }

    loadRandomWord();
  } catch (error) {
    document.getElementById('word').textContent = 'Failed to load file.';
    document.getElementById('kana').textContent = '';
    document.getElementById('meaning').textContent = '';
    console.error('Error loading JSON:', error);
  }
}

function loadRandomWord(fileName = currentFileName) {
  if (words.length === 0) return;

  let availableIndices = words.map((_, i) => i).filter(i => !shownIndices.includes(i));
  if (availableIndices.length === 0) {
    shownIndices = [];
    saveShownIndices(`shownIndices_${fileName}`, shownIndices);
    availableIndices = words.map((_, i) => i);
  }

  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  const word = words[randomIndex];

  document.getElementById('word').textContent = word.word;
  document.getElementById('kana').textContent = word.kana;
  document.getElementById('meaning').textContent = word.meaning;

  shownIndices.push(randomIndex);
  saveShownIndices(`shownIndices_${fileName}`, shownIndices);

  const learnedKey = `learnedWords_${fileName}`;
  let learnedWords = loadShownIndices(learnedKey);
  if (!learnedWords.includes(word.word)) {
    learnedWords.push(word.word);
    saveShownIndices(learnedKey, learnedWords);
  }
}

function loadSelectedJSON() {
  const select = document.getElementById('levelSelector');
  loadWords(select.value);
}

loadWords();

document.getElementById('speakKanaBtn').addEventListener('click', () => {
  const kanaText = document.getElementById('kana').textContent;
  const button = document.getElementById('speakKanaBtn');

  if (!kanaText) return;

  if (!japaneseVoice) {
    alert('Japanese voice not available on this device or browser. Try Chrome or Firefox.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(kanaText);
  utterance.voice = japaneseVoice;
  utterance.lang = 'ja-JP';

  utterance.onstart = () => {
    button.disabled = true;
  };

  utterance.onend = () => {
    button.disabled = false;
  };

  speechSynthesis.speak(utterance);
});
