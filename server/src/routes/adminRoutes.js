const express = require('express');
const { fixImageUrls } = require('../scripts/fixImageUrls');

const router = express.Router();

/**
 * 관리자 라우트
 * 임시 엔드포인트 - 데이터베이스 이미지 URL 수정용
 */

// 이미지 URL 수정 엔드포인트
router.post('/fix-image-urls', async (req, res, next) => {
    try {
        console.log('🔧 이미지 URL 수정 요청을 받았습니다...');

        const result = await fixImageUrls();

        res.json({
            success: true,
            message: '이미지 URL이 성공적으로 업데이트되었습니다.',
            data: result
        });
    } catch (error) {
        console.error('❌ 이미지 URL 수정 중 에러:', error);
        next(error);
    }
});

module.exports = router;
