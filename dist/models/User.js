"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["resident", "owner", "admin"],
        default: "resident",
    },
    accountStatus: {
        type: String,
        enum: ["pending", "active", "suspended"],
        default: "active",
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    onboardingDetails: {
        organizationName: { type: String, default: "" },
        propertyLicense: { type: String, default: "" },
        emergencyContact: { type: String, default: "" },
        notes: { type: String, default: "" },
    },
}, {
    timestamps: true,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
