/* ===== NAV TOGGLE ===== */
const toggle = document.getElementById('header-toggle');
const nav = document.getElementById('nav-menu');

if (toggle && nav) {
  toggle.addEventListener('click', (e) => {
     e.stopPropagation();
    nav.classList.toggle('show');
    toggle.classList.toggle('bx-x');
  });
  
}

/* ===== ACTIVE NAV LINK ===== */
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
  link.addEventListener('click', function (evt) {

    // ✅ DROPDOWN BUTTON → ONLY TOGGLE DROPDOWN
    if (this.classList.contains('dropdown-btn')) {
      evt.preventDefault();
      evt.stopPropagation(); // 🔥 STOP MENU FROM CLOSING
      this.parentElement.classList.toggle('open');
      return; // ❗ DO NOT RUN CLOSE-NAV CODE
    }

    // ✅ NORMAL NAV LINK
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // close mobile nav
    const nav = document.getElementById('nav-menu');
    const toggle = document.getElementById('header-toggle');

    if (nav.classList.contains('show')) {
      nav.classList.remove('show');
      toggle.classList.remove('bx-x');
    }
  });
});


/* ===== CAROUSEL PAUSE / RESUME (desktop hover & touch/drag support) ===== */
const container = document.getElementById('auto-carousel-container');
const galleries = container ? container.querySelectorAll('.gallery') : [];

function pauseCarousel() {
  galleries.forEach(g => g.style.animationPlayState = 'paused');
}
function resumeCarousel() {
  galleries.forEach(g => g.style.animationPlayState = 'running');
}

/* Pause on hover (desktop) */
if (container) {
  container.addEventListener('mouseenter', pauseCarousel);
  container.addEventListener('mouseleave', resumeCarousel);
}

/* Pause on touchstart (mobile) so user can swipe */
galleries.forEach(g => {
  g.addEventListener('touchstart', pauseCarousel, {passive: true});
  g.addEventListener('touchend', resumeCarousel, {passive: true});
  g.addEventListener('touchcancel', resumeCarousel, {passive: true});
});

/* ===== POINTER-DRAG (allow user to drag the combined container) ===== */
/* We'll let the user drag the whole container — while dragging, animation is paused. */
let isDown = false;
let startX;
let scrollLeft;

if (container) {
  // support pointer events (mouse + touch)
  container.addEventListener('pointerdown', (e) => {
    isDown = true;
    container.setPointerCapture(e.pointerId);
    startX = e.clientX;
    // compute current scrollLeft
    scrollLeft = container.scrollLeft;
    pauseCarousel();
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const x = e.clientX;
    const walk = (startX - x); // positive when swiping left
    container.scrollLeft = scrollLeft + walk;
  });

  container.addEventListener('pointerup', (e) => {
    isDown = false;
    try { container.releasePointerCapture(e.pointerId); } catch (err) {}
    resumeCarousel();
  });

  container.addEventListener('pointercancel', () => {
    isDown = false;
    resumeCarousel();
  });

  // If the user uses mouse wheel horizontally, let it scroll normally
  container.addEventListener('wheel', (e) => {
    // only act on vertical wheel to convert to horizontal (nice UX)
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      container.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, {passive: false});
}

/* ===== FALLBACK: ensure galleries animation restarts if something stops it ===== */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseCarousel();
  else resumeCarousel();
});
