async function playIPASequence(text) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  let currentTime = ctx.currentTime;

  const vowels = new Set(["æ", "ɑ", "ɒ", "ə", "ɛ","i", "ɪ", "u", "ʊ", "ʌ"]);

  function getConsonantParams(symbol) {
    for (let i = 0; i < consonantData.length; i++) {
      if (consonantData[i].char === symbol) {
        return consonantData.splice(i, 1)[0];
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

  function findLoudestSegment(buffer, ctx, windowSizeSec = 0.04) {
    const data = buffer.getChannelData(0);
    const windowSize = Math.floor(ctx.sampleRate * windowSizeSec);

    let maxEnergy = 0;
    let bestIndex = 0;

    for (let i = 0; i < data.length - windowSize; i += windowSize / 2) {
      let energy = 0;

      for (let j = 0; j < windowSize; j++) {
        const s = data[i + j];
        energy += s * s;
      }

      if (energy > maxEnergy) {
        maxEnergy = energy;
        bestIndex = i;
      }
    }

    return { start: bestIndex, length: windowSize };
  }

  function smartStretch(ctx, buffer, factor) {
    if (factor === 1) return buffer;

    const { start, length } = findLoudestSegment(buffer, ctx);

    const attackEnd = start;
    const releaseStart = start + length;

    const input = buffer.getChannelData(0);

    const attack = input.slice(0, attackEnd);
    const loop = input.slice(start, releaseStart);
    const release = input.slice(releaseStart);

    const loopCount = Math.max(1, Math.floor(factor * 2));

    const newLength =
      attack.length +
      loop.length * loopCount +
      release.length;

    const newBuf = ctx.createBuffer(1, newLength, ctx.sampleRate);
    const out = newBuf.getChannelData(0);

    let pos = 0;

    out.set(attack, pos);
    pos += attack.length;

    for (let i = 0; i < loopCount; i++) {
      out.set(loop, pos);
      pos += loop.length;
    }

    out.set(release, pos);

    return newBuf;
  }

  for (let i = 0; i < text.length; i++) {
    const symbol = text[i];

    let url;
    if (vowels.has(symbol)) {
      url = `vowels/${symbol}.wav`;
    } else {
      url = `cons/${symbol}/${symbol}.wav`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`No file for ${symbol} at ${url}`);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      let params = null;
      if (!vowels.has(symbol)) {
        params = getConsonantParams(symbol);
      }

      let source = ctx.createBufferSource();
      let lengthFactor = params ? params.length : 1;

      const stretchedBuffer = smartStretch(ctx, audioBuffer, lengthFactor);

      source.buffer = stretchedBuffer;
      source.connect(ctx.destination);

      if (params && params.vot !== 0) {
        const votSeconds = params.vot / 1000;
        if (votSeconds > 0) {
          currentTime += votSeconds;
        } else {
          const cut = Math.abs(votSeconds);
          if (cut < source.buffer.duration) {
            const newBuf = ctx.createBuffer(
              1,
              (source.buffer.duration - cut) * ctx.sampleRate,
              ctx.sampleRate
            );
            const oldData = source.buffer.getChannelData(0);
            const newData = newBuf.getChannelData(0);
            const startIndex = Math.floor(cut * ctx.sampleRate);
            for (let n = 0; n < newData.length; n++) {
              newData[n] = oldData[n + startIndex];
            }
            source = ctx.createBufferSource();
            source.buffer = newBuf;
            source.playbackRate.value = 1 / params.length;
            source.connect(ctx.destination);
          }
        }
      }

      source.start(currentTime);
      currentTime += source.buffer.duration;

      if (params && params.aspiration > 0) {
        const noise = createNoise(0.1, params.aspiration);
        noise.connect(ctx.destination);
        noise.start(currentTime);
        currentTime += 0.1;
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