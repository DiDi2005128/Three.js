/* ============================================
   DC FIND THE HERO — POPUP.JS
   Gère l'ouverture, fermeture et interaction
   du popup de réponse
   ============================================ */

(function () {

  /* ============================================
     ÉLÉMENTS DU DOM
     ============================================ */
  const overlay      = document.getElementById('popupOverlay');
  const popup        = document.getElementById('popup');
  const closeBtn     = document.getElementById('popupClose');
  const input        = document.getElementById('popupInput');
  const feedback     = document.getElementById('popupFeedback');
  const popupImage   = document.getElementById('popupImage');
  const popupGlow    = document.getElementById('popupGlow');
  const popupObjName = document.getElementById('popupObjectName');
  const popupObjDesc = document.getElementById('popupObjectDesc');

  /* Héros actif dans le popup */
  let currentHero = null;
  let currentCard = null;

  /* ============================================
     OUVRIR LE POPUP
     ============================================ */
  function openPopup(hero, card) {
    currentHero = hero;
    currentCard = card;

    /* Remplir le contenu */
    popupImage.src = hero.image;
    popupImage.alt = hero.object;
    popupObjName.textContent = hero.object;
    popupObjDesc.textContent = hero.objectDesc;

    /* Couleur du glow selon le héros */
    popupGlow.style.background =
      'radial-gradient(ellipse at center bottom, ${hero.color}55 0%, transparent 70%)';

    /* Reset du champ et du feedback */
    input.value = '';
    clearFeedback();

    /* Ouvrir */
    overlay.classList.add('open');

    /* Focus automatique sur l'input */
    setTimeout(() => input.focus(), 350);
  }

  /* ============================================
     FERMER LE POPUP
     ============================================ */
  function closePopup() {
    overlay.classList.remove('open');
    currentHero = null;
    currentCard = null;
    clearFeedback();
    input.value = '';
  }

  /* ============================================
     AFFICHER LE FEEDBACK
     ============================================ */
  function showFeedback(type, message) {
    feedback.textContent = message;
    feedback.className = 'popup-feedback ' + type;
  }

  function clearFeedback() {
    feedback.textContent = '';
    feedback.className = 'popup-feedback';
  }

  /* ============================================
     ANIMATION — MAUVAISE RÉPONSE
     ============================================ */
  function animateWrong() {
    input.classList.add('shake');
    input.addEventListener('animationend', () => {
      input.classList.remove('shake');
    }, { once: true });
  }

  /* ============================================
     ANIMATION — BONNE RÉPONSE
     ============================================ */
  function animateCorrect() {
    popup.classList.add('correct-flash');
    popup.addEventListener('animationend', () => {
      popup.classList.remove('correct-flash');
    }, { once: true });
  }

  /* ============================================
     VALIDER LA RÉPONSE
     ============================================ */
  function validateAnswer() {
    if (!currentHero) return;

    const answer = input.value.trim();
    if (!answer) return;

    const isCorrect = checkAnswer(currentHero.id, answer);

    if (isCorrect) {
      /* Bonne réponse */
      animateCorrect();
      showFeedback('correct', '✔ BONNE RÉPONSE !');

      /* Laisser voir le feedback puis fermer */
      setTimeout(() => {
        /* Notifier game-logic */
        if (window.GameLogic) {
          window.GameLogic.onCorrectAnswer(currentHero.id);
        }
        closePopup();
      }, 900);

    } else {
      /* Mauvaise réponse */
      animateWrong();
      showFeedback('wrong', '✘ Essaie encore…');

      /* Vider l'input après le shake */
      setTimeout(() => {
        input.value = '';
        clearFeedback();
      }, 1200);
    }
  }

  /* ============================================
     ÉVÉNEMENTS
     ============================================ */

  /* Touche Entrée pour valider */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      validateAnswer();
    }
    /* Échap pour fermer */
    if (e.key === 'Escape') {
      closePopup();
    }
  });

  /* Bouton fermer */
  closeBtn.addEventListener('click', closePopup);

  /* Clic sur l'overlay (hors popup) pour fermer */
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePopup();
  });

  /* Échap global */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closePopup();
    }
  });

  /* ============================================
     EXPOSER openPopup AUX AUTRES MODULES
     ============================================ */
  window.openPopup  = openPopup;
  window.closePopup = closePopup;

})();