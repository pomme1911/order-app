import { useState } from 'react'
import OrderPage from './pages/OrderPage/OrderPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('order') // 'order' or 'admin'

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">☕ 커피 주문</h1>
          <nav className="app-nav">
            <button
              className={`nav-button ${currentPage === 'order' ? 'active' : ''}`}
              onClick={() => setCurrentPage('order')}
            >
              주문하기
            </button>
            <button
              className={`nav-button ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentPage('admin')}
            >
              관리자
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'order' ? (
          <OrderPage />
        ) : (
          <div className="page-content">
            <h2>관리자 화면</h2>
            <p>재고 관리 및 주문 관리 기능이 여기에 표시됩니다.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

