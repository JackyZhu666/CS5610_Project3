import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import sudokuRoutes from './routes/sudokuRoutes.js';
import highscoreRoutes from './routes/highscoreRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true
    })
);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/sudoku', sudokuRoutes);
app.use('/api/highscore', highscoreRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    message: error.message || 'Internal server error.'
  });
});

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});