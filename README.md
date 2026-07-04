# 🧠 QuizBattle — MERN Multiplayer Quiz App

A full-stack real-time multiplayer quiz application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO.

---



| Page | Description |
|------|-------------|
| `/` | Home / landing page |
| `/register` | User registration |
| `/login` | User login |
| `/dashboard` | User stats + recent matches |
| `/rooms/create` | Create a multiplayer room |
| `/rooms/join` | Join via room code |
| `/rooms/:code/lobby` | Waiting room + quiz selection |
| `/rooms/:code/quiz` | Live quiz screen |
| `/matches/:id/results` | Post-game results |
| `/leaderboard` | Global rankings |
| `/admin` | Admin quiz management |

---

## ✨ Features

- **Authentication** — Register, Login, JWT-based, bcrypt password hashing
- **Multiplayer Rooms** — Auto-generated 6-char codes, max 8 players, min 2 to start
- **Real-time Quiz** — Socket.IO powers live question delivery and answer collection
- **Score System** — Speed-based scoring (faster = more points)
- **Leaderboard** — Global rankings by wins and win percentage
- **Dashboard** — Personal stats (games played, wins, win rate, recent matches)
- **Admin Panel** — Create, edit, delete quizzes
- **5 Categories** — Programming, General Knowledge, Movies, Sports, Science
- **3 Difficulty Levels** — Easy, Medium, Hard
- **Dark Theme** — Fully responsive Tailwind CSS UI

---

## 🗂️ Folder Structure

```
quiz-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, admin login
│   │   ├── quizController.js  # CRUD for quizzes
│   │   ├── roomController.js  # Create/get rooms
│   │   ├── matchController.js # Match history, leaderboard
│   │   └── userController.js  # Profile, dashboard
│   ├── middleware/
│   │   ├── auth.js            # JWT protect + adminOnly
│   │   └── errorHandler.js    # Global error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Quiz.js            # Quiz + Question schemas
│   │   ├── Room.js            # Room + Player schemas
│   │   └── Match.js           # Match result schema
│   ├── routes/
│   │   ├── auth.js
│   │   ├── quizzes.js
│   │   ├── rooms.js
│   │   ├── matches.js
│   │   └── users.js
│   ├── socket/
│   │   └── index.js           # All Socket.IO event handlers
│   ├── utils/
│   │   ├── helpers.js         # generateRoomCode, calculateScore
│   │   └── seed.js            # Database seeder (5 quizzes × 10 questions)
│   ├── server.js              # Express + Socket.IO entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── AdminRoute.jsx
    │   │   │   ├── LoadingScreen.jsx
    │   │   │   └── PlayerCard.jsx
    │   │   ├── game/
    │   │   │   ├── ScoreBoard.jsx
    │   │   │   └── TimerBar.jsx
    │   │   └── admin/
    │   │       └── QuizCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx  # User auth state
    │   │   └── SocketContext.jsx # Socket.IO connection
    │   ├── hooks/
    │   │   ├── useCountdown.js
    │   │   └── useLocalStorage.js
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateRoom.jsx
    │   │   ├── JoinRoom.jsx
    │   │   ├── Lobby.jsx
    │   │   ├── QuizScreen.jsx
    │   │   ├── Results.jsx
    │   │   ├── Leaderboard.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── QuizForm.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   └── api.js          # Axios instance + all API calls
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.jsx             # Route definitions
    │   ├── main.jsx            # React entry point
    │   └── index.css           # Tailwind + custom styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── package.json
```

---

## 🛠️ Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Notifications | React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Real-time Server | Socket.IO |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Morgan |

---

## 🔌 API Routes

### Auth — `/api/auth`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| POST | `/admin-login` | Public | Admin login |
| GET | `/me` | Private | Get current user |

### Quizzes — `/api/quizzes`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/` | Private | Get all quizzes |
| GET | `/:id` | Admin | Get quiz with questions |
| POST | `/` | Admin | Create quiz |
| PUT | `/:id` | Admin | Update quiz |
| DELETE | `/:id` | Admin | Delete quiz |

### Rooms — `/api/rooms`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/` | Private | Create room |
| GET | `/:code` | Private | Get room by code |
| GET | `/all` | Admin | List all active rooms |

### Matches — `/api/matches`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/leaderboard` | Public | Global leaderboard |
| GET | `/my` | Private | My match history |
| GET | `/:id` | Private | Single match detail |

### Users — `/api/users`
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/dashboard` | Private | Stats + recent matches |
| PUT | `/profile` | Private | Update username/avatar |
| GET | `/:id` | Private | Get user profile |

---

## ⚡ Socket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-room` | `{ roomCode }` | Join a room |
| `leave-room` | `{ roomCode }` | Leave a room |
| `select-quiz` | `{ roomCode, quizId }` | Host selects quiz |
| `start-game` | `{ roomCode }` | Host starts game |
| `submit-answer` | `{ roomCode, answerIndex }` | Player submits answer |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `player-joined` | `{ players, message }` | Someone joined |
| `player-left` | `{ players, message }` | Someone left |
| `quiz-selected` | `{ quiz }` | Host picked a quiz |
| `game-started` | `{ message }` | Game is beginning |
| `question` | `{ questionIndex, question, options, timeLimit, points }` | New question |
| `score-update` | `{ correctAnswer, leaderboard, playerAnswers }` | After each question |
| `game-over` | `{ winner, leaderboard, matchId }` | Game ended |

---

## 🗃️ Database Collections

### Users
```js
{ username, email, password (hashed), avatar, isAdmin, gamesPlayed, gamesWon, createdAt }
```

### Quizzes
```js
{ title, category, difficulty, timePerQuestion, questions: [{ question, options[4], correctAnswer, points }], createdBy }
```

### Rooms
```js
{ code, host, quiz, players: [{ userId, username, socketId, score, correctAnswers, isHost, isConnected }], status, currentQuestion, maxPlayers }
```

### Matches
```js
{ roomCode, quiz, quizTitle, players: [{ userId, username, score, correctAnswers, rank, isWinner, averageResponseTime }], winner, completedAt }
```

---

## 🔮 Future Improvements

- Password reset via email
- Profile picture uploads
- In-game chat
- Public/private room toggle
- Custom question time per question
- Quiz rating system
- Mobile app (React Native)
- Spectator mode

---

## 📄 License

MIT License — free to use for learning and personal projects.
