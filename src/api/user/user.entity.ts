import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Post } from "../post/post.entity";

@Entity("users") 
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "username", type: "varchar", unique: true})
  username: string

  @Column({name: "email", type: "varchar", unique: true})
  email: string

  @Column({name: "password", type: "varchar"})
  password: string

  @Column({name: "registration_date", type: "date", default: new Date()})
  registration_date: number

  @Column({name: "about", type: "varchar"})
  about: string

  // @OneToMany(type => Subscriber, subscriber => subscriber.user_id)
  // subscribers: Subscriber[]

  // @OneToMany(type => Subscriber,  subscriber => subscriber.user_id)
  // subscription: Subscriber[]

  // @OneToMany(type => Blocked_user, blocked_user => blocked_user.user_id)
  // blocked_user: Blocked_user[]

  @OneToMany(type => Post, post => post.user_id)
  posts: Post[]
}

@Entity("subscribers") 
export class Subscriber {
  @PrimaryGeneratedColumn()
  id: number

  //@Column({name: "subscriber_user_id", type: "int"})
  @ManyToOne(type => User, user => user.id)
  subscriber_user_id: number

  // @Column({name: "user_id", type: "int"})
  @ManyToOne(type => User, user => user.id)
  user_id: number
}

@Entity("blocked_users")
export class BlockedUser {
  @PrimaryGeneratedColumn()
  id: number

  // @Column({name: "blocked_user_id", type: "int"})

  // @Column({name: "user_id", type: "int"})
  @ManyToOne(type => User, user => user.id)
  user_id: number

  @ManyToOne(type => User, user => user.id)
  blocked_user_id: number
}