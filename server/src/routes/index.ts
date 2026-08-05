import { Router } from "express";
import { authRouter } from "./auth.routes";
import { chatRouter } from "./chat.routes";


const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

router.use("/auth", authRouter);
router.use("/chat", chatRouter);

export { router };
