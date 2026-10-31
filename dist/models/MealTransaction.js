"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealTransaction = void 0;
const mongoose_1 = require("mongoose");
const mealTransactionSchema = new mongoose_1.Schema({
    residentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    residentName: { type: String, required: true },
    residentEmail: { type: String, required: true },
    hostelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true },
    hostelName: { type: String, required: true },
    mealTokenId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MealToken",
        required: true,
        unique: true, // Prevents duplicate charges for the same token!
        index: true,
    },
    mealType: { type: String, required: true },
    mealDate: { type: Date, required: true },
    amount: { type: Number, required: true, min: 0 },
    transactionType: {
        type: String,
        default: "meal_charge",
    },
    description: { type: String, required: true },
    status: {
        type: String,
        enum: ["completed", "paid", "refunded"],
        default: "completed",
    },
}, { timestamps: true });
exports.MealTransaction = (0, mongoose_1.model)("MealTransaction", mealTransactionSchema);
