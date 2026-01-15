// WILFORD JRPG Dialogue System

(function() {
  'use strict';

  // Bio text content - split into dialogue pages
  const bioPages = [
    "WILFORD. is a Canadian producer and musician hailing from Saskatoon, Saskatchewan.",
    "Creating experimental electronic music that pushes boundaries and explores new sonic territories.",
    "From glitchy beats to ambient soundscapes, each release is a journey into the unknown.",
    "The music of WILFORD. is an expression of creativity without limits - a blend of emotion and experimentation.",
    "Thank you for listening and supporting independent music. The adventure continues..."
  ];

  let currentPage = 0;
  let isTyping = false;
  let typewriterTimeout = null;

  // Initialize bio dialogue when screen loads
  window.initBioDialogue = function() {
    currentPage = 0;
    showDialoguePage(0);
  };

  function showDialoguePage(pageIndex) {
    const textElement = document.getElementById('bio-text');
    const dialogueBox = document.getElementById('bio-dialogue');
    const nextIndicator = dialogueBox.querySelector('.dialogue-next');

    if (!textElement || pageIndex >= bioPages.length) return;

    // Clear previous text
    textElement.textContent = '';
    nextIndicator.style.display = 'none';
    isTyping = true;

    // Typewriter effect
    const text = bioPages[pageIndex];
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        textElement.textContent += text.charAt(charIndex);
        charIndex++;

        // Variable typing speed for more natural feel
        const delay = text.charAt(charIndex - 1) === '.' ? 300 :
                     text.charAt(charIndex - 1) === ',' ? 150 :
                     30 + Math.random() * 20;

        typewriterTimeout = setTimeout(typeChar, delay);
      } else {
        // Typing complete
        isTyping = false;
        if (pageIndex < bioPages.length - 1) {
          nextIndicator.style.display = 'inline';
        } else {
          nextIndicator.textContent = '[ END ]';
          nextIndicator.style.display = 'inline';
          nextIndicator.classList.remove('blink');
        }
      }
    }

    typeChar();
  }

  // Handle advancing dialogue
  document.addEventListener('DOMContentLoaded', () => {
    const dialogueBox = document.getElementById('bio-dialogue');

    if (dialogueBox) {
      dialogueBox.addEventListener('click', advanceDialogue);
    }

    document.addEventListener('keydown', (e) => {
      const bioScreen = document.getElementById('bio-screen');
      if (bioScreen && bioScreen.classList.contains('active')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          advanceDialogue();
        }
      }
    });
  });

  function advanceDialogue() {
    if (isTyping) {
      // Skip to end of current text
      clearTimeout(typewriterTimeout);
      const textElement = document.getElementById('bio-text');
      const dialogueBox = document.getElementById('bio-dialogue');
      const nextIndicator = dialogueBox.querySelector('.dialogue-next');

      textElement.textContent = bioPages[currentPage];
      isTyping = false;

      if (currentPage < bioPages.length - 1) {
        nextIndicator.style.display = 'inline';
      } else {
        nextIndicator.textContent = '[ END ]';
        nextIndicator.style.display = 'inline';
        nextIndicator.classList.remove('blink');
      }
    } else {
      // Advance to next page
      if (currentPage < bioPages.length - 1) {
        currentPage++;
        if (typeof window.playMenuSound === 'function') {
          window.playMenuSound('move');
        }
        showDialoguePage(currentPage);
      }
    }
  }

})();
