import mongoose from 'mongoose';
import config from '../config/config';

export const connectDB = async () => {
  await mongoose.connect(config.mongoUri);
  console.log('MongoDB connected');
};
