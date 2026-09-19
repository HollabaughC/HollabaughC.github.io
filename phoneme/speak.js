const VOWEL_SYMBOLS = [
  "EI", "AI", "OI", "@U", "aU", "Or",
  "i", "I", "E", "{", "A", "O", "U", "u", "V", "@"
];

const CONSONANT_SYMBOLS = [
  "p_h", "t_h", "k_h", "tS", "dZ", "l=", "r=",
  "p", "b", "t", "d", "k", "g", "4",
  "f", "v", "s", "z", "S", "Z", "T", "D", "h",
  "m", "n", "N",
  "l", "r",
  "j", "w"
];

const ALL_SYMBOLS = [...VOWEL_SYMBOLS, ...CONSONANT_SYMBOLS]
  .sort((a, b) => b.length - a.length);

const VOWEL_SET = new Set(VOWEL_SYMBOLS);

function tokenize(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (/\s/.test(text[i])) { i++; continue; }

    let matched = null;
    for (const sym of ALL_SYMBOLS) {
      if (text.startsWith(sym, i)) {
        matched = sym;
        break;
      }
    }
    if (matched) {
      tokens.push(matched);
      i += matched.length;
    } else {
      i++;
    }
  }
  return tokens;
}

function detectVoicing(input, sampleRate) {
  const n = Math.min(input.length, Math.floor(sampleRate * 0.05));
  if (n < 128) return 0;

  let zcr = 0;
  for (let i = 1; i < n; i++) {
    if ((input[i] >= 0) !== (input[i - 1] >= 0)) zcr++;
  }
  const zcrRate = zcr / n;
  if (zcrRate > 0.08) return 0;

  const minLag = Math.floor(sampleRate / 400);
  const maxLag = Math.floor(sampleRate / 60);
  if (maxLag >= n) return 0;

  let bestCorr = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    let e1 = 0;
    let e2 = 0;
    const m = n - lag;
    for (let i = 0; i < m; i++) {
      const a = input[i];
      const b = input[i + lag];
      corr += a * b;
      e1 += a * a;
      e2 += b * b;
    }
    if (e1 > 0 && e2 > 0) {
      const c = corr / Math.sqrt(e1 * e2);
      if (c > bestCorr) bestCorr = c;
    }
  }
  if (bestCorr < 0.4) return 0;
  return bestCorr;
}

function olaRandom(input, factor, sampleRate) {
  const inLen = input.length;
  if (inLen < 128) return input;

  const grainSize = Math.max(64, Math.floor(sampleRate * 0.015));
  const hopOut = Math.max(1, Math.floor(grainSize / 2));
  let hopIn = Math.round(hopOut / factor);
  if (hopIn < 1) hopIn = 1;
  if (hopIn > grainSize - 1) hopIn = grainSize - 1;

  const jitter = Math.floor(hopIn * 0.25);
  const estOutLen = Math.ceil((inLen / hopIn) * hopOut) + grainSize * 2;
  const out = new Float32Array(estOutLen);
  const win = new Float32Array(grainSize);
  for (let i = 0; i < grainSize; i++) {
    win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (grainSize - 1));
  }

  let inPos = 0;
  let outPos = 0;

  while (inPos + grainSize <= inLen && outPos + grainSize <= estOutLen) {
    const jit = jitter > 0 ? Math.floor((Math.random() * 2 - 1) * jitter) : 0;
    const srcStart = Math.max(0, Math.min(inLen - grainSize, inPos + jit));
    for (let i = 0; i < grainSize; i++) {
      out[outPos + i] += input[srcStart + i] * win[i];
    }
    inPos += hopIn;
    outPos += hopOut;
  }

  const finalLen = Math.min(outPos + grainSize, out.length);
  if (finalLen <= 0) return input;
  return out.subarray(0, finalLen);
}

function wsola(input, factor, sampleRate) {
  if (!isFinite(factor) || factor <= 0) return input;
  if (Math.abs(factor - 1) < 0.01) return input;

  const inLen = input.length;
  if (inLen < 512) return input;

  const voicing = detectVoicing(input, sampleRate);

  if (voicing < 0.4) {
    const capped = Math.min(factor, 1.5);
    return olaRandom(input, capped, sampleRate);
  }

  const searchRadius = Math.max(1, Math.floor(sampleRate * 0.010));
  const grainSize = Math.max(
    Math.floor(sampleRate * 0.08),
    Math.floor(sampleRate / 60) * 4
  );
  const hopOut = Math.max(1, Math.floor(grainSize / 4));
  let hopIn = Math.round(hopOut / factor);
  if (hopIn < 1) hopIn = 1;
  if (hopIn > grainSize - 1) hopIn = grainSize - 1;

  const estOutLen = Math.ceil((inLen / hopIn) * hopOut) + grainSize * 2;
  const out = new Float32Array(estOutLen);
  const win = new Float32Array(grainSize);
  for (let i = 0; i < grainSize; i++) {
    win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (grainSize - 1));
  }

  const refLen = Math.min(hopOut, Math.floor(sampleRate * 0.02));

  let inPos = 0;
  let outPos = 0;

  while (inPos + grainSize <= inLen && outPos + grainSize <= estOutLen) {
    let bestOffset = 0;

    if (outPos > 0 && refLen > 0) {
      const refStart = outPos;
      let refEnergy = 0;
      for (let i = 0; i < refLen; i++) {
        const v = out[refStart + i];
        refEnergy += v * v;
      }

      if (refEnergy > 1e-9) {
        let bestScore = -Infinity;
        const searchStart = Math.max(-searchRadius, -inPos);
        const searchEnd = Math.min(searchRadius, inLen - grainSize - inPos);

        for (let off = searchStart; off <= searchEnd; off++) {
          const cmpStart = inPos + off;
          let corr = 0;
          let cmpEnergy = 0;
          for (let i = 0; i < refLen; i++) {
            const a = out[refStart + i];
            const b = input[cmpStart + i];
            corr += a * b;
            cmpEnergy += b * b;
          }
          if (cmpEnergy <= 1e-9) continue;
          const norm = corr / Math.sqrt(refEnergy * cmpEnergy);
          if (norm > bestScore) {
            bestScore = norm;
            bestOffset = off;
          }
        }
      }
    }

    const srcStart = inPos + bestOffset;
    for (let i = 0; i < grainSize; i++) {
      const s = srcStart + i;
      if (s >= 0 && s < inLen) {
        out[outPos + i] += input[s] * win[i];
      }
    }

    inPos += hopIn;
    outPos += hopOut;
  }

  const finalLen = Math.min(outPos + grainSize, out.length);
  if (finalLen <= 0) return input;
  return out.subarray(0, finalLen);
}

function applyEdgeFade(buffer, fadeSamples) {
  const data = buffer.getChannelData(0);
  const n = Math.min(fadeSamples, Math.floor(data.length / 2));
  if (n <= 0) return;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    data[i] *= t;
    data[data.length - 1 - i] *= t;
  }
}

async function playIPASequence(text) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  let currentTime = ctx.currentTime;

  const usedParams = new Set();

  function getConsonantParams(symbol) {
    for (let i = 0; i < consonantData.length; i++) {
      if (consonantData[i].char === symbol && !usedParams.has(i)) {
        usedParams.add(i);
        return consonantData[i];
      }
    }
    return null;
  }

  function createNoise(duration, aspirationStrength) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * aspirationStrength;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    return source;
  }

  function extractMono(audioBuffer) {
    if (audioBuffer.numberOfChannels === 1) {
      return audioBuffer.getChannelData(0);
    }
    const L = audioBuffer.getChannelData(0);
    const R = audioBuffer.getChannelData(1);
    const out = new Float32Array(L.length);
    for (let i = 0; i < L.length; i++) out[i] = (L[i] + R[i]) * 0.5;
    return out;
  }

  const tokens = tokenize(text);

  for (const symbol of tokens) {
    const isVowel = VOWEL_SET.has(symbol);
    const url = isVowel
      ? `vowels/${encodeURIComponent(symbol)}.wav`
      : `cons/${encodeURIComponent(symbol)}/${encodeURIComponent(symbol)}.wav`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`No file for ${symbol} at ${url}`);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const params = isVowel ? null : getConsonantParams(symbol);

      let bufferToPlay = audioBuffer;

      if (params && params.length && params.length !== 1) {
        const mono = extractMono(audioBuffer);
        const stretched = wsola(mono, params.length, ctx.sampleRate);
        if (stretched && stretched.length > 0) {
          const newBuf = ctx.createBuffer(1, stretched.length, ctx.sampleRate);
          newBuf.getChannelData(0).set(stretched);
          bufferToPlay = newBuf;
        }
      } else {
        bufferToPlay = ctx.createBuffer(
          1,
          audioBuffer.length,
          audioBuffer.sampleRate
        );
        bufferToPlay.getChannelData(0).set(extractMono(audioBuffer));
      }

      let preSilence = 0;
      if (params && params.vot) {
        const votSeconds = params.vot / 1000;
        if (votSeconds > 0) {
          preSilence = votSeconds;
        } else if (votSeconds < 0) {
          const cut = Math.min(Math.abs(votSeconds), bufferToPlay.duration - 0.005);
          if (cut > 0) {
            const startIndex = Math.floor(cut * ctx.sampleRate);
            const newLength = bufferToPlay.length - startIndex;
            if (newLength > 0) {
              const cutBuf = ctx.createBuffer(1, newLength, ctx.sampleRate);
              const oldData = bufferToPlay.getChannelData(0);
              const newData = cutBuf.getChannelData(0);
              for (let n = 0; n < newLength; n++) {
                newData[n] = oldData[n + startIndex];
              }
              bufferToPlay = cutBuf;
            }
          }
        }
      }

      const isUnvoicedShort = bufferToPlay.length < ctx.sampleRate * 0.04;
      if (!isUnvoicedShort) {
        applyEdgeFade(bufferToPlay, Math.floor(ctx.sampleRate * 0.003));
      }

      const source = ctx.createBufferSource();
      source.buffer = bufferToPlay;
      source.connect(ctx.destination);

      const playAt = currentTime + preSilence;
      source.start(playAt);
      currentTime = playAt + bufferToPlay.duration;

      if (params && params.aspiration > 0) {
        const noise = createNoise(0.08, params.aspiration);
        noise.connect(ctx.destination);
        noise.start(currentTime);
        currentTime += 0.08;
      }
    } catch (err) {
      console.error(`Error loading ${symbol}:`, err);
    }
  }
}

document.getElementById("speakBtn").addEventListener("click", () => {
  const text = document.getElementById("outputBox").value.trim();
  if (text) {
    playIPASequence(text);
  }
});