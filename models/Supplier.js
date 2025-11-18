const pool = require('../config/database');

class Supplier {
  /**
   * Create a new supplier
   */
  static async create(name, email, hashedPassword, phone, address) {
    const query = `
      INSERT INTO suppliers (name, email, password, phone, address)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, phone, address, created_at
    `;
    const result = await pool.query(query, [name, email, hashedPassword, phone, address]);
    return result.rows[0];
  }

  /**
   * Find supplier by email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM suppliers WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Find supplier by ID
   */
  static async findById(id) {
    const query = 'SELECT id, name, email, phone, address, created_at FROM suppliers WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Supplier;


