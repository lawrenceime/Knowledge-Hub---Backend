import { Router } from 'express';
import * as userProfileController from '../controllers/userprofile.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/profile', userProfileController.getUserProfile);
router.patch('/update-profile', protect , userProfileController.updateUserProfile);

export default router;