// API 기본 URL 설정
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 메뉴 카테고리
export const MENU_CATEGORIES = {
    ALL: 'all',
    ESPRESSO: 'espresso',
    LATTE: 'latte',
    FRAPPE: 'frappe',
    DECAF: 'decaf',
};

// 메뉴 카테고리 레이블
export const CATEGORY_LABELS = {
    [MENU_CATEGORIES.ALL]: '전체',
    [MENU_CATEGORIES.ESPRESSO]: '에스프레소',
    [MENU_CATEGORIES.LATTE]: '라떼',
    [MENU_CATEGORIES.FRAPPE]: '프라페',
    [MENU_CATEGORIES.DECAF]: '디카페인',
};

// 사이즈 옵션
export const SIZE_OPTIONS = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
};

// 사이즈 레이블 및 가격
export const SIZE_CONFIG = {
    [SIZE_OPTIONS.SMALL]: { label: 'Small', price: 0 },
    [SIZE_OPTIONS.MEDIUM]: { label: 'Medium', price: 500 },
    [SIZE_OPTIONS.LARGE]: { label: 'Large', price: 1000 },
};

// 온도 옵션
export const TEMPERATURE_OPTIONS = {
    HOT: 'hot',
    ICED: 'iced',
};

// 온도 레이블
export const TEMPERATURE_LABELS = {
    [TEMPERATURE_OPTIONS.HOT]: 'Hot',
    [TEMPERATURE_OPTIONS.ICED]: 'Iced',
};

// 주문 상태
export const ORDER_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// 주문 상태 레이블
export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: '대기중',
    [ORDER_STATUS.COMPLETED]: '완료',
    [ORDER_STATUS.CANCELLED]: '취소',
};

// 재고 상태
export const STOCK_STATUS = {
    SUFFICIENT: 'sufficient',
    LOW: 'low',
    OUT: 'out',
};

// 재고 상태 레이블
export const STOCK_STATUS_LABELS = {
    [STOCK_STATUS.SUFFICIENT]: '재고 있음',
    [STOCK_STATUS.LOW]: '재고 부족',
    [STOCK_STATUS.OUT]: '품절',
};

// 재고 임계값
export const STOCK_THRESHOLD = {
    LOW: 10,
    OUT: 0,
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
    CART: 'coffee_order_cart',
};
