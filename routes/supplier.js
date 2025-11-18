const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/database');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const { generateToken } = require('../utils/jwt');
const { authenticateSupplier } = require('../middleware/auth');

/**
 * POST /api/supplier/register
 * Register a new supplier
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and password are required' 
      });
    }

    // Check if supplier already exists
    const existingSupplier = await Supplier.findByEmail(email);
    if (existingSupplier) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create supplier
    const supplier = await Supplier.create(name, email, hashedPassword, phone, address);

    // Generate JWT token
    const token = generateToken({
      id: supplier.id,
      email: supplier.email,
      role: 'supplier'
    });

    res.status(201).json({
      success: true,
      message: 'Supplier registered successfully',
      data: {
        token,
        supplier: {
          id: supplier.id,
          name: supplier.name,
          email: supplier.email
        }
      }
    });
  } catch (error) {
    console.error('Supplier registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

/**
 * POST /api/supplier/login
 * Login supplier
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

    const supplier = await Supplier.findByEmail(email);

    if (!supplier) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, supplier.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken({
      id: supplier.id,
      email: supplier.email,
      role: 'supplier'
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        supplier: {
          id: supplier.id,
          name: supplier.name,
          email: supplier.email
        }
      }
    });
  } catch (error) {
    console.error('Supplier login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

/**
 * POST /api/supplier/products
 * Create a new product
 */
router.post('/products', authenticateSupplier, async (req, res) => {
  try {
    const { name, image, price, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and price are required' 
      });
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Price must be a positive number' 
      });
    }

    const product = await Product.create(
      req.user.id,
      name,
      image || null,
      parseFloat(price),
      description || null
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error creating product' });
  }
});

/**
 * GET /api/supplier/products
 * Get all products for the supplier
 */
router.get('/products', authenticateSupplier, async (req, res) => {
  try {
    const products = await Product.findAll(req.user.id);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching products' });
  }
});

/**
 * PUT /api/supplier/products/:id
 * Update a product
 */
router.put('/products/:id', authenticateSupplier, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, price, description, available } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and price are required' 
      });
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Price must be a positive number' 
      });
    }

    const product = await Product.update(
      id,
      req.user.id,
      name,
      image || null,
      parseFloat(price),
      description || null,
      available !== undefined ? available : true
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to update it' 
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

/**
 * DELETE /api/supplier/products/:id
 * Delete a product
 */
router.delete('/products/:id', authenticateSupplier, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.delete(id, req.user.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found or you do not have permission to delete it' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: product
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});

/**
 * POST /api/supplier/offers
 * Create a new offer
 */
router.post('/offers', authenticateSupplier, async (req, res) => {
  try {
    const { name, description, discount_percentage, start_date, end_date, product_ids } = req.body;

    if (!name || !discount_percentage || !start_date || !end_date || !product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, discount_percentage, start_date, end_date, and product_ids array are required' 
      });
    }

    if (isNaN(discount_percentage) || parseFloat(discount_percentage) < 0 || parseFloat(discount_percentage) > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Discount percentage must be between 0 and 100' 
      });
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid date format' 
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date must be after start date' 
      });
    }

    // Create offer
    const offer = await Offer.create(
      req.user.id,
      name,
      description || null,
      parseFloat(discount_percentage),
      startDate,
      endDate
    );

    // Add products to offer
    await Offer.addProducts(offer.id, product_ids);

    // Get offer with products
    const offerWithProducts = await Offer.findById(offer.id);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: offerWithProducts
    });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ success: false, message: 'Server error creating offer' });
  }
});

/**
 * GET /api/supplier/offers
 * Get all offers for the supplier
 */
router.get('/offers', authenticateSupplier, async (req, res) => {
  try {
    const offers = await Offer.findBySupplier(req.user.id);
    res.json({ success: true, data: offers });
  } catch (error) {
    console.error('Get offers error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching offers' });
  }
});

/**
 * GET /api/supplier/orders
 * Get all orders for the supplier (orders containing their products)
 */
router.get('/orders', authenticateSupplier, async (req, res) => {
  try {
    // Check if supplier_id column exists in order_items, if not use products join
    const query = `
      SELECT 
        o.id,
        o.total_amount,
        o.delivery_fee,
        o.status,
        o.created_at,
        o.location_type,
        o.etage,
        o.address,
        o.phone,
        o.client_name,
        c.email as client_email,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', p.name,
            'product_image', p.image,
            'supplier_id', COALESCE(oi.supplier_id, p.supplier_id),
            'supplier_name', COALESCE(oi.supplier_name, s.name),
            'quantity', oi.quantity,
            'price_at_time', oi.price_at_time
          )
        ) FILTER (WHERE p.supplier_id = $1) as items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN suppliers s ON p.supplier_id = s.id
      JOIN clients c ON o.client_id = c.id
      WHERE p.supplier_id = $1
      GROUP BY o.id, o.total_amount, o.delivery_fee, o.status, o.created_at, o.location_type, o.etage, o.address, o.phone, o.client_name, c.email
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get supplier orders error:', error);
    console.error('Error details:', error.message, error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

