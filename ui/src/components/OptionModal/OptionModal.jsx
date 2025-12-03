import { useState } from 'react';
import {
    SIZE_OPTIONS,
    SIZE_CONFIG,
    TEMPERATURE_OPTIONS,
    TEMPERATURE_LABELS,
} from '../../utils/constants';
import { formatPrice } from '../../utils/helpers';
import './OptionModal.css';

/**
 * 옵션 선택 모달 컴포넌트
 */
const OptionModal = ({ menu, onClose, onAddToCart }) => {
    const [size, setSize] = useState(SIZE_OPTIONS.MEDIUM);
    const [temperature, setTemperature] = useState(TEMPERATURE_OPTIONS.HOT);
    const [quantity, setQuantity] = useState(1);

    if (!menu) return null;

    const calculatePrice = () => {
        const sizePrice = SIZE_CONFIG[size].price;
        return (menu.basePrice + sizePrice) * quantity;
    };

    const handleAddToCart = () => {
        const item = {
            menuId: menu.id,
            menuName: menu.name,
            size: SIZE_CONFIG[size].label,
            temperature: TEMPERATURE_LABELS[temperature],
            quantity,
            unitPrice: menu.basePrice + SIZE_CONFIG[size].price,
        };
        onAddToCart(item);
        onClose();
    };

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="modal-header">
                    <img
                        src={menu.imageUrl || '/placeholder-coffee.jpg'}
                        alt={menu.name}
                        className="modal-image"
                    />
                    <h2 className="modal-title">{menu.name}</h2>
                    <p className="modal-base-price">{formatPrice(menu.basePrice)}</p>
                </div>

                <div className="modal-body">
                    {/* 사이즈 선택 */}
                    <div className="option-group">
                        <h3 className="option-label">사이즈</h3>
                        <div className="option-buttons">
                            {Object.entries(SIZE_CONFIG).map(([key, config]) => (
                                <button
                                    key={key}
                                    className={`option-btn ${size === key ? 'active' : ''}`}
                                    onClick={() => setSize(key)}
                                >
                                    <span className="option-name">{config.label}</span>
                                    {config.price > 0 && (
                                        <span className="option-price">+{formatPrice(config.price)}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 온도 선택 */}
                    <div className="option-group">
                        <h3 className="option-label">온도</h3>
                        <div className="option-buttons">
                            {Object.entries(TEMPERATURE_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    className={`option-btn ${temperature === key ? 'active' : ''}`}
                                    onClick={() => setTemperature(key)}
                                >
                                    <span className="option-name">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 수량 선택 */}
                    <div className="option-group">
                        <h3 className="option-label">수량</h3>
                        <div className="quantity-selector">
                            <button
                                className="qty-btn"
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                −
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                                className="qty-btn"
                                onClick={() => handleQuantityChange(1)}
                                disabled={quantity >= 99}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="final-price">
                        <span>최종 가격</span>
                        <span className="price-amount">{formatPrice(calculatePrice())}</span>
                    </div>
                    <button className="add-to-cart-btn btn btn-primary" onClick={handleAddToCart}>
                        장바구니 담기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OptionModal;
