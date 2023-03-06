import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { generateSuccessResponse, generateWrongResponse } from "src/helpers/response";
import { Repository } from "typeorm";
import { PostComment, PostCommentReaction, PostCommentReplay } from "./comments.entity";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(PostComment) private readonly postCommentRepository: Repository<PostComment>,
    @InjectRepository(PostCommentReplay) private readonly postCommentReplayRepository: Repository<PostCommentReplay>,
    @InjectRepository(PostCommentReaction) private readonly postCommentReactionRepository: Repository<PostCommentReaction>
  ) {}
  async create (userId: number, postId: number, content: string) {
    try {
      const newComment = this.postCommentRepository.create({user_id: userId, content, post_id: postId})
      await this.postCommentRepository.save(newComment)
      return generateSuccessResponse(newComment.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getByPostIdAndPage (postId: number, page: number) {
    try {
      const indexes = {
        start: page === 1 ? 0 : (page - 1) * 25,
        end: 25
      }
      const comments = await this.postCommentRepository.find({
        where: {post_id: postId},
        skip: indexes.start,
        take: indexes.end
      })
      if(!comments) throw "" // commentsControllerAnswers.notFoundOneComment
      return generateSuccessResponse(comments)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async editByCommentId (userId: number, commentId: number, content: string) {
    try {
      const comment = await this.postCommentRepository.findOneBy({id: commentId})
      if(!comment) throw "" // commentsControllerAnswers.notFoundOneComment
      if(comment.user_id !== userId) throw "" // commentsControllerAnswers.notYourComment
      comment.is_edited = true
      comment.content = content
      await this.postCommentRepository.update({id: commentId}, comment)
      return generateSuccessResponse(commentId)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    } 
  }
  async deleteByCommentId (userId: number, commentId: number) {
    try {
      const comment = await this.postCommentRepository.findOneBy({id: commentId})
      //const comment = await pool.query("SELECT user_id FROM post_comments WHERE id = $1", 
      //[commentId])
      if(!comment) throw "" // commentsControllerAnswers.notFoundOneComment
      if(comment.user_id !== userId) throw "" // commentsControllerAnswers.notYourComment
      await this.postCommentReplayRepository.delete({comment_id: commentId})
      await this.postCommentRepository.delete({id: commentId})
      return generateSuccessResponse(commentId)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async reactionByCommentId(userId: number, commentId: number, isPositive: boolean) {
    try {
      const reaction = await this.postCommentReactionRepository.findOneBy({id: commentId, user_id: userId})
      // const reaction = await pool.query("SELECT is_positive FROM post_comments_reactions WHERE id = $1 AND user_id = $2", 
      // [commentId, userId])
      if(reaction) {
        await this.postCommentReactionRepository.delete({id: commentId, user_id: userId})
      } else {
        const newPostCommentReaction = this.postCommentReactionRepository.create({user_id: userId, comment_id: commentId, is_positive: isPositive})
        await this.postCommentReactionRepository.save(newPostCommentReaction)
        isPositive?
          await pool.query("UPDATE post_comments SET likes = likes + 1 WHERE id = $1", [commentId]):
          await pool.query("UPDATE post_comments SET dislikes = dislikes - 1 WHERE id = $1", [commentId])
      }
      return generateSuccessResponse(null)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async replyByCommentId (userId: number ,commentId: number, content: string) {
    try {
      const postComment = await this.postCommentRepository.findOneBy({id: commentId})
      if(!postComment) throw ""
      const newReplay = this.postCommentReplayRepository.create({user_id: userId, content, comment_id: commentId})
      await this.postCommentReactionRepository.save(newReplay) 
      postComment.is_has_replays = true
      await this.postCommentRepository.update({id: commentId}, postComment)
      return generateSuccessResponse(newReplay.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async replayToAnotherReplayByCommentId(userId: number, commentId: number, anotherUsername: string, content: string) {
    try {
      const comment = await this.postCommentRepository.findOneBy({id: commentId})
      if(!comment) throw "" // commentsControllerAnswers.notFoundOneComment
      const modifiedContent = `@${anotherUsername}: ${content}`
      const newReplay = this.postCommentReplayRepository.create({user_id: userId, content: modifiedContent, comment_id: commentId})
      await this.postCommentReplayRepository.save(newReplay)
      return generateSuccessResponse(newReplay.id)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
  async getReplaysByCommentIdAndPage (commentId: number, page: number) {
    try {
      const comment = await this.postCommentRepository.findOneBy({id: commentId})
      if(!comment) throw "" // commentsControllerAnswers.notHasReplays
      const indexes = {
        start: page === 1? 0: (page -1) * 25,
        end: 25
      }
      const replays = await this.postCommentReplayRepository.find({
        where: {comment_id: commentId},
        skip: indexes.start,
        take: indexes.end
      })
      if(!replays[0]) throw "" // commentsControllerAnswers.notHasReplays
      return generateSuccessResponse(replays)
    } catch (err) {
      return generateWrongResponse(`${err}`)
    }
  }
}
