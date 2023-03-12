import { Module } from "@nestjs/common";
import { UsersModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { OrmModule } from "src/db/db.module";
import { ChatModule } from "./chat/chat.module";
import { CommentModule } from "./comments/comment.module";

@Module({
  imports: [UsersModule, PostModule, ChatModule, CommentModule, OrmModule],
})
export class AppModule {}