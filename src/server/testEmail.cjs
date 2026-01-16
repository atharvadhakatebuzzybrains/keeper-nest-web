const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });


const YOUR_GMAIL = process.env.GMAIL_MAIL;     
const APP_PASSWORD = process.env.GMAIL_PASSWORD;
const RECIPIENT_EMAIL = 'atharva.dhakate22@gmail.com';   

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: YOUR_GMAIL,
        pass: APP_PASSWORD
    }
});

async function sendTestEmail() {
    try {
        console.log('📧 Sending test email...');
        
        const info = await transporter.sendMail({
            from: `"Test Sender" <${YOUR_GMAIL}>`,
            to: RECIPIENT_EMAIL,
            subject: 'Hello Test Email from Node.js!',
            
            // Plain text version
            text: `Hello! This is a test email sent from Node.js using Gmail SMTP.
            
Sent at: ${new Date().toLocaleString()}
This is the plain text version.

Best regards,
Test Bot`,

            // HTML version
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .test-box {
            background: #e8f4fc;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #7f8c8d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>✨ Hello Test Email! ✨</h1>
        
        <p>This is a <strong>test email</strong> sent from Node.js using Gmail SMTP.</p>
        
        <div class="test-box">
            <p>✅ <strong>Congratulations!</strong> Your email setup is working!</p>
            <p>📅 <strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <p>If you can see this HTML email, everything is working correctly!</p>
        
        <a href="https://nodejs.org" class="button">Visit Node.js Website</a>
        
        <div class="footer">
            <p>This is an automated test email. No reply needed.</p>
            <p>Node.js + Nodemailer + Gmail SMTP</p>
        </div>
    </div>
</body>
</html>
            `
        });

        console.log('✅ Email sent successfully!');
        console.log(`📨 Message ID: ${info.messageId}`);
        console.log(`👤 To: ${RECIPIENT_EMAIL}`);
        console.log(`👤 From: ${YOUR_GMAIL}`);
        console.log(`📊 Response: ${info.response}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error sending email:');
        console.error('   Error:', error.message);
        console.error('\n⚠️  Common issues:');
        console.error('   1. Make sure you created an APP PASSWORD (not regular password)');
        console.error('   2. Enable 2FA in your Google Account first');
        console.error('   3. Check if "Less secure app access" is enabled (if no 2FA)');
        console.error('   4. Verify your Gmail account is not locked');
        
        return false;
    }
}

// Run the function
sendTestEmail();