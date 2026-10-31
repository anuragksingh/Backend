"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealToken = void 0;
const mongoose_1 = require("mongoose");
const mealTokenSchema = new mongoose_1.Schema({
    residentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    residentName: { type: String, required: true },
    residentEmail: { type: String, required: true },
    hostelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true },
    hostelName: { type: String, required: true },
    mealId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Meal" },
    mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner"],
        required: true,
    },
    mealDate: { type: Date, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    priceSnapshot: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["active", "redeemed", "expired", "cancelled"],
        default: "active",
        index: true,
    },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    redeemedAt: { type: Date },
    redeemedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    transactionId: { type: mongoose_1.Schema.Types.ObjectId, ref: "MealTransaction" },
}, { timestamps: true });
// Prevent duplicate active/redeemed tokens for the same resident, meal, and date
mealTokenSchema.index({ residentId: 1, mealDate: 1, mealType: 1 }, { background: true });
exports.MealToken = (0, mongoose_1.model)("MealToken", mealTokenSchema);
