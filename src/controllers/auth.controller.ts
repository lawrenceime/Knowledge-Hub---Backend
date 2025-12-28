import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { da } from 'zod/v4/locales';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user , token } = await authService.registerUser(req.body);
        res.status(201).json({success: true,  token , data: user });
    } catch (error) {
        res.status(400).json({success: false , message : (error as Error).message});
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email , password } = req.body;
        const { user , token } = await authService.loginUser(email, password);
        res.status(200).json({ success: true, token , data: user });
    } catch (error) {
        res.status(401).json({success: false , message : (error as Error).message});
    }
}


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        res.status(400).json({success: false , message : (error as Error).message});
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const result = await authService.resetPassword(token, password);
        res.status(200).json({ success: true, token: result.token, message: 'Password reset successful' });
    }catch (error) {
        res.status(400).json({success: false , message : (error as Error).message});
    }
}