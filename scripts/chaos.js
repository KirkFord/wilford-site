/**
 * CHAOS.JS - GeoCities / Hypnospace Outlaw Chaos Controller
 * Handles floating elements, hit counter, mouse trails, and haunted effects
 */

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CHAOS_CONFIG = {
    mouseTrail: true,
    trailSymbols: ['✦', '♪', '★', '♫', '✧'],
    hauntedChance: 0.01, // 1% chance per page load
    floatingElements: [
      { type: 'skull', position: 'corner-tr' },
      { type: 'fire', position: 'corner-bl' },
      { type: 'sparkle', position: 'corner-tl' },
      { type: 'construction', position: 'corner-br' }
    ]
  };

  // ===== HIT COUNTER =====
  function initHitCounter() {
    let count = localStorage.getItem('wilford_hits') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('wilford_hits', count);

    // Pad to 6 digits
    const countStr = count.toString().padStart(6, '0');

    // Create counter HTML
    const container = document.createElement('div');
    container.className = 'hit-counter-container';
    container.innerHTML = `
      <div class="hit-counter-label">You are visitor #</div>
      <div class="hit-counter">
        ${countStr.split('').map(d => `<span class="hit-digit">${d}</span>`).join('')}
      </div>
    `;
    document.body.appendChild(container);
  }

  // ===== FLOATING ELEMENTS =====
  function createFloatingElements() {
    const layer = document.createElement('div');
    layer.className = 'chaos-layer';
    layer.id = 'chaos-layer';

    CHAOS_CONFIG.floatingElements.forEach((el, idx) => {
      const div = document.createElement('div');
      div.className = `floating-gif ${el.position}`;
      div.style.animationDelay = `${idx * 0.2}s`;

      switch(el.type) {
        case 'skull':
          div.classList.add('spin-skull');
          div.innerHTML = '💀';
          div.title = 'Spooky!';
          break;
        case 'fire':
          div.classList.add('fire-gif');
          div.title = 'Hot stuff!';
          break;
        case 'sparkle':
          div.classList.add('sparkle');
          div.title = 'Sparkle sparkle';
          break;
        case 'construction':
          div.classList.add('under-construction');
          div.innerHTML = 'UNDER<br>CONSTRUCTION';
          div.title = 'Always building...';
          break;
      }

      // Easter egg: click floating elements
      div.addEventListener('click', () => {
        div.style.transform = 'scale(2) rotate(360deg)';
        setTimeout(() => {
          div.style.transform = '';
        }, 500);
        playClickSound();
      });

      layer.appendChild(div);
    });

    document.body.appendChild(layer);
  }

  // ===== MARQUEE =====
  function initMarquee() {
    const messages = [
      "Welcome to WILFORD's domain...",
      "Experimental electronic music from Saskatoon, Canada",
      "CRASH TEST KAWAII TRASHCORE!!! out now",
      "Thanks for visiting!",
      "Best viewed in Netscape Navigator 4.0",
      "Sign my guestbook!",
      "You're visitor #" + (localStorage.getItem('wilford_hits') || '???'),
      "Try the Konami code...",
    ];

    const container = document.createElement('div');
    container.className = 'chaos-marquee-container';

    // Duplicate for seamless loop
    const marquee = document.createElement('div');
    marquee.className = 'chaos-marquee';

    const content = messages.map(m => `<span>${m}</span><span class="separator">★</span>`).join('');
    marquee.innerHTML = content + content; // Duplicate for loop

    container.appendChild(marquee);
    document.body.appendChild(container);
  }

  // ===== BADGES =====
  function initBadges() {
    const container = document.createElement('div');
    container.className = 'badges-container';

    const badges = [
      { text: 'Best viewed in<br>Netscape 4.0', class: 'netscape' },
      { text: 'GeoCities<br>Certified', class: 'geocities' },
      { text: 'WILFORD<br>Approved ✓', class: 'wilford-approved' }
    ];

    badges.forEach(badge => {
      const div = document.createElement('div');
      div.className = `retro-badge ${badge.class}`;
      div.innerHTML = badge.text;
      div.addEventListener('click', () => {
        alert('Thanks for clicking! You found a badge!');
      });
      container.appendChild(div);
    });

    document.body.appendChild(container);
  }

  // ===== WEBRING =====
  function initWebring() {
    const container = document.createElement('div');
    container.className = 'webring-container';
    container.innerHTML = `
      <div class="webring-title">WILFORD Webring</div>
      <div class="webring-nav">
        <a href="https://kirkford.art" target="_blank">&lt; Prev</a>
        <span>|</span>
        <a href="#" onclick="alert('Random site feature coming soon!'); return false;">Random</a>
        <span>|</span>
        <a href="https://wilfordthewanderer.bandcamp.com" target="_blank">Next &gt;</a>
      </div>
    `;
    document.body.appendChild(container);
  }

  // ===== MOUSE TRAIL =====
  function initMouseTrail() {
    if (!CHAOS_CONFIG.mouseTrail) return;

    let lastTime = 0;
    const throttle = 50; // ms between particles

    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < throttle) return;
      lastTime = now;

      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      particle.style.left = e.clientX + 'px';
      particle.style.top = e.clientY + 'px';
      particle.textContent = CHAOS_CONFIG.trailSymbols[
        Math.floor(Math.random() * CHAOS_CONFIG.trailSymbols.length)
      ];
      particle.style.color = `hsl(${Math.random() * 360}, 100%, 70%)`;

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 1000);
    });
  }

  // ===== HAUNTED EFFECTS =====
  function initHauntedEffects() {
    // 1% chance of haunted effects on page load
    if (Math.random() > CHAOS_CONFIG.hauntedChance) return;

    const effects = [
      screenInvert,
      screenGlitch,
      flashFace,
      scrambleText
    ];

    // Pick a random effect
    const effect = effects[Math.floor(Math.random() * effects.length)];

    // Delay the effect for surprise
    setTimeout(effect, 5000 + Math.random() * 10000);
  }

  function screenInvert() {
    document.body.classList.add('screen-invert');
    setTimeout(() => {
      document.body.classList.remove('screen-invert');
    }, 100);
  }

  function screenGlitch() {
    document.body.classList.add('haunted-glitch');
    setTimeout(() => {
      document.body.classList.remove('haunted-glitch');
    }, 500);
  }

  function flashFace() {
    const face = document.createElement('div');
    face.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 200px;
      z-index: 99999;
      pointer-events: none;
      opacity: 0.3;
    `;
    face.textContent = '👁';
    document.body.appendChild(face);
    setTimeout(() => face.remove(), 50);
  }

  function scrambleText() {
    const title = document.querySelector('.main-title');
    if (!title) return;

    const original = title.textContent;
    const scrambled = 'W̷̢I̶̧L̸̨F̷̧O̸̢R̵̨D̶̨.̷̧';
    title.textContent = scrambled;

    setTimeout(() => {
      title.textContent = original;
    }, 200);
  }

  // ===== CHAOS TOGGLE =====
  function initChaosToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'chaos-toggle';
    toggle.textContent = 'Disable Chaos';

    const chaosEnabled = localStorage.getItem('chaos_enabled') !== 'false';

    if (!chaosEnabled) {
      document.body.classList.add('chaos-disabled');
      toggle.textContent = 'Enable Chaos';
    } else {
      document.body.classList.add('chaos-enabled');
    }

    toggle.addEventListener('click', () => {
      const isEnabled = !document.body.classList.contains('chaos-disabled');
      if (isEnabled) {
        document.body.classList.add('chaos-disabled');
        document.body.classList.remove('chaos-enabled');
        localStorage.setItem('chaos_enabled', 'false');
        toggle.textContent = 'Enable Chaos';
      } else {
        document.body.classList.remove('chaos-disabled');
        document.body.classList.add('chaos-enabled');
        localStorage.setItem('chaos_enabled', 'true');
        toggle.textContent = 'Disable Chaos';
      }
    });

    document.body.appendChild(toggle);
  }

  // ===== SOUND HELPER =====
  function playClickSound() {
    if (typeof window.playSound === 'function') {
      window.playSound('select');
    }
  }

  // ===== SECRET CLICK COUNTER =====
  let secretClicks = 0;
  function initSecretClicks() {
    document.addEventListener('click', (e) => {
      // Check if clicking on the title
      if (e.target.classList.contains('main-title') ||
          e.target.classList.contains('intro-text')) {
        secretClicks++;
        if (secretClicks === 7) {
          unlockSecret();
          secretClicks = 0;
        }
      }
    });
  }

  function unlockSecret() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 99999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #00ffff;
      font-family: monospace;
    `;
    overlay.innerHTML = `
      <h1 style="font-size: 48px; animation: rainbow 2s linear infinite;">SECRET UNLOCKED!</h1>
      <p style="margin: 20px 0;">You clicked the title 7 times!</p>
      <p style="color: #ff00ff;">The Zone awaits... /zone.html</p>
      <button style="margin-top: 30px; padding: 10px 20px; cursor: pointer;" onclick="this.parentElement.remove()">Continue</button>
    `;
    document.body.appendChild(overlay);
  }

  // ===== INIT =====
  function init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    initChaosToggle();
    initHitCounter();
    createFloatingElements();
    initMarquee();
    initBadges();
    initWebring();
    initMouseTrail();
    initHauntedEffects();
    initSecretClicks();

    console.log('%c WILFORD CHAOS MODE ACTIVATED ',
      'background: #1a1a2e; color: #00ffff; font-size: 16px; padding: 5px;');
    console.log('%c Try clicking the title 7 times... ',
      'color: #ff00ff; font-style: italic;');
  }

  init();
})();
