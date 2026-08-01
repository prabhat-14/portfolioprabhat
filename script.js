document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE MENU TOGGLE (Navbar)
  // ==========================================
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // ==========================================
  // 2. SMOOTH SCROLLING FOR NAV LINKS
  // ==========================================
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
          // Close mobile menu on click
          if (navMenu) navMenu.classList.remove('active');
        }
      }
    });
  });

  // ==========================================
  // 3. GEMINI AI CHATBOT LOGIC
  // ==========================================
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBox = document.getElementById('chat-box');

  // Backend API Communication
  async function sendChatMessage(userMessage) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to receive response from backend');
      }

      return data.reply;
    } catch (error) {
      console.error('Chatbot API Error:', error);
      return 'Unable to connect to assistant right now. Please try using the contact form below!';
    }
  }

  // Helper function to append messages in the UI
  function appendMessage(sender, text) {
    if (!chatBox) return;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);

    const textElement = document.createElement('p');
    textElement.textContent = text;

    messageElement.appendChild(textElement);
    chatBox.appendChild(messageElement);

    // Smooth auto-scroll to latest message
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Submit Handler for Chat
  if (chatForm && chatInput && chatBox) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const message = chatInput.value.trim();
      if (!message) return;

      // 1. Display User Message
      appendMessage('user', message);
      chatInput.value = '';

      // 2. Display Loading / "Thinking..." Indicator
      const loadingId = 'loading-' + Date.now();
      const loadingElement = document.createElement('div');
      loadingElement.classList.add('message', 'bot', 'loading');
      loadingElement.id = loadingId;
      loadingElement.textContent = 'Thinking...';
      
      chatBox.appendChild(loadingElement);
      chatBox.scrollTop = chatBox.scrollHeight;

      // 3. Fetch Response from Vercel Serverless Function
      const botReply = await sendChatMessage(message);

      // 4. Remove Loading Indicator & Display Bot Reply
      const currentLoadingMsg = document.getElementById(loadingId);
      if (currentLoadingMsg) {
        currentLoadingMsg.remove();
      }

      appendMessage('bot', botReply);
    });
  }

  // ==========================================
  // 4. CONTACT FORM HANDLER (Optional)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Add your contact form handler logic here if using Web3Forms, EmailJS, etc.
      console.log("Contact form submitted.");
    });
  }

});
