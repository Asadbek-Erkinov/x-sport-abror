// ==========================================================
// AI SPORT X — Modern UX & Fail-Safe Uzbek AI Engine
// ==========================================================

function applyTheme(theme) {
  const isDark = theme !== "light";
  document.body.classList.toggle("dark", isDark);
  document.querySelectorAll(".theme-btn, #themeBtn, #themeBtnTop").forEach(btn => {
    const icon = btn.querySelector(".theme-icon");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
    const text = btn.querySelector(".theme-text");
    if (text) text.textContent = isDark ? "Yorug' rejim" : "Tungi rejim";
  });
}

applyTheme(localStorage.getItem("theme") || "dark");

document.addEventListener("click", event => {
  const btn = event.target.closest(".theme-btn, #themeBtn, #themeBtnTop");
  if (btn) {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  }
});

// User Profile System
const PROFILE_KEY = "aiSportXProfile";
const profileSlot = document.getElementById("profileSlot");

function getProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"); }
  catch { return null; }
}

function profileInitials(name) {
  return String(name || "SX")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function renderProfile() {
  if (!profileSlot) return;
  const profile = getProfile();
  profileSlot.innerHTML = profile
    ? `<button class="profile-chip" id="profileMenu" type="button"><span class="profile-avatar">${profileInitials(profile.name)}</span><span>${profile.name}</span></button>`
    : `<button class="signup-btn" id="signupOpen" type="button">Ro'yxatdan o'tish <span>↗</span></button>`;
  
  document.getElementById("signupOpen")?.addEventListener("click", openSignup);
  document.getElementById("profileMenu")?.addEventListener("click", () => {
    if (window.confirm("Profilingizdan chiqishni xohlaysizmi?")) {
      localStorage.removeItem(PROFILE_KEY);
      renderProfile();
    }
  });
}

function openSignup() {
  if (document.getElementById("signupModal")) return;
  document.body.insertAdjacentHTML("beforeend", `<div class="signup-modal" id="signupModal"><div class="signup-card" role="dialog" aria-modal="true" aria-labelledby="signupTitle"><button class="modal-close" id="signupClose" type="button" aria-label="Yopish">×</button><p class="eyebrow">AI SPORT X COMMUNITY</p><h2 id="signupTitle">Profilingizni yarating.</h2><p class="signup-copy">Ismingizni kiriting, natijalaringizni bir joyda kuzating.</p><form id="signupForm"><label>Ism familiya<input id="signupName" type="text" autocomplete="name" placeholder="Masalan: Abror Karimov" required></label><label>Email<input id="signupEmail" type="email" autocomplete="email" placeholder="siz@example.com" required></label><label>Parol<input id="signupPassword" type="password" autocomplete="new-password" minlength="6" placeholder="Kamida 6 ta belgi" required></label><button class="signup-submit" type="submit">Profilni yaratish <span>↗</span></button></form></div></div>`);
  const modal = document.getElementById("signupModal");
  const close = () => modal?.remove();
  document.getElementById("signupClose")?.addEventListener("click", close);
  modal?.addEventListener("click", event => { if (event.target === modal) close(); });
  document.getElementById("signupForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, email }));
    close();
    renderProfile();
  });
  document.getElementById("signupName")?.focus();
}

renderProfile();

// Navigation & View Handler
const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll("[data-view]");
const breadcrumb = document.getElementById("breadcrumb");
const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.querySelector(".app-sidebar");

function getOrCreateBackdrop() {
  let backdrop = document.getElementById("sidebarBackdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "sidebarBackdrop";
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", () => {
      sidebar?.classList.remove("open");
      backdrop.classList.remove("active");
    });
  }
  return backdrop;
}

function showView(viewName) {
  views.forEach(view => {
    view.classList.toggle("active", view.id === `${viewName}View`);
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.view === viewName);
  });

  if (breadcrumb) {
    breadcrumb.innerHTML = viewName === "ai"
      ? "AI MURABBIY <span>/</span> SPORT CHAT"
      : "BOSH SAHIFA <span>/</span> UMUMIY";
  }

  sidebar?.classList.remove("open");
  const backdrop = document.getElementById("sidebarBackdrop");
  if (backdrop) backdrop.classList.remove("active");
}

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showView(link.dataset.view);
    if (link.dataset.view === "ai") {
      history.replaceState(null, "", "#ai");
      setTimeout(() => {
        document.getElementById("userInput")?.focus();
      }, 100);
    } else {
      history.replaceState(null, "", "#home");
    }
  });
});

// Mobile menu toggle
mobileMenu?.addEventListener("click", () => {
  const isOpen = sidebar?.classList.toggle("open");
  const backdrop = getOrCreateBackdrop();
  if (isOpen) {
    backdrop.classList.add("active");
  } else {
    backdrop.classList.remove("active");
  }
});

// Close sidebar when clicking outside on mobile (works on all pages)
document.addEventListener("click", event => {
  if (
    sidebar &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    event.target !== mobileMenu &&
    !mobileMenu?.contains(event.target)
  ) {
    sidebar.classList.remove("open");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (backdrop) backdrop.classList.remove("active");
  }
});

if (window.location.hash === "#ai") {
  showView("ai");
}

// Dynamic AI Status Check
async function checkAIHealth() {
  const statusEl = document.querySelector(".ai-status");
  if (!statusEl) return;
  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      const data = await res.json();
      if (data.providerLabel) {
        statusEl.innerHTML = `<span class="live-dot"></span> ${data.providerLabel}`;
      }
    }
  } catch (e) {
    statusEl.innerHTML = `<span class="live-dot"></span> ⚡ SMART SPORT AI`;
  }
}
checkAIHealth();

// Client Fallback Uzbek Sport AI Engine (Pure Text Precision)
function generateClientFallbackResponse(userMessage) {
  const text = String(userMessage).toLowerCase().trim();

  if (text.includes("salom") || text.includes("assalom")) {
    return {
      answer: "👋 **Salom, Sportchi! Men AI Sport X murabbiyman.**\n\nBugun sizga qaysi yo'nalishda yordam berishim mumkin?\n\n- 🏋️ **Mashg'ulot rejasi:** (Oyoq, press, butun tana)\n- 🥗 **Sog'lom ovqatlanish:** (Oqsil, parhez, menyu)\n- ⚡ **Motivatsiya:** (Natijaga erishish sirlari)\n- ⚽ **Futbol va Natijalar:** (Sport markazi)"
    };
  }

  if (text.includes("mashq") || text.includes("trenirovka") || text.includes("workout") || text.includes("reja")) {
    return {
      answer: "💪 **Bugungi Mashg'ulot Rejasi (30-Minut Full-Body):**\n\n1. **Qizish (5-7 daqiqa):** Bo'g'imlarni chizish, yengil sakrash.\n2. **Squat:** 3 set × 12 marta.\n3. **Push-up (Otjimaniye):** 3 set × 10 marta.\n4. **Plank:** 3 set × 40 soniya.\n5. **Jumping Jacks:** 3 set × 20 marta.\n6. **Sovush:** Mushaklarni cho'zish."
    };
  }

  if (text.includes("ovqat") || text.includes("menyu") || text.includes("dieta") || text.includes("oqsil") || text.includes("protein")) {
    return {
      answer: "🥗 **Sog'lom Sportchi Menyusi:**\n\n- 🍳 **Nonushta:** 3 ta pishirilgan tuxum, suli bo'tqasi va meva.\n- 🍗 **Tushlik:** Tovuq ko'krak go'shti, guruch va sabzavotlar.\n- 🐟 **Kechki taom:** Tvorog yoki baliq, ko'katlar salati.\n- 💧 **Suv:** Kuniga kamida 2.5 litr toza suv."
    };
  }

  if (text.includes("ronaldo") || text.includes("cr7")) {
    return {
      answer: "👑 **Cristiano Ronaldo (CR7):**\n\n- 🏆 **Yutuqlari:** 5 marotaba 'Oltin to'p' (Ballon d'Or), 5 marotaba UEFA Chempionlar Ligasi g'olibi, 900+ rasmiy gollar muallifi!\n- ⚽ **Jamoalari:** Sporting CP, Manchester United, Real Madrid, Juventus, Al-Nassr va Portugaliya kapitani.\n- 💪 **Intizom:** Har kungi qat'iy rejim va professional mehnat."
    };
  }

  if (text.includes("messi") || text.includes("leo")) {
    return {
      answer: "👑 **Lionel Messi (Leo):**\n\n- 🏆 **Yutuqlari:** 8 marotaba 'Oltin to'p' sohibi, 2022 Qatar Jahon Chempioni, 4 marotaba UCL g'olibi.\n- ⚽ **Jamoalari:** FC Barcelona, PSG, Inter Miami va Argentina terma jamoasi."
    };
  }

  if (text.includes("ufc") || text.includes("mma") || text.includes("xabib") || text.includes("khabib") || text.includes("islam")) {
    return {
      answer: "🥊 **UFC va MMA:**\n\n- 💥 **Chempionlar:** Khabib Nurmagomedov (29-0), Islam Makhachev, Jon Jones.\n- 🤼 **Jang uslublari:** Grepling, sambo, tay boks va erkin kurash."
    };
  }

  if (text.includes("motivatsiya") || text.includes("ruh")) {
    return {
      answer: "🚀 **AI Sport Motivatsiyasi:**\n\n> *\"Ertaga boshlayman degan kun kelmaydi. Bugun 10 daqiqa bo'lsa ham harakat qiling!\"*\n\n1. Kichik va aniq maqsad qo'ying.\n2. Barqarorlikni saqlang.\n3. Har kungi o'sishni qadrlang!"
    };
  }

  const cleanSubject = userMessage.replace(/kim|nima|haqida|aytib ber|ma'lumot|ber/gi, "").trim();
  return {
    answer: `🏆 **AI Sport X Javobi (${userMessage}):**\n\nSport va salomatlik bo'yicha **${cleanSubject || userMessage}** ma'lumoti:\n\n1. **Mashg'ulot:** Aniq tizim va doimiy harakat.\n2. **Tog'ri yondashuv:** Sifatli ovqatlanish, yetarli uyqu va jarohatsiz ijro.`
  };
}

// Enhanced Markdown Formatter for Chat Bubble HTML
function formatMarkdown(str) {
  if (!str) return "";
  let html = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Inline code `code`
  html = html.replace(/`([^`\n]+)`/g, "<code>$1</code>");

  // Bold text **text**
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Italic text *text* (non-greedy, avoid double-star conflicts)
  html = html.replace(/\*([^*\n]+?)\*/g, "<em>$1</em>");
  
  // Headers ### text
  html = html.replace(/^###\s+(.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^##\s+(.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^#\s+(.*$)/gim, "<h2>$1</h2>");
  
  // Blockquotes > text
  html = html.replace(/^&gt;\s?(.*$)/gim, "<blockquote>$1</blockquote>");

  // Bullet items starting with "- " or "* "
  html = html.replace(/^[\s]*[-*]\s+(.*$)/gim, "• $1");

  // Convert newlines to <br>
  html = html.replace(/\n/g, "<br>");

  return html;
}

// ==========================================================
// Fullscreen Image Modal Viewer
// ==========================================================
function openImageModal(imageUrl, caption) {
  document.getElementById("imgModalOverlay")?.remove();
  const overlay = document.createElement("div");
  overlay.className = "img-modal-overlay";
  overlay.id = "imgModalOverlay";
  overlay.innerHTML = `
    <div class="img-modal-content">
      <button class="img-modal-close" id="imgModalClose" aria-label="Yopish">×</button>
      <img src="${imageUrl}" alt="${caption ? caption.replace(/"/g, '&quot;') : 'Sport rasmi'}" loading="lazy">
      ${caption ? `<p class="img-modal-caption">${caption}</p>` : ""}
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("active"));
  const close = () => {
    overlay.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
  };
  document.getElementById("imgModalClose")?.addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  const escHandler = event => { if (event.key === "Escape") { close(); document.removeEventListener("keydown", escHandler); } };
  document.addEventListener("keydown", escHandler);
}

// ==========================================================
// AI CHAT CORE
// ==========================================================
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const messages = document.getElementById("messages");
const typing = document.getElementById("typing");
const sendBtn = document.getElementById("sendBtn");

const conversation = [];

function addMessage(text, sender, imageUrl = null) {
  if (!messages) return;

  const messageEl = document.createElement("div");
  messageEl.className = `message ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = sender === "user" ? "👤" : "SX";

  const content = document.createElement("div");
  content.className = "message-content";

  const messageText = document.createElement("div");
  messageText.className = "message-text";
  messageText.innerHTML = formatMarkdown(text);

  if (imageUrl) {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "chat-image-card";
    
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Sport Content";
    img.loading = "lazy";
    img.className = "chat-image";
    
    img.onerror = () => { imgWrapper.style.display = "none"; };

    img.addEventListener("click", () => openImageModal(imageUrl, text.slice(0, 80)));

    const badge = document.createElement("span");
    badge.className = "chat-image-badge";
    badge.textContent = "🔍 Kengaytirish uchun bosing";

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(badge);
    messageText.appendChild(imgWrapper);
  }

  content.appendChild(messageText);
  messageEl.appendChild(avatar);
  messageEl.appendChild(content);
  messages.appendChild(messageEl);
  messages.scrollTop = messages.scrollHeight;
}

async function sendMessage(text) {
  if (!text || !chatForm || !messages || !typing) return;

  addMessage(text, "user");
  conversation.push({ role: "user", content: text });

  typing.style.display = "block";
  if (sendBtn) sendBtn.disabled = true;

  let aiAnswer = null;
  let aiImageUrl = null;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: conversation.slice(-11, -1)
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.answer) {
        aiAnswer = data.answer;
        aiImageUrl = data.imageUrl || null;
      }
    }
  } catch (err) {
    console.warn("Backend unavailable, using client-side fail-safe AI engine:", err.message || err);
  }

  if (!aiAnswer) {
    const fallback = generateClientFallbackResponse(text);
    aiAnswer = fallback.answer;
    aiImageUrl = null;
  }

  typing.style.display = "none";
  if (sendBtn) sendBtn.disabled = false;

  addMessage(aiAnswer, "ai", aiImageUrl);
  conversation.push({ role: "assistant", content: aiAnswer });

  userInput?.focus();
}

if (chatForm && userInput && messages && typing) {
  chatForm.addEventListener("submit", event => {
    event.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    userInput.value = "";
    userInput.style.height = "auto";
    sendMessage(text);
  });

  userInput.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      chatForm.requestSubmit();
    }
  });

  userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 120) + "px";
  });
}

// Quick Prompt Buttons handler
document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    const prompt = button.dataset.prompt;
    if (!prompt) return;

    if (typeof showView === "function") {
      showView("ai");
      history.replaceState(null, "", "#ai");
    }
    if (userInput && chatForm) {
      userInput.value = "";
      sendMessage(prompt);
    }
  });
});
