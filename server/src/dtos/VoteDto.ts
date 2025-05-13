import { IsIn, IsOptional, IsNumber } from "class-validator";

export default class VoteDto {
  @IsNumber()
  @IsIn([-1, 0, 1], { message: "vote는 -1, 0, 1 중 하나여야 합니다." })
  value!: number;

  @IsOptional()
  postId?: number;

  @IsOptional()
  commentId?: number;
}
