import os

# Define revised consolidated pages to generate
pages_data = {
    "search-marketing": {
        "title": "Search Marketing (SEO, AEO, GEO) | JABZEN | Creative Marketing Freelancer",
        "breadcrumb": "Search Marketing",
        "heading": "Search Marketing (SEO, AEO, GEO)",
        "description": "Dominate search engines and conversational AI answers. We align keyword strategies, technical optimization, and semantic schemas to guarantee search visibility.",
        "cards": [
            ("Technical & Local SEO", "Core web vitals optimization, schema audits, Google Business Profile scaling, and local keyword networks to capture intent."),
            ("Answer Engine Optimization", "Formatting data models and QA schemas to feed conversational LLMs like ChatGPT, Claude, and Gemini search."),
            ("Generative Engine Optimization", "Formulating precise comparison matrices, lists, and summary nodes optimized for Generative Search SGE components.")
        ]
    },
    "performance-marketing": {
        "title": "Performance Ads & Funnel Mappings | JABZEN | Creative Marketing Freelancer",
        "breadcrumb": "Performance Marketing",
        "heading": "Performance Ads & Funnel Optimization",
        "description": "High-ROI digital ad execution. Setup and manage targeted search, display, and Performance Max campaigns across Meta, Instagram, and Google.",
        "cards": [
            ("Direct Response Campaigns", "Bidding structures, ad copy testing, and targeted hooks designed to capture active high-ticket buyers."),
            ("Glassmorphic Landing Pages", "Ultra-fast loading, conversion-focused landing pages designed to drive calls and direct consultation bookings."),
            ("Analytics & Flow Automation", "Implementing pixel tracking, custom reporting dashboards, webhooks, and direct integrations to CRM pipelines.")
        ]
    },
    "creative-services": {
        "title": "Creative Production & Brand Identity | JABZEN | Creative Marketing Freelancer",
        "breadcrumb": "Creative Production",
        "heading": "Creative Production & Visual Branding",
        "description": "Direct response creative assets and brand upgrades. Setup visual guidelines, custom monograms, and viral short-form video assets.",
        "cards": [
            ("Viral Reel & Short Video", "Scripting high-retention hooks, dynamic captions, sound overlays, and post-production for Reels and TikTok."),
            ("Luxury Visual Guidelines", "Minimalist typography systems, curated color schemes, stylized monograms, and agency assets for high-end recall."),
            ("Video Editing & Graphics", "Cinematic product edits, marketing copywriting, storyboards, and social media brand templates designed to convert.")
        ]
    },
    "ai-solutions": {
        "title": "AI Marketing Solutions & Automation | JABZEN | Creative Marketing Freelancer",
        "breadcrumb": "AI Solutions",
        "heading": "AI Marketing Solutions & Automation",
        "description": "cinematic explainer video production and marketing automation workflows deployed using artificial intelligence.",
        "cards": [
            ("AI Guide Presenters", "Realistic artificial avatars, custom voice clones, and video translations to deploy variations instantly."),
            ("Voice Cloning Explainer Videos", "Cinematic explainer copy synced with professional voice generators to record product walkthroughs at scale."),
            ("Workflow Automation", "Setting up custom AI agents, automated newsletter flows, and responsive pipelines that run 24/7.")
        ]
    }
}

HTML_HEADER = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="https://jabzen.com/{canonical_slug}">
  <link rel="icon" href="assets/favicon.png">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="styles.min.css?v=16">
</head>
<body class="page-{canonical_slug}">
  <a class="skip-link" href="#main">Skip to content</a>
  <!-- Header -->
  <header class="site-header" id="site-header">
    <nav class="nav" aria-label="Main navigation">
      <a class="brand" href="./" aria-label="JABZEN home">
        <img src="assets/logo-monogram.png?v=3" alt="JABZEN Logo" class="brand-logo-img" style="width: 52px; height: 52px; object-fit: contain;">
        <span class="brand-text">JABZEN<small>Creative Marketing</small></span>
      </a>
      <div class="header-search-bar">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" id="global-search-input" placeholder="Search articles, topics, authors...">
      </div>
      <div class="nav-links" data-nav-links>
        <a href="./" class="nav-marketing-link">Marketing</a>
        <a href="./" class="nav-normal-link">Marketing</a>
        <div class="nav-dropdown nav-normal-link">
          <a href="#" class="dropdown-trigger" aria-haspopup="true" aria-expanded="false">Services <span class="arrow">&darr;</span></a>
          <ul class="dropdown-menu">
            <li><a href="search-marketing">Search Marketing (SEO)</a></li>
            <li><a href="performance-marketing">Performance Ads &amp; Funnels</a></li>
            <li><a href="creative-services">Creative Production</a></li>
            <li><a href="ai-solutions">AI Marketing Solutions</a></li>
          </ul>
        </div>
        <a href="about" class="nav-normal-link">About</a>
        <a href="contact" class="nav-normal-link">Contact</a>
        
        <!-- Mobile Drawer Action Buttons -->
        <a href="blog#write" class="nav-write-link mobile-only">
          <i class="fa-solid fa-pen-to-square"></i> Write
        </a>
        
        <div id="mobile-user-profile" class="mobile-only mobile-profile-container" style="display: none; border-top: 1px solid var(--border-color); padding-top: 1.5rem; margin-top: 0.5rem; width: 100%;">
          <div class="mobile-profile-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;">
            <img id="mobile-profile-avatar" src="https://www.gravatar.com/avatar/?d=mp" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--brand-primary); object-fit: cover;">
            <div>
              <div id="mobile-profile-name" style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary);">User Name</div>
              <div id="mobile-profile-email" style="font-size: 0.75rem; color: var(--text-secondary); word-break: break-all;">email@example.com</div>
            </div>
          </div>
          <div class="mobile-profile-menu" style="display: flex; flex-direction: column; gap: 0.75rem; padding-left: 0.25rem;">
            <a href="blog#blog-auth-section" style="font-size: 0.9rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-gauge" style="width: 16px;"></i> Dashboard</a>
            <a href="blog#settings" style="font-size: 0.9rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-gear" style="width: 16px;"></i> Settings</a>
            <a href="blog#privacy" style="font-size: 0.9rem; color: var(--text-secondary); display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-shield-halved" style="width: 16px;"></i> Privacy &amp; Security</a>
            <button id="mobile-logout-btn" type="button" class="btn btn-outline" style="padding: 0.45rem 1rem; font-size: 0.85rem; border-radius: 8px; font-weight: 600; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2); margin-top: 0.5rem;"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
          </div>
        </div>
        
        <a href="blog#blog-auth-section" id="mobile-login-btn" class="mobile-only btn btn-outline" style="width: 100%; margin-top: 0.5rem; justify-content: center; display: none;">Sign In / Join Blog</a>
        <a class="btn btn-primary header-cta-btn mobile-only" href="blog" style="width: 100%; margin-top: 0.5rem; justify-content: center; display: none;">Blog</a>
      </div>
      <div class="nav-actions">
        <a href="blog#write" id="nav-write-btn" class="nav-write-link">
          <i class="fa-solid fa-pen-to-square"></i> Write
        </a>
        <div id="header-user-profile" class="header-profile-container" style="display: none;">
          <button id="header-profile-btn" class="header-profile-btn" aria-label="User profile" type="button">
            <img id="header-profile-avatar" src="https://www.gravatar.com/avatar/?d=mp" alt="Profile">
            <span id="header-profile-display-name" class="header-profile-display-name">Author</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-secondary);"></i>
          </button>
          <div id="header-profile-dropdown" class="header-profile-dropdown">
            <div class="dropdown-user-info">
              <div id="header-profile-name" class="dropdown-user-name">User Name</div>
              <div id="header-profile-email" class="dropdown-user-email">email@example.com</div>
            </div>
            <a href="blog#blog-auth-section" class="dropdown-link"><i class="fa-solid fa-gauge"></i> Dashboard</a>
            <a href="blog#settings" class="dropdown-link"><i class="fa-solid fa-gear"></i> Settings</a>
            <a href="blog#privacy" class="dropdown-link"><i class="fa-solid fa-shield-halved"></i> Privacy &amp; Security</a>
            <button id="header-logout-btn" type="button" class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; min-height: unset; border-radius: 8px; font-weight: 500; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2);"><i class="fa-solid fa-right-from-bracket"></i> Sign Out</button>
          </div>
        </div>
        <a class="btn btn-primary header-cta-btn" href="blog">Blog</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Open menu" aria-expanded="false">&equiv;</button>
      </div>
    </nav>
  </header>
"""

HTML_FOOTER = """
  <!-- Floating social FAB menu bottom right -->
  <div class="social-fab-container" data-social-fab>
    <div class="social-links-expand">
      <a href="https://www.linkedin.com/company/110264236/" target="_blank" rel="noopener" class="fab-btn linkedin" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
      </a>
      <a href="https://www.instagram.com/jabzen.digital/" target="_blank" rel="noopener" class="fab-btn instagram" aria-label="Instagram">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a href="https://www.facebook.com/share/18nExq4nbi/" target="_blank" rel="noopener" class="fab-btn facebook" aria-label="Facebook">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
      </a>
      <a href="https://x.com/abhishek4srmu" target="_blank" rel="noopener" class="fab-btn twitter" aria-label="Twitter/X">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://youtube.com/@jabzen_digitalgrowth?si=WuvoRP5fkmYw152f" target="_blank" rel="noopener" class="fab-btn youtube" aria-label="YouTube">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
    </div>
    <a href="https://wa.me/91880863659" target="_blank" rel="noopener" class="fab-main-trigger whatsapp" aria-label="WhatsApp chat">
      <svg class="icon-svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.233 8.378 3.469 2.237 2.235 3.469 5.21 3.468 8.379-.003 6.534-5.329 11.858-11.86 11.858-2.001-.001-3.97-.508-5.717-1.474L0 24zm6.549-3.238c1.658.983 3.284 1.503 4.909 1.504 5.405 0 9.805-4.394 9.807-9.8.002-2.617-1.013-5.078-2.86-6.928C16.607 3.687 14.15 2.673 11.53 2.673c-5.405 0-9.807 4.394-9.809 9.8-.001 1.83.499 3.613 1.447 5.174l-.953 3.478 3.567-.936c1.554.848 3.023 1.157 4.372 1.157zm12.355-6.702c-.3-.15-1.771-.875-2.046-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-3.519-1.758-5.314-3.717-6.525-5.8-.3-.513.233-.474.723-.974.137-.14.225-.263.292-.375.068-.112.034-.213-.017-.313-.05-.1-.475-1.143-.65-1.562-.171-.41-.363-.356-.5-.356-.1-.004-.217-.004-.334-.004-.117 0-.308.043-.469.22C7.307 4.7 6.8 5.176 6.8 6.161s.717 1.932.817 2.067c.1.135 1.414 2.158 3.424 3.028 1.636.709 2.27.765 3.09.684.514-.05 1.54-.63 1.754-1.24.214-.61.214-1.133.15-1.24-.064-.108-.244-.16-.544-.31z"/>
      </svg>
    </a>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="./" aria-label="JABZEN home">
            <img src="assets/logo-monogram.png?v=3" alt="JABZEN Logo" class="brand-logo-img" style="width: 52px; height: 52px; object-fit: contain;">
            <span class="brand-text">JABZEN<small>Creative Marketing</small></span>
          </a>
          <p>Bespoke acquisition pipelines designed for long-term scalability and authority.</p>
        </div>
        <div class="footer-col">
          <h3>Services</h3>
          <ul>
            <li><a href="search-marketing">Search Optimization</a></li>
            <li><a href="creative-services">Content Systems</a></li>
            <li><a href="performance-marketing">Performance Ads</a></li>
            <li><a href="ai-solutions">AI Automation</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Methodology</h3>
          <ul>
            <li><a href="./#process">Discover</a></li>
            <li><a href="./#process">Strategize</a></li>
            <li><a href="./#process">Execute</a></li>
            <li><a href="./#process">Scale</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:info@jabzen.com">info@jabzen.com</a></li>
            <li><a href="https://wa.me/91880863659" target="_blank" rel="noopener">WhatsApp Live</a></li>
            <li><span>India &bull; Serving Globally</span></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 JABZEN. Proprietary brand of Abhishek Pratap Singh, Independent Consultant &bull; <a href="sitemap" style="color: var(--text-secondary); text-decoration: none; font-weight: 600;">Sitemap</a></span>
        <span>Lucknow, India &bull; Serving Clients Globally</span>
      </div>
    </div>
  </footer>
  <!-- Firebase Compatibility SDK for App, Auth, Firestore and Storage -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js" defer></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-storage-compat.js" defer></script>
  <script src="script.min.js?v=16" defer></script>
</body>
</html>
"""

def generate_service_pages():
    for slug, info in pages_data.items():
        filename = f"{slug}.html"
        title = info["title"]
        heading = info["heading"]
        desc = info["description"]
        
        # Override titles & descriptions specifically for landing page conversion
        if slug == "search-marketing":
            title = "SEO Services: Drive Organic Traffic & AI Search Answers | JABZEN"
            heading = "SEO & Search Engine Optimization: Get Found by High-Intent Buyers Today"
            desc = "Improve search engine rankings, optimize for voice search AEO, and index in generative AI models to scale organic lead generation without monthly ad spend."
        elif slug == "performance-marketing":
            title = "Performance Marketing Funnels & Ad Campaigns | JABZEN"
            heading = "Performance Ads & Funnel Optimization: Turn Paid Traffic into Profitable Conversions"
            desc = "Deploy direct-response ads on Meta and Google, fast glassmorphic landing pages, and lead tracking pipelines to stop wasting ad spend and capture ready-to-buy customers."
        elif slug == "creative-services":
            title = "Creative Production, Video Editing & Visual Branding | JABZEN"
            heading = "Creative Production & Visual Branding: Storytelling That Converts"
            desc = "Direct response creative assets, viral Reel/Short-form video production, minimal custom monograms, and luxury branding guidelines designed to capture attention and build authority."
        elif slug == "ai-solutions":
            title = "AI Marketing Solutions & Custom Workflow Automation | JABZEN"
            heading = "AI Marketing Solutions & Automation: Scale Your Execution 24/7"
            desc = "Deploy custom virtual presenter guides, professional voice cloned walkthroughs, and responsive webhook automations to increase operational velocity and conversion rates."

        # Compile deliverables cards dynamically
        cards_html = ""
        for card_title, card_desc in info["cards"]:
            cards_html += f"""
          <div class="card service-card" style="align-items: flex-start; text-align: left; padding: 2rem;">
            <div class="icon" style="background: rgba(214,173,45,0.15); color: var(--accent); width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; margin-bottom: 1.25rem;"><i class="fa-solid fa-circle-check"></i></div>
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">{card_title}</h3>
            <p style="margin: 0; font-size: 0.9rem; line-height: 1.6; color: var(--text-secondary);">{card_desc}</p>
          </div>"""

        body_html = f"""  <main id="main">
    <!-- Hero Section -->
    <section class="page-hero" style="padding: 100px 0 60px; position: relative; overflow: hidden;">
      <div class="container" style="text-align: center; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem;">
        <span class="eyebrow" style="font-size: 0.82rem; letter-spacing: 0.15em; font-weight: 900; color: var(--accent);">Premium Service Offering</span>
        <h1 style="max-width: 900px; line-height: 1.12; font-size: clamp(2.2rem, 5.5vw, 4rem); font-weight: 800; font-family: Poppins, sans-serif; color: var(--text-primary); margin: 0;">{heading}</h1>
        <p class="lead" style="margin: 0.5rem auto 0; font-size: clamp(1rem, 1.8vw, 1.2rem); color: var(--text-secondary); max-width: 750px; line-height: 1.6; text-align: center;">{desc}</p>
        <div class="cta-row" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%; margin-top: 1rem;">
          <a class="btn btn-primary" href="#contact" style="padding: 0.75rem 1.75rem; font-weight: 900;"><i class="fa-solid fa-calendar-check" style="margin-right: 8px;"></i> Book Consultation</a>
          <a class="btn btn-secondary" href="#deliverables" style="padding: 0.75rem 1.75rem; font-weight: 900;"><i class="fa-solid fa-list-check" style="margin-right: 8px;"></i> View Scope & Deliverables</a>
        </div>
      </div>
    </section>

    <!-- Visual Banner Section -->
    <section class="section" style="padding: 20px 0 40px;">
      <div class="container" style="max-width: 960px; margin: 0 auto;">
        <div style="width: 100%; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow);">
          <img src="assets/{slug}-banner.webp" alt="{heading} Banner" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 16/9;">
        </div>
      </div>
    </section>

    <!-- Deliverables Scope Section -->
    <section class="section" id="deliverables" style="padding: 60px 0;">
      <div class="container">
        <div class="section-head" style="text-align: center; margin-bottom: 3.5rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
          <p class="eyebrow" style="margin: 0;">Service Scope</p>
          <h2 style="font-size: clamp(1.6rem, 3.5vw, 2.5rem); margin: 0;">What We Deliver to Scale Your Business</h2>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0.5rem auto 0; font-size: 0.95rem; text-align: center;">Specific, action-oriented execution fields designed to drive traffic, visibility, and direct inquiries.</p>
        </div>
        <div class="grid grid-3">
          {cards_html}
        </div>
      </div>
    </section>

    <!-- Process Timeline Section -->
    <section class="section soft" id="process" style="padding: 70px 0; background: var(--soft);">
      <div class="container">
        <div class="section-head" style="text-align: center; margin-bottom: 3.5rem; display: flex; flex-direction: column; gap: 0.5rem; align-items: center;">
          <p class="eyebrow" style="margin: 0;">Execution Roadmap</p>
          <h2 style="font-size: clamp(1.6rem, 3.5vw, 2.5rem); margin: 0;">How We Work Together to Achieve Results</h2>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0.5rem auto 0; font-size: 0.95rem; text-align: center;">Our clean process roadmap keeps our collaboration fast, transparent, and focused on target milestones.</p>
        </div>
        <div class="timeline" style="max-width: 800px; margin: 0 auto;">
          <div class="timeline-item" style="position: relative; padding-left: 3.5rem; margin-bottom: 2.5rem;">
            <div class="timeline-badge" style="position: absolute; left: 11px; top: 6px; width: 20px; height: 20px; border-radius: 50%; background: var(--card-bg); border: 4px solid var(--accent); z-index: 2;"></div>
            <div class="timeline-content">
              <h3 style="color: var(--accent); font-size: 1.25rem; font-weight: 700; margin: 0 0 0.25rem;">Phase 1: Discovery & Strategy Audit</h3>
              <small style="display: block; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 700; font-size: 0.82rem;">Week 1</small>
              <p style="margin: 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">We audit your current organic search positioning, paid campaign logs, or creative styles. We then prepare a competitive audit and mapping list containing specific priorities.</p>
            </div>
          </div>
          <div class="timeline-item" style="position: relative; padding-left: 3.5rem; margin-bottom: 2.5rem;">
            <div class="timeline-badge" style="position: absolute; left: 11px; top: 6px; width: 20px; height: 20px; border-radius: 50%; background: var(--card-bg); border: 4px solid var(--accent); z-index: 2;"></div>
            <div class="timeline-content">
              <h3 style="color: var(--accent); font-size: 1.25rem; font-weight: 700; margin: 0 0 0.25rem;">Phase 2: Implementation & Launch</h3>
              <small style="display: block; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 700; font-size: 0.82rem;">Weeks 2-3</small>
              <p style="margin: 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">We build high-converting glassmorphic landing pages, write expert copywriting grids, configure AI models/voice clones, or design ad creatives. We verify page speeds and analytics before setting the funnel live.</p>
            </div>
          </div>
          <div class="timeline-item" style="position: relative; padding-left: 3.5rem;">
            <div class="timeline-badge" style="position: absolute; left: 11px; top: 6px; width: 20px; height: 20px; border-radius: 50%; background: var(--card-bg); border: 4px solid var(--accent); z-index: 2;"></div>
            <div class="timeline-content">
              <h3 style="color: var(--accent); font-size: 1.25rem; font-weight: 700; margin: 0 0 0.25rem;">Phase 3: Weekly Optimization & Scaling</h3>
              <small style="display: block; color: var(--text-secondary); margin-bottom: 0.5rem; font-weight: 700; font-size: 0.82rem;">Ongoing Retention</small>
              <p style="margin: 0; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">We monitor conversion logs, run test variations on ad creatives, adjust bids or search indices, and send clean, transparent dashboard reports on a fixed weekly cadence.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose JABZEN Section -->
    <section class="section" id="benefits" style="padding: 70px 0;">
      <div class="container split" style="align-items: center; display: grid; gap: 3rem; grid-template-columns: 1.1fr 0.9fr;">
        <div style="text-align: left;">
          <p class="eyebrow" style="margin: 0 0 0.75rem;">Why Choose JABZEN</p>
          <h2 style="font-size: clamp(1.6rem, 3.5vw, 2.5rem); margin: 0 0 1rem; line-height: 1.15;">A Human-First Approach to Modern Digital Growth</h2>
          <p style="margin: 0 0 1.5rem; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">We replace empty promises and vague metrics with structured deliverables, clear conversion optimization workflows, and direct contact options.</p>
          <ul style="list-style: none; padding: 0; display: grid; gap: 1rem; margin: 0;">
            <li style="display: flex; align-items: flex-start; gap: 10px; color: var(--text-primary); font-size: 0.92rem; line-height: 1.5;">
              <i class="fa-solid fa-circle-check" style="color: var(--accent); margin-top: 4px; flex-shrink: 0;"></i>
              <span><strong>Milestone-driven retainers:</strong> Know exactly what assets are generated and deployed weekly.</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 10px; color: var(--text-primary); font-size: 0.92rem; line-height: 1.5;">
              <i class="fa-solid fa-circle-check" style="color: var(--accent); margin-top: 4px; flex-shrink: 0;"></i>
              <span><strong>Direct communications:</strong> Direct connections to your specialist via WhatsApp/Slack without sales gatekeepers.</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 10px; color: var(--text-primary); font-size: 0.92rem; line-height: 1.5;">
              <i class="fa-solid fa-circle-check" style="color: var(--accent); margin-top: 4px; flex-shrink: 0;"></i>
              <span><strong>AIO/GEO readiness:</strong> Funnels built to capture search rankings and AI citations from tools like Gemini and ChatGPT.</span>
            </li>
          </ul>
        </div>
        
        <!-- Value metrics container -->
        <div style="background: var(--card-bg); border: 1px solid var(--line); padding: 2.5rem; border-radius: var(--radius); display: flex; flex-direction: column; gap: 1.5rem; box-shadow: var(--shadow);">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div class="icon" style="background: rgba(214,173,45,0.1); color: var(--accent); width: 44px; height: 44px; display: grid; place-items: center; border-radius: 50%; margin: 0;"><i class="fa-solid fa-chart-line"></i></div>
            <h3 style="margin: 0; font-size: 1.2rem; color: var(--text-primary);">Funnel Performance Metrics</h3>
          </div>
          <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">Our client engagements target core revenue and visibility improvements rather than simple raw clicks.</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--line); padding-top: 1.5rem; margin-top: 0.5rem;">
            <div>
              <strong style="color: var(--accent); font-size: 1.8rem; display: block; font-family: Poppins, sans-serif; font-weight: 800; line-height: 1;">4.2x</strong>
              <span style="font-size: 0.78rem; color: var(--text-secondary); display: block; margin-top: 4px;">Average ROAS</span>
            </div>
            <div>
              <strong style="color: var(--accent); font-size: 1.8rem; display: block; font-family: Poppins, sans-serif; font-weight: 800; line-height: 1;">312%</strong>
              <span style="font-size: 0.78rem; color: var(--text-secondary); display: block; margin-top: 4px;">Search Visibility Increase</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Lead Generation Form Section -->
    <section class="section soft" id="contact" style="padding: 70px 0; background: var(--soft);">
      <div class="container split" style="display: grid; gap: 3rem; grid-template-columns: 1.15fr 0.85fr;">
        <div style="text-align: left;">
          <p class="eyebrow" style="margin: 0 0 0.75rem;">Strategy Call</p>
          <h2 style="font-size: clamp(1.6rem, 3.5vw, 2.5rem); margin: 0 0 1rem; line-height: 1.15;">Let's Connect This Service to Your Live Sales Channels</h2>
          <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6;">Schedule a free strategy consultation call. We will review your current ad accounts, website performance, or search keywords and map out a customized action list.</p>
        </div>
        <form class="form-wrap" data-lead-form style="background: var(--card-bg); border-color: var(--line); margin: 0;">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name" style="color: var(--text-primary);">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="Type your name">
            </div>
            <div class="field">
              <label for="lead-phone" style="color: var(--text-primary);">Phone Number</label>
              <input id="lead-phone" name="phone" type="tel" autocomplete="tel" required placeholder="+91 99999 99999">
            </div>
          </div>
          <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 1.5rem;">Book Free Consultation</button>
          <p class="success-message" data-success-message style="color: var(--accent); font-weight: 700; margin-top: 1rem; text-align: center;">Thanks! Booking consultation call on WhatsApp...</p>
        </form>
      </div>
    </section>
  </main>
"""
        full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug=slug) + body_html + HTML_FOOTER
        with open(filename, "w", encoding="utf-8") as f:
            f.write(full_content)
        print(f"Generated {filename}")

def generate_blog_page():
    filename = "blog.html"
    title = "Blog & Insights | JABZEN | Creative Marketing Freelancer"
    desc = "Expert guides, industry frameworks, and tactical blueprints on SEO, AI, Meta Ads, and Branding."
    
    body_html = """  <main id="main">
    <section class="section" style="padding: 120px 0 60px 0; background: var(--bg);">
      <div class="container" style="max-width: 1400px; width: 95%;">
        <div class="blog-layout-grid">
          
          <!-- LEFT COLUMN: Navigation & Profile -->
          <aside class="blog-left-sidebar">
            <!-- Mobile Sidebar Header -->
            <div class="mobile-sidebar-header mobile-only" style="display: none; justify-content: space-between; align-items: center; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1.5rem;">
              <h3 style="font-family: var(--font-body); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0;">Blog Menu</h3>
              <button id="blog-sidebar-close" style="background: none; border: none; font-size: 1.75rem; color: var(--text-secondary); cursor: pointer; line-height: 1;">&times;</button>
            </div>

            <!-- Profile Card -->
            <div class="sidebar-profile-card">
              <img id="sidebar-user-avatar" class="sidebar-user-avatar" src="https://www.gravatar.com/avatar/?d=mp" alt="Avatar">
              <div class="sidebar-user-details">
                <h4 id="sidebar-user-name" class="sidebar-user-name">Guest User</h4>
                <a href="#" onclick="window.toggleDrawer(true); return false;" class="sidebar-user-link">View Profile</a>
              </div>
            </div>

            <!-- Sidebar Navigation Menu -->
            <div class="sidebar-menu">
              <a href="#" id="menu-home" class="menu-item active" onclick="window.selectMenuTab('home'); return false;"><i class="fa-solid fa-house"></i> Home Feed</a>
              <a href="#" id="menu-trending" class="menu-item" onclick="window.selectMenuTab('trending'); return false;"><i class="fa-solid fa-chart-line"></i> Trending</a>
              <a href="#" id="menu-myposts" class="menu-item" onclick="window.selectMenuTab('myposts'); return false;"><i class="fa-solid fa-file-invoice"></i> My Posts</a>
              <a href="#" id="menu-saved" class="menu-item" onclick="window.selectMenuTab('saved'); return false;"><i class="fa-solid fa-bookmark"></i> Saved Articles</a>
              <a href="#" id="menu-messages" class="menu-item" onclick="window.toggleChatDrawer(true); return false;"><i class="fa-solid fa-comments"></i> Messages <span class="badge" id="chat-badge-count">0</span></a>
              <a href="#" id="menu-following" class="menu-item" onclick="window.selectMenuTab('following'); return false;"><i class="fa-solid fa-user-group"></i> Following</a>
              <a href="#" id="menu-notifications" class="menu-item" onclick="window.showNotifications(); return false;"><i class="fa-solid fa-bell"></i> Notifications <span class="badge badge-accent" style="display: none;">0</span></a>
            </div>

            <!-- Categories Section -->
            <div class="sidebar-categories-section">
              <span class="sidebar-label">Categories</span>
              <div id="sidebar-categories-list" class="sidebar-categories-list">
                <!-- populated dynamically -->
              </div>
              <button class="btn btn-outline btn-create-category" onclick="window.createCategoryPrompt()" style="width:100%; border-radius:30px; font-size:0.8rem; margin-top: 1rem; border-color: var(--border-color); font-weight:700;"><i class="fa-solid fa-plus"></i> Create Category</button>
            </div>
          </aside>
          
          <!-- CENTER COLUMN: Feed & Composer -->
          <div class="blog-center-feed">
            <!-- Mobile Feed Controls -->
            <div class="mobile-feed-controls mobile-only" style="display: none; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; gap: 1rem;">
              <button class="btn btn-outline" id="blog-sidebar-toggle" style="flex: 1; justify-content: center; font-weight: 700; border-radius: 30px; font-size: 0.85rem; padding: 0.6rem 1.25rem; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-filter"></i> Categories &amp; Feed Menu</button>
            </div>
            <!-- Composer Card -->
            <div class="feed-composer-card" id="feed-composer-card">
              <div class="composer-top-row">
                <img id="composer-user-avatar" class="composer-user-avatar" src="https://www.gravatar.com/avatar/?d=mp" alt="">
                <div class="composer-input-wrap">
                  <h4 id="composer-greeting" class="composer-greeting">What's on your mind, Guest?</h4>
                  <textarea id="composer-placeholder-input" class="composer-placeholder-input" placeholder="Share your thoughts..." readonly onclick="window.toggleDrawer(true, 'write')"></textarea>
                </div>
              </div>
              <div class="composer-actions-row">
                <button class="composer-action-btn" onclick="window.toggleDrawer(true, 'write')"><i class="fa-solid fa-pen-to-square"></i> Write Article</button>
                <button class="composer-action-btn" onclick="window.toggleDrawer(true, 'write')"><i class="fa-solid fa-arrow-up-from-bracket"></i> Upload</button>
                <button class="composer-action-btn" onclick="window.toggleDrawer(true, 'write')"><i class="fa-solid fa-square-poll-horizontal"></i> Poll</button>
              </div>
            </div>

            <!-- Main Post list feed -->
            <div id="dynamic-blogs-container"></div>
          </div>

          <!-- RIGHT COLUMN: Widgets -->
          <aside class="blog-right-sidebar">
            <!-- Trending Topics -->
            <div class="right-widget-card">
              <div class="widget-header">
                <h3 class="widget-title"><i class="fa-solid fa-fire" style="color: var(--brand-cta);"></i> Trending Topics</h3>
                <a href="#" class="widget-link">View all</a>
              </div>
              <div class="trending-topics-list">
                <div class="trending-topic-item" onclick="window.selectCategory('Marketing'); return false;">
                  <div class="topic-left">
                    <span class="topic-hashtag"># Marketing Strategy</span>
                    <i class="fa-solid fa-arrow-trend-up topic-trend-icon"></i>
                  </div>
                  <span class="topic-stats">1.2k posts</span>
                </div>
                <div class="trending-topic-item" onclick="window.selectCategory('Marketing'); return false;">
                  <div class="topic-left">
                    <span class="topic-hashtag"># Lead Generation</span>
                    <i class="fa-solid fa-arrow-trend-up topic-trend-icon"></i>
                  </div>
                  <span class="topic-stats">980 posts</span>
                </div>
                <div class="trending-topic-item" onclick="window.selectCategory('SEO'); return false;">
                  <div class="topic-left">
                    <span class="topic-hashtag"># Content Marketing</span>
                    <i class="fa-solid fa-arrow-trend-up topic-trend-icon"></i>
                  </div>
                  <span class="topic-stats">870 posts</span>
                </div>
                <div class="trending-topic-item" onclick="window.selectCategory('Branding'); return false;">
                  <div class="topic-left">
                    <span class="topic-hashtag"># Branding</span>
                    <i class="fa-solid fa-arrow-trend-up topic-trend-icon"></i>
                  </div>
                  <span class="topic-stats">650 posts</span>
                </div>
                <div class="trending-topic-item" onclick="window.selectCategory('AI & Tech'); return false;">
                  <div class="topic-left">
                    <span class="topic-hashtag"># AI in Marketing</span>
                    <i class="fa-solid fa-arrow-trend-up topic-trend-icon"></i>
                  </div>
                  <span class="topic-stats">540 posts</span>
                </div>
              </div>
            </div>

            <!-- Top Writers -->
            <div class="right-widget-card">
              <div class="widget-header">
                <h3 class="widget-title"><i class="fa-solid fa-star" style="color: var(--brand-cta);"></i> Top Writers</h3>
                <a href="#" class="widget-link">View all</a>
              </div>
              <div class="top-writers-list">
                <p style="color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;">Available Soon (Count: 0)</p>
              </div>
            </div>

            <!-- Popular Posts -->
            <div class="right-widget-card">
              <div class="widget-header">
                <h3 class="widget-title"><i class="fa-solid fa-chart-line" style="color: var(--brand-primary);"></i> Popular Posts</h3>
                <a href="#" class="widget-link">View all</a>
              </div>
              <div class="popular-posts-list">
                <p style="color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;">Available Soon (Count: 0)</p>
              </div>
            </div>

            <!-- Active Community -->
            <div class="right-widget-card">
              <div class="widget-header">
                <h3 class="widget-title"><i class="fa-solid fa-user-group" style="color: var(--brand-primary);"></i> Active Community</h3>
              </div>
              <div class="active-community-status">
                <span class="online-indicator-dot" style="display: none;"></span> 0 online now
              </div>
              <div class="active-community-avatars">
              </div>
              <button class="btn btn-primary btn-open-chat-large" onclick="window.toggleChatDrawer(true); return false;" style="width: 100%; border-radius: 30px; margin-top: 1rem; font-weight:700;"><i class="fa-solid fa-comments"></i> Open Chat</button>
            </div>
          </aside>
          
        </div>
      </div>
    </section>
          
        </div>
      </div>
    </section>

    <!-- SLIDING DRAWER BACKDROP -->
    <div id="drawer-backdrop" class="drawer-backdrop" onclick="window.toggleDrawer(false)"></div>

    <!-- SLIDING EDITOR & AUTH DRAWER -->
    <div id="editor-drawer" class="editor-drawer">
      <div class="editor-drawer-header">
        <h2 id="drawer-title" class="editor-drawer-title"><i class="fa-solid fa-feather-pointed" style="color: var(--accent);"></i> Dashboard</h2>
        <button type="button" class="editor-drawer-close" onclick="window.toggleDrawer(false)">&times;</button>
      </div>

      <!-- Auth state and Dashboard Panel -->
      <div id="blog-auth-section" style="position: relative; flex-grow: 1;">
        
        <!-- GUEST VIEW: Google + Email/Password forms -->
        <div id="guest-auth-container" style="display: block;">
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            
            <!-- Top panel: Social Sign-In Promo -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem;">
              <p style="color: var(--text-secondary); margin: 0; font-size: 0.92rem; line-height: 1.6;">Share your strategy, marketing frameworks, and creative stories. Login instantly to write, edit, and publish your posts.</p>
              <button id="google-login-btn" class="btn btn-secondary" style="padding: 0.75rem 1.5rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; border-radius: 30px; justify-content: center; margin-top: 0.5rem;"><i class="fa-brands fa-google"></i> Sign In with Google</button>
              <button id="phone-login-toggle-btn" class="btn btn-outline" style="padding: 0.75rem 1.5rem; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; border-radius: 30px; justify-content: center; border-color: var(--border-color);"><i class="fa-solid fa-mobile-screen-button"></i> Sign In with Phone OTP</button>
              
              <!-- DB Fallback Selector widget -->
              <div style="margin-top: 1rem; padding: 0.85rem; background: rgba(214, 173, 45, 0.04); border: 1px dashed var(--border-color); border-radius: var(--radius-soft); text-align: center;" id="db-mode-selector-wrap">
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin: 0 0 0.5rem 0; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <i class="fa-solid fa-database" style="color: var(--accent);"></i> Connection: <strong id="db-mode-status" style="color: var(--text-primary);">Real Firebase</strong>
                </p>
                <button type="button" id="toggle-db-mode-btn" class="btn btn-outline" style="min-height: unset; padding: 0.4rem 1rem; font-size: 0.72rem; border-radius: 30px; font-weight: 700; width: 100%; border-color: var(--border-color);"><i class="fa-solid fa-rotate"></i> Switch to Mock Demo</button>
              </div>
            </div>
            
            <!-- Bottom panel: Email Sign-In / Register / Phone OTP Forms -->
            <div>
              <!-- Toggle mode header -->
              <div id="email-auth-header" style="display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
                <button type="button" id="auth-mode-signin" style="background: none; border: none; color: var(--accent); font-weight: 700; font-size: 1rem; cursor: pointer; padding-bottom: 4px; border-bottom: 2px solid var(--accent);">Sign In</button>
                <button type="button" id="auth-mode-signup" style="background: none; border: none; color: var(--text-secondary); font-weight: 600; font-size: 1rem; cursor: pointer; padding-bottom: 4px;">Register</button>
              </div>
              
              <!-- Email/Password Auth Form -->
              <form id="email-auth-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Sign Up fields (Only visible when Register is active) -->
                <div id="signup-extra-fields" style="display: none; flex-direction: column; gap: 1rem;">
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="auth-name" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Full Name *</label>
                    <input id="auth-name" placeholder="Type your name" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                  </div>
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="auth-company-input" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Company Name *</label>
                    <input id="auth-company-input" placeholder="e.g. Acme Corp" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                  </div>
                </div>
                
                <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                  <label for="auth-email" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Email Address *</label>
                  <input id="auth-email" type="email" required placeholder="name@company.com" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                </div>
                <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label for="auth-password" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Password *</label>
                    <button type="button" id="forgot-password-btn" style="background: none; border: none; color: var(--accent); font-size: 0.8rem; cursor: pointer; font-weight: 600; padding: 0;">Forgot Password?</button>
                  </div>
                  <input id="auth-password" type="password" required placeholder="••••••••" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                </div>
                
                <button type="submit" id="auth-submit-btn" class="btn btn-primary" style="padding: 0.65rem; font-weight: 700; width: 100%; margin-top: 0.5rem; border-radius: 30px;">Sign In</button>
                
                <!-- Mode Switch Text Link -->
                <p id="auth-mode-switch-p" style="font-size: 0.85rem; color: var(--text-secondary); text-align: center; margin-top: 0.75rem; margin-bottom: 0;">
                  Don't have an account? <a href="#" id="auth-switch-link" style="color: var(--accent); font-weight: 700; text-decoration: none;">Register Now</a>
                </p>
              </form>

              <!-- Phone OTP Auth Form -->
              <form id="phone-auth-form" style="display: none; flex-direction: column; gap: 1rem;">
                <div style="display: flex; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 0.25rem;">
                  <h3 style="font-size: 1.1rem; color: var(--accent); margin: 0; font-weight: 700;">Phone OTP Sign In / Register</h3>
                </div>

                <!-- Details Group (For Profile updates) -->
                <div id="phone-details-group" style="display: flex; flex-direction: column; gap: 1rem;">
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="auth-phone-name" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Full Name *</label>
                    <input id="auth-phone-name" placeholder="Type your name" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                  </div>
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="auth-phone-company" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Company Name *</label>
                    <input id="auth-phone-company" placeholder="e.g. Acme Corp" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                  </div>
                </div>
                
                <!-- Phone Input Group -->
                <div id="phone-input-group" style="display: flex; flex-direction: column; gap: 1rem;">
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="auth-phone" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">Phone Number (with country code, e.g., +91XXXXXXXXXX) *</label>
                    <input id="auth-phone" type="tel" required placeholder="+91 880863659" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem;">
                  </div>
                  <!-- Recaptcha Container -->
                  <div id="recaptcha-container" style="margin: 0.25rem 0;"></div>
                  <button type="button" id="send-otp-btn" class="btn btn-primary" style="padding: 0.65rem; font-weight: 700; width: 100%; border-radius: 30px;">Send Verification SMS</button>
                </div>

                <!-- OTP Code Input Group -->
                <div id="otp-input-group" style="display: none; flex-direction: column; gap: 1rem;">
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="auth-otp" style="color: var(--text-primary); font-size: 0.85rem; font-weight: 600;">6-Digit Verification Code *</label>
                    <input id="auth-otp" type="text" placeholder="123456" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem; text-align: center; letter-spacing: 0.4rem; font-size: 1.25rem; font-weight: 700;">
                  </div>
                  <button type="submit" id="verify-otp-btn" class="btn btn-primary" style="padding: 0.65rem; font-weight: 700; width: 100%; border-radius: 30px;">Verify & Sign In</button>
                </div>

                <p style="font-size: 0.85rem; color: var(--text-secondary); text-align: center; margin-top: 0.5rem; margin-bottom: 0;">
                  Use another method? <a href="#" id="phone-switch-to-email-link" style="color: var(--accent); font-weight: 700; text-decoration: none;">Use Email/Password</a>
                </p>
              </form>
            </div>
            
          </div>
        </div>
        
        <!-- LOGGED-IN AUTHOR VIEW: Dashboard Tabs -->
        <div id="user-dashboard-container" style="display: none;">
          <!-- Premium Creator Profile Card (Drawer Style) -->
          <div class="creator-profile-card" style="grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
            <div class="profile-avatar-wrap" style="flex-direction: row; text-align: left; gap: 1rem; align-items: center; width: 100%;">
              <img id="dash-avatar" src="https://www.gravatar.com/avatar/?d=mp" class="profile-avatar-img" style="width: 70px; height: 70px; border-width: 2px;" alt="">
              <div>
                <h3 id="dash-name" style="margin: 0; font-size: 1.3rem; color: var(--text-primary); font-weight: 700; line-height: 1.2;">Author Name</h3>
                <span class="profile-badge" style="margin-top: 4px; font-size: 0.65rem;">Creative Partner</span>
              </div>
            </div>
            <div class="profile-details-wrap" style="gap: 1rem; width: 100%;">
              <div>
                <p id="dash-meta" style="color: var(--brand-primary); font-weight: 600; font-size: 0.85rem; margin: 0 0 0.5rem 0;">Company Name &bull; Email</p>
                <p id="dash-bio" style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.5; margin: 0; font-style: italic;">Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.</p>
              </div>
              
              <!-- Stats grid -->
              <div class="profile-stats-grid" style="grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
                <div class="profile-stat-badge" style="padding: 0.5rem 0.25rem;">
                  <div id="stat-posts-count" class="profile-stat-val" style="font-size: 1.3rem;">0</div>
                  <div class="profile-stat-label" style="font-size: 0.6rem;">Total Posts</div>
                </div>
                <div class="profile-stat-badge" style="padding: 0.5rem 0.25rem;">
                  <div id="stat-likes-count" class="profile-stat-val" style="font-size: 1.3rem;">0</div>
                  <div class="profile-stat-label" style="font-size: 0.6rem;">Likes Received</div>
                </div>
                <div class="profile-stat-badge" style="padding: 0.5rem 0.25rem;">
                  <div class="profile-stat-val" style="font-size: 1.3rem;">Weekly</div>
                  <div class="profile-stat-label" style="font-size: 0.6rem;">Trending Active</div>
                </div>
              </div>

              <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; width: 100%;">
                <button type="button" id="edit-bio-toggle-btn" class="btn btn-outline" style="flex: 1; padding: 0.4rem 1rem; font-size: 0.8rem; min-height: unset; border-radius: 30px; font-weight: 700; border-color: var(--border-color);"><i class="fa-solid fa-user-pen"></i> Edit Profile</button>
                <button id="dashboard-logout-btn" class="btn btn-outline" style="flex: 1; padding: 0.4rem 1rem; font-size: 0.8rem; min-height: unset; border-radius: 30px; font-weight: 700; color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2);">Sign Out</button>
              </div>
            </div>
          </div>

          <!-- Profile Info Editor (Initially Collapsed) -->
          <div id="edit-profile-fields-wrap" style="display: none; margin-bottom: 1.5rem;">
            <form id="edit-profile-form" style="max-width: 100%; padding: 1.5rem; background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-soft);">
              <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem; color: var(--text-primary);">Update Your Profile Info</h3>
              <div class="edit-profile-fields" style="grid-template-columns: 1fr; padding: 0; background: none; border: none;">
                <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                  <label for="edit-profile-name" style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">Display Name</label>
                  <input id="edit-profile-name" placeholder="Name" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); padding: 0.55rem; font-size: 0.85rem;">
                </div>
                <div class="field" style="margin: 1rem 0 0 0; display: flex; flex-direction: column; gap: 0.4rem;">
                  <label for="edit-profile-company" style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">Company / Role</label>
                  <input id="edit-profile-company" placeholder="e.g. Writer / Independent" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); padding: 0.55rem; font-size: 0.85rem;">
                </div>
              </div>
              <div class="field" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="edit-profile-bio" style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">Short Bio</label>
                <textarea id="edit-profile-bio" placeholder="Write a short description..." rows="2" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); padding: 0.55rem; font-size: 0.85rem; font-family: inherit; resize: vertical;"></textarea>
              </div>
              <div class="field" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.4rem;">
                <label for="edit-profile-interests" style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">Interests / Keywords (comma separated, e.g. SEO, Poetry, AI)</label>
                <input id="edit-profile-interests" placeholder="SEO, Poetry, AI" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); padding: 0.55rem; font-size: 0.85rem;">
              </div>
              <div style="display: flex; gap: 1rem; margin-top: 1.25rem;">
                <button type="submit" class="btn btn-primary" style="padding: 0.45rem 1.25rem; border-radius: 30px; font-size: 0.8rem; font-weight: 700;">Save Details</button>
                <button type="button" id="edit-profile-cancel-btn" class="btn btn-outline" style="padding: 0.45rem 1.25rem; border-radius: 30px; font-size: 0.8rem; font-weight: 700;">Cancel</button>
              </div>
            </form>
          </div>
          
          <!-- Dashboard Navigation Tabs -->
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <button id="tab-btn-write" class="btn btn-primary" style="flex: 1; padding: 0.45rem 1.25rem; font-size: 0.85rem; min-height: unset; border-radius: 30px; font-weight: 700;"><i class="fa-solid fa-pen-to-square"></i> Write Post</button>
            <button id="tab-btn-manage" class="btn btn-secondary" style="flex: 1; padding: 0.45rem 1.25rem; font-size: 0.85rem; min-height: unset; border-radius: 30px; font-weight: 700; background: var(--soft); border-color: var(--line); color: var(--text-secondary);"><i class="fa-solid fa-list"></i> My Posts (<span id="my-posts-count">0</span>)</button>
          </div>
          
          <!-- Tab Contents -->
          <div>
            
            <!-- Tab 1: Write Blog Form -->
            <div id="tab-content-write" style="display: block;">
              <form id="write-blog-form">
                <h3 id="form-heading" style="font-size: 1.1rem; color: var(--text-primary); margin: 0 0 1rem 0; font-weight: 700;">Publish a New Post</h3>
                <input type="hidden" id="editing-doc-id" value="">
                
                <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.25rem;">
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="blog-title" style="color: var(--text-primary); font-weight: 600; font-size: 0.85rem;">Title *</label>
                    <input id="blog-title" required placeholder="The future of search engines..." style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem; font-size: 0.88rem;">
                  </div>
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="blog-category" style="color: var(--text-primary); font-weight: 600; font-size: 0.85rem;">Category *</label>
                    <select id="blog-category" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem; font-size: 0.88rem; cursor: pointer;">
                      <option value="Blog">Blog</option>
                      <option value="Story">Story</option>
                      <option value="Poetry">Poetry</option>
                      <option value="Article">Article</option>
                      <option value="Other">Other</option>
                      <option value="SEO">SEO</option>
                      <option value="AI Marketing">AI Marketing</option>
                      <option value="Meta Ads">Meta Ads</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Branding">Branding</option>
                      <option value="Strategy">Strategy</option>
                    </select>
                  </div>
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="blog-visibility" style="color: var(--text-primary); font-weight: 600; font-size: 0.85rem;">Visibility *</label>
                    <select id="blog-visibility" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem; font-size: 0.88rem; cursor: pointer;">
                      <option value="Public">Public</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="blog-company" style="color: var(--text-primary); font-weight: 600; font-size: 0.85rem;">Display Role/Company *</label>
                    <input id="blog-company" required placeholder="Acme Corp / Writer" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem; font-size: 0.88rem;">
                  </div>
                  <div class="field" style="margin: 0; display: flex; flex-direction: column; gap: 0.4rem;">
                    <label for="blog-image" style="color: var(--text-primary); font-weight: 600; font-size: 0.85rem;">Cover Image (Optional)</label>
                    <input id="blog-image" type="file" accept="image/*" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.5rem; font-size: 0.85rem;">
                    <span id="image-size-error" style="color: #ff4d4d; font-size: 0.78rem; display: none; margin-top: 4px; font-weight: 700;">File size exceeds 1MB. Please choose a smaller image.</span>
                  </div>
                </div>

                <div class="field" style="margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem;">
                  <label for="blog-content" style="color: var(--text-primary); font-weight: 600; font-size: 0.85rem;">Content *</label>
                  <textarea id="blog-content" required placeholder="Write content here..." rows="8" style="width: 100%; border-radius: var(--radius-soft); background: var(--soft); border: 1px solid var(--border-color); color: var(--text-primary); padding: 0.65rem; font-size: 0.88rem; font-family: inherit; line-height: 1.6; resize: vertical;"></textarea>
                </div>
                
                <div id="image-preview-wrap" style="display: none; margin-bottom: 1.25rem; border: 1px solid var(--border-color); border-radius: var(--radius-soft); overflow: hidden; max-width: 200px; aspect-ratio: 16/9;">
                  <img id="image-preview" src="" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;">
                </div>

                <div style="display: flex; gap: 1rem;">
                  <button type="submit" id="submit-blog-btn" class="btn btn-primary" style="padding: 0.55rem 1.5rem; font-weight: 900; border-radius: 30px; font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> Publish Post</button>
                  <button type="button" id="cancel-write-btn" class="btn btn-outline" onclick="window.toggleDrawer(false)" style="padding: 0.55rem 1.5rem; border-radius: 30px; font-size: 0.85rem;">Cancel</button>
                </div>
              </form>
            </div>
            
            <!-- Tab 2: Manage My Blogs List -->
            <div id="tab-content-manage" style="display: none;">
              <h3 style="font-size: 1.1rem; color: var(--text-primary); margin: 0 0 1rem 0; font-weight: 700;">Manage Your Published Posts</h3>
              
              <div style="overflow-x: auto; width: 100%; border-radius: var(--radius-soft); border: 1px solid var(--border-color);">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                  <thead>
                    <tr style="background: var(--soft); border-bottom: 1px solid var(--border-color); color: var(--text-primary);">
                      <th style="padding: 0.75rem 1rem; font-weight: 700;">Title</th>
                      <th style="padding: 0.75rem 1rem; font-weight: 700;">Category</th>
                      <th style="padding: 0.75rem 1rem; font-weight: 700; text-align: center;">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="my-blogs-table-body" style="color: var(--text-secondary);">
                    <tr>
                      <td colspan="3" style="padding: 1.5rem; text-align: center; color: var(--text-secondary);">No posts published yet.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
          </div>
      </div>
    </div>

    <!-- CHAT DRAWER BACKDROP -->
    <div id="chat-drawer-backdrop" class="chat-drawer-backdrop" onclick="window.toggleChatDrawer(false)"></div>

    <!-- LEFT SIDE CHAT DRAWER -->
    <div id="chat-drawer" class="chat-drawer">
      <div class="chat-drawer-header">
        <h3 class="chat-drawer-title"><i class="fa-solid fa-comments" style="color: var(--brand-primary);"></i> Messages</h3>
        <button type="button" class="chat-drawer-close" onclick="window.toggleChatDrawer(false)">&times;</button>
      </div>
      <div class="chat-drawer-body">
        <!-- View 1: List of Active Chat Rooms -->
        <div id="chat-rooms-view" class="chat-rooms-view">
          <p style="text-align: center; color: var(--text-secondary); font-size: 0.88rem; margin: 2rem 0;">No active conversations yet.</p>
        </div>
        
        <!-- View 2: Active Chat Conversation Feed -->
        <div id="chat-conversation-view" class="chat-conversation-view">
          <div class="chat-conversation-header">
            <button id="chat-back-btn" class="btn btn-outline" style="min-height: unset; padding: 0.35rem 0.75rem; font-size: 0.75rem; border-radius: 30px;" type="button">
              <i class="fa-solid fa-arrow-left"></i> Rooms
            </button>
            <div id="chat-recipient-avatar-wrap">
              <img id="chat-recipient-avatar" class="chat-room-avatar" src="https://www.gravatar.com/avatar/?d=mp" alt="">
            </div>
            <span id="chat-recipient-name" class="chat-conversation-title">Recipient Name</span>
          </div>
          <div id="chat-messages-feed" class="chat-messages-feed">
            <!-- Messages render here -->
          </div>
          <form id="chat-input-form" class="chat-input-area">
            <input id="chat-message-input" autocomplete="off" class="chat-input-field" placeholder="Type a message...">
            <button type="submit" class="chat-send-btn" aria-label="Send message">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- 4-STEP LOGOUT CONFIRMATION MODAL -->
    <div id="logout-modal-backdrop" class="logout-modal-backdrop">
      <div class="logout-modal-card">
        <!-- Step Progress Indicator -->
        <div class="logout-step-indicator">
          <div class="logout-step-progress-line">
            <div id="logout-progress-fill" class="logout-step-progress-fill"></div>
          </div>
          <div class="logout-step-dot active" data-step="1">1</div>
          <div class="logout-step-dot" data-step="2">2</div>
          <div class="logout-step-dot" data-step="3">3</div>
          <div class="logout-step-dot" data-step="4">4</div>
        </div>

        <!-- Step Content Wizard -->
        <div id="logout-step-content" class="logout-step-content">
          <!-- Dynamically populated in script.js -->
        </div>

        <!-- Actions -->
        <div class="logout-modal-actions">
          <button id="logout-cancel-btn" class="btn btn-outline" style="border-radius: 30px; font-weight: 700; flex: 1;" type="button">Cancel</button>
          <button id="logout-next-btn" class="btn btn-primary" style="border-radius: 30px; font-weight: 700; flex: 1;" type="button">Next Step</button>
        </div>
      </div>
    </div>

    <!-- PROFILE VIEW MODAL -->
    <div id="profile-modal-backdrop" class="profile-modal-backdrop" onclick="window.closeProfileModal()" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 2000; align-items: center; justify-content: center; padding: 1rem; box-sizing: border-box;">
      <div class="profile-modal-card" onclick="event.stopPropagation()" style="background: var(--bg-secondary); border: 1px solid var(--border-color); width: 440px; max-width: 100%; border-radius: 16px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); overflow: hidden; display: flex; flex-direction: column; position: relative;">
        <!-- Close Button -->
        <button class="profile-modal-close" onclick="window.closeProfileModal()" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; line-height: 1; transition: var(--transition-smooth); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%;" onmouseover="this.style.background='var(--soft)'" onmouseout="this.style.background='none'">&times;</button>
        
        <!-- Header background / design -->
        <div style="height: 100px; background: linear-gradient(135deg, var(--brand-primary) 0%, #121212 100%); opacity: 0.85;"></div>
        
        <!-- User Info Card content -->
        <div style="padding: 0 2rem 2rem 2rem; margin-top: -50px; text-align: center; display: flex; flex-direction: column; align-items: center;">
          <img id="profile-modal-avatar" src="https://www.gravatar.com/avatar/?d=mp" alt="Avatar" style="width: 100px; height: 100px; border-radius: 50%; border: 4px solid var(--bg-secondary); background: var(--bg-secondary); object-fit: cover; box-shadow: 0 10px 20px rgba(0,0,0,0.3); margin-bottom: 1rem;">
          
          <h3 id="profile-modal-name" style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--text-primary); font-weight: 700; margin: 0 0 0.25rem 0;">Creator Name</h3>
          <p id="profile-modal-email" style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 1.25rem 0; font-family: var(--font-body); font-weight: 500; word-break: break-all; opacity: 0.8;"></p>
          
          <div id="profile-modal-bio-container" style="border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); padding: 1.25rem 0; width: 100%; margin-bottom: 1.5rem; text-align: left;">
            <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); display: block; margin-bottom: 0.35rem; font-weight: 700;">Bio &amp; Interests</span>
            <div id="profile-modal-bio" style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.5; font-style: italic;">No bio written.</div>
          </div>
          
          <!-- Actions Container -->
          <div id="profile-modal-actions" style="width: 100%;">
            <!-- Loaded dynamically in script.js -->
          </div>
        </div>
      </div>
    </div>
  </main>
"""
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="blog") + body_html + HTML_FOOTER
    with open(filename, "w", encoding="utf-8") as f:
        f.write(full_content)
    print("Generated blog.html")

def generate_contact_page():
    filename = "contact.html"
    title = "Contact | JABZEN | Creative Marketing Freelancer"
    desc = "Schedule a free consultation call with JABZEN to design your branding, ad creative, and search systems."
    
    body_html = """  <main id="main">
    <section class="page-hero">
      <div class="container">
        <h1>Let's Work Together to Scale Your Brand Authority, Optimize Paid Ads, and Dominate Organic Search Rankings</h1>
        <p class="lead" style="text-align: left; margin-top: 1.5rem; max-width: 800px; color: var(--text-secondary);">Schedule a free consultation call to discuss your search presence, Google/Meta Ads, or creative video production strategy.</p>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <p class="eyebrow">Get In Touch</p>
          <h2>Direct Communication Channels For Rapid Scaling And Project Onboarding</h2>
          <p class="lead" style="text-align: left; margin-top: 1rem; color: var(--text-secondary);">We serve global clients with high-velocity marketing pipelines. Reach out via WhatsApp or submit the form for replies.</p>
          <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; color: var(--text-primary);">
            <div><strong><i class="fa-solid fa-phone" style="color: var(--accent); margin-right: 8px;"></i> Phone / WhatsApp:</strong> <a href="https://wa.me/91880863659" style="color: var(--accent); font-weight: 700;">+91 880863659</a></div>
            <div><strong><i class="fa-solid fa-envelope" style="color: var(--accent); margin-right: 8px;"></i> Email:</strong> info@jabzen.com</div>
            <div><strong><i class="fa-solid fa-location-dot" style="color: var(--accent); margin-right: 8px;"></i> Location:</strong> India (Global Delivery)</div>
          </div>
        </div>
        <form class="form-wrap" data-lead-form>
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="Type your name">
            </div>
            <div class="field">
              <label for="lead-phone">Phone Number</label>
              <input id="lead-phone" name="phone" type="tel" autocomplete="tel" required placeholder="+91 99999 99999">
            </div>
          </div>
          <button class="btn btn-primary" type="submit" style="width: 100%; margin-top: 1.5rem;">Book Free Consultation</button>
          <p class="success-message" data-success-message style="color: var(--accent); font-weight: 700; margin-top: 1rem; text-align: center;">Thanks! Booking consultation call on WhatsApp...</p>
        </form>
      </div>
    </section>
  </main>
"""
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="contact") + body_html + HTML_FOOTER
    with open(filename, "w", encoding="utf-8") as f:
        f.write(full_content)
    print("Generated contact.html")

def generate_about_page():
    filename = "about.html"
    title = "My Story & Jabzen | Abhishek Pratap Singh"
    desc = "The honest story of Abhishek Pratap Singh, founder of Jabzen. How a college conversation in Lucknow survived detours, anxiety, and quiet failures to become a creative storytelling company."
    
    body_html = """  <main id="main">
    <!-- Hero Section / Personal Letter Intro -->
    <section class="about-story-hero" aria-labelledby="about-hero-title">
      <div class="container about-hero-grid">
        <div class="about-hero-copy reveal">
          <span class="eyebrow">The Founder's Story</span>
          <h1 id="about-hero-title">It started with a conversation between friends in Lucknow, back in 2012.</h1>
          <p class="letter-intro">Hello. I'm Abhishek Pratap Singh. Jabzen isn't a massive corporate marketing agency, and it didn't start with a high-tech business roadmap. This is just the honest story of how a college dream survived years of detours, quiet failures, and starting over.</p>
        </div>
        <div class="reveal" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div class="about-hero-image-wrap">
            <img src="assets/founder.png" alt="Abhishek Pratap Singh, Founder of JABZEN" fetchpriority="high">
          </div>
          <div class="handwritten-quote-card">
            &ldquo;Jabzen is not the story of someone who had everything figured out. It is the story of someone who kept moving, even when he didn't.&rdquo;
          </div>
        </div>
      </div>
    </section>

    <!-- The Personal Letter Section -->
    <section class="personal-letter-section secondary-bg">
      <div class="container letter-container reveal">
        <div class="letter-body">
          <p>Dear Friend,</p>
          
          <p>If I look back, the roots of Jabzen go back to the years between 2012 and 2015, during my college days at Shri Ramswaroop in Lucknow. Back then, there were three of us—three close friends, including myself—who would sit together and talk for hours about doing something of our own. We dreamed of building a creative space, designing, writing, and creating something that truly mattered. We didn't have a corporate roadmap or a business plan; we just had a shared enthusiasm. That conversation was the seed.</p>
          
          <p>The monogram logo we use today carries that memory. It is based on a picture taken with my two friends during those college days at Shri Ramswaroop. I designed the logo as a tribute to the three of us and those early dreams. Even though life took us in different directions and our paths evolved, the spirit of those conversations never left me. The logo is still there to remind me of where I started, and to keep that shared dream alive.</p>
          
          <p>After college, things got complicated. The dreams we had in college didn't match the reality of bills, jobs, and career detours. I went through years of uncertainty. I failed multiple times—not the kind of big, dramatic failures you read about in startup blogs, but the quiet, frustrating kind. Projects that quietly fizzled out, clients that walked away, and ideas that never got off the ground. The kind of setbacks many people experience but rarely talk about openly.</p>
          
          <p>There were months of feeling completely lost, struggling with anxiety, and wondering if I was just wasting my time. I lost my confidence more times than I care to admit. But through all those phases—the jobs I didn't want and the times I felt like giving up—the idea of Jabzen stayed in the back of my mind. It didn't shout for attention. It was just always there, refusing to go away.</p>
          
          <div class="letter-signature">
            <span>Sincerely,</span>
            <span class="handwritten-signature">Abhishek Pratap Singh</span>
            <span class="role">Founder, Jabzen &bull; Lucknow, India</span>
            <a href="https://www.linkedin.com/in/abhishek-pratap-singh-46549221b/" target="_blank" rel="noopener" style="font-size: 0.82rem; color: var(--brand-primary); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-top: 6px; font-family: var(--font-body); font-weight: 600;">
              <i class="fa-brands fa-linkedin"></i> Connect on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline of The Long Road -->
    <section class="section" aria-labelledby="timeline-heading">
      <div class="container" style="max-width: 900px;">
        <div class="services-intro reveal" style="text-align: center; margin: 0 auto 3rem;">
          <span class="eyebrow">The Timeline</span>
          <h2 id="timeline-heading">A few milestones and failures along the way</h2>
          <p style="color: var(--text-secondary); margin-top: 1rem;">Setbacks are the quieter parts of the journey that forge resilience.</p>
        </div>
        
        <div class="timeline-container reveal">
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-year">2012 &ndash; 2015</div>
            <div class="timeline-title">Lucknow College Days</div>
            <div class="timeline-desc">Conversations with friends at Shri Ramswaroop, Lucknow, talking about starting something of our own. The monogram logo was created in memory of that time and that picture.</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-year">2016 &ndash; 2020</div>
            <div class="timeline-title">The Detours &amp; Real Life</div>
            <div class="timeline-desc">Trying different jobs, facing career setbacks, and learning how hard it is to build something from scratch. Quiet failures where plans simply didn't work out.</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-year">2021 &ndash; 2024</div>
            <div class="timeline-title">Quiet Struggles &amp; Persistence</div>
            <div class="timeline-desc">Dealing with anxiety, doubts, and quiet failures. The project remains alive, waiting in the background as a constant spark of hope.</div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-year">2025 &ndash; Present</div>
            <div class="timeline-title">Building Jabzen</div>
            <div class="timeline-desc">Finally bringing the dream into the real world as a creative marketing and storytelling partner, helping other brands tell their stories honestly.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Belief Section -->
    <section class="section secondary-bg" aria-labelledby="belief-heading" style="padding: 6rem 2rem;">
      <div class="container reveal" style="text-align: center; max-width: 800px;">
        <span class="eyebrow" id="belief-heading">Our Core Belief</span>
        <blockquote style="font-family: var(--font-heading); font-style: italic; font-size: clamp(1.8rem, 3.5vw, 2.6rem); color: var(--text-primary); line-height: 1.35; margin-bottom: 2rem;">
          &ldquo;Human beings connect through stories. Before technology, before algorithms, and before marketing, there were stories. Stories help us understand ourselves, understand each other, and help ideas survive.&rdquo;
        </blockquote>
      </div>
    </section>

    <!-- What We Do Today -->
    <section class="section" aria-labelledby="today-heading">
      <div class="container">
        <div class="philosophy-split reveal">
          <div class="philosophy-left">
            <span class="eyebrow">Current Focus</span>
            <h2 id="today-heading" style="font-size: clamp(2rem, 4vw, 3rem);">What Jabzen Is Today</h2>
          </div>
          <div class="philosophy-right">
            <p style="font-size: 1.1rem; margin-bottom: 1.5rem; color: var(--text-primary);">Today, Jabzen operates as a creative marketing and storytelling company. Our mission is not merely marketing, but helping ideas reach people through clear and aesthetic communication.</p>
            <p>Our focus includes content creation, brand storytelling, digital growth, and educational blogs.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- The Future Is Open -->
    <section class="section secondary-bg" aria-labelledby="future-heading">
      <div class="container">
        <div class="services-intro reveal" style="max-width: 700px; margin-bottom: 3rem;">
          <span class="eyebrow">Possibilities</span>
          <h2 id="future-heading" style="font-size: clamp(2rem, 4vw, 3rem);">The Future is Open</h2>
          <p style="color: var(--text-secondary); margin-top: 1rem;">We don't describe our future plans as promises, but as possibilities. Creativity grows through exploration, and we intentionally keep the future open to new forms of expression:</p>
        </div>
        
        <div class="about-grid-3 reveal">
          <div class="grid-card">
            <h3 class="grid-card-title">Storytelling &amp; Media</h3>
            <p class="grid-card-desc">Ventures into creative productions, short films, media projects, and digital ecosystems that explore storytelling.</p>
          </div>
          <div class="grid-card">
            <h3 class="grid-card-title">Education &amp; Writing</h3>
            <p class="grid-card-desc">Building platforms and content ecosystems designed to share what we have learned about writing and marketing.</p>
          </div>
          <div class="grid-card">
            <h3 class="grid-card-title">Art &amp; Music</h3>
            <p class="grid-card-desc">Music-related creative projects, digital products, and new forms of creative expression that do not yet exist today.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gratitude & Note of Thanks -->
    <section class="section" aria-labelledby="gratitude-heading">
      <div class="container">
        <div class="gratitude-box reveal">
          <span class="eyebrow" id="gratitude-heading">No Journey Is Built Alone</span>
          <h3>A Note of Gratitude</h3>
          <p>I don't believe in the myth of the 'self-made' person. I didn't get here alone. Every single step forward was possible because someone gave me a chance, offered advice, or simply stood by me. I am deeply grateful to my family, my college friends, my mentors, and the clients who trusted me when things were just starting.</p>
          <p>I also acknowledge my deep gratitude toward God—not in a preachy way, but with a quiet sense of humility. Many things happened through grace, timing, and support beyond personal effort alone. Hard work matters, but many blessings cannot be earned alone.</p>
        </div>
      </div>
    </section>

    <!-- Final Reflection Section -->
    <section class="section secondary-bg" style="border-top: 1px solid var(--border-color); padding: 8rem 2rem;">
      <div class="container reveal" style="text-align: center; max-width: 800px;">
        <span class="eyebrow">Final Reflection</span>
        <blockquote style="font-family: var(--font-heading); font-size: clamp(1.4rem, 2.5vw, 2rem); line-height: 1.5; color: var(--text-primary); margin-bottom: 3rem;">
          &ldquo;Jabzen is not the story of someone who had everything figured out. It is the story of someone who kept moving, even when he didn't. A dream that began in a college conversation survived years of uncertainty and eventually found its way back into the real world. This is only the beginning. And for everyone who has been part of the journey &mdash; family, friends, mentors, supporters, and God &mdash; thank you.&rdquo;
        </blockquote>
      </div>
    </section>
  </main>
"""
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="about") + body_html + HTML_FOOTER
    with open(filename, "w", encoding="utf-8") as f:
        f.write(full_content)
    print("Generated about.html")

def minify_css(src, dest):
    import re
    if not os.path.exists(src):
        return
    with open(src, "r", encoding="utf-8") as f:
        content = f.read()
    # Remove comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Remove spaces around selectors and symbols
    content = re.sub(r'\s*([:;{},])\s*', r'\1', content)
    # Remove unnecessary spaces
    content = re.sub(r'\s+', ' ', content)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Minified {src} to {dest}")

def minify_js(src, dest):
    import re
    if not os.path.exists(src):
        return
    with open(src, "r", encoding="utf-8") as f:
        content = f.read()
    # Remove block comments
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    # Strip line comments safely
    lines = []
    for line in content.splitlines():
        trimmed = line.strip()
        if not trimmed or trimmed.startswith("//"):
            continue
        if " //" in line:
            line = line.split(" //")[0]
        lines.append(line.strip())
    # Join and condense spacing
    minified = " ".join(lines)
    minified = re.sub(r'\s+', ' ', minified)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(minified.strip())
    print(f"Minified {src} to {dest}")

def generate_sitemap():
    from datetime import datetime
    today = datetime.today().strftime('%Y-%m-%d')
    urls = [
        ("", "1.0", "daily"),
        ("search-marketing", "0.9", "weekly"),
        ("performance-marketing", "0.9", "weekly"),
        ("creative-services", "0.9", "weekly"),
        ("ai-solutions", "0.9", "weekly"),
        ("about", "0.8", "weekly"),
        ("blog", "0.8", "weekly"),
        ("contact", "0.8", "monthly"),
        ("sitemap", "0.5", "monthly")
    ]
    
    xml = ['<?xml version="1.0" encoding="UTF-8"?>']
    xml.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    
    for url, priority, changefreq in urls:
        loc = f"https://jabzen.com/{url}"
        xml.append('  <url>')
        xml.append(f'    <loc>{loc}</loc>')
        xml.append(f'    <lastmod>{today}</lastmod>')
        xml.append(f'    <changefreq>{changefreq}</changefreq>')
        xml.append(f'    <priority>{priority}</priority>')
        xml.append('  </url>')
        
    xml.append('</urlset>')
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(xml) + "\n")
    print("Generated sitemap.xml")

def generate_sitemap_page():
    filename = "sitemap.html"
    title = "Sitemap & Website Directory | JABZEN | Creative Marketing Freelancer"
    desc = "A complete structural overview and index directory of the JABZEN website, luxury deliverables, and creator insights platform."
    
    body_html = """  <main id="main">
    <section class="page-hero" style="padding: 120px 0 40px; text-align: center; background: var(--bg);">
      <div class="container" style="max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 0 1.5rem;">
        <span class="eyebrow" style="font-size: 0.82rem; letter-spacing: 0.15em; font-weight: 900; color: var(--accent);">Directory Index</span>
        <h1 style="line-height: 1.15; font-size: clamp(2.2rem, 5.5vw, 3.8rem); font-weight: 800; font-family: Poppins, sans-serif; color: var(--text-primary); margin: 0;">Sitemap</h1>
        <p class="lead" style="color: var(--text-secondary); max-width: 600px; margin: 0 auto; line-height: 1.6; text-align: center; font-size: 1.05rem;">A complete structural overview and directory index of the JABZEN website, growth deliverables, and creator insights platform.</p>
      </div>
    </section>

    <section class="section" style="padding: 40px 0 80px;">
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          
          <!-- Category 1: Main Platform Pages -->
          <div class="card" style="padding: 2.5rem; text-align: left; background: var(--card-bg); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);">
            <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--accent); margin-top: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-compass"></i> Core Navigation
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem;">
              <li>
                <a href="./" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Home (Marketing)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Strategic client onboarding, premium case studies, testimonials, and FAQs.</p>
              </li>
              <li>
                <a href="about" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">About (My Story)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">The personal letter, early Lucknow college memories, timeline, and company philosophy.</p>
              </li>
              <li>
                <a href="contact" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Contact (Strategy Booking)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Lead capture consult bookings and direct WhatsApp communication links.</p>
              </li>
            </ul>
          </div>

          <!-- Category 2: Premium Services -->
          <div class="card" style="padding: 2.5rem; text-align: left; background: var(--card-bg); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);">
            <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--accent); margin-top: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-cubes"></i> Growth Services
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem;">
              <li>
                <a href="search-marketing" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Search Marketing (SEO)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Technical SEO, Answer Engine (AEO) and Generative Search (GEO) optimization.</p>
              </li>
              <li>
                <a href="performance-marketing" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Performance Ads</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">High-converting ad funnels, Meta Ads, and dynamic pixel flows.</p>
              </li>
              <li>
                <a href="creative-services" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Creative Production</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Video editing, Reels, brand monographs, and typography guidelines.</p>
              </li>
              <li>
                <a href="ai-solutions" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">AI Marketing Solutions</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Virtual guide presenters, voice cloning, and workflow automations.</p>
              </li>
            </ul>
          </div>

          <!-- Category 3: Insights & Platform -->
          <div class="card" style="padding: 2.5rem; text-align: left; background: var(--card-bg); border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);">
            <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--accent); margin-top: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px;">
              <i class="fa-solid fa-feather-pointed"></i> Creator Insights
            </h3>
            <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1.5rem;">
              <li>
                <a href="blog" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Creator Feed (Blog)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Public feed of marketing updates, story articles, and creative poetry drafts.</p>
              </li>
              <li>
                <a href="blog#write" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Write Article (Dashboard)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Publisher tab, settings options, privacy/visibility settings, and edit actions.</p>
              </li>
              <li>
                <a href="blog#messages" style="font-weight: 700; color: var(--text-primary); text-decoration: none; font-size: 1rem; display: inline-block; margin-bottom: 0.25rem;">Peer Messenger (Chat)</a>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4;">Direct messaging capabilities to chat with other creator authors inline.</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  </main>
"""
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="sitemap") + body_html + HTML_FOOTER
    with open(filename, "w", encoding="utf-8") as f:
        f.write(full_content)
    print("Generated sitemap.html")

def main():
    generate_service_pages()
    generate_blog_page()
    generate_contact_page()
    generate_about_page()
    generate_sitemap_page()
    generate_sitemap()
    minify_css("styles.css", "styles.min.css")
    minify_js("script.js", "script.min.js")
    
    # Cleanup obsolete files that are removed from nav/layout
    old_files = [
        "results.html", "book-strategy-call.html", "services.html",
        "seo.html", "aeo.html", "geo.html", "branding.html", 
        "meta-ads.html", "google-ads.html", "ai-video-creation.html", 
        "reel-creation.html", "content-creation.html"
    ]
    for old_file in old_files:
        if os.path.exists(old_file):
            try:
                os.remove(old_file)
                print(f"Removed obsolete file: {old_file}")
            except Exception as e:
                print(f"Failed to remove {old_file}: {e}")

if __name__ == "__main__":
    main()
