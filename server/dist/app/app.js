"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const api_error_1 = require("../utils/api-error");
const routes_1 = require("../routes");
exports.app = (0, express_1.default)();
exports.app.use((0, morgan_1.default)("dev"));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use("/api/v1", routes_1.router);
exports.app.use((_req, _res, next) => {
    next(new api_error_1.ApiError(404, "Route not found"));
});
exports.app.use((error, _req, res, _next) => {
    const statusCode = error instanceof api_error_1.ApiError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Internal server error";
    res.status(statusCode).json({ message });
});
