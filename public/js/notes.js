/* =============================================
   BITBUDDY — AI Notes JS
   ============================================= */

const QUICK_PROMPTS = {
  'Summarise': "Can you summarise the key points from my notes?",
  'Quiz me':   "Quiz me on this topic with 3 short questions!",
  'Explain':   "Can you explain this topic in simple terms for a secondary school student?",
  'Examples':  "Can you give me 2-3 real-world examples to help understand this topic?"
};

let currentNoteTitle   = '';
let currentNoteContent = '';

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'AI Notes', activeNav: 'notes' });

  initNotesList();
  initEditor();
  initAIPanel();
});

/* ---- Notes list sidebar ---- */
function initNotesList() {
  document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.note-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      // TODO: load note content from storage/backend
    });
  });

  document.getElementById('btn-new-note')?.addEventListener('click', () => {
    const title   = document.getElementById('note-title');
    const content = document.getElementById('note-content');
    if (title)   title.value   = '';
    if (content) content.value = '';
    title?.focus();
  });
}

/* ---- Editor toolbar ---- */
function initEditor() {
  const title   = document.getElementById('note-title');
  const content = document.getElementById('note-content');

  // Track current note for AI context
  title?.addEventListener('input', () => { currentNoteTitle   = title.value; });
  content?.addEventListener('input', () => { currentNoteContent = content.value; });

  // Toolbar buttons
  document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      handleToolbarAction(action, content);
    });
  });

  // Save button
  document.getElementById('btn-save')?.addEventListener('click', () => {
    // TODO: save to localStorage / backend
    const titleVal   = title?.value   || 'Untitled';
    const contentVal = content?.value || '';
    console.log('[bitBuddy] Saving note:', titleVal);
    // Temporary feedback
    const btn = document.getElementById('btn-save');
    if (btn) {
      btn.textContent = 'Saved ✓';
      setTimeout(() => { btn.textContent = 'Save'; }, 1500);
    }
  });
}

function handleToolbarAction(action, textarea) {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const sel   = textarea.value.substring(start, end);

  const wrappers = {
    bold:    [`**`, `**`],
    italic:  [`_`, `_`],
    h1:      [`# `, ``],
    h2:      [`## `, ``],
    code:    ['`', '`'],
    formula: [`$$`, `$$`]
  };

  if (wrappers[action]) {
    const [before, after] = wrappers[action];
    const replaced = before + (sel || 'text') + after;
    textarea.value = textarea.value.substring(0, start) + replaced + textarea.value.substring(end);
    textarea.focus();
  } else if (action === 'list') {
    const lines    = (sel || 'Item').split('\n').map(l => `• ${l}`).join('\n');
    textarea.value = textarea.value.substring(0, start) + lines + textarea.value.substring(end);
    textarea.focus();
  }
}

/* ---- AI Panel ---- */
function initAIPanel() {
  const input   = document.getElementById('ai-input-field');
  const sendBtn = document.getElementById('ai-send-btn');

  sendBtn?.addEventListener('click', sendAiMessage);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendAiMessage();
  });

  // Quick prompt chips
  document.querySelectorAll('.quick-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = QUICK_PROMPTS[btn.textContent.trim()] || btn.textContent;
      if (input) input.value = prompt;
      sendAiMessage();
    });
  });
}

async function sendAiMessage() {
  const input    = document.getElementById('ai-input-field');
  const messages = document.getElementById('ai-messages');
  const text     = input?.value.trim();
  if (!text) return;

  // Append user message
  appendMessage(messages, 'user', text);
  if (input) input.value = '';

  // Thinking placeholder
  const thinking = appendMessage(messages, 'bot', 'Thinking…', true);

  // Build context from current note
  const context = currentNoteContent
    ? `The student's current note is titled "${currentNoteTitle || 'Untitled'}" and contains:\n\n${currentNoteContent.slice(0, 800)}`
    : 'The student has no note open yet.';

  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are bitBuddy AI, a friendly and encouraging study assistant for secondary school students (ages 11-16). 
You help with GCSE-level subjects: Maths, Science (Biology, Chemistry, Physics), English Literature and Language, History, Geography, Computer Science.
Keep responses concise, clear and encouraging. Use simple language. Break answers into short steps. Occasionally use emojis to stay friendly.
${context}`,
        messages: [{ role: 'user', content: text }]
      })
    });

    const data  = await res.json();
    const reply = data.content?.[0]?.text || "I'm having trouble connecting right now. Please try again!";
    updateMessage(thinking, reply);

  } catch (err) {
    updateMessage(thinking, "Connection issue — check your internet and try again! 🌐");
    console.error('[bitBuddy] AI error:', err);
  }
}

/* ---- Helpers ---- */
function appendMessage(container, role, text, isTemp = false) {
  const div = document.createElement('div');
  div.className = `ai-msg ${role}`;
  if (role === 'bot') {
    div.innerHTML = `<div class="msg-label">bitBuddy AI</div>${text}`;
  } else {
    div.textContent = text;
  }
  container?.appendChild(div);
  container && (container.scrollTop = container.scrollHeight);
  return div;
}

function updateMessage(el, text) {
  if (!el) return;
  el.innerHTML = `<div class="msg-label">bitBuddy AI</div>${text}`;
  el.closest('.ai-messages') && (el.closest('.ai-messages').scrollTop = 99999);
}
