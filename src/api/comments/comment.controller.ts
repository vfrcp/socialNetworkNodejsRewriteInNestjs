import { Controller, Get, Post, Patch, Delete } from "@nestjs/common";

@Controller("/comment") 
export class CommentController {
  @Get("/getByPostIdAndPage/:postId/:page") 
  getByPostIdAndPage () {

  }
  @Get("/getReplaysByIdAndPage/:commentId/:page") 
  getReplaysByCommentIdAndPage () {

  }
  @Post("/reactionByCommentId/:commentId") 
  reactionByCommentId () {

  }
  @Post("/createByPostId/:postId")
  createByPostId () {

  }

  @Post("/replayByCommentId/:commentId")
  replyByCommentId () {

  }

  @Post("/replayToAnotherReplayByCommentId/:commentId")
  replayToAnotherReplayByCommentId () {

  }

  @Patch("/editByCommentId/:commentId")
  editByCommentId () {

  }

  @Delete("/deleteByCommentId/:commentId")
  deleteByCommentId () {

  }
}