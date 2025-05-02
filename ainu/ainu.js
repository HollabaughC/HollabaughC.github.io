// Open PDFs in the iframe when a link is clicked
document.querySelectorAll('.pdf-links a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        const pdfPath = this.getAttribute('data-pdf'); // Get the PDF path
        const iframe = document.getElementById('pdf-iframe');
        const controls = document.querySelector('.pdf-controls');
        
        iframe.src = pdfPath; // Load the PDF into iframe
        controls.style.display = 'block'; // Show PDF controls
    });
});

// Close the PDF viewer
document.getElementById('close-pdf').addEventListener('click', function() {
    const iframe = document.getElementById('pdf-iframe');
    iframe.src = ''; // Unload PDF
    document.querySelector('.pdf-controls').style.display = 'none'; // Hide controls
});

// Toggle fullscreen mode for the PDF viewer
document.getElementById('fullscreen-pdf').addEventListener('click', function() {
    const iframe = document.getElementById('pdf-iframe');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
});

// Modal handling for contact info
const modal = document.getElementById("contactModal");
const btn = document.getElementById("contactButton");
const span = document.getElementById("closeModal");

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
