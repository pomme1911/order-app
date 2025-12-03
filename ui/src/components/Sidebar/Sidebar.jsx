import './Sidebar.css';

/**
 * 관리자 사이드바 컴포넌트
 */
const Sidebar = ({ activeSection, onSectionChange, stats }) => {
    return (
        <div className="admin-sidebar">
            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`}
                    onClick={() => onSectionChange('inventory')}
                >
                    <span className="nav-icon">📦</span>
                    <span className="nav-label">재고 관리</span>
                </button>
                <button
                    className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
                    onClick={() => onSectionChange('orders')}
                >
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">주문 관리</span>
                </button>
            </nav>

            <div className="stats-summary">
                <h3 className="stats-title">통계 요약</h3>
                <div className="stat-card">
                    <div className="stat-value">{stats.todayOrderCount}</div>
                    <div className="stat-label">오늘 주문</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">₩ {stats.todayRevenue.toLocaleString()}</div>
                    <div className="stat-label">총 매출</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{stats.outOfStockCount}</div>
                    <div className="stat-label">품절 상품</div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
