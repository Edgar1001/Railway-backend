"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const pg_1 = require("pg");
const auth_1 = __importDefault(require("./auth"));
const activities_1 = __importDefault(require("./routes/activities"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const locations_1 = __importDefault(require("./routes/locations"));
// Create Express app
const app = (0, express_1.default)();
// Dynamically set PORT using process.env.PORT or fallback to 3000
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000; // Ensure PORT is a number
// CORS setup - Allow local development domains and Railway deployed domain
const allowedOrigins = [
    "https://backend-v2-production-ad85.up.railway.app", // Your actual Railway URL when deployed
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log(`Blocked CORS request from origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions)); // Use the configured CORS options
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
// Routes for API endpoints
app.use("/api", auth_1.default);
app.use("/api/activities", activities_1.default);
app.use("/api/profile", profiles_1.default);
app.use("/api/locations", locations_1.default);
// PostgreSQL Database Connection Setup using DATABASE_URL
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL, // Use DATABASE_URL provided by Railway
});
pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch((err) => console.error('PostgreSQL connection error:', err));
// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
