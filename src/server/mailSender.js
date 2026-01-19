// emailSender.js
const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
  }
});

/**
 * Send email with both HTML and text options
 * @param {Object} options - Email options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text content (optional if html provided)
 * @param {string} [options.html] - HTML content (optional if text provided)
 * @param {string} [options.from] - Sender email (defaults to Gmail user)
 * @returns {Promise<Object>} - Result object with success status
 */
async function sendEmail({ to, subject, text = '', html = '', from = null }) {
  try {
    // Validate required fields
    if (!to) throw new Error('Recipient email (to) is required');
    if (!subject) throw new Error('Email subject is required');
    if (!text && !html) throw new Error('Either text or html content is required');

    // Prepare email options
    const mailOptions = {
      from: from || `"Your App" <${transporter.options.auth.user}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      text: text || (html ? html.replace(/<[^>]*>/g, '') : ''), // Strip HTML tags if only html provided
      html: html || text // Use html if provided, else use text as html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
    
  } catch (error) {
    console.error('Email sending failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Export the function
module.exports = sendEmail;