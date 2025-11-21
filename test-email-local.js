/**
 * Quick local email test script
 * Run: node test-email-local.js
 * 
 * This tests email configuration without deploying to Render
 */

require('dotenv').config();
const { sendVerificationCode } = require('./config/email');

async function testEmail() {
  console.log('\n🧪 Testing Email Configuration Locally...\n');
  
  // Check configuration
  console.log('📧 Email Configuration:');
  console.log('   EMAIL_HOST:', process.env.EMAIL_HOST || 'smtp.gmail.com (default)');
  console.log('   EMAIL_PORT:', process.env.EMAIL_PORT || '587 (default)');
  console.log('   EMAIL_USER:', process.env.EMAIL_USER || '❌ NOT SET');
  console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ NOT SET');
  console.log('');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('❌ Email not configured!');
    console.log('💡 Add to .env file:');
    console.log('   EMAIL_HOST=smtp.gmail.com');
    console.log('   EMAIL_PORT=587');
    console.log('   EMAIL_USER=your-email@gmail.com');
    console.log('   EMAIL_PASS=your-app-password');
    process.exit(1);
  }
  
  // Test email
  const testEmail = process.env.EMAIL_USER; // Send to yourself
  const testCode = '123456';
  
  console.log('📤 Sending test email...');
  console.log('   To:', testEmail);
  console.log('   Code:', testCode);
  console.log('');
  
  try {
    const result = await sendVerificationCode(testEmail, testCode);
    
    if (result.messageId && result.messageId !== 'console-log' && result.messageId !== 'console-log-fallback') {
      console.log('✅ Email sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('   Check your inbox:', testEmail);
    } else {
      console.log('❌ Email failed to send');
      console.log('   Check error messages above');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  // Wait a bit for async operations
  setTimeout(() => {
    process.exit(0);
  }, 2000);
}

testEmail();

