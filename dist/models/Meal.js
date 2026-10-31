"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meal = void 0;
const mongoose_1 = require("mongoose");
const mealSchema = new mongoose_1.Schema({
    hostelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true },
    dayOfWeek: { type: String, required: true },
    mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner"],
        required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    timings: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    tokenGenerationDeadline: { type: String, default: "09:00 AM" },
    tokenRedemptionDeadline: { type: String, default: "09:30 AM" },
}, { timestamps: true });
mealSchema.index({ hostelId: 1, dayOfWeek: 1, mealType: 1 }, { unique: true });
exports.Meal = (0, mongoose_1.model)("Meal", mealSchema);
