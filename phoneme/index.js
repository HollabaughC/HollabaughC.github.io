const mbrolaToIPA = {
  "p": "p",
  "p_h": "pʰ",
  "b": "b",
  "t": "t",
  "t_h": "tʰ",
  "4": "ɾ",
  "d": "d",
  "k": "k",
  "k_h": "kʰ",
  "g": "ɡ",

  "f": "f",
  "v": "v",
  "s": "s",
  "z": "z",
  "S": "ʃ",
  "Z": "ʒ",
  "T": "θ",
  "D": "ð",
  "h": "h",

  "tS": "tʃ",
  "dZ": "dʒ",

  "m": "m",
  "n": "n",
  "N": "ŋ",

  "l": "l",
  "l=": "l̩",
  "r": "ɹ",
  "r=": "ɝ",

  "j": "j",
  "w": "w",

  "i": "i",
  "I": "ɪ",
  "E": "ɛ",
  "{": "æ",
  "A": "ɑ",
  "O": "ɔ",
  "Or": "ɔɹ",
  "U": "ʊ",
  "u": "u",
  "V": "ʌ",
  "@": "ə",

  "EI": "eɪ",
  "AI": "aɪ",
  "OI": "ɔɪ",
  "@U": "oʊ",
  "aU": "aʊ"
};

function toIPA(symbol) {
  return mbrolaToIPA[symbol] || symbol;
}

const consonantsPlaces = [
  "Bilabial", "Labiodental", "Linguolabial", "Dental", "Alveolar", "Postalveolar",
  "Retroflex", "Palatal", "Velar", "Uvular", "Pharyngeal", "Glottal"
];

const consonantsManners = [
  ["Nasal", ["m",""], [""], [""], [""], ["n",""], [""], [""], [""], ["N",""], [""], [""], [""]],
  ["Plosive", ["p","b"], [""], [""], [""], ["t","d"], [""], [""], [""], ["k","g"], [""], [""], [""]],
  ["Sibilant fricative", ["",""], [""], [""], [""], ["s","z"], ["S","Z"], [""], [""], [""], [""], [""], [""]],
  ["Non-sibilant fricative", [""], ["f","v"], [""], ["T","D"], [""], [""], [""], [""], [""], [""], [""], ["h",""]],
  ["Approximant", ["",""], [""], [""], [""], ["r",""], [""], [""], ["j",""], [""], [""], [""], [""]],
  ["Tap/flap", ["",""], [""], [""], [""], ["4",""], [""], [""], [""], [""], [""], [""], [""]],
  ["Trill", [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""]],
  ["Lateral fricative", [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""]],
  ["Lateral approximant", [""], [""], [""], [""], ["l",""], [""], [""], [""], [""], [""], [""], [""]],
  ["Lateral tap/flap", [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""], [""]]
];

const vowels = [
  { char: "i", height: "close", backness: "front" },
  { char: "u", height: "close", backness: "back" },

  { char: "I", height: "nearclose", backness: "front" },
  { char: "U", height: "nearclose", backness: "back" },

  { char: "EI", height: "closemid", backness: "front" },
  { char: "@U", height: "closemid", backness: "back" },

  { char: "@", height: "mid", backness: "central" },

  { char: "E", height: "openmid", backness: "front" },
  { char: "V", height: "openmid", backness: "central" },
  { char: "O", height: "openmid", backness: "back" },

  { char: "{", height: "nearopen", backness: "front" },

  { char: "A", height: "open", backness: "back" },

  { char: "AI", height: "open", backness: "front" },
  { char: "OI", height: "open", backness: "back" },
  { char: "aU", height: "open", backness: "back" }
];

const outputBox = document.getElementById("outputBox");

function makeIPA(char) {
  if (!char) return null;
  const span = document.createElement("span");
  span.textContent = char;
  span.classList.add("ipa-char");
  span.addEventListener("click", () => {
    outputBox.value += char;
  });
  return span;
}

const consonantTable = document.getElementById("consonants");

const theadRow = document.createElement("tr");
theadRow.appendChild(document.createElement("th"));
consonantsPlaces.forEach(place => {
  const th = document.createElement("th");
  th.textContent = place;
  theadRow.appendChild(th);
});
const thead = document.createElement("thead");
thead.appendChild(theadRow);
consonantTable.appendChild(thead);

const tbody = document.createElement("tbody");
consonantsManners.forEach(([manner, ...cols]) => {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.textContent = manner;
  tr.appendChild(th);

  cols.forEach(([voiceless, voiced]) => {
    const td = document.createElement("td");
    const vless = makeIPA(voiceless);
    const vced = makeIPA(voiced);
    if (vless) td.appendChild(vless);
    if (vced) td.appendChild(vced);
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
});
consonantTable.appendChild(tbody);

function buildVowelTable() {
  vowels.forEach(v => {
    const td = document.getElementById(`${v.height}-${v.backness}`);
    if (td) {
      const span = makeIPA(v.char);
      td.appendChild(span);
    }
  });
}

buildVowelTable();

function buildGrid(id, chars) {
  const container = document.getElementById(id);
  chars.forEach(c => {
    const span = makeIPA(c);
    if (span) container.appendChild(span);
  });
}

function buildCategories() {
  const byManner = document.getElementById("byManner");
  const byPlace = document.getElementById("byPlace");
  byManner.innerHTML = "";
  byPlace.innerHTML = "";

  consonantsManners.forEach(([manner, ...cols]) => {
    const section = document.createElement("div");
    const header = document.createElement("h4");
    header.textContent = manner;
    section.appendChild(header);

    cols.forEach(([voiceless, voiced]) => {
      const vless = makeIPA(voiceless);
      const vced = makeIPA(voiced);
      if (vless) section.appendChild(vless);
      if (vced) section.appendChild(vced);
    });
    byManner.appendChild(section);
  });

  consonantsPlaces.forEach((place, i) => {
    const section = document.createElement("div");
    const header = document.createElement("h4");
    header.textContent = place;
    section.appendChild(header);

    consonantsManners.forEach(([manner, ...cols]) => {
      const pair = cols[i];
      if (!pair) return;
      const [voiceless, voiced] = pair;
      const vless = makeIPA(voiceless);
      const vced = makeIPA(voiced);
      if (vless) section.appendChild(vless);
      if (vced) section.appendChild(vced);
    });
    byPlace.appendChild(section);
  });
}

const consonantToggle = document.getElementById("toggleConsonants");
const vowelToggle = document.getElementById("toggleVowels");

const consonantSelector = document.querySelector(".ipa-selector");
const vowelSelector = document.getElementById("vowelSelector");

function showTables() {
  tableView.style.display = "block";
  consonantSelector.style.display = "none";
  vowelSelector.style.display = "none";
}

function showConsonants() {
  tableView.style.display = "none";
  consonantSelector.style.display = "block";
  vowelSelector.style.display = "none";
  buildCategories();
}

function showVowels() {
  tableView.style.display = "none";
  consonantSelector.style.display = "none";
  vowelSelector.style.display = "block";
  buildVowelCategories();
}

function updateView() {
  if (consonantToggle.checked && !vowelToggle.checked) {
    showConsonants();
  } else if (vowelToggle.checked && !consonantToggle.checked) {
    showVowels();
  } else {
    consonantToggle.checked = false;
    vowelToggle.checked = false;
    showTables();
  }
}

consonantToggle.addEventListener("change", updateView);
vowelToggle.addEventListener("change", updateView);

const mannerSelect = document.getElementById("mannerSelect");
const placeSelect = document.getElementById("placeSelect");
const selectionResult = document.getElementById("selectionResult");

const allMannersOpt = document.createElement("option");
allMannersOpt.value = "all";
allMannersOpt.textContent = "All manners";
mannerSelect.appendChild(allMannersOpt);

consonantsManners.forEach(([manner]) => {
  const opt = document.createElement("option");
  opt.value = manner;
  opt.textContent = manner;
  mannerSelect.appendChild(opt);
});

const allPlacesOpt = document.createElement("option");
allPlacesOpt.value = "all";
allPlacesOpt.textContent = "All places";
placeSelect.appendChild(allPlacesOpt);

consonantsPlaces.forEach((place, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = place;
  placeSelect.appendChild(opt);
});

function updateSelection() {
  const mannerVal = mannerSelect.value;
  const placeVal = placeSelect.value;
  selectionResult.innerHTML = "";

  if (mannerVal === "all" && placeVal === "all") {
    consonantsManners.forEach(([manner, ...cols], mi) => {
      const section = document.createElement("div");
      section.classList.add("ipa-section");
      const header = document.createElement("h4");
      header.textContent = manner;
      section.appendChild(header);

      cols.forEach(([vless, vced], pi) => {
        if (!vless && !vced) return;
        const pair = document.createElement("div");
        pair.classList.add("ipa-pair");
        const label = document.createElement("span");
        label.classList.add("ipa-label");
        label.textContent = consonantsPlaces[pi] + ": ";
        pair.appendChild(label);
        if (vless) pair.appendChild(makeIPA(vless));
        if (vced) pair.appendChild(makeIPA(vced));
        section.appendChild(pair);
      });

      if (section.children.length > 1) {
        selectionResult.appendChild(section);
      }
    });
    return;
  }

  if (mannerVal === "all") {
    const placeIndex = placeVal === "all" ? null : parseInt(placeVal, 10);
    consonantsManners.forEach(([manner, ...cols]) => {
      const cell = placeIndex !== null ? cols[placeIndex] : null;
      if (placeIndex !== null && (!cell || (!cell[0] && !cell[1]))) return;

      const section = document.createElement("div");
      section.classList.add("ipa-section");
      const header = document.createElement("h4");
      header.textContent = manner;
      section.appendChild(header);

      if (placeIndex === null) {
        cols.forEach(([vless, vced], pi) => {
          if (!vless && !vced) return;
          const pair = document.createElement("div");
          pair.classList.add("ipa-pair");
          const label = document.createElement("span");
          label.classList.add("ipa-label");
          label.textContent = consonantsPlaces[pi] + ": ";
          pair.appendChild(label);
          if (vless) pair.appendChild(makeIPA(vless));
          if (vced) pair.appendChild(makeIPA(vced));
          section.appendChild(pair);
        });
      } else {
        const [vless, vced] = cell;
        const pair = document.createElement("div");
        pair.classList.add("ipa-pair");
        if (vless) pair.appendChild(makeIPA(vless));
        if (vced) pair.appendChild(makeIPA(vced));
        section.appendChild(pair);
      }

      if (section.children.length > 1) {
        selectionResult.appendChild(section);
      }
    });
    return;
  }

  if (placeVal === "all") {
    const row = consonantsManners.find(([m]) => m === mannerVal);
    if (!row) return;
    const section = document.createElement("div");
    section.classList.add("ipa-section");
    const header = document.createElement("h4");
    header.textContent = mannerVal;
    section.appendChild(header);

    row.slice(1).forEach(([vless, vced], pi) => {
      if (!vless && !vced) return;
      const pair = document.createElement("div");
      pair.classList.add("ipa-pair");
      const label = document.createElement("span");
      label.classList.add("ipa-label");
      label.textContent = consonantsPlaces[pi] + ": ";
      pair.appendChild(label);
      if (vless) pair.appendChild(makeIPA(vless));
      if (vced) pair.appendChild(makeIPA(vced));
      section.appendChild(pair);
    });
    if (section.children.length > 1) {
      selectionResult.appendChild(section);
    }
    return;
  }

  const row = consonantsManners.find(([m]) => m === mannerVal);
  if (!row) return;
  const placeIndex = parseInt(placeVal, 10);
  const [vless, vced] = row[placeIndex + 1] || [];
  if (!vless && !vced) {
    selectionResult.textContent = "— no character —";
    return;
  }
  if (vless) selectionResult.appendChild(makeIPA(vless));
  if (vced) selectionResult.appendChild(makeIPA(vced));
}

mannerSelect.addEventListener("change", updateSelection);
placeSelect.addEventListener("change", updateSelection);

updateSelection();

const heightSelect = document.getElementById("heightSelect");
const backnessSelect = document.getElementById("backnessSelect");
const vowelResult = document.getElementById("vowelSelectionResult");

function buildVowelCategories() {
  if (heightSelect.options.length === 0) {
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All heights";
    heightSelect.appendChild(allOpt);

    const heights = [...new Set(vowels.map(v => v.height))];
    heights.forEach(h => {
      const opt = document.createElement("option");
      opt.value = h;
      opt.textContent = h;
      heightSelect.appendChild(opt);
    });
  }

  if (backnessSelect.options.length === 0) {
    const allOpt = document.createElement("option");
    allOpt.value = "all";
    allOpt.textContent = "All backness";
    backnessSelect.appendChild(allOpt);

    const backs = [...new Set(vowels.map(v => v.backness))];
    backs.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      backnessSelect.appendChild(opt);
    });
  }

  updateVowelSelection();
}

function updateVowelSelection() {
  const h = heightSelect.value;
  const b = backnessSelect.value;
  vowelResult.innerHTML = "";

  vowels.forEach(v => {
    if ((h === "all" || v.height === h) && (b === "all" || v.backness === b)) {
      vowelResult.appendChild(makeIPA(v.char));
    }
  });
}

heightSelect.addEventListener("change", updateVowelSelection);
backnessSelect.addEventListener("change", updateVowelSelection);

const consonantData = [];

function showConsonantMenu(char) {
  let old = document.getElementById("consonantMenuPopup");
  if (old) old.remove();

  const popup = document.createElement("div");
  popup.id = "consonantMenuPopup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.background = "white";
  popup.style.border = "2px solid black";
  popup.style.padding = "15px";
  popup.style.zIndex = 9999;
  popup.style.borderRadius = "6px";
  popup.style.minWidth = "250px";
  popup.style.boxShadow = "0 0 20px rgba(0,0,0,0.35)";

  popup.innerHTML = `
    <h3>Consonant: ${char}</h3>

    <label>Aspiration: <span id="aspVal">0</span></label>
    <input id="aspSlider" type="range" min="0" max="1" step="0.01" value="0">

    <br><br>

    <label>VOT: <span id="votVal">0</span></label>
    <input id="votSlider" type="range" min="-100" max="100" step="1" value="0">

    <br><br>

    <label>Length: <span id="lenVal">1</span></label>
    <input id="lenSlider" type="range" min="0.1" max="3" step="0.1" value="1">

    <br><br>
    <button id="saveConsonantMenu">Save</button>
    <button id="cancelConsonantMenu">Cancel</button>
  `;

  document.body.appendChild(popup);

  popup.querySelector("#aspSlider").oninput = e =>
    popup.querySelector("#aspVal").textContent = e.target.value;

  popup.querySelector("#votSlider").oninput = e =>
    popup.querySelector("#votVal").textContent = e.target.value;

  popup.querySelector("#lenSlider").oninput = e =>
    popup.querySelector("#lenVal").textContent = e.target.value;

  popup.querySelector("#saveConsonantMenu").onclick = () => {
    consonantData.push({
      char,
      aspiration: parseFloat(popup.querySelector("#aspSlider").value),
      vot: parseFloat(popup.querySelector("#votSlider").value),
      length: parseFloat(popup.querySelector("#lenSlider").value)
    });

    outputBox.value += char;

    popup.remove();
  };

  popup.querySelector("#cancelConsonantMenu").onclick = () => popup.remove();
}

function makeIPA(char) {
  if (!char) return null;

  const span = document.createElement("span");
  span.textContent = char;
  span.classList.add("ipa-char");

  span.addEventListener("click", () => {
    const isConsonant = consonantsManners.some(row =>
      row.slice(1).some(([vless, vced]) => vless === char || vced === char)
    );

    if (isConsonant) {
      showConsonantMenu(char);
    } else {
      outputBox.value += char;
    }
  });

  return span;
}
