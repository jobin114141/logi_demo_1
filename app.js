/**
 * Connect Logistics - Interactive Web Application Logic
 */

// 1. Navigation Scroll Effect & Auto-Hide on Scroll Down / Reveal on Scroll Up
document.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.getElementById('main-nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Glass pill background threshold
    if (currentScrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Auto-hide when scrolling down, reveal when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > 120) {
      // Scrolling DOWN -> Hide nav
      mainNav.classList.add('nav-hidden');
    } else {
      // Scrolling UP or at top -> Show nav
      mainNav.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  });

  // Active section highlight via IntersectionObserver
  const navSections = ['about', 'services', 'operations', 'testimonials'];

  // Map each section id → ALL its nav links (desktop + mobile)
  const navLinksMap = {};
  navSections.forEach(id => {
    navLinksMap[id] = Array.from(document.querySelectorAll(`#main-nav a[href="#${id}"]`));
  });

  const mobileBrandLabel = document.getElementById('mobile-brand-label');
  const mobileActiveDot = document.getElementById('mobile-active-dot');

  function setActiveSection(activeId) {
    navSections.forEach(id => {
      navLinksMap[id].forEach(link => {
        if (id === activeId) {
          link.classList.add('nav-active');
        } else {
          link.classList.remove('nav-active');
        }
      });
    });
    // Update mobile brand label + dot
    const labels = { about: 'About', services: 'Services', operations: 'Operations', testimonials: 'Testimonials' };
    if (mobileBrandLabel) {
      mobileBrandLabel.textContent = activeId ? (labels[activeId] || 'Connect') : 'Connect';
    }
    if (mobileActiveDot) {
      mobileActiveDot.style.opacity = activeId ? '1' : '0';
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });

    // If back at hero, clear all
    const anyVisible = entries.some(e => e.isIntersecting);
    if (!anyVisible && window.scrollY < 200) {
      setActiveSection(null);
    }
  }, { threshold: [0.1, 0.25], rootMargin: '-70px 0px -20% 0px' });

  navSections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Initialize Counter Animations & Fast Scroll Reveal
  initScrollCounters();
  initScrollReveal();
});

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
}

// Mobile nav toggle
function toggleMobileNav() {
  const nav = document.getElementById('main-nav');
  const menu = document.getElementById('mobile-nav-menu');
  const isOpen = nav.classList.contains('mobile-open');
  if (isOpen) {
    closeMobileNav();
  } else {
    nav.classList.add('mobile-open');
    menu.classList.add('nav-menu-open');
  }
}

function closeMobileNav() {
  const nav = document.getElementById('main-nav');
  const menu = document.getElementById('mobile-nav-menu');
  nav.classList.remove('mobile-open');
  menu.classList.remove('nav-menu-open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const nav = document.getElementById('main-nav');
  if (nav && !nav.contains(e.target)) {
    closeMobileNav();
  }
});

// 2. Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu.classList.contains('opacity-0')) {
    menu.classList.remove('opacity-0', 'pointer-events-none');
    menu.classList.add('opacity-100');
  } else {
    menu.classList.add('opacity-0', 'pointer-events-none');
    menu.classList.remove('opacity-100');
  }
}

// 3. Hero Quick Track Input Handler
function handleHeroTrack() {
  const input = document.getElementById('hero-track-input');
  const code = input.value.trim();
  if (!code) {
    showToast('Please enter a tracking ID (e.g., CN-884920)');
    return;
  }
  setSampleTrack(code);
  document.getElementById('tracking-section').scrollIntoView({ behavior: 'smooth' });
}

// 4. Accordion & Card Detail Toggle
function toggleCardDetail(id) {
  const elem = document.getElementById(id);
  const icon = document.getElementById(`${id}-icon`);
  if (!elem) return;

  if (elem.classList.contains('hidden')) {
    elem.classList.remove('hidden');
    if (icon) icon.innerText = '−';
  } else {
    elem.classList.add('hidden');
    if (icon) icon.innerText = '+';
  }
}

// 5. Service Cards Filtering
function filterServices(category) {
  const cards = document.querySelectorAll('.service-card');
  const buttons = document.querySelectorAll('.service-tab-btn');

  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(category)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  cards.forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.classList.remove('hidden-card');
    } else {
      card.classList.add('hidden-card');
    }
  });

  showToast(`Showing ${category.toUpperCase()} logistics services`);
}

// 6. Live Shipment Tracking Telemetry Engine
const sampleShipments = {
  'CN-884920': {
    code: 'CN-884920',
    mode: 'Air Cargo Express ✈️',
    status: 'In Transit - Flight EK-204',
    origin: 'Shanghai (PVG)',
    destination: 'Dubai (DXB)',
    eta: 'Tomorrow, 08:30 AM',
    progress: 75,
    steps: [
      { name: 'Cargo Pickup at Factory (Shanghai)', time: 'Yesterday 09:00 AM', done: true },
      { name: 'Customs Export Clearance Approved', time: 'Yesterday 04:30 PM', done: true },
      { name: 'Departed Shanghai Pudong Hub', time: 'Today 02:15 AM', done: true },
      { name: 'In Transit to Dubai South Terminal', time: 'Estimated 08:30 AM', done: false, active: true },
      { name: 'Final Delivery Destination', time: 'Pending Arrival', done: false }
    ]
  },
  'UAE-992104': {
    code: 'UAE-992104',
    mode: 'Sea Freight FCL 🚢',
    status: 'Customs Clearance in Progress',
    origin: 'Rotterdam (RTM)',
    destination: 'Jebel Ali Port, Dubai',
    eta: '27 July 2026, 04:00 PM',
    progress: 50,
    steps: [
      { name: 'Container Loaded Vessel MSC Maya', time: '14 July 10:00 AM', done: true },
      { name: 'Crossed Suez Canal Transit', time: '20 July 06:12 PM', done: true },
      { name: 'Arrived Jebel Ali Port Berth 4', time: 'Today 07:00 AM', done: true, active: true },
      { name: 'Customs Duty Inspection', time: 'In Progress', done: false },
      { name: 'Dispatched to Warehouse', time: 'Pending', done: false }
    ]
  },
  'DXB-774011': {
    code: 'DXB-774011',
    mode: 'Land Fleet Heavy Haulage 🚛',
    status: 'Delivered & Signed',
    origin: 'Dubai South Warehouse',
    destination: 'Riyadh Logistics Park, KSA',
    eta: 'Delivered Today 10:15 AM',
    progress: 100,
    steps: [
      { name: 'Dispatched from Dubai Hub', time: '25 July 08:00 AM', done: true },
      { name: 'GCC Border Customs Clearance', time: '26 July 02:00 PM', done: true },
      { name: 'Out for Last-Mile Delivery', time: 'Today 08:00 AM', done: true },
      { name: 'Delivered to Recipient (Signed)', time: 'Today 10:15 AM', done: true, active: true }
    ]
  }
};

function setSampleTrack(code) {
  document.getElementById('main-tracking-input').value = code;
  searchTracking();
}

function searchTracking() {
  const input = document.getElementById('main-tracking-input');
  const code = input.value.trim().toUpperCase();
  const box = document.getElementById('tracking-result-box');

  if (!code) {
    showToast('Please enter a tracking ID');
    return;
  }

  const shipment = sampleShipments[code] || {
    code: code,
    mode: 'Standard Freight 📦',
    status: 'In Transit - On Schedule',
    origin: 'Dubai Hub (DXB)',
    destination: 'Global Partner Depot',
    eta: '2-3 Business Days',
    progress: 60,
    steps: [
      { name: 'Consignment Received at Facility', time: '26 July 09:00 AM', done: true },
      { name: 'Security & Manifest Clearance', time: '26 July 02:00 PM', done: true },
      { name: 'In Transit to Regional Center', time: 'Today 05:00 AM', done: true, active: true },
      { name: 'Last Mile Dispatch', time: 'Pending', done: false }
    ]
  };

  renderTrackingDetails(shipment, box);
}

function renderTrackingDetails(shipment, box) {
  box.classList.remove('hidden');

  let stepsHTML = shipment.steps.map(step => `
    <div class="flex items-start gap-4 relative">
      <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 
                  ${step.done ? 'bg-green-500 text-white' : step.active ? 'bg-[#42e61a] text-white animate-pulse' : 'bg-slate-700 text-slate-400'}">
        ${step.done ? '✓' : step.active ? '●' : '○'}
      </div>
      <div>
        <h4 class="font-bold text-sm text-white">${step.name}</h4>
        <p class="text-xs text-slate-400">${step.time}</p>
      </div>
    </div>
  `).join('');

  box.innerHTML = `
    <div class="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <span class="text-xs text-orange-400 font-mono uppercase font-bold">Tracking Ref: ${shipment.code}</span>
          <h3 class="text-2xl font-black text-white mt-0.5">${shipment.status}</h3>
          <p class="text-xs text-slate-400">${shipment.mode} &bull; Route: ${shipment.origin} &rarr; ${shipment.destination}</p>
        </div>
        <div class="bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 text-right">
          <span class="text-[10px] text-slate-400 uppercase font-bold block">Estimated Arrival</span>
          <span class="text-sm font-bold text-green-400">${shipment.eta}</span>
        </div>
      </div>

      <!-- Telemetry Progress Bar -->
      <div>
        <div class="flex justify-between text-xs text-slate-400 mb-2 font-medium">
          <span>Progress Complete</span>
          <span>${shipment.progress}%</span>
        </div>
        <div class="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div class="bg-gradient-to-r from-orange-500 to-green-400 h-full rounded-full transition-all duration-1000" style="width: ${shipment.progress}%"></div>
        </div>
      </div>

      <!-- Timeline Steps -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div class="space-y-4">
          <h4 class="text-xs uppercase font-bold text-slate-400 tracking-wider">Milestone Timeline</h4>
          ${stepsHTML}
        </div>
        <div class="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-3">
          <h4 class="text-xs uppercase font-bold text-slate-400 tracking-wider">Live Cargo Conditions</h4>
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Container Temp:</span>
            <span class="font-mono text-green-400 font-bold">+4.2°C (Optimal)</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">GPS Coordinates:</span>
            <span class="font-mono text-slate-300">25.2048° N, 55.2708° E</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-400">Seal Security:</span>
            <span class="font-mono text-green-400">Intact (Tamper-Proof)</span>
          </div>
          <button onclick="showToast('Live telemetry refreshed just now')" class="w-full mt-2 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded-lg transition-colors">
            🔄 Refresh Telemetry Log
          </button>
        </div>
      </div>
    </div>
  `;

  showToast(`Found tracking info for ${shipment.code}`);
}

// 7. Program Experience Slide Navigation
let programYears = 15;
function prevProgramSlide() {
  showToast('Viewing previous milestone');
}

function nextProgramSlide() {
  showToast('Viewing next milestone');
}

// 8. Testimonials Carousel Data & Navigation
const testimonials = [
  {
    quote: '"The real-time tracking keeps me on track, and the Dubai team pushes me to keep growing. It\'s the perfect mix of logistics and tech."',
    author: 'Ahmed Al Maktoum',
    role: 'Retail Director, Dubai Global Trade',
    rating: '4.9'
  },
  {
    quote: '"Connect Logistics delivered 40 heavy containers from Shanghai to Jebel Ali without a single clearance delay. World-class efficiency!"',
    author: 'Elena Rostova',
    role: 'Supply Chain VP, EuroTech Logistics',
    rating: '5.0'
  },
  {
    quote: '"Their temperature-controlled air freight saved our pharmaceutical shipment during peak summer heat. Highly recommended!"',
    author: 'Dr. Tariq Mansoor',
    role: 'Operations Head, Gulf BioMed',
    rating: '4.9'
  }
];

let currentTestimonialIndex = 0;

function updateTestimonialUI() {
  const t = testimonials[currentTestimonialIndex];
  document.getElementById('testimonial-index').innerText = `● ${currentTestimonialIndex + 1} / ${testimonials.length}`;
  document.getElementById('testimonial-quote').innerText = t.quote;
  document.getElementById('testimonial-author').innerText = t.author;
  document.getElementById('testimonial-role').innerText = t.role;
}

function prevTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
  updateTestimonialUI();
}

function nextTestimonial() {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
  updateTestimonialUI();
}

// 9. Instant Rate Estimator / Quote Calculator
function recalculateQuote() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const mode = form.elements['mode'].value;
  const weight = parseFloat(document.getElementById('quote-weight').value) || 100;
  const volume = parseFloat(document.getElementById('quote-volume').value) || 1;

  let baseRate = 500;
  let perKgRate = 3.5;
  let transitDays = '2-3 Business Days';

  if (mode === 'Sea Freight') {
    baseRate = 350;
    perKgRate = 1.2;
    transitDays = '14-18 Business Days';
  } else if (mode === 'Land Transport') {
    baseRate = 250;
    perKgRate = 1.8;
    transitDays = '3-5 Business Days';
  }

  const estimatedCost = (baseRate + (weight * perKgRate) + (volume * 45)).toFixed(2);

  document.getElementById('quote-cost-display').innerText = `$${Number(estimatedCost).toLocaleString()} USD`;
  document.getElementById('quote-time-display').innerText = `Est. Transit: ${transitDays}`;
}

function openQuoteModal(preferredMode) {
  const modal = document.getElementById('quote-modal');
  modal.classList.add('modal-active');

  if (preferredMode) {
    const radio = document.querySelector(`input[name="mode"][value="${preferredMode}"]`);
    if (radio) {
      radio.checked = true;
      recalculateQuote();
    }
  }
}

function closeQuoteModal() {
  const modal = document.getElementById('quote-modal');
  modal.classList.remove('modal-active');
}

function handleQuoteSubmit(event) {
  event.preventDefault();
  closeQuoteModal();
  const refCode = 'QT-' + Math.floor(100000 + Math.random() * 900000);
  showToast(`Quote Request Submitted! Reference ID: ${refCode}`);
}

// 10. Operations Detail Modal
const opsData = {
  'Customs Clearance & Documentation': {
    desc: 'Our specialized customs team in Dubai handles end-to-end duty declarations, tariff codes, exemption permits, and fast-track clearance for air, sea, and land cargo arriving across GCC ports.',
    hub: 'Dubai South & Jebel Ali Freezone',
    time: '< 4 Hours',
    compliance: 'World Customs Organization (WCO)'
  },
  'Warehousing & Storage Solution': {
    desc: 'State-of-the-art climate-controlled facilities featuring 24/7 CCTV security, automated inventory RFID tracking, bonded storage, and fulfillment services.',
    hub: 'Dubai South Logistics District',
    time: '24/7 Dispatch',
    compliance: 'ISO 9001:2015 Certified'
  },
  'Import / Export Advisory': {
    desc: 'Strategic consultation on international trade regulations, GCC free trade agreements, tariff reduction, customs audit defense, and supply chain compliance.',
    hub: 'Dubai International Financial Centre',
    time: 'Same Day Consult',
    compliance: 'GCC Customs Union Law'
  },
  'Freight Forwarding & Consolidation': {
    desc: 'Multi-modal air-sea transport routing, buyer consolidation services, chartered cargo vessels, and door-to-door cargo insurance.',
    hub: 'Global Network Hub',
    time: 'Scheduled Weekly Sailing',
    compliance: 'IATA & FIATA Accredited'
  }
};

// 10. Operations Dynamic Accordion Switcher
const operationsList = [
  {
    title: 'Customs Clearance & Documentation',
    desc: 'Duty compliance, duty exemption permits, Dubai Customs digital integration',
    badge: '99.8% Approval',
    tags: ['Duty Compliance', 'Exemption Permits', 'Dubai Customs Digital Integration'],
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Warehousing & Storage Solution',
    desc: 'State-of-the-art climate-controlled facilities featuring 24/7 CCTV security and RFID tracking.',
    badge: 'Freezone Hub',
    tags: ['Secure 24/7 CCTV', 'Climate Control (-20°C to +25°C)', 'Dubai South Freezone'],
    img: 'images/real_warehouse.png'
  },
  {
    title: 'Import / Export Advisory',
    desc: 'Tariff classification, free trade agreement optimization, risk assessment',
    badge: 'Trade Legal',
    tags: ['Tariff Advice', 'FTA Optimization', 'Trade Legal Risk Assessment'],
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Freight Forwarding & Consolidation',
    desc: "Multi-modal sea-air routing, buyer's consolidation, bonded transshipments",
    badge: 'Direct Lines',
    tags: ['Multi-Modal Sea-Air Routing', "Buyer's Consolidation", 'Bonded Transshipments'],
    img: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=400&q=80'
  }
];

let activeOperationIndex = 1; // Default active: Warehousing & Storage Solution

function renderOperations() {
  const container = document.getElementById('operations-accordion-list');
  if (!container) return;

  container.innerHTML = operationsList.map((op, idx) => {
    const isActive = idx === activeOperationIndex;

    if (isActive) {
      return `
        <div class="group relative flex flex-col lg:flex-row items-start lg:items-center justify-between py-10 px-6 cursor-pointer bg-[#42e61a] text-slate-950 rounded-2xl transition-all duration-300 shadow-xl my-4 transform scale-[1.01]"
          onclick="handleOperationClick(${idx})">
          <div class="mb-6 lg:mb-0">
            <span class="text-2xl md:text-3xl font-extrabold block mb-3">${op.title}</span>
            <div class="flex flex-wrap gap-2">
              ${op.tags.map(tag => `<span class="text-[10px] uppercase font-bold bg-black/10 px-3 py-1 rounded-full text-slate-900">${tag}</span>`).join('')}
            </div>
          </div>
          <div class="flex items-center gap-6">
            <img alt="${op.title}" class="w-36 h-24 object-cover rounded-xl border-2 border-black/20 transform -rotate-3 hidden md:block shadow-xl hover:rotate-0 transition-transform" src="${op.img}" />
            <span class="bg-slate-950 text-white w-14 h-14 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg></span>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="group flex flex-col md:flex-row md:items-center justify-between py-8 cursor-pointer hover:px-4 transition-all duration-300"
          onclick="handleOperationClick(${idx})">
          <div>
            <span class="text-xl md:text-2xl font-bold block group-hover:text-[#42e61a] transition-colors">${op.title}</span>
            <span class="text-xs text-white/50 mt-1 block">${op.desc}</span>
          </div>
          <div class="mt-4 md:mt-0 flex items-center gap-4">
            <span class="text-xs px-3 py-1 bg-white/10 rounded-full text-white/80">${op.badge}</span>
            <span class="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"><svg class="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg></span>
          </div>
        </div>
      `;
    }
  }).join('');
}

function handleOperationClick(index) {
  if (activeOperationIndex === index) {
    openOperationModal(operationsList[index].title);
  } else {
    activeOperationIndex = index;
    renderOperations();
  }
}

// 11. Back to Top Scroll
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 12. Interactive Liquid Corridor Simulation Vector
function selectCorridorMode(mode) {
  const btnAir = document.getElementById('corridor-btn-air');
  const btnSea = document.getElementById('corridor-btn-sea');
  const btnLand = document.getElementById('corridor-btn-land');

  const speedEl = document.getElementById('corridor-speed');
  const customsEl = document.getElementById('corridor-customs');
  const carbonEl = document.getElementById('corridor-carbon');

  [btnAir, btnSea, btnLand].forEach(btn => {
    if (btn) {
      btn.className = 'corridor-tab-btn px-6 py-3.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-black flex items-center gap-2 transition-all hover:scale-105';
    }
  });

  if (mode === 'air') {
    if (btnAir) btnAir.className = 'corridor-tab-btn active px-6 py-3.5 rounded-full bg-black text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105';
    if (speedEl) speedEl.textContent = '24 - 48 Hours';
    if (customsEl) customsEl.textContent = 'Express Fast-Track WCO';
    if (carbonEl) carbonEl.innerHTML = 'Certified <span class="text-[#42e61a]">Low-Emission Charter</span>';
    showToast('Air Priority Vector Selected');
  } else if (mode === 'sea') {
    if (btnSea) btnSea.className = 'corridor-tab-btn active px-6 py-3.5 rounded-full bg-black text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105';
    if (speedEl) speedEl.textContent = '12 - 18 Days';
    if (customsEl) customsEl.textContent = 'Port-to-Port Pre-Cleared';
    if (carbonEl) carbonEl.innerHTML = 'Certified <span class="text-[#42e61a]">Low-Emission Vessel</span>';
    showToast('Ocean FCL Vector Selected');
  } else if (mode === 'land') {
    if (btnLand) btnLand.className = 'corridor-tab-btn active px-6 py-3.5 rounded-full bg-black text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg hover:scale-105';
    if (speedEl) speedEl.textContent = '24 - 72 Hours';
    if (customsEl) customsEl.textContent = 'GCC Cross-Border Seal Approval';
    if (carbonEl) carbonEl.innerHTML = 'Certified <span class="text-[#42e61a]">Eco-Route Telemetry</span>';
    showToast('GCC Land Vector Selected');
  }
}

window.selectCorridorMode = selectCorridorMode;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderOperations();
  initScrollCounters();
});
