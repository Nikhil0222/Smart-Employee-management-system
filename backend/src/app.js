import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/profile", (req, res) => {
  res.json({ message: "INLINE profile route works" });
});

app.get("/", (req, res) => {
  res.json({ message: "SEMS Backend Running 🚀" });
});

export default app;
