import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing from .env');
  }

  console.log('Connecting to MongoDB...');
  console.log(uri.replace(/:\/\/.*@/, '://***:***@'));

  await mongoose.connect(uri);

  console.log('MongoDB connected');
}