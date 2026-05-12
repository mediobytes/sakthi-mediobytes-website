/**
 * ============================================================
 *  MedioBytes CMS DATA FILE
 *  ✏️  Edit content here — NO CODING REQUIRED!
 *  All text, links, images, and settings are managed here.
 * ============================================================
 */

window.CMS = {
  /* ── SITE SETTINGS ── */
  site: {
    name: "MedioBytes",
    tagline: "Digital Agency",
    city: "Coimbatore",
    year: new Date().getFullYear(),
    logo: "MedioBytes",
  },

  /* ── CONTACT INFO ── */
  contact: {
    email: "mediobytes@gmail.com",
    phone: "+91 98765 43210",
    address: "Saravanampatti, Coimbatore",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.265398817607!2d76.99381731534415!3d11.032075592152726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sSaravanampatti%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1623754321!5m2!1sen!2sin",
  },

  /* ── EXTERNAL SERVICES ── */
  services: {
    // ✏️ PASTE YOUR GETFORM.IO ENDPOINT HERE
    // Example: "https://getform.io/f/your-unique-id"
    getformEndpoint: "https://getform.io/f/jjr4vphik02",
    
    // ✏️ YOUR GEMINI API KEY
    geminiApiKey: "AIzaSyBxAZIa4AO0ku0Pxo0QUV3oihk3TKncDP8",
  },

  /* ── SOCIAL LINKS ── */
  social: {
    linkedin: "#",
    facebook: "#",
    twitter: "#",
    instagram: "https://www.instagram.com/mediobytes?igsh=Z3N3Nno4ZHZreG45",
  },

  /* ── NAVIGATION ── */
  nav: [
    { label: "Home", href: "/index.html" },
    { label: "About", href: "/pages/about.html" },
    {
      label: "Services",
      href: "/pages/services.html",
      children: [
        { label: "Web Designing", href: "/pages/web-design.html" },
        {
          label: "Logo Designing & Video Editing",
          href: "/pages/logo-design.html",
        },
        { label: "Digital Marketing", href: "/pages/digital-marketing.html" },
      ],
    },
    { label: "Portfolio", href: "/pages/portfolio.html" },
    { label: "Our Impact", href: "/pages/our-impact.html" },
    { label: "Careers", href: "/pages/career.html" },
    { label: "Contact", href: "/pages/contact.html" },
  ],

  /* ── HOME PAGE ── */
  home: {
    hero: {
      tag: "Digital Agency — Coimbatore",
      welcomeText: "WELCOME TO",
      headline: "MedioBytes",
      description:
        "Transforming ideas into powerful digital experiences — web design, branding & marketing that drives measurable growth for your business.",
      primaryBtn: { label: "Explore Services", href: "/pages/services.html" },
      secondaryBtn: { label: "Get Free Quote", href: "/pages/contact.html" },

      /* ── FIX: use root-relative paths so they work on BOTH
               index.html (root) and any /pages/ subpage.
               resolvePath() in script.js will prepend "../"
               automatically when on a subpage.              ── */
      bgImages: ["images/bg1.jpg", "images/bg2.jpg", "images/bg3.jpg"],
    },

    servicesSection: {
      tag: "What We Do",
      headline: "We Create <span class='red'>Smart Digital</span> Solutions",
      description:
        "From stunning websites to powerful brand identities and growth-driven marketing — we deliver everything businesses need to thrive in the digital world.",
      allServicesBtn: { label: "All Services →", href: "/pages/services.html" },
      cards: [
        {
          num: "01",
          title: "Web Designing",
          description:
            "Modern, responsive websites built for performance, speed, and conversion excellence.",
          href: "/pages/web-design.html",
          emoji: "🖥️",
          gradient: "linear-gradient(135deg,#0f172a,#1e3a8a,#020617)",
        },
        {
          num: "02",
          title: "Logo Designing & Video Editing",
          description:
            "Distinctive brand identities and engaging video content that communicate your vision at a glance.",
          href: "/pages/logo-design.html",
          emoji: "✦",
          gradient: "linear-gradient(135deg,#020617,#0369a1,#0f172a)",
        },
        {
          num: "03",
          title: "Digital Marketing",
          description:
            "Data-driven strategies that amplify reach and grow your revenue consistently.",
          href: "/pages/digital-marketing.html",
          emoji: "📈",
          gradient: "linear-gradient(135deg,#022c22,#0d9488,#042f2e)",
        },
      ],
    },

    whyUs: {
      tag: "Why MedioBytes",
      headline: "We Don't Just Deliver,<br>We <span class='red'>Elevate</span>",
      description:
        "Every project is a statement of craftsmanship, strategy, and ambition. We combine creativity with technology to produce results that matter to your bottom line.",
      aboutBtn: { label: "About Us", href: "/pages/about.html" },
      features: [
        {
          title: "Client-First Approach",
          text: "We listen before we build. Your goals drive every decision we make.",
        },
        {
          title: "On-Time Delivery",
          text: "We respect your deadlines and deliver quality without compromise.",
        },
        {
          title: "Post-Launch Support",
          text: "Our relationship doesn't end at launch — we're here when you need us.",
        },
        {
          title: "Transparent Pricing",
          text: "No hidden costs. What we quote is what you pay — always.",
        },
      ],
    },

    portfolio: {
      tag: "Our Work",
      headline: "Featured <span class='red'>Projects</span>",
      description:
        "A glimpse into our best work across web design, branding & digital marketing.",
      viewAllBtn: { label: "View All Work", href: "/pages/portfolio.html" },
      previews: [
        {
          label: "Web Design",
          sub: "Business Website",
          gradient: "linear-gradient(135deg,#0f172a,#1e3a8a)",
        },
        {
          label: "Logo & Video",
          sub: "Brand Identity",
          gradient: "linear-gradient(135deg,#020617,#0369a1)",
        },
        {
          label: "Digital Marketing",
          sub: "Growth Campaign",
          gradient: "linear-gradient(135deg,#022c22,#0d9488)",
        },
      ],
    },

    impactSection: {
      tag: "Work Done",
      headline: "Our <span class='red'>Impact</span> in Numbers",
      description:
        "Every project tells a story. Here's what we've delivered across our journey — real results for real clients.",
      stats: [
        { target: 10, suffix: "+", label: "Projects Completed" },
        { target: 8, suffix: "+", label: "Happy Clients" },
        { target: 1, suffix: "+", label: "Years of Excellence" },
        { target: 98, suffix: "%", label: "Client Satisfaction" },
      ],
      tabs: [
        { label: "All Work", cat: "all" },
        { label: "Web Design", cat: "web" },
        { label: "Logo & Brand", cat: "logo" },
        { label: "Digital Marketing", cat: "marketing" },
      ],
      workCards: [
        {
          cat: "web",
          gradient: "linear-gradient(135deg, #0c1a10, #14532d, #0a0f0b)",
          emoji: "🏢",
          tag: "Web Design",
          title: "Corporate Business Site",
          description:
            "Multi-page corporate website with CMS integration, and lead capture forms.",
          year: "2026",
          status: "✓ Delivered",
        },
        {
          cat: "logo",
          gradient: "linear-gradient(135deg, #020617, #7c3aed, #0f172a)",
          emoji: "✦",
          tag: "Logo & Brand",
          title: "Corporate Brand Identity",
          description:
            "Complete brand package — logo, colour palette, typography guide, and brand usage guidelines.",
          year: "2026",
          status: "✓ Delivered",
        },
        {
          cat: "logo",
          gradient: "linear-gradient(135deg, #2d1b00, #d97706, #1c1100)",
          emoji: "☕",
          tag: "Logo & Brand",
          title: "Green Technology",
          description:
            "Modern rebrand for a local café chain — new logo, signage system, and packaging design.",
          year: "2026",
          status: "✓ Delivered",
        },
        {
          cat: "logo",
          gradient: "linear-gradient(135deg, #1a0a2e, #db2777, #0d0a1f)",
          emoji: "💄",
          tag: "Logo & Brand",
          title: "Beauty Brand Identity",
          description:
            "Elegant logo and full brand identity for a premium beauty & skincare startup.",
          year: "2026",
          status: "✓ Delivered",
        },
        {
          cat: "marketing",
          gradient: "linear-gradient(135deg, #1a0a2e, #6d28d9, #0d0a1f)",
          emoji: "📈",
          tag: "Digital Marketing",
          title: "Meta Ads – 33 Leads in 4 Days",
          description:
            "Real campaign results: 33 form leads at ₹46.81 CPL with just ₹400/day budget.",
          year: "2026",
          status: "✓ Delivered",
        },
        {
          cat: "marketing",
          gradient: "linear-gradient(135deg, #0f172a, #0d9488, #1e3a8a)",
          emoji: "🎓",
          tag: "Digital Marketing",
          title: "Makeup Institute – ₹1.5L Revenue in 2 Days",
          description:
            "High-impact digital launch campaign delivering fast revenue and strong audience growth.",
          year: "2026",
          status: "✓ Delivered",
        },
      ],
    },

    careers: {
      tag: "Join Our Team",
      headline: "Open <span class='red'>Positions</span>",
      description:
        "We're growing and looking for talented people to join the MedioBytes family.",
      jobs: [
        {
          icon: "🎨",
          role: "UI/UX Designer",
          dept: "Design Department",
          status: "open",
          details: [
            "Create intuitive, beautiful user interfaces",
            "Wireframing, prototyping & design systems",
            "Experience with Figma / Adobe XD",
            "Portfolio of web/app UI projects required",
          ],
          applyHref: "/pages/apply.html?role=UI%2FOUX+Designer",
        },
        {
          icon: "💻",
          role: "Web Developer",
          dept: "Development Department",
          status: "open",
          details: [
            "Build responsive websites & web apps",
            "HTML, CSS, JavaScript proficiency",
            "React / Node.js knowledge preferred",
            "Strong eye for design & detail",
          ],
          applyHref: "/pages/apply.html?role=Web+Developer",
        },
        {
          icon: "📊",
          role: "Digital Marketing Executive",
          dept: "Marketing Department",
          status: "open",
          details: [
            "Manage social media & ad campaigns",
            "Google Ads & Meta Ads experience",
            "Analytics, reporting & optimization",
            "Content creation skills a plus",
          ],
          applyHref: "/pages/apply.html?role=Digital+Marketing+Executive",
        },
      ],
    },

    cta: {
      headline:
        "Ready to Build Something <span class='red'>Extraordinary?</span>",
      description:
        "Let's turn your idea into a powerful digital reality. Get a free estimation today.",
      btn: { label: "Start Your Project", href: "/pages/contact.html" },
    },

    footer: {
      about:
        "We craft powerful digital experiences that elevate your brand and drive real results.",
    },
  },

  /* ── ABOUT PAGE ── */
  about: {
    hero: {
      tag: "Our Story",
      headline: "Who We <span class='red'>Are</span>",
      description:
        "A passionate team of designers, developers, and digital strategists based in Coimbatore — dedicated to building experiences that truly matter and results that last.",
    },
    stats: {
      yearsLabel: "Year of Excellence",
      yearsSince: "Building digital products since 2024",
      projects: "6+",
      clients: "5+",
    },
    story: {
      tag: "Our Journey",
      headline:
        "Built on Passion,<br>Driven by <span class='red'>Results</span>",
      body: [
        "MedioBytes was founded with a clear belief — every business deserves a world-class digital presence. We started in Coimbatore as a focused design and marketing studio, and we're growing fast.",
        "We combine strategic thinking with creative execution to deliver solutions that aren't just beautiful — they're built to perform. From startups launching their first product to established brands refreshing their identity, we bring the same level of craft to every engagement.",
      ],
      btn: { label: "Work With Us", href: "contact.html" },
    },
  },

  /* ── PRICING ── */
  pricing: {
    web: {
      base: { small: 4000, medium: 7000, large: 15000 },
      addons: {
        "Extra Pages": 500,
        "Database Storage": 2000,
        "Email Notification": 1000,
        "SMS Notification": 2000,
      },
    },
    logo: {
      base: { basic: 2500, standard: 4000, premium: 7000 },
      addons: {
        "Extra Logo Concepts ": 1000,
        "business card Design": 1500,
        "letterhead Design": 1000,
        "brand Style guide": 2500,
        "basic Video Editing": 2000,
        "advanced Video Editing": 5000,
      },
    },
  },
};

/* ── OUR IMPACT — appended section ──
 * This block is merged into window.CMS at runtime by the script below.
 * Edit freely: add metric cards, testimonials, toggle sections visible/hidden.
 */
window.CMS.impact = {
  hero: {
    tag: "Proven Results",
    headline: "Our <span class='red'>Impact</span>",
    description:
      "Real numbers, real stories. Here's what we've delivered across web design, brand identity, and digital marketing.",
  },

  /* ═══════════════════════════════════════════════════════
   *  HOW TO ADD A RESULT CARD  ✏️
   *  ─────────────────────────
   *  Copy one {} block from a "results" array and fill in:
   *    metric : big stat,  e.g. "3×"  "↑ 220%"  "₹2L+"
   *    label  : short name, e.g. "Traffic Growth"
   *    detail : 1-2 sentence story about what was achieved
   *    client : optional tag for client name / industry
   *
   *  HOW TO ADD A TESTIMONIAL  ✏️
   *  ─────────────────────────
   *  Copy one {} block from a "testimonials" array and fill:
   *    quote  : the client's words
   *    name   : client name
   *    role   : their role / company
   *
   *  Set  visible: false  on any service to hide that section.
   *  Leave results: [] or testimonials: [] to show empty state.
   * ═══════════════════════════════════════════════════════ */

  webDesign: {
    visible: true,
    id: "web-design",
    icon: "🖥️",
    label: "Web Designing",
    color: "linear-gradient(135deg,#0f172a,#1e3a8a)",
    tag: "Web Design Results",
    headline: "Websites That <span class='red'>Perform</span>",
    description:
      "Every site we build is engineered for speed, usability and conversions — here's what that looks like in practice.",
    impactBtn: { label: "Start a Web Project →", href: "/pages/contact.html" },
    results: [],
    testimonials: [],
  },

  logoDesign: {
    visible: true,
    id: "logo-design",
    icon: "✦",
    label: "Logo Designing & Video Editing",
    color: "linear-gradient(135deg,#020617,#0369a1)",
    tag: "Branding & Media Results",
    headline: "Brands & Videos That <span class='red'>Stick</span>",
    description:
      "A great logo and compelling video speak before you say a word. See how our brand identities have elevated our clients.",
    impactBtn: {
      label: "Start a Brand Project →",
      href: "/pages/contact.html",
    },
    results: [],
    testimonials: [],
  },

  digitalMarketing: {
    visible: true,
    id: "digital-marketing",
    icon: "📈",
    label: "Digital Marketing",
    color: "linear-gradient(135deg,#022c22,#0d9488)",
    tag: "Marketing Results",
    headline: "Campaigns That <span class='red'>Convert</span>",
    description:
      "From social media to paid ads — our data-driven strategies move the needle on metrics that actually matter.",
    impactBtn: { label: "Launch a Campaign →", href: "/pages/contact.html" },
    results: [],
    testimonials: [],
  },
};
