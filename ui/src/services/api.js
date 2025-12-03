import { API_BASE_URL } from '../utils/constants';

/**
 * API 요청 헬퍼 함수
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;
    }
};

/**
 * 메뉴 API
 */
export const menuApi = {
    // 모든 메뉴 조회
    getAll: () => apiRequest('/menus'),

    // 특정 메뉴 조회
    getById: (id) => apiRequest(`/menus/${id}`),

    // 카테고리별 메뉴 조회
    getByCategory: (category) => apiRequest(`/menus?category=${category}`),
};

/**
 * 주문 API
 */
export const orderApi = {
    // 모든 주문 조회
    getAll: () => apiRequest('/orders'),

    // 특정 주문 조회
    getById: (id) => apiRequest(`/orders/${id}`),

    // 주문 생성
    create: (orderData) => apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    }),

    // 주문 상태 업데이트
    updateStatus: (id, status) => apiRequest(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    }),

    // 주문 취소
    cancel: (id) => apiRequest(`/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'cancelled' }),
    }),
};

/**
 * 재고 API
 */
export const inventoryApi = {
    // 모든 재고 조회
    getAll: () => apiRequest('/inventory'),

    // 특정 재고 조회
    getById: (menuId) => apiRequest(`/inventory/${menuId}`),

    // 재고 업데이트
    update: (menuId, stock) => apiRequest(`/inventory/${menuId}`, {
        method: 'PATCH',
        body: JSON.stringify({ stock }),
    }),

    // 재고 증가
    increase: (menuId, amount) => apiRequest(`/inventory/${menuId}/increase`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
    }),

    // 재고 감소
    decrease: (menuId, amount) => apiRequest(`/inventory/${menuId}/decrease`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
    }),
};

/**
 * 통계 API
 */
export const statsApi = {
    // 오늘 통계 조회
    getToday: () => apiRequest('/stats/today'),

    // 전체 통계 조회
    getAll: () => apiRequest('/stats'),
};
