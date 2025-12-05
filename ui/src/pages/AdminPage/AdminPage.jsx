import { useState, useEffect } from 'react';
import { getMenus } from '../../api/menuApi';
import Sidebar from '../../components/Sidebar/Sidebar';
import OrderTable from '../../components/OrderTable/OrderTable';
import InventoryCard from '../../components/InventoryCard/InventoryCard';
import OrderDetailModal from '../../components/OrderDetailModal/OrderDetailModal';
import './AdminPage.css';

// 임시 주문 데이터
const MOCK_ORDERS = [
    {
        orderId: 1,
        items: [
            {
                menuId: 1,
                menuName: '아메리카노',
                size: 'Medium',
                temperature: 'Iced',
                quantity: 2,
                unitPrice: 4500,
                totalPrice: 9000,
            },
        ],
        totalQuantity: 2,
        totalAmount: 9000,
        orderDate: new Date('2025-12-03T10:30:00'),
        status: 'pending',
    },
    {
        orderId: 2,
        items: [
            {
                menuId: 2,
                menuName: '카페라떼',
                size: 'Large',
                temperature: 'Hot',
                quantity: 1,
                unitPrice: 5500,
                totalPrice: 5500,
            },
            {
                menuId: 4,
                menuName: '바닐라 라떼',
                size: 'Medium',
                temperature: 'Iced',
                quantity: 1,
                unitPrice: 5500,
                totalPrice: 5500,
            },
        ],
        totalQuantity: 2,
        totalAmount: 11000,
        orderDate: new Date('2025-12-03T11:15:00'),
        status: 'completed',
    },
];




/**
 * 관리자 페이지
 */
const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('inventory');
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // 메뉴 데이터 로드
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                setLoading(true);
                const data = await getMenus();
                // API 데이터를 관리자 페이지 형식으로 변환
                const formattedInventory = data.map(menu => ({
                    menuId: menu.id,
                    menuName: menu.name,
                    category: menu.category,
                    imageUrl: menu.image_url,
                    currentStock: menu.stock,
                }));
                setInventory(formattedInventory);
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

    // 통계 계산
    const stats = {
        todayOrderCount: orders.filter((o) => o.status !== 'cancelled').length,
        todayRevenue: orders
            .filter((o) => o.status === 'completed')
            .reduce((sum, o) => sum + o.totalAmount, 0),
        outOfStockCount: inventory.filter((i) => i.currentStock === 0).length,
    };

    // 주문 상태 업데이트
    const handleUpdateOrderStatus = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    // 재고 업데이트
    const handleUpdateStock = (menuId, newStock) => {
        setInventory((prevInventory) =>
            prevInventory.map((item) =>
                item.menuId === menuId ? { ...item, currentStock: newStock } : item
            )
        );
    };

    return (
        <div className="admin-page">
            {/* 사이드바 (38.2%) */}
            <div className="admin-sidebar-section">
                <Sidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    stats={stats}
                />
            </div>

            {/* 메인 컨텐츠 (61.8%) */}
            <div className="admin-main-section">
                {activeSection === 'orders' && (
                    <div className="admin-panel order-panel">
                        <OrderTable
                            orders={orders}
                            onUpdateStatus={handleUpdateOrderStatus}
                            onViewDetail={setSelectedOrder}
                        />
                    </div>
                )}

                {activeSection === 'inventory' && (
                    <div className="admin-panel inventory-panel">
                        <div className="panel-header">
                            <h3>📦 재고 관리</h3>
                        </div>

                        {loading && (
                            <div className="loading-state">
                                <div className="loading-spinner"></div>
                                <p>재고 데이터를 불러오는 중...</p>
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
                            <div className="inventory-grid">
                                {inventory.map((item) => (
                                    <InventoryCard
                                        key={item.menuId}
                                        item={item}
                                        onUpdateStock={handleUpdateStock}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 주문 상세 모달 */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdateStatus={handleUpdateOrderStatus}
                />
            )}
        </div>
    );
};

export default AdminPage;
