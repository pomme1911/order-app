/**
 * API 클라이언트 설정
 * 백엔드 API와 통신하기 위한 기본 설정
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * API 요청 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} API 응답
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
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || '요청 처리 중 오류가 발생했습니다.');
        }

        return data;
    } catch (error) {
        console.error('API 요청 에러:', error);
        throw error;
    }
};

export default apiRequest;
