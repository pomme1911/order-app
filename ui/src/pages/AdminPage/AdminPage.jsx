import { useState } from 'react';
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

// 임시 재고 데이터
const MOCK_INVENTORY = [
    {
        menuId: 1,
        menuName: '아메리카노',
        category: '에스프레소',
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        currentStock: 50,
    },
    {
        menuId: 2,
        menuName: '카페라떼',
        category: '라떼',
        imageUrl: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400',
        currentStock: 30,
    },
    {
        menuId: 3,
        menuName: '카푸치노',
        category: '라떼',
        imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
        currentStock: 25,
    },
    {
        menuId: 4,
        menuName: '바닐라 라떼',
        category: '라떼',
        imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400',
        currentStock: 8,
    },
    {
        menuId: 5,
        menuName: '카라멜 마끼아또',
        category: '라떼',
        imageUrl: 'https://images.unsplash.com/photo-1599750451062-f6f0b3c0f4e5?w=400',
        currentStock: 20,
    },
    {
        menuId: 6,
        menuName: '모카 프라페',
        category: '프라페',
        imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
        currentStock: 0,
    },
    {
        menuId: 7,
        menuName: '에스프레소',
        category: '에스프레소',
        imageUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400',
        currentStock: 40,
    },
    {
        menuId: 8,
        menuName: '디카페인 아메리카노',
        category: '디카페인',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
        currentStock: 35,
    },
];


/**
 * 관리자 페이지
 */
const AdminPage = () => {
    const [activeSection, setActiveSection] = useState('inventory');
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [inventory, setInventory] = useState(MOCK_INVENTORY);
    const [selectedOrder, setSelectedOrder] = useState(null);

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
                        <div className="inventory-grid">
                            {inventory.map((item) => (
                                <InventoryCard
                                    key={item.menuId}
                                    item={item}
                                    onUpdateStock={handleUpdateStock}
                                />
                            ))}
                        </div>
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
