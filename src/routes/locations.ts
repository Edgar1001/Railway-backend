import express from "express";
import { pool } from "../db"; // assuming your db.ts exports a "pool"

const router = express.Router();

// POST route to save a user's location
router.post("/", async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Missing required fields: userId, latitude, longitude" });
    }

    console.log('Saving location for user:', userId, latitude, longitude);  // Debugging line

    // Insert the location into the user_locations table
    const result = await pool.query(
      "INSERT INTO user_locations (user_id, latitude, longitude) VALUES ($1, $2, $3)",
      [userId, latitude, longitude]
    );

    console.log('Location saved:', result);  // Debugging line

    res.status(200).json({ message: "Location saved successfully!" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Now we know that error is an instance of the Error class
      console.error('Error saving location:', error.message);  // Log error message
      res.status(500).json({ message: "Error saving location", error: error.message, stack: error.stack });
    } else {
      // Handle the case where the error is not of type Error
      console.error('An unknown error occurred:', error);
      res.status(500).json({ message: "Error saving location", error: "Unknown error occurred" });
    }
  }
});





// GET route to retrieve locations for a user by userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM user_locations WHERE user_id = $1 ORDER BY timestamp DESC",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No locations found for this user" });
    }

    res.status(200).json({ locations: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching locations" });
  }
});


export default router;
