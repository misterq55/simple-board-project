import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Post from "../entities/Post";
import Comment from "../entities/Comment";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

const getMyPosts = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const postRepo = AppDataSource.getRepository(Post);

  const [posts, total] = await postRepo.findAndCount({
    where: { username: user.username },
    order: { createdAt: "DESC" },
    relations: ["user", "comments", "votes"],
    take: limit,
    skip,
  });

  posts.forEach((p) => p.setUserVote?.(user));

  res.status(200).json({
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};

const getMyComments = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const commentRepo = AppDataSource.getRepository(Comment);

  const [comments, total] = await commentRepo.findAndCount({
    where: { username: user.username },
    order: { createdAt: "DESC" },
    relations: ["user", "post", "votes"],
    take: limit,
    skip,
  });

  comments.forEach((c) => c.setUserVote?.(user));

  res.status(200).json({
    comments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};

router.get("/mypage/posts", checkAuth, getMyPosts);
router.get("/mypage/comments", checkAuth, getMyComments);

export default router;