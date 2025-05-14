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
const db_1 = require("../db"); // assuming your db.ts exports a "pool"
const router = express_1.default.Router();
// POST route to save a user's location
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, latitude, longitude } = req.body;
        if (!userId || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: "Missing required fields: userId, latitude, longitude" });
        }
        console.log('Saving location for user:', userId, latitude, longitude); // Debugging line
        // Insert the location into the user_locations table
        const result = yield db_1.pool.query("INSERT INTO user_locations (user_id, latitude, longitude) VALUES ($1, $2, $3)", [userId, latitude, longitude]);
        console.log('Location saved:', result); // Debugging line
        res.status(200).json({ message: "Location saved successfully!" });
    }
    catch (error) {
        if (error instanceof Error) {
            // Now we know that error is an instance of the Error class
            console.error('Error saving location:', error.message); // Log error message
            res.status(500).json({ message: "Error saving location", error: error.message, stack: error.stack });
        }
        else {
            // Handle the case where the error is not of type Error
            console.error('An unknown error occurred:', error);
            res.status(500).json({ message: "Error saving location", error: "Unknown error occurred" });
        }
    }
}));
// GET route to retrieve locations for a user by userId
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const result = yield db_1.pool.query("SELECT * FROM user_locations WHERE user_id = $1 ORDER BY timestamp DESC", [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No locations found for this user" });
        }
        res.status(200).json({ locations: result.rows });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching locations" });
    }
}));
exports.default = router;
