"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireActiveAccount = exports.requireRole = void 0;
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: "Authentication required to access this resource.",
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: `Access denied. Requires one of [${allowedRoles.join(", ")}] roles. Your role is '${req.user.role}'.`,
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
const requireActiveAccount = (req, res, next) => {
    if (!req.user) {
        res.status(401).json({
            success: false,
            error: "Authentication required.",
        });
        return;
    }
    if (req.user.accountStatus === "pending") {
        res.status(403).json({
            success: false,
            error: "Your account is pending administrative approval. Restricted access until approved.",
            accountStatus: "pending",
        });
        return;
    }
    if (req.user.accountStatus === "suspended") {
        res.status(403).json({
            success: false,
            error: "Your account has been suspended. Please contact platform administrators.",
            accountStatus: "suspended",
        });
        return;
    }
    next();
};
exports.requireActiveAccount = requireActiveAccount;
