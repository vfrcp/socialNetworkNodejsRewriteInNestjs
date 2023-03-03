import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";

@Entity("post_comments")
export class PostComment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "content", type: "varchar"})
  content: string

  @Column({name: "is_edited", type: "boolean", default: false})
  is_edited: boolean

  @Column({name: "is_has_replays", type: "boolean", default: false})
  is_has_replays: boolean

  @ManyToOne(type => User, user => user.id)
  user_id: number
}

//TODO: С лайками позже разобраться
@Entity("post_comment_replays")
export class PostCommentReplay {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "content", type: "varchar"})
  content: string

  @Column({name: "is_edited", type: "boolean"})
  is_edited: boolean

  @ManyToOne(type => User, user => user.id)
  user_id: number

  @ManyToOne(type => PostComment, postComment => postComment.id)
  comment_id: number
}

@Entity("post_comment_reactions")
export class PostCommentReaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "is_positive", type: "boolean"})
  is_positive: boolean

  @ManyToOne(type => User, user => user.id)
  user_id: number
  @ManyToOne(type => PostComment, postComment => postComment.id)
  comment_id: number
}