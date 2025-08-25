let chip = {
  name: "Chip",
  hunger: 80,
  happiness: 80,
  energy: 80,
  health: 100,
  age: 0,
  stage: "Baby",
  lastUpdate: Date.now(),
  asleep: false
};

let miniGameActive = false;
const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (localStorage.getItem("cos-chip")) {
  chip = JSON.parse(localStorage.getItem("cos-chip"));
  updateAll();
}

autoSleepCheck();

function updateBar(id, value) {
  const bar = document.getElementById(id);
  bar.style.width = value + "%";
  bar.className = "";
  if (value < 30) bar.classList.add("low");
  else if (value < 70) bar.classList.add("mid");
  else bar.classList.add("high");
}

function updateAll() {
  document.getElementById("chip-name").innerText = chip.name + " the Beaver";
  updateBar("hunger-bar", chip.hunger);
  updateBar("happy-bar", chip.happiness);
  updateBar("energy-bar", chip.energy);
  updateBar("health-bar", chip.health);
  document.getElementById("age-display").innerText = Math.floor(chip.age);
  document.getElementById("life-stage").innerText = chip.stage;

  updateClock();
  updateMoodImage();
  localStorage.setItem("cos-chip", JSON.stringify(chip));
}

function updateClock() {
  const clockEl = document.getElementById("game-clock") || createClock();
  const totalHours = chip.age * 24;
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);
  const minutes = Math.floor((totalHours * 60) % 60);

  clockEl.innerText = `Day ${days}, ${hours}h ${minutes}m old`;
}

function createClock() {
  const clock = document.createElement("div");
  clock.id = "game-clock";
  document.getElementById("chip-app").insertBefore(clock, document.getElementById("chip-display").nextSibling);
  return clock;
}

function decayStats() {
  const now = Date.now();
  const elapsed = (now - chip.lastUpdate) / 1000;
  if (elapsed > 0) {
    const hungerDecay = 100 / (12 * 3600);
    const happyDecay  = 100 / (24 * 3600);
    const energyDecay = 100 / (16 * 3600);
    const healthDecay = 100 / (24 * 3600);

    if (chip.asleep) {
      const energyRestore = 100 / (8 * 3600);
      chip.energy = Math.min(100, chip.energy + elapsed * energyRestore);

      chip.hunger = Math.max(0, chip.hunger - elapsed * (hungerDecay / 2));

      chip.happiness = Math.max(0, chip.happiness - elapsed * (happyDecay / 4));
    } else {
      chip.hunger = Math.max(0, chip.hunger - elapsed * hungerDecay);
      chip.happiness = Math.max(0, chip.happiness - elapsed * happyDecay);
      chip.energy = Math.max(0, chip.energy - elapsed * energyDecay);
    }

    if (chip.hunger === 0 || chip.energy === 0) {
      chip.health = Math.max(0, chip.health - elapsed * healthDecay);
    }

    chip.age += elapsed / 86400;
    updateStage();

    chip.lastUpdate = now;
    updateAll();
  }
}
setInterval(decayStats, 1000);

function updateStage() {
  const prevStage = chip.stage;
  if (chip.age < 1) chip.stage = "Baby";
  else if (chip.age < 3) chip.stage = "Adolescent";
  else if (chip.age < 6) chip.stage = "Adult";
  else chip.stage = "Elder";

  if (chip.stage !== prevStage) {
    const img = document.getElementById("chip-img");
    img.style.transform = "scale(0)";
    setTimeout(() => {
      updateMoodImage();
      img.style.transform = "scale(1)";
    }, 300);

    const stageText = document.getElementById("life-stage");
    stageText.classList.add("stage-transition");
    setTimeout(() => stageText.classList.remove("stage-transition"), 1000);
  }
}

function updateMoodImage() {
  const img = document.getElementById("chip-img");
  if (chip.health <= 0) {
    img.src = "img/chip_dead.png";
    disableActions();
    return;
  }

  const stagePrefix = getStagePrefix();
  if (chip.hunger < 20) img.src = stagePrefix + "_hungry.png";
  else if (chip.energy < 20) img.src = stagePrefix + "_tired.png";
  else if (chip.happiness < 20) img.src = stagePrefix + "_sad.png";
  else img.src = stagePrefix + "_happy.png";
}

function getStagePrefix() {
  switch (chip.stage) {
    case "Baby": return "img/chip_baby";
    case "Adolescent": return "img/chip_adolescent";
    case "Adult": return "img/chip_adult";
    case "Elder": return "img/chip_elder";
  }
}

function disableActions() {
  document.querySelectorAll("#actions button").forEach(btn => btn.disabled = true);
}

function actionWithImage(stat, amount, imageSuffix, duration = 1200) {
  chip[stat] = Math.min(100, chip[stat] + amount);

  const img = document.getElementById("chip-img");
  const display = document.getElementById("chip-display");

  img.src = getStagePrefix() + "_" + imageSuffix + ".png";

  let emojiChar = "";
  if (imageSuffix === "eating") emojiChar = "🍖";
  else if (imageSuffix === "sleep") emojiChar = "😴";
  else if (imageSuffix === "clean") emojiChar = "🧼";

  if (emojiChar) {
    const emojiEl = document.createElement("div");
    emojiEl.innerText = emojiChar;
    emojiEl.style.position = "absolute";
    emojiEl.style.left = "50%";
    emojiEl.style.top = "10%";
    emojiEl.style.transform = "translateX(-50%)";
    emojiEl.style.fontSize = "32px";
    emojiEl.style.zIndex = "200";
    display.appendChild(emojiEl);

    setTimeout(() => {
      emojiEl.remove();
    }, duration);
  }

  setTimeout(updateMoodImage, duration);

  updateAll();
}

document.getElementById("feed-btn").addEventListener("click", () => actionWithImage("hunger", 20, "eating"));
document.getElementById("play-btn").addEventListener("click", startMiniGame);
document.getElementById("clean-btn").addEventListener("click", () => actionWithImage("health", 15, "clean", 1000));

document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.removeItem("cos-chip");
  localStorage.removeItem("chip-highscore");
  location.reload();
});

const chipImg = document.getElementById("chip-img");
const display = document.getElementById("chip-display");

setInterval(() => {
  if (!miniGameActive && !chip.asleep) {
    const action = Math.random();

    if (action < 0.7) {
      moveChipRandomly();

      const playful = Math.random();
      if (playful < 0.3) {
        chipImg.style.transform = "translateY(-30px)";
        setTimeout(() => chipImg.style.transform = "translateY(0)", 500);
      } else if (playful < 0.5) {
        chipImg.style.transform = "rotate(10deg)";
        setTimeout(() => chipImg.style.transform = "rotate(-10deg)", 200);
        setTimeout(() => chipImg.style.transform = "rotate(0deg)", 400);
      }
    } else if (action < 0.85) {
      chipImg.style.transform = "translateY(-30px)";
      setTimeout(() => chipImg.style.transform = "translateY(0)", 500);
    } else {
      chipImg.style.transform = "rotate(10deg)";
      setTimeout(() => chipImg.style.transform = "rotate(-10deg)", 200);
      setTimeout(() => chipImg.style.transform = "rotate(0deg)", 400);
    }
  }
}, 3000);

function moveChipRandomly() {
  const maxX = display.clientWidth - chipImg.clientWidth;
  const baseY = display.clientHeight - chipImg.clientHeight - display.clientHeight / 6;

  const x = Math.random() * maxX;
  chipImg.style.left = `${x}px`;
  chipImg.style.top = `${baseY}px`;
}

function startMiniGame() {
  if (miniGameActive) return;
  miniGameActive = true;
  document.getElementById("play-btn").disabled = true;

  const game = document.createElement("div");
  game.id = "mini-game";
  display.appendChild(game);

  let score = 0;
  const highScoreKey = "chip-highscore";
  let highScore = parseInt(localStorage.getItem(highScoreKey)) || 0;

  const scoreEl = document.createElement("div");
  scoreEl.className = "score";
  scoreEl.innerText = "Score: 0";
  game.appendChild(scoreEl);

  const highScoreEl = document.createElement("div");
  highScoreEl.className = "score";
  highScoreEl.style.top = "25px";
  highScoreEl.innerText = `High Score: ${highScore}`;
  game.appendChild(highScoreEl);

  const sticks = [];
  const gameWidth = display.clientWidth;
  const gameHeight = display.clientHeight;

  chipImg.style.left = (gameWidth - chipImg.clientWidth) / 2 + "px";
  const offset = gameHeight - chipImg.clientHeight - gameHeight / 6;
  chipImg.style.top = offset + "px";

  const keys = { left: false, right: false };
  const keyDown = e => { if (e.key === "ArrowLeft") keys.left = true; if (e.key === "ArrowRight") keys.right = true; };
  const keyUp = e => { if (e.key === "ArrowLeft") keys.left = false; if (e.key === "ArrowRight") keys.right = false; };
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  if (isTouchScreen) {
  const gameControls = document.createElement("div");
  gameControls.id = "touch-controls";
  Object.assign(gameControls.style, {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "20px",
    zIndex: 500
  });

  const leftBtn = document.createElement("button");
  leftBtn.innerText = "◀";
  const rightBtn = document.createElement("button");
  rightBtn.innerText = "▶";

  [leftBtn, rightBtn].forEach(btn => {
    Object.assign(btn.style, {
      fontSize: "24px",
      padding: "10px 20px",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.8)",
      border: "none"
    });
  });

  gameControls.appendChild(leftBtn);
  gameControls.appendChild(rightBtn);
  display.appendChild(gameControls);

  leftBtn.addEventListener("touchstart", () => keys.left = true);
  leftBtn.addEventListener("touchend", () => keys.left = false);
  rightBtn.addEventListener("touchstart", () => keys.right = true);
  rightBtn.addEventListener("touchend", () => keys.right = false);
}

  const spawnInterval = setInterval(() => {
    const stick = document.createElement("div");
    stick.className = "stick";
    stick.style.left = Math.random() * (gameWidth - 20) + "px";
    stick.style.top = "0px";
    game.appendChild(stick);
    sticks.push(stick);
  }, 800);

  const moveInterval = setInterval(() => {
    let chipLeft = parseFloat(chipImg.style.left);
    if (keys.left) chipLeft -= 30;
    if (keys.right) chipLeft += 30;
    chipLeft = Math.max(0, Math.min(gameWidth - chipImg.clientWidth, chipLeft));
    chipImg.style.left = chipLeft + "px";

    sticks.forEach((stick, i) => {
      let top = parseFloat(stick.style.top);
      top += 5;
      stick.style.top = top + "px";

      const chipRect = chipImg.getBoundingClientRect();
      const stickRect = stick.getBoundingClientRect();

      if (!(chipRect.right < stickRect.left ||
            chipRect.left > stickRect.right ||
            chipRect.bottom < stickRect.top ||
            chipRect.top > stickRect.bottom)) {
        score += 1;
        scoreEl.innerText = "Score: " + score;
        stick.remove();
        sticks.splice(i, 1);
      }

      if (top > gameHeight) {
        stick.remove();
        sticks.splice(i, 1);
      }
    });
  }, 50);

  setTimeout(() => {
    clearInterval(spawnInterval);
    clearInterval(moveInterval);
    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("keyup", keyUp);
    sticks.forEach(s => s.remove());
    game.remove();
    miniGameActive = false;
    document.getElementById("play-btn").disabled = false;

    if (score > highScore) localStorage.setItem(highScoreKey, score);

    chip.happiness = Math.min(100, chip.happiness + score * 5);
    updateAll();

    const winOverlay = document.createElement("div");
    winOverlay.id = "win-overlay";
    winOverlay.innerText = `🎉 You scored ${score}! 🎉`;
    Object.assign(winOverlay.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(0,0,0,0.7)",
      color: "white",
      padding: "20px",
      borderRadius: "12px",
      zIndex: 200
    });
    display.appendChild(winOverlay);
    setTimeout(() => winOverlay.remove(), 3000);
  }, 10000);
}

function autoSleepCheck() {
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 7) {
    if (!chip.asleep) toggleSleep(true);
  } else {
    if (chip.asleep) toggleSleep(false);
  }
}
setInterval(autoSleepCheck, 60000);

document.getElementById("sleep-btn").addEventListener("click", () => {
  toggleSleep(!chip.asleep);
});

function toggleSleep(state) {
  chip.asleep = state;

  const overlay = document.getElementById("sleep-overlay") || createSleepOverlay();
  overlay.style.display = state ? "block" : "none";

  document.querySelectorAll("#actions button").forEach(btn => {
    if (btn.id === "sleep-btn") return;
    btn.disabled = state;
  });

  const display = document.getElementById("chip-display");
  let zzz = document.getElementById("zzz-animation");

  if (state) {
    miniGameActive = true;

    if (!zzz) {
      zzz = document.createElement("div");
      zzz.id = "zzz-animation";
      zzz.innerText = "💤";
      Object.assign(zzz.style, {
        position: "absolute",
        left: "60%",
        top: "20%",
        fontSize: "32px",
        color: "white",
        opacity: "0.8",
        animation: "floatZzz 2s infinite",
        zIndex: 400
      });
      display.appendChild(zzz);
    }
  } else {
    miniGameActive = false;

    if (zzz) zzz.remove();
  }

  updateAll();
}

function createSleepOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "sleep-overlay";
  Object.assign(overlay.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.85)",
    zIndex: 300,
    pointerEvents: "none",
    display: "none",
    transition: "opacity 1s ease"
  });
  document.getElementById("chip-app").appendChild(overlay);
  return overlay;
}

window.addEventListener("load", () => {
  const maxX = display.clientWidth - chipImg.clientWidth;
  const baseY = display.clientHeight - chipImg.clientHeight - display.clientHeight / 6;

  const x = Math.random() * maxX;
  chipImg.style.left = `${x}px`;
  chipImg.style.top = `${baseY}px`;
});

let babyActive = false;

function spawnBabyChip() {
  if (babyActive) return;
  babyActive = true;

  const baby = document.createElement("img");
  baby.src = "img/chip_baby_happy.png";
  baby.style.position = "absolute";
  baby.style.width = "60px";
  const baseY = display.clientHeight - chipImg.clientHeight - display.clientHeight / 6;
  baby.style.top = baseY + "px";
  baby.style.left = "0px";
  baby.style.transition = "left 3s linear";
  display.appendChild(baby);

  const followInterval = setInterval(() => {
    const babyLeft = parseFloat(baby.style.left);
    const chipLeft = parseFloat(chipImg.style.left);
    const step = 2;
    if (Math.abs(chipLeft - babyLeft) > step) {
      chipImg.style.left = chipLeft < babyLeft ? chipLeft + step + "px" : chipLeft - step + "px";
    }
  }, 20);

  setTimeout(() => baby.style.left = (display.clientWidth - 60) + "px", 100);

  setTimeout(() => {
    clearInterval(followInterval);
    baby.remove();
    babyActive = false;
  }, 3000);
}

function spawnElderChip() {
  const elder = document.createElement("img");
  elder.src = "img/chip_elder_happy.png";
  elder.style.position = "absolute";
  elder.style.width = "60px";

  const baseY = display.clientHeight - chipImg.clientHeight - display.clientHeight / 6;
  elder.style.top = baseY + "px";
  elder.style.left = "0px";
  display.appendChild(elder);

  let jumps = 0;

  const jump = () => {
    if (jumps > 5) {
      elder.remove();
      return;
    }

    const currentX = parseFloat(elder.style.left);
    const currentY = parseFloat(elder.style.top);

    const targetX = Math.random() * (display.clientWidth - 60);
    const targetY = baseY - Math.random() * 50;

    const dx = targetX - currentX;
    const dy = targetY - currentY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speed = 0.5 * 4;
    const duration = Math.max(0.2, distance * speed / 1000);

    elder.style.transition = `left ${duration}s ease, top ${duration / 2}s ease`;

    elder.style.left = targetX + "px";
    elder.style.top = targetY + "px";

    setTimeout(() => {
      elder.style.top = baseY + "px";
      jumps++;
      setTimeout(jump, 200);
    }, duration * 1000);
  };

  jump();
}

setInterval(() => {
  if (miniGameActive || chip.asleep || babyActive) return;
  const rand = Math.random();
  if (rand < 0.002) spawnBabyChip();
  else if (rand < 0.004) spawnElderChip();
}, 3000);
