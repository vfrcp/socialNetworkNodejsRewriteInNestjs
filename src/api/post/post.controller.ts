import { Controller, Get } from "@nestjs/common";
import { PostService } from "./post.service";


@Controller("post") 
export class Post {
  constructor(private postService: PostService) {}

  @Get("/")
  test() {
    return "testPost"
  }
}