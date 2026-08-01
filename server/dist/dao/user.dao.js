"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDao = void 0;
const user_model_1 = require("./models/user.model");
class UserDao {
    async createUser(input) {
        const user = await user_model_1.UserModel.create(input);
        return user;
    }
    async findByEmail(email) {
        return user_model_1.UserModel.findOne({ email: email.toLowerCase() });
    }
    async findById(userId) {
        return user_model_1.UserModel.findById(userId);
    }
    async setResetToken(userId, tokenHash, expiresAt) {
        return user_model_1.UserModel.findByIdAndUpdate(userId, {
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: expiresAt
        }, { new: true });
    }
    async findByValidResetToken(tokenHash) {
        return user_model_1.UserModel.findOne({
            resetPasswordTokenHash: tokenHash,
            resetPasswordExpiresAt: { $gt: new Date() }
        });
    }
    async updatePassword(userId, passwordHash) {
        return user_model_1.UserModel.findByIdAndUpdate(userId, {
            passwordHash,
            resetPasswordTokenHash: null,
            resetPasswordExpiresAt: null
        }, { new: true });
    }
}
exports.userDao = new UserDao();
