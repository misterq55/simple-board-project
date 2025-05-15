import { Router, Request, Response  } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import RegisterDto from "../dtos/RegisterDto";
import LoginDto from "../dtos/LoginDto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

const me = async(req: Request, res: Response) => {
  res.json((req as any).user)
}

const register = async (req: Request, res: Response) => {
  const dto = plainToInstance(RegisterDto, req.body);

  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const userRepo = AppDataSource.getRepository(User);

  const emailExists = await userRepo.findOneBy({ email: dto.email });
  if (emailExists) {
    res.status(409).json({ message: "이메일이 이미 존재합니다." });
    return;
  }

  const usernameExists = await userRepo.findOneBy({ username: dto.username });
  if (usernameExists) {
    res.status(409).json({ message: "사용자 이름이 이미 존재합니다." });
    return;
  }

  const nicknameExists = await userRepo.findOneBy({ nickname: dto.nickname });
  if (nicknameExists) {
    res.status(409).json({ message: "닉네임이 이미 존재합니다." });
    return;
  }

  const user = userRepo.create(dto); // bcrypt는 @BeforeInsert로 자동 처리됨
  await userRepo.save(user);

  res.status(201).json(user);
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ username });

  if (!user) {
    res.status(401).json({ message: "유저를 찾을 수 없습니다" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "비밀번호가 틀립니다" });
    return;
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1d" });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    })
    .json({ user });
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token").json({ message: "로그아웃 완료" });
};


router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", checkAuth, me)

export default router;
