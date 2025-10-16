const pdfButtons = document.querySelectorAll('.pdf-button');
const pdfViewer = document.getElementById('pdf-viewer');
const closeButton = document.getElementById('close-pdf');
const fullscreenButton = document.getElementById('fullscreen-pdf');
const iframe = document.querySelector('#pdf-viewer iframe');

pdfButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const pdfFile = event.target.getAttribute('data-pdf');
    iframe.src = pdfFile;
    pdfViewer.style.display = 'flex';
  });
});

closeButton.addEventListener('click', () => {
  pdfViewer.style.display = 'none';
});

fullscreenButton.addEventListener('click', () => {
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen();
  }
});

const langSwitch = document.getElementById('lang-switch');

const translations = {
  en: {
    leftText: 'こんにちは！',
    rightText: 'Hello!',
    title: 'Japanese Linguistics',
    blurb: 'Welcome to my Japanese linguistics page. Here you\'ll find research and projects related to my study of the Japanese language and Japanese indigenous languages. I focus particularly on the linguistic and political aspects of the revitalization of Ainu language.',
    pdf1: 'Ainu Language Revitalization (2024–2025)',
    pdf2: 'Ainu Language Revitalization (EN Translation) (2025)',
    footer: '©2025 Cameron Hollabaugh'
  },
  jp: {
    leftText: 'こんにちは！',
    rightText: 'Hello!',
    title: '日本語言語学',
    blurb: 'このページでは、日本語および日本の先住民言語に関する研究とプロジェクトを紹介します。特に、アイヌ語復興の言語的および政治的側面に焦点を当てています。',
    pdf1: 'アイヌ語の復興（2024〜2025）',
    pdf2: 'アイヌ語の復興（英語翻訳版）（2025）',
    footer: '©2025 キャメロン・ホラボー'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';
applyLanguage(currentLang);

langSwitch.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'jp' : 'en';
  localStorage.setItem('lang', currentLang);
  applyLanguage(currentLang);
});

function applyLanguage(lang) {
  const t = translations[lang];
  document.querySelector('.left-text').textContent = t.leftText;
  document.querySelector('.right-text').textContent = t.rightText;
  document.querySelector('h1').textContent = t.title;
  document.querySelector('.blurb').textContent = t.blurb;
  document.querySelectorAll('.pdf-button')[0].textContent = t.pdf1;
  document.querySelectorAll('.pdf-button')[1].textContent = t.pdf2;
  document.querySelector('footer p').textContent = t.footer;
  langSwitch.textContent = lang === 'en' ? '日本語' : 'English';
}