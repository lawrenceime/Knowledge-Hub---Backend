import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';

const generateToken = (id : string) => {
     console.log("JWT Secret:", process.env.JWT_SECRET);
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
}

export const registerUser = async (userData: IUser) => {
    const { firstName , lastName , email, password, phoneNumber } = userData;

    const existingUser = await User.findOne({ 
        $or: [
            { email },
            { phoneNumber }
        ]
    });

    if (existingUser) {
        throw new Error('User with given email or phone number already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword
    });


    const token = generateToken(newUser._id.toString());

    return { user: newUser, token };

}

export const loginUser = async (email: string,  password: string) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id.toString());

    return { user, token };
}

export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

     const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    

    // In real app, send email with this token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
     const message = `
    You requested a password reset. 
    Please go to this link to reset your password: 
    ${resetUrl}
  `;

   try {
     await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message,
    });
   } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error('Email send error:', error);
    throw new Error('Email could not be sent')
   }

    console.log(`Email sent to ${email} with URL: ${resetUrl}`);
    return { message: 'Email sent', resetUrl }; 

}

export const resetPassword = async (resetToken: string, newPassword: string) => {
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({ 
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
        throw new Error('Invalid or expired token');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return { token: generateToken(user._id.toString()) };

}