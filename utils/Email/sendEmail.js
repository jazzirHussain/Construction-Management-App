import { createTransport } from 'nodemailer';

// Configure the SMTP transporter
const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS  // SMTP password
    }
});

// Generalized function to send an email
const sendEmail = async (to, subject, text, html = null) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM, // Sender address (e.g., 'noreply@yourdomain.com')
            to,                          // Recipient email address
            subject,                     // Subject of the email
            text,                        // Plain text body
            html                         // HTML body (optional)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

export default sendEmail

