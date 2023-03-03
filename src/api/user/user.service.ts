import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash as hashPassword, compare as comparePassword } from "bcrypt";
import { UserEditByIdDto, UserIdDto, UserLoginDto, UserRegisterDto } from "./user.dto";
import { generateSuccessResponse, generateWrongResponse } from "src/helpers/response";
import { BlockedUser, Subscriber, User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(BlockedUser) private readonly blockUserRepository: Repository<BlockedUser>,
    @InjectRepository(Subscriber) private readonly subscriberRepository: Repository<Subscriber>
  ) {}

  async register (dto: UserRegisterDto) {
    try {
      const {password, username} = dto
      if(!password || !username) throw "" // forAllControllerAnswers.nullPost
      const hashedPassword = await hashPassword(password, 10)
      // const newUser = await pool.query(
      // "INSERT INTO users (username, email, password) values($1, $2, $3) RETURNING *",
      // [username, email, hashedPassword])
      // return newUser.rows[0]
      const user = await this.userRepository.save({...dto, password: hashedPassword})
      return generateSuccessResponse(user, "success")
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async login (dto: UserLoginDto) {
    try {
      const {username, password} = dto
      if(!username || !password) throw "" // forAllControllerAnswers.nullPost  
      const user = await this.userRepository.findOneBy({username}) // pool.query(`SELECT id, password FROM users WHERE username = $1`, [username])
      if(!user) throw "" // usersControllerAnswers.notFoundOneUser
      const isPasswordEqual = await comparePassword(password, user.password) 
      if(!isPasswordEqual) throw "" // usersControllerAnswers.invalidPassword
      return generateSuccessResponse(user.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getByUserId (userId: number) {
    try {
      //const user = await pool.query("SELECT id, username, registration_date, about FROM users WHERE id = $1", [userId])
      const user = await this.userRepository.findOneBy({id: userId})
      if(!user) throw "" // usersControllerAnswers.notFoundOneUser
      return generateSuccessResponse(user)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getByPage (page: number) {
    try {
      const indexes = {
        start: page === 1? 0: (page -1) * 25,
        end: page * 25
      }
      // const users = await pool.query(`SELECT id, username FROM users OFFSET ${indexes.start} LIMIT ${indexes.end}`)
      const users = await this.userRepository.find()
      if(!users) throw "" // usersControllerAnswers.notFoundUsers
      return generateSuccessResponse(users)
    } catch (err) {
      return generateWrongResponse(`${err}`) 
    }
  }
  async getBySearchAndPage (page: number, search: string) {
    try {
      const indexes = {
        start: page === 1? 0: (page - 1) * 25,
        end: page * 25
      }
      //const users = await pool.query(`SELECT username, id FROM users WHERE LOWER(username) LIKE LOWER($1) OFFSET ${indexes.start} LIMIT ${indexes.end}`, 
      //[`%${search}%`])
      const users = await this.userRepository.findBy({username: `%${search}%`})
      if(!users) throw "" // usersControllerAnswers.notFoundUsers
      return generateSuccessResponse(users)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async editByUserId(userId: number, dto: UserEditByIdDto) {
    try {
      const {oldEmail, email, oldPassword, password, about} = dto
      if((!oldEmail || !email) && (!oldPassword || !password) && !about) throw "" // forAllControllerAnswers.nullEdit
      const user = await this.userRepository.findOneBy({id: userId})
      if(!user) throw "" // usersControllerAnswers.notFoundOneUser
      if(about) {
        user.about = about
      } if(email && oldEmail) {
        if(user.email !== oldEmail) throw "" // usersControllerAnswers.invalidEmail
        user.email = email
      } if(password && oldPassword) {
        const comparedPassword = await comparePassword(oldPassword, user.password)
        if(!comparedPassword) throw "" // usersControllerAnswers.invalidPassword
        const hashedNewPassword = await hashPassword(password, 10)
        user.password = hashedNewPassword
      }
      await this.userRepository.update({id: userId}, user)
      return generateSuccessResponse(userId)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async toggleBlock (userId: number, blockUserId: number) {
    try {
      const user = await this.userRepository.findOneBy({id: userId})
      if(!user) throw "" // usersControllerAnswers.notFoundOneUser
      const block = await this.blockUserRepository.findOneBy({user_id: userId, blocked_user_id: blockUserId})
      //const isSubscribeAlreadyExist = await pool.query("SELECT id FROM subscribers WHERE user_id = $1 AND subscriber_user_id = $2", 
      // [userId, toggleSubscribeUserId])
      //let subscribeId
      if(block) {
        await this.blockUserRepository.delete({id: block.id})
      } else {
        const newBlock = await this.blockUserRepository.save({user_id: userId, blocked_user_id: blockUserId})
        return generateSuccessResponse(newBlock.id)
      } 
      return generateSuccessResponse(block?.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getMyBlockedUsersByPage (userId: number, page: number) {
    try {
      const indexes = {
        start: page === 1 ? 0 : (page - 1) * 25,
        end: page * 25
      }
      // const blockedUsers = await pool.query(`SELECT * FROM blocked_users WHERE user_id= $1 OFFSET ${indexes.start} LIMIT ${indexes.end}`, 
      // [userId])
      const blockedUsers = await this.blockUserRepository.findBy({id: userId})
      if(!blockedUsers) throw "" // usersControllerAnswers.notFoundBlockedUsers
      return generateSuccessResponse(blockedUsers)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async deleteByUserId (userId: number) {
    try {
      await this.userRepository.delete({id: userId})
      return generateSuccessResponse(null,)//usersControllerAnswers.deleted)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async toggleSubscription (userId: number, subscriptionUserId: number) {
    try {
      const user = await this.userRepository.findOneBy({id: userId})
      if(!user) throw "" // usersControllerAnswers.notFoundOneUser
      const subscription = await this.subscriberRepository.findOneBy({user_id: userId, subscriber_user_id: subscriptionUserId})
      //const isSubscribeAlreadyExist = await pool.query("SELECT id FROM subscribers WHERE user_id = $1 AND subscriber_user_id = $2", 
      // [userId, toggleSubscribeUserId])
      //let subscribeId
      if(subscription) {
        await this.subscriberRepository.delete({id: subscription.id})
      } else {
        const newSubscription = await this.blockUserRepository.save({user_id: userId, subscriber_user_id: subscriptionUserId})
        return generateSuccessResponse(newSubscription.id)
      } 
      return generateSuccessResponse(subscription?.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getMySubscriptionsByPage (userId: number, page: number) {
    try {
      const indexes = {
        start: page === 1? 0 : (page - 1) * 25,
        end: page * 25
      }
      // const subscriptions = await pool.query(`SELECT * FROM subscribers WHERE user_id = $1 OFFSET ${indexes.start} LIMIT ${indexes.end}`, 
      // [userId])
      const subscriptions = await this.subscriberRepository.findBy({subscriber_user_id: userId})
      // if(!subscriptions.rowCount) throw usersControllerAnswers.notFoundSubscriptions 
      return generateSuccessResponse(subscriptions)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getMySubscribersByPage (userId: number, page: number) {
    try {
      const indexes = {
        start: page === 1? 0 : (page - 1) * 25,
        end: page * 25
      }
      const subscribers = await this.subscriberRepository.findBy({user_id: userId})
      return generateSuccessResponse(subscribers)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
}