"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealSchedule = void 0;
const mongoose_1 = require("mongoose");
const mealScheduleSchema = new mongoose_1.Schema({
    hostelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true },
    dayOfWeek: { type: String, required: true },
    dateString: { type: String },
    breakfast: {
        menu: { type: String, required: true },
        timings: { type: String, default: "07:30 AM - 09:30 AM" },
        isAvailable: { type: Boolean, default: true },
    },
    lunch: {
        menu: { type: String, required: true },
        timings: { type: String, default: "12:30 PM - 02:30 PM" },
        isAvailable: { type: Boolean, default: true },
    },
    dinner: {
        menu: { type: String, required: true },
        timings: { type: String, default: "07:30 PM - 09:30 PM" },
        isAvailable: { type: Boolean, default: true },
    },
    specialDietOptions: [{ type: String }],
}, { timestamps: true });
exports.MealSchedule = (0, mongoose_1.model)("MealSchedule", mealScheduleSchema);
