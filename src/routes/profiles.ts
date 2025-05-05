// src/routes/profile.ts
import express from "express";
import { pool } from "../db"; // database connection

const router = express.Router();

// Create or Update profile
router.post("/", async (req, res) => {
  try {
    const {
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
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    await pool.query(
      `INSERT INTO profiles 
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
      `,
      [userId, name, gender, birthday, weight, height, fitnessGoals, preferredDays, preferredActivity, notifications, location, profilePhoto]
    );

    res.status(200).json({ message: "Profile created or updated successfully!" });
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    res.status(500).json({ message: "Error creating or updating profile" });
  }
});

// Get profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(
      `SELECT 
        name, gender, birthday, weight, height, fitness_goals, preferred_days, 
        preferred_activity, notifications, location, profile_photo
       FROM profiles
       WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({ profile: result.rows[0] }); // ✅ send the whole object, directly
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

export default router;
