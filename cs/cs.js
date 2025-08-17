// Home button
document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = '../index.html';
});

// Open program windows
const programs = document.querySelectorAll('.program-btn');
const windowsContainer = document.getElementById('windows-container');
const openProgramsBar = document.getElementById('open-programs');

// Function to open a program
function openProgram(btn) {
  const title = btn.dataset.title;
  const link = btn.dataset.link;
  const icon = btn.dataset.icon;

  if (document.querySelector(`.window[data-title="${title}"]`)) return;

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

  let contentHTML = '';
  if (title === "COS Browser") {
    contentHTML = `
      <div class="browser-window">
        <div class="browser-header">
          <img src="${icon}" alt="Browser Logo" class="browser-logo">
          <input type="text" class="browser-url" placeholder="Search or enter URL">
          <button class="browser-go">Go</button>
        </div>
      </div>
    `;
  } else if (title === "Notepad") {
    contentHTML = `
      <textarea id="text-editor" style="flex:1;width:100%;height:100%;"></textarea>
      <button id="save-text" style="padding:5px;">Save as .txt</button>
    `;
  } else {
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

  // Close
  closeBtn.addEventListener('click', () => {
    win.remove();
    taskIcon.remove();
  });

  // Minimize
  minimizeBtn.addEventListener('click', () => {
    win.style.display = 'none';
  });

  // Maximize / Restore
  let isMaximized = false;
  let prevStyle = {};
  maximizeBtn.addEventListener('click', () => {
    if (!isMaximized) {
      prevStyle = { top: win.style.top, left: win.style.left, width: win.style.width, height: win.style.height };
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

  // Dragging with snap
  const header = win.querySelector('.window-header');
  let offsetX, offsetY, dragging = false;

  header.addEventListener('mousedown', e => {
  if (isMaximized) return;
  dragging = true;
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;
  win.style.zIndex = 100;

  const onMouseMove = eMove => {
    if (!dragging) return;
    win.style.left = (eMove.clientX - offsetX) + 'px';
    win.style.top = (eMove.clientY - offsetY) + 'px';

    // Snap to left half
    if (eMove.clientX < 10) {
      win.style.top = '0';
      win.style.left = '0';
      win.style.width = '50%';
      win.style.height = 'calc(100% - 40px)';
      isMaximized = true;
    } 
    // Snap to right half
    else if (eMove.clientX > window.innerWidth - 10) {
      win.style.top = '0';
      win.style.left = '50%';
      win.style.width = '50%';
      win.style.height = 'calc(100% - 40px)';
      isMaximized = true;
    }
  };

  const onMouseUp = () => {
    dragging = false;
    win.style.zIndex = 10;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

  // Taskbar icon click
  taskIcon.addEventListener('click', () => {
    if (win.style.display === 'none') win.style.display = 'flex';
    win.style.zIndex = 101;
  });

  // Text editor save
  if (title === "Text Editor") {
    win.querySelector('#save-text').addEventListener('click', () => {
      const text = win.querySelector('#text-editor').value;
      const blob = new Blob([text], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'document.txt';
      a.click();
    });
  }

  // COS Browser autocomplete
  if (title === "COS Browser") {
    const browserHeader = win.querySelector('.browser-header');
    const browserInput = browserHeader.querySelector('.browser-url');
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.cssText = 'position:relative;margin:0 auto;width:80%;max-height:200px;overflow-y:auto;display:none;border:1px solid #ccc;background:#fff;z-index:100;';
    browserHeader.appendChild(dropdown);

    const programTitles = Array.from(programs).map(p => p.dataset.title);
    let autocompleteIndex = -1;

    function updateDropdown(matches) {
      dropdown.innerHTML = '';
      if (matches.length === 0) {
        dropdown.style.display = 'none';
        return;
      }
      matches.forEach((m, i) => {
        const item = document.createElement('div');
        item.textContent = m;
        item.style.padding = '5px';
        item.style.cursor = 'pointer';
        if (i === autocompleteIndex) item.style.background = '#eee';
        item.addEventListener('mousedown', () => {
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

    browserInput.addEventListener('keydown', e => {
      const visibleItems = Array.from(dropdown.children);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (visibleItems.length === 0) return;
        autocompleteIndex = (autocompleteIndex + 1) % visibleItems.length;
        updateDropdown(programTitles.filter(p => p.toLowerCase().startsWith(browserInput.value.toLowerCase())));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (visibleItems.length === 0) return;
        autocompleteIndex = (autocompleteIndex - 1 + visibleItems.length) % visibleItems.length;
        updateDropdown(programTitles.filter(p => p.toLowerCase().startsWith(browserInput.value.toLowerCase())));
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (visibleItems.length === 0) return;
        autocompleteIndex = (autocompleteIndex + 1) % visibleItems.length;
        browserInput.value = visibleItems[autocompleteIndex].textContent;
        updateDropdown(programTitles.filter(p => p.toLowerCase().startsWith(browserInput.value.toLowerCase())));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const matchedProgram = programTitles.find(p => p.toLowerCase() === browserInput.value.trim().toLowerCase());
        if (matchedProgram) document.querySelector(`.program-btn[data-title="${matchedProgram}"]`).click();
        dropdown.style.display = 'none';
        browserInput.value = '';
      }
    });

    document.addEventListener('click', e => {
      if (!win.contains(e.target)) dropdown.style.display = 'none';
    });
  }
}

// Search
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  programs.forEach(btn => {
    btn.style.display = btn.dataset.title.toLowerCase().includes(term) ? 'flex' : 'none';
  });
});

// Arrange programs in columns
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
    if (row >= programsPerColumn) {
      row = 0;
      col++;
    }
  });
}

// Draggable icons
programs.forEach(btn => {
  let isDragging = false;
  let justDragged = false;
  let startX, startY, origX, origY;

  btn.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging = false;
    startX = e.clientX;
    startY = e.clientY;
    origX = btn.offsetLeft;
    origY = btn.offsetTop;

    const onMouseMove = eMove => {
      const dx = eMove.clientX - startX;
      const dy = eMove.clientY - startY;

      if (!isDragging && Math.sqrt(dx*dx + dy*dy) > 5) {
        isDragging = true;
        justDragged = true;
        btn.style.position = 'absolute';
      }

      if (isDragging) {
        btn.style.left = origX + dx + 'px';
        btn.style.top = origY + dy + 'px';
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (isDragging) {
        isDragging = false;
        setTimeout(() => { justDragged = false; }, 0);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  btn.addEventListener('click', e => {
    if (justDragged) {
      e.stopImmediatePropagation();
      e.preventDefault();
    } else {
      openProgram(btn);
    }
  });
});

window.addEventListener('resize', arrangePrograms);
arrangePrograms();
