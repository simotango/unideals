const nodemailer = require('nodemailer');
require('dotenv').config();

// Check if email is configured
const isEmailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

// Create transporter for sending emails (only if configured)
let transporter = null;
if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify transporter configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log('⚠️  Email transporter verification failed:');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
      console.log('📧 Email sending disabled. Verification codes will be logged to console.');
      console.log('💡 Check: EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT in environment variables');
    } else {
      console.log('✅ Email server is ready to send messages');
      console.log('   Host:', process.env.EMAIL_HOST || 'smtp.gmail.com');
      console.log('   Port:', process.env.EMAIL_PORT || 587);
      console.log('   User:', process.env.EMAIL_USER);
    }
  });
} else {
  console.log('📧 Email not configured. Verification codes will be logged to console.');
  console.log('   To enable email, set EMAIL_USER and EMAIL_PASS in .env file');
}

/**
 * Send verification code to user's email
 * If email is not configured, logs to console instead
 * @param {string} email - Recipient email
 * @param {string} code - Verification code
 * @returns {Promise}
 */
const sendVerificationCode = async (email, code) => {
  // If email is not configured, just log to console
  if (!isEmailConfigured || !transporter) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 VERIFICATION CODE (Email not configured)');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log('═══════════════════════════════════════════════════════\n');
    return { success: true, messageId: 'console-log' };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'UniDeals - Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">UniDeals Verification</h2>
        <p>Thank you for registering with UniDeals!</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4CAF50; margin: 0; font-size: 32px; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Response:', error.response);
    // Fallback to console logging if email fails
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 VERIFICATION CODE (Email sending failed - using console)');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log('═══════════════════════════════════════════════════════\n');
    return { success: true, messageId: 'console-log-fallback' };
  }
};

module.exports = {
  transporter,
  sendVerificationCode
};

