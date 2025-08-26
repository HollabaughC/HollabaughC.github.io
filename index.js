function showLoadingAndRedirect(target) {
  const overlay = document.getElementById("loading-overlay");
  overlay.style.display = "flex";
  overlay.innerHTML = `
    <div class="reference-distort">SITE MALFUNCTION...</div>
    <div class="reference-static"></div>
    <div class="reference-scanlines"></div>
  `;
  setTimeout(() => {
    window.location.href = target;
  }, 2500);
}

document.querySelector(".logo").addEventListener("click", (e) => {
  const rect = e.target.getBoundingClientRect();
  for (let i = 0; i < 5; i++) {
    const mini = document.createElement("img");
    mini.src = "img/cam.png";
    mini.classList.add("mini-logo");
    mini.style.left = rect.left + rect.width / 2 + "px";
    mini.style.top = rect.bottom + "px";
    document.body.appendChild(mini);

    let x = rect.left + rect.width / 2;
    let y = rect.bottom;
    let vx = (Math.random() - 0.5) * 6;
    let vy = Math.random() * -8 - 4;
    const gravity = 0.4;
    const damping = 0.7;

    const interval = setInterval(() => {
      vy += gravity;
      x += vx;
      y += vy;

      if (y + 40 > window.innerHeight) {
        y = window.innerHeight - 40;
        vy *= -damping;
      }
      if (x < 0 || x + 40 > window.innerWidth) {
        vx *= -1;
      }

      mini.style.left = x + "px";
      mini.style.top = y + "px";
    }, 16);

    setTimeout(() => {
      clearInterval(interval);
      mini.remove();
    }, 3000);
  }
  setTimeout(() => showLoadingAndRedirect("game.html"), 1500);
});

document.getElementById("footer-secret").addEventListener("click", () => {
  const footer = document.querySelector("footer");
  footer.style.animation = "footer-glitch-out 1s forwards";
  setTimeout(() => {
    showLoadingAndRedirect("secret.html");
  }, 1000);
});

const canvas = document.createElement("canvas");
canvas.id = "matrix-bg";
document.body.prepend(canvas);
const ctx = canvas.getContext("2d");

const letters = "アィイゥウェエオカキクケコサシスセソ0123456789";
const fontSize = 16;
let columns;
let drops;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const newColumns = Math.floor(canvas.width / fontSize);

  if (!drops) {
    drops = Array(newColumns).fill(1);
  } else if (newColumns > drops.length) {
    drops = drops.concat(Array(newColumns - drops.length).fill(1));
  } else {
    drops = drops.slice(0, newColumns);
  }

  columns = newColumns;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 50);

let idleTimer;
const idleTime = 60000;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(logoWalkAway, idleTime);
}

function logoWalkAway() {
  const logo = document.querySelector(".logo");
  const footer = document.querySelector("footer");
  if (!logo || !footer) return;

  const rect = logo.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  let x = rect.left + scrollX;
  let y = rect.top + scrollY;

  document.body.appendChild(logo);
  logo.style.position = "absolute";
  logo.style.left = x + "px";
  logo.style.top = y + "px";
  logo.style.margin = "0";

  const footerRect = footer.getBoundingClientRect();
  const targetY = footerRect.top + scrollY - rect.height - 10;

  let speedY = 4;
  let speedX = 3;
  let bounce = -12;
  let bouncing = false;
  let angle = 0;
  let angleDir = 1;

  const dropInterval = setInterval(() => {
    if (!bouncing) {
      y += speedY;
      if (y >= targetY) {
        y = targetY;
        bouncing = true;
      }
    } else {
      y += bounce;
      bounce += 1.5;
      if (y >= targetY) {
        y = targetY;
        clearInterval(dropInterval);
        const walkInterval = setInterval(() => {
          x += speedX;
          angle += angleDir * 5;
          if (angle > 15 || angle < -15) angleDir *= -1;
          logo.style.left = x + "px";
          logo.style.transform = `rotate(${angle}deg)`;
          if (x > window.scrollX + window.innerWidth) {
            clearInterval(walkInterval);
            logo.style.display = "none";
          }
        }, 16);
      }
    }
    logo.style.top = y + "px";
  }, 16);
}

resetIdleTimer();
