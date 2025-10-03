const translations = {
  en: {
    home: "Home",
    searchPlaceholder: "Search programs...",
    github: "My GitHub",
    browser: "COS Browser",
    notepad: "COS Notepad",
    site: "This Site (2025 to Now)",
    wwoll: "Wacky World of Little Lisa (2021)",
    dnd: "D&D Creator (2023)",
    costco: "Costco Picker (2024)",
    ucsg: "Untitled CS Game (2024-2025)",
    irankarapte: "Irankarapte (2025)",
    chip: "Project Chip (2025)",
    smeff: "Explain it With Smeff (2025)",
    sapporo: "Sapporo (2025)",
    title: "Click the GitHub Icon to See All of the Source Code"
  },
  jp: {
    home: "ホーム",
    searchPlaceholder: "プログラムを検索...",
    github: "私のGitHub",
    browser: "ブラウザ",
    notepad: "ノートパッド",
    site: "このサイト（2025〜現在）",
    wwoll: "リサちゃんの不思議な世界 (2021)",
    dnd: "D&Dクリエーター (2023)",
    costco: "Costcoピッカー (2024)",
    ucsg: "未定のCSゲーム (2024-2025)",
    irankarapte: "イランカラㇷ゚テ (2025)",
    chip: "プロジェクトチップ (2025)",
    smeff: "Smeffで説明 (2025)",
    sapporo: "札幌 (2025)",
    title: "GitHubアイコンをクリックしてソースコードを見る"
  }
};

let currentLang = "en";

function updateLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.querySelector("#home-btn").lastChild.textContent = t.home;

  document.querySelector("#search-bar").placeholder = t.searchPlaceholder;

  const labels = {
    github: t.github,
    "COS Browser": t.browser,
    Notepad: t.notepad,
    "This Site": t.site,
    "Wacky World of Little Lisa": t.wwoll,
    "D&D Character Creator": t.dnd,
    "Costco Food Court Picker": t.costco,
    "Untitled CS Game": t.ucsg,
    Irankarapte: t.irankarapte,
    "Project Chip": t.chip,
    Smeff: t.smeff,
    "Project Sapporo": t.sapporo
  };

  document.querySelectorAll(".program-btn").forEach(btn => {
    const title = btn.dataset.title;
    if (labels[title] || labels[btn.querySelector(".program-label")?.textContent]) {
      const label = btn.querySelector(".program-label") || btn.querySelector("span");
      if (label) {
        label.textContent = labels[title] || labels[label.textContent];
      }
    }
  });

  document.querySelector(".background-title").textContent = t.title;
}

document.getElementById("jp-btn").addEventListener("click", () => {
  const newLang = currentLang === "en" ? "jp" : "en";
  updateLanguage(newLang);

  const jpBtn = document.getElementById("jp-btn");
  const logo = jpBtn.querySelector(".logo");

  if (newLang === "jp") {
    jpBtn.lastChild.textContent = "EN";
    logo.style.background = "blue";
  } else {
    jpBtn.lastChild.textContent = "日本語";
    logo.style.background = "red";
  }
});
