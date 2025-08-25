const programs = [
  { title: "My GitHub", link: "https://github.com/HollabaughC", icon: "../cs/img/github.png", subtitle: "See all the source code!" },
  { title: "This Site (2025 to Now)", link: "../index.html", icon: "../img/cam.png", subtitle: "This button just takes you back to the homepage." },
  { title: "D&D Creator (2023)", link: "../cs/DND/static/index.html", icon: "../cs/img/dnd.png", subtitle: "Click here to create a D&D character in just 2 easy steps!" },
  { title: "Costco Picker (2024)", link: "../cs/costco/index.html", icon: "../cs/img/costco.png", subtitle: "Can't decide what to eat at Costco? Click here!" },
  { title: "Irankarapte (2025)", link: "../irankarapte/index.html", icon: "../irankarapte/icon.png", subtitle: "Learn Ainu here!" },
  { title: "Project Chip (2025)", link: "../cs/projectchip/index.html", icon: "../cs/img/chip.png", subtitle: "A portal for games based on Chip the Beaver." },
  { title: "Sapporo (2025)", link: "../cs/sapporo/index.html", icon: "../cs/img/sapporo.png", subtitle: "A web-based text adventure game!" }
];

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const clearBtn = document.querySelector('.clear-text');

function renderResults(items) {
  searchResults.innerHTML = '';
  items.forEach(item => {
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-item';
    resultDiv.innerHTML = `
      <div class="result-text">
        <a href="${item.link}" class="title">
          <img src="${item.icon}" alt="${item.title}"> ${item.title}
        </a>
        <div class="link">${item.link}</div>
        ${item.subtitle ? `<div class="subtitle">${item.subtitle}</div>` : ''}
      </div>
    `;
    searchResults.appendChild(resultDiv);
  });
}

// Filter results as user types
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = programs.filter(p => p.title.toLowerCase().includes(query));
  renderResults(filtered);
});

// Clear text button functionality
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  renderResults(programs);
});

renderResults(programs);
