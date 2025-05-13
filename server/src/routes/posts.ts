import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import Post from "../entities/Post";
import PostDto from "../dtos/PostDto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { checkAuth } from "../middleware/checkAuth";
import { ILike } from "typeorm";

const router = Router();

const post = async (req: Request, res: Response) => {
  const dto = plainToInstance(PostDto, req.body);
  const errors = await validate(dto);
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const user = (req as any).user;

  const postRepo = AppDataSource.getRepository(Post);
  const post = postRepo.create({
    title: dto.title,
    body: dto.body,
    username: user.username,
    user: user
  });

  await postRepo.save(post);

  res.status(201).json(post);
}

const getPostList = async (req: Request, res: Response) => {
  const postRepo = AppDataSource.getRepository(Post);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [posts, total] = await postRepo.findAndCount({
    order: { createdAt: "DESC" },
    relations: ["user", "comments", "votes"],
    take: limit,
    skip,
  });

  posts.forEach((p) => p.setUserVote((req as any).user));

  res.status(200).json({
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};


const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;

  const postRepo = AppDataSource.getRepository(Post);

  try {
    const post = await postRepo.findOneOrFail({
      where: { identifier, slug },
      relations: ["user", "comments", "votes"]
    });

    post.setUserVote((req as any).user); // 로그인한 사용자의 추천 여부 반영

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
}

const updatePost = async (req: Request, res: Response) => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id: Number(req.params.id) }, relations: ['user'] });

  if (!post || post.user.username !== res.locals.user.username) {
    res.status(403).json({ error: '권한이 없습니다.' });
    return
  }

  post.title = req.body.title;
  post.body = req.body.content;
  await postRepo.save(post);

  res.json(post);
};

const deletePost = async (req: Request, res: Response) => {
  const postRepo = AppDataSource.getRepository(Post);
  const post = await postRepo.findOne({ where: { id: Number(req.params.id) }, relations: ['user'] });

  if (!post || post.user.username !== res.locals.user.username) {
    res.status(403).json({ error: '권한이 없습니다.' });
    return;
  }

  await postRepo.remove(post);
  res.status(204).send();
};

const searchPosts = async (req: Request, res: Response) => {
  const keyword = (req.query.keyword as string || "").trim();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!keyword) {
    res.status(400).json({ message: "검색어(keyword)가 필요합니다." });
    return;
  }

  const postRepo = AppDataSource.getRepository(Post);

  const [posts, total] = await postRepo.findAndCount({
    where: [
      { title: ILike(`%${keyword}%`) },
      { body: ILike(`%${keyword}%`) }
    ],
    order: { createdAt: "DESC" },
    relations: ["user", "comments", "votes"],
    take: limit,
    skip,
  });

  posts.forEach((p) => p.setUserVote?.((req as any).user));

  res.status(200).json({
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
};

router.post("/", checkAuth, post);
router.get("/", getPostList);
router.get("/:identifier/:slug", getPost);
router.put('/posts/:id', checkAuth, updatePost);
router.delete('/posts/:id', checkAuth, deletePost);
router.get("/search", searchPosts);


export default router;
