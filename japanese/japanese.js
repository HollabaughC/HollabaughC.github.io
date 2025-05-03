// japanese.js

const pdfButton = document.getElementById('pdf-button');
const pdfViewer = document.getElementById('pdf-viewer');
const closeButton = document.getElementById('close-pdf');
const fullscreenButton = document.getElementById('fullscreen-pdf');

pdfButton.addEventListener('click', () => {
  pdfViewer.style.display = 'flex';
});

closeButton.addEventListener('click', () => {
  pdfViewer.style.display = 'none';
});

fullscreenButton.addEventListener('click', () => {
  const iframe = document.querySelector('#pdf-viewer iframe');
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) { /* Safari */
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) { /* IE11 */
    iframe.msRequestFullscreen();
  }
});