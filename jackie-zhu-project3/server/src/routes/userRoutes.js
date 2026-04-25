import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
  };
}

router.get('/isLoggedIn', async (req, res, next) => {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.json({ loggedIn: false });
    }

    const user = await User.findById(userId).select('_id username');

    if (!user) {
      res.clearCookie('userId');
      return res.json({ loggedIn: false });
    }

    return res.json({
      loggedIn: true,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      passwordHash
    });

    res.cookie('userId', user._id.toString(), cookieOptions());

    return res.status(201).json({
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const username = String(req.body.username || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    res.cookie('userId', user._id.toString(), cookieOptions());

    return res.json({
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', requireAuth, (req, res) => {
  res.clearCookie('userId');
  return res.json({ message: 'Logged out successfully.' });
});

export default router;