import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    // res.status(401).json({ message: "로그인이 필요합니다." });
    next();
    return;
  }

  try {
    // 1. 토큰 디코딩 (단순 payload)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret") as { username: string };

    // 2. payload 기반으로 실제 User 엔티티 조회
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ username: decoded.username });

    if (!user) {
      res.status(401).json({ message: "유저를 찾을 수 없습니다." });
      return;
    }

    // 3. 요청 객체에 user 엔티티 추가
    (req as any).user = user;

    next();
  } catch (err) {
    console.error("checkAuth 에러:", err);
    res.status(401).json({ message: "토큰 오류" });
    return;
  }
};
