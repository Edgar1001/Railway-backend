"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
// Create or Update profile
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, gender, birthday, weight, height, fitnessGoals, preferredDays, preferredActivity, notifications, location, profilePhoto } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }
        if (profilePhoto && !/^data:image\/(png|jpeg|jpg);base64,/.test(profilePhoto)) {
            return res.status(400).json({ message: "Invalid profile photo format" });
        }
        yield db_1.pool.query(`INSERT INTO profiles 
        (user_id, name, gender, birthday, weight, height, fitness_goals, preferred_days, preferred_activity, notifications, location, profile_photo)
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        gender = EXCLUDED.gender,
        birthday = EXCLUDED.birthday,
        weight = EXCLUDED.weight,
        height = EXCLUDED.height,
        fitness_goals = EXCLUDED.fitness_goals,
        preferred_days = EXCLUDED.preferred_days,
        preferred_activity = EXCLUDED.preferred_activity,
        notifications = EXCLUDED.notifications,
        location = EXCLUDED.location,
        profile_photo = EXCLUDED.profile_photo
      `, [
            userId,
            name,
            gender,
            birthday,
            weight,
            height,
            fitnessGoals,
            preferredDays,
            preferredActivity,
            notifications,
            location,
            profilePhoto
        ]);
        res.status(200).json({ message: "Profile created or updated successfully!" });
    }
    catch (error) {
        console.error("Error creating/updating profile:", error);
        res.status(500).json({ message: "Error creating or updating profile" });
    }
}));
// Get profile by userId
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield db_1.pool.query(`SELECT 
        name, gender, birthday, weight, height, fitness_goals, preferred_days, 
        preferred_activity, notifications, location, profile_photo
       FROM profiles
       WHERE user_id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.json({ profile: result.rows[0] });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
}));
exports.default = router;
