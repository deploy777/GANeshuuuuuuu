/* ===================================================================
   MAGI SRI RAMA SATYA GANESH - 3D INTERACTIVE PORTFOLIO ENGINE
   Vanilla JS • Zero Build Step • 60 FPS • Sound FX • WebGL Bridge
   =================================================================== */

(function () {
  'use strict';

  // ===================================================================
  // 1. FUTURISTIC AUDIO SYNTHESIZER (WEB AUDIO API)
  // ===================================================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
  }

  function playFuturisticSound(type) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'slash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Audio Toggle UI
  const soundToggleBtn = document.getElementById('soundToggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = soundToggleBtn.querySelector('i');
      const tooltip = soundToggleBtn.querySelector('.control-tooltip');
      if (soundEnabled) {
        icon.className = 'fa-solid fa-volume-high';
        tooltip.textContent = 'Audio FX: ON';
        playFuturisticSound('click');
        showToast('Audio Feedback: Enabled');
      } else {
        icon.className = 'fa-solid fa-volume-xmark';
        tooltip.textContent = 'Audio FX: MUTED';
        showToast('Audio Feedback: Muted');
      }
    });
  }

  // ===================================================================
  // 2. CUSTOM FUTURISTIC CURSOR
  // ===================================================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let ringX = cursorX;
  let ringY = cursorY;

  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;
    });

    function renderCursor() {
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverables = 'a, button, input, textarea, .tilt-element, .constellation-card, .contact-channel-item, .about-chip';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        playFuturisticSound('hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
      el.addEventListener('click', () => {
        playFuturisticSound('click');
      });
    });
  }

  // ===================================================================
  // 3. NAVIGATION & SCROLL SPY
  // ===================================================================
  const mainHeader = document.getElementById('mainHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksList = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    // Scroll spy for current active section
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinksList.classList.toggle('mobile-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinksList.classList.remove('mobile-open');
      });
    });
  }

  // ===================================================================
  // 4. 3D CARD TILT & SPECULAR SHEEN EFFECT
  // ===================================================================
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.setProperty('--mouse-x', '-500px');
      card.style.setProperty('--mouse-y', '-500px');
    });
  });

  // ===================================================================
  // 5. 3D SKILL CONSTELLATION ORBIT & TELEMETRY
  // ===================================================================
  const constellationStage = document.getElementById('constellationStage');
  const constellationCards = document.querySelectorAll('.constellation-card');
  const telemetryTitle = document.getElementById('telemetryTitle');
  const telemetryCategory = document.getElementById('telemetryCategory');
  const telemetryBody = document.getElementById('telemetryBody');

  let orbitAngle = 0;
  let isOrbitPaused = false;
  const numCards = constellationCards.length;

  function layoutConstellation() {
    const stageWidth = constellationStage.clientWidth || 900;
    const stageHeight = constellationStage.clientHeight || 480;
    const isMobile = stageWidth < 680;
    
    // Adaptive radius clamped strictly within the container
    const cardHalfWidth = isMobile ? 46 : 65;
    const maxSafeRadiusX = (stageWidth / 2) - cardHalfWidth - 12;
    const radiusX = isMobile ? Math.max(75, maxSafeRadiusX) : Math.min(stageWidth * 0.38, 380);
    const radiusY = isMobile ? Math.min(95, stageHeight * 0.26) : 160;

    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;

    const angleStep = (Math.PI * 2) / numCards;

    constellationCards.forEach((card, index) => {
      const angle = orbitAngle + index * angleStep;
      const x = Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;

      // 3D Depth layering & adaptive mobile scale
      const depthZ = Math.sin(angle) * (isMobile ? 25 : 40);
      const baseScale = isMobile ? 0.72 : 0.85;
      const scaleRange = isMobile ? 0.22 : 0.25;
      const scale = baseScale + ((depthZ + (isMobile ? 25 : 40)) / (isMobile ? 50 : 80)) * scaleRange;
      const zIndex = Math.round(depthZ + 50);

      // Store transform coordinates on element
      card.style.setProperty('--tx', `${x}px`);
      card.style.setProperty('--ty', `${y}px`);

      if (!card.matches(':hover')) {
        card.style.transform = `translate3d(calc(${centerX}px + ${x}px - 50%), calc(${centerY}px + ${y}px - 50%), ${depthZ}px) scale(${scale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = Math.max(0.65, (scale - 0.15)).toFixed(2);
      }
    });

    if (!isOrbitPaused) {
      orbitAngle += isMobile ? 0.0022 : 0.003;
    }

    requestAnimationFrame(layoutConstellation);
  }

  // Constellation Card Interactions
  constellationCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      isOrbitPaused = true;
      playFuturisticSound('hover');

      const skill = card.getAttribute('data-skill');
      const category = card.getAttribute('data-category');
      const info = card.getAttribute('data-info');

      if (telemetryTitle && telemetryCategory && telemetryBody) {
        telemetryTitle.textContent = skill;
        telemetryCategory.textContent = category.toUpperCase();
        telemetryBody.textContent = info;
      }
    });

    card.addEventListener('mouseleave', () => {
      isOrbitPaused = false;
    });

    card.addEventListener('click', () => {
      playFuturisticSound('click');
      showToast(`Selected Node: ${card.getAttribute('data-skill')}`);
    });
  });

  if (constellationStage) {
    layoutConstellation();
  }

  // ===================================================================
  // 6. ACADEMIC CGPA CIRCULAR GAUGE & COUNTER
  // ===================================================================
  const cgpaCircle = document.getElementById('cgpaProgressCircle');
  const cgpaScore = document.getElementById('cgpaScore');
  let cgpaAnimated = false;

  function animateCGPA() {
    if (cgpaAnimated || !cgpaCircle) return;
    cgpaAnimated = true;

    // Circumference for r=88 is 2 * Math.PI * 88 = ~552.92
    const totalCircumference = 553;
    const targetOffset = totalCircumference - (totalCircumference * (7.4 / 10));
    cgpaCircle.style.strokeDashoffset = targetOffset;

    // Animate Number Counter
    let current = 0;
    const target = 7.4;
    const stepTime = 25;
    const steps = 60;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (cgpaScore) {
        cgpaScore.textContent = current.toFixed(1);
      }
    }, stepTime);
  }

  // Observer to trigger CGPA gauge on viewport entry
  const aboutSection = document.getElementById('about');
  if (aboutSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCGPA();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(aboutSection);
  }

  // ===================================================================
  // 7. EXPERIENCE TIMELINE SPINE ANIMATION
  // ===================================================================
  const timelineSpineGlow = document.getElementById('timelineSpineGlow');
  const experienceSection = document.getElementById('experience');

  window.addEventListener('scroll', () => {
    if (!experienceSection || !timelineSpineGlow) return;
    const rect = experienceSection.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.top <= windowH * 0.7 && rect.bottom >= 0) {
      const progress = Math.min(1, Math.max(0, (windowH * 0.7 - rect.top) / rect.height));
      timelineSpineGlow.style.height = `${progress * 100}%`;
    }
  });

  // Timeline Items click feedback
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach(item => {
    item.addEventListener('click', () => {
      timelineItems.forEach(i => i.classList.remove('timeline-active'));
      item.classList.add('timeline-active');
      playFuturisticSound('click');
    });
  });

  // ===================================================================
  // 8. PROJECTS INTERACTIVE MINI SANDBOXES
  // ===================================================================

  // 1. Zoro Mini Game Sandbox in Project 02
  const zoroTarget = document.getElementById('zoroTarget');
  const zoroScoreDemo = document.getElementById('zoroScoreDemo');
  let zoroScore = 0;

  if (zoroTarget && zoroScoreDemo) {
    zoroTarget.addEventListener('click', e => {
      e.stopPropagation();
      playFuturisticSound('slash');
      zoroScore += 1;
      zoroScoreDemo.textContent = zoroScore < 10 ? `0${zoroScore}` : zoroScore;

      // Jump to randomized position within sandbox viewport
      const parent = zoroTarget.parentElement;
      const maxX = parent.clientWidth - 70;
      const maxY = parent.clientHeight - 80;

      const randomX = Math.floor(Math.random() * maxX);
      const randomY = Math.floor(Math.random() * maxY) + 20;

      zoroTarget.style.top = `${randomY}px`;
      zoroTarget.style.left = `${randomX}px`;
      zoroTarget.style.transform = 'scale(1.2) rotate(15deg)';
      setTimeout(() => {
        zoroTarget.style.transform = 'scale(1) rotate(0deg)';
      }, 150);

      showToast(`🎯 Zoro Caught! Score: ${zoroScore}`);
    });
  }

  // 2. LinkSaver Pro Interactive Mockup in Project 04
  const extAddBtn = document.querySelector('.ext-add-btn');
  const extLinksList = document.querySelector('.ext-links-list');

  if (extAddBtn && extLinksList) {
    extAddBtn.addEventListener('click', e => {
      e.stopPropagation();
      playFuturisticSound('success');

      const newLink = document.createElement('div');
      newLink.className = 'ext-link-item';
      newLink.style.animation = 'slideToastIn 0.3s ease forwards';
      newLink.innerHTML = `
        <div class="ext-link-icon"><i class="fa-solid fa-code-fork"></i></div>
        <div class="ext-link-text">
          <span class="ext-link-title">Machine Learning Portfolio Demo</span>
          <span class="ext-link-date">Just Now • Portfolio</span>
        </div>
        <i class="fa-solid fa-check ext-mini-link" style="color: #10b981;"></i>
      `;
      extLinksList.prepend(newLink);
      showToast('Link Saved to Chrome Storage!');
    });
  }

  // ===================================================================
  // 9. FULL-SCREEN PROJECT MODAL SYSTEM
  // ===================================================================
  const projectDatabase = {
    p1: {
      number: '01',
      category: 'Frontend Development',
      title: 'ANIME WEBSITE',
      description: 'An interactive frontend website for presenting anime content through a modern web interface. Built with an emphasis on fluid responsive layouts, cinematic dark glassmorphism, dynamic previews, and seamless content discovery.',
      techStack: ['HTML5 Semantic Markup', 'CSS3 Glassmorphism', 'Modern JavaScript (ES6+)', 'Responsive Grid & Flexbox', 'CSS Animations & Transitions'],
      features: [
        'Dynamic hero banner showcase featuring trending anime series with ratings and synopsis',
        'Fluid episode carousel cards with glass hover elevation and glowing borders',
        'Intuitive categorization and modern streaming platform user interface',
        'Optimized performance with responsive typography and zero layout shift'
      ],
      githubAvailable: false,
      demoAvailable: false
    },
    p2: {
      number: '02',
      category: 'Frontend / Browser Game',
      title: 'CATCH THE ZORO',
      description: 'An interactive browser-based game created using modern frontend technologies. Features event-driven gameplay mechanics, dynamic dodge animations, responsive collision detection, and score progression systems.',
      techStack: ['JavaScript Game Logic', 'HTML5 Canvas & DOM API', 'CSS Keyframes & 3D Transforms', 'Web Audio Feedback'],
      features: [
        'Event-driven target evasion algorithm simulating nimble movement and dodging',
        'Real-time score tracking HUD and player health indicator',
        'Responsive touch and mouse click physics for seamless cross-device play',
        'Subtle audio-visual feedback loops celebrating player milestones'
      ],
      githubAvailable: false,
      demoAvailable: false
    },
    p3: {
      number: '03',
      category: 'Python / Computer Vision',
      title: 'FACE RECOGNITION ATTENDANCE SYSTEM',
      description: 'A Python-based attendance system using face recognition concepts to automate attendance recording. Eliminates manual attendance logging through facial feature extraction, matching against database embeddings, and automated real-time timestamping.',
      techStack: ['Python 3.x', 'OpenCV Library', 'Face Recognition Algorithms (dlib / Haar)', 'Data Management & Logging', 'Computer Vision Pipeline'],
      features: [
        'Real-time webcam video stream processing at 60 FPS with facial bounding-box landmarks',
        'Feature extraction and Euclidean distance vector matching for high identification accuracy',
        'Automated database entry recording timestamp, identity, and confidence score',
        'High-speed automated detection preventing duplicate entry logs within the same session'
      ],
      githubAvailable: false,
      demoAvailable: false
    },
    p4: {
      number: '04',
      category: 'Chrome Extension / Frontend',
      title: 'LINK SAVER',
      description: 'A Chrome extension for saving and managing useful web links directly from the browser. Engineered with Manifest V3 standards to provide lightweight, instant access to saved developer resources and research bookmarks.',
      techStack: ['Chrome Manifest V3', 'Chrome Storage API', 'JavaScript ES6+', 'HTML5 Popup UI', 'CSS Glassmorphism'],
      features: [
        'One-click capture of current active browser tab URL, title, and timestamp',
        'Categorized storage utilizing Chrome Local Storage for persistent offline retrieval',
        'Lightweight popup interface with search, copy-to-clipboard, and link management',
        'Zero external permissions required, maintaining complete user privacy and performance'
      ],
      githubAvailable: false,
      demoAvailable: false
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');

  window.openProjectModal = function (projectId) {
    const project = projectDatabase[projectId];
    if (!project || !modalContent) return;

    playFuturisticSound('click');

    const techPills = project.techStack.map(t => `<span class="tech-pill">${t}</span>`).join('');
    const featureItems = project.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('');

    modalContent.innerHTML = `
      <div class="modal-project-badge"><i class="fa-solid fa-cube"></i> PROJECT ${project.number} • ${project.category}</div>
      <h2 class="modal-project-title">${project.title}</h2>
      <p class="modal-project-desc">${project.description}</p>

      <h4 class="modal-section-title"><i class="fa-solid fa-microchip"></i> Architectural Features</h4>
      <ul class="modal-features-list">
        ${featureItems}
      </ul>

      <h4 class="modal-section-title"><i class="fa-solid fa-code"></i> Technologies Employed</h4>
      <div class="modal-tech-stack-row">
        ${techPills}
      </div>

      <div class="modal-actions-row">
        <button class="btn-glass secondary-glass-btn btn-coming-soon" onclick="showToast('GitHub repository: Link coming soon')">
          <i class="fa-brands fa-github"></i>
          <span>GitHub</span>
          <span class="badge-coming-soon">Link coming soon</span>
        </button>

        <button class="btn-glass primary-glass-btn btn-coming-soon" onclick="showToast('Live deployment: Link coming soon')">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>Live Demo</span>
          <span class="badge-coming-soon">Link coming soon</span>
        </button>
      </div>
    `;

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function () {
    if (projectModal) {
      projectModal.classList.remove('open');
      projectModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      playFuturisticSound('click');
    }
  };

  // Close on backdrop click or ESC
  if (projectModal) {
    projectModal.addEventListener('click', e => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // ===================================================================
  // 10. RESUME MODAL & PRINT/DOWNLOAD
  // ===================================================================
  const resumeModal = document.getElementById('resumeModal');
  const viewResumeModalBtn = document.getElementById('viewResumeModalBtn');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');

  window.openResumeModal = function () {
    if (resumeModal) {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      playFuturisticSound('click');
    }
  };

  window.closeResumeModal = function () {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      playFuturisticSound('click');
    }
  };

  if (viewResumeModalBtn) {
    viewResumeModalBtn.addEventListener('click', openResumeModal);
  }
  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', e => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', e => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });

  window.triggerResumeDownload = function () {
    playFuturisticSound('success');
    showToast('Opening print dialog for official resume...');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', triggerResumeDownload);
  }

  // ===================================================================
  // 11. ACHIEVEMENTS NUMBER COUNTER ANIMATION
  // ===================================================================
  const achievementCounters = document.querySelectorAll('.metric-counter');
  let achievementsCounted = false;

  function runAchievementCounters() {
    if (achievementsCounted) return;
    achievementsCounted = true;

    achievementCounters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 1200;
      const step = Math.ceil(duration / target);

      const timer = setInterval(() => {
        count++;
        counter.innerHTML = `${count}<span>+</span>`;
        if (count >= target) {
          clearInterval(timer);
        }
      }, step);
    });
  }

  const achievementsSection = document.getElementById('achievements');
  if (achievementsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runAchievementCounters();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(achievementsSection);
  }

  // ===================================================================
  // 12. CONTACT TRANSMISSION & VALIDATION
  // ===================================================================
  window.handleFormSubmit = function (e) {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const messageInput = document.getElementById('senderMessage');

    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const messageErr = document.getElementById('messageError');

    nameErr.textContent = '';
    emailErr.textContent = '';
    messageErr.textContent = '';

    let isValid = true;

    if (!nameInput.value.trim()) {
      nameErr.textContent = 'Please enter your name.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailErr.textContent = 'Please provide a valid email address.';
      isValid = false;
    }

    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      messageErr.textContent = 'Message should contain at least 10 characters.';
      isValid = false;
    }

    if (!isValid) {
      playFuturisticSound('slash');
      return;
    }

    const sendBtn = document.getElementById('sendBtn');
    const successBanner = document.getElementById('formSuccess');

    sendBtn.disabled = true;
    sendBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>TRANSMITTING...</span>
    `;

    setTimeout(() => {
      playFuturisticSound('success');
      sendBtn.style.display = 'none';
      if (successBanner) {
        successBanner.style.display = 'flex';
      }
      showToast('Transmission Successful! Thank you.');
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
    }, 1200);
  };

  // Copy contact info to clipboard
  window.copyContactInfo = function (type) {
    if (type === 'email') {
      const email = document.getElementById('emailVal').textContent;
      navigator.clipboard.writeText(email).then(() => {
        playFuturisticSound('success');
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    }
  };

  // Social link click handler (ensures no invented URLs)
  window.handleSocialClick = function (platform) {
    playFuturisticSound('click');
    showToast(`${platform} profile: Link coming soon`);
  };

  // ===================================================================
  // 13. TOAST NOTIFICATION SYSTEM
  // ===================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'glass-toast';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-info"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3200);
  }

  // Welcome Toast
  setTimeout(() => {
    showToast('Welcome to the 3D Glass Laboratory Portfolio');
  }, 1000);

})();
