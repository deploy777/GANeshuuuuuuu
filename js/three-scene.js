/* ===================================================================
   THREE.JS 3D AI HOLOGRAPHIC ORB & AMBIENT WEBGL UNIVERSE
   =================================================================== */

(function () {
  'use strict';

  // State
  let scene, camera, renderer;
  let orbGroup, coreSphere, wireframeSphere, outerRing1, outerRing2, particleCloud;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let isCanvasVisible = true;

  const canvas = document.getElementById('threeOrbCanvas');
  const container = document.getElementById('orbCanvasContainer');

  // Initialize Three.js Orb
  function initThreeOrb() {
    if (!canvas || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;

    // 1. Scene
    scene = new THREE.Scene();

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = window.innerWidth < 500 ? 21 : 18;

    // 3. Renderer with antialias and alpha transparency
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x00f0ff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 2.5, 50);
    pointLight1.position.set(10, 10, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x818cf8, 2.0, 50);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // 5. Orb Group Hierarchy
    orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // Inner Glowing Core Sphere
    const coreGeo = new THREE.IcosahedronGeometry(3.6, 4);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x07111e,
      emissive: 0x003b54,
      specular: 0x00f0ff,
      shininess: 90,
      transparent: true,
      opacity: 0.88,
      wireframe: false
    });
    coreSphere = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreSphere);

    // Outer Glass Holographic Wireframe Cage
    const wireGeo = new THREE.IcosahedronGeometry(4.3, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    wireframeSphere = new THREE.Mesh(wireGeo, wireMat);
    orbGroup.add(wireframeSphere);

    // Orbit Ring 1 (Equatorial Glow Ring)
    const ring1Geo = new THREE.TorusGeometry(5.4, 0.04, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.7
    });
    outerRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    outerRing1.rotation.x = Math.PI / 2.8;
    orbGroup.add(outerRing1);

    // Orbit Ring 2 (Polar Gyro Ring)
    const ring2Geo = new THREE.TorusGeometry(6.2, 0.03, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.55
    });
    outerRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    outerRing2.rotation.y = Math.PI / 3.5;
    outerRing2.rotation.x = Math.PI / 6;
    orbGroup.add(outerRing2);

    // Swarm of Surrounding Glowing Particles
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const violetColor = new THREE.Color(0x818cf8);

    for (let i = 0; i < particleCount; i++) {
      const radius = 5.2 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const mixedColor = cyanColor.clone().lerp(violetColor, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    particleCloud = new THREE.Points(particleGeometry, particleMaterial);
    orbGroup.add(particleCloud);

    // Intersection observer to pause rendering when offscreen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isCanvasVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('mousemove', onMouseMove);

    // Start Animation Loop
    animateOrb();
  }

  function onWindowResize() {
    if (!renderer || !camera || !container) return;
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(event) {
    mouse.targetX = (event.clientX - windowHalfX) * 0.0012;
    mouse.targetY = (event.clientY - windowHalfY) * 0.0012;

    // Parallax update on floating HTML chips
    const chips = document.querySelectorAll('.floating-chip');
    chips.forEach(chip => {
      const depth = parseFloat(chip.getAttribute('data-depth')) || 0.4;
      const offsetX = (event.clientX - windowHalfX) * depth * 0.05;
      const offsetY = (event.clientY - windowHalfY) * depth * 0.05;
      chip.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });
  }

  let clock = new THREE.Clock();

  function animateOrb() {
    requestAnimationFrame(animateOrb);

    if (!isCanvasVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth inertia mouse tracking
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    // Rotations
    orbGroup.rotation.y = elapsedTime * 0.25 + mouse.x * 2.2;
    orbGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2 + mouse.y * 1.8;

    wireframeSphere.rotation.y = -elapsedTime * 0.35;
    wireframeSphere.rotation.z = Math.cos(elapsedTime * 0.15) * 0.2;

    outerRing1.rotation.z = elapsedTime * 0.4;
    outerRing2.rotation.z = -elapsedTime * 0.3;

    particleCloud.rotation.y = elapsedTime * 0.08;

    // Core pulsing scale
    const pulseScale = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
    coreSphere.scale.set(pulseScale, pulseScale, pulseScale);

    renderer.render(scene, camera);
  }

  // ===================================================================
  // 2D AMBIENT STARFIELD & INTERACTIVE PARTICLES (BACKGROUND CANVAS)
  // ===================================================================
  function initAmbientStarfield() {
    const ambientCanvas = document.getElementById('ambientCanvas');
    if (!ambientCanvas) return;
    const ctx = ambientCanvas.getContext('2d');

    let w, h;
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 45 : 90;
    const maxDistance = 140;

    function resize() {
      w = ambientCanvas.width = window.innerWidth;
      h = ambientCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Particle Object
    class StarParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.6 + 0.6;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new StarParticle());
    }

    let ambientMouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', e => {
      ambientMouse.x = e.clientX;
      ambientMouse.y = e.clientY;
    });

    function renderStarfield() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / maxDistance) * 0.16;
            ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse connection line
        const mdx = p1.x - ambientMouse.x;
        const mdy = p1.y - ambientMouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 160) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(ambientMouse.x, ambientMouse.y);
          const mouseAlpha = (1 - mdist / 160) * 0.22;
          ctx.strokeStyle = `rgba(129, 140, 248, ${mouseAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(renderStarfield);
    }
    renderStarfield();
  }

  // DOM Content Loaded Handler
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initThreeOrb();
      initAmbientStarfield();
    });
  } else {
    initThreeOrb();
    initAmbientStarfield();
  }
})();
