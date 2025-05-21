const header = document.createElement('header');
header.innerHTML = `
  <div class="header-inner">
    <h1>Irankarapte</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="dictionary.html">Dictionary</a>
      <a href="search.html">Search</a>
    </nav>
  </div>
`;
document.body.prepend(header);
