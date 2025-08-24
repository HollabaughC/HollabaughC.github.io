// --- Chip State ---
let chip = {
  name: "Chip",
  hunger: 80,
  happiness: 80,
  energy: 80,
  health: 100,
  age: 0, // days
  stage: "Baby",
  lastUpdate: Date.now()
};

// --- Load Saved State ---
if (localStorage.getItem("cos-chip")) {
  chip = JSON.parse(localStorage.getItem("cos-chip"));
  updateAll();
}

// --- Update Bars ---
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

// --- Clock (in-game) ---
function updateClock() {
  const clockEl = document.getElementById("game-clock") || createClock();
  const totalHours = chip.age * 24;
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);
  clockEl.innerText = `Day ${days}, Hour ${hours}`;
}

function createClock() {
  const clock = document.createElement("div");
  clock.id = "game-clock";
  document.getElementById("chip-app").insertBefore(clock, document.getElementById("chip-display").nextSibling);
  return clock;
}

// --- Stat Decay / Real-Time Aging ---
function decayStats() {
  const now = Date.now();
  const elapsed = (now - chip.lastUpdate) / 1000; // seconds
  if (elapsed > 0) {
    const decay = elapsed * 0.05;
    chip.hunger = Math.max(0, chip.hunger - decay);
    chip.happiness = Math.max(0, chip.happiness - decay / 2);
    chip.energy = Math.max(0, chip.energy - decay / 3);

    if (chip.hunger === 0 || chip.energy === 0) {
      chip.health = Math.max(0, chip.health - decay);
    }

    chip.age += elapsed / 60; // 1 min = 1 day
    updateStage();

    chip.lastUpdate = now;
    updateAll();
  }
}
setInterval(decayStats, 1000);

// --- Life Stages ---
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

// --- Mood & Age Image Mapping ---
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
  // Increase the stat
  chip[stat] = Math.min(100, chip[stat] + amount);

  const img = document.getElementById("chip-img");
  const display = document.getElementById("chip-display");

  // Change Chip image
  img.src = getStagePrefix() + "_" + imageSuffix + ".png";

  // Hardcoded emoji based on action
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

  // Revert Chip image after duration
  setTimeout(updateMoodImage, duration);

  // Update UI
  updateAll();
}

document.getElementById("feed-btn").addEventListener("click", () => actionWithImage("hunger", 20, "eating"));
document.getElementById("play-btn").addEventListener("click", startMiniGame);
document.getElementById("sleep-btn").addEventListener("click", () => actionWithImage("energy", 30, "sleep", 2000));
document.getElementById("clean-btn").addEventListener("click", () => actionWithImage("health", 15, "clean", 1000));

// --- Reset Game ---
document.getElementById("reset-btn").addEventListener("click", () => {
  localStorage.removeItem("cos-chip");
  localStorage.removeItem("chip-highscore");
  location.reload(); // full page reload
});

// --- Tamagotchi-style random movement ---
let miniGameActive = false; 
const chipImg = document.getElementById("chip-img");
const display = document.getElementById("chip-display");

setInterval(() => {
  if (!miniGameActive) moveChipRandomly();
}, 3000);

function moveChipRandomly() {
  const maxX = display.clientWidth - chipImg.clientWidth;
  const maxY = display.clientHeight - chipImg.clientHeight;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  chipImg.style.left = `${x}px`;
  chipImg.style.top = `${y}px`;
}

// --- Mini-game ---
function startMiniGame() {
  miniGameActive = true;
  const game = document.createElement("div");
  game.id = "mini-game";
  display.appendChild(game);

  // Score displays
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

  // Place Chip at bottom center
  chipImg.style.left = (gameWidth - chipImg.clientWidth) / 2 + "px";
  chipImg.style.top = (gameHeight - chipImg.clientHeight) + "px";

  // Handle keyboard movement
  const keys = { left: false, right: false };
  function keyDown(e) { if (e.key === "ArrowLeft") keys.left = true; if (e.key === "ArrowRight") keys.right = true; }
  function keyUp(e) { if (e.key === "ArrowLeft") keys.left = false; if (e.key === "ArrowRight") keys.right = false; }
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  // Spawn sticks
  const spawnInterval = setInterval(() => {
    const stick = document.createElement("div");
    stick.className = "stick";
    stick.style.left = Math.random() * (gameWidth - 20) + "px";
    stick.style.top = "0px";
    game.appendChild(stick);
    sticks.push(stick);
  }, 800);

  const moveInterval = setInterval(() => {
    // Move Chip
    let chipLeft = parseFloat(chipImg.style.left);
    if (keys.left) chipLeft -= 30;
    if (keys.right) chipLeft += 30;
    chipLeft = Math.max(0, Math.min(gameWidth - chipImg.clientWidth, chipLeft));
    chipImg.style.left = chipLeft + "px";

    // Move sticks and detect collisions
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

  // End game
  setTimeout(() => {
    miniGameActive = false;
    clearInterval(spawnInterval);
    clearInterval(moveInterval);
    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("keyup", keyUp);
    sticks.forEach(s => s.remove());
    game.remove();

    // Update high score
    if (score > highScore) localStorage.setItem(highScoreKey, score);

    // Increase happiness
    chip.happiness = Math.min(100, chip.happiness + score * 5);
    updateAll();

    // Show "You Win" overlay
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
