/* ============================================================
   MITHARI AGRO AGENCY — Shared App JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Init Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // ---- CUSTOM CURSOR ----
  const ring = document.getElementById('cursorRing');
  const dot  = document.getElementById('cursorDot');

  if (ring && dot) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    // Show cursors once mouse moves
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.classList.add('active'); ring.classList.add('active');
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';

      // Detect dark backgrounds
      const el = document.elementFromPoint(mouseX, mouseY);
      const dark = el && (
        el.closest('.hero') || el.closest('.page-hero') ||
        el.closest('.stats-band') || el.closest('.site-footer') ||
        el.closest('.info-card') || el.closest('.results-card')
      );
      ring.classList.toggle('on-dark', !!dark);
      dot.classList.toggle('on-dark', !!dark);
    });

    // Ring follows mouse with slight lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover effect on interactive elements
    const hoverEls = 'a, button, .btn, .acc-btn, .tab-btn, .crop-btn, .card, .eco-card, .sol-card, .team-card, .quick-box';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
      ring.classList.remove('active');
      dot.classList.remove('active');
    });
  }

  // ---- ELEMENTS ----
  const nav         = document.getElementById('siteNav');
  const scrollBar   = document.getElementById('scrollBar');
  const burger      = document.getElementById('burger');
  const drawer      = document.getElementById('mobDrawer');
  const overlay     = document.getElementById('drawerOverlay');
  const backTop     = document.getElementById('backTop');

  // ---- SCROLL: progress + nav style + back-to-top ----
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docH    = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar)  scrollBar.style.width = `${(scrollY / docH) * 100}%`;
    if (nav)        nav.classList.toggle('scrolled', scrollY > 40);
    if (backTop)    backTop.classList.toggle('show', scrollY > 400);
  });

  if (backTop) backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ---- MOBILE DRAWER ----
  const openDrawer  = () => { drawer?.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { drawer?.classList.remove('open'); overlay?.classList.remove('open'); document.body.style.overflow = ''; };

  burger?.addEventListener('click', () => burger.classList.contains('open') ? (burger.classList.remove('open'), closeDrawer()) : (burger.classList.add('open'), openDrawer()));
  overlay?.addEventListener('click', () => { burger?.classList.remove('open'); closeDrawer(); });
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { burger?.classList.remove('open'); closeDrawer(); }));

  // ---- ACTIVE NAV LINK ----
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mob-drawer a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ---- SCROLL REVEAL (Intersection Observer) ----
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // Trigger counters
        e.target.querySelectorAll('[data-count]').forEach(el => {
          if (!el.dataset.counted) {
            el.dataset.counted = '1';
            animateCount(el);
          }
        });
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Also observe stat containers separately
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => {
          if (!el.dataset.counted) { el.dataset.counted = '1'; animateCount(el); }
        });
        statObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.stats-row, .stats-grid').forEach(el => statObs.observe(el));

  // Progress bar reveal
  const progObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.prog-fill[data-width]').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
        progObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.prog-container').forEach(el => progObs.observe(el));

  // ---- COUNTER ANIMATION ----
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const pct = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const ease = pct === 1 ? 1 : 1 - Math.pow(2, -10 * pct);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (pct < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  // ---- TABS ----
  document.querySelectorAll('.tab-wrap').forEach(tabWrap => {
    const panel = tabWrap.closest('.tab-section') || tabWrap.parentElement;
    tabWrap.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabWrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetId = btn.dataset.target;
        panel.querySelectorAll('.tab-panel').forEach(p => {
          p.classList.toggle('active', p.id === targetId);
        });
      });
    });
  });

  // ---- ACCORDION ----
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      // Close all in same group
      item.closest('.accordion')?.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ---- MODAL ----
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal);
      modal?.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', (e) => {
      if (e.target === bg) closeModal(bg);
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-bg')));
  });
  function closeModal(bg) {
    bg?.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-bg.open').forEach(m => closeModal(m));
  });

  // ---- FORM HANDLER (generic) ----
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successId = form.dataset.success;
      const successEl = document.getElementById(successId);
      
      const formData = new FormData(form);
      const action = form.getAttribute('action');
      
      // Perform AJAX submission if action is set
      if (action) {
        fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          console.log('[Mithari Agro] Form submitted via AJAX:', response);
        })
        .catch(err => {
          console.error('[Mithari Agro] AJAX submission failed:', err);
        });
      }
      
      // Gather and log data locally
      const data = Object.fromEntries(formData.entries());
      console.log('[Mithari Agro] Local Form Submit:', data);
      
      if (successEl) {
        form.classList.add('hidden');
        successEl.classList.remove('hidden');
        setTimeout(() => {
          successEl.classList.add('hidden');
          form.reset();
          form.classList.remove('hidden');
        }, 6000);
      }
    });
  });

  // ---- SMOOTH SCROLL on anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
    });
  });

}); // end DOMContentLoaded

/* ---- PAGE-SPECIFIC: Planner Calculator ---- */
function initPlanner() {
  // If the page overrides initPlanner (like planner.html), do not run the default basic version
  if (window.initPlanner && window.initPlanner !== initPlanner) return;

  const acre  = document.getElementById('acreRange');
  const acreV = document.getElementById('acreVal');
  const crop  = document.getElementById('cropType');

  if (!acre || !crop || !acreV) return;

  const update = () => {
    const a = +acre.value;
    const c = crop.value;
    acreV.textContent = a;

    const data = {
      horticulture: { system: 'Micro-Sprinkler & Emitter Drip', pipe: '63mm PN6 HDPE', save: 320000, pond: 35000 },
      vegetables:   { system: 'Inline Drip (16mm Laterals)',    pipe: '75mm PN6 HDPE', save: 240000, pond: 25000 },
      field:        { system: 'Portable Impact Sprinklers',     pipe: '90mm PN4 HDPE', save: 180000, pond: 20000 },
      cash:         { system: 'Drip & Sub-main Network',        pipe: '75mm/90mm HDPE', save: 280000, pond: 30000 },
    };

    const d = data[c] || data.vegetables;
    const saved = d.save * a;
    const pond  = d.pond  * a;

    setText('resSysType', d.system);
    setText('resPipe', d.pipe);
    setText('resSaved', saved >= 1e6 ? `${(saved/1e6).toFixed(1)}M Liters` : `${(saved/1000).toFixed(0)}K Liters`);
    setText('resPond', `${pond.toLocaleString()} Liters`);

    // Track fill
    const fill = document.getElementById('trackFill');
    if (fill) fill.style.width = `${Math.round((a / +acre.max) * 100)}%`;
  };

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  acre.addEventListener('input', update);
  crop.addEventListener('change', update);
  update();
}

document.addEventListener('DOMContentLoaded', initPlanner);
