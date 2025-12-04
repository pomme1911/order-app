import apiRequest from './client';

/**
 * 메뉴 관련 API 함수
 */

/**
 * 메뉴 목록 조회
 * @param {Object} params - 쿼리 파라미터
 * @param {string} params.category - 카테고리 필터
 * @param {boolean} params.available - 판매 가능 여부 필터
 * @returns {Promise<Array>} 메뉴 목록
 */
export const getMenus = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.category) {
        queryParams.append('category', params.category);
    }

    if (params.available !== undefined) {
        queryParams.append('available', params.available);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/menus?${queryString}` : '/menus';

    const response = await apiRequest(endpoint);
    return response.data;
};

/**
 * 메뉴 상세 조회
 * @param {number} menuId - 메뉴 ID
 * @returns {Promise<Object>} 메뉴 정보
 */
export const getMenuById = async (menuId) => {
    const response = await apiRequest(`/menus/${menuId}`);
    return response.data;
};

/**
 * 메뉴 옵션 조회
 * @param {number} menuId - 메뉴 ID
 * @returns {Promise<Object>} 옵션 정보 (size, temperature)
 */
export const getMenuOptions = async (menuId) => {
    const response = await apiRequest(`/menus/${menuId}/options`);
    return response.data;
};

/**
 * 메뉴 재고 수정 (관리자)
 * @param {number} menuId - 메뉴 ID
 * @param {number} stock - 새로운 재고 수량
 * @returns {Promise<Object>} 업데이트된 메뉴 정보
 */
export const updateMenuStock = async (menuId, stock) => {
    const response = await apiRequest(`/menus/${menuId}`, {
        method: 'PATCH',
        body: JSON.stringify({ stock }),
    });
    return response.data;
};
