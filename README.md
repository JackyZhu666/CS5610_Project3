# Project 3 — Full-Stack Sudoku App

A full-stack Sudoku web application built with **React**, **Express**, **MongoDB**, and **Mongoose**.

This project builds on the previous Sudoku projects by adding backend APIs, user authentication, persistent games, high scores, and MongoDB storage.

---

## Live Links

- Deployed App: `PASTE_YOUR_DEPLOYED_APP_LINK_HERE`
- GitHub Repo: https://github.com/JackyZhu666/CS5610_Project3.git

---

## Collaborators

- Jiayi Zhu

---

## Features

### Core Pages

- Home Page `/`
- Game Selection Page `/games`
- Game Page `/game/:gameId`
- Rules Page `/rules`
- High Scores Page `/scores`
- Login Page `/login`
- Register Page `/register`

### User Features

- Register a new user
- Log in with username and password
- Log out
- Cookie-based login session
- Passwords encrypted with `bcryptjs`
- Logged-out users can view pages but cannot play games or create games

### Sudoku Features

- Create Easy Sudoku games
- Create Normal Sudoku games
- View all available games
- Open and play existing games created by any user
- Each user has their own saved progress for each game
- Invalid Sudoku inputs are highlighted
- Timer tracks game progress
- Reset button restores the current puzzle to its starting board
- Completed games are saved
- High scores update after completed games

### Bonus Features Implemented

- Password encryption with `bcryptjs`
- Delete game button for the game creator
- Deleting a game also adjusts high scores when needed

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Cookie Parser
- bcryptjs
- dotenv
- CORS

---

## Project Structure

```text
jackie-zhu-project3/
├── package.json                         # Root helper scripts
├── .gitignore
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js                    # Express app entry point
│       ├── config/
│       │   └── db.js                    # MongoDB connection
│       ├── middleware/
│       │   └── auth.js                  # Auth middleware
│       ├── models/
│       │   ├── User.js                  # User collection
│       │   ├── SudokuGame.js            # Sudoku games collection
│       │   └── HighScore.js             # High score collection
│       ├── routes/
│       │   ├── userRoutes.js            # User APIs
│       │   ├── sudokuRoutes.js          # Sudoku APIs
│       │   └── highscoreRoutes.js       # High score APIs
│       └── utils/
│           ├── nameGenerator.js         # Random game names
│           └── sudokuGenerator.js       # Sudoku board generation and validation
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── public/
    │   └── logo.svg
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── apiClient.js             # Shared frontend API helper
        ├── context/
        │   └── AuthContext.jsx          # Login state and auth functions
        ├── utils/
        │   ├── dateUtils.js
        │   └── sudokuClient.js
        ├── components/
        │   ├── Layout.jsx
        │   ├── NavBar.jsx
        │   ├── PageHero.jsx
        │   ├── SudokuBoard.jsx
        │   ├── SudokuCell.jsx
        │   └── Timer.jsx
        └── pages/
            ├── HomePage.jsx
            ├── GamesPage.jsx
            ├── GamePage.jsx
            ├── RulesPage.jsx
            ├── ScoresPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            └── NotFoundPage.jsx
```

---

## How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/JackyZhu666/CS5610_Project3.git
cd jackie-zhu-project3
```

---

### 2. Install Dependencies

From the root folder:

```bash
npm install
npm run install-all
```

This installs dependencies for:

- root project
- backend server
- frontend client

---

### 3. Set Up Environment Variables

Create a `.env` file inside the `server/` folder.

You can copy the example file:

```bash
cd server
cp .env.example .env
```

Then edit `server/.env`.

Example:

```env
PORT=5050
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@YOUR_MONGO_HOST/sudoku-project3?authSource=admin&tls=true&retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For local development, the frontend runs on:

```text
http://localhost:5173
```

The backend runs on:

```text
http://localhost:5050
```

---

### 4. Start the Backend

From the `server/` folder:

```bash
npm run dev
```

Expected output:

```text
MongoDB connected
Server running on port 5050
```

Backend health check:

```text
http://localhost:5050/api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

Note: Visiting `http://localhost:5050/` may show `Cannot GET /`. That is normal because the backend root route is not used directly.

---

### 5. Start the Frontend

Open a second terminal.

From the `client/` folder:

```bash
npm run dev
```

Open the website:

```text
http://localhost:5173
```

---

## Root Commands

From the root project folder:

```bash
npm run install-all
```

Installs dependencies for both frontend and backend.

```bash
npm run dev
```

Runs frontend and backend at the same time.

```bash
npm run server
```

Runs only the backend.

```bash
npm run client
```

Runs only the frontend.

```bash
npm run build
```

Builds the frontend for production.

---

## API Endpoints

### User APIs

```text
GET    /api/user/isLoggedIn
POST   /api/user/register
POST   /api/user/login
POST   /api/user/logout
```

#### `GET /api/user/isLoggedIn`

Checks whether the user has a valid login cookie.

Returns:

```json
{
  "loggedIn": true,
  "user": {
    "id": "USER_ID",
    "username": "jackie"
  }
}
```

or:

```json
{
  "loggedIn": false
}
```

---

#### `POST /api/user/register`

Registers a new user and sets the login cookie.

Request body:

```json
{
  "username": "jackie",
  "password": "password123"
}
```

---

#### `POST /api/user/login`

Logs in an existing user and sets the login cookie.

Request body:

```json
{
  "username": "jackie",
  "password": "password123"
}
```

---

#### `POST /api/user/logout`

Logs out the current user and clears the cookie.

---

### Sudoku APIs

```text
GET     /api/sudoku
POST    /api/sudoku
GET     /api/sudoku/:gameId
PUT     /api/sudoku/:gameId
DELETE  /api/sudoku/:gameId
```

#### `GET /api/sudoku`

Returns the list of all available games.

Each game includes:

- game ID
- name
- difficulty
- creator username
- created date

---

#### `POST /api/sudoku`

Creates a new Sudoku game.

Requires login.

Request body:

```json
{
  "difficulty": "EASY"
}
```

or:

```json
{
  "difficulty": "NORMAL"
}
```

Returns:

```json
{
  "gameId": "GAME_ID",
  "name": "Random Game Name"
}
```

---

#### `GET /api/sudoku/:gameId`

Returns one Sudoku game.

If the user is logged in and has progress on the game, it returns that user’s saved board.

If the user has completed the game, the game is returned as completed.

---

#### `PUT /api/sudoku/:gameId`

Updates saved progress for the current user.

Requires login.

Request body:

```json
{
  "board": [[1, 2, null], [null, 3, 4]],
  "elapsedSeconds": 120
}
```

---

#### `DELETE /api/sudoku/:gameId`

Deletes a game.

Requires login.

Only the creator of the game can delete it.

---

### High Score APIs

```text
GET   /api/highscore
POST  /api/highscore
GET   /api/highscore/:gameId
```

#### `GET /api/highscore`

Returns users ordered by number of wins.

Users with 0 wins are not shown.

Sorting:

1. Most wins first
2. Username alphabetical order for ties

---

#### `POST /api/highscore`

Submits a completed game.

Requires login.

Request body:

```json
{
  "gameId": "GAME_ID",
  "board": [[1, 2, 3], [4, 5, 6]],
  "elapsedSeconds": 300
}
```

The backend validates that the board is a valid completed Sudoku board before updating high scores.

---

#### `GET /api/highscore/:gameId`

Returns completion records for a specific game.

---

## Database Collections

This app uses MongoDB and Mongoose.

Collections:

```text
users
sudokugames
highscores
```

### `users`

Stores registered users.

Fields include:

- username
- encrypted password hash
- timestamps

Passwords are not stored directly. They are encrypted using `bcryptjs`.

---

### `sudokugames`

Stores created Sudoku games.

Fields include:

- game name
- difficulty
- creator ID
- creator username
- puzzle board
- solution board
- per-user progress records
- timestamps

The game list is shared across users, but each user has their own progress for each game.

---

### `highscores`

Stores the number of completed games per user.

Fields include:

- user ID
- username
- wins

---

## Important Behavior Notes

### Shared Game List

All users can see all created games on the `/games` page.

For example:

```text
jackie creates a game
boob logs in
boob can see and open jackie's game
```

This is expected behavior.

The game list is public/shared.

---

### Private Game Progress

Even though the game list is shared, each user’s progress is private.

For example:

```text
jackie opens Game A and fills some cells
boob opens Game A
boob should not see jackie's filled answers
boob gets their own progress record
```

This means:

```text
Available Games = shared
Game progress = per user
High Scores = shared leaderboard
Delete button = creator only
```

---

### Logged-Out Users

Logged-out users can:

- view the home page
- view the rules page
- view the scores page
- view the games list
- open a game page

Logged-out users cannot:

- create games
- edit Sudoku cells
- save progress
- submit high scores
- delete games

---

## Pages Walkthrough

### Home Page `/`

The home page introduces the game and provides links to play or view the rules.

---

### Game Selection Page `/games`

The game selection page allows logged-in users to create:

- Easy games
- Normal games

It also displays all existing games.

Each listed game shows:

- game name
- difficulty
- creator username
- date created

---

### Game Page `/game/:gameId`

The game page allows users to play a Sudoku game.

Features include:

- Sudoku board
- timer
- invalid move highlighting
- reset button
- completed game state
- creator-only delete button

---

### Rules Page `/rules`

The rules page explains the basic Sudoku rules.

It also includes a credits section with contact links.

---

### High Scores Page `/scores`

The high scores page displays all users with at least one completed game.

The list is sorted by most wins.

---

### Login Page `/login`

The login page lets users sign in.

The submit button is disabled while fields are blank.

On successful login, the user is redirected to `/games`.

---

### Register Page `/register`

The register page lets users create a new account.

The submit button is disabled while fields are blank.

The app checks that:

- username is not already used
- password and verify password match

On successful registration, the user is redirected to `/games`.

---

## Deployment Notes

This project can be deployed on Render, Railway, DigitalOcean App Platform, or another hosting provider.

For deployment, make sure the backend environment variables are set:

```env
PORT=5050
MONGODB_URI=YOUR_PRODUCTION_MONGODB_URI
CLIENT_URL=YOUR_DEPLOYED_FRONTEND_URL
NODE_ENV=production
```

For a single full-stack Render deployment, the backend can serve the built React frontend from `client/dist`.

Production build command:

```bash
npm run build
```

Production start command:

```bash
npm start
```
---

## Author

Jiayi Zhu
