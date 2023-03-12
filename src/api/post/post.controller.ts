import { Controller, Get, Post, Patch, Delete } from "@nestjs/common";
import { PostService } from "./post.service";


@Controller("post") 
export class PostController {
  constructor(private postService: PostService) {}

  @Get("/getByPostId/:postId")
  getByPostId () {

  }

  @Get("/getBySearchAndPage/:search/:page")
  getBySearchAndPage () {

  }

  @Get("/getAllByUserIdAndPage/:userId/:page")
  getAllByUserIdAndPage () {
    
  } 

  @Post("/create")
  create () {
    
  }
  @Post("/toggleReactionByPostId")
  toggleReactionByPostId () {
    
  }
  
  @Patch("/editByPostId/:postId")
  editByPostId () {

  }

  @Delete("/deleteByPostId/:postId")
  deleteById () {

  }
}