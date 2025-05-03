document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.circle-btn');
  
    buttons.forEach(button => {
      const previewContainer = button.querySelector('.preview');
      const previewPage = button.getAttribute('data-preview');
  
      // Always show the preview inside the button
      previewContainer.innerHTML = `<iframe src="${previewPage}" frameborder="0"></iframe>`;
      previewContainer.querySelector('iframe').style.width = '100%';
      previewContainer.querySelector('iframe').style.height = '100%';
  
      // Change text color on hover
      button.addEventListener('mouseenter', function () {
        button.querySelector('.btn-text').style.color = '#ff0';  // Yellow text on hover
      });
  
      button.addEventListener('mouseleave', function () {
        button.querySelector('.btn-text').style.color = '';  // Revert to original color
      });
    });
  });
  