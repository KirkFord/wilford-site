/**
 * WILFORD PC-98 Terminal Audio Visualizer
 * Canvas-based frequency bar visualizer with retro aesthetics
 */

(function() {
  'use strict';

  let canvas = null;
  let ctx = null;
  let analyser = null;
  let animationId = null;
  let isRunning = false;

  // Visualizer settings
  const settings = {
    barCount: 32,
    barGap: 2,
    color: '#33ff33',
    dimColor: '#115511',
    glowColor: 'rgba(51, 255, 51, 0.5)'
  };

  /**
   * Initialize the visualizer
   * @param {HTMLCanvasElement} canvasElement - The canvas to draw on
   * @param {AnalyserNode} analyserNode - Web Audio API analyser node
   */
  function init(canvasElement, analyserNode) {
    canvas = canvasElement;
    ctx = canvas.getContext('2d');
    analyser = analyserNode;

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw initial idle state
    drawIdle();
  }

  /**
   * Resize canvas to match container
   */
  function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Redraw if not running
    if (!isRunning) {
      drawIdle();
    }
  }

  /**
   * Start the visualization animation
   */
  function start() {
    if (isRunning || !analyser) return;
    isRunning = true;
    draw();
  }

  /**
   * Stop the visualization animation
   */
  function stop() {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    // Draw idle state after stopping
    setTimeout(drawIdle, 100);
  }

  /**
   * Main draw loop
   */
  function draw() {
    if (!isRunning) return;

    animationId = requestAnimationFrame(draw);
    drawBars();
  }

  /**
   * Draw frequency bars
   */
  function drawBars() {
    if (!analyser || !ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width - (settings.barCount - 1) * settings.barGap) / settings.barCount;
    const step = Math.floor(bufferLength / settings.barCount);

    for (let i = 0; i < settings.barCount; i++) {
      // Average the frequency data for this bar
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += dataArray[i * step + j];
      }
      const average = sum / step;

      const barHeight = (average / 255) * canvas.height * 0.9;
      const x = i * (barWidth + settings.barGap);
      const y = canvas.height - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(x, canvas.height, x, y);
      gradient.addColorStop(0, settings.dimColor);
      gradient.addColorStop(0.5, settings.color);
      gradient.addColorStop(1, settings.color);

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Add glow on top
      ctx.shadowColor = settings.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = settings.color;
      ctx.fillRect(x, y, barWidth, 2);
      ctx.shadowBlur = 0;
    }

    // Draw grid overlay
    drawGrid();
  }

  /**
   * Draw idle state (low static bars)
   */
  function drawIdle() {
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width - (settings.barCount - 1) * settings.barGap) / settings.barCount;

    for (let i = 0; i < settings.barCount; i++) {
      const x = i * (barWidth + settings.barGap);
      const barHeight = 2 + Math.random() * 4;

      ctx.fillStyle = settings.dimColor;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
    }

    drawGrid();
  }

  /**
   * Draw grid overlay for PC-98 effect
   */
  function drawGrid() {
    if (!ctx || !canvas) return;

    ctx.strokeStyle = 'rgba(51, 255, 51, 0.1)';
    ctx.lineWidth = 1;

    // Horizontal lines
    const hLines = 4;
    for (let i = 1; i < hLines; i++) {
      const y = (canvas.height / hLines) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Vertical lines
    const vLines = 8;
    for (let i = 1; i < vLines; i++) {
      const x = (canvas.width / vLines) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
  }

  /**
   * Set visualizer color
   * @param {string} color - Hex color string
   */
  function setColor(color) {
    settings.color = color;
    // Derive dim color
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    settings.dimColor = `rgb(${Math.floor(r / 3)}, ${Math.floor(g / 3)}, ${Math.floor(b / 3)})`;
    settings.glowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
  }

  // Expose API
  window.WilfordVisualizer = {
    init,
    start,
    stop,
    setColor,
    resize: resizeCanvas
  };

})();
