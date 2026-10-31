"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    residentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    residentName: { type: String, required: true },
    residentEmail: { type: String, required: true },
    residentPhone: { type: String, default: "" },
    hostelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true },
    hostelName: { type: String, required: true },
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Room" },
    roomNumber: { type: String, default: "TBD" },
    checkInDate: { type: Date, required: true },
    durationMonths: { type: Number, required: true, default: 6 },
    monthlyRent: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["paid", "pending", "due"], default: "pending" },
    bookingStatus: {
        type: String,
        enum: ["pending", "approved", "rejected", "cancelled", "completed"],
        default: "pending",
        index: true,
    },
    specialRequests: { type: String, default: "" },
}, { timestamps: true });
exports.Booking = (0, mongoose_1.model)("Booking", bookingSchema);
