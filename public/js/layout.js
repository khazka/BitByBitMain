function initLayout({ title = 'bitBuddy', activeNav = '' } = {}) {
  const navItems = [
    {
      id: 'space',
      label: 'Study Space',
      href: '/space',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`
    },
    {
      id: 'classroom',
      label: 'Classrooms',
      href: '/classroom',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    },
    {
      id: 'notes',
      label: 'Notes',
      href: '/notes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
    },
    {
      id: 'chat',
      label: 'Study Chat',
      href: '/chat',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`
    },
    {
      id: 'ai',
      label: 'AI Assistant',
      href: '/ai',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`
    }
  ];

  const navHTML = navItems.map(item => `
    <li>
      <a href="${item.href}" class="${item.id === activeNav ? 'active' : ''}">
        ${item.icon}
        ${item.label}
      </a>
    </li>
  `).join('');

  const sidebarHTML = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="bb-icon" style="width:36px;height:36px;font-size:14px;border-radius:10px;">bb</div>
        <div class="name">bit<em>Buddy</em></div>
      </div>

      <div class="sidebar-section-label">Main</div>
      <ul class="sidebar-nav">${navHTML}</ul>

      <div class="sidebar-bottom">
        <a href="/profile" class="user-pill" style="text-decoration:none;">
          <div class="avatar" style="width:32px;height:32px;font-size:12px;" id="sidebar-avatar">JD</div>
          <div>
            <div class="user-name" id="sidebar-username">Jamie D.</div>
            <div class="user-tag">Year 10 · Student</div>
          </div>
        </a>
      </div>
    </aside>
  `;

  const topnavHTML = `
    <nav class="topnav">
      <span class="topnav-title">${title}</span>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Search posts, notes, classrooms..." id="global-search">
      </div>
      <div class="topnav-actions">
        <a href="/premium" class="topnav-premium-btn" title="Join Premium">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
          Join Premium
        </a>
        <button class="icon-btn" title="Add Friend" id="btn-add-friend">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="16" y1="11" x2="22" y2="11"/>
          </svg>
        </button>
        <button class="icon-btn notif-badge" title="Notifications" id="btn-notifs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
        <div class="avatar" style="width:34px;height:34px;font-size:12px;cursor:pointer;"
             id="topnav-avatar" title="My Profile"
             onclick="window.location.href='/profile'">JD</div>
      </div>
    </nav>
  `;

  const shell = document.getElementById('app-shell');
  if (!shell) {
    console.error('[bitBuddy] No #app-shell element found on this page.');
    return;
  }

  // Pages that need full-height zero-padding layout
  const fullHeightPages = ['ai', 'chat', 'notes'];
  const isFullHeight = fullHeightPages.includes(activeNav);

  const pageContentStyle = isFullHeight
    ? 'style="padding:0;overflow:hidden;display:flex;flex:1;height:calc(100vh - var(--nav-height));"'
    : '';

  const mainAreaStyle = isFullHeight
    ? 'style="overflow:hidden;"'
    : '';

  const pageContent = shell.innerHTML;
  shell.innerHTML =
    sidebarHTML +
    `<div class="main-area" ${mainAreaStyle}>
       ${topnavHTML}
       <div class="page-content" ${pageContentStyle}>${pageContent}</div>
     </div>`;

  document.title = `${title} — bitBuddy`;

  /* ---- Add Friend Modal ---- */
  const mockStudents = [
    { initials: 'AK', name: 'Amira Khan',    tag: 'Year 11 · Physics',      color: '#5b7fa8', mutual: 3  },
    { initials: 'LS', name: 'Liam Scott',    tag: 'Year 10 · Maths',        color: '#a87c5b', mutual: 5  },
    { initials: 'PO', name: 'Priya Osei',    tag: 'Year 11 · English Lit',  color: '#609F8A', mutual: 2  },
    { initials: 'TM', name: 'Tyler Mason',   tag: 'Year 10 · Computer Sci', color: '#2d6e5e', mutual: 1  },
    { initials: 'SR', name: 'Sofia Rahman',  tag: 'Year 11 · Biology',      color: '#7b6aa8', mutual: 4  },
    { initials: 'JB', name: 'Jake Brennan',  tag: 'Year 10 · Chemistry',    color: '#4a8a9e', mutual: 0  },
    { initials: 'MN', name: 'Maya Nguyen',   tag: 'Year 11 · History',      color: '#a87c5b', mutual: 2  },
    { initials: 'OA', name: 'Oliver Adams',  tag: 'Year 10 · Geography',    color: '#609F8A', mutual: 6  },
  ];

  const studentRows = mockStudents.map(function(s) {
    return '<div class="friend-item" data-name="' + s.name.toLowerCase() + '">' +
      '<div class="friend-avatar" style="background:' + s.color + ';">' + s.initials + '</div>' +
      '<div class="friend-info">' +
        '<div class="friend-name">' + s.name + '</div>' +
        '<div class="friend-tag">' + s.tag + (s.mutual > 0 ? ' · ' + s.mutual + ' mutual friends' : '') + '</div>' +
      '</div>' +
      '<button class="friend-add-btn" onclick="this.textContent=\'✓ Sent\';this.classList.add(\'sent\');this.disabled=true;">Add</button>' +
    '</div>';
  }).join('');

  const friendModalHTML = '<div class="friend-modal-overlay" id="friend-modal" style="display:none;">' +
    '<div class="friend-modal">' +
      '<div class="friend-modal-header">' +
        '<div class="friend-modal-title">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;color:var(--primary)"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>' +
          'Add Friends' +
        '</div>' +
        '<button class="friend-modal-close" id="friend-modal-close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="friend-search-wrap">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<input type="text" id="friend-search-input" placeholder="Search by name or username...">' +
      '</div>' +
      '<div class="friend-list-label">Suggested · bitBuddy Students</div>' +
      '<div class="friend-list" id="friend-list">' + studentRows + '</div>' +
    '</div>' +
  '</div>';

  document.body.insertAdjacentHTML('beforeend', friendModalHTML);

  // Open
  document.getElementById('btn-add-friend')?.addEventListener('click', () => {
    document.getElementById('friend-modal').style.display = 'flex';
    document.getElementById('friend-search-input').focus();
  });

  // Close
  document.getElementById('friend-modal-close')?.addEventListener('click', closeFriendModal);
  document.getElementById('friend-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('friend-modal')) closeFriendModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeFriendModal();
  });

  // Live search filter
  document.getElementById('friend-search-input')?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.friend-item').forEach(item => {
      item.style.display = item.dataset.name.includes(q) ? '' : 'none';
    });
    document.querySelector('.friend-list-label').textContent =
      q ? 'Results for "' + e.target.value + '"' : 'Suggested · bitBuddy Students';
  });

  function closeFriendModal() {
    const modal = document.getElementById('friend-modal');
    if (modal) modal.style.display = 'none';
  }
}