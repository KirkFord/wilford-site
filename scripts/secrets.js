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
    // Screen shake + flash
    triggerSecretEffects('#00ffff');

    setTimeout(() => {
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
        box-shadow: 0 0 30px rgba(0,255,255,0.5), inset 0 0 20px rgba(0,255,255,0.1);
      `;
      msg.className = 'konami-entrance';
      msg.innerHTML = `
        <h2 style="margin: 0 0 15px 0; text-shadow: 0 0 10px #00ffff;" class="text-glitch-reveal">You typed "WILFORD"!</h2>
        <pre style="color: #ff00ff; text-shadow: 0 0 10px #ff00ff;">
   /\\_/\\
  ( ^.^ )
   > ~ <
  WILFORD
   GANG
        </pre>
        <button onclick="this.parentElement.remove()" style="margin-top: 15px; cursor: pointer; background: #00ffff; color: #000; border: none; padding: 10px 20px; font-family: monospace;">Nice</button>
      `;
      document.body.appendChild(msg);
    }, 200);
  }

  // Helper for secret effects
  function triggerSecretEffects(color = '#00ffff') {
    // Screen shake
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 500);

    // Flash
    const flash = document.createElement('div');
    flash.className = 'konami-flash';
    flash.style.background = color;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 300);

    // Particles
    if (window.spawnCelebrationParticles) {
      window.spawnCelebrationParticles(window.innerWidth / 2, window.innerHeight / 2, 25);
    }
  }

  function playSecretTrack() {
    // Create a simple melody using Web Audio
    if (!window.AudioContext && !window.webkitAudioContext) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // C major scale

    // Visual notes falling
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

      // Spawn a visual note
      setTimeout(() => {
        spawnMusicNote(100 + i * 80, 100);
      }, i * 150);
    });

    showTemporaryMessage('Secret melody played!');
  }

  function spawnMusicNote(x, y) {
    const notes = ['♪', '♫', '♬', '♩'];
    const colors = ['#ff6688', '#66ffff', '#ffff66', '#ff66ff'];
    const note = document.createElement('div');
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      font-size: 30px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events: none;
      z-index: 99999;
      text-shadow: 0 0 10px currentColor;
    `;
    document.body.appendChild(note);

    let posY = y;
    let opacity = 1;
    let wobble = 0;
    function animateNote() {
      posY -= 2;
      opacity -= 0.015;
      wobble += 0.1;
      note.style.top = posY + 'px';
      note.style.left = (x + Math.sin(wobble) * 20) + 'px';
      note.style.opacity = opacity;
      note.style.transform = `rotate(${Math.sin(wobble) * 15}deg)`;
      if (opacity > 0) {
        requestAnimationFrame(animateNote);
      } else {
        note.remove();
      }
    }
    requestAnimationFrame(animateNote);
  }

  function goToZone() {
    // Dramatic transition
    triggerSecretEffects('#00ff00');

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: monospace;
      color: #00ff00;
      font-size: 24px;
    `;
    overlay.innerHTML = `<div style="text-align: center;">
      <div style="animation: pulse 0.5s infinite;">ENTERING THE ZONE...</div>
      <div style="margin-top: 20px; font-size: 40px;">👁</div>
    </div>`;
    document.body.appendChild(overlay);

    setTimeout(() => {
      window.location.href = '/zone.html';
    }, 1500);
  }

  function triggerGhostMode() {
    // Spooky effect
    document.body.style.transition = 'all 0.5s';
    document.body.style.opacity = '0.3';
    document.body.style.filter = 'blur(1px) grayscale(0.5)';

    showTemporaryMessage('Ghost mode activated...', 3000);

    // Random ghost appearances
    const ghostInterval = setInterval(() => {
      const ghost = document.createElement('div');
      ghost.textContent = '👻';
      ghost.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        font-size: ${30 + Math.random() * 40}px;
        pointer-events: none;
        z-index: 99999;
        opacity: 0.3;
        animation: ghostFloat 2s ease-out forwards;
      `;
      document.body.appendChild(ghost);
      setTimeout(() => ghost.remove(), 2000);
    }, 500);

    // Add ghost animation
    if (!document.getElementById('ghost-style')) {
      const style = document.createElement('style');
      style.id = 'ghost-style';
      style.textContent = `
        @keyframes ghostFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.5; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.filter = 'none';
      clearInterval(ghostInterval);
    }, 5000);
  }

  function triggerPartyMode() {
    triggerSecretEffects('#ff00ff');

    // Rainbow overlay
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
      animation: partyColors 0.3s linear infinite;
    `;

    const style = document.createElement('style');
    style.id = 'party-style';
    style.textContent = `
      @keyframes partyColors {
        0% { background: rgba(255,0,0,0.15); }
        20% { background: rgba(255,165,0,0.15); }
        40% { background: rgba(0,255,0,0.15); }
        60% { background: rgba(0,0,255,0.15); }
        80% { background: rgba(255,0,255,0.15); }
        100% { background: rgba(255,0,0,0.15); }
      }
      @keyframes confettiFall {
        0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    showTemporaryMessage('PARTY MODE!', 3000);

    // Confetti!
    const confettiInterval = setInterval(() => {
      for (let i = 0; i < 5; i++) {
        spawnConfetti();
      }
    }, 100);

    // Disco ball emoji floating
    const disco = document.createElement('div');
    disco.textContent = '🪩';
    disco.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 60px;
      pointer-events: none;
      z-index: 99999;
      animation: discoBounce 0.5s ease-in-out infinite;
    `;
    if (!document.getElementById('disco-style')) {
      const discoStyle = document.createElement('style');
      discoStyle.id = 'disco-style';
      discoStyle.textContent = `
        @keyframes discoBounce {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.1); }
        }
      `;
      document.head.appendChild(discoStyle);
    }
    document.body.appendChild(disco);

    setTimeout(() => {
      overlay.remove();
      style.remove();
      disco.remove();
      clearInterval(confettiInterval);
    }, 10000);
  }

  function spawnConfetti() {
    const colors = ['#ff6688', '#66ffff', '#ffff66', '#ff66ff', '#66ff66', '#ffbb66'];
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -20px;
      width: ${5 + Math.random() * 10}px;
      height: ${5 + Math.random() * 10}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      pointer-events: none;
      z-index: 99999;
      animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
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
      background: linear-gradient(135deg, rgba(0,0,30,0.95) 0%, rgba(0,0,50,0.95) 100%);
      border: 3px solid #00ffff;
      color: #00ffff;
      padding: 20px 40px;
      font-family: 'Press Start 2P', monospace;
      font-size: 14px;
      z-index: 99999;
      box-shadow: 0 0 30px rgba(0,255,255,0.4), inset 0 0 20px rgba(0,255,255,0.1);
      text-shadow: 0 0 10px #00ffff;
      animation: messageSlam ${duration}ms ease-out forwards;
    `;

    // Ensure animation exists
    if (!document.getElementById('message-slam-style')) {
      const style = document.createElement('style');
      style.id = 'message-slam-style';
      style.textContent = `
        @keyframes messageSlam {
          0% { opacity: 0; transform: translateX(-50%) scale(1.5); }
          10% { opacity: 1; transform: translateX(-50%) scale(0.95); }
          15% { transform: translateX(-50%) scale(1.02); }
          20% { transform: translateX(-50%) scale(1); }
          80% { opacity: 1; transform: translateX(-50%) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) scale(0.9) translateY(-20px); }
        }
      `;
      document.head.appendChild(style);
    }

    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => {
      msg.remove();
    }, duration);
  }

  // ===== BASE64 HIDDEN MESSAGE IN COMMENT =====
  // VGhlIHpvbmUgaXMgcmVhbC4gVGhlIHpvbmUgYXdhaXRzLg==
  // (Decodes to: "The zone is real. The zone awaits.")

})();
