/**
 * JABZEN Blog Engine (blog-module.js) - Enterprise Upgrade v2.0
 * Architecture: Firebase v9/v10 Modular SDK, Zero-Blink Hydration, Free-Tier Chat Engine, DocumentFragment DOM Rendering
 * Role: Principal Software Engineer & System Architect Specification
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
  addDoc,
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  setDoc,
  getDoc
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
let activeChatUnsubscribe = null;
let activePostUnsubscribe = null;

const STORAGE_KEYS = {
  USER_META: "jabzen_user_meta_cache",
  CHAT_PREFIX: "jabzen_chat_msgs_"
};

/* ==========================================================================
   MODULE 2: IMMEDIATE HYDRATION & STATE PROTECTION (ZERO-BLINK UI)
   ========================================================================== */
(function hydrateEarlyState() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const cached = localStorage.getItem(STORAGE_KEYS.USER_META);
      if (cached) {
        currentUser = JSON.parse(cached);
        // Instant non-blocking DOM paint before Firebase network handshakes
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => updateNavbarUI(true));
        } else {
          updateNavbarUI(true);
        }
      }
    }
  } catch (e) {
    console.warn("[Early Hydration Warning]:", e);
  }
})();

/**
 * Initialize Platform Engine
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
   1. AUTHENTICATION & NAVBAR MANAGEMENT
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

        localStorage.setItem(STORAGE_KEYS.USER_META, JSON.stringify(currentUser));
        updateNavbarUI(true);
        initNotifications();
      } else {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER_META);
        if (notificationUnsubscribe) notificationUnsubscribe();
        if (activeChatUnsubscribe) activeChatUnsubscribe();

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

    await updateProfile(auth.currentUser, { photoURL: downloadURL });
    await updateDoc(doc(db, "users", currentUser.uid), { photoURL: downloadURL });

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
   MODULE 1: REAL-TIME CHAT & MESSAGES (FREE-TIER OPTIMIZED WITH DELTA CACHING)
   ========================================================================== */

function getDeterministicChatId(uid1, uid2) {
  return [uid1, uid2].sort().join("_");
}

export async function sendMessage(receiverId, text) {
  if (!currentUser) return toggleAuthModal(true);
  if (!text || !text.trim()) return;

  try {
    const chatId = getDeterministicChatId(currentUser.uid, receiverId);
    const timestamp = new Date().toISOString();

    const messageData = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderPhoto: currentUser.photoURL,
      receiverId: receiverId,
      text: text.trim(),
      createdAt: timestamp
    };

    // 1. Add message document to subcollection
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, messageData);

    // 2. Update parent chat room summary
    const chatDocRef = doc(db, "chats", chatId);
    await setDoc(chatDocRef, {
      lastMessage: text.trim(),
      updatedAt: timestamp,
      participants: [currentUser.uid, receiverId]
    }, { merge: true });

    // 3. Send notification trigger to receiver
    await addDoc(collection(db, "notifications"), {
      recipientId: receiverId,
      senderId: currentUser.uid,
      senderName: currentUser.displayName,
      senderPhoto: currentUser.photoURL,
      type: "chat",
      text: "sent you a message.",
      read: false,
      createdAt: timestamp
    });

  } catch (error) {
    console.error("[Send Message Error]:", error);
    alert("Failed to send message.");
  }
}

export function listenToMessages(chatId, renderCallback) {
  if (activeChatUnsubscribe) activeChatUnsubscribe();

  const cacheKey = STORAGE_KEYS.CHAT_PREFIX + chatId;
  let cachedMessages = [];
  let lastTimestamp = null;

  // Hydrate local cache first
  try {
    const localData = localStorage.getItem(cacheKey);
    if (localData) {
      cachedMessages = JSON.parse(localData);
      if (cachedMessages.length > 0) {
        lastTimestamp = cachedMessages[cachedMessages.length - 1].createdAt;
      }
    }
  } catch (e) {
    console.warn("[Chat Cache Hydration Error]:", e);
  }

  // Initial render from local cache (Instant 0ms UI Response)
  if (typeof renderCallback === "function") {
    renderCallback(cachedMessages);
  }

  // Delta Query for Free-Tier Optimization: Only fetch new messages > lastTimestamp
  const messagesRef = collection(db, "chats", chatId, "messages");
  let q;
  if (lastTimestamp) {
    q = query(messagesRef, where("createdAt", ">", lastTimestamp), orderBy("createdAt", "asc"));
  } else {
    q = query(messagesRef, orderBy("createdAt", "asc"));
  }

  activeChatUnsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) return;

    const newMessages = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      data.id = docSnap.id;
      newMessages.push(data);
    });

    // Merge & Deduplicate
    const combined = [...cachedMessages];
    newMessages.forEach(msg => {
      if (!combined.some(m => m.id === msg.id || (m.createdAt === msg.createdAt && m.senderId === msg.senderId))) {
        combined.push(msg);
      }
    });

    // Persist to localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(combined));
    } catch (e) {}

    cachedMessages = combined;
    if (typeof renderCallback === "function") {
      renderCallback(combined);
    }
  }, (error) => {
    console.error("[Chat Listener Error]:", error);
  });
}

window.startConversationWith = function(senderId, senderName, senderPhoto) {
  if (!currentUser) return toggleAuthModal(true);

  const drawer = document.getElementById("chat-drawer");
  if (drawer) {
    drawer.classList.add("active");
  }

  const titleEl = document.getElementById("chat-active-title");
  if (titleEl) titleEl.textContent = senderName || "Conversation";

  const chatId = getDeterministicChatId(currentUser.uid, senderId);

  listenToMessages(chatId, (messages) => {
    const feed = document.getElementById("chat-messages-feed");
    if (!feed) return;

    feed.innerHTML = messages.map(msg => {
      const isSent = msg.senderId === currentUser.uid;
      return `
        <div class="chat-msg-row ${isSent ? 'sent' : 'received'}">
          <div class="chat-msg-bubble">${msg.text}</div>
          <span class="chat-msg-time">${new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      `;
    }).join("");
    feed.scrollTop = feed.scrollHeight;
  });

  // Wire send button
  const sendBtn = document.getElementById("chat-send-btn");
  const inputField = document.getElementById("chat-input-field");
  if (sendBtn && inputField) {
    sendBtn.onclick = () => {
      sendMessage(senderId, inputField.value);
      inputField.value = "";
    };
    inputField.onkeypress = (e) => {
      if (e.key === "Enter") {
        sendMessage(senderId, inputField.value);
        inputField.value = "";
      }
    };
  }
};

/* ==========================================================================
   MODULE 3: DYNAMIC CONTENT INSERTION & DOCUMENT FRAGMENT (read-blog.html)
   ========================================================================== */

export function loadFullPostContent(postId) {
  if (activePostUnsubscribe) activePostUnsubscribe();

  const postDocRef = doc(db, "posts", postId);

  activePostUnsubscribe = onSnapshot(postDocRef, (docSnap) => {
    if (!docSnap.exists()) {
      console.warn("[Post Not Found]:", postId);
      return;
    }

    const post = docSnap.data();
    post.id = docSnap.id;

    // 1. DOM Title, Content, Meta Updates
    const titleEl = document.getElementById("read-post-title");
    const contentEl = document.getElementById("read-post-content");
    const authorNameEl = document.getElementById("read-post-author-name");
    const authorAvatarEl = document.getElementById("read-post-author-avatar");
    const dateEl = document.getElementById("read-post-date");

    if (titleEl) titleEl.textContent = post.title || "Untitled Article";
    if (contentEl) contentEl.innerHTML = post.content || "<p>No content available.</p>";
    if (authorNameEl) authorNameEl.textContent = post.authorName || "Author";
    if (authorAvatarEl) authorAvatarEl.src = post.authorPhoto || "https://ui-avatars.com/api/?name=Author";
    if (dateEl) dateEl.textContent = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Recently";

    // 2. High-Performance Comments Rendering via DocumentFragment
    renderCommentsWithFragment(post.comments || []);
  }, (error) => {
    console.error("[Load Post Content Error]:", error);
  });
}

function renderCommentsWithFragment(comments) {
  const container = document.getElementById("read-post-comments-container");
  if (!container) return;

  container.innerHTML = ""; // Clear wrapper once

  if (comments.length === 0) {
    container.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">No comments yet. Be the first to start the conversation!</p>`;
    return;
  }

  // DocumentFragment prevents multiple reflows and browser layout thrashing
  const fragment = document.createDocumentFragment();

  comments.forEach(c => {
    const item = document.createElement("div");
    item.className = "comment-item-card";
    item.style.cssText = "display: flex; gap: 12px; margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-color);";

    const img = document.createElement("img");
    img.src = c.authorPhoto || "https://ui-avatars.com/api/?name=User";
    img.style.cssText = "width: 38px; height: 38px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);";

    const body = document.createElement("div");
    body.style.cssText = "flex: 1; display: flex; flex-direction: column;";

    const meta = document.createElement("div");
    meta.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;";
    meta.innerHTML = `<strong style="font-size: 0.9rem; color: var(--text-primary);">${c.authorName || 'User'}</strong><span style="font-size: 0.75rem; color: var(--text-secondary);">${c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : ''}</span>`;

    const textP = document.createElement("p");
    textP.style.cssText = "font-size: 0.88rem; color: var(--text-secondary); margin: 0; line-height: 1.5;";
    textP.textContent = c.text;

    body.appendChild(meta);
    body.appendChild(textP);
    item.appendChild(img);
    item.appendChild(body);

    fragment.appendChild(item);
  });

  container.appendChild(fragment);
}

/* ==========================================================================
   REAL-TIME INTERACTIONS & IN-MEMORY FEED FILTERS
   ========================================================================== */

export async function handleLike(postId) {
  if (!currentUser) return toggleAuthModal(true);

  try {
    const postRef = doc(db, "posts", postId);
    const post = postsCache.find(p => p.id === postId);
    const isLiked = post && post.likes && post.likes.includes(currentUser.uid);

    if (post) {
      if (!post.likes) post.likes = [];
      if (isLiked) {
        post.likes = post.likes.filter(id => id !== currentUser.uid);
        post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
      } else {
        post.likes.push(currentUser.uid);
        post.likesCount = (post.likesCount || 0) + 1;
      }
      renderFeedDOM(postsCache);
    }

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
    await updateDoc(postRef, {
      comments: arrayUnion(commentObj),
      commentsCount: increment(1)
    });

  } catch (error) {
    console.error("[Comment Error]:", error);
  }
}

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

// Global window bindings
if (typeof window !== "undefined") {
  window.blogEngine = {
    initBlogEngine,
    toggleAuthModal,
    loginWithProvider,
    logoutUser,
    updateProfilePicture,
    handleLike,
    handleComment,
    sendMessage,
    listenToMessages,
    loadFullPostContent,
    filterPostsByCategory,
    sortPostsByTrending,
    setFeedPostsData
  };
}
