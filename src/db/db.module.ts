import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostComment, PostCommentReaction, PostCommentReplay } from "src/api/comments/comments.entity";
import { Post, PostReaction } from "src/api/post/post.entity";
import { BlockedUser, Subscriber, User } from "src/api/user/user.entity";
import { config } from "src/config";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "localhost",// process.env.POSTGRES_HOST,
      port: 5432, // Number(process.env.POSTGRES_PORT),
      username: "postgres", // process.env.POSTGRES_USERNAME,
      password: "1111",// process.env.POSTGRES_PASSWORD,
      database: "nestjs",// process.env.POSTGRES_DATABASE,
      entities: [Subscriber, BlockedUser, Post, PostReaction, User, PostComment, PostCommentReaction, PostCommentReplay],
      synchronize: true,
    })
  ]
})

export class OrmModule {}