/**
 * WILFORD PC-98 Terminal Music Player
 * Custom audio player with Web Audio API integration
 */

(function() {
  'use strict';

  // ========== TRACK DATA ==========
  // CRASH TEST KAWAII TRASHCORE!!! (2024) - Bandcamp order
  const TRACK_DATA = [
    {
      id: 'track-1',
      title: 'PHASE!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 235,
      audioUrl: '/assets/audio/tracks/phase.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-2',
      title: 'COMMANDO!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 141,
      audioUrl: '/assets/audio/tracks/commando.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-3',
      title: 'FANFARE!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 164,
      audioUrl: '/assets/audio/tracks/fanfare.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-4',
      title: 'POSTHASTE!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 152,
      audioUrl: '/assets/audio/tracks/posthaste.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-5',
      title: 'THEME OF LOVE!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 210,
      audioUrl: '/assets/audio/tracks/theme-of-love.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-6',
      title: "IT'S A PROCESS!",
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 137,
      audioUrl: '/assets/audio/tracks/its-a-process.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-7',
      title: 'LIGHTDARK!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 173,
      audioUrl: '/assets/audio/tracks/lightdark.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-8',
      title: 'COUNTDOWN!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 152,
      audioUrl: '/assets/audio/tracks/countdown.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    },
    {
      id: 'track-9',
      title: 'VARMINT!',
      artist: 'WILFORD.',
      album: 'CRASH TEST KAWAII TRASHCORE!!!',
      year: 2024,
      duration: 126,
      audioUrl: '/assets/audio/tracks/varmint.ogg',
      artworkUrl: '/assets/album-art/ctkwtc-web.jpg'
    }
  ];

  // ========== STATE ==========
  const state = {
    currentTrackIndex: 0,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 'none', // 'none', 'all', 'one'
    volume: 0.8,
    shuffleQueue: [],
    audioContext: null,
    analyser: null,
    sourceNode: null,
    gainNode: null,
    isAudioConnected: false
  };

  // DOM Elements
  let audio = null;
  let elements = {};

  // ========== INITIALIZATION ==========
  function init() {
    // Only init if listen-screen exists
    if (!document.getElementById('listen-screen')) return;

    // Create audio element
    audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';

    // Cache DOM elements
    cacheElements();

    // Check if elements exist before setting up
    if (!elements.playBtn) {
      console.warn('Music player elements not found');
      return;
    }

    // Setup event listeners
    setupEventListeners();

    // Initialize UI
    renderTrackList();
    updateVolumeUI();

    // Set initial status
    setStatus('READY. SELECT A TRACK.');

    console.log('%c WILFORD.EXE LOADED ', 'background: #000; color: #33ff33; font-size: 12px;');
  }

  function cacheElements() {
    elements = {
      player: document.querySelector('.terminal-player'),
      playBtn: document.getElementById('play-btn'),
      playIcon: document.getElementById('play-icon'),
      prevBtn: document.getElementById('prev-btn'),
      nextBtn: document.getElementById('next-btn'),
      shuffleBtn: document.getElementById('shuffle-btn'),
      repeatBtn: document.getElementById('repeat-btn'),
      repeatIcon: document.getElementById('repeat-icon'),
      progressBar: document.getElementById('progress-bar'),
      progressContainer: document.getElementById('progress-container'),
      progressHandle: document.getElementById('progress-handle'),
      currentTime: document.getElementById('current-time'),
      durationTime: document.getElementById('duration-time'),
      volumeSlider: document.getElementById('volume-slider'),
      volumeDisplay: document.getElementById('volume-display'),
      trackTitle: document.getElementById('track-title'),
      trackArtist: document.getElementById('track-artist'),
      trackAlbum: document.getElementById('track-album'),
      albumArt: document.getElementById('album-art'),
      tracklist: document.getElementById('tracklist'),
      trackCount: document.getElementById('track-count'),
      statusText: document.getElementById('status-text'),
      visualizerCanvas: document.getElementById('visualizer-canvas')
    };
  }

  function initAudioContext() {
    if (state.audioContext) return;

    try {
      state.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create analyser for visualizer
      state.analyser = state.audioContext.createAnalyser();
      state.analyser.fftSize = 256;
      state.analyser.smoothingTimeConstant = 0.8;

      // Create gain node for volume control
      state.gainNode = state.audioContext.createGain();
      state.gainNode.gain.value = state.volume;

      // Initialize visualizer
      if (window.WilfordVisualizer && elements.visualizerCanvas) {
        window.WilfordVisualizer.init(elements.visualizerCanvas, state.analyser);
      }

      setStatus('AUDIO ENGINE READY.');
    } catch (e) {
      console.error('Failed to create AudioContext:', e);
      setStatus('ERROR: AUDIO INIT FAILED');
    }
  }

  function connectAudioNodes() {
    if (state.isAudioConnected || !state.audioContext || !audio) return;

    try {
      // Connect audio element to Web Audio API
      state.sourceNode = state.audioContext.createMediaElementSource(audio);
      state.sourceNode.connect(state.analyser);
      state.analyser.connect(state.gainNode);
      state.gainNode.connect(state.audioContext.destination);
      state.isAudioConnected = true;
    } catch (e) {
      console.error('Failed to connect audio nodes:', e);
    }
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Playback controls
    elements.playBtn.addEventListener('click', togglePlay);
    elements.prevBtn.addEventListener('click', playPrevious);
    elements.nextBtn.addEventListener('click', playNext);
    elements.shuffleBtn.addEventListener('click', toggleShuffle);
    elements.repeatBtn.addEventListener('click', toggleRepeat);

    // Progress bar
    elements.progressContainer.addEventListener('click', seek);
    elements.progressContainer.addEventListener('mousedown', startDrag);

    // Volume
    elements.volumeSlider.addEventListener('input', setVolume);

    // Audio events
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', onTrackLoaded);
    audio.addEventListener('ended', onTrackEnded);
    audio.addEventListener('error', onAudioError);
    audio.addEventListener('waiting', () => setStatus('BUFFERING...'));
    audio.addEventListener('canplay', () => {
      if (state.isPlaying) setStatus('PLAYING.');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    // Track list item clicks are handled in renderTrackList
  }

  function handleKeyboard(e) {
    // Only handle if listen-screen is active
    const listenScreen = document.getElementById('listen-screen');
    if (!listenScreen || !listenScreen.classList.contains('active')) return;

    // Don't handle if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        togglePlay();
        break;
      case 'ArrowLeft':
        if (e.shiftKey) {
          e.preventDefault();
          playPrevious();
        } else {
          e.preventDefault();
          skipBackward();
        }
        break;
      case 'ArrowRight':
        if (e.shiftKey) {
          e.preventDefault();
          playNext();
        } else {
          e.preventDefault();
          skipForward();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        adjustVolume(0.1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        adjustVolume(-0.1);
        break;
      case 's':
        e.preventDefault();
        toggleShuffle();
        break;
      case 'r':
        e.preventDefault();
        toggleRepeat();
        break;
    }
  }

  // ========== PLAYBACK CONTROLS ==========
  function loadTrack(index) {
    if (index < 0 || index >= TRACK_DATA.length) return;

    state.currentTrackIndex = index;
    const track = TRACK_DATA[index];

    // Set loading state
    if (elements.player) {
      elements.player.classList.add('loading');
    }

    audio.src = track.audioUrl;
    audio.load();

    // Update UI
    elements.trackTitle.textContent = track.title;
    elements.trackArtist.textContent = track.artist;
    elements.trackAlbum.textContent = `${track.album} (${track.year})`;
    elements.albumArt.src = track.artworkUrl;
    elements.albumArt.onerror = () => {
      elements.albumArt.src = '/assets/album-art/default.svg';
    };
    elements.trackCount.textContent = `${index + 1}/${TRACK_DATA.length}`;

    // Update track list UI
    updateTrackListUI();

    setStatus(`LOADING: ${track.title.toUpperCase()}`);

    // Play menu sound
    if (window.playMenuSound) {
      window.playMenuSound('move');
    }
  }

  function togglePlay() {
    // Initialize audio context on first interaction
    if (!state.audioContext) {
      initAudioContext();
    }

    // Connect nodes if not connected
    if (!state.isAudioConnected) {
      connectAudioNodes();
    }

    // Load first track if nothing loaded
    if (!audio.src || audio.src === window.location.href) {
      loadTrack(0);
      // Wait for load then play
      audio.addEventListener('canplay', function playOnce() {
        audio.removeEventListener('canplay', playOnce);
        startPlayback();
      });
      return;
    }

    if (state.isPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function startPlayback() {
    // Resume audio context if suspended
    if (state.audioContext && state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    audio.play().then(() => {
      state.isPlaying = true;
      elements.playIcon.textContent = '[||]';
      setStatus('PLAYING.');

      if (elements.player) {
        elements.player.classList.remove('loading');
      }

      // Start visualizer
      if (window.WilfordVisualizer) {
        window.WilfordVisualizer.start();
      }

      updateTrackListUI();
    }).catch(err => {
      console.error('Playback failed:', err);
      setStatus('ERROR: PLAYBACK FAILED');
    });

    // Play menu sound
    if (window.playMenuSound) {
      window.playMenuSound('select');
    }
  }

  function pausePlayback() {
    audio.pause();
    state.isPlaying = false;
    elements.playIcon.textContent = '[>]';
    setStatus('PAUSED.');

    // Stop visualizer
    if (window.WilfordVisualizer) {
      window.WilfordVisualizer.stop();
    }

    updateTrackListUI();

    if (window.playMenuSound) {
      window.playMenuSound('back');
    }
  }

  function playNext() {
    let nextIndex;

    if (state.isShuffle) {
      nextIndex = getNextShuffleIndex();
    } else {
      nextIndex = state.currentTrackIndex + 1;
      if (nextIndex >= TRACK_DATA.length) {
        if (state.repeatMode === 'all') {
          nextIndex = 0;
        } else {
          setStatus('END OF PLAYLIST.');
          pausePlayback();
          return;
        }
      }
    }

    loadTrack(nextIndex);

    // Auto-play if was playing
    if (state.isPlaying) {
      audio.addEventListener('canplay', function playOnce() {
        audio.removeEventListener('canplay', playOnce);
        startPlayback();
      });
    }
  }

  function playPrevious() {
    // If more than 3 seconds into track, restart it
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevIndex = state.currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = state.repeatMode === 'all' ? TRACK_DATA.length - 1 : 0;
    }

    loadTrack(prevIndex);

    if (state.isPlaying) {
      audio.addEventListener('canplay', function playOnce() {
        audio.removeEventListener('canplay', playOnce);
        startPlayback();
      });
    }
  }

  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    elements.shuffleBtn.classList.toggle('active', state.isShuffle);

    if (state.isShuffle) {
      generateShuffleQueue();
      setStatus('SHUFFLE: ON');
    } else {
      setStatus('SHUFFLE: OFF');
    }

    if (window.playMenuSound) {
      window.playMenuSound('select');
    }
  }

  function toggleRepeat() {
    const modes = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeatMode);
    state.repeatMode = modes[(currentIndex + 1) % modes.length];

    elements.repeatBtn.classList.toggle('active', state.repeatMode !== 'none');

    switch (state.repeatMode) {
      case 'none':
        elements.repeatIcon.textContent = 'RPT';
        setStatus('REPEAT: OFF');
        break;
      case 'all':
        elements.repeatIcon.textContent = 'ALL';
        setStatus('REPEAT: ALL');
        break;
      case 'one':
        elements.repeatIcon.textContent = 'ONE';
        setStatus('REPEAT: ONE');
        break;
    }

    if (window.playMenuSound) {
      window.playMenuSound('select');
    }
  }

  // ========== PROGRESS & SEEKING ==========
  function updateProgress() {
    if (!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;
    elements.progressBar.style.width = `${percent}%`;
    elements.progressHandle.style.left = `${percent}%`;
    elements.currentTime.textContent = formatTime(audio.currentTime);
  }

  function seek(e) {
    if (!audio.duration) return;

    const rect = elements.progressContainer.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * audio.duration;
  }

  function startDrag(e) {
    e.preventDefault();

    const onDrag = (e) => {
      seek(e);
    };

    const onRelease = () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', onRelease);
    };

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onRelease);
  }

  function skipForward() {
    if (!audio.duration) return;
    audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
  }

  function skipBackward() {
    audio.currentTime = Math.max(audio.currentTime - 10, 0);
  }

  // ========== VOLUME ==========
  function setVolume(e) {
    state.volume = e.target.value / 100;

    if (state.gainNode) {
      state.gainNode.gain.value = state.volume;
    }

    // Fallback for when audio context isn't ready
    audio.volume = state.volume;

    updateVolumeUI();
  }

  function adjustVolume(delta) {
    state.volume = Math.max(0, Math.min(1, state.volume + delta));

    if (state.gainNode) {
      state.gainNode.gain.value = state.volume;
    }

    audio.volume = state.volume;

    elements.volumeSlider.value = state.volume * 100;
    updateVolumeUI();
  }

  function updateVolumeUI() {
    elements.volumeDisplay.textContent = `${Math.round(state.volume * 100)}%`;
  }

  // ========== TRACK LIST ==========
  function renderTrackList() {
    if (!elements.tracklist) return;

    elements.tracklist.innerHTML = '';

    TRACK_DATA.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'track-item';
      item.dataset.index = index;
      item.innerHTML = `
        <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="track-name">${track.title}</span>
        <span class="track-duration">${formatTime(track.duration)}</span>
      `;

      item.addEventListener('click', () => {
        loadTrack(index);
        // Small delay then play
        setTimeout(() => {
          if (!state.isPlaying) {
            togglePlay();
          } else {
            audio.addEventListener('canplay', function playOnce() {
              audio.removeEventListener('canplay', playOnce);
              startPlayback();
            });
          }
        }, 100);
      });

      elements.tracklist.appendChild(item);
    });

    elements.trackCount.textContent = `0/${TRACK_DATA.length}`;
  }

  function updateTrackListUI() {
    if (!elements.tracklist) return;

    const items = elements.tracklist.querySelectorAll('.track-item');
    items.forEach((item, index) => {
      item.classList.toggle('active', index === state.currentTrackIndex);
      item.classList.toggle('playing', index === state.currentTrackIndex && state.isPlaying);
    });
  }

  // ========== AUDIO EVENTS ==========
  function onTrackLoaded() {
    elements.durationTime.textContent = formatTime(audio.duration);

    if (elements.player) {
      elements.player.classList.remove('loading');
    }

    if (!state.isPlaying) {
      setStatus('READY.');
    }
  }

  function onTrackEnded() {
    if (state.repeatMode === 'one') {
      audio.currentTime = 0;
      audio.play();
    } else {
      playNext();
    }
  }

  function onAudioError(e) {
    console.error('Audio error:', e);
    setStatus('ERROR: FAILED TO LOAD');

    if (elements.player) {
      elements.player.classList.remove('loading');
    }
  }

  // ========== UTILITY ==========
  function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function setStatus(text) {
    if (elements.statusText) {
      elements.statusText.textContent = text;
    }
  }

  function generateShuffleQueue() {
    state.shuffleQueue = [...Array(TRACK_DATA.length).keys()]
      .filter(i => i !== state.currentTrackIndex)
      .sort(() => Math.random() - 0.5);
  }

  function getNextShuffleIndex() {
    if (state.shuffleQueue.length === 0) {
      if (state.repeatMode === 'all') {
        generateShuffleQueue();
      } else {
        return state.currentTrackIndex;
      }
    }
    return state.shuffleQueue.pop();
  }

  // ========== EXPOSE API ==========
  window.WilfordPlayer = {
    init,
    play: togglePlay,
    pause: pausePlayback,
    next: playNext,
    prev: playPrevious,
    loadTrack,
    getState: () => ({ ...state }),
    getTracks: () => [...TRACK_DATA]
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
