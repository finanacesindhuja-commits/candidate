require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server is ready to send emails');
    }
});

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(helmet()); // Basic security headers
app.use(morgan('combined')); // HTTP request logging
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());

// Rate limiting for the application endpoint
const applyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: { error: 'Too many applications from this IP, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Multer configuration for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Helper to upload file to Supabase Storage
async function uploadToSupabase(file, bucket, folder) {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

// Function to send confirmation email
async function sendConfirmationEmail(applicantEmail, applicantName) {
    const mailOptions = {
        from: `Candidate App <${process.env.EMAIL_USER}>`,
        to: applicantEmail,
        subject: 'Application Received - Join Our Team',
        text: `Hi ${applicantName},\n\nThank you for applying! We've received your application and our team will review it shortly.\n\nBest regards,\nCandidate App Team`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5;">Application Received!</h2>
                <p>Hi <strong>${applicantName}</strong>,</p>
                <p>Thank you for applying! We've received your application and our team will review it shortly to see if you're a good fit for the role.</p>
                <p>We'll get back to you soon.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">This is an automated message, please do not reply to this email.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        // We don't want to fail the whole application if email fails
        return null;
    }
}

// Routes
app.post('/apply', applyLimiter, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cert_10th', maxCount: 1 },
    { name: 'cert_12th', maxCount: 1 },
    { name: 'cert_degree', maxCount: 1 }
]), async (req, res) => {
    try {
        const { 
            name, 
            mobile, 
            area, 
            experience, 
            alternative_mobile, 
            role,
            email,
            fathers_name,
            mothers_name,
            degree
        } = req.body;
        const files = req.files;

        if (!name || !mobile || !area || !experience || !role || !email || !fathers_name || !mothers_name || !degree) {
            return res.status(400).json({ error: 'All text fields are required' });
        }

        let imageUrl = null;
        let cert10thUrl = null;
        let cert12thUrl = null;
        let certDegreeUrl = null;

        // Upload Image if present
        if (files.image && files.image[0]) {
            console.log('Uploading image...');
            imageUrl = await uploadToSupabase(files.image[0], 'application-docs', 'images');
            console.log('Image uploaded:', imageUrl);
        }

        // Upload 10th Certificate
        if (files.cert_10th && files.cert_10th[0]) {
            cert10thUrl = await uploadToSupabase(files.cert_10th[0], 'application-docs', 'certificates');
        }

        // Upload 12th Certificate
        if (files.cert_12th && files.cert_12th[0]) {
            cert12thUrl = await uploadToSupabase(files.cert_12th[0], 'application-docs', 'certificates');
        }

        // Upload Degree Certificate
        if (files.cert_degree && files.cert_degree[0]) {
            certDegreeUrl = await uploadToSupabase(files.cert_degree[0], 'application-docs', 'certificates');
        }

        console.log('Inserting into DB...');
        const { data, error } = await supabase
            .from('applicants')
            .insert([
                { 
                    name, 
                    mobile, 
                    area, 
                    experience, 
                    alternative_mobile,
                    role,
                    email,
                    fathers_name,
                    mothers_name,
                    degree,
                    image_url: imageUrl,
                    cert_10th_url: cert10thUrl,
                    cert_12th_url: cert12thUrl,
                    cert_degree_url: certDegreeUrl,
                    status: 'pending' 
                }
            ]);

        if (error) {
            console.error('Database Insertion Error:', error);
            return res.status(500).json({ error: `Database error: ${error.message}` });
        }

        console.log('Application saved successfully');
        
        // Trigger automated email (don't await so response isn't blocked)
        sendConfirmationEmail(email, name);

        res.status(200).json({ message: 'Application submitted successfully', data });
    } catch (err) {
        console.error('Caught Server Error:', err);
        const message = process.env.NODE_ENV === 'production' 
            ? 'An internal server error occurred. Please try again later.' 
            : `Server error: ${err.message}`;
        res.status(500).json({ error: message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    const message = process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred. Please try again later.' 
        : err.message;
    res.status(err.status || 500).json({ error: message });
});

app.get('/', (req, res) => {
    res.send('Candidate App Backend is running');
});

// Start server only if not being imported (like in Vercel Serverless)
if (process.env.NODE_ENV !== 'production' || require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
