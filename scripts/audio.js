// WILFORD JRPG Audio System
// Retro-style sound effects using Web Audio API

(function() {
  'use strict';

  let audioContext = null;
  let audioEnabled = false;

  // Initialize audio context on first user interaction
  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioEnabled = true;
    }
    return audioContext;
  }

  // Enable audio on any user interaction
  document.addEventListener('click', initAudio, { once: true });
  document.addEventListener('keydown', initAudio, { once: true });

  // Synthesize retro sound effects
  function playMenuSound(type) {
    if (!audioEnabled) {
      initAudio();
    }

    if (!audioContext) return;

    const now = audioContext.currentTime;

    switch(type) {
      case 'move':
        playSFX([
          { freq: 800, duration: 0.05, type: 'square', volume: 0.1 }
        ]);
        break;

      case 'select':
        playSFX([
          { freq: 600, duration: 0.08, type: 'square', volume: 0.15 },
          { freq: 900, duration: 0.08, type: 'square', volume: 0.15, delay: 0.08 }
        ]);
        break;

      case 'back':
        playSFX([
          { freq: 400, duration: 0.1, type: 'square', volume: 0.1 },
          { freq: 300, duration: 0.1, type: 'square', volume: 0.08, delay: 0.05 }
        ]);
        break;

      case 'start':
        playSFX([
          { freq: 523, duration: 0.1, type: 'square', volume: 0.15 },
          { freq: 659, duration: 0.1, type: 'square', volume: 0.15, delay: 0.1 },
          { freq: 784, duration: 0.15, type: 'square', volume: 0.15, delay: 0.2 },
          { freq: 1047, duration: 0.2, type: 'square', volume: 0.12, delay: 0.35 }
        ]);
        break;

      case 'secret':
        // Special fanfare for easter egg
        const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
        notes.forEach((freq, i) => {
          playSFX([
            { freq: freq, duration: 0.12, type: 'square', volume: 0.1, delay: i * 0.08 }
          ]);
        });
        break;
    }
  }

  function playSFX(notes) {
    if (!audioContext) return;

    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = note.type || 'square';
      oscillator.frequency.value = note.freq;

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        note.volume || 0.1,
        audioContext.currentTime + (note.delay || 0) + 0.01
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        audioContext.currentTime + (note.delay || 0) + note.duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(audioContext.currentTime + (note.delay || 0));
      oscillator.stop(audioContext.currentTime + (note.delay || 0) + note.duration + 0.1);
    });
  }

  // Expose globally for menu.js
  window.playMenuSound = playMenuSound;

})();
