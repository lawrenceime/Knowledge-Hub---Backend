import { Router } from 'express';
import * as quizController from '../controllers/quiz.controllers';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/' , quizController.getQuestions);
router.post('/check-answer', quizController.checkAnswer);
router.post('/submit', quizController.submitFinalResult);

export default router;