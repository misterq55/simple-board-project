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
  import Comment from "./Comment";
  import Vote from "./Vote";
  import { makeId } from "../utils/helpers";
  import { slugify } from "transliteration";
  
  @Entity("posts")
  export default class Post extends BaseEntity {
    @Index()
    @Column()
    identifier!: string; // URL용 고유 ID
  
    @Column()
    title!: string;
  
    @Column({nullable: false})
    slug!: string; // 제목 기반 slug
  
    @Column({ nullable: true, type: "text" })
    body!: string;
  
    @Column()
    username!: string;
  
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user!: User;
  
    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.post)
    comments!: Comment[];
  
    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.post)
    votes!: Vote[];
  
    protected userVote!: number;
  
    setUserVote(user: User) {
      const vote = this.votes?.find(v => v.username === user.username);
      this.userVote = vote ? vote.value : 0;
    }
  
    @Expose()
    get url(): string {
      return `${this.identifier}/${this.slug}`;
    }
  
    @Expose()
    get commentCount(): number {
      return this.comments?.length ?? 0;
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
    makeIdAndSlug() {
      this.identifier = makeId(7);
      this.slug = slugify(this.title);
    }
  }
  