document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo');
  const overlay = document.getElementById('loading-overlay');

  if (logo) {
    logo.addEventListener('click', () => {
      createBouncingClones(logo, 5);
      overlay.style.display = 'flex';

      setTimeout(() => {
        window.location.href = 'game.html';
      }, 5000);
    });
  }
});

function createBouncingClones(sourceLogo, count) {
  const rect = sourceLogo.getBoundingClientRect();
  const clones = [];

  for (let i = 0; i < count; i++) {
    const clone = sourceLogo.cloneNode(true);
    clone.classList.add('falling-clone');
    document.body.appendChild(clone);

    const size = 50;
    const pos = {
      x: rect.left + rect.width / 2 + window.scrollX + (Math.random() * 200 - 100),
      y: rect.top + rect.height / 2 + window.scrollY + (Math.random() * 100 - 50)
    };

    clone.style.position = 'absolute';
    clone.style.left = `${pos.x}px`;
    clone.style.top = `${pos.y}px`;
    clone.style.width = `${size}px`;
    clone.style.pointerEvents = 'none';
    clone.style.opacity = '1';

    const velocity = {
      x: Math.random() * 6 - 3,
      y: Math.random() * 6 + 6
    };

    clones.push({ el: clone, pos, velocity, size });
  }

  const gravity = 0.5;
  const damping = 0.85;
  const minBounceUpward = -8;
  const bounds = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const interval = setInterval(() => {
    for (let i = 0; i < clones.length; i++) {
      const clone = clones[i];
      const { el, pos, velocity, size } = clone;

      // Gravity
      velocity.y += gravity;
      pos.x += velocity.x;
      pos.y += velocity.y;

      // Edge bounce
      if (pos.x <= 0 || pos.x + size >= bounds.width) {
        velocity.x *= -damping;
        pos.x = Math.max(0, Math.min(pos.x, bounds.width - size));
      }

      if (pos.y + size >= bounds.height) {
        velocity.y *= -damping;
        if (velocity.y > -minBounceUpward) velocity.y = minBounceUpward;
        pos.y = bounds.height - size;
      }

      // Lavender trail
      const trail = document.createElement('div');
      trail.classList.add('trail-dot');
      trail.style.left = `${pos.x + size / 2}px`;
      trail.style.top = `${pos.y + size / 2}px`;
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 1000);

      // Collision with other clones
      for (let j = i + 1; j < clones.length; j++) {
        const other = clones[j];
        const dx = other.pos.x - pos.x;
        const dy = other.pos.y - pos.y;
        const dist = Math.hypot(dx, dy);
        const minDist = size;

        if (dist < minDist) {
          const angle = Math.atan2(dy, dx);
          const targetX = pos.x + Math.cos(angle) * minDist;
          const targetY = pos.y + Math.sin(angle) * minDist;
          const ax = (targetX - other.pos.x) * 0.05;
          const ay = (targetY - other.pos.y) * 0.05;

          velocity.x -= ax;
          velocity.y -= ay;
          other.velocity.x += ax;
          other.velocity.y += ay;
        }
      }

      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
    }
  }, 20);

  setTimeout(() => {
    clearInterval(interval);
    clones.forEach(c => c.el.remove());
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  // Existing logo click logic...

  const footerSecret = document.getElementById('footer-secret');
  const overlay = document.getElementById('loading-overlay');

  if (footerSecret) {
    footerSecret.addEventListener('click', () => {
      footerSecret.classList.add('blowing-up');
      overlay.style.display = 'flex';

      setTimeout(() => {
        window.location.href = 'secret.html';
      }, 5000);
    });
  }
});
