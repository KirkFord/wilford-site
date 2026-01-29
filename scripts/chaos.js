/**
 * CHAOS.JS - GeoCities / Hypnospace Outlaw Chaos Controller
 * Handles hit counter, marquee, badges, and haunted effects
 * Cleaned up version - no overlapping, no emoji spam
 */

(function() {
  'use strict';

  // ===== CONFIGURATION =====
  const CHAOS_CONFIG = {
    mouseTrail: true,
    trailParticles: 12,
    hauntedChance: 0.01 // 1% chance per page load
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

  // ===== MARQUEE =====
  function initMarquee() {
    const messages = [
      "Welcome to WILFORD's domain...",
      "Experimental electronic music from Saskatoon, Canada",
      "CRASH TEST KAWAII TRASHCORE!!! out now",
      "Thanks for visiting!",
      "Best viewed in Netscape Navigator 4.0",
      "Try the Konami code...",
    ];

    const container = document.createElement('div');
    container.className = 'chaos-marquee-container';

    const marquee = document.createElement('div');
    marquee.className = 'chaos-marquee';

    const content = messages.map(m => `<span>${m}</span><span class="separator">*</span>`).join('');
    marquee.innerHTML = content + content; // Duplicate for seamless loop

    container.appendChild(marquee);
    document.body.appendChild(container);
  }

  // ===== 88x31 BADGES =====
  function initBadges() {
    const container = document.createElement('div');
    container.className = 'badges-container';
    container.id = 'badges-container';

    // Real 88x31 badge images
    const badges = [
      { src: '/assets/badges/anybrowser.gif', alt: 'Best viewed with any browser' },
      { src: '/assets/badges/notepad.gif', alt: 'Made with Notepad' },
      { src: '/assets/badges/best_viewed_with_eyes.gif', alt: 'Best viewed with eyes' }
    ];

    badges.forEach(badge => {
      const img = document.createElement('img');
      img.className = 'retro-badge';
      img.src = badge.src;
      img.alt = badge.alt;
      img.title = badge.alt;
      img.width = 88;
      img.height = 31;
      container.appendChild(img);
    });

    document.body.appendChild(container);
  }

  // ===== HAUNTED EFFECTS =====
  function initHauntedEffects() {
    if (Math.random() > CHAOS_CONFIG.hauntedChance) return;

    const effects = [
      screenInvert,
      screenGlitch,
      scrambleText
    ];

    const effect = effects[Math.floor(Math.random() * effects.length)];
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

  function scrambleText() {
    const title = document.querySelector('.main-title');
    if (!title) return;

    const original = title.textContent;
    const scrambled = 'W-I-L-F-O-R-D-.';
    title.textContent = scrambled;

    setTimeout(() => {
      title.textContent = original;
    }, 200);
  }

  // ===== CHAOS TOGGLE =====
  function initChaosToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'chaos-toggle';
    toggle.textContent = '[X]';
    toggle.title = 'Toggle retro elements';

    const chaosEnabled = localStorage.getItem('chaos_enabled') !== 'false';

    if (!chaosEnabled) {
      document.body.classList.add('chaos-disabled');
    } else {
      document.body.classList.add('chaos-enabled');
    }

    toggle.addEventListener('click', () => {
      const isEnabled = !document.body.classList.contains('chaos-disabled');
      if (isEnabled) {
        document.body.classList.add('chaos-disabled');
        document.body.classList.remove('chaos-enabled');
        localStorage.setItem('chaos_enabled', 'false');
      } else {
        document.body.classList.remove('chaos-disabled');
        document.body.classList.add('chaos-enabled');
        localStorage.setItem('chaos_enabled', 'true');
      }
    });

    document.body.appendChild(toggle);
  }

  // ===== MOUSE TRAIL =====
  function initMouseTrail() {
    if (!CHAOS_CONFIG.mouseTrail) return;

    const colors = ['#ff6688', '#66ffff', '#ffff66', '#ff66ff', '#66ff66', '#6688ff'];
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;

    // Create particle pool
    for (let i = 0; i < CHAOS_CONFIG.trailParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${colors[i % colors.length]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        opacity: 0;
        transition: opacity 0.1s;
      `;
      document.body.appendChild(particle);
      particles.push({
        el: particle,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0
      });
    }

    let particleIndex = 0;
    let lastSpawn = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn a new particle every 50ms
      const now = Date.now();
      if (now - lastSpawn > 50 && !document.body.classList.contains('chaos-disabled')) {
        const p = particles[particleIndex];
        p.x = mouseX;
        p.y = mouseY;
        p.vx = (Math.random() - 0.5) * 2;
        p.vy = Math.random() * 2 + 1; // Fall downward
        p.life = 1;
        p.el.style.opacity = '1';
        p.el.style.background = colors[Math.floor(Math.random() * colors.length)];

        particleIndex = (particleIndex + 1) % particles.length;
        lastSpawn = now;
      }
    });

    // Animate particles
    function animateParticles() {
      particles.forEach(p => {
        if (p.life > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.1; // Gravity
          p.life -= 0.02;

          p.el.style.left = p.x + 'px';
          p.el.style.top = p.y + 'px';
          p.el.style.opacity = p.life;
          p.el.style.transform = `scale(${p.life})`;

          if (p.life <= 0) {
            p.el.style.opacity = '0';
          }
        }
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ===== SECRET CLICK COUNTER =====
  let secretClicks = 0;
  let lastSecretClickTime = 0;

  function initSecretClicks() {
    // Prevent text selection on secret elements
    document.querySelectorAll('.main-title, .intro-text').forEach(el => {
      el.style.userSelect = 'none';
      el.style.webkitUserSelect = 'none';
      el.style.cursor = 'pointer';
    });

    // Use mousedown for more reliable detection
    document.addEventListener('mousedown', (e) => {
      const target = e.target;
      const isSecretTarget = target.classList.contains('main-title') ||
                             target.classList.contains('intro-text') ||
                             target.closest('.main-title') ||
                             target.closest('.intro-text');

      if (isSecretTarget) {
        e.preventDefault(); // Prevent text selection

        // Debounce rapid clicks (must be 100ms apart)
        const now = Date.now();
        if (now - lastSecretClickTime < 100) return;
        lastSecretClickTime = now;

        secretClicks++;

        // Visual feedback for each click
        showClickProgress(e.clientX, e.clientY, secretClicks);

        // Pulse the title
        const titleEl = target.classList.contains('main-title') ? target : target.closest('.main-title') || target;
        titleEl.classList.add('secret-pulse');
        setTimeout(() => titleEl.classList.remove('secret-pulse'), 600);

        if (secretClicks === 7) {
          unlockSecret();
          secretClicks = 0;
        }

        // Reset counter after 3 seconds of no clicks
        clearTimeout(window.secretClickTimeout);
        window.secretClickTimeout = setTimeout(() => {
          if (secretClicks > 0 && secretClicks < 7) {
            secretClicks = 0;
          }
        }, 3000);
      }
    });
  }

  function showClickProgress(x, y, count) {
    // Ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.borderColor = count >= 5 ? '#ff6688' : count >= 3 ? '#ffff66' : '#66ffff';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Progress indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y - 30}px;
      transform: translateX(-50%);
      font-family: 'Press Start 2P', monospace;
      font-size: 12px;
      color: ${count >= 5 ? '#ff6688' : '#66ffff'};
      pointer-events: none;
      z-index: 99999;
      text-shadow: 2px 2px 0 #000;
      animation: floatUp 0.8s ease-out forwards;
    `;
    indicator.textContent = count >= 5 ? `${count}/7 !!!` : `${count}/7`;
    document.body.appendChild(indicator);
    setTimeout(() => indicator.remove(), 800);

    // Add float up animation if not exists
    if (!document.getElementById('float-up-style')) {
      const style = document.createElement('style');
      style.id = 'float-up-style';
      style.textContent = `
        @keyframes floatUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-40px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function unlockSecret() {
    // Screen shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);

    // Flash
    const flash = document.createElement('div');
    flash.className = 'konami-flash';
    flash.style.background = '#ff00ff';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);

    // Particles
    if (window.spawnCelebrationParticles) {
      window.spawnCelebrationParticles(window.innerWidth / 2, window.innerHeight / 2, 30);
    }

    // Delayed overlay for drama
    setTimeout(() => {
      const overlay = document.createElement('div');
      overlay.className = 'secret-overlay';
      overlay.innerHTML = `
        <div class="secret-content konami-entrance">
          <h1 class="text-glitch-reveal">SECRET UNLOCKED</h1>
          <p style="animation: textGlitchReveal 0.5s 0.2s backwards;">You clicked the title 7 times!</p>
          <p class="zone-hint" style="animation: textGlitchReveal 0.5s 0.4s backwards;">The Zone awaits... /zone.html</p>
          <button onclick="this.parentElement.parentElement.remove()" style="animation: textGlitchReveal 0.5s 0.6s backwards;">[ OK ]</button>
        </div>
      `;
      document.body.appendChild(overlay);
    }, 200);
  }

  // ===== GLOBAL CLICK FEEDBACK =====
  function initClickFeedback() {
    document.addEventListener('mousedown', (e) => {
      if (document.body.classList.contains('chaos-disabled')) return;

      // Visual impact
      createClickImpact(e.clientX, e.clientY);
    });
  }

  function createClickImpact(x, y) {
    // Inner burst
    const burst = document.createElement('div');
    burst.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: radial-gradient(circle, #fff 0%, #66ffff 50%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%) scale(0);
      animation: clickBurst 0.3s ease-out forwards;
    `;
    document.body.appendChild(burst);

    // Outer ring
    const ring = document.createElement('div');
    ring.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      border: 2px solid rgba(102, 255, 255, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%) scale(0);
      animation: clickRing 0.4s ease-out forwards;
    `;
    document.body.appendChild(ring);

    // Small particles
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      const angle = (Math.PI * 2 * i) / 6;
      const colors = ['#ff6688', '#66ffff', '#ffff66'];
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 3px;
        height: 3px;
        background: ${colors[i % colors.length]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(particle);

      // Animate particle outward
      const speed = 30 + Math.random() * 20;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      let px = 0, py = 0, life = 1;

      function animateParticle() {
        px += vx * 0.1;
        py += vy * 0.1;
        life -= 0.05;
        particle.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${life})`;
        particle.style.opacity = life;
        if (life > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      }
      requestAnimationFrame(animateParticle);
    }

    // Ensure animation styles exist
    if (!document.getElementById('click-feedback-style')) {
      const style = document.createElement('style');
      style.id = 'click-feedback-style';
      style.textContent = `
        @keyframes clickBurst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes clickRing {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => { burst.remove(); ring.remove(); }, 400);
  }

  // ===== INIT =====
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }

  function initAll() {
    initChaosToggle();
    initHitCounter();
    initMarquee();
    initBadges();
    initMouseTrail();
    initClickFeedback();
    initHauntedEffects();
    initSecretClicks();

    console.log('%c WILFORD CHAOS MODE ', 'background: #1a1a2e; color: #00ffff; font-size: 14px;');
  }

  init();
})();
