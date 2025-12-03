import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { saveToLocalStorage, loadFromLocalStorage, generateId } from '../utils/helpers';

/**
 * 장바구니 관리 커스텀 훅
 */
export const useCart = () => {
    const [cart, setCart] = useState(() => {
        return loadFromLocalStorage(STORAGE_KEYS.CART, []);
    });

    // 장바구니 변경 시 로컬 스토리지에 저장
    useEffect(() => {
        saveToLocalStorage(STORAGE_KEYS.CART, cart);
    }, [cart]);

    /**
     * 장바구니에 아이템 추가
     */
    const addToCart = (item) => {
        const cartItem = {
            id: generateId(),
            menuId: item.menuId,
            menuName: item.menuName,
            size: item.size,
            temperature: item.temperature,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
        };

        setCart((prevCart) => [...prevCart, cartItem]);
    };

    /**
     * 장바구니 아이템 수량 변경
     */
    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity: newQuantity, totalPrice: item.unitPrice * newQuantity }
                    : item
            )
        );
    };

    /**
     * 장바구니에서 아이템 제거
     */
    const removeFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    };

    /**
     * 장바구니 비우기
     */
    const clearCart = () => {
        setCart([]);
    };

    /**
     * 총 수량 계산
     */
    const getTotalQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    /**
     * 총 금액 계산
     */
    const getTotalAmount = () => {
        return cart.reduce((total, item) => total + item.totalPrice, 0);
    };

    return {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalQuantity,
        getTotalAmount,
    };
};
