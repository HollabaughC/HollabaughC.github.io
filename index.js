function showLoadingAndRedirect(target) {
  const overlay = document.getElementById("loading-overlay");
  overlay.style.display = "flex";
  overlay.innerHTML = `
    <div class="reference-distort">SYSTEM MALFUNCTION...</div>
    <div class="reference-static"></div>
    <div class="reference-scanlines"></div>
  `;

  overlay.animate(
    [
      { filter: "hue-rotate(0deg) blur(0px)" },
      { filter: "hue-rotate(90deg) blur(2px)" },
      { filter: "hue-rotate(0deg) blur(0px)" }
    ],
    { duration: 600, iterations: 4 }
  );

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

const easterEggs = [
  {
    startDate: "02-07",
    endDate: "02-10",
    text: "Happy Valentine's!♥✤",
    colors: ["#ffc5e6", "#ff257e", "#ff2644"],
    cssColors: ["#732982", "#ffffff", "#ff257e", "#ffc5e6"],
    fText: "Happy Valentine's!"
  },
  {
    startDate: "02-11",
    endDate: "02-11",
    text: "お誕生日おめでとう、日本！",
    colors: ["#FFFFFF", "#ff2644"],
    cssColors: ["#ff2644", "#FFFFFF", "#ff2644"],
    fText: "お誕生日おめでとう、日本！"
  },
  {
    startDate: "02-12",
    endDate: "02-14",
    text: "Happy Valentine's!♥✤",
    colors: ["#ffc5e6", "#ff257e", "#ff2644"],
    cssColors: ["#732982", "#ffffff", "#ff257e", "#ffc5e6"],
    fText: "Happy Valentine's!"
  },
  {
    startDate: "04-29",
    endDate: "05-05",
    text: "ゴールデンウィーク黄金週間",
    colors: ["#FFD700"],
    cssColors: ["#FFD700", "#FFFFFF", "#B59410"],
    fText: "ゴールデンウィーク"
  },
  {
    startDate: "06-01",
    endDate: "06-05",
    text: "LGBTQ",
    colors: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004CFF", "#732982"],
    cssColors: ["#5BCEFA", "#FFFFFF", "#F5A9B8"],
    fText: "Happy Pride!"
  },
  {
    startDate: "06-06",
    endDate: "06-06",
    text: "Viva Sverige!+",
    colors: ["#235789", "#F1D302"],
    cssColors: ["#F1D302", "#FFFFFF", "#235789"],
    fText: "Long live the king!"
  },
  {
    startDate: "06-07",
    endDate: "06-30",
    text: "LGBTQ",
    colors: ["#E40303", "#FF8C00", "#FFED00", "#008026", "#004CFF", "#732982",],
    cssColors: ["#5BCEFA", "#FFFFFF", "#F5A9B8"],
    fText: "Happy Pride!"
  },
  {
    startDate: "08-09",
    endDate: "08-09",
    text: "先住民",
    colors: ["#264653", "#9B2226", "#F4EBD0"],
    cssColors: ["#264653", "#F4EBD0", "#9B2226"],
    fText: "Save the Ainu!"
  },
  {
    startDate: "09-30",
    endDate: "09-30",
    text: "Phillip",
    colors: ["#264653", "#004CFF", "#5BCEFA"],
    cssColors: ["#264653", "#5BCEFA", "#004CFF"],
    fText: "Happy birthday Phillip!"
  },
  {
    startDate: "10-09",
    endDate: "10-09",
    text: "キャメロン",
    colors: ["#7349AC", "#a982b4", "#d4c0d9"],
    cssColors: ["#a982b4", "#d4c0d9", "#7349AC"],
    fText: "It's my birthday!"
  },
  {
    startDate: "10-24",
    endDate: "10-31",
    text: "Happy Halloween!☠☾",
    colors: ["#7349AC", "#FF9900", "#FFFFFF"],
    cssColors: ["#7349AC", "#FFFFFF", "#FF9900"],
    fText: "Happy Halloween!"
  },
  {
    startDate: "11-20",
    endDate: "11-20",
    text: "Trans Rights!",
    colors: ["#5BCEFA", "#F5A9B8", "#FFFFFF"],
    cssColors: ["#5BCEFA", "#FFFFFF", "#F5A9B8"],
    fText: "Protect the dolls"
  },
  {
    startDate: "12-18",
    endDate: "12-25",
    text: "Merry Christmas!❄",
    colors: ["#ff0000", "#ffffff", "#378b29"],
    cssColors: ["#ff0000", "#ffffff", "#378b29"],
    fText: "Merry Christmas!"
  }
];

function applyColorScheme(colors) {
  if (!colors || colors.length === 0) return;

  const root = document.documentElement;
  colors.forEach((c, i) => {
    root.style.setProperty(`--color-${i}`, c);
  });

  const primary = colors[0] || "#0f0";
  const secondary = colors[1] || "#ff00ff";
  const accent = colors[2] || "#00ffff";

  document.body.style.color = secondary;

  document.querySelectorAll("header, footer").forEach(el => {
    el.style.backgroundColor = (accent || primary) + "80";
    el.style.boxShadow = `0 0 25px ${accent || secondary}, 0 0 50px ${secondary} inset`;
    el.style.borderColor = secondary;
  });

  document.querySelectorAll(".circle-btn").forEach(btn => {
    btn.style.borderColor = secondary;
    btn.style.boxShadow = `0 0 20px ${secondary}, 0 0 35px ${accent}, inset 0 0 15px ${primary}`;
  });

  document.querySelectorAll("main h1, main p, .header-text, #footer-secret").forEach(el => {
    el.style.color = secondary;
    el.style.textShadow = colors.map(c => `0 0 10px ${c}`).join(", ");
  });
}

function getEasterEggForToday() {
  const today = new Date();
  const monthDay = (date) => `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const todayMD = monthDay(today);

  return easterEggs.find(egg => {
    if (egg.startDate <= egg.endDate) {
      return todayMD >= egg.startDate && todayMD <= egg.endDate;
    } else {
      return todayMD >= egg.startDate || todayMD <= egg.endDate;
    }
  }) || null;
}

function updateHolidayFlavorText() {
  const egg = getEasterEggForToday();
  const flavorText = document.getElementById("holiday-flavor-text");

  if (egg) {
    flavorText.textContent = egg.fText;
    flavorText.style.display = "block";
  } else {
    flavorText.style.display = "none";
  }
}

updateHolidayFlavorText();

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const egg = getEasterEggForToday();
  if (egg) applyColorScheme(egg.cssColors);

  for (let i = 0; i < drops.length; i++) {
    let text, color;

    if (egg) {
      const charIndex = Math.floor(Math.random() * egg.text.length);
      text = egg.text.charAt(charIndex);
      color = egg.colors[Math.floor(Math.random() * egg.colors.length)];
    } else {
      text = letters.charAt(Math.floor(Math.random() * letters.length));
      color = "#0F0";
    }

    ctx.fillStyle = color;
    ctx.font = fontSize + "px monospace";
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

  logo.style.visibility = "hidden";

  const animLogo = document.createElement("img");
  animLogo.src = logo.src;
  animLogo.style.width = rect.width + "px";
  animLogo.style.height = rect.height + "px";
  animLogo.style.position = "absolute";
  animLogo.style.left = rect.left + scrollX + "px";
  animLogo.style.top = rect.top + scrollY + "px";
  animLogo.style.zIndex = 9999;
  animLogo.style.transition = "";
  document.body.appendChild(animLogo);

  const targetY = footer.getBoundingClientRect().top + scrollY - rect.height - 10;

  let x = rect.left + scrollX;
  let y = rect.top + scrollY;
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
          animLogo.style.left = x + "px";
          animLogo.style.top = y + "px";
          animLogo.style.transform = `rotate(${angle}deg)`;

          if (x > window.scrollX + window.innerWidth) {
            clearInterval(walkInterval);
            animLogo.remove();

            const newLogo = document.createElement("img");
            newLogo.src = "img/chip.png";
            newLogo.className = "logo";
            newLogo.style.position = "fixed";
            newLogo.style.left = rect.left + "px";
            newLogo.style.top = rect.top + "px";
            newLogo.style.width = rect.width + "px";
            newLogo.style.height = rect.height + "px";
            newLogo.style.zIndex = 9999;
            newLogo.style.opacity = "0";
            newLogo.style.transition = "opacity 1s ease";
            document.body.appendChild(newLogo);

            requestAnimationFrame(() => {
              newLogo.style.opacity = "1";
            });

            newLogo.addEventListener("click", () => {
              showLoadingAndRedirect("game.html");
            });
          }
        }, 16);
      }
    }
    animLogo.style.top = y + "px";
  }, 16);
}

resetIdleTimer();

document.querySelectorAll("button, .logo").forEach(el => {
  el.addEventListener("click", e => {
    const ripple = document.createElement("span");
    ripple.className = "cyber-ripple";
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);
  });
});