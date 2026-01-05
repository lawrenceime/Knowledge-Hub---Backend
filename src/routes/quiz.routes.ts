import { Router } from 'express';
import * as quizController from '../controllers/quiz.controllers';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

// Quiz Routes

// Get Questions
router.get('/' , quizController.getQuestions);
// Check Answer
router.post('/check-answer', quizController.checkAnswer);
// Submit Final Result
router.post('/submit', quizController.submitFinalResult);

export default router;