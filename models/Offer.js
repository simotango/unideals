const pool = require('../config/database');

class Offer {
  /**
   * Create a new offer
   */
  static async create(supplierId, name, description, discountPercentage, startDate, endDate) {
    const query = `
      INSERT INTO offers (supplier_id, name, description, discount_percentage, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [supplierId, name, description, discountPercentage, startDate, endDate]);
    return result.rows[0];
  }

  /**
   * Add products to offer
   */
  static async addProducts(offerId, productIds) {
    const values = productIds.map((productId, index) => 
      `($1, $${index + 2})`
    ).join(', ');
    
    const query = `
      INSERT INTO offer_products (offer_id, product_id)
      VALUES ${values}
      ON CONFLICT (offer_id, product_id) DO NOTHING
      RETURNING *
    `;
    
    const params = [offerId, ...productIds];
    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get all active offers
   */
  static async findAllActive() {
    const query = `
      SELECT 
        o.*,
        s.name as supplier_name,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'image', p.image,
            'price', p.price
          )
        ) as products
      FROM offers o
      JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN offer_products op ON o.id = op.offer_id
      LEFT JOIN products p ON op.product_id = p.id
      WHERE o.active = TRUE 
        AND o.start_date <= NOW() 
        AND o.end_date >= NOW()
      GROUP BY o.id, s.name
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Get offer by ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        o.*,
        s.name as supplier_name,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'image', p.image,
            'price', p.price
          )
        ) as products
      FROM offers o
      JOIN suppliers s ON o.supplier_id = s.id
      LEFT JOIN offer_products op ON o.id = op.offer_id
      LEFT JOIN products p ON op.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id, s.name
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get offers by supplier
   */
  static async findBySupplier(supplierId) {
    const query = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', p.id,
            'name', p.name,
            'image', p.image,
            'price', p.price
          )
        ) as products
      FROM offers o
      LEFT JOIN offer_products op ON o.id = op.offer_id
      LEFT JOIN products p ON op.product_id = p.id
      WHERE o.supplier_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [supplierId]);
    return result.rows;
  }
}

module.exports = Offer;


