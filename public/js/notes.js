/* =============================================
   BITBUDDY — Notes JS
   ============================================= */

let currentNoteTitle   = '';
let currentNoteContent = '';

document.addEventListener('DOMContentLoaded', () => {
  initLayout({ title: 'Notes', activeNav: 'notes' });

  initNotesList();
  initEditor();
});

/* ---- Notes list sidebar ---- */
function initNotesList() {
  document.querySelectorAll('.note-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.note-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
    });
  });

  document.getElementById('btn-new-note')?.addEventListener('click', () => {
    const title   = document.getElementById('note-title');
    const content = document.getElementById('note-content');
    if (title)   title.value   = '';
    if (content) content.value = '';
    title?.focus();
  });
}

/* ---- Editor toolbar ---- */
function initEditor() {
  const title   = document.getElementById('note-title');
  const content = document.getElementById('note-content');

  title?.addEventListener('input', () => { currentNoteTitle   = title.value; });
  content?.addEventListener('input', () => { currentNoteContent = content.value; });

  document.querySelectorAll('.tool-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      handleToolbarAction(btn.dataset.action, content);
    });
  });

  document.getElementById('btn-save')?.addEventListener('click', () => {
    const btn = document.getElementById('btn-save');
    console.log('[bitBuddy] Saving note:', title?.value || 'Untitled');
    if (btn) {
      btn.textContent = 'Saved ✓';
      setTimeout(() => { btn.textContent = 'Save'; }, 1500);
    }
  });
}

function handleToolbarAction(action, textarea) {
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const sel   = textarea.value.substring(start, end);

  const wrappers = {
    bold:    ['**', '**'],
    italic:  ['_', '_'],
    h1:      ['# ', ''],
    h2:      ['## ', ''],
    code:    ['`', '`'],
    formula: ['$$', '$$']
  };

  if (wrappers[action]) {
    const [before, after] = wrappers[action];
    textarea.value = textarea.value.substring(0, start) + before + (sel || 'text') + after + textarea.value.substring(end);
    textarea.focus();
  } else if (action === 'list') {
    const lines = (sel || 'Item').split('\n').map(l => `• ${l}`).join('\n');
    textarea.value = textarea.value.substring(0, start) + lines + textarea.value.substring(end);
    textarea.focus();
  }
}