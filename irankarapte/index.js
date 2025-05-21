let words = [];
let shownIndices = [];
let currentFileName = 'index.json'; // default

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
    currentFileName = fileName; // store globally

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
