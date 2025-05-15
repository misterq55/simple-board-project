import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import CommentDto from "../dtos/CommentDto";
import Comment from "../entities/Comment";
import Post from "../entities/Post";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

const comment = async (req: Request, res: Response) => {
  const dto = plainToInstance(CommentDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const user = (req as any).user;

  const post = await AppDataSource.getRepository(Post).findOneBy({ id: dto.postId });
  if (!post) {
    res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    return;
  }

  const comment = AppDataSource.getRepository(Comment).create({
    body: dto.body,
    username: user.username,
    user,
    post
  });

  await AppDataSource.getRepository(Comment).save(comment);
  res.status(201).json(comment);
}

const getCommentList = async (req: Request, res: Response) => {
  const postId = Number(req.query.postId);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!postId) {
    res.status(400).json({ message: "postId가 필요합니다." });
    return;
  }

  const commentRepo = AppDataSource.getRepository(Comment);

  const [comments, total] = await commentRepo.findAndCount({
    where: { post: { id: postId } },
    order: { createdAt: "DESC" },
    relations: ["user", "votes"],
    take: limit,
    skip,
  });

  const user = (req as any).user;

  comments.forEach((c) => {
    if (user) c.setUserVote(user); // ✅ null 체크 추가
  });


  res.status(200).json({
    comments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};


const updateComment = async (req: Request, res: Response) => {
  const commentRepo = AppDataSource.getRepository(Comment);
  const user = (req as any).user;

  const comment = await commentRepo.findOne({
    where: { id: Number(req.params.id) },
    relations: ["user"]
  });

  if (!comment) {
    res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    return
  }

  if (comment.user.username !== user.username) {
    res.status(403).json({ message: "수정 권한이 없습니다." });
    return
  }

  comment.body = req.body.content ?? comment.body;

  await commentRepo.save(comment);

  res.status(200).json(comment);
};


const deleteComment = async (req: Request, res: Response) => {
  const commentRepo = AppDataSource.getRepository(Comment);
  const user = (req as any).user;

  const comment = await commentRepo.findOne({
    where: { id: Number(req.params.id) },
    relations: ["user"]
  });

  if (!comment) {
    res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    return
  }

  if (comment.user.username !== user.username) {
    res.status(403).json({ message: "삭제 권한이 없습니다." });
    return
  }

  await commentRepo.remove(comment);

  res.status(204).send();
};


router.post("/", checkAuth, comment);
router.put("/:id", checkAuth, updateComment);
router.delete("/:id", checkAuth, deleteComment);
router.get("/", getCommentList)

export default router;
