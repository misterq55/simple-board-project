// server/src/index.ts
import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts"
import commentRoutes from "./routes/comments"
import voteRoutes from "./routes/votes"
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/votes", voteRoutes)

app.get("/", (_, res) => {
  res.send("Simple Board Project Server is running");
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("❌ Error during Data Source initialization", err);
  });
