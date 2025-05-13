import { Length } from "class-validator";

export default class PostDto {
  @Length(1, 100, { message: "제목은 1자 이상 100자 이하여야 합니다." })
  title!: string;

  @Length(1, 5000, { message: "본문은 1자 이상이어야 합니다." })
  body!: string;
}
