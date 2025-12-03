import { useState } from 'react';
import { MENU_CATEGORIES } from '../../utils/constants';
import { useCart } from '../../hooks/useCart';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import MenuCard from '../../components/MenuCard/MenuCard';
import Cart from '../../components/Cart/Cart';
import OptionModal from '../../components/OptionModal/OptionModal';
import './OrderPage.css';

// 임시 메뉴 데이터 (나중에 API로 대체)
const MOCK_MENUS = [
    {
        id: 1,
        name: '아메리카노',
        category: 'espresso',
        basePrice: 4000,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        stock: 50,
    },
    {
        id: 2,
        name: '카페라떼',
        category: 'latte',
        basePrice: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400',
        stock: 30,
    },
    {
        id: 3,
        name: '카푸치노',
        category: 'latte',
        basePrice: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        stock: 25,
    },
    {
        id: 4,
        name: '바닐라 라떼',
        category: 'latte',
        basePrice: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
        stock: 15,
    },
    {
        id: 5,
        name: '카라멜 마끼아또',
        category: 'latte',
        basePrice: 5500,
        imageUrl: 'https://images.unsplash.com/photo-1599750451062-f6f0b3c0f4e5?w=400',
        stock: 20,
    },
    {
        id: 6,
        name: '모카 프라페',
        category: 'frappe',
        basePrice: 6000,
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        stock: 0,
    },
    {
        id: 7,
        name: '에스프레소',
        category: 'espresso',
        basePrice: 3500,
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400',
        stock: 40,
    },
    {
        id: 8,
        name: '디카페인 아메리카노',
        category: 'decaf',
        basePrice: 4500,
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
        stock: 35,
    },
];

/**
 * 주문하기 페이지
 */
const OrderPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(MENU_CATEGORIES.ALL);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const {
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalAmount,
    } = useCart();

    // 카테고리별 메뉴 필터링
    const filteredMenus =
        selectedCategory === MENU_CATEGORIES.ALL
            ? MOCK_MENUS
            : MOCK_MENUS.filter((menu) => menu.category === selectedCategory);

    // 메뉴 선택 시 모달 열기
    const handleMenuSelect = (menu) => {
        setSelectedMenu(menu);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setSelectedMenu(null);
    };

    // 토스트 표시
    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    // 장바구니에 추가
    const handleAddToCart = (item) => {
        addToCart(item);
        showToastMessage(`✓ ${item.menuName}이(가) 장바구니에 추가되었습니다`);
    };

    // 주문하기
    const handleOrder = async () => {
        if (cart.length === 0) return;

        const totalAmount = getTotalAmount();
        const confirmed = window.confirm(
            `총 ${totalAmount.toLocaleString()}원을 주문하시겠습니까?`
        );

        if (confirmed) {
            try {
                // TODO: API 호출로 주문 생성
                console.log('주문 데이터:', {
                    items: cart,
                    totalAmount: totalAmount,
                    orderDate: new Date(),
                });

                showToastMessage('✓ 주문이 완료되었습니다!');
                clearCart();
            } catch (error) {
                console.error('주문 실패:', error);
                showToastMessage('✗ 주문에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <div className="order-page">
            {/* 메뉴 영역 (61.8%) */}
            <div className="menu-section">
                <div className="section-header">
                    <h2>메뉴</h2>
                    <span className="menu-count">{filteredMenus.length}개</span>
                </div>

                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                <div className="menu-grid">
                    {filteredMenus.map((menu) => (
                        <MenuCard key={menu.id} menu={menu} onSelect={handleMenuSelect} />
                    ))}
                </div>

                {filteredMenus.length === 0 && (
                    <div className="empty-menu">
                        <div className="empty-icon">☕</div>
                        <p>해당 카테고리에 메뉴가 없습니다.</p>
                    </div>
                )}
            </div>

            {/* 장바구니 영역 (38.2%) */}
            <div className="cart-section">
                <Cart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onOrder={handleOrder}
                />
            </div>

            {/* 옵션 선택 모달 */}
            {selectedMenu && (
                <OptionModal
                    menu={selectedMenu}
                    onClose={handleCloseModal}
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* 토스트 알림 */}
            {showToast && (
                <div className="toast" role="alert" aria-live="polite">
                    {toastMessage}
                </div>
            )}
        </div>
    );
};

export default OrderPage;
