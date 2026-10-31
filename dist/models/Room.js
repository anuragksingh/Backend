"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    hostelId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true },
    roomNumber: { type: String, required: true },
    type: { type: String, enum: ["single", "double", "triple", "dorm"], default: "double" },
    capacity: { type: Number, required: true, default: 2 },
    occupied: { type: Number, default: 0 },
    pricePerMonth: { type: Number, required: true },
    floor: { type: Number, default: 1 },
    amenities: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });
exports.Room = (0, mongoose_1.model)("Room", roomSchema);
