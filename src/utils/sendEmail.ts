import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    
  // 1. Create Transporter (Using Gmail Service)
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.SMTP_EMAIL, // Your Gmail address
      pass: process.env.SMTP_PASSWORD, // Your App Password
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message, // Plain text body
    // html: `<p>${options.message}</p>` // You can add HTML here if you want it pretty
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;