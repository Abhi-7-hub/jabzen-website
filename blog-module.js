/**
 * JABZEN Blog Dashboard Engine (blog-module.js)
 * Architecture: Firebase v9/v10 Modular SDK, Zero-Reload State, Free-Tier Optimized
 * Role: Principal Software Engineer & Google DSA Expert Specification
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  signOut, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  collection, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Global In-Memory State & Cache
let auth, db, storage;
let currentUser = null;
let postsCache = [];
let notificationUnsubscribe = null;

const STORAGE_KEYS = {
  USER_META: "jabzen_user_meta_cache",
  CHAT_CACHE: "jabzen_chat_threads_cache"
};

/**
 * Initialize Platform Engine
 * @param {Object} firebaseConfig 
 */
export function initBlogEngine(firebaseConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    initAuth();
  } catch (error) {
    console.error("[BlogEngine Init Error]:", error);
  }
}

/* ==========================================================================
   1. AUTHENTICATION & NAVBAR (SINGLE EVENT LISTENER & CACHING)
   ========================================================================== */

function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        currentUser = {
          uid: user.uid,
          displayName: user.displayName || "Author",
          email: user.email,
          photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "Author")}&background=6F8F72&color=fff`
        };

        // Cache user metadata to minimize Firestore reads
        localStorage.setItem(STORAGE_KEYS.USER_META, JSON.stringify(currentUser));

        updateNavbarUI(true);
        initNotifications();
      } else {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER_META);
        if (notificationUnsubscribe) notificationUnsubscribe();

        updateNavbarUI(false);
      }
    } catch (error) {
      console.error("[Auth State Sync Error]:", error);
    }
  });
}

export function updateNavbarUI(isLoggedIn) {
  const loginBtn = document.getElementById("header-login-btn");
  const profileContainer = document.getElementById("header-user-profile");
  const avatarImg = document.getElementById("header-profile-avatar");
  const nameLabel = document.getElementById("header-profile-name");

  if (isLoggedIn && currentUser) {
    if (loginBtn) loginBtn.style.display = "none";
    if (profileContainer) profileContainer.style.display = "block";
    if (avatarImg) avatarImg.src = currentUser.photoURL;
    if (nameLabel) nameLabel.textContent = currentUser.displayName;
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (profileContainer) profileContainer.style.display = "none";
  }
}

export function toggleAuthModal(show = true) {
  const modal = document.getElementById("auth-modal-backdrop");
  if (modal) {
    modal.style.display = show ? "flex" : "none";
    modal.classList.toggle("active", show);
  }
}

export async function loginWithProvider(providerName) {
  try {
    let provider;
    if (providerName === "google") provider = new GoogleAuthProvider();
    else if (providerName === "facebook") provider = new FacebookAuthProvider();
    else throw new Error("Unsupported provider");

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Sync User Document atomically
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLogin: new Date().toISOString()
    }, { merge: true });

    toggleAuthModal(false);
  } catch (error) {
    console.error("[Auth Provider Error]:", error);
    alert(`Authentication failed: ${error.message}`);
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.reload();
  } catch (error) {
    console.error("[Logout Error]:", error);
  }
}

export async function updateProfilePicture(file) {
  if (!currentUser) return toggleAuthModal(true);
  try {
    const fileRef = ref(storage, `avatars/${currentUser.uid}_${Date.now()}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    // 1. Update Auth Profile
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    
    // 2. Update Firestore User Doc
    await updateDoc(doc(db, "users", currentUser.uid), { photoURL: downloadURL });

    // 3. Sync Memory & UI
    currentUser.photoURL = downloadURL;
    localStorage.setItem(STORAGE_KEYS.USER_META, JSON.stringify(currentUser));
    updateNavbarUI(true);

    alert("Profile picture updated successfully!");
  } catch (error) {
    console.error("[Update Profile Picture Error]:", error);
    alert("Failed to update profile image.");
  }
}

/* ==========================================================================
   2. REAL-TIME INTERACTION & ATOMIC COUNTERS (FREE TIER OPTIMIZED)
   ========================================================================== */

export async function handleLike(postId) {
  if (!currentUser) return toggleAuthModal(true);

  try {
    const postRef = doc(db, "posts", postId);
    const post = postsCache.find(p => p.id === postId);
    const isLiked = post && post.likes && post.likes.includes(currentUser.uid);

    // Optimistic UI Update in Memory Array
    if (post) {
      if (!post.likes) post.likes = [];
      if (isLiked) {
        post.likes = post.likes.filter(id => id !== currentUser.uid);
        post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
      } else {
        post.likes.push(currentUser.uid);
        post.likesCount = (post.likesCount || 0) + 1;
      }
      renderFeedDOM(postsCache); // Instant feedback
    }

    // Atomic Single-Write Operation (No extra reads!)
    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
      likesCount: increment(isLiked ? -1 : 1)
    });
  } catch (error) {
    console.error("[Like Reaction Error]:", error);
  }
}

export async function handleComment(postId, commentText) {
  if (!currentUser) return toggleAuthModal(true);
  if (!commentText.trim()) return;

  try {
    const commentObj = {
      id: Math.random().toString(36).substring(2, 11),
      authorUid: currentUser.uid,
      authorName: currentUser.displayName,
      authorPhoto: currentUser.photoURL,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    const postRef = doc(db, "posts", postId);

    // Atomic Append & Increment
    await updateDoc(postRef, {
      comments: arrayUnion(commentObj),
      commentsCount: increment(1)
    });

  } catch (error) {
    console.error("[Comment Error]:", error);
  }
}

/* ==========================================================================
   3. DYNAMIC NOTIFICATIONS & ZERO-RELOAD ROUTING
   ========================================================================== */

function initNotifications() {
  if (!currentUser) return;

  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", currentUser.uid),
    orderBy("createdAt", "desc")
  );

  notificationUnsubscribe = onSnapshot(q, (snapshot) => {
    let unreadCount = 0;
    const notifications = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      data.id = docSnap.id;
      notifications.push(data);
      if (!data.read) unreadCount++;
    });

    updateNotificationBadgeUI(unreadCount);
    renderNotificationsListUI(notifications);
  }, (error) => {
    console.error("[Notifications Listener Error]:", error);
  });
}

function updateNotificationBadgeUI(count) {
  const badge = document.getElementById("nav-notification-badge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  }
}

function renderNotificationsListUI(notifications) {
  const container = document.getElementById("notifications-dropdown-list");
  if (!container) return;

  if (notifications.length === 0) {
    container.innerHTML = `<p class="empty-notif">No new notifications</p>`;
    return;
  }

  container.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.read ? 'read' : 'unread'}" data-id="${n.id}">
      <img src="${n.senderPhoto || 'https://ui-avatars.com/api/?name=User'}" class="notif-avatar" />
      <div class="notif-content">
        <p><strong>${n.senderName}</strong> ${n.text}</p>
        <span class="notif-time">${new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  `).join("");

  // Attach click delegate
  container.querySelectorAll(".notif-item").forEach(item => {
    item.addEventListener("click", () => {
      const notifId = item.dataset.id;
      const notifObj = notifications.find(n => n.id === notifId);
      if (notifObj) routeNotification(notifObj);
    });
  });
}

export async function routeNotification(notification) {
  try {
    // 1. Mark as read in Firestore
    if (!notification.read) {
      await updateDoc(doc(db, "notifications", notification.id), { read: true });
    }

    // 2. Programmatic Routing without Page Reload
    if (notification.type === "chat") {
      openChatSidebar(notification.senderId, notification.senderName, notification.senderPhoto);
    } else if (notification.type === "post" && notification.postId) {
      highlightPostCard(notification.postId);
    }
  } catch (error) {
    console.error("[Notification Route Error]:", error);
  }
}

function openChatSidebar(senderId, senderName, senderPhoto) {
  const chatSidebar = document.getElementById("chat-drawer");
  if (chatSidebar) {
    chatSidebar.classList.add("active");
    if (typeof window.startConversationWith === "function") {
      window.startConversationWith(senderId, senderName, senderPhoto);
    }
  }
}

function highlightPostCard(postId) {
  const card = document.querySelector(`[data-post-id="${postId}"]`);
  if (card) {
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("highlight-pulse");
    setTimeout(() => card.classList.remove("highlight-pulse"), 2500);
  }
}

/* ==========================================================================
   4. IN-MEMORY FEED FILTERS (ZERO DB QUERY COST)
   ========================================================================== */

export function setFeedPostsData(postsArray) {
  postsCache = [...postsArray];
  renderFeedDOM(postsCache);
}

export function filterPostsByCategory(category) {
  if (!category || category === "All") {
    renderFeedDOM(postsCache);
    return;
  }
  const filtered = postsCache.filter(p => p.category === category);
  renderFeedDOM(filtered);
}

export function sortPostsByTrending() {
  // In-memory DSA QuickSort / Built-in Sort by highest likes
  const sorted = [...postsCache].sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
  renderFeedDOM(sorted);
}

function renderFeedDOM(posts) {
  const container = document.getElementById("dynamic-blogs-container");
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `<div class="feed-empty"><p>No articles found in this section.</p></div>`;
    return;
  }

  // Efficient DOM rendering
  container.innerHTML = posts.map(post => `
    <article class="feed-post-card" data-post-id="${post.id}">
      <div class="post-meta-row">
        <div class="post-author-block">
          <img src="${post.authorPhoto || 'https://ui-avatars.com/api/?name=Author'}" class="post-avatar" />
          <div>
            <span class="post-author-name">${post.authorName}</span>
            <span class="post-time">${post.category || 'General'}</span>
          </div>
        </div>
      </div>
      <h3 class="post-title">${post.title}</h3>
      <p class="post-excerpt">${post.excerpt || post.content.substring(0, 140)}...</p>
      <div class="post-actions-footer">
        <button class="post-action-btn like-btn ${post.likes && currentUser && post.likes.includes(currentUser.uid) ? 'liked' : ''}" onclick="window.blogEngine.handleLike('${post.id}')">
          <i class="${post.likes && currentUser && post.likes.includes(currentUser.uid) ? 'fa-solid' : 'fa-regular'} fa-heart"></i> ${post.likesCount || 0}
        </button>
      </div>
    </article>
  `).join("");
}

// Attach to Window for global inline button accessibility
if (typeof window !== "undefined") {
  window.blogEngine = {
    initBlogEngine,
    toggleAuthModal,
    loginWithProvider,
    logoutUser,
    updateProfilePicture,
    handleLike,
    handleComment,
    routeNotification,
    filterPostsByCategory,
    sortPostsByTrending,
    setFeedPostsData
  };
}
