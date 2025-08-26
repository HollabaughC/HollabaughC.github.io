    const pitsPerSide = 6;
    let initialSeeds = 4;
    let pitsA = [], pitsB = [], pitsAColors = [], pitsBColors = [], storeA = 0, storeB = 0, turn = 'A';
    let busy = false;

    const topRow = document.getElementById('topRow');
    const bottomRow = document.getElementById('bottomRow');
    const scoreA = document.getElementById('scoreA');
    const scoreB = document.getElementById('scoreB');
    const turnDisplay = document.getElementById('turnDisplay');
    const message = document.getElementById('message');
    const overlay = document.getElementById('overlay');

    function render(){
      topRow.innerHTML = '';
      bottomRow.innerHTML = '';

      for(let i=pitsPerSide-1;i>=0;i--){
        topRow.appendChild(createPit('B', i, pitsB[i], pitsBColors[i]));
      }
      for(let i=0;i<pitsPerSide;i++){
        bottomRow.appendChild(createPit('A', i, pitsA[i], pitsAColors[i]));
      }
      scoreA.textContent = storeA;
      scoreB.textContent = storeB;
      turnDisplay.textContent = 'Turn: ' + (turn==='A'? 'You':'Opponent');
    }

    function randomStoneColor(){
      const colors = ['var(--stone1)','var(--stone2)','var(--stone3)','var(--stone4)'];
      return colors[Math.floor(Math.random()*colors.length)];
    }

    function createPit(player, idx, count, colorArr){
      const el = document.createElement('div');
      el.className = 'pit';
      el.dataset.player = player;
      el.dataset.index = idx;
      if(player !== turn || (player==='B')) el.classList.add('disabled');

      const countEl = document.createElement('div');
      countEl.className = 'count';
      countEl.textContent = count;

      const stones = document.createElement('div');
      stones.className = 'stones';

      for(let s=0;s<Math.min(count,10);s++){
        const st = document.createElement('div');
        st.className = 'stone';
        const color = colorArr && colorArr[s] ? colorArr[s] : randomStoneColor();
        st.style.background = color;
        st.style.transform = `translate(${(Math.random()-0.5)*8}px, ${(Math.random()-0.5)*8}px)`;
        stones.appendChild(st);
      }

      el.appendChild(countEl);
      el.appendChild(stones);

      if(player==='A'){
        el.addEventListener('click', ()=>onPitClick(player, idx));
      }
      el.title = `Player ${player==='A'?'1':'2'} pit ${idx+1} — ${count} stones`;
      return el;
    }

    function getCenterForGlobal(pos){
      const sel = globalSelector(pos);
      const el = document.querySelector(sel);
      if(!el) return {x:window.innerWidth/2,y:window.innerHeight/2};
      const r = el.getBoundingClientRect();
      return {x: r.left + r.width/2, y: r.top + r.height/2};
    }

    function globalSelector(pos){
      if(pos>=0&&pos<=5) return `[data-player="A"][data-index="${pos}"]`;
      if(pos===6) return `#storeA`;
      if(pos>=7&&pos<=12) return `[data-player="B"][data-index="${12-pos}"]`;
      if(pos===13) return `#storeB`;
      return 'body';
    }

    function nextDropPos(player,pos){
      do{ pos = (pos+1)%14; }
      while((player==='A' && pos===13) || (player==='B' && pos===6));
      return pos;
    }

    async function animateSow(player, idx){
      if(busy) return;
      busy = true;

      const pileColors = player==='A' ? pitsAColors[idx].slice() : pitsBColors[idx].slice();
      if(player==='A'){ pitsA[idx]=0; pitsAColors[idx]=[]; } else { pitsB[idx]=0; pitsBColors[idx]=[]; }
      render();

      let currentPos = indexToGlobal(player, idx);

      const pileEl = document.createElement('div');
      pileEl.className = 'pile';
      pileEl.style.background = pileColors[0] || 'var(--accent)';
      pileEl.textContent = pileColors.length;
      overlay.appendChild(pileEl);

      const start = getCenterForGlobal(currentPos);
      setAbsPosition(pileEl, start.x, start.y);

      let lastPos = null;

      for(const color of pileColors){
        currentPos = nextDropPos(player,currentPos);
        lastPos = currentPos;

        const target = getCenterForGlobal(currentPos);
        const above = {x: target.x, y: target.y - 36};

        await moveElementTo(pileEl, above.x, above.y, 260);

        const fly = document.createElement('div');
        fly.className = 'flying';
        fly.style.background = color;
        overlay.appendChild(fly);
        setAbsPosition(fly, above.x, above.y);

        await moveElementTo(fly, target.x + (Math.random()-0.5)*12, target.y + (Math.random()-0.3)*6, 200);

        addColorToGlobal(currentPos, color);
        render();

        fly.remove();

        const remaining = parseInt(pileEl.textContent) - 1;
        if(remaining > 0) {
          pileEl.textContent = remaining;
          pileEl.style.background = pileColors[Math.max(0, pileColors.length - remaining)] || pileEl.style.background;
        } else {
          pileEl.textContent = '';
        }

        await sleep(120);
      }

      pileEl.remove();

      if((player==='A' && lastPos===6) || (player==='B' && lastPos===13)){
        message.textContent = 'Extra turn!';
      } else {
        const owner = globalOwner(lastPos);
        const localIdx = globalToLocalIndex(lastPos);
        if(owner === player && localIdx !== null){
          const localCount = getLocalPitCount(owner, localIdx);
          if(localCount === 1){
            const oppIdx = pitsPerSide - 1 - localIdx;
            const oppCount = getLocalPitCount(oppositeOwner(owner), oppIdx);
            if(oppCount > 0){
              removeAllFromLocal(owner, localIdx);
              const capturedColors = removeAllColorsFromLocal(oppositeOwner(owner), oppIdx);
              const captured = 1 + capturedColors.length;
              if(owner === 'A') storeA += captured; else storeB += captured;
              message.textContent = `Captured ${captured} stones!`;
            }
          }
        }
        turn = turn === 'A' ? 'B' : 'A';
        if(turn === 'A') message.textContent = 'Your move.'; else message.textContent = 'Opponent thinking...';
      }

      busy = false;
    }

    function setAbsPosition(el, x, y){
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.transform = 'translate(-50%,-50%)';
    }

    function moveElementTo(el, x, y, duration){
      return new Promise(resolve=>{
        const onEnd = ()=>{ el.removeEventListener('transitionend', onEnd); resolve(); };
        el.style.transition = `left ${duration}ms ease, top ${duration}ms ease`;
        requestAnimationFrame(()=>{
          el.style.left = x + 'px';
          el.style.top = y + 'px';
        });
        setTimeout(()=>{ el.style.transition = ''; resolve(); }, duration + 20);
      });
    }

    function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

    function addColorToGlobal(pos, color){
      if(pos>=0 && pos<=5){ pitsA[pos] = (pitsA[pos]||0) + 1; pitsAColors[pos] = pitsAColors[pos] || []; pitsAColors[pos].push(color); }
      else if(pos===6){ storeA++; }
      else if(pos>=7 && pos<=12){ const idx = 12-pos; pitsB[idx] = (pitsB[idx]||0) + 1; pitsBColors[idx] = pitsBColors[idx] || []; pitsBColors[idx].push(color); }
      else if(pos===13){ storeB++; }
    }

    function removeAllFromLocal(player, idx){ if(player==='A'){ pitsA[idx]=0; pitsAColors[idx]=[]; } else { pitsB[idx]=0; pitsBColors[idx]=[]; } }
    function removeAllColorsFromLocal(player, idx){ if(player==='A'){ const arr=pitsAColors[idx]||[]; pitsAColors[idx]=[]; pitsA[idx]=0; return arr; } else { const arr=pitsBColors[idx]||[]; pitsBColors[idx]=[]; pitsB[idx]=0; return arr; } }

    function getLocalPitCount(player, idx){ return player==='A' ? pitsA[idx] : pitsB[idx]; }
    function getLocalPitColors(player, idx){ return player==='A' ? (pitsAColors[idx]||[]) : (pitsBColors[idx]||[]); }

    function indexToGlobal(player, idx){ if(player==='A') return idx; return 12-idx; }
    function globalOwner(pos){ if(pos>=0&&pos<=5) return 'A'; if(pos>=7&&pos<=12) return 'B'; if(pos===6) return 'A-store'; if(pos===13) return 'B-store'; return null; }
    function globalToLocalIndex(pos){ if(pos>=0&&pos<=5) return pos; if(pos>=7&&pos<=12) return 12-pos; return null; }
    function oppositeOwner(p){ return p==='A'?'B':'A'; }

    async function onPitClick(player, idx){
      if(busy) return;
      if(turn !== 'A') return;
      if(pitsA[idx] === 0) return;
      await animateSow(player, idx);
      render();
      checkEnd();
      if(turn === 'B') await aiThinkAndMove();
    }

    async function aiThinkAndMove(){
      if(busy) return;
      await sleep(900);
      const legal = []; for(let i=0;i<pitsPerSide;i++) if(pitsB[i]>0) legal.push(i);
      if(!legal.length) return;

      let best = legal[0]; let bestScore = -Infinity;
      for(const i of legal){
        const score = evaluateMove('B', i);
        if(score > bestScore + 1e-6){ bestScore = score; best = i; }
      }

      await animateSow('B', best);
      render();
      checkEnd();
      if(turn === 'B') await aiThinkAndMove();
    }

    function evaluateMove(player, idx){
      const pitsACopy = pitsA.slice();
      const pitsBCopy = pitsB.slice();

      let pos = indexToGlobal(player, idx);
      let steps = (player==='A'? pitsACopy[idx] : pitsBCopy[idx]);
      if(player==='A') pitsACopy[idx] = 0; else pitsBCopy[idx] = 0;

      while(steps>0){
        pos = (pos+1)%14;
        if(player==='A' && pos===13) continue;
        if(player==='B' && pos===6) continue;
        steps--;
      }

      let score = 0;
      if((player==='A' && pos===6) || (player==='B' && pos===13)) score += 10;

      const owner = globalOwner(pos);
      const localIdx = globalToLocalIndex(pos);
      if(owner === player && localIdx !== null){
        const sideArray = owner === 'A' ? pitsACopy : pitsBCopy;
        const before = sideArray[localIdx];
        if(before === 0){
          const oppIdx = pitsPerSide - 1 - localIdx;
          const oppCount = (owner === 'A' ? pitsBCopy[oppIdx] : pitsACopy[oppIdx]);
          if(oppCount > 0) score += 5 + oppCount*2;
        }
      }

      return score + Math.random()*0.1;
    }

    function checkEnd(){
      const sideAEmpty = pitsA.every(v=>v===0);
      const sideBEmpty = pitsB.every(v=>v===0);
      if(sideAEmpty || sideBEmpty){
        for(let i=0;i<pitsPerSide;i++){ storeA += pitsA[i]; storeB += pitsB[i]; pitsA[i]=0; pitsB[i]=0; pitsAColors[i]=[]; pitsBColors[i]=[]; }
        render();
        if(storeA > storeB) message.textContent = `Game over — You win! (${storeA} to ${storeB})`;
        else if(storeB > storeA) message.textContent = `Game over — Opponent wins! (${storeB} to ${storeA})`;
        else message.textContent = `Game over — Draw! (${storeA} to ${storeB})`;
      }
    }

    function reset(){
      initialSeeds = parseInt(document.getElementById('seedCount').value);
      pitsA = new Array(pitsPerSide).fill(0);
      pitsB = new Array(pitsPerSide).fill(0);
      pitsAColors = new Array(pitsPerSide).fill(null).map(()=>[]);
      pitsBColors = new Array(pitsPerSide).fill(null).map(()=>[]);
      for(let i=0;i<pitsPerSide;i++){
        for(let s=0;s<initialSeeds;s++){
          pitsA[i]++; pitsAColors[i].push(randomStoneColor());
          pitsB[i]++; pitsBColors[i].push(randomStoneColor());
        }
      }
      storeA = 0; storeB = 0; turn = 'A'; busy = false;
      message.textContent = 'Your move.';
      render();
    }

    document.getElementById('newBtn').addEventListener('click',()=>{ if(busy) return; reset(); });

    window.addEventListener('keydown', (e)=>{
      if(busy) return;
      if(e.key >= '1' && e.key <= '6'){ const idx = parseInt(e.key)-1; if(turn==='A') onPitClick('A', idx); }
      const keysB = {'q':0,'w':1,'e':2,'r':3,'t':4,'y':5};
      if(keysB[e.key]){ const idx = keysB[e.key]; if(turn==='B') onPitClick('B', idx); }
    });

    reset();