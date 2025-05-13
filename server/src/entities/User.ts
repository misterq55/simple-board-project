// server/src/entities/User.ts
import {
    Entity,
    Column,
    Index,
    BeforeInsert,
    OneToMany,
    JoinColumn
  } from "typeorm";
  import { IsEmail, Length } from "class-validator";
  import bcrypt from "bcryptjs";
  import BaseEntity from "./Entity";
  import Post from "./Post";
  import Comment from "./Comment";
  import Vote from "./Vote";
import { Exclude } from "class-transformer";
  
  @Entity("users")
  export class User extends BaseEntity {
    @Index()
    @IsEmail(undefined, { message: "이메일 주소가 유효하지 않습니다." })
    @Length(1, 255, { message: "이메일은 필수입니다." })
    @Column({ unique: true })
    email!: string;
  
    @Index()
    @Length(3, 32, { message: "유저 이름은 3자 이상이어야 합니다." })
    @Column({ unique: true })
    username!: string;
  
    @Index()
    @Length(3, 32, { message: "닉네임은 3자 이상이어야 합니다." })
    @Column({ unique: true })
    nickname!: string;
  
    @Exclude()
    @Length(6, 255, { message: "비밀번호는 6자 이상이어야 합니다." })
    @Column()
    password!: string;
  
    @Column({ default: "admin" }) // 확장을 위해 기본값 'admin'
    role!: string;
  
    @OneToMany(() => Post, (post) => post.user)
    posts!: Post[];
  
    @OneToMany(() => Comment, (comment) => comment.user)
    comments!: Comment[];
  
    @OneToMany(() => Vote, (vote) => vote.user)
    votes!: Vote[];
  
    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  