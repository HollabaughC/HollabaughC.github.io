document.querySelectorAll('.book').forEach(book => {
    book.addEventListener('click', () => {
        const pdfPath = book.getAttribute('data-pdf');
        const modal = document.getElementById('pdfModal');
        const iframe = document.getElementById('pdf-iframe');
        iframe.src = pdfPath;
        modal.style.display = 'flex';
    });
});

document.querySelector('.close-pdf').addEventListener('click', () => {
    const modal = document.getElementById('pdfModal');
    const iframe = document.getElementById('pdf-iframe');
    iframe.src = '';
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('pdfModal');
    if (e.target === modal) {
        modal.style.display = 'none';
        document.getElementById('pdf-iframe').src = '';
    }
});
