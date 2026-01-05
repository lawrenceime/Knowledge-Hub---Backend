import { Router } from 'express';
import * as leaderboardController from '../controllers/leaderboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);
// Leaderboard Routes

// Get Leaderboard
router.get('/', leaderboardController.getLeaderboard);
// Get My Rank
router.get('/my-rank', leaderboardController.getMyRank);

export default router;