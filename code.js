function createKonamiCode(options = {}) {
  const KONAMI = [
    "arrowup", "arrowup",
    "arrowdown", "arrowdown",
    "arrowleft", "arrowright",
    "arrowleft", "arrowright",
    "b", "a"
  ];

  const buffer = [];
  const maxLen = KONAMI.length;
  let active = false;

  const { 
    onActivate = () => document.body.classList.add("rainbow-mode"),
    onDeactivate = () => document.body.classList.remove("rainbow-mode"),
    debug = false
  } = options;

  function normalizeKey(e) {
    if (!e?.key) return "";
    let k = e.key.toLowerCase();
    if (["up","down","left","right"].includes(k)) {
      k = "arrow" + k;
    }
    return k;
  }

  function handler(e) {
    const k = normalizeKey(e);
    if (!k) return;

    buffer.push(k);
    if (buffer.length > maxLen) buffer.shift();

    if (debug) console.debug("konami buffer:", buffer.join(", "));

    if (buffer.length === maxLen && KONAMI.every((v, i) => v === buffer[i])) {
      e.preventDefault?.();
      toggle();
      buffer.length = 0;
    }
  }

  function toggle() {
    if (!active) {
      onActivate();
      active = true;
      if (debug) console.info("Konami code detected → activated");
    } else {
      onDeactivate();
      active = false;
      if (debug) console.info("Konami code deactivated");
    }
  }

  window.addEventListener("keydown", handler, true);

  return {
    enable: () => { if (!active) toggle(); },
    disable: () => { if (active) toggle(); },
    isActive: () => active,
    bufferRef: buffer,
    destroy: () => window.removeEventListener("keydown", handler, true)
  };
}

const konami = createKonamiCode({ debug: true });