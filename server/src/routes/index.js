const express = require('express');
const menuRoutes = require('./menuRoutes');
const orderRoutes = require('./orderRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

/**
 * API 라우트 인덱스
 * 모든 라우트를 /api 경로 아래에 마운트
 */

// 헬스 체크 엔드포인트
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '서버가 정상적으로 작동 중입니다.',
        timestamp: new Date().toISOString(),
    });
});

// 메뉴 관련 라우트
router.use('/menus', menuRoutes);

// 주문 관련 라우트
router.use('/orders', orderRoutes);

// 관리자 라우트 (임시)
router.use('/admin', adminRoutes);

module.exports = router;

