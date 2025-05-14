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
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pg_1 = require("pg");
// Use DATABASE_URL directly instead of individual variables
console.log("Connecting to PostgreSQL with DATABASE_URL:");
console.log({
    connectionString: process.env.DATABASE_URL ? "******" : "NOT SET", // Masking the actual connection string for logs
});
// Create the pool using DATABASE_URL environment variable
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL, // PostgreSQL connection string from environment
});
// Test the connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield exports.pool.query("SELECT NOW()");
        console.log("✅ PostgreSQL connected:", result.rows[0]);
    }
    catch (error) {
        console.error("❌ PostgreSQL connection error:", error);
    }
}))();
