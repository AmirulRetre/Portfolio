/* ========================================
   PORTFOLIO — @mirulRetre
   Interactive Scripts
   ======================================== */

// ---- Terminal Typing Animation ----
const typeSequence = [
  {
    text: 'echo "Amirul Irfan aka @mirulRetre"',
    elementId: 'typed-name',
    cursorId: 'cursor-name',
    nextLineId: 'line-title',
    speed: 45
  },
  {
    text: 'whoami → Cybersecurity Enthusiast | CTF Player',
    elementId: 'typed-title',
    cursorId: 'cursor-title',
    nextLineId: 'line-desc',
    speed: 35
  },
  {
    text: 'cat mission.txt → "Learn. Hack. Document. Repeat."',
    elementId: 'typed-desc',
    cursorId: 'cursor-desc',
    nextLineId: 'line-ready',
    speed: 30
  }
];

function typeText(text, element, cursor, speed) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        cursor.style.display = 'none';
        setTimeout(resolve, 300);
      }
    }, speed);
  });
}

async function runTerminal() {
  for (const seq of typeSequence) {
    const el = document.getElementById(seq.elementId);
    const cursor = document.getElementById(seq.cursorId);
    await typeText(seq.text, el, cursor, seq.speed);

    if (seq.nextLineId) {
      const nextLine = document.getElementById(seq.nextLineId);
      if (nextLine) {
        nextLine.classList.remove('hidden');
      }
    }
  }
}

// Start terminal animation on load
window.addEventListener('load', () => {
  setTimeout(runTerminal, 600);
});

// ---- Mobile Nav Toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ---- Learning Track Horizontal Scroll ----
const learnTrack = document.getElementById('learnTrack');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

const scrollAmount = 300;

scrollLeftBtn.addEventListener('click', () => {
  learnTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

scrollRightBtn.addEventListener('click', () => {
  learnTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

// Mouse drag scroll for the learn track
let isDown = false;
let startX;
let scrollLeftPos;

learnTrack.addEventListener('mousedown', (e) => {
  isDown = true;
  learnTrack.style.cursor = 'grabbing';
  startX = e.pageX - learnTrack.offsetLeft;
  scrollLeftPos = learnTrack.scrollLeft;
});

learnTrack.addEventListener('mouseleave', () => {
  isDown = false;
  learnTrack.style.cursor = 'grab';
});

learnTrack.addEventListener('mouseup', () => {
  isDown = false;
  learnTrack.style.cursor = 'grab';
});

learnTrack.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - learnTrack.offsetLeft;
  const walk = (x - startX) * 1.5;
  learnTrack.scrollLeft = scrollLeftPos - walk;
});

// Set initial cursor
learnTrack.style.cursor = 'grab';

// ---- Scroll Reveal Animation ----
function initReveal() {
  const revealElements = document.querySelectorAll(
    '.learn-card, .news-card, .timeline-item, .link-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
}

// ---- Active Nav Highlight ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => observer.observe(section));
}

// ---- Nav background on scroll ----
function initNavScroll() {
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.style.borderBottomColor = 'rgba(59, 130, 246, 0.15)';
    } else {
      nav.style.borderBottomColor = '';
    }
  });
}

// ---- Init Everything ----
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initActiveNav();
  initNavScroll();
});
