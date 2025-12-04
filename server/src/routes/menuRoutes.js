const express = require('express');
const router = express.Router();

/**
 * 메뉴 관련 라우트
 * 기본 경로: /api/menus
 */

// GET /api/menus - 메뉴 목록 조회
router.get('/', async (req, res, next) => {
    try {
        // TODO: 컨트롤러 구현 후 연결
        res.json({
            success: true,
            message: '메뉴 목록 조회 API (구현 예정)',
            data: [],
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/menus/:menuId - 메뉴 상세 조회
router.get('/:menuId', async (req, res, next) => {
    try {
        // TODO: 컨트롤러 구현 후 연결
        res.json({
            success: true,
            message: '메뉴 상세 조회 API (구현 예정)',
            data: {},
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/menus/:menuId/options - 메뉴 옵션 조회
router.get('/:menuId/options', async (req, res, next) => {
    try {
        // TODO: 컨트롤러 구현 후 연결
        res.json({
            success: true,
            message: '메뉴 옵션 조회 API (구현 예정)',
            data: {},
        });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/menus/:menuId - 메뉴 재고 수정 (관리자)
router.patch('/:menuId', async (req, res, next) => {
    try {
        // TODO: 컨트롤러 구현 후 연결
        res.json({
            success: true,
            message: '메뉴 재고 수정 API (구현 예정)',
            data: {},
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
