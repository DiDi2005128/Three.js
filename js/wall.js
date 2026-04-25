/* ============================================
   DC FIND THE HERO — WALL.JS (version 3D)
   Génère le mur de cartes style Pinterest
   avec objets DC en 3D (canvas Three.js)
   ============================================ */

(function () {

  const CONFIG = {
    columns:      4,
    scrollSpeeds: [28, 22, 32, 25],
  };

  /* ============================================
     INIT
     ============================================ */
  function init() {
    initCursor();
    initThreeBackground();
    buildWall();
    loadState();
  }

  /* ============================================
     CURSEUR
     ============================================ */
  function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup',   () => cursor.classList.remove('click'));
    document.querySelectorAll('button, a, .hero-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ============================================
     THREE.JS — FOND ANIMÉ
     ============================================ */
  function initThreeBackground() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    scene.add(new THREE.AmbientLight(0x111122, 2));

    const blueLight = new THREE.PointLight(0x0057b8, 6, 25);
    blueLight.position.set(-6, 4, 4);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf5c518, 4, 20);
    goldLight.position.set(6, -3, 3);
    scene.add(goldLight);

    /* Étoiles */
    const starPos = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200 * 3; i++) starPos[i] = (Math.random() - 0.5) * 80;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 })
    );
    scene.add(stars);

    /* Anneaux */
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.012, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x0057b8, transparent: true, opacity: 0.08 })
    );
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(9, 0.01, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.05 })
    );
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.025;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      ring1.rotation.z = t * 0.08;
      ring2.rotation.z = -t * 0.05;
      stars.rotation.y = t * 0.008;
      blueLight.position.x = Math.sin(t * 0.3) * 7;
      blueLight.position.y = Math.cos(t * 0.4) * 5;
      goldLight.position.x = Math.cos(t * 0.25) * 7;
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ============================================
     CONSTRUCTION DU MUR
     ============================================ */
  function buildWall() {
    const grid = document.getElementById('wallGrid');
    if (!grid) return;

    const heroes  = shuffleHeroes();
    const columns = [[], [], [], []];
    heroes.forEach((hero, i) => columns[i % CONFIG.columns].push(hero));

    columns.forEach((colHeroes, colIndex) => {
      const col = document.createElement('div');
      col.className = 'wall-column';

      const direction = colIndex % 2 === 0 ? 'scroll-down' : 'scroll-up';
      col.classList.add(direction);
      col.style.setProperty('--scroll-dur', CONFIG.scrollSpeeds[colIndex] + 's');

      /* Doubler les cartes pour la boucle infinie */
      const doubled = [...colHeroes, ...colHeroes];
      doubled.forEach(hero => {
        const card = createCard(hero);
        col.appendChild(card);
      });

      grid.appendChild(col);
    });

    /* Initialiser les canvas 3D APRÈS que les cartes
       soient dans le DOM (pour avoir les dimensions) */
    setTimeout(() => {
      document.querySelectorAll('.hero-card:not(.found)').forEach(card => {
        const heroId = parseInt(card.dataset.heroId);
        const hero   = DC_HEROES.find(h => h.id === heroId);
        if (hero && window.Objects3D) {
          window.Objects3D.createObject3D(hero, card);
        }
      });
    }, 100);
  }

  /* ============================================
     CRÉATION D'UNE CARTE (sans <img>)
     ============================================ */
  function createCard(hero) {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.dataset.heroId = hero.id;

    /* Le canvas 3D sera injecté par Objects3D.createObject3D */
    card.innerHTML = `
      <div class="card-overlay"></div>
      <div class="card-difficulty ${hero.difficulty}"></div>
      <div class="card-click-hint">CLIQUER</div>
      <div class="card-found-badge">
        <span class="found-check">✔</span>
        <span class="found-name">${hero.hero}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      if (card.classList.contains('found')) return;
      openPopup(hero, card);
    });

    return card;
  }

  /* ============================================
     CHARGER L'ÉTAT SAUVEGARDÉ
     ============================================ */
  function loadState() {
    const state = GameState.init();

    /* Nom du joueur */
    const playerNameEl = document.getElementById('playerName');
    if (playerNameEl && state.player) {
      playerNameEl.textContent = state.player.toUpperCase();
    }

    if (!state.found || state.found.length === 0) return;

    state.found.forEach(id => markAllCardsFound(id));
    updateScore(state.found.length);
  }

  /* ============================================
     MARQUER LES CARTES TROUVÉES
     ============================================ */
  function markAllCardsFound(heroId) {
    document.querySelectorAll(`.hero-card[data-hero-id="${heroId}"]`).forEach(card => {
      card.classList.add('found');
      /* Stopper le renderer 3D de cette carte */
      if (window.Objects3D) {
        window.Objects3D.stopObject3D(card);
      }
    });
  }

  /* ============================================
     MISE À JOUR DU SCORE
     ============================================ */
  function updateScore(count) {
    const el = document.getElementById('scoreCount');
    if (!el) return;
    el.textContent = count;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  }

  /* ============================================
     EXPOSER
     ============================================ */
  window.WallModule = { markAllCardsFound, updateScore };

  /* ============================================
     LANCEMENT============================================ */
  document.addEventListener('DOMContentLoaded', init);

})();