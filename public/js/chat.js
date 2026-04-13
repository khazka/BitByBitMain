/* =============================================
   BITBUDDY — Study Chat JS
   ============================================= */

const servers = [
  {
    name: "Jamie's Study Gang",
    initials: 'JS', color: '#609F8A', members: '4 members',
    channels: [
      { name: 'general',       type: 'text' },
      { name: 'homework-help', type: 'text' },
      { name: 'exam-revision', type: 'text' },
      { name: 'study-room-1',  type: 'voice', label: 'Study Room 1' },
      { name: 'chill-revision',type: 'voice', label: 'Chill Revision' },
    ]
  },
  {
    name: 'Mocks Prep Squad',
    initials: 'MP', color: '#5b7fa8', members: '6 members',
    channels: [
      { name: 'general',    type: 'text' },
      { name: 'past-papers',type: 'text' },
      { name: 'study-room', type: 'voice', label: 'Study Room' },
    ]
  },
  {
    name: 'Bio Revision',
    initials: 'BR', color: '#7b6aa8', members: '3 members',
    channels: [
      { name: 'general',      type: 'text' },
      { name: 'cell-biology', type: 'text' },
      { name: 'study-room',   type: 'voice', label: 'Study Room' },
    ]
  }
];

/* Voice call state */
let inVoiceCall    = false;
let micMuted       = false;
let deafened       = false;
let currentChannel = 'general';
let currentServer  = 0;
let speakInterval  = null;

const voiceParticipants = [
  { initials: 'JD', name: 'Jamie D.', tag: 'You',      color: '#609F8A', speaking: false, muted: false, deafened: false },
  { initials: 'AK', name: 'Amira K.', tag: 'Year 11',  color: '#5b7fa8', speaking: false, muted: false, deafened: false },
  { initials: 'LS', name: 'Liam S.',  tag: 'Year 10',  color: '#a87c5b', speaking: false, muted: false, deafened: false },
];

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Study Chat', activeNav: 'chat' });
  initServerRail();
  initChannels();
  initChatInput();
  initSidebarControls();
  scrollToBottom();
});

function closeServerModal() {
  document.getElementById('server-modal').classList.add('hidden');
}

/* ---- Server Rail ---- */
function initServerRail() {
  document.querySelectorAll('.server-icon[data-server]').forEach(icon => {
    icon.addEventListener('click', () => {
      document.querySelectorAll('.server-icon[data-server]').forEach(i => i.classList.remove('active'));
      icon.classList.add('active');
      currentServer = parseInt(icon.dataset.server);
      const server = servers[currentServer];
      if (!server) return;
      document.getElementById('server-name').textContent    = server.name;
      document.getElementById('server-members').textContent = server.members;
      rebuildChannels(server);
      leaveVoice();
    });
  });

  document.getElementById('btn-add-server')?.addEventListener('click', () => {
    document.getElementById('server-modal').classList.remove('hidden');
    document.getElementById('modal-codebox').classList.add('hidden');
    document.getElementById('invite-code-input').value = '';
  });

  // Close modal
  document.getElementById('server-modal-close')?.addEventListener('click', closeServerModal);
  document.getElementById('server-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('server-modal')) closeServerModal();
  });

  // Join option — toggle code input
  document.getElementById('modal-join-btn')?.addEventListener('click', () => {
    const box = document.getElementById('modal-codebox');
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) document.getElementById('invite-code-input').focus();
  });

  // Confirm join
  document.getElementById('modal-join-confirm')?.addEventListener('click', () => {
    const code = document.getElementById('invite-code-input').value.trim();
    if (!code) return;
    closeServerModal();
    // Simulate joining a server with the code
    const name     = `Server: ${code}`;
    const initials = code.slice(0, 2).toUpperCase();
    const colors   = ['#609F8A','#5b7fa8','#a87c5b','#7b6aa8','#4a8a9e'];
    const color    = colors[servers.length % colors.length];
    servers.push({ name, initials, color, members: '1 member', channels: [{ name: 'general', type: 'text' }, { name: 'study-room', type: 'voice', label: 'Study Room' }] });
    const rail    = document.querySelector('.server-rail');
    const divider = document.querySelector('.server-rail-divider');
    const icon    = document.createElement('div');
    icon.className        = 'server-icon';
    icon.dataset.server   = servers.length - 1;
    icon.title            = name;
    icon.style.background = color;
    icon.textContent      = initials;
    rail.insertBefore(icon, divider);
    initServerRail();
    icon.click();
  });

  // Create — locked, show premium message
  document.getElementById('modal-create-btn')?.addEventListener('click', () => {
    const sub = document.querySelector('.server-modal-option-premium .smo-sub');
    if (sub) {
      sub.textContent = '⭐ Upgrade to bitBuddy Premium to unlock server creation!';
      sub.style.color = '#a78bfa';
    }
  });
}

function rebuildChannels(server) {
  const sidebar = document.getElementById('chat-sidebar');
  sidebar.querySelectorAll('.chat-channel, .channel-label').forEach(el => el.remove());

  const textChannels  = server.channels.filter(c => c.type === 'text');
  const voiceChannels = server.channels.filter(c => c.type === 'voice');

  if (textChannels.length) {
    const lbl = document.createElement('div');
    lbl.className   = 'channel-label';
    lbl.textContent = 'Text Channels';
    sidebar.insertBefore(lbl, sidebar.querySelector('.sidebar-user-panel'));

    textChannels.forEach((ch, i) => {
      const div = document.createElement('div');
      div.className    = 'chat-channel' + (i === 0 ? ' active' : '');
      div.dataset.channel = ch.name;
      div.dataset.type    = 'text';
      div.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><span>${ch.name}</span>`;
      sidebar.insertBefore(div, sidebar.querySelector('.sidebar-user-panel'));
    });
  }

  if (voiceChannels.length) {
    const lbl2 = document.createElement('div');
    lbl2.className   = 'channel-label';
    lbl2.style.marginTop = '12px';
    lbl2.textContent = 'Voice Channels';
    sidebar.insertBefore(lbl2, sidebar.querySelector('.sidebar-user-panel'));

    voiceChannels.forEach(ch => {
      const div = document.createElement('div');
      div.className       = 'chat-channel voice-channel';
      div.dataset.channel = ch.name;
      div.dataset.type    = 'voice';
      div.dataset.label   = ch.label || ch.name;
      div.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg><span>${ch.label || ch.name}</span>`;
      sidebar.insertBefore(div, sidebar.querySelector('.sidebar-user-panel'));
    });
  }

  initChannels();

  // Reset text view
  const header = document.querySelector('.chat-header h4');
  const desc   = document.getElementById('channel-desc');
  if (header) header.textContent = textChannels[0]?.name || '';
  if (desc)   desc.textContent   = `${server.name} — ${textChannels[0]?.name || ''}`;

  document.getElementById('chat-messages').innerHTML = `
    <div class="chat-msg-group" style="animation:fadeUp 0.2s ease">
      <div class="avatar" style="background:${server.color};width:36px;height:36px;font-size:13px;">BB</div>
      <div class="chat-msg-content">
        <div class="chat-msg-header">
          <span class="chat-msg-author" style="color:var(--primary)">bitBuddy AI</span>
          <span class="chat-msg-time">Just now</span>
        </div>
        <div class="chat-ai-reply">
          <div class="ai-label">✨ Welcome</div>
          Welcome to <strong>${server.name}</strong>! Chat below or join a Voice Channel to study together. Type <strong>@bitBuddy</strong> for AI help. 📚
        </div>
      </div>
    </div>`;

  showTextView();
  scrollToBottom();
}

/* ---- Channel switching ---- */
function initChannels() {
  document.querySelectorAll('.chat-channel').forEach(ch => {
    ch.addEventListener('click', () => {
      const type  = ch.dataset.type;
      const name  = ch.dataset.channel;
      const label = ch.dataset.label || name;

      if (type === 'voice') {
        joinVoice(label);
        document.querySelectorAll('.chat-channel').forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
      } else {
        if (inVoiceCall) leaveVoice();
        document.querySelectorAll('.chat-channel').forEach(c => c.classList.remove('active'));
        ch.classList.add('active');
        currentChannel = name;
        const header = document.querySelector('.chat-header h4');
        const desc   = document.getElementById('channel-desc');
        if (header) header.textContent = name;
        if (desc)   desc.textContent   = `${servers[currentServer].name} — ${name}`;
        showTextView();
      }
    });
  });
}

/* ---- Voice: join ---- */
function joinVoice(roomLabel) {
  inVoiceCall = true;
  micMuted    = false;
  deafened    = false;

  document.getElementById('voice-channel-title').textContent = roomLabel;
  document.getElementById('voice-channel-desc').textContent  = servers[currentServer].name;
  document.getElementById('vc-room-name').textContent        = roomLabel;
  document.getElementById('sup-status').textContent          = '🔊 In Voice';

  renderParticipants();
  showVoiceView();
  simulateSpeaking();

  // Wire voice controls
  document.getElementById('vc-mic')?.addEventListener('click', toggleMic);
  document.getElementById('vc-deafen')?.addEventListener('click', toggleDeafen);
  document.getElementById('vc-leave')?.addEventListener('click', leaveVoice);
  document.getElementById('btn-mic')?.addEventListener('click', toggleMic);
  document.getElementById('btn-deafen')?.addEventListener('click', toggleDeafen);
}

/* ---- Voice: leave ---- */
function leaveVoice() {
  if (!inVoiceCall) return;
  inVoiceCall = false;
  clearInterval(speakInterval);
  document.getElementById('sup-status').textContent = 'Online';
  showTextView();
  // Deactivate voice channel highlights
  document.querySelectorAll('.chat-channel.voice-channel').forEach(c => c.classList.remove('active'));
  // Reactivate first text channel
  const first = document.querySelector('.chat-channel[data-type="text"]');
  if (first) first.classList.add('active');
}

/* ---- Toggle mic ---- */
function toggleMic() {
  micMuted = !micMuted;
  voiceParticipants[0].muted = micMuted;

  const vcBtn  = document.getElementById('vc-mic');
  const supBtn = document.getElementById('btn-mic');
  [vcBtn, supBtn].forEach(btn => {
    if (!btn) return;
    btn.classList.toggle('muted', micMuted);
    btn.title = micMuted ? 'Unmute microphone' : 'Mute microphone';
  });

  renderParticipants();
}

/* ---- Toggle deafen ---- */
function toggleDeafen() {
  deafened = !deafened;
  voiceParticipants[0].deafened = deafened;
  if (deafened) { micMuted = true; voiceParticipants[0].muted = true; }

  const vcBtn  = document.getElementById('vc-deafen');
  const supBtn = document.getElementById('btn-deafen');
  [vcBtn, supBtn].forEach(btn => {
    if (!btn) return;
    btn.classList.toggle('muted', deafened);
  });

  renderParticipants();
}

/* ---- Render participants ---- */
function renderParticipants() {
  const stage = document.getElementById('voice-stage');
  if (!stage) return;
  stage.innerHTML = voiceParticipants.map(p => `
    <div class="voice-participant">
      <div class="vp-avatar-wrap">
        <div class="vp-avatar ${p.speaking && !p.muted ? 'speaking' : ''} ${p.muted ? 'muted' : ''}"
             style="background:${p.color};">${p.initials}</div>
        <div class="vp-speak-ring"></div>
        <div class="vp-icons">
          ${p.muted
            ? `<div class="vp-icon mic-off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></div>`
            : `<div class="vp-icon mic-on"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg></div>`
          }
        </div>
      </div>
      <div class="vp-name">${p.name}</div>
      <div class="vp-tag">${p.tag}</div>
    </div>
  `).join('');
}

/* ---- Simulate random speaking ---- */
function simulateSpeaking() {
  clearInterval(speakInterval);
  speakInterval = setInterval(() => {
    if (!inVoiceCall) return;
    voiceParticipants.forEach((p, i) => {
      // Don't make muted people appear to speak
      p.speaking = !p.muted && Math.random() > (i === 0 ? 0.7 : 0.6);
    });
    renderParticipants();
  }, 1800);
}

/* ---- View helpers ---- */
function showVoiceView() {
  document.getElementById('text-view').classList.add('hidden');
  document.getElementById('voice-view').classList.remove('hidden');
  renderParticipants();
}
function showTextView() {
  document.getElementById('voice-view').classList.add('hidden');
  document.getElementById('text-view').classList.remove('hidden');
}

/* ---- Sidebar mic/deafen buttons ---- */
function initSidebarControls() {
  document.getElementById('btn-mic')?.addEventListener('click', () => {
    if (inVoiceCall) toggleMic();
  });
  document.getElementById('btn-deafen')?.addEventListener('click', () => {
    if (inVoiceCall) toggleDeafen();
  });
}

/* ---- Chat input ---- */
function initChatInput() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  sendBtn?.addEventListener('click', sendMessage);
  input?.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text  = input?.value.trim();
  if (!text) return;

  appendChatMessage({ initials: 'JD', author: 'Jamie D. (You)', color: 'var(--primary)', text });
  if (input) input.value = '';
  scrollToBottom();

  if (text.toLowerCase().includes('@bitbuddy')) {
    fetchAIReply(text.replace(/@bitbuddy/gi, '').trim());
  }
}

function appendChatMessage({ initials, author, color, text, isAI = false }) {
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
        <div class="chat-msg-header"><span class="chat-msg-author" style="color:var(--primary)">bitBuddy AI</span><span class="chat-msg-time">Today at ${time}</span></div>
        <div class="chat-ai-reply"><div class="ai-label">✨ AI Study Help</div>${text}</div>
      </div>`;
  } else {
    group.innerHTML = `
      <div class="avatar" style="background:${color};width:36px;height:36px;font-size:13px;">${initials}</div>
      <div class="chat-msg-content">
        <div class="chat-msg-header"><span class="chat-msg-author">${author}</span><span class="chat-msg-time">Today at ${time}</span></div>
        <div class="chat-bubble">${text}</div>
      </div>`;
  }
  messages.appendChild(group);
  scrollToBottom();
}

async function fetchAIReply(question) {
  const typingId = 'typing-' + Date.now();
  const messages = document.getElementById('chat-messages');
  const typing   = document.createElement('div');
  typing.id        = typingId;
  typing.className = 'chat-msg-group';
  typing.innerHTML = `
    <div class="avatar" style="background:var(--primary);width:36px;height:36px;font-size:13px;">BB</div>
    <div class="chat-msg-content">
      <div class="chat-msg-header"><span class="chat-msg-author" style="color:var(--primary)">bitBuddy AI</span></div>
      <div class="chat-ai-reply"><em style="color:var(--text-faint)">Thinking…</em></div>
    </div>`;
  messages?.appendChild(typing);
  scrollToBottom();

  try {
    const res  = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514', max_tokens: 600,
        system: `You are bitBuddy AI in a group study chat for secondary school students (ages 11-16). Be helpful, encouraging and concise. Use simple language. Keep answers short — this is a chat. End with an offer to go deeper.`,
        messages: [{ role: 'user', content: question || 'Hello!' }]
      })
    });
    const data  = await res.json();
    const reply = data.content?.[0]?.text || "I'm having trouble right now — try again!";
    const el    = document.getElementById(typingId);
    if (el) el.querySelector('.chat-ai-reply').innerHTML = `<div class="ai-label">✨ AI Study Help</div>${reply}`;
  } catch {
    const el = document.getElementById(typingId);
    if (el) el.querySelector('.chat-ai-reply').textContent = 'Connection issue — check your internet! 🌐';
  }
  scrollToBottom();
}

function scrollToBottom() {
  const messages = document.getElementById('chat-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}