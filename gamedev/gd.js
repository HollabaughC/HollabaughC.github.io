document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".game-list li");
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
    } else if (e.key === "ArrowUp") {
      index = (index - 1 + items.length) % items.length;
      setActive(index);
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
    item.addEventListener("touchstart", () => {
      index = i;
      setActive(index);
      selectGame();
    });
    item.addEventListener("mouseenter", () => {
      index = i;
      setActive(index);
    });
  });
});
