const programs = [
  { title: "My GitHub", link: "https://github.com/HollabaughC", icon: "../cs/img/github.png", subtitle: "See all the source code!" },
  { title: "This Site (2025 to Now)", link: "../index.html", icon: "../img/cam.png", subtitle: "This button just takes you back to the homepage." },
  { title: "D&D Creator (2023)", link: "../cs/DND/static/index.html", icon: "../cs/img/dnd.png", subtitle: "Click here to create a D&D character in just 2 easy steps!" },
  { title: "Costco Picker (2024)", link: "../cs/costco/index.html", icon: "../cs/img/costco.png", subtitle: "Can't decide what to eat at Costco? Click here!" },
  { title: "Irankarapte (2025)", link: "../irankarapte/index.html", icon: "../irankarapte/icon.png", subtitle: "Learn Ainu here!" },
  { title: "Project Chip (2025)", link: "../cs/projectchip/index.html", icon: "../cs/img/chip.png", subtitle: "A digital pet where you take care of Chip the Beaver." },
  { title: "Explain it With Smeff (2025)", link: "../cs/smeff/index.html", icon: "../cs/img/smeff.png", subtitle: "The site full of web games from ancient Mesopotamia." },
  { title: "Sapporo (2025)", link: "../cs/sapporo/index.html", icon: "../cs/img/sapporo.png", subtitle: "A web-based text adventure game!" },
  { title: "Image to ASCII (2026)", link: "../cs/ASCII/ASCII.html", icon: "../cs/img/ASCII.png", subtitle: "An image to ASCII tool with loads of options." },
  { title: "FPS 3D Engine Demo (2026)", link: "../cs/fps/test.html", icon: "../cs/img/neil.png", subtitle: "A 3D engine demo for web-based games." }
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

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = programs.filter(p => p.title.toLowerCase().includes(query));
  renderResults(filtered);
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  renderResults(programs);
});

renderResults(programs);

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const micBtn = document.querySelector(".mic");
  const camBtn = document.querySelector(".camera");
  const searchBtn = document.querySelector(".search");
  const searchResults = document.getElementById("search-results");

  micBtn.addEventListener("click", () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchInput.value = transcript;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  });

  camBtn.addEventListener("click", async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      const img = document.createElement("img");
      img.src = canvas.toDataURL("image/png");
      img.style.maxWidth = "200px";

      searchResults.innerHTML = "";
      searchResults.appendChild(img);

    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera.");
    }
  });

  searchBtn.addEventListener("click", () => {
    const firstLink = searchResults.querySelector("a");
    if (firstLink) {
      window.location.href = firstLink.href;
    } else {
      alert("No search results available to open.");
    }
  });
});
