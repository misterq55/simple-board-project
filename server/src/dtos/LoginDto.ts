import { IsEmail, Length } from "class-validator";

export default class LoginDto {
  @IsEmail(undefined, { message: "이메일 형식이 아닙니다." })
  email!: string;

  @Length(6, 255, { message: "비밀번호는 6자 이상이어야 합니다." })
  password!: string;
}
