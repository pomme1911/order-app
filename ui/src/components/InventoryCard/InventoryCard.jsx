import { formatPrice, getStockStatus } from '../../utils/helpers';
import { STOCK_STATUS_LABELS } from '../../utils/constants';
import './InventoryCard.css';

/**
 * 재고 카드 컴포넌트
 */
const InventoryCard = ({ item, onUpdateStock }) => {
    const stockStatus = getStockStatus(item.currentStock);

    const getStatusClass = () => {
        switch (stockStatus) {
            case 'sufficient':
                return 'stock-sufficient';
            case 'low':
                return 'stock-low';
            case 'out':
                return 'stock-out';
            default:
                return '';
        }
    };

    const handleStockChange = (delta) => {
        const newStock = Math.max(0, Math.min(999, item.currentStock + delta));
        onUpdateStock(item.menuId, newStock);
    };

    const handleQuickAdd = (amount) => {
        const newStock = Math.min(999, item.currentStock + amount);
        onUpdateStock(item.menuId, newStock);
    };

    return (
        <div className={`inventory-card ${stockStatus === 'out' ? 'out-of-stock' : ''}`}>
            <div className="inventory-image">
                <img src={item.imageUrl || '/placeholder-coffee.jpg'} alt={item.menuName} />
                <span className="category-badge">{item.category}</span>
            </div>

            <div className="inventory-info">
                <h4 className="inventory-name">{item.menuName}</h4>
                <div className={`stock-status ${getStatusClass()}`}>
                    {STOCK_STATUS_LABELS[stockStatus]}
                </div>
                <div className="stock-quantity">
                    재고: <span className="quantity-value">{item.currentStock}개</span>
                </div>
            </div>

            <div className="inventory-controls">
                <div className="stock-adjuster">
                    <button
                        className="adjust-btn"
                        onClick={() => handleStockChange(-1)}
                        disabled={item.currentStock === 0}
                    >
                        −
                    </button>
                    <span className="stock-display">{item.currentStock}</span>
                    <button
                        className="adjust-btn"
                        onClick={() => handleStockChange(1)}
                        disabled={item.currentStock >= 999}
                    >
                        +
                    </button>
                </div>
                <div className="quick-add">
                    <button className="quick-btn" onClick={() => handleQuickAdd(10)}>
                        +10
                    </button>
                    <button className="quick-btn" onClick={() => handleQuickAdd(50)}>
                        +50
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryCard;
