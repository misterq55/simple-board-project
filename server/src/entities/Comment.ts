import {
    Entity,
    Column,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany,
    BeforeInsert
  } from "typeorm";
  import { Exclude, Expose } from "class-transformer";
  import BaseEntity from "./Entity";
  import { User } from "./User";
  import Post from "./Post";
  import Vote from "./Vote";
  import { makeId } from "../utils/helpers";
  
  @Entity("comments")
  export default class Comment extends BaseEntity {
    @Index()
    @Column()
    identifier!: string;
  
    @Column()
    body!: string;
  
    @Column()
    username!: string;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user!: User;
  
    @Column()
    postId!: number;
  
    @ManyToOne(() => Post, (post) => post.comments)
    post!: Post;
  
    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.comment)
    votes!: Vote[];
  
    protected userVote!: number;
  
    setUserVote(user: User) {
      const vote = this.votes?.find(v => v.username === user.username);
      this.userVote = vote ? vote.value : 0;
    }
  
    @Expose()
    get voteScore(): number {
      return this.votes?.reduce((sum, v) => sum + (v.value || 0), 0) ?? 0;
    }
  
    @Expose()
    get myVote(): number {
      return this.userVote ?? 0;
    }
  
    @BeforeInsert()
    makeId() {
      this.identifier = makeId(8);
    }
  }