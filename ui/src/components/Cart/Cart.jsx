import { formatPrice } from '../../utils/helpers';
import './Cart.css';

/**
 * 장바구니 컴포넌트
 */
const Cart = ({ cart, onUpdateQuantity, onRemove, onOrder }) => {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleQuantityChange = (itemId, delta) => {
        const item = cart.find((i) => i.id === itemId);
        if (item) {
            onUpdateQuantity(itemId, item.quantity + delta);
        }
    };

    return (
        <div className="cart">
            <div className="cart-header">
                <h2>🛒 장바구니</h2>
                <span className="cart-count">({totalQuantity}개)</span>
            </div>

            <div className="cart-items">
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <p>장바구니가 비어있습니다</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="item-info">
                                <h4 className="item-name">
                                    {item.menuName}
                                    <span className="item-options">
                                        ({item.size}, {item.temperature})
                                    </span>
                                </h4>
                                <p className="item-price">
                                    {formatPrice(item.unitPrice)} × {item.quantity}
                                </p>
                            </div>
                            <div className="item-controls">
                                <div className="quantity-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.id, -1)}
                                    >
                                        −
                                    </button>
                                    <span className="quantity">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => handleQuantityChange(item.id, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemove(item.id)}
                                    title="삭제"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="item-total">
                                {formatPrice(item.totalPrice)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>총 수량</span>
                    <span>{totalQuantity}개</span>
                </div>
                <div className="summary-row total">
                    <span>총 금액</span>
                    <span className="total-amount">{formatPrice(totalAmount)}</span>
                </div>
            </div>

            <button
                className="order-btn btn btn-primary"
                onClick={onOrder}
                disabled={cart.length === 0}
            >
                주문하기 ({formatPrice(totalAmount)})
            </button>
        </div>
    );
};

export default Cart;
