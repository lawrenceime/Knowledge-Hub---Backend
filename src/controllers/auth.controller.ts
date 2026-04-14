import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';


export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, token } = await authService.registerUser(req.body);
        console.log("Registered User:", user);
        res.status(201).json({ success: true, token, data: user });
    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.message === 'Missing required fields') {
            res.status(400).json({ success: false, message: 'Registration failed. Please ensure all required fields are filled.' });
            return;
        }
        if (error.message === 'User with given email or phone number already exists') {
            res.status(400).json({ success: false, message: 'Registration failed. An account with this email or phone number already exists.' });
            return;
        }
        res.status(500).json({ success: false, message: 'A network or server error occurred. Please try again later.' });
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.loginUser(email, password);
        res.status(200).json({ success: true, token, data: user });
    } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === 'Invalid credentials') {
            res.status(401).json({ success: false, message: 'Invalid email or password. Please try again.' });
            return;
        }
        res.status(500).json({ success: false, message: 'A network or server error occurred. Please try again later.' });
    }
}


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (error: any) {
        console.error("Forgot password error:", error);
        if (error.message === 'User not found') {
            res.status(404).json({ success: false, message: 'No account found with that email address.' });
            return;
        }
        if (error.message === 'Email could not be sent') {
            res.status(500).json({ success: false, message: 'Failed to send the reset email. Please try again later.' });
            return;
        }
        res.status(500).json({ success: false, message: 'A network or server error occurred. Please try again later.' });
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const result = await authService.resetPassword(token, password);
        res.status(200).json({ success: true, token: result.token, message: 'Password reset successful' });
    } catch (error: any) {
        console.error("Reset password error:", error);
        if (error.message === 'Invalid or expired token') {
            res.status(400).json({ success: false, message: 'Password reset failed. Your link may be invalid or expired.' });
            return;
        }
        res.status(500).json({ success: false, message: 'A network or server error occurred. Please try again later.' });
    }
}