"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const mongoose_1 = require("mongoose");
const env_1 = require("../config/env");
const user_dao_1 = require("../dao/user.dao");
const session_dao_1 = require("../dao/session.dao");
const api_error_1 = require("../utils/api-error");
const async_handler_1 = require("../utils/async-handler");
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
function cookieOptions() {
    return {
        httpOnly: true,
        sameSite: "lax",
        secure: env_1.isProduction,
        path: "/"
    };
}
function sanitizeUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
}
async function createSessionAndTokens(params) {
    const sessionId = new mongoose_1.Types.ObjectId().toString();
    const refreshToken = (0, jwt_1.signRefreshToken)({ userId: params.userId, sessionId });
    const accessToken = (0, jwt_1.signAccessToken)({ userId: params.userId, email: params.email });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await session_dao_1.sessionDao.createSession({
        sessionId,
        userId: params.userId,
        refreshTokenHash: (0, crypto_1.sha256)(refreshToken),
        expiresAt,
        userAgent: params.userAgent,
        ipAddress: params.ipAddress
    });
    return { accessToken, refreshToken, sessionId };
}
exports.register = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await user_dao_1.userDao.findByEmail(String(email));
    if (existing) {
        throw new api_error_1.ApiError(409, "User already exists");
    }
    const passwordHash = await (0, crypto_1.hashPassword)(String(password));
    const user = await user_dao_1.userDao.createUser({
        name: String(name),
        email: String(email).toLowerCase(),
        passwordHash
    });
    const { accessToken, refreshToken } = await createSessionAndTokens({
        userId: user._id.toString(),
        email: user.email,
        userAgent: req.headers["user-agent"] ?? "unknown",
        ipAddress: req.ip ?? "unknown"
    });
    res.cookie(env_1.env.refreshCookieName, refreshToken, cookieOptions());
    const response = {
        message: "Registered successfully",
        accessToken,
        refreshToken,
        user: sanitizeUser({
            _id: user._id.toString(),
            name: user.name,
            email: user.email
        })
    };
    res.status(201).json(response);
});
exports.login = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_dao_1.userDao.findByEmail(String(email));
    if (!user) {
        throw new api_error_1.ApiError(401, "Invalid credentials");
    }
    const isValid = await (0, crypto_1.comparePassword)(String(password), user.passwordHash);
    if (!isValid) {
        throw new api_error_1.ApiError(401, "Invalid credentials");
    }
    const { accessToken, refreshToken } = await createSessionAndTokens({
        userId: user._id.toString(),
        email: user.email,
        userAgent: req.headers["user-agent"] ?? "unknown",
        ipAddress: req.ip ?? "unknown"
    });
    res.cookie(env_1.env.refreshCookieName, refreshToken, cookieOptions());
    const response = {
        message: "Logged in successfully",
        accessToken,
        refreshToken,
        user: sanitizeUser({ _id: user._id.toString(), name: user.name, email: user.email })
    };
    res.status(200).json(response);
});
exports.refresh = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const incomingToken = req.cookies[env_1.env.refreshCookieName] ??
        (req.body.refreshToken ? String(req.body.refreshToken) : "");
    if (!incomingToken) {
        throw new api_error_1.ApiError(401, "Refresh token is required");
    }
    const payload = (0, jwt_1.verifyRefreshToken)(incomingToken);
    if (payload.type !== "refresh") {
        throw new api_error_1.ApiError(401, "Invalid refresh token type");
    }
    const session = await session_dao_1.sessionDao.findActiveById(payload.sessionId);
    if (!session) {
        throw new api_error_1.ApiError(401, "Session is not active");
    }
    const user = await user_dao_1.userDao.findById(payload.userId);
    if (!user) {
        await session_dao_1.sessionDao.revokeById(payload.sessionId);
        throw new api_error_1.ApiError(401, "User not found for session");
    }
    const sameToken = (0, crypto_1.sha256)(incomingToken) === session.refreshTokenHash;
    if (!sameToken) {
        await session_dao_1.sessionDao.revokeById(payload.sessionId);
        throw new api_error_1.ApiError(401, "Invalid session token");
    }
    await session_dao_1.sessionDao.revokeById(payload.sessionId);
    const nextAccessToken = (0, jwt_1.signAccessToken)({
        userId: payload.userId,
        email: user.email
    });
    const nextSessionId = new mongoose_1.Types.ObjectId().toString();
    const nextRefreshToken = (0, jwt_1.signRefreshToken)({ userId: payload.userId, sessionId: nextSessionId });
    await session_dao_1.sessionDao.createSession({
        sessionId: nextSessionId,
        userId: payload.userId,
        refreshTokenHash: (0, crypto_1.sha256)(nextRefreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userAgent: req.headers["user-agent"] ?? "unknown",
        ipAddress: req.ip ?? "unknown"
    });
    res.cookie(env_1.env.refreshCookieName, nextRefreshToken, cookieOptions());
    const response = {
        message: "Token refreshed",
        accessToken: nextAccessToken,
        refreshToken: nextRefreshToken,
        user: sanitizeUser({
            _id: user._id.toString(),
            name: user.name,
            email: user.email
        })
    };
    res.status(200).json(response);
});
exports.logout = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const incomingToken = req.cookies[env_1.env.refreshCookieName] ??
        (req.body.refreshToken ? String(req.body.refreshToken) : "");
    if (incomingToken) {
        try {
            const payload = (0, jwt_1.verifyRefreshToken)(incomingToken);
            await session_dao_1.sessionDao.revokeById(payload.sessionId);
        }
        catch {
            // Do not leak token verification details during logout.
        }
    }
    res.clearCookie(env_1.env.refreshCookieName, cookieOptions());
    res.status(200).json({ message: "Logged out successfully" });
});
exports.forgotPassword = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { email } = req.body;
    const user = await user_dao_1.userDao.findByEmail(String(email));
    if (user) {
        const rawToken = (0, crypto_1.generateRandomToken)();
        await user_dao_1.userDao.setResetToken(user._id.toString(), (0, crypto_1.sha256)(rawToken), new Date(Date.now() + 15 * 60 * 1000));
        res.status(200).json({
            message: "If the account exists, a reset link has been generated.",
            resetToken: env_1.isProduction ? undefined : rawToken
        });
        return;
    }
    res.status(200).json({ message: "If the account exists, a reset link has been generated." });
});
exports.resetPassword = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { token, newPassword } = req.body;
    const user = await user_dao_1.userDao.findByValidResetToken((0, crypto_1.sha256)(String(token)));
    if (!user) {
        throw new api_error_1.ApiError(400, "Invalid or expired reset token");
    }
    const nextPasswordHash = await (0, crypto_1.hashPassword)(String(newPassword));
    await user_dao_1.userDao.updatePassword(user._id.toString(), nextPasswordHash);
    await session_dao_1.sessionDao.revokeAllByUser(user._id.toString());
    res.status(200).json({ message: "Password reset successfully" });
});
