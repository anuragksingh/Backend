"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payInvoice = exports.updateBookingStatus = exports.getOwnerBookings = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = require("../models/Booking");
const Hostel_1 = require("../models/Hostel");
const createBooking = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        const { hostelId, checkInDate, durationMonths, specialRequests } = req.body;
        const hostel = await Hostel_1.Hostel.findById(hostelId);
        if (!hostel) {
            res.status(404).json({ success: false, error: "Hostel not found" });
            return;
        }
        const months = Number(durationMonths) || 6;
        const total = hostel.pricePerMonth * months;
        const booking = await Booking_1.Booking.create({
            residentId: req.user._id,
            residentName: req.user.fullName,
            residentEmail: req.user.email,
            residentPhone: req.user.phone || "",
            hostelId: hostel._id,
            hostelName: hostel.name,
            checkInDate: new Date(checkInDate || Date.now()),
            durationMonths: months,
            monthlyRent: hostel.pricePerMonth,
            totalAmount: total,
            paymentStatus: "pending",
            bookingStatus: "pending",
            specialRequests: specialRequests || "",
        });
        res.status(201).json({
            success: true,
            message: "Booking request created successfully. Awaiting owner confirmation.",
            booking,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        const bookings = await Booking_1.Booking.find({ residentId: req.user._id }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getMyBookings = getMyBookings;
const getOwnerBookings = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        // Find all hostels owned by current user
        const ownerHostels = await Hostel_1.Hostel.find({ ownerId: req.user._id });
        const hostelIds = ownerHostels.map((h) => h._id);
        const bookings = await Booking_1.Booking.find({ hostelId: { $in: hostelIds } }).sort({ createdAt: -1 });
        res.json({
            success: true,
            count: bookings.length,
            bookings,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getOwnerBookings = getOwnerBookings;
const updateBookingStatus = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const { status, roomNumber } = req.body;
        const booking = await Booking_1.Booking.findById(id);
        if (!booking) {
            res.status(404).json({ success: false, error: "Booking not found" });
            return;
        }
        // Verify ownership of the hostel
        const hostel = await Hostel_1.Hostel.findById(booking.hostelId);
        if (!hostel || (hostel.ownerId.toString() !== req.user._id.toString() && req.user.role !== "admin")) {
            res.status(403).json({ success: false, error: "Unauthorized to update this booking" });
            return;
        }
        if (status)
            booking.bookingStatus = status;
        if (roomNumber)
            booking.roomNumber = roomNumber;
        await booking.save();
        res.json({
            success: true,
            message: `Booking status updated to ${status}.`,
            booking,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.updateBookingStatus = updateBookingStatus;
const payInvoice = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: "Unauthorized" });
            return;
        }
        const { id } = req.params;
        const booking = await Booking_1.Booking.findOne({ _id: id, residentId: req.user._id });
        if (!booking) {
            res.status(404).json({ success: false, error: "Booking invoice not found" });
            return;
        }
        booking.paymentStatus = "paid";
        await booking.save();
        res.json({
            success: true,
            message: "Payment processed successfully. Receipt generated.",
            booking,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.payInvoice = payInvoice;
