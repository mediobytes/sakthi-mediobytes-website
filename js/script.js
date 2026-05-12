/* ===================================================
   MedioBytes SCRIPT.JS — CMS Renderer + All Site Logic
   =================================================== */

/* ─── HELPERS ─── */
const $ = (id) => document.getElementById(id);
const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => [...document.querySelectorAll(sel)];

/* ─── DETECT ROOT PATH ─── */
function rootPath() {
  // If we're in /pages/, prefix links with ../
  return window.location.pathname.includes("/pages/") ? "../" : "";
}
function resolvePath(href) {
  if (!href || href.startsWith("http") || href.startsWith("#")) return href;
  const root = rootPath();
  return href.startsWith("/") ? root + href.slice(1) : href;
}

/* ===================================================
   CMS DATA LOADER
   =================================================== */
async function loadCMSData() {
  if (window.CMS) return; // Already loaded via script tag (fallback)
  const root = rootPath();
  try {
    const res = await fetch(`${root}js/cms-data.json`);
    window.CMS = await res.json();
    // Dynamic defaults
    if (window.CMS.site && !window.CMS.site.year) {
      window.CMS.site.year = new Date().getFullYear();
    }
  } catch (e) {
    console.error("CMS JSON load failed, falling back to JS if available.", e);
  }
}

/* ===================================================
   CMS RENDERER — builds nav, footer on every page
   =================================================== */
function renderCMS() {
  const C = window.CMS;
  if (!C) return;

  renderHeader(C);
  renderFooter(C);
}

function renderHeader(C) {
  const root = rootPath();
  // Build nav links
  const navLinks = C.nav
    .map((item) => {
      if (item.children) {
        const drops = item.children
          .map(
            (c) =>
              `<a href="${root}${c.href.replace(/^\//, "")}">${c.label}</a>`,
          )
          .join("");
        return `<li class="has-dropdown">
        <a href="${root}${item.href.replace(/^\//, "")}" class="nav-link">${item.label} <span class="drop-arrow">▾</span></a>
        <div class="dropdown">${drops}</div>
      </li>`;
      }
      return `<li><a href="${root}${item.href.replace(/^\//, "")}" class="nav-link">${item.label}</a></li>`;
    })
    .join("");

  // Build mobile nav
  const mobileLinks = C.nav
    .map((item) => {
      let html = `<a href="${root}${item.href.replace(/^\//, "")}">${item.label}</a>`;
      if (item.children) {
        html += item.children
          .map(
            (c) =>
              `<a href="${root}${c.href.replace(/^\//, "")}" class="sub-link">↳ ${c.label}</a>`,
          )
          .join("");
      }
      return html;
    })
    .join("");

  const header = document.querySelector(".header");
  const mobileNav = document.querySelector(".mobile-nav");

  if (header) {
    const logoEl = header.querySelector(".logo");
    if (logoEl)
      logoEl.innerHTML = `
  <a href="${root}index.html">
    <img src="${root}images/logo.png" alt="Logo" class="logo-img">
  </a>
`;
    const menuEl = header.querySelector(".menu ul");
    if (menuEl) menuEl.innerHTML = navLinks;
  }
  if (mobileNav) {
    // Keep the close button
    const closeBtn = mobileNav.querySelector(".mobile-close");
    mobileNav.innerHTML =
      (closeBtn
        ? closeBtn.outerHTML
        : '<button class="mobile-close" id="mobileClose">✕</button>') +
      mobileLinks;
  }

  // Mark active link
  const currentPath = window.location.pathname;
  qsa(".nav-link, .mobile-nav a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const linkPath = href.replace(/^(\.\.\/)+/, "/");
    if (
      currentPath.endsWith(linkPath) ||
      (currentPath.endsWith("/") && href.endsWith("index.html"))
    ) {
      a.classList.add("active");
    }
  });
}

function renderFooter(C) {
  const root = rootPath();
  const footer = document.querySelector(".footer");
  if (!footer) return;

  const navLinks = C.nav
    .filter((n) => !n.children)
    .map((n) => `<a href="${root}${n.href.replace(/^\//, "")}">${n.label}</a>`)
    .join("");
  const serviceLinks =
    C.nav
      .find((n) => n.children)
      ?.children.map(
        (c) => `<a href="${root}${c.href.replace(/^\//, "")}">${c.label}</a>`,
      )
      .join("") || "";

  footer.innerHTML = `
  <div class="footer-top">
    <div class="foot-brand">
      <span class="logo-text" style="font-size:24px;">${C.site.logo}</span>
      <p>${C.home.footer.about}</p>
      <div class="socials">
        <a href="${C.social.linkedin}" class="soc">in</a>
        <a href="${C.social.facebook}" class="soc">fb</a>
        <a href="${C.social.twitter}"  class="soc">tw</a>
        <a href="${C.social.instagram}"class="soc">ig</a>
      </div>
    </div>
    <div class="foot-col">
      <h5>Quick Links</h5>
      ${navLinks}
    </div>
    <div class="foot-col">
      <h5>Services</h5>
      ${serviceLinks}
    </div>
    <div class="foot-col">
      <h5>Contact</h5>
      <p>📧 ${C.contact.email}</p>
      <p>📞 ${C.contact.phone}</p>
      <p>📍 ${C.contact.address}</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© ${C.site.year} ${C.site.name}. All Rights Reserved.</p>
    <p>Designed with ❤️ in ${C.site.city}</p>
  </div>`;
}

/* ===================================================
   HOME PAGE — render dynamic sections from CMS data
   =================================================== */
function renderHomeSections() {
  const C = window.CMS;
  if (!C || !document.querySelector(".hero")) return;

  const root = rootPath();
  const H = C.home;

  // HERO
  const heroTag = qs(".hero-tag");
  if (heroTag)
    heroTag.childNodes[1] && (heroTag.childNodes[1].textContent = H.hero.tag);
  const smallText = qs(".small-text");
  if (smallText) smallText.textContent = H.hero.welcomeText;
  const bigText = qs(".big-text");
  if (bigText) bigText.textContent = H.hero.headline;
  const heroP = qs(".hero-content > p");
  if (heroP) heroP.textContent = H.hero.description;
  const [btnRed, btnBorder] = qsa(".hero-btns a");
  if (btnRed) {
    btnRed.textContent = H.hero.primaryBtn.label;
    btnRed.href = resolvePath(H.hero.primaryBtn.href);
  }
  if (btnBorder) {
    btnBorder.textContent = H.hero.secondaryBtn.label;
    btnBorder.href = resolvePath(H.hero.secondaryBtn.href);
  }

  // BG images
  homeImages = H.hero.bgImages.map((img) => resolvePath(img));

  // SERVICE CARDS — render from CMS
  const srvRight = $("srvRight");
  if (srvRight) {
    srvRight.innerHTML = H.servicesSection.cards
      .map(
        (card, i) => `
      <div class="service-card ${i === 0 ? "active" : ""}" id="card-${i}">
        <div class="card-num">${card.num}</div>
        <div class="card-thumb" style="background:${card.gradient};display:flex;align-items:center;justify-content:center;font-size:72px;">${card.emoji}</div>
        <div class="card-body">
          <h4>${card.title}</h4>
          <p>${card.description}</p>
        </div>
      </div>`,
      )
      .join("");

    const dotsContainer = qs(".srv-dots");
    if (dotsContainer) {
      dotsContainer.innerHTML = H.servicesSection.cards
        .map(
          (_, i) =>
            `<span class="dot ${i === 0 ? "active" : ""}" onclick="goToCard(${i})"></span>`,
        )
        .join("");
    }
  }

  // WHY US features
  const whyusRight = qs(".whyus-right");
  if (whyusRight) {
    whyusRight.innerHTML = H.whyUs.features
      .map(
        (f, i) => `
      <div class="feature-row reveal" data-delay="${i * 120}">
        <div class="feat-dot"></div>
        <div><h4>${f.title}</h4><p>${f.text}</p></div>
      </div>`,
      )
      .join("");
  }

  // PORTFOLIO PREVIEW — render from CMS
  const portSection = qs(".port-preview");
  if (portSection && H.portfolio) {
    const P = H.portfolio;
    const portTag = portSection.querySelector(".sec-tag");
    if (portTag) portTag.textContent = P.tag;
    const portH2 = portSection.querySelector(".sec-h2");
    if (portH2) portH2.innerHTML = P.headline;
    const portSub = portSection.querySelector(".sec-sub");
    if (portSub) portSub.textContent = P.description;
    const portGrid = portSection.querySelector(".port-grid");
    if (portGrid) {
      portGrid.innerHTML = P.previews
        .map(
          (p, i) => `
        <div class="port-card reveal" data-delay="${i * 120}">
          <div class="port-thumb" style="background:${p.gradient};font-size:${p.emoji ? '64px' : '54px'};display:flex;align-items:center;justify-content:center;">
            ${p.emoji || '✦'}
            <div class="port-cover">
              <span>${p.label}</span>
              <p>${p.sub}</p>
            </div>
          </div>
        </div>`,
        )
        .join("");
    }
    const portBtn = portSection.querySelector(".btn-border");
    if (portBtn) {
      portBtn.textContent = P.viewAllBtn.label;
      portBtn.href = resolvePath(P.viewAllBtn.href);
    }
  }

  // IMPACT / WORK DONE — render from CMS
  const impactSection = qs(".impact-section");
  if (impactSection && H.impactSection) {
    const I = H.impactSection;
    const impactTag = impactSection.querySelector(".sec-tag");
    if (impactTag) impactTag.textContent = I.tag;
    const impactH2 = impactSection.querySelector(".sec-h2");
    if (impactH2) impactH2.innerHTML = I.headline;
    const impactSub = impactSection.querySelector(".sec-sub");
    if (impactSub) impactSub.textContent = I.description;

    // Stats
    const statsContainer = impactSection.querySelector(".impact-stats");
    if (statsContainer) {
      statsContainer.innerHTML = I.stats
        .map(
          (s, i) => `
        <div class="istat reveal" data-delay="${i * 100}">
          <div class="istat-num" data-target="${s.target}">0</div>
          <div class="istat-plus">${s.suffix}</div>
          <div class="istat-label">${s.label}</div>
        </div>`,
        )
        .join("");
    }

    // Tabs
    const tabsContainer = impactSection.querySelector(".work-tabs");
    if (tabsContainer) {
      tabsContainer.innerHTML = I.tabs
        .map(
          (t, i) =>
            `<button class="wtab ${i === 0 ? "active" : ""}" data-cat="${t.cat}">${t.label}</button>`,
        )
        .join("");
    }

    // Work Cards
    const workGrid = impactSection.querySelector(".work-grid");
    if (workGrid) {
      workGrid.innerHTML = I.workCards
        .map(
          (w, i) => `
        <div class="work-card reveal" data-delay="${(i % 3) * 100}" data-cat="${w.cat}">
          <div class="work-thumb" style="background:${w.gradient};">
            <span class="work-emoji">${w.emoji}</span>
            <div class="work-overlay">
              <span class="work-tag">${w.tag}</span>
            </div>
          </div>
          <div class="work-info">
            <h4>${w.title}</h4>
            <p>${w.description}</p>
            <div class="work-meta">
              <span>📅 ${w.year}</span><span class="work-done-badge">${w.status}</span>
            </div>
          </div>
        </div>`,
        )
        .join("");
    }
  }

  // CAREERS
  const careerGrid = qs(".career-grid");
  if (careerGrid && H.careers.jobs) {
    careerGrid.innerHTML = H.careers.jobs
      .map(
        (job, i) => `
      <div class="career-card reveal" data-delay="${i * 120}">
        <div class="career-icon">${job.icon}</div>
        <div class="career-role">${job.role}</div>
        <div class="career-dept">${job.dept}</div>
        <div class="career-status ${job.status === "open" ? "" : "closed"}">${job.status === "open" ? "✅ Vacancy Open" : "❌ Position Closed"}</div>
        <ul class="career-details">${job.details.map((d) => `<li>${d}</li>`).join("")}</ul>
        <a href="${resolvePath(job.applyHref)}" class="btn-purple">Apply Now →</a>
      </div>`,
      )
      .join("");
  }

  // CTA
  const ctaH2 = qs(".cta-inner h2");
  const ctaP = qs(".cta-inner p");
  const ctaBtn = qs(".cta-inner .btn-white");
  if (ctaH2) ctaH2.innerHTML = H.cta.headline;
  if (ctaP) ctaP.textContent = H.cta.description;
  if (ctaBtn) {
    ctaBtn.textContent = H.cta.btn.label;
    ctaBtn.href = resolvePath(H.cta.btn.href);
  }
}

/* ===================================================
   BG SWITCHER
   =================================================== */
let current = 1;
let homeImages = [];
let homeIndex = 0;
let bgIntervalId = null;

function changeBg(image) {
  const bg1 = $("bg1"),
    bg2 = $("bg2");
  if (!bg1 || !bg2) return;

  const img = `url('${image}')`;

  if (current === 1) {
    bg2.style.backgroundImage = img;
    bg2.style.opacity = "1";
    bg1.style.opacity = "0";
    current = 2;
  } else {
    bg1.style.backgroundImage = img;
    bg1.style.opacity = "1";
    bg2.style.opacity = "0";
    current = 1;
  }

  // FIX: prevent background flicker / multiple stacking
  bg1.style.backgroundSize = "cover";
  bg2.style.backgroundSize = "cover";
  bg1.style.backgroundPosition = "center";
  bg2.style.backgroundPosition = "center";
  bg1.style.backgroundRepeat = "no-repeat";
  bg2.style.backgroundRepeat = "no-repeat";
}
function autoHomeChange() {
  if (!homeImages.length) return;
  homeIndex = (homeIndex + 1) % homeImages.length;
  changeBg(homeImages[homeIndex]);
}

/* ===================================================
   SERVICE CARDS
   =================================================== */
let currentService = 0;
function initServiceCards() {
  const cards = qsa(".service-card");
  const srvRight = $("srvRight");
  if (!srvRight || !cards.length) return;
  setInterval(() => goToCard((currentService + 1) % cards.length), 4000);
  srvRight.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      if (currentService < cards.length - 1) goToCard(currentService + 1);
    } else {
      if (currentService > 0) goToCard(currentService - 1);
    }
  });
}
function goToCard(idx) {
  const cards = qsa(".service-card");
  const dots = qsa(".dot");
  if (!cards.length) return;
  cards[currentService].classList.remove("active");
  if (dots[currentService]) dots[currentService].classList.remove("active");
  currentService = idx;
  cards[currentService].classList.add("active");
  if (dots[currentService]) dots[currentService].classList.add("active");
}

/* ===================================================
   HEADER SCROLL
   =================================================== */
window.addEventListener("scroll", () => {
  const hdr = $("header");
  if (hdr) hdr.classList.toggle("scrolled", window.scrollY > 55);
});

/* ===================================================
   MOBILE NAV
   =================================================== */
function initMobileNav() {
  const hamburger = $("hamburger");
  const mobileNav = $("mobileNav");
  const mobileOverlay = $("mobileOverlay");
  const mobileClose = $("mobileClose") || qs(".mobile-close");
  if (!hamburger || !mobileNav) return;
  const openNav = () => {
    mobileNav.classList.add("open");
    if (mobileOverlay) mobileOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
  };
  const closeNav = () => {
    mobileNav.classList.remove("open");
    if (mobileOverlay) mobileOverlay.classList.remove("show");
    document.body.style.overflow = "";
  };
  hamburger.addEventListener("click", openNav);
  if (mobileClose) mobileClose.addEventListener("click", closeNav);
  if (mobileOverlay) mobileOverlay.addEventListener("click", closeNav);
  // Close on link click
  mobileNav
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeNav));
}

/* ===================================================
   OBSERVERS (reveal on scroll)
   =================================================== */
function initObservers() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add("visible"), delay);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  qsa(".reveal, .reveal-sec").forEach((el) => obs.observe(el));
}

/* ===================================================
   UNIVERSAL PRICE ESTIMATOR
   =================================================== */
function initEstimator() {
  const C = window.CMS;
  if (!C) return;
  const serviceDrop = $("service");
  const dynEst = $("dynamicEstimator");
  const typeGrid = $("dynTypeGrid");
  const addonGrid = $("dynAddonGrid");
  let priceVal = $("priceVal");
  let priceBrkd = $("priceBrkd");

  let BASE_PRICES = C.pricing.web.base,
    ADDON_PRICES = C.pricing.web.addons,
    selType = null;

  function bindEstimationLogic() {
    selType = null;
    const typeBtns = qsa(".type-btn");
    const addonRows = qsa(".addon-row");
    if (!priceVal) return;

    function update() {
      if (!selType) {
        priceVal.textContent = "₹0";
        priceBrkd.textContent = "Select a package to begin";
        return;
      }
      let base = BASE_PRICES[selType];
      let addon = 0;
      let lines = [
        `Base (${selType.charAt(0).toUpperCase() + selType.slice(1)}): ₹${base.toLocaleString("en-IN")}`,
      ];
      addonRows.forEach((row) => {
        const cb = row.querySelector('input[type="checkbox"]');
        const key = row.dataset.addon;
        if (cb?.checked && ADDON_PRICES[key]) {
          addon += ADDON_PRICES[key];
          const lbl = key
            .split("-")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ");
          lines.push(`+ ${lbl}: ₹${ADDON_PRICES[key].toLocaleString("en-IN")}`);
        }
      });
      priceVal.textContent = "₹" + (base + addon).toLocaleString("en-IN");
      priceBrkd.innerHTML = lines.join("<br>");
    }

    typeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        typeBtns.forEach((b) => b.classList.remove("sel"));
        btn.classList.add("sel");
        selType = btn.dataset.type;
        update();
      });
    });
    addonRows.forEach((row) => {
      const cb = row.querySelector("input");
      if (!cb) return;
      cb.addEventListener("change", update);
      row.addEventListener("click", (e) => {
        if (e.target.tagName !== "INPUT") {
          cb.checked = !cb.checked;
          row.classList.toggle("sel", cb.checked);
          update();
        } else row.classList.toggle("sel", cb.checked);
      });
    });
    update();
  }

  function renderDynamic(val) {
    if (!typeGrid || !addonGrid) return;
    const p = C.pricing[val === "marketing" ? "marketing" : val];
    if (!p) return;
    BASE_PRICES = p.base;
    ADDON_PRICES = p.addons;
    typeGrid.innerHTML = Object.entries(BASE_PRICES)
      .map(
        ([k, v]) => `
      <div class="type-btn" data-type="${k}">
        <span class="type-name">${k.charAt(0).toUpperCase() + k.slice(1)}</span>
        <span class="type-price">₹${v.toLocaleString("en-IN")}</span>
      </div>`,
      )
      .join("");
    addonGrid.innerHTML = Object.entries(ADDON_PRICES)
      .map(
        ([k, v], i) => `
      <div class="addon-row" data-addon="${k}">
        <input type="checkbox" id="add_${i}">
        <label class="addon-lbl" for="add_${i}">${k
            .split("-")
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join(" ")}</label>
        <span class="addon-price">+₹${v.toLocaleString("en-IN")}</span>
      </div>`,
      )
      .join("");
    bindEstimationLogic();
  }

  const freeConsultation = $("freeConsultation");
  const estimatorConsultation = $("estimatorConsultation");
  const consultationPhonePanel = $("consultationPhone");
  const marketingPhonePanel = $("marketingPhone");
  const estimatorConsultBtn = $("estimatorConsultBtn");
  const marketingConsultBtn = $("marketingConsultBtn");

  function updateContactSections(val) {
    const isMarketing = val === "marketing";
    const showEstimator = !!val && !isMarketing;

    if (dynEst) dynEst.style.display = showEstimator ? "block" : "none";
    if (freeConsultation)
      freeConsultation.style.display = isMarketing ? "block" : "none";
    if (estimatorConsultation)
      estimatorConsultation.style.display = showEstimator ? "block" : "none";
    if (consultationPhonePanel) consultationPhonePanel.style.display = "none";
    if (marketingPhonePanel) marketingPhonePanel.style.display = "none";

    if (!showEstimator) return;

    if (["web", "logo"].includes(val)) {
      renderDynamic(val);
    } else {
      if (typeGrid) {
        typeGrid.innerHTML = `
          <div class="type-btn" style="cursor:default;">
            <span class="type-name">Custom Scope</span>
            <span class="type-price">Estimate after consultation</span>
          </div>`;
      }
      if (addonGrid) {
        addonGrid.innerHTML = `
          <div style="grid-column: 1 / -1; color: var(--mid-text); font-size: 13px; padding: 16px 0;">
            Estimation is available after a consultation for multiple or custom service requests.
          </div>`;
      }
      if (priceVal) priceVal.textContent = "₹0";
      if (priceBrkd)
        priceBrkd.textContent =
          "Request a consultation and we will provide a tailored estimate.";
    }
  }

  if (serviceDrop && dynEst) {
    serviceDrop.addEventListener("change", (e) => {
      updateContactSections(e.target.value);
    });
  } else {
    const path = window.location.pathname;
    if (path.includes("logo")) {
      BASE_PRICES = C.pricing.logo.base;
      ADDON_PRICES = C.pricing.logo.addons;
    } else if (path.includes("digital") || path.includes("marketing")) {
      BASE_PRICES = C.pricing.marketing.base;
      ADDON_PRICES = C.pricing.marketing.addons;
    } else {
      BASE_PRICES = C.pricing.web.base;
      ADDON_PRICES = C.pricing.web.addons;
    }
    bindEstimationLogic();
  }

  if (estimatorConsultBtn) {
    estimatorConsultBtn.addEventListener("click", () => {
      if (consultationPhonePanel)
        consultationPhonePanel.style.display =
          consultationPhonePanel.style.display === "block" ? "none" : "block";
    });
  }
  if (marketingConsultBtn) {
    marketingConsultBtn.addEventListener("click", () => {
      if (marketingPhonePanel)
        marketingPhonePanel.style.display =
          marketingPhonePanel.style.display === "block" ? "none" : "block";
    });
  }
}

function initConsultation() {
  const contact = window.CMS?.contact || {};
  const phone = contact.phone || "";
  const email = contact.email || "";

  qsa(".consult-phone").forEach((el) => {
    el.textContent = phone;
  });
  qsa(".consult-email").forEach((el) => {
    el.textContent = email;
  });

  qsa(".free-consult-btn").forEach((btn) => {
    const panel = btn
      .closest(".est-box, .consultation-section")
      ?.querySelector(".consult-contact");
    if (!panel) return;
    btn.addEventListener("click", () => {
      panel.style.display = panel.style.display === "block" ? "none" : "block";
      if (panel.style.display === "block") {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  qsa(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = button.dataset.copyTarget;
      const parent = button.closest(".consult-contact");
      const valueEl = parent?.querySelector(
        target === "phone" ? ".consult-phone" : ".consult-email",
      );
      const value = valueEl?.textContent?.trim();
      if (!value) return;

      const originalText = button.textContent;
      const showSuccess = () => {
        button.textContent = "Copied!";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("copied");
        }, 1500);
      };

      const fallbackCopy = (text) => {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);
          return successful;
        } catch (err) {
          document.body.removeChild(textarea);
          return false;
        }
      };

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(value);
          showSuccess();
        } else if (fallbackCopy(value)) {
          showSuccess();
        } else {
          throw new Error("copy-fallback");
        }
      } catch {
        if (fallbackCopy(value)) {
          showSuccess();
        } else {
          button.textContent = "Copy failed";
          setTimeout(() => {
            button.textContent = originalText;
          }, 1500);
        }
      }
    });
  });
}

/* ===================================================
   PORTFOLIO FILTER
   =================================================== */
function initPortfolioFilter() {
  const fBtns = qsa(".f-btn");
  const pmCards = qsa(".pm-card");
  fBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      fBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      pmCards.forEach((card) => {
        card.style.display =
          filter === "all" || card.dataset.cat === filter ? "block" : "none";
      });
    });
  });
}

/* ===================================================
   CONTACT FORM
   =================================================== */
function initContactForm() {
  const form = $("contactForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector(".submit-btn");
    const ok = $("formOk");
    const err = $("formErr");
    const name = (form.name?.value || "").trim();
    const email = (form.email?.value || "").trim();
    const requirement = (form.requirement?.value || "").trim();
    if (!name || name.length < 2) {
      showMsg(err, "Please enter your full name.");
      return;
    }
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      showMsg(err, "Please enter a valid email address.");
      return;
    }
    if (!requirement || requirement.length < 10) {
      showMsg(
        err,
        "Please describe your requirement (at least 10 characters).",
      );
      return;
    }
    if (err) err.style.display = "none";
    const origText = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;

    // Serverless handling via Getform.io
    const services = window.CMS?.services || {};
    const endpoint = services.getformEndpoint;

    if (!endpoint || endpoint.includes("placeholder")) {
      console.warn("Getform endpoint not configured in cms-data.js");
      showMsg(err, "Form submission is not configured. Please add your Getform.io endpoint in cms-data.js.");
      btn.textContent = origText;
      btn.disabled = false;
      return;
    }

    try {
      // Map fields to Forminit block keys (as requested by the error)
      const formData = new FormData();
      formData.append("fi-sender-fullName", name);
      formData.append("fi-sender-email", email);
      formData.append("fi-text-phone", form.phone?.value || "");
      formData.append("fi-text-service", form.service?.value || "");
      formData.append("fi-text-message", requirement);
      
      // Honeypot
      if (form.website?.value) formData.append("website", form.website.value);

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (res.ok) {
        if (ok) {
          ok.textContent = "✅ Message sent successfully! We'll get back to you soon.";
          ok.style.display = "block";
        }
        form.reset();
        btn.textContent = "Sent ✓";
        btn.style.background = "linear-gradient(135deg,#1a7a3a,#1a5a2a)";
        setTimeout(() => {
          btn.textContent = origText;
          btn.style.background = "";
          btn.disabled = false;
          if (ok) ok.style.display = "none";
        }, 5000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${res.status}`);
      }
    } catch (error) {
      console.error("Contact form submit error:", error);
      showMsg(err, `Submission failed: ${error.message}. Please check your Getform.io setup or try again.`);
      btn.textContent = origText;
      btn.disabled = false;
    }
  });
}
function showMsg(el, msg) {
  if (!el) return;
  el.textContent = "⚠️ " + msg;
  el.style.display = "block";
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ===================================================
   SMOOTH SCROLL
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ===================================================
   INIT
   =================================================== */
/* ===================================================
   WORK DONE — TAB FILTER
   =================================================== */
function initWorkTabs() {
  const tabs = document.querySelectorAll(".wtab");
  const cards = document.querySelectorAll(".work-card");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.dataset.cat;
      cards.forEach((card) => {
        if (cat === "all" || card.dataset.cat === cat) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

/* ===================================================
   WORK DONE — COUNTER ANIMATION
   =================================================== */
function initCounters() {
  const nums = document.querySelectorAll(".istat-num");
  if (!nums.length) return;

  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 16);
        counterObs.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  nums.forEach((n) => counterObs.observe(n));
}

window.onload = async function () {
  await loadCMSData();
  renderCMS();
  renderHomeSections();

  if (homeImages && homeImages.length) {
    changeBg(homeImages[0]);
    if (bgIntervalId) clearInterval(bgIntervalId);
    bgIntervalId = setInterval(autoHomeChange, 10000);
  }
  initServiceCards();
  initMobileNav();
  initObservers();
  initEstimator();
  initConsultation();
  initPortfolioFilter();
  initContactForm();
  initWorkTabs();
  initCounters();
};