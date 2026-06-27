/**
 * JABZEN Marketing & Agency Core Script
 * Isolated lightweight script for agency pages (Home, Services, About, Contact, Sitemap)
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Header scroll effect
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 30) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // 2. Mobile navigation toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("is-open");
    });
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove("is-open");
      }
    });
  }

  // 3. Navigation dropdown mobile toggle
  const dropdownTriggers = document.querySelectorAll(".dropdown-trigger");
  dropdownTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const parent = trigger.closest(".nav-dropdown");
        if (parent) parent.classList.toggle("is-open");
      }
    });
  });

  // 4. FAQ Accordions
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      if (item) {
        const isOpen = item.classList.contains("is-open");
        document.querySelectorAll(".faq-item").forEach(el => el.classList.remove("is-open"));
        if (!isOpen) item.classList.add("is-open");
      }
    });
  });

  // 5. Scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.15 });
    revealElements.forEach(el => observer.observe(el));
  }

  // 6. Header Auth Sync (Checks local session to render clean profile or login button)
  const syncHeaderAuth = () => {
    let currentUser = null;
    try {
      const saved = localStorage.getItem("jabzen_active_user_session");
      if (saved) currentUser = JSON.parse(saved);
    } catch (e) {}

    const headerUserProfile = document.getElementById("header-user-profile");
    const headerLoginBtn = document.getElementById("header-login-btn");
    const headerProfileAvatar = document.getElementById("header-profile-avatar");
    const headerProfileName = document.getElementById("header-profile-name");
    const headerProfileEmail = document.getElementById("header-profile-email");

    if (currentUser) {
      if (headerUserProfile) headerUserProfile.style.display = "block";
      if (headerLoginBtn) headerLoginBtn.style.display = "none";
      const rawName = currentUser.displayName || "Author";
      const name = rawName.includes("|") ? rawName.split("|")[0] : rawName;
      if (headerProfileAvatar) {
        headerProfileAvatar.src = currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d6ad2d&color=121212`;
      }
      if (headerProfileName) headerProfileName.textContent = name;
      if (headerProfileEmail) headerProfileEmail.textContent = currentUser.email || "";
    } else {
      if (headerUserProfile) headerUserProfile.style.display = "none";
      if (headerLoginBtn) headerLoginBtn.style.display = "";
    }
  };

  syncHeaderAuth();

  // Profile Dropdown Toggle
  const headerProfileBtn = document.getElementById("header-profile-btn");
  const headerProfileDropdown = document.getElementById("header-profile-dropdown");
  if (headerProfileBtn && headerProfileDropdown) {
    headerProfileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      headerProfileDropdown.classList.toggle("is-open");
    });
    document.addEventListener("click", (e) => {
      if (!headerProfileDropdown.contains(e.target) && e.target !== headerProfileBtn) {
        headerProfileDropdown.classList.remove("is-open");
      }
    });
  }

  // Sign Out in header profile dropdown
  const headerLogoutBtn = document.getElementById("header-logout-btn");
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("jabzen_active_user_session");
      window.location.reload();
    });
  }

  // 7. Lead Form submission handler
  const leadForms = document.querySelectorAll("form");
  leadForms.forEach(form => {
    if (!form.id || form.id !== "blog-composer-form") {
      form.addEventListener("submit", (e) => {
        const submitBtn = form.querySelector("button[type='submit']");
        if (submitBtn && !form.dataset.customHandled) {
          e.preventDefault();
          const origText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
          setTimeout(() => {
            alert("Thank you! Your inquiry has been received. Abhishek will contact you shortly.");
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
          }, 1000);
        }
      });
    }
  });
});
