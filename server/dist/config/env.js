"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isProduction = exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name, fallback) {
    const value = process.env[name] ?? fallback;
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
exports.env = {
    port: Number(process.env.PORT ?? 5000),
    mongoUri: required("MONGODB_URI"),
    nodeEnv: process.env.NODE_ENV ?? "development",
    jwtAccessSecret: required("JWT_ACCESS_SECRET", "dev_access_secret"),
    jwtRefreshSecret: required("JWT_REFRESH_SECRET", "dev_refresh_secret"),
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? "7d",
    refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? "refreshToken",
    mistralapi: required("MISTRAL_API"),
};
exports.isProduction = exports.env.nodeEnv === "production";
