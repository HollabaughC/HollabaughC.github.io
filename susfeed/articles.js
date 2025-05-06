let currentIndex = 0;
let allArticles = [];
let sortedArticles = [];

const articlesContainer = document.getElementById("articles-container");
const loadMoreButton = document.getElementById("load-more-btn");
const sortSelect = document.getElementById("sort-select");

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

    const img = new Image();
    img.src = imagePath;
    img.onerror = () => {
      console.warn(`Image not found: ${imagePath}`);
    };
  });
}

function clearArticles() {
  articlesContainer.innerHTML = '';
}

function loadArticles() {
  const nextBatch = sortedArticles.slice(currentIndex, currentIndex + 10);
  renderArticles(nextBatch);
  currentIndex += 10;

  if (currentIndex >= sortedArticles.length) {
    loadMoreButton.style.display = "none";
  } else {
    loadMoreButton.style.display = "inline-block";
  }
}

function sortArticles(method) {
  sortedArticles = [...allArticles];

  switch (method) {
    case "newest":
      sortedArticles.sort((a, b) => b.folder - a.folder);
      break;
    case "oldest":
      sortedArticles.sort((a, b) => a.folder - b.folder);
      break;
    case "az":
      sortedArticles.sort((a, b) => {
        const titleA = a.file.replace(/_/g, ' ').toLowerCase();
        const titleB = b.file.replace(/_/g, ' ').toLowerCase();
        return titleA.localeCompare(titleB);
      });
      break;
    case "za":
      sortedArticles.sort((a, b) => {
        const titleA = a.file.replace(/_/g, ' ').toLowerCase();
        const titleB = b.file.replace(/_/g, ' ').toLowerCase();
        return titleB.localeCompare(titleA);
      });
      break;
  }

  currentIndex = 0;
  clearArticles();
  loadArticles();
}

sortSelect.addEventListener("change", (e) => {
  sortArticles(e.target.value);
});

fetch('articles/index.json')
  .then(res => res.json())
  .then(data => {
    allArticles = data;
    sortArticles("newest"); // Default sort
  })
  .catch(err => {
    console.error("Error loading article index:", err);
    loadMoreButton.style.display = "none";
  });

  const searchInput = document.getElementById("article-search");

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
  
    const filtered = sortedArticles.filter(({ file }) => {
      const title = file.replace(/_/g, ' ').replace('.html', '').toLowerCase();
      return title.includes(query);
    });
  
    currentIndex = 0;
    clearArticles();
    renderArticles(filtered.slice(0, 10));
  
    if (filtered.length > 10) {
      loadMoreButton.style.display = "inline-block";
      sortedArticles = filtered;
      currentIndex = 10;
    } else {
      loadMoreButton.style.display = "none";
    }
  });  

loadMoreButton.addEventListener("click", loadArticles);
