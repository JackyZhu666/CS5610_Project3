import dotenv from 'dotenv';
import mongoose from 'mongoose';

import User from '../models/User.js';
import HighScore from '../models/HighScore.js';
import SudokuGame from '../models/SudokuGame.js';

dotenv.config();

const usernameToDelete = process.argv[2]?.trim().toLowerCase();

if (!usernameToDelete) {
  console.error('Usage: node src/scripts/deleteUser.js <username>');
  process.exit(1);
}

async function deleteUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ username: usernameToDelete });

    if (!user) {
      console.log(`User "${usernameToDelete}" not found.`);
      process.exit(0);
    }

    await User.deleteOne({ _id: user._id });

    await HighScore.deleteOne({ username: usernameToDelete });

    await SudokuGame.updateMany(
        {},
        {
          $pull: {
            progress: {
              user: user._id
            }
          }
        }
    );

    console.log(`Deleted user "${usernameToDelete}"`);
    console.log('Also removed their high score and game progress records.');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

deleteUser();