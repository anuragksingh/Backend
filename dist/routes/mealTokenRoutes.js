"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mealTokenController_1 = require("../controllers/mealTokenController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Resident Routes
router.post("/generate", authenticateUser_1.authenticateUser, mealTokenController_1.generateMealToken);
router.get("/my-tokens", authenticateUser_1.authenticateUser, mealTokenController_1.getMyTokens);
router.get("/billing/my-transactions", authenticateUser_1.authenticateUser, mealTokenController_1.getResidentMealBilling);
router.post("/billing/pay", authenticateUser_1.authenticateUser, mealTokenController_1.payResidentMealBilling);
// Staff / Owner Routes
router.post("/verify", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), mealTokenController_1.verifyMealToken);
router.post("/redeem", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), mealTokenController_1.redeemMealToken);
router.get("/history", authenticateUser_1.authenticateUser, mealTokenController_1.getRedemptionHistory);
// Retrieve individual token details
router.get("/:id", authenticateUser_1.authenticateUser, mealTokenController_1.getTokenById);
exports.default = router;
