import { Router } from "express";
import { getMealSchedule, updateMealSchedule } from "../controllers/mealController";
import { authenticateUser } from "../middleware/authenticateUser";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get("/hostel/:hostelId", getMealSchedule);

// Owner route to update menus and timings
router.put(
  "/:id",
  authenticateUser,
  requireRole("owner", "admin"),
  updateMealSchedule
);

export default router;

