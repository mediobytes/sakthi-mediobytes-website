/* ========================================
   MEDIOBYTES ENHANCED - PREMIUM INTERACTIONS
   ======================================== */

(function () {
  "use strict";

  // ──── SCROLL PROGRESS BAR ────
  function initScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.insertBefore(progressBar, document.body.firstChild);

    window.addEventListener(
      "scroll",
      () => {
        const windowHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + "%";
      },
      { passive: true },
    );
  }

  // ──── CUSTOM CURSOR ────
  function initCustomCursor() {
    if (window.matchMedia("(pointer:fine)").matches) {
      const cursorDot = document.createElement("div");
      const cursorRing = document.createElement("div");
      cursorDot.id = "cursor-dot";
      cursorRing.id = "cursor-ring";
      document.body.appendChild(cursorDot);
      document.body.appendChild(cursorRing);

      let mouseX = 0;
      let mouseY = 0;
      let dotX = 0;
      let dotY = 0;

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top = mouseY + "px";
      });

      const animateCursor = () => {
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;
        cursorRing.style.left = dotX + "px";
        cursorRing.style.top = dotY + "px";
        requestAnimationFrame(animateCursor);
      };
      animateCursor();

      // Add hover effect
      const interactiveElements = document.querySelectorAll(
        "a, button, [onclick], input, textarea, select, .service-card, .port-card, .career-card, .work-card",
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          document.body.classList.add("cursor-active");
        });
        el.addEventListener("mouseleave", () => {
          document.body.classList.remove("cursor-active");
        });
      });
    }
  }

  // ──── BACK TO TOP BUTTON ────
  function initBackToTop() {
    const backToTop = document.createElement("button");
    backToTop.id = "back-to-top";
    backToTop.innerHTML = "↑";
    backToTop.setAttribute("aria-label", "Back to top");
    document.body.appendChild(backToTop);

    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 300) {
          backToTop.classList.add("show");
        } else {
          backToTop.classList.remove("show");
        }
      },
      { passive: true },
    );

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ──── PARTICLE BACKGROUND ────
  function initParticles() {
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.3;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 50;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // ──── INTERSECTION OBSERVER FOR ANIMATIONS ────
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    document
      .querySelectorAll(".reveal, .reveal-sec, .section-reveal")
      .forEach((el) => {
        observer.observe(el);
      });

    // Also animate cards on scroll
    document
      .querySelectorAll(".service-card, .port-card, .work-card, .career-card")
      .forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.style.animation = "slide-up 0.6s ease-out forwards";
        observer.observe(el);
      });
  }

  // ──── ANIMATED COUNTERS ────
  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = true;

            const target = parseInt(entry.target.dataset.count, 10);
            const duration = 2000;
            const start = performance.now();

            const animate = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const current = Math.floor(progress * target);
              entry.target.textContent = current;

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  // ──── SMOOTH SCROLL LINKS ────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  // ──── ENHANCE BUTTONS ────
  function enhanceButtons() {
    const buttons = document.querySelectorAll(
      ".btn-red, .btn-border, .btn-purple, .btn-white",
    );
    buttons.forEach((btn) => {
      btn.classList.add("btn-enhanced");
    });
  }

  // ──── ENHANCE CARDS ────
  function enhanceCards() {
    const cards = document.querySelectorAll(
      ".service-card, .port-card, .work-card, .career-card",
    );
    cards.forEach((card) => {
      card.classList.add("card-hover-lift", "card-hover-glow");
    });
  }

  // ──── PAGE TRANSITION ────
  function initPageTransition() {
    const links = document.querySelectorAll("a[href]");
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("mailto") &&
        !href.startsWith("tel")
      ) {
        link.addEventListener("click", (e) => {
          // Only add transition effect on actual page navigation
          const page = document.createElement("div");
          page.style.cssText = `
            position: fixed;
            inset: 0;
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            z-index: 99999;
            animation: slideInUp 0.5s ease-in-out forwards;
          `;
          document.body.appendChild(page);
        });
      }
    });
  }

  // ──── LAZY LOAD IMAGES ────
  function initLazyLoad() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });

      document
        .querySelectorAll("img.lazy")
        .forEach((img) => imageObserver.observe(img));
    }
  }

  // ──── INIT ALL ON LOAD ────
  document.addEventListener("DOMContentLoaded", () => {
    initScrollProgress();
    initCustomCursor();
    initBackToTop();
    initParticles();
    initScrollAnimations();
    initCounters();
    initSmoothScroll();
    enhanceButtons();
    enhanceCards();
    initLazyLoad();
  });

  // ──── HANDLE NAVIGATION ────
  window.addEventListener(
    "scroll",
    () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    },
    { passive: true },
  );
})();
