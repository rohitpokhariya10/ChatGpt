"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const accessTokenOptions = {
    expiresIn: env_1.env.accessTokenTtl
};
const refreshTokenOptions = {
    expiresIn: env_1.env.refreshTokenTtl
};
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign({ ...payload, type: "access" }, env_1.env.jwtAccessSecret, accessTokenOptions);
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign({ ...payload, type: "refresh" }, env_1.env.jwtRefreshSecret, refreshTokenOptions);
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtAccessSecret);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_1.env.jwtRefreshSecret);
}
