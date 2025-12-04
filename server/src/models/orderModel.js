const { query, pool } = require('../config/database');

/**
 * 주문 모델
 * 주문 관련 데이터베이스 쿼리 함수
 */

/**
 * 주문 생성
 * @param {Object} orderData - 주문 데이터
 * @param {Array} orderData.items - 주문 아이템 목록
 * @param {number} orderData.total_amount - 총 금액
 * @param {number} orderData.total_quantity - 총 수량
 * @returns {Promise<Object>} 생성된 주문 정보
 */
const createOrder = async (orderData) => {
    const { items, total_amount, total_quantity } = orderData;

    const queryText = `
    INSERT INTO orders (order_items, total_amount, total_quantity, status)
    VALUES ($1, $2, $3, 'pending')
    RETURNING id, order_date, order_items, total_amount, total_quantity, status, created_at
  `;

    const result = await query(queryText, [
        JSON.stringify(items),
        total_amount,
        total_quantity
    ]);

    return result.rows[0];
};

/**
 * 주문 목록 조회
 * @param {string} status - 주문 상태 필터 (선택사항)
 * @param {number} limit - 조회할 주문 수 (기본값: 20)
 * @param {number} offset - 페이지네이션 오프셋 (기본값: 0)
 * @returns {Promise<Object>} 주문 목록 및 페이지네이션 정보
 */
const getAllOrders = async (status, limit = 20, offset = 0) => {
    let queryText = 'SELECT * FROM orders WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
        queryText += ` AND status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }

    queryText += ' ORDER BY order_date DESC';
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // 전체 개수 조회
    let countQuery = 'SELECT COUNT(*) FROM orders WHERE 1=1';
    const countParams = [];
    if (status) {
        countQuery += ' AND status = $1';
        countParams.push(status);
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return {
        orders: result.rows,
        pagination: {
            total,
            limit,
            offset
        }
    };
};

/**
 * 주문 상세 조회
 * @param {number} orderId - 주문 ID
 * @returns {Promise<Object|null>} 주문 정보
 */
const getOrderById = async (orderId) => {
    const queryText = 'SELECT * FROM orders WHERE id = $1';
    const result = await query(queryText, [orderId]);
    return result.rows[0] || null;
};

/**
 * 주문 상태 변경
 * @param {number} orderId - 주문 ID
 * @param {string} status - 새로운 상태
 * @returns {Promise<Object|null>} 업데이트된 주문 정보
 */
const updateOrderStatus = async (orderId, status) => {
    const queryText = `
    UPDATE orders
    SET status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, status, updated_at
  `;

    const result = await query(queryText, [status, orderId]);
    return result.rows[0] || null;
};

/**
 * 재고 차감 (트랜잭션)
 * @param {Array} orderItems - 주문 아이템 목록
 * @returns {Promise<Array>} 재고 업데이트 결과
 */
const deductStock = async (orderItems) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const stockUpdates = [];

        for (const item of orderItems) {
            const { menu_id, menu_name, quantity } = item;

            // 현재 재고 확인
            const checkQuery = 'SELECT stock FROM menus WHERE id = $1 FOR UPDATE';
            const checkResult = await client.query(checkQuery, [menu_id]);

            if (checkResult.rows.length === 0) {
                throw new Error(`메뉴를 찾을 수 없습니다: ${menu_name}`);
            }

            const currentStock = checkResult.rows[0].stock;

            if (currentStock < quantity) {
                throw new Error(`재고가 부족합니다: ${menu_name} (필요: ${quantity}, 재고: ${currentStock})`);
            }

            // 재고 차감
            const updateQuery = `
        UPDATE menus
        SET stock = stock - $1,
            quantity = stock - $1,
            is_available = CASE WHEN (stock - $1) > 0 THEN true ELSE false END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, name, stock, quantity, is_available
      `;

            const updateResult = await client.query(updateQuery, [quantity, menu_id]);

            stockUpdates.push({
                menu_id,
                menu_name,
                previous_stock: currentStock,
                new_stock: updateResult.rows[0].stock
            });
        }

        await client.query('COMMIT');
        return stockUpdates;

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deductStock
};
