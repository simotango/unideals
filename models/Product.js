const pool = require('../config/database');

class Product {
  /**
   * Create a new product
   */
  static async create(supplierId, name, image, price, description) {
    const query = `
      INSERT INTO products (supplier_id, name, image, price, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [supplierId, name, image, price, description]);
    return result.rows[0];
  }

  /**
   * Get all products (with optional supplier filter)
   */
  static async findAll(supplierId = null) {
    let query = `
      SELECT 
        p.*,
        s.name as supplier_name,
        s.email as supplier_email
      FROM products p
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.available = TRUE
    `;
    const params = [];
    
    if (supplierId) {
      query += ' AND p.supplier_id = $1';
      params.push(supplierId);
    }
    
    query += ' ORDER BY p.created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get product by ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        p.*,
        s.name as supplier_name,
        s.email as supplier_email
      FROM products p
      JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Update product
   */
  static async update(id, supplierId, name, image, price, description, available) {
    const query = `
      UPDATE products 
      SET name = $1, image = $2, price = $3, description = $4, available = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND supplier_id = $7
      RETURNING *
    `;
    const result = await pool.query(query, [name, image, price, description, available, id, supplierId]);
    return result.rows[0];
  }

  /**
   * Delete product
   */
  static async delete(id, supplierId) {
    const query = 'DELETE FROM products WHERE id = $1 AND supplier_id = $2 RETURNING *';
    const result = await pool.query(query, [id, supplierId]);
    return result.rows[0];
  }
}

module.exports = Product;


