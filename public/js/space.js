/* =============================================
   BITBUDDY — Study Space (Feed) JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Study Space', activeNav: 'space' });

  initTabs();
  initCompose();
  initPostActions();
});

/* ---- Feed Tabs ---- */
function initTabs() {
  document.querySelectorAll('.feed-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.feed-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // TODO: filter/reload posts based on tab.dataset.tab
    });
  });
}

/* ---- Compose Box ---- */
function initCompose() {
  const postBtn   = document.getElementById('compose-post-btn');
  const input     = document.getElementById('compose-input');
  const feedMain  = document.getElementById('feed-posts');

  postBtn?.addEventListener('click', () => {
    const text = input?.value.trim();
    if (!text) { input?.focus(); return; }
    prependPost({ author: 'Jamie D.', initials: 'JD', time: 'Just now', text, subject: 'General' });
    if (input) input.value = '';
  });

  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      postBtn?.click();
    }
  });

  // Compose tag chips
  document.querySelectorAll('.compose-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      // TODO: open tag/subject picker modal
    });
  });
}

/**
 * Prepend a new post card to the feed.
 */
function prependPost({ author, initials, time, text, subject }) {
  const feedPosts = document.getElementById('feed-posts');
  if (!feedPosts) return;

  const colors = ['#609F8A', '#5b7fa8', '#a87c5b', '#7b6aa8', '#4a8a9e'];
  const color  = colors[Math.floor(Math.random() * colors.length)];

  const card = document.createElement('div');
  card.className = 'post-card';
  card.style.animation = 'fadeUp 0.3s ease';
  card.innerHTML = `
    <div class="post-header">
      <div class="avatar" style="background:${color};width:36px;height:36px;font-size:13px;">${initials}</div>
      <div class="post-meta">
        <div class="post-author">${author}</div>
        <div class="post-time">${time}</div>
      </div>
      <span class="post-subject-tag">${subject}</span>
    </div>
    <div class="post-body">${text}</div>
    <div class="post-footer">
      <button class="post-action vote-btn" data-votes="0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18,15 12,9 6,15"/></svg>
        <span class="vote-count">0</span>
      </button>
      <button class="post-action">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        0 Replies
      </button>
    </div>
  `;
  feedPosts.prepend(card);
  attachVoteListener(card.querySelector('.vote-btn'));
}

/* ---- Post Actions (vote, etc.) ---- */
function initPostActions() {
  document.querySelectorAll('.vote-btn').forEach(attachVoteListener);
}

function attachVoteListener(btn) {
  if (!btn) return;
  btn.addEventListener('click', () => {
    const countEl = btn.querySelector('.vote-count');
    const current = parseInt(countEl.textContent) || 0;
    const voted   = btn.dataset.voted === 'true';
    if (voted) {
      countEl.textContent = current - 1;
      btn.dataset.voted = 'false';
      btn.style.color = '';
    } else {
      countEl.textContent = current + 1;
      btn.dataset.voted = 'true';
      btn.style.color = 'var(--primary)';
    }
  });
}
