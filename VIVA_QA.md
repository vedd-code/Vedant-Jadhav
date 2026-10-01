# 📚 StudyBot — Complete Viva Questions & Answers

A full study guide for your project viva/exam. Read the answers, then practice saying them in your own words. Questions are grouped by topic, from basic to slightly advanced.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & Flow](#2-architecture--flow)
3. [Frontend (React + Vite + Tailwind)](#3-frontend-react--vite--tailwind)
4. [Backend (Node.js + Express)](#4-backend-nodejs--express)
5. [Database (PostgreSQL)](#5-database-postgresql)
6. [Authentication & Security (JWT + bcrypt)](#6-authentication--security-jwt--bcrypt)
7. [AI Integration (OpenRouter)](#7-ai-integration-openrouter)
8. [API Endpoints](#8-api-endpoints)
9. [Quiz Mode](#9-quiz-mode)
10. [Code Walkthrough Questions](#10-code-walkthrough-questions)
11. [Setup, Running & Environment](#11-setup-running--environment)
12. [Tricky / Follow-up Questions](#12-tricky--follow-up-questions)
13. [Possible Improvements](#13-possible-improvements)
14. [One-Line Rapid Fire](#14-one-line-rapid-fire)

---

## 1. Project Overview

**Q: What is StudyBot?**
StudyBot is a full-stack web application — an AI-powered chatbot built exclusively for students. Users register and log in, choose an academic subject, and chat with an AI tutor that answers only within that subject. All chats are saved, and there is a quiz mode that generates multiple-choice questions.

**Q: What problem does it solve?**
Students often need quick, focused help on specific subjects. A general chatbot can drift off-topic. StudyBot uses subject-specific tutors (via system prompts) so answers stay relevant, and it saves history so students can revisit past learning.

**Q: What are the main features?**
- Register / Login with secure authentication
- Six subjects, each with its own AI tutor personality
- Real-time AI chat that remembers recent context
- Quiz mode that generates MCQs
- Saved chat history with the ability to delete sessions
- Protected routes so only logged-in users can access chats

**Q: Who is the target user?**
College/school students who want subject-specific study help.

**Q: What is the tech stack?**
- **Frontend:** React (with Vite) + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **AI:** OpenRouter API
- **Authentication:** JWT (JSON Web Tokens) + bcrypt for password hashing

---

## 2. Architecture & Flow

**Q: Describe the overall architecture.**
It follows a 3-tier architecture:
1. **Presentation tier** — the React frontend (what the user sees).
2. **Application/logic tier** — the Express backend (handles requests, business logic, auth).
3. **Data tier** — PostgreSQL (stores users, sessions, messages).
The backend also calls an external AI service (OpenRouter).

**Q: Explain the request flow when a user sends a chat message.**
1. User types a message in the React chat page and clicks Send.
2. React sends an HTTP POST to the backend with the message and the JWT token.
3. The backend's auth middleware verifies the token.
4. The backend saves the user's message to PostgreSQL.
5. It fetches the last 10 messages for context and builds a request with the subject's system prompt.
6. It calls the OpenRouter API and gets the AI's reply.
7. It saves the AI reply to PostgreSQL.
8. It returns the reply to React, which displays it.

**Q: Why separate frontend and backend?**
Separation of concerns. The frontend handles UI; the backend handles logic, security, and data. This makes the app easier to maintain, test, and scale, and keeps secrets (like the API key) off the client.

**Q: How do the frontend and backend communicate?**
Through REST APIs over HTTP, exchanging data in JSON format. The frontend uses the axios library to make these requests.

**Q: What ports run the app?**
Frontend on 5173 (Vite default) and backend on 5000.

---

## 3. Frontend (React + Vite + Tailwind)

**Q: What is React?**
React is a JavaScript library for building user interfaces using reusable components. It uses a virtual DOM to update only the parts of the page that change, making it fast.

**Q: What is a component?**
A reusable, self-contained piece of UI. For example, `Navbar`, `MessageBubble`, and `ChatHistory` are components. Our pages (Login, Register, Dashboard, Chat) are also components.

**Q: What is JSX?**
JSX is a syntax that lets you write HTML-like code inside JavaScript. React converts it into JavaScript function calls that create the UI.

**Q: What are props?**
Props (properties) are data passed from a parent component to a child component. For example, `MessageBubble` receives `role` and `content` as props.

**Q: What is state? Which hook manages it?**
State is data that a component keeps track of and that can change over time (like the text in an input box). We use the `useState` hook. When state changes, React re-renders the component.

**Q: What is useEffect used for?**
`useEffect` runs side effects — code that runs after render, like fetching data. For example, we load chat messages from the backend when the Chat page opens using useEffect.

**Q: What is Vite?**
Vite is a modern frontend build tool and development server. It's faster than older tools like Create React App because it uses native ES modules during development.

**Q: What is Tailwind CSS?**
Tailwind is a utility-first CSS framework. Instead of writing custom CSS, you apply small pre-built classes (like `bg-purple-600`, `rounded-xl`) directly to elements.

**Q: What is React Router? Why use it?**
React Router handles client-side routing — navigating between pages (Login, Dashboard, Chat) without a full page reload. This makes navigation fast and app-like.

**Q: What is a PrivateRoute in this project?**
A wrapper component that checks if a JWT token exists in localStorage. If yes, it shows the requested page; if not, it redirects the user to the login page. This protects the dashboard and chat pages.

**Q: How does the app auto-scroll to the newest message?**
We keep a reference (`useRef`) to an empty div at the bottom of the chat and call `scrollIntoView` whenever messages change, inside a useEffect.

**Q: What is axios and how is it used here?**
Axios is a library for making HTTP requests. We created one axios instance with the backend base URL and an interceptor that automatically attaches the JWT token to every request.

**Q: What is an axios interceptor?**
A function that runs before a request is sent or after a response is received. Our request interceptor adds the auth token; our response interceptor logs the user out if the server returns 401 (unauthorized).

---

## 4. Backend (Node.js + Express)

**Q: What is Node.js?**
Node.js is a runtime that lets you run JavaScript outside the browser — on the server. It's event-driven and non-blocking, which makes it good for handling many requests.

**Q: What is Express?**
Express is a lightweight web framework for Node.js. It makes it easy to define routes, handle requests and responses, and use middleware.

**Q: What is a route?**
A route maps a URL path and HTTP method (GET, POST, etc.) to a handler function. For example, `POST /api/auth/login` runs the login handler.

**Q: What is middleware in Express?**
Middleware is a function that runs between receiving a request and sending a response. It can inspect or modify the request, end the request, or pass control to the next function using `next()`. Examples: `express.json()` (parses JSON bodies), `cors()`, and our `authMiddleware`.

**Q: What does express.json() do?**
It parses incoming JSON request bodies so we can access them via `req.body`.

**Q: What is CORS and why is it needed?**
CORS (Cross-Origin Resource Sharing) is a browser security feature. Since the frontend (port 5173) and backend (port 5000) are different origins, the browser blocks requests by default. The `cors()` middleware tells the browser it's allowed.

**Q: How is the code organized on the backend?**
- `index.js` — entry point, sets up Express and mounts routes
- `db.js` — database connection
- `routes/auth.js` — register and login
- `routes/chat.js` — sessions and messages
- `middleware/authMiddleware.js` — JWT verification

**Q: What is a REST API?**
REST is a style of designing APIs using standard HTTP methods (GET to read, POST to create, DELETE to remove) and resources identified by URLs. Data is usually exchanged as JSON.

**Q: How does the server read secret values like the API key?**
From environment variables in a `.env` file, loaded using the `dotenv` package. This keeps secrets out of the source code.

**Q: Why keep secrets in a .env file?**
So sensitive values (passwords, API keys) aren't hard-coded or committed to version control. The `.env` file is listed in `.gitignore`.

---

## 5. Database (PostgreSQL)

**Q: What database do you use and why?**
PostgreSQL, a relational database. The data has clear relationships (users have sessions, sessions have messages), and a relational DB enforces these with foreign keys and keeps data consistent.

**Q: What is a relational database?**
A database that stores data in tables (rows and columns) and lets you define relationships between tables using keys.

**Q: Explain your database schema.**
Three tables:
- `users` — id, name, email (unique), password (hashed), created_at
- `chat_sessions` — id, user_id (FK to users), subject, title, created_at
- `messages` — id, session_id (FK to chat_sessions), role ('user' or 'assistant'), content, created_at

**Q: Describe the ER relationships.**
- One **user** has many **chat sessions** (one-to-many).
- One **chat session** has many **messages** (one-to-many).
So: Users → Chat Sessions → Messages.

**Q: What is a primary key?**
A column that uniquely identifies each row in a table. Here, each table's `id` is the primary key.

**Q: What is a foreign key?**
A column that references the primary key of another table, creating a link between them. For example, `chat_sessions.user_id` references `users.id`.

**Q: What is SERIAL in PostgreSQL?**
SERIAL is an auto-incrementing integer. Each new row automatically gets the next number, so we don't set the id manually. (In MySQL the equivalent is AUTO_INCREMENT.)

**Q: What is ON DELETE CASCADE?**
When a parent row is deleted, its related child rows are automatically deleted too. So deleting a user deletes their sessions, and deleting a session deletes its messages — no orphaned data.

**Q: How do you store the message role?**
As a text column with a CHECK constraint allowing only 'user' or 'assistant'. (The original MySQL design used an ENUM; PostgreSQL uses a CHECK constraint here.)

**Q: What is a connection pool?**
Instead of opening a new database connection for every request (slow), a pool keeps a set of reusable connections open. Requests borrow one and return it. We use the `pg` library's Pool.

**Q: What is SQL injection and how do you prevent it?**
SQL injection is when an attacker sneaks malicious SQL through user input. We prevent it by using **parameterized queries** — placeholders (`$1`, `$2`) with values passed separately, so input is never treated as SQL code.

**Q: Why did you switch from MySQL to PostgreSQL?**
The original design used MySQL, but the development machine had PostgreSQL installed. Both are relational SQL databases, so we adapted: `AUTO_INCREMENT` → `SERIAL`, ENUM → CHECK constraint, and query placeholders `?` → `$1, $2`. The app logic stayed the same.

---

## 6. Authentication & Security (JWT + bcrypt)

**Q: What is authentication vs authorization?**
- **Authentication** = verifying who you are (login).
- **Authorization** = verifying what you're allowed to do (accessing your own sessions).

**Q: What is JWT?**
JSON Web Token — a compact, signed token that stores user info (like the user id). After login, the server creates it; the client sends it back on each request to prove identity. It's stateless: the server doesn't store sessions.

**Q: What are the three parts of a JWT?**
Header (algorithm/type), Payload (data/claims like user id and expiry), and Signature (verifies the token wasn't tampered with). They're separated by dots.

**Q: How is the JWT created and verified in this project?**
On login we call `jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })`. On protected routes, `authMiddleware` calls `jwt.verify(token, JWT_SECRET)` to check the signature and extract the user id.

**Q: Where is the token sent from the client?**
In the `Authorization` header as `Bearer <token>`.

**Q: What is the JWT_SECRET?**
A secret key stored on the server used to sign and verify tokens. Only the server knows it, so tokens can't be forged.

**Q: Why not store the password directly?**
If the database leaks, plain passwords would be exposed. So we hash them — a one-way transformation that can't be reversed.

**Q: What is bcrypt?**
A password-hashing algorithm. It's slow by design (to resist brute force) and adds a random salt so identical passwords produce different hashes.

**Q: What is a salt?**
Random data added to a password before hashing, so two users with the same password get different hashes, and precomputed attacks (rainbow tables) don't work.

**Q: How do you check a password at login?**
We use `bcrypt.compare(enteredPassword, storedHash)`, which hashes the entered password and checks if it matches the stored hash.

**Q: What is a protected route and how is it protected?**
A route that requires a valid token. `authMiddleware` runs first: if the token is missing or invalid, it returns 401; otherwise it attaches the user id to the request and lets it continue.

**Q: How does a user get logged out?**
The frontend clears the token and user info from localStorage and redirects to the login page. Also, if any request returns 401, the axios interceptor logs the user out automatically.

**Q: Is storing the token in localStorage secure?**
It works but isn't the most secure — it can be read by JavaScript, so it's vulnerable to XSS attacks. A more secure option is an httpOnly cookie. For a local student project, localStorage is acceptable.

---

## 7. AI Integration (OpenRouter)

**Q: What is OpenRouter?**
OpenRouter is a unified API that provides access to many AI models from different providers through a single endpoint and API key. You pick a model, send messages, and get a reply.

**Q: Which model does StudyBot use?**
It's configurable via the `OPENROUTER_MODEL` environment variable. We use a free-tier model (`openai/gpt-oss-20b:free`). The original plan used Mistral 7B, but that model was no longer available, so we switched to a currently available free model.

**Q: What is a system prompt?**
An instruction given to the AI before the conversation that defines its behavior. Each subject has one, e.g., "You are a Python tutor. Only answer Python questions."

**Q: How does the AI stay on one subject?**
The system prompt for the chosen subject is sent with every request, telling the AI to only answer questions in that area.

**Q: How does the AI remember previous messages?**
The AI itself is stateless. We send the last 10 messages of the session along with each new question, so the model has conversation context.

**Q: Why only the last 10 messages?**
To keep the request small and fast, and to avoid exceeding the model's context limit and cost. Recent messages usually carry enough context.

**Q: What roles are used in the AI request?**
- `system` — the tutor instruction
- `user` — the student's messages
- `assistant` — the AI's previous replies

**Q: How is the API key kept safe?**
It's stored in the backend `.env` file and only used server-side. The frontend never sees it, so it can't be stolen from the browser.

**Q: What happens if the AI call fails?**
The backend catches the error and returns a fallback message like "Sorry, I could not generate a response," and the frontend shows an error bubble instead of crashing.

---

## 8. API Endpoints

**Q: List the API endpoints.**

**Auth (`/api/auth`):**
| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/register` | Create a new account |
| POST | `/login` | Log in, returns JWT + user |

**Chat (`/api/chat`) — all require a valid JWT:**
| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/session` | Create a new chat session |
| GET | `/sessions` | List all sessions for the user |
| GET | `/session/:id/messages` | Get messages in a session |
| POST | `/session/:id/message` | Send a message, get AI reply |
| DELETE | `/session/:id` | Delete a session |

**Q: What HTTP status codes do you use?**
- 200 — success
- 400 — bad request (missing/invalid input)
- 401 — unauthorized (no/invalid token)
- 404 — not found (e.g., session doesn't exist)
- 500 — server error

**Q: What does the login endpoint return?**
A JWT token and a user object (id, name, email). The password is never returned.

**Q: How do you make sure a user can only see their own sessions?**
Every chat query filters by `user_id = req.userId`, where `req.userId` comes from the verified JWT. So users can't access others' data.

---

## 9. Quiz Mode

**Q: What is Quiz Mode?**
A toggle in the chat page. When ON, instead of a normal explanation, the AI generates multiple-choice questions on the topic the user enters.

**Q: How does Quiz Mode work technically?**
The frontend sends `isQuizMode: true` with the message. The backend then wraps the user's topic in a special prompt: "Generate 3 multiple choice questions with 4 options each and correct answers about this topic: ...". The AI responds with MCQs.

**Q: Does Quiz Mode change the subject tutor?**
No — the subject system prompt still applies. Quiz mode only changes how the user's message is phrased to the AI.

**Q: How does the UI show Quiz Mode is active?**
The input placeholder changes to "Enter a topic to get quizzed on..." and a "⚡ Quiz Mode Active" badge appears.

---

## 10. Code Walkthrough Questions

**Q: Walk me through what happens on registration.**
1. User submits name, email, password.
2. Backend checks all fields are present.
3. It checks if the email already exists.
4. It hashes the password with bcrypt.
5. It inserts the new user into the database.
6. It returns a success message; the frontend redirects to login.

**Q: Walk me through login.**
1. User submits email and password.
2. Backend finds the user by email.
3. It compares the password with the stored hash using bcrypt.
4. If valid, it signs a JWT and returns it with user info.
5. The frontend saves the token and redirects to the dashboard.

**Q: What is the purpose of authMiddleware, line by line?**
1. Read the token from the Authorization header (`Bearer <token>`).
2. If no token, return 401.
3. Verify the token with the secret.
4. If valid, attach the user id to `req.userId` and call `next()`.
5. If invalid, return 401.

**Q: How does creating a session and navigating to it work?**
On the dashboard, the user picks a subject; the frontend POSTs to `/session`, gets back a `sessionId`, and navigates to `/chat/:sessionId`. The chat page then loads that session's messages.

**Q: How are optimistic UI updates handled in chat?**
When the user sends a message, we immediately show it in the UI (with a temporary id) before the server responds, so the chat feels instant. Then we show a "thinking" indicator until the AI reply arrives.

---

## 11. Setup, Running & Environment

**Q: How do you run the project?**
1. Create the PostgreSQL database and run `schema.sql` to create tables.
2. Fill in the `server/.env` file (DB credentials, JWT secret, OpenRouter key).
3. In `server/`: `npm install` then `node index.js` (backend on port 5000).
4. In `client/`: `npm install` then `npm run dev` (frontend on port 5173).
5. Open http://localhost:5173.

**Q: What are the environment variables?**
`PORT`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`.

**Q: What is package.json?**
A file that lists project metadata, dependencies, and scripts (like `npm run dev`). Running `npm install` installs everything listed.

**Q: What is node_modules?**
The folder where all installed dependencies live. It's not committed to Git (it's in `.gitignore`) because it can be recreated with `npm install`.

**Q: What is npm?**
Node Package Manager — the tool used to install and manage JavaScript libraries/dependencies.

---

## 12. Tricky / Follow-up Questions

**Q: Is your app secure for production?**
It's built for a local demo. For production I'd add: input validation, rate limiting, HTTPS, httpOnly cookies for tokens, refresh tokens, and stricter error handling.

**Q: What happens if two users register with the same email?**
The email column is UNIQUE, and the backend also checks for an existing email first, returning "Email already registered."

**Q: What if the JWT expires?**
The token has a 7-day expiry. After that, `jwt.verify` fails, the server returns 401, and the frontend logs the user out and redirects to login.

**Q: Why is the AI stateless but the chat still remembers?**
Because we resend recent history with each request. The "memory" lives in our database and is fed to the model each time, not inside the model.

**Q: What is the difference between GET and POST?**
GET retrieves data and shouldn't change anything. POST sends data to create or change something on the server.

**Q: Why use a pool instead of a single connection?**
A single connection would be a bottleneck and could break under concurrent requests. A pool reuses multiple connections efficiently.

**Q: What is the virtual DOM?**
An in-memory representation of the UI. React compares it to the previous version and updates only the parts of the real DOM that changed, which is efficient.

**Q: Can the AI answer anything?**
It's guided by the subject system prompt to stay on-topic, but AI can still make mistakes, so answers should be verified — it's a study aid, not a source of truth.

**Q: How would you add a new subject?**
Add it to the `SUBJECTS` list on the frontend (constants file) and add a matching system prompt in the backend's `SUBJECTS` object in `chat.js`.

---

## 13. Possible Improvements

- Input validation on both frontend and backend (e.g., email format, password strength).
- Rate limiting to prevent abuse of the AI endpoint.
- Streaming AI responses (typing them out live) instead of waiting for the full reply.
- Store the token in an httpOnly cookie and add refresh tokens.
- Add search and rename for chat sessions.
- Export chat history as PDF.
- Add unit and integration tests.
- Deploy with HTTPS.

---

## 14. One-Line Rapid Fire

- **React** — JS library for building UIs from components.
- **Vite** — fast frontend build tool and dev server.
- **Tailwind** — utility-first CSS framework.
- **Node.js** — runs JavaScript on the server.
- **Express** — web framework for Node.js.
- **PostgreSQL** — relational SQL database.
- **JWT** — signed token for stateless authentication.
- **bcrypt** — algorithm to hash passwords securely.
- **OpenRouter** — unified API to access many AI models.
- **System prompt** — instruction defining the AI's role.
- **Middleware** — function running between request and response.
- **CORS** — lets the browser allow cross-origin requests.
- **REST API** — API using HTTP methods and JSON.
- **Foreign key** — links one table to another.
- **ON DELETE CASCADE** — deletes child rows when parent is deleted.
- **Connection pool** — reuses DB connections for efficiency.
- **Parameterized query** — prevents SQL injection.
- **Primary key** — unique identifier for a table row.
- **State** — data a component tracks and can change.
- **Props** — data passed from parent to child component.

---

*Tip: Don't memorize word-for-word. Understand each answer so you can explain it naturally and handle follow-up questions. Good luck! 🎓*
