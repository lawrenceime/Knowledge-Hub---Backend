import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}



export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("req.body:", req.body);
    try {
        const  user = req.user;
        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { firstName, lastName, email , phoneNumber , gender } = req.body;
        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(gender) user.gender = gender;

         if(req.file) {
            const result = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
                {
                    folder: 'knowledgehub/profiles',
                    public_id: `${user._id}-profile`,
                    overwrite: true
                }
            );
            user.profilePicture = result.secure_url;
        }

        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}   