import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

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
        const user = req.user;
        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { firstName, lastName, email , phoneNumber } = req.body;
        if(firstName) user.firstName = firstName;
        if(lastName) user.lastName = lastName;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}   