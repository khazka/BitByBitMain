const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Routes — serve each page's HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/login.html')));
app.get('/space', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/space.html')));
app.get('/classroom', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/classroom.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/notes.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'public/pages/chat.html')));

app.listen(PORT, () => {
  console.log(`\n🟢 bitBuddy running at http://localhost:${PORT}\n`);
});
