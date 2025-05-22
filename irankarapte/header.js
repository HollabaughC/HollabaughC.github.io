const header = document.createElement('header');
header.innerHTML = `
  <div class="header-inner">
    <img src="img/mascot.png" alt="Mascot" style="width: 2em; height: 2em; vertical-align: middle; margin-right: 0.5em;">
    <h1>Irankarapte</h1>
    <nav>
      <a href="index.html">Home</a>
      <a href="dictionary.html">Dictionary</a>
      <a href="search.html">Search</a>
    </nav>
  </div>
`;
document.body.prepend(header);
