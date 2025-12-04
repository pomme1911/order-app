const { query } = require('../config/database');

/**
 * 메뉴 모델
 * 메뉴 관련 데이터베이스 쿼리 함수
 */

/**
 * 메뉴 목록 조회
 * @param {string} category - 카테고리 필터 (선택사항)
 * @param {boolean} available - 판매 가능 여부 필터 (선택사항)
 * @returns {Promise<Array>} 메뉴 목록
 */
const getAllMenus = async (category, available) => {
    let queryText = 'SELECT * FROM menus WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
        queryText += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
    }

    if (available !== undefined) {
        queryText += ` AND is_available = $${paramIndex}`;
        params.push(available);
        paramIndex++;
    }

    queryText += ' ORDER BY id ASC';

    const result = await query(queryText, params);
    return result.rows;
};

/**
 * 메뉴 상세 조회
 * @param {number} menuId - 메뉴 ID
 * @returns {Promise<Object|null>} 메뉴 정보
 */
const getMenuById = async (menuId) => {
    const queryText = 'SELECT * FROM menus WHERE id = $1';
    const result = await query(queryText, [menuId]);
    return result.rows[0] || null;
};

/**
 * 메뉴 옵션 조회
 * @param {number} menuId - 메뉴 ID
 * @returns {Promise<Object>} 옵션 정보 (size, temperature별 그룹화)
 */
const getMenuOptions = async (menuId) => {
    const queryText = `
    SELECT id, option_name, option_type, option_price, is_default
    FROM options
    WHERE menu_id = $1
    ORDER BY option_type, option_price ASC
  `;

    const result = await query(queryText, [menuId]);

    // 옵션을 타입별로 그룹화
    const groupedOptions = {
        size: [],
        temperature: []
    };

    result.rows.forEach(option => {
        if (groupedOptions[option.option_type]) {
            groupedOptions[option.option_type].push({
                id: option.id,
                option_name: option.option_name,
                option_price: option.option_price,
                is_default: option.is_default
            });
        }
    });

    return groupedOptions;
};

/**
 * 메뉴 재고 수정
 * @param {number} menuId - 메뉴 ID
 * @param {number} stock - 새로운 재고 수량
 * @returns {Promise<Object|null>} 업데이트된 메뉴 정보
 */
const updateMenuStock = async (menuId, stock) => {
    const queryText = `
    UPDATE menus
    SET stock = $1,
        quantity = $1,
        is_available = CASE WHEN $1 > 0 THEN true ELSE false END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, name, stock, quantity, is_available
  `;

    const result = await query(queryText, [stock, menuId]);
    return result.rows[0] || null;
};

module.exports = {
    getAllMenus,
    getMenuById,
    getMenuOptions,
    updateMenuStock
};
