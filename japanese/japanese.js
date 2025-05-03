const pdfButtons = document.querySelectorAll('.pdf-button');
const pdfViewer = document.getElementById('pdf-viewer');
const closeButton = document.getElementById('close-pdf');
const fullscreenButton = document.getElementById('fullscreen-pdf');
const iframe = document.querySelector('#pdf-viewer iframe'); // Get the iframe

// Add event listeners to all PDF buttons
pdfButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    const pdfFile = event.target.getAttribute('data-pdf'); // Get the PDF file name from the data-pdf attribute
    iframe.src = pdfFile; // Load the selected PDF
    pdfViewer.style.display = 'flex'; // Show the PDF viewer
  });
});

closeButton.addEventListener('click', () => {
  pdfViewer.style.display = 'none';
});

fullscreenButton.addEventListener('click', () => {
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) { /* Safari */
    iframe.webkitRequestFullscreen();
  } else if (iframe.msRequestFullscreen) { /* IE11 */
    iframe.msRequestFullscreen();
  }
});
