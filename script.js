// Hamburger menu
const hamburger = document.getElementById('navHamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll progress bar
  window.addEventListener('scroll', () => {
    const el = document.getElementById('scrollLine');
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    el.style.width = pct + '%';
  });

  // Section reveal on scroll (reveals once, then stays — smooth, no re-trigger)
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach(s => observer.observe(s));
// Floating emoji animation (hero + contact)
const emojis = ['🪩','🐱','☕','💗','✨','💻','⚙️','🤖','🌐','🎀','💾','👾','🔗','🍵','💫','⌨️','🛠️'];
const emojiContainers = document.querySelectorAll('.emoji-spawn');

function spawnEmoji() {
  emojiContainers.forEach(container => {
    const el = document.createElement('span');
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const duration = 4 + Math.random() * 4;
    el.style.cssText = [
      'position: absolute',
      'font-size: ' + (1.2 + Math.random() * 1.2) + 'rem',
      'left: ' + (Math.random() * 90) + '%',
      'bottom: -50px',
      'opacity: 0',
      'animation: floatUp ' + duration + 's linear forwards',
      'pointer-events: none',
      'z-index: 1',
    ].join(';');
    container.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  });
}

setInterval(spawnEmoji, 600);

// Dark / light mode toggle
const themeToggle = document.getElementById('themeToggle');

// Apply saved preference on load
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

function updateToggleIcon() {
  if (!themeToggle) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.textContent = isDark ? '☀' : '☾';
}
updateToggleIcon();

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    updateToggleIcon();
  });
}

// Project scatter → expand-to-center interaction
const projStage = document.getElementById('projStage');
const projItems = projStage ? Array.from(projStage.querySelectorAll('.proj-item')) : [];

function clearProjPositions() {
  projItems.forEach(it => {
    it.style.left = '';
    it.style.right = '';
    it.style.top = '';
    it.style.transform = '';
  });
}

function openProject(item) {
  clearProjPositions();
  projStage.classList.add('has-open');
  projItems.forEach(it => it.classList.remove('open'));
  item.classList.add('open');

  // park the rest in two side columns
  const others = projItems.filter(it => it !== item);
  let leftCount = 0, rightCount = 0;
  others.forEach((it, idx) => {
    const onLeft = idx % 2 === 0;
    const pos = onLeft ? leftCount++ : rightCount++;
    it.style.top = (24 + pos * 92) + 'px';
    if (onLeft) {
      it.style.left = '0px';
      it.style.right = 'auto';
      it.style.transform = 'rotate(-3deg) scale(0.82)';
    } else {
      it.style.left = 'auto';
      it.style.right = '0px';
      it.style.transform = 'rotate(3deg) scale(0.82)';
    }
  });
}

function closeProject() {
  projStage.classList.remove('has-open');
  projItems.forEach(it => it.classList.remove('open'));
  clearProjPositions();
}

// Mobile accordion — projects & skills
function isMobile() { return window.innerWidth <= 768; }

if (projStage) {
  projStage.addEventListener('click', (e) => {
    if (!isMobile()) return;
    const item = e.target.closest('.proj-item');
    if (!item) return;
    const isOpen = item.classList.toggle('mobile-open');
    // close others
    projItems.forEach(it => { if (it !== item) it.classList.remove('mobile-open'); });
  });
}

document.querySelectorAll('.skill-group').forEach(group => {
  group.addEventListener('click', () => {
    if (!isMobile()) return;
    group.classList.toggle('mobile-open');
  });
});

if (projStage && window.innerWidth > 768) {
  projStage.addEventListener('click', (e) => {
    const item = e.target.closest('.proj-item');
    if (projStage.classList.contains('has-open')) {
      // a parked side card switches the selection; anything else closes
      if (item && !item.classList.contains('open')) {
        openProject(item);
      } else {
        closeProject();
      }
    } else if (item) {
      openProject(item);
    }
  });

  // Esc closes the open card
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projStage.classList.contains('has-open')) closeProject();
  });
}     