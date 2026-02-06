console.log("✅ protected.routes.js loaded");

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

export default router;
