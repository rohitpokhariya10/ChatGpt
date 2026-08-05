import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import { ApiError } from "../utils/api-error";
import { router } from "../routes";


export const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : "Internal server error";

  res.status(statusCode).json({ message });
});
