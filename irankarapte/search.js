import('./header.js');

let words = [];
let currentFileName = 'index.json';

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
  currentFileName = fileName;
  try {
    const res = await fetch(fileName);
    words = await res.json();
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

  let shownIndices = loadShownIndices(`shownIndices_${fileName}`);

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

function loadLearnedWords(fileName) {
  const cookieKey = `learnedWords_${fileName}`;
  const learned = getCookie(cookieKey);
  return learned ? JSON.parse(learned) : [];
}

function searchWords(words, query, learnedWords) {
  const lowerQuery = query.toLowerCase();
  return words
    .filter(word => learnedWords.includes(word.word))
    .filter(word => 
      word.word.toLowerCase().includes(lowerQuery) ||
      word.kana.toLowerCase().includes(lowerQuery) ||
      word.meaning.toLowerCase().includes(lowerQuery)
    );
}

function displayResults(filteredWords) {
  const container = document.createElement('div');
  container.className = 'search-container';

  const table = document.createElement('table');
  table.className = 'dictionary-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Ainu Word</th>
      <th>Katakana</th>
      <th>Meaning</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  if (filteredWords.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `<td colspan="3">No results found</td>`;
    tbody.appendChild(row);
  } else {
    filteredWords.forEach(entry => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.word}</td>
        <td>${entry.kana}</td>
        <td>${entry.meaning}</td>
      `;
      tbody.appendChild(row);
    });
  }

  table.appendChild(tbody);
  container.appendChild(table);

  const existingResults = document.querySelector('.search-container');
  if (existingResults) {
    existingResults.remove();
  }

  document.body.appendChild(container);
}

function createSearchInput() {
  const existingInput = document.querySelector('.search-input-container');
  if (existingInput) existingInput.remove();

  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-input-container';
  searchContainer.innerHTML = `
    <input type="text" id="search" placeholder="Search for a word..." />
    <button id="searchButton">Search</button>
  `;
  document.body.appendChild(searchContainer);

  const searchButton = document.getElementById('searchButton');
  const searchInput = document.getElementById('search');

  searchButton.addEventListener('click', function() {
    const query = searchInput.value.trim();
    if (query) {
      const learnedWords = loadLearnedWords(currentFileName);
      const filteredWords = searchWords(words, query, learnedWords);
      displayResults(filteredWords);
    }
  });
}

window.loadSelectedJSON = function() {
  const select = document.getElementById('levelSelector');
  loadWords(select.value);
  createSearchInput();
}

loadWords();
createSearchInput();
