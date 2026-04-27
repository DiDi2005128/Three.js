/* ============================================
   DC FIND THE HERO — OBJECTS3D.JS
   Objets DC en vraie 3D — rotation 360°
   Un seul renderer WebGL partagé
   Render-to-texture → affiché sur canvas 2D
   ============================================ */

(function () {

  if (typeof THREE === 'undefined') return;

  /* ============================================
     RENDERER PARTAGÉ UNIQUE
     ============================================ */
  const sharedRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  sharedRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  sharedRenderer.setClearColor(0x000000, 0);
  sharedRenderer.shadowMap.enabled = false;

  /* Canvas hors-écran */
  sharedRenderer.domElement.style.display = 'none';
  document.body.appendChild(sharedRenderer.domElement);

  /* ============================================
     LISTE DES SCÈNES PAR CARTE
     ============================================ */
  const cardScenes = [];
  let animRunning   = false;

  /* ============================================
     BOUCLE D'ANIMATION PRINCIPALE
     ============================================ */
  function startLoop() {
    if (animRunning) return;
    animRunning = true;

    const clock = new THREE.Clock();

    function loop() {
      requestAnimationFrame(loop);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      cardScenes.forEach(cs => {
        if (cs.stopped) return;

        /* Dimensions de la carte */
        const W = cs.container.clientWidth  || 200;
        const H = cs.container.clientHeight || 260;

        /* Redimensionner le renderer */
        sharedRenderer.setSize(W, H, false);
        sharedRenderer.setViewport(0, 0, W, H);

        /* Mettre à jour la caméra */
        cs.camera.aspect = W / H;
        cs.camera.updateProjectionMatrix();

        /* Animer l'objet */
        if (cs.object) {
          cs.object.rotation.y += delta * cs.rotSpeedY;
          cs.object.rotation.x  = Math.sin(elapsed * 0.4 + cs.offset) * 0.3;
          cs.object.position.y  = Math.sin(elapsed * 0.8 + cs.offset) * 0.08;
        }

        /* Animer les lumières */
        if (cs.heroLight) {
          cs.heroLight.intensity = 1.5 + Math.sin(elapsed * 2 + cs.offset) * 0.5;
        }

        /* Render dans ce canvas */
        sharedRenderer.render(cs.scene, cs.camera);

        /* Copier le résultat dans le canvas 2D de la carte */
        const ctx = cs.ctx;
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(sharedRenderer.domElement, 0, 0, W, H);
      });
    }

    loop();
  }

  /* ============================================
     CRÉER LA SCÈNE 3D POUR UNE CARTE
     ============================================ */
  function createObject3D(hero, container) {

    /* Canvas 2D visible dans la carte */
    const canvas2d = document.createElement('canvas');
    canvas2d.className = 'card-canvas';
    canvas2d.width  = container.clientWidth  || 200;
    canvas2d.height = container.clientHeight || 260;
    container.appendChild(canvas2d);
    const ctx = canvas2d.getContext('2d');

    /* Scène Three.js */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas2d.width / canvas2d.height, 0.1, 100);
    camera.position.z = 3.5;

    /* Lumières */
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const frontLight = new THREE.DirectionalLight(0xffffff, 1.5);
    frontLight.position.set(2, 3, 4);
    scene.add(frontLight);

    const heroLight = new THREE.PointLight(new THREE.Color(hero.color), 2, 10);
    heroLight.position.set(-2, 1, 2);
    scene.add(heroLight);

    const rimLight = new THREE.DirectionalLight(new THREE.Color(hero.color), 0.6);
    rimLight.position.set(-3, -2, -1);
    scene.add(rimLight);

    /* Construire l'objet 3D selon le héros */
    const object = buildHeroObject(hero, scene);

    /* Stocker la scène */
    const cs = {
      container,
      scene,
      camera,
      ctx,
      object,
      heroLight,
      rotSpeedY: 0.8 + Math.random() * 0.4,
      offset: Math.random() * Math.PI * 2,
      stopped: false,
    };
    cardScenes.push(cs);

    /* Démarrer la boucle */
    startLoop();

    /* Resize */
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(() => {
        canvas2d.width  = container.clientWidth;
        canvas2d.height = container.clientHeight;
      }).observe(container);
    }
  }

  /* ============================================
     CONSTRUIRE L'OBJET 3D SELON LE HÉROS
     ============================================ */
  function buildHeroObject(hero, scene) {
    let group = new THREE.Group();

    const metalGold = new THREE.MeshStandardMaterial({
      color: 0xf5c518, metalness: 1, roughness: 0.2,
      emissive: new THREE.Color(0xf5c518), emissiveIntensity: 0.1,
    });
    const metalSilver = new THREE.MeshStandardMaterial({
      color: 0xcccccc, metalness: 1, roughness: 0.15,
    });
    const metalBlue = new THREE.MeshStandardMaterial({
      color: 0x0057b8, metalness: 0.9, roughness: 0.3,
      emissive: new THREE.Color(0x0057b8), emissiveIntensity: 0.2,
    });
    const metalRed = new THREE.MeshStandardMaterial({
      color: 0xc8102e, metalness: 0.8, roughness: 0.3,
      emissive: new THREE.Color(0xc8102e), emissiveIntensity: 0.15,
    });
    const metalGreen = new THREE.MeshStandardMaterial({
      color: 0x00cc44, metalness: 0.9, roughness: 0.2,
      emissive: new THREE.Color(0x00cc44), emissiveIntensity: 0.3,
    });
    const matHero = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hero.color),
      metalness: 0.9, roughness: 0.2,
      emissive: new THREE.Color(hero.color),
      emissiveIntensity: 0.2,
    });

    switch (hero.id) {

      /* ---- BATMAN — Batarang ---- */
      case 1: {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.6);
        shape.bezierCurveTo(0.8, 0.4, 1.2, -0.1, 0.9, -0.5);
        shape.bezierCurveTo(0.5, -0.3, 0.2, -0.1, 0, -0.3);
        shape.bezierCurveTo(-0.2, -0.1, -0.5, -0.3, -0.9, -0.5);
        shape.bezierCurveTo(-1.2, -0.1, -0.8, 0.4, 0, 0.6);
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03 });
        const mesh = new THREE.Mesh(geo, metalSilver);
        mesh.geometry.center();
        group.add(mesh);
        break;
      }

      /* ---- AQUAMAN — Trident ---- */
      case 2: {
        /* Manche */
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 12), metalGold);
        group.add(handle);
        /* 3 dents */
        [-0.25, 0, 0.25].forEach((x, i) => {
          const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), metalGold);
          prong.position.set(x, 1.6, 0);
          group.add(prong);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.25, 8), metalGold);
          tip.position.set(x, 2.05, 0);
          group.add(tip);
        });
        /* Garde */
        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.06, 0.06), metalGold);
        guard.position.y = 1.2;
        group.add(guard);
        group.scale.setScalar(0.55);
        break;
      }

      /* ---- BLUE BEETLE — Scarabée ---- */
      case 3: {
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), new THREE.MeshStandardMaterial({
          color: 0x4a9eff, metalness: 1, roughness: 0.1,
          emissive: new THREE.Color(0x4a9eff), emissiveIntensity: 0.4,
        }));
        body.scale.set(1, 0.6, 0.8);
        group.add(body);
        /* Pattes */
        for (let i = 0; i < 3; i++) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.01, 0.5, 6), matHero);
          leg.position.set(0.4, -0.15, (i - 1) * 0.3);
          leg.rotation.z = Math.PI / 4;
          group.add(leg);
          const legR = leg.clone();
          legR.position.x = -0.4;
          legR.rotation.z = -Math.PI / 4;
          group.add(legR);
        }
        /* Cornes */
        const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.35, 6), matHero);
        horn1.position.set(0.2, 0.4, 0);
        horn1.rotation.z = -0.4;
        group.add(horn1);
        const horn2 = horn1.clone();
        horn2.position.x = -0.2;
        horn2.rotation.z = 0.4;
        group.add(horn2);
        break;
      }

      /* ---- RAVEN — Cape ---- */
      case 4: {
        /* Gemme */
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 0), new THREE.MeshStandardMaterial({
          color: 0x9b59b6, metalness: 0.5, roughness: 0.1,
          emissive: new THREE.Color(0x9b59b6), emissiveIntensity: 0.5,
          transparent: true, opacity: 0.9,
        }));
        group.add(gem);
        /* Capuche stylisée */
        const hood = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({
          color: 0x6a0dad, metalness: 0.3, roughness: 0.8, side: THREE.DoubleSide,
        }));
        hood.position.y = 0.5;
        group.add(hood);
        break;
      }

      /* ---- LOBO — Moto (stylisée) ---- */
      case 5: {
        /* Corps */
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.5), metalRed);
        group.add(body);
        /* Roues */
        [0.6, -0.6].forEach(x => {
          const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.1, 8, 20), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.3 }));
          wheel.position.set(x, -0.3, 0);
          wheel.rotation.y = Math.PI / 2;
          group.add(wheel);
        });
        /* Tête de mort */
        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.6 }));
        skull.position.set(0.65, 0.25, 0);
        group.add(skull);
        group.scale.setScalar(0.7);
        break;
      }

      /* ---- MAS Y MENOS — Signes + et - ---- */
      case 6: {
        /* + */
        const plusH = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2, emissive: new THREE.Color(0xff0000), emissiveIntensity: 0.3 }));
        plusH.position.set(-0.4, 0, 0);
        group.add(plusH);
        const plusV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.1), new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.8, roughness: 0.2, emissive: new THREE.Color(0xff0000), emissiveIntensity: 0.3 }));
        plusV.position.set(-0.4, 0, 0);
        group.add(plusV);
        /* - */
        const minus = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.1), new THREE.MeshStandardMaterial({ color: 0x0000ff, metalness: 0.8, roughness: 0.2, emissive: new THREE.Color(0x0000ff), emissiveIntensity: 0.3 }));
        minus.position.set(0.4, 0, 0);
        group.add(minus);
        break;
      }

      /* ---- HAWKMAN — Masse ---- */
      case 7: {
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.6, 10), metalGold);
        group.add(shaft);
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 12), metalGold);
        ball.position.y = 1;
        group.add(ball);
        /* Pointes */
        for (let i = 0; i < 10; i++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 6), metalGold);
          const angle = (i / 10) * Math.PI * 2;
          spike.position.set(Math.cos(angle) * 0.38, 1 + Math.sin(angle) * 0.1, Math.sin(angle) * 0.38);
          spike.lookAt(spike.position.clone().multiplyScalar(2));
          group.add(spike);
        }
        group.scale.setScalar(0.6);
        group.rotation.z = 0.4;
        break;
      }

      /* ---- WONDER WOMAN — Lasso ---- */
      case 8: {
        const curve = new THREE.TorusGeometry(0.6, 0.06, 8, 40, Math.PI * 1.8);
        const lasso = new THREE.Mesh(curve, metalGold);
        group.add(lasso);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), metalGold);
        handle.position.set(0.55, -0.45, 0);
        handle.rotation.z = -0.8;
        group.add(handle);
        break;
      }

      /* ---- JOKER — Sourire ---- */
      case 9: {
        const smileShape = new THREE.Shape();
        smileShape.moveTo(-0.8, 0.2);
        smileShape.quadraticCurveTo(0, -0.7, 0.8, 0.2);
        smileShape.quadraticCurveTo(0.6, 0.5, 0.3, 0.3);
        smileShape.quadraticCurveTo(0, 0, -0.3, 0.3);
        smileShape.quadraticCurveTo(-0.6, 0.5, -0.8, 0.2);
        const geo = new THREE.ExtrudeGeometry(smileShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02 });
        const smile = new THREE.Mesh(geo, metalRed);
        smile.geometry.center();
        group.add(smile);
        break;
      }

      /* ---- GREEN LANTERN — Lanterne ---- */
      case 10: {
        /* Corps cylindrique */
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.6, 12), metalGreen);
        group.add(body);
        /* Lentille */
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), new THREE.MeshStandardMaterial({
          color: 0xffffff, emissive: new THREE.Color(0x00ff88), emissiveIntensity: 1,
          transparent: true, opacity: 0.9,
        }));
        lens.position.set(0, 0, 0.32);
        group.add(lens);
        /* Anneau */
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.03, 8, 30), metalGreen);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 0.35;
        group.add(ring);
        /* Base */
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.2, 12), metalGreen);
        base.position.y = -0.4;
        group.add(base);
        break;
      }

      /* ---- DEADSHOT — Viseur ---- */
      case 11: {
        const helm = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1, roughness: 0.2 }));
        group.add(helm);
        /* Oeil rouge */
        const eye = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 12), new THREE.MeshStandardMaterial({
          color: 0xff0000, emissive: new THREE.Color(0xff0000), emissiveIntensity: 1,
        }));
        eye.rotation.x = Math.PI / 2;
        eye.position.set(0.15, 0.05, 0.45);
        group.add(eye);
        /* Canon poignet */
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 8), metalSilver);
        barrel.rotation.z = Math.PI / 2;
        barrel.position.set(0.8, -0.2, 0);
        group.add(barrel);
        break;
      }

      /* ---- DARKSEID — Omega ---- */
      case 12: {
        /* Symbole Omega */
        const omega1 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 8, 30), new THREE.MeshStandardMaterial({
          color: 0x333333, metalness: 0.9, roughness: 0.3,
          emissive: new THREE.Color(0xcc0000), emissiveIntensity: 0.5,
        }));
        group.add(omega1);
        const bar = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.1), new THREE.MeshStandardMaterial({
          color: 0x333333, metalness: 0.9, roughness: 0.3,
          emissive: new THREE.Color(0xcc0000), emissiveIntensity: 0.5,
        }));
        bar.position.y = -0.3;
        group.add(bar);
        break;
      }

      /* ---- CYBORG — Torse ---- */
      case 13: {
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.5), metalSilver);
        group.add(torso);
        /* Plaque centrale */
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.15), new THREE.MeshStandardMaterial({
          color: 0x222222, metalness: 0.9, roughness: 0.3,
          emissive: new THREE.Color(0xff0000), emissiveIntensity: 0.8,
        }));
        plate.position.z = 0.3;
        group.add(plate);
        /* Épaules */
        [-0.6, 0.6].forEach(x => {
          const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), metalSilver);
          shoulder.position.set(x, 0.4, 0);
          group.add(shoulder);
        });
        group.scale.setScalar(0.8);
        break;
      }

      /* ---- SUPERMAN — Emblème S ---- */
      case 14: {
        /* Bouclier */
        const shieldShape = new THREE.Shape();
        shieldShape.moveTo(0, 0.8);
        shieldShape.lineTo(0.6, 0.4);
        shieldShape.lineTo(0.6, -0.3);
        shieldShape.lineTo(0, -0.8);
        shieldShape.lineTo(-0.6, -0.3);
        shieldShape.lineTo(-0.6, 0.4);
        shieldShape.closePath();
        const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.03 });
        const shield = new THREE.Mesh(shieldGeo, metalRed);
        shield.geometry.center();
        group.add(shield);
        /* S doré */
        const sGeo = new THREE.TorusGeometry(0.2, 0.06, 6, 20, Math.PI);
        const s1 = new THREE.Mesh(sGeo, metalGold);
        s1.position.set(0, 0.18, 0.12);
        group.add(s1);
        const s2 = new THREE.Mesh(sGeo, metalGold);
        s2.position.set(0, -0.18, 0.12);
        s2.rotation.z = Math.PI;
        group.add(s2);
        break;
      }

      /* ---- NIGHTWING — Escrima Sticks ---- */
      case 15: {
        [-0.35, 0.35].forEach(x => {
          const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 10), new THREE.MeshStandardMaterial({
            color: 0x111111, metalness: 0.9, roughness: 0.2,
            emissive: new THREE.Color(0x4a9eff), emissiveIntensity: 0.5,
          }));
          stick.position.set(x, 0, 0);
          stick.rotation.z = 0.3;
          group.add(stick);
        });
        break;
      }

      /* ---- DOCTOR FATE — Casque ---- */
      case 16: {
        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.7), metalGold);
        group.add(helmet);
        const face = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.5), metalGold);
        face.position.set(0, -0.1, 0.5);
        group.add(face);
        /* Crête */
        const crest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.15), metalGold);
        crest.position.set(0, 0.6, 0.1);
        group.add(crest);
        /* Yeux */
        [-0.15, 0.15].forEach(x => {
          const eye = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.06, 0.05), new THREE.MeshStandardMaterial({
            color: 0x000000,
          }));
          eye.position.set(x, -0.05, 0.53);
          group.add(eye);
        });
        break;
      }

      /* ---- HARLEY QUINN — Batte ---- */
      case 17: {
        const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.06, 2, 12), new THREE.MeshStandardMaterial({
          color: 0xd4a96a, metalness: 0.1, roughness: 0.8,
        }));
        group.add(bat);
        /* Grip */
        const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.6 }));
        grip.position.y = -0.8;
        group.add(grip);
        group.rotation.z = 0.3;
        group.scale.setScalar(0.6);
        break;
      }

      /* ---- BANE — Masque ---- */
      case 18: {
        const face2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.65), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 }));
        group.add(face2);
        /* Tuyaux */
        for (let i = 0; i < 4; i++) {
          const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 6), new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 1, roughness: 0.2 }));
          tube.position.set((i - 1.5) * 0.18, -0.35, 0.35);
          tube.rotation.x = Math.PI / 3;
          group.add(tube);
        }
        /* Yeux rouges */
        [-0.2, 0.2].forEach(x => {
          const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshStandardMaterial({
            color: 0xff0000, emissive: new THREE.Color(0xff0000), emissiveIntensity: 0.8,
            transparent: true, opacity: 0.6,
          }));
          eye.position.set(x, 0.1, 0.45);
          group.add(eye);
        });
        break;
      }

      /* ---- FLASH — Bague ---- */
      case 19: {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.18, 12, 40), metalGold);
        group.add(ring);
        /* Éclair */
        const boltShape = new THREE.Shape();
        boltShape.moveTo(0.08, 0.25);
        boltShape.lineTo(-0.02, 0.05);
        boltShape.lineTo(0.06, 0.05);
        boltShape.lineTo(-0.08, -0.25);
        boltShape.lineTo(0.02, -0.05);
        boltShape.lineTo(-0.06, -0.05);
        boltShape.closePath();
        const boltGeo = new THREE.ExtrudeGeometry(boltShape, { depth: 0.08, bevelEnabled: false });
        const bolt = new THREE.Mesh(boltGeo, new THREE.MeshStandardMaterial({
          color: 0xf5c518, emissive: new THREE.Color(0xf5c518), emissiveIntensity: 0.8,
          metalness: 0.9, roughness: 0.1,
        }));
        bolt.geometry.center();
        bolt.position.z = 0.2;
        group.add(bolt);
        break;
      }

      /* ---- GREEN ARROW — Arc ---- */
      case 20: {
        const bowCurve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(0.7, 0, 0),
          new THREE.Vector3(0, 1, 0)
        );
        const bowPoints = bowCurve.getPoints(20);
        const bowGeo = new THREE.BufferGeometry().setFromPoints(bowPoints);
        const bow = new THREE.Line(bowGeo, new THREE.LineBasicMaterial({ color: 0x228b22, linewidth: 3 }));
        group.add(bow);
        /* Corde */
        const stringGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(-0.18, 0, 0),
          new THREE.Vector3(0, 1, 0),
        ]);
        const string = new THREE.Line(stringGeo, new THREE.LineBasicMaterial({ color: 0xaaaaaa }));
        group.add(string);
        /* Flèche */
        const arrow = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8), metalSilver);
        arrow.rotation.z = Math.PI / 2;
        arrow.position.x = -0.09;
        group.add(arrow);
        const arrowTip = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.15, 8), metalSilver);
        arrowTip.rotation.z = -Math.PI / 2;
        arrowTip.position.set(0.63, 0, 0);
        group.add(arrowTip);
        break;
      }

      /* ---- RED LANTERN — Anneau ---- */
      case 21: {
        const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.2, 12, 40), new THREE.MeshStandardMaterial({
          color: 0x880000, metalness: 0.9, roughness: 0.2,
          emissive: new THREE.Color(0xcc0000), emissiveIntensity: 0.4,
        }));
        group.add(ringOuter);
        /* Emblème lanterne */
        const emblem = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 8), new THREE.MeshStandardMaterial({
          color: 0xff0000, emissive: new THREE.Color(0xff4400), emissiveIntensity: 1,
        }));
        emblem.rotation.x = Math.PI / 2;
        group.add(emblem);
        break;
      }

      default: {
        /* Fallback générique */
        const mesh = new THREE.Mesh(
          new THREE.IcosahedronGeometry(0.6, 0),
          matHero
        );
        group.add(mesh);
      }
    }

    scene.add(group);
    return group;
  }

  /* ============================================
     STOPPER UNE CARTE
     ============================================ */
  function stopObject3D(container) {
    const cs = cardScenes.find(c => c.container === container);
    if (cs) cs.stopped = true;
  }

  /* ============================================
     EXPOSER
     ============================================ */
  window.Objects3D = { createObject3D, stopObject3D };

})();