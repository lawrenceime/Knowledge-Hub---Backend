import { Router } from 'express';
import multer from 'multer';
import * as userProfileController from '../controllers/userprofile.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if(file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

router.get('/profile', userProfileController.getUserProfile);
router.patch('/update-profile', protect , upload.single('profilePicture'), userProfileController.updateUserProfile);

export default router;