/* =============================================
   BITBUDDY — Messages JS
   ============================================= */

const friends = [
  { name: 'Amira Khan',   initials: 'AK', color: '#5b7fa8', online: true  },
  { name: 'Liam Scott',   initials: 'LS', color: '#a87c5b', online: true  },
  { name: 'Priya Osei',   initials: 'PO', color: '#609F8A', online: false },
  { name: 'Tyler Mason',  initials: 'TM', color: '#2d6e5e', online: false },
  { name: 'Sofia Rahman', initials: 'SR', color: '#7b6aa8', online: true  },
  { name: 'Jake Brennan', initials: 'JB', color: '#4a8a9e', online: false },
];

const dmHistory = {
  0: [
    { own: false, text: 'Hey Jamie! Did you understand the Newton question from today? 😅', time: '2:30 PM' },
    { own: true,  text: 'Yeah! The key is to think about force pairs — both objects always experience equal but opposite forces', time: '2:32 PM' },
    { own: false, text: 'Oh that actually makes sense! Thanks 🙏', time: '2:33 PM' },
    { own: false, text: 'Are you joining the study session tonight?', time: '2:34 PM' },
  ],
  1: [
    { own: true,  text: 'Liam your quadratics post was so helpful!!', time: 'Yesterday' },
    { own: false, text: 'Haha glad it helped! Took me ages to figure that out', time: 'Yesterday' },
    { own: false, text: 'Good luck with your mocks 💪', time: 'Yesterday' },
  ],
  2: [],
  3: [],
  4: [
    { own: false, text: 'Hey, can you share your Biology notes?', time: '10:15 AM' },
    { own: true,  text: "Sure! I'll upload them to the study server later", time: '10:18 AM' },
  ],
  5: [],
};

const autoReplies = [
  'Haha yes exactly! 😄',
  'Good point, I was thinking the same thing',
  'Let me check my notes and get back to you',
  'Have you tried asking bitBuddy AI? It might help!',
  'Yeah this topic is tricky 😅',
  'Thanks for that! Super helpful 🙏',
  'lol same 😂',
  'Want to jump in the Study Chat later?',
];

let currentIdx = null;

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Messages', activeNav: 'messages' });

  initDMList();
  initInput();

  // Auto-open first conversation
  document.querySelector('.dm-row')?.click();
});

function initDMList() {
  document.querySelectorAll('.dm-row').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.dm-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const idx = parseInt(row.dataset.idx);
      currentIdx = idx;

      // Remove unread badge
      row.querySelector('.dm-unread-badge')?.remove();
      const preview = row.querySelector('.dm-row-preview');
      if (preview) preview.classList.remove('unread');

      openChat(idx);
    });
  });

  document.getElementById('dm-search')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.dm-row').forEach(row => {
      const name = row.querySelector('.dm-row-name').textContent.toLowerCase();
      row.style.display = name.includes(q) ? '' : 'none';
    });
  });
}

function openChat(idx) {
  const f = friends[idx];
  document.getElementById('dm-hint').style.display   = 'none';
  document.getElementById('dm-active').classList.remove('hidden');

  const av = document.getElementById('dm-hdr-av');
  av.textContent        = f.initials;
  av.style.background   = f.color;
  document.getElementById('dm-hdr-name').textContent   = f.name;
  const statusEl = document.getElementById('dm-hdr-status');
  statusEl.textContent  = f.online ? 'Online' : 'Offline';
  statusEl.className    = 'dm-chat-header-status' + (f.online ? ' online' : '');

  renderMessages(idx);
  document.getElementById('dm-input').focus();
}

function renderMessages(idx) {
  const container = document.getElementById('dm-messages');
  const msgs = dmHistory[idx] || [];
  const f    = friends[idx];

  if (msgs.length === 0) {
    container.innerHTML = '<div style="text-align:center;color:var(--text-faint);font-size:13px;padding:40px 20px;">No messages yet — say hello! 👋</div>';
    return;
  }

  container.innerHTML = msgs.map(m => {
    return '<div class="dm-msg' + (m.own ? ' own' : '') + '">' +
      (!m.own ? '<div class="dm-msg-av" style="background:' + f.color + ';">' + f.initials + '</div>' : '') +
      '<div class="dm-msg-inner">' +
        '<div class="dm-msg-time">' + m.time + '</div>' +
        '<div class="dm-bubble">' + m.text + '</div>' +
      '</div>' +
      (m.own ? '<div class="dm-msg-av" style="background:var(--primary);">JD</div>' : '') +
    '</div>';
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function initInput() {
  const input   = document.getElementById('dm-input');
  const sendBtn = document.getElementById('dm-send');

  function send() {
    const text = input?.value.trim();
    if (!text || currentIdx === null) return;

    const now  = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    if (!dmHistory[currentIdx]) dmHistory[currentIdx] = [];
    dmHistory[currentIdx].push({ own: true, text, time });
    renderMessages(currentIdx);
    input.value = '';

    // Update preview in list
    const row = document.querySelector('.dm-row[data-idx="' + currentIdx + '"]');
    if (row) {
      const preview = row.querySelector('.dm-row-preview');
      if (preview) { preview.textContent = text; preview.classList.remove('unread'); }
    }

    // Auto reply
    setTimeout(() => {
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      dmHistory[currentIdx].push({ own: false, text: reply, time: 'Just now' });
      renderMessages(currentIdx);

      // Update preview
      if (row) {
        const preview = row.querySelector('.dm-row-preview');
        if (preview) preview.textContent = reply;
      }
    }, 1400);
  }

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keypress', e => { if (e.key === 'Enter') send(); });
}