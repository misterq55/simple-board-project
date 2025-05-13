import {
    Entity,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import BaseEntity from "./Entity";
import { User } from "./User";
import Post from "./Post";
import Comment from "./Comment";

@Entity("votes")
export default class Vote extends BaseEntity {
    @Column()
    value!: number; // -1 | 0 | 1

    @Column()
    username!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "username", referencedColumnName: "username" })
    user!: User;

    @Column({ nullable: true })
    postId!: number;

    @ManyToOne(() => Post, (post) => post.votes, { nullable: true })
    post!: Post;

    @Column({ nullable: true })
    commentId!: number;

    @ManyToOne(() => Comment, (comment) => comment.votes, { nullable: true })
    comment!: Comment;
}