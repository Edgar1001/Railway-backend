// src/routes/activities.ts
import express from "express";
import { pool } from "../db"; // assuming your db.ts exports a "pool"
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear'; 

// Extend dayjs with the weekOfYear plugin
dayjs.extend(weekOfYear);

const router = express.Router();


router.get("/today", async (req, res) => {
    try {
      const { date } = req.query; // example: 2025-04-26
  
      if (!date) {
        return res.status(400).json({ message: "Missing date parameter" });
      }
  
      const result = await pool.query(
        `SELECT * FROM activities WHERE date = $1 ORDER BY start_time ASC`,
        [date]
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
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
      const result = await pool.query(
          `SELECT * FROM activities WHERE date BETWEEN $1 AND $2 ORDER BY start_time ASC`,
          [startOfMonth.toISOString().split("T")[0], endOfMonth.toISOString().split("T")[0]]
      );
  
      res.json({ activities: result.rows });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching activities for this month" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { date, activityName, startTime, durationMinutes } = req.body;

    if (!date || !activityName || !startTime || !durationMinutes) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await pool.query(
      "INSERT INTO activities (date, activity_name, start_time, duration_minutes) VALUES ($1, $2, $3, $4)",
      [date, activityName, startTime, durationMinutes]
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

  // DELETE activity
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

  // PATCH activity description
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


// Fetch activities for the last 3 weeks (current week and 2 previous weeks) based on week numbers of the current year
// src/routes/activities.ts
router.get("/weekly", async (req, res) => {
  try {
    const currentDate = new Date();
    
    // Calculate the week number for the current week, previous week, and week before the previous week
    const currentWeek = dayjs(currentDate).week();  // Current week number of the year
    const previousWeek = currentWeek - 1;  // Previous week number
    const weekBeforePrevious = currentWeek - 2;  // Week before previous week number

    // Query to fetch activities for the last 3 weeks based on week numbers, without filtering by status
    const result = await pool.query(
      `SELECT * FROM activities 
       WHERE (EXTRACT(week FROM date) = $1 OR EXTRACT(week FROM date) = $2 OR EXTRACT(week FROM date) = $3)
       ORDER BY date ASC, start_time ASC`,
      [currentWeek, previousWeek, weekBeforePrevious]
    );

    // Send back the activities without filtering by status
    res.json({ activities: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching weekly activities" });
  }
});


export default router;
