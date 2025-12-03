/**
 * 가격을 한국 원화 형식으로 포맷팅
 * @param {number} price - 가격
 * @returns {string} 포맷된 가격 문자열 (예: "₩ 5,000")
 */
export const formatPrice = (price) => {
    return `₩ ${price.toLocaleString('ko-KR')}`;
};

/**
 * 날짜를 포맷팅
 * @param {Date|string} date - 날짜
 * @param {boolean} includeTime - 시간 포함 여부
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (date, includeTime = true) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    if (!includeTime) {
        return `${year}-${month}-${day}`;
    }

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 시간만 포맷팅
 * @param {Date|string} date - 날짜
 * @returns {string} 포맷된 시간 문자열 (예: "14:30")
 */
export const formatTime = (date) => {
    const d = new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * 재고 상태 계산
 * @param {number} stock - 재고 수량
 * @returns {string} 재고 상태 ('sufficient' | 'low' | 'out')
 */
export const getStockStatus = (stock) => {
    if (stock === 0) return 'out';
    if (stock <= 10) return 'low';
    return 'sufficient';
};

/**
 * 고유 ID 생성
 * @returns {string} 고유 ID
 */
export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 디바운스 함수
 * @param {Function} func - 실행할 함수
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Function} 디바운스된 함수
 */
export const debounce = (func, delay = 300) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * 로컬 스토리지에 데이터 저장
 * @param {string} key - 키
 * @param {any} value - 값
 */
export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('로컬 스토리지 저장 실패:', error);
    }
};

/**
 * 로컬 스토리지에서 데이터 불러오기
 * @param {string} key - 키
 * @param {any} defaultValue - 기본값
 * @returns {any} 저장된 값 또는 기본값
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('로컬 스토리지 불러오기 실패:', error);
        return defaultValue;
    }
};

/**
 * 로컬 스토리지에서 데이터 삭제
 * @param {string} key - 키
 */
export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('로컬 스토리지 삭제 실패:', error);
    }
};
