// src/routes/activities.ts
import express from "express";
import { pool } from "../db";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const router = express.Router();

// Fetch activities for a specific day
router.get("/today", async (req, res) => {
  try {
    const { date, userId } = req.query;

    if (!date || !userId) {
      return res.status(400).json({ message: "Missing date or userId parameter" });
    }

    const result = await pool.query(
      `SELECT * FROM activities WHERE date = $1 AND user_id = $2 ORDER BY start_time ASC`,
      [date, userId]
    );

    res.json({ activities: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching today's activities" });
  }
});

// Fetch activities for the current month
router.get("/month", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE date BETWEEN $1 AND $2 AND user_id = $3 
       ORDER BY start_time ASC`,
      [
        startOfMonth.toISOString().split("T")[0],
        endOfMonth.toISOString().split("T")[0],
        userId
      ]
    );

    res.json({ activities: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching activities for this month" });
  }
});

// Create a new activity
router.post("/", async (req, res) => {
  try {
    const { userId, date, activityName, startTime, durationMinutes } = req.body;

    if (!userId || !date || !activityName || !startTime || !durationMinutes) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await pool.query(
      `INSERT INTO activities 
       (user_id, date, activity_name, start_time, duration_minutes) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, date, activityName, startTime, durationMinutes]
    );

    res.status(200).json({ message: "Activity saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving activity" });
  }
});

// Update activity status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["done", "ignored", "forgotten"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await pool.query(
      "UPDATE activities SET status = $1 WHERE id = $2",
      [status, id]
    );

    res.status(200).json({ message: "Activity status updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating activity status" });
  }
});

// Delete activity
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM activities WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Activity deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting activity" });
  }
});

// Update activity description
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }

    const result = await pool.query(
      "UPDATE activities SET description = $1 WHERE id = $2",
      [description.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.status(200).json({ message: "Description updated successfully!" });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({ message: "Error updating description" });
  }
});

// Fetch activities for the last 3 weeks based on week number and user
router.get("/weekly", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const currentDate = new Date();
    const currentWeek = dayjs(currentDate).week();
    const previousWeek = currentWeek - 1;
    const weekBeforePrevious = currentWeek - 2;

    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE user_id = $1 AND (
         EXTRACT(week FROM date) = $2 OR 
         EXTRACT(week FROM date) = $3 OR 
         EXTRACT(week FROM date) = $4
       )
       ORDER BY date ASC, start_time ASC`,
      [userId, currentWeek, previousWeek, weekBeforePrevious]
    );

    res.json({ activities: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching weekly activities" });
  }
});

export default router;
