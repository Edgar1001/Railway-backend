import express from "express";
import cors, { CorsOptions } from "cors"; // ⬅️ import CorsOptions
import bodyParser from "body-parser";
import authRoutes from "./auth";
import activitiesRoutes from "./routes/activities"; 
import profilesRoutes from "./routes/profiles"; 
import locationsRoutes from "./routes/locations";

const app = express();
const PORT = 3000;

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8081",
  "http://localhost:19006",
  "http://localhost:19000",
  "http://192.168.1.108:19006", // ✅ Add your Expo dev server
  "exp://192.168.1.108",        // ✅ Add Expo Go scheme
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

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use("/api", authRoutes);             
app.use("/api/activities", activitiesRoutes);
app.use("/api/profile", profilesRoutes); 
app.use("/api/locations", locationsRoutes);


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

