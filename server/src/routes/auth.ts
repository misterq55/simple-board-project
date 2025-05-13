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

const login = async (req: Request, res: Response) => {
  const dto = plainToInstance(LoginDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email: dto.email });

  if (!user) {
    res.status(401).json({ message: "잘못된 이메일입니다." });
    return;
  }

  const isValid = await bcrypt.compare(dto.password, user.password);
  if (!isValid) {
    res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    return;
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      createdAt: user.createdAt
    }
  });
}

router.post("/register", register);
router.post("/login", login);
router.get("/me", checkAuth, me)

export default router;
