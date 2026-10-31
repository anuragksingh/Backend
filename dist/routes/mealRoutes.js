"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mealController_1 = require("../controllers/mealController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
router.get("/hostel/:hostelId", mealController_1.getMealSchedule);
// Owner route to update menus and timings
router.put("/:id", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), mealController_1.updateMealSchedule);
exports.default = router;
