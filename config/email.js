require('dotenv').config();

// Mailjet API Configuration
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_API_SECRET = process.env.MAILJET_API_SECRET;
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || process.env.EMAIL_USER || 'noreply@unideals.com';

// Check if Mailjet is configured
const isEmailConfigured = !!(MAILJET_API_KEY && MAILJET_API_SECRET);

// Debug: Log email configuration status
console.log('\n📧 Email Configuration Check:');
if (isEmailConfigured) {
  console.log('   Method: Mailjet API (6,000 emails/month free!)');
  console.log('   MAILJET_API_KEY:', MAILJET_API_KEY ? '✅ Set (' + MAILJET_API_KEY.substring(0, 8) + '...)' : '❌ Not set');
  console.log('   MAILJET_API_SECRET:', MAILJET_API_SECRET ? '✅ Set' : '❌ Not set');
  console.log('   From Email:', MAILJET_FROM_EMAIL);
  console.log('   Configured: ✅ Yes');
} else {
  console.log('   Method: Mailjet API');
  console.log('   MAILJET_API_KEY:', MAILJET_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('   MAILJET_API_SECRET:', MAILJET_API_SECRET ? '✅ Set' : '❌ Not set');
  console.log('   Configured: ❌ No');
  console.log('   💡 To enable: Set MAILJET_API_KEY and MAILJET_API_SECRET in environment variables');
}

/**
 * Send verification code to user's email using Mailjet REST API
 * Uses Basic Auth with API Key as username and Secret as password
 * @param {string} email - Recipient email
 * @param {string} code - Verification code
 * @returns {Promise}
 */
const sendVerificationCode = async (email, code) => {
  // If Mailjet is not configured, log to console
  if (!isEmailConfigured) {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 VERIFICATION CODE (Mailjet not configured)');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 To enable email:');
    console.log('   Set MAILJET_API_KEY and MAILJET_API_SECRET in Render environment variables');
    console.log('   Get keys from: https://app.mailjet.com/account/api_keys');
    console.log('═══════════════════════════════════════════════════════\n');
    return { success: true, messageId: 'console-log' };
  }

  try {
    console.log('📤 Sending email via Mailjet REST API...');
    console.log('   API Endpoint: https://api.mailjet.com/v3.1/send');
    console.log('   From:', MAILJET_FROM_EMAIL);
    console.log('   To:', email);
    console.log('   Code:', code);

    // Create Basic Auth header (API Key as username, Secret as password)
    const authString = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_API_SECRET}`).toString('base64');

    // Mailjet API v3.1 send endpoint
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Messages: [{
          From: {
            Email: MAILJET_FROM_EMAIL,
            Name: 'UniDeals'
          },
          To: [{
            Email: email
          }],
          Subject: 'UniDeals - Email Verification Code',
          HTMLPart: `
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
        }]
      })
    });

    // Parse response
    const result = await response.json();

    if (!response.ok) {
      // Error response from Mailjet
      console.error('❌ Mailjet API Error:');
      console.error('   Status:', response.status, response.statusText);
      console.error('   Response:', JSON.stringify(result, null, 2));
      
      // Common error messages
      if (result.ErrorMessage) {
        console.error('   Error Message:', result.ErrorMessage);
      }
      if (result.ErrorInfo) {
        console.error('   Error Info:', result.ErrorInfo);
      }
      
      // Check for common issues
      if (response.status === 401) {
        console.error('   💡 Issue: Invalid API credentials. Check MAILJET_API_KEY and MAILJET_API_SECRET');
      } else if (response.status === 400) {
        console.error('   💡 Issue: Bad request. Check if sender email is verified in Mailjet');
        console.error('   💡 Verify sender: https://app.mailjet.com/account/sender');
      }
      
      // Fallback to console logging
      console.log('\n═══════════════════════════════════════════════════════');
      console.log('📧 VERIFICATION CODE (Mailjet API failed - using console)');
      console.log('═══════════════════════════════════════════════════════');
      console.log(`Email: ${email}`);
      console.log(`Verification Code: ${code}`);
      console.log('═══════════════════════════════════════════════════════\n');
      
      return { 
        success: false, 
        messageId: 'mailjet-api-failed',
        error: result.ErrorMessage || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    // Success!
    console.log('✅ Verification email sent via Mailjet!');
    console.log('   Status:', response.status);
    if (result.Messages && result.Messages[0]) {
      console.log('   Message ID:', result.Messages[0].To[0].MessageID || 'N/A');
      console.log('   Status:', result.Messages[0].Status || 'sent');
      return { 
        success: true, 
        messageId: result.Messages[0].To[0].MessageID || 'mailjet-success'
      };
    }
    
    return { success: true, messageId: 'mailjet-success' };

  } catch (error) {
    console.error('❌ Error sending email via Mailjet API:');
    console.error('   Error Message:', error.message);
    console.error('   Error Type:', error.name || 'Unknown');
    
    if (error.code) {
      console.error('   Error Code:', error.code);
    }
    
    // Network errors
    if (error.message.includes('fetch')) {
      console.error('   💡 Issue: Network error. Check internet connection or Render network settings');
    }
    
    // Fallback to console logging
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📧 VERIFICATION CODE (Mailjet API error - using console)');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Email: ${email}`);
    console.log(`Verification Code: ${code}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('💡 Troubleshooting:');
    console.log('   1. Check MAILJET_API_KEY and MAILJET_API_SECRET are correct');
    console.log('   2. Verify sender email in Mailjet: https://app.mailjet.com/account/sender');
    console.log('   3. Check Render logs for detailed error messages');
    console.log('═══════════════════════════════════════════════════════\n');
    
    return { 
      success: false, 
      messageId: 'mailjet-error',
      error: error.message
    };
  }
};

module.exports = {
  sendVerificationCode
};
