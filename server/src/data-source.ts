// server/src/data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import Post from "./entities/Post";
import Comment from "./entities/Comment";
import Vote from "./entities/Vote";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // 개발 시 true (배포 시엔 false)
  logging: true,
  entities: [User, Post, Comment, Vote],
  migrations: [],
  subscribers: [],
});
