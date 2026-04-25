/* ============================================
   DC FIND THE HERO — WALL.JS
   Génère le mur de cartes style Pinterest
   avec colonnes défilantes indépendantes
   + scène Three.js en arrière-plan
   ============================================ */

(function () {

  /* ============================================
     CONFIGURATION
     ============================================ */
  const CONFIG = {
    columns: 4,          // Nombre de colonnes
    cardsPerCol: 6,      // Cartes par colonne (dupliquées pour boucle infinie)
    scrollSpeeds: [28, 22, 32, 25], // Durée animation en secondes par colonne
  };

  /* ============================================
     INIT PRINCIPALE
     ============================================ */
  function init() {
    initCursor();
    initThreeBackground();
    buildWall();
    loadState();
  }

  /* ============================================
     CURSEUR PERSONNALISÉ
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

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.z = 10;

    /* Lumières */
    scene.add(new THREE.AmbientLight(0x111122, 2));

    const blueLight = new THREE.PointLight(0x0057b8, 6, 25);
    blueLight.position.set(-6, 4, 4);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf5c518, 4, 20);
    goldLight.position.set(6, -3, 3);
    scene.add(goldLight);

    /* Étoiles */
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1200;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 80;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* Anneaux rotatifs */
    const ring1 = createRing(6, 0x0057b8, 0.08);
    ring1.rotation.x = Math.PI / 2.5;
    scene.add(ring1);

    const ring2 = createRing(9, 0xf5c518, 0.05);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 5;
    scene.add(ring2);

    /* Objets flottants (symboles DC) */
    const floaters = [];
    const colors = [0xf5c518, 0x0057b8, 0xc8102e, 0x00ff88, 0x9b59b6];
    for (let i = 0; i < 8; i++) {
      const geo = i % 2 === 0
        ? new THREE.OctahedronGeometry(0.3, 0)
        : new THREE.IcosahedronGeometry(0.25, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        emissive: colors[i % colors.length],
        emissiveIntensity: 0.4,
        metalness: 0.9,
        roughness: 0.2,
      });
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / 8) * Math.PI * 2;
      mesh.position.set(
        Math.
cos(angle) * 7,
        Math.sin(angle) * 3,
        Math.sin(angle) * 2 - 3
      );
      scene.add(mesh);
      floaters.push({
        mesh,
        baseY: mesh.position.y,
        floatOffset: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    /* Parallaxe souris */
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* Boucle */
    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x += (mx * 1.2 - camera.position.x) * 0.025;
      camera.position.y += (-my * 0.8 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      floaters.forEach(f => {
        f.mesh.position.y = f.baseY + Math.sin(t * f.speed + f.floatOffset) * 0.4;
        f.mesh.rotation.x += f.rotSpeed;
        f.mesh.rotation.y += f.rotSpeed * 0.8;
        f.mesh.material.emissiveIntensity = 0.3 + Math.sin(t * 2 + f.floatOffset) * 0.2;
      });

      ring1.rotation.z = t * 0.08;
      ring2.rotation.z = -t * 0.05;
      stars.rotation.y = t * 0.008;

      blueLight.position.x = Math.sin(t * 0.3) * 7;
      blueLight.position.y = Math.cos(t * 0.4) * 5;
      goldLight.position.x = Math.cos(t * 0.25) * 7;

      renderer.render(scene, camera);
    })();

    /* Resize */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function createRing(radius, color, opacity) {
    const geo = new THREE.TorusGeometry(radius, 0.012, 8, 120);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
    return new THREE.Mesh(geo, mat);
  }

  /* ============================================
     CONSTRUCTION DU MUR
     ============================================ */
  function buildWall() {
    const grid = document.getElementById('wallGrid');
    if (!grid) return;

    // Mélanger les héros
    const heroes = shuffleHeroes();

    // Diviser en 4 colonnes
    const columns = [[], [], [], []];
    heroes.forEach((hero, i) => {
      columns[i % CONFIG.columns].push(hero);
    });

    // Construire chaque colonne
    columns.forEach((colHeroes, colIndex) => {
      const col = document.createElement('div');
      col.className = 'wall-column';

      // Direction alternée : paires descendent, impaires montent
      const direction = colIndex % 2 === 0 ? 'scroll-down' : 'scroll-up';
      col.classList.add(direction);
      col.style.setProperty('--scroll-dur', CONFIG.scrollSpeeds[colIndex] + 's');

      // Créer les cartes (doublées pour boucle infinie)
      const doubled = [...colHeroes, ...colHeroes];
      doubled.forEach(hero => {
        const card = createCard(hero);
        col.appendChild(card);
      });

      grid.appendChild(col);
    });
  }

  /* ============================================
     CRÉATION D'UNE CARTE
     ============================================ */
  function createCard(hero) {
    const card = document.createElement('div');
    card.className = 'hero-card';
    card.dataset.heroId = hero.id;

    card.innerHTML = `
      <img
        class="card-img"
        src="${hero.image}"
        alt="Objet mystère"
        onerror="this.src='assets/images/placeholder.jpg'"
      />
      <div class="card-overlay"></div>
      <div class="card-difficulty ${hero.difficulty}"></div>
      <div class="card-click-hint">CLIQUER</div>
      <div class="card-found-badge">
        <span class="found-check">✔</span>
        <span class="found-name">${hero.hero}</span>
      </div>
    `;

    // Clic → ouvrir popup
    card.addEventListener('click', () => {
      if (card.classList.contains('found')) return;
      openPopup(hero, card);
    });

    return card;
  }
/* ============================================
     CHARGER L'ÉTAT SAUVEGARDÉ
     Marquer les cartes déjà trouvées
     ============================================ */
  function loadState() {
    const state = GameState.init();
    if (!state.found || state.found.length === 0) return;

    state.found.forEach(id => {
      markAllCardsFound(id);
    });

    updateScore(state.found.length);
  }

  /* ============================================
     MARQUER TOUTES LES CARTES D'UN HÉROS TROUVÉ
     ============================================ */
  function markAllCardsFound(heroId) {
    document.querySelectorAll(`.hero-card[data-hero-id="${heroId}"]`).forEach(card => {
      card.classList.add('found');
    });
  }

  /* ============================================
     MISE À JOUR DU SCORE HEADER
     ============================================ */
  function updateScore(count) {
    const el = document.getElementById('scoreCount');
    if (!el) return;
    el.textContent = count;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 300);
  }

  /* ============================================
     EXPOSER LES FONCTIONS NÉCESSAIRES
     aux autres modules (popup.js, game-logic.js)
     ============================================ */
  window.WallModule = {
    markAllCardsFound,
    updateScore,
  };

  /* ============================================
     LANCEMENT
     ============================================ */
  document.addEventListener('DOMContentLoaded', init);

})();