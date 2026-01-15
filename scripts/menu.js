// WILFORD JRPG Menu Navigation System

(function() {
  'use strict';

  // State
  let currentScreen = 'title-screen';
  let currentMenuIndex = 0;
  let menuItems = [];
  let konamiProgress = 0;
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Get menu items
    menuItems = document.querySelectorAll('#main-menu-list .menu-item');

    // Setup event listeners
    setupTitleScreen();
    setupMenuNavigation();
    setupBackButtons();
    setupKonamiCode();

    // Focus management
    document.body.focus();
  }

  // Title Screen
  function setupTitleScreen() {
    const titleScreen = document.getElementById('title-screen');

    const startGame = () => {
      if (currentScreen === 'title-screen') {
        playSound('start');
        transitionToScreen('main-menu');
      }
    };

    // Click anywhere to start
    titleScreen.addEventListener('click', startGame);

    // Any key to start
    document.addEventListener('keydown', function titleKeyHandler(e) {
      if (currentScreen === 'title-screen') {
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

  // Screen Transitions
  function transitionToScreen(screenId) {
    const currentScreenEl = document.getElementById(currentScreen);
    const nextScreenEl = document.getElementById(screenId);

    if (!nextScreenEl) return;

    // Exit animation
    currentScreenEl.classList.add('screen-exit');

    setTimeout(() => {
      currentScreenEl.classList.remove('active', 'screen-exit');
      nextScreenEl.classList.add('active', 'screen-enter');
      currentScreen = screenId;

      setTimeout(() => {
        nextScreenEl.classList.remove('screen-enter');
      }, 300);
    }, 200);
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
    const overlay = document.getElementById('konami-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }

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
