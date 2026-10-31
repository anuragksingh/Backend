"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    console.error("[Internal Server Error]:", err);
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === "production"
        ? "An unexpected internal server error occurred."
        : err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        error: message,
    });
};
exports.errorHandler = errorHandler;
