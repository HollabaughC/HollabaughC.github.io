// JavaScript to open the PDFs in the iframe when a link is clicked
document.querySelectorAll('.pdf-links a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default link behavior
        const pdfPath = this.getAttribute('data-pdf'); // Get the PDF file path
        const iframe = document.getElementById('pdf-iframe');
        const controls = document.querySelector('.pdf-controls');
        
        iframe.src = pdfPath; // Set the iframe source to the PDF
        
        // Show the PDF controls (Close and Fullscreen buttons)
        controls.style.display = 'block';
    });
});

// JavaScript to close the PDF
document.getElementById('close-pdf').addEventListener('click', function() {
    const iframe = document.getElementById('pdf-iframe');
    iframe.src = ''; // Clear the iframe content
    
    // Hide the PDF controls (Close and Fullscreen buttons)
    const controls = document.querySelector('.pdf-controls');
    controls.style.display = 'none';
});

// JavaScript to toggle fullscreen mode
document.getElementById('fullscreen-pdf').addEventListener('click', function() {
    const iframe = document.getElementById('pdf-iframe');
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome and Safari
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
});

// Get modal and button
var modal = document.getElementById("contactModal");
var btn = document.getElementById("contactButton");
var span = document.getElementById("closeModal");

// When the user clicks the "Contact Me" button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on the <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
