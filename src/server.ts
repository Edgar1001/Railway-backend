import express from "express";
import cors, { CorsOptions } from "cors";
import bodyParser from "body-parser";
import { Pool } from "pg";
import authRoutes from "./auth";
import activitiesRoutes from "./routes/activities"; 
import profilesRoutes from "./routes/profiles"; 
import locationsRoutes from "./routes/locations";

// Create Express app
const app = express();

// Dynamically set PORT using process.env.PORT or fallback to 3000
const PORT = Number(process.env.PORT);  // Ensure PORT is always a number

// CORS setup - Allow local development domains and Railway deployed domain
const allowedOrigins = [
  
  "https://railway-backend-production-6769.up.railway.app",  // Your actual Railway URL when deployed
];

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`Blocked CORS request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));  // Use the configured CORS options
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes for API endpoints
app.use("/api", authRoutes);             
app.use("/api/activities", activitiesRoutes);
app.use("/api/profile", profilesRoutes); 
app.use("/api/locations", locationsRoutes);

// PostgreSQL Database Connection Setup using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // PostgreSQL connection string (from environment)
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('PostgreSQL connection error:', err));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
