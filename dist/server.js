"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const seedData_1 = require("./seeds/seedData");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const hostelRoutes_1 = __importDefault(require("./routes/hostelRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const mealRoutes_1 = __importDefault(require("./routes/mealRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// 1. Security Headers (nevergethacked compliance)
app.use((0, helmet_1.default)({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
// 2. CORS Configuration
app.use((0, cors_1.default)({
    origin: [FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// 3. Rate Limiting Protection
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per IP per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many requests from this IP address. Please try again after 15 minutes.",
    },
});
app.use("/api/", limiter);
// 4. Body Parsers with payload limits
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "2mb" }));
// 5. Health Check Endpoint
app.get("/api/health", (_req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "Hostel Platform API (MERN + Firebase Auth)",
    });
});
// 6. Application Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/hostels", hostelRoutes_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use("/api/meals", mealRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// 7. Central Error Handling Middleware
app.use(errorHandler_1.errorHandler);
// 8. Server Bootstrapping
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, seedData_1.seedDatabase)();
        app.listen(PORT, () => {
            console.log(`===============================================`);
            console.log(`🚀 HostelHub API Server is active on port: ${PORT}`);
            console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
            console.log(`🛡️  Security: Helmet, Rate Limiter & RBAC Active`);
            console.log(`===============================================`);
        });
    }
    catch (error) {
        console.error("FATAL: Failed to start backend server:", error.message);
        process.exit(1);
    }
};
startServer();
