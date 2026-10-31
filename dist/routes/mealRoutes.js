"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mealController_1 = require("../controllers/mealController");
const mealConfigController_1 = require("../controllers/mealConfigController");
const authenticateUser_1 = require("../middleware/authenticateUser");
const requireRole_1 = require("../middleware/requireRole");
const router = (0, express_1.Router)();
// Retrieve today's configured meals with pricing & deadlines
router.get("/today", mealConfigController_1.getTodayMeals);
// Legacy weekly schedule
router.get("/hostel/:hostelId", mealController_1.getMealSchedule);
// Configured meal list for owner pricing view
router.get("/hostel/:hostelId/configured", mealConfigController_1.getAllMealsForHostel);
// Owner / Admin Meal Management endpoints
router.post("/", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), mealConfigController_1.createMealConfig);
router.patch("/:id", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), mealConfigController_1.updateMealConfig);
// Update legacy schedule
router.put("/:id", authenticateUser_1.authenticateUser, (0, requireRole_1.requireRole)("owner", "admin"), mealController_1.updateMealSchedule);
exports.default = router;
