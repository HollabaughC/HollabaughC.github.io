let currentIndex = 0;
let allArticles = [];

const articlesContainer = document.getElementById("articles-container");
const loadMoreButton = document.getElementById("load-more-btn");

function renderArticles(articlesToLoad) {
  articlesToLoad.forEach(({ folder, file }) => {
    const articlePath = `articles/${folder}/${file}`;
    const imagePath = `articles/${folder}/cover.webp`;
    const articleTitle = file.replace(/_/g, ' ').replace('.html', '');

    const card = document.createElement("a");
    card.href = articlePath;
    card.className = "article-card";
    card.innerHTML = `
      <div class="card-image" style="background-image: url('${imagePath}');"></div>
      <div class="card-content">
        <h3 class="card-title">${articleTitle}</h3>
      </div>
    `;

    articlesContainer.appendChild(card);

    // Optional: preload image just to catch load errors (non-blocking)
    const img = new Image();
    img.src = imagePath;
    img.onerror = () => {
      console.warn(`Image not found: ${imagePath}`);
    };
  });
}

function loadArticles() {
  const nextBatch = allArticles.slice(currentIndex, currentIndex + 10);
  renderArticles(nextBatch);
  currentIndex += 10;

  if (currentIndex >= allArticles.length) {
    loadMoreButton.style.display = "none";
  }
}

fetch('articles/index.json')
  .then(res => res.json())
  .then(data => {
    allArticles = data;
    loadArticles();
  })
  .catch(err => {
    console.error("Error loading article index:", err);
    loadMoreButton.style.display = "none";
  });

loadMoreButton.addEventListener("click", loadArticles);
