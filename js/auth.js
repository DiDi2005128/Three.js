/* ============================================
   DC FIND THE HERO — AUTH.JS
   Gère la connexion, l'inscription
   et la validation des formulaires
   (stockage localStorage — pas de backend)
   ============================================ */

(function () {

  /* ============================================
     ÉTAT
     ============================================ */
  const USERS_KEY  = 'dc_users';
  const SESSION_KEY = 'dc_session';

  let selectedHero = 'Batman';
  let activeTab    = 'login';

  /* ============================================
     INIT
     ============================================ */
  function init() {
    initCursor();
    initThreeBackground();
    initHeroPicker();
    initEnterKey();

    /* Si déjà connecté → aller directement au jeu */
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      window.location.href = 'game.html';
    }
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
    document.querySelectorAll('button, a, .auth-link, .hero-pick-btn').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ============================================
     THREE.JS FOND
     ============================================ */
  function initThreeBackground() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;

    scene.add(new THREE.AmbientLight(0x111122, 2));

    const blueLight = new THREE.PointLight(0x0057b8, 6, 20);
    blueLight.position.set(-4, 3, 3);
    scene.add(blueLight);

    const goldLight = new THREE.PointLight(0xf5c518, 4, 15);
    goldLight.position.set(4, -2, 2);
    scene.add(goldLight);

    /* Étoiles */
    const positions = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000 * 3; i++) positions[i] = (Math.random() - 0.5) * 60;
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.5 })
    );
    scene.add(stars);

    /* Anneau DC */
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.012, 8, 100),
      new THREE.MeshBasicMaterial({ color: 0x0057b8, transparent: true, opacity: 0.12 })
    );
    ring.rotation.x = Math.PI / 3;
    scene.add(ring);

    /* Objets flottants */
    const floaters = [];
    const geos  = [
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.IcosahedronGeometry(0.3, 0),
      new THREE.TetrahedronGeometry(0.4, 0),
    ];
    const colors = [0xf5c518, 0x0057b8, 0xc8102e, 0x00ff88];

    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(
        geos[i % geos.length],
        new THREE.MeshStandardMaterial({
          color: colors[i % colors.length],
          emissive: colors[i % colors.length],
          emissiveIntensity: 0.4,
          metalness: 0.9,
          roughness: 0.2,
        })
      );
      const angle = (i / 6) * Math.PI * 2;
      mesh.position.set(Math.cos(angle) * 6, Math.sin(angle) * 2.5, -2);
      scene.add(mesh);
      floaters.push({
        mesh,
        baseY: mesh.position.y,
        offset: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x += (mx * 1 - camera.position.x) * 0.02;
      camera.position.y += (-my * 0.6 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      floaters.forEach(f => {
        f.mesh.position.y = f.baseY + Math.sin(t + f.offset) * 0.3;
        f.mesh.rotation.x += f.rotSpeed;
        f.mesh.rotation.y += f.rotSpeed * 0.7;
      });

      ring.rotation.z = t * 0.06;
      stars.rotation.y = t * 0.006;
      blueLight.position.x = Math.sin(t * 0.3) * 5;
      goldLight.position.x = Math.cos(t * 0.25) * 5;

      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ============================================
     SWITCH TABS
     ============================================ */
  window.switchTab = function (tab) {
    activeTab = tab;

    const tabLogin    = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const formLogin   = document.getElementById('formLogin');
    const formReg     = document.getElementById('formRegister');
    const indicator   = document.getElementById('tabIndicator');

    if (tab === 'login') {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.classList.remove('hidden');
      formReg.classList.add('hidden');
      indicator.classList.remove('right');
    } else {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formReg.classList.remove('hidden');
      formLogin.classList.add('hidden');
      indicator.classList.add('right');
    }

    clearFeedbacks();
  };

  /* ============================================
     HERO PICKER
     ============================================ */
  function initHeroPicker() {
    document.querySelectorAll('.hero-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.hero-pick-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedHero = btn.dataset.hero;
      });
    });
  }

  /* ============================================
     TOUCHE ENTRÉE POUR VALIDER
     ============================================ */
  function initEnterKey() {
    document.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      if (activeTab === 'login')    handleLogin();
      if (activeTab === 'register') handleRegister();
    });
  }

  /* ============================================
     CONNEXION
     ============================================ */
  window.handleLogin = function () {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const feedback = document.getElementById('loginFeedback');

    /* Validation basique */
    if (!username || !password) {
      showFeedback(feedback, 'error', 'Remplis tous les champs.');
      return;
    }

    /* Récupérer les utilisateurs */
    const users = getUsers();
    const user  = users.find(u =>
      u.username.toLowerCase() === username.toLowerCase() && u.password === hashSimple(password)
    );

    if (!user) {
      showFeedback(feedback, 'error', 'Identifiants incorrects.');
      shakeInput('loginPassword');
      return;
    }

    /* Connexion réussie */
    showFeedback(feedback, 'success', '✔ Connexion réussie !');
    saveSession(user);

    setTimeout(() => {
      window.location.href = 'game.html';
    }, 800);
  };

  /* ============================================
     INSCRIPTION
     ============================================ */
  window.handleRegister = function () {
    const username = document.getElementById('registerUsername').value.trim();
    const email    = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm  = document.getElementById('registerConfirm').value;
    const feedback = document.getElementById('registerFeedback');

    /* Validations */
    if (!username || !email || !password || !confirm) {
      showFeedback(feedback, 'error', 'Remplis tous les champs.');
      return;
    }
    if (username.length < 3) {
      showFeedback(feedback, 'error', 'Pseudo trop court (min. 3 caractères).');
      shakeInput('registerUsername');
      return;
    }
    if (!isValidEmail(email)) {
      showFeedback(feedback, 'error', 'Email invalide.');
      shakeInput('registerEmail');
      return;
    }
    if (password.length < 6) {
      showFeedback(feedback, 'error', 'Mot de passe trop court (min. 6 caractères).');
      shakeInput('registerPassword');
      return;
    }
    if (password !== confirm) {
      showFeedback(feedback, 'error', 'Les mots de passe ne correspondent pas.');
      shakeInput('registerConfirm');
      return;
    }

    /* Vérifier si le pseudo est pris */
    const users = getUsers();
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      showFeedback(feedback, 'error', 'Ce pseudo est déjà pris.');
      shakeInput('registerUsername');
      return;
    }

    /* Créer l'utilisateur */
    const newUser = {
      id:          Date.now(),
      username,
      email,
      password:    hashSimple(password),
      favoriteHero: selectedHero,
      createdAt:   new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    showFeedback(feedback, 'success', '✔ Compte créé ! Bienvenue dans la Team DC !');
    saveSession(newUser);

    setTimeout(() => {
      window.location.href = 'game.html';
    }, 1000);
  };

  /* ============================================
     MODE INVITÉ
     ============================================ */
  window.continueAsGuest = function () {
    const guestUser = { id: 0, username: 'Invité', favoriteHero: 'Batman' };
    saveSession(guestUser);
    window.location.href = 'game.html';
  };

  /* ============================================
     AFFICHER / MASQUER MOT DE PASSE
     ============================================ */
  window.togglePassword = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  };

  /* ============================================
     HELPERS
     ============================================ */

  function getUsers() {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveSession(user) {
    const session = {
      id:          user.id,
      username:    user.username,
      favoriteHero: user.favoriteHero,
      loggedAt:    Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    /* Mettre le nom dans le GameState */
    const gameState = localStorage.getItem('dc_game_state');
    const state = gameState ? JSON.parse(gameState) : { found: [] };
    state.player = user.username;
    localStorage.setItem('dc_game_state', JSON.stringify(state));
  }

  function showFeedback(el, type, msg) {
    el.textContent = msg;
    el.className   = 'auth-feedback ' + type;
  }

  function clearFeedbacks() {
    ['loginFeedback', 'registerFeedback'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.className = 'auth-feedback'; }
    });
  }

  function shakeInput(inputId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.classList.add('invalid');
    el.style.animation = 'shake 0.4s ease';
    setTimeout(() => {
      el.style.animation = '';
      el.classList.remove('invalid');
    }, 500);
  }

  /* Hash ultra-simple (pas pour production — ajoute bcrypt si tu as un backend) */
  function hashSimple(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(36);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================
     LANCEMENT
     ============================================ */
  document.addEventListener('DOMContentLoaded', init);

  /* Injecter le keyframe shake (utilisé dans auth aussi) */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

})();