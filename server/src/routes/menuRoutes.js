const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

/**
 * 메뉴 관련 라우트
 * 기본 경로: /api/menus
 */

// GET /api/menus - 메뉴 목록 조회
router.get('/', menuController.getMenus);

// GET /api/menus/:menuId - 메뉴 상세 조회
router.get('/:menuId', menuController.getMenuDetail);

// GET /api/menus/:menuId/options - 메뉴 옵션 조회
router.get('/:menuId/options', menuController.getMenuOptions);

// PATCH /api/menus/:menuId - 메뉴 재고 수정 (관리자)
router.patch('/:menuId', menuController.updateStock);

module.exports = router;
