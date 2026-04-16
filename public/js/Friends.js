document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Friend Activity', activeNav: 'friends' });

  document.querySelectorAll('.friend-row').forEach(row => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.friend-row').forEach(r => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  document.getElementById('friend-filter')?.addEventListener('input', function() {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.friend-row').forEach(row => {
      row.style.display = row.dataset.name.includes(q) ? '' : 'none';
    });
  });
});