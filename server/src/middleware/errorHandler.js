/**
 * 에러 핸들링 미들웨어
 */

/**
 * 404 Not Found 핸들러
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

/**
 * 전역 에러 핸들러
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};
