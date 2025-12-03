import { formatPrice, formatTime } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../utils/constants';
import './OrderTable.css';

/**
 * 주문 테이블 컴포넌트
 */
const OrderTable = ({ orders, onUpdateStatus, onViewDetail }) => {
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

    return (
        <div className="order-table-container">
            <div className="table-header">
                <h3>📋 주문 관리</h3>
                <button className="refresh-btn" onClick={() => window.location.reload()}>
                    🔄 새로고침
                </button>
            </div>

            <div className="table-wrapper">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>주문 ID</th>
                            <th>메뉴</th>
                            <th>수량</th>
                            <th>금액</th>
                            <th>시간</th>
                            <th>상태</th>
                            <th>액션</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="empty-row">
                                    주문 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.orderId}>
                                    <td>#{order.orderId}</td>
                                    <td className="menu-cell">
                                        {order.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="menu-item">
                                                {item.menuName} ({item.size}, {item.temperature}) x{item.quantity}
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <div className="more-items">외 {order.items.length - 2}개</div>
                                        )}
                                    </td>
                                    <td>{order.totalQuantity}개</td>
                                    <td className="price-cell">{formatPrice(order.totalAmount)}</td>
                                    <td>{formatTime(order.orderDate)}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        {order.status === 'pending' && (
                                            <>
                                                <button
                                                    className="btn-sm btn-success"
                                                    onClick={() => onUpdateStatus(order.orderId, 'completed')}
                                                >
                                                    완료
                                                </button>
                                                <button
                                                    className="btn-sm btn-danger"
                                                    onClick={() => onUpdateStatus(order.orderId, 'cancelled')}
                                                >
                                                    취소
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="btn-sm btn-secondary"
                                            onClick={() => onViewDetail(order)}
                                        >
                                            상세
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderTable;
