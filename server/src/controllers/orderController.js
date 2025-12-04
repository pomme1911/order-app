const orderModel = require('../models/orderModel');

/**
 * 주문 컨트롤러
 * 주문 관련 비즈니스 로직 및 에러 처리
 */

/**
 * 주문 생성
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
    try {
        const { items, total_amount, total_quantity } = req.body;

        // 유효성 검증
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400);
            throw new Error('주문 아이템이 필요합니다.');
        }

        if (!total_amount || typeof total_amount !== 'number' || total_amount <= 0) {
            res.status(400);
            throw new Error('올바른 주문 금액을 입력해주세요.');
        }

        if (!total_quantity || typeof total_quantity !== 'number' || total_quantity <= 0) {
            res.status(400);
            throw new Error('올바른 주문 수량을 입력해주세요.');
        }

        // 금액 검증 (프론트엔드에서 계산한 금액과 일치하는지)
        const calculatedAmount = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
        if (Math.abs(calculatedAmount - total_amount) > 0.01) {
            res.status(400);
            throw new Error('주문 금액이 일치하지 않습니다.');
        }

        // 수량 검증
        const calculatedQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        if (calculatedQuantity !== total_quantity) {
            res.status(400);
            throw new Error('주문 수량이 일치하지 않습니다.');
        }

        const order = await orderModel.createOrder({ items, total_amount, total_quantity });

        res.status(201).json({
            success: true,
            message: '주문이 생성되었습니다.',
            data: {
                order_id: order.id,
                order_date: order.order_date,
                status: order.status,
                total_amount: order.total_amount,
                total_quantity: order.total_quantity
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 주문 목록 조회
 * GET /api/orders
 */
const getOrders = async (req, res, next) => {
    try {
        const { status, limit, offset } = req.query;

        const limitNum = limit ? parseInt(limit) : 20;
        const offsetNum = offset ? parseInt(offset) : 0;

        const result = await orderModel.getAllOrders(status, limitNum, offsetNum);

        res.json({
            success: true,
            data: result.orders,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 주문 상세 조회
 * GET /api/orders/:orderId
 */
const getOrderDetail = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel.getOrderById(orderId);

        if (!order) {
            res.status(404);
            throw new Error('주문을 찾을 수 없습니다.');
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 주문 상태 변경
 * PATCH /api/orders/:orderId
 */
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // 유효성 검증
        const validStatuses = ['pending', 'processing', 'completed'];
        if (!status || !validStatuses.includes(status)) {
            res.status(400);
            throw new Error('올바른 주문 상태를 입력해주세요. (pending, processing, completed)');
        }

        // 주문 존재 여부 확인
        const order = await orderModel.getOrderById(orderId);
        if (!order) {
            res.status(404);
            throw new Error('주문을 찾을 수 없습니다.');
        }

        // 상태 업데이트
        const updatedOrder = await orderModel.updateOrderStatus(orderId, status);

        let stockUpdates = [];

        // 주문 완료 시 재고 차감
        if (status === 'completed' && order.status !== 'completed') {
            try {
                stockUpdates = await orderModel.deductStock(order.order_items);
            } catch (stockError) {
                res.status(409);
                throw new Error(`재고 차감 실패: ${stockError.message}`);
            }
        }

        const response = {
            success: true,
            message: '주문 상태가 업데이트되었습니다.',
            data: {
                id: updatedOrder.id,
                status: updatedOrder.status,
                updated_at: updatedOrder.updated_at
            }
        };

        // 재고 차감 정보 추가
        if (stockUpdates.length > 0) {
            response.message = '주문이 완료되었습니다. 재고가 차감되었습니다.';
            response.data.stock_updated = stockUpdates;
        }

        res.json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderDetail,
    updateOrderStatus
};
