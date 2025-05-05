import express, { Request, Response } from "express";
import { pool } from "./db"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing credentials" });

  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userQuery.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    // 🛠️ Now also return userId
    res.json({ token, userId: user.id }); 
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;


