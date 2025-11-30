const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Client = require('../models/Client');
const Panier = require('../models/Panier');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const { sendVerificationCode } = require('../config/email');
const { generateToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const { isValidUniversityEmail, generateVerificationCode, validatePassword } = require('../utils/validation');

/**
 * POST /api/client/register
 * Register a new client with university email
 */
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Email validation removed - accept any email for testing
    // Uncomment below to re-enable university email validation:
    // if (!isValidUniversityEmail(email)) {
    //   return res.status(400).json({ 
    //     success: false, 
    //     message: 'Please use a valid university email address' 
    //   });
    // }

    // Check if client already exists
    const existingClient = await Client.findByEmail(email);
    if (existingClient && existingClient.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered and verified' 
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create or update client
    let client;
    if (existingClient) {
      client = await Client.updateVerificationCode(email, verificationCode, codeExpiresAt);
    } else {
      client = await Client.create(email, verificationCode, codeExpiresAt);
    }

    // Check Mailjet configuration
    const emailConfigured = !!(process.env.MAILJET_API_KEY && process.env.MAILJET_API_SECRET);
    const emailService = emailConfigured ? 'Mailjet' : 'None';
    
    // Send verification email
    console.log('\n📧 Sending verification email...');
    console.log('   To:', email);
    console.log('   Code:', verificationCode);
    console.log('   Email configured:', emailConfigured ? '✅ Yes' : '❌ No');
    console.log('   Email service:', emailService);
    
    const emailResult = await sendVerificationCode(email, verificationCode);
    
    // Check if email was actually sent
    const emailSent = emailResult.messageId && 
                     emailResult.messageId !== 'console-log' && 
                     emailResult.messageId !== 'console-log-fallback';
    
    if (emailSent) {
      console.log('✅ Verification email sent successfully!');
      console.log('   Message ID:', emailResult.messageId);
      console.log('   Service:', emailService);
    } else {
      console.log('⚠️  Email not sent - verification code logged to console');
      console.log('   Service attempted:', emailService);
      if (emailResult.error) {
        console.log('   Error:', emailResult.error);
      }
    }

    // Prepare response with email status
    const responseData = {
      email: client.email,
      emailSent: emailSent,
      emailConfigured: emailConfigured,
      emailService: emailService
    };
    
    // NEVER send verification code in response - it should only be in email or logs
    // If email fails, user must check logs (for security)

    res.status(201).json({
      success: true,
      message: emailSent 
        ? 'Verification code sent to your email. Please check your inbox.' 
        : 'Verification code sent. If you don\'t receive an email, check server logs for the code.',
      data: responseData
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

/**
 * POST /api/client/verify
 * Verify email with verification code
 */
router.post('/verify', async (req, res) => {
  try {
    const { email, verification_code } = req.body;

    if (!email || !verification_code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and verification code are required' 
      });
    }

    const client = await Client.verifyEmail(email, verification_code);

    if (!client) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired verification code' 
      });
    }

    res.json({
      success: true,
      message: 'Email verified successfully. Please set your password.',
      data: { email: client.email, verified: client.verified }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

/**
 * POST /api/client/set-password
 * Set password after email verification
 */
router.post('/set-password', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        message: passwordValidation.message 
      });
    }

    // Check if client is verified
    const client = await Client.findByEmail(email);
    if (!client || !client.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please verify your email first' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Set password
    const updatedClient = await Client.setPassword(email, hashedPassword);

    // Create panier for client if doesn't exist
    let panier;
    if (!updatedClient.panier_id) {
      panier = await Panier.create(updatedClient.id);
      await Client.updatePanierId(updatedClient.id, panier.id);
      updatedClient.panier_id = panier.id;
    }

    // Generate JWT token
    const token = generateToken({
      id: updatedClient.id,
      email: updatedClient.email,
      role: 'client'
    });

    res.json({
      success: true,
      message: 'Password set successfully',
      data: {
        token,
        client: {
          id: updatedClient.id,
          email: updatedClient.email,
          panier_id: updatedClient.panier_id
        }
      }
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ success: false, message: 'Server error setting password' });
  }
});

/**
 * POST /api/client/login
 * Login with email and password
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const client = await Client.findByEmail(email);

    if (!client || !client.verified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials or email not verified' 
      });
    }

    if (!client.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Please set your password first' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, client.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create panier if doesn't exist
    let panier;
    if (!client.panier_id) {
      panier = await Panier.create(client.id);
      await Client.updatePanierId(client.id, panier.id);
      client.panier_id = panier.id;
    }

    const token = generateToken({
      id: client.id,
      email: client.email,
      role: 'client'
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        client: {
          id: client.id,
          email: client.email,
          panier_id: client.panier_id || panier.id
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

/**
 * GET /api/client/products
 * Get all available products grouped by supplier/store
 */
router.get('/products', authenticate, async (req, res) => {
  try {
    const products = await Product.findAll();
    
    // Group products by supplier
    const stores = {};
    products.forEach(product => {
      const supplierId = product.supplier_id;
      if (!stores[supplierId]) {
        stores[supplierId] = {
          supplier_id: supplierId,
          supplier_name: product.supplier_name,
          supplier_email: product.supplier_email,
          products: []
        };
      }
      stores[supplierId].products.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        description: product.description
      });
    });
    
    // Convert to array
    const storesArray = Object.values(stores);
    
    res.json({ success: true, data: storesArray });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

/**
 * GET /api/client/offers
 * Get all active offers
 */
router.get('/offers', authenticate, async (req, res) => {
  try {
    const offers = await Offer.findAllActive();
    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching offers' });
  }
});

/**
 * GET /api/client/panier
 * Get client's panier with items
 */
router.get('/panier', authenticate, async (req, res) => {
  try {
    const panier = await Panier.getPanierWithItems(req.user.id);
    
    if (!panier) {
      // Create panier if doesn't exist
      const newPanier = await Panier.create(req.user.id);
      await Client.updatePanierId(req.user.id, newPanier.id);
      return res.json({ 
        success: true, 
        data: { panier_id: newPanier.id, items: [] } 
      });
    }

    res.json({ success: true, data: panier });
  } catch (error) {
    console.error('Get panier error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching panier' });
  }
});

/**
 * POST /api/client/panier/add
 * Add product to panier
 */
router.post('/panier/add', authenticate, async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product ID is required' 
      });
    }

    // Get or create panier
    let client = await Client.findById(req.user.id);
    let panier;
    
    if (!client.panier_id) {
      panier = await Panier.create(req.user.id);
      await Client.updatePanierId(req.user.id, panier.id);
    } else {
      panier = await Panier.findById(client.panier_id);
    }

    // Get product to get current price
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Add item to panier
    const item = await Panier.addItem(panier.id, product_id, quantity, product.price);

    res.json({
      success: true,
      message: 'Product added to panier',
      data: item
    });
  } catch (error) {
    console.error('Add to panier error:', error);
    res.status(500).json({ success: false, message: 'Server error adding to panier' });
  }
});

/**
 * PUT /api/client/panier/update
 * Update item quantity in panier
 */
router.put('/panier/update', authenticate, async (req, res) => {
  try {
    const { item_id, quantity } = req.body;

    if (!item_id || !quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Item ID and valid quantity are required' 
      });
    }

    const client = await Client.findById(req.user.id);
    if (!client.panier_id) {
      return res.status(404).json({ 
        success: false, 
        message: 'Panier not found' 
      });
    }

    const item = await Panier.updateItemQuantity(client.panier_id, item_id, quantity);

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in panier' 
      });
    }

    res.json({
      success: true,
      message: 'Panier updated',
      data: item
    });
  } catch (error) {
    console.error('Update panier error:', error);
    res.status(500).json({ success: false, message: 'Server error updating panier' });
  }
});

/**
 * DELETE /api/client/panier/remove/:item_id
 * Remove item from panier
 */
router.delete('/panier/remove/:item_id', authenticate, async (req, res) => {
  try {
    const { item_id } = req.params;

    const client = await Client.findById(req.user.id);
    if (!client.panier_id) {
      return res.status(404).json({ 
        success: false, 
        message: 'Panier not found' 
      });
    }

    const item = await Panier.removeItem(client.panier_id, item_id);

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in panier' 
      });
    }

    res.json({
      success: true,
      message: 'Item removed from panier',
      data: item
    });
  } catch (error) {
    console.error('Remove from panier error:', error);
    res.status(500).json({ success: false, message: 'Server error removing from panier' });
  }
});

/**
 * POST /api/client/panier/confirm
 * Confirm panier and create order
 */
router.post('/panier/confirm', authenticate, async (req, res) => {
  try {
    const { phone, location_type, etage, address, client_name } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    if (!location_type || (location_type !== 'emsi' && location_type !== 'outside')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Location type must be "emsi" or "outside"' 
      });
    }

    if (location_type === 'emsi' && !etage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Etage (floor) number is required for EMSI delivery' 
      });
    }

    if (location_type === 'outside' && !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address is required for outside delivery' 
      });
    }

    const client = await Client.findById(req.user.id);
    if (!client.panier_id) {
      return res.status(404).json({ 
        success: false, 
        message: 'Panier not found' 
      });
    }

    // Get panier with items
    const panier = await Panier.getPanierWithItems(req.user.id);
    
    if (!panier.items || panier.items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Panier is empty' 
      });
    }

    // Calculate total amount
    const subtotal = panier.items.reduce((sum, item) => {
      return sum + (parseFloat(item.price_at_time) * item.quantity);
    }, 0);

    // Calculate delivery fee: 5 DH if outside EMSI, 0 if inside
    const deliveryFee = location_type === 'outside' ? 5.00 : 0.00;
    const totalAmount = subtotal + deliveryFee;

    // Update client profile with location info
    await Client.updateProfile(req.user.id, phone, location_type, etage || null, address || null);

    // Create order with delivery information
    const orderData = await Order.create(
      req.user.id, 
      client.panier_id, 
      totalAmount,
      deliveryFee,
      location_type,
      etage || null,
      address || null,
      phone,
      client_name || client.email
    );

    // Create new panier for future use
    const newPanier = await Panier.create(req.user.id);
    await Client.updatePanierId(req.user.id, newPanier.id);

    res.json({
      success: true,
      message: 'Order created successfully',
      data: orderData
    });
  } catch (error) {
    console.error('Confirm panier error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error confirming panier',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * GET /api/client/profile
 * Get client profile
 */
router.get('/profile', authenticate, async (req, res) => {
  try {
    const profile = await Client.getProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching profile' });
  }
});

/**
 * PUT /api/client/profile
 * Update client profile
 */
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { phone, location_type, etage, address } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    if (location_type === 'emsi' && !etage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Etage (floor) number is required for EMSI delivery' 
      });
    }

    if (location_type === 'outside' && !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Address is required for outside delivery' 
      });
    }

    const profile = await Client.updateProfile(
      req.user.id, 
      phone, 
      location_type || 'emsi', 
      etage || null, 
      address || null
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

/**
 * GET /api/client/orders
 * Get client's order history
 */
router.get('/orders', authenticate, async (req, res) => {
  try {
    const orders = await Client.getOrders(req.user.id);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching orders' });
  }
});

/**
 * GET /api/client/test-email
 * Test email configuration (for debugging)
 * Query params: ?email=your-email@example.com (optional, defaults to EMAIL_USER)
 */
router.get('/test-email', async (req, res) => {
  try {
    const { sendVerificationCode } = require('../config/email');
    
    // Check email configuration
    const emailConfig = {
      EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com (default)',
      EMAIL_PORT: process.env.EMAIL_PORT || '587 (default)',
      EMAIL_USER: process.env.EMAIL_USER || '❌ NOT SET',
      EMAIL_PASS: process.env.EMAIL_PASS ? '✅ Set (hidden)' : '❌ NOT SET',
      configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    };
    
    console.log('\n🧪 Testing Email Configuration...\n');
    console.log('📧 Email Configuration:');
    console.log('   EMAIL_HOST:', emailConfig.EMAIL_HOST);
    console.log('   EMAIL_PORT:', emailConfig.EMAIL_PORT);
    console.log('   EMAIL_USER:', emailConfig.EMAIL_USER);
    console.log('   EMAIL_PASS:', emailConfig.EMAIL_PASS);
    console.log('');
    
    // Determine test email address
    const testEmail = req.query.email || process.env.EMAIL_USER || 'test@example.com';
    const testCode = '123456';
    
    if (!emailConfig.configured) {
      return res.status(400).json({
        success: false,
        message: 'Email not configured!',
        data: {
          emailConfig,
          instructions: 'Add EMAIL_USER and EMAIL_PASS to .env file'
        }
      });
    }
    
    console.log('📤 Sending test email...');
    console.log('   To:', testEmail);
    console.log('   Code:', testCode);
    console.log('');
    
    const result = await sendVerificationCode(testEmail, testCode);
    
    const emailSent = result.messageId && 
                     result.messageId !== 'console-log' && 
                     result.messageId !== 'console-log-fallback';
    
    if (emailSent) {
      console.log('✅ Email sent successfully!');
      console.log('   Message ID:', result.messageId);
      console.log('   Check your inbox:', testEmail);
    } else {
      console.log('❌ Email failed to send');
      console.log('   Check error messages above');
    }
    
    res.json({
      success: true,
      message: emailSent 
        ? 'Email test completed successfully! Check your inbox.' 
        : 'Email test completed but failed to send. Check server logs.',
      data: {
        emailSent,
        messageId: result.messageId,
        testEmail: testEmail,
        testCode: testCode,
        emailConfig: {
          EMAIL_HOST: emailConfig.EMAIL_HOST,
          EMAIL_PORT: emailConfig.EMAIL_PORT,
          EMAIL_USER: emailConfig.EMAIL_USER,
          EMAIL_PASS_SET: !!process.env.EMAIL_PASS
        }
      }
    });
  } catch (error) {
    console.error('❌ Test email error:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Error testing email: ' + error.message,
      error: error.message
    });
  }
});

module.exports = router;

