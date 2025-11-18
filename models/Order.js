const pool = require('../config/database');

class Order {
  /**
   * Create a new order from panier
   */
  static async create(clientId, panierId, totalAmount, deliveryFee, locationType, etage, address, phone, clientName) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Try to create order with all new columns, fallback if they don't exist
      let orderQuery;
      let orderResult;
      
      try {
        orderQuery = `
          INSERT INTO orders (client_id, panier_id, total_amount, delivery_fee, location_type, etage, address, phone, client_name, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
          RETURNING *
        `;
        orderResult = await client.query(orderQuery, [
          clientId, panierId, totalAmount, deliveryFee, locationType, etage, address, phone, clientName
        ]);
      } catch (err) {
        // If new columns don't exist, use basic order creation
        if (err.code === '42703' || err.message.includes('delivery_fee') || err.message.includes('location_type')) {
          orderQuery = `
            INSERT INTO orders (client_id, panier_id, total_amount, status)
            VALUES ($1, $2, $3, 'pending')
            RETURNING *
          `;
          orderResult = await client.query(orderQuery, [clientId, panierId, totalAmount]);
        } else {
          throw err;
        }
      }
      
      const order = orderResult.rows[0];

      // Copy panier items to order items with supplier information
      // Try with supplier columns first, fallback if they don't exist
      let itemsQuery;
      try {
        itemsQuery = `
          INSERT INTO order_items (order_id, product_id, supplier_id, supplier_name, quantity, price_at_time)
          SELECT 
            $1, 
            pi.product_id, 
            p.supplier_id,
            s.name as supplier_name,
            pi.quantity, 
            pi.price_at_time
          FROM panier_items pi
          JOIN products p ON pi.product_id = p.id
          JOIN suppliers s ON p.supplier_id = s.id
          WHERE pi.panier_id = $2
          RETURNING *
        `;
        var itemsResult = await client.query(itemsQuery, [order.id, panierId]);
      } catch (err) {
        // If supplier columns don't exist, insert without them
        if (err.code === '42703' || err.message.includes('supplier_id') || err.message.includes('supplier_name')) {
          itemsQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
            SELECT 
              $1, 
              pi.product_id, 
              pi.quantity, 
              pi.price_at_time
            FROM panier_items pi
            WHERE pi.panier_id = $2
            RETURNING *
          `;
          itemsResult = await client.query(itemsQuery, [order.id, panierId]);
        } else {
          throw err;
        }
      }
      
      // Clear panier items
      await client.query('DELETE FROM panier_items WHERE panier_id = $1', [panierId]);
      
      await client.query('COMMIT');
      
      return {
        order,
        items: itemsResult.rows
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get order by ID
   */
  static async findById(orderId) {
    const query = `
      SELECT 
        o.*,
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
      WHERE o.id = $1
      GROUP BY o.id, o.delivery_fee, o.location_type, o.etage, o.address, o.phone, o.client_name
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, orderId]);
    return result.rows[0];
  }
}

module.exports = Order;

