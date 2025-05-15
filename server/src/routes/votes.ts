import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import VoteDto from "../dtos/VoteDto";
import Vote from "../entities/Vote";
import Post from "../entities/Post";
import Comment from "../entities/Comment";
import { checkAuth } from "../middleware/checkAuth";

const router = Router();

const vote = async (req: Request, res: Response) => {
  const dto = plainToInstance(VoteDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const user = (req as any).user;
  const voteRepo = AppDataSource.getRepository(Vote);

  let targetPost: Post | null = null;
  let targetComment: Comment | null = null;

  // 대상 객체 찾기
  if (dto.postId) {
    targetPost = await AppDataSource.getRepository(Post).findOneBy({ id: dto.postId });
    if (!targetPost) {
      res.status(404).json({ message: "게시글이 존재하지 않습니다." });
      return;
    }
  } else if (dto.commentId) {
    targetComment = await AppDataSource.getRepository(Comment).findOneBy({ id: dto.commentId });
    if (!targetComment) {
      res.status(404).json({ message: "댓글이 존재하지 않습니다." });
      return;
    }

    if (targetComment.username === user.username) {
      res.status(403).json({ message: "본인 댓글은 추천할 수 없습니다." });
      return;
    }
  } else {
    res.status(400).json({ message: "postId 또는 commentId가 필요합니다." });
    return;
  }

  // 기존 투표 조회 (관계 기반 조회!)
  const existingVote = await voteRepo.findOne({
    where: {
      username: user.username,
      ...(targetPost ? { post: targetPost } : {}),
      ...(targetComment ? { comment: targetComment } : {}),
    },
    relations: ["post", "comment"],
  });

  // 투표 처리
  if (!existingVote && dto.value !== 0) {
    const newVote = voteRepo.create({
      value: dto.value,
      user,
      username: user.username,
      post: targetPost ?? null,
      comment: targetComment ?? null,
    } as Partial<Vote>);
    await voteRepo.save(newVote);
  } else if (existingVote && dto.value === 0) {
    await voteRepo.remove(existingVote);
  } else if (existingVote && existingVote.value !== dto.value) {
    existingVote.value = dto.value;
    await voteRepo.save(existingVote);
  }

  res.status(200).json({
    message: "투표 완료",
    vote: dto.value,
    postId: dto.postId ?? null,
    commentId: dto.commentId ?? null,
  });
};

router.post("/", checkAuth, vote);

export default router;
