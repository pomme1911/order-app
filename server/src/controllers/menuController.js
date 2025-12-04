const menuModel = require('../models/menuModel');

/**
 * 메뉴 컨트롤러
 * 메뉴 관련 비즈니스 로직 및 에러 처리
 */

/**
 * 메뉴 목록 조회
 * GET /api/menus
 */
const getMenus = async (req, res, next) => {
    try {
        const { category, available } = req.query;

        // available 파라미터를 boolean으로 변환
        let availableFilter;
        if (available !== undefined) {
            availableFilter = available === 'true';
        }

        const menus = await menuModel.getAllMenus(category, availableFilter);

        res.json({
            success: true,
            data: menus
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 메뉴 상세 조회
 * GET /api/menus/:menuId
 */
const getMenuDetail = async (req, res, next) => {
    try {
        const { menuId } = req.params;

        const menu = await menuModel.getMenuById(menuId);

        if (!menu) {
            res.status(404);
            throw new Error('메뉴를 찾을 수 없습니다.');
        }

        res.json({
            success: true,
            data: menu
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 메뉴 옵션 조회
 * GET /api/menus/:menuId/options
 */
const getMenuOptions = async (req, res, next) => {
    try {
        const { menuId } = req.params;

        // 메뉴 존재 여부 확인
        const menu = await menuModel.getMenuById(menuId);
        if (!menu) {
            res.status(404);
            throw new Error('메뉴를 찾을 수 없습니다.');
        }

        const options = await menuModel.getMenuOptions(menuId);

        res.json({
            success: true,
            data: options
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 메뉴 재고 수정
 * PATCH /api/menus/:menuId
 */
const updateStock = async (req, res, next) => {
    try {
        const { menuId } = req.params;
        const { stock } = req.body;

        // 유효성 검증
        if (stock === undefined || stock === null) {
            res.status(400);
            throw new Error('재고 수량을 입력해주세요.');
        }

        if (typeof stock !== 'number' || stock < 0 || stock > 999) {
            res.status(400);
            throw new Error('재고 수량은 0에서 999 사이의 숫자여야 합니다.');
        }

        const updatedMenu = await menuModel.updateMenuStock(menuId, stock);

        if (!updatedMenu) {
            res.status(404);
            throw new Error('메뉴를 찾을 수 없습니다.');
        }

        res.json({
            success: true,
            message: '재고가 업데이트되었습니다.',
            data: updatedMenu
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMenus,
    getMenuDetail,
    getMenuOptions,
    updateStock
};
