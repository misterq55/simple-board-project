import { IsEmail, Length } from "class-validator";

export default class RegisterDto {
  @IsEmail(undefined, { message: "이메일 주소가 유효하지 않습니다." })
  email!: string;

  @Length(3, 32, { message: "사용자 이름은 3자 이상 32자 이하여야 합니다." })
  username!: string;

  @Length(3, 32, { message: "닉네임은 3자 이상 32자 이하여야 합니다." })
  nickname!: string;

  @Length(6, 255, { message: "비밀번호는 6자 이상이어야 합니다." })
  password!: string;
}
