import express from 'express';
import mongoose from 'mongoose';
import HighScore from '../models/HighScore.js';
import SudokuGame from '../models/SudokuGame.js';
import { requireAuth } from '../middleware/auth.js';
import { isBoardSolvedValid } from '../utils/sudokuGenerator.js';

const router = express.Router();

function findUserProgress(game, userId) {
  return game.progress.find((item) => String(item.user) === String(userId)) || null;
}

// GET /api/highscore
// Returns sorted high score list: most wins first, ties by username
router.get('/', async (req, res, next) => {
  try {
    const scores = await HighScore.find({ wins: { $gt: 0 } })
    .sort({ wins: -1, username: 1 })
    .select('username wins');

    return res.json({ scores });
  } catch (error) {
    next(error);
  }
});

// GET /api/highscore/:gameId
// Returns users who completed a specific game
router.get('/:gameId', async (req, res, next) => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid game id.' });
    }

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    const completions = game.progress
    .filter((progress) => progress.completed)
    .map((progress) => ({
      username: progress.username,
      elapsedSeconds: progress.elapsedSeconds,
      completedAt: progress.completedAt
    }))
    .sort((a, b) => a.elapsedSeconds - b.elapsedSeconds);

    return res.json({ completions });
  } catch (error) {
    next(error);
  }
});

// POST /api/highscore
// Marks a game as completed for the current user and increments their wins
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { gameId, board } = req.body;
    const elapsedSeconds = Number(req.body.elapsedSeconds || 0);

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid game id.' });
    }

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    const valid = isBoardSolvedValid(
        board,
        game.puzzle,
        game.size,
        game.boxRows,
        game.boxCols
    );

    if (!valid) {
      return res.status(400).json({
        message: 'The board is not a valid completed solution.'
      });
    }

    const existingProgress = findUserProgress(game, req.user._id);

    if (existingProgress?.completed) {
      return res.json({
        message: 'This user already completed this game.',
        alreadyCompleted: true
      });
    }

    if (existingProgress) {
      existingProgress.board = board;
      existingProgress.elapsedSeconds = elapsedSeconds;
      existingProgress.completed = true;
      existingProgress.completedAt = new Date();
    } else {
      game.progress.push({
        user: req.user._id,
        username: req.user.username,
        board,
        elapsedSeconds,
        completed: true,
        completedAt: new Date()
      });
    }

    await game.save();

    await HighScore.findOneAndUpdate(
        { username: req.user.username },
        {
          $set: {
            user: req.user._id,
            username: req.user.username
          },
          $inc: {
            wins: 1
          }
        },
        {
          upsert: true,
          new: true
        }
    );

    return res.status(201).json({
      message: 'High score updated successfully.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
