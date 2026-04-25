/* ============================================
   DC FIND THE HERO — GAME-LOGIC.JS
   Gère la logique du jeu :
   - Bonne réponse → marquer trouvé
   - Mise à jour du score
   - Détection de la victoire
   - Sauvegarde dans localStorage
   ============================================ */

(function () {

  /* ============================================
     ÉTAT LOCAL
     ============================================ */
  let state = GameState.init();

  /* ============================================
     INIT
     Afficher le nom du joueur dans le header
     ============================================ */
  function init() {
    const playerNameEl = document.getElementById('playerName');
    if (playerNameEl && state.player) {
      playerNameEl.textContent = state.player.toUpperCase();
    }

    /* Mettre à jour le score affiché */
    if (window.WallModule) {
      window.WallModule.updateScore(state.found.length);
    }
  }

  /* ============================================
     BONNE RÉPONSE
     Appelée par popup.js quand la réponse est juste
     ============================================ */
  function onCorrectAnswer(heroId) {

    /* Éviter les doublons */
    if (state.found.includes(heroId)) return;

    /* Ajouter à la liste des trouvés */
    state.found.push(heroId);
    GameState.save(state);

    /* Marquer toutes les cartes de ce héros en N&B */
    if (window.WallModule) {
      window.WallModule.markAllCardsFound(heroId);
      window.WallModule.updateScore(state.found.length);
    }

    /* Effet sonore (optionnel — si tu ajoutes les sons plus tard) */
    playSound('correct');

    /* Vérifier la victoire */
    if (isVictory(state)) {
      setTimeout(showVictory, 600);
    }
  }

  /* ============================================
     AFFICHER L'ÉCRAN DE VICTOIRE
     ============================================ */
  function showVictory() {
    const toast = document.getElementById('victoryToast');
    if (toast) {
      toast.classList.add('show');
    }

    /* Sauvegarder la victoire avec date */
    state.completedAt = Date.now();
    GameState.save(state);

    /* Confettis légers */
    launchConfetti();

    /* Redirection automatique vers victory.html après 4 secondes */
    setTimeout(() => {
      window.location.href = 'victory.html';
    }, 4000);
  }

  /* ============================================
     CONFETTIS SIMPLES (CSS/JS pur, pas de lib)
     ============================================ */
  function launchConfetti() {
    const colors = ['#f5c518', '#0057b8', '#c8102e', '#00ff88', '#ffffff'];
    const container = document.body;

    for (let i = 0; i < 60; i++) {
      const dot = document.createElement('div');
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
      container.appendChild(dot);

      /* Supprimer après l'animation */
      setTimeout(() => dot.remove(), (dur + delay) * 1000 + 100);
    }

    /* Injecter le keyframe si pas déjà présent */
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
  }

  /* ============================================
     SON (placeholder — ajoute tes fichiers mp3)
     ============================================ */
  function playSound(type) {
    try {
      const src = type === 'correct'
        ? 'assets/sounds/correct.mp3'
        : 'assets/sounds/wrong.mp3';
      const audio = new Audio(src);
      audio.volume = 0.4;
      audio.play().catch(() => {}); /* Ignorer si pas de fichier */
    } catch (e) {}
  }

  /* ============================================
     INIT AU CHARGEMENT
     ============================================ */
  document.addEventListener('DOMContentLoaded', init);

  /* ============================================
     EXPOSER AUX AUTRES MODULES
     ============================================ */
  window.GameLogic = {
    onCorrectAnswer,
    getState: () => state,
  };

})();