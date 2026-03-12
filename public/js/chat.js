/* =============================================
   BITBUDDY — Study Chat JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Study Chat', activeNav: 'chat' });

  initChannels();
  initChatInput();
  scrollToBottom();
});

/* ---- Channel switching ---- */
function initChannels() {
  document.querySelectorAll('.chat-channel').forEach(ch => {
    ch.addEventListener('click', () => {
      document.querySelectorAll('.chat-channel').forEach(c => c.classList.remove('active'));
      ch.classList.add('active');

      // Update header
      const channelName = ch.querySelector('span')?.textContent || 'general';
      const header = document.querySelector('.chat-header h4');
      if (header) header.textContent = channelName;

      // TODO: load channel messages from backend
      console.log('[bitBuddy] Switched to channel:', channelName);
    });
  });
}

/* ---- Chat Input ---- */
function initChatInput() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text  = input?.value.trim();
  if (!text) return;

  appendChatMessage({
    initials: 'JD',
    author:   'Jamie D. (You)',
    color:    'var(--primary)',
    text,
    isOwn:    true
  });

  if (input) input.value = '';
  scrollToBottom();

  // If message mentions @bitBuddy, call AI
  if (text.toLowerCase().includes('@bitbuddy')) {
    const question = text.replace(/@bitbuddy/gi, '').trim();
    fetchAIReply(question);
  }
}

/**
 * Appends a standard chat message to the messages list.
 */
function appendChatMessage({ initials, author, color, text, isOwn = false, isAI = false }) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;

  const now  = new Date();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const group = document.createElement('div');
  group.className = 'chat-msg-group';
  group.style.animation = 'fadeUp 0.2s ease';

  if (isAI) {
    group.innerHTML = `
      <div class="avatar" style="background:var(--primary);width:36px;height:36px;font-size:13px;">BB</div>
      <div class="chat-msg-content">
        <div class="chat-msg-header">
          <span class="chat-msg-author" style="color:var(--primary)">bitBuddy AI</span>
          <span class="chat-msg-time">Today at ${time}</span>
        </div>
        <div class="chat-ai-reply">
          <div class="ai-label">✨ AI Study Help</div>
          ${text}
        </div>
      </div>`;
  } else {
    group.innerHTML = `
      <div class="avatar" style="background:${color};width:36px;height:36px;font-size:13px;">${initials}</div>
      <div class="chat-msg-content">
        <div class="chat-msg-header">
          <span class="chat-msg-author">${author}</span>
          <span class="chat-msg-time">Today at ${time}</span>
        </div>
        <div class="chat-bubble">${text}</div>
      </div>`;
  }

  messages.appendChild(group);
  scrollToBottom();
}

/* ---- bitBuddy AI reply via Anthropic API ---- */
async function fetchAIReply(question) {
  // Show typing indicator
  const typingId = 'typing-' + Date.now();
  const messages = document.getElementById('chat-messages');
  const typing   = document.createElement('div');
  typing.id      = typingId;
  typing.className = 'chat-msg-group';
  typing.innerHTML = `
    <div class="avatar" style="background:var(--primary);width:36px;height:36px;font-size:13px;">BB</div>
    <div class="chat-msg-content">
      <div class="chat-msg-header"><span class="chat-msg-author" style="color:var(--primary)">bitBuddy AI</span></div>
      <div class="chat-ai-reply"><em>Thinking…</em></div>
    </div>`;
  messages?.appendChild(typing);
  scrollToBottom();

  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: `You are bitBuddy AI in a group study chat for secondary school students (ages 11-16).
Be helpful, encouraging and concise. Use simple language. Format replies clearly — use bold, line breaks and short bullet points if needed.
This is a chat, so keep answers shorter than you normally would. End with an offer to go deeper if they need it.`,
        messages: [{ role: 'user', content: question || 'Hello!' }]
      })
    });

    const data  = await res.json();
    const reply = data.content?.[0]?.text || "I'm having trouble right now — try again in a moment!";

    // Replace typing indicator
    const el = document.getElementById(typingId);
    if (el) {
      el.querySelector('.chat-ai-reply').innerHTML = `<div class="ai-label">✨ AI Study Help</div>${reply}`;
    }

  } catch (err) {
    const el = document.getElementById(typingId);
    if (el) el.querySelector('.chat-ai-reply').textContent = "Connection issue — check your internet! 🌐";
    console.error('[bitBuddy] Chat AI error:', err);
  }

  scrollToBottom();
}

function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}
