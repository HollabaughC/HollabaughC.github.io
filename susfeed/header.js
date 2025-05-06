document.addEventListener('DOMContentLoaded', function() {
    const headerContent = `
        <header class="site-header">
            <div class="container header-top">
                <a href="index.html" class="logo-link">
                    <img src="img/logo.webp" alt="SusFeed Logo" class="logo" />
                </a>
            </div>
            <nav class="main-nav">
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="articles.html">Susarticles</a></li>
                    <li><a href="#">Quizzes</a></li>
                    <li><a href="https://www.youtube.com/@SusFeed">SusFeed Video</a></li>
                    <li><a href="about.html">About</a></li>
                </ul>
            </nav>
        </header>
    `;
    
    const headerDiv = document.querySelector('.site-header');
    
    if (headerDiv) {
        headerDiv.innerHTML = headerContent;
    }
});
