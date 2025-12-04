const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * 미들웨어 설정
 */

// CORS 설정
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// 요청 로깅
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 라우트 설정
 */

// API 라우트
app.use('/api', routes);

// 루트 경로
app.get('/', (req, res) => {
    res.json({
        message: '☕ 커피 주문 앱 API 서버',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            menus: '/api/menus',
            orders: '/api/orders',
        },
    });
});

/**
 * 에러 핸들링
 */
app.use(notFound);
app.use(errorHandler);

/**
 * 서버 시작
 */
const server = app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('☕ 커피 주문 앱 서버가 시작되었습니다!');
    console.log(`🚀 서버 주소: http://localhost:${PORT}`);
    console.log(`📝 환경: ${process.env.NODE_ENV || 'development'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
    server.close(() => {
        console.log('✅ 서버가 정상적으로 종료되었습니다.');
        process.exit(0);
    });
});

module.exports = app;
