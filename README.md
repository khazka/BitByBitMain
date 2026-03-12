# bitBuddy 🟢

> Student Study Platform — Study Together, Grow Together

## Project Structure

```
bitbuddy/
├── server.js                  ← Node.js Express server
├── package.json
├── public/
│   ├── pages/                 ← One HTML file per page
│   │   ├── login.html
│   │   ├── space.html         ← Study Space (feed)
│   │   ├── classroom.html     ← Classrooms
│   │   ├── notes.html         ← AI Notes
│   │   └── chat.html          ← Study Chat
│   ├── css/                   ← One CSS file per page + shared
│   │   ├── global.css         ← CSS variables, resets, shared components
│   │   ├── layout.css         ← Sidebar + topnav styles
│   │   ├── login.css
│   │   ├── space.css
│   │   ├── classroom.css
│   │   ├── notes.css
│   │   └── chat.css
│   └── js/                    ← One JS file per page + shared
│       ├── layout.js          ← Injects sidebar + topnav into every page
│       ├── login.js
│       ├── space.js
│       ├── classroom.js
│       ├── notes.js           ← Calls Anthropic AI API
│       └── chat.js            ← Calls Anthropic AI API (@bitBuddy)
```

## Setup & Run

### 1. Install dependencies
```bash
cd bitbuddy
npm install
```

### 2. Start the server
```bash
node server.js
```
Or with auto-reload on file changes:
```bash
npx nodemon server.js
```

### 3. Open in browser
```
http://localhost:3000
```

## Pages / Routes

| Route        | Page            |
|--------------|-----------------|
| `/`          | Login           |
| `/space`     | Study Space     |
| `/classroom` | Classrooms      |
| `/notes`     | AI Notes        |
| `/chat`      | Study Chat      |

## AI Features

The **AI Notes** panel and **Study Chat** (@bitBuddy) use the Anthropic Claude API.

The API key is injected automatically by the platform when deployed via Claude.ai.
For local development without a key, the AI features will show a connection error — 
everything else works fine without it.

## Theme Colours

| Name    | Hex       |
|---------|-----------|
| Primary | `#609F8A` |
| Light   | `#80B2A2` |
| Black   | `#000000` |
| White   | `#FFFDFD` |
| Gray    | `#D9D9D9` |

## Next Steps (TODO)

- [ ] Connect login to Firebase / Supabase auth
- [ ] Save notes to localStorage or backend database
- [ ] Real-time chat via Socket.io
- [ ] Post upvotes persisted to database
- [ ] User profile page
- [ ] Course detail pages
- [ ] Mobile responsive sidebar (hamburger menu)
