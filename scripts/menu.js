// WILFORD JRPG Menu Navigation System

(function() {
  'use strict';

  // State
  let currentScreen = 'intro-screen';
  let currentMenuIndex = 0;
  let menuItems = [];
  let konamiProgress = 0;
  let introComplete = false;
  let isTransitioning = false; // Prevent multiple transitions
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

  // Transition effects to randomly choose from (null = default fade)
  const transitionEffects = [null, 'slide-right', 'dissolve', 'wipe', 'flash', 'zoom'];

  // PC-98 background images organized by mood/screen
  const pc98Backgrounds = {
    'title-screen': [
      'Sci-Fi/Cosmic Psycho 177.png',
      'Sci-Fi/Armist 68.png',
      'Sci-Fi/Vanishing Point 099.png',
      'Sci-Fi/Red 127.png',
      'Fantasy/Dual Soul 067.png',
      'Fantasy/Waver 124.png',
      'Monochromatic/Angel Halo 165.png'
    ],
    'main-menu': [
      'Contemporary Interiors/Ambivalenz 147.png',
      'Contemporary Interiors/Akiko Gold 123.png',
      'Contemporary Interiors/Yu-No 400.png',
      'Contemporary Interiors/Ripple Cafe 53.png',
      'Contemporary Interiors/Love Escalator 337.png',
      'Contemporary Interiors/Kakyuusei 517.png',
      'Contemporary Interiors/File-0 53.png'
    ],
    'discography-screen': [
      'Contemporary Interiors/Akiko Gold 123.png',
      'Contemporary Interiors/Koukou Kyoshi 143.png',
      'Contemporary Interiors/Kara no Naka no Kotori 64.png',
      'Sci-Fi/Armist 51.png',
      'Fantasy/Only You 203.png'
    ],
    'bio-screen': [
      'Japanese Traditional/Beast 002.png',
      'Fantasy/True Heart 090.png',
      'Fantasy/Dual Soul 063.png',
      'Fantasy/Dora Dora Emotion 146.png',
      'Fantasy/Rance 4 131.png'
    ],
    'listen-screen': [
      'Sci-Fi/Cosmic Psycho 177.png',
      'Sci-Fi/Reira Slave Doll 092.png',
      'Sci-Fi/Reira Slave Doll 111.png',
      'Sci-Fi/Diver\'s 006.png',
      'Monochromatic/Angel Halo 165.png'
    ],
    'links-screen': [
      'Fantasy/Angel Night 216.png',
      'Fantasy/Super D.P.S 29.png',
      'Fantasy/Waver 124.png',
      'Monochromatic/Angel Halo 170.png',
      'Contemporary Interiors/Yu-No 400.png'
    ],
    'contact-screen': [
      'Contemporary Exteriors (Night)/Anniversary 126.png',
      'Contemporary Exteriors (Night)/Ayayo 015.png',
      'Contemporary Exteriors (Night)/Bishoujo Audition 025.png',
      'Contemporary Interiors/Ambivalenz 147.png',
      'Sci-Fi/Vanishing Point 099.png'
    ],
    'secrets-screen': [
      'Monochromatic/Angel Halo 165.png',
      'Monochromatic/Angel Halo 172.png',
      'Sci-Fi/Red 127.png',
      'Fantasy/Dual Soul 067.png',
      'Sci-Fi/Reira Slave Doll 094.png'
    ]
  };

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Get menu items
    menuItems = document.querySelectorAll('#main-menu-list .menu-item');

    // Setup event listeners
    setupIntroScreen();
    setupTitleScreen();
    setupMenuNavigation();
    setupBackButtons();
    setupKonamiCode();

    // Focus management
    document.body.focus();
  }

  // Intro Screen (Capcom/Konami style boot logo)
  function setupIntroScreen() {
    const introScreen = document.getElementById('intro-screen');
    const titleScreen = document.getElementById('title-screen');

    if (!introScreen) {
      currentScreen = 'title-screen';
      return;
    }

    // Auto transition after intro animation (4 seconds)
    setTimeout(() => {
      if (!introComplete) {
        completeIntro();
      }
    }, 4000);

    // Click or keypress to skip intro
    const skipIntro = (e) => {
      if (currentScreen === 'intro-screen' && !introComplete) {
        e.preventDefault();
        introScreen.classList.add('skipped');
        completeIntro();
      }
    };

    introScreen.addEventListener('click', skipIntro);
    document.addEventListener('keydown', function introKeyHandler(e) {
      if (currentScreen === 'intro-screen' && !introComplete) {
        skipIntro(e);
      }
    }, { once: false });
  }

  function completeIntro() {
    if (introComplete) return;
    introComplete = true;

    const introScreen = document.getElementById('intro-screen');
    const titleScreen = document.getElementById('title-screen');

    // Start fade out animation
    if (introScreen) {
      introScreen.classList.add('fading');
    }

    // After fade out, switch to title screen
    setTimeout(() => {
      if (introScreen) {
        introScreen.classList.remove('active');
        introScreen.style.display = 'none'; // Fully remove from view
      }
      if (titleScreen) {
        titleScreen.classList.add('active', 'fade-in');
      }
      currentScreen = 'title-screen';
    }, 500);
  }

  // Title Screen
  function setupTitleScreen() {
    const titleScreen = document.getElementById('title-screen');
    if (!titleScreen) return;

    const startGame = () => {
      if (currentScreen === 'title-screen' && !isTransitioning) {
        playSound('start');
        transitionToScreen('main-menu');
      }
    };

    // Click anywhere to start (except on the title itself - that's for the secret)
    titleScreen.addEventListener('click', (e) => {
      // Don't trigger if clicking on the main title (7-click secret)
      if (e.target.classList.contains('main-title') || e.target.closest('.main-title')) {
        return;
      }
      startGame();
    });

    // Any key to start (but not during intro)
    document.addEventListener('keydown', (e) => {
      if (currentScreen === 'title-screen' && !isTransitioning && introComplete) {
        startGame();
      }
    });
  }

  // Menu Navigation
  function setupMenuNavigation() {
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);

    // Mouse/touch navigation
    menuItems.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        if (currentScreen === 'main-menu') {
          setActiveMenuItem(index);
          playSound('move');
        }
      });

      item.addEventListener('click', () => {
        if (currentScreen === 'main-menu') {
          selectMenuItem();
        }
      });
    });
  }

  function handleKeyNavigation(e) {
    if (currentScreen !== 'main-menu') return;

    switch(e.key) {
      case 'ArrowUp':
        e.preventDefault();
        navigateMenu(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigateMenu(1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectMenuItem();
        break;
    }
  }

  function navigateMenu(direction) {
    const newIndex = currentMenuIndex + direction;

    if (newIndex >= 0 && newIndex < menuItems.length) {
      setActiveMenuItem(newIndex);
      playSound('move');
    }
  }

  function setActiveMenuItem(index) {
    menuItems.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });
    currentMenuIndex = index;
  }

  function selectMenuItem() {
    const activeItem = menuItems[currentMenuIndex];
    const targetScreen = activeItem.dataset.target;

    if (targetScreen) {
      playSound('select');
      activeItem.classList.add('selection-flash');
      setTimeout(() => {
        activeItem.classList.remove('selection-flash');
        transitionToScreen(targetScreen);

        // Initialize bio dialogue if going to bio screen
        if (targetScreen === 'bio-screen') {
          initBioDialogue();
        }
      }, 100);
    }
  }

  // Back Buttons
  function setupBackButtons() {
    document.querySelectorAll('.back-button').forEach(button => {
      button.addEventListener('click', () => {
        const targetScreen = button.dataset.back;
        playSound('back');
        transitionToScreen(targetScreen);
      });
    });

    // ESC key to go back
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && currentScreen !== 'title-screen' && currentScreen !== 'main-menu') {
        playSound('back');
        transitionToScreen('main-menu');
      }
    });
  }

  // Screen Transitions with random effects
  function transitionToScreen(screenId) {
    // Prevent multiple transitions
    if (isTransitioning) return;
    if (currentScreen === screenId) return;

    const currentScreenEl = document.getElementById(currentScreen);
    const nextScreenEl = document.getElementById(screenId);

    if (!nextScreenEl || !currentScreenEl) return;

    isTransitioning = true;

    // Pick a random transition effect
    const effect = transitionEffects[Math.floor(Math.random() * transitionEffects.length)];

    // Update background image for the next screen
    updateScreenBackground(screenId, nextScreenEl);

    // Exit animation
    currentScreenEl.classList.add('screen-exit');
    if (effect) currentScreenEl.classList.add(effect);

    setTimeout(() => {
      // Remove old screen
      currentScreenEl.classList.remove('active', 'screen-exit');
      transitionEffects.forEach(e => e && currentScreenEl.classList.remove(e));

      // Show new screen
      nextScreenEl.classList.add('active', 'screen-enter');
      if (effect) nextScreenEl.classList.add(effect);

      // Update state
      currentScreen = screenId;

      setTimeout(() => {
        nextScreenEl.classList.remove('screen-enter');
        transitionEffects.forEach(e => e && nextScreenEl.classList.remove(e));
        isTransitioning = false; // Allow new transitions
      }, 500);
    }, 300);
  }

  // Update screen background with random PC-98 image
  function updateScreenBackground(screenId, screenEl) {
    const backgrounds = pc98Backgrounds[screenId];
    if (!backgrounds || backgrounds.length === 0) return;

    // Pick a random background
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const bgUrl = `/assets/pc98/${randomBg}`;

    // Get the current background style and replace just the image URL
    const currentStyle = window.getComputedStyle(screenEl).backgroundImage;

    // Apply new background while preserving gradients
    if (screenId === 'title-screen') {
      screenEl.style.backgroundImage = `
        linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'main-menu') {
      screenEl.style.backgroundImage = `
        linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 30%, transparent 50%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'bio-screen') {
      screenEl.style.backgroundImage = `
        linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'discography-screen') {
      screenEl.style.backgroundImage = `
        linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 100%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'listen-screen') {
      screenEl.style.backgroundImage = `
        radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'links-screen') {
      screenEl.style.backgroundImage = `
        linear-gradient(90deg, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'contact-screen') {
      screenEl.style.backgroundImage = `
        linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.8) 100%),
        url('${bgUrl}')
      `;
    } else if (screenId === 'secrets-screen') {
      screenEl.style.backgroundImage = `
        radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%),
        url('${bgUrl}')
      `;
    }
  }

  // Konami Code
  function setupKonamiCode() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === konamiCode[konamiProgress]) {
        konamiProgress++;

        if (konamiProgress === konamiCode.length) {
          activateKonamiEasterEgg();
          konamiProgress = 0;
        }
      } else {
        konamiProgress = 0;
      }
    });

    // Close konami overlay
    const closeBtn = document.getElementById('close-konami');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('konami-overlay').classList.add('hidden');
      });
    }
  }

  function activateKonamiEasterEgg() {
    playSound('secret');

    // Screen shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'konami-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);

    // Particle explosion from center
    spawnCelebrationParticles(window.innerWidth / 2, window.innerHeight / 2, 50);

    // Show overlay with delay for dramatic effect
    setTimeout(() => {
      const overlay = document.getElementById('konami-overlay');
      if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('konami-entrance');
      }
    }, 300);
  }

  // Celebration particles
  function spawnCelebrationParticles(x, y, count) {
    const colors = ['#ff6688', '#66ffff', '#ffff66', '#ff66ff', '#66ff66', '#ffbb66'];
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'celebration-particle';
      particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 100001;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      `;
      document.body.appendChild(particle);

      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const velocity = 8 + Math.random() * 8;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      let px = x, py = y, life = 1;

      function animateParticle() {
        px += vx;
        py += vy + (1 - life) * 5; // gravity
        life -= 0.02;
        particle.style.left = px + 'px';
        particle.style.top = py + 'px';
        particle.style.opacity = life;
        particle.style.transform = `scale(${life}) rotate(${(1-life) * 360}deg)`;
        if (life > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particle.remove();
        }
      }
      requestAnimationFrame(animateParticle);
    }
  }

  // Expose for other scripts
  window.spawnCelebrationParticles = spawnCelebrationParticles;

  // Sound placeholder functions (connect to audio.js)
  function playSound(type) {
    if (typeof window.playMenuSound === 'function') {
      window.playMenuSound(type);
    }
  }

  // Expose for other scripts
  window.jrpgMenu = {
    transitionToScreen,
    playSound
  };

})();
