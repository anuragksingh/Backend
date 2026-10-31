"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMealConfig = exports.createMealConfig = exports.getAllMealsForHostel = exports.getTodayMeals = void 0;
const mongoose_1 = require("mongoose");
const Meal_1 = require("../models/Meal");
const Hostel_1 = require("../models/Hostel");
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Default meal templates
const DEFAULT_MEALS = [
    {
        mealType: "breakfast",
        name: "Masala Dosa, Idli-Vada with Sambar & Filter Coffee",
        price: 50,
        timings: "07:30 AM - 09:30 AM",
        isAvailable: true,
        tokenGenerationDeadline: "09:00 AM",
        tokenRedemptionDeadline: "09:30 AM",
    },
    {
        mealType: "lunch",
        name: "Royal Thali: Dal Tadka, Paneer Butter Masala, Rice, Roti & Salad",
        price: 100,
        timings: "12:30 PM - 02:30 PM",
        isAvailable: true,
        tokenGenerationDeadline: "02:00 PM",
        tokenRedemptionDeadline: "02:30 PM",
    },
    {
        mealType: "dinner",
        name: "Chef Special: Dum Biryani / Mix Veg, Dal Makhani & Gulab Jamun",
        price: 80,
        timings: "07:30 PM - 09:30 PM",
        isAvailable: true,
        tokenGenerationDeadline: "09:00 PM",
        tokenRedemptionDeadline: "09:30 PM",
    },
];
const getTodayMeals = async (req, res) => {
    try {
        let hostelIdStr = req.query.hostelId;
        if (!hostelIdStr) {
            const defaultHostel = await Hostel_1.Hostel.findOne();
            if (!defaultHostel) {
                res.status(404).json({ success: false, error: "No hostel registered" });
                return;
            }
            hostelIdStr = defaultHostel._id.toString();
        }
        const todayDayName = DAYS[new Date().getDay()];
        let meals = await Meal_1.Meal.find({
            hostelId: new mongoose_1.Types.ObjectId(hostelIdStr),
            dayOfWeek: todayDayName,
        });
        // Auto-seed today's meals for this hostel if none exist
        if (!meals.length) {
            const newMeals = DEFAULT_MEALS.map((m) => ({
                ...m,
                hostelId: new mongoose_1.Types.ObjectId(hostelIdStr),
                dayOfWeek: todayDayName,
            }));
            meals = await Meal_1.Meal.insertMany(newMeals);
        }
        res.json({
            success: true,
            day: todayDayName,
            date: new Date().toISOString(),
            meals,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getTodayMeals = getTodayMeals;
const getAllMealsForHostel = async (req, res) => {
    try {
        const hostelId = req.params.hostelId;
        let meals = await Meal_1.Meal.find({ hostelId: new mongoose_1.Types.ObjectId(hostelId) }).sort({
            dayOfWeek: 1,
            mealType: 1,
        });
        if (!meals.length) {
            const weekMeals = [];
            for (const day of DAYS) {
                for (const tmpl of DEFAULT_MEALS) {
                    weekMeals.push({
                        ...tmpl,
                        hostelId: new mongoose_1.Types.ObjectId(hostelId),
                        dayOfWeek: day,
                    });
                }
            }
            meals = await Meal_1.Meal.insertMany(weekMeals);
        }
        res.json({
            success: true,
            meals,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getAllMealsForHostel = getAllMealsForHostel;
const createMealConfig = async (req, res) => {
    try {
        const { hostelId, dayOfWeek, mealType, name, price, timings, isAvailable, tokenGenerationDeadline, tokenRedemptionDeadline, } = req.body;
        const hostel = await Hostel_1.Hostel.findById(hostelId);
        if (!hostel) {
            res.status(404).json({ success: false, error: "Hostel not found" });
            return;
        }
        // Owner check
        if (req.user?.role !== "admin" && hostel.ownerId.toString() !== req.user?._id.toString()) {
            res.status(403).json({ success: false, error: "Unauthorized for this hostel" });
            return;
        }
        const meal = await Meal_1.Meal.findOneAndUpdate({ hostelId, dayOfWeek, mealType }, {
            name,
            price: Number(price),
            timings,
            isAvailable: isAvailable ?? true,
            tokenGenerationDeadline: tokenGenerationDeadline || "09:00 AM",
            tokenRedemptionDeadline: tokenRedemptionDeadline || "09:30 AM",
        }, { upsert: true, new: true });
        res.status(201).json({
            success: true,
            message: "Meal configuration saved.",
            meal,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.createMealConfig = createMealConfig;
const updateMealConfig = async (req, res) => {
    try {
        const { id } = req.params;
        const meal = await Meal_1.Meal.findById(id);
        if (!meal) {
            res.status(404).json({ success: false, error: "Meal configuration not found" });
            return;
        }
        const hostel = await Hostel_1.Hostel.findById(meal.hostelId);
        if (!hostel || (req.user?.role !== "admin" && hostel.ownerId.toString() !== req.user?._id.toString())) {
            res.status(403).json({ success: false, error: "Unauthorized to modify meals for this hostel" });
            return;
        }
        const { name, price, timings, isAvailable, tokenGenerationDeadline, tokenRedemptionDeadline } = req.body;
        if (name !== undefined)
            meal.name = name;
        if (price !== undefined)
            meal.price = Number(price);
        if (timings !== undefined)
            meal.timings = timings;
        if (isAvailable !== undefined)
            meal.isAvailable = isAvailable;
        if (tokenGenerationDeadline !== undefined)
            meal.tokenGenerationDeadline = tokenGenerationDeadline;
        if (tokenRedemptionDeadline !== undefined)
            meal.tokenRedemptionDeadline = tokenRedemptionDeadline;
        await meal.save();
        res.json({
            success: true,
            message: "Meal pricing & availability updated successfully.",
            meal,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.updateMealConfig = updateMealConfig;
