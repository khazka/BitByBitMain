/* =============================================
   BITBUDDY — Shared Layout (Sidebar + Topnav)
   Injected into every app page dynamically
   ============================================= */

/**
 * Call initLayout({ title, activeNav }) at the top of each page's JS.
 *
 * @param {object} opts
 * @param {string} opts.title     - Page title shown in top nav
 * @param {string} opts.activeNav - Which nav item is active: 'space' | 'classroom' | 'notes' | 'chat'
 */
function initLayout({ title = 'bitBuddy', activeNav = '' } = {}) {
  // ---- Build sidebar HTML ----
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
      label: 'AI Notes',
      href: '/notes',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`
    },
    {
      id: 'chat',
      label: 'Study Chat',
      href: '/chat',
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`
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

      <div class="sidebar-section-label" style="margin-top:14px;">My Classrooms</div>
      <div class="sidebar-servers">
        <a href="/classroom" class="server-item">
          <div class="server-avatar" style="background:#609F8A">Ma</div>
          <div class="server-info">
            <div class="server-name">Year 10 Maths</div>
            <div class="server-count">142 students</div>
          </div>
        </a>
        <a href="/classroom" class="server-item">
          <div class="server-avatar" style="background:#5b7fa8">Sc</div>
          <div class="server-info">
            <div class="server-name">Science Club</div>
            <div class="server-count">98 students</div>
          </div>
        </a>
        <a href="/classroom" class="server-item">
          <div class="server-avatar" style="background:#a87c5b">En</div>
          <div class="server-info">
            <div class="server-name">English Lit</div>
            <div class="server-count">67 students</div>
          </div>
        </a>
      </div>

      <div class="sidebar-bottom">
        <a href="/profile" class="user-pill" style="text-decoration:none;">
          <div class="avatar" style="width:32px;height:32px;font-size:13px;" id="sidebar-avatar">JD</div>
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
        <button class="icon-btn" title="New Post" id="btn-new-post">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
        <button class="icon-btn notif-badge" title="Notifications" id="btn-notifs">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
        <div class="avatar" style="width:34px;height:34px;font-size:13px;cursor:pointer;" id="topnav-avatar" title="My Profile" onclick="window.location.href='/profile'">JD</div>
      </div>
    </nav>
  `;

  // ---- Inject into page ----
  const shell = document.getElementById('app-shell');
  if (!shell) {
    console.error('[bitBuddy] No #app-shell element found on this page.');
    return;
  }

  // Wrap existing page content
  const pageContent = shell.innerHTML;
  shell.innerHTML = sidebarHTML + `<div class="main-area">${topnavHTML}<div class="page-content">${pageContent}</div></div>`;

  // Set document title
  document.title = `${title} — bitBuddy`;
}