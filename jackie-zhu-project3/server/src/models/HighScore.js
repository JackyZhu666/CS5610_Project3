import mongoose from 'mongoose';

const highScoreSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
      wins: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    { timestamps: true }
);

export default mongoose.model('HighScore', highScoreSchema);