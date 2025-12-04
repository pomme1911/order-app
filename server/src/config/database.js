const { Pool } = require('pg');
require('dotenv').config();

/**
 * PostgreSQL 데이터베이스 연결 풀 설정
 */
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    max: 20, // 최대 연결 수
    idleTimeoutMillis: 30000, // 유휴 연결 타임아웃
    connectionTimeoutMillis: 2000, // 연결 타임아웃
});

/**
 * 데이터베이스 연결 테스트
 */
pool.on('connect', () => {
    console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.');
});

pool.on('error', (err) => {
    console.error('❌ 예상치 못한 데이터베이스 에러:', err);
    process.exit(-1);
});

/**
 * 쿼리 실행 헬퍼 함수
 * @param {string} text - SQL 쿼리
 * @param {Array} params - 쿼리 파라미터
 * @returns {Promise} 쿼리 결과
 */
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 쿼리 실행:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ 쿼리 실행 에러:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query,
};
