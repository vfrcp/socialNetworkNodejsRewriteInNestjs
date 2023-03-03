import { Module } from "@nestjs/common";
import { UsersModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { OrmModule } from "src/db/db.module";

@Module({
  imports: [UsersModule, PostModule, OrmModule],
})

export class AppModule {}