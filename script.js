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
    storage = firebase.storage();
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
      return JSON.parse(localStorage.getItem("jabzen_mock_blogs") || "[]");
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
  let setAuthMode;
  let setDashboardTab;

  // 1. Global Header Profile Dropdown & Auth UI Updating (Runs on all pages)
  const headerUserProfile = document.getElementById("header-user-profile");
  const headerProfileBtn = document.getElementById("header-profile-btn");
  const headerProfileDropdown = document.getElementById("header-profile-dropdown");
  const headerProfileAvatar = document.getElementById("header-profile-avatar");
  const headerProfileName = document.getElementById("header-profile-name");
  const headerProfileEmail = document.getElementById("header-profile-email");
  const headerLogoutBtn = document.getElementById("header-logout-btn");

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
      return { name: parts[0] || "Author", company: parts[1] || "Independent" };
    }
    return { name: rawName || "Author", company: "Independent" };
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
      logoutUser();
    });
  }

  const updateAuthUI = (user) => {
    currentUser = user;
    
    // Sync Header Profile Dropdown (all pages)
    if (user) {
      const profile = parseUserProfile(user);
      if (headerUserProfile) headerUserProfile.style.display = "block";
      if (headerProfileAvatar) {
        headerProfileAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
      }
      if (headerProfileName) headerProfileName.textContent = profile.name;
      if (headerProfileEmail) headerProfileEmail.textContent = user.email;
    } else {
      if (headerUserProfile) headerUserProfile.style.display = "none";
    }

    // Sync Blog Dashboard (blog page only)
    const blogAuthSection = document.getElementById("blog-auth-section");
    if (blogAuthSection) {
      const guestAuthContainer = document.getElementById("guest-auth-container");
      const userDashboardContainer = document.getElementById("user-dashboard-container");
      const dashAvatar = document.getElementById("dash-avatar");
      const dashName = document.getElementById("dash-name");
      const dashMeta = document.getElementById("dash-meta");
      const blogCompanyInput = document.getElementById("blog-company");
      const myPostsCount = document.getElementById("my-posts-count");

      if (user) {
        const profile = parseUserProfile(user);
        if (dashName) dashName.textContent = profile.name;
        if (dashMeta) dashMeta.textContent = `${profile.company} | ${user.email}`;
        if (dashAvatar) {
          dashAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=d6ad2d&color=121212`;
        }
        if (blogCompanyInput) blogCompanyInput.value = profile.company;
        
        if (guestAuthContainer) guestAuthContainer.style.display = "none";
        if (userDashboardContainer) userDashboardContainer.style.display = "block";
        if (typeof setDashboardTab === "function") {
          setDashboardTab("write");
        }
        
        if (db) {
          if (unsubscribeMyPosts) unsubscribeMyPosts();
          unsubscribeMyPosts = db.collection("blogs")
            .where("authorUid", "==", user.uid)
            .onSnapshot((snap) => {
              if (myPostsCount) myPostsCount.textContent = snap.size;
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
  };

  // Register state changed listener for all pages
  if (auth) {
    auth.onAuthStateChanged(updateAuthUI);
  } else {
    updateAuthUI(null);
  }

  // 2. Blog Dashboard Specific Logic (Runs only on Blog page)
  const blogAuthSection = document.getElementById("blog-auth-section");
  if (blogAuthSection) {
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
  dashboardLogoutBtn.addEventListener("click", logoutUser);
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

  cancelWriteBtn.addEventListener("click", clearEditor);

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
        
        // Scroll to editor form smooth
        blogAuthSection.scrollIntoView({ behavior: "smooth" });
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
        })
        .catch((err) => {
          console.error("Error deleting document:", err);
          alert("Failed to delete post: " + err.message);
        });
    }
  };

  // 10. Load and Render Public dynamic blogs
  if (db) {
    db.collection("blogs").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
      dynamicBlogsContainer.innerHTML = "";
      if (snapshot.empty) return;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric", month: "short", day: "numeric"
        }) : new Date().toLocaleDateString();

        const card = document.createElement("article");
        card.className = "card blog-card";
        card.style.cssText = "display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding: 0; overflow: hidden; position: relative;";
        
        // Check if the current user is the owner of this post to show inline edit options
        const isOwner = currentUser && data.authorUid === currentUser.uid;
        const ownerActionsHtml = isOwner ? `
          <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; z-index: 5;">
            <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; min-height: unset; border-radius: 30px; background: rgba(18, 18, 18, 0.85); backdrop-filter: blur(4px); font-weight: 700; border-color: var(--line);" onclick="window.editBlog('${doc.id}'); return false;"><i class="fa-solid fa-pencil" style="font-size: 0.7rem;"></i></button>
            <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; min-height: unset; border-radius: 30px; background: rgba(18, 18, 18, 0.85); backdrop-filter: blur(4px); font-weight: 700; border-color: rgba(255, 77, 77, 0.3); color: #ff4d4d;" onclick="window.deleteBlog('${doc.id}'); return false;"><i class="fa-solid fa-trash" style="font-size: 0.7rem;"></i></button>
          </div>
        ` : "";

        const imageHtml = data.image ? `
          <div class="blog-image-wrap" style="width: 100%; aspect-ratio: 16/9; overflow: hidden; border-bottom: 1px solid var(--line);">
            <img src="${data.image}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
        ` : '';

        card.innerHTML = `
          ${ownerActionsHtml}
          ${imageHtml}
          <div style="padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; flex-grow: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="eyebrow" style="font-size: 0.7rem; margin: 0;">${data.category}</span>
              <small style="color: var(--text-secondary); font-size: 0.75rem;">${date}</small>
            </div>
            <h3 style="margin: 0; font-size: 1.2rem; line-height: 1.3;">
              <a href="read-blog.html?id=${doc.id}" style="color: var(--text-primary); transition: color 0.18s ease;">${data.title}</a>
            </h3>
            <p style="font-size: 0.9rem; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.5; color: var(--text-secondary); white-space: pre-line;">${data.content}</p>
            
            <div style="margin-top: 1rem; border-top: 1px solid var(--line); padding-top: 0.75rem; display: flex; align-items: center; gap: 10px;">
              <img src="${data.authorPhoto || 'https://www.gravatar.com/avatar/?d=mp'}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;" alt="">
              <span style="font-size: 0.8rem; color: var(--text-secondary);">By <strong style="color: var(--text-primary);">${data.authorName}</strong> (${data.company})</span>
            </div>
          </div>
          <div style="padding: 0 1.5rem 1.5rem 1.5rem;">
            <a href="read-blog.html?id=${doc.id}" class="btn btn-outline" style="font-size: 0.85rem; padding: 0.5rem 1.25rem; min-height: unset; border-radius: 30px; display: inline-flex; align-items: center; gap: 8px;">Read More <i class="fa-solid fa-arrow-right" style="font-size: 0.75rem;"></i></a>
          </div>
        `;
        dynamicBlogsContainer.appendChild(card);
      });
    }, (err) => {
      console.error("Snapshot error loading blogs:", err);
    });
  }
  }
});


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

