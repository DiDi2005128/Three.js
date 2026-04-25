/* ============================================
   DC FIND THE HERO — GAME-LOGIC.JS
   ============================================ */

(function () {

  let state = GameState.init();

  /* ============================================
     INIT
     ============================================ */
  function init() {
    const playerNameEl = document.getElementById('playerName');
    if (playerNameEl && state.player) {
      playerNameEl.textContent = state.player.toUpperCase();
    }
    if (window.WallModule) {
      window.WallModule.updateScore(state.found.length);
    }
  }

  /* ============================================
     BONNE RÉPONSE
     ============================================ */
  function onCorrectAnswer(heroId) {

    /* Éviter les doublons */
    if (state.found.includes(heroId)) return;

    /* Ajouter à la liste */
    state.found.push(heroId);
    GameState.save(state);

    /* Mettre à jour le mur et le score */
    if (window.WallModule) {
      window.WallModule.markAllCardsFound(heroId);
      window.WallModule.updateScore(state.found.length);
    }

    /* Son */
    playSound('correct');

    /* Log pour debug */
    console.log('Trouvés :', state.found.length, '/ 21');

    /* Victoire uniquement quand les 21 sont trouvés */
    if (state.found.length === 21) {
      setTimeout(showVictory, 800);
    }
  }

  /* ============================================
     VICTOIRE
     ============================================ */
  function showVictory() {
    const toast = document.getElementById('victoryToast');
    if (toast) {
      toast.classList.add('show');
    }

    state.completedAt = Date.now();
    GameState.save(state);

    launchConfetti();

    setTimeout(() => {
      window.location.href = 'victory.html';
    }, 4000);
  }

  /* ============================================
     CONFETTIS
     ============================================ */
  function launchConfetti() {
    const colors = ['#f5c518', '#0057b8', '#c8102e', '#00ff88', '#ffffff'];

    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style');
      style.id = 'confetti-style';
      style.textContent = `
        @keyframes confettiFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    for (let i = 0; i < 60; i++) {
      const dot   = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size  = Math.random() * 8 + 4;
      const left  = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const dur   = Math.random() * 2 + 2;

      dot.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${left}vw;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${dur}s ${delay}s ease-in forwards;
      `;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), (dur + delay) * 1000 + 100);
    }
  }

  /* ============================================
     SON
     ============================================ */
  function playSound(type) {
    try {
      const src   = type === 'correct' ? 'assets/sounds/correct.mp3' : 'assets/sounds/wrong.mp3';
      const audio = new Audio(src);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  }

  /* ============================================
     LANCEMENT
     ============================================ */
  document.addEventListener('DOMContentLoaded', init);

  /* ============================================
     EXPOSER
     ============================================ */
  window.GameLogic = {
    onCorrectAnswer,
    getState: () => state,
  };

})();