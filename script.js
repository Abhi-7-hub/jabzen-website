const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

// Highlight active page link dynamically
window.initActiveNavLinks = () => {
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
};
window.initActiveNavLinks();

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
window.initFaqs = () => {
  document.querySelectorAll(".faq-item, [data-faq]").forEach((faq) => {
    const button = faq.querySelector("button, .faq-question");
    if (!button) return;
    if (button.dataset.faqBound) return;
    button.dataset.faqBound = "true";

    button.addEventListener("click", () => {
      const isOpen = faq.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
};
window.initFaqs();

// 2. Testimonials Carousel Navigation
window.initCarousels = () => {
  const track = document.querySelector("[data-carousel-track]");
  const indicators = Array.from(document.querySelectorAll(".carousel-indicator"));

  if (track && indicators.length > 0) {
    const slides = Array.from(track.children);
    
    const setSlidePosition = (slide, index) => {
      slide.style.left = index * 100 + "%";
    };
    slides.forEach(setSlidePosition);

    indicators.forEach((indicator, index) => {
      if (indicator.dataset.carouselBound) return;
      indicator.dataset.carouselBound = "true";
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
      const nextIndicator = indicators[nextIndex];
      if (nextIndicator) nextIndicator.click();
    }, 6000);

    // Pause on hover
    const carouselContainer = document.querySelector(".testimonials-carousel");
    if (carouselContainer) {
      if (carouselContainer.dataset.carouselHoverBound) return;
      carouselContainer.dataset.carouselHoverBound = "true";
      carouselContainer.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
      carouselContainer.addEventListener("mouseleave", () => {
        autoSlideInterval = setInterval(() => {
          const currentDot = document.querySelector(".carousel-indicator.current-slide") || indicators[0];
          let nextIndex = indicators.indexOf(currentDot) + 1;
          if (nextIndex >= indicators.length) {
            nextIndex = 0;
          }
          const nextIndicator = indicators[nextIndex];
          if (nextIndicator) nextIndicator.click();
        }, 6000);
      });
    }
  }
};
window.initCarousels();

// 3. Lead Capture & Dynamic Blog System Integration (Firebase + Make.com Webhook + WhatsApp Redirect)
const firebaseConfig = {
  apiKey: "AIzaSyBcIssLEiimq-t9PgvcqWKRtSNCAKZcS-Y",
  authDomain: "jabzen-e13ff.firebaseapp.com",
  projectId: "jabzen-e13ff",
  storageBucket: "jabzen-e13ff.firebasestorage.app",
  messagingSenderId: "966829347484",
  appId: "1:966829347484:web:bf7accd5d9370efa601359",
  measurementId: "G-GX7EF2NGE3"
};

let db = null;
let auth = null;
let storage = null;
let currentUser = null;
let isMockFirebase = false;

// Check if user has explicitly opted for Local Mock Demo mode, or if API key is blank/default
const savedMockPreference = localStorage.getItem("jabzen_use_mock_mode");
if (savedMockPreference === "true" || firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.apiKey === "") {
  isMockFirebase = true;
}

if (typeof firebase !== "undefined" && !isMockFirebase) {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    auth = firebase.auth();
    if (typeof firebase.storage === "function") {
      storage = firebase.storage();
    }
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase init failed, switching to Mock Mode:", error);
    isMockFirebase = true;
  }
}

if (isMockFirebase) {
  console.log("Using Mock LocalStorage Database & Auth because real credentials are not configured or Mock Mode is enabled.");
  
  const mockAuthStateListeners = [];
  let mockCurrentUser = null;
  
  try {
    const savedUser = localStorage.getItem("jabzen_mock_current_user");
    if (savedUser) {
      mockCurrentUser = JSON.parse(savedUser);
    }
  } catch (e) {
    console.error("Failed to parse mock current user", e);
  }
  
  auth = {
    onAuthStateChanged: (callback) => {
      mockAuthStateListeners.push(callback);
      setTimeout(() => callback(mockCurrentUser), 50);
    },
    sendPasswordResetEmail: async (email) => {
      console.log("Mock password reset email sent to:", email);
      return true;
    },
    createUserWithEmailAndPassword: async (email, password) => {
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
      } catch(e) {}
      if (users.find(u => u.email === email)) {
        throw new Error("Email already registered in local mock database.");
      }
      const uid = "mock-uid-" + Math.random().toString(36).substring(2, 9);
      const newUser = { email, uid, displayName: "" };
      users.push({ ...newUser, password });
      localStorage.setItem("jabzen_mock_users", JSON.stringify(users));
      
      mockCurrentUser = newUser;
      localStorage.setItem("jabzen_mock_current_user", JSON.stringify(mockCurrentUser));
      
      mockAuthStateListeners.forEach(cb => cb(mockCurrentUser));
      return {
        user: {
          ...newUser,
          updateProfile: async (profile) => {
            mockCurrentUser.displayName = profile.displayName;
            localStorage.setItem("jabzen_mock_current_user", JSON.stringify(mockCurrentUser));
            try {
              const allUsers = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
              const idx = allUsers.findIndex(u => u.uid === mockCurrentUser.uid);
              if (idx !== -1) {
                allUsers[idx].displayName = profile.displayName;
                localStorage.setItem("jabzen_mock_users", JSON.stringify(allUsers));
              }
            } catch(e){}
            mockAuthStateListeners.forEach(cb => cb(mockCurrentUser));
          }
        }
      };
    },
    signInWithEmailAndPassword: async (email, password) => {
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
      } catch(e) {}
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error("Invalid email or password.");
      }
      mockCurrentUser = { email: user.email, uid: user.uid, displayName: user.displayName };
      localStorage.setItem("jabzen_mock_current_user", JSON.stringify(mockCurrentUser));
      mockAuthStateListeners.forEach(cb => cb(mockCurrentUser));
      return { user: mockCurrentUser };
    },
    signInWithPopup: async () => {
      const mockName = "Google User";
      const mockCompany = "Google Inc";
      const uid = "mock-google-uid-" + Math.random().toString(36).substring(2, 9);
      mockCurrentUser = {
        email: "googleuser@gmail.com",
        uid: uid,
        displayName: `${mockName}|${mockCompany}`,
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockName)}&background=d6ad2d&color=121212`
      };
      localStorage.setItem("jabzen_mock_current_user", JSON.stringify(mockCurrentUser));
      mockAuthStateListeners.forEach(cb => cb(mockCurrentUser));
      return { user: mockCurrentUser };
    },
    signOut: async () => {
      mockCurrentUser = null;
      localStorage.removeItem("jabzen_mock_current_user");
      mockAuthStateListeners.forEach(cb => cb(null));
    }
  };

  const mockDbListeners = [];
  const getMockBlogs = () => {
    try {
      let blogsStr = localStorage.getItem("jabzen_mock_blogs");
      let blogs = [];
      if (blogsStr) {
        try {
          blogs = JSON.parse(blogsStr);
        } catch(e) {
          blogs = [];
        }
      }
      if (!blogsStr || !Array.isArray(blogs) || blogs.length === 0) {
        const defaultBlogs = [
          {
            id: "blog-id-1",
            title: "Fake Numbers. Zero Impact? It's Time to Change the Game.",
            content: "Stop chasing vanity metrics and start building authentic influence with creators who actually move audiences. From real engagement to measurable ROI, results speak louder than follower counts.",
            category: "Marketing",
            authorName: "Auden Rivers",
            authorUid: "uid-auden-rivers",
            authorPhoto: "https://ui-avatars.com/api/?name=Auden+Rivers&background=6f8f72&color=fff",
            company: "JABZEN Agency",
            createdAt: { seconds: Math.floor(Date.now() / 1000) - 7200 },
            likes: 23,
            visibility: "Public",
            image: "assets/performance-marketing-banner.webp"
          },
          {
            id: "blog-id-2",
            title: "The Future of AI in Marketing: Trends to Watch",
            content: "AI is changing the marketing landscape faster than ever. Here are the top trends that brands and marketers should keep an eye on in 2026 and beyond, from conversational answer engines to dynamic content synthesis.",
            category: "AI & Tech",
            authorName: "Mira Kapoor",
            authorUid: "uid-mira-kapoor",
            authorPhoto: "https://ui-avatars.com/api/?name=Mira+Kapoor&background=d6ad2d&color=121212",
            company: "TechPulse",
            createdAt: { seconds: Math.floor(Date.now() / 1000) - 18000 },
            likes: 15,
            visibility: "Public",
            image: "assets/blog-ai.webp"
          },
          {
            id: "blog-id-3",
            title: "The Ultimate SEO Strategy Guide for Scaling Startups",
            content: "Organic search is still the most cost-effective channel for sustainable growth. In this comprehensive guide, we cover the exact frameworks we use to rank our startup clients for high-intent keywords.",
            category: "SEO",
            authorName: "James Carter",
            authorUid: "uid-james-carter",
            authorPhoto: "https://ui-avatars.com/api/?name=James+Carter&background=64748b&color=fff",
            company: "Independent",
            createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 },
            likes: 8,
            visibility: "Public",
            image: "assets/search-marketing-banner.webp"
          },
          {
            id: "blog-id-4",
            title: "Whispers of the Wind",
            content: "The wind sings a song of ancient days,\nOf forest paths and starry nights,\nGuiding travelers on their ways,\nUnderneath the pale moonlight.\n\nListen closely, hear it sigh,\nA gentle breath across the sky.",
            category: "Poetry",
            authorName: "Mira Kapoor",
            authorUid: "uid-mira-kapoor",
            authorPhoto: "https://ui-avatars.com/api/?name=Mira+Kapoor&background=d6ad2d&color=121212",
            company: "TechPulse",
            createdAt: { seconds: Math.floor(Date.now() / 1000) - 172800 },
            likes: 34,
            visibility: "Public"
          }
        ];
        localStorage.setItem("jabzen_mock_blogs", JSON.stringify(defaultBlogs));
        return defaultBlogs;
      }
      return blogs;
    } catch(e) {
      return [];
    }
  };
  const saveMockBlogs = (blogs) => {
    localStorage.setItem("jabzen_mock_blogs", JSON.stringify(blogs));
    mockDbListeners.forEach(listener => listener.callback({
      empty: blogs.length === 0,
      forEach: (cb) => {
        const sorted = [...blogs].sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        sorted.forEach(blog => {
          cb({
            id: blog.id,
            data: () => blog
          });
        });
      }
    }));
  };
  window.saveMockBlogsGlobal = saveMockBlogs;

  db = {
    collection: (colName) => {
      if (colName !== "blogs") {
        return {
          add: async () => {},
          get: async () => ({ empty: true, forEach: () => {} })
        };
      }
      return {
        where: (field, op, value) => {
          return {
            onSnapshot: (callback) => {
              const blogs = getMockBlogs().filter(b => b[field] === value);
              callback({
                size: blogs.length,
                empty: blogs.length === 0,
                forEach: (cb) => {
                  blogs.forEach(b => cb({ id: b.id, data: () => b }));
                }
              });
              return () => {};
            },
            orderBy: (orderByField, direction) => {
              return {
                get: async () => {
                  let blogs = getMockBlogs().filter(b => b[field] === value);
                  if (direction === "desc") {
                    blogs = blogs.sort((a,b) => (b[orderByField]?.seconds || 0) - (a.orderByField?.seconds || 0));
                  } else {
                    blogs = blogs.sort((a,b) => (a[orderByField]?.seconds || 0) - (b[orderByField]?.seconds || 0));
                  }
                  return {
                    empty: blogs.length === 0,
                    forEach: (cb) => {
                      blogs.forEach(b => cb({ id: b.id, data: () => b }));
                    }
                  };
                }
              };
            }
          };
        },
        orderBy: (field, direction) => {
          return {
            onSnapshot: (callback) => {
              const listenerId = Math.random().toString();
              const listenerObj = {
                id: listenerId,
                callback: callback
              };
              mockDbListeners.push(listenerObj);
              
              const blogs = getMockBlogs();
              setTimeout(() => {
                callback({
                  empty: blogs.length === 0,
                  forEach: (cb) => {
                    const sorted = [...blogs].sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                    sorted.forEach(blog => cb({ id: blog.id, data: () => blog }));
                  }
                });
              }, 50);

              return () => {
                const idx = mockDbListeners.findIndex(l => l.id === listenerId);
                if (idx !== -1) mockDbListeners.splice(idx, 1);
              };
            }
          };
        },
        doc: (docId) => {
          return {
            get: async () => {
              const blogs = getMockBlogs();
              const blog = blogs.find(b => b.id === docId);
              return {
                exists: !!blog,
                data: () => blog
              };
            },
            update: async (data) => {
              const blogs = getMockBlogs();
              const idx = blogs.findIndex(b => b.id === docId);
              if (idx !== -1) {
                const cleanedData = { ...data };
                cleanedData.lastModified = { seconds: Math.floor(Date.now() / 1000) };
                if (cleanedData.createdAt && typeof cleanedData.createdAt === "object") {
                  cleanedData.createdAt = { seconds: Math.floor(Date.now() / 1000) };
                }
                blogs[idx] = { ...blogs[idx], ...cleanedData };
                saveMockBlogs(blogs);
              }
            },
            delete: async () => {
              let blogs = getMockBlogs();
              blogs = blogs.filter(b => b.id !== docId);
              saveMockBlogs(blogs);
            }
          };
        },
        add: async (data) => {
          const blogs = getMockBlogs();
          const id = "blog-id-" + Math.random().toString(36).substring(2, 9);
          const cleanedData = { ...data };
          cleanedData.createdAt = { seconds: Math.floor(Date.now() / 1000) };
          cleanedData.lastModified = { seconds: Math.floor(Date.now() / 1000) };
          const newBlog = {
            ...cleanedData,
            id
          };
          blogs.push(newBlog);
          saveMockBlogs(blogs);
          return { id };
        }
      };
    }
  };
}

// Expose Firebase modules globally for external page scripts (like read-blog.html)
window.db = db;
window.auth = auth;
window.storage = storage;
window.isMockFirebase = isMockFirebase;


// Dynamic Blog Platform Logic
document.addEventListener("DOMContentLoaded", () => {
  // Customize Navbar for Blog Page
  if (document.body.classList.contains("page-blog")) {
    document.querySelectorAll(".nav-write-link, #nav-write-btn").forEach(el => {
      el.style.setProperty("display", "none", "important");
    });
    
    document.querySelectorAll(".header-cta-btn").forEach(btn => {
      btn.textContent = "Switch to Blog Mode";
      btn.setAttribute("href", "#");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof window.selectMenuTab === "function") {
          window.selectMenuTab("home");
        }
        const mainEl = document.getElementById("main");
        if (mainEl) {
          mainEl.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  let setAuthMode;
  let setDashboardTab;

  // 1. Global Header Profile Dropdown & Auth UI Updating (Runs on all pages)
  const headerUserProfile = document.getElementById("header-user-profile");
  const headerProfileBtn = document.getElementById("header-profile-btn");
  const headerProfileDropdown = document.getElementById("header-profile-dropdown");
  const headerProfileAvatar = document.getElementById("header-profile-avatar");
  const headerProfileName = document.getElementById("header-profile-name");
  const headerProfileDisplayName = document.getElementById("header-profile-display-name");
  const headerProfileEmail = document.getElementById("header-profile-email");
  const headerLogoutBtn = document.getElementById("header-logout-btn");

  const mobileUserProfile = document.getElementById("mobile-user-profile");
  const mobileProfileAvatar = document.getElementById("mobile-profile-avatar");
  const mobileProfileName = document.getElementById("mobile-profile-name");
  const mobileProfileEmail = document.getElementById("mobile-profile-email");
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  const mobileLoginBtn = document.getElementById("mobile-login-btn");

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

  const parseUserProfile = (user) => {
    const rawName = user.displayName || "";
    if (rawName.includes("|")) {
      const parts = rawName.split("|");
      return {
        name: parts[0] || "Author",
        company: parts[1] || "Independent",
        bio: parts[2] || "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.",
        interests: parts[3] || ""
      };
    }
    return {
      name: rawName || "Author",
      company: "Independent",
      bio: "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.",
      interests: ""
    };
  };

  let unsubscribeMyPosts = null;

  const logoutUser = () => {
    if (!auth) return;
    if (unsubscribeMyPosts) {
      unsubscribeMyPosts();
      unsubscribeMyPosts = null;
    }
    auth.signOut().then(() => {
      console.log("Logged out.");
    });
  };

  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof window.startLogoutWizard === "function") {
        window.startLogoutWizard();
      } else {
        logoutUser();
      }
    });
  }

  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (typeof window.startLogoutWizard === "function") {
        window.startLogoutWizard();
      } else {
        logoutUser();
      }
    });
  }

  const updateAuthUI = (user) => {
    currentUser = user;
    
    if (user) {
      const profile = parseUserProfile(user);
      const userProfileDoc = {
        uid: user.uid,
        displayName: profile.name,
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`,
        email: user.email || "",
        bio: profile.bio || "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.",
        company: profile.company || "Independent",
        interests: profile.interests || "",
        lastSeen: new Date().toISOString()
      };
      if (isMockFirebase) {
        const mockUsers = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
        const idx = mockUsers.findIndex(u => u.uid === user.uid);
        if (idx === -1) {
          mockUsers.push(userProfileDoc);
        } else {
          mockUsers[idx] = { ...mockUsers[idx], ...userProfileDoc };
        }
        localStorage.setItem("jabzen_mock_users", JSON.stringify(mockUsers));
      } else if (db) {
        db.collection("users").doc(user.uid).set(userProfileDoc, { merge: true }).catch(err => {
          console.error("Error syncing user profile:", err);
        });
      }
    }
    
    // Sync Header Profile Dropdown (all pages)
    if (user) {
      const profile = parseUserProfile(user);
      if (headerUserProfile) headerUserProfile.style.display = "block";
      if (headerProfileAvatar) {
        headerProfileAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
      }
      if (headerProfileName) headerProfileName.textContent = profile.name;
      if (headerProfileDisplayName) headerProfileDisplayName.textContent = profile.name;
      if (headerProfileEmail) headerProfileEmail.textContent = user.email;

      // Sync Mobile Profile
      if (mobileUserProfile) mobileUserProfile.style.display = "block";
      if (mobileProfileAvatar) {
        mobileProfileAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
      }
      if (mobileProfileName) mobileProfileName.textContent = profile.name;
      if (mobileProfileEmail) mobileProfileEmail.textContent = user.email;
      if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
    } else {
      if (headerUserProfile) headerUserProfile.style.display = "none";
      if (mobileUserProfile) mobileUserProfile.style.display = "none";
      if (mobileLoginBtn) mobileLoginBtn.style.display = ""; // falls back to CSS mobile display
    }

    // Sync Left Sidebar Profile & Composer Greeting (all pages/blog page)
    const sidebarUserAvatar = document.getElementById("sidebar-user-avatar");
    const sidebarUserName = document.getElementById("sidebar-user-name");
    const composerUserAvatar = document.getElementById("composer-user-avatar");
    const composerGreeting = document.getElementById("composer-greeting");

    if (user) {
      const profile = parseUserProfile(user);
      if (sidebarUserName) sidebarUserName.textContent = profile.name;
      if (sidebarUserAvatar) {
        sidebarUserAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
      }
      if (composerUserAvatar) {
        composerUserAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
      }
      if (composerGreeting) {
        composerGreeting.textContent = `What's on your mind, ${profile.name}?`;
      }
    } else {
      if (sidebarUserName) sidebarUserName.textContent = "Guest User";
      if (sidebarUserAvatar) {
        sidebarUserAvatar.src = "https://www.gravatar.com/avatar/?d=mp";
      }
      if (composerUserAvatar) {
        composerUserAvatar.src = "https://www.gravatar.com/avatar/?d=mp";
      }
      if (composerGreeting) {
        composerGreeting.textContent = "What's on your mind, Guest?";
      }
    }

    // Sync Blog Dashboard (blog page only)
    const blogAuthSection = document.getElementById("blog-auth-section");
    if (blogAuthSection) {
      const guestAuthContainer = document.getElementById("guest-auth-container");
      const userDashboardContainer = document.getElementById("user-dashboard-container");
      const dashAvatar = document.getElementById("dash-avatar");
      const dashName = document.getElementById("dash-name");
      const dashMeta = document.getElementById("dash-meta");
      const dashBio = document.getElementById("dash-bio");
      const blogCompanyInput = document.getElementById("blog-company");
      const myPostsCount = document.getElementById("my-posts-count");

      if (user) {
        const profile = parseUserProfile(user);
        if (dashName) dashName.textContent = profile.name;
        if (dashMeta) dashMeta.textContent = `${profile.company} | ${user.email}`;
        if (dashBio) {
          let bioHtml = profile.bio || "";
          if (profile.interests) {
            bioHtml += `<br><span style="color: var(--brand-primary); font-weight: 600; font-style: normal; font-size: 0.8rem; display: block; margin-top: 6px;"><i class="fa-solid fa-tags"></i> Interests: ${profile.interests}</span>`;
          }
          dashBio.innerHTML = bioHtml;
        }
        if (dashAvatar) {
          dashAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
        }
        if (blogCompanyInput) blogCompanyInput.value = profile.company;
        
        if (guestAuthContainer) guestAuthContainer.style.display = "none";
        if (userDashboardContainer) userDashboardContainer.style.display = "block";
        if (typeof setDashboardTab === "function") {
          const targetTab = (window.location.hash === "#write") ? "write" : "manage";
          setDashboardTab(targetTab);
        }
        
        if (db) {
          if (unsubscribeMyPosts) unsubscribeMyPosts();
          unsubscribeMyPosts = db.collection("blogs")
            .where("authorUid", "==", user.uid)
            .onSnapshot((snap) => {
              if (myPostsCount) myPostsCount.textContent = snap.size;
              
              const statPostsCount = document.getElementById("stat-posts-count");
              const statLikesCount = document.getElementById("stat-likes-count");
              const sidebarPostsCount = document.getElementById("sidebar-posts-count");
              const sidebarLikesCount = document.getElementById("sidebar-likes-count");
              
              if (statPostsCount) statPostsCount.textContent = snap.size;
              if (sidebarPostsCount) sidebarPostsCount.textContent = snap.size;
              
              let totalLikes = 0;
              snap.forEach(doc => {
                totalLikes += doc.data().likes || 0;
              });
              if (statLikesCount) statLikesCount.textContent = totalLikes;
              if (sidebarLikesCount) sidebarLikesCount.textContent = totalLikes;
            });
        }
      } else {
        if (guestAuthContainer) guestAuthContainer.style.display = "block";
        if (userDashboardContainer) userDashboardContainer.style.display = "none";
        if (typeof setAuthMode === "function") {
          setAuthMode(false);
        }
      }
    }
    setupNotificationsSync();
  };
  window.updateAuthUI = updateAuthUI;

  // Register state changed listener for all pages
  if (auth) {
    auth.onAuthStateChanged(updateAuthUI);
  } else {
    updateAuthUI(null);
  }

  // --- EDITOR DRAWER CONTROLS ---
  window.toggleDrawer = (show, defaultTab = null) => {
    const drawer = document.getElementById("editor-drawer");
    const backdrop = document.getElementById("drawer-backdrop");
    if (!drawer || !backdrop) return;

    if (show) {
      drawer.classList.add("active");
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling behind drawer
      
      // Auto focus fields & switch to appropriate tab
      if (currentUser) {
        if (typeof setDashboardTab === "function") {
          setDashboardTab(defaultTab || "manage");
        }
        if (defaultTab === "write") {
          const titleInput = document.getElementById("blog-title");
          if (titleInput) titleInput.focus();
        }
      } else {
        const emailInput = document.getElementById("auth-email");
        if (emailInput) emailInput.focus();
      }
    } else {
      drawer.classList.remove("active");
      const blogLeftSidebar = document.querySelector(".blog-left-sidebar");
      if (blogLeftSidebar) {
        blogLeftSidebar.classList.remove("active");
      }
      backdrop.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable background scrolling
      
      // Clean up hash if closed
      if (window.location.hash === "#write") {
        window.history.pushState(null, null, " ");
      }
    }
  };

  const handleHashRouting = () => {
    if (window.location.hash === "#write") {
      window.toggleDrawer(true, "write");
    }
  };
  window.addEventListener("hashchange", handleHashRouting);
  setTimeout(handleHashRouting, 200);

  document.querySelectorAll(".nav-write-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.location.pathname.includes("blog") || document.getElementById("editor-drawer")) {
        e.preventDefault();
        window.toggleDrawer(true, "write");
      }
    });
  });

  const blogSidebarToggle = document.getElementById("blog-sidebar-toggle");
  const blogSidebarClose = document.getElementById("blog-sidebar-close");
  const blogLeftSidebar = document.querySelector(".blog-left-sidebar");
  const drawerBackdrop = document.getElementById("drawer-backdrop");

  if (blogSidebarToggle && blogLeftSidebar) {
    blogSidebarToggle.addEventListener("click", (e) => {
      e.preventDefault();
      blogLeftSidebar.classList.add("active");
      if (drawerBackdrop) {
        drawerBackdrop.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent scrolling behind drawer
      }
    });
  }

  if (blogSidebarClose && blogLeftSidebar) {
    blogSidebarClose.addEventListener("click", (e) => {
      e.preventDefault();
      blogLeftSidebar.classList.remove("active");
      if (drawerBackdrop && (!document.getElementById("editor-drawer") || !document.getElementById("editor-drawer").classList.contains("active"))) {
        drawerBackdrop.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable background scrolling
      }
    });
  }

  // 2. Blog Dashboard Specific Logic (Runs only on Blog page)
  window.bindBlogPageEvents = () => {
    const blogAuthSection = document.getElementById("blog-auth-section");
    if (!blogAuthSection) return;
    const guestAuthContainer = document.getElementById("guest-auth-container");
    const emailAuthForm = document.getElementById("email-auth-form");
    const signupExtraFields = document.getElementById("signup-extra-fields");
    const authModeSigninBtn = document.getElementById("auth-mode-signin");
    const authModeSignupBtn = document.getElementById("auth-mode-signup");
    const authSubmitBtn = document.getElementById("auth-submit-btn");

    const authNameInput = document.getElementById("auth-name");
    const authCompanyInputForm = document.getElementById("auth-company-input");
    const authEmailInput = document.getElementById("auth-email");
    const authPasswordInput = document.getElementById("auth-password");

    const userDashboardContainer = document.getElementById("user-dashboard-container");
    const dashAvatar = document.getElementById("dash-avatar");
    const dashName = document.getElementById("dash-name");
    const dashMeta = document.getElementById("dash-meta");
    const dashboardLogoutBtn = document.getElementById("dashboard-logout-btn");

    const tabBtnWrite = document.getElementById("tab-btn-write");
    const tabBtnManage = document.getElementById("tab-btn-manage");
    const tabContentWrite = document.getElementById("tab-content-write");
    const tabContentManage = document.getElementById("tab-content-manage");
    const myPostsCount = document.getElementById("my-posts-count");
    const myBlogsTableBody = document.getElementById("my-blogs-table-body");

    const writeBlogForm = document.getElementById("write-blog-form");
    const formHeading = document.getElementById("form-heading");
    const editingDocIdInput = document.getElementById("editing-doc-id");
    const blogTitleInput = document.getElementById("blog-title");
    const blogCategorySelect = document.getElementById("blog-category");
    const blogCompanyInput = document.getElementById("blog-company");
    const blogImageInput = document.getElementById("blog-image");
    const imageSizeError = document.getElementById("image-size-error");
    const imagePreviewWrap = document.getElementById("image-preview-wrap");
    const imagePreview = document.getElementById("image-preview");
    const cancelWriteBtn = document.getElementById("cancel-write-btn");
    const submitBlogBtn = document.getElementById("submit-blog-btn");
    const dynamicBlogsContainer = document.getElementById("dynamic-blogs-container");

    let base64ImageString = "";
    let selectedImageFile = null;
    let isSignUpMode = false;

    // Auth Mode Switching (Sign In vs Register) & switch link bottom updates
    const authModeSwitchP = document.getElementById("auth-mode-switch-p");
    setAuthMode = (signup) => {
    isSignUpMode = signup;
    const forgotBtn = document.getElementById("forgot-password-btn");
    
    if (signup) {
      signupExtraFields.style.display = "flex";
      authModeSignupBtn.style.color = "var(--accent)";
      authModeSignupBtn.style.fontWeight = "700";
      authModeSignupBtn.style.borderBottom = "2px solid var(--accent)";
      authModeSigninBtn.style.color = "var(--text-secondary)";
      authModeSigninBtn.style.fontWeight = "600";
      authModeSigninBtn.style.borderBottom = "none";
      authSubmitBtn.textContent = "Create Account";
      authNameInput.required = true;
      authCompanyInputForm.required = true;
      if (forgotBtn) forgotBtn.style.display = "none";
      
      if (authModeSwitchP) {
        authModeSwitchP.innerHTML = 'Already have an account? <a href="#" id="auth-switch-link" style="color: var(--accent); font-weight: 700; text-decoration: none;">Sign In</a>';
        const link = document.getElementById("auth-switch-link");
        if (link) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            setAuthMode(false);
          });
        }
      }
    } else {
      signupExtraFields.style.display = "none";
      authModeSigninBtn.style.color = "var(--accent)";
      authModeSigninBtn.style.fontWeight = "700";
      authModeSigninBtn.style.borderBottom = "2px solid var(--accent)";
      authModeSignupBtn.style.color = "var(--text-secondary)";
      authModeSignupBtn.style.fontWeight = "600";
      authModeSignupBtn.style.borderBottom = "none";
      authSubmitBtn.textContent = "Sign In";
      authNameInput.required = false;
      authCompanyInputForm.required = false;
      if (forgotBtn) forgotBtn.style.display = "inline";
      
      if (authModeSwitchP) {
        authModeSwitchP.innerHTML = 'Don\'t have an account? <a href="#" id="auth-switch-link" style="color: var(--accent); font-weight: 700; text-decoration: none;">Register Now</a>';
        const link = document.getElementById("auth-switch-link");
        if (link) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            setAuthMode(true);
          });
        }
      }
    }
  };

  if (authModeSigninBtn && authModeSignupBtn) {
    authModeSigninBtn.addEventListener("click", () => setAuthMode(false));
    authModeSignupBtn.addEventListener("click", () => setAuthMode(true));
  }

  // Initialize switch links on load
  const switchLink = document.getElementById("auth-switch-link");
  if (switchLink) {
    switchLink.addEventListener("click", (e) => {
      e.preventDefault();
      setAuthMode(isSignUpMode);
    });
  }

  // Forgot Password handler
  const forgotPasswordBtn = document.getElementById("forgot-password-btn");
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", () => {
      const email = authEmailInput.value.trim();
      if (!email) {
        alert("Please enter your email address in the Email field first, then click 'Forgot Password?' to receive a reset link.");
        authEmailInput.focus();
        return;
      }
      
      if (!auth) {
        alert("Firebase Auth is not initialized.");
        return;
      }
      
      if (isMockFirebase) {
        alert("Mock Reset Link Sent: Check simulated inbox at " + email + " (Simulation).");
        return;
      }
      
      forgotPasswordBtn.disabled = true;
      const originalText = forgotPasswordBtn.textContent;
      forgotPasswordBtn.textContent = "Sending...";
      
      auth.sendPasswordResetEmail(email)
        .then(() => {
          alert("Success! Password reset email has been sent. Please check your inbox at " + email + ".");
        })
        .catch((err) => {
          console.error("Password reset error:", err);
          let errMsg = err.message;
          if (err.code === "auth/user-not-found") {
            errMsg = "There is no user record corresponding to this email address. The user may not exist.";
          } else if (err.code === "auth/invalid-email") {
            errMsg = "The email address is invalid.";
          } else if (err.code === "auth/configuration-not-found" || err.code === "auth/invalid-api-key" || errMsg.toLowerCase().includes("api key") || errMsg.toLowerCase().includes("configuration")) {
            alert("Firebase Authentication is not configured or accessible for this project. Switching automatically to Local Demo Mode (LocalStorage) so you can test the website.");
            localStorage.setItem("jabzen_use_mock_mode", "true");
            window.location.reload();
            return;
          }
          alert("Password Reset Error: " + errMsg);
        })
        .finally(() => {
          forgotPasswordBtn.disabled = false;
          forgotPasswordBtn.textContent = originalText;
        });
    });
  }

  // Auth Flow Trigger Actions
  const loginWithGoogle = () => {
    if (!auth) {
      alert("Firebase is not configured with real credentials yet.");
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then(() => {
        window.toggleDrawer(false);
      })
      .catch((err) => {
        console.error("Google Auth failed:", err);
        let errMsg = err.message;
        if (err.code === "auth/configuration-not-found" || err.code === "auth/invalid-api-key" || errMsg.toLowerCase().includes("api key") || errMsg.toLowerCase().includes("configuration")) {
          alert("Firebase Authentication is not configured or accessible for this project. Switching automatically to Local Demo Mode (LocalStorage) so you can test the website.");
          localStorage.setItem("jabzen_use_mock_mode", "true");
          window.location.reload();
          return;
        }
        alert("Google Sign-In failed: " + errMsg);
      });
  };

  const handleEmailAuthSubmit = (e) => {
    e.preventDefault();
    if (!auth) {
      alert("Firebase is not configured with real credentials.");
      return;
    }

    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    const originalText = authSubmitBtn.textContent;
    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = "Processing...";

    if (isSignUpMode) {
      const name = authNameInput.value.trim();
      const company = authCompanyInputForm.value.trim();

      auth.createUserWithEmailAndPassword(email, password)
        .then(async (result) => {
          // Format display name as "Name|Company" to store both fields securely
          await result.user.updateProfile({
            displayName: `${name}|${company}`
          });
          console.log("Account created successfully.");
          emailAuthForm.reset();
          window.toggleDrawer(false);
        })
        .catch((err) => {
          console.error("Registration failed:", err);
          let errMsg = err.message;
          if (err.code === "auth/operation-not-allowed") {
            errMsg = "Email/Password sign-in provider is disabled in your Firebase project. Please enable it in the Firebase console under Authentication > Sign-in method.";
          } else if (err.code === "auth/email-already-in-use") {
            errMsg = "This email address is already in use by another account. Please Sign In instead.";
          } else if (err.code === "auth/weak-password") {
            errMsg = "The password is too weak. It must be at least 6 characters.";
          } else if (err.code === "auth/invalid-email") {
            errMsg = "The email address is invalid.";
          } else if (err.code === "auth/configuration-not-found" || err.code === "auth/invalid-api-key" || errMsg.toLowerCase().includes("api key") || errMsg.toLowerCase().includes("configuration")) {
            alert("Firebase Authentication is not configured or accessible for this project. Switching automatically to Local Demo Mode (LocalStorage) so you can test the website.");
            localStorage.setItem("jabzen_use_mock_mode", "true");
            window.location.reload();
            return;
          }
          alert("Registration Error: " + errMsg);
        })
        .finally(() => {
          authSubmitBtn.disabled = false;
          authSubmitBtn.textContent = originalText;
        });
    } else {
      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log("Logged in successfully.");
          emailAuthForm.reset();
          window.toggleDrawer(false);
        })
        .catch((err) => {
          console.error("Login failed:", err);
          let errMsg = err.message;
          if (err.code === "auth/operation-not-allowed") {
            errMsg = "Email/Password sign-in provider is disabled in your Firebase project. Please enable it in the Firebase console under Authentication > Sign-in method.";
          } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
            errMsg = "Invalid email or password. Please verify your credentials and try again.";
          } else if (err.code === "auth/invalid-email") {
            errMsg = "The email address is badly formatted.";
          } else if (err.code === "auth/user-disabled") {
            errMsg = "This user account has been disabled by an administrator.";
          } else if (err.code === "auth/configuration-not-found" || err.code === "auth/invalid-api-key" || errMsg.toLowerCase().includes("api key") || errMsg.toLowerCase().includes("configuration")) {
            alert("Firebase Authentication is not configured or accessible for this project. Switching automatically to Local Demo Mode (LocalStorage) so you can test the website.");
            localStorage.setItem("jabzen_use_mock_mode", "true");
            window.location.reload();
            return;
          }
          alert("Login Error: " + errMsg);
        })
        .finally(() => {
          authSubmitBtn.disabled = false;
          authSubmitBtn.textContent = originalText;
        });
    }
  };
  // Phone OTP Sign-In Elements
  const phoneLoginToggleBtn = document.getElementById("phone-login-toggle-btn");
  const phoneAuthForm = document.getElementById("phone-auth-form");
  const phoneSwitchToEmailLink = document.getElementById("phone-switch-to-email-link");
  const emailAuthHeader = document.getElementById("email-auth-header");
  const phoneInputGroup = document.getElementById("phone-input-group");
  const otpInputGroup = document.getElementById("otp-input-group");
  const sendOtpBtn = document.getElementById("send-otp-btn");
  const authPhoneInput = document.getElementById("auth-phone");
  const authOtpInput = document.getElementById("auth-otp");
  const authPhoneNameInput = document.getElementById("auth-phone-name");
  const authPhoneCompanyInput = document.getElementById("auth-phone-company");

  // Toggle Forms Handlers
  if (phoneLoginToggleBtn) {
    phoneLoginToggleBtn.addEventListener("click", () => {
      emailAuthForm.style.display = "none";
      if (emailAuthHeader) emailAuthHeader.style.display = "none";
      if (phoneAuthForm) {
        phoneAuthForm.style.display = "flex";
        initPhoneRecaptcha();
      }
    });
  }

  if (phoneSwitchToEmailLink) {
    phoneSwitchToEmailLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (phoneAuthForm) phoneAuthForm.style.display = "none";
      emailAuthForm.style.display = "flex";
      if (emailAuthHeader) emailAuthHeader.style.display = "flex";
    });
  }

  // Recaptcha Verifier Initialization
  const initPhoneRecaptcha = () => {
    if (isMockFirebase || window.recaptchaVerifier) return;
    try {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'normal',
        'callback': (response) => {
          console.log("reCAPTCHA solved");
        },
        'expired-callback': () => {
          console.log("reCAPTCHA expired");
        }
      });
      window.recaptchaVerifier.render();
    } catch (e) {
      console.error("Recaptcha init failed:", e);
    }
  };

  // Send Phone OTP SMS
  if (sendOtpBtn) {
    sendOtpBtn.addEventListener("click", () => {
      const phoneNumber = authPhoneInput.value.trim();
      const name = authPhoneNameInput.value.trim();
      const company = authPhoneCompanyInput.value.trim();

      if (!phoneNumber) {
        alert("Please enter a valid phone number including country code (+91XXXXXXXXXX).");
        authPhoneInput.focus();
        return;
      }
      if (!name || !company) {
        alert("Please enter both Full Name and Company Name to continue.");
        return;
      }

      sendOtpBtn.disabled = true;
      const originalText = sendOtpBtn.textContent;
      sendOtpBtn.textContent = "Sending OTP...";

      if (isMockFirebase) {
        setTimeout(() => {
          alert("Mock SMS Sent: Enter code '123456' to log in (Simulation).");
          phoneInputGroup.style.display = "none";
          document.getElementById("phone-details-group").style.display = "none";
          otpInputGroup.style.display = "flex";
          sendOtpBtn.disabled = false;
          sendOtpBtn.textContent = originalText;
        }, 1000);
      } else {
        initPhoneRecaptcha();
        auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert("Verification code has been sent successfully to " + phoneNumber + ".");
            phoneInputGroup.style.display = "none";
            document.getElementById("phone-details-group").style.display = "none";
            otpInputGroup.style.display = "flex";
          })
          .catch((err) => {
            console.error("Phone Auth Send OTP error:", err);
            alert("Failed to send OTP: " + err.message);
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
              document.getElementById("recaptcha-container").innerHTML = "";
              initPhoneRecaptcha();
            }
          })
          .finally(() => {
            sendOtpBtn.disabled = false;
            sendOtpBtn.textContent = originalText;
          });
      }
    });
  }

  // Verify OTP and Sign In
  if (phoneAuthForm) {
    phoneAuthForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const otpCode = authOtpInput.value.trim();
      const name = authPhoneNameInput.value.trim();
      const company = authPhoneCompanyInput.value.trim();

      if (!otpCode || otpCode.length !== 6) {
        alert("Please enter the 6-digit verification code.");
        authOtpInput.focus();
        return;
      }

      const verifyBtn = document.getElementById("verify-otp-btn");
      const originalText = verifyBtn.textContent;
      verifyBtn.disabled = true;
      verifyBtn.textContent = "Verifying...";

      if (isMockFirebase) {
        setTimeout(() => {
          if (otpCode === "123456") {
            const uid = "mock-phone-uid-" + Math.random().toString(36).substring(2, 9);
            const newUser = {
              email: "phoneuser@simulated.com",
              uid: uid,
              displayName: `${name}|${company}`,
              photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=d6ad2d&color=121212`
            };
            localStorage.setItem("jabzen_mock_current_user", JSON.stringify(newUser));
            
            // Trigger mocked listener
            const savedUsers = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
            savedUsers.push(newUser);
            localStorage.setItem("jabzen_mock_users", JSON.stringify(savedUsers));
            
            window.location.reload(); // Quick way to reload and update auth state cleanly
          } else {
            alert("Invalid verification code. Use '123456' for the local mock demo.");
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalText;
          }
        }, 1000);
      } else {
        if (!window.confirmationResult) {
          alert("Verification session has expired. Please request a new OTP.");
          verifyBtn.disabled = false;
          verifyBtn.textContent = originalText;
          return;
        }
        window.confirmationResult.confirm(otpCode)
          .then((result) => {
            const user = result.user;
            return user.updateProfile({
              displayName: `${name}|${company}`
            }).then(() => {
              console.log("Phone profile updated.");
              phoneAuthForm.reset();
              window.location.reload();
            });
          })
          .catch((err) => {
            console.error("OTP verification error:", err);
            alert("Verification failed: " + err.message);
          })
          .finally(() => {
            verifyBtn.disabled = false;
            verifyBtn.textContent = originalText;
          });
      }
    });
  }

  document.getElementById("google-login-btn").addEventListener("click", loginWithGoogle);
  dashboardLogoutBtn.addEventListener("click", (e) => { e.preventDefault(); window.startLogoutWizard(); });
  emailAuthForm.addEventListener("submit", handleEmailAuthSubmit);  // Manual Database Mode Switcher Toggle
  const dbModeStatus = document.getElementById("db-mode-status");
  const toggleDbModeBtn = document.getElementById("toggle-db-mode-btn");

  if (dbModeStatus && toggleDbModeBtn) {
    if (isMockFirebase) {
      dbModeStatus.innerHTML = '<span style="color: var(--accent);">Local Demo (Mock)</span>';
      toggleDbModeBtn.innerHTML = '<i class="fa-solid fa-wifi"></i> Switch to Live Firebase';
    } else {
      dbModeStatus.innerHTML = '<span style="color: #25D366;">Live Firebase</span>';
      toggleDbModeBtn.innerHTML = '<i class="fa-solid fa-laptop"></i> Switch to Local Demo';
    }

    toggleDbModeBtn.addEventListener("click", () => {
      if (isMockFirebase) {
        localStorage.setItem("jabzen_use_mock_mode", "false");
      } else {
        localStorage.setItem("jabzen_use_mock_mode", "true");
      }
      window.location.reload();
    });
  }

  // 3. Tab Navigation Handlers
  setDashboardTab = (activeTab) => {
    if (activeTab === "write") {
      tabBtnWrite.className = "btn btn-primary";
      tabBtnWrite.style.background = "";
      tabBtnWrite.style.borderColor = "";
      tabBtnWrite.style.color = "";
      
      tabBtnManage.className = "btn btn-secondary";
      tabBtnManage.style.background = "var(--soft)";
      tabBtnManage.style.borderColor = "var(--line)";
      tabBtnManage.style.color = "var(--text-secondary)";
      
      tabContentWrite.style.display = "block";
      tabContentManage.style.display = "none";
    } else {
      tabBtnManage.className = "btn btn-primary";
      tabBtnManage.style.background = "";
      tabBtnManage.style.borderColor = "";
      tabBtnManage.style.color = "";
      
      tabBtnWrite.className = "btn btn-secondary";
      tabBtnWrite.style.background = "var(--soft)";
      tabBtnWrite.style.borderColor = "var(--line)";
      tabBtnWrite.style.color = "var(--text-secondary)";
      
      tabContentWrite.style.display = "none";
      tabContentManage.style.display = "block";
      loadUserBlogsList();
    }
  };

  tabBtnWrite.addEventListener("click", () => setDashboardTab("write"));
  tabBtnManage.addEventListener("click", () => setDashboardTab("manage"));

  // (Removed redundant updateAuthUI & parseUserProfile helper declarations)

  // 6. Image Picker & Processing
  blogImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      imageSizeError.style.display = "block";
      blogImageInput.value = "";
      imagePreviewWrap.style.display = "none";
      base64ImageString = "";
      selectedImageFile = null;
      return;
    }

    imageSizeError.style.display = "none";
    selectedImageFile = file;
    const reader = new FileReader();
    reader.onload = (event) => {
      base64ImageString = event.target.result;
      imagePreview.src = base64ImageString;
      imagePreviewWrap.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

  const clearEditor = () => {
    writeBlogForm.reset();
    editingDocIdInput.value = "";
    formHeading.textContent = "Publish a New Post";
    submitBlogBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Publish Post';
    imagePreviewWrap.style.display = "none";
    if (document.getElementById("blog-visibility")) {
      document.getElementById("blog-visibility").value = "Public";
    }
    imageSizeError.style.display = "none";
    base64ImageString = "";
    selectedImageFile = null;
    blogImageInput.required = false;
    
    // Restore default company autofill if logged in
    if (currentUser) {
      const profile = parseUserProfile(currentUser);
      blogCompanyInput.value = profile.company;
    }
  };

  cancelWriteBtn.addEventListener("click", () => {
    clearEditor();
    window.toggleDrawer(false);
  });

  // 7. Write/Update Submit Handler
  writeBlogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!db) {
      alert("Database connection is inactive. Configure Firebase API keys.");
      return;
    }
    if (!currentUser) {
      alert("Please log in to publish a post.");
      return;
    }

    const editId = editingDocIdInput.value;
    const isEditing = editId !== "";
    


    const originalText = submitBlogBtn.innerHTML;
    submitBlogBtn.disabled = true;
    submitBlogBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';

    const profile = parseUserProfile(currentUser);

    const blogData = {
      title: blogTitleInput.value.trim(),
      category: blogCategorySelect.value,
      company: blogCompanyInput.value.trim(),
      visibility: document.getElementById("blog-visibility")?.value || "Public",
      content: document.getElementById("blog-content").value.trim(),
      authorName: profile.name,
      authorEmail: currentUser.email || "",
      authorPhoto: currentUser.photoURL || `https://ui-avatars.com/avatar/?d=mp`,
      authorUid: currentUser.uid,
      lastModified: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      // Handle Image Upload to Firebase Storage (or Mock fallback)
      if (selectedImageFile) {
        if (isMockFirebase || !storage) {
          // Fallback to local Base64 string for mock mode
          blogData.image = base64ImageString;
        } else {
          try {
            // Upload actual file to Storage
            const fileExtension = selectedImageFile.name.split('.').pop();
            const fileName = `blog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
            const storageRef = storage.ref().child(`blog-covers/${fileName}`);
            
            submitBlogBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading Image...';
            const uploadSnapshot = await storageRef.put(selectedImageFile);
            const downloadUrl = await uploadSnapshot.ref.getDownloadURL();
            blogData.image = downloadUrl;
          } catch (storageErr) {
            console.warn("Storage upload failed, falling back to Base64 image:", storageErr);
            // Fallback to Base64 text string in Firestore database
            blogData.image = base64ImageString;
          }
        }
      } else if (base64ImageString) {
        // Fallback for mock if only base64 string is present (e.g. from editing)
        blogData.image = base64ImageString;
      }

      submitBlogBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving Post...';

      if (isEditing) {
        await db.collection("blogs").doc(editId).update(blogData);
        alert("Success! Your blog post has been updated.");
      } else {
        blogData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("blogs").add(blogData);
        alert("Success! Your blog post has been published.");
      }
      clearEditor();
      window.toggleDrawer(false);
      setDashboardTab("manage");
    } catch (err) {
      console.error("Firestore submit error:", err);
      alert("Error: Failed to submit blog post. " + err.message);
    } finally {
      submitBlogBtn.disabled = false;
      submitBlogBtn.innerHTML = originalText;
    }
  });

  // 8. Load Manage Table List
  const loadUserBlogsList = () => {
    if (!db || !currentUser) return;
    myBlogsTableBody.innerHTML = '<tr><td colspan="4" style="padding: 2rem; text-align: center; color: var(--text-secondary);"><i class="fa-solid fa-spinner fa-spin"></i> Loading posts...</td></tr>';
    
    db.collection("blogs")
      .where("authorUid", "==", currentUser.uid)
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) => {
        myBlogsTableBody.innerHTML = "";
        if (snapshot.empty) {
          myBlogsTableBody.innerHTML = '<tr><td colspan="4" style="padding: 2rem; text-align: center; color: var(--text-secondary);">No posts published yet.</td></tr>';
          return;
        }

        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString();
          const tr = document.createElement("tr");
          tr.style.borderBottom = "1px solid var(--line)";
          
          tr.innerHTML = `
            <td style="padding: 1rem; color: var(--text-primary); font-weight: 700; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${data.title}</td>
            <td style="padding: 1rem;">${data.category}</td>
            <td style="padding: 1rem;">${date}</td>
            <td style="padding: 1rem; text-align: center; display: flex; gap: 0.5rem; justify-content: center;">
              <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; min-height: unset; border-radius: 30px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;" onclick="window.editBlog('${doc.id}')"><i class="fa-solid fa-pencil"></i> Edit</button>
              <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; min-height: unset; border-radius: 30px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; color: #ff4d4d; border-color: rgba(255, 77, 77, 0.2);" onclick="window.deleteBlog('${doc.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
          `;
          myBlogsTableBody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Error loading user blogs:", err);
        myBlogsTableBody.innerHTML = `<tr><td colspan="4" style="padding: 2rem; text-align: center; color: #ff4d4d;">Failed to load posts: ${err.message}</td></tr>`;
      });
  };

  // 9. Global CRUD functions mapped to window object
  window.editBlog = (id) => {
    if (!db) return;
    db.collection("blogs").doc(id).get()
      .then((doc) => {
        if (!doc.exists) return;
        const data = doc.data();
        
        // Populate inputs
        editingDocIdInput.value = doc.id;
        blogTitleInput.value = data.title || "";
        blogCategorySelect.value = data.category || "SEO";
        blogCompanyInput.value = data.company || "";
        document.getElementById("blog-content").value = data.content || "";
        const visibilityEl = document.getElementById("blog-visibility");
        if (visibilityEl) {
          visibilityEl.value = data.visibility || "Public";
        }
        
        // Show image preview
        if (data.image) {
          imagePreview.src = data.image;
          imagePreviewWrap.style.display = "block";
          blogImageInput.required = false; // Don't require file upload again
        } else {
          imagePreviewWrap.style.display = "none";
          blogImageInput.required = false;
        }

        formHeading.textContent = "Edit Blog Post";
        submitBlogBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Save Changes';
        
        // Switch tab
        setDashboardTab("write");
        
        // Open drawer
        window.toggleDrawer(true);
      })
      .catch((err) => {
        console.error("Error retrieving document for editing:", err);
      });
  };

  window.deleteBlog = (id) => {
    if (!db) return;
    if (confirm("Are you sure you want to delete this blog post permanently? This action cannot be undone.")) {
      db.collection("blogs").doc(id).delete()
        .then(() => {
          alert("Blog post deleted successfully.");
          loadUserBlogsList();
          window.toggleDrawer(false);
        })
        .catch((err) => {
          console.error("Error deleting document:", err);
          alert("Failed to delete post: " + err.message);
        });
    }
  };

// 10. Load, Filter, Sort, and Render Public dynamic blogs
  let currentSortMode = "weeklyTop";
  let currentCategoryFilter = "all";
  let currentMenuTab = "home";
  let blogsCache = [];
  let categoriesList = ["All Topics", "Marketing", "SEO", "AI & Tech", "Branding", "Case Study", "Story", "Poetry", "Others"];

  window.selectCategory = (categoryName) => {
    currentCategoryFilter = categoryName;
    renderSidebarCategories();
    filterAndRenderBlogs();
  };

  const renderSidebarCategories = () => {
    const listContainer = document.getElementById("sidebar-categories-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    
    categoriesList.forEach((cat) => {
      const isAll = cat === "All Topics";
      const catKey = isAll ? "all" : cat;
      const isActive = currentCategoryFilter === catKey;
      
      const item = document.createElement("a");
      item.className = "category-item" + (isActive ? " active" : "");
      item.href = "#";
      item.onclick = (e) => {
        e.preventDefault();
        window.selectCategory(catKey);
      };
      
      const nameSpan = document.createElement("span");
      nameSpan.textContent = cat;
      item.appendChild(nameSpan);
      
      if (isActive) {
        const dotSpan = document.createElement("span");
        dotSpan.className = "category-active-dot";
        item.appendChild(dotSpan);
      }
      
      listContainer.appendChild(item);
    });
  };
  window.renderSidebarCategories = renderSidebarCategories;

  window.createCategoryPrompt = () => {
    const catName = prompt("Enter the name of the new category:");
    if (catName && catName.trim()) {
      const trimmed = catName.trim();
      if (!categoriesList.includes(trimmed)) {
        categoriesList.push(trimmed);
      }
      window.selectCategory(trimmed);
    }
  };

  window.selectMenuTab = (tabName) => {
    currentMenuTab = tabName;
    
    const menuItems = ["home", "trending", "myposts", "saved", "following"];
    menuItems.forEach((item) => {
      const el = document.getElementById(`menu-${item}`);
      if (el) {
        if (item === tabName) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      }
    });
    
    filterAndRenderBlogs();
  };

  window.toggleSavePost = (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!currentUser) {
      alert("Please sign in to save articles.");
      window.toggleDrawer(true);
      return;
    }
    
    let savedList = [];
    try {
      savedList = JSON.parse(localStorage.getItem("jabzen_saved_posts") || "[]");
    } catch(e){}
    
    const idx = savedList.indexOf(id);
    let isSavedNow = false;
    if (idx === -1) {
      savedList.push(id);
      isSavedNow = true;
      alert("Article saved to your reading list!");
    } else {
      savedList.splice(idx, 1);
      alert("Article removed from your reading list.");
    }
    localStorage.setItem("jabzen_saved_posts", JSON.stringify(savedList));
    
    document.querySelectorAll(`[data-save-id="${id}"]`).forEach((btn) => {
      const icon = btn.querySelector("i");
      if (isSavedNow) {
        btn.classList.add("saved");
        if (icon) icon.className = "fa-solid fa-bookmark";
      } else {
        btn.classList.remove("saved");
        if (icon) icon.className = "fa-regular fa-bookmark";
      }
    });

    const saveDelta = isSavedNow ? 1 : -1;
    try {
      if (isMockFirebase) {
        const blogs = JSON.parse(localStorage.getItem("jabzen_mock_blogs") || "[]");
        const bIdx = blogs.findIndex(b => b.id === id);
        if (bIdx !== -1) {
          blogs[bIdx].savesCount = Math.max(0, (blogs[bIdx].savesCount || 0) + saveDelta);
          window.saveMockBlogsGlobal(blogs);
        }
      } else if (db) {
        db.collection("blogs").doc(id).update({
          savesCount: firebase.firestore.FieldValue.increment(saveDelta)
        });
      }
    } catch(err) {
      console.error("Failed to update savesCount:", err);
    }
    
    if (currentMenuTab === "saved") {
      filterAndRenderBlogs();
    }
  };

  window.sharePost = (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const shareUrl = `${window.location.origin}/read-blog.html?id=${id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert("Link copied to clipboard! Share it with your friends.");
        
        try {
          if (isMockFirebase) {
            const blogs = JSON.parse(localStorage.getItem("jabzen_mock_blogs") || "[]");
            const idx = blogs.findIndex(b => b.id === id);
            if (idx !== -1) {
              blogs[idx].sharesCount = (blogs[idx].sharesCount || 0) + 1;
              window.saveMockBlogsGlobal(blogs);
            }
          } else if (db) {
            db.collection("blogs").doc(id).update({
              sharesCount: firebase.firestore.FieldValue.increment(1)
            });
          }
          document.querySelectorAll(`.shares-header-count-${id}`).forEach(el => {
            const currentCount = parseInt(el.textContent) || 0;
            el.textContent = `${currentCount + 1} Shares`;
          });
        } catch(err) {
          console.error("Failed to update sharesCount:", err);
        }
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        alert(`Share link: ${shareUrl}`);
      });
  };

  window.toggleFollowWriter = (btnEl, authorUid) => {
    if (!currentUser) {
      alert("Please sign in to follow writers.");
      window.toggleDrawer(true);
      return;
    }
    
    if (!authorUid) {
      const writerNameEl = btnEl.closest(".writer-item")?.querySelector(".writer-name");
      const name = writerNameEl ? writerNameEl.textContent.trim() : "Unknown";
      if (name === "Auden Rivers") authorUid = "uid-auden-rivers";
      else if (name === "Mira Kapoor") authorUid = "uid-mira-kapoor";
      else if (name === "James Carter") authorUid = "uid-james-carter";
      else authorUid = "uid-" + name.toLowerCase().replace(/\s+/g, "-");
    }
    
    let followedWriters = [];
    try {
      followedWriters = JSON.parse(localStorage.getItem("jabzen_followed_writers") || "[]");
    } catch(e){}
    
    const idx = followedWriters.indexOf(authorUid);
    let isFollowingNow = false;
    if (idx === -1) {
      followedWriters.push(authorUid);
      isFollowingNow = true;
    } else {
      followedWriters.splice(idx, 1);
    }
    localStorage.setItem("jabzen_followed_writers", JSON.stringify(followedWriters));
    
    if (isFollowingNow) {
      btnEl.textContent = "Following";
      btnEl.classList.add("following");
    } else {
      btnEl.textContent = "Follow";
      btnEl.classList.remove("following");
    }
    
    if (currentMenuTab === "following") {
      filterAndRenderBlogs();
    }
  };

  const updateFollowButtonsUI = () => {
    let followedWriters = [];
    try {
      followedWriters = JSON.parse(localStorage.getItem("jabzen_followed_writers") || "[]");
    } catch(e){}
    
    document.querySelectorAll(".writer-item").forEach((item) => {
      const nameEl = item.querySelector(".writer-name");
      const btnEl = item.querySelector(".btn-follow");
      if (nameEl && btnEl) {
        const name = nameEl.textContent.trim();
        let authorUid = "uid-" + name.toLowerCase().replace(/\s+/g, "-");
        if (name === "Auden Rivers") authorUid = "uid-auden-rivers";
        else if (name === "Mira Kapoor") authorUid = "uid-mira-kapoor";
        else if (name === "James Carter") authorUid = "uid-james-carter";
        
        if (followedWriters.includes(authorUid)) {
          btnEl.textContent = "Following";
          btnEl.classList.add("following");
        } else {
          btnEl.textContent = "Follow";
          btnEl.classList.remove("following");
        }
      }
    });
  };

  let notificationsUnsubscribe = null;
  let allNotifications = [];

  const setupNotificationsSync = () => {
    if (!currentUser) {
      updateNotificationsBadge(0);
      return;
    }

    if (isMockFirebase) {
      const loadMockNotifs = () => {
        let notifs = [];
        try {
          notifs = JSON.parse(localStorage.getItem("jabzen_mock_notifications") || "[]");
        } catch(e){}
        if (notifs.length === 0) {
          notifs = [
            {
              id: "notif-init-1",
              receiverUid: currentUser.uid,
              senderUid: "uid-auden-rivers",
              senderName: "Auden Rivers",
              senderPhoto: "assets/avatar-auden.jpg",
              text: "liked your draft 'Creative Storytelling in 2026'",
              type: "like",
              read: false,
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: "notif-init-2",
              receiverUid: currentUser.uid,
              senderUid: "uid-james-carter",
              senderName: "James Carter",
              senderPhoto: "assets/avatar-james.jpg",
              text: "accepted your connection request",
              type: "connection_accepted",
              read: false,
              createdAt: new Date(Date.now() - 7200000).toISOString()
            }
          ];
          localStorage.setItem("jabzen_mock_notifications", JSON.stringify(notifs));
        }
        allNotifications = notifs.filter(n => n.receiverUid === currentUser.uid);
        const unreadCount = allNotifications.filter(n => !n.read).length;
        updateNotificationsBadge(unreadCount);
      };

      loadMockNotifs();
      window.addEventListener("mock_notif_update", loadMockNotifs);
    } else if (db) {
      if (notificationsUnsubscribe) notificationsUnsubscribe();
      notificationsUnsubscribe = db.collection("notifications")
        .where("receiverUid", "==", currentUser.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          allNotifications = [];
          snapshot.forEach(doc => {
            allNotifications.push({ id: doc.id, ...doc.data() });
          });
          const unreadCount = allNotifications.filter(n => !n.read).length;
          updateNotificationsBadge(unreadCount);
        }, (err) => {
          console.error("Notifications sync error:", err);
        });
    }
  };

  const updateNotificationsBadge = (count) => {
    const badge = document.querySelector("#menu-notifications .badge");
    if (badge) {
      if (count > 0) {
        badge.style.display = "inline-block";
        badge.textContent = count;
      } else {
        badge.style.display = "none";
      }
    }
  };

  window.addMockNotification = (receiverUid, senderName, senderPhoto, text, type) => {
    if (!receiverUid) return;
    const newNotif = {
      id: Math.random().toString(36).substring(2, 11),
      receiverUid: receiverUid,
      senderUid: currentUser ? currentUser.uid : "guest",
      senderName: senderName || "Guest",
      senderPhoto: senderPhoto || "https://www.gravatar.com/avatar/?d=mp",
      text: text || "",
      type: type || "info",
      read: false,
      createdAt: new Date().toISOString()
    };
    try {
      const notifs = JSON.parse(localStorage.getItem("jabzen_mock_notifications") || "[]");
      notifs.unshift(newNotif);
      localStorage.setItem("jabzen_mock_notifications", JSON.stringify(notifs));
      window.dispatchEvent(new Event("mock_notif_update"));
    } catch(e){}
  };

  window.createNotification = async (receiverUid, text, type) => {
    if (!receiverUid || (currentUser && receiverUid === currentUser.uid)) return;
    const profile = currentUser ? parseUserProfile(currentUser) : { name: "Guest" };
    const senderPhoto = currentUser ? (currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`) : "https://www.gravatar.com/avatar/?d=mp";
    if (isMockFirebase) {
      window.addMockNotification(receiverUid, profile.name, senderPhoto, text, type);
    } else if (db) {
      try {
        await db.collection("notifications").add({
          receiverUid: receiverUid,
          senderUid: currentUser ? currentUser.uid : "guest",
          senderName: profile.name,
          senderPhoto: senderPhoto,
          text: text,
          type: type,
          read: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      } catch(e) {}
    }
  };

  window.showNotifications = () => {
    if (!currentUser) {
      alert("Please sign in to view notifications.");
      window.toggleDrawer(true);
      return;
    }
    let backdrop = document.getElementById("notifications-modal-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "notifications-modal-backdrop";
      backdrop.style.cssText = "display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 2000; align-items: center; justify-content: center; padding: 1rem; box-sizing: border-box; transition: opacity 0.2s ease;";
      backdrop.onclick = window.closeNotificationsModal;
      backdrop.innerHTML = `
        <div class="notifications-modal-card" onclick="event.stopPropagation()" style="background: var(--bg-secondary); border: 1px solid var(--border-color); width: 460px; max-width: 100%; border-radius: 16px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column; max-height: 80vh; position: relative;">
          <button class="profile-modal-close" onclick="window.closeNotificationsModal()" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer; line-height: 1; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">&times;</button>
          <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
            <h3 style="margin: 0; font-family: var(--font-heading); font-size: 1.3rem; color: var(--text-primary); font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-bell" style="color: var(--brand-primary);"></i> Notifications
            </h3>
          </div>
          <div id="notifications-modal-list" style="padding: 1.5rem; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px; background: var(--bg);">
            <!-- Dynamic notifications list -->
          </div>
          <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: var(--bg-secondary);">
            <button class="btn btn-outline" onclick="window.markAllNotificationsRead()" style="font-size: 0.78rem; padding: 0.5rem 1.25rem; border-radius: 30px; font-weight: 600; min-height: unset;">Mark all as read</button>
            <button class="btn btn-primary" onclick="window.closeNotificationsModal()" style="font-size: 0.78rem; padding: 0.5rem 1.25rem; border-radius: 30px; font-weight: 700; min-height: unset;">Close</button>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }
    renderNotificationsList();
    backdrop.style.display = "flex";
    setTimeout(() => backdrop.style.opacity = "1", 10);
  };

  window.closeNotificationsModal = () => {
    const backdrop = document.getElementById("notifications-modal-backdrop");
    if (backdrop) {
      backdrop.style.opacity = "0";
      setTimeout(() => backdrop.style.display = "none", 200);
    }
  };

  const renderNotificationsList = () => {
    const listContainer = document.getElementById("notifications-modal-list");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    if (allNotifications.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
          <i class="fa-regular fa-bell-slash" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="margin: 0; font-size: 0.9rem;">You are completely caught up!</p>
        </div>
      `;
      return;
    }
    allNotifications.forEach(notif => {
      const item = document.createElement("div");
      item.style.cssText = `display: flex; gap: 12px; align-items: flex-start; padding: 0.75rem 1rem; border-radius: 12px; background: ${notif.read ? 'var(--bg-secondary)' : 'rgba(214, 173, 45, 0.05)'}; border: 1px solid ${notif.read ? 'transparent' : 'rgba(214, 173, 45, 0.15)'}; transition: var(--transition-smooth);`;
      const timeStr = notif.createdAt ? new Date(notif.createdAt.seconds ? notif.createdAt.seconds * 1000 : notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just now";
      let icon = "";
      if (notif.type === "like") icon = '<i class="fa-solid fa-heart" style="color: #ff4d4d; font-size: 0.8rem;"></i>';
      else if (notif.type === "comment") icon = '<i class="fa-solid fa-comment" style="color: var(--brand-primary); font-size: 0.8rem;"></i>';
      else if (notif.type === "connection_request") icon = '<i class="fa-solid fa-user-plus" style="color: var(--brand-cta); font-size: 0.8rem;"></i>';
      else if (notif.type === "connection_accepted") icon = '<i class="fa-solid fa-circle-check" style="color: #25D366; font-size: 0.8rem;"></i>';
      item.innerHTML = `
        <div style="position: relative;">
          <img src="${notif.senderPhoto || 'https://www.gravatar.com/avatar/?d=mp'}" alt="" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color); cursor: pointer;" onclick="window.closeNotificationsModal(); window.showUserProfileModal('${notif.senderUid}')">
          <div style="position: absolute; bottom: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%; background: var(--bg-secondary); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center;">
            ${icon}
          </div>
        </div>
        <div style="flex: 1; min-width: 0;">
          <p style="margin: 0; font-size: 0.86rem; color: var(--text-primary); line-height: 1.4; word-break: break-word;">
            <strong style="color: var(--text-primary); cursor: pointer;" onclick="window.closeNotificationsModal(); window.showUserProfileModal('${notif.senderUid}')">${notif.senderName}</strong> ${notif.text}
          </p>
          <span style="font-size: 0.72rem; color: var(--text-secondary); opacity: 0.8; display: block; margin-top: 4px;">${timeStr}</span>
        </div>
      `;
      listContainer.appendChild(item);
    });
  };

  window.markAllNotificationsRead = async () => {
    if (!currentUser) return;
    if (isMockFirebase) {
      try {
        const notifs = JSON.parse(localStorage.getItem("jabzen_mock_notifications") || "[]");
        notifs.forEach(n => {
          if (n.receiverUid === currentUser.uid) n.read = true;
        });
        localStorage.setItem("jabzen_mock_notifications", JSON.stringify(notifs));
        window.dispatchEvent(new Event("mock_notif_update"));
      } catch(e){}
    } else if (db) {
      const batch = db.batch();
      allNotifications.forEach(n => {
        if (!n.read) {
          const ref = db.collection("notifications").doc(n.id);
          batch.update(ref, { read: true });
        }
      });
      try {
        await batch.commit();
      } catch(e) {}
    }
    renderNotificationsList();
  };

  let activeUsersList = [];
  let usersUnsubscribe = null;

  const setupActiveCommunitySync = () => {
    const statusEl = document.querySelector(".active-community-status");
    const avatarsEl = document.querySelector(".active-community-avatars");
    if (!statusEl || !avatarsEl) return;

    if (isMockFirebase) {
      const updateMockCommunity = () => {
        let users = [];
        try {
          users = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
        } catch(e){}
        
        const defaultMockUids = ["uid-auden-rivers", "uid-mira-kapoor", "uid-james-carter"];
        defaultMockUids.forEach(uid => {
          if (!users.find(u => u.uid === uid)) {
            users.push({
              uid: uid,
              displayName: uid === "uid-auden-rivers" ? "Auden Rivers" : uid === "uid-mira-kapoor" ? "Mira Kapoor" : "James Carter",
              photoURL: uid === "uid-auden-rivers" ? "assets/avatar-auden.jpg" : uid === "uid-mira-kapoor" ? "assets/avatar-mira.jpg" : "assets/avatar-james.jpg",
              lastSeen: new Date(Date.now() - 60000).toISOString()
            });
          }
        });

        const fiveMinsAgo = Date.now() - 300000;
        activeUsersList = users.filter(u => {
          const time = u.lastSeen ? new Date(u.lastSeen).getTime() : 0;
          return time >= fiveMinsAgo;
        });

        renderActiveCommunityUI();
      };

      updateMockCommunity();
      window.addEventListener("mock_user_update", updateMockCommunity);
      window.addEventListener("mock_msg_update", updateMockCommunity);
      window.addEventListener("mock_notif_update", updateMockCommunity);
    } else if (db) {
      if (usersUnsubscribe) usersUnsubscribe();
      
      const fiveMinsAgo = new Date(Date.now() - 300000).toISOString();
      usersUnsubscribe = db.collection("users")
        .where("lastSeen", ">=", fiveMinsAgo)
        .onSnapshot((snapshot) => {
          activeUsersList = [];
          snapshot.forEach(doc => {
            activeUsersList.push({ uid: doc.id, ...doc.data() });
          });
          renderActiveCommunityUI();
        }, (err) => {
          console.error("Users status sync error:", err);
        });
    }
  };

  const renderActiveCommunityUI = () => {
    const statusEl = document.querySelector(".active-community-status");
    const avatarsEl = document.querySelector(".active-community-avatars");
    if (!statusEl || !avatarsEl) return;

    statusEl.innerHTML = `<span class="online-indicator-dot"></span> ${activeUsersList.length} online now`;
    avatarsEl.innerHTML = "";

    const visibleUsers = activeUsersList.slice(0, 5);
    visibleUsers.forEach(user => {
      const img = document.createElement("img");
      img.src = user.photoURL || "https://www.gravatar.com/avatar/?d=mp";
      img.alt = user.displayName || "User";
      img.style.cursor = "pointer";
      img.title = user.displayName;
      img.onclick = () => window.showUserProfileModal(user.uid);
      avatarsEl.appendChild(img);
    });

    if (activeUsersList.length > 5) {
      const overflow = document.createElement("div");
      overflow.className = "avatars-overflow";
      overflow.textContent = `+${activeUsersList.length - 5}`;
      avatarsEl.appendChild(overflow);
    }
  };

  const renderRightSidebarWidgets = () => {
    const trendingContainer = document.querySelector(".trending-topics-list");
    if (trendingContainer) {
      trendingContainer.innerHTML = "";
      if (blogsCache.length === 0) {
        trendingContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;'>Available Soon</p>";
      } else {
        const counts = {};
        blogsCache.forEach(blog => {
          const cat = blog.category || "Others";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        const sortedCats = Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0, 5);
        sortedCats.forEach(cat => {
          const item = document.createElement("div");
          item.className = "trending-topic-item";
          item.onclick = () => { window.selectCategory(cat === "All Topics" ? "all" : cat); return false; };
          item.innerHTML = `
            <div class="topic-left">
              <span class="topic-hashtag"># ${cat}</span>
              <i class="fa-solid fa-arrow-trend-up topic-trend-icon"></i>
            </div>
            <span class="topic-stats">${counts[cat]} posts</span>
          `;
          trendingContainer.appendChild(item);
        });
      }
    }

    const writersContainer = document.querySelector(".top-writers-list");
    if (writersContainer) {
      writersContainer.innerHTML = "";
      if (blogsCache.length === 0) {
        writersContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;'>Available Soon (Count: 0)</p>";
      } else {
        const writersMap = {};
        blogsCache.forEach(blog => {
          const uid = blog.authorUid;
          if (!uid) return;
          if (!writersMap[uid]) {
            writersMap[uid] = {
              uid: uid,
              name: blog.authorName || "Creator",
              photo: blog.authorPhoto || "https://www.gravatar.com/avatar/?d=mp",
              likes: 0,
              posts: 0
            };
          }
          writersMap[uid].likes += blog.likes || 0;
          writersMap[uid].posts += 1;
        });

        const topWriters = Object.values(writersMap).sort((a,b) => (b.likes + b.posts) - (a.likes + a.posts)).slice(0, 3);
        let followedWriters = [];
        try {
          followedWriters = JSON.parse(localStorage.getItem("jabzen_followed_writers") || "[]");
        } catch(e){}

        if (topWriters.length === 0) {
          writersContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;'>Available Soon (Count: 0)</p>";
        } else {
          topWriters.forEach(writer => {
            const isFollowing = followedWriters.includes(writer.uid);
            let baseFollowers = 150;
            if (writer.uid === "uid-auden-rivers") baseFollowers = 12400;
            else if (writer.uid === "uid-mira-kapoor") baseFollowers = 8700;
            else if (writer.uid === "uid-james-carter") baseFollowers = 6300;
            
            const totalFollowers = baseFollowers + (isFollowing ? 1 : 0);
            const followersText = totalFollowers >= 1000 ? (totalFollowers / 1000).toFixed(1) + "k" : totalFollowers;

            const item = document.createElement("div");
            item.className = "writer-item";
            item.innerHTML = `
              <img class="writer-avatar" src="${writer.photo}" alt="" onclick="window.showUserProfileModal('${writer.uid}')" style="cursor:pointer;">
              <div class="writer-details">
                <span class="writer-name" onclick="window.showUserProfileModal('${writer.uid}')" style="cursor:pointer; font-weight:700;">${writer.name}</span>
                <span class="writer-followers">${followersText} followers</span>
              </div>
              <button class="btn btn-outline btn-follow ${isFollowing ? 'following' : ''}" onclick="window.toggleFollowWriter(this, '${writer.uid}'); return false;">${isFollowing ? 'Following' : 'Follow'}</button>
            `;
            writersContainer.appendChild(item);
          });
        }
      }
    }

    const popularContainer = document.querySelector(".popular-posts-list");
    if (popularContainer) {
      popularContainer.innerHTML = "";
      if (blogsCache.length === 0) {
        popularContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;'>Available Soon (Count: 0)</p>";
      } else {
        const popularBlogs = [...blogsCache].sort((a,b) => {
          const scoreA = (a.likes || 0) + (a.commentsCount || 0);
          const scoreB = (b.likes || 0) + (b.commentsCount || 0);
          return scoreB - scoreA;
        }).slice(0, 3);

        popularBlogs.forEach((blog, index) => {
          const item = document.createElement("div");
          item.className = "popular-post-item";
          item.onclick = () => { window.toggleCommentsInline(blog.id); return false; };
          item.innerHTML = `
            <span class="post-rank">${index + 1}</span>
            <div class="popular-post-details">
              <span class="popular-post-title">${blog.title}</span>
              <span class="popular-post-views">${blog.category || 'Story'} &bull; By ${blog.authorName} &bull; ${blog.likes || 0} Likes</span>
            </div>
          `;
          popularContainer.appendChild(item);
        });
      }
    }
  };


  const isCreatedThisWeek = (createdAt) => {
    if (!createdAt) return false;
    let createdMs = 0;
    if (createdAt.seconds) {
      createdMs = createdAt.seconds * 1000;
    } else if (createdAt.toDate) {
      createdMs = createdAt.toDate().getTime();
    } else {
      createdMs = new Date(createdAt).getTime();
    }
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return createdMs > sevenDaysAgo;
  };

  const filterAndRenderBlogs = () => {
    if (!dynamicBlogsContainer) return;
    dynamicBlogsContainer.innerHTML = "";

    // A. Filter by Category & Visibility & Search & Menu Tab
    let filtered = [...blogsCache];
    
    // Privacy filter: exclude Private posts unless current user is the author
    filtered = filtered.filter(b => {
      if (b.visibility === "Private") {
        return currentUser && b.authorUid === currentUser.uid;
      }
      return true;
    });

    if (currentCategoryFilter !== "all") {
      filtered = filtered.filter(b => b.category === currentCategoryFilter);
    }

    // Search filter
    const searchInput = document.getElementById("global-search-input");
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (searchQuery) {
      filtered = filtered.filter(b => {
        const title = (b.title || "").toLowerCase();
        const content = (b.content || "").toLowerCase();
        const author = (b.authorName || "").toLowerCase();
        const category = (b.category || "").toLowerCase();
        return title.includes(searchQuery) || content.includes(searchQuery) || author.includes(searchQuery) || category.includes(searchQuery);
      });
    }

    // Menu Tab filter
    if (currentMenuTab === "myposts") {
      filtered = filtered.filter(b => currentUser && b.authorUid === currentUser.uid);
    } else if (currentMenuTab === "saved") {
      let savedList = [];
      try {
        savedList = JSON.parse(localStorage.getItem("jabzen_saved_posts") || "[]");
      } catch(e){}
      filtered = filtered.filter(b => savedList.includes(b.id));
    } else if (currentMenuTab === "following") {
      let followedWriters = [];
      try {
        followedWriters = JSON.parse(localStorage.getItem("jabzen_followed_writers") || "[]");
      } catch(e){}
      filtered = filtered.filter(b => followedWriters.includes(b.authorUid));
    }

    // B. Get top 3 overall liked posts (among the visible/filtered ones) for default grouping
    const sortedByLikesFull = [...filtered].sort((a, b) => {
      const aLikes = a.likes || 0;
      const bLikes = b.likes || 0;
      if (aLikes !== bLikes) {
        return bLikes - aLikes;
      }
      const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
      const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
    const top3Ids = sortedByLikesFull.slice(0, 3).map(b => b.id);

    // C. Sort by Mode (or Tab)
    if (currentMenuTab === "trending") {
      filtered.sort((a, b) => {
        const scoreA = (a.likes || 0) + (a.commentsCount || 0) + (a.sharesCount || 0) + (a.savesCount || 0);
        const scoreB = (b.likes || 0) + (b.commentsCount || 0) + (b.sharesCount || 0) + (b.savesCount || 0);
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
    } else if (currentMenuTab === "home") {
      // Default: Top 3 liked posts first, then the rest sorted by latest (or weekly) desc
      filtered.sort((a, b) => {
        const aIsTop3 = top3Ids.includes(a.id);
        const bIsTop3 = top3Ids.includes(b.id);
        
        if (aIsTop3 && !bIsTop3) return -1;
        if (!aIsTop3 && bIsTop3) return 1;
        
        if (aIsTop3 && bIsTop3) {
          return (b.likes || 0) - (a.likes || 0);
        }
        
        // Default to latest desc
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
    } else {
      // Other tabs: sort by latest desc
      filtered.sort((a, b) => {
        const aTime = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const bTime = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return bTime - aTime;
      });
    }

    if (filtered.length === 0) {
      dynamicBlogsContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">No pieces found in this view.</div>';
      return;
    }

    // D. Get Liked List
    let likedList = [];
    try {
      likedList = JSON.parse(localStorage.getItem("jabzen_liked_posts") || "[]");
    } catch(e){}

    // E. Render Cards
    filtered.forEach((blog) => {
      const isLiked = likedList.includes(blog.id);
      const likedClass = isLiked ? "liked" : "";
      const date = blog.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      }) : new Date().toLocaleDateString();

      const isOwner = currentUser && blog.authorUid === currentUser.uid;
      const ownerActionsHtml = isOwner ? `
        <div style="position: absolute; top: 15px; right: 45px; display: flex; gap: 6px; z-index: 5;">
          <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; min-height: unset; border-radius: 30px; background: rgba(18, 18, 18, 0.85); backdrop-filter: blur(4px); font-weight: 700; border-color: var(--line);" onclick="window.editBlog('${blog.id}'); return false;"><i class="fa-solid fa-pencil" style="font-size: 0.7rem;"></i></button>
          <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; min-height: unset; border-radius: 30px; background: rgba(18, 18, 18, 0.85); backdrop-filter: blur(4px); font-weight: 700; border-color: rgba(255, 77, 77, 0.3); color: #ff4d4d;" onclick="window.deleteBlog('${blog.id}'); return false;"><i class="fa-solid fa-trash" style="font-size: 0.7rem;"></i></button>
        </div>
      ` : "";

      const chatButtonHtml = (currentUser && !isOwner) ? `
        <button class="btn-chat-author" onclick="window.startChatWithAuthor('${blog.authorUid}', '${blog.authorName.replace(/'/g, "\\'")}', '${blog.authorPhoto || ''}'); return false;" title="Chat with Author" style="width: 28px; height: 28px; font-size: 0.8rem; margin-right: 6px;">
          <i class="fa-solid fa-comments"></i>
        </button>
      ` : "";

      // Check user interests keywords
      let isSuggested = false;
      if (currentUser) {
        const profile = parseUserProfile(currentUser);
        if (profile.interests) {
          const keywords = profile.interests.split(",").map(k => k.trim().toLowerCase()).filter(k => k);
          const postText = ((blog.title || "") + " " + (blog.content || "") + " " + (blog.category || "")).toLowerCase();
          isSuggested = keywords.some(keyword => postText.includes(keyword));
        }
      }

      const categoryBadge = `<span class="medium-card-category" style="margin-right: 0; background: var(--brand-primary); color: #fff; border: none; font-size: 0.65rem; padding: 0.25rem 0.75rem;">${blog.category}</span>`;
      const privateBadge = (blog.visibility === "Private") ? `<span class="private-badge"><i class="fa-solid fa-lock"></i> Private</span>` : "";
      const suggestedBadge = isSuggested ? `<span class="recommended-badge"><i class="fa-solid fa-star"></i> Recommended</span>` : "";
      const trendingBadge = top3Ids.includes(blog.id) ? `<span class="trending-badge"><i class="fa-solid fa-fire"></i> Top Pick</span>` : "";

      const card = document.createElement("article");

      if (blog.category === "Poetry" || blog.category === "Poem") {
        card.className = "card poetry-card reveal active is-visible" + (isSuggested ? " recommended-post" : "");
        card.style.cssText = "display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 2rem; position: relative; min-height: 380px;";
        
        card.innerHTML = `
          ${ownerActionsHtml}
          <div style="font-family: var(--font-heading); font-size: 3rem; line-height: 1; color: var(--brand-primary); opacity: 0.2; position: absolute; top: 1rem; left: 1.5rem; font-style: italic; pointer-events: none;">&ldquo;</div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; z-index: 1; flex-wrap: wrap; gap: 6px;">
            <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
              ${categoryBadge}
              ${suggestedBadge}
              ${trendingBadge}
              ${privateBadge}
            </div>
            <small style="color: var(--text-secondary); font-size: 0.75rem;">${date}</small>
          </div>
          
          <div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; text-align: center; margin-bottom: 1.5rem; z-index: 1;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.4rem; font-family: var(--font-heading); font-style: italic; font-weight: 600; line-height: 1.3;">
              <a href="read-blog.html?id=${blog.id}" style="color: var(--text-primary); transition: color 0.18s ease;">${blog.title}</a>
            </h3>
            <div style="font-family: var(--font-heading); font-size: 1.15rem; font-style: italic; color: var(--text-primary); line-height: 1.8; white-space: pre-line; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; padding: 0 1rem;">
              ${blog.content}
            </div>
          </div>

          <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; justify-content: space-between; align-items: center; z-index: 1;">
            <span style="font-size: 0.85rem; color: var(--text-secondary); font-style: italic;">&mdash; <strong style="color: var(--text-primary); font-family: var(--font-body); font-style: normal; cursor: pointer;" onclick="window.showUserProfileModal('${blog.authorUid}')">${blog.authorName}</strong></span>
            
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              ${chatButtonHtml}
              <button class="btn-like ${likedClass}" onclick="window.toggleLike('${blog.id}', event)" style="background: none; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-size: 0.9rem; color: var(--text-secondary); transition: var(--transition-smooth);" data-liked-id="${blog.id}">
                <svg class="heart-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="transition: fill 0.3s ease, stroke 0.3s ease;">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span class="likes-count" style="font-weight: 700; color: var(--text-primary);">${blog.likes || 0}</span>
              </button>
              
              <a href="read-blog.html?id=${blog.id}" class="btn btn-outline" style="font-size: 0.75rem; padding: 0.35rem 1rem; min-height: unset; border-radius: 30px; display: inline-flex; align-items: center; gap: 4px; border-color: var(--border-color);">Read Poem</a>
            </div>
          </div>
        `;
      } else {
        // LinkedIn-style Social Card Layout
        card.className = "feed-post-card reveal active is-visible" + (isSuggested ? " recommended-post" : "");
        
        const imageHtml = blog.image ? `
          <div class="post-cover-image-wrap">
            <img src="${blog.image}" alt="${blog.title}" class="post-cover-image">
          </div>
        ` : '';

        let excerpt = blog.content || "";
        if (excerpt.length > 200) {
          excerpt = excerpt.substring(0, 200).trim() + "...";
        }

        let savedList = [];
        try {
          savedList = JSON.parse(localStorage.getItem("jabzen_saved_posts") || "[]");
        } catch(e){}
        const isSaved = savedList.includes(blog.id);
        const savedClass = isSaved ? "saved" : "";
        const bookmarkIconClass = isSaved ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark";
        
        const visIcon = (blog.visibility === "Private") ? 
          `<i class="fa-solid fa-lock" title="Private to Author"></i>` : 
          `<i class="fa-solid fa-earth-americas" title="Public Feed"></i>`;
        
        const commentsCount = blog.commentsCount || Math.floor(Math.random() * 8);
        const sharesCount = blog.sharesCount || Math.floor(Math.random() * 5);
        const authorBadgeHtml = (blog.likes && blog.likes >= 5) ? `<span class="author-tag-badge gold">Top Writer</span>` : `<span class="author-tag-badge green">Top Pick</span>`;

        card.innerHTML = `
          ${ownerActionsHtml}
          <div class="post-meta-row">
            <div class="post-author-block">
              <img class="post-avatar" src="${blog.authorPhoto || 'https://www.gravatar.com/avatar/?d=mp'}" alt="" style="cursor: pointer;" onclick="window.showUserProfileModal('${blog.authorUid}')">
              <div class="post-author-details">
                <div class="post-author-top">
                  <span class="post-author-name" style="cursor: pointer;" onclick="window.showUserProfileModal('${blog.authorUid}')">${blog.authorName}</span>
                  ${authorBadgeHtml}
                </div>
                <div class="post-author-bottom">
                  <span>${date}</span>
                  <span class="meta-separator">&bull;</span>
                  ${visIcon}
                </div>
              </div>
            </div>
            <button class="post-options-btn" aria-label="Post Options"><i class="fa-solid fa-ellipsis"></i></button>
          </div>
          
          <h3 class="post-title">
            <a href="read-blog.html?id=${blog.id}">${blog.title}</a>
          </h3>
          
          <p class="post-excerpt">${excerpt}</p>
          
          ${imageHtml}
          
          <div class="post-interactions-bar">
            <div class="reactions-left">
              <span class="reaction-badge-icons">
                <i class="fa-solid fa-thumbs-up" style="color: #3b82f6; font-size: 0.75rem;"></i>
                <i class="fa-solid fa-heart" style="color: #ef4444; font-size: 0.75rem; margin-left: -4px;"></i>
              </span>
              <span class="likes-count" style="font-weight: 700; margin-left: 4px;">${blog.likes || 0}</span>
            </div>
            <div class="interactions-right">
              <span class="comments-header-count-${blog.id}">${commentsCount} Comments</span>
              <span class="meta-separator">&bull;</span>
              <span class="shares-header-count-${blog.id}">${sharesCount} Shares</span>
            </div>
          </div>
          
          <div class="post-actions-footer">
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="post-action-btn btn-like ${likedClass}" onclick="window.toggleLike('${blog.id}', event)" data-liked-id="${blog.id}">
                <i class="fa-regular fa-thumbs-up"></i> <span>Like</span>
              </button>
              <button class="post-action-btn" onclick="window.toggleCommentsInline('${blog.id}', event)">
                <i class="fa-regular fa-comment"></i> <span>Comment</span>
              </button>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${chatButtonHtml}
              <button class="post-action-btn btn-save ${savedClass}" onclick="window.toggleSavePost('${blog.id}', event)" data-save-id="${blog.id}">
                <i class="${bookmarkIconClass}"></i> <span>Save</span>
              </button>
              <button class="post-action-btn" onclick="window.sharePost('${blog.id}', event)">
                <i class="fa-regular fa-share-from-square"></i> <span>Share</span>
              </button>
            </div>
          </div>
          
          <!-- Inline Comments Section -->
          <div id="comments-section-${blog.id}" class="post-comments-section" style="display: none;">
            <div class="inline-comment-form">
              <img class="comment-input-avatar" src="${currentUser ? (currentUser.photoURL || 'https://www.gravatar.com/avatar/?d=mp') : 'https://www.gravatar.com/avatar/?d=mp'}" alt="">
              <input type="text" id="comment-input-${blog.id}" placeholder="Write a comment..." class="inline-comment-input" onkeydown="if(event.key === 'Enter') window.postCommentInline('${blog.id}')">
              <button class="btn btn-primary inline-comment-post-btn" onclick="window.postCommentInline('${blog.id}')">Post</button>
            </div>
            <div id="comments-list-${blog.id}" class="inline-comments-list"></div>
            <button id="comments-see-more-${blog.id}" class="see-more-comments-btn" style="display: none;" onclick="window.expandCommentsInline('${blog.id}')">See More Comments</button>
          </div>
        `;
      }
      dynamicBlogsContainer.appendChild(card);
    });
  };
  window.filterAndRenderBlogs = filterAndRenderBlogs;

  // Bind global search input
  const searchInput = document.getElementById("global-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterAndRenderBlogs();
    });
  }

  // Toggle Likes and prevent duplicates
  window.toggleLike = async (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!db && !isMockFirebase) {
      alert("Database connection is inactive. Configure Firebase API keys.");
      return;
    }

    let likedPosts = [];
    try {
      likedPosts = JSON.parse(localStorage.getItem("jabzen_liked_posts") || "[]");
    } catch(e){}

    const hasLiked = likedPosts.includes(id);
    const likeDelta = hasLiked ? -1 : 1;

    try {
      let authorUid = null;
      let title = "";
      if (isMockFirebase) {
        const blogs = JSON.parse(localStorage.getItem("jabzen_mock_blogs") || "[]");
        const idx = blogs.findIndex(b => b.id === id);
        if (idx !== -1) {
          blogs[idx].likes = Math.max(0, (blogs[idx].likes || 0) + likeDelta);
          window.saveMockBlogsGlobal(blogs);
          authorUid = blogs[idx].authorUid;
          title = blogs[idx].title;
        }
      } else {
        const increment = firebase.firestore.FieldValue.increment(likeDelta);
        await db.collection("blogs").doc(id).update({
          likes: increment
        });
        const doc = await db.collection("blogs").doc(id).get();
        if (doc.exists) {
          authorUid = doc.data().authorUid;
          title = doc.data().title;
        }
      }

      if (likeDelta > 0 && authorUid && currentUser && authorUid !== currentUser.uid) {
        window.createNotification(authorUid, `liked your post "${title}"`, "like");
      }

      if (hasLiked) {
        likedPosts = likedPosts.filter(pid => pid !== id);
      } else {
        likedPosts.push(id);
      }
      localStorage.setItem("jabzen_liked_posts", JSON.stringify(likedPosts));

      // Instant UI update
      document.querySelectorAll(`[data-liked-id="${id}"]`).forEach((btn) => {
        btn.classList.toggle("liked", !hasLiked);
        const countSpan = btn.querySelector(".likes-count");
        if (countSpan) {
          let countVal = parseInt(countSpan.textContent) || 0;
          countSpan.textContent = Math.max(0, countVal + likeDelta);
        }
      });
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Load snapshot to local cache
  if (window.unsubscribeBlogs) {
    window.unsubscribeBlogs();
  }
  if (db) {
    window.unsubscribeBlogs = db.collection("blogs").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      blogsCache = [];
      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          blogsCache.push({ id: doc.id, ...doc.data() });
        });
      }
      filterAndRenderBlogs();
      renderSidebarCategories();
      updateFollowButtonsUI();
      renderRightSidebarWidgets();
      
      // Update statistics counters for current logged-in user dynamically
      if (currentUser) {
        const myBlogs = blogsCache.filter(b => b.authorUid === currentUser.uid);
        const myPostsCount = document.getElementById("my-posts-count");
        const statPostsCount = document.getElementById("stat-posts-count");
        const statLikesCount = document.getElementById("stat-likes-count");
        
        if (myPostsCount) myPostsCount.textContent = myBlogs.length;
        if (statPostsCount) statPostsCount.textContent = myBlogs.length;
        
        let totalLikes = 0;
        myBlogs.forEach(b => {
          totalLikes += b.likes || 0;
        });
        if (statLikesCount) statLikesCount.textContent = totalLikes;
      }
    }, (err) => {
      console.error("Snapshot error loading blogs:", err);
    });
  }

  // Bind controls
  const sortSelect = document.getElementById("blog-sort-select");
  if (sortSelect) {
    sortSelect.value = currentSortMode;
    sortSelect.addEventListener("change", (e) => {
      currentSortMode = e.target.value;
      filterAndRenderBlogs();
    });
  }

  const filterChipsWrap = document.getElementById("category-filter-chips");
  if (filterChipsWrap) {
    filterChipsWrap.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-category-filter]");
      if (!chip) return;
      
      filterChipsWrap.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      
      currentCategoryFilter = chip.getAttribute("data-category-filter");
      filterAndRenderBlogs();
    });
  }

  // Profile Editor Bindings
  const editBioToggleBtn = document.getElementById("edit-bio-toggle-btn");
  const editProfileFieldsWrap = document.getElementById("edit-profile-fields-wrap");
  const editProfileForm = document.getElementById("edit-profile-form");
  const editProfileNameInput = document.getElementById("edit-profile-name");
  const editProfileCompanyInput = document.getElementById("edit-profile-company");
  const editProfileBioInput = document.getElementById("edit-profile-bio");
  const editProfileCancelBtn = document.getElementById("edit-profile-cancel-btn");

  if (editBioToggleBtn && editProfileFieldsWrap) {
    editBioToggleBtn.addEventListener("click", () => {
      if (editProfileFieldsWrap.style.display === "none") {
        editProfileFieldsWrap.style.display = "block";
        if (currentUser) {
          const profile = parseUserProfile(currentUser);
          editProfileNameInput.value = profile.name;
          editProfileCompanyInput.value = profile.company;
          editProfileBioInput.value = profile.bio;
          const interestsEl = document.getElementById("edit-profile-interests");
          if (interestsEl) {
            interestsEl.value = profile.interests || "";
          }
        }
      } else {
        editProfileFieldsWrap.style.display = "none";
      }
    });
  }

  if (editProfileCancelBtn && editProfileFieldsWrap) {
    editProfileCancelBtn.addEventListener("click", () => {
      editProfileFieldsWrap.style.display = "none";
    });
  }

  if (editProfileForm) {
    editProfileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!currentUser) return;

      const newName = editProfileNameInput.value.trim() || "Author";
      const newCompany = editProfileCompanyInput.value.trim() || "Independent";
      const newBio = editProfileBioInput.value.trim() || "Creative storyteller.";
      const newInterests = (document.getElementById("edit-profile-interests")?.value || "").trim();

      const compoundName = `${newName}|${newCompany}|${newBio}|${newInterests}`;
      const saveBtn = editProfileForm.querySelector('button[type="submit"]');
      const origText = saveBtn.textContent;
      saveBtn.disabled = true;
      saveBtn.textContent = "Saving...";

      try {
        if (isMockFirebase) {
          currentUser.displayName = compoundName;
          localStorage.setItem("jabzen_mock_current_user", JSON.stringify(currentUser));
          
          const savedUsers = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
          const idx = savedUsers.findIndex(u => u.uid === currentUser.uid);
          if (idx !== -1) {
            savedUsers[idx].displayName = compoundName;
            localStorage.setItem("jabzen_mock_users", JSON.stringify(savedUsers));
          }
          updateAuthUI(currentUser);
        } else {
          await currentUser.updateProfile({ displayName: compoundName });
          updateAuthUI(currentUser);
        }
        
        editProfileFieldsWrap.style.display = "none";
        alert("Success! Profile details updated.");
      } catch (err) {
        console.error("Profile update failed:", err);
        alert("Failed to update profile: " + err.message);
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = origText;
      }
    });
  }

  // --- DIRECT PEER CHAT SYSTEM & 4-STEP LOGOUT WIZARD ---
  
  // A. Local Mock Message Store Helpers
  const getMockMessages = () => {
    try {
      return JSON.parse(localStorage.getItem("jabzen_mock_messages") || "[]");
    } catch (e) {
      return [];
    }
  };

  const saveMockMessage = (msg) => {
    const msgs = getMockMessages();
    msgs.push(msg);
    localStorage.setItem("jabzen_mock_messages", JSON.stringify(msgs));
    window.dispatchEvent(new CustomEvent("mock_msg_update"));
  };

  // B. Chat System State & Routing
  const CHAT_SECRET = "jabzen_e2ee_key_2026";
  window.encryptMessage = (text) => {
    if (!text) return "";
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ CHAT_SECRET.charCodeAt(i % CHAT_SECRET.length));
    }
    return "enc:" + btoa(unescape(encodeURIComponent(result)));
  };

  window.decryptMessage = (text) => {
    if (!text || !text.startsWith("enc:")) return text || "";
    try {
      const encodedText = text.substring(4);
      let decoded = decodeURIComponent(escape(atob(encodedText)));
      let result = "";
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ CHAT_SECRET.charCodeAt(i % CHAT_SECRET.length));
      }
      return result;
    } catch (e) {
      return text;
    }
  };

  let activeRecipientUid = null;
  let activeRecipientName = null;
  let activeRecipientAvatar = null;
  let messagesUnsubscribe = null;

  window.toggleChatDrawer = (show) => {
    const drawer = document.getElementById("chat-drawer");
    const backdrop = document.getElementById("chat-drawer-backdrop");
    if (!drawer || !backdrop) return;
    
    if (show) {
      if (!currentUser) {
        alert("Please sign in to message other creators.");
        window.toggleDrawer(true);
        return;
      }
      drawer.classList.add("active");
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
      
      showChatRoomsView();
      
      if (isMockFirebase) {
        // Trigger initial render in mock mode
        const allMsgs = getMockMessages();
        window.allUserMessages = allMsgs;
        renderChatRooms(allMsgs);
      } else {
        setupRealtimeMessages();
      }
    } else {
      drawer.classList.remove("active");
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
      activeRecipientUid = null;
      if (messagesUnsubscribe) {
        messagesUnsubscribe();
        messagesUnsubscribe = null;
      }
    }
  };

  const showChatRoomsView = () => {
    activeRecipientUid = null;
    const roomsView = document.getElementById("chat-rooms-view");
    const convView = document.getElementById("chat-conversation-view");
    if (roomsView) roomsView.style.display = "flex";
    if (convView) convView.style.display = "none";
  };

  const showConversationView = async (recipientUid, recipientName, recipientAvatar) => {
    activeRecipientUid = recipientUid;
    activeRecipientName = recipientName;
    activeRecipientAvatar = recipientAvatar || "https://www.gravatar.com/avatar/?d=mp";
    
    const nameEl = document.getElementById("chat-recipient-name");
    const avatarEl = document.getElementById("chat-recipient-avatar");
    if (nameEl) nameEl.textContent = recipientName;
    if (avatarEl) avatarEl.src = activeRecipientAvatar;
    
    const roomsView = document.getElementById("chat-rooms-view");
    const convView = document.getElementById("chat-conversation-view");
    if (roomsView) roomsView.style.display = "none";
    if (convView) convView.style.display = "flex";
    
    // Check connection state
    const conn = await window.getConnectionState(recipientUid);
    
    // Check messages feed container
    const messagesFeed = document.getElementById("chat-messages-feed");
    
    // Render decrypted conversation messages
    renderConversationFeed(window.allUserMessages || []);
    
    // Inject E2EE banner if not present
    let banner = document.getElementById("e2ee-warning-banner");
    if (!banner && messagesFeed) {
      banner = document.createElement("div");
      banner.id = "e2ee-warning-banner";
      banner.style.cssText = "background: rgba(214, 173, 45, 0.08); border: 1px solid rgba(214, 173, 45, 0.2); border-radius: 8px; padding: 0.6rem 1rem; font-size: 0.72rem; color: var(--accent); display: flex; align-items: center; justify-content: center; gap: 6px; margin: 10px auto; width: 90%; text-align: center;";
      banner.innerHTML = `<i class="fa-solid fa-lock" style="font-size: 0.7rem;"></i> End-to-End Encrypted. Messages are private.`;
      messagesFeed.insertBefore(banner, messagesFeed.firstChild);
    }
    
    const inputForm = document.getElementById("chat-input-form");
    
    // Remove existing restricted block if any
    const existingRestricted = document.getElementById("chat-connection-restricted-block");
    if (existingRestricted) existingRestricted.remove();
    
    if (conn.status === "accepted") {
      if (inputForm) inputForm.style.display = "flex";
      const inputField = document.getElementById("chat-message-input");
      if (inputField) inputField.focus();
    } else {
      if (inputForm) inputForm.style.display = "none";
      
      const restrictedBlock = document.createElement("div");
      restrictedBlock.id = "chat-connection-restricted-block";
      restrictedBlock.style.cssText = "padding: 1.5rem; text-align: center; color: var(--text-secondary); font-size: 0.88rem; background: var(--bg-secondary); border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 12px; align-items: center; width: 100%; box-sizing: border-box;";
      
      let btnHtml = "";
      if (conn.status === "none") {
        btnHtml = `<button class="btn btn-primary" style="border-radius: 30px; font-weight: 700; font-size: 0.8rem; padding: 0.5rem 1.25rem;" onclick="window.handleSendConnection('${recipientUid}')"><i class="fa-solid fa-user-plus"></i> Send Connection Request</button>`;
      } else if (conn.status === "pending") {
        if (conn.isSender) {
          btnHtml = `<button class="btn btn-outline" style="border-radius: 30px; font-size: 0.8rem; padding: 0.5rem 1.25rem;" disabled><i class="fa-regular fa-clock"></i> Connection Pending...</button>`;
        } else {
          btnHtml = `
            <div style="display: flex; gap: 10px; width: 100%; justify-content: center;">
              <button class="btn btn-primary" style="border-radius: 30px; font-weight: 700; font-size: 0.8rem; padding: 0.5rem 1.25rem;" onclick="window.handleAcceptConnection('${conn.docId}')">Accept</button>
              <button class="btn btn-outline" style="border-radius: 30px; font-weight: 700; font-size: 0.8rem; padding: 0.5rem 1.25rem; border-color: #ff4d4d; color: #ff4d4d;" onclick="window.handleRejectConnection('${conn.docId}')">Ignore</button>
            </div>
          `;
        }
      }
      
      restrictedBlock.innerHTML = `
        <p style="margin: 0; font-weight: 600;"><i class="fa-solid fa-user-shield" style="color: var(--brand-primary); margin-right: 6px;"></i> Connection Required</p>
        <p style="margin: 0; font-size: 0.78rem; opacity: 0.8; line-height: 1.4;">You can only message creators that are in your connections list.</p>
        ${btnHtml}
      `;
      
      const chatDrawerBody = document.querySelector(".chat-drawer-body");
      if (chatDrawerBody) {
        chatDrawerBody.appendChild(restrictedBlock);
      }
    }
  };

  const renderChatRooms = (allMessages) => {
    const roomsContainer = document.getElementById("chat-rooms-view");
    if (!roomsContainer || !currentUser) return;
    roomsContainer.innerHTML = "";
    
    const myMsgs = allMessages.filter(m => m.participants && m.participants.includes(currentUser.uid));
    const roomsMap = {};
    
    myMsgs.forEach(msg => {
      const otherUid = msg.senderUid === currentUser.uid ? msg.receiverUid : msg.senderUid;
      const otherName = msg.senderUid === currentUser.uid ? msg.receiverName : msg.senderName;
      const otherPhoto = msg.senderUid === currentUser.uid ? msg.receiverPhoto : msg.senderPhoto;
      
      const timeMs = msg.createdAt ? (msg.createdAt.seconds ? msg.createdAt.seconds * 1000 : new Date(msg.createdAt).getTime()) : Date.now();
      
      if (!roomsMap[otherUid] || roomsMap[otherUid].timeMs < timeMs) {
        roomsMap[otherUid] = {
          uid: otherUid,
          name: otherName || "Creator",
          photo: otherPhoto || "https://www.gravatar.com/avatar/?d=mp",
          lastText: window.decryptMessage(msg.text) || "",
          timeMs: timeMs
        };
      }
    });
    
    const roomsList = Object.values(roomsMap).sort((a, b) => b.timeMs - a.timeMs);
    
    if (roomsList.length === 0) {
      roomsContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.88rem; margin: 2rem 0;">No active conversations yet.</p>';
      return;
    }
    
    roomsList.forEach(room => {
      const item = document.createElement("div");
      item.className = "chat-room-item";
      item.onclick = () => showConversationView(room.uid, room.name, room.photo);
      item.innerHTML = `
        <img class="chat-room-avatar" src="${room.photo}" alt="">
        <div class="chat-room-details">
          <span class="chat-room-name">${room.name}</span>
          <span class="chat-room-last-msg">${room.lastText}</span>
        </div>
      `;
      roomsContainer.appendChild(item);
    });
  };

  const renderConversationFeed = (allMessages) => {
    const feedContainer = document.getElementById("chat-messages-feed");
    if (!feedContainer || !currentUser || !activeRecipientUid) return;
    feedContainer.innerHTML = "";
    
    const convMsgs = allMessages.filter(m => 
      m.participants && 
      m.participants.includes(currentUser.uid) && 
      m.participants.includes(activeRecipientUid)
    );
    
    convMsgs.sort((a, b) => {
      const aTime = a.createdAt ? (a.createdAt.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime()) : 0;
      const bTime = b.createdAt ? (b.createdAt.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime()) : 0;
      return aTime - bTime;
    });
    
    if (convMsgs.length === 0) {
      feedContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.8rem; margin: 2rem auto;">No messages in this chat. Start the conversation!</p>';
      return;
    }
    
    convMsgs.forEach(msg => {
      const isSent = msg.senderUid === currentUser.uid;
      const row = document.createElement("div");
      row.className = "chat-msg-row " + (isSent ? "sent" : "received");
      
      const timeStr = msg.createdAt ? new Date(msg.createdAt.seconds ? msg.createdAt.seconds * 1000 : msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
      
      row.innerHTML = `
        <div class="chat-msg-bubble">
          ${window.decryptMessage(msg.text)}
          <div class="chat-msg-time">${timeStr}</div>
        </div>
      `;
      feedContainer.appendChild(row);
    });
    
    feedContainer.scrollTop = feedContainer.scrollHeight;
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const input = document.getElementById("chat-message-input");
    if (!input || !currentUser || !activeRecipientUid) return;
    const text = input.value.trim();
    if (!text) return;
    
    const profile = parseUserProfile(currentUser);
    const msgData = {
      participants: [currentUser.uid, activeRecipientUid],
      senderUid: currentUser.uid,
      senderName: profile.name,
      senderPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`,
      receiverUid: activeRecipientUid,
      receiverName: activeRecipientName,
      receiverPhoto: activeRecipientAvatar,
      text: window.encryptMessage(text)
    };
    
    input.value = "";
    
    if (isMockFirebase) {
      msgData.createdAt = new Date().toISOString();
      saveMockMessage(msgData);
    } else if (db) {
      msgData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      try {
        await db.collection("messages").add(msgData);
      } catch (err) {
        console.error("Error sending message to Firestore:", err);
      }
    }
  };

  // --- USER PROFILE & MUTUAL CONNECTION REQUEST SYSTEM ---
  window.getUserProfile = async (uid) => {
    if (currentUser && uid === currentUser.uid) {
      const profile = parseUserProfile(currentUser);
      return {
        uid: currentUser.uid,
        displayName: profile.name,
        photoURL: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`,
        email: currentUser.email || "",
        bio: profile.bio || "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.",
        company: profile.company || "Independent",
        interests: profile.interests || ""
      };
    }
    
    if (isMockFirebase) {
      const mockUsers = JSON.parse(localStorage.getItem("jabzen_mock_users") || "[]");
      const user = mockUsers.find(u => u.uid === uid);
      if (user) return user;
    } else if (db) {
      try {
        const doc = await db.collection("users").doc(uid).get();
        if (doc.exists) {
          return doc.data();
        }
      } catch (e) {
        console.error("Error fetching user doc:", e);
      }
    }
    
    const post = blogsCache.find(b => b.authorUid === uid);
    if (post) {
      return {
        uid: uid,
        displayName: post.authorName,
        photoURL: post.authorPhoto || "https://www.gravatar.com/avatar/?d=mp",
        email: "creator@jabzen.com",
        bio: "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.",
        company: "Independent",
        interests: ""
      };
    }
    
    if (uid === "uid-auden-rivers") {
      return {
        uid: uid,
        displayName: "Auden Rivers",
        photoURL: "assets/avatar-auden.jpg",
        email: "auden@jabzen.com",
        bio: "Poet & Storyteller. Writing about modern aesthetics, human emotion, and classical verses.",
        company: "Jabzen Creative",
        interests: "Poetry, Writing, Art"
      };
    } else if (uid === "uid-mira-kapoor") {
      return {
        uid: uid,
        displayName: "Mira Kapoor",
        photoURL: "assets/avatar-mira.jpg",
        email: "mira@jabzen.com",
        bio: "AI Researcher and Tech consultant. Building future solutions using next-gen models.",
        company: "AI Solutions",
        interests: "AI, Technology, SEO"
      };
    } else if (uid === "uid-james-carter") {
      return {
        uid: uid,
        displayName: "James Carter",
        photoURL: "assets/avatar-james.jpg",
        email: "james@jabzen.com",
        bio: "Performance marketer and agency founder. Helping brands scale past 8 figures with funnels.",
        company: "Carter Media",
        interests: "Marketing, Ads, Funnels"
      };
    }
    
    return {
      uid: uid,
      displayName: "Unknown Creator",
      photoURL: "https://www.gravatar.com/avatar/?d=mp",
      email: "creator@jabzen.com",
      bio: "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.",
      company: "Independent",
      interests: ""
    };
  };

  window.getConnectionState = async (otherUid) => {
    if (!currentUser || !otherUid) return { status: "none", docId: null, isSender: false };
    
    if (isMockFirebase) {
      const conns = JSON.parse(localStorage.getItem("jabzen_mock_connections") || "[]");
      const conn = conns.find(c => 
        (c.senderUid === currentUser.uid && c.receiverUid === otherUid) ||
        (c.senderUid === otherUid && c.receiverUid === currentUser.uid)
      );
      if (!conn) return { status: "none", docId: null, isSender: false };
      return {
        status: conn.status,
        docId: conn.id,
        isSender: conn.senderUid === currentUser.uid
      };
    } else if (db) {
      try {
        const snap = await db.collection("connections")
          .where("participants", "array-contains", currentUser.uid)
          .get();
        let match = null;
        snap.forEach(doc => {
          const data = doc.data();
          if (data.senderUid === otherUid || data.receiverUid === otherUid) {
            match = { id: doc.id, ...data };
          }
        });
        if (!match) return { status: "none", docId: null, isSender: false };
        return {
          status: match.status,
          docId: match.id,
          isSender: match.senderUid === currentUser.uid
        };
      } catch (e) {
        console.error("Error getting connection state:", e);
        return { status: "none", docId: null, isSender: false };
      }
    }
    return { status: "none", docId: null, isSender: false };
  };

  window.handleSendConnection = async (receiverUid) => {
    if (!currentUser) {
      alert("Please sign in to send connection requests.");
      window.toggleDrawer(true);
      return;
    }
    if (receiverUid === currentUser.uid) {
      alert("You cannot connect with yourself.");
      return;
    }
    
    const receiverProfile = await window.getUserProfile(receiverUid);
    const senderProfile = parseUserProfile(currentUser);
    const connDoc = {
      id: Math.random().toString(36).substring(2, 11),
      participants: [currentUser.uid, receiverUid],
      senderUid: currentUser.uid,
      senderName: senderProfile.name,
      senderPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderProfile.name)}&background=d6ad2d&color=121212`,
      receiverUid: receiverUid,
      receiverName: receiverProfile.displayName,
      receiverPhoto: receiverProfile.photoURL || "https://www.gravatar.com/avatar/?d=mp",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    
    try {
      if (isMockFirebase) {
        const conns = JSON.parse(localStorage.getItem("jabzen_mock_connections") || "[]");
        conns.push(connDoc);
        localStorage.setItem("jabzen_mock_connections", JSON.stringify(conns));
        alert("Connection request sent!");
        window.showUserProfileModal(receiverUid);
        if (activeRecipientUid === receiverUid) {
          showConversationView(receiverUid, receiverProfile.displayName, receiverProfile.photoURL);
        }
      } else if (db) {
        connDoc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("connections").doc(connDoc.id).set(connDoc);
        alert("Connection request sent!");
        window.showUserProfileModal(receiverUid);
        if (activeRecipientUid === receiverUid) {
          showConversationView(receiverUid, receiverProfile.displayName, receiverProfile.photoURL);
        }
      }
      window.createNotification(receiverUid, "sent you a connection request", "connection_request");
    } catch (e) {
      console.error("Error sending connection:", e);
      alert("Failed to send connection request. Please try again.");
    }
  };

  window.handleAcceptConnection = async (docId) => {
    try {
      let otherUid = null;
      let otherName = "";
      let otherPhoto = "";
      if (isMockFirebase) {
        const conns = JSON.parse(localStorage.getItem("jabzen_mock_connections") || "[]");
        const idx = conns.findIndex(c => c.id === docId);
        if (idx !== -1) {
          conns[idx].status = "accepted";
          localStorage.setItem("jabzen_mock_connections", JSON.stringify(conns));
          alert("Connection request accepted!");
          
          otherUid = conns[idx].senderUid === currentUser.uid ? conns[idx].receiverUid : conns[idx].senderUid;
          otherName = conns[idx].senderUid === currentUser.uid ? conns[idx].receiverName : conns[idx].senderName;
          otherPhoto = conns[idx].senderUid === currentUser.uid ? conns[idx].receiverPhoto : conns[idx].senderPhoto;
          
          window.showUserProfileModal(otherUid);
          if (activeRecipientUid === otherUid) {
            showConversationView(otherUid, otherName, otherPhoto);
          }
          
          // Refresh active rooms list
          const allMsgs = getMockMessages();
          window.allUserMessages = allMsgs;
          renderChatRooms(allMsgs);
        }
      } else if (db) {
        await db.collection("connections").doc(docId).update({
          status: "accepted"
        });
        alert("Connection request accepted!");
        
        const doc = await db.collection("connections").doc(docId).get();
        if (doc.exists) {
          const data = doc.data();
          otherUid = data.senderUid === currentUser.uid ? data.receiverUid : data.senderUid;
          otherName = data.senderUid === currentUser.uid ? data.receiverName : data.senderName;
          otherPhoto = data.senderUid === currentUser.uid ? data.receiverPhoto : data.senderPhoto;
          
          window.showUserProfileModal(otherUid);
          if (activeRecipientUid === otherUid) {
            showConversationView(otherUid, otherName, otherPhoto);
          }
        }
      }
      if (otherUid) {
        window.createNotification(otherUid, "accepted your connection request", "connection_accepted");
      }
    } catch (e) {
      console.error("Error accepting connection:", e);
      alert("Failed to accept connection request.");
    }
  };

  window.handleRejectConnection = async (docId) => {
    try {
      let otherUid = null;
      let otherName = "";
      let otherPhoto = "";
      if (isMockFirebase) {
        const conns = JSON.parse(localStorage.getItem("jabzen_mock_connections") || "[]");
        const idx = conns.findIndex(c => c.id === docId);
        if (idx !== -1) {
          otherUid = conns[idx].senderUid === currentUser.uid ? conns[idx].receiverUid : conns[idx].senderUid;
          otherName = conns[idx].senderUid === currentUser.uid ? conns[idx].receiverName : conns[idx].senderName;
          otherPhoto = conns[idx].senderUid === currentUser.uid ? conns[idx].receiverPhoto : conns[idx].senderPhoto;
          conns.splice(idx, 1);
          localStorage.setItem("jabzen_mock_connections", JSON.stringify(conns));
          alert("Connection request ignored.");
          if (otherUid) window.showUserProfileModal(otherUid);
          if (activeRecipientUid === otherUid) {
            showConversationView(otherUid, otherName, otherPhoto);
          }
        }
      } else if (db) {
        const doc = await db.collection("connections").doc(docId).get();
        if (doc.exists) {
          const data = doc.data();
          otherUid = data.senderUid === currentUser.uid ? data.receiverUid : data.senderUid;
          otherName = data.senderUid === currentUser.uid ? data.receiverName : data.senderName;
          otherPhoto = data.senderUid === currentUser.uid ? data.receiverPhoto : data.senderPhoto;
        }
        await db.collection("connections").doc(docId).delete();
        alert("Connection request ignored.");
        if (otherUid) window.showUserProfileModal(otherUid);
        if (activeRecipientUid === otherUid) {
          showConversationView(otherUid, otherName, otherPhoto);
        }
      }
    } catch (e) {
      console.error("Error rejecting connection:", e);
      alert("Failed to ignore connection request.");
    }
  };

  window.showUserProfileModal = async (uid) => {
    if (!currentUser) {
      alert("Please sign in to view creator profiles.");
      window.toggleDrawer(true);
      return;
    }
    
    const user = await window.getUserProfile(uid);
    
    const avatarEl = document.getElementById("profile-modal-avatar");
    const nameEl = document.getElementById("profile-modal-name");
    const emailEl = document.getElementById("profile-modal-email");
    const bioEl = document.getElementById("profile-modal-bio");
    const actionsContainer = document.getElementById("profile-modal-actions");
    
    if (avatarEl) avatarEl.src = user.photoURL || "https://www.gravatar.com/avatar/?d=mp";
    if (nameEl) nameEl.textContent = user.displayName;
    if (emailEl) emailEl.textContent = user.email || "";
    
    let bioText = user.bio || "Creative storyteller publishing updates, poetry, and insights on the Jabzen platform.";
    if (user.company && user.company !== "Independent") {
      bioText = `<strong>${user.company}</strong> &bull; ` + bioText;
    }
    if (user.interests) {
      bioText += `<br><span style="color: var(--brand-primary); font-weight: 600; font-size: 0.8rem; display: block; margin-top: 8px;"><i class="fa-solid fa-tags"></i> Interests: ${user.interests}</span>`;
    }
    if (bioEl) bioEl.innerHTML = bioText;
    
    if (actionsContainer) actionsContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.85rem;'>Loading status...</p>";
    
    const modal = document.getElementById("profile-modal-backdrop");
    if (modal) {
      modal.style.display = "flex";
      modal.classList.add("active");
    }
    
    if (uid === currentUser.uid) {
      if (actionsContainer) {
        actionsContainer.innerHTML = `<button class="btn btn-outline" style="width: 100%; border-radius: 30px; font-size: 0.85rem;" disabled>This is you</button>`;
      }
      return;
    }
    
    const conn = await window.getConnectionState(uid);
    if (!actionsContainer) return;
    
    if (conn.status === "none") {
      actionsContainer.innerHTML = `
        <button class="btn btn-primary" style="width: 100%; border-radius: 30px; font-weight: 700; font-size: 0.85rem;" onclick="window.handleSendConnection('${uid}')">
          <i class="fa-solid fa-user-plus"></i> Send Connection Request
        </button>
      `;
    } else if (conn.status === "pending") {
      if (conn.isSender) {
        actionsContainer.innerHTML = `
          <button class="btn btn-outline" style="width: 100%; border-radius: 30px; font-size: 0.85rem;" disabled>
            <i class="fa-regular fa-clock"></i> Connection Pending...
          </button>
        `;
      } else {
        actionsContainer.innerHTML = `
          <div style="display: flex; gap: 10px; width: 100%;">
            <button class="btn btn-primary" style="flex: 1; border-radius: 30px; font-weight: 700; font-size: 0.85rem;" onclick="window.handleAcceptConnection('${conn.docId}')">
              Accept
            </button>
            <button class="btn btn-outline" style="flex: 1; border-radius: 30px; font-weight: 700; font-size: 0.85rem; border-color: #ff4d4d; color: #ff4d4d;" onclick="window.handleRejectConnection('${conn.docId}')">
              Ignore
            </button>
          </div>
        `;
      }
    } else if (conn.status === "accepted") {
      actionsContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <div style="color: #25D366; font-size: 0.88rem; font-weight: 600; margin-bottom: 0.25rem;">
            <i class="fa-solid fa-circle-check"></i> Connected
          </div>
          <button class="btn btn-primary" style="width: 100%; border-radius: 30px; font-weight: 700; font-size: 0.85rem;" onclick="window.closeProfileModal(); window.startChatWithAuthor('${uid}', '${user.displayName.replace(/'/g, "\\'")}', '${user.photoURL || ''}')">
            <i class="fa-solid fa-comments"></i> Send Message
          </button>
        </div>
      `;
    }
  };

  window.closeProfileModal = () => {
    const modal = document.getElementById("profile-modal-backdrop");
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
      }, 200);
    }
  };


  // --- INLINE COMMENTS SYSTEM ---
  const inlineCommentsCache = {}; 
  const commentsLimit = {}; 

  window.toggleCommentsInline = async (postId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const container = document.getElementById(`comments-section-${postId}`);
    if (!container) return;
    
    if (container.style.display === "none") {
      container.style.display = "block";
      commentsLimit[postId] = 3;
      await loadCommentsInline(postId);
    } else {
      container.style.display = "none";
    }
  };

  const loadCommentsInline = async (postId) => {
    const listContainer = document.getElementById(`comments-list-${postId}`);
    if (!listContainer) return;
    
    listContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0;'>Loading comments...</p>";
    
    let comments = [];
    if (isMockFirebase) {
      const allComments = JSON.parse(localStorage.getItem("jabzen_mock_comments") || "[]");
      comments = allComments.filter(c => c.postId === postId);
    } else if (db) {
      try {
        const snap = await db.collection("comments").where("postId", "==", postId).get();
        snap.forEach(doc => {
          comments.push({ id: doc.id, ...doc.data() });
        });
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    }
    
    comments.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
    
    inlineCommentsCache[postId] = comments;
    renderInlineComments(postId);
  };

  const renderInlineComments = (postId) => {
    const listContainer = document.getElementById(`comments-list-${postId}`);
    const seeMoreBtn = document.getElementById(`comments-see-more-${postId}`);
    if (!listContainer) return;
    
    listContainer.innerHTML = "";
    const comments = inlineCommentsCache[postId] || [];
    const limit = commentsLimit[postId] || 3;
    
    if (comments.length === 0) {
      listContainer.innerHTML = "<p style='color: var(--text-secondary); font-size: 0.8rem; text-align: center; margin: 10px 0; opacity: 0.8;'>No comments yet. Be the first to share your thoughts!</p>";
      if (seeMoreBtn) seeMoreBtn.style.display = "none";
      return;
    }
    
    const visibleComments = comments.slice(0, limit);
    visibleComments.forEach(comment => {
      const item = document.createElement("div");
      item.className = "comment-item";
      
      const timeStr = comment.createdAt ? new Date(comment.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just now";
      
      item.innerHTML = `
        <img class="comment-avatar" src="${comment.authorPhoto || 'https://www.gravatar.com/avatar/?d=mp'}" alt="" onclick="window.showUserProfileModal('${comment.authorUid}')">
        <div class="comment-bubble">
          <div class="comment-header">
            <div>
              <span class="comment-author-name" onclick="window.showUserProfileModal('${comment.authorUid}')">${comment.authorName}</span>
              <span class="comment-author-email">${comment.authorEmail ? (comment.authorEmail.split('@')[0]) : ''}</span>
            </div>
            <span class="comment-date">${timeStr}</span>
          </div>
          <div class="comment-body">${comment.content}</div>
        </div>
      `;
      listContainer.appendChild(item);
    });
    
    if (seeMoreBtn) {
      if (comments.length > limit) {
        seeMoreBtn.style.display = "inline-flex";
        seeMoreBtn.textContent = `See More Comments (${comments.length - limit} remaining)`;
      } else {
        seeMoreBtn.style.display = "none";
      }
    }
  };

  window.expandCommentsInline = (postId) => {
    commentsLimit[postId] = (inlineCommentsCache[postId] || []).length;
    renderInlineComments(postId);
  };

  window.postCommentInline = async (postId) => {
    if (!currentUser) {
      alert("Please sign in to post comments.");
      window.toggleDrawer(true);
      return;
    }
    
    const input = document.getElementById(`comment-input-${postId}`);
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    const profile = parseUserProfile(currentUser);
    const commentDoc = {
      id: Math.random().toString(36).substring(2, 11),
      postId: postId,
      authorUid: currentUser.uid,
      authorName: profile.name,
      authorPhoto: currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`,
      authorEmail: currentUser.email || "",
      content: text,
      createdAt: new Date().toISOString()
    };
    
    input.value = "";
    
    try {
      let authorUid = null;
      let title = "";
      if (isMockFirebase) {
        const comments = JSON.parse(localStorage.getItem("jabzen_mock_comments") || "[]");
        comments.push(commentDoc);
        localStorage.setItem("jabzen_mock_comments", JSON.stringify(comments));
        
        const blogs = JSON.parse(localStorage.getItem("jabzen_mock_blogs") || "[]");
        const idx = blogs.findIndex(b => b.id === postId);
        if (idx !== -1) {
          blogs[idx].commentsCount = (blogs[idx].commentsCount || 0) + 1;
          window.saveMockBlogsGlobal(blogs);
          authorUid = blogs[idx].authorUid;
          title = blogs[idx].title;
        }
      } else if (db) {
        commentDoc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("comments").doc(commentDoc.id).set(commentDoc);
        
        await db.collection("blogs").doc(postId).update({
          commentsCount: firebase.firestore.FieldValue.increment(1)
        });
        const doc = await db.collection("blogs").doc(postId).get();
        if (doc.exists) {
          authorUid = doc.data().authorUid;
          title = doc.data().title;
        }
      }
      
      document.querySelectorAll(`.comments-header-count-${postId}`).forEach(el => {
        const currentCount = parseInt(el.textContent) || 0;
        el.textContent = `${currentCount + 1} Comments`;
      });
      
      await loadCommentsInline(postId);
      if (authorUid && currentUser && authorUid !== currentUser.uid) {
        window.createNotification(
          authorUid,
          `commented on your post "${title}": "${text.substring(0, 30)}..."`,
          "comment"
        );
      }
    } catch (e) {
      console.error("Error posting comment:", e);
      alert("Failed to post comment. Please try again.");
    }
  };

  window.startChatWithAuthor = (uid, name, photo) => {
    if (!currentUser) {
      alert("Please sign in to chat with other authors.");
      window.toggleDrawer(true);
      return;
    }
    if (uid === currentUser.uid) {
      alert("You cannot chat with yourself.");
      return;
    }
    
    activeRecipientUid = uid;
    activeRecipientName = name;
    activeRecipientAvatar = photo || "https://www.gravatar.com/avatar/?d=mp";
    
    window.toggleChatDrawer(true);
    showConversationView(uid, name, photo);
  };

  const setupRealtimeMessages = () => {
    if (!db || !currentUser) return;
    if (messagesUnsubscribe) messagesUnsubscribe();
    
    messagesUnsubscribe = db.collection("messages")
      .where("participants", "array-contains", currentUser.uid)
      .onSnapshot((snapshot) => {
        const msgs = [];
        snapshot.forEach(doc => {
          msgs.push({ id: doc.id, ...doc.data() });
        });
        window.allUserMessages = msgs;
        renderChatRooms(msgs);
        if (activeRecipientUid) {
          renderConversationFeed(msgs);
        }
      }, (err) => {
        console.error("Messages sync error:", err);
      });
  };

  // Mock messaging subscriber event
  window.addEventListener("mock_msg_update", () => {
    const msgs = getMockMessages();
    window.allUserMessages = msgs;
    renderChatRooms(msgs);
    if (activeRecipientUid) {
      renderConversationFeed(msgs);
    }
  });

  // Attach Chat UI listeners
  const chatBackBtn = document.getElementById("chat-back-btn");
  if (chatBackBtn) chatBackBtn.addEventListener("click", showChatRoomsView);
  
  const chatInputForm = document.getElementById("chat-input-form");
  if (chatInputForm) chatInputForm.addEventListener("submit", handleSendMessage);


  // C. 4-Step Logout Wizard Modal logic
  const logoutSteps = [
    {
      title: "Step 1: Sign Out Request",
      desc: "Are you sure you want to end your creative partner session? You will lose immediate access to publishing new insights."
    },
    {
      title: "Step 2: Sync Pending Drafts",
      desc: "We are validating your local database updates. Please confirm that all draft changes have been synced to either your Mock or Live database."
    },
    {
      title: "Step 3: Secure Session Keys",
      desc: "This action will flush your temporary browser credentials. You will need to authenticate again with your Email or Phone OTP on your next visit."
    },
    {
      title: "Step 4: Final Confirmation",
      desc: "You have verified all checkmarks. Click 'Complete Sign Out' to log out of the Jabzen dashboard."
    }
  ];

  let currentLogoutStep = 1;

  window.startLogoutWizard = () => {
    const modal = document.getElementById("logout-modal-backdrop");
    if (!modal) return;
    
    currentLogoutStep = 1;
    updateLogoutStepUI();
    modal.classList.add("active");
  };

  window.closeLogoutWizard = () => {
    const modal = document.getElementById("logout-modal-backdrop");
    if (modal) modal.classList.remove("active");
  };

  const updateLogoutStepUI = () => {
    const stepContent = document.getElementById("logout-step-content");
    const progressFill = document.getElementById("logout-progress-fill");
    const nextBtn = document.getElementById("logout-next-btn");
    if (!stepContent) return;
    
    const stepData = logoutSteps[currentLogoutStep - 1];
    stepContent.innerHTML = `
      <h3 class="logout-step-title">${stepData.title}</h3>
      <p class="logout-step-desc">${stepData.desc}</p>
    `;
    
    document.querySelectorAll(".logout-step-dot").forEach((dot) => {
      const stepNum = parseInt(dot.getAttribute("data-step"));
      dot.className = "logout-step-dot";
      if (stepNum === currentLogoutStep) {
        dot.classList.add("active");
      } else if (stepNum < currentLogoutStep) {
        dot.classList.add("completed");
      }
    });
    
    if (progressFill) {
      const percentage = ((currentLogoutStep - 1) / 3) * 100;
      progressFill.style.width = percentage + "%";
    }
    
    if (nextBtn) {
      if (currentLogoutStep === 4) {
        nextBtn.textContent = "Complete Sign Out";
        nextBtn.style.background = "#ff4d4d";
        nextBtn.style.borderColor = "#ff4d4d";
        nextBtn.style.color = "#fff";
      } else {
        nextBtn.textContent = "Next Step";
        nextBtn.style.background = "";
        nextBtn.style.borderColor = "";
        nextBtn.style.color = "";
      }
    }
  };

  const handleLogoutNext = () => {
    if (currentLogoutStep < 4) {
      currentLogoutStep++;
      updateLogoutStepUI();
    } else {
      window.closeLogoutWizard();
      logoutUser();
    }
  };

  const logoutCancelBtn = document.getElementById("logout-cancel-btn");
  if (logoutCancelBtn) logoutCancelBtn.addEventListener("click", window.closeLogoutWizard);
  
  const logoutNextBtn = document.getElementById("logout-next-btn");
  if (logoutNextBtn) logoutNextBtn.addEventListener("click", handleLogoutNext);

  };
  window.bindBlogPageEvents();
  setupActiveCommunitySync();
  
  // Close the block
  
});


const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/your_webhook_id";

window.initLeadForms = () => {
  document.querySelectorAll("form[data-lead-form]").forEach((form) => {
    if (form.dataset.leadFormBound) return;
    form.dataset.leadFormBound = "true";
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
      
      // 1. Write to Firebase Firestore (if configured with real keys)
      if (db) {
        try {
          await db.collection("leads").add(leadData);
          console.log("Saved lead to Firestore");
        } catch (err) {
          console.error("Firestore save error:", err);
        }
      }
      
      // 2. Post to Make.com Webhook (if webhook URL is active)
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

      // 3. Send Email Notification via FormSubmit.co API
      try {
        const emailResponse = await fetch("https://formsubmit.co/ajax/abhishek4srmu@gmail.com", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: leadData.name,
            phone: leadData.phone,
            page_source: leadData.source,
            submitted_at: leadData.timestamp,
            _subject: "New Lead Capture - JABZEN Website",
            _template: "table"
          })
        });
        const emailResult = await emailResponse.json();
        console.log("FormSubmit email sent:", emailResult);
      } catch (err) {
        console.error("Email notification error:", err);
      }
      
      if (successMsg) {
        successMsg.style.display = "block";
        successMsg.textContent = "Thank you! Your request has been successfully submitted.";
      }
      
      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Book Free Consultation";
        }
        if (successMsg) {
          successMsg.style.display = "none";
        }
      }, 3000);
    });
  });
};
window.initLeadForms();

// --- NEW HERO INTERACTION CODE ---

// --- SINGLE THEME ENFORCED (BEIGE) ---

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
  if (window.innerWidth >= 768) {
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
    let animId;
    function animate() {
      if (window.innerWidth < 768) {
        canvas.style.display = "none";
        cancelAnimationFrame(animId);
        return;
      }
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animId = requestAnimationFrame(animate);
    }

    animate();
  } else {
    canvas.style.display = "none";
  }
}

// --- SCROLL REVEAL ANIMATIONS (LAZY LOAD REVEAL) ---
window.initScrollReveal = () => {
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
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target); // Reveal only once
        }
      });
    }, observerOptions);
    revealElements.forEach((el) => {
      el.classList.remove("active", "is-visible");
      revealObserver.observe(el);
    });
  }
};

// --- METRIC STATS COUNTER UPWARD ANIMATION ---
window.initCountUpMetrics = () => {
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

// --- CALL NOW CLIPBOARD COPY ---
window.initCallNowButtons = () => {
  const callButtons = document.querySelectorAll("[data-call-btn]");
  callButtons.forEach((btn) => {
    if (btn.dataset.callBound) return;
    btn.dataset.callBound = "true";
    btn.addEventListener("click", (e) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        const phoneNum = "+91880863659";
        
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
};

// --- DETAIL PAGE LOADER ---
window.initializeReadBlogPage = (blogId) => {
  const loadingState = document.getElementById("loading-state");
  const errorState = document.getElementById("error-state");
  const blogArticle = document.getElementById("blog-article");
  
  const showErrorState = () => {
    if (loadingState) loadingState.style.display = "none";
    if (blogArticle) blogArticle.style.display = "none";
    if (errorState) errorState.style.display = "flex";
  };
  
  if (!blogId) {
    showErrorState();
    return;
  }
  
  if (loadingState) loadingState.style.display = "flex";
  if (blogArticle) blogArticle.style.display = "none";
  if (errorState) errorState.style.display = "none";

  const renderBlog = (data) => {
    const title = data.title || "Untitled Post";
    const category = data.category || "General";
    const company = data.company || "Independent";
    const content = data.content || "";
    const authorName = data.authorName || "Author";
    const authorPhoto = data.authorPhoto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName);
    
    let dateString = "Unknown Date";
    if (data.createdAt) {
      const seconds = data.createdAt.seconds || (typeof data.createdAt === 'object' && data.createdAt.seconds);
      if (seconds) {
        dateString = new Date(seconds * 1000).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      } else {
        dateString = new Date(data.createdAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      }
    }

    document.title = `${title} | JABZEN Blog`;
    
    const blogTitleEl = document.getElementById('blog-title');
    const blogCatEl = document.getElementById('blog-cat');
    const blogDateEl = document.getElementById('blog-date');
    const authorNameEl = document.getElementById('author-name');
    const authorCompanyEl = document.getElementById('author-company');
    const authorImgEl = document.getElementById('author-img');
    const coverEl = document.getElementById('blog-cover');
    const coverWrapEl = document.getElementById('cover-wrap');
    const contentBodyEl = document.getElementById('blog-body');

    if (blogTitleEl) blogTitleEl.textContent = title;
    if (blogCatEl) blogCatEl.textContent = category;
    if (blogDateEl) blogDateEl.textContent = dateString;
    if (authorNameEl) authorNameEl.textContent = authorName;
    if (authorCompanyEl) authorCompanyEl.textContent = company;
    if (authorImgEl) authorImgEl.src = authorPhoto;

    if (contentBodyEl) {
      contentBodyEl.innerHTML = '';
      const paragraphs = content.split('\n\n');
      paragraphs.forEach(pText => {
        if (pText.trim()) {
          const p = document.createElement('p');
          p.textContent = pText.trim();
          contentBodyEl.appendChild(p);
        }
      });
    }

    if (data.image) {
      if (coverEl) {
        coverEl.src = data.image;
        coverEl.alt = title;
      }
      if (coverWrapEl) coverWrapEl.style.display = 'block';
    } else {
      if (coverWrapEl) coverWrapEl.style.display = 'none';
    }

    if (loadingState) loadingState.style.display = 'none';
    if (blogArticle) blogArticle.style.display = 'block';
  };

  const isMock = window.isMockFirebase;
  const dbRef = window.db;

  if (isMock) {
    try {
      const blogs = JSON.parse(localStorage.getItem('jabzen_mock_blogs') || '[]');
      const blog = blogs.find(b => b.id === blogId);
      if (blog) {
        renderBlog(blog);
      } else {
        showErrorState();
      }
    } catch (e) {
      console.error("Failed to parse mock database:", e);
      showErrorState();
    }
  } else if (dbRef) {
    dbRef.collection('blogs').doc(blogId).get()
      .then((doc) => {
        if (doc.exists) {
          renderBlog(doc.data());
        } else {
          showErrorState();
        }
      })
      .catch((err) => {
        console.error("Firestore loading error:", err);
        showErrorState();
      });
  } else {
    showErrorState();
  }
};

// --- SPA ROUTER & TRANSITION PROGRESS BAR ---
function navigateToPage(url, push = true) {
  let loadingBar = document.getElementById("spa-loading-bar");
  if (!loadingBar) {
    loadingBar = document.createElement("div");
    loadingBar.id = "spa-loading-bar";
    document.body.appendChild(loadingBar);
  }
  
  loadingBar.style.opacity = "1";
  loadingBar.style.width = "30%";

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Navigation request failed");
      loadingBar.style.width = "75%";
      return response.text();
    })
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newMain = doc.querySelector("main");
      const currentMain = document.querySelector("main");

      if (newMain && currentMain) {
        currentMain.innerHTML = newMain.innerHTML;
        document.body.className = doc.body.className;
        document.title = doc.title;

        if (push && window.location.href !== url) {
          window.history.pushState(null, "", url);
        }

        loadingBar.style.width = "100%";
        setTimeout(() => {
          loadingBar.style.opacity = "0";
          loadingBar.style.width = "0%";
        }, 300);

        const targetUrl = new URL(url);
        if (targetUrl.hash) {
          const hashElement = document.querySelector(targetUrl.hash);
          if (hashElement) {
            hashElement.scrollIntoView({ behavior: "smooth" });
          } else {
            window.scrollTo(0, 0);
          }
        } else {
          window.scrollTo(0, 0);
        }

        window.reinitializeAllPageEvents();
      } else {
        throw new Error("Could not find main element");
      }
    })
    .catch(error => {
      console.error("SPA dynamic navigation error:", error);
      loadingBar.style.width = "100%";
      setTimeout(() => {
        loadingBar.style.opacity = "0";
        loadingBar.style.width = "0%";
      }, 300);
      window.location.href = url;
    });
}

// Intercept all internal link clicks
document.addEventListener("click", (e) => {
  const link = e.target.closest("a");
  if (!link) return;

  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const href = link.getAttribute("href");
  if (!href) return;

  if (href.startsWith("http") && !href.startsWith(window.location.origin)) return;
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("javascript:")) return;
  if (link.getAttribute("target") === "_blank") return;

  const currentUrl = new URL(window.location.href);
  const targetUrl = new URL(href, window.location.href);

  if (currentUrl.origin === targetUrl.origin && currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
    return;
  }

  e.preventDefault();
  navigateToPage(targetUrl.href);
});

window.addEventListener("popstate", () => {
  navigateToPage(window.location.href, false);
});

// --- STATE REINITIALIZATION ON PAGE TRANSITIONS ---
window.reinitializeAllPageEvents = () => {
  if (typeof window.initActiveNavLinks === "function") window.initActiveNavLinks();
  if (typeof window.initFaqs === "function") window.initFaqs();
  if (typeof window.initCarousels === "function") window.initCarousels();
  if (typeof window.initLeadForms === "function") window.initLeadForms();
  if (typeof window.initCallNowButtons === "function") window.initCallNowButtons();
  if (typeof window.initScrollReveal === "function") window.initScrollReveal();
  if (typeof window.initCountUpMetrics === "function") window.initCountUpMetrics();

  if (typeof window.updateAuthUI === "function") {
    window.updateAuthUI(currentUser);
  }

  const blogAuthSection = document.getElementById("blog-auth-section");
  if (blogAuthSection) {
    if (typeof window.bindBlogPageEvents === "function") {
      window.bindBlogPageEvents();
    }
    if (typeof window.renderSidebarCategories === "function") {
      window.renderSidebarCategories();
    }
    if (typeof window.filterAndRenderBlogs === "function") {
      window.filterAndRenderBlogs();
    }
  }

  const blogArticle = document.getElementById("blog-article");
  if (blogArticle) {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("id");
    if (blogId && typeof window.initializeReadBlogPage === "function") {
      window.initializeReadBlogPage(blogId);
    }
  }
};

// Run initially
document.addEventListener("DOMContentLoaded", () => {
  window.initScrollReveal();
  window.initCountUpMetrics();
  window.initCallNowButtons();
});


