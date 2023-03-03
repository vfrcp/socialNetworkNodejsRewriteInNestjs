import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne} from "typeorm";
import { User } from "../user/user.entity";

@Entity("chats") 
export class Chat {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(type => User, user => user.id)
  user1_id: number

  @OneToOne(type => User, user => user.id)
  user2_id: number
}

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn()
  id: number

  @Column({name: "content", type: "varchar"})
  content: string

  @Column({name: "edited", type: "boolean"})
  edited: boolean

  @Column({name: "send_date", type: "date", default: new Date()})
  send_date: number

  @Column({name: "is_first_user_sender", type: "boolean"})
  is_first_user_sender: boolean

  @ManyToOne(type => Chat, chat => chat.id)
  chat_id: number
}