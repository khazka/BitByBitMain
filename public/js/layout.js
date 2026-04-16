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
      <a href="/space" class="sidebar-logo" style="text-decoration:none;">
        <div class="bb-icon" style="width:36px;height:36px;font-size:14px;border-radius:10px;">bb</div>
        <div class="name">bit<em>Buddy</em></div>
      </a>

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
      <a href="/space" class="topnav-title" style="text-decoration:none;color:inherit;">${title}</a>
      <div class="search-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Search posts, notes, classrooms..." id="global-search">
      </div>
      <div class="topnav-actions">
        <button class="icon-btn" id="btn-theme-toggle" title="Toggle dark mode">
          <svg id="theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          <svg id="theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;display:none;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <a href="/premium" class="topnav-premium-btn" title="Join Premium">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:13px;height:13px;flex-shrink:0;"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
          Join Premium
        </a>
        <button class="icon-btn" title="Add Friend" id="btn-add-friend">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="16" y1="11" x2="22" y2="11"/></svg>
        </button>
        <button class="icon-btn notif-badge" title="Notifications" id="btn-notifs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        </button>
        <div class="avatar" style="width:34px;height:34px;font-size:12px;cursor:pointer;" id="topnav-avatar" title="My Profile" onclick="window.location.href='/profile'">JD</div>
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
    { initials: 'AK', name: 'Amira Khan',   tag: 'Year 11 · Physics',      color: '#5b7fa8', mutual: 3, state: 'none' },
    { initials: 'LS', name: 'Liam Scott',   tag: 'Year 10 · Maths',        color: '#a87c5b', mutual: 5, state: 'none' },
    { initials: 'PO', name: 'Priya Osei',   tag: 'Year 11 · English Lit',  color: '#609F8A', mutual: 2, state: 'added_you' },
    { initials: 'TM', name: 'Tyler Mason',  tag: 'Year 10 · Computer Sci', color: '#2d6e5e', mutual: 1, state: 'none' },
    { initials: 'SR', name: 'Sofia Rahman', tag: 'Year 11 · Biology',      color: '#7b6aa8', mutual: 4, state: 'added_you' },
    { initials: 'JB', name: 'Jake Brennan', tag: 'Year 10 · Chemistry',    color: '#4a8a9e', mutual: 0, state: 'none' },
    { initials: 'MN', name: 'Maya Nguyen',  tag: 'Year 11 · History',      color: '#a87c5b', mutual: 2, state: 'none' },
    { initials: 'OA', name: 'Oliver Adams', tag: 'Year 10 · Geography',    color: '#609F8A', mutual: 6, state: 'none' },
  ];

  function buildStudentRows() {
    var sorted = mockStudents.slice().sort(function(a, b) {
      if (a.state === 'added_you' && b.state !== 'added_you') return -1;
      if (b.state === 'added_you' && a.state !== 'added_you') return 1;
      return 0;
    });
    return sorted.map(function(s, i) {
      var idx = mockStudents.indexOf(s);
      var actionHTML = '';
      if (s.state === 'added_you') {
        actionHTML =
          '<div class="friend-action-group">' +
            '<span class="friend-added-you-label">Added you</span>' +
            '<button class="friend-accept-btn" data-idx="' + idx + '">Accept</button>' +
            '<button class="friend-decline-btn" data-idx="' + idx + '">Decline</button>' +
          '</div>';
      } else if (s.state === 'sent') {
        actionHTML = '<button class="friend-add-btn sent" disabled>✓ Sent</button>';
      } else if (s.state === 'friends') {
        actionHTML = '<button class="friend-add-btn friends" disabled>✓ Friends</button>';
      } else if (s.state === 'declined') {
        actionHTML = '<button class="friend-add-btn declined" disabled>Declined</button>';
      } else {
        actionHTML = '<button class="friend-add-btn" data-idx="' + idx + '">Add</button>';
      }
      return '<div class="friend-item" id="friend-item-' + idx + '" data-name="' + s.name.toLowerCase() + '">' +
        '<div class="friend-avatar" style="background:' + s.color + ';">' + s.initials + '</div>' +
        '<div class="friend-info">' +
          '<div class="friend-name">' + s.name + '</div>' +
          '<div class="friend-tag">' + s.tag + (s.mutual > 0 ? ' · ' + s.mutual + ' mutual' : '') + '</div>' +
        '</div>' +
        actionHTML +
      '</div>';
    }).join('');
  }

  var friendModalHTML =
    '<div class="friend-modal-overlay" id="friend-modal" style="display:none;">' +
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
        '<div class="friend-list-label" id="friend-list-label">Suggested · bitBuddy Students</div>' +
        '<div class="friend-list" id="friend-list">' + buildStudentRows() + '</div>' +
      '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', friendModalHTML);

  /* ---- Notifications Dropdown ---- */
  var notifications = [
    { icon: '❤️', color: '#e05252', text: '<strong>Amira K.</strong> liked your post — "Newton\'s 3rd Law"', time: '2m ago', unread: true },
    { icon: '💬', color: '#5b7fa8', text: '<strong>Liam S.</strong> replied to your post — "Nice tip!"', time: '15m ago', unread: true },
    { icon: '🔥', color: '#f59e0b', text: 'Your post reached <strong>1,000 upvotes!</strong> 🎉', time: '1h ago', unread: true },
    { icon: '👤', color: '#609F8A', text: '<strong>Priya O.</strong> sent you a friend request', time: '2h ago', unread: false },
    { icon: '⬆️', color: '#609F8A', text: '<strong>Tyler M.</strong> upvoted your Maths note', time: '3h ago', unread: false },
    { icon: '💬', color: '#7b6aa8', text: '<strong>Sofia R.</strong> mentioned you in Study Chat', time: 'Yesterday', unread: false },
  ];

  var notifRows = notifications.map(function(n, i) {
    return '<div class="notif-item' + (n.unread ? ' unread' : '') + '" id="notif-' + i + '">' +
      '<div class="notif-icon-wrap" style="background:' + n.color + '22;border-color:' + n.color + '33;">' +
        '<span style="font-size:16px;">' + n.icon + '</span>' +
      '</div>' +
      '<div class="notif-text">' +
        '<div class="notif-msg">' + n.text + '</div>' +
        '<div class="notif-time">' + n.time + '</div>' +
      '</div>' +
      (n.unread ? '<div class="notif-dot"></div>' : '') +
    '</div>';
  }).join('');

  var notifDropdownHTML =
    '<div class="notif-dropdown" id="notif-dropdown" style="display:none;">' +
      '<div class="notif-dropdown-header">' +
        '<span class="notif-dropdown-title">Notifications</span>' +
        '<button class="notif-mark-all" id="notif-mark-all">Mark all read</button>' +
      '</div>' +
      '<div class="notif-list">' + notifRows + '</div>' +
    '</div>';

  document.body.insertAdjacentHTML('beforeend', notifDropdownHTML);

  /* ---- Wire up friend modal ---- */
  document.getElementById('btn-add-friend')?.addEventListener('click', function() {
    document.getElementById('friend-modal').style.display = 'flex';
    document.getElementById('notif-dropdown').style.display = 'none';
    document.getElementById('friend-search-input').focus();
  });
  document.getElementById('friend-modal-close')?.addEventListener('click', closeFriendModal);
  document.getElementById('friend-modal')?.addEventListener('click', function(e) {
    if (e.target === document.getElementById('friend-modal')) closeFriendModal();
  });

  document.getElementById('friend-search-input')?.addEventListener('input', function(e) {
    var q = e.target.value.toLowerCase();
    document.querySelectorAll('.friend-item').forEach(function(item) {
      item.style.display = item.dataset.name.includes(q) ? '' : 'none';
    });
    document.getElementById('friend-list-label').textContent =
      q ? 'Results for "' + e.target.value + '"' : 'Suggested · bitBuddy Students';
  });

  // Add / Accept / Decline buttons
  document.getElementById('friend-list')?.addEventListener('click', function(e) {
    var addBtn     = e.target.closest('.friend-add-btn');
    var acceptBtn  = e.target.closest('.friend-accept-btn');
    var declineBtn = e.target.closest('.friend-decline-btn');

    if (addBtn && !addBtn.disabled) {
      var idx = parseInt(addBtn.dataset.idx);
      mockStudents[idx].state = 'sent';
      document.getElementById('friend-item-' + idx).outerHTML =
        buildStudentRows().split('id="friend-item-' + idx + '"')[0].split('<div class="friend-item"').pop();
      document.getElementById('friend-list').innerHTML = buildStudentRows();
    }
    if (acceptBtn) {
      var idx = parseInt(acceptBtn.dataset.idx);
      mockStudents[idx].state = 'friends';
      document.getElementById('friend-list').innerHTML = buildStudentRows();
    }
    if (declineBtn) {
      var idx = parseInt(declineBtn.dataset.idx);
      mockStudents[idx].state = 'declined';
      document.getElementById('friend-list').innerHTML = buildStudentRows();
    }
  });

  /* ---- Wire up notifications ---- */
  document.getElementById('btn-notifs')?.addEventListener('click', function(e) {
    e.stopPropagation();
    var dd = document.getElementById('notif-dropdown');
    var fm = document.getElementById('friend-modal');
    fm.style.display = 'none';
    dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('notif-mark-all')?.addEventListener('click', function() {
    document.querySelectorAll('.notif-item.unread').forEach(function(el) {
      el.classList.remove('unread');
      var dot = el.querySelector('.notif-dot');
      if (dot) dot.remove();
    });
    // remove badge
    var badge = document.querySelector('.notif-badge');
    if (badge) badge.classList.remove('notif-badge');
  });

  document.addEventListener('click', function(e) {
    var dd = document.getElementById('notif-dropdown');
    if (dd && !dd.contains(e.target) && e.target.id !== 'btn-notifs') {
      dd.style.display = 'none';
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeFriendModal();
      var dd = document.getElementById('notif-dropdown');
      if (dd) dd.style.display = 'none';
    }
  });

  function closeFriendModal() {
    var modal = document.getElementById('friend-modal');
    if (modal) modal.style.display = 'none';
  }

  /* ---- Dark Mode ---- */
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('bb-theme', dark ? 'dark' : 'light');
    var moon = document.getElementById('theme-icon-moon');
    var sun  = document.getElementById('theme-icon-sun');
    if (moon) moon.style.display = dark ? 'none' : '';
    if (sun)  sun.style.display  = dark ? '' : 'none';
  }

  // Apply saved theme on load
  var savedTheme = localStorage.getItem('bb-theme') || 'light';
  applyTheme(savedTheme === 'dark');

  document.getElementById('btn-theme-toggle')?.addEventListener('click', function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
  });
}