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
    text: 'whoami > Cybersecurity Enthusiast | CTF Player',
    elementId: 'typed-title',
    cursorId: 'cursor-title',
    nextLineId: 'line-desc',
    speed: 35
  },
  {
    text: 'cat mission.txt > "Learn. Hack. Document. Repeat."',
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
    if (!el || !cursor) continue;
    await typeText(seq.text, el, cursor, seq.speed);

    if (seq.nextLineId) {
      const nextLine = document.getElementById(seq.nextLineId);
      if (nextLine) nextLine.classList.remove('hidden');
    }
  }
}

window.addEventListener('load', () => {
  setTimeout(runTerminal, 600);
});

// ---- Mobile Nav Toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

// ---- Learning Track Horizontal Scroll ----
const learnTrack = document.getElementById('learnTrack');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

if (learnTrack && scrollLeftBtn && scrollRightBtn) {
  const scrollAmount = 300;

  scrollLeftBtn.addEventListener('click', () => {
    learnTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  scrollRightBtn.addEventListener('click', () => {
    learnTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Mouse drag scroll
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

  learnTrack.style.cursor = 'grab';
}

// ---- Wavy Achievement Timeline (Canvas) ----
function initWaveTimeline() {
  var container = document.getElementById('waveTimeline');
  var canvas = document.getElementById('waveCanvas');
  if (!container || !canvas) return;

  var ctx = canvas.getContext('2d');
  var phase = 0;
  var lastScroll = 0;
  var isVisible = false;

  function resize() {
    var rect = container.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawWave() {
    var w = canvas.style.width ? parseInt(canvas.style.width) : container.offsetWidth;
    var h = canvas.style.height ? parseInt(canvas.style.height) : container.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    var centerX = w / 2;
    var amplitude = 120 + Math.sin(phase * 0.3) * 30;
    var freq = 0.006;

    // Main wave line
    ctx.beginPath();
    ctx.moveTo(centerX, 0);

    for (var y = 0; y <= h; y += 1) {
      var wave1 = Math.sin(y * freq + phase) * amplitude;
      var wave2 = Math.sin(y * freq * 0.6 + phase * 1.4) * (amplitude * 0.3);
      var x = centerX + wave1 + wave2;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Glow layer
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    for (var y2 = 0; y2 <= h; y2 += 1) {
      var gw1 = Math.sin(y2 * freq + phase) * amplitude;
      var gw2 = Math.sin(y2 * freq * 0.6 + phase * 1.4) * (amplitude * 0.3);
      ctx.lineTo(centerX + gw1 + gw2, y2);
    }
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw dots at milestone positions
    var rows = container.querySelectorAll('.milestone-row');
    rows.forEach(function(row) {
      var rowRect = row.getBoundingClientRect();
      var containerRect = container.getBoundingClientRect();
      var dotY = rowRect.top - containerRect.top + rowRect.height / 2;
      var dotWave1 = Math.sin(dotY * freq + phase) * amplitude;
      var dotWave2 = Math.sin(dotY * freq * 0.6 + phase * 1.4) * (amplitude * 0.3);
      var dotX = centerX + dotWave1 + dotWave2;

      // Outer glow
      ctx.beginPath();
      ctx.arc(dotX, dotY, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.fill();

      // Inner dot
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
    });
  }

  // Only animate on scroll -- wave stays still until user scrolls
  window.addEventListener('scroll', function() {
    var scrollDelta = window.scrollY - lastScroll;
    lastScroll = window.scrollY;

    // Only redraw when the section is near the viewport
    var rect = container.getBoundingClientRect();
    var viewH = window.innerHeight;
    if (rect.top < viewH + 200 && rect.bottom > -200) {
      phase += scrollDelta * 0.008;
      drawWave();
    }
  }, { passive: true });

  window.addEventListener('resize', function() {
    resize();
    drawWave();
  });

  resize();
  drawWave();
}

// ---- Writeup Loader ----
function initWriteups() {
  const grid = document.getElementById('writeupsGrid');
  if (!grid) return;

  fetch('writeups/index.json')
    .then(res => {
      if (!res.ok) throw new Error('No writeups index found');
      return res.json();
    })
    .then(writeups => {
      if (!writeups.length) {
        grid.innerHTML = '<p style="text-align:center;color:#8888a0;grid-column:1/-1;">No writeups yet. Check back soon!</p>';
        return;
      }

      grid.innerHTML = writeups.map(w => {
        return '<a href="writeup.html?file=' + encodeURIComponent(w.file) + '" class="writeup-card">' +
          '<div class="writeup-meta">' +
            '<span class="ctf-tag">' + escapeHtml(w.ctf || 'CTF') + '</span>' +
            '<time>' + escapeHtml(w.date || '') + '</time>' +
          '</div>' +
          '<h3>' + escapeHtml(w.title) + '</h3>' +
          '<p>' + escapeHtml(w.summary || '') + '</p>' +
          '<span class="read-more">Read writeup &rarr;</span>' +
        '</a>';
      }).join('');

      // Apply reveal to new cards
      grid.querySelectorAll('.writeup-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
      });
    })
    .catch(() => {
      grid.innerHTML = '<p style="text-align:center;color:#8888a0;grid-column:1/-1;">No writeups yet. Check back soon!</p>';
    });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Scroll Reveal Animation ----
let revealObserver;

function initReveal() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  const revealElements = document.querySelectorAll(
    '.learn-card, .news-card, .milestone-row, .link-card'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
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
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => observer.observe(section));
}

// ---- Nav theme transition on scroll ----
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Find the point where the page transitions to dark
  // We use the news section as the transition zone
  function updateNav() {
    const newsSection = document.getElementById('news');
    if (!newsSection) {
      // Fallback: switch at 60% of viewport height
      nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.6);
      return;
    }
    const newsTop = newsSection.getBoundingClientRect().top;
    nav.classList.toggle('scrolled', newsTop < 120);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// ---- Init Everything ----
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initActiveNav();
  initNavScroll();
  initWaveTimeline();
  initWriteups();
});
