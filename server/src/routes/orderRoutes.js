const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

/**
 * 주문 관련 라우트
 * 기본 경로: /api/orders
 */

// POST /api/orders - 주문 생성
router.post('/', orderController.createOrder);

// GET /api/orders - 주문 목록 조회 (관리자)
router.get('/', orderController.getOrders);

// GET /api/orders/:orderId - 주문 상세 조회
router.get('/:orderId', orderController.getOrderDetail);

// PATCH /api/orders/:orderId - 주문 상태 변경 (관리자)
router.patch('/:orderId', orderController.updateOrderStatus);

module.exports = router;
