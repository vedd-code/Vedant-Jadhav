# 📚 StudyBot

An AI-powered chatbot built exclusively for students to learn and explore academic topics in depth. StudyBot features user authentication, subject-specific AI tutors, saved chat history, and a quiz mode.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **AI:** OpenRouter API (`mistralai/mistral-7b-instruct` — free tier)
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing

## Features

| Feature | Details |
| --- | --- |
| Register / Login | JWT auth, bcrypt password hashing |
| Subject Selection | 6 subjects, each with a custom AI system prompt |
| AI Chat | OpenRouter (Mistral 7B), context-aware (last 10 messages) |
| Quiz Mode | Toggle button changes the prompt to generate MCQs |
| Chat History | All sessions saved in DB, listed in a sidebar |
| Delete Session | Remove old sessions |
| Protected Routes | All chat/dashboard routes require a valid JWT |

## Folder Structure

```
studybot/
├── client/          → React frontend (Vite + Tailwind)
│   └── src/
│       ├── pages/       (Login, Register, Dashboard, Chat)
│       ├── components/  (Navbar, SubjectSelector, ChatWindow, MessageBubble, ChatHistory)
│       ├── api.js
│       ├── constants.js
│       ├── App.jsx
│       └── main.jsx
├── server/          → Express backend
│   ├── routes/          (auth.js, chat.js)
│   ├── middleware/      (authMiddleware.js)
│   ├── db.js
│   ├── schema.sql
│   └── index.js
└── README.md
```

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/vedd-code/Vedant-Jadhav.git studybot
cd studybot
```

### 2. Create the PostgreSQL database

```bash
# Create the database (enter your postgres password when prompted)
psql -U postgres -c "CREATE DATABASE studybot_db;"

# Create the tables
psql -U postgres -d studybot_db -f server/schema.sql
```

### 3. Configure environment variables

```bash
cd server
copy .env.example .env   # Windows
# cp .env.example .env    # macOS/Linux
```

Fill in the values in `server/.env`:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=studybot_db
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

Get a free API key at [openrouter.ai](https://openrouter.ai/keys).

### 4. Start the backend

```bash
cd server
npm install
node index.js
```

Server runs on `http://localhost:5000`.

### 5. Start the frontend

```bash
cd client
npm install
npm run dev
```

### 6. Open the app

Visit **http://localhost:5173** in your browser.

## API Reference

### Auth
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`

### Chat (all require `Authorization: Bearer <token>`)
- `POST /api/chat/session` — `{ subject, title? }` → `{ sessionId }`
- `GET /api/chat/sessions` — list all sessions for the user
- `GET /api/chat/session/:sessionId/messages` — messages in a session
- `POST /api/chat/session/:sessionId/message` — `{ message, isQuizMode }` → `{ reply }`
- `DELETE /api/chat/session/:sessionId` — delete a session

## Viva Notes

- **OpenRouter** — a unified API providing access to multiple AI models. We use Mistral 7B (free tier).
- **JWT** — JSON Web Token, a stateless way to verify logged-in users without server sessions.
- **Why PostgreSQL** — a relational DB, ideal for users, sessions, and messages with foreign-key relationships.
- **System prompt** — an instruction given to the AI before the conversation, telling it to behave as a specific subject tutor.
- **ER relationships** — Users → Chat Sessions → Messages (one-to-many).
- **Quiz mode** — when toggled, the user's message is wrapped in a prompt asking the AI to generate MCQs on the topic instead of just explaining it.
