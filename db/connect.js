// db/connect.js - ESM version, Render-ready
import mongoose from 'mongoose';

const connectDB = async (uri) => {
  try {
    // Avoid deprecation warning
    mongoose.set('strictQuery', true);

    await mongoose.connect(uri);
    console.log(`MongoDB connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // exit app if DB fails
  }
};

export default connectDB;
