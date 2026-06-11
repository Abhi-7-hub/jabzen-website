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
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="icon" href="assets/favicon.png">
  <link rel="stylesheet" href="styles.min.css?v=10">
  <!-- Firebase Compatibility SDK for App and Firestore -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
</head>
<body class="landing-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <script>
    if (localStorage.getItem("theme") === "light") {{
      document.body.classList.add("light-theme");
    }}
  </script>
  <header class="site-header">
    <nav class="nav" aria-label="Main navigation">
      <a class="brand" href="index.html" aria-label="JABZEN home">
        <span class="brand-mark" style="display: flex; justify-content: center; align-items: center; overflow: hidden; width: 44px; height: 44px;">
          <picture>
            <source srcset="assets/jabzen-logo.webp" type="image/webp">
            <img src="assets/jabzen-logo.png" alt="JABZEN Logo" width="44" height="44" style="width: 100%; height: 100%; object-fit: contain;">
          </picture>
        </span>
        <span>JABZEN<small>Creative Marketing Freelancer</small></span>
      </a>
      <div class="nav-links" data-nav-links>
        <a href="index.html"><i class="fa-solid fa-house"></i> Home</a>
        <div class="nav-dropdown">
          <a href="#" class="dropdown-trigger" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-briefcase"></i> Services <span class="arrow"><i class="fa-solid fa-chevron-down" style="font-size: 0.6rem; margin-left: 2px;"></i></span></a>
          <ul class="dropdown-menu">
            <li><a href="search-marketing.html"><i class="fa-solid fa-magnifying-glass"></i> Search Marketing (SEO, AEO, GEO)</a></li>
            <li><a href="performance-marketing.html"><i class="fa-solid fa-chart-line"></i> Performance Ads & Funnels</a></li>
            <li><a href="creative-services.html"><i class="fa-solid fa-wand-magic-sparkles"></i> Creative Production</a></li>
            <li><a href="ai-solutions.html"><i class="fa-solid fa-robot"></i> AI Marketing Solutions</a></li>
          </ul>
        </div>
        <a href="results.html"><i class="fa-solid fa-chart-simple"></i> Results</a>
        <a href="blog.html"><i class="fa-solid fa-newspaper"></i> Blog</a>
        <a href="contact.html"><i class="fa-solid fa-paper-plane"></i> Contact</a>
      </div>
      <div class="nav-actions">
        <button id="theme-toggle" class="theme-toggle-btn" aria-label="Toggle dark/light mode" type="button"><i class="fa-solid fa-circle-half-stroke"></i></button>
        <a class="btn btn-dark" href="tel:+918840863659" data-call-btn><i class="fa-solid fa-phone"></i> Call Now</a>
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Open menu" aria-expanded="false"><i class="fa-solid fa-bars"></i></button>
      </div>
    </nav>
  </header>
"""

HTML_FOOTER = """
  <!-- Floating social FAB menu bottom right -->
  <div class="social-fab-container" data-social-fab>
    <div class="social-links-expand">
      <a href="https://www.linkedin.com/in/abhishek-pratap-singh-08249624b/" target="_blank" rel="noopener" class="fab-btn linkedin" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
      </a>
      <a href="https://instagram.com/abhishekpratapsinghh" target="_blank" rel="noopener" class="fab-btn instagram" aria-label="Instagram">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a href="https://facebook.com/" target="_blank" rel="noopener" class="fab-btn facebook" aria-label="Facebook">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
      </a>
      <a href="https://twitter.com/" target="_blank" rel="noopener" class="fab-btn twitter" aria-label="Twitter/X">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href="https://youtube.com/" target="_blank" rel="noopener" class="fab-btn youtube" aria-label="YouTube">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      </a>
    </div>
    <a href="https://wa.me/918840863659" target="_blank" rel="noopener" class="fab-main-trigger whatsapp" aria-label="WhatsApp chat">
      <svg class="icon-svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.859 0c3.166.001 6.141 1.233 8.378 3.469 2.237 2.235 3.469 5.21 3.468 8.379-.003 6.534-5.329 11.858-11.86 11.858-2.001-.001-3.97-.508-5.717-1.474L0 24zm6.549-3.238c1.658.983 3.284 1.503 4.909 1.504 5.405 0 9.805-4.394 9.807-9.8.002-2.617-1.013-5.078-2.86-6.928C16.607 3.687 14.15 2.673 11.53 2.673c-5.405 0-9.807 4.394-9.809 9.8-.001 1.83.499 3.613 1.447 5.174l-.953 3.478 3.567-.936c1.554.848 3.023 1.157 4.372 1.157zm12.355-6.702c-.3-.15-1.771-.875-2.046-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-3.519-1.758-5.314-3.717-6.525-5.8-.3-.513.233-.474.723-.974.137-.14.225-.263.292-.375.068-.112.034-.213-.017-.313-.05-.1-.475-1.143-.65-1.562-.171-.41-.363-.356-.5-.356-.1-.004-.217-.004-.334-.004-.117 0-.308.043-.469.22C7.307 4.7 6.8 5.176 6.8 6.161s.717 1.932.817 2.067c.1.135 1.414 2.158 3.424 3.028 1.636.709 2.27.765 3.09.684.514-.05 1.54-.63 1.754-1.24.214-.61.214-1.133.15-1.24-.064-.108-.244-.16-.544-.31z"/>
      </svg>
    </a>
  </div>

  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="index.html">
          <span class="brand-mark" style="display: flex; justify-content: center; align-items: center; width: 44px; height: 44px; margin-bottom: 0.5rem;">
            <picture>
              <source srcset="assets/jabzen-logo.webp" type="image/webp">
              <img src="assets/jabzen-logo.png" alt="JABZEN Logo" width="44" height="44" style="width: 100%; height: 100%; object-fit: contain;">
            </picture>
          </span>
          <span>JABZEN<small>Creative Marketing Freelancer</small></span>
        </a>
        <p style="margin-top:1rem; font-size: 0.9rem; line-height: 1.5;">Helping brands scale through luxury visual branding, direct-response ad creative, SEO, and performance marketing.</p>
      </div>
      <div>
        <h3>Pages</h3>
        <ul>
          <li><a href="index.html"><i class="fa-solid fa-house"></i> Home</a></li>
          <li><a href="results.html"><i class="fa-solid fa-chart-simple"></i> Results</a></li>
          <li><a href="blog.html"><i class="fa-solid fa-newspaper"></i> Blog</a></li>
          <li><a href="contact.html"><i class="fa-solid fa-paper-plane"></i> Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>Services</h3>
        <ul>
          <li><a href="search-marketing.html"><i class="fa-solid fa-magnifying-glass"></i> Search Marketing</a></li>
          <li><a href="performance-marketing.html"><i class="fa-solid fa-chart-line"></i> Performance Ads &amp; Funnels</a></li>
          <li><a href="creative-services.html"><i class="fa-solid fa-wand-magic-sparkles"></i> Creative Production</a></li>
          <li><a href="ai-solutions.html"><i class="fa-solid fa-robot"></i> AI Marketing Solutions</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul>
          <li><a href="https://wa.me/918840863659" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> WhatsApp Chat</a></li>
          <li><a href="contact.html"><i class="fa-solid fa-envelope"></i> Contact Form</a></li>
          <li><i class="fa-solid fa-envelope"></i> info@jabzen.com</li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">© 2026 JABZEN. All rights reserved.</div>
  </footer>
  <script src="script.min.js?v=10" defer></script>
</body>
</html>
"""

def generate_service_pages():
    for slug, info in pages_data.items():
        filename = f"{slug}.html"
        title = info["title"]
        heading = info["heading"]
        desc = info["description"]
        breadcrumb = info["breadcrumb"]
        
        if slug == "search-marketing":
            title = "SEO Services in 2026: What Businesses Need to Grow Organically and Stay Visible"
            desc = "Discover how SEO Services help businesses improve search visibility, attract qualified traffic, and build long-term organic growth without relying only on paid advertising."
            heading = "SEO Services in 2026: What Businesses Need to Grow Organically and Stay Visible"
            
            body_html = f"""  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Home</a> / Services / {breadcrumb}</div>
        <h1 style="max-width: 900px; line-height: 1.15; font-size: clamp(2rem, 4.5vw, 3.8rem);">{heading}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="article-container">
          <div class="article-content">
            <p>Many businesses still struggle with the same problem: they have a website, but potential customers cannot find it. Traffic remains low, leads are inconsistent, and advertising costs continue to rise.</p>
            <p>This is where SEO becomes important.</p>
            <p>Search engine optimization helps businesses improve their visibility when people actively search for products, solutions, or services online. Unlike paid ads that stop generating results when the budget runs out, SEO focuses on creating sustainable growth over time.</p>

            <h2>What Are SEO Services?</h2>
            <p>SEO Services are professional activities designed to improve a website's rankings in search engines such as Google. The goal is simple: help the right audience discover your business when they need it.</p>
            <p>These services usually include:</p>
            <ul>
              <li>Keyword research</li>
              <li>Technical website optimization</li>
              <li>Content optimization</li>
              <li>On-page SEO</li>
              <li>Local SEO</li>
              <li>Link building</li>
              <li>Performance monitoring</li>
              <li>Search visibility improvement</li>
            </ul>
            <div class="answer-block">
              SEO works by helping search engines understand, trust, and recommend your website for relevant searches.
            </div>

            <h2>Why Businesses Need SEO More Than Ever</h2>
            <p>Search behavior has changed significantly over the last few years. Consumers now research products, compare options, read reviews, and seek answers before making decisions.</p>
            <p>If your business is not visible during these searches, competitors gain the opportunity instead.</p>
            <p>Some benefits include:</p>
            <ul>
              <li>Consistent organic traffic</li>
              <li>Better brand credibility</li>
              <li>Lower customer acquisition costs</li>
              <li>Higher-quality leads</li>
              <li>Improved user experience</li>
              <li>Long-term business growth</li>
            </ul>
            <div class="answer-block">
              SEO does not create demand. It captures existing demand from people already searching for solutions.
            </div>

            <h2>The Most Important Parts of Modern SEO</h2>
            
            <h3>Technical Optimization</h3>
            <p>A website must load quickly, function properly on mobile devices, and allow search engines to crawl pages efficiently.</p>
            <p>Common technical improvements include:</p>
            <ul>
              <li>Faster page speed</li>
              <li>Mobile responsiveness</li>
              <li>Secure HTTPS setup</li>
              <li>XML sitemap optimization</li>
              <li>Structured data implementation</li>
            </ul>

            <h3>Content Strategy</h3>
            <p>Search engines prioritize content that genuinely answers user questions.</p>
            <p>Effective content should:</p>
            <ul>
              <li>Solve real problems</li>
              <li>Be easy to understand</li>
              <li>Include clear headings</li>
              <li>Match search intent</li>
              <li>Stay updated regularly</li>
            </ul>
            <p>Businesses that publish useful content consistently often build stronger organic visibility over time.</p>

            <h3>Authority Building</h3>
            <p>Search engines evaluate trust signals across the web.</p>
            <p>Authority is often strengthened through:</p>
            <ul>
              <li>High-quality backlinks</li>
              <li>Brand mentions</li>
              <li>Expert content</li>
              <li>Positive user engagement</li>
              <li>Industry relevance</li>
            </ul>
            <div class="answer-block">
              Authority increases when credible websites and users consistently associate your brand with expertise and trust.
            </div>

            <h2>How to Choose the Right SEO Partner</h2>
            <p>Not all providers deliver the same results.</p>
            <p>Before hiring an agency or consultant, look for:</p>
            <ul>
              <li>Clear reporting practices</li>
              <li>Transparent communication</li>
              <li>Real business case studies</li>
              <li>Ethical optimization methods</li>
              <li>Long-term strategy planning</li>
            </ul>
            <p>Be cautious of anyone promising instant rankings or guaranteed first-page positions. Search algorithms constantly evolve, and sustainable growth requires ongoing work.</p>

            <h2>What Results Can Businesses Expect?</h2>
            <p>The timeline depends on competition, website condition, industry, and content quality.</p>
            <p>Most businesses typically see:</p>
            <ul>
              <li>Early improvements within 2 to 3 months</li>
              <li>Stronger traffic growth within 4 to 6 months</li>
              <li>Long-term gains after consistent optimization</li>
            </ul>
            <p>Good SEO is not a one-time project. It is an ongoing process of improvement, testing, and refinement.</p>
            <p>At Jabzen, we view SEO Services as a long-term growth asset rather than a short-term marketing tactic. When combined with quality content, technical excellence, and a user-first approach, SEO can become one of the most reliable channels for attracting customers and building online authority.</p>

            <h2>Final Takeaway</h2>
            <p>Businesses that invest in visibility today are more likely to capture attention tomorrow. Search engines continue to be one of the primary ways customers discover brands, compare options, and make purchasing decisions.</p>
            <p>A strong SEO strategy helps businesses appear where those decisions begin, creating sustainable growth that compounds over time.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="container split">
        <div>
          <p class="eyebrow">Strategy</p>
          <h2>Connect This Premium Marketing Service To Your Active Sales Pipeline</h2>
          <p class="lead" style="text-align: left; margin-top: 1rem; color: var(--text-secondary);">We implement execution workflows that directly map to phone conversations, inquiry forms, and qualified lead metrics. Let's design a custom road map for your target market.</p>
        </div>
        <form class="form-wrap" data-lead-form style="background: var(--card-bg); border-color: var(--line);">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name" style="color: var(--text-primary);">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="John Doe">
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
        elif slug == "creative-services":
            title = "Most Businesses Don't Need More Followers. They Need a Better Social Media Strategy."
            desc = "Discover how Social Media Marketing helps businesses build trust, increase visibility, and attract quality customers through consistent content and audience engagement."
            heading = "Most Businesses Don't Need More Followers. They Need a Better Social Media Strategy."
            
            body_html = f"""  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Home</a> / Services / {breadcrumb}</div>
        <h1 style="max-width: 900px; line-height: 1.15; font-size: clamp(2rem, 4.5vw, 3.8rem);">{heading}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="article-container">
          <!-- Full-width visual banner -->
          <div style="width: 100%; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); margin-bottom: 2.5rem; box-shadow: var(--shadow);">
            <img src="assets/creative-services-banner.png" alt="Creative Production and Social Strategy Banner" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 16/9;">
          </div>
          
          <div class="article-content">
            <p>A common mistake businesses make is chasing follower counts.</p>
            <p>They celebrate every new follower but rarely ask a more important question:</p>
            <p><em>"Are these followers becoming customers?"</em></p>
            <p>The truth is simple. A page with 2,000 engaged followers can generate more business than a page with 100,000 inactive followers.</p>
            <p>That's why successful brands focus on strategy before growth.</p>

            <h2>Attention Is Easy. Trust Is Difficult.</h2>
            <p>Almost anyone can create a viral post. Building trust is much harder.</p>
            <p>People buy from brands they recognize, remember, and trust. Social platforms give businesses a chance to earn that trust every day through valuable content and genuine interactions.</p>
            <p>When a potential customer sees your content repeatedly, something important happens. Your brand becomes familiar.</p>
            <p>Familiarity often leads to trust. Trust often leads to sales.</p>
            <div class="answer-block">
              Social media influences buying decisions by keeping a brand visible before customers are ready to purchase.
            </div>

            <h2>The Brands Winning Today Are Teaching, Not Selling</h2>
            <p>Open Instagram, LinkedIn, or Facebook. Most businesses are still posting endless promotions:</p>
            <ul>
              <li>Buy now</li>
              <li>Limited offer</li>
              <li>Contact us today</li>
              <li>Best service in town</li>
            </ul>
            <p>Audiences ignore this quickly.</p>
            <p>The brands growing fastest are sharing:</p>
            <ul>
              <li>Helpful tips</li>
              <li>Industry insights</li>
              <li>Customer stories</li>
              <li>Behind-the-scenes content</li>
              <li>Practical solutions</li>
            </ul>
            <p>People naturally engage with content that helps them solve problems.</p>

            <h2>Consistency Beats Creativity Most of the Time</h2>
            <p>Many businesses spend weeks creating one perfect post and then disappear for a month. That approach rarely works.</p>
            <p>A simple, consistent content schedule often produces better results than occasional bursts of creativity.</p>
            <p>Posting regularly keeps your business visible. It reminds people that you exist. More importantly, it gives algorithms more opportunities to distribute your content.</p>
            <div class="answer-block">
              Consistency increases visibility because social platforms reward active and reliable creators.
            </div>

            <h2>Why Social Media Marketing Matters for Long-Term Growth</h2>
            <p>Businesses often treat social platforms as advertising channels. They are much more than that.</p>
            <p>Social Media Marketing allows businesses to:</p>
            <ul>
              <li>Build authority</li>
              <li>Strengthen customer relationships</li>
              <li>Generate organic visibility</li>
              <li>Increase website traffic</li>
              <li>Create brand awareness</li>
              <li>Stay connected with existing customers</li>
            </ul>
            <p>The value compounds over time. Every useful post, comment, and interaction contributes to a stronger online presence.</p>
            <p>The businesses that succeed on social media are rarely the loudest. They are usually the most consistent.</p>
            <p>Instead of chasing vanity metrics, focus on creating content people genuinely want to see.</p>
            <p>At Jabzen, we believe Social Media Marketing works best when it combines strategy, valuable content, and authentic engagement. When those elements come together, growth becomes a natural outcome rather than a constant struggle.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="container split">
        <div>
          <p class="eyebrow">Strategy</p>
          <h2>Connect This Premium Marketing Service To Your Active Sales Pipeline</h2>
          <p class="lead" style="text-align: left; margin-top: 1rem; color: var(--text-secondary);">We implement execution workflows that directly map to phone conversations, inquiry forms, and qualified lead metrics. Let's design a custom road map for your target market.</p>
        </div>
        <form class="form-wrap" data-lead-form style="background: var(--card-bg); border-color: var(--line);">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name" style="color: var(--text-primary);">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="John Doe">
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
        elif slug == "ai-solutions":
            title = "AI Marketing Solutions & Automation | JABZEN | Creative Marketing Freelancer"
            desc = "Discover how AI Marketing Solutions and automated workflows can scale your visual content production, voice replication, and lead workflows 24/7."
            heading = "AI Marketing Solutions & Automation"
            
            body_html = f"""  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Home</a> / Services / {breadcrumb}</div>
        <h1 style="max-width: 900px; line-height: 1.15; font-size: clamp(2rem, 4.5vw, 3.8rem);">{heading}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="article-container">
          <!-- Full-width visual banner -->
          <div style="width: 100%; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--line); margin-bottom: 2.5rem; box-shadow: var(--shadow);">
            <img src="assets/ai-solutions-banner.png" alt="AI Marketing Solutions and Workflow Automation Banner" style="width: 100%; height: auto; display: block; object-fit: cover; aspect-ratio: 16/9;">
          </div>
          
          <div class="article-content">
            <p>Artificial Intelligence is no longer a future concept. It is a live multiplier for businesses trying to scale. From creating personalized video variations to voice cloning and programmatic workflows, AI tools enable brands to deliver agency-grade output at a fraction of the traditional speed and cost.</p>
            <p>At JABZEN, we build marketing automations that act as silent team members, working 24/7. This page details the capabilities we deploy to optimize your creative and conversion pipelines.</p>

            <h2>AI Guide Presenters &amp; Voice Replication</h2>
            <p>With custom AI video avatars, you can produce personalized guide videos for different buyer segments instantly. Instead of renting studio space or recording raw takes repeatedly, we configure virtual presenters to convey your product guides with complete clarity.</p>
            <p>Additionally, voice cloning allows us to create highly realistic multi-lingual voice replicates that explain product features in a fraction of normal recording time, establishing a uniform brand voice across all touchpoints.</p>
            <div class="answer-block">
              AI guide presenters allow businesses to scale their dynamic video outreach without running into studio scheduling constraints or content production bottlenecks.
            </div>

            <h2>Automated Cinematic Explainer Videos</h2>
            <p>We stitch together scriptwriting models, voice overlays, and cinematic explainer assets programmatically. This enables rapid creation and testing of direct-response video ads across Instagram, Meta, and YouTube.</p>
            <p>By producing high-retention video variations at scale, you can determine exactly which hooks and angles drive the lowest customer acquisition costs without spending weeks in post-production.</p>
            <p>These cinematic explainer assets typically include:</p>
            <ul>
              <li>High-retention video scripting</li>
              <li>Realistic voice replication and sync</li>
              <li>Dynamic subtitling and cinematic graphic frames</li>
              <li>Multi-platform asset scaling (Reels, Shorts, Landscape)</li>
            </ul>

            <h2>Workflow Automation &amp; 24/7 Pipelines</h2>
            <p>True scale is achieved when your marketing funnel works while you sleep. We set up custom automation pipelines using advanced webhooks and APIs to bridge the gap between user interest and sales actions.</p>
            <p>Common automation workflows include:</p>
            <ul>
              <li>Automated email sequences and newsletter systems</li>
              <li>Instant lead notifications synced to team Slack or Discord</li>
              <li>Responsive AI agents that answer basic product queries instantly</li>
              <li>Webhook integrations connecting forms directly to CRM pipelines</li>
            </ul>
            <div class="answer-block">
              True automation isn't about spamming; it is about building reliable, responsive connection pathways between user queries and your sales system.
            </div>

            <h2>Why Invest in AI and Automation Today?</h2>
            <p>Businesses that adopt automation grow exponentially faster because they free up resources to focus on high-impact strategies. Key benefits include:</p>
            <ul>
              <li>Consistent execution without human downtime</li>
              <li>Significantly lower operational and production costs</li>
              <li>Higher lead conversion rates due to instant follow-ups</li>
              <li>Scalable asset variation testing</li>
            </ul>
            <p>At Jabzen, we view AI Marketing Solutions as a strategic multiplier. When combined with authentic branding, technical excellence, and human oversight, AI becomes one of the most powerful tools for accelerating business growth.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="container split">
        <div>
          <p class="eyebrow">Strategy</p>
          <h2>Connect This Premium Marketing Service To Your Active Sales Pipeline</h2>
          <p class="lead" style="text-align: left; margin-top: 1rem; color: var(--text-secondary);">We implement execution workflows that directly map to phone conversations, inquiry forms, and qualified lead metrics. Let's design a custom road map for your target market.</p>
        </div>
        <form class="form-wrap" data-lead-form style="background: var(--card-bg); border-color: var(--line);">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name" style="color: var(--text-primary);">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="John Doe">
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
        else:
            cards_html = ""
            for card_title, card_desc in info["cards"]:
                cards_html += f"""
      <article class="card">
        <h3 style="color: var(--accent); margin-bottom: 0.5rem;">{card_title}</h3>
        <p>{card_desc}</p>
      </article>"""

            body_html = f"""  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Home</a> / Services / {breadcrumb}</div>
        <h1>{heading}</h1>
        <p class="lead" style="text-align: left; margin-top: 1.5rem; max-width: 800px; color: var(--text-secondary);">{desc}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" style="text-align: center; margin-bottom: 3rem;">
          <p class="eyebrow">Framework</p>
          <h2>Key Deliverables And Performance Capabilities We Deliver For Brands</h2>
        </div>
        <div class="grid grid-3">
          {cards_html}
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="container split">
        <div>
          <p class="eyebrow">Strategy</p>
          <h2>Connect This Premium Marketing Service To Your Active Sales Pipeline</h2>
          <p class="lead" style="text-align: left; margin-top: 1rem; color: var(--text-secondary);">We implement execution workflows that directly map to phone conversations, inquiry forms, and qualified lead metrics. Let's design a custom road map for your target market.</p>
        </div>
        <form class="form-wrap" data-lead-form style="background: var(--card-bg); border-color: var(--line);">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name" style="color: var(--text-primary);">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="John Doe">
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
        full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug=f"{slug}.html") + body_html + HTML_FOOTER
        with open(filename, "w", encoding="utf-8") as f:
            f.write(full_content)
        print(f"Generated {filename}")

def generate_blog_page():
    filename = "blog.html"
    title = "Blog & Insights | JABZEN | Creative Marketing Freelancer"
    desc = "Expert guides, industry frameworks, and tactical blueprints on SEO, AI, Meta Ads, and Branding."
    
    body_html = """  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Home</a> / Blog</div>
        <h1>Latest Marketing & Strategy Insights</h1>
        <p class="lead" style="text-align: left; margin-top: 1.5rem; max-width: 800px; color: var(--text-secondary);">Frameworks, case reviews, and search patterns to help service brands scale lead generation.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="grid grid-3">
          <article class="card">
            <span class="eyebrow" style="font-size: 0.7rem;">SEO</span>
            <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;"><a href="#" style="color: var(--text-primary); transition: color 0.18s ease;">The Future of Search: Navigating the Generative Search Era</a></h3>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">How Gemini, ChatGPT, and AI-driven answer summaries are changing search behavior, and how to stay ahead.</p>
          </article>
          <article class="card">
            <span class="eyebrow" style="font-size: 0.7rem;">AI Marketing</span>
            <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;"><a href="#" style="color: var(--text-primary); transition: color 0.18s ease;">Leveraging Gemini & LLMs to Automate Content Velocity</a></h3>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">A step-by-step framework to repurpose long-form assets into Reels, blogs, and social threads using AI workflows.</p>
          </article>
          <article class="card">
            <span class="eyebrow" style="font-size: 0.7rem;">Meta Ads</span>
            <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;"><a href="#" style="color: var(--text-primary); transition: color 0.18s ease;">High-ROAS Ad Copy Secrets for High-Ticket Clients</a></h3>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Visual hook patterns, direct response copy outlines, and creative formats that convert cold traffic into booked calls.</p>
          </article>
          <article class="card">
            <span class="eyebrow" style="font-size: 0.7rem;">Google Ads</span>
            <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;"><a href="#" style="color: var(--text-primary); transition: color 0.18s ease;">Scaling Performance Max Campaigns Without Wasting Spend</a></h3>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">How to configure asset groups, target audiences, and placement exclusions for high-intent B2B search dominance.</p>
          </article>
          <article class="card">
            <span class="eyebrow" style="font-size: 0.7rem;">Branding</span>
            <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;"><a href="#" style="color: var(--text-primary); transition: color 0.18s ease;">The Anatomy of a Premium Personal Brand Portfolio</a></h3>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">How to position yourself as India's leading creative specialist by optimizing visual hierarchy, monograms, and trust signals.</p>
          </article>
          <article class="card">
            <span class="eyebrow" style="font-size: 0.7rem;">Content Marketing</span>
            <h3 style="margin: 0.5rem 0; font-size: 1.2rem; line-height: 1.3;"><a href="#" style="color: var(--text-primary); transition: color 0.18s ease;">Building a Content Cluster Engine That Educates & Converts</a></h3>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">A blueprint for map-planning core business offers to informational, transactional, and comparative content pieces.</p>
          </article>
        </div>
      </div>
    </section>
  </main>
"""
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="blog.html") + body_html + HTML_FOOTER
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
        <div class="breadcrumbs"><a href="index.html">Home</a> / Contact</div>
        <h1>Let's Scale Your Brand</h1>
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
            <div><strong><i class="fa-solid fa-phone" style="color: var(--accent); margin-right: 8px;"></i> Phone / WhatsApp:</strong> <a href="https://wa.me/918840863659" style="color: var(--accent); font-weight: 700;">+91 88408 63659</a></div>
            <div><strong><i class="fa-solid fa-envelope" style="color: var(--accent); margin-right: 8px;"></i> Email:</strong> info@jabzen.com</div>
            <div><strong><i class="fa-solid fa-location-dot" style="color: var(--accent); margin-right: 8px;"></i> Location:</strong> India (Global Delivery)</div>
          </div>
        </div>
        <form class="form-wrap" data-lead-form style="background: var(--card-bg); border-color: var(--line);">
          <div class="form-grid" style="grid-template-columns: 1fr;">
            <div class="field">
              <label for="lead-name" style="color: var(--text-primary);">Full Name</label>
              <input id="lead-name" name="name" autocomplete="name" required placeholder="John Doe">
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
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="contact.html") + body_html + HTML_FOOTER
    with open(filename, "w", encoding="utf-8") as f:
        f.write(full_content)
    print("Generated contact.html")

def generate_results_page():
    filename = "results.html"
    title = "Results & Case Studies | JABZEN | Creative Marketing Freelancer"
    desc = "Case studies and metrics achieved for brand visibility, organic traffic growth, ad spend ROI, and lead capture."
    
    body_html = """  <main id="main">
    <section class="page-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="index.html">Home</a> / Results</div>
        <h1>Results & Performance Case Studies</h1>
        <p class="lead" style="text-align: left; margin-top: 1.5rem; max-width: 800px; color: var(--text-secondary);">Real outcomes showing traffic multiples, visual branding upgrades, and direct lead pipelines.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head" style="text-align: center; margin-bottom: 3rem;">
          <p class="eyebrow">Outcomes</p>
          <h2>Core Metric Case Audits Demonstrating Revenue Growth And Scaling</h2>
        </div>
        <div class="grid grid-2">
          <article class="card">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Organic Search (SEO, AEO, GEO)</h3>
            <p><strong>Result: 312% Search Volume Increase</strong></p>
            <p style="margin-top: 0.5rem;">Structured keyword clusters and programmatic pages for service area providers, achieving top rankings and citation placement in LLM engines.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Performance Marketing Ads</h3>
            <p><strong>Result: 4.6x Meta & Google ROAS</strong></p>
            <p style="margin-top: 0.5rem;">Designed and mapped high-CTR creative ad variations and landing pages for B2B consulting firms, significantly cutting acquisition costs.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">Creative Reels Production</h3>
            <p><strong>Result: 5.8M Views & Organic Traffic</strong></p>
            <p style="margin-top: 0.5rem;">Repurposed educational concepts into viral vertical hooks, sound design, and gold-overlay formats, driving sales inquiries.</p>
          </article>
          <article class="card">
            <h3 style="color: var(--accent); margin-bottom: 0.5rem;">AI Marketing Workflows</h3>
            <p><strong>Result: 10x Content Velocity Output</strong></p>
            <p style="margin-top: 0.5rem;">Deployed automated AI explainer avatars and prompt-based pipelines that increased lead follow-up efficiency and velocity.</p>
          </article>
        </div>
      </div>
    </section>
  </main>
"""
    full_content = HTML_HEADER.format(title=title, description=desc, canonical_slug="results.html") + body_html + HTML_FOOTER
    with open(filename, "w", encoding="utf-8") as f:
        f.write(full_content)
    print("Generated results.html")

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
        ("search-marketing.html", "0.9", "weekly"),
        ("performance-marketing.html", "0.9", "weekly"),
        ("creative-services.html", "0.9", "weekly"),
        ("ai-solutions.html", "0.9", "weekly"),
        ("results.html", "0.8", "weekly"),
        ("blog.html", "0.8", "weekly"),
        ("contact.html", "0.8", "monthly")
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

def main():
    generate_service_pages()
    generate_blog_page()
    generate_contact_page()
    generate_results_page()
    generate_sitemap()
    minify_css("styles.css", "styles.min.css")
    minify_js("script.js", "script.min.js")
    
    # Cleanup obsolete files that are removed from nav/layout
    old_files = [
        "about.html", "book-strategy-call.html", "services.html",
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
