"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // ⬅️ import CorsOptions
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./auth"));
const activities_1 = __importDefault(require("./routes/activities"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const locations_1 = __importDefault(require("./routes/locations"));
const app = (0, express_1.default)();
const PORT = 3000;
// CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:8081",
    "http://localhost:19006",
    "http://localhost:19000",
    "http://192.168.1.108:19006", // ✅ Add your Expo dev server
    "exp://192.168.1.108", // ✅ Add Expo Go scheme
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
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json({ limit: '10mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use("/api", auth_1.default);
app.use("/api/activities", activities_1.default);
app.use("/api/profile", profiles_1.default);
app.use("/api/locations", locations_1.default);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
