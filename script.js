/**
 * HITHA TREESA THOMAS — PERSONAL DEVOPS PORTFOLIO
 * Vanilla JavaScript: Navigation, Theme Toggle, Character Interactivity,
 * Skills Filter, Interactive DevOps Terminal, Architecture Modals & Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initCharacterInteractions();
  initSkillsFilter();
  initTerminal();
  initArchitectureModals();
  initResumeModal();
  initContactForm();
  initBackToTop();
  initAmbientSparkles();
});

/* ===================================================================
   1. THEME TOGGLE (LIGHT / DARK)
   =================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Default to the intended light lavender brand palette unless the user saved a preference.
  const savedTheme = localStorage.getItem('hitha-portfolio-theme');
  const initialTheme = savedTheme || 'light';

  setTheme(initialTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    showToast(`Switched to ${newTheme} mode ✧`, 'theme');
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hitha-portfolio-theme', theme);
  }
}

/* ===================================================================
   2. NAVIGATION, STICKY HEADER & MOBILE DRAWER
   =================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  function openDrawer() {
    mobileDrawer?.classList.add('active');
    drawerBackdrop?.classList.add('active');
    menuToggle?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    drawerBackdrop?.classList.remove('active');
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  // Active section highlighting with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        drawerLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ===================================================================
   3. SIGNATURE CARTOON CHARACTER INTERACTIONS
   =================================================================== */
function initCharacterInteractions() {
  const charCard = document.getElementById('character-card');
  const charImg = document.getElementById('hero-character-img');
  const speechBubble = document.getElementById('character-speech-bubble');
  if (!charCard || !charImg) return;

  const messages = [
    "Building reliable pipelines & learning every day! ✨",
    "Currently practicing Docker multi-stage builds! 🐳",
    "Mastering the Linux terminal step by step! 🐧",
    "Automating builds with GitHub Actions! ⚙️",
    "Let's build reliable cloud systems together! ♡",
    "Always eager to learn and solve real problems! 🚀"
  ];
  let msgIndex = 0;

  // Click character to cycle encouraging speech bubbles
  charCard.addEventListener('click', () => {
    msgIndex = (msgIndex + 1) % messages.length;
    if (speechBubble) {
      speechBubble.style.transform = 'scale(0.85)';
      speechBubble.style.opacity = '0';
      setTimeout(() => {
        speechBubble.querySelector('span').textContent = messages[msgIndex];
        speechBubble.style.transform = 'scale(1)';
        speechBubble.style.opacity = '1';
      }, 180);
    }
  });

  // Subtle 3D tilt reaction to cursor movement
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    charCard.addEventListener('mousemove', (e) => {
      const rect = charCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const tiltX = (y / rect.height) * -8;
      const tiltY = (x / rect.width) * 8;

      charImg.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    charCard.addEventListener('mouseleave', () => {
      charImg.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

/* ===================================================================
   4. SKILLS FILTER
   =================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update button active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter skill cards with smooth transition
      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category')?.split(' ') || [];
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   5. INTERACTIVE DEVOPS LAB TERMINAL
   =================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output-log');
  const terminalScreen = document.getElementById('terminal-screen');
  const chips = document.querySelectorAll('.term-chip');
  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: `Available commands:
  • devops-status : Check current DevOps upskilling status
  • docker ps     : List active mock container services
  • cat resume.txt: View structured background summary
  • uname -a      : Display simulated Linux kernel information
  • skills        : List technical toolset and focus areas
  • whoami        : Display active session user profile
  • git status    : Check simulated repository worktree state
  • clear         : Clear the terminal console`,

    'devops-status': `[DEVOPS LAB STATUS REPORT]
● Target: Aspiring DevOps Engineer
● Active Focus: Linux Administration, Docker, GitHub Actions, AWS Fundamentals
● Philosophy: Automate repetitive tasks, isolate environments, ensure reliability
● Readiness: Actively seeking entry-level DevOps & Cloud Support roles ♡`,

    'docker ps': `CONTAINER ID   IMAGE                 COMMAND                  STATUS          PORTS
7f3a9e102b4c   nginx:alpine          "/docker-entrypoint…"    Up 4 hours      0.0.0.0:80->80/tcp
5c2b8a910d3e   node-backend:latest   "node server.js"         Up 4 hours      3000/tcp
1e4f7a228c9b   redis:7-alpine        "docker-entrypoint…"     Up 4 hours      6379/tcp
Status: 3 containers healthy in custom bridge network.`,

    'cat resume.txt': `=== HITHA TREESA THOMAS ===
Role: Aspiring DevOps Engineer
Education: BCA, Bengaluru North University
Experience: ~5 Months as Junior Web Developer
Core Interests: Containerization (Docker), CI/CD (GitHub Actions), Linux (Ubuntu), AWS
Location: Bangalore, Karnataka, India`,

    'uname -a': `Linux devops-lab 6.5.0-35-generic #36-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`,

    skills: `Current Skill Breakdown:
  [Actively Learning]  Docker, Linux CLI, GitHub Actions, Bash Automation, AWS Basics
  [Working Knowledge]  Git & GitHub, Networking (DNS, TCP/IP, SSH), Web Development Background`,

    whoami: `hitha (Aspiring DevOps Engineer — Bengaluru North University BCA Graduate)`,

    'git status': `On branch main
Your branch is up to date with 'origin/main'.
nothing to commit, working tree clean (All CI/CD checks passing! ✨)`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append Command Echo
    const echoLine = document.createElement('div');
    echoLine.className = 'terminal-line term-cmd-echo';
    echoLine.textContent = `hitha@devops-lab:~$ ${rawCmd}`;
    terminalOutput.appendChild(echoLine);

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      terminalInput.value = '';
      return;
    }

    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';

    if (commands[cmd]) {
      responseLine.className += ' term-res-info';
      responseLine.style.whiteSpace = 'pre-wrap';
      responseLine.textContent = commands[cmd];
    } else {
      responseLine.className += ' term-res-error';
      responseLine.textContent = `bash: command not found: ${rawCmd}. Type 'help' for available commands.`;
    }

    terminalOutput.appendChild(responseLine);
    terminalInput.value = '';

    // Scroll to bottom of terminal
    if (terminalScreen) {
      terminalScreen.scrollTop = terminalScreen.scrollHeight;
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
      }
    });
  });
}

/* ===================================================================
   6. ARCHITECTURE MODALS
   =================================================================== */
function initArchitectureModals() {
  const modal = document.getElementById('arch-modal');
  const modalTitle = document.getElementById('modal-arch-title');
  const modalBody = document.getElementById('modal-arch-body');
  const closeBtn = document.getElementById('modal-arch-close');
  const viewBtns = document.querySelectorAll('.view-arch-btn');
  if (!modal || !modalTitle || !modalBody) return;

  const archData = {
    'docker-app': {
      title: 'Automated Web Application Containerization Architecture',
      steps: [
        { icon: 'fa-file-code', title: 'Multi-Stage Dockerfile', desc: 'Separate build and production layers' },
        { icon: 'fa-network-wired', title: 'Isolated Bridge Network', desc: 'Secure inter-container communication' },
        { icon: 'fa-server', title: 'Nginx Reverse Proxy', desc: 'Port 80/443 forwarding to app container' },
        { icon: 'fa-heart-pulse', title: 'Container Health Checks', desc: 'Continuous service readiness probes' }
      ],
      details: `This project isolates application components into decoupled Docker containers. A multi-stage Dockerfile builds the application in a lightweight Node environment and copies only compiled assets to a minimal runtime, shrinking image size by over 50%. The Nginx container handles reverse proxying, and persistent storage is preserved via named volumes.`
    },
    'cicd-pipeline': {
      title: 'GitHub Actions Automated CI/CD Pipeline Flow',
      steps: [
        { icon: 'fa-code-commit', title: 'Developer Push / PR', desc: 'Trigger event on target branch' },
        { icon: 'fa-spell-check', title: 'Automated Lint & Test', desc: 'Fails fast if code checks fail' },
        { icon: 'fa-docker', title: 'Docker Image Build', desc: 'Layer cache optimization enabled' },
        { icon: 'fa-box-archive', title: 'Registry Artifact', desc: 'Pushes tagged image to GitHub Packages' }
      ],
      details: `The workflow runs seamlessly on GitHub Actions ubuntu-latest runners. On every pull request, automated testing and syntax linting execute in parallel. Once validated, secrets-managed tokens securely authenticate with the container registry to publish release images ready for staging.`
    },
    'linux-toolkit': {
      title: 'Linux Server Provisioning & Maintenance Toolkit',
      steps: [
        { icon: 'fa-terminal', title: 'Bootstrap Script', desc: 'Sudo user setup & package updates' },
        { icon: 'fa-shield-halved', title: 'SSH & UFW Hardening', desc: 'Disables root SSH, opens ports 22/80/443' },
        { icon: 'fa-clock', title: 'Cron Automation', desc: 'Daily compressed backup routines' },
        { icon: 'fa-chart-line', title: 'System Health Alerts', desc: 'Disk space and memory usage monitor' }
      ],
      details: `A modular collection of Bash scripts created to reduce manual server setup time from over 30 minutes to under 3 minutes. Includes automated log rotation, disk utilization thresholds with email warning stubs, and reproducible server environments.`
    },
    'aws-hosting': {
      title: 'AWS S3 & CloudFront Cloud Hosting Architecture',
      steps: [
        { icon: 'fa-globe', title: 'User Request', desc: 'HTTPS traffic via Route 53 DNS' },
        { icon: 'fa-bolt', title: 'AWS CloudFront CDN', desc: 'Global edge caching for fast delivery' },
        { icon: 'fa-lock', title: 'Origin Access Control', desc: 'Blocks direct public S3 bucket access' },
        { icon: 'fa-database', title: 'Amazon S3 Bucket', desc: 'Encrypted object storage for assets' }
      ],
      details: `Implements AWS cloud best practices for static asset hosting. CloudFront caches assets globally across edge locations, terminating SSL/TLS with an AWS Certificate Manager certificate. S3 bucket policies enforce Origin Access Control (OAC), ensuring the bucket is never publicly exposed.`
    }
  };

  function openArchModal(projectKey) {
    const data = archData[projectKey];
    if (!data) return;

    modalTitle.textContent = data.title;

    let stepsHtml = data.steps.map((s, idx) => `
      <div class="arch-step-box">
        <i class="fa-solid ${s.icon}"></i>
        <span>${s.title}</span>
        <small style="color: var(--text-secondary); font-size: 0.72rem; display: block; margin-top: 4px;">${s.desc}</small>
      </div>
      ${idx < data.steps.length - 1 ? '<i class="fa-solid fa-arrow-right arch-step-arrow"></i>' : ''}
    `).join('');

    modalBody.innerHTML = `
      <div class="arch-diagram-card">
        <div class="arch-flow-steps">
          ${stepsHtml}
        </div>
      </div>
      <div class="arch-details-content">
        <h4>Architecture Overview &amp; DevOps Competencies</h4>
        <p>${data.details}</p>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeArchModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      if (key) openArchModal(key);
    });
  });

  closeBtn?.addEventListener('click', closeArchModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeArchModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeArchModal();
    }
  });
}

/* ===================================================================
   7. RESUME MODAL & PRINT
   =================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume-btn');
  const closeBtn = document.getElementById('modal-resume-close');
  const printBtn = document.getElementById('print-resume-btn');
  if (!modal) return;

  function openResume() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn?.addEventListener('click', openResume);
  closeBtn?.addEventListener('click', closeResume);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeResume();
  });

  printBtn?.addEventListener('click', () => {
    window.print();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* ===================================================================
   8. CONTACT FORM VALIDATION & SUBMISSION
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showFieldError('name-error', nameInput);
      isValid = false;
    } else {
      clearFieldError('name-error', nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError('email-error', emailInput);
      isValid = false;
    } else {
      clearFieldError('email-error', emailInput);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showFieldError('message-error', messageInput);
      isValid = false;
    } else {
      clearFieldError('message-error', messageInput);
    }

    if (isValid) {
      showToast("Message sent successfully! Hitha will reply soon ♡", "success");
      form.reset();
    }
  });

  function showFieldError(errorId, inputElement) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.style.display = 'block';
    inputElement.closest('.form-group')?.classList.add('has-error');
  }

  function clearFieldError(errorId, inputElement) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.style.display = 'none';
    inputElement.closest('.form-group')?.classList.remove('has-error');
  }

  [nameInput, emailInput, messageInput].forEach(inp => {
    inp?.addEventListener('input', () => {
      inp.closest('.form-group')?.classList.remove('has-error');
      const err = inp.closest('.form-group')?.querySelector('.field-error');
      if (err) err.style.display = 'none';
    });
  });
}

/* ===================================================================
   9. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ===================================================================
   10. TOAST NOTIFICATION SYSTEM
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconHtml = type === 'success' 
    ? '<i class="fa-solid fa-heart toast-icon"></i>'
    : '<i class="fa-solid fa-sparkles toast-icon"></i>';

  toast.innerHTML = `${iconHtml}<span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Auto remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ===================================================================
   11. AMBIENT BACKGROUND SPARKLES (CANVAS)
   =================================================================== */
function initAmbientSparkles() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const particles = Array.from({ length: 22 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2.2 + 0.8,
    speedY: (Math.random() * 0.25 + 0.08) * -1,
    speedX: (Math.random() - 0.5) * 0.15,
    opacity: Math.random() * 0.5 + 0.2,
    phase: Math.random() * Math.PI * 2
  }));

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.phase += 0.02;

      if (p.y < 0) p.y = height;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.phase));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185, 168, 216, ${currentOpacity})`;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}
