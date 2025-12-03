import { formatPrice, formatDate } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../utils/constants';
import './OrderDetailModal.css';

/**
 * 주문 상세 모달 컴포넌트
 */
const OrderDetailModal = ({ order, onClose, onUpdateStatus }) => {
    if (!order) return null;

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const handleComplete = () => {
        if (window.confirm('주문을 완료 처리하시겠습니까?')) {
            onUpdateStatus(order.orderId, 'completed');
            onClose();
        }
    };

    const handleCancel = () => {
        if (window.confirm('주문을 취소하시겠습니까?')) {
            onUpdateStatus(order.orderId, 'cancelled');
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content order-detail-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    ×
                </button>

                <div className="modal-header">
                    <h2>주문 #{order.orderId}</h2>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                    </span>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3>주문 정보</h3>
                        <div className="detail-row">
                            <span className="label">주문 시간:</span>
                            <span className="value">{formatDate(order.orderDate)}</span>
                        </div>
                        <div className="detail-row">
                            <span className="label">총 수량:</span>
                            <span className="value">{order.totalQuantity}개</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>주문 메뉴</h3>
                        <div className="order-items">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="order-item-detail">
                                    <div className="item-header">
                                        <span className="item-name">{item.menuName}</span>
                                        <span className="item-total">{formatPrice(item.totalPrice)}</span>
                                    </div>
                                    <div className="item-options">
                                        {item.size} / {item.temperature} × {item.quantity}개
                                    </div>
                                    <div className="item-price">
                                        {formatPrice(item.unitPrice)} × {item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section total-section">
                        <div className="total-row">
                            <span className="total-label">총 금액</span>
                            <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    {order.status === 'pending' && (
                        <>
                            <button className="btn btn-success" onClick={handleComplete}>
                                주문 완료
                            </button>
                            <button className="btn btn-danger" onClick={handleCancel}>
                                주문 취소
                            </button>
                        </>
                    )}
                    <button className="btn btn-secondary" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
