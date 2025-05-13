import { Length } from "class-validator";

export default class CommentDto {
  @Length(1, 5000, { message: "댓글은 1자 이상이어야 합니다." })
  body!: string;

  postId!: number;
}
