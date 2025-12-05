const { pool } = require('../config/database');

/**
 * 이미지 URL 수정 스크립트
 * 한글 파일명을 영문 파일명으로 변경
 */

const imageMapping = {
    '아메리카노': 'americano',
    '카페라떼': 'caffe_latte',
    '카푸치노': 'cappuccino',
    '바닐라라떼': 'vanilla_latte',
    '카라멜마끼아또': 'caramel_macchiato',
    '모카': 'caffe_mocha'
};

const fixImageUrls = async () => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🔧 이미지 URL 수정을 시작합니다...');

        for (const [koreanName, englishFile] of Object.entries(imageMapping)) {
            const result = await client.query(
                `UPDATE menus 
         SET image_url = $1, updated_at = CURRENT_TIMESTAMP
         WHERE name = $2
         RETURNING id, name, image_url`,
                [`/images/${englishFile}.jpg`, koreanName]
            );

            if (result.rows.length > 0) {
                console.log(`✅ ${koreanName}: ${result.rows[0].image_url}`);
            } else {
                console.log(`⚠️  ${koreanName}: 메뉴를 찾을 수 없습니다.`);
            }
        }

        await client.query('COMMIT');
        console.log('🎉 이미지 URL 수정이 완료되었습니다!');
        process.exit(0);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ 이미지 URL 수정 중 에러 발생:', error);
        process.exit(1);
    } finally {
        client.release();
    }
};

// 스크립트로 직접 실행될 때만 실행
if (require.main === module) {
    fixImageUrls();
}

module.exports = { fixImageUrls };
