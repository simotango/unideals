const pool = require('../config/database');

class Panier {
  /**
   * Create a new panier for client
   */
  static async create(clientId) {
    const query = `
      INSERT INTO paniers (client_id)
      VALUES ($1)
      RETURNING *
    `;
    const result = await pool.query(query, [clientId]);
    return result.rows[0];
  }

  /**
   * Get panier by ID
   */
  static async findById(panierId) {
    const query = 'SELECT * FROM paniers WHERE id = $1';
    const result = await pool.query(query, [panierId]);
    return result.rows[0];
  }

  /**
   * Get panier with items for client
   */
  static async getPanierWithItems(clientId) {
    const query = `
      SELECT 
        p.id as panier_id,
        p.created_at,
        json_agg(
          json_build_object(
            'id', pi.id,
            'product_id', pi.product_id,
            'product_name', pr.name,
            'product_image', pr.image,
            'quantity', pi.quantity,
            'price_at_time', pi.price_at_time,
            'current_price', pr.price
          )
        ) FILTER (WHERE pi.id IS NOT NULL) as items
      FROM paniers p
      LEFT JOIN panier_items pi ON p.id = pi.panier_id
      LEFT JOIN products pr ON pi.product_id = pr.id
      WHERE p.client_id = $1
      GROUP BY p.id, p.created_at
      ORDER BY p.created_at DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [clientId]);
    return result.rows[0];
  }

  /**
   * Add item to panier
   */
  static async addItem(panierId, productId, quantity, priceAtTime) {
    // Check if item already exists in panier
    const checkQuery = 'SELECT * FROM panier_items WHERE panier_id = $1 AND product_id = $2';
    const checkResult = await pool.query(checkQuery, [panierId, productId]);

    if (checkResult.rows.length > 0) {
      // Update quantity if item exists
      const updateQuery = `
        UPDATE panier_items 
        SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
        WHERE panier_id = $2 AND product_id = $3
        RETURNING *
      `;
      const updateResult = await pool.query(updateQuery, [quantity, panierId, productId]);
      return updateResult.rows[0];
    } else {
      // Insert new item
      const insertQuery = `
        INSERT INTO panier_items (panier_id, product_id, quantity, price_at_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const insertResult = await pool.query(insertQuery, [panierId, productId, quantity, priceAtTime]);
      return insertResult.rows[0];
    }
  }

  /**
   * Update item quantity in panier
   */
  static async updateItemQuantity(panierId, itemId, quantity) {
    const query = `
      UPDATE panier_items 
      SET quantity = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND panier_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, itemId, panierId]);
    return result.rows[0];
  }

  /**
   * Remove item from panier
   */
  static async removeItem(panierId, itemId) {
    const query = 'DELETE FROM panier_items WHERE id = $1 AND panier_id = $2 RETURNING *';
    const result = await pool.query(query, [itemId, panierId]);
    return result.rows[0];
  }

  /**
   * Clear all items from panier
   */
  static async clearItems(panierId) {
    const query = 'DELETE FROM panier_items WHERE panier_id = $1';
    await pool.query(query, [panierId]);
  }
}

module.exports = Panier;


