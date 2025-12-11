import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

// 1. Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// 2. Start Server function
const startServer = async () => {
  // Connect to Database first
  await connectDB();

  // Then start the Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();