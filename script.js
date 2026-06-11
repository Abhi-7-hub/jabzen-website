const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

// Highlight active page link dynamically
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a, .dropdown-menu a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPath || (currentPath === "" && href === "index.html")) {
    link.setAttribute("aria-current", "page");
    // Also highlight the parent services trigger if the link is inside the dropdown
    if (link.closest(".dropdown-menu")) {
      const trigger = document.querySelector(".dropdown-trigger");
      if (trigger) trigger.setAttribute("aria-current", "page");
    }
  } else {
    link.removeAttribute("aria-current");
  }
});

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Toggle services dropdown on mobile when clicking trigger
  const dropdownTrigger = document.querySelector(".dropdown-trigger");
  const dropdownParent = document.querySelector(".nav-dropdown");

  if (dropdownTrigger && dropdownParent) {
    dropdownTrigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 980) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdownParent.classList.toggle("is-open");
        dropdownTrigger.setAttribute("aria-expanded", String(isOpen));
      }
    });
  }

  navLinks.addEventListener("click", (event) => {
    const targetAnchor = event.target.closest("a");
    if (targetAnchor) {
      // If mobile view and clicking the dropdown trigger, do not close the menu drawer
      if (targetAnchor.classList.contains("dropdown-trigger") && window.innerWidth <= 980) {
        return;
      }
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      
      // Also close dropdown parent on navigation
      if (dropdownParent) {
        dropdownParent.classList.remove("is-open");
      }
    }
  });
}

// 1. Transparent-to-glassmorphic header scroll listener
const header = document.querySelector(".site-header");
if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// FAQ accordion toggles
document.querySelectorAll("[data-faq]").forEach((faq) => {
  const button = faq.querySelector("button");
  if (!button) return;

  button.addEventListener("click", () => {
    const isOpen = faq.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

// 2. Testimonials Carousel Navigation
const track = document.querySelector("[data-carousel-track]");
const indicators = Array.from(document.querySelectorAll(".carousel-indicator"));

if (track && indicators.length > 0) {
  const slides = Array.from(track.children);
  
  const setSlidePosition = (slide, index) => {
    slide.style.left = index * 100 + "%";
  };
  slides.forEach(setSlidePosition);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      const currentDot = document.querySelector(".carousel-indicator.current-slide") || indicators[0];
      
      // Move track to slide
      track.style.transform = `translateX(-${index * 100}%)`;
      
      // Update indicator dots
      currentDot.classList.remove("current-slide");
      indicator.classList.add("current-slide");
    });
  });

  // Auto slide testimonials every 6 seconds
  let autoSlideInterval = setInterval(() => {
    const currentDot = document.querySelector(".carousel-indicator.current-slide") || indicators[0];
    let nextIndex = indicators.indexOf(currentDot) + 1;
    if (nextIndex >= indicators.length) {
      nextIndex = 0;
    }
    indicators[nextIndex].click();
  }, 6000);

  // Pause on hover
  const carouselContainer = document.querySelector(".testimonials-carousel");
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
    carouselContainer.addEventListener("mouseleave", () => {
      autoSlideInterval = setInterval(() => {
        const currentDot = document.querySelector(".carousel-indicator.current-slide") || indicators[0];
        let nextIndex = indicators.indexOf(currentDot) + 1;
        if (nextIndex >= indicators.length) {
          nextIndex = 0;
        }
        indicators[nextIndex].click();
      }, 6000);
    });
  }
}

// 3. Lead Capture System Integration (Firebase + Make.com Webhook + WhatsApp Redirect)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
if (typeof firebase !== "undefined" && firebaseConfig.apiKey !== "YOUR_API_KEY") {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase Firestore initialized.");
  } catch (error) {
    console.error("Firebase init failed:", error);
  }
}

const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/your_webhook_id";

document.querySelectorAll("form[data-lead-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const successMsg = form.querySelector("[data-success-message]");
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";
    }
    
    const formData = new FormData(form);
    const leadData = {
      name: formData.get("name"),
      phone: formData.get("phone") || "",
      timestamp: new Date().toISOString(),
      source: window.location.pathname
    };
    
    // Write to Firebase Firestore
    if (db) {
      try {
        await db.collection("leads").add(leadData);
        console.log("Saved lead to Firestore");
      } catch (err) {
        console.error("Firestore save error:", err);
      }
    }
    
    // Post to Make.com Webhook
    if (MAKE_WEBHOOK_URL && !MAKE_WEBHOOK_URL.includes("your_webhook_id")) {
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData)
        });
        console.log("Sent webhook to Make.com");
      } catch (err) {
        console.error("Webhook send error:", err);
      }
    }
    
    if (successMsg) {
      successMsg.style.display = "block";
      successMsg.textContent = "Thanks! Booking consultation call on WhatsApp...";
    }
    
    setTimeout(() => {
      const whatsappText = `Hi Abhishek, I would like to book a free consultation call. My name is ${encodeURIComponent(leadData.name)} and my phone number is ${encodeURIComponent(leadData.phone)}.`;
      const whatsappUrl = `https://wa.me/918840863659?text=${whatsappText}`;
      window.open(whatsappUrl, "_blank");
      
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Book Free Consultation";
      }
      if (successMsg) {
        successMsg.style.display = "none";
      }
    }, 1500);
  });
});

// --- NEW HERO INTERACTION CODE ---

// --- DYNAMIC THEME SWITCHER LOGIC ---
const themeToggle = document.getElementById("theme-toggle");

const enableLightMode = () => {
  document.body.classList.add("light-theme");
  localStorage.setItem("theme", "light");
};

const disableLightMode = () => {
  document.body.classList.remove("light-theme");
  localStorage.setItem("theme", "dark");
};

// Check stored theme preference on load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  enableLightMode();
} else {
  disableLightMode();
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("light-theme")) {
      disableLightMode();
    } else {
      enableLightMode();
    }
  });
}

// --- HERO BACKGROUND MOUSE GLOW ---
const hero = document.querySelector(".hero");
const canvas = document.getElementById("particles-canvas");
const bodyEl = document.body;

if (bodyEl && bodyEl.classList.contains("landing-page")) {
  window.addEventListener("mousemove", (e) => {
    bodyEl.style.setProperty("--mouse-x", `${e.clientX}px`);
    bodyEl.style.setProperty("--mouse-y", `${e.clientY}px`);
  });
  window.addEventListener("mouseleave", () => {
    bodyEl.style.setProperty("--mouse-x", "50%");
    bodyEl.style.setProperty("--mouse-y", "50%");
  });
} else if (hero) {
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    hero.style.setProperty("--mouse-x", `${x}px`);
    hero.style.setProperty("--mouse-y", `${y}px`);
  });

  hero.addEventListener("mouseleave", () => {
    hero.style.setProperty("--mouse-x", "50%");
    hero.style.setProperty("--mouse-y", "50%");
  });
}

// 3. Canvas Golden Particles
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  // Resize canvas on viewport changes
  window.addEventListener("resize", () => {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  });

  const particlesCount = 45;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * height; // Random initial y position
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + 10;
      this.radius = Math.random() * 2 + 0.5;
      this.vy = -(Math.random() * 0.4 + 0.1); // Slow move up
      this.vx = Math.random() * 0.2 - 0.1; // Slight drift
      this.opacity = Math.random() * 0.5 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseDir = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
      this.y += this.vy;
      this.x += this.vx;

      // Pulsing opacity
      this.opacity += this.pulseSpeed * this.pulseDir;
      if (this.opacity > 0.75 || this.opacity < 0.1) {
        this.pulseDir *= -1;
      }

      // Reset if moves off screen
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(214, 173, 45, ${this.opacity})`;
      ctx.shadowColor = "rgba(214, 173, 45, 0.4)";
      ctx.shadowBlur = this.radius * 2;
      ctx.fill();
    }
  }

  // Init particles
  for (let i = 0; i < particlesCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// --- SCROLL REVEAL ANIMATIONS (LAZY LOAD REVEAL) ---
document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  
  if (revealElements.length > 0) {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: "0px 0px -45px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, observerOptions);
    
    revealElements.forEach((el) => revealObserver.observe(el));
  }
});

// --- METRIC STATS COUNTER UPWARD ANIMATION ---
const countUpMetrics = () => {
  const counters = document.querySelectorAll(".stat-counter");
  if (counters.length === 0) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetVal = parseFloat(counter.getAttribute("data-target"));
        const suffix = counter.getAttribute("data-suffix") || "";
        const decimals = parseInt(counter.getAttribute("data-decimals")) || 0;
        
        const startVal = 0;
        const duration = 1500; // 1.5 seconds animation duration
        const startTime = performance.now();

        const updateCount = (timestamp) => {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function: easeOutQuad
          const easeProgress = progress * (2 - progress);
          const currentVal = startVal + easeProgress * (targetVal - startVal);
          
          counter.textContent = currentVal.toFixed(decimals) + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = targetVal.toFixed(decimals) + suffix;
          }
        };

        requestAnimationFrame(updateCount);
        observer.unobserve(counter); // Animate only once
      }
    });
  }, observerOptions);

  counters.forEach((c) => observer.observe(c));
};

document.addEventListener("DOMContentLoaded", () => {
  countUpMetrics();
  
  // Call Now button clipboard copy and mobile dialer support
  const callButtons = document.querySelectorAll("[data-call-btn]");
  callButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        const phoneNum = "+918840863659";
        
        const showSuccess = () => {
          const origHTML = btn.innerHTML;
          btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
          btn.style.borderColor = "var(--accent)";
          setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.style.borderColor = "";
          }, 2000);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(phoneNum)
            .then(showSuccess)
            .catch((err) => {
              console.warn("navigator.clipboard failed, trying fallback: ", err);
              fallbackCopy(phoneNum, showSuccess);
            });
        } else {
          fallbackCopy(phoneNum, showSuccess);
        }
      }
    });
  });

  function fallbackCopy(text, onSuccess) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful && onSuccess) onSuccess();
    } catch (err) {
      console.error("Fallback copy execution failed: ", err);
    }
    document.body.removeChild(textArea);
  }
});

