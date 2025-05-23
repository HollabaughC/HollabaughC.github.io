import('./header.js');

let words = [];

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

function loadLearnedWords(key) {
  const cookie = getCookie(key);
  return cookie ? JSON.parse(cookie) : [];
}

function saveLearnedWords(key, words) {
  setCookie(key, JSON.stringify(words));
}

async function loadWords(fileName = 'index.json') {
  try {
    const res = await fetch(fileName);
    words = await res.json();
    const learnedKey = `learnedWords_${fileName}`;
    const learnedWords = loadLearnedWords(learnedKey);
    const learnedEntries = words.filter(w => learnedWords.includes(w.word));
    displayDictionary(learnedEntries);
  } catch (error) {
    console.error('Error loading JSON:', error);
    document.querySelector('.dictionary-container')?.remove();
    const errorDiv = document.createElement('div');
    errorDiv.textContent = 'Failed to load dictionary file.';
    document.body.appendChild(errorDiv);
  }
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const jaVoice = voices.find(voice => voice.lang.startsWith('ja')) || null;
    if (jaVoice) {
      utterance.voice = jaVoice;
      utterance.lang = jaVoice.lang;
    } else {
      utterance.lang = 'ja-JP';
    }
    speechSynthesis.speak(utterance);
  } else {
    alert('Speech synthesis not supported in this browser.');
  }
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices();
  };
}

function displayDictionary(learnedEntries) {
  const existingContainer = document.querySelector('.dictionary-container');
  if (existingContainer) existingContainer.remove();

  const container = document.createElement('div');
  container.className = 'dictionary-container';

  const table = document.createElement('table');
  table.className = 'dictionary-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Ainu Word</th>
      <th>Katakana</th>
      <th>Meaning</th>
      <th>Speak</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  learnedEntries.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.word}</td>
      <td>${entry.kana}</td>
      <td>${entry.meaning}</td>
    `;

    const speakCell = document.createElement('td');
    const speakBtn = document.createElement('button');
    speakBtn.textContent = '🔊';
    speakBtn.title = `Speak: ${entry.kana}`;
    speakBtn.style.cursor = 'pointer';
    speakBtn.style.fontSize = '1.2em';
    speakBtn.style.padding = '4px 8px';
    speakBtn.style.borderRadius = '8px';
    speakBtn.style.border = '1px solid #a37d52';
    speakBtn.style.background = 'transparent';
    speakBtn.style.color = '#7c4b2c';
    speakBtn.style.transition = 'color 0.3s ease';

    speakBtn.addEventListener('mouseenter', () => {
      speakBtn.style.color = '#a37d52';
    });
    speakBtn.addEventListener('mouseleave', () => {
      speakBtn.style.color = '#7c4b2c';
    });

    speakBtn.addEventListener('click', () => speakText(entry.kana));
    speakCell.appendChild(speakBtn);
    row.appendChild(speakCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
  document.body.appendChild(container);
}

window.loadSelectedJSON = function() {
  const select = document.getElementById('levelSelector');
  const fileName = select.value;
  loadWords(fileName);
};

window.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('levelSelector');
  loadWords(select.value);
});