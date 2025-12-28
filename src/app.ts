import express, { Application, Request, Response } from 'express';  
import cors from 'cors';
import helmet from 'helmet';
// import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import quizRoutes from './routes/quiz.routes';

const app: Application = express(); 

// --- 1. Global Middlewares ---
app.use(express.json());       // Parse JSON bodies
app.use(cors());               // Allow requests from your pure JS frontend
app.use(helmet());             // Security headers
// app.use(morgan('dev'));        // Logging

// --- 2. Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/quiz', quizRoutes);

// --- 3. Base Route (Health Check) ---
app.get('/', (req: Request, res: Response) => {
  res.send('Knowledge Hub API is running...');
});

// --- 4. Export the App ---
export default app;