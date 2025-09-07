document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".game-list li"));
  let index = 0;

  const preview = document.getElementById("game-preview");

  function setActive(i) {
    items.forEach(el => el.classList.remove("active"));
    items[i].classList.add("active");

    const previewLink = items[i].dataset.preview;
    if (preview && previewLink) {
      preview.src = previewLink;
      preview.onload = () => {
        try {
          const iframeDoc = preview.contentDocument || preview.contentWindow.document;
          iframeDoc.querySelectorAll("video, audio").forEach(media => media.muted = true);
        } catch {}
      };
    }
  }

  setActive(index);

  function selectGame() {
    const link = items[index].dataset.link;
    if (link) window.location.href = link;
  }

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      index = (index + 1) % items.length;
      setActive(index);
      items[index].scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else if (e.key === "ArrowUp") {
      index = (index - 1 + items.length) % items.length;
      setActive(index);
      items[index].scrollIntoView({ block: "nearest", behavior: "smooth" });
    } else if (e.key === "Enter") {
      selectGame();
    }
  });

  items.forEach((item, i) => {
    item.addEventListener("click", () => {
      index = i;
      setActive(index);
      selectGame();
    });

    item.addEventListener("mouseenter", () => {
      index = i;
      setActive(index);
    });

    let startX = 0;
    let startY = 0;
    let moved = false;

    item.addEventListener("touchstart", (ev) => {
      const t = ev.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      moved = false;

      index = i;
      setActive(index);
    }, { passive: true });

    item.addEventListener("touchmove", (ev) => {
      const t = ev.touches[0];
      const dx = Math.abs(t.clientX - startX);
      const dy = Math.abs(t.clientY - startY);
      if (dx > 10 || dy > 10) moved = true;
    }, { passive: true });

    item.addEventListener("touchend", (ev) => {
      if (!moved) {
        selectGame();
      }
    }, { passive: true });
  });
});
