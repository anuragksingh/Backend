"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformMetrics = exports.getAllUsers = exports.reviewOwner = exports.getPendingOwners = void 0;
const User_1 = require("../models/User");
const Hostel_1 = require("../models/Hostel");
const Booking_1 = require("../models/Booking");
const getPendingOwners = async (_req, res) => {
    try {
        const pendingOwners = await User_1.User.find({
            role: "owner",
            accountStatus: "pending",
        }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: pendingOwners.length,
            owners: pendingOwners,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getPendingOwners = getPendingOwners;
const reviewOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // "approve" or "reject"
        const owner = await User_1.User.findById(id);
        if (!owner) {
            res.status(404).json({ success: false, error: "Owner user not found" });
            return;
        }
        if (action === "approve") {
            owner.accountStatus = "active";
        }
        else if (action === "reject") {
            owner.accountStatus = "suspended";
        }
        else {
            res.status(400).json({ success: false, error: "Invalid action. Expected 'approve' or 'reject'." });
            return;
        }
        await owner.save();
        res.json({
            success: true,
            message: `Owner account has been ${action === "approve" ? "approved" : "rejected"}.`,
            owner,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.reviewOwner = reviewOwner;
const getAllUsers = async (_req, res) => {
    try {
        const users = await User_1.User.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: users.length,
            users,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getAllUsers = getAllUsers;
const getPlatformMetrics = async (_req, res) => {
    try {
        const [totalUsers, totalHostels, totalBookings, bookings] = await Promise.all([
            User_1.User.countDocuments(),
            Hostel_1.Hostel.countDocuments(),
            Booking_1.Booking.countDocuments(),
            Booking_1.Booking.find({ paymentStatus: "paid" }),
        ]);
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
        res.json({
            success: true,
            metrics: {
                totalUsers,
                totalHostels,
                totalBookings,
                totalRevenue,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getPlatformMetrics = getPlatformMetrics;
