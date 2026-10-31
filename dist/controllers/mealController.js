"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealSchedule = exports.getMealSchedule = void 0;
const mongoose_1 = require("mongoose");
const MealSchedule_1 = require("../models/MealSchedule");
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const getMealSchedule = async (req, res) => {
    try {
        const { hostelId } = req.params;
        let schedules = await MealSchedule_1.MealSchedule.find({ hostelId });
        // If no schedule exists, auto-seed a weekly menu for convenience
        if (!schedules.length) {
            const defaultSchedules = DAYS.map((day) => ({
                hostelId: new mongoose_1.Types.ObjectId(hostelId),
                dayOfWeek: day,
                breakfast: {
                    menu: day === "Sunday" ? "Stuffed Parathas & Fresh Curd" : "Poha, Boiled Eggs & Masala Tea",
                    timings: "07:30 AM - 09:30 AM",
                    isAvailable: true,
                },
                lunch: {
                    menu: "Steamed Rice, Dal Tadka, Seasonal Mix Veg, Chapati & Salad",
                    timings: "12:30 PM - 02:30 PM",
                    isAvailable: true,
                },
                dinner: {
                    menu: day === "Friday" ? "Paneer Butter Masala / Chicken Curry with Jeera Rice" : "Dal Makhani, Seasonal Sabzi & Fresh Rotis",
                    timings: "07:30 PM - 09:30 PM",
                    isAvailable: true,
                },
                specialDietOptions: ["Vegetarian", "High Protein", "Jain"],
            }));
            schedules = await MealSchedule_1.MealSchedule.insertMany(defaultSchedules);
        }
        res.json({
            success: true,
            schedules,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getMealSchedule = getMealSchedule;
const updateMealSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await MealSchedule_1.MealSchedule.findById(id);
        if (!schedule) {
            res.status(404).json({ success: false, error: "Meal schedule entry not found" });
            return;
        }
        Object.assign(schedule, req.body);
        await schedule.save();
        res.json({
            success: true,
            message: "Meal plan updated successfully.",
            schedule,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.updateMealSchedule = updateMealSchedule;
