const pool = require('../config/database');

class Client {
  /**
   * Create a new client
   */
  static async create(email, verificationCode, codeExpiresAt) {
    const query = `
      INSERT INTO clients (email, verification_code, verification_code_expires_at)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [email, verificationCode, codeExpiresAt]);
    return result.rows[0];
  }

  /**
   * Find client by email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM clients WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find client by ID
   */
  static async findById(id) {
    const query = 'SELECT id, email, verified, panier_id, phone, location_type, etage, address, created_at FROM clients WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Verify client email
   */
  static async verifyEmail(email, verificationCode) {
    const query = `
      UPDATE clients 
      SET verified = TRUE, verification_code = NULL, verification_code_expires_at = NULL
      WHERE email = $1 AND verification_code = $2 AND verification_code_expires_at > NOW()
      RETURNING *
    `;
    const result = await pool.query(query, [email, verificationCode]);
    return result.rows[0];
  }

  /**
   * Update verification code
   */
  static async updateVerificationCode(email, verificationCode, codeExpiresAt) {
    const query = `
      UPDATE clients 
      SET verification_code = $1, verification_code_expires_at = $2
      WHERE email = $3
      RETURNING *
    `;
    const result = await pool.query(query, [verificationCode, codeExpiresAt, email]);
    return result.rows[0];
  }

  /**
   * Set password for client
   */
  static async setPassword(email, hashedPassword) {
    const query = `
      UPDATE clients 
      SET password = $1
      WHERE email = $2 AND verified = TRUE
      RETURNING id, email, verified, panier_id, phone, location_type, etage, address
    `;
    const result = await pool.query(query, [hashedPassword, email]);
    return result.rows[0];
  }

  /**
   * Update client profile (location, phone, etc.)
   */
  static async updateProfile(clientId, phone, locationType, etage, address) {
    const query = `
      UPDATE clients 
      SET phone = $1, location_type = $2, etage = $3, address = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, email, phone, location_type, etage, address
    `;
    const result = await pool.query(query, [phone, locationType, etage, address, clientId]);
    return result.rows[0];
  }

  /**
   * Get client profile
   */
  static async getProfile(clientId) {
    const query = `
      SELECT id, email, phone, location_type, etage, address, panier_id
      FROM clients
      WHERE id = $1
    `;
    const result = await pool.query(query, [clientId]);
    return result.rows[0];
  }

  /**
   * Update panier_id for client
   */
  static async updatePanierId(clientId, panierId) {
    const query = `
      UPDATE clients 
      SET panier_id = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [panierId, clientId]);
    return result.rows[0];
  }

  /**
   * Get client orders
   */
  static async getOrders(clientId) {
    const query = `
      SELECT 
        o.id,
        o.total_amount,
        o.delivery_fee,
        o.status,
        o.location_type,
        o.etage,
        o.address,
        o.created_at,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', p.name,
            'product_image', p.image,
            'supplier_id', oi.supplier_id,
            'supplier_name', oi.supplier_name,
            'quantity', oi.quantity,
            'price_at_time', oi.price_at_time
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.client_id = $1
      GROUP BY o.id, o.total_amount, o.delivery_fee, o.status, o.location_type, o.etage, o.address, o.created_at
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [clientId]);
    return result.rows;
  }
}

module.exports = Client;

