class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { 
      alpha: true,
      desynchronized: true
    });
    this.particles = [];
    this.particleCount = this.getOptimalParticleCount();
    this.isVisible = !document.hidden;
    this.rafId = null;

    this.resize();
    this.init();
    this.animate();

    window.addEventListener("resize", this.debounce(() => this.resize(), 250));

    document.addEventListener("visibilitychange", () => {
      this.isVisible = !document.hidden;
      if (this.isVisible && !this.rafId) {
        this.animate();
      }
    });
  }

  getOptimalParticleCount() {
    const width = window.innerWidth;
    if (width < 768) return 30;
    if (width < 1024) return 45;
    return 60;
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(dpr, dpr);
    
    const newCount = this.getOptimalParticleCount();
    if (newCount !== this.particleCount) {
      this.particleCount = newCount;
      this.init();
    }
  }

  init() {
    this.particles = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }
  }

  draw() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    this.ctx.clearRect(0, 0, width, height);

    const color = "0, 255, 136";
    const particles = this.particles;
    const ctx = this.ctx;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, 0.5)`;
      ctx.fill();

      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 4
      );
      gradient.addColorStop(0, `rgba(${color}, 0.3)`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(
        particle.x - particle.size * 4,
        particle.y - particle.size * 4,
        particle.size * 8,
        particle.size * 8
      );
    }

    const connectionDistance = 120;
    for (let i = 0; i < particles.length; i++) {
      let connections = 0;
      const maxConnections = 3;
      
      for (let j = i + 1; j < particles.length && connections < maxConnections; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${color}, ${0.2 * (1 - distance / connectionDistance)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          connections++;
        }
      }
    }
  }

  update() {
    const particles = this.particles;
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vx *= 0.98;
      particle.vy *= 0.98;

      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      if (Math.abs(particle.vx) < 0.1)
        particle.vx = (Math.random() - 0.5) * 0.3;
      if (Math.abs(particle.vy) < 0.1)
        particle.vy = (Math.random() - 0.5) * 0.3;
    }
  }

  animate() {
    if (!this.isVisible) {
      this.rafId = null;
      return;
    }

    this.draw();
    this.update();
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

function initCardHoverEffect() {
  const cards = document.querySelectorAll(".skill-category, .project-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll("section");
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(el);
  });
}

function initEventListeners() {
  const langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", () => {
      window.i18n.toggle();
    }, { passive: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particleCanvas");
  if (canvas && !window.particleSystem) {
    window.particleSystem = new ParticleSystem(canvas);
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      initCardHoverEffect();
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      initCardHoverEffect();
    }, 1000);
  }

  if (window.i18n) {
    window.i18n.init();
  }

  if (window.renderProjects) {
    window.renderProjects();
  }

  if (window.renderAlbums) {
    window.renderAlbums();
  }

  initEventListeners();
  initSmoothScroll();
  initScrollAnimations();

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "l") {
      e.preventDefault();
      if (window.i18n) {
        window.i18n.toggle();
      }
    }
  }, { passive: false });

  console.log(
    "%c✨ Welcome to himicos' portfolio",
    "font-size: 18px; font-weight: bold; color: #00ff88; text-shadow: 0 0 10px #00ff88;",
  );
  console.log("%c  Ctrl/Cmd + L: Toggle language", "font-size: 12px;");
});
