"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const router = (0, express_1.Router)();
// Public / Token-authenticated routes
router.post("/session", authenticateUser_1.authenticateUser, authController_1.syncSession);
router.get("/me", authenticateUser_1.authenticateUser, authController_1.getMe);
router.patch("/profile", authenticateUser_1.authenticateUser, authController_1.updateProfile);
router.post("/onboarding", authenticateUser_1.authenticateUser, authController_1.submitOnboarding);
router.get("/status", authenticateUser_1.authenticateUser, authController_1.getStatus);
router.post("/logout", authController_1.logout);
exports.default = router;
