import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/* ==========================================================================
   1. SAFE AUDIO SYNTHESIZER (WEB AUDIO API)
   Zero audio file dependencies — 100% resilient with try/catch wrapping
   ========================================================================== */
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('bronx_muted') === 'true';
  }

  ensureContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx && AudioCtx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      // Audio context silently handled if blocked by browser policy
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('bronx_muted', this.isMuted);
    return this.isMuted;
  }

  playLatchOpen() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(550, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(320, now);
      osc2.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.1);
      osc2.stop(now + 0.1);
    } catch (e) {}
  }

  playLatchClose() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {}
  }

  playChime() {
    if (this.isMuted) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }
}

const audio = new AudioEngine();

/* ==========================================================================
   2. DAY / NIGHT THEME SWITCHER
   Immediate theme flip, smooth button rotation, and accurate CSS variables
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const htmlEl = document.documentElement;

  // Stored preference or default
  const savedTheme = localStorage.getItem('bronx_theme') || 'dark';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      audio.playChime();
      const current = htmlEl.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';

      // GSAP smooth flip on the button
      gsap.fromTo(toggleBtn, 
        { rotate: 0, scale: 0.85 }, 
        { rotate: 360, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }
      );

      htmlEl.setAttribute('data-theme', nextTheme);
      localStorage.setItem('bronx_theme', nextTheme);

      showToast(`Switched to ${nextTheme === 'dark' ? 'Night Obsidian' : 'Day Alabaster'} mode`);
    });
  }

  // Sound toggle button setup
  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    if (audio.isMuted) soundBtn.classList.add('muted');
    soundBtn.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      soundBtn.classList.toggle('muted', isMuted);
      showToast(isMuted ? 'Sound FX Muted' : 'Sound FX Enabled');
    });
  }
}

/* ==========================================================================
   3. HERO GSAP ENTRANCE & 3D INTERACTIVE TILT
   ========================================================================== */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('#siteHeader', { y: -70, opacity: 0, duration: 0.8 })
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('.hero-title', { y: 35, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.hero-lead', { y: 25, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero-actions', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-telemetry', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
    .from('#heroLuggageStage', { scale: 0.88, opacity: 0, duration: 1, ease: 'back.out(1.3)' }, '-=0.8')
    .from('.hero-hotspot', { scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: 'back.out(2)' }, '-=0.4');

  // Mouse Movement 3D Perspective Tilt on Hero Luggage Box
  const stage = document.getElementById('heroLuggageStage');
  const box = document.getElementById('heroLuggageBox');

  if (stage && box) {
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(box, {
        rotateY: x * 22,
        rotateX: -y * 22,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.35
      });
    });

    stage.addEventListener('mouseleave', () => {
      gsap.to(box, {
        rotateY: 0,
        rotateX: 0,
        ease: 'power2.out',
        duration: 0.7
      });
    });
  }
}

/* ==========================================================================
   4. THE CORE HIGHLIGHT: LUGGAGE UNPACKING & OPENING ENGINE
   Unified GSAP Timeline driven by ScrollTrigger, Slider Scrub, and Buttons
   ========================================================================== */
function initBagOpeningExperience() {
  const chassis = document.getElementById('chassisModel');
  const shellLeft = document.getElementById('shellLeft');
  const shellRight = document.getElementById('shellRight');
  const interiorLeft = document.getElementById('interiorLeft');
  const interiorRight = document.getElementById('interiorRight');
  const centerLatch = document.getElementById('centerLatch');
  const latchLed = document.getElementById('latchLed');
  const statusBeacon = document.getElementById('bagStatusBeacon');
  const statusText = document.getElementById('bagStatusText');
  const btnToggle = document.getElementById('btnToggleBagOpen');
  const btnExplode = document.getElementById('btnExplodeView');
  const btnSound = document.getElementById('btnSoundTrigger');
  const btnLabel = document.getElementById('btnBagOpenLabel');
  const scrubSlider = document.getElementById('bagScrubSlider');
  const scrubPct = document.getElementById('bagScrubPct');

  const pods = [
    document.getElementById('podTech'),
    document.getElementById('podFidlock'),
    document.getElementById('podToiletry'),
    document.getElementById('podLaundry'),
    document.getElementById('podAirtag')
  ].filter(Boolean);

  let isExploded = false;

  // Detect responsive travel distances
  const isMobile = window.innerWidth < 992;
  const leftShift = isMobile ? -50 : -90;
  const rightShift = isMobile ? 50 : 90;
  const rotateAngle = isMobile ? 55 : 68;

  // Master Luggage Opening GSAP Timeline (paused by default)
  const masterTl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.inOut' },
    onUpdate: () => {
      const progress = masterTl.progress();
      const pct = Math.round(progress * 100);
      if (scrubSlider) scrubSlider.value = pct;
      if (scrubPct) scrubPct.textContent = `${pct}%`;

      // Status Indicator state
      if (progress > 0.4) {
        if (statusText) statusText.textContent = `STATUS: CHASSIS UNLATCHED — ${pct}% EXPANDED`;
        if (statusBeacon) {
          statusBeacon.style.backgroundColor = '#10b981';
          statusBeacon.style.boxShadow = '0 0 10px #10b981';
        }
        if (btnLabel) btnLabel.textContent = 'SEAL & LOCK LUGGAGE';
        if (latchLed) {
          latchLed.style.backgroundColor = '#10b981';
          latchLed.style.boxShadow = '0 0 10px #10b981';
        }
      } else {
        if (statusText) statusText.textContent = 'STATUS: CHASSIS SEALED (DUAL TSA ENGAGED)';
        if (statusBeacon) {
          statusBeacon.style.backgroundColor = 'var(--accent-cyan)';
          statusBeacon.style.boxShadow = '0 0 10px var(--accent-cyan)';
        }
        if (btnLabel) btnLabel.textContent = 'OPEN LUGGAGE';
        if (latchLed) {
          latchLed.style.backgroundColor = '#ef4444';
          latchLed.style.boxShadow = '0 0 8px #ef4444';
        }
      }
    }
  });

  // Construct the unboxing timeline steps
  masterTl
    // Step 1: TSA Latch disengages & LED turns green
    .to(centerLatch, { scale: 0.65, opacity: 0, duration: 0.25 })
    
    // Step 2: Chassis shells part & rotate outward 180 deg
    .to(shellLeft, { rotateY: -rotateAngle, x: leftShift, duration: 0.75 }, '-=0.1')
    .to(shellRight, { rotateY: rotateAngle, x: rightShift, duration: 0.75 }, '<')
    
    // Step 3: Interior compartments illuminate
    .to([interiorLeft, interiorRight], { opacity: 1, duration: 0.4 }, '-=0.5')
    
    // Step 4: Floating modular pods expand into 3D view
    .to(pods, {
      opacity: 1,
      scale: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'back.out(1.5)'
    }, '-=0.3');

  // Toggle button click listener
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      if (masterTl.progress() < 0.5) {
        audio.playLatchOpen();
        masterTl.play();
      } else {
        audio.playLatchClose();
        masterTl.reverse();
      }
    });
  }

  // Interactive Range Slider Scrub listener
  if (scrubSlider) {
    scrubSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value) / 100;
      masterTl.progress(val);
    });
  }

  // Hero CTA: "Explore Bag Opening" scrolls and triggers open smoothly
  const heroSimBtn = document.getElementById('heroSimulateBtn');
  if (heroSimBtn) {
    heroSimBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('unboxing');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          audio.playLatchOpen();
          masterTl.play();
        }, 650);
      }
    });
  }

  // X-Ray Exploded view toggle
  if (btnExplode) {
    btnExplode.addEventListener('click', () => {
      audio.playChime();
      isExploded = !isExploded;
      btnExplode.classList.toggle('active', isExploded);

      if (isExploded) {
        masterTl.play();
        gsap.to(shellLeft, { x: leftShift - 40, duration: 0.5, ease: 'power2.out' });
        gsap.to(shellRight, { x: rightShift + 40, duration: 0.5, ease: 'power2.out' });
        gsap.to(pods, { scale: 1.08, stagger: 0.05, duration: 0.4 });
        showToast('X-Ray exploded perspective engaged');
      } else {
        gsap.to(shellLeft, { x: leftShift, duration: 0.4 });
        gsap.to(shellRight, { x: rightShift, duration: 0.4 });
        gsap.to(pods, { scale: 1, duration: 0.3 });
      }
    });
  }

  // Haptic audio preview button
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      audio.playLatchOpen();
      setTimeout(() => audio.playLatchClose(), 220);
      showToast('TSA008 Biometric lock sound generated');
    });
  }

  // ScrollTrigger: Automatically scrubs opening animation on scroll!
  ScrollTrigger.create({
    trigger: '#unboxing',
    start: 'top 55%',
    end: 'bottom 85%',
    onEnter: () => {
      if (masterTl.progress() === 0) {
        audio.playLatchOpen();
        masterTl.play();
      }
    }
  });

  // Clicking any pod displays toast info
  pods.forEach(pod => {
    pod.addEventListener('click', () => {
      audio.playChime();
      const title = pod.querySelector('.pod-title')?.textContent || 'Component';
      showToast(`Inspecting: ${title}`);
    });
  });
}

/* ==========================================================================
   5. FEATURED PRODUCTS (FILTERS, SWATCH TINTS & QUICK VIEW)
   ========================================================================== */
const PRODUCTS_DATA = {
  'bx-x1': {
    name: 'Bronx X1 Pro Carry-On',
    category: 'carry-on',
    price: 385,
    volume: '38 Liters',
    weight: '3.4 kg (7.5 lbs)',
    dims: '21.7" × 14.4" × 9.0"',
    description: 'The global standard for frequent flyers. Featuring zero zippers, aircraft 6061-T6 aluminum corner armor, dual TSA biometric locks, and Japanese Hinomoto Lisof® silent casters.',
    badge: 'IATA OVERHEAD BIN APPROVED'
  },
  'bx-x2': {
    name: 'Bronx X2 Continental Check-In',
    category: 'check-in',
    price: 445,
    volume: '74 Liters',
    weight: '4.8 kg (10.5 lbs)',
    dims: '26.8" × 18.5" × 11.0"',
    description: 'Engineered for 7-14 day cross-continental trips. Uncompromising strength with heavy-gauge reinforced spine and German Makrolon® crush-proof shell.',
    badge: 'BESTSELLER EXPEDITION'
  },
  'bx-x3': {
    name: 'Bronx X3 Heavy Trunk Edition',
    category: 'check-in',
    price: 520,
    volume: '105 Liters',
    weight: '5.9 kg (13.0 lbs)',
    dims: '30.0" × 16.5" × 14.5"',
    description: 'Maximum capacity trunk design with an 80/20 packing ratio. Pack heavy winter coats, diving gear, or boots without bulging.',
    badge: 'MAXIMUM CARGO 105L'
  },
  'bx-duffel': {
    name: 'Apex Modular Tech Duffel',
    category: 'modular',
    price: 240,
    volume: '32 Liters',
    weight: '1.8 kg (3.9 lbs)',
    dims: 'Luggage Pass-Through',
    description: '1000D Cordura ballistic nylon exterior with magnetic Fidlock handle dock and padded compartment for 16" laptops.',
    badge: 'BALLISTIC HYBRID'
  },
  'bx-backpack': {
    name: 'Bronx EDC Commuter Pack',
    category: 'modular',
    price: 190,
    volume: '22 Liters',
    weight: '1.2 kg (2.6 lbs)',
    dims: 'Weatherproof',
    description: 'Daily urban armor built with waterproof polyurethane coatings and concealed passport tracker pocket.',
    badge: 'DAILY ARMOR'
  }
};

function initProductsSection() {
  // Category Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playChime();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            display: 'flex',
            duration: 0.35,
            ease: 'power2.out'
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            display: 'none',
            duration: 0.25,
            ease: 'power2.in'
          });
        }
      });
    });
  });

  // Dynamic Color Swatch Selectors (Live tints the SVG suitcase body)
  document.querySelectorAll('.product-card').forEach(card => {
    const swatches = card.querySelectorAll('.swatch');
    const shellSvgBody = card.querySelector('.prod-shell-body');

    swatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playChime();

        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        const color = swatch.dataset.color;
        if (shellSvgBody) {
          gsap.to(shellSvgBody, {
            fill: color,
            duration: 0.35,
            ease: 'power2.out'
          });
        }

        const addBtn = card.querySelector('.btn-add-cart');
        if (addBtn) addBtn.dataset.color = swatch.title;
      });
    });
  });

  // Quick View Modal
  const quickModal = document.getElementById('quickViewModal');
  const quickClose = document.getElementById('quickViewCloseBtn');
  const quickTitle = document.getElementById('quickViewTitle');
  const quickPrice = document.getElementById('quickViewPrice');
  const quickDesc = document.getElementById('quickViewDescription');
  const quickBadge = document.getElementById('quickViewBadge');
  const quickVisualArea = document.getElementById('quickViewVisualArea');
  const quickAddBtn = document.getElementById('quickViewAddBtn');

  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playChime();
      const pId = btn.dataset.product;
      const data = PRODUCTS_DATA[pId];
      if (!data) return;

      if (quickTitle) quickTitle.textContent = data.name;
      if (quickPrice) quickPrice.textContent = `$${data.price}`;
      if (quickDesc) quickDesc.textContent = `${data.description} • Volume: ${data.volume} • Weight: ${data.weight} • Dimensions: ${data.dims}`;
      if (quickBadge) quickBadge.textContent = data.badge;

      // Copy SVG render into modal visual area
      const parentCard = btn.closest('.product-card');
      const originalSvg = parentCard?.querySelector('.product-render-svg');
      if (originalSvg && quickVisualArea) {
        quickVisualArea.innerHTML = originalSvg.outerHTML;
        const clonedSvg = quickVisualArea.querySelector('svg');
        if (clonedSvg) {
          clonedSvg.style.height = '240px';
          clonedSvg.style.width = 'auto';
        }
      }

      if (quickAddBtn) {
        quickAddBtn.onclick = () => {
          cart.addItem(data.name, data.price, 'Midnight Obsidian');
          quickModal.classList.remove('open');
        };
      }

      quickModal.classList.add('open');
    });
  });

  if (quickClose) {
    quickClose.addEventListener('click', () => quickModal.classList.remove('open'));
  }
}

/* ==========================================================================
   6. SHOPPER SANCTUARY: ALL PAIN POINTS SOLVED
   Airline Checker, Durability Matrix, Smart Weight Estimator
   ========================================================================== */
const AIRLINES_DATABASE = {
  delta: { name: 'Delta Air Lines', h: 22.0, w: 14.0, d: 9.0, pass: true, note: 'Bronx X1 passes 100% under standard gate sizer.' },
  united: { name: 'United Airlines', h: 22.0, w: 14.0, d: 9.0, pass: true, note: 'Fully verified for domestic and long-haul Boeing & Airbus overheads.' },
  american: { name: 'American Airlines', h: 22.0, w: 14.0, d: 9.0, pass: true, note: 'Passes standard 45 linear inches requirement.' },
  ryanair: { name: 'Ryanair Priority', h: 21.6, w: 15.7, d: 7.8, pass: true, note: 'Fits comfortably with Priority Overhead Bin booking.' },
  easyjet: { name: 'EasyJet Large Bag', h: 22.0, w: 17.7, d: 9.8, pass: true, note: 'Passes with 2.2 inches of spare width headroom.' },
  british: { name: 'British Airways', h: 22.0, w: 17.7, d: 9.8, pass: true, note: 'British Airways permits generous carry-on limits. 100% compliant.' },
  lufthansa: { name: 'Lufthansa', h: 21.6, w: 15.7, d: 9.0, pass: true, note: 'Complies with Lufthansa European & Transatlantic fleet.' },
  emirates: { name: 'Emirates', h: 21.6, w: 14.9, d: 7.8, pass: true, note: 'Fits First, Business and Economy overhead lockers on A380 & B777.' },
  singapore: { name: 'Singapore Airlines', h: 22.0, w: 15.7, d: 9.0, pass: true, note: 'Compliant with Singapore Airlines 115cm sum-of-dimensions.' },
  southwest: { name: 'Southwest Airlines', h: 24.0, w: 16.0, d: 10.0, pass: true, note: 'Plenty of room to spare in Southwest 737 overhead bins.' },
  airfrance: { name: 'Air France / KLM', h: 21.7, w: 13.8, d: 9.8, pass: true, note: 'Passes standard Air France / KLM cabin guidelines.' },
  qatar: { name: 'Qatar Airways', h: 20.0, w: 15.0, d: 10.0, pass: true, note: 'Approved across Qatar Airways wide-body fleet.' }
};

function initSanctuaryTools() {
  // Tab Navigation
  const tabBtns = document.querySelectorAll('.solution-tab-btn');
  const panels = document.querySelectorAll('.solution-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playChime();
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.dataset.tab;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Airline Size Compliance Checker
  const airlineSelect = document.getElementById('airlineSelect');
  const allowedH = document.getElementById('allowedHeight');
  const allowedW = document.getElementById('allowedWidth');
  const allowedD = document.getElementById('allowedDepth');
  const carrierName = document.getElementById('airlineCarrierName');

  if (airlineSelect) {
    airlineSelect.addEventListener('change', () => {
      audio.playChime();
      const code = airlineSelect.value;
      const data = AIRLINES_DATABASE[code];
      if (!data) return;

      if (carrierName) carrierName.textContent = `${data.name} Official Policy: ${data.note}`;
      if (allowedH) allowedH.textContent = `${data.h.toFixed(1)}"`;
      if (allowedW) allowedW.textContent = `${data.w.toFixed(1)}"`;
      if (allowedD) allowedD.textContent = `${data.d.toFixed(1)}"`;
    });
  }

  // Smart Packing Weight Estimator
  const tripChips = document.querySelectorAll('.trip-chip');
  const gearCheckboxes = document.querySelectorAll('.gear-checkbox');
  const weightVal = document.getElementById('scaleWeightValue');
  const safetyBadge = document.getElementById('scaleSafetyBadge');
  const progressFill = document.getElementById('scaleProgressFill');

  let currentBaseWeight = 3.2;

  function calculateTotalWeight() {
    let total = 3.4; // empty Bronx X1 luggage weight
    total += currentBaseWeight;

    gearCheckboxes.forEach(cb => {
      if (cb.checked) {
        total += parseFloat(cb.dataset.weight || 0);
      }
    });

    const rounded = total.toFixed(1);
    if (weightVal) weightVal.innerHTML = `${rounded} <span style="font-size: 1.5rem; font-weight: 500;">KG</span>`;

    const pct = Math.min((total / 10.0) * 100, 100);
    if (progressFill) progressFill.style.width = `${pct}%`;

    if (safetyBadge && progressFill) {
      if (total <= 8.5) {
        safetyBadge.textContent = '✓ SAFE FOR ALL MAJOR GLOBAL AIRLINES';
        safetyBadge.style.color = '#10b981';
        progressFill.style.backgroundColor = '#10b981';
      } else if (total <= 10.0) {
        safetyBadge.textContent = '⚠ APPROACHING 10KG LIMIT (STANDARD CARRY-ON SAFE)';
        safetyBadge.style.color = '#f59e0b';
        progressFill.style.backgroundColor = '#f59e0b';
      } else {
        safetyBadge.textContent = '⛔ EXCEEDS 10KG LIMIT (CONSIDER CHECKING IN)';
        safetyBadge.style.color = '#ef4444';
        progressFill.style.backgroundColor = '#ef4444';
      }
    }
  }

  tripChips.forEach(chip => {
    chip.addEventListener('click', () => {
      audio.playChime();
      tripChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentBaseWeight = parseFloat(chip.dataset.base || 3.2);
      calculateTotalWeight();
    });
  });

  gearCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      audio.playChime();
      calculateTotalWeight();
    });
  });

  calculateTotalWeight();
}

/* ==========================================================================
   7. SHOPPING CART DRAWER SYSTEM
   ========================================================================== */
class CartManager {
  constructor() {
    this.items = [
      { id: 'bx-x1', name: 'Bronx X1 Pro Carry-On', price: 385, color: 'Midnight Obsidian', qty: 1 }
    ];
    this.discount = 0;
    this.drawer = document.getElementById('cartDrawer');
    this.overlay = document.getElementById('cartOverlay');
    this.badge = document.getElementById('cartCountBadge');
    this.drawerBadge = document.getElementById('cartDrawerCount');
    this.itemsContainer = document.getElementById('cartItemsContainer');
    this.subtotalEl = document.getElementById('cartSubtotal');
    this.totalEl = document.getElementById('cartTotal');
    this.discountRow = document.getElementById('cartDiscountRow');
    this.discountAmountEl = document.getElementById('cartDiscountAmount');
    this.shippingProgress = document.getElementById('shippingProgressBar');

    this.initEvents();
    this.render();
  }

  initEvents() {
    const trigger = document.getElementById('cartTriggerBtn');
    const closeBtn = document.getElementById('cartCloseBtn');

    if (trigger) trigger.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (this.overlay) this.overlay.addEventListener('click', () => this.close());

    // Promo code form
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    const promoInput = document.getElementById('promoInput');

    if (applyPromoBtn && promoInput) {
      applyPromoBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (code === 'BRONX20' || code === 'TRAVEL20' || code === 'BRONXVIP') {
          this.discount = 0.20;
          audio.playChime();
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
          showToast('20% VIP Travel Discount Applied!');
          this.render();
        } else {
          showToast('Invalid promo code. Try: BRONX20');
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        audio.playChime();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        showToast('✈️ Order Dispatched! Lifetime Guarantee Activated.');
        setTimeout(() => this.close(), 1200);
      });
    }

    // Add to cart buttons throughout page
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.name || 'Bronx Luggage';
        const price = parseFloat(btn.dataset.price || 385);
        const color = btn.dataset.color || 'Midnight Obsidian';
        this.addItem(name, price, color);
      });
    });
  }

  open() {
    audio.playChime();
    this.drawer?.classList.add('open');
    this.overlay?.classList.add('open');
  }

  close() {
    this.drawer?.classList.remove('open');
    this.overlay?.classList.remove('open');
  }

  addItem(name, price, color) {
    audio.playChime();
    const existing = this.items.find(i => i.name === name && i.color === color);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ id: `item-${Date.now()}`, name, price, color, qty: 1 });
    }
    this.render();
    this.open();
    showToast(`Added: ${name} to your travel bag`);
  }

  removeItem(index) {
    audio.playChime();
    this.items.splice(index, 1);
    this.render();
  }

  updateQty(index, delta) {
    audio.playChime();
    this.items[index].qty += delta;
    if (this.items[index].qty <= 0) {
      this.items.splice(index, 1);
    }
    this.render();
  }

  render() {
    const totalCount = this.items.reduce((sum, item) => sum + item.qty, 0);
    if (this.badge) this.badge.textContent = totalCount;
    if (this.drawerBadge) this.drawerBadge.textContent = `${totalCount} ${totalCount === 1 ? 'Item' : 'Items'}`;

    if (!this.itemsContainer) return;

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🎒</div>
          <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">Your bag is empty</div>
          <div style="font-size: 0.85rem;">Discover our indestructible aerospace fleet</div>
        </div>
      `;
      if (this.subtotalEl) this.subtotalEl.textContent = '$0.00';
      if (this.totalEl) this.totalEl.textContent = '$0.00';
      return;
    }

    this.itemsContainer.innerHTML = '';
    let subtotal = 0;

    this.items.forEach((item, index) => {
      subtotal += item.price * item.qty;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-img">
          <svg viewBox="0 0 40 50" width="30" height="40">
            <rect x="5" y="5" width="30" height="40" rx="4" fill="var(--luggage-body)" stroke="var(--accent-cyan)" stroke-width="1.5" />
            <line x1="20" y1="5" x2="20" y2="45" stroke="var(--accent-cyan)" />
          </svg>
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">Color: ${item.color} • Lifetime Warranty</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          
          <div class="cart-quantity-ctrl">
            <button class="cart-qty-btn btn-qty-minus" data-idx="${index}">-</button>
            <span style="font-size: 0.85rem; font-weight: 700; min-width: 1.25rem; text-align: center;">${item.qty}</span>
            <button class="cart-qty-btn btn-qty-plus" data-idx="${index}">+</button>
            <button class="cart-qty-btn btn-remove-item" data-idx="${index}" style="margin-left: auto; color: #ef4444; width: auto; padding: 0 0.5rem;">Remove</button>
          </div>
        </div>
      `;
      this.itemsContainer.appendChild(itemEl);
    });

    // Attach listeners
    this.itemsContainer.querySelectorAll('.btn-qty-minus').forEach(b => {
      b.onclick = () => this.updateQty(parseInt(b.dataset.idx), -1);
    });
    this.itemsContainer.querySelectorAll('.btn-qty-plus').forEach(b => {
      b.onclick = () => this.updateQty(parseInt(b.dataset.idx), 1);
    });
    this.itemsContainer.querySelectorAll('.btn-remove-item').forEach(b => {
      b.onclick = () => this.removeItem(parseInt(b.dataset.idx));
    });

    const discountAmount = subtotal * this.discount;
    const finalTotal = subtotal - discountAmount;

    if (this.subtotalEl) this.subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (this.discount > 0 && this.discountRow && this.discountAmountEl) {
      this.discountRow.style.display = 'flex';
      this.discountAmountEl.textContent = `-$${discountAmount.toFixed(2)}`;
    } else if (this.discountRow) {
      this.discountRow.style.display = 'none';
    }

    if (this.totalEl) this.totalEl.textContent = `$${finalTotal.toFixed(2)}`;

    if (this.shippingProgress) {
      const pct = Math.min((finalTotal / 200) * 100, 100);
      this.shippingProgress.style.width = `${pct}%`;
    }
  }
}

let cart;

/* ==========================================================================
   8. INTERACTIVE 30-SECOND LUGGAGE FINDER QUIZ
   ========================================================================== */
const QUIZ_QUESTIONS = [
  {
    q: 'How frequently do you travel each year?',
    options: [
      { text: 'Frequent Flyer (10+ flights/year, strict carry-on only)', score: 'x1' },
      { text: 'Occasional Explorer (3-8 vacations & business trips)', score: 'x1' },
      { text: 'Long-haul Nomad (Cross-continental month-long journeys)', score: 'x2' },
      { text: 'Heavy Cargo Traveler (Sports, gear, boots, winter wear)', score: 'x3' }
    ]
  },
  {
    q: 'What is your typical trip duration?',
    options: [
      { text: '2 to 5 Days (Weekend getaways / fast business)', score: 'x1' },
      { text: '1 to 2 Weeks (Standard holiday vacations)', score: 'x2' },
      { text: '2 to 4+ Weeks (Extensive global travel)', score: 'x3' }
    ]
  },
  {
    q: 'What is your biggest luggage frustration?',
    options: [
      { text: 'Airlines forcing me to gate check my carry-on', score: 'x1' },
      { text: 'Broken wheels or busted nylon zippers', score: 'x1' },
      { text: 'Running out of internal packing volume', score: 'x2' }
    ]
  }
];

function initQuizModal() {
  const modal = document.getElementById('quizModal');
  const openBtn = document.getElementById('openQuizBtn');
  const navQuizBtn = document.getElementById('navQuizBtn');
  const closeBtn = document.getElementById('quizCloseBtn');
  const qTitle = document.getElementById('quizQuestionTitle');
  const qStep = document.getElementById('quizStepMeta');
  const qOptions = document.getElementById('quizOptionsContainer');
  const resultView = document.getElementById('quizResultView');
  const quizContent = document.getElementById('quizContent');
  const addMatchedBtn = document.getElementById('quizAddToCartBtn');

  let currentStep = 0;
  let scores = { 'x1': 0, 'x2': 0, 'x3': 0 };

  function renderStep(idx) {
    if (idx >= QUIZ_QUESTIONS.length) {
      showResult();
      return;
    }

    const current = QUIZ_QUESTIONS[idx];
    if (qTitle) qTitle.textContent = current.q;
    if (qStep) qStep.textContent = `Step ${idx + 1} of ${QUIZ_QUESTIONS.length}`;
    if (qOptions) {
      qOptions.innerHTML = '';
      current.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline';
        btn.style.textAlign = 'left';
        btn.style.justifyContent = 'flex-start';
        btn.style.width = '100%';
        btn.style.padding = '1rem 1.25rem';
        btn.innerHTML = `<span>${opt.text}</span>`;
        btn.onclick = () => {
          audio.playChime();
          scores[opt.score] = (scores[opt.score] || 0) + 1;
          currentStep++;
          renderStep(currentStep);
        };
        qOptions.appendChild(btn);
      });
    }
  }

  function showResult() {
    if (quizContent) quizContent.style.display = 'none';
    if (resultView) resultView.style.display = 'block';

    const resultName = document.getElementById('quizResultName');
    const resultReason = document.getElementById('quizResultReason');

    let recommended = 'Bronx X1 Pro Carry-On';
    let price = 385;

    if (scores.x3 > scores.x2 && scores.x3 > scores.x1) {
      recommended = 'Bronx X3 Heavy Trunk Edition';
      price = 520;
      if (resultReason) resultReason.textContent = 'Recommended for maximum cargo capacity, bulky equipment, and heavy-duty global travel.';
    } else if (scores.x2 > scores.x1) {
      recommended = 'Bronx X2 Continental Check-In';
      price = 445;
      if (resultReason) resultReason.textContent = 'Ideal balance of 74L cavernous volume and unbreakable drop-proof chassis.';
    } else {
      recommended = 'Bronx X1 Pro Carry-On';
      price = 385;
      if (resultReason) resultReason.textContent = '100% fits in all global airline overhead bins with zero gate check anxiety.';
    }

    if (resultName) resultName.textContent = recommended;

    cart.discount = 0.20;

    if (addMatchedBtn) {
      addMatchedBtn.onclick = () => {
        cart.addItem(recommended, price, 'Midnight Obsidian');
        modal.classList.remove('open');
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      };
    }
  }

  function openQuiz() {
    currentStep = 0;
    scores = { 'x1': 0, 'x2': 0, 'x3': 0 };
    if (quizContent) quizContent.style.display = 'block';
    if (resultView) resultView.style.display = 'none';
    renderStep(0);
    modal?.classList.add('open');
  }

  if (openBtn) openBtn.addEventListener('click', openQuiz);
  if (navQuizBtn) navQuizBtn.addEventListener('click', openQuiz);
  if (closeBtn) closeBtn.addEventListener('click', () => modal?.classList.remove('open'));
}

/* ==========================================================================
   9. SCROLL-TRIGGERED METRIC COUNTERS
   ========================================================================== */
function initMetricsCounters() {
  const metricNumbers = document.querySelectorAll('.metric-number');
  
  metricNumbers.forEach(el => {
    const target = parseInt(el.dataset.target || 0);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(el, {
          innerText: target,
          duration: 1.8,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            el.innerText = Math.ceil(this.targets()[0].innerText);
          }
        });
      }
    });
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ==========================================================================
   INITIALIZE EVERYTHING ROBUSTLY
   ========================================================================== */
function initApp() {
  initTheme();
  cart = new CartManager();
  initHeroAnimations();
  initBagOpeningExperience();
  initProductsSection();
  initSanctuaryTools();
  initMetricsCounters();
  initQuizModal();

  // Mobile navigation drawer toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'var(--bg-surface)';
      navLinks.style.padding = '1.5rem';
      navLinks.style.borderBottom = '1px solid var(--border-medium)';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
