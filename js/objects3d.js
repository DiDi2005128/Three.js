/* ============================================
   DC FIND THE HERO — OBJECTS3D.JS
   UN SEUL renderer partagé pour toutes les cartes
   Évite le "Too many WebGL contexts"
   ============================================ */

(function () {

  /* ============================================
     RENDERER PARTAGÉ UNIQUE
     ============================================ */
  let sharedRenderer = null;
  let sharedScene    = null;
  let sharedCamera   = null;
  let animFrameId    = null;

  /* Map : cardElement → { mesh, particles, floatOffset, speed } */
  const cardObjects = new Map();

  /* Map : heroId → texture (cache) */
  const textureCache = new Map();

  /* ============================================
     INIT DU RENDERER PARTAGÉ
     ============================================ */
  function initSharedRenderer() {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    sharedRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    sharedRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    sharedRenderer.setClearColor(0x000000, 0);
    sharedRenderer.autoClear = false;

    sharedScene  = new THREE.Scene();
    sharedCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    sharedCamera.position.z = 3;

    /* Lumières globales */
    sharedScene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const front = new THREE.DirectionalLight(0xffffff, 1);
    front.position.set(0, 0, 3);
    sharedScene.add(front);
  }

  /* ============================================
     CRÉER L'OBJET 3D POUR UNE CARTE
     Utilise un canvas 2D pour afficher l'image
     avec effet de flottement CSS + Three.js léger
     ============================================ */
  function createObject3D(hero, container) {

    /* Canvas 2D pour l'image (léger, pas de WebGL) */
    const canvas2d = document.createElement('canvas');
    canvas2d.className = 'card-canvas';
    container.appendChild(canvas2d);

    const ctx = canvas2d.getContext('2d');

    /* Taille du canvas */
    function resize() {
      canvas2d.width  = container.clientWidth  || 200;
      canvas2d.height = container.clientHeight || 260;
    }
    resize();

    /* Charger l'image */
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = hero.image;

    let loaded = false;
    let floatY = 0;
    let angle  = 0;
    let time   = Math.random() * Math.PI * 2;
    const floatSpeed = 0.6 + Math.random() * 0.4;
    const rotSpeed   = 0.3 + Math.random() * 0.3;

    img.onload = () => { loaded = true; };
    img.onerror = () => {
      /* Fallback : dessiner un carré coloré */
      loaded = 'fallback';
    };

    /* Glow coloré autour de l'image */
    const glowColor = hero.color;

    /* Boucle d'animation 2D */
    let frameId;
    function draw() {
      frameId = requestAnimationFrame(draw);
      if (container.classList.contains('found')) return;

      const W = canvas2d.width;
      const H = canvas2d.height;

      ctx.clearRect(0, 0, W, H);

      time += 0.016;
      floatY = Math.sin(time * floatSpeed) * 8;
      angle  = Math.sin(time * rotSpeed * 0.5) * 0.12;

      ctx.save();
      ctx.translate(W / 2, H / 2 + floatY);
      ctx.rotate(angle);

      if (loaded === true) {
        /* Calculer le ratio pour garder les proportions */
        const ratio  = img.width / img.height;
        let drawW, drawH;
        if (ratio > W / H) {
          drawW = W * 0.85;
          drawH = drawW / ratio;
        } else {
          drawH = H * 0.85;
          drawW = drawH * ratio;
        }

        /* Glow */
        ctx.shadowColor   = glowColor;
        ctx.shadowBlur    = 20 + Math.sin(time * 2) * 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      } else if (loaded === 'fallback') {
        /* Fallback coloré */
        ctx.shadowColor = glowColor;
        ctx.shadowBlur  = 20;
        ctx.fillStyle   = glowColor;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(W, H) * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      /* Particules légères */
      drawParticles(ctx, W, H, time, glowColor);
    }

    draw();

    /* Stocker pour cleanup */
    cardObjects.set(container, () => cancelAnimationFrame(frameId));

    /* Resize observer */
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        resize();
      });
      ro.observe(container);
    }
  }

  /* ============================================
     PARTICULES 2D LÉGÈRES
     ============================================ */
  function drawParticles(ctx, W, H, time, color) {
    ctx.save();
    const count = 6;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + time * 0.3;
      const r = W * 0.38 + Math.sin(time + i) * 8;
      const x = W / 2 + Math.cos(a) * r;
      const y = H / 2 + Math.sin(a) * r * 0.5;
      const size = 2 + Math.sin(time * 2 + i) * 1;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.4 + Math.sin(time + i) * 0.3;
      ctx.shadowColor = color;
      ctx.shadowBlur  = 6;
      ctx.fill();
    }
    ctx.restore();
  }

  /* ============================================
     STOPPER UNE CARTE (trouvée)
     ============================================ */
  function stopObject3D(container) {
    const stop = cardObjects.get(container);
    if (stop) {
      stop();
      cardObjects.delete(container);
    }
  }

  /* ============================================
     EXPOSER
     ============================================ */
  window.Objects3D = {
    createObject3D,
    stopObject3D,
  };

})();