import sendEmail from "./sendEmail.js";

const sendResetEmail = async (to, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset_password/verify/${resetToken}`;
    
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Click the link below to reset your password: ${resetUrl}`;
    
    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested a password reset. Please click the link below to reset your password:</p>
            <a href="${resetUrl}" style="color: #008CBA; text-decoration: none;">Reset Password</a>
            <p>If you did not request this, please ignore this email. The link will expire in 1 hour.</p>
            <p>Thank you,</p>
            <p>Your Company Team</p>
        </div>
    `;

    return await sendEmail(to, subject, text, html);
};

export default sendResetEmail;
