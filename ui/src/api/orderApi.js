import apiRequest from './client';

/**
 * 주문 관련 API 함수
 */

/**
 * 주문 생성
 * @param {Object} orderData - 주문 데이터
 * @param {Array} orderData.items - 주문 아이템 목록
 * @param {number} orderData.total_amount - 총 금액
 * @param {number} orderData.total_quantity - 총 수량
 * @returns {Promise<Object>} 생성된 주문 정보
 */
export const createOrder = async (orderData) => {
    const response = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
    return response.data;
};

/**
 * 주문 목록 조회 (관리자)
 * @param {Object} params - 쿼리 파라미터
 * @param {string} params.status - 주문 상태 필터
 * @param {number} params.limit - 조회할 주문 수
 * @param {number} params.offset - 페이지네이션 오프셋
 * @returns {Promise<Object>} 주문 목록 및 페이지네이션 정보
 */
export const getOrders = async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.status) {
        queryParams.append('status', params.status);
    }

    if (params.limit) {
        queryParams.append('limit', params.limit);
    }

    if (params.offset) {
        queryParams.append('offset', params.offset);
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';

    const response = await apiRequest(endpoint);
    return {
        orders: response.data,
        pagination: response.pagination,
    };
};

/**
 * 주문 상세 조회
 * @param {number} orderId - 주문 ID
 * @returns {Promise<Object>} 주문 정보
 */
export const getOrderById = async (orderId) => {
    const response = await apiRequest(`/orders/${orderId}`);
    return response.data;
};

/**
 * 주문 상태 변경 (관리자)
 * @param {number} orderId - 주문 ID
 * @param {string} status - 새로운 상태 (pending, processing, completed)
 * @returns {Promise<Object>} 업데이트된 주문 정보
 */
export const updateOrderStatus = async (orderId, status) => {
    const response = await apiRequest(`/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
    return response;
};
