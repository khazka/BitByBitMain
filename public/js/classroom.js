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
  const bitesizeUrls = {
    'Introduction to Physics':  'https://www.bbc.co.uk/bitesize/subjects/zng4d2p',
    'English Literature':       'https://www.bbc.co.uk/bitesize/subjects/zr9d7ty',
    'GCSE Mathematics':         'https://www.bbc.co.uk/bitesize/subjects/z38pycw',
    'Biology':                  'https://www.bbc.co.uk/bitesize/subjects/z9ddmp3',
    'Chemistry':                'https://www.bbc.co.uk/bitesize/subjects/z4dqp39',
    'Geography':                'https://www.bbc.co.uk/bitesize/subjects/zkw76sg',
    'Computer Science':         'https://www.bbc.co.uk/bitesize/subjects/zvxsk2p',
  };

  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card  = btn.closest('.course-card');
      const title = card?.querySelector('.course-title')?.textContent.trim();
      const url   = bitesizeUrls[title] || 'https://www.bbc.co.uk/bitesize/levels/z98jmp3';
      window.open(url, '_blank');
    });
  });

  document.querySelectorAll('.course-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const title = card.querySelector('.course-title')?.textContent.trim();
      const url   = bitesizeUrls[title] || 'https://www.bbc.co.uk/bitesize/levels/z98jmp3';
      window.open(url, '_blank');
    });
  });
}