/* ========================================
   MEDIOBYTES PREMIUM AI CHATBOT
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // GEMINI API KEY — Pull from CMS
  // ========================================
  const services = window.CMS?.services || {};
  const GEMINI_API_KEY = services.geminiApiKey || "AIzaSyBxAZIa4AO0ku0Pxo0QUV3oihk3TKncDP8";

  // ========================================
  // CREATE CHATBOT UI
  // ========================================
  const chatbotContainer = document.createElement("div");

  chatbotContainer.className = "chatbot-container";

  chatbotContainer.innerHTML = `
        <div class="chat-btn" id="chatBtn">
            <div class="pulse"></div>
            <span>💬</span>
        </div>

        <div class="chat-window" id="chatWindow">

            <div class="chat-header">
                <div class="chat-header-info">
                    <h4>MedioBytes AI Assistant</h4>
                    <p>Typically replies instantly</p>
                </div>

                <button class="chat-close" id="chatClose">✕</button>
            </div>

            <div class="chat-messages" id="chatMessages">

                <div class="message bot">
                    Hello! 👋 I'm your MedioBytes AI Assistant.
                    How can I help you today with Web Design,
                    Branding, or Digital Marketing?
                </div>

            </div>

            <div class="chat-input-area">
                <input 
                    type="text" 
                    id="chatInput" 
                    placeholder="Type your message..."
                >

                <button class="chat-send" id="chatSend">
                    ➤
                </button>
            </div>

        </div>
    `;

  document.body.appendChild(chatbotContainer);

  // ========================================
  // ELEMENTS
  // ========================================
  const chatBtn = document.getElementById("chatBtn");
  const chatWindow = document.getElementById("chatWindow");
  const chatClose = document.getElementById("chatClose");
  const chatInput = document.getElementById("chatInput");
  const chatSend = document.getElementById("chatSend");
  const chatMessages = document.getElementById("chatMessages");

  // ========================================
  // TOGGLE CHAT WINDOW
  // ========================================
  chatBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("active");

    if (chatWindow.classList.contains("active")) {
      chatInput.focus();
    }
  });

  // ========================================
  // CLOSE CHAT
  // ========================================
  chatClose.addEventListener("click", (e) => {
    e.stopPropagation();

    chatWindow.classList.remove("active");
  });

  // ========================================
  // ADD MESSAGE
  // ========================================
  const addMessage = (text, sender) => {
    const msgDiv = document.createElement("div");

    msgDiv.className = `message ${sender}`;

    msgDiv.textContent = text;

    chatMessages.appendChild(msgDiv);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  /* ========================================
       LOCAL FALLBACK LOGIC (Used if API fails)
       ======================================== */

  const getFallbackResponse = (input) => {
    const query = input.toLowerCase().trim();

    const intents = [
      {
        keywords: ["hello", "hi", "hey", "greetings"],

        responses: [
          "Hi there 👋 Welcome to MedioBytes! How can I help you today?",

          "Hello 😊 Are you looking for Web Design, Branding, or Marketing services?",

          "Hey! Great to see you here. What can I help you with today?",
        ],
      },

      {
        keywords: ["web", "website", "development"],

        responses: [
          "We build modern, responsive, and high-performance websites for businesses.",

          "Our team creates business websites, ecommerce sites, and landing pages.",

          "We specialize in website development with modern UI and fast performance.",
        ],
      },

      {
        keywords: ["logo", "brand", "identity"],

        responses: [
          "We create unique logos and strong brand identities for businesses.",

          "Our branding services help businesses stand out professionally.",

          "From logo design to complete brand identity — we've got you covered.",
        ],
      },

      {
        keywords: ["marketing", "ads", "seo", "leads"],

        responses: [
          "We help businesses grow through SEO and digital marketing.",

          "Our marketing campaigns focus on lead generation and ROI.",

          "We provide SEO, Meta Ads, and social media marketing services.",
        ],
      },

      {
        keywords: ["price", "cost", "quote", "budget"],

        responses: [
          "Pricing depends on project requirements. Contact us for a custom quote.",

          "We offer flexible pricing based on your business needs.",

          "Please share your requirement so we can provide an estimate.",
        ],
      },

      {
        keywords: ["contact", "email", "phone", "call"],

        responses: [
          "You can contact MedioBytes at mediobytes@gmail.com",

          "Call us anytime for project discussions and consultations.",

          "Feel free to reach out for a free consultation.",
        ],
      },
    ];

    // FIND MATCHING INTENT
    for (const intent of intents) {
      for (const keyword of intent.keywords) {
        if (query.includes(keyword)) {
          // RANDOM RESPONSE
          const randomIndex = Math.floor(
            Math.random() * intent.responses.length,
          );

          return intent.responses[randomIndex];
        }
      }
    }

    // DEFAULT RESPONSE
    return "I'm here to help with Web Design, Branding, and Digital Marketing services.";
  };

  // ========================================
  // GET AI RESPONSE (GEMINI API)
  // ========================================
  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `
                                        You are MedioBytes AI Assistant.

                                        MedioBytes offers:
                                        - Web Design
                                        - Website Development
                                        - Branding
                                        - Logo Design
                                        - SEO
                                        - Digital Marketing
                                        - Social Media Marketing
                                        - Meta Ads
                                        - Google Ads

                                        Your behavior:
                                        - Friendly
                                        - Professional
                                        - Short and clear responses
                                        - Helpful assistant
                                        - Encourage users to contact MedioBytes
                                        - Never answer harmful questions

                                        User Message:
                                        ${userMessage}
                                        `,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();

      // If quota exceeded or other API error, use local fallback
      if (data.error) {
        console.warn("Gemini API Error:", data.error.message);
        return getFallbackResponse(userMessage);
      }

      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      }

      return getFallbackResponse(userMessage);
    } catch (error) {
      console.error("Gemini Fetch Error:", error);
      return getFallbackResponse(userMessage);
    }
  };

  // ========================================
  // SEND MESSAGE
  // ========================================
  const sendMessage = async () => {
    const text = chatInput.value.trim();

    if (!text) return;

    // USER MESSAGE
    addMessage(text, "user");

    chatInput.value = "";

    // TYPING MESSAGE
    addMessage("Typing...", "bot");

    const typingMessage = chatMessages.lastChild;

    // AI RESPONSE
    const aiReply = await getAIResponse(text);

    // REMOVE TYPING
    typingMessage.remove();

    // SHOW AI RESPONSE
    addMessage(aiReply, "bot");
  };

  // ========================================
  // BUTTON CLICK
  // ========================================
  chatSend.addEventListener("click", sendMessage);

  // ========================================
  // ENTER KEY
  // ========================================
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
