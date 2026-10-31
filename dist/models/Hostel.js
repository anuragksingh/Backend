"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hostel = void 0;
const mongoose_1 = require("mongoose");
const hostelSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    pricePerMonth: { type: Number, required: true },
    gender: { type: String, enum: ["all", "male", "female"], default: "all" },
    amenities: [{ type: String }],
    images: [{ type: String }],
    rating: { type: Number, default: 4.5 },
    totalRooms: { type: Number, required: true, default: 20 },
    availableRooms: { type: Number, required: true, default: 5 },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ownerName: { type: String, default: "Property Manager" },
    contactPhone: { type: String, default: "+1 555-0199" },
    contactEmail: { type: String, default: "owner@hostelhub.com" },
    status: { type: String, enum: ["active", "maintenance", "closed"], default: "active" },
}, { timestamps: true });
exports.Hostel = (0, mongoose_1.model)("Hostel", hostelSchema);
