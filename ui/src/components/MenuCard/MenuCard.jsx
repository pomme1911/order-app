import { formatPrice } from '../../utils/helpers';
import './MenuCard.css';

/**
 * 메뉴 카드 컴포넌트
 */
const MenuCard = ({ menu, onSelect }) => {
    const isAvailable = menu.stock > 0;

    const handleClick = () => {
        if (isAvailable) {
            onSelect(menu);
        }
    };

    return (
        <div
            className={`menu-card ${!isAvailable ? 'out-of-stock' : ''}`}
            onClick={handleClick}
        >
            <div className="menu-image">
                <img src={menu.imageUrl || '/placeholder-coffee.jpg'} alt={menu.name} />
                {!isAvailable && <div className="out-badge">품절</div>}
            </div>
            <div className="menu-info">
                <h3 className="menu-name">{menu.name}</h3>
                <p className="menu-price">{formatPrice(menu.basePrice)}</p>
                <div className="menu-footer">
                    {isAvailable ? (
                        <span className="stock-badge available">재고 있음</span>
                    ) : (
                        <span className="stock-badge out">품절</span>
                    )}
                    {isAvailable && (
                        <button className="add-btn" onClick={handleClick}>
                            + 담기
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
