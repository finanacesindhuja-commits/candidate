import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { to, subject, html } = req.body;

        if (!to || !subject || !html) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailUser = process.env.EMAIL_USER || 'sindhujafinance7@gmail.com';
        const emailPass = process.env.EMAIL_PASS || 'fnfvfiicdkpgpkrc';

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        const info = await transporter.sendMail({
            from: `Candidate App <${emailUser}>`,
            to,
            subject,
            html
        });

        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Email API Error:', error);
        res.status(500).json({ error: error.message });
    }
}
