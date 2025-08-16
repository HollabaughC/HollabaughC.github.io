// Home button
document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = '../index.html';
});

// Open program windows
const programs = document.querySelectorAll('.program-btn');
const windowsContainer = document.getElementById('windows-container');
const openProgramsBar = document.getElementById('open-programs');

programs.forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.dataset.title;
    const link = btn.dataset.link;
    const icon = btn.dataset.icon;

    if(document.querySelector(`.window[data-title="${title}"]`)) return;

    // Taskbar icon
    const taskIcon = document.createElement('img');
    taskIcon.src = icon;
    taskIcon.alt = title;
    taskIcon.title = title;
    taskIcon.classList.add('taskbar-icon');
    openProgramsBar.appendChild(taskIcon);

    // Window
    const win = document.createElement('div');
    win.classList.add('window');
    win.dataset.title = title;
    win.style.top = '50px';
    win.style.left = '50px';

    // Window content depending on program
    let contentHTML = '';
    if(title === "Web Browser"){
      contentHTML = `
      <div class="browser-window">
        <div class="browser-header">
          <img src="${icon}" alt="Browser Logo" class="browser-logo">
          <input type="text" class="browser-url" placeholder="Search or enter URL">
          <button class="browser-go">Go</button>
        </div>
      </div>
      `;
    } else if(title === "Text Editor"){
      contentHTML = `
        <textarea id="text-editor" style="flex:1;width:100%;height:100%;"></textarea>
        <button id="save-text" style="padding:5px;">Save as .txt</button>
      `;
    } else if(title === "Minesweeper"){
      contentHTML = `
        <div class="minesweeper" style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;height:100%;background:#0a0015;color:#f0f; font-family:monospace;">
          <h2 style="color:#ff66ff;text-shadow:0 0 8px #ff00ff;">💀 Minesweeper 💀</h2>
          <div id="minesweeper-grid" style="display:grid;grid-template-columns:repeat(10,30px);grid-gap:2px;"></div>
          <button id="restart-minesweeper" style="margin-top:10px;padding:5px 10px;background:#2a003f;color:#fff;border:1px solid #ff00ff;cursor:pointer;">Restart</button>
        </div>
      `;
    }
    else {
      contentHTML = `<iframe class="window-content" src="${link}" frameborder="0" style="flex:1;width:100%;border:none;"></iframe>`;
    }

    win.innerHTML = `
      <div class="window-header">
        <span>${title}</span>
        <div class="window-buttons">
          <span class="window-minimize">🗕</span>
          <span class="window-maximize">🗖</span>
          <span class="window-close">✖</span>
        </div>
      </div>
      ${contentHTML}
    `;
    windowsContainer.appendChild(win);

    const minimizeBtn = win.querySelector('.window-minimize');
    const maximizeBtn = win.querySelector('.window-maximize');
    const closeBtn = win.querySelector('.window-close');

    // Minesweeper functionality
if(title === "Minesweeper"){
  const gridEl = win.querySelector('#minesweeper-grid');
  const restartBtn = win.querySelector('#restart-minesweeper');

  function createGrid(){
    gridEl.innerHTML = '';
    const size = 10; // 10x10
    const mineCount = 15;
    const cells = [];
    const mines = new Set();

    // Random mines
    while(mines.size < mineCount){
      mines.add(Math.floor(Math.random() * size * size));
    }

    // Create cells
    for(let i=0;i<size*size;i++){
      const cell = document.createElement('div');
      cell.style.width = '30px';
      cell.style.height = '30px';
      cell.style.background = '#1a0028';
      cell.style.border = '1px solid #ff00ff';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.cursor = 'pointer';
      cell.style.color = '#ff99ff';
      cell.dataset.index = i;
      cell.dataset.revealed = "false";
      gridEl.appendChild(cell);
      cells.push(cell);
    }

    // Neighbor offsets (8 directions)
    const neighbors = [-size-1,-size,-size+1, -1,1, size-1,size,size+1];

    function getNeighborIndexes(i){
      const row = Math.floor(i / size);
      const col = i % size;
      return neighbors
        .map(offset => i + offset)
        .filter(idx => {
          if(idx < 0 || idx >= size*size) return false;
          const nRow = Math.floor(idx / size);
          const nCol = idx % size;
          return Math.abs(nRow-row) <= 1 && Math.abs(nCol-col) <= 1;
        });
    }

    function revealCell(i){
      const cell = cells[i];
      if(cell.dataset.revealed === "true") return; // already revealed
      cell.dataset.revealed = "true";
      cell.style.background = '#330044';

      if(mines.has(i)){
        cell.textContent = '💥';
        cell.style.background = '#ff0033';
        alert('Game Over!');
        return;
      }

      // Count surrounding mines
      const neighborsIdx = getNeighborIndexes(i);
      const count = neighborsIdx.filter(idx => mines.has(idx)).length;

      if(count > 0){
        cell.textContent = count;
        cell.style.fontWeight = 'bold';
      } else {
        // Flood fill: reveal neighbors if empty
        neighborsIdx.forEach(idx => revealCell(idx));
      }
    }

    // Add click handlers
    cells.forEach((cell, i)=>{
      cell.addEventListener('click', ()=> revealCell(i));
    });

    restartBtn.addEventListener('click', createGrid);
  }

  createGrid();
}

    // Close
    closeBtn.addEventListener('click', () => {
      win.remove();
      taskIcon.remove();
    });

    // Minimize
    minimizeBtn.addEventListener('click', () => {
      win.style.display = 'none';
    });

    // Maximize / Restore with snapping
    let isMaximized = false;
    let prevStyle = {};
    maximizeBtn.addEventListener('click', () => {
      if(!isMaximized){
        prevStyle = {top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height};
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = 'calc(100% - 40px)';
      } else {
        win.style.top = prevStyle.top;
        win.style.left = prevStyle.left;
        win.style.width = prevStyle.width;
        win.style.height = prevStyle.height;
      }
      isMaximized = !isMaximized;
    });

    // Dragging with snapping
    const header = win.querySelector('.window-header');
    let offsetX, offsetY, isDown = false;

    header.addEventListener('mousedown', e => {
      isDown = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      win.style.zIndex = 100;
    });

    document.addEventListener('mousemove', e => {
      if(!isDown || isMaximized) return;
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';

      // Snap to top = maximize
      if(e.clientY < 10){
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = 'calc(100% - 40px)';
      }

      // Snap to left half
      if(e.clientX < 10){
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '50%';
        win.style.height = 'calc(100% - 40px)';
        isMaximized = true;
      }

      // Snap to right half
      if(e.clientX > window.innerWidth - 10){
        win.style.top = '0';
        win.style.left = '50%';
        win.style.width = '50%';
        win.style.height = 'calc(100% - 40px)';
        isMaximized = true;
      }
    });

    document.addEventListener('mouseup', () => { isDown = false; win.style.zIndex = 10; });

    // Taskbar icon click
    taskIcon.addEventListener('click', () => {
      if(win.style.display === 'none') win.style.display = 'flex';
      win.style.zIndex = 101;
    });

    // Text editor save functionality
    if(title === "Text Editor"){
      win.querySelector('#save-text').addEventListener('click', ()=>{
        const text = win.querySelector('#text-editor').value;
        const blob = new Blob([text], {type:'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'document.txt';
        a.click();
      });
    }

    // Web Browser functionality
if(title === "Web Browser"){
  const browserIframe = win.querySelector('.browser-content');
  const browserHeader = win.querySelector('.browser-header');

  // Replace content with full-window search
  browserHeader.innerHTML = `
    <img src="${icon}" alt="Browser Logo" class="browser-logo" style="display:block;margin:10px auto;">
    <input type="text" class="browser-url" placeholder="Type program name to open..." style="width:80%;padding:10px;margin:10px auto;display:block;font-size:16px;">
    <div class="autocomplete-dropdown" style="position:relative;margin:0 auto;width:80%;max-height:200px;overflow-y:auto;display:none;border:1px solid #ccc;background:#fff;z-index:100;"></div>
  `;

  const browserInput = browserHeader.querySelector('.browser-url');
  const dropdown = browserHeader.querySelector('.autocomplete-dropdown');

  const programTitles = Array.from(programs).map(p => p.dataset.title);
  let autocompleteIndex = -1;

  function updateDropdown(matches){
    dropdown.innerHTML = '';
    if(matches.length === 0){
      dropdown.style.display = 'none';
      return;
    }
    matches.forEach((m, i)=>{
      const item = document.createElement('div');
      item.textContent = m;
      item.style.padding = '5px';
      item.style.cursor = 'pointer';
      if(i === autocompleteIndex) item.style.background = '#eee';
      item.addEventListener('mousedown', ()=>{
        browserInput.value = m;
        dropdown.style.display = 'none';
        document.querySelector(`.program-btn[data-title="${m}"]`).click();
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = 'block';
  }

  browserInput.addEventListener('input', () => {
    const val = browserInput.value.toLowerCase();
    const matches = programTitles.filter(p => p.toLowerCase().startsWith(val));
    autocompleteIndex = -1;
    updateDropdown(matches);
  });

  browserInput.addEventListener('keydown', (e) => {
    const visibleItems = Array.from(dropdown.children);
    if(e.key === 'ArrowDown'){
      e.preventDefault();
      if(visibleItems.length === 0) return;
      autocompleteIndex = (autocompleteIndex + 1) % visibleItems.length;
      updateDropdown(programTitles.filter(p => p.toLowerCase().startsWith(browserInput.value.toLowerCase())));
    } else if(e.key === 'ArrowUp'){
      e.preventDefault();
      if(visibleItems.length === 0) return;
      autocompleteIndex = (autocompleteIndex - 1 + visibleItems.length) % visibleItems.length;
      updateDropdown(programTitles.filter(p => p.toLowerCase().startsWith(browserInput.value.toLowerCase())));
    } else if(e.key === 'Tab'){
      e.preventDefault();
      if(visibleItems.length === 0) return;
      autocompleteIndex = (autocompleteIndex + 1) % visibleItems.length;
      browserInput.value = visibleItems[autocompleteIndex].textContent;
      updateDropdown(programTitles.filter(p => p.toLowerCase().startsWith(browserInput.value.toLowerCase())));
    } else if(e.key === 'Enter'){
      e.preventDefault();
      let query = browserInput.value.trim().toLowerCase();
      const matchedProgram = programTitles.find(p => p.toLowerCase() === query);
      if(matchedProgram){
        document.querySelector(`.program-btn[data-title="${matchedProgram}"]`).click();
      }
      dropdown.style.display = 'none';
      browserInput.value = '';
    }
  });

  // Close dropdown if click outside
  document.addEventListener('click', (e)=>{
    if(!win.contains(e.target)) dropdown.style.display = 'none';
  });
  }
  });
});

// Search
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  programs.forEach(btn => {
    btn.style.display = btn.dataset.title.toLowerCase().includes(term) ? 'flex' : 'none';
  });
});

// Arrange programs in columns, left-aligned and wrap to new column at bottom
function arrangePrograms() {
  const desktop = document.querySelector('.desktop');
  const desktopHeight = desktop.clientHeight - 60;
  const programsPerColumn = Math.floor(desktopHeight / 100);
  let col = 0, row = 0;

  programs.forEach(btn => {
    btn.style.position = 'absolute';
    btn.style.top = `${row * 100}px`;
    btn.style.left = `${col * 120}px`;
    row++;
    if(row >= programsPerColumn){
      row = 0;
      col++;
    }
  });
}

window.addEventListener('resize', arrangePrograms);
arrangePrograms();