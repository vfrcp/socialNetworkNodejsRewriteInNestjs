import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlockedUser, User } from "../user/user.entity";
import { Repository } from "typeorm";
import { Chat, Message } from "./chat.entity";
import { generateSuccessResponse, generateWrongResponse } from "src/helpers/response";

@Injectable()
export class ChatService {
  constructor (
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser) private readonly blockUserRepository: Repository<BlockedUser>,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>
  ) {}
  async create (userId: number, interlocutorId: number) {
    try {
      const userInterlocutor = await this.userRepository.findOneBy({id: interlocutorId})
      if(!userInterlocutor) throw "" // usersControllerAnswers.notFoundOneUser
      //Если человек который создает чат раньше добавил человека в блок, он автоматом удаляется.
      //Но если тот кто в блоке пытается создать в чат, у него не выходит
      const block = await this.blockUserRepository.findOneBy({user_id: interlocutorId, blocked_user_id: userId})
      await this.blockUserRepository.delete({user_id: userId, blocked_user_id: interlocutorId})
      if(block) throw "" // chatsControllerAnswers.userBlocked
      const newChat = this.chatRepository.create({user1_id: userId, user2_id: interlocutorId}) 
      await this.chatRepository.save(newChat)
      return generateSuccessResponse(newChat.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getLastMessagesByChatIdAndPage (chatId: number, page: number, userId: number) {
    try {
      const indexes = {
        start: page === 1? 0 : (page - 1) * 25,
        end: page * 25
      }
      const chat = await this.chatRepository.findOneBy({id: chatId})
      if(!chat) throw "" // chatsControllerAnswers.notFoundChat
      if(chat.user1_id !== userId && chat.user2_id !== userId) throw "" // chatsControllerAnswers.notYourChat
      // const messages = await pool.query(
      //   `SELECT * FROM messages WHERE chat_id = $1 ORDER BY send_date DESC OFFSET ${indexes.start} LIMIT ${indexes.end}`, 
      // [chatId])
      const messages = await this.messageRepository.findBy({chat_id: chat.id})
      if(!messages) throw "" // chatsControllerAnswers.chatEmpty
      return generateSuccessResponse(messages)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getMyChatsByPage (userId: number, page: number) {
    try {
      const indexes = {
        start: page === 1? 0 : (page - 1) * 25,
        end: page * 25
      }
      // const chats = await pool.query(
      //   `SELECT * FROM chats WHERE user1_id = $1 OR user2_id = $1 OFFSET ${indexes.start} LIMIT ${indexes.end}`, 
      // [userId])
      const chats = await this.chatRepository.find({where: [
        {user1_id: userId},
        {user2_id: userId}
      ]})
      if(!chats) throw "" // chatsControllerAnswers.notFoundChats
      return generateSuccessResponse(chats)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async sendMessageByChatId (userId: number, chatId: number, content: string) {
    try {
      const chat = await this.chatRepository.findOneBy({id: chatId})
      if(!chat) throw "" // chatsControllerAnswers.notFoundChat 
      if(chat.user1_id !== userId && chat.user2_id !== userId) throw "" // chatsControllerAnswers.notYourChat
      const {user1_id, user2_id} = chat
      const interlocutorId = user1_id === userId? user1_id : user2_id
      //Если человек который отправляет сообщение раньше добавил человека в блок, он автоматом удаляется.
      //Но если отправляет тот кто в блоке, у него не выходит
      const block = await this.blockUserRepository.findOneBy({blocked_user_id: interlocutorId, user_id: userId})
      if(block) throw "" // chatsControllerAnswers.userBlocked
      await this.blockUserRepository.delete({id: userId, blocked_user_id: interlocutorId})
      const newMessage = this.messageRepository.create({content, is_first_user_sender: user1_id === userId, chat_id: chatId})
      await this.messageRepository.save(newMessage)
      return generateSuccessResponse(newMessage.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async editMessageByMessageId (userId: number, messageId: number, content: string) {
    try {
      const message = await pool.query("SELECT * FROM messages WHERE id = $1", [messageId])
      if(!message.rowCount) throw chatsControllerAnswers.notFoundMessage
      const chat = await pool.query("SELECT * FROM chats WHERE id = $1", [message.rows[0].chat_id])
      if(!chat.rowCount) throw chatsControllerAnswers.notFoundChat
      if(
        (chat.rows[0].user1_id === userId && chat.rows[0].is_first_user_sender)
        || 
        (chat.rows[0].user2_id !== userId && !chat.rows[0].is_first_user_sender)
        ) throw chatsControllerAnswers.notYourMessage
      await pool.query("UPDATE messages SET content = $1, edited = true WHERE id = $2", 
      [content, userId])
      res.send(generateSuccessResponse(messageId))
    } catch (err) {
      res.send(generateWrongResponse(`${err}`))
    }
  }
  static async deleteMessageByMessageId (req: Request<{messageId: string}>, res: Response<IResponse>) {
    try {
      if(!req.userId) throw forAllControllerAnswers.auth
      const {userId} = req
      const {messageId} = req.params
      const message = await pool.query("SELECT chat_id, id FROM messages WHERE id = $1",
      [messageId])
      if(!message.rowCount) throw chatsControllerAnswers.notFoundMessage
      const chat = await pool.query("SELECT user1_id, user2_id FROM chats WHERE id = $1", 
      [message.rows[0].chat_id])
      if(!chat.rowCount) throw chatsControllerAnswers.notFoundChat
      if(
        (chat.rows[0].user1_id === userId && chat.rows[0].is_first_user_sender)
        || 
        (chat.rows[0].user2_id !== userId && !chat.rows[0].is_first_user_sender)
        ) throw chatsControllerAnswers.notYourMessage
      await pool.query("DELETE FROM messages WHERE id = $1", 
      [messageId])
      res.send(generateSuccessResponse(messageId))
    } catch (err) {
      res.send(generateWrongResponse(`${err}`))
    }
  }
}