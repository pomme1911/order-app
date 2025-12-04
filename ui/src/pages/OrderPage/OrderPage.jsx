import { useState, useEffect } from 'react';
import { MENU_CATEGORIES } from '../../utils/constants';
import { useCart } from '../../hooks/useCart';
import { getMenus } from '../../api/menuApi';
import { createOrder } from '../../api/orderApi';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import MenuCard from '../../components/MenuCard/MenuCard';
import Cart from '../../components/Cart/Cart';
import OptionModal from '../../components/OptionModal/OptionModal';
import './OrderPage.css';

/**
 * 주문하기 페이지
 */
const OrderPage = () => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    // 메뉴 데이터 로드
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                const data = await getMenus({ available: true });
                // API 데이터를 프론트엔드 형식으로 변환
                const formattedMenus = data.map(menu => ({
                    id: menu.id,
                    name: menu.name,
                    category: menu.category,
                    basePrice: menu.price,
                    imageUrl: menu.image_url,
                    stock: menu.stock,
                    isAvailable: menu.is_available,
                }));
                setMenus(formattedMenus);
                setError(null);
            } catch (err) {
                console.error('메뉴 로드 실패:', err);
                setError('메뉴를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // 카테고리별 메뉴 필터링
    const filteredMenus =
        selectedCategory === MENU_CATEGORIES.ALL
            ? menus
            : menus.filter((menu) => menu.category === selectedCategory);

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
        const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

        const confirmed = window.confirm(
            `총 ${totalAmount.toLocaleString()}원을 주문하시겠습니까?`
        );

        if (confirmed) {
            try {
                // API 호출로 주문 생성
                // 백엔드 포맷(snake_case)으로 변환
                const orderItems = cart.map(item => ({
                    menu_id: item.menuId,
                    menu_name: item.menuName,
                    size: item.size,
                    temperature: item.temperature,
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    total_price: item.totalPrice
                }));

                const orderData = {
                    items: orderItems,
                    total_amount: totalAmount,
                    total_quantity: totalQuantity,
                };

                const result = await createOrder(orderData);
                console.log('주문 성공:', result);

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

                {loading && (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>메뉴를 불러오는 중...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <div className="error-icon">⚠️</div>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>다시 시도</button>
                    </div>
                )}

                {!loading && !error && (
                    <>
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
                    </>
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
