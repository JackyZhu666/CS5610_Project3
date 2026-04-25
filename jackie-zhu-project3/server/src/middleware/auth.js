import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      return res.status(401).json({ message: 'You must be logged in.' });
    }

    const user = await User.findById(userId).select('_id username');

    if (!user) {
      res.clearCookie('userId');
      return res.status(401).json({ message: 'Invalid login cookie.' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const userId = req.cookies.userId;

    if (!userId) {
      req.user = null;
      return next();
    }

    const user = await User.findById(userId).select('_id username');
    req.user = user || null;

    if (!user) {
      res.clearCookie('userId');
    }

    next();
  } catch (error) {
    next(error);
  }
}