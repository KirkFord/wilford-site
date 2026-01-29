/**
 * SECRETS.JS - Hidden Easter Eggs and Mysteries
 * For the true explorers...
 */

(function() {
  'use strict';

  // ===== SECRET KEY SEQUENCES =====
  const SECRET_CODES = {
    // Konami code is handled in menu.js
    // These are additional codes
    'wilford': showWilfordSecret,
    'music': playSecretTrack,
    'zone': goToZone,
    'ghost': triggerGhostMode,
    'party': triggerPartyMode
  };

  let inputBuffer = '';
  let bufferTimeout;

  document.addEventListener('keydown', (e) => {
    // Only track letter keys
    if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      inputBuffer += e.key.toLowerCase();

      // Clear buffer after 2 seconds of inactivity
      clearTimeout(bufferTimeout);
      bufferTimeout = setTimeout(() => {
        inputBuffer = '';
      }, 2000);

      // Check for matches
      for (const [code, fn] of Object.entries(SECRET_CODES)) {
        if (inputBuffer.includes(code)) {
          fn();
          inputBuffer = '';
          break;
        }
      }
    }
  });

  // ===== SECRET FUNCTIONS =====

  function showWilfordSecret() {
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1a1a2e;
      border: 4px double #00ffff;
      padding: 30px;
      z-index: 99999;
      text-align: center;
      font-family: monospace;
      color: #00ffff;
    `;
    msg.innerHTML = `
      <h2 style="margin: 0 0 15px 0;">You typed "WILFORD"!</h2>
      <pre style="color: #ff00ff;">
   /\\_/\\
  ( ^.^ )
   > ~ <
  WILFORD
   GANG
      </pre>
      <button onclick="this.parentElement.remove()" style="margin-top: 15px; cursor: pointer;">Nice</button>
    `;
    document.body.appendChild(msg);
  }

  function playSecretTrack() {
    // Create a simple melody using Web Audio
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // C major scale

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.value = 0.1;
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.1);
    });

    showTemporaryMessage('Secret melody played!');
  }

  function goToZone() {
    showTemporaryMessage('Entering THE ZONE...');
    setTimeout(() => {
      window.location.href = '/zone.html';
    }, 1000);
  }

  function triggerGhostMode() {
    document.body.style.transition = 'opacity 2s';
    document.body.style.opacity = '0.3';
    showTemporaryMessage('Ghost mode activated...');

    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 5000);
  }

  function triggerPartyMode() {
    const overlay = document.createElement('div');
    overlay.id = 'party-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99998;
      animation: partyColors 0.5s linear infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes partyColors {
        0% { background: rgba(255,0,0,0.2); }
        25% { background: rgba(0,255,0,0.2); }
        50% { background: rgba(0,0,255,0.2); }
        75% { background: rgba(255,255,0,0.2); }
        100% { background: rgba(255,0,255,0.2); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    showTemporaryMessage('PARTY MODE!');

    setTimeout(() => {
      overlay.remove();
      style.remove();
    }, 10000);
  }

  // ===== HIDDEN PIXEL HUNT =====
  // Click a specific coordinate to find a secret
  document.addEventListener('click', (e) => {
    // Secret spot at bottom-left corner (within 50px)
    if (e.clientX < 50 && e.clientY > window.innerHeight - 50) {
      showTemporaryMessage('You found a hidden corner!');
      localStorage.setItem('found_corner', 'true');
    }
  });

  // ===== DOUBLE-CLICK SECRETS =====
  let dblClickCount = 0;
  document.addEventListener('dblclick', () => {
    dblClickCount++;
    if (dblClickCount >= 5) {
      showTemporaryMessage('Double-click master!');
      dblClickCount = 0;
    }
  });

  // ===== IDLE DETECTION =====
  let idleTime = 0;
  setInterval(() => {
    idleTime++;
    if (idleTime === 60) { // 60 seconds
      showIdleMessage();
    }
  }, 1000);

  document.addEventListener('mousemove', () => { idleTime = 0; });
  document.addEventListener('keydown', () => { idleTime = 0; });

  function showIdleMessage() {
    const messages = [
      "Still there?",
      "The music awaits...",
      "Try typing 'wilford'",
      "Explore the corners...",
      "What secrets lie within?"
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    showTemporaryMessage(msg, 3000);
  }

  // ===== VIEW SOURCE EASTER EGG =====
  // People who view source will see this
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║     You're viewing the source code!       ║
  ║                                           ║
  ║  Secret codes to try:                     ║
  ║  - Type "wilford" anywhere                ║
  ║  - Type "music" for a melody              ║
  ║  - Type "zone" to enter THE ZONE          ║
  ║  - Type "ghost" for ghost mode            ║
  ║  - Type "party" for party mode            ║
  ║  - Click bottom-left corner               ║
  ║  - Konami code still works!               ║
  ║                                           ║
  ║  /zone.html exists...                     ║
  ╚═══════════════════════════════════════════╝
  `);

  // ===== HELPERS =====
  function showTemporaryMessage(text, duration = 2000) {
    const msg = document.createElement('div');
    msg.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.9);
      border: 2px solid #00ffff;
      color: #00ffff;
      padding: 15px 30px;
      font-family: monospace;
      font-size: 18px;
      z-index: 99999;
      animation: fadeInOut ${duration}ms ease-in-out forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        20% { opacity: 1; transform: translateX(-50%) translateY(0); }
        80% { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(style);

    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
      msg.remove();
      style.remove();
    }, duration);
  }

  // ===== BASE64 HIDDEN MESSAGE IN COMMENT =====
  // VGhlIHpvbmUgaXMgcmVhbC4gVGhlIHpvbmUgYXdhaXRzLg==
  // (Decodes to: "The zone is real. The zone awaits.")

})();
