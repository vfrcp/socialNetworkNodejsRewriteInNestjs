import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../user/user.entity";

@Entity("posts") 
export class Post {
  @PrimaryGeneratedColumn()
  id: number
  
  @Column({name: "title", type: "varchar"})
  title: string

  @Column({name: "content", type: "varchar"})
  content: string

  @Column({name: "views", type: "int"})
  views: number

  // @Column({name: "likes", type: "number", default: 0})
  // likes: number

  // @Column({name: "dislikes", type: "number", default: 0})
  // dislikes: number

  @Column({name: "creation_date", type: "date", default: new Date()})
  creation_date: number

  @Column({name: "user_id", type: "int"})
  user_id: number
}

@Entity("post_reactions")
export class PostReaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "is_positive", type: "boolean"})
  is_positive: boolean
  
  @ManyToOne(type => Post, post => post.id)
  post_id: number

  @ManyToOne(type => User, user => user.id)
  user_id: number
}