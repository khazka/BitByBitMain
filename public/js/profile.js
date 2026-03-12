/* =============================================
   BITBUDDY — Profile Page JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'My Profile', activeNav: 'profile' });

  initEditModal();
  initBioEdit();
  animateStats();
  animatePointsBar();
});

/* ---- Edit Profile Modal ---- */
function initEditModal() {
  const openBtn   = document.getElementById('btn-edit-profile');
  const modal     = document.getElementById('edit-modal');
  const closeBtn  = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('modal-cancel');
  const saveBtn   = document.getElementById('modal-save');

  openBtn?.addEventListener('click', () => modal?.classList.remove('hidden'));
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  // Close on backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  saveBtn?.addEventListener('click', saveProfile);
}

function closeModal() {
  document.getElementById('edit-modal')?.classList.add('hidden');
}

function saveProfile() {
  const name     = document.getElementById('edit-name')?.value.trim();
  const username = document.getElementById('edit-username')?.value.trim();
  const year     = document.getElementById('edit-year')?.value;
  const bio      = document.getElementById('edit-bio')?.value.trim();
  const school   = document.getElementById('edit-school')?.value.trim();

  // Update display
  if (name)     document.getElementById('display-name').textContent = name;
  if (username) document.getElementById('display-handle').textContent = `@${username} · ${year}`;
  if (bio)      document.getElementById('display-bio').textContent   = bio;

  // Update sidebar avatar initials
  if (name) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    document.getElementById('profile-avatar-display').textContent = initials;
    document.getElementById('sidebar-avatar')?.textContent && (document.getElementById('sidebar-avatar').textContent = initials);
    document.getElementById('topnav-avatar')?.textContent  && (document.getElementById('topnav-avatar').textContent  = initials);
  }

  // Update sidebar username
  if (name && document.getElementById('sidebar-username')) {
    document.getElementById('sidebar-username').textContent = name;
  }

  // TODO: persist to localStorage / backend
  console.log('[bitBuddy] Profile saved:', { name, username, year, bio, school });

  closeModal();

  // Brief save feedback
  const saveBtn = document.getElementById('btn-edit-profile');
  if (saveBtn) {
    const orig = saveBtn.innerHTML;
    saveBtn.textContent = '✓ Saved!';
    saveBtn.style.color = 'var(--primary)';
    setTimeout(() => { saveBtn.innerHTML = orig; saveBtn.style.color = ''; }, 1800);
  }
}

/* ---- Inline Bio Edit ---- */
function initBioEdit() {
  document.getElementById('btn-edit-bio')?.addEventListener('click', () => {
    document.getElementById('btn-edit-profile')?.click();
  });
}

/* ---- Animate stat numbers on load ---- */
function animateStats() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const raw    = el.textContent.replace(/,/g, '');
    const target = parseInt(raw);
    if (isNaN(target)) return;

    let current  = 0;
    const step   = Math.max(1, Math.floor(target / 40));
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

/* ---- Animate points bar ---- */
function animatePointsBar() {
  const fill = document.querySelector('.points-bar-fill');
  if (!fill) return;
  const target = fill.style.width;
  fill.style.width = '0%';
  setTimeout(() => { fill.style.width = target; }, 300);
}
