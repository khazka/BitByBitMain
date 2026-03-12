/* =============================================
   BITBUDDY — Classrooms JS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Classrooms', activeNav: 'classroom' });

  initChannelSidebar();
  initFilters();
  initCourseCards();
});

/* ---- Inner sidebar channel switching ---- */
function initChannelSidebar() {
  document.querySelectorAll('.class-ch').forEach(ch => {
    ch.addEventListener('click', () => {
      document.querySelectorAll('.class-ch').forEach(c => c.classList.remove('active'));
      ch.classList.add('active');
      const subject = ch.dataset.subject || 'all';
      filterCourses(subject);
    });
  });
}

/* ---- Year/Subject dropdowns ---- */
function initFilters() {
  const yearSelect    = document.getElementById('filter-year');
  const subjectSelect = document.getElementById('filter-subject');
  const searchInput   = document.getElementById('course-search');

  yearSelect?.addEventListener('change', applyFilters);
  subjectSelect?.addEventListener('change', applyFilters);
  searchInput?.addEventListener('input', applyFilters);
}

function applyFilters() {
  const year    = document.getElementById('filter-year')?.value || '';
  const subject = document.getElementById('filter-subject')?.value || '';
  const search  = document.getElementById('course-search')?.value.toLowerCase() || '';

  document.querySelectorAll('.course-card').forEach(card => {
    const cardSubject = card.dataset.subject || '';
    const cardYear    = card.dataset.year    || '';
    const cardTitle   = card.querySelector('.course-title')?.textContent.toLowerCase() || '';

    const matchSubject = !subject || cardSubject === subject;
    const matchYear    = !year    || cardYear    === year;
    const matchSearch  = !search  || cardTitle.includes(search);

    card.style.display = (matchSubject && matchYear && matchSearch) ? '' : 'none';
  });
}

function filterCourses(subject) {
  document.querySelectorAll('.course-card').forEach(card => {
    if (subject === 'all' || card.dataset.subject === subject) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ---- Course cards ---- */
function initCourseCards() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card  = btn.closest('.course-card');
      const title = card?.querySelector('.course-title')?.textContent;
      // TODO: navigate to individual course page
      console.log('[bitBuddy] Opening course:', title);
    });
  });

  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.course-title')?.textContent;
      // TODO: navigate to course page
      console.log('[bitBuddy] Course card clicked:', title);
    });
  });
}
