/* =============================================
   BITBUDDY — AI Assistant JS
   ============================================= */

let selectedSubject = 'General';
let conversationHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'AI Assistant', activeNav: 'ai' });

  initSubjectChips();
  initSuggestionCards();
  initInput();
  initNewChat();
  initHistoryItems();
});

/* ---- Subject chips ---- */
function initSubjectChips() {
  document.querySelectorAll('.subject-chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.subject-chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSubject = btn.dataset.subject || 'General';
    });
  });
}

/* ---- Suggestion cards ---- */
function initSuggestionCards() {
  const prompts = {
    0: 'Explain Newton\'s 3rd Law for Year 10 Physics',
    1: 'Check my answer: I think the quadratic formula is x = (-b ± √(b²-4ac)) / 2a',
    2: 'Quiz me on GCSE cell biology',
    3: 'Help me structure a Macbeth essay about ambition'
  };

  document.querySelectorAll('.suggestion-card').forEach((card, i) => {
    card.addEventListener('click', () => {
      const textarea = document.getElementById('ai-textarea');
      if (textarea && prompts[i]) {
        textarea.value = prompts[i];
        textarea.focus();
      }
    });
  });
}

/* ---- New Chat ---- */
function initNewChat() {
  document.getElementById('btn-new-chat')?.addEventListener('click', () => {
    conversationHistory = [];
    document.getElementById('ai-messages-area').innerHTML = '';
    document.getElementById('ai-messages-area').classList.add('hidden');
    document.getElementById('ai-welcome').classList.remove('hidden');
  });
}

/* ---- History items ---- */
function initHistoryItems() {
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.history-item').forEach(h => h.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

/* ---- Input: textarea auto-resize + send ---- */
function initInput() {
  const textarea = document.getElementById('ai-textarea');
  const sendBtn  = document.getElementById('ai-send-btn');

  textarea?.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    sendBtn.disabled = !textarea.value.trim();
  });

  textarea?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (textarea.value.trim()) sendMessage();
    }
  });

  sendBtn?.addEventListener('click', sendMessage);
  sendBtn.disabled = true;
}

/* ---- Send a message ---- */
function sendMessage() {
  const textarea = document.getElementById('ai-textarea');
  const text = textarea?.value.trim();
  if (!text) return;

  // Hide welcome, show messages
  document.getElementById('ai-welcome')?.classList.add('hidden');
  document.getElementById('ai-messages-area')?.classList.remove('hidden');

  // Append user message
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });

  // Clear input
  textarea.value = '';
  textarea.style.height = 'auto';
  document.getElementById('ai-send-btn').disabled = true;

  // Get AI reply
  fetchAIReply();
}

/* ---- Append a message bubble ---- */
function appendMessage(role, text) {
  const area = document.getElementById('ai-messages-area');
  if (!area) return;

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;

  if (role === 'user') {
    row.innerHTML = `
      <div class="msg-avatar user">JD</div>
      <div class="msg-bubble user">${escapeHTML(text)}</div>
    `;
  } else {
    row.innerHTML = `
      <div class="msg-avatar bot">bb</div>
      <div class="msg-bubble bot">
        <div class="bot-label">bitBuddy AI · ${selectedSubject}</div>
        ${text}
      </div>
    `;
  }

  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
  return row;
}

/* ---- Show typing indicator ---- */
function showTyping() {
  const area = document.getElementById('ai-messages-area');
  if (!area) return null;

  const row = document.createElement('div');
  row.className = 'msg-row';
  row.id = 'typing-indicator';
  row.innerHTML = `
    <div class="msg-avatar bot">bb</div>
    <div class="msg-bubble bot">
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  area.appendChild(row);
  area.scrollTop = area.scrollHeight;
  return row;
}

/* ---- Fetch AI reply from OpenAI API ---- */
async function fetchAIReply() {
  const typingEl = showTyping();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are bitBuddy AI, a friendly and encouraging study assistant for secondary school students aged 11–16 in the UK (GCSE level).
Current subject context: ${selectedSubject}.
Be clear, concise and supportive. Use simple language. You can use <strong> tags for bold, <br> for line breaks, and bullet points with • where helpful.
Encourage the student and offer to go deeper if they want more detail.`,
        messages: conversationHistory
      })
    });

    const data  = await res.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response — try again in a moment!";

    typingEl?.remove();

    conversationHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply.replace(/\n/g, '<br>'));

  } catch (err) {
    typingEl?.remove();
    appendMessage('bot', "⚠️ Connection issue — please check your internet and try again.");
    console.error('[bitBuddy] AI error:', err);
  }
}

/* ---- Utility ---- */
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}