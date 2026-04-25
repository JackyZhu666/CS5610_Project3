import express from 'express';
import mongoose from 'mongoose';
import SudokuGame from '../models/SudokuGame.js';
import HighScore from '../models/HighScore.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { generatePuzzle } from '../utils/sudokuGenerator.js';
import { generateGameName } from '../utils/nameGenerator.js';

const router = express.Router();

function findUserProgress(game, userId) {
  if (!userId) return null;
  return game.progress.find((item) => String(item.user) === String(userId)) || null;
}

async function makeUniqueGameName() {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const name = generateGameName();
    const existing = await SudokuGame.findOne({ name });

    if (!existing) {
      return name;
    }
  }

  return `${generateGameName()} ${Date.now()}`;
}

router.get('/', async (req, res, next) => {
  try {
    const games = await SudokuGame.find()
    .sort({ createdAt: -1 })
    .select('_id name difficulty createdByUsername createdAt');

    return res.json({
      games: games.map((game) => ({
        id: game._id,
        name: game.name,
        difficulty: game.difficulty,
        createdByUsername: game.createdByUsername,
        createdAt: game.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const difficulty = String(req.body.difficulty || '').toUpperCase();

    if (!['EASY', 'NORMAL'].includes(difficulty)) {
      return res.status(400).json({ message: 'Difficulty must be EASY or NORMAL.' });
    }

    const puzzleData = generatePuzzle(difficulty);
    const name = await makeUniqueGameName();

    const game = await SudokuGame.create({
      name,
      difficulty,
      createdBy: req.user._id,
      createdByUsername: req.user.username,
      size: puzzleData.size,
      boxRows: puzzleData.boxRows,
      boxCols: puzzleData.boxCols,
      puzzle: puzzleData.puzzle,
      solution: puzzleData.solution,
      progress: []
    });

    return res.status(201).json({
      gameId: game._id,
      name: game.name
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:gameId', optionalAuth, async (req, res, next) => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid game id.' });
    }

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    const progress = findUserProgress(game, req.user?._id);
    const completed = Boolean(progress?.completed);
    const board = progress?.board || game.puzzle;

    return res.json({
      game: {
        id: game._id,
        name: game.name,
        difficulty: game.difficulty,
        createdByUsername: game.createdByUsername,
        createdAt: game.createdAt,
        size: game.size,
        boxRows: game.boxRows,
        boxCols: game.boxCols,
        puzzle: game.puzzle,
        board,
        elapsedSeconds: progress?.elapsedSeconds || 0,
        completed,
        completedAt: progress?.completedAt || null,
        canInteract: Boolean(req.user && !completed),
        isCreator: Boolean(req.user && String(game.createdBy) === String(req.user._id))
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:gameId', requireAuth, async (req, res, next) => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid game id.' });
    }

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    if (req.body.name && String(game.createdBy) === String(req.user._id)) {
      game.name = String(req.body.name).trim();
    }

    if (Array.isArray(req.body.board)) {
      const existingProgress = findUserProgress(game, req.user._id);

      if (existingProgress) {
        if (!existingProgress.completed) {
          existingProgress.board = req.body.board;
          existingProgress.elapsedSeconds = Number(req.body.elapsedSeconds || 0);
        }
      } else {
        game.progress.push({
          user: req.user._id,
          username: req.user.username,
          board: req.body.board,
          elapsedSeconds: Number(req.body.elapsedSeconds || 0),
          completed: false,
          completedAt: null
        });
      }
    }

    await game.save();

    return res.json({
      message: 'Game updated successfully.'
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:gameId', requireAuth, async (req, res, next) => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: 'Invalid game id.' });
    }

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({ message: 'Game not found.' });
    }

    if (String(game.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Only the creator can delete this game.' });
    }

    const completedProgress = game.progress.filter((item) => item.completed);

    for (const progress of completedProgress) {
      await HighScore.findOneAndUpdate(
          { username: progress.username },
          { $inc: { wins: -1 } },
          { new: true }
      );

      await HighScore.deleteMany({ wins: { $lte: 0 } });
    }

    await SudokuGame.findByIdAndDelete(gameId);

    return res.json({
      message: 'Game deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;