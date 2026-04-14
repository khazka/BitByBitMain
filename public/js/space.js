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
  const postBtn  = document.getElementById('compose-post-btn');
  const input    = document.getElementById('compose-input');
  const pickers  = document.getElementById('compose-pickers');
  const subjBtn  = document.getElementById('btn-add-subject');
  const topicBtn = document.getElementById('btn-tag-topic');
  const subjSel  = document.getElementById('compose-subject');
  const topicInp = document.getElementById('compose-topic');
  const tagsWrap = document.getElementById('compose-selected-tags');

  let selectedSubject = '';
  let selectedTopics  = [];

  // Show pickers when input is focused
  input?.addEventListener('focus', () => {
    pickers.style.display = 'block';
  });

  // Add Subject button toggles select focus
  subjBtn?.addEventListener('click', () => {
    pickers.style.display = 'block';
    subjSel?.focus();
  });

  // Topic button toggles input focus
  topicBtn?.addEventListener('click', () => {
    pickers.style.display = 'block';
    topicInp?.focus();
  });

  // Subject select change — show tag
  subjSel?.addEventListener('change', () => {
    selectedSubject = subjSel.value;
    updateTags();
    subjBtn.textContent = selectedSubject ? '📚 ' + selectedSubject : '📚 Add Subject';
    subjBtn.style.borderColor = selectedSubject ? 'var(--primary)' : '';
    subjBtn.style.color       = selectedSubject ? 'var(--primary)' : '';
  });

  // Topic input — add tag on Enter or comma
  topicInp?.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && topicInp.value.trim()) {
      e.preventDefault();
      const tag = topicInp.value.trim().replace(',', '');
      if (tag && !selectedTopics.includes(tag)) {
        selectedTopics.push(tag);
        updateTags();
      }
      topicInp.value = '';
    }
  });

  function updateTags() {
    tagsWrap.innerHTML = '';
    if (selectedSubject) {
      addTagEl('📚 ' + selectedSubject, () => {
        selectedSubject = '';
        subjSel.value   = '';
        subjBtn.textContent  = '📚 Add Subject';
        subjBtn.style.borderColor = '';
        subjBtn.style.color       = '';
        updateTags();
      });
    }
    selectedTopics.forEach(t => {
      addTagEl('🔖 ' + t, () => {
        selectedTopics = selectedTopics.filter(x => x !== t);
        updateTags();
      });
    });
  }

  function addTagEl(text, onRemove) {
    const el = document.createElement('span');
    el.className = 'compose-selected-tag';
    el.innerHTML = text + '<button>✕</button>';
    el.querySelector('button').addEventListener('click', onRemove);
    tagsWrap.appendChild(el);
  }

  // Post
  postBtn?.addEventListener('click', () => {
    const text = input?.value.trim();
    if (!text) { input?.focus(); return; }

    const subject = selectedSubject || 'General';
    const tags    = [...selectedTopics];

    prependPost({ author: 'Jamie D.', initials: 'JD', time: 'Just now', text, subject, tags });

    // Reset
    input.value       = '';
    selectedSubject   = '';
    selectedTopics    = [];
    subjSel.value     = '';
    topicInp.value    = '';
    tagsWrap.innerHTML = '';
    pickers.style.display = 'none';
    subjBtn.textContent   = '📚 Add Subject';
    subjBtn.style.borderColor = '';
    subjBtn.style.color       = '';
  });

  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); postBtn?.click(); }
  });

  document.querySelectorAll('.compose-tag').forEach(tag => {
    tag.addEventListener('click', () => {});
  });
}

/**
 * Prepend a new post card to the feed.
 */
function prependPost({ author, initials, time, text, subject, tags = [] }) {
  const feedPosts = document.getElementById('feed-posts');
  if (!feedPosts) return;

  const colors = ['#609F8A', '#5b7fa8', '#a87c5b', '#7b6aa8', '#4a8a9e'];
  const color  = colors[Math.floor(Math.random() * colors.length)];

  const tagsHTML = tags.length
    ? '<div class="post-tags">' + tags.map(t => '<span class="post-tag">' + t + '</span>').join('') + '</div>'
    : '';

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
    ${tagsHTML}
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
  sortPostsByVotes();
}

/* ---- Post Actions (vote, etc.) ---- */
function initPostActions() {
  document.querySelectorAll('.vote-btn').forEach(attachVoteListener);
  sortPostsByVotes();
}

function attachVoteListener(btn) {
  if (!btn) return;
  btn.addEventListener('click', () => {
    const countEl = btn.querySelector('.vote-count');
    const current = parseInt(countEl.textContent) || 0;
    const voted   = btn.dataset.voted === 'true';

    if (voted) {
      countEl.textContent = current - 1;
      btn.dataset.voted   = 'false';
      btn.style.color     = '';
      btn.querySelector('svg').style.fill   = 'none';
      btn.querySelector('svg').style.stroke = 'currentColor';
    } else {
      countEl.textContent = current + 1;
      btn.dataset.voted   = 'true';
      btn.style.color     = 'var(--primary)';
      btn.querySelector('svg').style.fill   = 'rgba(96,159,138,0.2)';
      btn.querySelector('svg').style.stroke = 'var(--primary)';

      btn.style.transform = 'scale(1.2)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }

    sortPostsByVotes();
  });
}

function sortPostsByVotes() {
  const feed  = document.getElementById('feed-posts');
  if (!feed) return;
  const cards = Array.from(feed.querySelectorAll('.post-card'));
  cards.sort((a, b) => {
    const aVotes = parseInt(a.querySelector('.vote-count')?.textContent) || 0;
    const bVotes = parseInt(b.querySelector('.vote-count')?.textContent) || 0;
    return bVotes - aVotes;
  });
  cards.forEach(card => {
    card.style.animation = 'none';
    feed.appendChild(card);
    // re-trigger fade animation
    requestAnimationFrame(() => {
      card.style.animation = '';
    });
  });
}