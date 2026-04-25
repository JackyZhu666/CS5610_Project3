import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      board: {
        type: [[mongoose.Schema.Types.Mixed]],
        required: true
      },
      elapsedSeconds: {
        type: Number,
        default: 0
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: {
        type: Date,
        default: null
      }
    },
    { _id: false }
);

const sudokuGameSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      difficulty: {
        type: String,
        enum: ['EASY', 'NORMAL'],
        required: true
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdByUsername: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true
      },
      boxRows: {
        type: Number,
        required: true
      },
      boxCols: {
        type: Number,
        required: true
      },
      puzzle: {
        type: [[mongoose.Schema.Types.Mixed]],
        required: true
      },
      solution: {
        type: [[Number]],
        required: true
      },
      progress: [progressSchema]
    },
    { timestamps: true }
);

export default mongoose.model('SudokuGame', sudokuGameSchema);