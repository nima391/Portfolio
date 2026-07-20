// ==========================================================================
// Nimsith Yuthika — Portfolio interactions
// ==========================================================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Header scroll state ---------- */
const header = document.getElementById('site-header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  header.classList.toggle('mobile-open');
});
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    header.classList.remove('mobile-open');
  });
});

/* ---------- Scroll reveal ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealTargets = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealTargets.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ---------- Dark Vale radar progress trigger ---------- */
const radar = document.getElementById('game-radar');
if (radar) {
  const radarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        radar.classList.add('in-view');
        radarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  radarObserver.observe(radar);
}

/* ---------- Ambient particle field (full page, fixed to viewport) ---------- */
const canvas = document.getElementById('particle-canvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const LINK_DIST = 130;

  function density() {
    // scale particle count to viewport area, capped for performance
    const area = window.innerWidth * window.innerHeight;
    return Math.min(90, Math.max(35, Math.round(area / 22000)));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * DPR;
    canvas.height = height * DPR;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function makeParticles() {
    const count = density();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vy: -(Math.random() * 0.28 + 0.06),
      vx: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(255, 45, 66, ${0.14 * (1 - dist / LINK_DIST)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.y > height + 10) { p.y = -10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 45, 66, ${p.alpha})`;
      ctx.shadowColor = 'rgba(255, 26, 53, 0.8)';
      ctx.shadowBlur = 6;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  makeParticles();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      makeParticles();
    }, 200);
  });
}
