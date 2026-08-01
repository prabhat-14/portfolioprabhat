/**
 * Prabhat Neupane - Portfolio Master Script
 * Handles Theme Toggle, Navigation, Typing Effects, Filterable Projects, 
 * and Secure Gemini API Chatbot proxy integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initTypingEffect();
  initProjectsGrid();
  initChatbot();
  setCurrentYear();
});

/* ==========================================================================
   1. THEME TOGGLE (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Retrieve previous setting or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

/* ==========================================================================
   2. MOBILE MENU HAMBURGER
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking any navigation link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   3. HERO SECTION TYPING ANIMATION
   ========================================================================== */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const phrases = [
    "Systems Programming (C / C++)",
    "Modern Web Architecture",
    "Interactive UI/UX & JS Apps",
    "Data Structures & Algorithms"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseDuration = 2000;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentDelay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      currentDelay = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      currentDelay = 500;
    }

    setTimeout(type, currentDelay);
  }

  type();
}

/* ==========================================================================
   4. DYNAMIC PROJECTS GRID & FILTERING
   ========================================================================== */
const projectsData = [
  {
    id: 1,
    title: "Custom C++ Memory Allocator",
    category: "c-cpp",
    description: "A custom memory manager optimizing block allocation strategies, heap fragmentation, and alignment for low-level systems.",
    tech: ["C++", "Pointers", "POSIX", "Memory Management"],
    github: "https://github.com",
    demo: "#"
  },
  {
    id: 2,
    title: "Algorithm Visualizer Engine",
    category: "javascript",
    description: "Interactive visualizer illustrating sorting, graph traversal (Dijkstra, A*), and dynamic programming algorithms in real-time.",
    tech: ["JavaScript", "HTML5 Canvas", "CSS Grid"],
    github: "https://github.com",
    demo: "#"
  },
  {
    id: 3,
    title: "AI Portfolio Assistant Proxy",
    category: "web",
    description: "Serverless-backed web chatbot integrated with Google Gemini API using proxy middleware to safely isolate secret API credentials.",
    tech: ["JavaScript", "Node.js", "Gemini API", "REST"],
    github: "https://github.com",
    demo: "#"
  }
];

function initProjectsGrid() {
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!projectsGrid) return;

  function renderProjects(filter = 'all') {
    projectsGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      
      const techTags = project.tech
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');

      card.innerHTML = `
        <div class="project-header">
          <div class="folder-icon">📁</div>
          <div class="project-links">
            <a href="${project.github}" target="_blank" aria-label="GitHub Repository">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tech-list">${techTags}</div>
      `;

      projectsGrid.appendChild(card);
    });
  }

  // Initial render
  renderProjects('all');

  // Filter click handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    });
  });
}

/* ==========================================================================
   5. SECURE GEMINI CHATBOT WIDGET (USING PROXY /api/chat & .env)
   ========================================================================== */
function initChatbot() {
  const toggleBtn = document.getElementById('chat-toggle');
  const closeBtn = document.getElementById('chat-close');
  const chatPanel = document.getElementById('chat-panel');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const messagesContainer = document.getElementById('chat-messages');

  if (!chatForm || !chatInput || !messagesContainer || !chatPanel) return;

  // Toggle Chat Panel Visibility
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chatPanel.classList.toggle('hidden');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      chatPanel.classList.add('hidden');
    });
  }

  // Handle Form Submit Event
  chatForm.addEventListener('submit', async (e) => {
    // PREVENT PAGE RELOAD / SCROLL TO TOP
    e.preventDefault();
    e.stopPropagation();

    const userText = chatInput.value.trim();
    if (!userText) return;

    // 1. Append User Message safely (prevents XSS)
    appendMessage(userText, 'user');
    chatInput.value = '';

    // 2. Append Loading Indicator
    const loadingDiv = appendMessage('Thinking...', 'bot loading');

    // 3. Send Request to Secure Proxy Endpoint (/api/chat)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server processing error');
      }

      // Display response from Gemini proxy
      loadingDiv.textContent = data.reply;
      loadingDiv.classList.remove('loading');

    } catch (error) {
      console.error('Chatbot API Error:', error);
      loadingDiv.textContent = "Unable to connect to assistant right now. Please try using the contact form below!";
      loadingDiv.classList.remove('loading');
    }

    return false; // Extra safety against form submit actions
  });

  // Helper Function to Append Messages and Scroll Internally
  function appendMessage(text, className) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.textContent = text; // Safe against XSS script execution

    messagesContainer.appendChild(msgDiv);

    // Scroll ONLY the internal messages box, not the body window
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });

    return msgDiv;
  }
}

/* ==========================================================================
   6. UTILITY FUNCTIONS
   ========================================================================== */
function setCurrentYear() {
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}
