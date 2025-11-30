const nodemailer = require('nodemailer');
require('dotenv').config();

// Check if email is configured (SMTP or SendGrid)
const isEmailConfigured = (process.env.EMAIL_USER && process.env.EMAIL_PASS) || process.env.SENDGRID_API_KEY;
const useSendGrid = !!process.env.SENDGRID_API_KEY;

// Initialize SendGrid if API key is provided
let sendgrid = null;
if (useSendGrid) {
  try {
    sendgrid = require('@sendgrid/mail');
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid API configured (bypasses SMTP blocking)');
  } catch (error) {
    console.log('⚠️  SendGrid package not installed. Run: npm install @sendgrid/mail');
  }
}

// Debug: Log email configuration status
console.log('\n📧 Email Configuration Check:');
if (useSendGrid) {
  console.log('   Method: SendGrid API (works on Render free tier)');
  console.log('   SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Not set');
} else {
  console.log('   Method: SMTP (may be blocked on Render free tier)');
  console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com (default)');
  console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
}
console.log('   Configured:', isEmailConfigured ? '✅ Yes' : '❌ No');

// Create transporter for sending emails (only if configured)
let transporter = null;
let transporterReady = false;
let transporterError = null;

if (isEmailConfigured) {
  // Try port 465 (SSL) first, fallback to 587 (TLS)
  const emailPort = parseInt(process.env.EMAIL_PORT) || 587;
  const useSSL = emailPort === 465;
  
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: emailPort,
    secure: useSSL, // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Increased timeouts for Render network
    connectionTimeout: 30000, // 30 seconds (increased from 10)
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 30000,     // 30 seconds
    // Additional options for better connection
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates if needed
    },
    // Retry configuration
    pool: false,
    maxConnections: 1,
    maxMessages: 1
  });

  // Verify transporter configuration (async to not block server start)
  transporter.verify(function (error, success) {
    if (error) {
      transporterError = error;
      transporterReady = false;
      console.log('⚠️  Email transporter verification failed:');
      console.log('   Error:', error.message);
      console.log('   Code:', error.code);
      if (error.response) {
        console.log('   Response:', error.response);
      }
      if (error.responseCode) {
        console.log('   Response Code:', error.responseCode);
      }
      console.log('📧 Email sending will be attempted but may fail.');
      console.log('💡 Check: EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT in environment variables');
      console.log('💡 For Gmail: Use App Password (not regular password) - https://myaccount.google.com/apppasswords');
      if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
        console.log('💡 Connection timeout detected! Try these fixes:');
        console.log('   1. Change EMAIL_PORT to 465 (SSL) instead of 587 (TLS)');
        console.log('   2. Render free tier may block SMTP - consider upgrading or using email service');
        console.log('   3. Check if Gmail is blocking Render IP addresses');
      }
      // Don't disable transporter - let it try to send anyway
    } else {
      transporterReady = true;
      transporterError = null;
      console.log('✅ Email server is ready to send messages');
      console.log('   Host:', process.env.EMAIL_HOST || 'smtp.gmail.com');
      console.log('   Port:', process.env.EMAIL_PORT || '587');
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
  if (!isEmailConfigured) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 VERIFICATION CODE (Email not configured)');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 To enable email:');
    console.log('   Option 1: Set SENDGRID_API_KEY (recommended for Render)');
    console.log('   Option 2: Set EMAIL_USER and EMAIL_PASS (SMTP - may be blocked)');
    console.log('═══════════════════════════════════════════════════════\n');
    return { success: true, messageId: 'console-log' };
  }

  // Try SendGrid first (works on Render free tier)
  if (useSendGrid && sendgrid) {
    try {
      console.log('📤 Sending email via SendGrid API...');
      console.log('   From:', process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'noreply@unideals.com');
      console.log('   To:', email);
      
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER || 'noreply@unideals.com',
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

      const response = await sendgrid.send(msg);
      console.log('✅ Verification email sent via SendGrid!');
      console.log('   Status Code:', response[0].statusCode);
      console.log('   Message ID:', response[0].headers['x-message-id'] || 'N/A');
      console.log('   To:', email);
      return { success: true, messageId: response[0].headers['x-message-id'] || 'sendgrid-success' };
    } catch (error) {
      console.error('❌ Error sending email via SendGrid:');
      console.error('   Error:', error.message);
      if (error.response) {
        console.error('   Status Code:', error.response.statusCode);
        console.error('   Body:', JSON.stringify(error.response.body, null, 2));
      }
      // Fall through to SMTP or console logging
      console.log('⚠️  SendGrid failed, trying SMTP or console logging...');
    }
  }
  
  // If transporter is null but email is configured, try to create it
  if (!transporter && isEmailConfigured) {
    console.log('⚠️  Transporter not initialized, attempting to create...');
    const emailPort = parseInt(process.env.EMAIL_PORT) || 587;
    const useSSL = emailPort === 465;
    
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: emailPort,
      secure: useSSL,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  
  // Log transporter status
  if (transporter) {
    console.log('   Transporter Status:', transporterReady ? '✅ Ready' : '⏳ Not verified yet');
    if (transporterError) {
      console.log('   Previous Verification Error:', transporterError.message);
    }
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
    // Verify transporter is ready before sending
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }
    
    console.log('📤 Attempting to send email via SMTP...');
    console.log('   SMTP Host:', process.env.EMAIL_HOST || 'smtp.gmail.com');
    console.log('   SMTP Port:', process.env.EMAIL_PORT || '587');
    console.log('   Secure (SSL):', parseInt(process.env.EMAIL_PORT) === 465 ? 'Yes' : 'No (TLS)');
    console.log('   From:', process.env.EMAIL_USER);
    console.log('   To:', email);
    console.log('   Connection Timeout: 30 seconds');
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response || 'N/A');
    console.log('   To:', email);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending verification email:');
    console.error('   Error Message:', error.message);
    console.error('   Error Code:', error.code);
    if (error.response) {
      console.error('   SMTP Response:', error.response);
    }
    if (error.responseCode) {
      console.error('   Response Code:', error.responseCode);
    }
    if (error.command) {
      console.error('   Failed Command:', error.command);
    }
    
    // Log full error for debugging (safely handle circular references)
    try {
      const errorDetails = {
        message: error.message,
        code: error.code,
        response: error.response,
        responseCode: error.responseCode,
        command: error.command,
        stack: error.stack
      };
      console.error('   Error Details:', JSON.stringify(errorDetails, null, 2));
    } catch (stringifyError) {
      console.error('   Error (could not stringify):', error.message);
    }
    
    // Fallback to console logging if email fails
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 VERIFICATION CODE (Email sending failed - using console)');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check EMAIL_USER and EMAIL_PASS are set correctly');
    console.log('   2. For Gmail, use App Password (not regular password)');
    console.log('   3. Check if 2-Step Verification is enabled');
    console.log('   4. Verify SMTP settings (host, port)');
    console.log('═══════════════════════════════════════════════════════\n');
    return { success: true, messageId: 'console-log-fallback' };
  }
};

module.exports = {
  transporter,
  sendVerificationCode
};

