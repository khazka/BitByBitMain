/* =============================================
   BITBUDDY — Login Page JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const nextBtn   = document.getElementById('btn-next');
  const emailInput = document.getElementById('input-email');

  // "Next" — for now just redirect to space
  // TODO: wire up to real auth (Firebase, Supabase, etc.)
  nextBtn?.addEventListener('click', () => {
    const val = emailInput?.value.trim();
    if (!val) {
      emailInput?.focus();
      emailInput?.classList.add('shake');
      setTimeout(() => emailInput?.classList.remove('shake'), 400);
      return;
    }
    window.location.href = '/space';
  });

  // Allow pressing Enter in the input
  emailInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') nextBtn?.click();
  });

  // Social buttons — same redirect for prototype
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = '/space';
    });
  });

  // Sign up link
  document.getElementById('link-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/space';
  });
});
