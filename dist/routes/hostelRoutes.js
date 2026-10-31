"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hostelController_1 = require("../controllers/hostelController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Public routes
router.get("/", hostelController_1.getHostels);
router.get("/:id", hostelController_1.getHostelById);
// Owner protected routes
router.get("/owner/my-properties", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), requireRole_1.requireActiveAccount, hostelController_1.getOwnerHostels);
router.post("/", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), requireRole_1.requireActiveAccount, hostelController_1.createHostel);
router.put("/:id", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), requireRole_1.requireActiveAccount, hostelController_1.updateHostel);
exports.default = router;
