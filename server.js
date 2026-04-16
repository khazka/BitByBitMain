const express = require('express');
const path    = require('path');
const app     = express();
const PORT    = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/',          (req, res) => res.sendFile(path.join(__dirname, 'public/pages/index.html')));
app.get('/login',     (req, res) => res.sendFile(path.join(__dirname, 'public/pages/login.html')));
app.get('/space',     (req, res) => res.sendFile(path.join(__dirname, 'public/pages/space.html')));
app.get('/classroom', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/classroom.html')));
app.get('/notes',     (req, res) => res.sendFile(path.join(__dirname, 'public/pages/notes.html')));
app.get('/chat',      (req, res) => res.sendFile(path.join(__dirname, 'public/pages/chat.html')));
app.get('/profile',   (req, res) => res.sendFile(path.join(__dirname, 'public/pages/profile.html')));
app.get('/ai',        (req, res) => res.sendFile(path.join(__dirname, 'public/pages/ai.html')));
app.get('/premium',   (req, res) => res.sendFile(path.join(__dirname, 'public/pages/premium.html')));

app.listen(PORT, () => {
  console.log('');
  console.log('  ┌─────────────────────────────────────────┐');
  console.log('  │                                         │');
  console.log('  │   🟢  bitBuddy is running!              │');
  console.log('  │                                         │');
  console.log(`  │   ➜  http://localhost:${PORT}             │`);
  console.log('  │                                         │');
  console.log('  └─────────────────────────────────────────┘');
  console.log('');
});