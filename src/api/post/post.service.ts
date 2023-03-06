import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, PostReaction } from "./post.entity";
import { Repository } from "typeorm";
import { generateSuccessResponse, generateWrongResponse } from "src/helpers/response";
import { PostComment } from "../comments/comments.entity";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostComment) private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(PostReaction) private readonly postReactionRepository: Repository<PostReaction>
  ) {}

  async create (userId: number, title: string, content: string) {
    try {
      // if(!title || !content) throw "" // forAllControllerAnswers.nullPost
    
      const newPost = this.postRepository.create({user_id: userId, title, content})
      await this.postRepository.save(newPost)
      return generateSuccessResponse(newPost.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async editById (userId: number, postId: number, title?: string, content?: string) {
    try {
      if(!title && !content) throw "" // forAllControllerAnswers.nullEdit
      const post = await this.postRepository.findOneBy({id: postId})
      if(!post) throw "" // postsControllerAnswers.notFoundOnePost
      if(post.user_id !== userId) throw "" // postsControllerAnswers.notYourPost
      if(title) {
        post.title = title
      } if (content) {
        post.content = content
      }
      await this.postRepository.update({id: postId}, post)
      return generateSuccessResponse(postId)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async deleteById (userId: number, postId: number) {
    try {
      const post = await this.postRepository.findOneBy({id: postId})
      if(!post) throw "" // postsControllerAnswers.notFoundOnePost
      if(post.user_id !== userId) throw "" // postsControllerAnswers.notYourPost

      //TODO: Тут позже глянуть все ли связанное с постом удалилось
      await this.postReactionRepository.delete({post_id: postId})
      await this.postCommentRepository.delete({id: postId})
      await this.postRepository.delete({id: postId})
      return generateSuccessResponse(postId)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async toggleReaction(userId: number, postId: number, isPositive: boolean) {
    try {
      let reactionId
      const reaction = await this.postReactionRepository.findOneBy({user_id: userId, post_id: postId})
      if(reaction) {
        await this.postReactionRepository.delete({post_id: postId, user_id: userId})
        reactionId = reaction
        return generateSuccessResponse(reaction.id)
      } else {
        const newReaction = this.postReactionRepository.create({user_id: userId, post_id: postId, is_positive: isPositive})
        //TODO: Тут я походу в прошлом сделал лютую ошибку, забыл указать where. Потом устранить и посмотреть куда реакции приписывать
        // isPositive? 
          // await :
          // await pool.query("UPDATE post_comments SET dislikes = dislikes - 1")
          return generateSuccessResponse(newReaction.id)
      }
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  static async getById (postId: number) {
    // try {
      // const post = await pool.query(`
      // SELECT *, (SELECT COUNT(*) FROM post_reactions WHERE post_id = $1 AND isPositive = true) AS likes,
      // (SELECT COUNT(*) FROM post_reactions WHERE post_id = $1 AND isPositive = false) AS dislikes
      // FROM posts WHERE id = $1
      // `,
      // [postId])
    //   if(!post.rowCount) throw "" // postsControllerAnswers.notFoundOnePost
    //   post.rows[0].views++
    //   post.rows[0].likes = +post.rows[0].likes
    //   post.rows[0].dislikes = +post.rows[0].dislikes
    //   await pool.query("UPDATE posts SET views = $1 WHERE id = $2",
    //   [post.rows[0].views, postId])
    //   res.send(generateSuccessResponse(post.rows[0]))
    // } catch (err) {
    //   res.send(generateWrongResponse(`${err}`))
    // }
  }
  async getAllByUserIdAndPage (userId: number, page: number) {
    try {
      const indexes = {
        start: page === 1? 0: (page - 1) * 25,
        end: 25
      }
      //const posts = await pool.query(`SELECT * FROM posts WHERE user_id = $1 OFFSET ${indexes.start} LIMIT ${indexes.end}`,
      //[userId])
      const posts = await this.postRepository.find({
        where: {user_id: userId},
        skip: indexes.start,
        take: indexes.end
      })
      if(!posts[0]) throw "" // postsControllerAnswers.notFoundPosts
      return generateSuccessResponse(posts)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getBySearchAndPage (search: string, page: number) {
    try {
      const indexes = {
        start: page === 1 ? 0: (page - 1) * 25,
        end: 25
      }
      // const posts = await pool.query(`SELECT * FROM posts WHERE LOWER(title) LIKE LOWER($1) OFFSET ${indexes.start} LIMIT ${indexes.end}`, 
      // [`%${search}%`])
      const posts = await this.postRepository.find({
        where: {title: `%${search}%`},
        skip: indexes.start,
        take: indexes.end
      }) 
      if(!posts[0]) throw "" // postsControllerAnswers.notFoundPosts
      return generateSuccessResponse(posts)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
}