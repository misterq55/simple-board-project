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

  let targetPost = null;
  let targetComment = null;

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
  } else {
    res.status(400).json({ message: "postId 또는 commentId가 필요합니다." });
    return;
  }

  const existingVote = await voteRepo.findOne({
    where: {
      username: user.username,
      ...(dto.postId ? { postId: dto.postId } : {}),
      ...(dto.commentId ? { commentId: dto.commentId } : {})
    }
  });

  if (!existingVote && dto.value !== 0) {
    const vote = voteRepo.create({
      value: dto.value,
      user,
      username: user.username,
      post: targetPost,
      comment: targetComment
    } as Partial<Vote>);
    await voteRepo.save(vote);
  } else if (existingVote && dto.value === 0) {
    await voteRepo.remove(existingVote);
  } else if (existingVote && existingVote.value !== dto.value) {
    existingVote.value = dto.value;
    await voteRepo.save(existingVote);
  }

  res.status(200).json({ message: "투표 완료" });
}

router.post("/", checkAuth, vote);

export default router;
