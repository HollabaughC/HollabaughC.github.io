const articleFolders = [ 
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"
];

let currentIndex = 0;
const articlesContainer = document.getElementById("articles-container");
const loadMoreButton = document.getElementById("load-more-btn");

function loadArticles() {
  const articlesToLoad = articleFolders.slice(currentIndex, currentIndex + 10);
  const loadPromises = articlesToLoad.map(folder => {
    const folderPath = `articles/${folder}/`;

    return fetch(folderPath)
      .then(response => response.text())
      .then(data => {
        const htmlFiles = data.match(/href="([^"]*\.html)"/g);
        if (htmlFiles && htmlFiles.length > 0) {
          const htmlFile = htmlFiles[0].match(/"([^"]*\.html)"/)[1]; // Get the full relative path (e.g. articles/1/Test_Article_haha.html)
          const articlePath = htmlFile; // Directly use the relative path from the HTML link
          const imagePath = `${folderPath}cover.webp`;

          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = imagePath;
            img.onload = function () {
              const articleTitle = htmlFile.split('/').pop().replace(/_/g, ' ').replace('.html', '');
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
              resolve(true);
            };
            img.onerror = () => resolve(false); // Resolve even if the image fails to load
          });
        } else {
          return false;
        }
      })
      .catch(error => {
        console.error("Error fetching folder contents:", error);
        return false;
      });
  });

  Promise.all(loadPromises).then(results => {
    const anyValid = results.some(result => result);
    if (!anyValid || currentIndex + 10 >= articleFolders.length) {
      loadMoreButton.style.display = "none";
    }
    currentIndex += 10;
  });
}

loadMoreButton.addEventListener("click", loadArticles);
loadArticles();
