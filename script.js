const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const nav = document.getElementById('nav');
const menuToggle = document.getElementById('menuToggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));



/* Basic browser protections */
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', function(e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && ['I','J','C'].includes((e.key || '').toUpperCase())) ||
    (e.ctrlKey && ['U','S'].includes((e.key || '').toUpperCase()))
  ) {
    e.preventDefault();
    return false;
  }
});
